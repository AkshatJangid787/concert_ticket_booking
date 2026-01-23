import { prisma } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // 1. Get Data from Request
        const body = await req.json();

        // 2. Validate Input (Email format, etc.)
        const { email, password } = loginSchema.parse(body);

        // 3. Find User in Database
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 4. Verify User Exists
        if (!user) {
            // We return a generic error to not reveal if email exists or not (Security Best Practice)
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // 5. Check if Account is Verified
        if (!user.isVerified) {
            return NextResponse.json(
                { message: "Account verification pending.", requireVerification: true },
                { status: 403 }
            );
        }

        // 6. Check Password
        // We compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // 7. Create Session (JWT Token)
        const token = signToken({ userId: user.id, role: user.role });

        // 8. Set Cookie
        // This makes the browser remember the user is logged in
        (await cookies()).set("auth_token", token, {
            httpOnly: true, // JavaScript cannot access this cookie (Security)
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "strict", // Protects against CSRF attacks
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        // 9. Return Success & User Info
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        // Handle Validation Errors
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message || "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }

        // Handle Server Errors
        console.error("Login error:", error);

        // SECURITY: Never return raw error details in production to prevent leaking sensitive info.
        return NextResponse.json({
            message: "Something went wrong. Please try again later.",
        }, { status: 500 });
    }
}
