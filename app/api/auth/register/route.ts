import { prisma } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateVerificationEmailHtml } from "@/lib/email-templates";

// This tells Next.js to always run this route dynamically (not cached)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // 1. Security Check: Rate Limiting
        // We check if this IP address has made too many requests recently.
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const limitResult = checkRateLimit(ip, 3, 10 * 60 * 1000); // Allow 3 attempts every 10 minutes

        if (!limitResult.success) {
            return NextResponse.json(
                { message: `Too many attempts. Please wait ${limitResult.resetIn} seconds.` },
                { status: 429 }
            );
        }

        // 2. Parsed & Validate Input
        const body = await req.json();
        // validationSchema.parse(body) will throw an error if data is invalid
        const { name, email, password } = registerSchema.parse(body);

        // 3. Check if user already exists
        const exists = await prisma.user.findUnique({
            where: { email }
        });

        // If user is already verified, we can't register them again.
        if (exists && exists.isVerified) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // 4. Secure the Password
        // Never store plain text passwords! We hash them using bcrypt.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Generate One-Time Password (OTP) for Verification
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit number
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

        // 6. Save User to Database
        if (exists && !exists.isVerified) {
            // If user exists but isn't verified, we update their details and new OTP
            await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    otp,
                    otpExpires
                }
            });
        } else {
            // Create a brand new user
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword, // Storing the HASHED password
                    isVerified: false,        // User must verify email first
                    otp,
                    otpExpires
                }
            });
        }

        // 7. Send Verification Email
        const emailHtml = generateVerificationEmailHtml(otp);
        const emailSent = await sendEmail(email, "Verify Your Identity - Ashish Soni Live", emailHtml);

        if (!emailSent) {
            // If email fails to send, we should delete the unverified user so they can try again.
            await prisma.user.delete({ where: { email } });
            return NextResponse.json({ success: false, message: "Failed to send Verification Email. Please check the email address." }, { status: 500 });
        }

        // 8. Success Response
        return NextResponse.json({ success: true, requireVerification: true, email });

    } catch (error) {
        // Handle Validation Errors specifically
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message || "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }

        // Handle all other server errors
        console.error("Register Error:", error);

        // SECURITY: Never return the raw error message to the user in production.
        return NextResponse.json({
            message: "Something went wrong. Please try again later.",
            // In development, we can still show the error for debugging purposes if needed, 
            // but for this "production-ready" code, we hide it completely from the response body.
        }, { status: 500 });
    }
}