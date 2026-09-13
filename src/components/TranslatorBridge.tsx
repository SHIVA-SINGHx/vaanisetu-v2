"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { 
  Globe2, 
  ArrowRightLeft, 
  Volume2, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen,
  Loader2,
  Send
} from "lucide-react";

export default function TranslatorBridge() {
  const { addXP, playSound, speak } = useGame();
  
  const [sourceLang, setSourceLang] = useState<string>("English");
  const [targetLang, setTargetLang] = useState<string>("Hindi");
  const [inputText, setInputText] = useState<string>("Hello, how are you?");
  const [translatedText, setTranslatedText] = useState<string>("नमस्ते, आप कैसे हैं?");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sampleWords = [
    "Where is the school?",
    "I love learning new languages",
    "Water is essential for life",
    "Good morning my friend",
    "Knowledge is wealth",
    "Thank you very much"
  ];

  const languagesList = [
    "English", "Hindi", "Bengali", "Odia", "Marathi", "Santali", "Tamil", "Telugu"
  ];

  // Perform dynamic translation via our Next.js API route
  const performTranslation = useCallback(async (
    text: string, 
    src: string, 
    tgt: string, 
    grantXP: boolean = false
  ) => {
    if (!text || !text.trim()) {
      setTranslatedText("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text.trim(),
          sourceLang: src,
          targetLang: tgt
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.translation) {
          setTranslatedText(data.translation);
          if (grantXP) {
            addXP(5);
          }
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [addXP]);

  // Debounced auto-translate as the user types
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!inputText.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        setTranslatedText("");
        setIsLoading(false);
      }, 0);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performTranslation(inputText, sourceLang, targetLang, false);
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputText, sourceLang, targetLang, performTranslation]);

  const handleManualTranslate = () => {
    playSound("click");
    performTranslation(inputText, sourceLang, targetLang, true);
  };

  const handleSwap = () => {
    playSound("click");
    const tempSrc = sourceLang;
    const tempTgt = targetLang;
    const tempInput = translatedText || inputText;

    setSourceLang(tempTgt);
    setTargetLang(tempSrc);
    setInputText(tempInput);
    performTranslation(tempInput, tempTgt, tempSrc, true);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    playSound("click");
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechInput = () => {
    playSound("click");
    if (typeof window === "undefined") return;

    interface SpeechRecognitionResultItem {
      transcript: string;
    }
    interface SpeechRecognitionResultList {
      [index: number]: {
        [index: number]: SpeechRecognitionResultItem;
      };
    }
    interface SpeechRecognitionEvent {
      results: SpeechRecognitionResultList;
    }
    interface SpeechRecognitionInstance {
      lang: string;
      interimResults: boolean;
      onstart: () => void;
      onend: () => void;
      onerror: () => void;
      onresult: (event: SpeechRecognitionEvent) => void;
      start: () => void;
    }

    const SpeechRecognition = (window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    }).SpeechRecognition ||
      (window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. You can type any word or sentence into the box!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<string, string> = {
        English: "en-IN",
        Hindi: "hi-IN",
        Bengali: "bn-IN",
        Marathi: "mr-IN",
        Tamil: "ta-IN",
        Telugu: "te-IN"
      };

      recognition.lang = langMap[sourceLang] || "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        performTranslation(transcript, sourceLang, targetLang, true);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <section id="translator" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#ffe0a6] text-[#8a4c00] border border-[#ffcf70] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
          <Globe2 className="w-4 h-4 text-[#ff7043]" />
          <span>Universal Dynamic Translation Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173f35] tracking-tight">
          Live Multilingual Voice & Text Bridge
        </h2>
        <p className="text-sm sm:text-base text-[#5e7068] font-medium">
          Type <strong>any word, sentence, or question</strong> in any language and watch it dynamically translate across Indian languages in real time.
        </p>
      </div>

      {/* Main Translator Box */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#eadfca] shadow-xl space-y-6">
        
        {/* Language Selection Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fffaf2] p-3 rounded-2xl border border-[#eadfca]">
          
          {/* Source Language */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <span className="text-xs font-black text-[#5e7068] uppercase tracking-wider">From:</span>
            <select
              value={sourceLang}
              onChange={(e) => {
                playSound("click");
                setSourceLang(e.target.value);
              }}
              className="w-full bg-white border border-[#eadfca] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#173f35] focus:outline-none focus:border-[#ff7043] cursor-pointer shadow-2xs"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            title="Swap languages"
            className="p-3 rounded-xl bg-white border border-[#eadfca] text-[#155c48] hover:bg-[#fff0d5] hover:text-[#ff7043] transition-all shadow-2xs hover:rotate-180 duration-300"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Target Language */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <span className="text-xs font-black text-[#5e7068] uppercase tracking-wider">To:</span>
            <select
              value={targetLang}
              onChange={(e) => {
                playSound("click");
                setTargetLang(e.target.value);
              }}
              className="w-full bg-white border border-[#eadfca] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#173f35] focus:outline-none focus:border-[#ff7043] cursor-pointer shadow-2xs"
            >
              {languagesList.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Dual Input/Output Translation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Input Box */}
          <div className="bg-[#fffaf2] rounded-3xl p-5 border border-[#eadfca] flex flex-col justify-between min-h-[190px] space-y-3 relative group focus-within:border-[#ff7043] transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste any word or sentence here..."
              rows={4}
              className="w-full bg-transparent resize-none font-bold text-base sm:text-lg text-[#173f35] placeholder-gray-400 focus:outline-none"
            />
            
            <div className="flex items-center justify-between pt-3 border-t border-[#eadfca]/60">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    playSound("click");
                    speak(inputText, sourceLang);
                  }}
                  disabled={!inputText.trim()}
                  title="Listen to input pronunciation"
                  className="p-2.5 rounded-xl bg-white border border-[#eadfca] text-[#155c48] hover:text-[#ff7043] hover:bg-[#fff0d5] transition-colors disabled:opacity-40"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSpeechInput}
                  title="Speak into microphone (Voice Typing)"
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening 
                      ? "bg-red-500 text-white border-red-500 animate-pulse" 
                      : "bg-white border-[#eadfca] text-[#155c48] hover:text-[#ff7043] hover:bg-[#fff0d5]"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#5e7068]">
                  {inputText.length} characters
                </span>
                
                <button
                  onClick={handleManualTranslate}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#ff7043] hover:bg-[#e65100] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all"
                >
                  <span>Translate</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Translated Result Box */}
          <div className="bg-gradient-to-br from-[#155c48]/5 via-[#155c48]/10 to-[#ff7043]/10 rounded-3xl p-5 border-2 border-[#155c48]/20 flex flex-col justify-between min-h-[190px] space-y-3 relative">
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#155c48] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff7043]" />
                  <span>{targetLang} Translation</span>
                </span>

                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff7043] bg-white/80 px-2 py-0.5 rounded-full animate-pulse border border-[#ffcf70]">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Translating...</span>
                  </span>
                )}
              </div>

              <div className="min-h-[70px]">
                {translatedText ? (
                  <p className="font-black text-xl sm:text-2xl text-[#155c48] tracking-tight leading-snug break-words">
                    {translatedText}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-[#5e7068]/60 italic">
                    Translations will appear here instantly...
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#155c48]/15">
              <button
                onClick={() => {
                  playSound("click");
                  speak(translatedText, targetLang);
                }}
                disabled={!translatedText}
                title="Listen to translation pronunciation"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#eadfca] text-xs font-bold text-[#155c48] hover:text-[#ff7043] hover:bg-[#fff0d5] transition-colors disabled:opacity-40 shadow-2xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Audio Speech</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!translatedText}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#eadfca] text-xs font-bold text-[#5e7068] hover:text-[#ff7043] hover:bg-[#fff0d5] transition-colors disabled:opacity-40 shadow-2xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Translation"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Sample Phrases */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black text-[#5e7068] flex items-center gap-1.5 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#ff7043]" />
            Try translating sample sentences:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {sampleWords.map((phrase) => (
              <button
                key={phrase}
                onClick={() => {
                  setInputText(phrase);
                  performTranslation(phrase, sourceLang, targetLang, true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  inputText === phrase
                    ? "bg-[#155c48] text-white border-[#155c48] shadow-xs"
                    : "bg-[#fffaf2] hover:bg-[#fff0d5] text-[#173f35] border-[#eadfca]"
                }`}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
