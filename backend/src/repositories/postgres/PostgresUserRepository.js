import { IUserRepository } from "../interfaces/IUserRepository.js";
import { mapUserRow } from "./mappers.js";

export class PostgresUserRepository extends IUserRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findByEmail(email) {
    const result = await this.db.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
    return mapUserRow(result.rows[0]);
  }

  async findById(id) {
    const result = await this.db.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
    return mapUserRow(result.rows[0]);
  }

  async save(userData) {
    const result = await this.db.query(
      `INSERT INTO users (email, password_hash, full_name, role, license_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userData.email, userData.passwordHash, userData.fullName, userData.role, userData.licenseNumber]
    );

    return mapUserRow(result.rows[0]);
  }
}

