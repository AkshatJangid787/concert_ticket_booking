
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    console.log("DEBUG /me: Cookie found?", !!token); // Log if cookie exists

    // Helper to clear cookie and return unauthenticated
    const clearCookieAndReturn = () => {
        console.log("DEBUG /me: Clearing cookie because something was invalid.");
        cookieStore.delete("auth_token");
        return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    };

    try {
        if (!token) {
            console.log("DEBUG /me: No token found in request.");
            return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            // Token is invalid/expired -> clear it so middleware doesn't block /login
            console.error("DEBUG /me: Token verification failed:", err);
            return clearCookieAndReturn();
        }

        if (!decoded || !decoded.userId) {
            console.log("DEBUG /me: Token decoded but no userId found:", decoded);
            return clearCookieAndReturn();
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!user) {
            // User deleted from DB but has valid token -> clear it
            console.log("DEBUG /me: Token valid but user not found in DB (ID: " + decoded.userId + ")");
            return clearCookieAndReturn();
        }

        return NextResponse.json({
            authenticated: true,
            user
        }, { status: 200 });

    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ authenticated: false, user: null }, { status: 200 }); // Fail gracefully
    }
}
