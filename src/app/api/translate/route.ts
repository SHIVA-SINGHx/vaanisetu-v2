import { NextRequest, NextResponse } from "next/server";
import { TRANSLATION_DICTIONARY } from "@/lib/data";

const LANG_CODE_MAP: Record<string, string> = {
  English: "en",
  Hindi: "hi",
  Bengali: "bn",
  Odia: "or",
  Marathi: "mr",
  Tamil: "ta",
  Telugu: "te",
  Santali: "sat"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLang = "English", targetLang = "Hindi" } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ translation: "" });
    }

    const cleanText = text.trim();
    const cleanLower = cleanText.toLowerCase();

    // 1. First check curated dictionary for exact words (provides rich script + transliteration)
    if (sourceLang === "English" && TRANSLATION_DICTIONARY[cleanLower] && TRANSLATION_DICTIONARY[cleanLower][targetLang]) {
      return NextResponse.json({
        translation: TRANSLATION_DICTIONARY[cleanLower][targetLang],
        fromCache: true
      });
    }

    // Check if target is English and source word is in dictionary
    if (targetLang === "English") {
      for (const [engWord, transMap] of Object.entries(TRANSLATION_DICTIONARY)) {
        const val = transMap[sourceLang];
        if (val && (val.toLowerCase().includes(cleanLower) || cleanLower.includes(engWord))) {
          return NextResponse.json({
            translation: engWord.charAt(0).toUpperCase() + engWord.slice(1),
            fromCache: true
          });
        }
      }
    }

    // 2. Perform dynamic online translation via MyMemory API
    const srcCode = LANG_CODE_MAP[sourceLang] || "en";
    const tgtCode = LANG_CODE_MAP[targetLang] || "hi";

    // Same language return
    if (srcCode === tgtCode) {
      return NextResponse.json({ translation: cleanText });
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${srcCode}|${tgtCode}`;

    // Abort if MyMemory takes more than 10 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "VAANISETU-App/2.0"
        },
        cache: "force-cache", // standard Fetch API caching (works in Next.js 15+)
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.responseData && data.responseData.translatedText) {
          let result = data.responseData.translatedText;
          // Clean any HTML entities like &#39;
          result = result
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");

          return NextResponse.json({
            translation: result,
            fromCache: false
          });
        }
      }
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error("MyMemory fetch error:", fetchErr);
    }

    // Fallback: explicitly return null so the UI can show a proper error
    return NextResponse.json({
      translation: null,
      error: "Could not fetch dynamic translation"
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation service temporarily unavailable" },
      { status: 500 }
    );
  }
}
