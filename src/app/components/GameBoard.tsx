"use client";

import { useState, useEffect, useCallback } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type GameState = {
  board: Cell[];
  currentPlayer: Player;
  winner: Player | "draw" | null;
  scores: { X: number; O: number };
  moves: number;
};

interface GameBoardProps {
  playerA: string;
  playerB: string;
  firstPlayer: "A" | "B";
  onReset: () => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const STORAGE_KEY = "tic-tac-toe-game";

export function GameBoard({
  playerA,
  playerB,
  firstPlayer,
  onReset,
}: GameBoardProps) {
  const getPlayerName = (player: Player) =>
    player === "X" ? playerA : playerB;
  const getStartingPlayer = (): Player => (firstPlayer === "A" ? "X" : "O");

  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed.playerA === playerA &&
            parsed.playerB === playerB &&
            parsed.firstPlayer === firstPlayer
          ) {
            return parsed.gameState;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
    return {
      board: Array(9).fill(null),
      currentPlayer: getStartingPlayer(),
      winner: null,
      scores: { X: 0, O: 0 },
      moves: 0,
    };
  });

  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          playerA,
          playerB,
          firstPlayer,
          gameState,
        })
      );
    }
  }, [gameState, playerA, playerB, firstPlayer]);

  const checkWinner = useCallback(
    (board: Cell[]): { winner: Player | "draw" | null; line: number[] | null } => {
      for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return { winner: board[a] as Player, line: combination };
        }
      }
      if (board.every((cell) => cell !== null)) {
        return { winner: "draw", line: null };
      }
      return { winner: null, line: null };
    },
    []
  );

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.winner) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, line } = checkWinner(newBoard);
    const newMoves = gameState.moves + 1;

    if (line) {
      setWinningLine(line);
    }

    setGameState((prev) => ({
      board: newBoard,
      currentPlayer: prev.currentPlayer === "X" ? "O" : "X",
      winner,
      scores:
        winner && winner !== "draw"
          ? { ...prev.scores, [winner]: prev.scores[winner] + 1 }
          : prev.scores,
      moves: newMoves,
    }));
  };

  const resetGame = () => {
    setWinningLine(null);
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: getStartingPlayer(),
      winner: null,
      scores: gameState.scores,
      moves: 0,
    });
  };

  const clearScores = () => {
    setWinningLine(null);
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: getStartingPlayer(),
      winner: null,
      scores: { X: 0, O: 0 },
      moves: 0,
    });
  };

  const getStatusMessage = () => {
    if (gameState.winner === "draw") {
      return "It's a Draw!";
    }
    if (gameState.winner) {
      return `${getPlayerName(gameState.winner)} Wins!`;
    }
    return `${getPlayerName(gameState.currentPlayer)}'s Turn`;
  };

  const isActivePlayer = (player: Player) => 
    gameState.currentPlayer === player && !gameState.winner;

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>
      </div>

      {/* Score Board */}
      <div className="flex justify-center gap-4 mb-8">
        {/* Player X Score */}
        <div
          className={`flex flex-col items-center px-6 py-4 rounded-2xl transition-all duration-300 ${
            isActivePlayer("X")
              ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 scale-105"
              : "bg-white/80 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800"
          }`}
        >
          <span className={`text-3xl font-bold mb-1 ${isActivePlayer("X") ? "text-white" : "text-amber-700 dark:text-amber-300"}`}>
            {gameState.scores.X}
          </span>
          <span className={`text-sm font-semibold ${isActivePlayer("X") ? "text-amber-100" : "text-amber-900 dark:text-amber-200"}`}>
            {playerA}
          </span>
          <span className={`text-xs ${isActivePlayer("X") ? "text-amber-200" : "text-amber-600/70 dark:text-amber-400/70"}`}>X</span>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-amber-400/50">VS</span>
        </div>

        {/* Player O Score */}
        <div
          className={`flex flex-col items-center px-6 py-4 rounded-2xl transition-all duration-300 ${
            isActivePlayer("O")
              ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xl shadow-amber-400/30 scale-105"
              : "bg-white/80 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800"
          }`}
        >
          <span className={`text-3xl font-bold mb-1 ${isActivePlayer("O") ? "text-white" : "text-amber-600 dark:text-amber-300"}`}>
            {gameState.scores.O}
          </span>
          <span className={`text-sm font-semibold ${isActivePlayer("O") ? "text-amber-100" : "text-amber-900 dark:text-amber-200"}`}>
            {playerB}
          </span>
          <span className={`text-xs ${isActivePlayer("O") ? "text-amber-100" : "text-amber-600/70 dark:text-amber-400/70"}`}>O</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        <p
          className={`text-xl font-bold transition-all duration-300 ${
            gameState.winner === "draw"
              ? "text-amber-800 dark:text-amber-200"
              : gameState.winner
              ? gameState.winner === "X"
                ? "text-amber-700 dark:text-amber-400"
                : "text-amber-500 dark:text-amber-300"
              : gameState.currentPlayer === "X"
              ? "text-amber-700 dark:text-amber-400"
              : "text-amber-500 dark:text-amber-300"
          }`}
        >
          {getStatusMessage()}
        </p>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-3xl shadow-inner">
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!gameState.winner}
            className={`
              aspect-square rounded-2xl text-5xl font-bold transition-all duration-200
              ${
                cell === null && !gameState.winner
                  ? "bg-white dark:bg-amber-950/50 hover:bg-amber-50 dark:hover:bg-amber-900/70 hover:scale-[1.05] cursor-pointer shadow-lg hover:shadow-xl"
                  : "bg-white dark:bg-amber-950/50 cursor-default shadow-lg"
              }
              ${winningLine?.includes(index) ? "animate-pulse-win bg-amber-100 dark:bg-amber-900/80" : ""}
              ${cell === "X" ? "text-amber-700 dark:text-amber-400" : ""}
              ${cell === "O" ? "text-amber-500 dark:text-amber-300" : ""}
            `}
          >
            {cell && (
              <span className="animate-pop-in inline-block">{cell}</span>
            )}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={resetGame}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:from-amber-400 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-amber-500/30"
        >
          New Round
        </button>
        <button
          onClick={clearScores}
          className="px-6 py-3 rounded-xl bg-white dark:bg-amber-950/50 border-2 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/70 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Reset Scores
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
