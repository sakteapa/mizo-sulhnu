import React from "react";
import { COVER_ILLUSTRATION_PATH, countWords } from "../data/chapters";
import type { BookProject, GlossaryEntry } from "../types/book";
import { MizoProseRenderer } from "./MizoProseRenderer";

interface PrintableBookDocumentProps {
  book: BookProject;
  glossary: GlossaryEntry[];
}

export const PrintableBookDocument: React.FC<PrintableBookDocumentProps> = ({
  book,
  glossary,
}) => {
  const draftedChapters = book.chapters.filter(
    (c) => countWords(c.content) > 0
  );
  const sortedGlossary = [...glossary].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="hidden print:block text-[#111111] bg-white">
      {/* Title Page */}
      <section className="min-h-[90vh] flex flex-col items-center justify-between text-center py-12">
        <p className="font-ui text-xs uppercase tracking-[0.3em] text-[#555555]">
          Zofate DNA Chain &amp; Sulhnu Studio
        </p>

        <div className="space-y-6 max-w-lg mx-auto">
          <h1 className="font-display text-5xl font-bold tracking-tight text-[#111111]">
            {book.title}
          </h1>
          <p className="font-book italic text-xl text-[#444444]">
            {book.subtitle}
          </p>
          <div className="mx-auto w-64 pt-4">
            <img
              src={COVER_ILLUSTRATION_PATH}
              alt="Zofate Sulhnu frontispiece illustration"
              referrerPolicy="no-referrer"
              className="w-full h-auto border border-[#cccccc]"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs font-ui tracking-[0.2em] uppercase text-[#555555]">
          <p>Duhlian Mizo Edition</p>
          <p>Zofate DNA Chain &amp; Sulhnu Studio</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="print-page-break py-8">
        <p className="font-ui text-xs uppercase tracking-[0.25em] text-[#555555] text-center">
          Table of Contents
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-center mb-10">
          A Chhung Thute
        </h2>
        <div className="divide-y divide-[#dddddd]">
          {book.chapters.map((ch) => {
            const wc = countWords(ch.content);
            return (
              <div
                key={ch.id}
                className="py-3 flex items-baseline justify-between gap-4"
              >
                <div>
                  <span className="font-code text-xs mr-3 font-semibold">
                    {ch.bungLabel}
                  </span>
                  <span className="font-book text-sm">{ch.title}</span>
                </div>
                <span className="font-code text-xs text-[#555555] tabular-nums shrink-0">
                  {wc > 0 ? `${wc.toLocaleString()} thumal` : "La ziah loh"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapters */}
      {draftedChapters.map((ch) => (
        <section key={ch.id} className="print-page-break py-6">
          <header className="mb-10 pb-6 border-b border-[#cccccc] text-center">
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-[#555555]">
              {ch.bungLabel} · {ch.eraOrTheme}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight [text-wrap:balance]">
              {ch.title}
            </h2>
          </header>
          <MizoProseRenderer content={ch.content} />
        </section>
      ))}

      {/* Master Index */}
      {sortedGlossary.length > 0 && (
        <section className="print-page-break py-8">
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-[#555555] text-center">
            Glossary &amp; Index
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-center mb-8">
            Master Index leh Hrilhfiahna
          </h2>
          <div className="divide-y divide-[#dddddd]">
            {sortedGlossary.map((item) => (
              <div key={item.id} className="py-3 print-avoid-break">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display font-semibold text-base">
                    {item.name}
                  </span>
                  <span className="font-code text-xs text-[#555555]">
                    {item.chapterNumbers.map((n) => `Bung ${n}`).join(", ")}
                  </span>
                </div>
                <p className="mt-1 font-book text-sm leading-relaxed text-[#333333]">
                  {item.mizoDescription}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
