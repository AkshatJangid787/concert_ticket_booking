import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const shows = await prisma.show.findMany({
            where: {
                showDate: {
                    gte: new Date(), // sirf upcoming shows
                },
            },
            orderBy: {
                showDate: "asc",
            },
            select: {
                id: true,
                title: true,
                description: true,
                showDate: true,
                price: true,
            },
        });

        return NextResponse.json({
            success: true,
            shows,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch shows" },
            { status: 500 }
        );
    }
}
