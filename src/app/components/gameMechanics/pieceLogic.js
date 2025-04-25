const generateLegalMoves = (piece, board) => {
    const color = board[piece.x][piece.y] > 0;
    const baseMoves = getMoves(piece, board, color);
    const moves = filterLegalMoves(baseMoves, [...board], color, piece);

    return moves
}

const getMoves = (piece, board, color, scan = false) => {
    let pieceValue = Math.abs(board[piece.x][piece.y]);
    switch (pieceValue) {
        case 1:
        case 7:
            return generatePawnMoves(piece, board, color, scan)

        case 3:
            return generateKnightMoves(piece, board, color)

        case 4:
            return generateBishopMoves(piece, board, color)

        case 5:
        case 6:
            return generateRookMoves(piece, board, color)

        case 9:
            return generateQueenMoves(piece, board, color)

        case 10:
        case 8:
            return generateKingMoves(piece, board, color, scan)

        default:
            break
    }
}

const generatePawnMoves = (piece, board, color, scan = false) => {
    const moves = [];
    if (color) {
        //white logic
        if (!scan) { //If its not scanning for controlled squares for legal move checking...
            if (undefinedPreventer({
                x: piece.x - 1,
                y: piece.y
            })) {
                if (board[piece.x - 1][piece.y] === 0) {
                    moves.push({
                        x: piece.x - 1,
                        y: piece.y
                    })
                    // pawn jump
                    if (piece.x === 6) {
                        if (board[piece.x - 2][piece.y] === 0) {
                            moves.push({
                                x: piece.x - 2,
                                y: piece.y,
                                event: 'pawnJump'
                            })
                        }
                    }
                }
            }
            //Promotion logic
            if (piece.x === 1) {
                if (board[piece.x - 1][piece.y] === 0) {
                    moves.push({
                        x: piece.x - 1,
                        y: piece.y,
                        event: 'promotion'
                    })
                }
                if (undefinedPreventer({
                    x: piece.x - 1,
                    y: piece.y - 1
                })) {
                    if (board[piece.x - 1][piece.y - 1] < 0) {
                        moves.push({
                            x: piece.x - 1,
                            y: piece.y - 1,
                            event: 'promotion'
                        })
                    }
                }
                if (undefinedPreventer({
                    x: piece.x - 1,
                    y: piece.y + 1
                })) {
                    if (board[piece.x - 1][piece.y + 1] < 0) {
                        moves.push({
                            x: piece.x - 1,
                            y: piece.y + 1,
                            event: 'promotion'
                        })
                    }
                }

            }
            //En passant logic
            if (piece.x === 3) {
                if (undefinedPreventer({
                    x: piece.x,
                    y: piece.y + 1
                })) {
                    if (board[piece.x][piece.y + 1] === (-7)) {
                        moves.push({
                            x: piece.x - 1,
                            y: piece.y + 1,
                            event: 'enPassant'
                        })
                    }
                }
                if (undefinedPreventer({
                    x: piece.x,
                    y: piece.y - 1
                })) {
                    if (board[piece.x][piece.y - 1] === (-7)) {
                        moves.push({
                            x: piece.x - 1,
                            y: piece.y - 1,
                            event: 'enPassant'
                        })
                    }
                }
            }
        }

        //Pawn takes logic
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y - 1
        })) {
            if (board[piece.x - 1][piece.y - 1] < 0 || scan) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y + 1
        })) {
            if (board[piece.x - 1][piece.y + 1] < 0 || scan) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y + 1
                })
            }
        }
    } else {
        //Black logic

        if (!scan) { //If its not scanning for controlled squares for legal move checking...
            if (undefinedPreventer({
                x: piece.x + 1,
                y: piece.y
            })) {
                if (board[piece.x + 1][piece.y] === 0) {
                    moves.push({
                        x: piece.x + 1,
                        y: piece.y
                    })
                    // pawn jump
                    if (piece.x === 1) {
                        if (board[piece.x + 2][piece.y] === 0) {
                            moves.push({
                                x: piece.x + 2,
                                y: piece.y,
                                event: 'pawnJump'
                            })
                        }
                    }
                }
            }
            //Promotion logic
            if (piece.x === 6) {
                if (board[piece.x + 1][piece.y] === 0) {
                    moves.push({
                        x: piece.x + 1,
                        y: piece.y,
                        event: 'promotion'
                    })
                }
                if (undefinedPreventer({
                    x: piece.x + 1,
                    y: piece.y - 1
                })) {
                    if (board[piece.x + 1][piece.y - 1] > 0) {
                        moves.push({
                            x: piece.x + 1,
                            y: piece.y - 1,
                            event: 'promotion'
                        })
                    }
                }
                if (undefinedPreventer({
                    x: piece.x + 1,
                    y: piece.y + 1
                })) {
                    if (board[piece.x + 1][piece.y + 1] > 0) {
                        moves.push({
                            x: piece.x + 1,
                            y: piece.y + 1,
                            event: 'promotion'
                        })
                    }
                }

            }
            //En passant logic
            if (piece.x === 4) {
                if (undefinedPreventer({
                    x: piece.x,
                    y: piece.y + 1
                })) {
                    if (board[piece.x][piece.y + 1] === (7)) {
                        moves.push({
                            x: piece.x + 1,
                            y: piece.y + 1,
                            event: 'enPassant'
                        })
                    }
                }
                if (undefinedPreventer({
                    x: piece.x,
                    y: piece.y - 1
                })) {
                    if (board[piece.x][piece.y - 1] === (7)) {
                        moves.push({
                            x: piece.x + 1,
                            y: piece.y - 1,
                            event: 'enPassant'
                        })
                    }
                }
            }
        }

        //Pawn takes logic
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y - 1
        })) {
            if (board[piece.x + 1][piece.y - 1] > 0 || scan) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y + 1
        })) {
            if (board[piece.x + 1][piece.y + 1] > 0 || scan) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y + 1
                })
            }
        }
    }
    //filter out doubled moves
    const filteredMoves = [];
    for (const move of moves) {
        let instances = 0;
        for (const i of moves) {
            if (move.x === i.x && move.y === i.y) {
                instances++
            }
        }
        if (instances >= 2) {
            if (move.hasOwnProperty('event')) {
                filteredMoves.push(move);
            }
        } else {
            filteredMoves.push(move);
        }
    }
    return filteredMoves
}

