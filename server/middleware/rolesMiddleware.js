import { StatusCodes } from "http-status-codes";

const roles = (allowedRoles) => {
  return (req, res, next) => {
    const role = req.role;
    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(role);
    if (!result)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "unauthorized" });
    next();
  };
};

export default roles;
