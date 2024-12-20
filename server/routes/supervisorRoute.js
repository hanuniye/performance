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

router.get("/", getSupervisors);
router.post("/", addSupervisor);
router.get("/:id", getSupervisor);
router.patch("/:id", updateSupervisor);
router.delete("/:id", deleteSupervisor);

export default router;
