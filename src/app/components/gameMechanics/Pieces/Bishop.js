import Piece from "./Piece";
import FaChessBishop from "react-icons/fa6"

class Bishop extends Piece{
    constructor(color, board) {
        super("Bishop", "B" ,color, board);
    }
    get moves() {
        const baseMoves = this.#baseMoves();
        const filteredMoves = this.filterIllegalMoves(baseMoves);
        return filteredMoves
    }
    get pieceIcon() {
        return <FaChessBishop className ={`${this.color ? "white-piece" : "black-piece"} ${this.isSelected ? "selected-piece" : ""} ${this.canBeTaken ? "takeable-piece" : ""}`}/>;
    }
    #baseMoves() {
        const moves = [];
        let x, y;
        // Up-Left
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x - i; y = this.position.y - i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Up-Right
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x - i; y = this.position.y + i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Down-Left
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x + i; y = this.position.y - i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        // Down-Right
        for (let i = 1; i < this.board.length; i++) {
            x = this.position.x + i; y = this.position.y + i;
            if (this.existsInBoard({x, y})) {
                if (this.board[x][y].color === this.color) break;
                moves.push({x, y});
                if (this.board[x][y].color !== null) break;
            } else break;
        }
        return moves
    }
}

export default Bishop;