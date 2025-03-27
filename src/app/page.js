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

class Person {
  introduceSelf() {
    console.log("Buenas Tardes!")
  }
}

class Professor extends Person {
  introduceSelf() {
    console.log("Sobreescrito! Ahora digo Buenas Noches!")
  }
}
// al asignar a una subclase un método con el mismo nombre que un método heredado, se sobreescribe dando prioridad al método declarado en la subclase!
