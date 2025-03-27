'use client'
import styles from './board.module.css';
import BoardSquare from './BoardSquare';
import PromotionMenu from './PromotionMenu';
import { generateLegalMoves, isGameOver } from '../gameMechanics/pieceLogic';
import { useState } from 'react';

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

const Board = () => {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [turn, setTurn] = useState(true);
    const [isPromoting, setIsPromoting] = useState(false);
    const [gameStillOn, setGameStillOn] = useState(true);
    const [boardEvent, setBoardEvent] = useState(null); /*
        [{  event: 'key',
            x: num,
            y:num
        }]
        If clicked square matches an event stored in this variable from generated moves, we can now know and handle it
    */
    const [jumpedPawn, setJumpedPawn] = useState([]);
    const [gameMatrix, setGameMatrix] = useState(defaultBoardPosition)
    const matrixSize = Array.from(Array(8).keys());
    const promotion = useState({
        square: null,
        color: null
    })
    //Transfer all the piece representation into a matrix that gets updated so the content updates with it automatically

    const generateSquareColor = (row, square) => {
        if ((row + square) % 2 === 0) {
            return true
        }
        return false;
    }

    const generateSquareId = (row, square) => {
        return `${String.fromCharCode((row * -1) + 72)}${square + 1}`
    }

    const handleClick = clickedSquare => {
        //console.log(idToMatrixPos(clickedSquare.id));
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
            if (boardEvent.length >= 1) {
                const selectedEventMove = boardEvent.filter(e => e.x === currentSquare.x && e.y === currentSquare.y);
                if (selectedEventMove.length !== 0) {
                    updateGameMatrix(currentSquare, selectedEventMove[0].event)
                } else {
                    updateGameMatrix(currentSquare);
                }
            } else {
                updateGameMatrix(currentSquare);
            }
            setTurn(!turn)
        } else {
            clearLegalMoves();
            setSelectedPiece(null)
        }

        const gameEnd = isGameOver(!turn, gameMatrix);
        if (gameEnd.isMate) {
            if (!turn) {
                console.log("Checkmate! White is victorious!")
            } else {
                console.log("Checkmate! Black is victorious!")
            }
        }
        if (gameEnd.isStalemate) {
            console.log("Stalemate! The game is a draw!")
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
        //console.log(moves)
        moves.forEach(move => {
            //console.log(move)
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
            console.log(event)
            handleSpecialMove(newGameMatrix, { currentSquare, previousSquare, event })
        }
        clearLegalMoves();
        setGameMatrix(newGameMatrix);
        setSelectedPiece(null);
    }

    const handleSpecialMove = (matrix, eventMove, promotingPiece = false) => {
        const { currentSquare, previousSquare, event } = eventMove;

        const updateBoard = (newPiece = false) => {
            if (!newPiece) {
                matrix[currentSquare.x][currentSquare.y] = matrix[previousSquare.x][previousSquare.y];
                matrix[previousSquare.x][previousSquare.y] = 0;
            } else {
                matrix[currentSquare.x][currentSquare.y] = newPiece;
                matrix[previousSquare.x][previousSquare.y] = 0;
            }
        }

        let newKing, queeningPiece;
        switch (event) {
            case 'pawnJump':
                queeningPiece = matrix[previousSquare.x][previousSquare.y] > 0 ? 7 : -7
                setJumpedPawn(eventMove);
                updateBoard();
                break;

            case 'promotion':
                //queeningPiece = matrix[previousSquare.x][previousSquare.y] > 0 ? 9 : -9;
                if (promotingPiece) {
                    queeningPiece = matrix[previousSquare.x][previousSquare.y] > 0 ? promotingPiece : -promotingPiece
                    updateBoard(queeningPiece);
                }
                setIsPromoting(!isPromoting);
                setGameStillOn(!gameStillOn);
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
        //console.log(matrix, currentSquare, previousSquare, event);
    }

    const handlePromotion = (square, color) => {
        let resolve, reject;
        const promotingPiece = new Promise((res, rej) => {

        })
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
                    <tr key={`Row${row}`} className={styles.boardRow}>
                        {matrixSize.map(square => {
                            let squareColor = generateSquareColor(row, square);
                            return (
                                //<td key={`Square${row+square}`} className={squareColor} id={`${row} ${square}`}>{setPieces(row, square)}</td>
                                <BoardSquare key={`Square${row + square}`} onSquareClick={handleClick} styleData={squareColor} squareID={`${row} ${square}`} pos={{ x: row, y: square }} boardData={gameMatrix} />
                            )
                        })}
                    </tr>)

            })
        )
    }

    return (
        <table>
            {!gameStillOn && isPromoting ?
                <div className='promotion_container'>
                    <div>

                    </div>
                </div>
                : null}
            <tbody>
                {generateBoard(matrixSize)}
            </tbody>
            <PromotionMenu color={turn} />
        </table>
    )
}

export default Board