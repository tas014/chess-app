'use client'
import styles from './board.module.css';
import { FaChessKnight, FaChessBishop, FaChessPawn, FaChessRook, FaChessKing, FaChessQueen } from "react-icons/fa6";

const BoardSquare = ({ onSquareClick, squareID, styleData, pos, boardData }) => {
  const squareColor = styleData ? styles.lightSquare : styles.darkSquare;

  const setContent = (row, square) => {
    const squareContent = boardData[row][square];
    const absSquareContent = Math.abs(squareContent);

    if (absSquareContent === 20 || absSquareContent === 70) {
      return getVisualPiece('legalMove');
    } else {
      switch (absSquareContent) {
        case 0:
          return
        case 1:
        case 7:
        case 21:
        case 27:
          return getVisualPiece('pawn', squareContent > 0);
        case 3:
        case 23:
          return getVisualPiece('knight', squareContent > 0);
        case 4:
        case 24:
          return getVisualPiece('bishop', squareContent > 0);
        case 5:
        case 6:
        case 25:
        case 26:
          return getVisualPiece('rook', squareContent > 0);
        case 9:
        case 29:
          return getVisualPiece('queen', squareContent > 0);
        case 10:
        case 30:
        case 8:
        case 28:
          return getVisualPiece('king', squareContent > 0);

        default:
          break;
      }
    }
  }

  const getVisualPiece = (pieceName, color) => {

    switch (pieceName) {
      case 'queen':
        return (<FaChessQueen className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'king':
        return (<FaChessKing className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'knight':
        return (<FaChessKnight className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'bishop':
        return (<FaChessBishop className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'rook':
        return (<FaChessRook className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'pawn':
        return (<FaChessPawn className={styles.pieceIcon} color={color ? 'white' : 'black'} />);
      case 'legalMove':
        return (<div className={styles.legalMove} />);

      default:
        break;
    }
  }

  const takeablePiece = squareValue => {
    if (squareValue > 20 && squareValue <= 30) {
      return true
    }
    return false
  }

  return (
    <td 
    className={`${squareColor} ${takeablePiece(Math.abs(boardData[pos.x][pos.y])) ? styles.takeable : styles.square}`} 
    onClick={e => onSquareClick(e.currentTarget)} 
    id={squareID}>
      {setContent(pos.x, pos.y)}
    </td>
  )
}

export default BoardSquare