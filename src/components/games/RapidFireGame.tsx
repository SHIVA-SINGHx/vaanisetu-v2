"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { RAPID_FIRE_DATA, RapidQuestion } from "@/lib/data";
import { Zap, Timer, Trophy, Flame, RotateCcw, Sparkles } from "lucide-react";

export default function RapidFireGame() {
  const { addXP, recordAnswer, playSound, triggerConfetti } = useGame();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);

  const currentQ: RapidQuestion = RAPID_FIRE_DATA[questionIdx % RAPID_FIRE_DATA.length];

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    playSound("levelup");

    const currentFinalScore = scoreRef.current;
    if (currentFinalScore > 0) {
      addXP(currentFinalScore * 5);
    }
    if (currentFinalScore > highScoreRef.current) {
      highScoreRef.current = currentFinalScore;
      setHighScore(currentFinalScore);
      triggerConfetti();
    }
  };

  const startGame = () => {
    playSound("click");
    setIsPlaying(true);
    setIsGameOver(false);
    setTimeLeft(30);
    setScore(0);
    scoreRef.current = 0;
    setQuestionIdx(0);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAnswer = (choiceIdx: number) => {
    if (!isPlaying) return;

    if (choiceIdx === currentQ.correctIndex) {
      playSound("success");
      const nextScore = score + 1;
      setScore(nextScore);
      scoreRef.current = nextScore;
      recordAnswer(true);
    } else {
      playSound("error");
      recordAnswer(false);
    }

    setQuestionIdx(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-[#fffaf2] p-3 sm:p-4 rounded-2xl border border-[#eadfca]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7043]" />
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#ff7043] uppercase tracking-wider">
              Time Attack
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#173f35]">
              Rapid Fire Rush
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-[#fff0d5] text-[#8a4c00] border border-[#ffcf70] px-2.5 py-1 rounded-full">
            <Trophy className="w-3 h-3 text-amber-500" />
            Best: {highScore}
          </span>
        </div>
      </div>

      {/* Main Game Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#eadfca] shadow-md text-center space-y-4 sm:space-y-6">
        
        {!isPlaying && !isGameOver && (
          <div className="py-4 sm:py-8 space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#ff7043] to-[#ffb703] flex items-center justify-center text-white shadow-md animate-float">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-3xl font-black text-[#173f35]">
                Ready for 30 Seconds Rush?
              </h3>
              <p className="text-xs sm:text-sm text-[#5e7068] max-w-md mx-auto font-medium">
                Answer as many language questions as you can before the timer ends!
              </p>
            </div>

            <button
              onClick={startGame}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ff7043] hover:bg-[#e65100] text-white font-black text-sm sm:text-lg shadow-md transition-all"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Start Rapid Fire (30s)</span>
            </button>
          </div>
        )}

        {/* ACTIVE PLAYING SCREEN */}
        {isPlaying && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Timer & Live Score HUD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Timer className={`w-5 h-5 sm:w-6 sm:h-6 ${timeLeft <= 5 ? "text-red-500 animate-ping" : "text-[#ff7043]"}`} />
                <span className={`text-2xl sm:text-3xl font-black ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-[#173f35]"}`}>
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#fff0d5] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-[#ffcf70]">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7043] fill-[#ff7043]" />
                <span className="text-lg sm:text-xl font-black text-[#8a4c00]">{score}</span>
                <span className="text-[10px] sm:text-xs font-bold text-[#8a4c00]/70 uppercase">Score</span>
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full h-2 sm:h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeLeft <= 5 ? "bg-red-500" : "bg-gradient-to-r from-[#ffcf70] to-[#ff7043]"
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="py-1 sm:py-3">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5e7068] block mb-1">
                Question {questionIdx + 1}
              </span>
              <h4 className="text-base sm:text-2xl font-black text-[#173f35] leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Answer Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#fffaf2] border-2 border-[#eadfca] hover:border-[#ff7043] hover:bg-[#fff0d5] text-[#173f35] font-black text-sm sm:text-base shadow-2xs transition-all text-center"
                >
                  {opt}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* GAME OVER RESULTS */}
        {isGameOver && (
          <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#fff0d5] via-[#fffaf2] to-[#d9f3e9] border-2 border-[#ffcf70] space-y-3 sm:space-y-4">
              <div className="text-4xl sm:text-5xl">🏆</div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#155c48]">
                Time&apos;s Up! Great Run!
              </h3>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6 py-1 sm:py-2">
                <div className="text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-[#5e7068] uppercase">Score</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#173f35]">{score} pts</div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-[#eadfca]" />
                <div className="text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-[#5e7068] uppercase">Earned XP</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#ff7043]">+{score * 5} XP</div>
                </div>
              </div>

              {score >= highScore && score > 0 && (
                <div className="inline-flex items-center gap-1 bg-[#ff7043] text-white px-3 sm:px-4 py-1 rounded-full text-[11px] sm:text-xs font-extrabold shadow-2xs animate-bounce">
                  <Sparkles className="w-3 h-3" />
                  <span>New Personal Best! 🎉</span>
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#155c48] hover:bg-[#0f4234] text-white font-black text-sm sm:text-base shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
