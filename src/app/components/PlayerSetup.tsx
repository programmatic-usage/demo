"use client";

import { useState } from "react";

interface PlayerSetupProps {
  onComplete: (playerA: string, playerB: string) => void;
}

export function PlayerSetup({ onComplete }: PlayerSetupProps) {
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerA.trim() || !playerB.trim()) {
      setError("Please enter names for both players");
      return;
    }
    if (playerA.trim() === playerB.trim()) {
      setError("Players must have different names");
      return;
    }
    onComplete(playerA.trim(), playerB.trim());
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Tic Tac Toe
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Enter player names to begin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="playerA"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Player A (X)
            </label>
            <input
              id="playerA"
              type="text"
              value={playerA}
              onChange={(e) => {
                setPlayerA(e.target.value);
                setError("");
              }}
              placeholder="Enter Player A name"
              className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-violet-500 focus:outline-none transition-all duration-200"
              maxLength={20}
            />
            <div className="absolute right-3 top-[38px] text-violet-500 font-bold text-lg">
              X
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="playerB"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Player B (O)
            </label>
            <input
              id="playerB"
              type="text"
              value={playerB}
              onChange={(e) => {
                setPlayerB(e.target.value);
                setError("");
              }}
              placeholder="Enter Player B name"
              className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none transition-all duration-200"
              maxLength={20}
            />
            <div className="absolute right-3 top-[38px] text-indigo-500 font-bold text-lg">
              O
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center animate-pulse">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Start Game
        </button>
      </form>
    </div>
  );
}
