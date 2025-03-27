import Board from "./components/board/Board"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.chessTitle}>Awesome Chessboard</h1>
      <Board />
    </main>
  )
}