"use client";
import React from "react";
import styles from "./board.module.css";

const Piece = ({
  Content,
  color,
  position,
  wasTaken,
  boardSize,
  animationsOn,
}) => {
  const { x, y } = position;
  const squareSize = boardSize / 8; // Assuming boardSize is the total width
  const pieceSize = squareSize * 0.7; // Adjust size as needed
  const piecePadding = (squareSize - pieceSize) / 2; // Center the piece in the square
  const piecePositionValues = {
    top: x * squareSize + piecePadding,
    left: y * squareSize + piecePadding,
  };
  const inlineStyles = {
    top: `${piecePositionValues.top}px`,
    left: `${piecePositionValues.left}px`,
  };
  const animDirection = Math.random() > 0.5;
  const animVerticalMidpoint = !color
    ? piecePositionValues.top - 150
    : piecePositionValues.top + 30;
  const animHorizontalMidpoint = animDirection
    ? piecePositionValues.left + 100
    : piecePositionValues.left - 100;
  const animHorizontalEndpoint = animDirection
    ? animHorizontalMidpoint + 200
    : animHorizontalMidpoint - 200;
  const takenAnimationStyles = {
    "--taken-piece-position-top": inlineStyles.top,
    "--taken-piece-position-left": inlineStyles.left,
    "--taken-piece-top-midpoint": `${animVerticalMidpoint}px`,
    "--taken-piece-left-midpoint": `${animHorizontalMidpoint}px`,
    "--taken-piece-left-endpoint": `${animHorizontalEndpoint}px`,
  };

  const defineClassName = () => {
    if (wasTaken) {
      if (animationsOn) return styles.capturedPiece;
      return styles.hidePiece;
    }
    return "";
  };

  return (
    <div
      style={{ ...inlineStyles, ...takenAnimationStyles }}
      className={`${styles.pieceIcon} ${
        animationsOn ? styles.transition : ""
      } ${defineClassName()}`}
    >
      <Content
        color={color ? "#e8d8efff" : "black"}
        stroke={color ? "#A13ACA" : "#c0bfc0ff"}
        strokeWidth={15}
        strokeLinecap="round" // Makes the ends of the stroke round
        strokeLinejoin="round" // Makes the corners of the stroke round
      />
    </div>
  );
};

export default Piece;
