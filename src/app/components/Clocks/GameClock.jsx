import styles from './clocks.module.css'

const GameClock = ({color, time}) => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <div className={`${styles.clock} ${styles[color+"_clock"]}`}>
            {formatTime(time)}
        </div>
    )
}

export default GameClock