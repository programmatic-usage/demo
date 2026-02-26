"use client";

import { useState, useEffect } from "react";

interface DiceRollProps {
  playerA: string;
  playerB: string;
  onComplete: (firstPlayer: "A" | "B") => void;
}

function Dice({ value, isRolling, color }: { value: number; isRolling: boolean; color: "dark" | "light" }) {
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

  const bgGradient = color === "dark" 
    ? "from-amber-600 to-amber-700" 
    : "from-amber-400 to-amber-500";
  
  const dotColor = color === "dark" ? "bg-white" : "bg-amber-950";

  return (
    <div
      className={`relative w-24 h-24 rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-100 ${
        isRolling ? "animate-dice-shake" : ""
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-2xl`} />
      <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      
      {dots[value as keyof typeof dots].map(([x, y], i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${dotColor} rounded-full shadow-lg`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
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
    const timer = setTimeout(() => {
      startRoll();
    }, 800);
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
    }, 400);

    setTimeout(() => {
      onComplete(winner);
    }, 2500);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 mb-2">
          Rolling the Dice
        </h2>
        <p className="text-amber-800/70 dark:text-amber-200/70">
          Highest roll goes first!
        </p>
      </div>

      {/* Dice Display */}
      <div className="flex justify-center gap-10 mb-10">
        <div className="flex flex-col items-center gap-4">
          <Dice value={diceA} isRolling={isRolling} color="dark" />
          <div className="text-center">
            <span className="block text-lg font-bold text-amber-800 dark:text-amber-200">
              {playerA}
            </span>
            <span className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">Player A (X)</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Dice value={diceB} isRolling={isRolling} color="light" />
          <div className="text-center">
            <span className="block text-lg font-bold text-amber-800 dark:text-amber-200">
              {playerB}
            </span>
            <span className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">Player B (O)</span>
          </div>
        </div>
      </div>

      {/* Winner Announcement */}
      {showWinner && result && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex flex-col items-center gap-4 px-10 py-8 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 border-2 border-amber-400/30 shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-lg text-amber-800 dark:text-amber-200 mb-1">
                {result.rollA === result.rollB ? "It's a tie! " : ""}
                <span className="font-bold text-amber-950 dark:text-amber-50">
                  {result.winner === "A" ? playerA : playerB}
                </span>
                {" goes first!"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span
                  className={`text-3xl font-bold ${
                    result.winner === "A"
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-amber-500 dark:text-amber-300"
                  }`}
                >
                  {result.winner === "A" ? "X" : "O"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
