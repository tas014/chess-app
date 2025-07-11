'use client'
import PlayerMenu from "../../PlayerMenu/PlayerMenu"
import Reset from "../Reset";
import { useState, useEffect } from "react";
import styles from "./sideMenu.module.css";

const SideMenu = ({gameStillOn, setGameStillOn ,turn, winner, movesList, reset, toggleGame, setWinner, victoryCause, setVictoryCause}) => {
    const initialTime = 300; // 5 minutes in seconds
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [whiteResign, setWhiteResign] = useState(false);
    const [blackResign, setBlackResign] = useState(false);
    const [draw, setDraw] = useState(false);
    const [whiteDraw, setWhiteDraw] = useState(false);
    const [blackDraw, setBlackDraw] = useState(false);
    const [resetKey, setResetKey] = useState(1);

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

    useEffect(() => {
        if (whiteResign) {
            handleResign(true);
        }
        if (blackResign) {
            handleResign(false);
        }
    }, [whiteResign, blackResign])

    const handleResign = color => {
        const winnerColor = !color ? "Black" : "White";
        setGameStillOn(false);
        setVictoryCause(`${winnerColor} has resigned`);
    }

    const offerDraw = color => {
        if (color) {
            if (!whiteDraw) {
                setWhiteDraw(true);
                if (blackDraw) {
                    setGameStillOn(false);
                    setDraw(true);
                    setVictoryCause("Draw by agreement.")
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
        setResetKey(resetKey + 1);
        setWhiteResign(false);
        setBlackResign(false);
        setGameStillOn(true);
        reset();
    }

    const notation = (moves, isCheck, isCheckmate) => {
        // from and to = {value, row, col}
        const {from, to} = moves;
        let isPawn = false;
        const translateCoordToNotation = (row, col) => {
            const letters = "abcdefgh";
            const numbers = "87654321";
            return `${letters[col]}${numbers[row]}`;
        }
        const getPieceNotation = (move, queeningPiece = false) => {
            const {val, x, y} = move;
            const absSquareContent = Math.abs(val);
            switch (queeningPiece ? Math.abs(queeningPiece) : absSquareContent) {
                case 1:
                case 7:
                case 21:
                case 27:
                    isPawn = true;
                    return translateCoordToNotation(x, y);
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
        const toPiece = getPieceNotation(to);
        const landingSquare = translateCoordToNotation(to.x, to.y);
        if (to.event === "castlesShort") return `O-O${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
        if (to.event === "castlesLong") return `O-O-O${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
        if (to.event === "promotion") return `${toPiece ? fromPiece[0]+"x"+landingSquare : landingSquare}=${getPieceNotation(to, to.queeningValue)}${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
        if (to.event === "enPassant") return `${fromPiece[0]}x${translateCoordToNotation(from.x, to.y)}${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
        return `${fromPiece[0]}${isPawn && !toPiece ? landingSquare[1] : (!toPiece ? landingSquare : "x"+landingSquare) }${isCheckmate ? "#" : ""}${isCheck && !isCheckmate ? "+" : ""}`;
    }
        
    
    return (
        <div className="side-menu">
            <PlayerMenu 
                color={"black"}
                time={blackTime}
                resign={blackResign}
                setResign={setBlackResign}
                offerDraw={()=>offerDraw(false)}
                key={resetKey}
            />
            {movesList.length > 0 && 
                <ul className={styles["notation-container"]}>
                    {movesList.map(({id, moveData, isCheck, isCheckmate}) => <li key={id}>{notation(moveData, isCheck, isCheckmate)}</li>)}
                </ul>}
            <Reset toggleGame={toggleGame} reset={resetGame} gameStillOn={gameStillOn} winner={winner} victoryCause={victoryCause} offerDraw={draw} />
            {victoryCause && <h2>{victoryCause}</h2>}
            <PlayerMenu 
                color={"white"}
                time={whiteTime}
                resign={whiteResign}
                setResign={setWhiteResign}
                offerDraw={()=>offerDraw(true)}
                key={-(resetKey)}
            />
        </div>
    )
}

export default SideMenu