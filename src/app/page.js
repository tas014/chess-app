"use client";
import styles from "./page.module.css";
import Header from "./components/header/Header";
import Game from "./components/Game";
import { useState } from "react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gameStillOn, setGameStillOn] = useState(true);
  const [preventResume, setPreventResume] = useState(false);
  const [winner, setWinner] = useState(null);
  return (
    <>
      <Header setMobileOpen={setMobileOpen} setGameStillOn={setGameStillOn} />
      <main className={styles.mainContainer}>
        <Game
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          gameStillOn={gameStillOn}
          setGameStillOn={setGameStillOn}
          winner={winner}
          setWinner={setWinner}
          preventResume={preventResume}
          setPreventResume={setPreventResume}
        />
      </main>
    </>
  );
}
