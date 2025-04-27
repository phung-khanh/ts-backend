import { Pool } from "pg";
import { database } from "../config/db";
import { IUser } from "../interfaces/user.interface";

export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // CREATE
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const result = await this.pool.query(
      `INSERT INTO users (name, email, password, avatar, phone, address, gender, birthday, role, loginMethod, isActive, createdAt, updatedAt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [
        userData.name,
        userData.email,
        userData.password,
        userData.avatar,
        userData.phone,
        userData.address,
        userData.gender,
        userData.birthday,
        userData.role || "USER",
        userData.loginMethod || "password",
        true,
      ]
    );

    return result.rows[0];
  }

  // READ
  async findUserById(id: string | number): Promise<IUser> {
    const result = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);

    return result.rows[0];
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<IUser[]> {
    const result = await this.pool.query(
      `SELECT * FROM users ORDER BY createdAt DESC`
    );
    return result.rows;
  }

  // UPDATE
  async updateUser(
    id: string | number,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const key in updateData) {
      fields.push(`${key} = $${i++}`);
      values.push((updateData as any)[key]);
    }
    values.push(id);

    const result = await this.pool.query(
      `UPDATE users SET ${fields.join(
        ", "
      )}, updatedAt = NOW() WHERE id = $${i} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async changePassword(
    id: string | number,
    newPassword: string
  ): Promise<void> {
    await this.pool.query(
      `UPDATE users SET password = $1, updatedAt = NOW() WHERE id = $2`,
      [newPassword, id]
    );
  }

  async deactivateUser(id: string | number): Promise<void> {
    await this.pool.query(
      `UPDATE users SET isActive = false, updatedAt = NOW() WHERE id = $1`,
      [id]
    );
  }

  // DELETE
  async deleteUser(id: string | number): Promise<void> {
    await this.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  // Admin: Get full profile of any user by ID
  async getProfileById(id: string | number): Promise<IUser> {
    const result = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);

    return result.rows[0];
  }
}

export const User = new UserModel(database);
