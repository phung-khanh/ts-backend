import express, { Express, Request, Response } from "express";
import errorMiddleware from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import { sendResponse } from "./utils/responseFormatter";

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Global error handler
app.use(errorMiddleware);

// Optional: If you want a general route to test
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, 200, true, null, "API is running smoothly...");
});

export default app;
