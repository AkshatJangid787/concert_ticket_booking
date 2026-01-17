import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET!;

export const signToken = (payload: { adminId: string }) => {
    return jwt.sign(payload, jwt_secret, { expiresIn: "7d" });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, jwt_secret) as unknown as { adminId: string };
}
