import King from "./Pieces/King";
import Queen from "./Pieces/Queen";
import Bishop from "./Pieces/Bishop";
import Knight from "./Pieces/Knight";
import Pawn from "./Pieces/Pawn";
import Rook from "./Pieces/Rook";

class Board {
    // color, board
    #matrix;
    #startPosition;
    #whiteKing;
    #blackKing;
    constructor(position = false, setEvent){
        if (position) {
            this.#matrix = position;
        } else {
            this.#matrix = this.#createDefaultMatrix();
        }
        this.#startPosition = [...this.#matrix];
        this.#whiteKing = this.#matrix.find(row => row.find(piece => piece instanceof King && piece.color));
        this.#blackKing = this.#matrix.find(row => row.find(piece => piece instanceof King && !piece.color));
        this.setEvent = setEvent;
    }
    #createDefaultMatrix() {
        const matrix = [];
        // Create an 8x8 matrix filled with EmptySquare objects
        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 8; j++) {
                row.push(new EmptySquare());
            }
            matrix.push(row);
        }
        // Black pieces
        matrix[0][0] = new Rook(false, matrix);
        matrix[0][1] = new Knight(false, matrix);
        matrix[0][2] = new Bishop(false, matrix);
        matrix[0][3] = new Queen(false, matrix);
        matrix[0][4] = new King(false, matrix);
        matrix[0][5] = new Bishop(false, matrix);
        matrix[0][6] = new Knight(false, matrix);
        matrix[0][7] = new Rook(false, matrix);
        for (let i = 0; i < 8; i++) {
            matrix[1][i] = new Pawn(false, matrix);
        }

        // White pieces
        matrix[7][0] = new Rook(true, matrix);
        matrix[7][1] = new Knight(true, matrix);
        matrix[7][2] = new Bishop(true, matrix);
        matrix[7][3] = new Queen(true, matrix);
        matrix[7][4] = new King(true, matrix);
        matrix[7][5] = new Bishop(true, matrix);
        matrix[7][6] = new Knight(true, matrix);
        matrix[7][7] = new Rook(true, matrix);
        for (let i = 0; i < 8; i++) {
            matrix[6][i] = new Pawn(true, matrix);
        }
        return matrix;
    }
    get position() {
        return this.#matrix;
    }
    static makeMove(board, from, to) {
        const backupBoard = [...board]; // Make a backup of the board so it doesn't get modified
        const square = backupBoard[from.x][from.y]; // Get the piece at the from position
        if (square.isLegalMove) { // If the piece can move to the to position
            const targetSquare = backupBoard[to.x][to.y]; // Get the piece at the "to" position
            backupBoard[to.x][to.y] = square; // Move the piece to the to position
            backupBoard[from.x][from.y] = new EmptySquare(); // Set the "from" position to empty
            square.hasMoved = true; // Set the piece as moved
            return backupBoard; // Return the new board
        } else return false; // The move was not successful
    }
    static clearLegalMoves(board) {
        for (let row of board) {
            for (let square of row) {
                if (square?.isLegalMove !== undefined) { // Check if square was a legal empty square to move to...
                    square.isLegalMove = false; // And clear it
                } else if (square?.canBeTaken !== undefined) { // If the square was a piece that could be taken...
                    square.canBeTaken = false; // Clear that too
                }   
            }
        }
    }
    static whiteControlledSquares(board) {
        const controlledSquares = new Set();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].color) {
                    const moves = board[i][j].moves;
                    for (const move of moves) {
                        controlledSquares.add({x:move.x, y:move.y});
                    }
                }
            }
        }
        return [...controlledSquares];
    }
    static blackControlledSquares(board) {
        const controlledSquares = new Set();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (!board[i][j].color) {
                    const moves = board[i][j].moves;
                    for (const move of moves) {
                        controlledSquares.add({x:move.x, y:move.y});
                    }
                }
            }
        }
        return [...controlledSquares];
    }
    static isCheck(board, color) {
        const king = color ? board.#whiteKing : board.#blackKing;
        const controlledSquares = color ? Board.blackControlledSquares(board) : Board.whiteControlledSquares(board);
        for (const square of controlledSquares) {
            if (square.x === king.position.x && square.y === king.position.y) {
                return true;
            }
        }
        return false;
    }
    static isCheckMate(board, color) {
        if (Board.isCheck(board, color)) { // If the king is in check...
            // Check if any piece can make a move that makes the king not be in check
            const backupBoard = [...board.position]; // Make a backup of the board so it doesn't get modified
            for (let i = 0; i < backupBoard.length; i++) { // Loop through the board
                for (let j = 0; j < backupBoard.length; j++) {
                    if (backupBoard[i][j].color === color) { // If the piece is the same color as the king...
                        const moves = backupBoard[i][j].moves; // Get the moves of the piece
                        for (const move of moves) { // Loop through the moves of the piece
                            const originalSquare = backupBoard[move.x][move.y]; // Save the original square
                            backupBoard[move.x][move.y] = backupBoard[i][j]; // Move the piece to the new square
                            backupBoard[i][j] = new EmptySquare(); // Set the original square to empty
                            if (!Board.isCheck(backupBoard, color)) { // If the king is not in check after the move...
                                backupBoard[i][j] = backupBoard[move.x][move.y]; // Move the piece back to the original square
                                backupBoard[move.x][move.y] = originalSquare; // And set the new square to the original piece
                                return false; // The king is not in checkmate
                            } // and if the king is still in check, move the piece back to the original square so that the loop can continue
                            backupBoard[i][j] = backupBoard[move.x][move.y]; 
                            backupBoard[move.x][move.y] = originalSquare;
                        }
                    }
                }
            }
        }
        return true; // If all of the pieces have been checked and none of them can make a move that makes the king not be in check, the king is in checkmate
    }
    static isStalemate (board, color) {
        if (!Board.isCheck(board, color)) { // If the king is not in check...
            const controlledSquares = color ? Board.blackControlledSquares(board) : Board.whiteControlledSquares(board);
            for (let i = 0; i < board.length; i++) { // Loop through the board
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j].color === color) { // If the piece is the same color as the king...
                        const moves = board[i][j].moves; // Get the moves of the piece
                        for (const move of moves) { // Loop through the moves of the piece
                            if (!controlledSquares.some(square => square.x === move.x && square.y === move.y)) { // If the move is not controlled by any piece of the opposite color...
                                return false; // The game is not a stalemate
                            }
                        }
                    }
                }
            }
        }
        return true; // If the king is not in check and no piece can make a move that makes the king not be in check, the game is a stalemate
    }
    static promotion (board, newPiece, square) {
        const backupBoard = [...board]; // Make a backup of the board so it doesn't get modified
        const piece = backupBoard[square.x][square.y]; // Get the piece at the square position
        if (piece instanceof Pawn) { // If the piece is a pawn...
            backupBoard[square.x][square.y] = newPiece; // Set the square to the new piece
            return backupBoard; // Return the new board
        } else return false; // The promotion was not successful
    }
    static triggerPromotion() { // Trigger the promotion event
        this.setEvent({type: "promotion", color: this.color, square: this.position});
    }
    reset() {
        this.#matrix = [...this.#startPosition];
    }
}

class EmptySquare {
    #color; #legalMove;
    constructor() {
        this.#color = null;
        this.#legalMove = false;
    }
    get color() {
        return this.#color;
    }
    get isLegalMove() {
        return this.#legalMove;
    }
    set isLegalMove(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("legalMove must be a boolean");
        }
        this.#legalMove = value;
    }
}

export default Board;