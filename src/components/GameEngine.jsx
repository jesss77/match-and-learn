import React from "react";
import MCQLevel from "./MCQLevel";
import DragDropLevel from "./DragDropLevel";
import FillInBlankLevel from "./FillInBlankLevel";

function GameEngine({ level, onAnswer, completed, userAnswer }) {
  switch (level.type) {
    case "mcq":
      return <MCQLevel data={level} onAnswer={onAnswer} completed={completed} userAnswer={userAnswer} />;
    case "drag":
      return <DragDropLevel data={level} onAnswer={onAnswer} completed={completed} userAnswer={userAnswer} />;
    case "fill":
      return <FillInBlankLevel data={level} onAnswer={onAnswer} completed={completed} userAnswer={userAnswer} />;
    default:
      return <div>Unknown level type</div>;
  }
}

export default GameEngine; 