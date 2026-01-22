import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let userId: string;
        try {
            const decoded = verifyToken(token);
            userId = decoded.userId;
        } catch (e) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        const tickets = await prisma.ticket.findMany({
            where: {
                userId,
                status: "CONFIRMED" // Only show confirmed tickets? Or all? User said "shows history as tickets"
            },
            include: {
                show: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ success: true, tickets });

    } catch (error) {
        console.error("Fetch tickets error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
