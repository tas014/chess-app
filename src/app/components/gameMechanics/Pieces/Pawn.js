import Piece from "./Piece";
import { FaChessPawn } from "react-icons/fa";

class Pawn extends Piece {
    #canBeEnPassant = false;
    #isPromoting = false;
    constructor(color, board) {
        super("Pawn", color, board);
    }
    get moves() {
        let moves = [];
        const baseMoves = this.#baseMoves();
        const enPassantMoves = this.#enPassant();
        moves = [...baseMoves, ...enPassantMoves];
        return moves
    }
    get pieceIcon() {
        return <FaChessPawn className ={this.color ? "white-piece" : "black-piece"} />;
    }
    #baseMoves() {
        const moves = [];
        let x, y;
        if (this.color) { // White Pawn Logic
            // Up 1
            x = this.position.x - 1; y = this.position.y;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
                // Up 2
                x = this.position.x - 2; y = this.position.y;
                if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                    moves.push({x, y});
                }
            }
            // Takes Left
            x = this.position.x - 1; y = this.position.y - 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
            }
            // Takes Right
            x = this.position.x - 1; y = this.position.y + 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
            }
        } else { // Black Pawn Logic
            // Down 1
            x = this.position.x + 1; y = this.position.y;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
                // Down 2
                x = this.position.x + 2; y = this.position.y;
                if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                    moves.push({x, y});
                }
            }
            // Takes Left
            x = this.position.x + 1; y = this.position.y - 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
            }
            // Takes Right
            x = this.position.x + 1; y = this.position.y + 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
                moves.push({x, y});
            }
        }
        return moves
    }
    #enPassant() {
        const moves = [];
        let x, y;
        if (this.color) { // White Pawn Logic
            // En Passant Left
            x = this.position.x; y = this.position.y - 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color && this.board[x][y].canBeEnPassant) {
                moves.push({x: x-1, y});
            }
            // En Passant Right
            x = this.position.x; y = this.position.y + 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color && this.board[x][y].canBeEnPassant) {
                moves.push({x: x-1, y});
            }
        } else { // Black Pawn Logic
            // En Passant Left
            x = this.position.x; y = this.position.y - 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color && this.board[x][y].canBeEnPassant) {
                moves.push({x: x+1, y});
            }
            // En Passant Right
            x = this.position.x; y = this.position.y + 1;
            if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color && this.board[x][y].canBeEnPassant) {
                moves.push({x: x+1, y});
            }
        }
        return moves
    }
    get isPromoting() {
        return this.#isPromoting;
    }
    set isPromoting(value) {
        if (typeof value !== 'boolean') throw new Error("isPromoting must be a boolean value");
        if (this.#isPromoting === value) return;
        this.#isPromoting = value;
    }

    get canBeEnPassant() {
        return this.#canBeEnPassant;
    }
    set canBeEnPassant(value) {
        if (typeof value !== 'boolean') throw new Error("canBeEnPassant must be a boolean value");
        if (this.#canBeEnPassant === value) return;
        this.#canBeEnPassant = value;
    }
}

export default Pawn;