const Reset = ({toggleGame, reset, gameStillOn, winner, victoryCause, draw}) => {
  return (
    <button 
        onClick={toggleGame}>
            {winner === null ? (gameStillOn ? "Pause" : "Resume") : null}
            {!gameStillOn && winner !== null && victoryCause !== null ? (winner === "White" ? `${victoryCause}. White is vicrorious!` : `${victoryCause}. Black is victorious!`) : null}
            {draw && victoryCause ? `${victoryCause}. The game is a draw.` : null}
    </button>
  )
}

export default Reset