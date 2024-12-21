import { PrismaClient, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

export const addSupervisor = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
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
        .json({ error: "this email is already existing!!" });

    const salt = await bcrypt.genSalt(12);
    const hashPwd = await bcrypt.hash(password, salt);

    req.body["role"] = Role.SUPERVISOR;
    req.body["password"] = hashPwd;

    const supervisor = await db.users.create({ data: req.body });
    if (!supervisor)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error occured at Supervisor Creating!" });

    return res.status(StatusCodes.OK).json({ msg: supervisor });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await db.users.findMany({
      where: {
        role: Role.SUPERVISOR,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!supervisors && !supervisors.length)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Supervisors are not found" });

    return res.status(StatusCodes.OK).json({ msg: supervisors });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getSupervisor = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Supervisor ID is missing" });

  try {
    const supervisor = await db.users.findUnique({
      where: { id: id },
    });

    if (!supervisor)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Supervisor with the id: ${id} is not found` });

    return res.status(StatusCodes.OK).json({ msg: supervisor });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateSupervisor = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Supervisor ID is missing" });

  const { name, email, password } = req.body;
  if (!email || !name)
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
      };
    }
    const supervisor = await db.users.update({
      where: { id: id },
      data: req.body,
    });
    if (!supervisor)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error Occured at Supervisor Updating" });

    return res.status(StatusCodes.OK).json({ msg: supervisor });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteSupervisor = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Supervisor ID is missing" });

  try {
    const supervisor = await db.users.delete({ where: { id: id } });
    if (!supervisor)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error Occured at Supervisor Deleting" });

    return res.status(StatusCodes.OK).json({ msg: supervisor });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
