import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
    try {
        await requireAdmin(req);

        const { title, description, showDate, price, totalSeats, liveEnabled, liveLink } = await req.json();

        if (!title || !showDate || !price) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const show = await prisma.show.create({
            data: {
                title,
                description: description || null,
                showDate: new Date(showDate),
                price,
                totalSeats: totalSeats ?? null,
                liveEnabled: liveEnabled || false,
                liveLink: liveLink || null,
            },
        });

        return NextResponse.json({ success: true, show, });
    } catch (error: any) {
        console.error("Error in POST /api/admin/shows:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);

        const shows = await prisma.show.findMany({
            orderBy: {
                showDate: "asc",
            },
            include: {
                _count: {
                    select: {
                        tickets: {
                            where: { status: "CONFIRMED" }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            shows,
        });
    } catch (error: any) {
        console.error("Error in GET /api/admin/shows:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}