import { IVehicleRepository } from "../interfaces/IVehicleRepository.js";
import { mapVehicleRow } from "./mappers.js";

export class PostgresVehicleRepository extends IVehicleRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(vehicleData) {
    const result = await this.db.query(
      `INSERT INTO vehicles (
         brand, model, year, plate_number, type, status, base_rate_per_hour, specific_attributes, image_url
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
       RETURNING *`,
      [
        vehicleData.brand,
        vehicleData.model,
        vehicleData.year,
        vehicleData.plateNumber,
        vehicleData.type,
        vehicleData.status,
        vehicleData.baseRatePerHour,
        JSON.stringify(vehicleData.specificAttributes ?? {}),
        vehicleData.imageUrl ?? null
      ]
    );

    return mapVehicleRow(result.rows[0]);
  }

  async update(id, vehicleData) {
    const result = await this.db.query(
      `UPDATE vehicles
       SET brand = $2,
           model = $3,
           year = $4,
           plate_number = $5,
           type = $6,
           status = $7,
           base_rate_per_hour = $8,
           specific_attributes = $9::jsonb,
           image_url = $10,
           updated_at = NOW()
       WHERE id = $1 AND is_active = TRUE
       RETURNING *`,
      [
        id,
        vehicleData.brand,
        vehicleData.model,
        vehicleData.year,
        vehicleData.plateNumber,
        vehicleData.type,
        vehicleData.status,
        vehicleData.baseRatePerHour,
        JSON.stringify(vehicleData.specificAttributes ?? {}),
        vehicleData.imageUrl ?? null
      ]
    );

    return mapVehicleRow(result.rows[0]);
  }

  async findById(id) {
    const result = await this.db.query("SELECT * FROM vehicles WHERE id = $1 AND is_active = TRUE LIMIT 1", [id]);
    return mapVehicleRow(result.rows[0]);
  }

  async searchAvailable(filters = {}) {
    const clauses = ["is_active = TRUE", "status = 'AVAILABLE'"];
    const values = [];

    if (filters.type) {
      values.push(filters.type);
      clauses.push(`type = $${values.length}`);
    }

    if (filters.brand) {
      values.push(filters.brand);
      clauses.push(`LOWER(brand) = LOWER($${values.length})`);
    }

    if (filters.minRate) {
      values.push(filters.minRate);
      clauses.push(`base_rate_per_hour >= $${values.length}`);
    }

    if (filters.maxRate) {
      values.push(filters.maxRate);
      clauses.push(`base_rate_per_hour <= $${values.length}`);
    }

    const result = await this.db.query(
      `SELECT * FROM vehicles
       WHERE ${clauses.join(" AND ")}
       ORDER BY created_at DESC`,
      values
    );

    return result.rows.map(mapVehicleRow);
  }

  async listAll(filters = {}) {
    const clauses = ["is_active = TRUE"];
    const values = [];

    if (filters.status) {
      values.push(filters.status);
      clauses.push(`status = $${values.length}`);
    }

    if (filters.type) {
      values.push(filters.type);
      clauses.push(`type = $${values.length}`);
    }

    const result = await this.db.query(
      `SELECT * FROM vehicles
       WHERE ${clauses.join(" AND ")}
       ORDER BY created_at DESC`,
      values
    );

    return result.rows.map(mapVehicleRow);
  }

  async updateStatus(id, status) {
    const result = await this.db.query(
      `UPDATE vehicles
       SET status = $2, updated_at = NOW()
       WHERE id = $1 AND is_active = TRUE
       RETURNING *`,
      [id, status]
    );

    return mapVehicleRow(result.rows[0]);
  }

  async softDelete(id) {
    const result = await this.db.query(
      `UPDATE vehicles
       SET is_active = FALSE, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return mapVehicleRow(result.rows[0]);
  }
}

