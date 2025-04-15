class Piece {
    #name;
    #notationKey;
    #color; 
    #board; 
    #hasMoved;
    #canBeTaken = false;
    constructor (name, notationKey = "" ,color, board) {
        this.#name = name;
        this.notationKey = notationKey;
        this.#color = color;
        this.#board = board;
        this.#hasMoved = false;
    }
    get name() {
        return this.#name;
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
    get canBeTaken() {
        return this.#canBeTaken;
    }
    set canBeTaken(value) {
        if (typeof value !== "boolean") {
            throw new TypeError("canBeTaken must be a boolean");
        }
        if (this.#canBeTaken === value) return;
        this.#canBeTaken = value;
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
}

export default Piece;