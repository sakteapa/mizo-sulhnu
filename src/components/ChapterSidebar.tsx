import React, { useState } from "react";
import { BookPlus, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { countWords } from "../data/chapters";
import type { BookProject } from "../types/book";

interface ChapterSidebarProps {
  books: BookProject[];
  activeBook: BookProject;
  activeChapterId: number;
  generatingChapterId: number | null;
  readOnly?: boolean;
  onSelectBook: (bookId: string) => void;
  onCreateStoryBook: (
    title: string,
    topicFocus: string,
    chapterCount: number
  ) => void;
  onAddChapterToStoryBook: () => void;
  onSelectChapter: (id: number) => void;
}

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  books,
  activeBook,
  activeChapterId,
  generatingChapterId,
  readOnly = false,
  onSelectBook,
  onCreateStoryBook,
  onAddChapterToStoryBook,
  onSelectChapter,
}) => {
  const [showNewBookForm, setShowNewBookForm] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFocus, setNewFocus] = useState("");
  const [newCount, setNewCount] = useState(12);

  const chapters = activeBook.chapters;
  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) ?? chapters[0];
  const draftedCount = chapters.filter((c) => countWords(c.content) > 0).length;
  const totalWords = chapters.reduce((acc, c) => acc + countWords(c.content), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateStoryBook(newTitle.trim(), newFocus.trim(), newCount);
    setNewTitle("");
    setNewFocus("");
    setNewCount(12);
    setShowNewBookForm(false);
  };

  return (
    <aside
      aria-label="Master Book Outline"
      className="no-print w-full lg:w-80 xl:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border-hairline)] bg-[var(--bg-surface)]/55 flex flex-col"
    >
      {/* Mobile Compact Chapter Accordion Header (< lg) */}
      <div className="lg:hidden px-4 py-3 flex items-center justify-between gap-2 border-b border-[var(--border-hairline)]">
        <div className="min-w-0">
          <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
            {activeBook.title} · {draftedCount}/{chapters.length} Bung
          </p>
          <p className="text-xs font-medium text-[var(--text-ink)] truncate">
            {activeChapter?.bungLabel}: {activeChapter?.title}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded whitespace-nowrap shrink-0"
        >
          <span>{mobileExpanded ? "Khup Rawh" : "Bungte Enna"}</span>
          {mobileExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Book Project Selector (Master Book vs Single-Story Deep-Dive up to 30 chapters) */}
      <div
        className={`${
          mobileExpanded ? "block" : "hidden"
        } lg:block px-5 py-4 border-b border-[var(--border-hairline)] space-y-2.5`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Lehkhabu Thlanna
          </p>
          {!readOnly && (
            <button
              type="button"
              onClick={() => setShowNewBookForm((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-ink)] hover:underline whitespace-nowrap shrink-0"
            >
              <BookPlus className="w-3.5 h-3.5" />
              <span>Single-Story Bu Thar</span>
            </button>
          )}
        </div>

        <select
          aria-label="Select book project"
          value={activeBook.id}
          onChange={(e) => onSelectBook(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
        >
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.chapters.length} Bung)
            </option>
          ))}
        </select>

        {!readOnly && showNewBookForm && (
          <form
            onSubmit={handleCreate}
            className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded space-y-2.5"
          >
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Thawnthu hming (e.g. Lalruanga)"
              className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
            />
            <input
              type="text"
              value={newFocus}
              onChange={(e) => setNewFocus(e.target.value)}
              placeholder="Thupui / Focus (e.g. Dawi leh Lasi)"
              className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
            />
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] text-[var(--text-muted)]">
                Bung zat (1–30):
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={newCount}
                onChange={(e) =>
                  setNewCount(Math.max(1, Math.min(30, Number(e.target.value) || 1)))
                }
                className="w-16 px-2 py-1 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded tabular-nums"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewBookForm(false)}
                className="px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-[11px] font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded"
              >
                Siam Rawh
              </button>
            </div>
          </form>
        )}

        <div className="flex items-center gap-2 text-xs text-[var(--text-ink)] tabular-nums">
          <span>
            {draftedCount} / {chapters.length} Bung Ziah Tawh
          </span>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            ·
          </span>
          <span className="text-[var(--text-muted)]">
            {totalWords.toLocaleString()} thumal
          </span>
        </div>
      </div>

      {/* Chapter List */}
      <nav
        className={`${
          mobileExpanded ? "block" : "hidden"
        } lg:block flex-1 max-h-80 lg:max-h-none overflow-y-auto divide-y divide-[var(--border-hairline)]`}
      >
        {chapters.map((chapter) => {
          const words = countWords(chapter.content);
          const isActive = chapter.id === activeChapterId;
          const isGenerating = generatingChapterId === chapter.id;
          const indexStr = String(chapter.id).padStart(2, "0");

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                onSelectChapter(chapter.id);
                setMobileExpanded(false);
              }}
              className={`w-full text-left px-5 py-3.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-ink)] ${
                isActive
                  ? "bg-[var(--bg-elevated)]"
                  : "hover:bg-[var(--bg-elevated)]/60"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`font-code text-xs tabular-nums ${
                    isActive
                      ? "font-semibold text-[var(--accent-ink)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {indexStr}. {chapter.bungLabel}
                </span>
                <span className="font-ui text-[11px] text-[var(--text-muted)] tabular-nums whitespace-nowrap shrink-0">
                  {isGenerating
                    ? "Ziak mek..."
                    : words > 0
                    ? `${words.toLocaleString()} thumal`
                    : "La ruak"}
                </span>
              </div>
              <p
                className={`mt-1 font-book text-sm leading-snug line-clamp-2 ${
                  isActive
                    ? "font-semibold text-[var(--text-ink)]"
                    : "text-[var(--text-ink)]/85"
                }`}
              >
                {chapter.title}
              </p>
            </button>
          );
        })}

        {!readOnly && activeBook.mode === "single_story" && chapters.length < 30 && (
          <div className="p-4">
            <button
              type="button"
              onClick={onAddChapterToStoryBook}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-dashed border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bung Thar Belh ({chapters.length}/30)</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};
