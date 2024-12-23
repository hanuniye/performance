import express from "express";
import {
  addPerformanceReview,
  getPerformanceReviews,
  getSinglePerformanceReview,
  getSinglePerformanceReviewForUpdate,
  approvePerformanceReview,
  reviewPerformanceReview,
} from "../controller/performanceController.js";
import { Role, Status } from "@prisma/client";
import roles from "../middleware/rolesMiddleware.js";

import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updatePerformanceReview = async (req, res) => {
  const { role } = req;
  const { id } = req.params;
  const {
    name,
    title,
    manager,
    location,
    fy,
    goals,
    employeeComment,
    managerComment,
    self_majorAccomplishments,
    self_areasForImprovement,
    manag_majorAccomplishments,
    manag_areasForImprovement,
    overallRating,
    managerSignature,
    employeeDate,
    managerDate,
    employeeSignature,
    employeeComments,
    status,
  } = req.body;

  try {
    const lastStatus = role === Role.SUPERVISOR ? Status.IN_REVIEW : status;

    const updatedReview = await prisma.performanceReview.update({
      where: { id },
      data: {
        status: lastStatus,
        location,
        fy,
        name,
        title,
        manager,
        employeeComment,
        managerComment,
        self_majorAccomplishments,
        self_areasForImprovement,
        manag_majorAccomplishments,
        manag_areasForImprovement,
        overallRating,
        managerSignature,
        employeeDate: employeeDate ? new Date(employeeDate) : null,
        managerDate: managerDate ? new Date(managerDate) : null,
        employeeSignature,
        employeeComments,
        goals: {
          deleteMany: {},
          create: goals.map((goal) => ({
            globalImpactArea: goal.globalImpactArea,
            coreCompetency: goal.coreCompetency,
            functionalCompetency: goal.functionalCompetency,
            keyTasks: goal.keyTasks,
            whyImportant: goal.whyImportant,
            whenAccomplish: new Date(goal.whenAccomplish),
            employeeFeedback: goal.employeeFeedback,
            managerFeedback: goal.managerFeedback,
            selfRating: goal.selfRating,
            managerRating: goal.managerRating,
            employeeQ1: goal.employeeQ1,
            employeeQ2: goal.employeeQ2,
            employeeQ3: goal.employeeQ3,
            employeeQ4: goal.employeeQ4,
            managerQ1: goal.managerQ1,
            managerQ2: goal.managerQ2,
            managerQ3: goal.managerQ3,
            managerQ4: goal.managerQ4,
          })),
        },
      },
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Performance review updated successfully", updatedReview });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const router = express.Router();

router.get(
  "/",
  roles([Role.HR, Role.EMPLOYEE, Role.SUPERVISOR]),
  getPerformanceReviews
);
router.post("/", roles([Role.EMPLOYEE]), addPerformanceReview);
router.post("/:id/approve", roles([Role.SUPERVISOR]), approvePerformanceReview);
router.post("/:id/in-review", roles([Role.HR]), reviewPerformanceReview);
router.get(
  "/:id",
  roles([Role.HR, Role.EMPLOYEE, Role.SUPERVISOR]),
  getSinglePerformanceReview
);
router.get(
  "/:id/forUpdate",
  roles([Role.EMPLOYEE, Role.SUPERVISOR]),
  getSinglePerformanceReviewForUpdate
);
router.patch(
  "/:id",
  roles([Role.EMPLOYEE, Role.SUPERVISOR]),
  updatePerformanceReview
);
// router.delete("/:id", roles([Role.HR]), deleteSupervisor);

export default router;
