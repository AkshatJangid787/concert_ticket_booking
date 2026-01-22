import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const limitResult = checkRateLimit(ip, 3, 10 * 60 * 1000); // 3 attempts per 10 mins

        if (!limitResult.success) {
            return NextResponse.json(
                { message: `Too many attempts. Please wait ${limitResult.resetIn} seconds.`, remaining: 0 },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email } = schema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "User already verified" }, { status: 400 });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpires }
        });

        await sendEmail(email, "Verify Your Identity - Ashish Soni Live", `
        <div style="font-family: monospace; padding: 20px; border: 2px solid black; max-width: 500px;">
            <h1 style="text-transform: uppercase;">Verify Identity</h1>
            <p>Your Access Code is:</p>
            <h2 style="font-size: 32px; letter-spacing: 5px; background: #eee; display: inline-block; padding: 10px;">${otp}</h2>
            <p>Code expires in 10 minutes.</p>
        </div>
    `);

        return NextResponse.json({
            success: true,
            message: "OTP resent successfully",
            remaining: limitResult.remaining
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = (error as any).errors?.[0]?.message ||
                (error as any).issues?.[0]?.message ||
                "Invalid input";
            return NextResponse.json({ message }, { status: 400 });
        }
        console.error("Resend OTP Error:", error);
        return NextResponse.json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
