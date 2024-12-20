import express from "express";
import { updateProfile } from "../controller/profileController.js";
import roles from "../middleware/rolesMiddleware.js";
import { Role } from "@prisma/client";

const router = express.Router();

router.patch(
  "/:id",
  roles([Role.EMPLOYEE, Role.HR, Role.SUPERVISOR]),
  updateProfile
);

export default router;
