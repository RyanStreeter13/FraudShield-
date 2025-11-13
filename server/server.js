// ============================================================
// 🧠 FraudShield Backend Server – SQLite Version
// ============================================================

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db, query } from "./db.js"; // SQLite query() + db

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ============================================================
// 👤 AUTH ROUTES (REGISTER / LOGIN)
// ============================================================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = query("SELECT * FROM student WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // SQLite insert
    query(
      "INSERT INTO student (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    const student_id = db.prepare("SELECT last_insert_rowid() AS id").get().id;

    const token = jwt.sign(
      { student_id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "2h" }
    );

    return res.status(201).json({ message: "Signup successful", token, student_id });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: String(error) });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const rows = query("SELECT * FROM student WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { student_id: user.student_id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "2h" }
    );

    return res.json({ message: "Login successful", token, student_id: user.student_id });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ============================================================
// 🎓 COURSE + MODULE + QUIZ ROUTES
// ============================================================

app.get("/api/courses", (req, res) => {
  try {
    const rows = query("SELECT * FROM course");
    res.json(rows);
  } catch (err) {
    console.error("❌ Course fetch error:", err);
    res.status(500).json({ error: "Failed to load courses" });
  }
});

app.get("/api/courses/:id/modules", (req, res) => {
  const { id } = req.params;
  try {
    const rows = query(
      "SELECT * FROM module WHERE course_id = ? ORDER BY module_order ASC",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Module fetch error:", err);
    res.status(500).json({ error: "Failed to load modules" });
  }
});

app.get("/api/student/:studentId/progress", (req, res) => {
  const { studentId } = req.params;
  const { course_id } = req.query;

  try {
    const rows = query(
      `SELECT m.module_id, m.module_title, m.module_order,
              COALESCE(p.score,0) AS score,
              COALESCE(p.is_completed,0) AS is_completed
         FROM module m
         LEFT JOIN student_module_progress p
           ON m.module_id = p.module_id AND p.student_id = ?
        WHERE m.course_id = ?
        ORDER BY m.module_order ASC`,
      [studentId, course_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Progress fetch error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// ============================================================
// 📝 QUIZ SUBMIT (SQLite-Compatible)
// ============================================================

app.post("/api/quiz/submit", (req, res) => {
  try {
    const { student_id, module_id, score } = req.body;
    if (!student_id || !module_id || score === undefined)
      return res.status(400).json({ error: "Missing required fields" });

    const is_completed = score >= 80 ? 1 : 0;

    // SQLite UPSERT
    query(
      `INSERT INTO student_module_progress (student_id, module_id, score, is_completed)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, module_id)
       DO UPDATE SET score = excluded.score, is_completed = excluded.is_completed`,
      [student_id, module_id, score, is_completed]
    );

    const courseRow = query(
      "SELECT course_id FROM module WHERE module_id = ?",
      [module_id]
    )[0];

    if (courseRow) {
      const remaining = query(
        `SELECT COUNT(*) AS remaining
             FROM module m
             LEFT JOIN student_module_progress p
               ON m.module_id = p.module_id AND p.student_id = ?
            WHERE m.course_id = ?
              AND (p.is_completed = 0 OR p.is_completed IS NULL)`,
        [student_id, courseRow.course_id]
      )[0];

      if (remaining.remaining === 0) {
        query(
          `INSERT INTO student_course_progress (student_id, course_id, is_completed)
           VALUES (?, ?, 1)
           ON CONFLICT(student_id, course_id)
           DO UPDATE SET is_completed = 1`,
          [student_id, courseRow.course_id]
        );
      }
    }

    return res.json({ success: true, isCompleted: is_completed === 1 });

  } catch (err) {
    console.error("❌ Quiz submission error:", err);
    return res.status(500).json({ error: "Quiz submission failed" });
  }
});

// ============================================================
// 🧠 INTERACTIVE LAB ROUTES
// ============================================================

// GET labs + choices
app.get("/api/labs", (req, res) => {
  try {
    const labs = query(
      "SELECT lab_id, title, description, type FROM labs ORDER BY lab_id ASC"
    );

    const choices = query(
      "SELECT choice_id, lab_id, label, is_correct FROM lab_choices ORDER BY lab_id, choice_id ASC"
    );

    const merged = labs.map((lab) => ({
      ...lab,
      choices: choices.filter((c) => c.lab_id === lab.lab_id),
    }));

    res.json(merged);
  } catch (err) {
    console.error("❌ Labs fetch error:", err);
    res.status(500).json({ error: "Failed to load labs" });
  }
});

// POST lab attempt
app.post("/api/labs/attempt", (req, res) => {
  try {
    const { student_id, lab_id, selected_choice_id } = req.body;

    if (!student_id || !lab_id || !selected_choice_id)
      return res.status(400).json({ error: "Missing required fields" });

    // Validate choice
    const choice = query(
      "SELECT is_correct FROM lab_choices WHERE choice_id = ? AND lab_id = ?",
      [selected_choice_id, lab_id]
    );

    if (choice.length === 0)
      return res.status(404).json({ error: "Choice not found for that lab" });

    const is_correct = choice[0].is_correct ? 1 : 0;

    // Ensure table exists (SQLite syntax)
    query(`
      CREATE TABLE IF NOT EXISTS lab_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        lab_id INTEGER,
        selected_choice_id INTEGER,
        is_correct INTEGER,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert attempt
    query(
      `INSERT INTO lab_attempts (student_id, lab_id, selected_choice_id, is_correct)
       VALUES (?, ?, ?, ?)`,
      [student_id, lab_id, selected_choice_id, is_correct]
    );

    return res.json({ success: true, is_correct: Boolean(is_correct) });

  } catch (err) {
    console.error("❌ Lab attempt error:", err);
    res.status(500).json({ error: "Server error during lab submission" });
  }
});

// ============================================================
// 🚀 START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ SQLite server running on http://localhost:${PORT}`)
);
