// ============================================================
// 🧠 FraudShield Backend Server – Full Updated Version
// ============================================================

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "./db.js"; // mysql2/promise connection

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

    const [existing] = await db.query("SELECT * FROM student WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let student_id;
    try {
      const [result] = await db.query(
        "INSERT INTO student (student_name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      student_id = result.insertId;
    } catch {
      const [result2] = await db.query(
        "INSERT INTO student (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
      student_id = result2.insertId;
    }

    const token = jwt.sign({ student_id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "2h",
    });

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

    const [rows] = await db.query("SELECT * FROM student WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ student_id: user.student_id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "2h",
    });

    return res.json({ message: "Login successful", token, student_id: user.student_id });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ============================================================
// 🎓 EDUCATION SYSTEM (MODULES + QUIZZES)
// ============================================================

// ------------------------------------------------------------
// ⭐ GET ALL MODULES WITH COMPLETION + UNLOCK STATUS
// ------------------------------------------------------------
app.get("/api/modules/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const [modules] = await db.query(
      `SELECT module_id, module_title, module_order
       FROM module
       ORDER BY module_order ASC`
    );

    const [progress] = await db.query(
      `SELECT module_id, is_completed 
       FROM student_module_progress 
       WHERE student_id = ?`,
      [studentId]
    );

    const completedSet = new Set(progress.filter(p => p.is_completed == 1).map(p => p.module_id));

    const response = modules.map((m, i) => {
      const completed = completedSet.has(m.module_id);
      const prevCompleted = i === 0 || completedSet.has(modules[i - 1].module_id);

      return {
        id: m.module_id,
        title: m.module_title,
        completed,
        unlocked: i === 0 || completed || prevCompleted,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("❌ Module list error:", err);
    res.status(500).json({ error: "Failed to load modules" });
  }
});


// ------------------------------------------------------------
// ⭐ GET QUIZ FOR SPECIFIC MODULE (safe JSON)
// ------------------------------------------------------------
app.get("/api/module/:id/quiz", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT quiz_json FROM module_quiz WHERE module_id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Quiz does not exist for this module" });
    }

    let quizData = rows[0].quiz_json;

    // Parse if stored as string
    if (typeof quizData === "string") {
      try {
        quizData = JSON.parse(quizData);
      } catch (err) {
        console.error("❌ Error parsing quiz JSON:", err);
        return res.status(500).json({ error: "Quiz JSON invalid" });
      }
    }

    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return res.status(500).json({ error: "Quiz JSON missing questions" });
    }

    return res.json(quizData);
  } catch (err) {
    console.error("❌ Quiz fetch error:", err);
    res.status(500).json({ error: "Server failed to load quiz" });
  }
});


// ------------------------------------------------------------
// ⭐ SUBMIT QUIZ (80% rule + completion date)
// ------------------------------------------------------------
app.post("/api/module/:id/submit", async (req, res) => {
  const { id } = req.params;
  const { student_id, score } = req.body;

  if (!student_id || score === undefined)
    return res.status(400).json({ error: "Missing student_id or score" });

  const passed = score >= 80 ? 1 : 0;

  try {
    await db.query(
      `INSERT INTO student_module_progress (student_id, module_id, score, is_completed, completed_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE score = VALUES(score), is_completed = VALUES(is_completed), completed_at = NOW()`,
      [student_id, id, score, passed]
    );

    res.json({ success: true, passed });
  } catch (err) {
    console.error("❌ Quiz submission error:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// ============================================================
// 🧪 INTERACTIVE LAB SYSTEM
// ============================================================

// ------------------------------------------------------------
// ⭐ GET ALL LABS + CHOICES
// ------------------------------------------------------------
app.get("/api/labs", async (req, res) => {
  try {
    const [labs] = await db.query(
      "SELECT lab_id, title, description, type, from_field, subject, content FROM labs ORDER BY lab_id ASC"
    );

    const [choices] = await db.query(
      "SELECT choice_id, lab_id, label, is_correct FROM lab_choices ORDER BY lab_id ASC"
    );

    const merged = labs.map(lab => ({
      ...lab,
      choices: choices.filter(c => c.lab_id === lab.lab_id),
    }));

    res.json(merged);
  } catch (err) {
    console.error('❌ Labs fetch error:', err);
    res.status(500).json({ error: 'Failed to load labs' });
  }
});



// ------------------------------------------------------------
// ⭐ SUBMIT LAB ATTEMPT
// ------------------------------------------------------------
app.post("/api/labs/attempt", async (req, res) => {
  try {
    const { student_id, lab_id, selected_choice_id } = req.body;

    if (!student_id || !lab_id || !selected_choice_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [choiceRows] = await db.query(
      "SELECT is_correct FROM lab_choices WHERE choice_id = ? AND lab_id = ?",
      [selected_choice_id, lab_id]
    );

    if (choiceRows.length === 0) {
      return res.status(404).json({ error: "Invalid choice for this lab" });
    }

    const is_correct = choiceRows[0].is_correct ? 1 : 0;

    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        lab_id INT NOT NULL,
        selected_choice_id INT NOT NULL,
        is_correct BOOLEAN,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(
      `INSERT INTO lab_attempts (student_id, lab_id, selected_choice_id, is_correct)
       VALUES (?, ?, ?, ?)`,
      [student_id, lab_id, selected_choice_id, is_correct]
    );

    res.json({ success: true, is_correct: !!is_correct });

  } catch (err) {
    console.error("❌ Lab attempt error:", err);
    res.status(500).json({ error: "Server error during lab submission" });
  }
});

// ============================================================
// 🚀 START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
