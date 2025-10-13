import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'search_db',
        password: process.env.DB_PASSWORD || 'password',
        port: parseInt(process.env.DB_PORT || '5432'),
      }
);

async function initializeDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);
    console.log("Database schema created successfully!");

    console.log("Adding sample data...");

    const faqResult = await pool.query(
      "INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING id",
      [
        "What is PostgreSQL?",
        "PostgreSQL is a powerful, open-source object-relational database system.",
      ]
    );
    const faqId = faqResult.rows[0].id;

    const searchResult = await pool.query(
      `INSERT INTO search_index (source_id, source_type, title, content)
       VALUES ($1, 'faq', $2, $3) RETURNING id`,
      [
        faqId,
        "What is PostgreSQL?",
        "PostgreSQL is a powerful, open-source object-relational database system.",
      ]
    );
    const searchId = searchResult.rows[0].id;

    await pool.query(
      `UPDATE search_index SET search_vector = to_tsvector('english', title || ' ' || content)
       WHERE id = $1`,
      [searchId]
    );

    console.log("Sample data added successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
