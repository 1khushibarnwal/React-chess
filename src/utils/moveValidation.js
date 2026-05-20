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
