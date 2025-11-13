// ============================================================
// 🧩 FraudShield Quiz Component – Fixed Version
// ============================================================
// - Displays quiz questions for each module
// - Shows correct answers (for testing)
// - Calls onComplete(score) so Education.jsx can unlock next module
// ============================================================

import React, { useState } from "react";
import { submitQuiz } from "../api";

const Quiz = ({ studentId, moduleId, moduleTitle, onComplete }) => {
  // 🧮 Simple test quizzes for module_id 1–9 (migrating to DB later)
  const quizzes = {
    1: [
      { q: "Which emotion do scammers most often try to exploit?", options: ["Joy", "Fear", "Relaxation", "Confidence"], correct: 1 },
      { q: "A message that says 'Your account will be deleted in 1 hour!' is using what tactic?", options: ["Urgency", "Flattery", "Humor", "Logic"], correct: 0 },
      { q: "Scammers often pretend to be:", options: ["A celebrity fan", "A trusted company or government official", "Someone from your neighborhood", "A random internet user"], correct: 1 },
      { q: "What’s the safest first step if you suspect a scam message?", options: ["Verify using an official website", "Reply asking for clarification", "Forward it to friends", "Delete without checking"], correct: 0 },
      { q: "Which of the following is a red flag?", options: ["Poor spelling and grammar in an official-looking email", "An email with your name spelled correctly", "A message from your bank after a transaction", "A company logo"], correct: 0 },
      { q: "Which phrase might indicate a scam?", options: ["Act now or lose access immediately!", "Please review this at your convenience.", "Here’s your meeting link.", "Attached are your records."], correct: 0 },
      { q: "The best definition of online fraud is:", options: ["Deceptive activity conducted online to gain money or personal information", "A technical error", "Online shopping", "Spam email"], correct: 0 },
      { q: "Which emotions are commonly manipulated by scammers?", options: ["Fear and Greed", "Humor and Joy", "Pride and Curiosity", "All of the above"], correct: 0 }
    ],
    // … modules 2–9 unchanged …
  };

  const questions = quizzes[moduleId] || [];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // ------------------------------------------------------------
  // 🔹 Record selected answers
  // ------------------------------------------------------------
  const handleSelect = (index, choice) => {
    setAnswers({ ...answers, [index]: choice });
  };

  // ------------------------------------------------------------
  // 🔹 Handle quiz submission and send score to backend + parent
  // ------------------------------------------------------------
  const handleSubmit = async () => {
    const correctCount = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
      0
    );
    const newScore = Math.round((correctCount / questions.length) * 100);
    setScore(newScore);
    setSubmitted(true);

    try {
      const res = await submitQuiz({
        student_id: studentId,
        module_id: moduleId,
        score: newScore,
      });

      console.log("🧩 Quiz submit response:", res);

      // ✅ Notify parent either way, so UI updates immediately
      onComplete(newScore);

      if (newScore >= 80) {
        alert(`✅ You passed ${moduleTitle} with ${newScore}%.`);
      } else {
        alert(`❌ You scored ${newScore}%. You need at least 80%.`);
      }
    } catch (err) {
      console.error("❌ Error submitting quiz:", err);
    }
  };

  // ------------------------------------------------------------
  // 🔹 Show results summary
  // ------------------------------------------------------------
  if (submitted)
    return (
      <div className="quiz-results">
        <h3>Your Score: {score}%</h3>
        {score >= 80 ? (
          <p className="pass">✅ You passed! Next module unlocked.</p>
        ) : (
          <p className="fail">❌ Try again to score 80% or higher.</p>
        )}
      </div>
    );

  // ------------------------------------------------------------
  // 🔹 Render quiz questions (with correct answers visible)
  // ------------------------------------------------------------
  return (
    <div className="quiz-container">
      <h3>Quiz: {moduleTitle}</h3>
      {questions.length === 0 ? (
        <p>No quiz available for this module yet.</p>
      ) : (
        questions.map((q, i) => (
          <div key={i} className="quiz-question">
            <p><strong>Q{i + 1}:</strong> {q.q}</p>
            {q.options.map((opt, j) => (
              <label key={j} className="quiz-option" style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={answers[i] === j}
                  onChange={() => handleSelect(i, j)}
                />
                {opt}
                {j === q.correct && " (correct answer)"}
              </label>
            ))}
          </div>
        ))
      )}
      <button onClick={handleSubmit} className="submit-btn">
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
