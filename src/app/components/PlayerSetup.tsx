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
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/30 animate-float">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent mb-3">
          Tic Tac Toe
        </h1>
        <p className="text-amber-800/70 dark:text-amber-200/70">
          Enter player names to begin
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Player A Input */}
          <div className="relative group">
            <label
              htmlFor="playerA"
              className="block text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2"
            >
              Player A
            </label>
            <div className="relative">
              <input
                id="playerA"
                type="text"
                value={playerA}
                onChange={(e) => {
                  setPlayerA(e.target.value);
                  setError("");
                }}
                placeholder="Enter name"
                className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-50 placeholder-amber-400/50 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 backdrop-blur-sm"
                maxLength={20}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-lg shadow-lg">
                X
              </div>
            </div>
          </div>

          {/* Player B Input */}
          <div className="relative group">
            <label
              htmlFor="playerB"
              className="block text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2"
            >
              Player B
            </label>
            <div className="relative">
              <input
                id="playerB"
                type="text"
                value={playerB}
                onChange={(e) => {
                  setPlayerB(e.target.value);
                  setError("");
                }}
                placeholder="Enter name"
                className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-50 placeholder-amber-400/50 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 backdrop-blur-sm"
                maxLength={20}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white font-bold text-lg shadow-lg">
                O
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-sm animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Game
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>
    </div>
  );
}
