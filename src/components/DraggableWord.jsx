import React from "react";
import { useDrag } from "react-dnd";

function DraggableWord({ word, disabled }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "word",
      item: { word },
      canDrag: !disabled,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [disabled]
  );

  return (
    <span
      ref={disabled ? null : drag}
      style={{
        padding: "10px 16px",
        margin: "8px",
        backgroundColor: "#ffcc80",
        borderRadius: "15px",
        border: "2px solid #ffa726",
        cursor: disabled ? "not-allowed" : "grab",
        opacity: disabled ? 0.3 : isDragging ? 0.5 : 1,
        fontWeight: "bold",
        fontSize: "1.1rem"
      }}
    >
      {word}
    </span>
  );
}

export default DraggableWord; 