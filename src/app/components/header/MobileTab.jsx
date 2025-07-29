"use client";
import styles from "./styles.module.css";
import Settings from "../UI/playerUI/Settings";
import Notation from "../UI/playerUI/Notation";
import { useState } from "react";

const MobileTab = ({
  setMobileOpen,
  setGameStillOn,
  winner,
  preventResume,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [tabDisplayed, setTabDisplayed] = useState(null);

  const showTab = () => {
    if (tabDisplayed === 1) return <Notation mobileOpen={true} />;
    return <Settings mobileOpen={true} />;
  };
  return (
    <div
      className={styles["mobile-container-background"]}
      onClick={(e) => {
        if (winner === null && !preventResume) setGameStillOn(true);
        setMobileOpen(false);
      }}
    >
      <div
        className={styles["mobile-container"]}
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li
            className={selectedTab === 1 ? styles["selected"] : ""}
            onClick={(e) => {
              setSelectedTab(1);
            }}
          >
            Play a Friend
          </li>
          <li className={styles["work-in-progress"]}>Play my AI (WiP)</li>
          <li
            className={selectedTab === 3 ? styles["selected"] : ""}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTab(3);
              if (tabDisplayed !== 1) {
                setTabDisplayed(1);
              } else setTabDisplayed(null);
            }}
          >
            Notation
          </li>
          <li
            className={selectedTab === 4 ? styles["selected"] : ""}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTab(4);
              if (tabDisplayed !== 2) {
                setTabDisplayed(2);
              } else setTabDisplayed(null);
            }}
          >
            Settings
          </li>
        </ul>
        {tabDisplayed && (
          <div className={styles["tab-container"]}>{showTab()}</div>
        )}
      </div>
    </div>
  );
};

export default MobileTab;
