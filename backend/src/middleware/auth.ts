import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
  profileId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "secret") as { userId: number; profileId: number };
    req.userId = decoded.userId;
    req.profileId = decoded.profileId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