const generateKnightMoves = (piece, board, color) => {
    const moves = [];
    if (color) {
        //White logic
        if (undefinedPreventer({
            x: piece.x + 2,
            y: piece.y + 1
        })) {
            if (board[piece.x + 2][piece.y + 1] <= 0) {
                moves.push({
                    x: piece.x + 2,
                    y: piece.y + 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 2,
            y: piece.y + 1
        })) {
            if (board[piece.x - 2][piece.y + 1] <= 0) {
                moves.push({
                    x: piece.x - 2,
                    y: piece.y + 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 2,
            y: piece.y - 1
        })) {
            if (board[piece.x + 2][piece.y - 1] <= 0) {
                moves.push({
                    x: piece.x + 2,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 2,
            y: piece.y - 1
        })) {
            if (board[piece.x - 2][piece.y - 1] <= 0) {
                moves.push({
                    x: piece.x - 2,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y + 2
        })) {
            if (board[piece.x + 1][piece.y + 2] <= 0) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y + 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y + 2
        })) {
            if (board[piece.x - 1][piece.y + 2] <= 0) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y + 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y - 2
        })) {
            if (board[piece.x + 1][piece.y - 2] <= 0) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y - 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y - 2
        })) {
            if (board[piece.x - 1][piece.y - 2] <= 0) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y - 2
                })
            }
        }
    } else {
        //Black logic
        if (undefinedPreventer({
            x: piece.x + 2,
            y: piece.y + 1
        })) {
            if (board[piece.x + 2][piece.y + 1] >= 0) {
                moves.push({
                    x: piece.x + 2,
                    y: piece.y + 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 2,
            y: piece.y + 1
        })) {
            if (board[piece.x - 2][piece.y + 1] >= 0) {
                moves.push({
                    x: piece.x - 2,
                    y: piece.y + 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 2,
            y: piece.y - 1
        })) {
            if (board[piece.x + 2][piece.y - 1] >= 0) {
                moves.push({
                    x: piece.x + 2,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 2,
            y: piece.y - 1
        })) {
            if (board[piece.x - 2][piece.y - 1] >= 0) {
                moves.push({
                    x: piece.x - 2,
                    y: piece.y - 1
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y + 2
        })) {
            if (board[piece.x + 1][piece.y + 2] >= 0) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y + 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y + 2
        })) {
            if (board[piece.x - 1][piece.y + 2] >= 0) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y + 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x + 1,
            y: piece.y - 2
        })) {
            if (board[piece.x + 1][piece.y - 2] >= 0) {
                moves.push({
                    x: piece.x + 1,
                    y: piece.y - 2
                })
            }
        }
        if (undefinedPreventer({
            x: piece.x - 1,
            y: piece.y - 2
        })) {
            if (board[piece.x - 1][piece.y - 2] >= 0) {
                moves.push({
                    x: piece.x - 1,
                    y: piece.y - 2
                })
            }
        }
    }
    return moves
}

