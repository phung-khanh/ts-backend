import { model, Schema } from "mongoose";
import { IPassword } from "../interfaces/password.interface";

const passwordResetSchema = new Schema<IPassword>({
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

const PasswordReset = model<IPassword>("passwordResets", passwordResetSchema);
export default PasswordReset;
