import { Request, Response } from "express";
import { Parser } from "json2csv";
import Lead from "../models/Lead.model";
import User from "../models/User.model";

type LeadQuery = {
  status?: string;
  source?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
};

const getAdminTeamUserIds = async (adminId: string) => {
  const salesUsers = await User.find({
    role: "sales",
    createdByAdmin: adminId,
  })
    .select("_id")
    .lean();

  return [adminId, ...salesUsers.map((user) => user._id.toString())];
};

const buildAccessScope = async (req: Request): Promise<Record<string, unknown>> => {
  const userId = req.user?._id.toString();

  if (!userId) {
    return { _id: null };
  }

  if (req.user?.role === "admin") {
    const teamUserIds = await getAdminTeamUserIds(userId);
    return {
      createdBy: { $in: teamUserIds },
    };
  }

  return {
    assignedTo: req.user?._id,
  };
};

const buildLeadFilters = (req: Request): LeadQuery => {
  const query: LeadQuery = {};
  const search = req.query.search as string;
  const status = req.query.status as string;
  const source = req.query.source as string;

  if (status) {
    query.status = status;
  }

  if (source) {
    query.source = source;
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return query;
};

export const createLead = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const requestedPage = Number(req.query.page) || 1;
    const limit = 10;
    const sort = req.query.sort as string;
    const filters = buildLeadFilters(req);
    const accessScope = await buildAccessScope(req);

    const scopedQuery: Record<string, unknown> = {
      $and: [filters as Record<string, unknown>, accessScope],
    };

    const total = await Lead.countDocuments(scopedQuery);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
    const skip = (currentPage - 1) * limit;
    const sortOption: Record<string, 1 | -1> =
      sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const leads = await Lead.find(scopedQuery).sort(sortOption).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        currentPage,
        totalPages,
        totalRecords: total,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getSingleLead = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const accessScope = await buildAccessScope(req);
    const lead = await Lead.findOne({
      $and: [{ _id: req.params.id }, accessScope],
    });

    if (!lead) {
      res.status(404).json({
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const updates = { ...req.body } as Record<string, unknown>;
    delete updates.createdBy;
    delete updates.assignedTo;

    const accessScope = await buildAccessScope(req);
    const lead = await Lead.findOneAndUpdate(
      {
        $and: [{ _id: req.params.id }, accessScope],
      },
      updates,
      { new: true }
    );

    if (!lead) {
      res.status(404).json({
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const assignLeadToSales = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const adminId = req.user?._id.toString();
    const { salesUserId } = req.body as { salesUserId?: string };

    if (!adminId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!salesUserId) {
      res.status(400).json({
        message: "salesUserId is required",
      });
      return;
    }

    const salesUser = await User.findOne({
      _id: salesUserId,
      role: "sales",
      createdByAdmin: adminId,
      isActive: true,
    });

    if (!salesUser) {
      res.status(400).json({
        message: "Invalid sales user for this admin",
      });
      return;
    }

    const teamUserIds = await getAdminTeamUserIds(adminId);
    const lead = await Lead.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: { $in: teamUserIds },
      },
      {
        assignedTo: salesUser._id,
      },
      {
        new: true,
      }
    );

    if (!lead) {
      res.status(404).json({
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const accessScope = await buildAccessScope(req);
    const lead = await Lead.findOne({
      $and: [{ _id: req.params.id }, accessScope],
    });

    if (!lead) {
      res.status(404).json({
        message: "Lead not found",
      });
      return;
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const exportLeadsCSV = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const scopedQuery = await buildAccessScope(req);
    const leads = await Lead.find(scopedQuery);

    const fields = ["name", "email", "status", "source", "createdAt"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      message: "CSV export failed",
    });
  }
};
