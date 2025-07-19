import { useContext } from "react"
import { UIContext } from "../../context/context"

const Reset = ({draw}) => {
  const { gameStillOn, winner, victoryCause, resetGame: reset, toggleGame} = useContext(UIContext)
  return (
    <>
      <button 
          onClick={toggleGame}>
              {winner === null ? (gameStillOn ? "Pause" : "Resume") : null}
              {!gameStillOn && winner !== null && victoryCause !== null ? (winner === "White" ? `${victoryCause}. White is vicrorious!` : `${victoryCause}. Black is victorious!`) : null}
              {draw && victoryCause ? `${victoryCause}. The game is a draw.` : null}
      </button>
      <button
          onClick={reset}>
              Reset Game
      </button>
    </>
  )
}

export default Reset