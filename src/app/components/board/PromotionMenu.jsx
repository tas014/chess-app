import { FaChessKnight, FaChessBishop, FaChessRook, FaChessQueen } from "react-icons/fa6";

const PromotionMenu = ({ color }) => {
    return (
        <div className={color ? "white_prom" : "black_prom"}>
            <div>
                <FaChessKnight color={color ? "white" : "black"} />
                <FaChessBishop color={color ? "white" : "black"} />
                <FaChessRook color={color ? "white" : "black"} />
                <FaChessQueen color={color ? "white" : "black"} />
            </div>
        </div>
    )
}

export default PromotionMenu