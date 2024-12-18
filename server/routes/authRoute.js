import express from "express";
import { login, logout, refresh } from "../controller/authController.js";

const route = express.Router();

route.get("/refresh", refresh);
route.post("/", login);
route.post("/logout", logout);

export default route;

