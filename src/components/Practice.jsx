import React, { useState } from "react";
import "./Practice.css";

// Sample courses/modules structure (can be imported from Education.jsx later)
const courseModules = {
  "Course 1": [
    { title: "Module 1: Introduction", subsections: ["Topic A", "Topic B"] },
    { title: "Module 2: Core Principles", subsections: ["Topic C", "Topic D"] },
  ],
  "Course 2": [
    { title: "Module 1: Intro to Course 2", subsections: ["Topic E", "Topic F"] },
    { title: "Module 2: Advanced Concepts", subsections: ["Topic G", "Topic H"] },
  ],
  "Course 3": [
    { title: "Module 1: Intro to Course 3", subsections: ["Topic I", "Topic J"] },
    { title: "Module 2: Applications", subsections: ["Topic K", "Topic L"] },
  ],
};

const Practice = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [studyMethod, setStudyMethod] = useState("");

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedModule("");
    setSelectedTopic("");
    setStudyMethod("");
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    setSelectedTopic("");
    setStudyMethod("");
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setStudyMethod("");
  };

  const handleStudyMethodChange = (method) => {
    setStudyMethod(method);
  };

  return (
    <div className="practice-page">
      <h1>Practice Hub</h1>
      <p>Select the course, module, and topic you want to study, then choose a study method.</p>

      {/* Course Selection */}
      <div className="practice-section">
        <label htmlFor="course-select">Course:</label>
        <select id="course-select" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">-- Select Course --</option>
          {Object.keys(courseModules).map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* Module Selection */}
      {selectedCourse && (
        <div className="practice-section">
          <label htmlFor="module-select">Module:</label>
          <select id="module-select" value={selectedModule} onChange={handleModuleChange}>
            <option value="">-- Select Module --</option>
            {courseModules[selectedCourse].map((mod, idx) => (
              <option key={idx} value={mod.title}>{mod.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Topic Selection */}
      {selectedModule && (
        <div className="practice-section">
          <label htmlFor="topic-select">Topic:</label>
          <select id="topic-select" value={selectedTopic} onChange={handleTopicChange}>
            <option value="">-- Select Topic --</option>
            {courseModules[selectedCourse]
              .find((mod) => mod.title === selectedModule)
              .subsections.map((topic, idx) => (
                <option key={idx} value={topic}>{topic}</option>
              ))}
          </select>
        </div>
      )}

      {/* Study Method Selection */}
      {selectedTopic && (
        <div className="practice-section">
          <p>Select Study Method:</p>
          <button
            className={studyMethod === "flashcards" ? "active-method" : ""}
            onClick={() => handleStudyMethodChange("flashcards")}
          >
            Flashcards
          </button>
          <button
            className={studyMethod === "practiceExam" ? "active-method" : ""}
            onClick={() => handleStudyMethodChange("practiceExam")}
          >
            Practice Exam
          </button>
        </div>
      )}

      {/* Summary */}
      {studyMethod && (
        <div className="practice-summary">
          <h2>Ready to Study!</h2>
          <p>
            Course: <strong>{selectedCourse}</strong><br/>
            Module: <strong>{selectedModule}</strong><br/>
            Topic: <strong>{selectedTopic}</strong><br/>
            Method: <strong>{studyMethod === "flashcards" ? "Flashcards" : "Practice Exam"}</strong>
          </p>
          <button className="start-study-btn">Start Studying</button>
        </div>
      )}
    </div>
  );
};

export default Practice;