const generateBishopMoves = (piece, board, color, maxStretch = 7) => {
    const moves = [];
    if (color) {
        //White logic
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x + diag,
                y: piece.y + diag
            })) {
                if (board[piece.x + diag][piece.y + diag] <= 0) {
                    moves.push({
                        x: piece.x + diag,
                        y: piece.y + diag
                    })
                    if (board[piece.x + diag][piece.y + diag] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x - diag,
                y: piece.y + diag
            })) {
                if (board[piece.x - diag][piece.y + diag] <= 0) {
                    moves.push({
                        x: piece.x - diag,
                        y: piece.y + diag
                    })
                    if (board[piece.x - diag][piece.y + diag] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x + diag,
                y: piece.y - diag
            })) {
                if (board[piece.x + diag][piece.y - diag] <= 0) {
                    moves.push({
                        x: piece.x + diag,
                        y: piece.y - diag
                    })
                    if (board[piece.x + diag][piece.y - diag] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x - diag,
                y: piece.y - diag
            })) {
                if (board[piece.x - diag][piece.y - diag] <= 0) {
                    moves.push({
                        x: piece.x - diag,
                        y: piece.y - diag
                    })
                    if (board[piece.x - diag][piece.y - diag] < 0) {
                        break
                    }
                } else break
            } else break
        }
    } else {
        //Black logic
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x + diag,
                y: piece.y + diag
            })) {
                if (board[piece.x + diag][piece.y + diag] >= 0) {
                    moves.push({
                        x: piece.x + diag,
                        y: piece.y + diag
                    })
                    if (board[piece.x + diag][piece.y + diag] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x - diag,
                y: piece.y + diag
            })) {
                if (board[piece.x - diag][piece.y + diag] >= 0) {
                    moves.push({
                        x: piece.x - diag,
                        y: piece.y + diag
                    })
                    if (board[piece.x - diag][piece.y + diag] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x + diag,
                y: piece.y - diag
            })) {
                if (board[piece.x + diag][piece.y - diag] >= 0) {
                    moves.push({
                        x: piece.x + diag,
                        y: piece.y - diag
                    })
                    if (board[piece.x + diag][piece.y - diag] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let diag = 1; diag <= maxStretch; diag++) {
            if (undefinedPreventer({
                x: piece.x - diag,
                y: piece.y - diag
            })) {
                if (board[piece.x - diag][piece.y - diag] >= 0) {
                    moves.push({
                        x: piece.x - diag,
                        y: piece.y - diag
                    })
                    if (board[piece.x - diag][piece.y - diag] > 0) {
                        break
                    }
                } else break
            } else break
        }
    }
    return moves
}

