import { FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen } from "react-icons/fa6";

const PromotionMenu = ({ color }) => {
    return (
        <div className={color ? "white_prom" : "black_prom"}>
            <div>
                <FaChessKnight />
                <FaChessBishop />
                <FaChessRook />
                <FaChessQueen />
            </div>
        </div>
    )
}

export default PromotionMenu