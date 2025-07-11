import React from 'react'
import styles from './board.module.css';

const Piece = ({Content, color, position, wasTaken, boardSize}) => {
    const { x, y } = position;
    const squareSize = boardSize / 8; // Assuming boardSize is the total width
    const pieceSize = squareSize * 0.7; // Adjust size as needed
    const piecePadding = (squareSize - pieceSize) / 2; // Center the piece in the square
    const inlineStyles = {
        top: `${x * squareSize + piecePadding}px`,
        left: `${y * squareSize + piecePadding}px`,
        opacity: wasTaken ? 0 : 1,
    }
    return (
        <div style={inlineStyles} className={`${styles.pieceIcon}`}>
            <Content  
                color={color ? 'white' : 'black'} 
            />
        </div>
    )
}

export default Piece