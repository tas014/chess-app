'use client'
import React, { useEffect, useState } from 'react';
import Board from '../gameMechanics/Board';
import Piece from '../gameMechanics/Pieces/Piece';

const BoardElement = ({gameStillOn}) => {
  const [event, setEvent] = useState(null);
  const [board, setBoard] = useState(new Board(setEvent));
  const [turn , setTurn] = useState(board.currentPlayer);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleClick = (x, y) => {
    if (!gameStillOn) return; // If the game is over or paused, do nothing
    const clickedSquare = board.position[x][y];
    if (selectedPiece) { // If a piece is selected...
      if (clickedSquare instanceof Piece) {
        if (clickedSquare.canBeTaken) { // If the clicked square is a piece that can be taken... 
          board.makeMove(selectedPiece.position, { x, y }); // Move the selected piece to that square
          setSelectedPiece(null); // And deselect the piece after moving
        }
        if (clickedSquare.color === selectedPiece.color && clickedSquare !== selectedPiece) { // If the clicked square is a piece of the same color but not the same piece... 
          setSelectedPiece(clickedSquare);// Select that piece...
          board.showMoves(clickedSquare); // And show its moves
        }
      } else if (clickedSquare.isLegalMove) {
        board.movePiece(selectedPiece, { x, y }); // Move the selected piece to the clicked square
        setSelectedPiece(null); // Deselect the piece after moving
        board.turn = !board.turn; // Switch the turn
      } else { // If the clicked square is not a legal move...
        setSelectedPiece(null); // Deselect the piece...
        board.clearMoves(); // And clear the moves from the board
      }
    } else if (clickedSquare instanceof Piece) { // If no piece is selected and the clicked square is a piece...
      if (clickedSquare.color === board.turn) { // If the clicked piece is of the correct color for the turn...
        setSelectedPiece(clickedSquare); // Select that piece...
        board.showMoves(clickedSquare); // And show its moves
      }
    }
    setBoard({...board}); // Update the board state to trigger a re-render
  }


  return (
    <div className='chessboard'>
      {board.position.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
            {row.map((cell, cellIndex) => {
              return (
                <div 
                  key={cellIndex} 
                  className={`chessboard-square ${(rowIndex + cellIndex) % 2 === 0 ? 'light' : 'dark'}-square`} 
                  onClick={() => handleClick(rowIndex, cellIndex)}>
                  {cell instanceof Piece ? cell.pieceIcon : <div className={`empty-square ${cell.isLegalMove ? "legal-move" : ""}`} />}
                </div>)
              }
            )}
          </div>)}
        )}
        <div className=''>

        </div>
    </div>
  )
}

export default BoardElement