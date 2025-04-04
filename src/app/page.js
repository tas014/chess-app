import Game from "./components/game"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.chessTitle}>Awesome Chessboard</h1>
      <Game />
    </main>
  )
}