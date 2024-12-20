import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

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

  try {
    if (password && !password) {
      const salt = await bcrypt.genSalt(12);
      req.body["password"] = await bcrypt.hash(password, salt);
    } else {
      req.body = {
        name: name,
        email: email,
      };
    }
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
