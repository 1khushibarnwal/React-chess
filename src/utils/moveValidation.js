export function isValidMove(piece, from, to, board, turn) {
  if (!piece) return false;

  const color = piece[0];
  const type = piece[1];

  if (color !== turn) return false;

  const target = board[to.row][to.col];

  if (target && target[0] === color) return false;

  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  switch (type) {
    case "p":
      return validatePawn(color, rowDiff, colDiff, from, to, board);

    case "r":
      return validateRook(from, to, board);

    case "n":
      return validateKnight(rowDiff, colDiff);

    case "b":
      return validateBishop(from, to, board);

    case "q":
      return validateRook(from, to, board) || validateBishop(from, to, board);

    case "k":
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;

    default:
      return false;
  }
}

export function cloneBoard(board) {
  return board.map((r) => [...r]);
}

export function isKingInCheck(board, color) {
  let king;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}k`) {
        king = { row: r, col: c };
      }
    }
  }

  const enemy = color === "w" ? "b" : "w";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];

      if (
        piece &&
        piece[0] === enemy &&
        isValidMove(piece, { row: r, col: c }, king, board, enemy)
      ) {
        return true;
      }
    }
  }

  return false;
}

export function wouldBeInCheck(board, from, to, color) {
  const newBoard = cloneBoard(board);

  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = "";

  return isKingInCheck(newBoard, color);
}

export function isCheckmate(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];

      if (piece && piece[0] === color) {
        for (let nr = 0; nr < 8; nr++) {
          for (let nc = 0; nc < 8; nc++) {
            if (
              isValidMove(
                piece,
                { row: r, col: c },
                { row: nr, col: nc },
                board,
                color,
              ) &&
              !wouldBeInCheck(
                board,
                { row: r, col: c },
                { row: nr, col: nc },
                color,
              )
            ) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
}

function validatePawn(color, rowDiff, colDiff, from, to, board) {
  const direction = color === "w" ? -1 : 1;
  const target = board[to.row][to.col];

  if (colDiff === 0 && !target) {
    if (rowDiff === direction) return true;

    const startRow = color === "w" ? 6 : 1;

    if (
      from.row === startRow &&
      rowDiff === direction * 2 &&
      !board[from.row + direction][from.col]
    ) {
      return true;
    }
  }

  if (
    Math.abs(colDiff) === 1 &&
    rowDiff === direction &&
    target &&
    target[0] !== color
  ) {
    return true;
  }

  return false;
}

function validateKnight(rowDiff, colDiff) {
  return (
    (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
  );
}

function validateRook(from, to, board) {
  if (from.row !== to.row && from.col !== to.col) return false;

  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);

  let r = from.row + rowStep;
  let c = from.col + colStep;

  while (r !== to.row || c !== to.col) {
    if (board[r][c]) return false;
    r += rowStep;
    c += colStep;
  }

  return true;
}

function validateBishop(from, to, board) {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  if (rowDiff !== colDiff) return false;

  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);

  let r = from.row + rowStep;
  let c = from.col + colStep;

  while (r !== to.row && c !== to.col) {
    if (board[r][c]) return false;
    r += rowStep;
    c += colStep;
  }

  return true;
}
