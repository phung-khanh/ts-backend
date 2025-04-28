import { Document } from "mongoose";

export interface IPassword extends Document {
  email: string;
  otp: string;
  expired: Date;
}
