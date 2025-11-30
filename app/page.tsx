"use client";

import { useMemo, useState } from 'react';
import { BookOpen, Brain, HelpCircle, Volume2 } from 'lucide-react';
import { lessons } from '../data/lessons';
import Flashcards from '../components/Flashcards';
import Quiz from '../components/Quiz';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'flashcards' | 'quiz'>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);

  const selectedLesson = useMemo(
    () => lessons.find((l) => l.id === selectedLessonId)!,
    [selectedLessonId]
  );

  return (
    <main className="container py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">English Teacher</h1>
        <nav className="flex gap-2">
          <button
            className={`btn-outline ${activeTab === 'lessons' ? 'bg-slate-100' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <BookOpen className="h-4 w-4" /> Lessons
          </button>
          <button
            className={`btn-outline ${activeTab === 'flashcards' ? 'bg-slate-100' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            <Brain className="h-4 w-4" /> Flashcards
          </button>
          <button
            className={`btn-outline ${activeTab === 'quiz' ? 'bg-slate-100' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <HelpCircle className="h-4 w-4" /> Quiz
          </button>
        </nav>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <aside className="card p-4 md:col-span-1">
          <h2 className="mb-2 text-lg font-semibold">Units</h2>
          <ul className="space-y-1">
            {lessons.map((l) => (
              <li key={l.id}>
                <button
                  className={`w-full rounded-md px-3 py-2 text-left transition hover:bg-slate-50 ${
                    selectedLessonId === l.id ? 'bg-slate-100 font-semibold' : ''
                  }`}
                  onClick={() => setSelectedLessonId(l.id)}
                >
                  {l.icon} {l.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'lessons' && (
            <article className="card p-6">
              <h2 className="mb-4 text-xl font-bold">{selectedLesson.title}</h2>
              <p className="mb-4 text-slate-700">{selectedLesson.description}</p>
              <div className="space-y-3">
                {selectedLesson.content.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">{c.en}</p>
                      <p className="text-sm text-slate-600">{c.pt}</p>
                    </div>
                    <button
                      aria-label={`Listen: ${c.en}`}
                      className="btn"
                      onClick={() => speak(c.en)}
                    >
                      <Volume2 className="h-4 w-4" /> Listen
                    </button>
                  </div>
                ))}
              </div>
            </article>
          )}

          {activeTab === 'flashcards' && (
            <div className="card p-6">
              <Flashcards items={selectedLesson.content} />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="card p-6">
              <Quiz items={selectedLesson.content} />
            </div>
          )}
        </div>
      </section>

      <footer className="mt-10 text-center text-sm text-slate-500">
        Built for learning ingl?s. Tip: click Listen to practice pronunciation.
      </footer>
    </main>
  );
}

function speak(text: string) {
  if (typeof window === 'undefined') return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
