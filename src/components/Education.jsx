import React, { useState } from "react";
import "./Education.css";

const Education = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dashboardCourses, setDashboardCourses] = useState([
    "General Cybersecurity & Fraud Detection",
    "Fraud Detection & Financial Crimes",
    "Data Analysis & Machine Learning for Fraud",
  ]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const totalSpots = 6;

  // All available courses to add
  const allCourses = [
    "General Cybersecurity & Fraud Detection",
    "Fraud Detection & Financial Crimes",
    "Data Analysis & Machine Learning for Fraud",
    "Computer Science Fundamentals",
    "Scam Recognition & Phishing Awareness",
    "Ethical Hacking Basics",
    "Advanced Python Programming"
  ];

  // Click a course card to open it
  const openCourse = (course) => {
    setSelectedCourse(course);
  };

  const backToDashboard = () => {
    setSelectedCourse(null);
  };

  // Open Add Course modal
  const openAddCourseModal = () => {
    setShowAddCourseModal(true);
  };

  const closeAddCourseModal = () => {
    setShowAddCourseModal(false);
  };

  // Add course to dashboard
  const addCourseToDashboard = (course) => {
    if (!dashboardCourses.includes(course)) {
      setDashboardCourses([...dashboardCourses, course]);
    }
    closeAddCourseModal();
  };

  return (
    <div className="education-page">
      {/* Sidebar Menu */}
      <aside className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={() => { setActiveSection("home"); setSelectedCourse(null); }}>Home</li>
          <li onClick={() => setActiveSection("courses")}>Courses</li>
          <li onClick={() => setActiveSection("practice")}>Practice</li>
          <li onClick={() => setActiveSection("profile")}>Profile</li>
          <li onClick={() => setActiveSection("settings")}>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Course page */}
        {selectedCourse ? (
          <div className="course-page">
            <button className="back-btn" onClick={backToDashboard}>← Back to Dashboard</button>
            <h1>{selectedCourse}</h1>
            <p>Course content would appear here...</p>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeSection === "home" && (
              <>
                <h1>Education Dashboard</h1>
                <p>Click a course to continue learning or add new courses.</p>

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

                  {/* Add Course card */}
                  {dashboardCourses.length < totalSpots && (
                    <div className="course-card empty" onClick={openAddCourseModal}>
                      <span className="plus">+</span>
                      <span className="add-text">Add Course</span>
                    </div>
                  )}
                </div>

                {/* Add Course Modal */}
                {showAddCourseModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h2>Select a Course to Add</h2>
                      <button className="close-btn" onClick={closeAddCourseModal}>×</button>
                      <ul className="available-courses">
                        {allCourses
                          .filter(course => !dashboardCourses.includes(course))
                          .map((course, index) => (
                            <li key={index}>
                              <button onClick={() => addCourseToDashboard(course)}>{course}</button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection === "courses" && (
              <>
                <h1>Available Courses</h1>
                <ul className="course-list-center">
                  {allCourses.map((course, index) => (
                    <li key={index}>
                      <a href="#">{course}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeSection === "practice" && <h1>Practice (Coming Soon)</h1>}
            {activeSection === "profile" && <h1>Profile (Coming Soon)</h1>}
            {activeSection === "settings" && <h1>Settings (Coming Soon)</h1>}
          </>
        )}
      </main>
    </div>
  );
};

export default Education;
