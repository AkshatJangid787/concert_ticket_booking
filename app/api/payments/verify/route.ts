import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { generateTicketEmailHtml } from "@/lib/email-templates";

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
            const updatedTicket = await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    status: "CONFIRMED",
                    paymentId: paymentId
                },
                include: {
                    user: true,
                    show: true
                }
            });

            // Send Confirmation Email
            try {
                const html = generateTicketEmailHtml(updatedTicket, updatedTicket.user, updatedTicket.show);
                await sendEmail(updatedTicket.user.email, "Your Ticket - Ashish Soni Live", html);
                console.log(`Ticket email sent to ${updatedTicket.user.email}`);
            } catch (emailErr) {
                console.error("Failed to send ticket email:", emailErr);
                // Don't fail the verification if email fails, just log it.
            }

            return NextResponse.json({ success: true, message: "Payment Verified" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid Signature" }, { status: 400 });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
