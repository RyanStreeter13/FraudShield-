// ============================================================
// 🌐 api.js — Frontend API Client for FraudShield
// ============================================================

const API_BASE_URL = "http://localhost:5000"; // Backend URL

// ============================================================
// 👤 AUTH ROUTES
// ============================================================

// Register new user (backend route is /register)
export async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Registration failed");
  }

  return await response.json();
}

// Keep compatibility alias
export { register as signup };

// Login existing user
export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return await response.json();
}

// ============================================================
// 🎓 COURSE ROUTES
// ============================================================

export async function getCourses() {
  const response = await fetch(`${API_BASE_URL}/api/courses`);
  if (!response.ok) throw new Error("Failed to load courses");
  return await response.json();
}

export async function getModules(courseId) {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}/modules`);
  if (!response.ok) throw new Error("Failed to load modules");
  return await response.json();
}

// ============================================================
// 🧩 PROGRESS + QUIZ ROUTES
// ============================================================

export async function getStudentProgress(studentId, courseId) {
  const response = await fetch(
    `${API_BASE_URL}/api/student/${studentId}/progress?course_id=${courseId}`
  );
  if (!response.ok) throw new Error("Failed to fetch student progress");
  return await response.json();
}

export async function submitQuiz(data) {
  console.log("➡️ sending quiz to backend:", data);
  const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("❌ submitQuiz backend error:", body);
    throw new Error(body.error || "Quiz submission failed");
  }

  console.log("✅ submitQuiz backend response:", body);
  return body;
}

// ============================================================
// 🧠 INTERACTIVE LAB ROUTES
// ============================================================

export async function getLabs() {
  const response = await fetch(`${API_BASE_URL}/api/labs`);
  if (!response.ok) throw new Error("Failed to load labs");
  return await response.json();
}

export async function submitLabAttempt(data) {
  const response = await fetch(`${API_BASE_URL}/api/labs/attempt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Lab attempt failed");
  return body;
}

