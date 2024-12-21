import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../config/errors.js";

const prisma = new PrismaClient();

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "missing email or password" });

  try {
    const validEmail = await prisma.users.findFirst({ where: { email } });
    if (!validEmail)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "this user does not exist!!" });

    const isMatch = await bcrypt.compare(password, validEmail.password);
    if (!isMatch)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "password is not match!!" });

    const accessToken = jwt.sign(
      { name: validEmail.name, role: validEmail.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: validEmail.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // await prisma.updateById(validEmail.id, {
    //   ...validEmail,
    //   refresh_token: refreshToken,
    // });

    const cookiesOptions = {
      httpOnly: true, //secure can not access in javascript
      sameSite: "Strict", //for development env
      maxAge: 24 * 60 * 60 * 1000, //cookie expirey: set to match the refresh token
    };

    if (process.env.DB_ENV === "production") {
      (cookiesOptions[sameSite] = "None"), (cookiesOptions[secure] = true);
    }

    //create secure cookie with refresh token
    res.cookie("jwt", refreshToken, cookiesOptions);
    res.status(StatusCodes.OK).json({
      user: {
        id: validEmail.id,
        email: validEmail.email,
        name: validEmail.name,
        role: validEmail.role,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const refresh = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized!" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden!" });
      const user = await prisma.users.findFirst({
        where: { email: decoded.email },
      });
      if (!user)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Unauthorized!" });

      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      res.status(StatusCodes.OK).json({ accessToken, role: user.role });
    }
  );
};
export const logout = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(StatusCodes.NO_CONTENT);

  const cookiesOptions = {
    httpOnly: true, //secure can not access in javascript
    sameSite: "Strict", //for development env
    maxAge: 24 * 60 * 60 * 1000, //cookie expirey: set to match the refresh token
  };

  if (process.env.DB_ENV === "production") {
    (cookiesOptions[sameSite] = "None"), (cookiesOptions[secure] = true);
  }

  res.clearCookie("jwt", cookiesOptions);
  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};
