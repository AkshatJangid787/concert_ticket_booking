import { prisma } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/jwt";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email and password are required"
            }, { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await comparePassword(password, admin.password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = signToken({ adminId: admin.id });

        const res = NextResponse.json({ success: true, message: "Login successful", });

        res.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return res;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Server Error"
        }, { status: 500 }
        );
    }
}
