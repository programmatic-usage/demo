"use client";

import { useState } from "react";
import { PlayerSetup } from "./components/PlayerSetup";
import { DiceRoll } from "./components/DiceRoll";
import { GameBoard } from "./components/GameBoard";

type GamePhase = "setup" | "dice" | "playing";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [firstPlayer, setFirstPlayer] = useState<"A" | "B">("A");

  const handleSetupComplete = (nameA: string, nameB: string) => {
    setPlayerA(nameA);
    setPlayerB(nameB);
    setPhase("dice");
  };

  const handleDiceComplete = (winner: "A" | "B") => {
    setFirstPlayer(winner);
    setPhase("playing");
  };

  const handleReset = () => {
    setPhase("setup");
    setPlayerA("");
    setPlayerB("");
    setFirstPlayer("A");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 dark:from-amber-950 dark:via-amber-900 dark:to-amber-800 flex items-center justify-center p-4">
      <main className="w-full flex flex-col items-center justify-center">
        {phase === "setup" && <PlayerSetup onComplete={handleSetupComplete} />}

        {phase === "dice" && (
          <DiceRoll
            playerA={playerA}
            playerB={playerB}
            onComplete={handleDiceComplete}
          />
        )}

        {phase === "playing" && (
          <GameBoard
            playerA={playerA}
            playerB={playerB}
            firstPlayer={firstPlayer}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
