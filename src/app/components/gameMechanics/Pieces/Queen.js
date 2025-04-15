import Piece from "./Piece";
import { FaChessQueen } from "react-icons/fa6"

class Queen extends Piece {
    constructor(color, board) {
        super("Queen", "Q" ,color, board);
    }
    get moves() {
        const baseMoves = [...this.#straightMoves(), ...this.#diagonalMoves()];
        return baseMoves
    }
    get pieceIcon() {
        return <FaChessQueen className ={this.color ? "white-piece" : "black-piece"} />;
    }
    #diagonalMoves() {
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
    #straightMoves() {
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

export default Queen;