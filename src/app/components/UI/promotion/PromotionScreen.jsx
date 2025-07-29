import {
  FaChessKnight,
  FaChessBishop,
  FaChessRook,
  FaChessQueen,
} from "react-icons/fa6";
import styles from "./promotion.module.css";

const PromotionScreen = ({
  handleSpecialMove,
  matrix,
  eventMove,
  color,
  active,
}) => {
  eventMove.event = "promotion";
  const handleClick = (pieceCode) => {
    handleSpecialMove(matrix, eventMove, pieceCode);
  };
  return (
    <div className={styles["promotion-container"]}>
      <ul className={styles["promotion-list"]}>
        <li onClick={() => handleClick(3)}>
          <FaChessKnight color={color ? "white" : "black"} />
        </li>
        <li onClick={() => handleClick(4)}>
          <FaChessBishop color={color ? "white" : "black"} />
        </li>
        <li onClick={() => handleClick(9)}>
          <FaChessQueen color={color ? "white" : "black"} />
        </li>
        <li onClick={() => handleClick(5)}>
          <FaChessRook color={color ? "white" : "black"} />
        </li>
        <div className={active ? styles["animated-lines"] : ""}></div>
      </ul>
    </div>
  );
};

export default PromotionScreen;
