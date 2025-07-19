'use client'
import styles from "./playerUI.module.css"
import GameContext from "../../../context/context"
import { useContext } from "react"

const Notation = () => {
  const { movesList } = useContext(GameContext)
  const notation = (moves, isCheck, isCheckmate) => {
    // from and to = {value, row, col}
    const {from, to} = moves;
    let isPawn = false;
    const translateCoordToNotation = (row, col) => {
        const letters = "abcdefgh";
        const numbers = "87654321";
        return `${letters[col]}${numbers[row]}`;
    }
    const getPieceNotation = (move, queeningPiece = false) => {
      const {val, x, y} = move;
      const absSquareContent = Math.abs(val);
      switch (queeningPiece ? Math.abs(queeningPiece) : absSquareContent) {
        case 1:
        case 7:
        case 21:
        case 27:
          isPawn = true;
          return translateCoordToNotation(x, y);
        case 3:
        case 23:
            return "N";
        case 4:
        case 24:
          return "B";
        case 5:
        case 6:
        case 25:
        case 26:
          return "R";
        case 9:
        case 29:
          return "Q";
        case 10:
        case 30:
        case 8:
        case 28:
          return "K";

        default:
          return false;
      }
    }
    const fromPiece = getPieceNotation(from);
    const toPiece = getPieceNotation(to);
    const landingSquare = translateCoordToNotation(to.x, to.y);
    if (to.event === "castlesShort") return `O-O${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
    if (to.event === "castlesLong") return `O-O-O${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
    if (to.event === "promotion") return `${toPiece ? fromPiece[0]+"x"+landingSquare : landingSquare}=${getPieceNotation(to, to.queeningValue)}${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
    if (to.event === "enPassant") return `${fromPiece[0]}x${translateCoordToNotation(from.x, to.y)}${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
    return `${fromPiece[0]}${isPawn && !toPiece ? landingSquare[1] : (!toPiece ? landingSquare : "x"+landingSquare) }${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
  }

  return (
    <div className={styles['moves-list-container']}>
      <h3 className={styles['mb-1']}>Notation</h3>
      <ul className={styles['moves-list']}>
        {movesList.length > 0 ? 
          movesList.map(({moveData, isCheck, isCheckmate}, ind) => <li key={ind}>{notation(moveData, isCheck, isCheckmate)}</li>) : 
          <span>notation moves will appear here.</span> 
        }
      </ul>
    </div>
  )
}

export default Notation