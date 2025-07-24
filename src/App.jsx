import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GameEngine from "./components/GameEngine";
import levels from "./data/levels.json";
import logo from "./logo.svg";
import { Howl } from "howler";

// Sound effects
const clickSound = new Howl({ src: ["/sounds/click.mp3"] });

const Brand = ({ onClick }) => (
  <div
    style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer", userSelect: "none" }}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label="Go to home"
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
  >
    <img
      src={logo}
      alt="Match & Learn Logo"
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        marginRight: 14,
        boxShadow: "0 1px 4px #0002",
        objectFit: "cover",
        background: "#fff"
      }}
    />
    <span style={{
      fontWeight: 700,
      fontSize: "1.7rem",
      letterSpacing: 2,
      color: "#fff",
      fontFamily: "Comic Sans MS, Arial Rounded MT Bold, sans-serif"
    }}>
      Match & Learn
    </span>
  </div>
);

function App() {
  const [screen, setScreen] = useState("welcome");
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelKey, setLevelKey] = useState(0); // for forcing re-mount
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const CODE_REQUIRED = "000";
  const [userAnswers, setUserAnswers] = useState(() => Array(levels.length).fill(null)); // {answer, correct}

  // Score is the number of correct answers
  const score = userAnswers.filter(ans => ans && ans.correct).length;

  useEffect(() => {
    // Reset answer for this level on restart
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[levelIndex] = null;
      return updated;
    });
    // eslint-disable-next-line
  }, [levelKey]);

  const startGame = () => {
    if (code === CODE_REQUIRED) {
      setScreen("game");
      setCodeError("");
    } else {
      setCodeError("Incorrect code. Please try again.");
    }
  };
  const goToNext = () => { clickSound.play(); setLevelIndex((i) => Math.min(i + 1, levels.length)); };
  const goToPrev = () => { clickSound.play(); setLevelIndex((i) => Math.max(i - 1, 0)); };
  // When a level is restarted, reset its answer and recalculate score
  const restartLevel = () => {
    clickSound.play();
    setLevelKey((k) => k + 1);
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[levelIndex] = null;
      return updated;
    });
  };
  const goHome = () => {
    clickSound.play();
    setScreen("welcome");
    setLevelIndex(0);
    setUserAnswers(Array(levels.length).fill(null));
  };

  const isFirst = levelIndex === 0;
  const isLast = levelIndex === levels.length - 1;
  const navBarHeight = 60;
  const isSummary = levelIndex === levels.length;

  // Track if the user has answered the current level
  const hasAnswered = !!userAnswers[levelIndex];

  // When the user answers, always update userAnswers and recalculate score
  const handleAnswer = (isCorrect, answer) => {
    setUserAnswers(prev => {
      const updated = [...prev];
      updated[levelIndex] = { answer, correct: !!isCorrect };
      return updated;
    });
  };

  // Show summary at the end
  if (isSummary) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        <nav style={{
          width: "100%",
          background: "#4caf50",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: navBarHeight,
          margin: 0,
          padding: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #0001"
        }}>
          <div style={{ fontWeight: 700, fontSize: "1.7rem", letterSpacing: 2 }}>
            Match & Learn — Summary
          </div>
        </nav>
        <div style={{ paddingTop: navBarHeight + 32, maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ color: "#4caf50", textAlign: "center" }}>Your Score: {score} / {levels.length}</h2>
          <h3 style={{ marginTop: 32 }}>Questions you got wrong:</h3>
          <ul style={{ fontSize: "1.1rem" }}>
            {userAnswers.map((ans, i) =>
              ans && !ans.correct ? (
                <li key={i} style={{ marginBottom: 12 }}>
                  <strong>Level {i + 1}:</strong> {levels[i].sentence || levels[i].sentenceTemplate}<br />
                  <span style={{ color: "#d32f2f" }}>Your answer: {ans.answer || <em>none</em>}</span><br />
                  <span style={{ color: "#388e3c" }}>Correct answer: {levels[i].correctAnswer || (levels[i].correctOrder && levels[i].correctOrder.join(", "))}</span>
                </li>
              ) : null
            )}
            {userAnswers.filter(ans => ans && !ans.correct).length === 0 && (
              <li style={{ color: "#388e3c" }}>You got all questions correct! 🎉</li>
            )}
          </ul>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={() => { setLevelIndex(0); setUserAnswers(Array(levels.length).fill(null)); setScreen("welcome"); }} style={{ fontSize: "1.1rem" }}>Restart Game</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        {/* Nav Bar */}
        <nav style={{
          width: "100%",
          background: "#4caf50",
          color: "white",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: navBarHeight,
          margin: 0,
          padding: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px #0001"
        }}>
          <div style={{ marginLeft: 24 }}>
            <Brand onClick={goHome} />
          </div>
          <div style={{ marginRight: 32, fontWeight: 600, fontSize: "1.1rem", letterSpacing: 1 }}>
            Score: {score} / {levels.length}
          </div>
        </nav>

        {/* Main Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: `calc(100vh - ${navBarHeight}px)`,
          paddingTop: navBarHeight + 8 // less padding for higher start
        }}>
          {screen === "welcome" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
              <h1 style={{ color: "#4caf50", fontSize: "2.5rem", marginBottom: 16 }}>Welcome to Match & Learn!</h1>
              <p style={{ fontSize: "1.3rem", textAlign: "center", maxWidth: 500 }}>
                Practice building sentences step by step.<br />Enter the 3-digit code to start learning!
              </p>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 3)); setCodeError(""); }}
                placeholder="_ _ _"
                style={{
                  fontSize: "1.3rem",
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "2px solid #4caf50",
                  marginBottom: 10,
                  width: 80,
                  textAlign: "center",
                  letterSpacing: 4
                }}
                maxLength={3}
                inputMode="numeric"
              />
              <button
                onClick={startGame}
                style={{ fontSize: "1.2rem", marginTop: 10, width: 120 }}
                disabled={code.length !== 3}
              >
                Start Game
              </button>
              {codeError && <p style={{ color: "#d32f2f", marginTop: 8, fontWeight: "bold" }}>{codeError}</p>}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
              {/* Removed duplicate page title here */}
              <div style={{ margin: "20px 0 10px 0", fontWeight: "bold", fontSize: "1.2rem" }}>
                Level {levelIndex + 1} of {levels.length}
              </div>
              {levels[levelIndex].image && (
                <img
                  src={`${process.env.PUBLIC_URL}${levels[levelIndex].image}`}
                  alt="Level"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: 260,
                    width: 'auto',
                    margin: '0 auto 0 auto',
                    borderRadius: 12,
                    boxShadow: "0 2px 12px #0002"
                  }}
                />
              )}
              <div style={{ width: "100%", maxWidth: 520, background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px #0001", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 12 }}>
                <GameEngine
                  key={levelKey + '-' + levelIndex}
                  level={levels[levelIndex]}
                  onAnswer={handleAnswer}
                  completed={userAnswers[levelIndex] && userAnswers[levelIndex].correct}
                  userAnswer={userAnswers[levelIndex]}
                />
              </div>
              <div style={{
                marginTop: 30,
                display: "flex",
                justifyContent: "center",
                gap: 0,
                width: "100%",
                alignItems: "center"
              }}>
                <div style={{
                  background: "#f0f0f0",
                  borderRadius: 16,
                  boxShadow: "0 2px 8px #0001",
                  padding: "12px 24px",
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  width: "fit-content",
                  margin: "0 auto"
                }}>
                  <button onClick={goToPrev} disabled={isFirst} style={navBtnStyle}>Previous</button>
                  <button onClick={restartLevel} style={navBtnStyle}>Restart</button>
                  <button onClick={goToNext} disabled={isSummary || !hasAnswered} style={navBtnStyle}>Next</button>
                </div>
              </div>
              {isLast && (
                <div style={{ marginTop: 40, fontSize: "1.2rem", color: "#4caf50" }}>
                  🎉 You finished all the levels! 🎉
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

const navBtnStyle = {
  background: "#fff",
  color: "#4caf50",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  marginLeft: 2,
  marginRight: 2,
  transition: "0.2s",
};

export default App; 