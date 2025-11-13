// ============================================================
// 🧠 FraudShield Education Page – Full Working Single-File Version
// ============================================================
// - Each module includes its own resources and quiz
// - Quizzes are built in with correct answers marked
// - Passing a quiz (≥ 80 %) unlocks the next module
// ============================================================

import React, { useState, useEffect } from "react";
import "./Education.css";
import { submitQuiz } from "../api";

const Education = () => {
  const [modules] = useState([
    { id: 1, title: "Module 1 – Introduction to Online Fraud & Scams" },
    { id: 2, title: "Module 2 – Phishing and Email Scams" },
    { id: 3, title: "Module 3 – Phone & Text Message Scams" },
    { id: 4, title: "Module 4 – Fake Websites & Online Shopping Scams" },
    { id: 5, title: "Module 5 – Social Engineering & Impersonation Scams" },
    { id: 6, title: "Module 6 – Identity Theft & Account Security" },
    { id: 7, title: "Module 7 – Social Media & Misinformation Scams" },
    { id: 8, title: "Module 8 – Reporting Scams & Taking Action" },
    { id: 9, title: "Module 9 – Staying Safe in the Future" },
  ]);

  const [expanded, setExpanded] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [quizResults, setQuizResults] = useState({});

  const user = JSON.parse(localStorage.getItem("fraudshield_user"));
  const studentId = user?.student_id || 1;
  const studentEmail = user?.email || "Unknown User";

  useEffect(() => {
    const key = `fraudshield_progress_${studentId}`;
    const saved = JSON.parse(localStorage.getItem(key)) || [];
    setCompletedModules(saved);
  }, [studentId]);

  const saveProgress = (updated) => {
    setCompletedModules(updated);
    localStorage.setItem(`fraudshield_progress_${studentId}`, JSON.stringify(updated));
  };

  // ============================================================
  // 🔹 Articles / Videos per Module (updated with real links)
  // ============================================================
  const moduleData = {
    1: [
      { title: "Understanding Online Fraud: How Scammers Trick Everyday Users (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "Norton – Common Online Scams and How to Avoid Them", url: "https://us.norton.com/blog/emerging-threats/common-online-scams-and-how-to-avoid-them" },
      { title: "FTC – How Scams Work", url: "https://consumer.ftc.gov/articles/how-scams-work" },
      { title: "The Psychology of Scams — BBC Ideas", url: "https://www.youtube.com/watch?v=gTQ8kZ7A8KI" },
      { title: "What Is a Scam? — FTC", url: "https://www.youtube.com/watch?v=ZB6iJYzJp6Y" },
    ],
    2: [
      { title: "Spotting Phishing Emails: A Practical Guide (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "Google – Avoiding Phishing Scams", url: "https://support.google.com/mail/answer/8253?hl=en" },
      { title: "Microsoft – Recognize and Report Phishing Emails", url: "https://support.microsoft.com/en-us/office/protect-yourself-from-phishing-scams-0c7ea947-ba98-3bd9-8432-4f125e1b4b21" },
      { title: "What is Phishing? — Google Workspace Security Tips", url: "https://www.youtube.com/watch?v=kFeq7RqbEwE" },
      { title: "How Hackers Use Phishing Emails — BBC Newsnight", url: "https://www.youtube.com/watch?v=sWb7hjVekjE" },
    ],
    3: [
      { title: "How to Identify a Scam Call or Text (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "FCC – Stop Unwanted Robocalls and Texts", url: "https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts" },
      { title: "FTC – Avoiding Phone Scams", url: "https://consumer.ftc.gov/articles/phone-scams" },
      { title: "The Most Common Phone Scams — CNBC", url: "https://www.youtube.com/watch?v=V1eYniJ0Rnk" },
      { title: "Don’t Fall for Tech Support Scams — Microsoft", url: "https://www.youtube.com/watch?v=V_lQyLNWcF8" },
    ],
    4: [
      { title: "Spotting Fake Websites and Safe Online Shopping (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "Norton – How to Tell If a Website Is Legit", url: "https://us.norton.com/blog/emerging-threats/how-to-tell-if-a-website-is-legit" },
      { title: "BBB – Online Shopping Scams", url: "https://www.bbb.org/all/online-shopping-scams" },
      { title: "How to Check If a Website Is Real or Fake — The Cyber Nerd", url: "https://www.youtube.com/watch?v=CGKcImJZ1XQ" },
      { title: "Online Shopping Scams Explained — ABC News", url: "https://www.youtube.com/watch?v=a1YDs2E0Nys" },
    ],
    5: [
      { title: "How Scammers Manipulate Trust: The Art of Social Engineering (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "CISA – Avoiding Social Engineering Attacks", url: "https://www.cisa.gov/sites/default/files/publications/Cyber-Essentials-Social-Engineering-Attacks.pdf" },
      { title: "FBI – Business Email Compromise Scams", url: "https://www.fbi.gov/how-we-can-help-you/safety-resources/scams-and-safety/common-scams-and-crimes/business-email-compromise" },
      { title: "What Is Social Engineering? — Cisco", url: "https://www.youtube.com/watch?v=uvjgbcbRrF4" },
      { title: "Scammer Impersonates CEO — CNBC", url: "https://www.youtube.com/watch?v=kqV8aT8b1Mg" },
    ],
    6: [
      { title: "Protecting Your Identity and Personal Accounts (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "FTC – Identity Theft Basics", url: "https://consumer.ftc.gov/features/identity-theft" },
      { title: "AARP – Ways to Avoid Identity Theft", url: "https://www.aarp.org/money/scams-fraud/info-2019/avoid-identity-theft.html" },
      { title: "What Is Identity Theft? — FTC", url: "https://www.youtube.com/watch?v=sDStp3jKp3Q" },
      { title: "Password Security Tips — Google Safety", url: "https://www.youtube.com/watch?v=1xGyGqM0QDQ" },
    ],
    7: [
      { title: "How to Stay Safe from Social Media Scams (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "Meta – Avoiding Scams on Facebook", url: "https://www.facebook.com/help/212722115425932" },
      { title: "CISA – Spotting Misinformation", url: "https://www.cisa.gov/sites/default/files/publications/cisa_spot_the_scam_poster.pdf" },
      { title: "The Rise of Social Media Scams — BBC Panorama", url: "https://www.youtube.com/watch?v=PVx9ffOaD3I" },
      { title: "How to Verify Online Information — TED-Ed", url: "https://www.youtube.com/watch?v=UYc-hd1QswA" },
    ],
    8: [
      { title: "What to Do After You’ve Been Scammed (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "FTC – Report Fraud and Scams", url: "https://reportfraud.ftc.gov/" },
      { title: "USA.gov – Report Cybercrime", url: "https://www.usa.gov/report-cybercrime" },
      { title: "How to Report Scams — FTC", url: "https://www.youtube.com/watch?v=7iFjVYjm8nI" },
      { title: "Recovering from Identity Theft — FTC", url: "https://www.youtube.com/watch?v=fA3sQkNwNnI" },
    ],
    9: [
      { title: "Building a Cyber-Safe Routine for Life (🟡 Custom Article Placeholder)", url: "https://www.google.com" },
      { title: "CISA – Everyday Cybersecurity Tips", url: "https://www.cisa.gov/news-events/news/everyday-cybersecurity-tips" },
      { title: "NIST – Cybersecurity Basics", url: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-cybersecurity-resources/cybersecurity-basics" },
      { title: "Top 10 Cybersecurity Tips — Tech Insider", url: "https://www.youtube.com/watch?v=GZ_0DqJvnhE" },
      { title: "Future of Online Scams — Wall Street Journal", url: "https://www.youtube.com/watch?v=qHkwnbHYw4Q" },
    ],
  };

  // ============================================================
  // 🔹 Quizzes (unchanged)
  // ============================================================
  const quizzes = {
  1: [
    { q: "Which emotion do scammers most often try to exploit?", options: ["Joy", "Fear (correct answer)", "Relaxation", "Confidence"], correct: 1 },
    { q: "A message that says 'Your account will be deleted in 1 hour!' is using what tactic?", options: ["Urgency (correct answer)", "Flattery", "Humor", "Logic"], correct: 0 },
    { q: "Scammers often pretend to be:", options: ["A celebrity fan", "A trusted company or government official (correct answer)", "Someone from your neighborhood", "A random internet user"], correct: 1 },
    { q: "What’s the safest first step if you suspect a scam message?", options: ["Verify using an official website (correct answer)", "Reply asking for clarification", "Forward it to friends", "Delete without checking"], correct: 0 },
    { q: "Which of the following is a red flag?", options: ["Poor spelling and grammar in an official-looking email (correct answer)", "An email with your name spelled correctly", "A message from your bank after a transaction", "A company logo"], correct: 0 },
    { q: "Which phrase might indicate a scam?", options: ["Act now or lose access immediately! (correct answer)", "Please review this at your convenience.", "Here’s your meeting link.", "Attached are your records."], correct: 0 },
    { q: "The best definition of online fraud is:", options: ["Deceptive activity conducted online to gain money or personal information (correct answer)", "A technical error", "Online shopping", "Spam email"], correct: 0 },
    { q: "Which emotions are commonly manipulated by scammers?", options: ["Fear and Greed (correct answer)", "Humor and Joy", "Pride and Curiosity", "All of the above"], correct: 0 }
  ],
  2: [
    { q: "What does 'phishing' mean?", options: ["Tricking someone into revealing sensitive information (correct answer)", "Installing antivirus software", "Sending newsletters", "Buying security equipment"], correct: 0 },
    { q: "What should you check before clicking a link in an email?", options: ["The full URL by hovering over it (correct answer)", "The subject line", "The time it was sent", "The sender’s emoji usage"], correct: 0 },
    { q: "A phishing email often has:", options: ["A sense of urgency and a suspicious link (correct answer)", "No attachments", "A formal signature", "A funny meme"], correct: 0 },
    { q: "Which web address is most likely a scam?", options: ["https://paypal.com", "https://paypaI-support.com (correct answer)", "https://apple.com", "https://microsoft.com"], correct: 1 },
    { q: "The best way to verify a suspicious email is to:", options: ["Contact the company via their official site or number (correct answer)", "Reply to the email", "Click 'unsubscribe'", "Forward to coworkers"], correct: 0 },
    { q: "What’s the safest way to handle unexpected attachments?", options: ["Don’t open them until you verify the sender (correct answer)", "Download and scan later", "Open if it’s a PDF", "Trust them if they come from IT"], correct: 0 },
    { q: "What does HTTPS stand for?", options: ["HyperText Transfer Protocol Secure (correct answer)", "Hyper Transfer Text System", "High Transfer Technical Security", "Hyperlink Text Service"], correct: 0 },
    { q: "Why can link shorteners be risky?", options: ["They hide the true destination URL (correct answer)", "They’re slower", "They break links", "They’re only for ads"], correct: 0 }
  ],
  3: [
    { q: "What is a robocall?", options: ["An automated prerecorded phone message (correct answer)", "A prank call", "A local call", "A voice assistant"], correct: 0 },
    { q: "What’s a sign of a fake tech support call?", options: ["They claim your computer is infected and request remote access (correct answer)", "They ask you to restart", "They confirm an update", "They direct you to official pages"], correct: 0 },
    { q: "Which agency allows you to report phone scams?", options: ["FTC or FCC (correct answer)", "NASA", "IRS", "FBI only"], correct: 0 },
    { q: "If you receive a text with a suspicious link, what should you do?", options: ["Delete it without clicking (correct answer)", "Click it to see what it is", "Reply STOP", "Forward to others"], correct: 0 },
    { q: "If someone calls pretending to be your bank, you should:", options: ["Hang up and call your bank using a verified number (correct answer)", "Provide your account info", "Stay on the line", "Text them"], correct: 0 },
    { q: "What’s the best way to stop repeated scam calls?", options: ["Use a call-blocking app or your carrier’s spam filter (correct answer)", "Keep answering them", "Threaten legal action", "Change your number"], correct: 0 },
    { q: "Scammers asking for gift card payments are a red flag because:", options: ["Legitimate organizations never request payment via gift cards (correct answer)", "It’s faster", "It verifies identity", "It’s secure"], correct: 0 }
  ],
  4: [
    { q: "What does the padlock icon in your browser mean?", options: ["The website uses encryption (HTTPS) (correct answer)", "The website is 100% safe", "The site is popular", "It’s government approved"], correct: 0 },
    { q: "Which is the safest payment method online?", options: ["Credit card or secure payment platform (correct answer)", "Wire transfer", "Gift cards", "Crypto"], correct: 0 },
    { q: "What’s a sign a shopping site might be fake?", options: ["Unrealistically low prices or no contact info (correct answer)", "Customer reviews", "SSL certificate", "Refund policy"], correct: 0 },
    { q: "How can you verify an online seller?", options: ["Check independent reviews and contact info (correct answer)", "Look for deals", "Check domain only", "Use chat"], correct: 0 },
    { q: "What’s the safest action after buying from a suspected fake store?", options: ["Report to your bank and FTC immediately (correct answer)", "Wait for delivery", "Email the store", "Close browser"], correct: 0 },
    { q: "Why doesn’t HTTPS always guarantee safety?", options: ["Scammers can still get SSL certificates (correct answer)", "It’s old tech", "It’s expensive", "It means malware"], correct: 0 },
    { q: "Which is the safest shopping sign?", options: ["Verified payment processors and clear refund policies (correct answer)", "Pop-ups", "No contact page", "Super low prices"], correct: 0 }
  ],
  5: [
    { q: "Social engineering relies on:", options: ["Manipulating human trust (correct answer)", "Hacking software", "Stealing hardware", "Strong firewalls"], correct: 0 },
    { q: "What is 'pretexting'?", options: ["Creating a fake scenario to gain trust or info (correct answer)", "Encrypting messages", "Asking for texts", "Setting passwords"], correct: 0 },
    { q: "A common impersonation scam tactic is:", options: ["Pretending to be your boss requesting urgent info (correct answer)", "Asking for a meeting", "Sending a birthday card", "Liking your post"], correct: 0 },
    { q: "What’s the safest way to verify a request from a 'CEO'?", options: ["Contact them via official internal channels (correct answer)", "Reply quickly", "Follow instructions", "Copy others"], correct: 0 },
    { q: "The 'Authority' principle in scams means:", options: ["People obey requests from those they think are in charge (correct answer)", "People ignore rules", "Bosses don’t scam", "Only employees fall"], correct: 0 },
    { q: "What’s a social engineering red flag?", options: ["Pressure to act fast without verification (correct answer)", "A polite tone", "Friendly chat", "Scheduled meetings"], correct: 0 },
    { q: "Which can reduce social engineering risk?", options: ["Employee awareness training (correct answer)", "Newer laptops", "Wi-Fi strength", "Pop-up blockers"], correct: 0 }
  ],
  6: [
    { q: "Identity theft happens when:", options: ["Someone uses your personal info for fraud (correct answer)", "You change your name", "You move cities", "You delete accounts"], correct: 0 },
    { q: "Which password is strongest?", options: ["123456", "Password!", "r3d$L!ght_82# (correct answer)", "firstname123"], correct: 2 },
    { q: "Two-factor authentication helps by:", options: ["Requiring a second verification step to login (correct answer)", "Encrypting Wi-Fi", "Shortening passwords", "Sending ads"], correct: 0 },
    { q: "What’s the best response to a data breach alert?", options: ["Change your password and monitor accounts (correct answer)", "Ignore it", "Restart PC", "Wait for updates"], correct: 0 },
    { q: "What info should never be shared publicly?", options: ["Social Security or banking info (correct answer)", "Favorite color", "Age range", "Pet’s name"], correct: 0 },
    { q: "What’s a credit freeze?", options: ["Prevents new accounts being opened in your name (correct answer)", "Improves credit", "Deletes old debts", "Locks your bank account"], correct: 0 },
    { q: "What’s a good sign your account’s hacked?", options: ["Unknown logins or password reset emails (correct answer)", "Fewer messages", "Faster browser", "None"], correct: 0 },
    { q: "Safest place to store passwords:", options: ["Password manager (correct answer)", "Sticky note", "Screenshot", "Notebook"], correct: 0 }
  ],
  7: [
    { q: "A fake profile often has:", options: ["Few photos and generic posts (correct answer)", "Verified badge", "Friends you know", "Real-time videos"], correct: 0 },
    { q: "A 'too good to be true' giveaway is likely:", options: ["A scam to collect personal info (correct answer)", "A charity", "A government program", "A trend"], correct: 0 },
    { q: "What’s a good way to confirm if a post is real?", options: ["Fact-check using reliable sources (correct answer)", "Ask friends", "Count likes", "Trust emotional tone"], correct: 0 },
    { q: "Social media scams often ask you to:", options: ["Click external links or share info (correct answer)", "Like a photo", "Comment hashtags", "Watch a video"], correct: 0 },
    { q: "When a 'friend' asks for money, you should:", options: ["Verify through another channel before sending (correct answer)", "Send a little", "Block immediately", "Share their post"], correct: 0 },
    { q: "Why does misinformation spread quickly?", options: ["It triggers emotion and is shared fast (correct answer)", "It’s encrypted", "Platforms restrict it", "Only bots share it"], correct: 0 },
    { q: "To improve social media safety:", options: ["Use privacy settings and 2FA (correct answer)", "Accept all requests", "Use public Wi-Fi", "Share everything"], correct: 0 }
  ],
  8: [
    { q: "The first step after realizing you’ve been scammed:", options: ["Stop communication and secure accounts (correct answer)", "Delete email", "Tell no one", "Change devices"], correct: 0 },
    { q: "Where can U.S. residents report fraud online?", options: ["reportfraud.ftc.gov (correct answer)", "fakealert.gov", "reportscam.org", "mailto@ftc.gov"], correct: 0 },
    { q: "If you gave payment info to a scammer, do this:", options: ["Contact your bank immediately (correct answer)", "Wait a day", "Email scammer", "Post online"], correct: 0 },
    { q: "Reporting scams helps because:", options: ["It alerts authorities and protects others (correct answer)", "It refunds you instantly", "It deletes evidence", "It blocks scammers"], correct: 0 },
    { q: "Who else can you contact besides the FTC?", options: ["Local police or your financial institution (correct answer)", "Social media", "Tech support", "No one"], correct: 0 },
    { q: "What should you collect before filing a report?", options: ["Screenshots, receipts, and email evidence (correct answer)", "Verbal notes", "Browser history", "Nothing"], correct: 0 },
    { q: "After reporting, you should:", options: ["Monitor accounts for unusual activity (correct answer)", "Forget about it", "Delete everything", "Move banks"], correct: 0 }
  ],
  9: [
    { q: "Cyber hygiene means:", options: ["Regular safe digital habits (correct answer)", "Cleaning your keyboard", "Running Wi-Fi faster", "Installing games"], correct: 0 },
    { q: "Why update your software regularly?", options: ["It fixes security vulnerabilities (correct answer)", "Adds colors", "Deletes history", "Improves battery"], correct: 0 },
    { q: "Which password practice is safest?", options: ["Unique password for every account (correct answer)", "Same password for all", "Easy words", "Written on paper"], correct: 0 },
    { q: "Most secure network type:", options: ["Private, password-protected Wi-Fi (correct answer)", "Public café Wi-Fi", "Bluetooth tether", "Open hotspot"], correct: 0 },
    { q: "Sign of good digital awareness:", options: ["Checking sources before sharing (correct answer)", "Forwarding all posts", "Ignoring warnings", "Sharing credentials"], correct: 0 },
    { q: "To stay safe long-term:", options: ["Review privacy settings regularly (correct answer)", "Disable updates", "Ignore alerts", "Use defaults"], correct: 0 },
    { q: "Smart backup habit:", options: ["Use both cloud and offline backups (correct answer)", "Keep only one copy", "Email yourself files", "Skip backups"], correct: 0 },
    { q: "Which contributes to digital safety?", options: ["All of the above (correct answer)", "Strong passwords", "Regular updates", "Awareness of scams"], correct: 0 }
  ]
};


  const handleQuizSubmit = async (moduleId, moduleTitle, answers, quiz) => {
    const correct = quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const score = Math.round((correct / quiz.length) * 100);
    setQuizResults((prev) => ({ ...prev, [moduleId]: score }));

    if (score >= 80) {
      alert(`✅ You passed ${moduleTitle} with ${score}%. Next module unlocked!`);
      const updated = [...new Set([...completedModules, moduleId])];
      saveProgress(updated);
      try {
        await submitQuiz({ student_id: studentId, module_id: moduleId, score });
      } catch (err) {
        console.warn("⚠️ Backend sync failed:", err.message);
      }
    } else {
      alert(`❌ You scored ${score}%. You need 80% to unlock the next module.`);
    }
  };

  const progressPercent = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="education-page">
      <main className="main-content">
        <h1>🧠 Digital Safety 101: Protecting Yourself from Scams & Online Fraud</h1>
        <div className="progress-summary">
          <h3>👤 {studentEmail}</h3>
          <p>Progress: {completedModules.length} / {modules.length} Modules Completed</p>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="progress-percent">{progressPercent}% Complete</p>
        </div>

        <div className="module-list">
          {modules.map((mod, i) => {
            const isCompleted = completedModules.includes(mod.id);
            const prevCompleted = i === 0 || completedModules.includes(modules[i - 1]?.id);
            const unlocked = i === 0 || prevCompleted || isCompleted;

            return (
              <div key={mod.id} className={`module-card ${!unlocked ? "locked-module" : ""}`}>
                <div
                  className="module-header"
                  onClick={() => unlocked && setExpanded(expanded === mod.id ? null : mod.id)}
                  style={!unlocked ? { cursor: "not-allowed" } : {}}
                >
                  <h2>{mod.title}</h2>
                  <div className="module-status">
                    {!unlocked && <span className="locked">Locked</span>}
                    {expanded === mod.id && !isCompleted && unlocked && <span className="in-progress">In Progress</span>}
                    {isCompleted && <span className="completed">Completed</span>}
                  </div>
                </div>

                {expanded === mod.id && unlocked && (
                  <ModuleContent
                    moduleTitle={mod.title}
                    moduleId={mod.id}
                    moduleData={moduleData[mod.id]}
                    quiz={quizzes[mod.id]}
                    onSubmit={handleQuizSubmit}
                    score={quizResults[mod.id]}
                  />
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

const ModuleContent = ({ moduleTitle, moduleId, moduleData = [], quiz = [], onSubmit, score }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (i, choice) => setAnswers({ ...answers, [i]: choice });
  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(moduleId, moduleTitle, answers, quiz);
  };

  return (
    <div className="topics-section">
      <h3>Articles & Videos</h3>
      <ul className="activity-list">
        {moduleData.map((a, i) => (
          <li key={i}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={a.title.includes("🟡") ? "activity-link placeholder" : "activity-link"}
            >
              {a.title}
            </a>
          </li>
        ))}
      </ul>

      <h3>Module Quiz</h3>
      {quiz.map((q, i) => (
        <div key={i} className="quiz-question">
          <p><strong>Q{i + 1}:</strong> {q.q}</p>
          {q.options.map((opt, j) => (
            <label key={j} className="quiz-option">
              <input
                type="radio"
                name={`q${i}`}
                checked={answers[i] === j}
                onChange={() => handleSelect(i, j)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      {!submitted && <button onClick={handleSubmit} className="submit-btn">Submit Quiz</button>}
      {submitted && score !== undefined && (
        <p className={score >= 80 ? "pass" : "fail"}>
          Your Score: {score}% ({score >= 80 ? "Passed" : "Failed"})
        </p>
      )}
    </div>
  );
};

export default Education;
