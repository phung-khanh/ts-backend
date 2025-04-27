import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  data: any = null,
  message: string = ""
) => {
  res.status(statusCode).json({
    success: success,
    data: data,
    message: message,
  });
};
