import { FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen } from "react-icons/fa6";

const PromotionScreen = ({ handleSpecialMove, matrix, eventMove }) => {
    eventMove.event = "promotion";
    return (
        <div className="promotion_container">
            <div>
                <ul>
                    <li onClick={() => { handleSpecialMove(matrix, eventMove, 3) }}><FaChessKnight /></li>
                    <li onClick={() => { handleSpecialMove(matrix, eventMove, 4) }}><FaChessBishop /></li>
                    <li onClick={() => { handleSpecialMove(matrix, eventMove, 9) }}><FaChessQueen /></li>
                    <li onClick={() => { handleSpecialMove(matrix, eventMove, 5) }}><FaChessRook /></li>
                </ul>
            </div>
        </div>
    )
}

export default PromotionScreen