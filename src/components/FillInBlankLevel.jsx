    import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import goodJobMP3 from "../data/audio/good_job_marvin.mp3";
import tryAgainMP3 from "../data/audio/try_again_marvin.mp3";


const goodJobSound = new Howl({ src: [goodJobMP3] });
const tryAgainSound = new Howl({ src: [tryAgainMP3] });

function isMobileOrTablet() {
  return (
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) || window.innerWidth <= 900)
  );
}

function FillInBlankLevel({ data, onAnswer, completed, userAnswer }) {
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (userAnswer) {
      setInput(userAnswer.answer);
      setIsCorrect(userAnswer.correct);
      setDone(true);
    } else {
      setInput("");
      setIsCorrect(null);
      setDone(false);
    }
  }, [userAnswer]);

  useEffect(() => {
    if (!done && isMobileOrTablet() && inputRef.current) {
      inputRef.current.focus();
    }
  }, [done]);

  const checkAnswer = () => {
    const correct = data.correctAnswer.trim().toLowerCase();
    const user = input.trim().toLowerCase();
    const isRight = user === correct;
    setIsCorrect(isRight);
    setDone(true);
    if (onAnswer) onAnswer(isRight, input);
    if (isRight) {
      goodJobSound.play();
    } else {
      tryAgainSound.play();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setDone(false);
    setIsCorrect(null);
    // Do not call onAnswer(null) here
  };

  const renderSentence = () => {
    if (done && isCorrect) {
      return <span>{data.sentence.replace(/_{3,}|___|_+|\b___\b|\b_\b|\b_+\b|___/, data.correctAnswer)}</span>;
    }
    return <span>{data.sentence}</span>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p>{renderSentence()}</p>
      {!done && (
        <>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={done}
            style={{
              fontSize: "1.2rem",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1.5px solid #aaa",
              marginBottom: "12px",
              minWidth: "120px",
              textAlign: "center"
            }}
            placeholder={data.sentence.includes("___") ? "Type the missing word(s)" : ""}
          />
          <button onClick={checkAnswer} disabled={done || !input.trim()}>Check</button>
        </>
      )}
      {done && (
        <p style={{ textAlign: "center", width: "100%", marginTop: 12, fontWeight: "bold" }}>{isCorrect ? "✅ Correct!" : "❌ Try Again"}</p>
      )}
    </div>
  );
}

export default FillInBlankLevel; 