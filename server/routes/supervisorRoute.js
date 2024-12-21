import express from "express";
import {
  addSupervisor,
  deleteSupervisor,
  getSupervisor,
  getSupervisors,
  updateSupervisor,
} from "../controller/supervisorController.js";
import { Role } from "@prisma/client";
import roles from "../middleware/rolesMiddleware.js";

const router = express.Router();

router.get("/", roles([Role.HR]), getSupervisors);
router.post("/", roles([Role.HR]), addSupervisor);
router.get("/:id", roles([Role.HR]), getSupervisor);
router.patch("/:id", roles([Role.HR]), updateSupervisor);
router.delete("/:id", roles([Role.HR]), deleteSupervisor);

export default router;
