import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

export const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "User ID is missing" });

  try {
    const user = await db.users.findUnique({
      where: { id: id },
    });

    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `User with the id: ${id} is not found` });

    return res.status(StatusCodes.OK).json({ msg: user });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: `User ID is missing` });

  const { name, email, password } = req.body;
  if (!email || !name)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "All fields are required" });
  console.log(req.body);

  try {
    if (password) {
      const salt = await bcrypt.genSalt(12);
      req.body["password"] = await bcrypt.hash(password, salt);
    } else {
      req.body = {
        name: name,
        email: email,
      };
    }
    console.log(req.body);
    const user = await db.users.update({
      where: { id: id },
      data: req.body,
    });
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `Error Occured In Updating Profile` });

    return res.status(StatusCodes.OK).json({ msg: user });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
