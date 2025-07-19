import PlayerMenu from "./PlayerMenu"
import TakenPieces from "./TakenPieces"
import styles from "./playerUI.module.css"

const PlayerUIContainer = ({color, children}) => {
  return (
    <>
      {children}
      <div className={`${styles['player-UI-container']} ${color ? styles['white-player-UI-container'] : styles['black-player-UI-container']}`}>
          <PlayerMenu color={color} />
          <TakenPieces color={color} />
      </div>
    </>
  )
}

export default PlayerUIContainer