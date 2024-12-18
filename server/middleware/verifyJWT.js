import { StatusCodes } from"http-status-codes";
import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
   
      req.user = decoded.name
      req.role = decoded.role

      next()
    }
  );
};

export default verifyJWT;