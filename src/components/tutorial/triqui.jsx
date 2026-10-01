import { useState } from 'react';
import './triqui.css';

function Square({ value, onSquareClick }) {
  return (
    <button
      className={`square ${value ? `square-${value.toLowerCase()}` : ''}`}
      onClick={onSquareClick}
      aria-label={value ? `Posición ocupada por ${value}` : 'Posición vacía'}
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
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `¡${winner} ha ganado!`;
  } else if (squares.every(Boolean)) {
    status = '¡Empate!';
  } else {
    status = `Turno de ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className={`status ${winner ? 'status-winner' : ''}`} aria-live="polite">
        <span className={winner ? `status-symbol symbol-${winner.toLowerCase()}` : ''}>
          {winner || (squares.every(Boolean) ? '—' : xIsNext ? 'X' : 'O')}
        </span>
        {status}
      </div>
      <div className="board-grid">
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(Boolean);
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button
        className={move === currentMove ? 'move-current' : ''}
        onClick={() => jumpTo(move)}
        aria-current={move === currentMove ? 'step' : undefined}
        >
        <span className="move-number">{move}</span>
        {description}
        </button>
      </li>
    );
  });

  return (
    <main className="game">
      <header className="game-header">
        <div>
        <p className="eyebrow">Clásico de estrategia</p>
        <h1>Triqui</h1>
        <p className="game-subtitle">Conecta tres símbolos y celebra la victoria.</p>
        </div>
        <button className="restart-button" onClick={restartGame}>
        <span aria-hidden="true">↻</span> Reiniciar
        </button>
      </header>
      <div className="game-layout">
        <section className="game-board" aria-label="Tablero de juego">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {winner && (
          <div className="celebration" aria-live="assertive">
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => (
                <i key={index} style={{ '--i': index }} />
              ))}
            </div>
            <p>¡Partida terminada!</p>
            <strong className={`winner-symbol symbol-${winner.toLowerCase()}`}>{winner}</strong>
            <span>¡Victoria increíble!</span>
          </div>
        )}
        {isDraw && <p className="draw-message">Nadie se rinde: ¡empate!</p>}
        </section>
        <aside className="game-info">
        <div className="history-heading">
          <div>
            <p className="eyebrow">Partida</p>
            <h2>Historial</h2>
          </div>
          <span>{history.length - 1} movimientos</span>
        </div>
        <ol>{moves}</ol>
        </aside>
      </div>
    </main>
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
      return squares[a];
    }
  }
  return null;
}