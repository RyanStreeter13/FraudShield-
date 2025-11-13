// src/components/Resources.jsx
import React, { useEffect, useState } from "react";
import "./Resources.css";
import { getLabs, submitLabAttempt } from "../api";

const Resources = ({ user }) => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [choiceId, setChoiceId] = useState(null);
  const [result, setResult] = useState(null);
  const [labStatus, setLabStatus] = useState({});

  const student = JSON.parse(localStorage.getItem("fraudshield_user")) || user || {};
  const studentId = student?.student_id || 1;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getLabs();
        const saved = JSON.parse(localStorage.getItem("fraudshield_labStatus")) || {};
        setLabStatus(saved);
        setLabs(data);
      } catch (e) {
        console.error("Failed to load labs:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openLab = (lab) => {
    setSelected(lab);
    setChoiceId(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!choiceId) return alert("Pick an answer first.");

    let isCorrect = false;
    try {
      const res = await submitLabAttempt({
        student_id: studentId,
        lab_id: selected.lab_id,
        selected_choice_id: choiceId,
      });
      isCorrect = res.is_correct;
      setResult(isCorrect ? "correct" : "incorrect");
    } catch (err) {
      console.error("Error submitting lab attempt:", err);
      alert("Server error. See console.");
    }

    const updated = {
      ...labStatus,
      [selected.lab_id]: isCorrect ? "correct" : "incorrect",
    };
    setLabStatus(updated);
    localStorage.setItem("fraudshield_labStatus", JSON.stringify(updated));
  };

  if (loading) return <div className="resources-page">Loading labs...</div>;

  return (
    <div className="resources-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Labs</h2>
        <ul>
          {labs.map((lab) => {
            const status = labStatus[lab.lab_id];
            return (
              <li
                key={lab.lab_id}
                onClick={() => openLab(lab)}
                className={`
                  ${selected?.lab_id === lab.lab_id ? "active" : ""}
                  ${status === "correct" ? "lab-correct" : ""}
                  ${status === "incorrect" ? "lab-incorrect" : ""}
                `}
              >
                {lab.title}
                {status === "correct" && " ✅"}
                {status === "incorrect" && " ❌"}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main */}
      <main className="main-content">
        <h1>Interactive Labs</h1>
        {!selected ? (
          <div className="lab-list">
            <p>Select a lab from the left to begin.</p>
          </div>
        ) : (
          <div className="lab-card">
            <h2>{selected.title}</h2>
            <p className="lab-desc">{selected.description}</p>

            {/* Email-style lab */}
            {selected.type === "email" && (
              <div className="lab-email">
                <div className="email-header">
                  From: accounts@secure-payments.example
                </div>
                <div className="email-subject">
                  Subject: Urgent — Reset your password now
                </div>
                <div className="email-body">
                  <p>Hi,</p>
                  <p>
                    We detected suspicious activity on your account. To keep
                    your funds safe, please reset your password immediately by
                    clicking this link:
                  </p>
                  <p>
                    <strong>Reset Link:</strong>{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      http://secure-payments.example/reset?token=12345
                    </a>
                  </p>
                  <p>Failure to act within 24 hours will result in account suspension.</p>
                  <p>Regards,<br />Secure Payments Team</p>
                </div>
              </div>
            )}

            {/* SMS-style lab */}
            {selected.type === "sms" && (
              <div className="lab-sms">
                <div className="sms-bubble">
                  <p>
                    🚨 [Bank Alert]: Suspicious login detected. Verify your
                    account immediately or your card will be locked.
                  </p>
                  <p>
                    🔗{" "}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      http://bankverify-login-secure.info
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Choices */}
            <div className="lab-choices">
              <h3>Which element is the suspicious red flag?</h3>
              {selected.choices.map((c) => (
                <label
                  key={c.choice_id}
                  className={`lab-choice ${
                    choiceId === c.choice_id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="choice"
                    checked={choiceId === c.choice_id}
                    onChange={() => setChoiceId(c.choice_id)}
                  />
                  {c.label}
                </label>
              ))}
            </div>

            <div className="lab-actions">
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
              <button className="cancel-btn" onClick={() => setSelected(null)}>
                Back
              </button>
            </div>

            {result && (
              <div
                className={`lab-result ${
                  result === "correct" ? "pass" : "fail"
                }`}
              >
                {result === "correct"
                  ? "✅ Correct — that was the scam indicator!"
                  : "❌ Incorrect — look for urgency, misspellings, or fake links."}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
