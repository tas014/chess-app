'use client'
import styles from "./playerUI.module.css"
import GameContext from "../../../context/context"
import { useContext } from "react"

const TakenPieces = ({color}) => {
    const { takenPieces } = useContext(GameContext);
    return (
        <>
            <h3 className={`${styles['taken-piece-title']} ${styles['mb-2']}`}>Captured Pieces</h3>
            <ul className={`${styles['taken-piece-list']}`}>
                {takenPieces.filter(piece => piece.color === color).map((piece, ind) => {
                    const Content = piece.icon;
                    return (
                    <li key={ind} className={`${styles['taken-piece-item']}`}>
                        <div>
                            {<Content color = {!piece.color ? '#e8d8efff' : 'black'} />}
                            {<span>{piece.amount}</span>}
                        </div>
                    </li>
                )})}
            </ul>
        </>
    )
}

export default TakenPieces