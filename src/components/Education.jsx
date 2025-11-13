import React, { useState } from "react";
import "./Education.css";

const Education = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [dashboardCourses, setDashboardCourses] = useState([
    "Course 1",
    "Course 2",
    "Course 3",
  ]);

  // Define modules for all courses
  const courseModules = {
    "Course 1": [
      {
        title: "Module 1: Introduction",
        topics: [
          {
            title: "Topic 1",
            content: "Overview and learning goals.",
            activities: ["Activity 1", "Activity 2", "Activity 3"],
          },
          {
            title: "Topic 2",
            content: "Guide on using this course effectively.",
            activities: ["Activity 1", "Activity 2"],
          },
          {
            title: "Topic 3",
            content: "Dive into the basics.",
            activities: ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
          },
        ],
      },
      {
        title: "Module 2: Core Principles",
        topics: [
          {
            title: "Topic 1",
            content: "Detailed breakdown of Concept A.",
            activities: ["Activity 1", "Activity 2"],
          },
          {
            title: "Topic 2",
            content: "Learn the details behind Concept B.",
            activities: ["Activity 1"],
          },
          {
            title: "Topic 3",
            content: "Exercises and challenges.",
            activities: ["Activity 1", "Activity 2", "Activity 3"],
          },
        ],
      },
    ],
    "Course 2": [
      {
        title: "Module 1: Overview",
        topics: [
          {
            title: "Topic 1",
            content: "Course 2 Topic 1 details.",
            activities: ["Activity 1", "Activity 2"],
          },
          {
            title: "Topic 2",
            content: "Course 2 Topic 2 details.",
            activities: ["Activity 1", "Activity 2", "Activity 3"],
          },
        ],
      },
    ],
    "Course 3": [
      {
        title: "Module 1: Getting Started",
        topics: [
          {
            title: "Topic 1",
            content: "Course 3 Topic 1 details.",
            activities: ["Activity 1"],
          },
        ],
      },
    ],
  };

  const openCourse = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
    setSelectedTopic(null);
  };

  const backToDashboard = () => {
    setSelectedCourse(null);
    setSelectedModule(null);
    setSelectedTopic(null);
  };

  const backToCourse = () => {
    setSelectedModule(null);
    setSelectedTopic(null);
  };

  const backToModule = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="education-page">
      <aside className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={backToDashboard}>Home</li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Dashboard */}
        {!selectedCourse && (
          <>
            <h1>Education Dashboard</h1>
            <div className="courses-grid">
              {dashboardCourses.map((course, index) => (
                <div
                  key={index}
                  className="course-card"
                  onClick={() => openCourse(course)}
                >
                  <span className="course-title">{course}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Course Overview */}
        {selectedCourse && !selectedModule && (
          <div className="course-page">
            <button className="back-btn" onClick={backToDashboard}>
              ← Back to Dashboard
            </button>
            <h1>{selectedCourse}</h1>
            <div className="module-list">
              {courseModules[selectedCourse]?.map((mod, index) => (
                <div
                  key={index}
                  className="module-card"
                  onClick={() => setSelectedModule(mod)}
                >
                  <h2>{mod.title}</h2>
                  <p>{mod.topics.length} Topics</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Page */}
        {selectedModule && !selectedTopic && (
          <div className="module-view">
            <button className="back-btn" onClick={backToCourse}>
              ← Back to {selectedCourse} Overview
            </button>
            <h2>{selectedModule.title}</h2>
            <div className="module-list">
              {selectedModule.topics.map((topic, idx) => (
                <div key={idx} className="module-card">
                  <h3>{topic.title}</h3>
                  <p>{topic.content}</p>
                  <ul className="activity-list">
                    {topic.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Page */}
        {selectedTopic && (
          <div className="subsection-content">
            <button className="back-to-module-btn" onClick={backToModule}>
              ← Back to {selectedModule.title}
            </button>
            <h2>{selectedTopic.title}</h2>
            <p>{selectedTopic.content}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Education;
