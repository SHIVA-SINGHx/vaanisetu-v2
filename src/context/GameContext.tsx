"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/sound";

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastDay: string;
  correctAnswers: number;
  totalAttempts: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
  activeGame: string | null;
}

interface GameContextType extends GameState {
  addXP: (amount: number, reason?: string) => void;
  recordAnswer: (isCorrect: boolean) => void;
  toggleSound: () => void;
  setActiveGame: (gameId: string | null) => void;
  resetProgress: () => void;
  triggerConfetti: () => void;
  playSound: (type: "click" | "success" | "error" | "levelup" | "flip") => void;
  speak: (text: string, lang?: string) => void;
}

const STORAGE_KEY = "vaanisetu_v2_data";

const defaultState: GameState = {
  xp: 0,
  level: 1,
  streak: 1,
  lastDay: "",
  correctAnswers: 0,
  totalAttempts: 0,
  soundEnabled: true,
  unlockedBadges: [],
  activeGame: "flashcards"
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const today = new Date().toDateString();
          let nextStreak = parsed.streak || 1;
          if (parsed.lastDay && parsed.lastDay !== today) {
            const prevDate = new Date(parsed.lastDay);
            const curDate = new Date(today);
            const diffDays = Math.floor((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              nextStreak = (parsed.streak || 1) + 1;
            } else if (diffDays > 1) {
              nextStreak = 1;
            }
          }
          return {
            ...defaultState,
            ...parsed,
            streak: nextStreak,
            lastDay: today,
            level: Math.floor((parsed.xp || 0) / 100) + 1
          };
        }
      } catch {
        // ignore
      }
    }
    return defaultState;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          xp: state.xp,
          streak: state.streak,
          lastDay: state.lastDay,
          correctAnswers: state.correctAnswers,
          totalAttempts: state.totalAttempts,
          soundEnabled: state.soundEnabled,
          unlockedBadges: state.unlockedBadges
        })
      );
    } catch {
      // ignore
    }
  }, [state]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff7043", "#155c48", "#ffcf70", "#38bdf8", "#ec4899"]
      });
    } catch {
      // ignore
    }
  };

  const playSound = (type: "click" | "success" | "error" | "levelup" | "flip") => {
    if (!state.soundEnabled) return;
    switch (type) {
      case "click":
        soundEngine.playClick(true);
        break;
      case "success":
        soundEngine.playSuccess(true);
        break;
      case "error":
        soundEngine.playError(true);
        break;
      case "levelup":
        soundEngine.playLevelUp(true);
        break;
      case "flip":
        soundEngine.playCardFlip(true);
        break;
    }
  };

  const speak = (text: string, lang: string = "English") => {
    soundEngine.speak(text, lang);
  };

  const addXP = (amount: number) => {
    setState((prev) => {
      const newXP = Math.max(0, prev.xp + amount);
      const oldLevel = Math.floor(prev.xp / 100) + 1;
      const newLevel = Math.floor(newXP / 100) + 1;

      if (newLevel > oldLevel) {
        playSound("levelup");
        triggerConfetti();
      }

      // Check badges
      const nextBadges = [...prev.unlockedBadges];
      if (newXP >= 10 && !nextBadges.includes("badge1")) nextBadges.push("badge1");
      if (newXP >= 100 && !nextBadges.includes("badge2")) nextBadges.push("badge2");
      if (prev.correctAnswers >= 10 && !nextBadges.includes("badge3")) nextBadges.push("badge3");
      if (prev.streak >= 7 && !nextBadges.includes("badge4")) nextBadges.push("badge4");
      if (newXP >= 250 && !nextBadges.includes("badge5")) nextBadges.push("badge5");
      if (newXP >= 500 && !nextBadges.includes("badge6")) nextBadges.push("badge6");

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        unlockedBadges: nextBadges
      };
    });
  };

  const recordAnswer = (isCorrect: boolean) => {
    setState((prev) => {
      const newAttempts = prev.totalAttempts + 1;
      const newCorrect = isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;

      const nextBadges = [...prev.unlockedBadges];
      if (newCorrect >= 10 && !nextBadges.includes("badge3")) nextBadges.push("badge3");

      return {
        ...prev,
        totalAttempts: newAttempts,
        correctAnswers: newCorrect,
        unlockedBadges: nextBadges
      };
    });
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const setActiveGame = (gameId: string | null) => {
    setState((prev) => ({ ...prev, activeGame: gameId }));
  };

  const resetProgress = () => {
    const fresh: GameState = {
      ...defaultState,
      soundEnabled: state.soundEnabled,
      lastDay: new Date().toDateString()
    };
    setState(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        addXP,
        recordAnswer,
        toggleSound,
        setActiveGame,
        resetProgress,
        triggerConfetti,
        playSound,
        speak
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
