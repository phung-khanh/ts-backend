import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import router from "./routes/index";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL].filter(
  (origin) => origin !== undefined
);

app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api", router);

export default app;
