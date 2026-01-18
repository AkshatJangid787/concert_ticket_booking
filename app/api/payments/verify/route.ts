import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { orderId, paymentId, signature, ticketId } = await req.json();

        if (!orderId || !paymentId || !signature || !ticketId) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const text = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(text)
            .digest("hex");

        if (expectedSignature === signature) {
            // Payment is legitimate
            await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    status: "CONFIRMED",
                    paymentId: paymentId
                }
            });

            return NextResponse.json({ success: true, message: "Payment Verified" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
