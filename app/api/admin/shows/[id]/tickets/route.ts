import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = "force-dynamic";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: NextRequest, { params }: Params) {
    try {
        await requireAdmin(req);

        const { id } = await params;

        const tickets = await prisma.ticket.findMany({
            where: {
                showId: id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ success: true, tickets });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}