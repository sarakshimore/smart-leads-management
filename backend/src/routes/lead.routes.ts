import express from "express";

import {
  assignLeadToSales,
  createLead,
  deleteLead,
  exportLeadsCSV,
  getLeads,
  getSingleLead,
  updateLead,
} from "../controllers/lead.controller";

import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/role.middleware";

const router = express.Router();

router.route("/").get(protect, getLeads).post(protect, adminOnly, createLead);
router.get("/export/csv", protect, exportLeadsCSV);
router.patch("/:id/assign", protect, adminOnly, assignLeadToSales);
router
  .route("/:id")
  .get(protect, getSingleLead)
  .put(protect, adminOnly, updateLead)
  .delete(protect, adminOnly, deleteLead);

export default router;
