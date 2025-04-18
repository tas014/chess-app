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
    #turn = true; // true = white, false = black
    #castling = null; // null = no castling, true = short, false = long
    #promoting = false; // true = promoting, false = not promoting
    constructor(setEvent, position = false){
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
    get position() {
        return this.#matrix;
    }
    set position(position) {
        if (!Array.isArray(position)) {
            throw new TypeError("position must be an array");
        }
        if (position.length !== 8) {
            throw new RangeError("position must be an 8x8 array");
        }
        for (const row of position) {
            if (!Array.isArray(row)) {
                throw new TypeError("position must be an array of arrays");
            }
            if (row.length !== 8) {
                throw new RangeError("position must be an 8x8 array");
            }
            if (row.some(square => !(square instanceof EmptySquare || square instanceof Piece))) {
                throw new TypeError("position must be an array of EmptySquare or Piece objects");
            }
        }
        this.#matrix = position; // Set the position of the board to the new position
    }
    get whiteKing() {
        return this.#whiteKing;
    }
    set whiteKing(king) {
        if (!(king instanceof King)) {
            throw new TypeError("whiteKing must be an instance of King");
        }
        if (king.color !== true) {
            throw new TypeError("whiteKing must be white");
        }
        this.#whiteKing = king; // Set the white king to the new position
    }
    get blackKing() {
        return this.#blackKing;
    }
    set blackKing(king) {
        if (!(king instanceof King)) {
            throw new TypeError("blackKing must be an instance of King");
        }
        if (king.color !== false) {
            throw new TypeError("blackKing must be black");
        }
        this.#blackKing = king; // Set the black king to the new position
    }
    get whiteControlledSquares() {
        const controlledSquares = new Set();
        for (let i = 0; i < this.#matrix.length; i++) {
            for (let j = 0; j < this.#matrix[i].length; j++) {
                if (this.#matrix[i][j].color) {
                    const moves = this.#matrix[i][j].moves;
                    for (const move of moves) {
                        controlledSquares.add({x:move.x, y:move.y});
                    }
                }
            }
        }
        return [...controlledSquares];
    }
    get blackControlledSquares() {
        const controlledSquares = new Set();
        for (let i = 0; i < this.#matrix.length; i++) {
            for (let j = 0; j < this.#matrix[i].length; j++) {
                if (!this.#matrix[i][j].color) {
                    const moves = this.#matrix[i][j].moves;
                    for (const move of moves) {
                        controlledSquares.add({x:move.x, y:move.y});
                    }
                }
            }
        }
        return [...controlledSquares];
    }
    get castling() {
        return this.#castling; // Get the castling of the game
    }
    set castling(castling) {
        if (castling !== null && typeof castling !== "boolean") {
            throw new TypeError("castling must be a boolean or null");
        }
        this.#castling = castling; // Set the castling of the game
    }
    get turn() {
        return this.#turn; // Get the turn of the game
    }
    set turn(turn) {
        if (typeof turn !== "boolean") {
            throw new TypeError("turn must be a boolean");
        }
        this.#turn = turn; // Set the turn of the game
    }
    makeMove(from, to) {
        const board = this.#matrix; // Get the board of the piece
        const piece = board[from.x][from.y]; // Get the piece at the from position
        const targetSquare = board[to.x][to.y]; // Get the piece or empty square at the position we are moving to
        if (targetSquare.isLegalMove) { // If the piece can move to the to position
            let enPassant = false; // Set the en passant flag to false
            if (piece instanceof King) { // If the piece is a king...
                this.#handleKingMove(piece, to); // Call the handle king move method
            } else if (piece instanceof Pawn){ // If the piece is a pawn...
                enPassant = this.#handlePawnMove(piece, to); // Call the handle pawn move method
            }
            if (!this.#promoting) { // If there was no promotion event...
                board[to.x][to.y] = piece; // Move the piece to the to position
                board[from.x][from.y] = new EmptySquare(); // Set the square the piece was on to empty
                if (!piece.hasMoved) piece.hasMoved = true; // Set the piece as moved
                this.clearMoves(enPassant); // Clear the legal moves of the board
                return true; // Return true to indicate the move was successful
            }
        } else {
            throw new Error("Illegal move"); // If the piece can't move to the to position, throw an error
        }
    }
    showMoves(selectedPiece) {
        const moves = selectedPiece.moves; // Get the moves of the piece
        this.clearMoves(); // Clear the legal moves of the board
        const board = selectedPiece.board; // Get the board of the piece
        selectedPiece.isSelected = true; // Set the piece as selected
        for (const move of moves) { // Loop through the moves of the piece
            board[move.x][move.y].isLegalMove = true; // Set the move as legal on our interface
        }
    }
    clearMoves(enPassant = false) {
        for (let row of this.#matrix) { // Loop through the board...
            for (let square of row) { //And set each square...
                square.isLegalMove = false; // As not a legal move
                if (square instanceof Pawn && !enPassant) { // If the square is a pawn...
                    square.canBeEnPassant = false; // Set the can be en passant to false
                }
                if (square?.isSelected !== undefined) { // Check if square can be a selected piece...
                    square.isSelected = false; // And clear it
                }
            }
        }
        if (this.#promoting) { // If there was a promotion event...
            this.#promoting = false; // Set the promoting flag to false
        }
    }
    get isCheck() {
        const board = this.#matrix; // Get the board of the piece
        const king = turn ? this.whiteKing : this.blackKing; // Get the king of the current turn
        const controlledSquares = turn ? this.blackControlledSquares : this.whiteControlledSquares; // Get the controlled squares of the opposite color
        for (const square of controlledSquares) { // Loop through the controlled squares
            if (square.x === king.position.x && square.y === king.position.y) { // If the king is in a controlled square...
                return true; // The king is in check
            }
        }
        return false; // Otherwise the king is not in check
    }
    get isCheckMate() {
        if (this.isCheck) { // If the king is in check...
            const emulatedBoard = {...this} // Make a backup of the board so it doesn't get modified
            for (let i = 0; i < emulatedBoard.length; i++) { // Loop through the board
                for (let j = 0; j < emulatedBoard.length; j++) {
                    if (emulatedBoard[i][j].color === emulatedBoard.turn) { // If the piece is the same color as the king...
                        if (emulatedBoard[i][j].moves.length > 0) { // If the piece has legal moves...
                            return false; // The king is not in checkmate
                        } // otherwise...
                    }
                } // we keep looping...
            }
        } else return false; // If the king is not in check, the king is not in checkmate
        return true; // If the king is in check and there are no legal moves, the king is in checkmate
    }
    get isStalemate () {
        if (!this.isCheck) { // If the king is not in check...
            for (const row of this.#matrix) { // Loop through the board
                for (const square of row) { // Loop through the squares of the board
                    if (square.color === this.#turn) { // If the piece is the same color as the king...
                        if (square.moves.length > 0) { // If the piece has moves...
                            return false; // The game is not a stalemate
                        } 
                    }
                }
            }
            return true; // If all of the pieces have been checked and none of them can make a move but the king is not in check, the game is a stalemate
        }
    }
    static promotion (board, newPiece, square) {
        const newMatrix = [...board.position]; // Make a copy of the board to make the promotion
        newPiece.hasMoved = true; // Set the piece as moved
        newMatrix[square.x][square.y] = newPiece; // Set the new piece to the square
        if (newPiece.color) { // If the piece is white...
            newMatrix[square.x+1][square.y] = new EmptySquare(); // Set the square the pawn was in to empty
        } else { // If the piece is black...
            newMatrix[square.x-1][square.y] = new EmptySquare(); // Set the square the pawn was in to empty
        }
        board.position = newMatrix; // Set the new board to the new matrix
        board.setEvent(null); // Set the event to null to indicate the promotion has been made
        board.clearMoves(); // Clear the legal moves of the board
        board.turn = !board.turn; // Change the turn
    }
    static isMoveLegal(board, piece, move) {
        const emulatedBoard = {...board}; // Make a copy of the board so we can emulate the move
        const newMatrix = [...emulatedBoard.position]; // Make a copy of the board so we can emulate the move        
        const from = emulatedBoard[piece.position.x][piece.position.y]; // Get the piece at the square position
        const to = emulatedBoard[move.x][move.y]; // Get the piece or empty square at the position we are emulating the move to
        newMatrix[piece.position.x][piece.position.y] = new EmptySquare(); // Set the original square to empty
        newMatrix[move.x][move.y] = from; // Move the piece to the new square
        emulatedBoard.position = newMatrix; // Set the new board to the emulated board
        return emulatedBoard.isCheck; // Return if the king is in check after the emulated move
    }
    #shortCastle(king) {
        const board = this.#matrix; // Get the board of the piece
        if (king.color) { // If the king is white...
            board[7][5] = new Rook(true, board); // Set the rook to the new position
            board[7][7] = new EmptySquare(); // Set the original rook square to empty
            this.#updateHasMoved(board[7][5]); // Set the rook as moved
        } else { // If the king is black...
            board[0][5] = new Rook(false, board); // Set the rook to the new position
            board[0][7] = new EmptySquare(); // Set the original rook square to empty 
            this.#updateHasMoved(board[0][5]); // Set the rook as moved
        }
    }
    #longCastle(king) {
        const board = this.#matrix; // Get the board of the piece
        if (king.color) { // If the king is white...
            board[7][3] = new Rook(true, board); // Set the rook to the new position
            board[7][0] = new EmptySquare(); // Set the original rook square to empty
            this.#updateHasMoved(board[7][3]); // Set the rook as moved
        } else { // If the king is black...
            board[0][3] = new Rook(false, board); // Set the rook to the new position
            board[0][0] = new EmptySquare(); // Set the original rook square to empty 
            this.#updateHasMoved(board[0][3]); // Set the rook as moved
        }
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
        matrix[0][0] = new Rook(false, this);
        matrix[0][1] = new Knight(false, this);
        matrix[0][2] = new Bishop(false, this);
        matrix[0][3] = new Queen(false, this);
        matrix[0][4] = new King(false, this);
        matrix[0][5] = new Bishop(false, this);
        matrix[0][6] = new Knight(false, this);
        matrix[0][7] = new Rook(false, this);
        for (let i = 0; i < 8; i++) {
            matrix[1][i] = new Pawn(false, this);
        }
        
        // White pieces
        matrix[7][0] = new Rook(true, this);
        matrix[7][1] = new Knight(true, this);
        matrix[7][2] = new Bishop(true, this);
        matrix[7][3] = new Queen(true, this);
        matrix[7][4] = new King(true, this);
        matrix[7][5] = new Bishop(true, this);
        matrix[7][6] = new Knight(true, this);
        matrix[7][7] = new Rook(true, this);
        for (let i = 0; i < 8; i++) {
            matrix[6][i] = new Pawn(true, this);
        }
        return matrix;
    }
    #updateHasMoved(...pieces){
        for (const piece of pieces) { // Loop through the pieces
            piece.hasMoved = true; // Set the piece as moved
        }
    }
    #handleKingMove(king, to) {
        const board = this.#matrix; // Get the board of the piece
        if (this.#castling) { // If the king is castling short...
            this.#shortCastle(king); // Call the short castle method
        } else if (this.#castling === false) { // If the king is castling long...
            this.#longCastle(king); // Call the long castle method
        } else { // If the king is not castling...
            if (king.color) { // If the king is white...
                this.#whiteKing = king; // Simply update the white king position
            } else { // If the king is black...
                this.#blackKing = king; // Simply update the black king position
            }
        }
    }
    #handlePawnMove(pawn, to) {
        if (Math.abs(pawn.position.x - to.x) === 2) { // If the pawn moved two squares...
            pawn.canBeEnPassant = true; // Set the can be en passant flag to true
            return true; // Return true to indicate we should skip the en passant reset this turn
        }
        const sideSquare = this.#matrix[pawn.position.x][to.y] // Get the square beside the pawn
        if (pawn.color) { // If the pawn is white...
            if (to.x === 0) { // If the pawn is on the last row...
                this.#triggerPromotion(to); // Trigger the promotion event
            }
        } else { // If the pawn is black...
            if (to.x === 7) { // If the pawn is on the last row...
                this.#triggerPromotion(to); // Trigger the promotion event
            }
        }
        if (sideSquare instanceof Pawn && sideSquare.color !== pawn.color) { // If an enemy pawn is beside the pawn...
            if (sideSquare.canBeEnPassant) { // If the pawn can be taken en passant...
                this.#matrix[pawn.position.x][to.y] = new EmptySquare(); // Remove the taken pawn
            }
        }
        return false; // Return false to indicate we can set enPassant flags to false
    }
    #triggerPromotion(pawn, promotionSquare) { // Trigger the promotion event
        this.#promoting = true; // Set the promoting flag to true
        this.setEvent({type: "promotion", color: pawn.color, square: promotionSquare});
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