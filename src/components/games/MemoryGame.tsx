"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { MEMORY_LEVELS } from "@/lib/data";
import { Sparkles, Eye, Check, X, RotateCw, ArrowRight, BrainCircuit } from "lucide-react";

const getLevelData = (lvlIdx: number) => {
  const lvl = MEMORY_LEVELS[lvlIdx % MEMORY_LEVELS.length];
  return {
    lvl,
    shuffled: [...lvl.words]
  };
};

export default function MemoryGame() {
  const { addXP, recordAnswer, playSound } = useGame();
  
  const [levelIndex, setLevelIndex] = useState(0);
  const [stage, setStage] = useState<"memorize" | "recall" | "result">("memorize");
  const [timerCount, setTimerCount] = useState<number>(() => getLevelData(0).lvl.timeSeconds);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableChoices, setAvailableChoices] = useState<string[]>(() => getLevelData(0).shuffled);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentLevel = MEMORY_LEVELS[levelIndex % MEMORY_LEVELS.length];

  const startLevel = (lvlIdx: number) => {
    const { lvl, shuffled } = getLevelData(lvlIdx);
    setLevelIndex(lvlIdx);
    setStage("memorize");
    setTimerCount(lvl.timeSeconds);
    setUserSequence([]);
    setIsCorrect(false);
    setAvailableChoices(shuffled);
  };

  useEffect(() => {
    if (stage !== "memorize") return;

    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage("recall");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleChipClick = (word: string) => {
    playSound("click");
    const nextSeq = [...userSequence, word];
    setUserSequence(nextSeq);

    if (nextSeq.length === currentLevel.words.length) {
      const correct = nextSeq.every((w, idx) => w === currentLevel.words[idx]);
      setIsCorrect(correct);
      setStage("result");

      if (correct) {
        playSound("success");
        addXP(25);
        recordAnswer(true);
      } else {
        playSound("error");
        recordAnswer(false);
      }
    }
  };

  const handleUndo = () => {
    playSound("click");
    setUserSequence(prev => prev.slice(0, -1));
  };

  const handleNextLevel = () => {
    playSound("click");
    startLevel(levelIndex + 1);
  };

  const handleRetry = () => {
    playSound("click");
    startLevel(levelIndex);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Level Header */}
      <div className="flex items-center justify-between bg-[#fffaf2] p-3 sm:p-4 rounded-2xl border border-[#eadfca]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-[#155c48]" />
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#ff7043] uppercase tracking-wider">
              Level {levelIndex + 1}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#173f35]">
              {stage === "memorize" ? "Memorize Sequence!" : stage === "recall" ? "Recreate Order" : "Results"}
            </h3>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-[#fff0d5] text-[#8a4c00] border border-[#ffcf70] px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-[#ff7043]" />
          +25 XP
        </span>
      </div>

      {/* Main Gameplay Screen */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#eadfca] shadow-md text-center space-y-4 sm:space-y-6">
        
        {/* STAGE 1: MEMORIZE */}
        {stage === "memorize" && (
          <div className="space-y-4 sm:space-y-6 py-2">
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#ff7043]">
              <Eye className="w-4 h-4" />
              <span>Memorize before timer ends: <strong className="text-lg sm:text-xl">{timerCount}s</strong></span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {currentLevel.words.map((word, idx) => (
                <div
                  key={idx}
                  className="px-3 sm:px-5 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#d9f3e9] text-[#155c48] font-black text-sm sm:text-xl border-2 border-[#155c48]/20 shadow-2xs"
                >
                  <span className="text-[10px] sm:text-xs text-[#5e7068] block font-bold mb-0.5">#{idx + 1}</span>
                  {word}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStage("recall")}
              className="px-5 py-2.5 rounded-xl bg-[#155c48] hover:bg-[#0f4234] text-white font-bold text-xs shadow-2xs transition-all"
            >
              I Got It! Test Me Now →
            </button>
          </div>
        )}

        {/* STAGE 2: RECALL */}
        {stage === "recall" && (
          <div className="space-y-4 sm:space-y-6 py-1">
            <div>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5e7068]">
                Your Order ({userSequence.length}/{currentLevel.words.length}):
              </span>
              
              <div className="min-h-[52px] sm:min-h-[60px] mt-1.5 bg-[#fffaf2] border-2 border-dashed border-[#155c48]/30 rounded-2xl p-2 sm:p-3 flex flex-wrap items-center justify-center gap-1.5">
                {userSequence.length === 0 ? (
                  <span className="text-xs font-semibold text-[#5e7068]/60 italic">
                    Tap the cards below in memorized order
                  </span>
                ) : (
                  userSequence.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-[#155c48] text-white font-bold text-xs sm:text-sm shadow-2xs"
                    >
                      {idx + 1}. {word}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Available options */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#5e7068] block">Select words:</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
                {availableChoices.map((word, idx) => {
                  const usedCount = userSequence.filter(w => w === word).length;
                  const totalCount = currentLevel.words.filter(w => w === word).length;
                  const isExhausted = usedCount >= totalCount;

                  return (
                    <button
                      key={idx}
                      disabled={isExhausted}
                      onClick={() => handleChipClick(word)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base transition-all ${
                        isExhausted
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-40"
                          : "bg-white border-2 border-[#ffcf70] hover:border-[#ff7043] text-[#173f35] hover:bg-[#fff0d5] shadow-2xs"
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            {userSequence.length > 0 && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5e7068] hover:text-[#ff7043] transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                <span>Undo selection</span>
              </button>
            )}
          </div>
        )}

        {/* STAGE 3: RESULT */}
        {stage === "result" && (
          <div className="space-y-4 sm:space-y-6 py-2">
            <div 
              className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 ${
                isCorrect 
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
                  : "bg-rose-50 border-rose-300 text-rose-900"
              }`}
            >
              {isCorrect ? (
                <>
                  <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-full">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black">Phenomenal Memory! (+25 XP)</h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    You recalled every word in perfect order!
                  </p>
                </>
              ) : (
                <>
                  <div className="p-2 sm:p-3 bg-rose-100 text-rose-700 rounded-full">
                    <X className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black">Close Attempt!</h4>
                  <p className="text-xs text-rose-800 font-medium">
                    Order was: <strong>{currentLevel.words.join(" → ")}</strong>
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#eadfca] hover:bg-[#fff0d5] text-[#173f35] font-bold text-xs sm:text-sm shadow-2xs transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Level</span>
              </button>

              <button
                onClick={handleNextLevel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#155c48] hover:bg-[#0f4234] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                <span>Next Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
