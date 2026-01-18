import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { showId, name, email, phone } = await req.json();

        if (!showId || !name || !email || !phone) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        return await prisma.$transaction(async (tx) => {
            // 1. Cleanup: Delete PENDING tickets older than 10 minutes
            // This frees up seats from people who abandoned the payment page
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            await tx.ticket.deleteMany({
                where: {
                    status: "PENDING",
                    createdAt: { lt: tenMinutesAgo }
                }
            });

            // 2. Fetch Show and Count ALL Valid Tickets (Confirmed + Pending Recent)
            const show = await tx.show.findUnique({
                where: { id: showId },
                include: { tickets: true }
            });

            if (!show) {
                throw new Error("Show not found");
            }

            if (show.totalSeats !== null) {
                // We count BOTH Confirmed AND Pending tickets to reserve the seat.
                // Because we just deleted old Pending tickets, these are all active/recent attempts.
                const sold = show.tickets.length;

                if (sold >= show.totalSeats) {
                    throw new Error("Show is fully booked");
                }
            }

            // 3. Create the Ticket inside the Transaction
            const ticket = await tx.ticket.create({
                data: {
                    showId,
                    name,
                    email,
                    phone,
                    status: "PENDING"
                }
            });

            return NextResponse.json({ success: true, ticketId: ticket.id, message: "Ticket Reserved (10 mins to pay)" }, { status: 201 });
        },
            {
                // SAFETY: Use Serializable isolation to prevent two people checking "sold < total" at the exact same time
                // If conflict happens, one will fail and we catch the error below.
                isolationLevel: 'Serializable',
                maxWait: 5000,
                timeout: 10000
            });

    } catch (error: any) {
        console.error("Booking Error:", error);

        const message = error.message === "Show is fully booked"
            ? "Show is fully booked"
            : error.message === "Show not found"
                ? "Show not found"
                : "Booking failed, please try again (System Busy)";

        const status = message === "Show is fully booked" ? 400 : 500;

        return NextResponse.json({ success: false, message }, { status });
    }
}
