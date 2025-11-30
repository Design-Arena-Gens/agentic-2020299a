"use client";

import { useEffect, useMemo, useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

export type QuizItem = { en: string; pt: string };

type Question = {
  prompt: string;
  options: string[];
  answer: string;
};

function buildQuestions(items: QuizItem[], count = 6): Question[] {
  const questions: Question[] = [];
  const pool = [...items];
  while (questions.length < Math.min(count, items.length)) {
    const base = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    const distractors = shuffle(items.filter((i) => i !== base)).slice(0, 3).map((d) => d.en);
    const options = shuffle([base.en, ...distractors]);
    questions.push({ prompt: base.pt, options, answer: base.en });
  }
  return questions;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz({ items }: { items: QuizItem[] }) {
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(items));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions(buildQuestions(items));
    setIndex(0);
    setSelected(null);
    setScore(0);
  }, [items]);

  const current = questions[index];
  const finished = index >= questions.length;

  function pick(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setSelected(null);
    }, 700);
  }

  function reset() {
    setQuestions(buildQuestions(items));
    setIndex(0);
    setSelected(null);
    setScore(0);
  }

  if (finished) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-lg font-semibold">Quiz Complete</h3>
        <p className="text-slate-700">Your score: {score} / {questions.length}</p>
        <button className="btn" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Translate to English</h3>
      <div className="rounded-md bg-slate-50 p-4 text-slate-800">
        <span className="font-medium">Portugu?s:</span> {current.prompt}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {current.options.map((opt) => {
          const isCorrect = selected && opt === current.answer;
          const isWrong = selected === opt && opt !== current.answer;
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!selected}
              className={`rounded-md border p-3 text-left transition ${
                isCorrect ? 'border-green-500 bg-green-50' : ''
              } ${isWrong ? 'border-red-500 bg-red-50' : ''} ${
                !selected ? 'hover:bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {isCorrect && <Check className="h-4 w-4 text-green-600" />}
                {isWrong && <X className="h-4 w-4 text-red-600" />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-sm text-slate-600">
        Question {index + 1} of {questions.length}
      </div>
    </div>
  );
}
