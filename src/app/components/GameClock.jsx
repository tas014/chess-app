const GameClock = ({color, time}) => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return (
        <div className={`${color}_clock`}>
            <span>{formatTime(time)}</span>
        </div>
    )
}

export default GameClock