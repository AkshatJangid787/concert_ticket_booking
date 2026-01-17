import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const requireAdmin = async (req: NextRequest) => {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = verifyToken(token);
    return decoded.adminId;
};
