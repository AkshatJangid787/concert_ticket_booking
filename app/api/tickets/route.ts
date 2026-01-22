import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized: Please login to book tickets" }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = verifyToken(token);
            userId = decoded.userId;

            if (decoded.role === "ADMIN") {
                return NextResponse.json({ success: false, message: "Admins cannot book tickets." }, { status: 403 });
            }
        } catch (e) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        const { showId } = await req.json();

        if (!showId) {
            return NextResponse.json({ success: false, message: "Show ID is required" }, { status: 400 });
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

            // 4. Check if User already has a CONFIRMED ticket for this show
            const existingTicket = await tx.ticket.findFirst({
                where: {
                    showId,
                    userId,
                    status: "CONFIRMED"
                }
            });

            if (existingTicket) {
                throw new Error("You have already booked a ticket for this show.");
            }

            // 3. Create the Ticket inside the Transaction
            const ticket = await tx.ticket.create({
                data: {
                    showId,
                    userId, // Link ticket to the logged-in user
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
