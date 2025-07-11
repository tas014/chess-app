'use client'
import styles from './board.module.css';
import { FaChessKnight, FaChessBishop, FaChessPawn, FaChessRook, FaChessKing, FaChessQueen } from "react-icons/fa6";
import BoardSquare from './BoardSquare';
import Piece from './Piece';
import PromotionScreen from '../UI/promotion/PromotionScreen';
import { isCheck, generateLegalMoves, isGameOver } from '../gameMechanics/pieceLogic';
import { useState, useEffect, useRef } from 'react';

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
    ];
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [isPromoting, setIsPromoting] = useState(false);
    let promotionFlag = false;
    const [boardEvent, setBoardEvent] = useState(null); /*
        [{  event: 'key',
            x: num,
            y:num
        }]
    */
    const [jumpedPawn, setJumpedPawn] = useState(null);
    const [gameMatrix, setGameMatrix] = useState(defaultBoardPosition);
    const [boardSize, setBoardSize] = useState(560); // Default board size to its smallest size
    const [currentEvent, setCurrentEvent] = useState({
        currentSquare: null,
        previousSquare: null,
        event: null
    })
    const [playedTurns, setPlayedTurns] = useState(0);
    const boardRef = useRef(null);
    
    const initiatePieces = () => {
        const pieceArray = [];
        defaultBoardPosition.forEach((row, indX) => {
            row.forEach((piece, indY)=>{
                let pieceElement = null;
                switch (Math.abs(piece)) {
                    case 1:
                        pieceElement = FaChessPawn;
                        break;
                    case 3:
                        pieceElement = FaChessKnight;
                        break;
                    case 4:
                        pieceElement = FaChessBishop;
                        break;
                    case 6:
                        pieceElement = FaChessRook;
                        break;
                    case 8:
                        pieceElement = FaChessKing;
                        break;
                    case 9:
                        pieceElement = FaChessQueen;
                        break;
                    default:
                        return;
                }
                const color = piece > 0;
                const pieceGamePosition = {
                    x: indX,
                    y: indY,
                }
                const pieceID = `${indX}_${indY}`;
                pieceArray.push({
                    id: pieceID,
                    element: pieceElement,
                    color,
                    gamePosition: pieceGamePosition,
                    wasTaken: false
                })
            })
        })
        return pieceArray;
    }
    const [pieces, setPieces] = useState(initiatePieces());
    
    useEffect(()=>{
        const boardElement = boardRef.current;
        if (!boardElement) return;
        const boardObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                if (width > 0) {
                    setBoardSize(width);
                }
            }
        })
        boardObserver.observe(boardElement);
        return () => {boardObserver.disconnect()}
    },[setBoardSize]);

    const generateSquareColor = (row, square) => {
        if ((row + square) % 2 === 0) {
            return true
        }
        return false;
    }

    const updatePiece = (from, to, event, promotedTo = null) => {
        const newPieces = pieces.map(piece => ({...piece}));
        const fromPieceIndex = newPieces.findIndex(piece => piece.gamePosition.x === from.x && piece.gamePosition.y === from.y);
        
        if (fromPieceIndex !== -1) {
            // Move the piece to the new position
            const fromPiece = newPieces[fromPieceIndex];
            const newGamePosition = {
                x: to.x,
                y: to.y
            }
            fromPiece.gamePosition = newGamePosition;
            // Handle Captures
            const overlappingPieces = newPieces.filter(piece => piece.gamePosition.x === to.x && piece.gamePosition.y === to.y && !piece.wasTaken);
            if (overlappingPieces.length > 1) {
                const takenPiece = overlappingPieces.filter(piece => piece.id !== fromPiece.id)[0];
                takenPiece.wasTaken = true;
            }
            // Handle events
            if (event) {
                switch (event) {
                    case 'promotion':
                        if (Math.abs(promotedTo)) {
                            let newElement;
                            switch (promotedTo) {
                                case 3: 
                                    newElement = FaChessKnight;
                                    break;
                                case 4:
                                    newElement = FaChessBishop;
                                    break;
                                case 5:
                                    newElement = FaChessRook;
                                    break;
                                case 9:
                                    newElement = FaChessQueen;
                                    break;
                                default:
                                    console.warn("Unexpected event during promotion visual trigger");
                                    break;
                            }
                            fromPiece.element = newElement;
                        }
                        break;
                    case 'enPassant':
                        if (fromPiece.color) {
                            const enPassantIndex = newPieces.findIndex(piece => piece.gamePosition.x === to.x + 1 && piece.gamePosition.y === to.y);
                            if (enPassantIndex !== -1) {
                                newPieces[enPassantIndex].wasTaken = true;
                            } else console.warn("No piece found at the en passant position to remove.");
                        } else {
                            const enPassantIndex = newPieces.findIndex(piece => piece.gamePosition.x === to.x - 1 && piece.gamePosition.y === to.y);
                            if (enPassantIndex !== -1) {
                                newPieces[enPassantIndex].wasTaken = true;
                            } else console.warn("No piece found at the en passant position to remove.");
                        }
                        break;
                    case 'castlesShort':
                        if (fromPiece.color) {
                            const rookIndex = newPieces.findIndex(piece => piece.gamePosition.x === 7 && piece.gamePosition.y === 7);
                            if (rookIndex !== -1) {
                                newPieces[rookIndex].gamePosition = { x: 7, y: 5 };
                            } else console.warn("No rook found at the specified position to update.");
                        } else {
                            const rookIndex = newPieces.findIndex(piece => piece.gamePosition.x === 0 && piece.gamePosition.y === 7);
                            if (rookIndex !== -1) {
                                newPieces[rookIndex].gamePosition = { x: 0, y: 5 };
                            } else console.warn("No rook found at the specified position to update.");
                        }
                        break;
                    case 'castlesLong':
                        if (fromPiece.color) {
                            const rookIndex = newPieces.findIndex(piece => piece.gamePosition.x === 7 && piece.gamePosition.y === 0);
                            if (rookIndex !== -1) {
                                newPieces[rookIndex].gamePosition = { x: 7, y: 3 };
                            } else console.warn("No rook found at the specified position to update.");
                        } else {
                            const rookIndex = newPieces.findIndex(piece => piece.gamePosition.x === 0 && piece.gamePosition.y === 0);
                            if (rookIndex !== -1) {
                                newPieces[rookIndex].gamePosition = { x: 0, y: 3 };
                            } else console.warn("No rook found at the specified position to update.");
                        }
                        break;
                }
            }
            setPieces(newPieces);
        } else console.warn("No piece found at the specified position to update.");
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
                Move(clickedSquare);
                return;
            }
            getMoves(clickedSquare);
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
                    updateGame(currentSquare, selectedEventMove[0].event);
                    currentSquareNotation.event = selectedEventMove[0].event;
                } else {
                    updateGame(currentSquare);
                }
            } else {
                updateGame(currentSquare);
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
        if (gameMatrix[matrixCoords.x][matrixCoords.y] !== 0 && color === turn) {
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

    const updateGame = (currentSquare, event = false) => {
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
        updatePiece(previousSquare, currentSquare, event);
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
                    updatePiece(previousSquare, currentSquare, 'promotion', queeningPiece)
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

    const matrixMap = () => {
        return gameMatrix.map((row, indX) => {
            return gameMatrix.map((col, indY) => {
                const squareContent = gameMatrix[indX][indY];
                const squareID = `${indX}_${indY}`;
                const squareColor = generateSquareColor(indX, indY) ? styles.lightSquare : styles.darkSquare;
                const isLegalMove = (squareContent === 20 || squareContent === 70);
                const takeable = Math.abs(squareContent) > 20 && Math.abs(squareContent) < 70;
                
                return (
                    <BoardSquare 
                        key={squareID} 
                        squareID={squareID} 
                        callback={handleClick} 
                        squareColor={squareColor} 
                        takeable={takeable} 
                        isLegalMove={isLegalMove}
                    />
                )
            })
        })
    }

    const piecesMap = () => {
        return pieces.map(piece => {
            const { id, element, color, gamePosition, wasTaken } = piece;
            return (
                <Piece 
                    key={id} 
                    Content={element} 
                    color={color} 
                    position={gamePosition} 
                    wasTaken={wasTaken} 
                    boardSize={boardSize}
                />
            )
        })
    }

    return (
        <div className={styles.gameContainer}>
            {!gameStillOn && isPromoting ?
                <div className={styles['promotion-container']}>
                    <PromotionScreen 
                        handleSpecialMove={handleSpecialMove} 
                        matrix={gameMatrix}
                        eventMove={currentEvent}
                        color={!turn}    
                    />
                </div>
            : null}
            <div className={styles.chessboardContainer} id='board' ref={boardRef}>
                {matrixMap()}
                {piecesMap()}
            </div>
        </div>
    )
}

export default BoardComponent