import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);

        // 1. Total Earnings (Sum of price of CONFIRMED tickets)
        // Note: Prisma aggregate allows summing fields
        // But price is on the SHOW table, not the TICKET table. 
        // We need to join. Prisma doesn't do deep sum easily without raw query or fetching.
        // Let's fetch all confirmed tickets with their show price.

        const confirmedTickets = await prisma.ticket.findMany({
            where: { status: "CONFIRMED" },
            include: { show: { select: { price: true } } }
        });

        const totalRevenue = confirmedTickets.reduce((sum, ticket) => sum + ticket.show.price, 0);
        const totalTicketsSold = confirmedTickets.length;

        // 2. Recent Sales (Last 5)
        const recentSales = await prisma.ticket.findMany({
            where: { status: "CONFIRMED" },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: { select: { name: true, email: true } },
                show: { select: { title: true, price: true } }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                revenue: totalRevenue,
                ticketsSold: totalTicketsSold,
                recentSales
            }
        });

    } catch (error) {
        console.error("Stats Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}
