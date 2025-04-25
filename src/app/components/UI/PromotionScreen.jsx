import { FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen } from "react-icons/fa6";
import styles from "./promotion.module.css"

const PromotionScreen = ({ handleSpecialMove, matrix, eventMove }) => {
    eventMove.event = "promotion";
    return (
        <div className={styles["promotion-container"]}>
            <ul className={styles["promotion-list"]}>
                <li onClick={() => { handleSpecialMove(matrix, eventMove, 3) }}><FaChessKnight /></li>
                <li onClick={() => { handleSpecialMove(matrix, eventMove, 4) }}><FaChessBishop /></li>
                <li onClick={() => { handleSpecialMove(matrix, eventMove, 9) }}><FaChessQueen /></li>
                <li onClick={() => { handleSpecialMove(matrix, eventMove, 5) }}><FaChessRook /></li>
            </ul>
        </div>
    )
}

export default PromotionScreen