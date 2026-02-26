"use client";

import { useState, useEffect } from "react";

interface DiceRollProps {
  playerA: string;
  playerB: string;
  onComplete: (firstPlayer: "A" | "B") => void;
}

function Dice({ value, isRolling }: { value: number; isRolling: boolean }) {
  const dots = {
    1: [[50, 50]],
    2: [
      [25, 25],
      [75, 75],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [25, 25],
      [75, 25],
      [25, 75],
      [75, 75],
    ],
    5: [
      [25, 25],
      [75, 25],
      [50, 50],
      [25, 75],
      [75, 75],
    ],
    6: [
      [25, 25],
      [75, 25],
      [25, 50],
      [75, 50],
      [25, 75],
      [75, 75],
    ],
  };

  return (
    <div
      className={`relative w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center transition-transform duration-100 ${
        isRolling ? "animate-dice-shake" : ""
      }`}
    >
      <div className="absolute inset-2 bg-gradient-to-br from-white to-zinc-100 rounded-xl" />
      {dots[value as keyof typeof dots].map(([x, y], i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-zinc-800 rounded-full shadow-sm"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {/* Decorative corners */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-zinc-300 rounded-full opacity-50" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-zinc-300 rounded-full opacity-50" />
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-zinc-300 rounded-full opacity-50" />
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-zinc-300 rounded-full opacity-50" />
    </div>
  );
}

export function DiceRoll({ playerA, playerB, onComplete }: DiceRollProps) {
  const [diceA, setDiceA] = useState(1);
  const [diceB, setDiceB] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<{
    winner: "A" | "B";
    rollA: number;
    rollB: number;
  } | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    // Auto-start the roll after a short delay
    const timer = setTimeout(() => {
      startRoll();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const startRoll = () => {
    setIsRolling(true);
    let rolls = 0;
    const maxRolls = 20;

    const rollInterval = setInterval(() => {
      setDiceA(Math.floor(Math.random() * 6) + 1);
      setDiceB(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= maxRolls) {
        clearInterval(rollInterval);
        finalizeRoll();
      }
    }, 100);
  };

  const finalizeRoll = () => {
    const finalA = Math.floor(Math.random() * 6) + 1;
    const finalB = Math.floor(Math.random() * 6) + 1;

    setDiceA(finalA);
    setDiceB(finalB);
    setIsRolling(false);

    const winner: "A" | "B" = finalA >= finalB ? "A" : "B";
    setResult({ winner, rollA: finalA, rollB: finalB });

    setTimeout(() => {
      setShowWinner(true);
    }, 500);

    setTimeout(() => {
      onComplete(winner);
    }, 3000);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Rolling the Dice
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Highest roll goes first!
        </p>
      </div>

      <div className="flex justify-center gap-8 mb-10">
        <div className="flex flex-col items-center gap-3">
          <Dice value={diceA} isRolling={isRolling} />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {playerA}
          </span>
          <span className="text-xs text-zinc-400">Player A (X)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Dice value={diceB} isRolling={isRolling} />
          <span className="text-sm font-medium text-amber-500 dark:text-amber-300">
            {playerB}
          </span>
          <span className="text-xs text-zinc-400">Player B (O)</span>
        </div>
      </div>

      {showWinner && result && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {result.rollA === result.rollB ? "It's a tie! " : ""}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {result.winner === "A" ? playerA : playerB}
              </span>
              {" goes first!"}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  result.winner === "A"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-amber-500 dark:text-amber-300"
                }`}
              >
                {result.winner === "A" ? "X" : "O"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
