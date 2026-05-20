const symbols = {
  wp: "♙",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  wq: "♕",
  wk: "♔",

  bp: "♟",
  br: "♜",
  bn: "♞",
  bb: "♝",
  bq: "♛",
  bk: "♚",
};

function Piece({ type }) {
  const isWhite = type[0] === "w";

  return (
    <span className={`piece ${isWhite ? "white-piece" : "black-piece"}`}>
      {symbols[type]}
    </span>
  );
}

export default Piece;
