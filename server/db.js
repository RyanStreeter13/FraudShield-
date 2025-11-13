// db.js — SQLite Version (replaces MySQL completely)

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Fix ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your SQLite .db file
const dbPath = path.join(__dirname, "database", "fraudshield.db");

// Open the SQLite database file
export const db = new Database(dbPath);

// Helper function to replace mysql2/promise db.query()
export function query(sql, params = []) {
  const stmt = db.prepare(sql);
  const command = sql.trim().split(" ")[0].toUpperCase();

  if (command === "SELECT") {
    return stmt.all(params);   // Return rows
  } else {
    return stmt.run(params);   // INSERT / UPDATE / DELETE
  }
}

console.log("✅ Connected to SQLite Database:", dbPath);
