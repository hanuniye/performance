import { StatusCodes } from "http-status-codes";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const addPerformanceReview = async (req, res) => {
  const { employeeId, location, name, title, manager, fy, goals } = req.body;

  if (
    !employeeId ||
    !location ||
    !name ||
    !title ||
    !manager ||
    !fy ||
    !goals ||
    !goals.length
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "All fields are required" });
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const performanceReview = await prisma.performanceReview.create({
        data: {
          employeeId,
          location,
          fy,
          name,
          title,
          manager,
        },
      });

      const goalPromises = goals.map((goal) =>
        prisma.goal.create({
          data: {
            performanceReviewId: performanceReview.id,
            globalImpactArea: goal.globalImpactArea,
            coreCompetency: goal.coreCompetency,
            functionalCompetency: goal.functionalCompetency,
            keyTasks: goal.keyTasks,
            whyImportant: goal.whyImportant,
            whenAccomplish: new Date(goal.whenAccomplish),
            employeeQ1: goal.quarterlyUpdates[0].employeeUpdates.q1,
            employeeQ2: goal.quarterlyUpdates[0].employeeUpdates.q2,
            employeeQ3: goal.quarterlyUpdates[0].employeeUpdates.q3,
            employeeQ4: goal.quarterlyUpdates[0].employeeUpdates.q4,
            employeeFeedback: goal.employeeFeedback
              ? goal.employeeFeedback
              : "",
            selfRating: goal.selfRating ? goal.selfRating : "",
          },
        })
      );

      await Promise.all(goalPromises);

      return performanceReview;
    });

    return res.status(StatusCodes.OK).json({ msg: result });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getPerformanceReviews = async (req, res) => {
  try {
    const { userId, role } = req;

    let whereClause = {};

    if (role === Role.HR) {
      // HR sees all records.
      whereClause = {};
    } else if (role === Role.SUPERVISOR) {
      // Supervisor sees only their employees' data.
      whereClause = {
        employee: {
          supervisorId: userId,
        },
      };
    } else if (role === Role.EMPLOYEE) {
      // Employee sees only their own data.
      whereClause = {
        employeeId: userId,
      };
    } else {
      return res.status(403).json({ error: "Invalid role" });
    }

    const performanceReviews = await prisma.performanceReview.findMany({
      where: whereClause,
      include: {
        goals: true,
        employee: {
          select: {
            name: true,
            supervisor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(performanceReviews);

    return res.status(200).json({ msg: performanceReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSinglePerformanceReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "Performance ID is required" });
    }

    const performanceReviews = await prisma.performanceReview.findUnique({
      where: {
        id,
      },
      include: {
        goals: true,
        employee: {
          select: {
            name: true,
            supervisor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ msg: performanceReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePerformanceReview = async (req, res) => {
  const { id } = req.params;
  const { employeeId, supervisorId, name, title, manager, goals, employeeComment, managerComment, majorAccomplishments, areasForImprovement, overallRating, managerSignature, date, employeeSignature, employeeComments } = req.body;

  try {
    const updatedReview = await prisma.performanceReview.update({
      where: { id },
      data: {
        employeeId,
        supervisorId,
        name,
        title,
        manager,
        employeeComment,
        managerComment,
        majorAccomplishments,
        areasForImprovement,
        overallRating,
        managerSignature,
        date: new Date(date),
        employeeSignature,
        employeeComments,
        goals: {
          deleteMany: {},
          create: goals.map(goal => ({
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
            quarterlyUpdates: {
              create: {
                q1: goal.quarterlyUpdates.q1,
                q2: goal.quarterlyUpdates.q2,
                q3: goal.quarterlyUpdates.q3,
                q4: goal.quarterlyUpdates.q4,
                managerQ1: goal.quarterlyUpdates.managerQ1,
                managerQ2: goal.quarterlyUpdates.managerQ2,
                managerQ3: goal.quarterlyUpdates.managerQ3,
                managerQ4: goal.quarterlyUpdates.managerQ4,
              },
            },
          })),
        },
      },
    });

    return res.status(StatusCodes.OK).json({ msg: 'Performance review updated successfully', updatedReview });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
};