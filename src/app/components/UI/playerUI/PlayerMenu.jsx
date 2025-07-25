import styles from "./playerUI.module.css";
import { FaChessKing } from "react-icons/fa6";
import { FaFlag, FaHandshake } from "react-icons/fa6";
import GameContext from "../../../context/context";
import { useState, useContext } from "react";

const PlayerMenu = ({ color }) => {
  const {
    username,
    setUsername,
    whiteTime,
    blackTime,
    setVictoryCause,
    toggleGame,
    gameStillOn,
    setWinner,
    draw,
    setDraw,
    winner,
    turn,
  } = useContext(GameContext);
  const [forfeit, setForfeit] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleForfeit = () => {
    if (!gameStillOn) return;
    if (!forfeit) return setForfeit(true);
    toggleGame();
    setWinner(!color);
    setVictoryCause(
      `${username[color ? "white" : "black"]} has resigned. ${
        username[!color ? "white" : "black"]
      } is victorious!`
    );
  };

  const handleDrawOffer = () => {
    if (!gameStillOn) return;
    const drawKey = color ? "white" : "black";
    const newDrawObj = { ...draw };
    newDrawObj[drawKey] = !newDrawObj[drawKey];
    setDraw(newDrawObj);
    if (newDrawObj["white"] && newDrawObj["black"]) {
      toggleGame();
      setVictoryCause(
        "The players have come to an agreement. The game is a draw!"
      );
    }
  };

  const handleUsernameChange = () => {
    const changeTimer = 1000;
    let timerID = null;
    return (e) => {
      if (timerID) clearTimeout(timerID);
      timerID = setTimeout(() => {
        const newUsername = { ...username };
        newUsername[color ? "white" : "black"] = e.target.value;
        setUsername(newUsername);
      }, changeTimer);
    };
  };

  return (
    <div className={`${styles["player-menu-container"]} ${styles["mb-1"]}`}>
      <div className={`${styles["player-profile-container"]}`}>
        <FaChessKing color={color ? "#e8d8efff" : "black"} />
        <h3>
          <input
            type="text"
            defaultValue={color ? "White" : "Black"}
            onChange={handleUsernameChange()}
          />
        </h3>
      </div>
      <div
        className={`${styles["player-menu-interactables-container"]} ${styles["mb-1"]}`}
      >
        <div
          className={`${styles["player-clock"]} ${
            color ? styles["white-clock"] : styles["black-clock"]
          } ${
            turn !== color ? styles["inactive-clock"] : styles["active-clock"]
          }`}
        >
          <span>{formatTime(color ? whiteTime : blackTime)}</span>
        </div>
        <div className={`${styles["player-actions-container"]}`}>
          <button
            className={forfeit ? styles["is-forfeiting"] : ""}
            onClick={handleForfeit}
          >
            <FaFlag />
          </button>
          <button
            className={
              draw[color ? "white" : "black"] ? styles["is-offering-draw"] : ""
            }
            onClick={handleDrawOffer}
          >
            <FaHandshake />
          </button>
        </div>
      </div>
      <div className={`${styles["player-menu-drawing-message"]}`}>
        <span>
          {draw[color ? "white" : "black"] && winner === null
            ? draw["white"] && draw["black"]
              ? `${username[color ? "white" : "black"]} agreed to a draw.`
              : `${username[color ? "white" : "black"]} is offering a draw.`
            : "-"}
        </span>
      </div>
    </div>
  );
};

export default PlayerMenu;
