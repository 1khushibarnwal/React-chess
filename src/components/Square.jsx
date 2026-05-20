import Piece from "./Piece";

function Square({ piece, isDark, onClick, selected, highlight }) {
  return (
    <div
      className={`square 
        ${isDark ? "dark" : "light"}
        ${selected ? "selected" : ""}
        ${highlight ? "highlight" : ""}
      `}
      onClick={onClick}
    >
      {piece && <Piece type={piece} />}
    </div>
  );
}

export default Square;
