import { NextFunction, Request, Response } from "express";
import Lead from "../models/Lead.model";

export const requireRole = (...roles: Array<"admin" | "sales">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    next();
  };
};

export const requireOwnershipOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role === "admin") {
      next();
      return;
    }

    const lead = await Lead.findById(req.params.id).select("createdBy assignedTo");

    if (!lead) {
      res.status(404).json({
        message: "Lead not found",
      });
      return;
    }

    const userId = req.user?._id.toString();
    const createdBy = lead.createdBy?.toString();
    const assignedTo = lead.assignedTo?.toString();

    if (userId && (createdBy === userId || assignedTo === userId)) {
      next();
      return;
    }

    res.status(403).json({
      message: "Forbidden",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const adminOnly = requireRole("admin");
