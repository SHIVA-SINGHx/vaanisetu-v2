"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { PUZZLES_DATA, PuzzleItem } from "@/lib/data";
import { 
  Sparkles, 
  HelpCircle, 
  RotateCw, 
  Check, 
  X, 
  ArrowRight,
  Lightbulb
} from "lucide-react";

const getPuzzleData = (idx: number) => {
  const puzzle = PUZZLES_DATA[idx % PUZZLES_DATA.length];
  const chars = puzzle.scrambled.split("").map((char, index) => ({
    char,
    index,
    used: false
  }));
  return { puzzle, chars };
};

export default function WordScrambleGame() {
  const { addXP, recordAnswer, playSound } = useGame();
  
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleItem>(() => getPuzzleData(0).puzzle);
  const [selectedLetters, setSelectedLetters] = useState<{ char: string; originalIndex: number }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ char: string; index: number; used: boolean }[]>(() => getPuzzleData(0).chars);
  const [inputVal, setInputVal] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [resultState, setResultState] = useState<"idle" | "correct" | "wrong">("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleTileClick = (letterObj: { char: string; index: number; used: boolean }) => {
    if (letterObj.used) return;
    playSound("click");

    const newSelected = [...selectedLetters, { char: letterObj.char, originalIndex: letterObj.index }];
    setSelectedLetters(newSelected);
    setInputVal(newSelected.map(s => s.char).join(""));

    setAvailableLetters(prev =>
      prev.map(item => item.index === letterObj.index ? { ...item, used: true } : item)
    );
  };

  const handleRemoveSelected = (selIndex: number) => {
    playSound("click");
    const itemToRemove = selectedLetters[selIndex];
    const newSelected = selectedLetters.filter((_, idx) => idx !== selIndex);
    setSelectedLetters(newSelected);
    setInputVal(newSelected.map(s => s.char).join(""));

    setAvailableLetters(prev =>
      prev.map(item => item.index === itemToRemove.originalIndex ? { ...item, used: false } : item)
    );
  };

  const handleResetLetters = () => {
    playSound("click");
    setSelectedLetters([]);
    setInputVal("");
    setAvailableLetters(prev => prev.map(item => ({ ...item, used: false })));
    setResultState("idle");
    setFeedbackMsg("");
  };

  const handleCheckAnswer = () => {
    const finalAnswer = (inputVal || selectedLetters.map(s => s.char).join("")).trim().toUpperCase();

    if (!finalAnswer) return;

    if (finalAnswer === currentPuzzle.word.toUpperCase()) {
      playSound("success");
      const xpEarned = showHint ? Math.max(5, currentPuzzle.xpReward - 5) : currentPuzzle.xpReward;
      addXP(xpEarned);
      recordAnswer(true);
      setResultState("correct");
      setFeedbackMsg(`🎉 Correct! You solved '${currentPuzzle.word}' (+${xpEarned} XP)`);
    } else {
      playSound("error");
      recordAnswer(false);
      setResultState("wrong");
      setFeedbackMsg("❌ Not quite. Try rearranging the tiles or reveal a hint!");
    }
  };

  const handleNextWord = () => {
    playSound("click");
    const nextIdx = puzzleIndex + 1;
    const { puzzle, chars } = getPuzzleData(nextIdx);
    setPuzzleIndex(nextIdx);
    setCurrentPuzzle(puzzle);
    setAvailableLetters(chars);
    setSelectedLetters([]);
    setInputVal("");
    setShowHint(false);
    setResultState("idle");
    setFeedbackMsg("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between bg-[#fffaf2] p-3 sm:p-4 rounded-2xl border border-[#eadfca]">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-[#ff7043] uppercase tracking-wider">
            Puzzle { (puzzleIndex % PUZZLES_DATA.length) + 1 } / { PUZZLES_DATA.length }
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-[#173f35]">
            Unscramble the Word
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-[#fff0d5] text-[#8a4c00] border border-[#ffcf70] px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-[#ff7043]" />
            +{currentPuzzle.xpReward} XP
          </span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#eadfca] shadow-md text-center space-y-4 sm:space-y-6">
        
        {/* Scrambled Visual Container */}
        <div className="space-y-2">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5e7068]">
            Tap letters to spell the word
          </span>

          {/* Letter Slots / Constructed Word Area */}
          <div className="min-h-[52px] sm:min-h-[64px] bg-[#fffaf2] border-2 border-dashed border-[#155c48]/30 rounded-2xl p-2 sm:p-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {selectedLetters.length === 0 ? (
              <span className="text-xs sm:text-sm font-semibold text-[#5e7068]/60 italic">
                Tap the tiles below or type
              </span>
            ) : (
              selectedLetters.map((sel, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveSelected(idx)}
                  className="w-8 h-10 sm:w-11 sm:h-12 rounded-lg sm:rounded-xl bg-[#155c48] text-white font-black text-base sm:text-xl shadow-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                  title="Click to remove letter"
                >
                  {sel.char}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Available Scrambled Tiles */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 py-1">
          {availableLetters.map((tile) => (
            <button
              key={tile.index}
              disabled={tile.used}
              onClick={() => handleTileClick(tile)}
              className={`w-10 h-12 sm:w-13 sm:h-15 rounded-xl sm:rounded-2xl font-black text-lg sm:text-2xl shadow-xs transition-all duration-150 flex items-center justify-center ${
                tile.used
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed scale-95 opacity-40"
                  : "bg-gradient-to-b from-[#ffcf70] to-[#ff7043] text-white hover:-translate-y-0.5 shadow-2xs active:translate-y-0"
              }`}
            >
              {tile.char}
            </button>
          ))}
        </div>

        {/* Optional Manual Input */}
        <div className="max-w-md mx-auto flex items-center gap-1.5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            placeholder="Or type here..."
            className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl border border-[#eadfca] bg-[#fffaf2] text-[#173f35] font-bold text-center text-sm sm:text-base uppercase tracking-widest focus:outline-none focus:border-[#ff7043]"
          />
          <button
            onClick={handleResetLetters}
            title="Reset letters"
            className="p-2 sm:p-2.5 rounded-xl border border-[#eadfca] bg-white text-[#5e7068] hover:bg-[#fff0d5] hover:text-[#ff7043] transition-colors"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Hint Box */}
        {showHint ? (
          <div className="bg-[#fff4d8] border border-[#ffe0a6] rounded-2xl p-3 text-[11px] sm:text-xs font-bold text-[#8a4c00] flex items-center justify-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#ff7043] flex-shrink-0" />
            <span>Hint: {currentPuzzle.hint} ({currentPuzzle.word.length} letters)</span>
          </div>
        ) : (
          <button
            onClick={() => {
              playSound("click");
              setShowHint(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#155c48] hover:text-[#ff7043] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a clue? Reveal Hint (-5 XP)</span>
          </button>
        )}

        {/* Feedback Message */}
        {resultState !== "idle" && (
          <div 
            className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 ${
              resultState === "correct" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {resultState === "correct" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {resultState !== "correct" ? (
            <button
              onClick={handleCheckAnswer}
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-[#ff7043] hover:bg-[#e65100] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextWord}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-2xl bg-[#155c48] hover:bg-[#0f4234] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <span>Next Scramble</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
