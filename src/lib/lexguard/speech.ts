// LexGuard voice-note-to-text (PRD FR-2.6, optional Phase 2 item shipped in
// Phase 4). Uses the browser's Web Speech API when available; degrades
// gracefully — callers hide the mic button when unsupported. Nothing leaves
// the device beyond what the browser's speech service itself does; text lands
// in the same journal fields the user could have typed.

import type { Locale } from "./types";

// Minimal structural typing for the Web Speech API (not in TS lib by default).
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export function speechSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return !!(w.SpeechRecognition ?? w.webkitSpeechRecognition);
}

export interface VoiceSession {
  stop(): void;
}

/** Start listening; appends recognized text via callbacks. Returns a session
 *  whose stop() ends listening, or null when unsupported. */
export function startVoiceInput(
  locale: Locale,
  handlers: {
    onFinal: (text: string) => void;
    onInterim: (text: string) => void;
    onEnd: () => void;
    onError: () => void;
  },
): VoiceSession | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = locale === "es" ? "es-MX" : "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  let finished = false;

  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) {
        const t = r[0].transcript.trim();
        if (t) handlers.onFinal(t);
      } else {
        interim += r[0].transcript;
      }
    }
    handlers.onInterim(interim);
  };
  rec.onerror = () => {
    if (!finished) {
      finished = true;
      handlers.onError();
    }
  };
  rec.onend = () => {
    if (!finished) {
      finished = true;
      handlers.onEnd();
    }
  };

  try {
    rec.start();
  } catch {
    return null;
  }
  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}
