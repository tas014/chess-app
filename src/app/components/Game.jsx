'use client'
import { useEffect, useState } from 'react'
import BoardComponent from './board/BoardComponent'
import GameClock from './PlayerMenu/PlayerMenu';
import Reset from './UI/Reset';
import SideMenu from './UI/SideMenu';
import styles from './Game.module.css'

const Game = () => {
    const [gameStillOn, setGameStillOn] = useState(true);
    const [reset, setReset] = useState(false);
    const [turn, setTurn] = useState(true);
    const [lastMove, setLastMove] = useState(null);
    const [victoryCause, setVictoryCause] = useState(null);
    const [winner, setWinner] = useState(null);

    const resetGame = () => {
        setGameStillOn(true);
        setTurn(true);
        setWinner(null);
        setReset(true);
    }

    return (
        <section className={styles["main-container"]}>
            <div>
                <BoardComponent 
                    gameStillOn={gameStillOn} 
                    setGameStillOn={setGameStillOn}
                    turn={turn}
                    setTurn={setTurn}
                    reset={reset}
                    triggerReset={setReset}
                    setLastMove={setLastMove}
                />
                {winner && <h2>{winner} wins!</h2>}
            </div>
            {/* gameStillOn, turn, winner, move, prevMove, resetGame, pauseGame, setWinner, setGameStillOn, setReset */}
            <SideMenu 
                gameStillOn={gameStillOn}
                setGameStillOn={setGameStillOn} 
                turn={turn}
                winner={winner}
                lastMove={lastMove}
                movesList={[]}
                reset={resetGame}
                toggleGame={() => setGameStillOn(!gameStillOn)}
                setWinner={setWinner}
                victoryCause={victoryCause}
                setVictoryCause={setVictoryCause}
            />
        </section>
    )
}

export default Game