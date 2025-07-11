import { isCheck, generateLegalMoves, isGameOver } from './pieceLogic'

interface GameEndStatus {
  isMate: boolean;
  isDraw?: boolean;
  [key: string]: any;
}

type Position = number[][];
type Turn = boolean;

interface Move {
  from: [number, number];
  to: [number, number];
  promotion?: number;
}

interface Node {
  
}

const generateMove = (position: Position, depth: number,  turn: Turn): void => {
  const gameStatus: GameEndStatus = isGameOver(position);
  if (gameStatus.isMate || gameStatus.isDraw) return null; // Game over, no moves to generate
  const checkedNodes: string[] = [];
  let bestMoveEval = -Infinity;
  let bestMove: Move | null = null;
  const legalMoves: Move[] = generateLegalMoves(position, turn);
  for (const move of legalMoves) {
    
  }
  
}

const minimax = (position: Position, depth: number, turn: boolean, nodeList : string[]): Move | null => {
  return null


}

const applyMove = (position: Position, move: Move): [boolean, Position | Position[]] => {
  const newPosition: Position = position.map(row => [...row]); // Create a deep copy of the position
  const [fromX, fromY] = move.from;
  const [toX, toY] = move.to;
  
  // Move the piece
  newPosition[toX][toY] = newPosition[fromX][fromY];
  newPosition[fromX][fromY] = 0; // Set the original square to empty
  
  // Handle promotion if applicable
  if (move?.promotion) {
    return [true, handlePromotion(newPosition, move, move.promotion)];
  }
  
  return [false, newPosition];
}

const handlePromotion = (position: Position, move: Move, promotionPiece: number): Position | Position[] => {
  const outputArray: Position[] = [];
  for (let i = 0; i < 4; i++) {
    const outputPosition: Position = position.map(row => [...row]); // Create a deep copy of the position
    const [fromX, fromY] = move.from;
    const [toX, toY] = move.to;
    switch (i) {
      case 0: // Pawn to Queen
        outputPosition[toX][toY] = 9; // Queen
        break;
      case 1: // Pawn to Rook
        outputPosition[toX][toY] = 5; // Rook
        break;
      case 2: // Pawn to Bishop
        outputPosition[toX][toY] = 4; // Bishop
        break;
      case 3: // Pawn to Knight
        outputPosition[toX][toY] = 3; // Knight
        break;
    }
    outputArray.push(outputPosition);
  }
  return outputArray;
}

const evaluatePosition = (position : Position, turn : boolean) => {
  let evaluation: number = 0;
  position.forEach((row : number[], x : number) => {
    row.forEach((piece : number, y : number) => {
      if (piece !== 0) {
        const pieceValue: number = normalizePieceValue(piece);
        evaluation += turn ? pieceValue : -pieceValue; // Adjust evaluation based on turn
        if (isCheck(position, !turn)) {
          evaluation += turn ? -1 : -1; // Add points for checking the opponent's king
        }
      }
    });
  });
  return evaluation;
}

const normalizePieceValue = (pieceValue : number) : number => {
  const color : boolean = pieceValue > 0;
  switch (Math.abs(pieceValue)) {
    case 7: return color ? 1 : -1; // Pawn
    case 6: return color ? 5 : -5; // Rook
    case 10: return color ? 8 : -8; // King
    default: return pieceValue; // Other pieces remain unchanged
  }
}

const translateToNodeString = (position) => {
  let nodeString = '';
  position.forEach((row : number[], x : number) => {
      row.forEach((piece : number, y : number) => {
          const color : boolean = piece > 0;
          switch (Math.abs(piece)) {
              case 1:
              case 7:
                  nodeString += color ? '1' : '-1';
                  break;
              case 3:
                  nodeString += color ? '3' : '-3';
                  break;
              case 4:
                  nodeString += color ? '4' : '-4';
                  break;
              case 5:
                  nodeString += color ? '5' : '-5';
                  break;
              case 6:
                  nodeString += color ? '6' : '-6';
                  break;
              case 8:
                  nodeString += color ? '8' : '-8';
                  break;
              case 9:
                  nodeString += color ? '9' : '-9';
                  break;
              case 10:
                  nodeString += color ? '10' : '-10';
                  break;
              default:
                  nodeString += '0'; // Empty square
                  break;
          }
      });
  })
  return nodeString;
}

/* case 0:
          return
        case 1:
        case 7:
        case 21:
        case 27:
          return getVisualPiece('pawn', squareContent > 0);
        case 3:
        case 23:
          return getVisualPiece('knight', squareContent > 0);
        case 4:
        case 24:
          return getVisualPiece('bishop', squareContent > 0);
        case 5:
        case 6:
        case 25:
        case 26:
          return getVisualPiece('rook', squareContent > 0);
        case 9:
        case 29:
          return getVisualPiece('queen', squareContent > 0);
        case 10:
        case 30:
        case 8:
        case 28:
          return getVisualPiece('king', squareContent > 0);

        default:
          break; */