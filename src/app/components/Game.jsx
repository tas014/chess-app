'use client'
import { useEffect, useState } from 'react'
import BoardComponent from './board/BoardComponent'
import GameClock from './PlayerMenu/PlayerMenu';
import Reset from './UI/Reset';
import SideMenu from './UI/SideMenu';
import styles from './Game.module.css'
import { isCheck } from './gameMechanics/pieceLogic';

const Game = () => {
    const [gameStillOn, setGameStillOn] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const [turn, setTurn] = useState(true);
    const [moveList, setMoveList] = useState([]);
    const [victoryCause, setVictoryCause] = useState(null);
    const [winner, setWinner] = useState(null);

    const resetGame = () => {
        setGameStillOn(true);
        setTurn(true);
        setWinner(null);
        setResetKey(resetKey + 1);
        setMoveList([]);
        setVictoryCause(null);
    }

    const addMoveToList = (newMove) => {
        const moveObject = {
            moveData: {
                from: newMove.from,
                to: newMove.to,
            },
            isCheck: newMove.isCheck,
            isCheckmate: newMove.isCheckmate,
            id: moveList.length + 1,
        }
        setMoveList([...moveList, moveObject]);
    }

    return (
        <section className={styles["main-container"]}>
            <div>
                <BoardComponent 
                    gameStillOn={gameStillOn} 
                    setGameStillOn={setGameStillOn}
                    turn={turn}
                    setTurn={setTurn}
                    addMoveToList={addMoveToList}
                    setWinner={setWinner}
                    setVictoryCause={setVictoryCause}
                    key={resetKey}
                />
                {winner && <h2>{winner} wins!</h2>}
            </div>
            <SideMenu 
                gameStillOn={gameStillOn}
                setGameStillOn={setGameStillOn} 
                turn={turn}
                winner={winner}
                movesList={moveList}
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