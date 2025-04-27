import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware kiểm tra login
export const checkLogin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
        id: string;
        email: string;
        role: string;
      };
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid Token" });
    }
  }
);

// Middleware kiểm tra admin
export const isAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const { email } = req.user;
    const user = await userService.checkEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next();
  }
);
