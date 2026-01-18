import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";


export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { ticketID } = await req.json();

        if (!ticketID) {
            return NextResponse.json({ success: false, message: "ticketID is required" }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: {
                id: ticketID
            },
            include: {
                show: true
            },
        });

        if (!ticket) {
            return NextResponse.json({ success: false, message: "ticket not found" }, { status: 404 });
        }

        if (ticket.status === "CONFIRMED") {
            return NextResponse.json({ success: false, message: "ticket is already confirmed" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: ticket.show.price * 100, // rupees ko paise mai convert krne k liye
            currency: "INR",
            receipt: ticket.id,
        })

        return NextResponse.json({ success: true, orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
    }
}