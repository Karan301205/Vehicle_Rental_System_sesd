import { BookingStatus } from "../../domain/enums/booking-status.js";
import { IBookingRepository } from "../interfaces/IBookingRepository.js";
import { mapBookingRow } from "./mappers.js";

const BLOCKING_STATUSES = [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE];

export class PostgresBookingRepository extends IBookingRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(bookingData) {
    const result = await this.db.query(
      `INSERT INTO bookings (user_id, vehicle_id, start_time, end_time, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        bookingData.userId,
        bookingData.vehicleId,
        bookingData.startTime,
        bookingData.endTime,
        bookingData.totalAmount,
        bookingData.status
      ]
    );

    return mapBookingRow(result.rows[0]);
  }

  async findById(id) {
    const result = await this.db.query("SELECT * FROM bookings WHERE id = $1 LIMIT 1", [id]);
    return mapBookingRow(result.rows[0]);
  }

  async findByUserId(userId) {
    const result = await this.db.query(
      `SELECT * FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map(mapBookingRow);
  }

  async listAll(filters = {}) {
    const clauses = ["1 = 1"];
    const values = [];

    if (filters.status) {
      values.push(filters.status);
      clauses.push(`status = $${values.length}`);
    }

    const result = await this.db.query(
      `SELECT * FROM bookings
       WHERE ${clauses.join(" AND ")}
       ORDER BY created_at DESC`,
      values
    );

    return result.rows.map(mapBookingRow);
  }

  async updateStatus(id, status) {
    const result = await this.db.query(
      `UPDATE bookings
       SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, status]
    );

    return mapBookingRow(result.rows[0]);
  }

  async hasConflict(vehicleId, startTime, endTime) {
    const result = await this.db.query(
      `SELECT EXISTS (
         SELECT 1
         FROM bookings
         WHERE vehicle_id = $1
           AND status = ANY($2::booking_status[])
           AND $3 < end_time
           AND $4 > start_time
       ) AS has_conflict`,
      [vehicleId, BLOCKING_STATUSES, startTime, endTime]
    );

    return result.rows[0]?.has_conflict ?? false;
  }
}

