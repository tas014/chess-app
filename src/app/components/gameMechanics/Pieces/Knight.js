import Piece from "./Piece";
import FaChessKnight from "react-icons/fa6"

class Knight extends Piece {
    super(color, board) {
        super("Knight", "N" ,color, board);
    }
    get moves() {
        const baseMoves = this.#baseMoves();
        return baseMoves
    }
    get pieceIcon() {
        return <FaChessKnight className ={this.color ? "white-piece" : "black-piece"} />;
    }
    #baseMoves() {
        const moves = [];
        let x, y;
        // Up 2, Left 1
        x = this.position.x-2; y = this.position.y-1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Up 2, Right 1
        x = this.position.x-2; y = this.position.y+1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 2, Left 1
        x = this.position.x+2; y = this.position.y-1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 2, Right 1
        x = this.position.x+2; y = this.position.y+1;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Up 1, Left 2
        x = this.position.x-1; y = this.position.y-2;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Up 1, Right 2
        x = this.position.x-1; y = this.position.y+2;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 1, Left 2
        x = this.position.x+1; y = this.position.y-2;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        // Down 1, Right 2
        x = this.position.x+1; y = this.position.y+2;
        if (this.existsInBoard({x, y}) && this.board[x][y].color !== this.color) {
            moves.push({x, y});
        }
        return moves
    }
}

export default Knight;