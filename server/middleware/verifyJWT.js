import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Forbidden" });
    const user = await prisma.users.findFirst({
      where: { email: decoded.email },
    });
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized!" });

    req.userId = user?.id;
    req.role = decoded.role;

    next();
  });
};

export default verifyJWT;
