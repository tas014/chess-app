'use client'
import styles from './board.module.css';

const BoardSquare = ({ squareID, callback, selectedPiece, squareColor, takeable, isLegalMove }) => {
  return (
    <div 
      className={`${squareColor} ${takeable ? styles.takeable : styles.square} ${selectedPiece ? styles.selected : ''}`} 
      onClick={e => callback(e.currentTarget)} 
      id={squareID}>
        {isLegalMove ? <div className={styles.legalMove} /> : null}
    </div>
  )
}

export default BoardSquare