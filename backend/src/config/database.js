import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { newDb } from "pg-mem";
import { env } from "./env.js";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../sql/schema.sql");

let memoryDb = null;
let initializationPromise = null;

async function loadSchemaSql() {
  const schemaSql = await fs.readFile(schemaPath, "utf8");
  const withoutExtension = schemaSql.replace(/^CREATE EXTENSION.*$/gm, "");
  const withoutDoBlock = withoutExtension.replace(/DO \$\$[\s\S]*?END \$\$;/m, "");

  const enumPreamble = `
    CREATE TYPE user_role AS ENUM ('ADMIN', 'CUSTOMER');
    CREATE TYPE vehicle_type AS ENUM ('CAR', 'BIKE');
    CREATE TYPE vehicle_status AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE');
    CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
    CREATE TYPE payment_method AS ENUM ('CREDIT_CARD', 'UPI', 'WALLET');
    CREATE TYPE payment_status AS ENUM ('SUCCESS', 'FAILED', 'REFUNDED');
  `;

  return `${enumPreamble}\n${withoutDoBlock}`;
}

async function seedMemoryDatabase(db) {
  await db.public.none(`
    INSERT INTO users (id, email, password_hash, full_name, role, license_number)
    VALUES
      ('11111111-1111-1111-1111-111111111111', 'admin@wheelcheck.dev', '$2b$10$.mherQ7S5uc1mJ/q7P.nAeI.xjStux/RiaLT1JfS.Ae8lVfxpvQXe', 'Fleet Admin', 'ADMIN', 'ADMIN001'),
      ('22222222-2222-2222-2222-222222222222', 'customer@wheelcheck.dev', '$2b$10$.mherQ7S5uc1mJ/q7P.nAeI.xjStux/RiaLT1JfS.Ae8lVfxpvQXe', 'Demo Customer', 'CUSTOMER', 'CUST12345')
    ON CONFLICT (email) DO NOTHING;

    INSERT INTO vehicles (
      id, brand, model, year, plate_number, type, status, base_rate_per_hour, specific_attributes, image_url
    ) VALUES
      (
        '33333333-3333-3333-3333-333333333333',
        'Audi',
        'A4',
        2024,
        'DL01AB1234',
        'CAR',
        'AVAILABLE',
        2499,
        '{"trunkSize": 480, "doors": 4, "hasAC": true}',
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        '44444444-4444-4444-4444-444444444444',
        'Tesla',
        'Model 3',
        2025,
        'DL02CD5678',
        'CAR',
        'AVAILABLE',
        3199,
        '{"trunkSize": 540, "doors": 4, "hasAC": true}',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        '55555555-5555-5555-5555-555555555555',
        'Yamaha',
        'MT 15',
        2024,
        'DL03EF9012',
        'BIKE',
        'AVAILABLE',
        999,
        '{"helmetType": "Full Face", "engineCapacity": 155}',
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
      )
    ON CONFLICT (plate_number) DO NOTHING;
  `);
}

async function buildInMemoryPool() {
  if (memoryDb) {
    return memoryDb.adapters.createPg().pool;
  }

  memoryDb = newDb({
    autoCreateForeignKeyIndices: true
  });

  memoryDb.public.registerFunction({
    name: "gen_random_uuid",
    returns: "uuid",
    implementation: () => crypto.randomUUID()
  });

  const schemaSql = await loadSchemaSql();
  memoryDb.public.none(schemaSql);

  if (env.SEED_IN_MEMORY_DB || env.NODE_ENV === "test") {
    await seedMemoryDatabase(memoryDb);
  }

  const pgAdapter = memoryDb.adapters.createPg();
  return new pgAdapter.Pool();
}

async function createPool() {
  if (env.USE_IN_MEMORY_DB) {
    return buildInMemoryPool();
  }

  return new Pool({
    connectionString: env.DATABASE_URL
  });
}

export let db;

export async function initializeDatabase() {
  if (!initializationPromise) {
    initializationPromise = createPool().then((pool) => {
      db = pool;
      return db;
    });
  }

  return initializationPromise;
}

export async function checkDatabaseConnection() {
  const pool = await initializeDatabase();
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}
