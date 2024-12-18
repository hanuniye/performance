import { PrismaClient, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { createError } from "../config/errors.js";

const db = new PrismaClient();

export const addEmployee = async (req, res, next) => {
  const { name, email, password, title, location } = req.body;
  if (!email || !password || !title || !location || !name)
    return next(
      createError(StatusCodes.BAD_REQUEST, "All fields are required")
    );
  try {
    const existEmail = await db.users.findFirst({
      where: {
        email: email,
      },
    });

    if (existEmail)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "this email is already existing!!" });

    const salt = await bcrypt.genSalt(12);
    const hashPwd = await bcrypt.hash(password, salt);

    req.body["role"] = Role.EMPLOYEE;
    req.body["password"] = hashPwd;

    const employee = await db.users.create({ data: req.body });
    if (!employee)
      return next(createError(StatusCodes.NOT_FOUND, "opps error occured!"));

    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    next(createError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await db.users.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
      include: {
        supervisor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!employees && !employees.length)
      return next(
        createError(StatusCodes.NOT_FOUND, "employees are not found")
      );

    return res.status(StatusCodes.OK).json({ msg: employees });
  } catch (error) {
    next(createError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const getEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(
      createError(StatusCodes.BAD_REQUEST, "oopss! employee ID is missing")
    );
  try {
    const employee = await db.users.findUnique({
      where: { id: +id },
    });

    if (!employee)
      return next(
        createError(StatusCodes.NOT_FOUND, `employee with the id: ${id} is not found`)
      );
    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    next(createError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return next(createError(StatusCodes.BAD_REQUEST, "oopss! employee ID is missing"));
  const { name, email, password, title, location } = req.body;
  if (!email || !password || !title || !location || !name)
    return next(
      createError(StatusCodes.BAD_REQUEST, "All fields are required")
    );
  try {
    const user = await db.users.update({
      where: { id: id },
      data: req.body,
    });
    if (!user)
      return next(createError(StatusCodes.NOT_FOUND, "ooopss! error occured"));

    return res.status(StatusCodes.OK).json({ msg: user });
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        createError(INTERNAL_SERVER_ERROR, "You duplicated the session")
      );
    }
    next(createError(INTERNAL_SERVER_ERROR, error.message));
  }
};

export const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(createError(StatusCodes.BAD_REQUEST, "oopss! employee ID is missing"));

  try {
    const employee = await db.users.delete({ where: { id: +id } });
    if (!employee) return next(createError(StatusCodes.NOT_FOUND, "ooopss! error occured"));

    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    return next(createError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
