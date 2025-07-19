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
  return (
    <div className={styles["promotion-container"]}>
      <ul className={styles["promotion-list"]}>
        <li
          onClick={() => {
            handleSpecialMove(matrix, eventMove, 3);
          }}
        >
          <FaChessKnight color={color ? "white" : "black"} />
        </li>
        <li
          onClick={() => {
            handleSpecialMove(matrix, eventMove, 4);
          }}
        >
          <FaChessBishop color={color ? "white" : "black"} />
        </li>
        <li
          onClick={() => {
            handleSpecialMove(matrix, eventMove, 9);
          }}
        >
          <FaChessQueen color={color ? "white" : "black"} />
        </li>
        <li
          onClick={() => {
            handleSpecialMove(matrix, eventMove, 5);
          }}
        >
          <FaChessRook color={color ? "white" : "black"} />
        </li>
        <div className={active ? styles["animated-lines"] : ""}></div>
      </ul>
    </div>
  );
};

export default PromotionScreen;
