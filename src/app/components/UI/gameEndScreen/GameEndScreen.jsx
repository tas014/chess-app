'use client'
import { FaCrown } from "react-icons/fa"
import { LuSwords } from "react-icons/lu"
import styles from "./styles.module.css"
import GameContext from "../../../context/context"
import { useContext, useState } from "react"

const GameEndScreen = () => {
  const { resetGame, victoryCause, winner } = useContext(GameContext);
  const cause = victoryCause ? victoryCause.split(".") : null;
  const [showModal, setShowModal] = useState(true);
  return (
    <div className={`${styles['end-screen-container']} ${showModal ? styles.visible : ''}`}>
      <div>
        <div className={styles['end-screen-content']}>
          <div className={winner === null ? styles["draw-icon"] : ''}>
            {winner !== null ? <FaCrown /> : <LuSwords />}
          </div>
          <h3>{cause[0]}.<br />{cause[1]}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
        <button className={styles['close-button']} onClick={() => {setShowModal(false)}}>x</button>
      </div>
    </div>
  )
}

export default GameEndScreen