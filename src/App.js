import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);

    if (!calculateWinner(nextSquares) && nextSquares.every(Boolean)) {
      alert("It's a draw! Both players have tied.");
    }
  }

  // Get the result from calculateWinner
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winnersLine = result ? result.line : [];

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  for (let row = 0; row < 3; row++) {
    const rowContent = [];
    
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const isWinningSquare = winnersLine.includes(index);

      rowContent.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinning={isWinningSquare}
        />
      );
    }

    board.push(
      <div key={row} className="board-row">
        {rowContent}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>{board}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isViewHistoryAscending, setIsViewHistoryAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: index },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleChangeViewOrder(nextViewOrder) {
    setIsViewHistoryAscending(nextViewOrder);
  }

  const moves = (isViewHistoryAscending ? history : [...history].reverse()).map(
    (squares, move) => {
      const actualMove = isViewHistoryAscending
        ? move
        : history.length - 1 - move;
      let description =
        actualMove > 0
          ? `Go to move #${actualMove} ${getRowCol(actualMove)}`
          : "Go to game start";

      return (
        <li key={actualMove}>
          <button onClick={() => jumpTo(actualMove)}>{description}</button>
        </li>
      );
    }
  );

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>You are at move # {currentMove}</div>
        <div>
          View history:
          <button
            onClick={() => handleChangeViewOrder(!isViewHistoryAscending)}
          >
            {isViewHistoryAscending ? "ascending" : "descending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

function getRowCol(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return `(${row}, ${col})`;
}
