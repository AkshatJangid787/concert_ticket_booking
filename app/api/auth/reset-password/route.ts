import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, otp, newPassword } = resetPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Secure: Don't leak user existence?
            // "Invalid Request" is good enough.
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        if (!user.otp || user.otp !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            return NextResponse.json({ message: "OTP Expired" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpires: null,
                isVerified: true
            }
        });

        // Optional: Auto login?
        // For now, just return success
        return NextResponse.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message ||
                (error as any).issues?.[0]?.message ||
                "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }
        console.error("Reset Password Error:", error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
