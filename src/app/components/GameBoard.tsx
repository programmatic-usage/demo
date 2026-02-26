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
    // Try to load from local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only restore if players match
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

  // Save to local storage
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

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Tic Tac Toe
        </h1>
      </div>

      {/* Score Board */}
      <div className="flex justify-center gap-4 mb-8">
        <div
          className={`flex flex-col items-center px-6 py-4 rounded-2xl transition-all duration-300 ${
            gameState.currentPlayer === "X" && !gameState.winner
              ? "bg-violet-500/10 border-2 border-violet-500/30 scale-105"
              : "bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent"
          }`}
        >
          <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-1">
            {gameState.scores.X}
          </span>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {playerA}
          </span>
          <span className="text-xs text-zinc-400">X</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-zinc-300 dark:text-zinc-600">
            VS
          </span>
        </div>

        <div
          className={`flex flex-col items-center px-6 py-4 rounded-2xl transition-all duration-300 ${
            gameState.currentPlayer === "O" && !gameState.winner
              ? "bg-indigo-500/10 border-2 border-indigo-500/30 scale-105"
              : "bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent"
          }`}
        >
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {gameState.scores.O}
          </span>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {playerB}
          </span>
          <span className="text-xs text-zinc-400">O</span>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        <p
          className={`text-xl font-semibold transition-all duration-300 ${
            gameState.winner === "draw"
              ? "text-zinc-600 dark:text-zinc-400"
              : gameState.winner
              ? gameState.winner === "X"
                ? "text-violet-600 dark:text-violet-400"
                : "text-indigo-600 dark:text-indigo-400"
              : gameState.currentPlayer === "X"
              ? "text-violet-600 dark:text-violet-400"
              : "text-indigo-600 dark:text-indigo-400"
          }`}
        >
          {getStatusMessage()}
        </p>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 mb-8 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl">
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!gameState.winner}
            className={`
              aspect-square rounded-xl text-4xl font-bold transition-all duration-200
              ${
                cell === null && !gameState.winner
                  ? "bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 hover:scale-[1.02] cursor-pointer shadow-sm"
                  : "bg-white dark:bg-zinc-700 cursor-default"
              }
              ${winningLine?.includes(index) ? "animate-pulse-win" : ""}
              ${cell === "X" ? "text-violet-600 dark:text-violet-400" : ""}
              ${cell === "O" ? "text-indigo-600 dark:text-indigo-400" : ""}
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
          className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-violet-500/25"
        >
          New Round
        </button>
        <button
          onClick={clearScores}
          className="px-6 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Reset Scores
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 font-medium hover:border-zinc-400 dark:hover:border-zinc-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
