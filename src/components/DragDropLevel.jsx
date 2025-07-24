import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import DraggableWord from "./DraggableWord";
import { Howl } from "howler";
import goodJobMP3 from "../data/audio/good_job_marvin.mp3";
import tryAgainMP3 from "../data/audio/try_again_marvin.mp3";

const goodJobSound = new Howl({ src: [goodJobMP3] });
const tryAgainSound = new Howl({ src: [tryAgainMP3] });

function DragDropLevel({ data, onAnswer, completed, userAnswer }) {
  const [placedWords, setPlacedWords] = useState(Array(data.blanks.length).fill(""));
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (userAnswer) {
      const arr = Array.isArray(userAnswer.answer)
        ? userAnswer.answer
        : typeof userAnswer.answer === "string"
        ? userAnswer.answer.split(/, ?/)
        : [];
      setPlacedWords(arr.length === data.blanks.length ? arr : [...data.correctOrder]);
      setIsCorrect(userAnswer.correct);
      setDone(true);
    } else {
      setPlacedWords(Array(data.blanks.length).fill(""));
      setIsCorrect(null);
      setDone(false);
    }
  }, [userAnswer, data.blanks.length, data.correctOrder]);

  const handleDrop = (index, item) => {
    setPlacedWords(prev => {
      let newWords = prev.map((w, i) => (i !== index && w === item.word ? "" : w));
      newWords[index] = item.word;
      return newWords;
    });
    setDone(false);
    setIsCorrect(null);
    // Do not call onAnswer(null) here
  };

  const checkAnswer = () => {
    const correct = JSON.stringify(placedWords) === JSON.stringify(data.correctOrder);
    setIsCorrect(correct);
    setDone(true);
    if (onAnswer) onAnswer(correct, placedWords.join(", "));
    if (correct) {
      goodJobSound.play();
    } else {
      tryAgainSound.play();
    }
  };

  const isWordUsed = (word) => placedWords.includes(word);

  function renderSentence() {
    if (done && isCorrect) {
      let parts = data.sentenceTemplate.split(/(\[[^\]]+\])/g);
      let blankIdx = 0;
      return parts.map((part, i) => {
        if (/^\[[^\]]+\]$/.test(part)) {
          const word = data.correctOrder[blankIdx];
          blankIdx++;
          return <span key={i} style={{ fontWeight: 600 }}>{word}</span>;
        } else {
          return <span key={i}>{part}</span>;
        }
      });
    }
    let parts = data.sentenceTemplate.split(/(\[[^\]]+\])/g);
    let blankIdx = 0;
    return parts.map((part, i) => {
      if (/^\[[^\]]+\]$/.test(part)) {
        const idx = blankIdx;
        blankIdx++;
        return <DropZone key={i} index={idx} word={placedWords[idx]} onDrop={handleDrop} />;
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h3>Complete the sentence:</h3>
      <p style={{ fontSize: "1.2rem", marginBottom: 18, minHeight: 48, textAlign: "center" }}>
        {renderSentence()}
      </p>
      {!done && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px"
        }}>
          {data.draggableWords.map((word, i) => (
            <DraggableWord key={i} word={word} disabled={isWordUsed(word) || done} />
          ))}
        </div>
      )}
      <button onClick={checkAnswer} disabled={done}>Check</button>
      {done && <p style={{ textAlign: "center", width: "100%", marginTop: 12, fontWeight: "bold" }}>{isCorrect ? "✅ Correct!" : "❌ Try Again"}</p>}
    </div>
  );
}

function DropZone({ index, word, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "word",
    drop: (item) => onDrop(index, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <span
      ref={drop}
      style={{
        display: "inline-block",
        minWidth: "80px",
        minHeight: "40px",
        margin: "0 5px",
        padding: "8px",
        textAlign: "center",
        backgroundColor: isOver ? "#d1e7dd" : "#f0f0f0",
        border: "2px dashed #aaa",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "1.2rem"
      }}
    >
      {word || "____"}
    </span>
  );
}

export default DragDropLevel; 