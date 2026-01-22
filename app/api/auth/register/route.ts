import { prisma } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const limitResult = checkRateLimit(ip, 3, 10 * 60 * 1000); // 3 attempts per 10 mins

        if (!limitResult.success) {
            return NextResponse.json(
                { message: `Too many attempts. Please wait ${limitResult.resetIn} seconds.` },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, email, password } = registerSchema.parse(body);

        // Input is now validated and safe


        const exists = await prisma.user.findUnique({
            where: { email }
        });

        if (exists && exists.isVerified) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        if (exists && !exists.isVerified) {
            // User exists but stuck in unverified state -> Overwrite/Reset them
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
            // New User
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    isVerified: false,
                    otp,
                    otpExpires
                }
            });
        }

        // Send Email
        const emailSent = await sendEmail(email, "Verify Your Identity - Ashish Soni Live", `
        <div style="font-family: monospace; padding: 20px; border: 2px solid black; max-width: 500px;">
            <h1 style="text-transform: uppercase;">Verify Identity</h1>
            <p>Your Access Code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; background: #eee; display: inline-block; padding: 10px;">${otp}</h2>
            <p>Code expires in 10 minutes.</p>
        </div>
    `);

        if (!emailSent) {
            // If email fails, we should NOT create the account state where they can't verify.
            // Delete the user we just created.
            await prisma.user.delete({ where: { email } });
            return NextResponse.json({ success: false, message: "Failed to send Verification Email. Please check the email address." }, { status: 500 });
        }

        return NextResponse.json({ success: true, requireVerification: true, email });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message ||
                (error as any).issues?.[0]?.message ||
                "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }
        console.error("Register Error:", error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}