const generateRookMoves = (piece, board, color, maxStretch = 7) => {
    const moves = [];
    if (color) {
        //White logic
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x + file,
                y: piece.y
            })) {
                if (board[piece.x + file][piece.y] <= 0) {
                    moves.push({
                        x: piece.x + file,
                        y: piece.y
                    })
                    if (board[piece.x + file][piece.y] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x - file,
                y: piece.y
            })) {
                if (board[piece.x - file][piece.y] <= 0) {
                    moves.push({
                        x: piece.x - file,
                        y: piece.y
                    })
                    if (board[piece.x - file][piece.y] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x,
                y: piece.y + file
            })) {
                if (board[piece.x][piece.y + file] <= 0) {
                    moves.push({
                        x: piece.x,
                        y: piece.y + file
                    })
                    if (board[piece.x][piece.y + file] < 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x,
                y: piece.y - file
            })) {
                if (board[piece.x][piece.y - file] <= 0) {
                    moves.push({
                        x: piece.x,
                        y: piece.y - file
                    })
                    if (board[piece.x][piece.y - file] < 0) {
                        break
                    }
                } else break
            } else break
        }
    } else {
        //Black logic
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x + file,
                y: piece.y
            })) {
                if (board[piece.x + file][piece.y] >= 0) {
                    moves.push({
                        x: piece.x + file,
                        y: piece.y
                    })
                    if (board[piece.x + file][piece.y] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x - file,
                y: piece.y
            })) {
                if (board[piece.x - file][piece.y] >= 0) {
                    moves.push({
                        x: piece.x - file,
                        y: piece.y
                    })
                    if (board[piece.x - file][piece.y] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x,
                y: piece.y + file
            })) {
                if (board[piece.x][piece.y + file] >= 0) {
                    moves.push({
                        x: piece.x,
                        y: piece.y + file
                    })
                    if (board[piece.x][piece.y + file] > 0) {
                        break
                    }
                } else break
            } else break
        }
        for (let file = 1; file <= maxStretch; file++) {
            if (undefinedPreventer({
                x: piece.x,
                y: piece.y - file
            })) {
                if (board[piece.x][piece.y - file] >= 0) {
                    moves.push({
                        x: piece.x,
                        y: piece.y - file
                    })
                    if (board[piece.x][piece.y - file] > 0) {
                        break
                    }
                } else break
            } else break
        }
    }
    return moves
}

const generateQueenMoves = (piece, board, color) => {
    const verticalMoves = generateRookMoves(piece, board, color);
    const diagonalMoves = generateBishopMoves(piece, board, color);
    const moves = verticalMoves.concat(diagonalMoves);

    return moves
}

const generateKingMoves = (piece, board, color, scan) => {
    const verticalMoves = generateRookMoves(piece, board, color, 1);
    const diagonalMoves = generateBishopMoves(piece, board, color, 1);
    const moves = verticalMoves.concat(diagonalMoves);

    if (!scan) {
        //Short Castles logic
        if (Math.abs(board[piece.x][piece.y]) === 8 && Math.abs(board[piece.x][piece.y + 3]) === 6) {
            for (let i = 1; i < 3; i++) {
                if (board[piece.x][piece.y + i] !== 0) {
                    break
                }
                if (i >= 2) {
                    moves.push({
                        x: piece.x,
                        y: piece.y + 2,
                        event: 'castlesShort'
                    })
                }
            }
        }
        //Long Castles logic
        if (Math.abs(board[piece.x][piece.y]) === 8 && Math.abs(board[piece.x][piece.y - 4]) === 6) {
            for (let i = 1; i <= 3; i++) {
                if (board[piece.x][piece.y - i] !== 0) {
                    break
                }
                if (i >= 3) {
                    moves.push({
                        x: piece.x,
                        y: piece.y - 2,
                        event: 'castlesLong'
                    })
                }
            }
        }
    }

    return moves
}

const undefinedPreventer = ({ x, y }) => {
    if (x < 0 || x > 7) {
        return false
    }
    if (y < 0 || y > 7) {
        return false
    }
    return true
}

const filterDupes = moves => {
    //filter out doubled moves
    const filteredControl = [];
    for (const move of moves) {
        let isUnique = true;
        for (const controlMove of filteredControl) {
            if (controlMove.x === move.x && controlMove.y === move.y) {
                isUnique = false;
                break
            }
        }

        if (isUnique) {
            filteredControl.push(move);
        }
    }
    return filteredControl
}

