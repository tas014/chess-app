"use client";
import GameContext from "../context/context";
import { useState, useCallback, useEffect } from "react";
import BoardComponent from "./board/BoardComponent";
import PlayerUIContainer from "./UI/playerUI/PlayerUIContainer";
import Notation from "./UI/playerUI/Notation";
import Settings from "./UI/playerUI/Settings";
import MobileTab from "./header/MobileTab";
import styles from "./Game.module.css";
import {
  FaChessKnight,
  FaChessBishop,
  FaChessPawn,
  FaChessRook,
  FaChessQueen,
} from "react-icons/fa6";

const Game = ({
  mobileOpen,
  setMobileOpen,
  gameStillOn,
  setGameStillOn,
  winner,
  setWinner,
  preventResume,
  setPreventResume,
}) => {
  const [startingTime, setStartingTime] = useState(300);
  const [startingIncrement, setStartingIncrement] = useState(0);
  const [increment, setIncrement] = useState(startingIncrement);
  const initialTakenPieces = [
    {
      icon: FaChessBishop,
      amount: 0,
      color: true,
    },
    {
      icon: FaChessKnight,
      amount: 0,
      color: true,
    },
    {
      icon: FaChessRook,
      amount: 0,
      color: true,
    },
    {
      icon: FaChessQueen,
      amount: 0,
      color: true,
    },
    {
      icon: FaChessPawn,
      amount: 0,
      color: true,
    },
    {
      icon: FaChessBishop,
      amount: 0,
      color: false,
    },
    {
      icon: FaChessKnight,
      amount: 0,
      color: false,
    },
    {
      icon: FaChessRook,
      amount: 0,
      color: false,
    },
    {
      icon: FaChessQueen,
      amount: 0,
      color: false,
    },
    {
      icon: FaChessPawn,
      amount: 0,
      color: false,
    },
  ];
  const [resetKey, setResetKey] = useState(0);
  const [turn, setTurn] = useState(true);
  const [movesList, setmovesList] = useState([]);
  const [victoryCause, setVictoryCause] = useState(null);
  const [takenPieces, setTakenPieces] = useState([...initialTakenPieces]);
  const [whiteTime, setWhiteTime] = useState(startingTime);
  const [blackTime, setBlackTime] = useState(startingTime);
  const [draw, setDraw] = useState({
    white: false,
    black: false,
  });
  const [username, setUsername] = useState({
    white: "White",
    black: "Black",
  });
  const [animationsOn, setAnimationsOn] = useState(true);

  useEffect(() => {
    let intervalID;
    const tickRate = 1000; // 1 second
    if (gameStillOn) {
      if (turn) {
        intervalID = setInterval(() => {
          setWhiteTime((prevTime) => {
            const newTime = prevTime - 1;
            if (newTime <= 0 && winner === null) {
              setGameStillOn(false);
              setWinner(!turn);
              setVictoryCause(
                `White's time is up. ${username["black"]} is victorious!`
              );
            }
            return newTime;
          });
        }, tickRate);
      } else {
        intervalID = setInterval(() => {
          setBlackTime((prevTime) => {
            const newTime = prevTime - 1;
            if (newTime <= 0 && winner === null) {
              setGameStillOn(false);
              setWinner(!turn);
              setVictoryCause(
                `Black's time is up. ${username["white"]} is victorious!`
              );
            }
            return newTime;
          });
        }, tickRate);
      }
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [turn, gameStillOn]);

  const resetGame = () => {
    setWinner(null);
    setmovesList([]);
    setVictoryCause(null);
    setTakenPieces([...initialTakenPieces]);
    setIncrement(startingIncrement);
    setBlackTime(startingTime);
    setWhiteTime(startingTime);
    setDraw({
      white: false,
      black: false,
    });
    setGameStillOn(true);
    setTurn(true);
    setResetKey(resetKey + 1);
  };

  const addMoveToList = (newMove) => {
    const moveObject = {
      moveData: {
        from: newMove.from,
        to: newMove.to,
      },
      isCheck: newMove.isCheck,
      isCheckmate: newMove.isCheckmate,
      id: movesList.length + 1,
    };
    setmovesList([...movesList, moveObject]);
  };

  const gameContextValues = {
    username,
    gameStillOn,
    turn,
    winner,
    movesList,
    victoryCause,
    takenPieces,
    draw,
    whiteTime,
    blackTime,
    increment,
    startingIncrement,
    startingTime,
    animationsOn,
    setUsername,
    setGameStillOn,
    setTurn,
    setWinner,
    resetGame,
    toggleGame: () => setGameStillOn((prev) => !prev),
    addMoveToList,
    setVictoryCause,
    setTakenPieces,
    setDraw,
    setStartingIncrement,
    setStartingTime,
    setWhiteTime,
    setBlackTime,
    setAnimationsOn,
  };

  return (
    <section className={styles["main-container"]}>
      <GameContext.Provider value={gameContextValues}>
        <PlayerUIContainer color={false} key={`abc${resetKey}`}>
          <Settings />
        </PlayerUIContainer>
        <div className={styles["board-container"]}>
          <BoardComponent
            mobileOpen={mobileOpen}
            setPreventResume={setPreventResume}
            key={resetKey}
          />
        </div>
        <PlayerUIContainer color={true} key={resetKey}>
          <Notation />
        </PlayerUIContainer>
        {mobileOpen && (
          <MobileTab
            setMobileOpen={setMobileOpen}
            setGameStillOn={setGameStillOn}
            winner={winner}
            preventResume={preventResume}
          />
        )}
      </GameContext.Provider>
    </section>
  );
};

export default Game;
