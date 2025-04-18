import Piece from "./Piece";
import FaChessRook from "react-icons/fa6"

class Rook extends Piece {
    constructor(color, board) {
        super("Rook", "R" ,color, board);
    }
    get moves() {
        const baseMoves = this.#baseMoves();
        const filteredMoves = this.filterIllegalMoves(baseMoves);
        return filteredMoves
    }
    get pieceIcon() {
        return <FaChessRook className ={`${this.color ? "white-piece" : "black-piece"} ${this.isSelected ? "selected-piece" : ""} ${this.canBeTaken ? "takeable-piece" : ""}`}/>;
    }
    #baseMoves() {
        const moves = [];
        let x, y;
        // Up
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x - i; y = this.position.y;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Down
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x + i; y = this.position.y;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Left
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x; y = this.position.y - i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Right
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x; y = this.position.y + i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        return moves
    }
}

export default Rook;