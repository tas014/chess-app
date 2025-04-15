import Piece from "./Piece";
import { FaChessKing } from "react-icons/fa6"

class King extends Piece {
    constructor(color, board) {
        super("King", "K" ,color, board);
    }
    get moves() {
        const baseMoves = this.#baseMoves();
        return baseMoves
    }
    get pieceIcon() {
        return <FaChessKing className ={this.color ? "white-piece" : "black-piece"} />;
    }
    #baseMoves() {
        const moves = [];
        let x, y;
        // Up 1, Left 1
        x = this.position.x-1; y = this.position.y-1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Up 1, Right 1
        x = this.position.x-1; y = this.position.y+1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 1, Left 1
        x = this.position.x+1; y = this.position.y-1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 1, Right 1
        x = this.position.x+1; y = this.position.y+1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 1
        x = this.position.x-1; y = this.position.y;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Up 1
        x = this.position.x-1; y = this.position.y;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Left 1
        x = this.position.x; y = this.position.y-1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Right 1
        x = this.position.x; y = this.position.y+1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        return moves
    }
}

export default King;