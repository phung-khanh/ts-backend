import { model, Schema } from "mongoose";
import { IPassword } from "../interfaces/password.interface";

const resetPasswordSchema = new Schema<IPassword>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expired: {
    type: Date,
    required: true,
  },
});

const PasswordReset = model<IPassword>("resetPassword", resetPasswordSchema);
export default PasswordReset;
