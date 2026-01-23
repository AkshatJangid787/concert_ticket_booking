import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 1. Check Env Vars availability (Don't reveal values)
        const envStatus = {
            DATABASE_URL: !!process.env.DATABASE_URL,
            JWT_SECRET: !!process.env.JWT_SECRET,
            NODE_ENV: process.env.NODE_ENV,
        };

        // 2. Try to connect to DB
        const userCount = await prisma.user.count();

        return NextResponse.json({
            status: "OK",
            message: "Server is healthy and connected to DB",
            database_connected: true,
            user_count: userCount,
            env_vars: envStatus
        });

    } catch (error) {
        console.error("Health Check Failed:", error);
        return NextResponse.json({
            status: "ERROR",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown",
            env_vars: {
                DATABASE_URL: !!process.env.DATABASE_URL,
            }
        }, { status: 500 });
    }
}
