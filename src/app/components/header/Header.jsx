import styles from "./styles.module.css";
import { IoIosMenu } from "react-icons/io";

const Header = ({ setMobileOpen, setGameStillOn }) => {
  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-mobile-container"]}>
        <IoIosMenu
          color="white"
          onClick={() => {
            setMobileOpen(true);
            setGameStillOn(false);
          }}
        />
      </div>
      <div className={styles["desktop-container"]}>
        <nav>
          <a href=".">Play a Friend</a>
          <a
            href="."
            className={styles["work-in-progress"]}
            onClick={(e) => e.preventDefault()}
          >
            Play my AI (WiP)
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
