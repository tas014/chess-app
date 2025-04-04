'use client'
import { useState } from 'react'
import Board from './board/Board'

const Game = () => {
    const [gameStillOn, setGameStillOn] = useState(true);
    const [turn, setTurn] = useState(true);
    return (
        <div>
            <Board 
                gameStillOn={gameStillOn} 
                setGameStillOn={setGameStillOn}
                turn={turn}
                setTurn={setTurn}
                setPromotionEvent={setPromotionEvent}
            />
        </div>
    )
}

export default Game