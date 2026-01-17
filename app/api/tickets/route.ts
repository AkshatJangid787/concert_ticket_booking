import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { showId, name, email, phone } = await req.json();

        if (!showId || !name || !email || !phone) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const show = await prisma.show.findUnique({ where: { id: showId }, include: { tickets: true } });

        if (!show) {
            return NextResponse.json({ success: false, message: "Show not found" }, { status: 404 });
        }

        if (show.totalSeats !== null) {
            const sold = show.tickets.length;

            if (sold >= show.totalSeats) {
                return NextResponse.json({ success: false, message: "Show is fully booked" }, { status: 400 });
            }
        }

        const ticket = await prisma.ticket.create({
            data: {
                showId,
                name,
                email,
                phone,
            }
        })

        return NextResponse.json({ success: true, ticketId: ticket.id, message: "Ticket Booked, payment pending" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
