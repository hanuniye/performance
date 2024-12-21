import express from "express";
import { updateProfile, getUser } from "../controller/profileController.js";
import roles from "../middleware/rolesMiddleware.js";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/:id", roles([Role.EMPLOYEE, Role.HR, Role.SUPERVISOR]), getUser);
router.patch(
  "/:id",
  roles([Role.EMPLOYEE, Role.HR, Role.SUPERVISOR]),
  updateProfile
);

export default router;
