import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.model";

const USERS_LIMIT = 10;

export const createSalesUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email, and password are required",
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "sales",
      isActive: true,
      createdByAdmin: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestedPage = Number(req.query.page) || 1;
    const search = (req.query.search as string) || "";
    const page = Math.max(requestedPage, 1);
    const skip = (page - 1) * USERS_LIMIT;

    const query: Record<string, unknown> = {
      role: "sales",
      createdByAdmin: req.user?._id,
    };

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalRecords / USERS_LIMIT));
    const currentPage = Math.min(page, totalPages);
    const recalculatedSkip = (currentPage - 1) * USERS_LIMIT;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(recalculatedSkip)
      .limit(USERS_LIMIT);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage,
        totalPages,
        totalRecords,
        limit: USERS_LIMIT,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, isActive, password } = req.body as {
      name?: string;
      email?: string;
      isActive?: boolean;
      password?: string;
    };

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    if (user.role !== "sales") {
      res.status(403).json({
        message: "Only sales users can be modified via this endpoint",
      });
      return;
    }

    if (user.createdByAdmin?.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        message: "You can only modify your own sales users",
      });
      return;
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (typeof email === "string" && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const duplicate = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (duplicate) {
        res.status(400).json({
          message: "Email already in use",
        });
        return;
      }

      user.email = normalizedEmail;
    }

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    if (typeof password === "string" && password.trim().length > 0) {
      user.password = await bcrypt.hash(password.trim(), 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    if (user.role !== "sales") {
      res.status(403).json({
        message: "Only sales users can be deactivated via this endpoint",
      });
      return;
    }

    if (user.createdByAdmin?.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        message: "You can only deactivate your own sales users",
      });
      return;
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
