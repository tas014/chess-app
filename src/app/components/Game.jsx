'use client'
import { useEffect, useState } from 'react'
import BoardComponent from './board/BoardComponent'
import GameClock from './Clocks/GameClock';
import Reset from './Reset';

const Game = () => {
    const initialTime = 300;
    const [gameStillOn, setGameStillOn] = useState(true);
    const [turn, setTurn] = useState(true);
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        let intervalID;
        const tickRate = 1000; // 1 second
        if (gameStillOn) {
            if (turn) {
                intervalID = setInterval(()=> {
                    setWhiteTime(prevTime => {
                        const newTime = prevTime - 1;
                        if (newTime <= 0 && !winner) {
                            setWinner("Black");
                            setGameStillOn(false);
                        }
                        return newTime
                    });
                }, tickRate)
            } else {
                intervalID = setInterval(()=> {
                    setBlackTime(prevTime => {
                        const newTime = prevTime - 1;
                        if (newTime <= 0 && !winner) {
                            setWinner("White");
                            setGameStillOn(false);
                        }
                        return newTime
                    });
                }, tickRate)
            }
        }
        return () => clearInterval(intervalID);
    },[gameStillOn, turn])

    return (
        <section>
            <GameClock 
                color={"black"}
                time={blackTime}
            />
            <BoardComponent 
                gameStillOn={gameStillOn} 
                setGameStillOn={setGameStillOn}
                turn={turn}
                setTurn={setTurn}
            />
            <GameClock 
                color={"white"}
                time={whiteTime}
            />
            <Reset gameStillOn={gameStillOn} setGameStillOn={setGameStillOn} />
            {winner && <h2>{winner} wins!</h2>}
        </section>
    )
}

export default Game