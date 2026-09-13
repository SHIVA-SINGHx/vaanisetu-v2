# 🌉 VAANISETU (वाणीसेतु • ᱵᱟᱬᱤ ᱥᱮᱛᱩ)
### *Bridging Indian Languages Through Interactive, Gamified Learning*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Synthesized-orange?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Speech Synthesis](https://img.shields.io/badge/Web_Speech_API-Multilingual-green?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 📖 Table of Contents

- [🌟 Overview & Mission](#-overview--mission)
- [✨ Key Features](#-key-features)
  - [🎮 1. The Learning Arcade (6 Game Modes)](#-1-the-learning-arcade-6-game-modes)
  - [🌉 2. Multi-Engine Translator Bridge](#-2-multi-engine-translator-bridge)
  - [🗺️ 3. Cultural & Script Explorer](#️-3-cultural--script-explorer)
  - [🏆 4. Gamification, Badges & Streaks](#-4-gamification-badges--streaks)
  - [🔊 5. Zero-Asset Synthesized Audio & Speech](#-5-zero-asset-synthesized-audio--speech)
- [🇮🇳 Supported Languages](#-supported-languages)
- [🏗️ System Architecture & Codebase Structure](#️-system-architecture--codebase-structure)
- [⚡ Tech Stack](#-tech-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [📡 API Documentation](#-api-documentation)
- [🎨 Design Philosophy & Aesthetic](#-design-philosophy--aesthetic)
- [🔮 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License & Acknowledgements](#-license--acknowledgements)

---

## 🌟 Overview & Mission

**VAANISETU** (*Vaani* = Voice / Language, *Setu* = Bridge) is an interactive, gamified multilingual educational platform designed to celebrate and teach India's rich linguistic tapestry. 

Millions of learners face language barriers when accessing digital education. VAANISETU bridges this divide by providing:
- High-priority support for indigenous and regional languages (including **Santali in Ol Chiki script**, **Odia**, **Bengali**, **Marathi**, **Hindi**, **Tamil**, and **Telugu** alongside **English**).
- Engaging arcade mini-games that transform vocabulary building, spelling, and cultural awareness into dynamic play.
- An intelligent dual-layer translation bridge combining verified cultural dictionaries with real-time translation fallback.
- Audio synthesis and native speech engines for authentic pronunciation without requiring heavy external asset downloads.

---

## ✨ Key Features

```
                                  VAANISETU PLATFORM
       ┌───────────────────────────────────┼───────────────────────────────────┐
       │                                   │                                   │
┌──────▼────────┐                  ┌───────▼────────┐                  ┌───────▼────────┐
│  GAME ARCADE  │                  │  TRANSLATION   │                  │   EXPLORER &   │
│  (6 Mini-Apps)│                  │     BRIDGE     │                  │  GAMIFICATION  │
├───────────────┤                  ├────────────────┤                  ├────────────────┤
│ • Flashcards  │                  │ • Curated Dict │                  │ • 8 Languages  │
│ • Scramble    │                  │ • Live API Fall│                  │ • Level & XP   │
│ • Match Pair  │                  │ • Text-to-Speech│                 │ • Badges & Streaks│
│ • Memory Matrix│                 │ • Transliterate│                  │ • Sound Synth  │
│ • Rapid Fire  │                  │ • Instant Copy │                  │ • Confetti FX  │
│ • Brain Quiz  │                  │ • Quick Chips  │                  │ • Persistence  │
└───────────────┘                  └────────────────┘                  └────────────────┘
```

### 🎮 1. The Learning Arcade (6 Game Modes)

1. **Vocabulary Flashcards (3D Flip)**
   - Interactive flip animation revealing word meanings, category tags, pronunciation guides, and simultaneous translations across all supported Indian languages.
   - Built-in speech synthesis button for instant audio pronunciation.
2. **Word Scramble (Anagram Puzzle)**
   - Dynamic letter tiles that players tap or drag to assemble mystery words.
   - Contextual hint system and instant validation with sound effects and XP rewards.
3. **Match Matrix (Meaning & Script Pairs)**
   - Connect English concepts with their regional scripts and definitions.
   - Visual status indicators with shake animations on incorrect matches and celebratory highlights on correct pairs.
4. **Memory Matrix (Sequence Recall)**
   - Challenge visual and short-term memory by memorizing and matching pairs of regional words and meanings.
   - Tracks moves, time elapsed, and high scores.
5. **Rapid Fire (30-Second Speed Rush)**
   - Fast-paced trivia against a ticking clock.
   - Rapidly select correct regional translations before the countdown expires; features progressive combo multipliers.
6. **Brain Battle Quiz (Daily Linguistic Challenge)**
   - Curated multi-tier questions spanning scripts, grammatical roots, cultural proverbs, and trivia.
   - Comprehensive post-question explanations to reinforce learning.

---

### 🌉 2. Multi-Engine Translator Bridge

- **Hybrid Resolution Pipeline**:
  1. *Curated Offline Dictionary*: High-fidelity, hand-verified vocabulary pairs with exact native scripts, phonetics, and transliterations.
  2. *Dynamic API Translation Fallback*: Connects to the translation proxy endpoint (`/api/translate`) powered by MyMemory REST API with response sanitization and HTML entity decoding.
- **Multilingual Speech Synthesis**: Instant text-to-speech output tailored to Indian English, Hindi, Bengali, Marathi, Tamil, Telugu, and Odia accents.
- **Bi-directional Swap & Quick Chips**: Swap source and target languages in one click; includes quick-access phrases (*"Hello"*, *"Thank you"*, *"Welcome"*, *"Learn"*, *"Water"*).
- **Clipboard Integration**: One-tap copy for translated text with visual feedback.

---

### 🗺️ 3. Cultural & Script Explorer

- Deep dive into 8 languages with statistics on native speakers, writing systems, and geographical distribution.
- **Authentic Proverbs**: Showcases time-honored proverbs with original scripts, phonetic transliteration, and philosophical meanings (e.g., Santali *'ᱚᱞ ᱯᱟᱲᱦᱟᱣ ᱜᱮ ᱢᱟᱨᱟᱝ ᱫᱷᱚᱱ'*, Tamil *'கற்றது கைமண் அளவு, கல்லாதது உலகளவு'*).
- **Interactive Script Highlights**: Showcases the beauty of Ol Chiki, Devanagari, Eastern Nagari (Bengali/Assamese), Odia, Dravidian scripts (Tamil, Telugu), and Latin.

---

### 🏆 4. Gamification, Badges & Streaks

- **Dynamic Leveling**: Earn XP from all arcade games and quiz modes (Level = $\lfloor \text{XP} / 100 \rfloor + 1$).
- **Celebratory Confetti**: Triggers colorful particle bursts upon leveling up or achieving milestones via `canvas-confetti`.
- **Daily Streak Tracker**: Automatically calculates consecutive active days using `Date` differential logic.
- **6-Tier Achievement Badge System**:
  - 🌱 *First Step*: Earn your first 10 XP.
  - ⚡ *Quick Learner*: Reach 100 XP.
  - 🧠 *Brain Master*: Answer 10 questions correctly.
  - 🔥 *7-Day Streak*: Maintain a continuous 7-day practice streak.
  - 🌉 *Polyglot Explorer*: Reach 250 XP across multiple games.
  - 🏆 *Rapid Champion*: Reach 500 XP and conquer the challenges.
- **Offline Persistence**: Complete game state, XP, levels, unlocked badges, and streak statistics persist in browser `localStorage` with a safe one-click reset option.

---

### 🔊 5. Zero-Asset Synthesized Audio & Speech

- **Web Audio API Sound Synthesizer**: No external `.mp3` or `.wav` sound files required! All game sound effects are procedurally generated in real time using HTML5 `AudioContext` oscillators and gain envelopes:
  - *Click / Tap*: Soft sine wave frequency ramp ($600 \text{ Hz} \to 300 \text{ Hz}$).
  - *Success*: Ascending arpeggiated major triad chord (C5, E5, G5, C6).
  - *Error*: Low-frequency sawtooth buzz ($180 \text{ Hz} \to 90 \text{ Hz}$).
  - *Card Flip*: Gentle modulation sweep ($250 \text{ Hz} \to 500 \text{ Hz}$).
  - *Level-Up Fanfare*: Multi-stage polyphonic chord progression (C Maj $\to$ D Maj $\to$ E Maj $\to$ G Maj octave).
- **Web Speech API SpeechSynthesis**: Localized voice reading across Indian languages with auto-fallback.

---

## 🇮🇳 Supported Languages

| Language | Native Name | Script | Regional Focus | Speaker Base |
|:---|:---|:---|:---|:---|
| **Santali** | ᱥᱟᱱᱛᱟᱲᱤ | Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) | Jharkhand, Odisha, West Bengal | 7.6M+ |
| **Hindi** | हिन्दी | Devanagari (देवनागरी) | North & Central India, Pan-India | 600M+ |
| **Bengali** | বাংলা | Bengali-Assamese (বাংলা লিপি) | West Bengal, Tripura, Assam | 300M+ |
| **Odia** | ଓଡ଼ିଆ | Odia Script (ଓଡ଼ିଆ ଲିପି) | Odisha, Eastern India | 45M+ |
| **Marathi** | मराठी | Devanagari (बाळबोध) | Maharashtra, Goa | 95M+ |
| **Tamil** | தமிழ் | Tamil Script (தமிழ் அரிச்சுவடி) | Tamil Nadu, Puducherry, Global | 85M+ |
| **Telugu** | తెలుగు | Telugu Script (తెలుగు లిపి) | Andhra Pradesh, Telangana | 95M+ |
| **English** | English | Latin Alphabet | Global & Pan-India Lingua Franca | Global |

---

## 🏗️ System Architecture & Codebase Structure

```
vaanisetu/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── translate/
│   │   │       └── route.ts          # Serverless Translation API Handler
│   │   ├── favicon.ico               # Application Favicon
│   │   ├── globals.css               # Design System & Tailwind v4 Layering
│   │   ├── layout.tsx                # Metadata, Viewport & Font Configuration
│   │   └── page.tsx                  # Root Page Orchestration
│   ├── components/
│   │   ├── Footer.tsx                # Brand Mission, Credits & Navigation
│   │   ├── Hero.tsx                  # Hero Section with Daily Proverb Carousel
│   │   ├── LanguageExplorer.tsx      # Interactive Language & Script Catalog
│   │   ├── Navbar.tsx                # Sticky Navigation with Live XP & Streak Pill
│   │   ├── ProgressSection.tsx       # Badges Showcase, Accuracy & Reset Control
│   │   ├── StatsDashboard.tsx        # Top HUD Bar (Level, XP Bar, Audio Toggle)
│   │   ├── TranslatorBridge.tsx      # Dual-Pane Translation & TTS Tool
│   │   └── games/
│   │       ├── BrainBattleQuiz.tsx   # Curated Multi-Tier Linguistic Quiz
│   │       ├── FlashcardGame.tsx     # 3D Vocabulary Flashcard Deck
│   │       ├── GameSelector.tsx      # Arcade Navigation & Game Switcher
│   │       ├── MatchGame.tsx         # Word-Meaning Association Matrix
│   │       ├── MemoryGame.tsx        # Card Pair Memory & Recall Matrix
│   │       ├── RapidFireGame.tsx     # 30-Second Speed Trivia Rush
│   │       └── WordScrambleGame.tsx  # Letter Tile Anagram Puzzle
│   ├── context/
│   │   └── GameContext.tsx           # Central State, XP, Streak & Audio Store
│   └── lib/
│       ├── data.ts                   # Flashcards, Quizzes, Languages & Dictionaries
│       └── sound.ts                  # Web Audio Synth & Speech Engine
├── public/                           # Static Media & Assets
├── package.json                      # Dependencies & Scripts
├── tsconfig.json                     # TypeScript Configuration
├── postcss.config.mjs                # PostCSS Pipeline
└── next.config.ts                    # Next.js Runtime Settings
```

---

## ⚡ Tech Stack

- **Framework**: [Next.js 16.3.4](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **UI Library**: [React 19.2.8](https://react.dev/) (Hooks, Context, Client Components)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` variables for warm Indian cultural aesthetics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio & Speech**: HTML5 Web Audio API (`OscillatorNode`, `GainNode`) & Web Speech API (`SpeechSynthesis`)
- **Type Safety**: TypeScript 5 with full data schema contracts

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.18.0 or higher
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vaanisetu.git
cd vaanisetu
```
*(If you are already inside the root repository directory, navigate to the `vaanisetu` subfolder if applicable: `cd vaanisetu`)*

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📡 API Documentation

### Translation Endpoint

#### `POST /api/translate`
Translates text between supported Indian languages and English using the hybrid dictionary and dynamic translation pipeline.

**Request Body:**
```json
{
  "text": "Hello",
  "sourceLang": "English",
  "targetLang": "Santali"
}
```

**Successful Response (`200 OK`):**
```json
{
  "translation": "ᱡᱚᱦᱟᱨ (Johar)",
  "fromCache": true
}
```

**Dynamic Translation Response (`200 OK`):**
```json
{
  "translation": "আপনাকে ধন্যবাদ",
  "fromCache": false
}
```

**Error Handling:**
```json
{
  "error": "Translation service temporarily unavailable"
}
```

---

## 🎨 Design Philosophy & Aesthetic

VAANISETU features a tailored Indian cultural design palette inspired by heritage manuscripts, terracotta art, and sacred flora:
- 🏺 **Terracotta Amber (`#ff7043` / `#e65100`)**: Primary accent representing energy, celebration, and discovery.
- 🍃 **Forest Emerald (`#155c48` / `#173f35`)**: Anchor dark shade evoking heritage, wisdom, and tranquility.
- 📜 **Warm Parchment (`#fffaf2` / `#fff0d5`)**: Soft, eye-friendly background mimicking handmade palm leaf and parchment papers.
- ✨ **Marigold Gold (`#ffcf70` / `#ffb703`)**: Highlighting rewards, badges, and streaks.

All interactive elements feature:
- Micro-interactions with tactile elevation (`hover:-translate-y-0.5`).
- Native glassmorphism accents.
- Full mobile-first responsiveness across phones, tablets, and ultra-wide monitors.

---

## 🔮 Future Roadmap

- [ ] 🎙️ **Voice Recognition (Speech-to-Text)**: Answer quiz questions and practice pronunciation by speaking directly into the microphone.
- [ ] 📱 **Progressive Web App (PWA) & Offline Mode**: Full offline flashcards and game arcades for rural classrooms with low connectivity.
- [ ] ⚔️ **Multiplayer Brain Battles**: Real-time peer-to-peer linguistic duels via WebSockets.
- [ ] 📚 **Custom Word Deck Builder**: Empower teachers to create custom flashcard decks for regional syllabi.
- [ ] 🪶 **Ol Chiki Handwriting Canvas**: Interactive handwriting recognition for practicing Santali script stroke order.

---

## 🤝 Contributing

Contributions are warmly welcome! If you'd like to add new languages, enhance translations, or build new learning games:

1. **Fork the Repository**
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-game-mode
   ```
3. **Commit your Changes**:
   ```bash
   git commit -m "feat: add amazing game mode"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/amazing-game-mode
   ```
5. **Open a Pull Request**

---

## 📄 License & Acknowledgements

This project is open-source under the [MIT License](LICENSE).

- Special thanks to the communities preserving and promoting indigenous Indian languages and scripts, especially the **Ol Chiki** script for Santali.
- Font styling powered by Google Fonts (Geist & regional typographies).
- Built with ❤️ for multilingual digital equity across India.

---

<p align="center">
  <b>VAANISETU</b> — <i>Where language meets learning, and every word builds a bridge.</i> 🌉
</p>
