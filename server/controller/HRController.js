import { PrismaClient, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { createError } from "../config/errors.js";

const db = new PrismaClient();

export const addHR = async (req, res) => {
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
        .json({ error: "This user is already exists!" });

    const salt = await bcrypt.genSalt(12);
    const hashPwd = await bcrypt.hash(password, salt);

    req.body["role"] = Role.HR;
    req.body["password"] = hashPwd;

    const HR = await db.users.create({ data: req.body });
    if (!HR)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error Occured! at Creating HR" });

    return res.status(StatusCodes.OK).json({ msg: HR });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getHRs = async (req, res) => {
  try {
    const HR = await db.users.findMany({
      where: {
        role: Role.HR,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!HR && !HR.length)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "HR data are not found" });

    return res.status(StatusCodes.OK).json({ msg: HR });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getHR = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "oopss! HR ID is missing" });

  try {
    const HR = await db.users.findUnique({
      where: { id: id },
    });

    if (!HR)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `HR with the id: ${id} is not found` });

    return res.status(StatusCodes.OK).json({ msg: HR });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateHR = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "oopss! HR ID is missing" });

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
    const HR = await db.users.update({
      where: { id: id },
      data: req.body,
    });
    if (!HR)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Error occured at updateing HR" });

    return res.status(StatusCodes.OK).json({ msg: HR });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteHR = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "HR ID is missing" });

  try {
    const HR = await db.users.delete({ where: { id: id } });
    if (!HR)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "error occured in deleting HR" });

    return res.status(StatusCodes.OK).json({ msg: HR });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
