import { useState } from "react";
import Square from "./Square";
import initialBoard from "../data/initialBoard";

import {
  isValidMove,
  wouldBeInCheck,
  isKingInCheck,
  isCheckmate,
  cloneBoard,
} from "../utils/moveValidation";

function ChessBoard() {
  const [board, setBoard] = useState(cloneBoard(initialBoard));
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [check, setCheck] = useState(null);
  const [theme, setTheme] = useState("classic");
  const [resetting, setResetting] = useState(false);

  const newGame = () => {
    setResetting(true);

    setTimeout(() => {
      setBoard(cloneBoard(initialBoard));
      setSelected(null);
      setValidMoves([]);
      setTurn("w");
      setWinner(null);
      setCheck(null);
      setResetting(false);
    }, 700);
  };

  const getValidMoves = (row, col) => {
    const piece = board[row][col];
    const moves = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (
          isValidMove(piece, { row, col }, { row: r, col: c }, board, turn) &&
          !wouldBeInCheck(board, { row, col }, { row: r, col: c }, turn)
        ) {
          moves.push({ row: r, col: c });
        }
      }
    }

    return moves;
  };

  const handleClick = (row, col) => {
    if (winner) return;

    const piece = board[row][col];

    if (selected) {
      const movingPiece = board[selected.row][selected.col];

      const valid =
        isValidMove(movingPiece, selected, { row, col }, board, turn) &&
        !wouldBeInCheck(board, selected, { row, col }, turn);

      if (valid) {
        const newBoard = cloneBoard(board);

        newBoard[row][col] = movingPiece;
        newBoard[selected.row][selected.col] = "";

        const nextTurn = turn === "w" ? "b" : "w";

        setBoard(newBoard);
        setTurn(nextTurn);

        const inCheck = isKingInCheck(newBoard, nextTurn);

        setCheck(inCheck ? nextTurn : null);

        if (inCheck && isCheckmate(newBoard, nextTurn)) {
          setWinner(turn === "w" ? "White" : "Black");
        }
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

      {check && !winner && <h2>CHECK!</h2>}

      {winner && (
        <div className="winner-modal">
          <h1>{winner} Wins!</h1>
          <button onClick={newGame}>Play Again</button>
        </div>
      )}

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="classic">Brown & White</option>
        <option value="bw">Black & White</option>
        <option value="gold">Cream & Gold</option>
        <option value="ocean">Ocean Blue</option>
      </select>

      <div className={`board ${theme} ${resetting ? "reset-anim" : ""}`}>
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

      <button onClick={newGame}>New Game</button>
    </>
  );
}

export default ChessBoard;
