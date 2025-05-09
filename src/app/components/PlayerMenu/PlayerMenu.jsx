'use client'
import styles from './playerMenu.module.css'
import { FaFlag } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa6";
import { useState } from 'react';

const PlayerMenu = ({color, time, resign, setResign, offerDraw}) => {
    const [isResigning, setIsResigning] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    let resignTimer;
    const handleResign = () => {
        if (!isResigning && !resign) {
            setIsResigning(true);
            resignTimer = setTimeout(() => {
                setIsResigning(false);
            }, 3000); // 3 seconds to confirm resignation
        } else {
            clearTimeout(resignTimer);
            setResign(true);
        }
    }

    const handleDraw = () => {
        if (!isDrawing) {
            setIsDrawing(true);
        }
        offerDraw();
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <div className={`${styles["player-menu"]}`}>
            <div className={`${styles.clock} ${styles[color+"-clock"]}`}>
                {formatTime(time)}
            </div>
            <div className={`${styles.resign} ${styles[color+"-resign"]} ${isResigning ? styles["active-resign"] : ""}`} onClick={handleResign}>
                <FaFlag className={styles.icon} />
            </div>
            <div className={`${styles.draw} ${styles[color+"-draw"]} ${isDrawing ? styles["active-draw"] : ""}`} onClick={handleDraw}>
                <FaHandshake className={styles.icon} />
            </div>
        </div>
    )
}

export default PlayerMenu