import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  BookOpen,
  User,
  Sparkles,
  Calendar,
  ArrowRight,
  Filter,
  Layers,
  ExternalLink,
} from "lucide-react";
import type { BookProject, DnaKnowledgeBase } from "../types/book";
import { MIZO_MYTHOLOGY_LORE_DATABASE } from "../data/mizoMythologyLore";

export type SearchCategoryFilter =
  | "all"
  | "chapters"
  | "people"
  | "lore"
  | "events";

export interface UniversalSearchResult {
  id: string;
  category: "chapter" | "person" | "lore" | "event";
  title: string;
  subtitle: string;
  excerpt: string;
  bookId?: string;
  chapterId?: number;
  personId?: string;
  loreId?: string;
  eventId?: string;
  badge: string;
}

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: BookProject[];
  kb: DnaKnowledgeBase;
  onSelectChapter: (bookId: string, chapterId: number) => void;
  onSelectPerson: (personId: string) => void;
  onSelectLore: (loreId: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  books,
  kb,
  onSelectChapter,
  onSelectPerson,
  onSelectLore,
}) => {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<SearchCategoryFilter>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or external state
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Perform multi-source full-text search
  const results = useMemo<UniversalSearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: UniversalSearchResult[] = [];

    // 1. Search Chapters across all Books
    if (categoryFilter === "all" || categoryFilter === "chapters") {
      for (const book of books || []) {
        for (const chapter of book.chapters || []) {
          const titleMatch = (chapter.title || "").toLowerCase().includes(q);
          const summaryMatch = (chapter.summary || "").toLowerCase().includes(q);
          const eraMatch = (chapter.eraOrTheme || "").toLowerCase().includes(q);
          const keyFigMatch = (chapter.keyFigures || []).some((kf) =>
            (kf || "").toLowerCase().includes(q)
          );
          const contentIdx = (chapter.content || "").toLowerCase().indexOf(q);

          if (titleMatch || summaryMatch || eraMatch || keyFigMatch || contentIdx !== -1) {
            let excerpt = chapter.summary || "";
            if (contentIdx !== -1 && chapter.content) {
              const start = Math.max(0, contentIdx - 60);
              const end = Math.min(chapter.content.length, contentIdx + 120);
              excerpt = `...${chapter.content.slice(start, end).replace(/\n+/g, " ")}...`;
            }

            items.push({
              id: `chap-${book.id}-${chapter.id}`,
              category: "chapter",
              title: `${chapter.bungLabel}: ${chapter.title}`,
              subtitle: `${book.title} · ${chapter.eraOrTheme || "History"}`,
              excerpt,
              bookId: book.id,
              chapterId: chapter.id,
              badge: "Lehkhabu Bung",
            });
          }
        }
      }
    }

    // 2. Search People in DNA Knowledge Base
    if (categoryFilter === "all" || categoryFilter === "people") {
      for (const p of kb.people || []) {
        const nameMatch = (p.fullName || "").toLowerCase().includes(q);
        const aliasMatch = (p.aliases || []).some((a) =>
          (a || "").toLowerCase().includes(q)
        );
        const clanMatch = (p.clan || "").toLowerCase().includes(q);
        const subClanMatch = (p.subClan || "").toLowerCase().includes(q);
        const villageMatch = (p.villages || []).some((v) =>
          (v || "").toLowerCase().includes(q)
        );
        const bioIdx = (p.biography || "").toLowerCase().indexOf(q);

        if (nameMatch || aliasMatch || clanMatch || subClanMatch || villageMatch || bioIdx !== -1) {
          let excerpt = p.biography || "";
          if (bioIdx !== -1 && p.biography) {
            const start = Math.max(0, bioIdx - 40);
            const end = Math.min(p.biography.length, bioIdx + 100);
            excerpt = `...${p.biography.slice(start, end)}...`;
          }

          items.push({
            id: `person-${p.id}`,
            category: "person",
            title: p.fullName,
            subtitle: `${p.clan}${p.subClan ? ` (${p.subClan})` : ""} · ${
              p.villages?.join(", ") || "Zoram"
            }`,
            excerpt,
            personId: p.id,
            badge: p.nodeType === "folklore" ? "Folklore" : "Mihring/Lal",
          });
        }
      }
    }

    // 3. Search Mythology & Lore Codex
    if (categoryFilter === "all" || categoryFilter === "lore") {
      for (const lore of MIZO_MYTHOLOGY_LORE_DATABASE) {
        const titleMatch = lore.title.toLowerCase().includes(q);
        const aliasMatch = lore.aliases.some((a) => a.toLowerCase().includes(q));
        const taglineMatch = lore.tagline.toLowerCase().includes(q);
        const powerMatch = lore.powers.some((p) => p.toLowerCase().includes(q));
        const loreIdx = lore.lore.toLowerCase().indexOf(q);

        if (titleMatch || aliasMatch || taglineMatch || powerMatch || loreIdx !== -1) {
          let excerpt = lore.tagline;
          if (loreIdx !== -1) {
            const start = Math.max(0, loreIdx - 40);
            const end = Math.min(lore.lore.length, loreIdx + 100);
            excerpt = `...${lore.lore.slice(start, end)}...`;
          }

          items.push({
            id: `lore-${lore.id}`,
            category: "lore",
            title: lore.title,
            subtitle: `${lore.realm.toUpperCase()} · ${lore.rarity}`,
            excerpt,
            loreId: lore.id,
            badge: "Dawi & Lore",
          });
        }
      }
    }

    // 4. Search Historical Events
    if (categoryFilter === "all" || categoryFilter === "events") {
      for (const ev of kb.events || []) {
        const titleMatch = (ev.title || "").toLowerCase().includes(q);
        const descIdx = (ev.summaryMizo || "").toLowerCase().indexOf(q);
        const locMatch = (ev.villagesInvolved || []).some((v) =>
          (v || "").toLowerCase().includes(q)
        );
        const yearMatch = (ev.year || "").toLowerCase().includes(q);

        if (titleMatch || descIdx !== -1 || locMatch || yearMatch) {
          items.push({
            id: `event-${ev.id}`,
            category: "event",
            title: `${ev.year}: ${ev.title}`,
            subtitle: `${ev.villagesInvolved?.join(", ") || "Zoram"} · ${ev.category || "Event"}`,
            excerpt: ev.summaryMizo || "",
            eventId: ev.id,
            badge: "Thil Thleng",
          });
        }
      }
    }

    return items;
  }, [query, categoryFilter, books, kb]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)] space-y-3">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[var(--accent-ink)] absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all books, chapters, people, clans, lasi, keimi, events..."
              className="w-full pl-11 pr-10 py-2.5 text-sm sm:text-base bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-xl text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)] transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                categoryFilter === "all"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)]"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              A Vaiin
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("chapters")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                categoryFilter === "chapters"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)]"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bung &amp; Lehkhabu</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("people")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                categoryFilter === "people"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)]"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mihring &amp; Lalte</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("lore")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                categoryFilter === "lore"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)]"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dawi &amp; Lore</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("events")}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                categoryFilter === "events"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)]"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Thil Thlengte</span>
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {!query.trim() ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Zawn duh thumal ziak la (e.g. Lalruanga, 1890 Changsil, Mary Winchester, Tan Tlang, Khampat...)</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              <p className="font-semibold text-sm text-[var(--text-ink)] mb-1">Hmuh a ni lo</p>
              <p>"{query}" nena inmil lehkha bu, mihring, emaw thawnthu hmuh a ni lo.</p>
            </div>
          ) : (
            results.map((res) => {
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    if (res.category === "chapter" && res.bookId && res.chapterId) {
                      onSelectChapter(res.bookId, res.chapterId);
                      onClose();
                    } else if (res.category === "person" && res.personId) {
                      onSelectPerson(res.personId);
                      onClose();
                    } else if (res.category === "lore" && res.loreId) {
                      onSelectLore(res.loreId);
                      onClose();
                    }
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] hover:border-[var(--accent-ink)] hover:bg-[var(--bg-elevated)] transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-code px-2 py-0.5 rounded bg-[var(--accent-ink)]/10 text-[var(--accent-ink)] font-semibold uppercase">
                        {res.badge}
                      </span>
                      <h4 className="font-display text-sm font-bold text-[var(--text-ink)] group-hover:text-[var(--accent-ink)] transition-colors">
                        {res.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {res.subtitle}
                    </p>
                    <p className="text-xs text-[var(--text-ink)]/80 font-book line-clamp-2 leading-relaxed">
                      {res.excerpt}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-ink)] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)]/60 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
          <span>Esc hmangin khar rawh</span>
          {results.length > 0 && (
            <span className="font-code font-semibold text-[var(--accent-ink)]">
              {results.length} results found
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
