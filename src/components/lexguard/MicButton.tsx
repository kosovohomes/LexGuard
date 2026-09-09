"use client";

// Voice-note-to-text mic button (FR-2.6). Appends recognized speech into a
// text field; hidden entirely when the browser has no Web Speech support so
// the journal stays fully usable everywhere.
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useApp } from "@/lib/lexguard/store";
import { t } from "@/lib/lexguard/i18n";
import { speechSupported, startVoiceInput, type VoiceSession } from "@/lib/lexguard/speech";

export function MicButton({ getText, setText }: { getText: () => string; setText: (next: string) => void }) {
  const app = useApp();
  const tr = t(app.locale);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const session = useRef<VoiceSession | null>(null);

  useEffect(() => {
    // async boundary: no direct synchronous setState in the effect body
    void Promise.resolve().then(() => setSupported(speechSupported()));
  }, []);

  // keep the latest field value in a ref-like closure via getText()
  const toggle = () => {
    if (listening) {
      session.current?.stop();
      return;
    }
    const s = startVoiceInput(app.locale, {
      onFinal: (chunk) => {
        const cur = getText();
        setText(cur ? `${cur} ${chunk}` : chunk);
      },
      onInterim: setInterim,
      onEnd: () => {
        setListening(false);
        setInterim("");
        session.current = null;
      },
      onError: () => {
        setListening(false);
        setInterim("");
        session.current = null;
      },
    });
    if (s) {
      session.current = s;
      setListening(true);
    }
  };

  useEffect(() => {
    return () => session.current?.stop();
  }, []);

  if (!supported) return null;

  return (
    <>
      <Button
        type="button"
        variant={listening ? "destructive" : "outline"}
        size="sm"
        className="gap-1.5"
        onClick={toggle}
        aria-label={listening ? tr.micStop : tr.micStart}
        title={listening ? tr.micStop : tr.micStart}
      >
        {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
        {listening ? tr.micStop : tr.micStart}
      </Button>
      {interim ? (
        <span className="text-xs italic text-muted-foreground" aria-live="polite">
          {interim}
        </span>
      ) : null}
    </>
  );
}
