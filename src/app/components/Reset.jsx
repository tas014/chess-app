const Reset = ({gameStillOn, setGameStillOn}) => {
  return (
    <button 
        onClick={() => setGameStillOn(!gameStillOn)}>
            {gameStillOn ? "Pause" : "Resume"}
    </button>
  )
}

export default Reset