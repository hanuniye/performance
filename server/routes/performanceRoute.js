import express from "express";
import {
  addPerformanceReview,
  getPerformanceReviews,
  getSinglePerformanceReview,
} from "../controller/performanceController.js";
import { Role } from "@prisma/client";
import roles from "../middleware/rolesMiddleware.js";

const router = express.Router();

router.get(
  "/",
  roles([Role.HR, Role.EMPLOYEE, Role.SUPERVISOR]),
  getPerformanceReviews
);
router.post("/", roles([Role.EMPLOYEE]), addPerformanceReview);
router.get(
  "/:id",
  roles([Role.HR, Role.EMPLOYEE, Role.SUPERVISOR]),
  getSinglePerformanceReview
);
// router.patch("/:id", roles([Role.EMPLOYEE, Role.SUPERVISOR]), updateSupervisor);
// router.delete("/:id", roles([Role.HR]), deleteSupervisor);

export default router;
