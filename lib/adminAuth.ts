import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const requireAdmin = async (req: NextRequest) => {
    const cookieStore = req.cookies;
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = verifyToken(token);

    if (decoded.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return decoded.userId;
};
