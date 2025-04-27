import { NextFunction, Request, Response } from "express";

// Global Error Handler
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err instanceof Error ? err.message : "Unknown error",
  });
};

export default errorMiddleware;
