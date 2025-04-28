import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
dotenv.config();

interface check extends Request {
  user: { email: string };
}

export const checkLogin = asyncHandler(
  async (req: check, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"];
      if (!token) return res.status(401).send("Access Denied");

      const [_, selectToken] = token.split(" ");
      if (!process.env.JWT_SECRET_KEY) {
        return res.status(400).send("Invalid Token");
      }
      jwt.verify(
        selectToken,
        process.env.JWT_SECRET_KEY,
        (error: any, decodedToken: any) => {
          if (decodedToken) {
            req.user = decodedToken as { email: string };
            next();
          }
        }
      );
    } catch (error) {
      return res.status(400).send("Invalid Token");
    }
  }
);

export const isAdmin = asyncHandler(
  async (req: check, res: Response, next: NextFunction) => {
    try {
      const foundUser = await User.findOne({ email: req.user.email }).exec();

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const isAdmin = foundUser.role === "ADMIN";
      if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
