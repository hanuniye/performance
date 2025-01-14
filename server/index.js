import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
//routes
import authRoute from "./routes/authRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import HRRoute from "./routes/HRRoute.js";
import supervisorRoute from "./routes/supervisorRoute.js";
import profileRoute from "./routes/profileRoute.js";
import performanceRoute from "./routes/performanceRoute.js";
//middleware
import authMiddleWare from "./middleware/verifyJWT.js";
import credentials from "./middleware/originMiddleware.js";

export const app = express();
export const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());

app.use(credentials);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://performance-review-phi.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  return res.send("app is a live");
});
app.use("/api/auth", authRoute);
app.use(authMiddleWare); //auth middleware
app.use("/api/employee", employeeRoute);
app.use("/api/HR", HRRoute);
app.use("/api/supervisor", supervisorRoute);
app.use("/api/profile", profileRoute);
app.use("/api/performance_review", performanceRoute);
