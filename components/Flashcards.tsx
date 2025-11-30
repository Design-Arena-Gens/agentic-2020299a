"use client";

import { useEffect, useMemo, useState } from 'react';
import { Volume2, Shuffle, RotateCcw } from 'lucide-react';

export type FlashItem = { en: string; pt: string };

export default function Flashcards({ items }: { items: FlashItem[] }) {
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [shuffled, setShuffled] = useState<FlashItem[]>(items);

  useEffect(() => {
    setShuffled(items);
    setIndex(0);
    setShowBack(false);
  }, [items]);

  const card = useMemo(() => shuffled[index], [shuffled, index]);

  function next() {
    setShowBack(false);
    setIndex((i) => (i + 1) % shuffled.length);
  }

  function shuffle() {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
    setIndex(0);
    setShowBack(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Flashcards</h3>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={shuffle}>
            <Shuffle className="h-4 w-4" /> Shuffle
          </button>
          <button className="btn-outline" onClick={() => { setIndex(0); setShowBack(false); setShuffled(items); }}>
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      <div
        className="card cursor-pointer select-none p-10 text-center text-2xl font-bold"
        onClick={() => setShowBack((v) => !v)}
      >
        {showBack ? card.pt : card.en}
      </div>

      <div className="flex items-center justify-between">
        <button className="btn" onClick={() => speak(card.en)}>
          <Volume2 className="h-4 w-4" /> Listen
        </button>
        <button className="btn" onClick={next}>Next</button>
      </div>

      <p className="text-center text-sm text-slate-600">
        Tap the card to flip between English and Portugu?s.
      </p>
    </div>
  );
}

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
