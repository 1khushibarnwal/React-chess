import { useState } from "react";
import Square from "./Square";
import initialBoard from "../data/initialBoard";
import { isValidMove } from "../utils/moveValidation";

function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [validMoves, setValidMoves] = useState([]);

  const getValidMoves = (row, col) => {
    const piece = board[row][col];
    const moves = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(piece, { row, col }, { row: r, col: c }, board, turn)) {
          moves.push({ row: r, col: c });
        }
      }
    }

    return moves;
  };

  const handleClick = (row, col) => {
    const piece = board[row][col];

    if (selected) {
      const movingPiece = board[selected.row][selected.col];

      const valid = isValidMove(
        movingPiece,
        selected,
        { row, col },
        board,
        turn,
      );

      if (valid) {
        const newBoard = board.map((r) => [...r]);

        newBoard[row][col] = movingPiece;
        newBoard[selected.row][selected.col] = "";

        setBoard(newBoard);
        setTurn(turn === "w" ? "b" : "w");
      }

      setSelected(null);
      setValidMoves([]);
    } else if (piece && piece[0] === turn) {
      setSelected({ row, col });
      setValidMoves(getValidMoves(row, col));
    }
  };

  return (
    <>
      <h2>Turn: {turn === "w" ? "White" : "Black"}</h2>

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;

            const highlighted = validMoves.some(
              (move) => move.row === rowIndex && move.col === colIndex,
            );

            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isDark={isDark}
                selected={
                  selected?.row === rowIndex && selected?.col === colIndex
                }
                highlight={highlighted}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            );
          }),
        )}
      </div>
    </>
  );
}

export default ChessBoard;
