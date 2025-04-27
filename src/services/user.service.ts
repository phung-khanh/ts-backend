import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { database } from "../config/db";
import { IUser } from "../interfaces/user.interface";

export class UserService {
  private pool = database;

  // Đăng ký user mới
  async register(userData: Partial<IUser>) {
    const { name, email, password, phone } = userData;

    // Check tồn tại
    const emailExists = await this.checkEmail(email!);
    if (emailExists) {
      throw new Error("Email already exists");
    }
    const phoneExists = phone ? await this.checkPhone(phone) : false;
    if (phoneExists) {
      throw new Error("Phone number already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password!, 10);

    const result = await this.pool.query(
      `INSERT INTO users (name, email, password, phone, role, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, hashedPassword, phone, "USER", true]
    );

    return result.rows[0];
  }

  // Đăng nhập
  async login(email: string, password: string) {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1d" }
    );

    return { token, user };
  }

  // Đăng xuất
  async logout() {
    // Vì JWT là stateless, nên logout frontend sẽ xoá token thôi
    return { message: "Logout success" };
  }

  // Check Email tồn tại
  async checkEmail(email: string) {
    const result = await this.pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email]
    );
    return (result.rowCount ?? 0) > 0;
  }

  // Check Phone tồn tại
  async checkPhone(phone: string) {
    const result = await this.pool.query(
      `SELECT 1 FROM users WHERE phone = $1`,
      [phone]
    );
    return (result.rowCount ?? 0) > 0;
  }

  // Tìm kiếm user
  async searchUser(keyword: string) {
    const result = await this.pool.query(
      `SELECT id, name, email, phone FROM users WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${keyword}%`]
    );
    return result.rows;
  }
}

export const userService = new UserService();
