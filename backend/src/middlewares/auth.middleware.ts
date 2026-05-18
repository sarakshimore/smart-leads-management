import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "sales";
  id?: string; // legacy fallback for older tokens
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const resolvedUserId = decoded.userId || decoded.id;

    if (!resolvedUserId) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user = await User.findById(resolvedUserId).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "User is inactive" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
