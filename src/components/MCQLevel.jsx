import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import goodJobMP3 from "../data/audio/good_job_marvin.mp3";
import tryAgainMP3 from "../data/audio/try_again_marvin.mp3";

const goodJobSound = new Howl({ src: [goodJobMP3] });
const tryAgainSound = new Howl({ src: [tryAgainMP3] });

function MCQLevel({ data, onAnswer, completed, userAnswer }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (userAnswer) {
      setSelected(userAnswer.answer);
      setIsCorrect(userAnswer.correct);
      setDone(true);
    } else {
      setSelected(null);
      setIsCorrect(null);
      setDone(false);
    }
  }, [userAnswer]);

  const handleSelect = (option) => {
    if (done) return;
    const correct = option === data.correctAnswer;
    setIsCorrect(correct);
    setSelected(option);
    setDone(true);
    if (onAnswer) {
      onAnswer(correct, option);
    }
    if (correct) {
      goodJobSound.play();
    } else {
      tryAgainSound.play();
    }
  };

  const renderSentence = () => {
    if (done && isCorrect) {
      return <span>{data.sentence.replace(/_{3,}|___|_+|\b___\b|\b_\b|\b_+\b|___/, data.correctAnswer)}</span>;
    }
    return <span>{data.sentence}</span>;
  };

  return (
    <div>
      <p>{renderSentence()}</p>
      {data.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleSelect(opt)}
          disabled={done}
          style={
            (selected === opt && done)
              ? userAnswer && userAnswer.correct && opt === data.correctAnswer
                ? { background: '#b2ffb2', color: '#222' }
                : userAnswer && !userAnswer.correct && selected === opt
                  ? { background: '#ffd6d6', color: '#222' }
                  : { background: '#e0e0e0', color: '#222' }
              : {}
          }
        >
          {opt}
        </button>
      ))}
      {done && (
        <p style={{ textAlign: "center", width: "100%", marginTop: 12, fontWeight: "bold" }}>
          {isCorrect ? "✅ Correct!" : "❌ Try Again"}
        </p>
      )}
    </div>
  );
}

export default MCQLevel;
