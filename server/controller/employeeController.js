import { PrismaClient, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

export const addEmployee = async (req, res, next) => {
  const { name, email, password, title, location, supervisorId } = req.body;
  if (!email || !password || !title || !location || !name || !supervisorId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "All fields are required" });
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

    const employee = await db.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        title: req.body.title,
        location: req.body.location,
        supervisorId: req.body.supervisorId,
        role: Role.EMPLOYEE,
        password: req.body.password,
      },
    });
    if (!employee)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error occured at Employee Creating!" });

    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await db.users.findMany({
      where: {
        role: Role.EMPLOYEE,
      },
      include: {
        supervisor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!employees && !employees.length)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Employees are not found" });

    return res.status(StatusCodes.OK).json({ msg: employees });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Employee ID is missing" });
  try {
    const employee = await db.users.findUnique({
      where: { id: id },
    });

    if (!employee)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Supervisor with the id: ${id} is not found` });

    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Employee ID is missing" });

  const { name, email, password, title, location, supervisorId } = req.body;
  if (!email || !title || !location || !name || !supervisorId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "All fields are required" });

  try {
    const existEmail = await db.users.findFirst({
      where: {
        email: email,
      },
    });

    if (existEmail && existEmail.id !== id)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "This user is already exists!" });

    if (password) {
      const salt = await bcrypt.genSalt(12);
      req.body["password"] = await bcrypt.hash(password, salt);
    } else {
      req.body = {
        name: name,
        email: email,
        title: title,
        location: location,
        supervisorId: supervisorId,
      };
    }

    const employee = await db.users.update({
      where: { id: id },
      data: req.body,
    });
    if (!employee)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error Occured at Employee Updating" });

    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Employee ID is missing" });

  try {
    const employee = await db.users.delete({ where: { id: id } });
    if (!employee)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error Occured at Employee Deleting" });
    return res.status(StatusCodes.OK).json({ msg: employee });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
