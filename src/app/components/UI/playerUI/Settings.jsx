import styles from "./playerUI.module.css";
import GameContext from "../../../context/context";
import { useContext } from "react";

const Settings = () => {
  const {
    resetGame,
    startingIncrement,
    startingTime,
    setStartingTime,
    setStartingIncrement,
    animationsOn,
    setAnimationsOn,
  } = useContext(GameContext);

  const handleIncrementChange = (e) => {
    const value = parseInt(e.target.value);
    if (typeof value !== "number" || !value) return;
    if (value < 0) return setStartingIncrement(0);
    if (value > 300) return setStartingIncrement(300);
    setStartingIncrement(value);
  };

  const handleStartingTimeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 0 || typeof value !== "number" || !value)
      return setStartingTime(0);
    if (value > 3600) return setStartingTime(3600);
    setStartingTime(value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    resetGame();
  };

  return (
    <div className={styles["settings-container"]}>
      <h3 className={styles["mb-1"]}>Settings</h3>
      <form className={styles["settings"]} onSubmit={handleReset}>
        <div className={styles["animation-toggle-container"]}>
          <h5>Animations</h5>
          <div className={styles["checkbox-wrapper-5"]}>
            <div className={styles["check"]}>
              <input
                name="check"
                id="check-5"
                type="checkbox"
                checked={animationsOn}
                onChange={() => setAnimationsOn((prev) => !prev)}
              />
              <label htmlFor="check-5">Animations</label>
            </div>
          </div>
        </div>
        <div className={styles["time-format-container"]}>
          <h5>Time Format</h5>
          <div>
            <label htmlFor="time">Time (in seconds):</label>
            <input
              type="number"
              name="time"
              id="time"
              value={startingTime}
              onChange={handleStartingTimeChange}
            />
          </div>
          <div>
            <label htmlFor="increment">Increment (in seconds):</label>
            <input
              type="number"
              name="increment"
              id="increment"
              value={startingIncrement}
              onChange={handleIncrementChange}
            />
          </div>
        </div>
        <button>Restart Game</button>
      </form>
    </div>
  );
};

export default Settings;
