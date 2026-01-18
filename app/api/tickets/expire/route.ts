import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { ticketId } = await req.json();

        if (!ticketId) {
            return NextResponse.json({ success: false, message: "Ticket ID required" }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        });

        if (ticket && ticket.status === "PENDING") {
            await prisma.ticket.delete({
                where: { id: ticketId }
            });
            return NextResponse.json({ success: true, message: "Pending ticket expired/deleted" });
        }

        return NextResponse.json({ success: false, message: "Ticket not found or already confirmed" });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to expire ticket" }, { status: 500 });
    }
}
