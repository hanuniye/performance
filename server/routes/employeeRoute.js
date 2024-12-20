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

router.get("/", getEmployees);
router.post("/", addEmployee);
router.get("/:id", getEmployee);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
