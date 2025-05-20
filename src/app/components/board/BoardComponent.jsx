'use client'
import styles from './board.module.css';
import BoardSquare from './BoardSquare';
import PromotionScreen from '../UI/PromotionScreen';
import { isCheck, generateLegalMoves, isGameOver } from '../gameMechanics/pieceLogic';
import { useState } from 'react';

const BoardComponent = ({gameStillOn, setGameStillOn, turn, setTurn, addMoveToList, setWinner, setVictoryCause}) => {
    const defaultBoardPosition = [
    //Hardcoded Chessboard Structure, rooks are 5, bishops are 4, knights are 3, queens are 9, kings are 8 and pawns are 1
    [-6, -3, -4, -9, -8, -4, -3, -6],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [6, 3, 4, 9, 8, 4, 3, 6]
]
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isPromoting, setIsPromoting] = useState(false);
    let promotionFlag = false;
    const [boardEvent, setBoardEvent] = useState(null); /*
        [{  event: 'key',
            x: num,
            y:num
        }]
        If clicked square matches an event stored in this variable from generated moves, we can now know and handle it
    */
    const [jumpedPawn, setJumpedPawn] = useState(null);
    const [gameMatrix, setGameMatrix] = useState(defaultBoardPosition)
    const [currentEvent, setCurrentEvent] = useState({
        currentSquare: null,
        previousSquare: null,
        event: null
    })
    const matrixSize = Array.from(Array(8).keys());

    const generateSquareColor = (row, square) => {
        if ((row + square) % 2 === 0) {
            return true
        }
        return false;
    }

    const addMoves = (oldSquare, newSquare, check, mate, newPiece = null) => {
        const newMove = {
            from: {...oldSquare},
            to: {
                ...newSquare,
                queeningValue: newPiece,
            },
            isCheck: check,
            isCheckmate: mate
        }
        if ((!promotionFlag && !newPiece) || newPiece) {
            addMoveToList(newMove);
        }
    }

    const handleClick = clickedSquare => {
        if (gameStillOn) {
            if (selectedPiece != null) {
                Move(clickedSquare)
            } else {
                getMoves(clickedSquare);
            }
        }
    }

    const Move = clickedSquare => {
        const currentSquare = idToMatrixPos(clickedSquare.id);
        const absSquareValue = Math.abs(gameMatrix[currentSquare.x][currentSquare.y]);
        if (absSquareValue >= 20) {
            const { x, y } = idToMatrixPos(selectedPiece.id);
            const prevSquareNotation = {
                x, y, 
                val: gameMatrix[x][y]
            }
            const currentSquareNotation = {
                x: currentSquare.x,
                y: currentSquare.y,
                val: gameMatrix[currentSquare.x][currentSquare.y],
                event: null
            }
            if (boardEvent.length >= 1) {
                const selectedEventMove = boardEvent.filter(e => e.x === currentSquare.x && e.y === currentSquare.y);
                if (selectedEventMove.length !== 0) {
                    updateGameMatrix(currentSquare, selectedEventMove[0].event);
                    currentSquareNotation.event = selectedEventMove[0].event;
                } else {
                    updateGameMatrix(currentSquare);
                }
            } else {
                updateGameMatrix(currentSquare);
            }
            const checkmateObj = isGameOver(!turn, gameMatrix);
            addMoves(prevSquareNotation, currentSquareNotation, isCheck(!turn, gameMatrix), checkmateObj.isMate);
            setTurn(!turn);
        } else {
            clearLegalMoves();
            setSelectedPiece(null)
        }

        const gameEnd = isGameOver(!turn, gameMatrix);
        if (gameEnd.isMate) {
            if (turn) {
                console.log("Checkmate! White is victorious!")
                setWinner("White");
                setVictoryCause("Checkmate")
            } else {
                console.log("Checkmate! Black is victorious!")
                setWinner("Black");
                setVictoryCause("Checkmate")
            }
            setGameStillOn(false);
        }
        if (gameEnd.isStalemate) {
            console.log("Stalemate! The game is a draw!")
            setWinner(null);
            setVictoryCause("Stalemate")
            setGameStillOn(false);
        }
    }

    const clearLegalMoves = () => {
        const newGameMatrix = [...gameMatrix]
        gameMatrix.forEach((row, indX) => {
            row.forEach((square, indY) => {
                if (square >= 20) {
                    newGameMatrix[indX][indY] -= 20;
                }
                if (square <= (-20)) {
                    newGameMatrix[indX][indY] += 20;
                }
            })
        });
        setGameMatrix(newGameMatrix);
    }

    const getMoves = clickedSquare => {
        const matrixCoords = idToMatrixPos(clickedSquare.id);
        const color = gameMatrix[matrixCoords.x][matrixCoords.y] > 0;
        if (squareIsNotEmpty(matrixCoords) && color === turn) {
            setSelectedPiece(clickedSquare);
            const moves = generateLegalMoves(matrixCoords, gameMatrix);
            showLegalMoves(moves);
        }
    }

    const showLegalMoves = moves => {
        const newGameMatrix = [...gameMatrix];
        const newEventMoves = [];
        moves.forEach(move => {
            if (checkForEvent(move)) {
                newEventMoves.push(move)
            }
            if (newGameMatrix[move.x][move.y] < 0) {
                newGameMatrix[move.x][move.y] -= 20;
            } else {
                newGameMatrix[move.x][move.y] += 20;
            }
        })
        setBoardEvent(newEventMoves);
        setGameMatrix(newGameMatrix);
    }

    const checkForEvent = move => {
        return 'event' in move
    }

    const updateGameMatrix = (currentSquare, event = false) => {
        let newGameMatrix = [...gameMatrix];
        const previousSquare = idToMatrixPos(selectedPiece.id);

        //If there are no special moves being made...
        if (!event) {
            //Check for unmoved rooks or kings because of castling mechanics
            const pieceCheck = Math.abs(newGameMatrix[previousSquare.x][previousSquare.y]);
            if (pieceCheck == 6) {
                //Unmoved rook to moved rook
                newGameMatrix[currentSquare.x][currentSquare.y] = newGameMatrix[previousSquare.x][previousSquare.y] > 0 ? 5 : -5;
            } else if (pieceCheck == 8) {
                //Unmoved king to moved king
                newGameMatrix[currentSquare.x][currentSquare.y] = newGameMatrix[previousSquare.x][previousSquare.y] > 0 ? 10 : -10;
            } else {//If its not an unmoved rook or king...
                //Whatever was in the previously clicked square is translated to its new selected square
                newGameMatrix[currentSquare.x][currentSquare.y] = newGameMatrix[previousSquare.x][previousSquare.y];
            }
            //And we clear the previous piece position on the board
            newGameMatrix[previousSquare.x][previousSquare.y] = 0;

        } else { //and if there are special moves...
            //Handle them accordingly
            handleSpecialMove(newGameMatrix, { currentSquare, previousSquare, event })
            setCurrentEvent({currentSquare, previousSquare, event});
        }
        if (!event || event !== 'promotion'){
            setSelectedPiece(null);
        }
        clearLegalMoves();
        if (jumpedPawn && event !== 'enPassant') {
            const newPawn = newGameMatrix[jumpedPawn.x][jumpedPawn.y] > 0 ? 1 : -1;
            newGameMatrix[jumpedPawn.x][jumpedPawn.y] = newPawn;
        }
        setJumpedPawn(null);
        setGameMatrix(newGameMatrix);
    }

    const handleSpecialMove = (matrix, eventMove, promotingPiece = false) => {
        const { currentSquare, previousSquare, event } = eventMove;
        const prevSquareNotation = {
            ...previousSquare,
            val: matrix[previousSquare.x][previousSquare.y]
        }
        const currentSquareNotation = {
            x: currentSquare.x,
            y: currentSquare.y,
            val: matrix[currentSquare.x][currentSquare.y],
            event
        }

        const updateBoard = (newPiece = false, enPassant = false) => {
            if (!newPiece) {
                matrix[currentSquare.x][currentSquare.y] = matrix[previousSquare.x][previousSquare.y];
                matrix[previousSquare.x][previousSquare.y] = 0;
                const checkmateObj = isGameOver(!turn, matrix);
                addMoves(prevSquareNotation, currentSquareNotation, isCheck(!turn, matrix), checkmateObj.isMate); 
            } else {
                matrix[currentSquare.x][currentSquare.y] = newPiece;
                matrix[previousSquare.x][previousSquare.y] = 0;
            }
            if (enPassant) {
                if (turn) {
                    matrix[currentSquare.x+1][currentSquare.y] = 0;
                } else {
                    matrix[currentSquare.x-1][currentSquare.y] = 0;
                }
            }
        }

        let newKing, queeningPiece, jumpedPawn;
        switch (event) {
            case 'pawnJump':
                jumpedPawn = matrix[previousSquare.x][previousSquare.y] > 0 ? 7 : -7
                setJumpedPawn(currentSquare);
                updateBoard(jumpedPawn);
                break;

            case 'enPassant':
                updateBoard(false, true);
                break;

            case 'promotion':
                setIsPromoting(!isPromoting);
                promotionFlag = !promotionFlag;
                setGameStillOn(!gameStillOn);
                if (promotingPiece) {
                    queeningPiece = matrix[previousSquare.x][previousSquare.y] > 0 ? promotingPiece : -(promotingPiece)
                    updateBoard(queeningPiece);
                    setSelectedPiece(null);
                    const checkmateObj = isGameOver(turn, matrix);
                    addMoves(prevSquareNotation, currentSquareNotation, isCheck(turn, matrix), checkmateObj.isMate, promotingPiece);
                }
                break;

            case 'castlesShort':
                newKing = matrix[previousSquare.x][previousSquare.y] > 0 ? 10 : -10;
                updateBoard(newKing);
                matrix[currentSquare.x][currentSquare.y - 1] = matrix[currentSquare.x][currentSquare.y + 1];
                matrix[currentSquare.x][currentSquare.y + 1] = 0;
                break;

            case 'castlesLong':
                newKing = matrix[previousSquare.x][previousSquare.y] > 0 ? 10 : -10
                updateBoard(newKing);
                matrix[currentSquare.x][currentSquare.y + 1] = matrix[currentSquare.x][currentSquare.y - 2];
                matrix[currentSquare.x][currentSquare.y - 2] = 0;
                break;

            default:
                break;
        }
    }

    const idToMatrixPos = id => {
        return {
            x: parseInt(id.charAt(0)),
            y: parseInt(id.charAt(2))
        }
    }

    const squareIsNotEmpty = coords => {
        return gameMatrix[coords.x][coords.y] !== 0
    }

    const generateBoard = (matrixSize) => {
        return (
            matrixSize.map(row => {
                return (
                    <div key={`Row${row}`} className={styles.boardRow}>
                        {matrixSize.map(square => {
                            let squareColor = generateSquareColor(row, square);
                            return (
                                <BoardSquare key={`Square${row + square}`} onSquareClick={handleClick} styleData={squareColor} squareID={`${row} ${square}`} pos={{ x: row, y: square }} boardData={gameMatrix} />
                            )
                        })}
                    </div>)

            })
        )
    }

    return (
        <div>
            {!gameStillOn && isPromoting ?
                <div className={styles['promotion-container']}>
                    <PromotionScreen 
                        handleSpecialMove={handleSpecialMove} 
                        matrix={gameMatrix}
                        eventMove={currentEvent}    
                    />
                </div>
            : null}
            <div className='chessboard-container'>
                {generateBoard(matrixSize)}
            </div>
        </div>
    )
}

export default BoardComponent