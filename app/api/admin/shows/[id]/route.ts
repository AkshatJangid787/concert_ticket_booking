import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await requireAdmin(req);

        const { id } = await params;

        const { title, description, showDate, price, totalSeats, liveEnabled, liveLink } = await req.json();

        if (!title || !showDate || !price) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const updatedShow = await prisma.show.update({
            where: { id },
            data: {
                title,
                description: description || null,
                showDate: new Date(showDate),
                price,
                totalSeats: totalSeats ?? null,
                liveEnabled: liveEnabled,
                liveLink: liveLink,
            },
        });

        return NextResponse.json({
            success: true,
            show: updatedShow,
        });
    } catch (error: any) {
        console.error("Error in PUT /api/admin/shows/[id]:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            success: false,
            message: "Server Error",
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        await requireAdmin(req);

        const { id } = await params;

        const deletedShow = await prisma.show.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            show: deletedShow,
        });
    } catch (error: any) {
        console.error("Error in DELETE /api/admin/shows/[id]:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            success: false,
            message: "Server Error",
        }, { status: 500 });
    }
}