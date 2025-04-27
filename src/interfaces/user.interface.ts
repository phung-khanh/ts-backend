export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  birthday: string | null;
  role: "ADMIN" | "USER";
  loginMethod: "password" | "google";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
