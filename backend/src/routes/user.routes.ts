import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  createSalesUser,
  deactivateUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.route("/").post(createSalesUser).get(getUsers);
router.route("/:id").put(updateUser).delete(deactivateUser);

export default router;
