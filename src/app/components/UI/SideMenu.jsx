'use client'
import PlayerMenu from "../PlayerMenu/PlayerMenu"
import Reset from "./Reset";
import { useState, useEffect } from "react";

const SideMenu = ({gameStillOn, setGameStillOn ,turn, winner, movesList, reset, toggleGame, setWinner, victoryCause, setVictoryCause}) => {
    const initialTime = 300; // 5 minutes in seconds
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [whiteResign, setWhiteResign] = useState(false);
    const [blackResign, setBlackResign] = useState(false);
    const [draw, setDraw] = useState(false);
    const [whiteDraw, setWhiteDraw] = useState(false);
    const [blackDraw, setBlackDraw] = useState(false);

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
                            toggleGame();
                            setVictoryCause("White's time is up")
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
                            toggleGame();
                            setVictoryCause("Black's time is up")
                        }
                        return newTime
                    });
                }, tickRate)
            }
        }
        return () => clearInterval(intervalID);
    },[gameStillOn, turn])

    const handleResign = color => {
        const winnerColor = !color ? "Black" : "White";
        setGameStillOn(false);
        setVictoryCause(`${color} has resigned`);
    }

    const offerDraw = color => {
        if (color) {
            if (!whiteDraw) {
                setWhiteDraw(true);
                if (blackDraw) {
                    setGameStillOn(false);
                    setDraw(true);
                    setVictoryCause("The players have come to an agreement")
                }
            } else {
                setWhiteDraw(false);
            }
        } else {
            if (!blackDraw) {
                setBlackDraw(true);
                if (whiteDraw) {
                    setGameStillOn(false);
                    setDraw(true);
                    setVictoryCause("The players have come to an agreement")
                }
            } else {
                setBlackDraw(false);
            }
        }
    }

    const resetGame = () => {
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
        setDraw(false);
        setWhiteDraw(false);
        setBlackDraw(false);
        resetGame();
    }

    const notation = (moves, isCheck, isCheckmate) => {
        const {from, to} = moves;
        let isPawn = false;
        const translateCoordToNotation = (row, col) => {
            const letters = "abcdefgh";
            const numbers = "12345678";
            return `${letters[row]}${numbers[col]}`;
        }
        const getPieceNotation = move => {
            const {value, row, col} = move;
            const absSquareContent = Math.abs(value);
            switch (absSquareContent) {
                case 1:
                case 7:
                case 21:
                case 27:
                    isPawn = true;
                    return translateCoordToNotation(row, col);
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
        if (to.event === "castlesShort") return `O-O${isCheck ? (isCheckmate ? "#" : "+") : ""}`;
        if (to.event === "castlesLong") return `O-O-O${isCheck ? (isCheckmate ? "#" : "+") : ""}`;
        if (to.event === "promotion") return `${fromPiece[0]}${getPieceNotation(to) ? `x${getPieceNotation(to)}` : ""}=${getPieceNotation(to)}${isCheck ? (isCheckmate ? "#" : "+") : ""}`;
        return `${isPawn ? fromPiece[0] : fromPiece}${getPieceNotation(to) ? `x${getPieceNotation(to)}` : ""}${isCheck ? (isCheckmate ? "#" : "+") : ""}`;
    }
        
    
    return (
        <div className="side-menu">
            <PlayerMenu 
                color={"black"}
                time={blackTime}
                resign={blackResign}
                setResign={setBlackResign}
                offerDraw={()=>offerDraw(false)}
            />
            {movesList.length > 0 && 
                <ul>
                    {movesList.map(move => <li key={move.id}>{notation(move.moveData, move.isCheck, move.isCheckmate)}</li>)}
                </ul>}
            <Reset toggleGame={toggleGame} reset={resetGame} gameStillOn={gameStillOn} winner={winner} victoryCause={victoryCause} offerDraw={draw} />
            <PlayerMenu 
                color={"white"}
                time={whiteTime}
                resign={whiteResign}
                setResign={setWhiteResign}
                offerDraw={()=>offerDraw(true)}
            />
        </div>
    )
}

export default SideMenu