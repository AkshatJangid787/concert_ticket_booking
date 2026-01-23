import { prisma } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifySchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, otp } = verifySchema.parse(body);

        // Validation passed


        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 }); // Or just login
        }

        if (!user.otp || user.otp !== otp) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            return NextResponse.json({ message: "OTP Expired" }, { status: 400 });
        }

        // Success
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otp: null,
                otpExpires: null
            }
        });

        // Login the user
        const token = signToken({ userId: user.id, role: user.role });

        (await cookies()).set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message ||
                (error as any).issues?.[0]?.message ||
                "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }
        console.error("Verify Error:", error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
