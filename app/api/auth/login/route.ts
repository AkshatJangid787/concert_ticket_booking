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
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        // Validation passed


        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ message: "Account verification pending.", requireVerification: true }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        const token = signToken({ userId: user.id, role: user.role });

        (await cookies()).set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

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
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message ||
                (error as any).issues?.[0]?.message ||
                "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }
        console.error("Login error:", error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
