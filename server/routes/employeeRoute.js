import express from "express";
import {
  addEmployee,
  getEmployees,
  deleteEmployee,
  getEmployee,
  updateEmployee,
} from "../controller/employeeController.js";
import { Role } from "@prisma/client";
import roles from "../middleware/rolesMiddleware.js";

const router = express.Router();

router.get("/", roles([Role.HR]), getEmployees);
router.post("/", roles([Role.HR]), addEmployee);
router.get("/:id", roles([Role.HR]), getEmployee);
router.patch("/:id", roles([Role.HR]), updateEmployee);
router.delete("/:id", roles([Role.HR]), deleteEmployee);

export default router;
