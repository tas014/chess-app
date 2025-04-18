import Board from "../Board";

class Piece {
    #name;
    #notationKey;
    #color; 
    #board;
    #hasMoved;
    #handler;
    #canBeTaken = false;
    #isSelected = false;
    constructor (name, notationKey = "" , color, handler) {
        this.#name = name;
        this.#handler = handler;
        this.notationKey = notationKey;
        this.#color = color;
        this.#board = handler.position;
        this.#hasMoved = false;
    }
    get name() {
        return this.#name;
    }
    get handler() {
        return this.#handler;
    }
    get notationKey() {
        return this.#notationKey;
    }
    get color() {
        return this.#color;
    }
    get moves() {
        return [];
    }
    get board() {
        return this.#board;
    }
    get hasMoved() {
        return this.#hasMoved;
    }
    set hasMoved(value) {
        this.#hasMoved = value;
    }
    get isLegalMove() {
        return this.#canBeTaken
    }
    set isLegalMove(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("canBeTaken must be a boolean");
        }
        if (this.#canBeTaken === value) return;
        this.#canBeTaken = value;
    }
    get canBeTaken() {
        return this.#canBeTaken;
    }
    get isSelected() {
        return this.#isSelected;
    }
    set isSelected(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("isSelected must be a boolean");
        }
        this.#isSelected = value;
    }
    get position() {
        for (let i = 0; i < this.#board.length; i++) {
            for (let j = 0; j < this.#board[i].length; j++) {
                if (this.#board[i][j] === this) {
                    return {x: i, y: j};
                }
            }
        }
        return null;
    }
    existsInBoard(square) {
        return square.x >= 0 && square.x < this.#board.length && square.y >= 0 && square.y < this.#board.length;
    }
    filterIllegalMoves(moves) {
        const legalMoves = moves.filter(move => Board.isLegalMove(this.#handler, this, move));
        return legalMoves
    }
}

export default Piece;