const filterLegalMoves = (baseMoves, board, color, pos) => {
    let moves = [];

    // Filter out moves that would leave the king in check...
    // Sidenote: this emulation of all legal moves conveniently filters out pinned pieces and double checks!
    const currentPiece = board[pos.x][pos.y];
    moves = baseMoves.filter(move => {
        // Emulate a board state with the piece in each move it could potentially make
        const emulatedSquareContent = board[move.x][move.y];
        board[pos.x][pos.y] = 0;
        board[move.x][move.y] = currentPiece;

        // Get the squares controlled by the opposing side in this fictional position and determine if the king would be in check
        const enemyControlledSquares = getControlledSquares(board, color);
        const kingPos = findKingPos(color, board);
        for (const controlledSquare of enemyControlledSquares) {
            if (controlledSquare.x === kingPos.x && controlledSquare.y === kingPos.y) {
                // if king is left in check, the move is illegal so we return the board to its original state and tell the filter to avoid this move.
                board[pos.x][pos.y] = currentPiece;
                board[move.x][move.y] = emulatedSquareContent;
                return false
            }
        }
        // And if it wouldn't leave the king in check, the move is legal so we return the board to its original state and tell the filter to include this move.
        board[pos.x][pos.y] = currentPiece;
        board[move.x][move.y] = emulatedSquareContent;
        return true
    })

    return moves
}

const getControlledSquares = (board, color) => {
    let whiteControl = [];
    let blackControl = [];

    // Check which squares the opposing pieces control
    if (!color) {
        //White controlled squares logic here
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] > 0 && board[i][j] < 20) {
                    whiteControl.push(getMoves({ x: i, y: j }, board, true, true))
                }
            }
        }
        //filter out doubled moves
        whiteControl = filterDupes(whiteControl.flat());
    } else {
        //Black controlled squares logic here
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] < 0 && board[i][j] > -20) {
                    blackControl.push(getMoves({ x: i, y: j }, board, false, true))
                }
            }
        }
        //filter out doubled moves
        blackControl = filterDupes(blackControl.flat());
    }

    if (color) {
        return blackControl
    } else {
        return whiteControl
    }
}

const findKingPos = (color, board) => {
    let kingPos = {};
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const absPiece = Math.abs(board[i][j])
            if (absPiece === 8 || absPiece === 10) {
                if (color && board[i][j] >= 8) {
                    kingPos.x = i;
                    kingPos.y = j;
                }
                if (!color && board[i][j] <= -8) {
                    kingPos.x = i;
                    kingPos.y = j;
                }
            }
        }
    }
    return kingPos
}

const isGameOver = (color, board) => {
    let isMate = false;
    let isStalemate = false;
    const check = isCheck(color, board);

    if (color) {
        // White logic
        const totalWhiteMoves = [];
        board.forEach((row, rowInd) => {
            row.forEach((piece, colInd) => {
                // Emulate every possible legal move...
                if (piece > 0) {
                    const generatedMoves = generateLegalMoves({ x: rowInd, y: colInd }, board);
                    if (generatedMoves.length !== 0) { // And filter out the empty results...
                        totalWhiteMoves.push(true);
                    }
                }
            })
        })
        if (totalWhiteMoves.length === 0) { // And if there are simply no legal moves while the king is in check...
            if (check) {
                isMate = true
            } else { // And if there's no legal moves but the king is not in check...
                isStalemate = true
            }
        }
    } else {
        // Black logic
        const totalBlackMoves = [];
        board.forEach((row, rowInd) => {
            row.forEach((piece, colInd) => {
                // Emulate every possible legal move...
                if (piece < 0) {
                    const generatedMoves = generateLegalMoves({ x: rowInd, y: colInd }, board);
                    if (generatedMoves.length !== 0) { // And filter out the empty results...
                        totalBlackMoves.push(true);
                    }
                }
            })
        })
        if (totalBlackMoves.length === 0) { // And if there are simply no legal moves while the king is in check...
            if (check) {
                isMate = true
            } else { // And if there's no legal moves but the king is not in check...
                isStalemate = true
            }
        }
    }
    return { isMate, isStalemate }
}

const isCheck = (color, board) => {
    const enemyControlledSquares = getControlledSquares(board, color);
    const kingPos = findKingPos(color, board);
    let isCheck = false;

    for (const controlledSquare of enemyControlledSquares) {
        if (controlledSquare.x === kingPos.x && controlledSquare.y === kingPos.y) {
            isCheck = true;
        }
    }
    console.log(isCheck, kingPos)
    return isCheck
}

export { isCheck, generateLegalMoves, isGameOver }