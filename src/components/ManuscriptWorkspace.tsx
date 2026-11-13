import React, { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Feather,
  GitBranch,
  History,
  Maximize2,
  Minimize2,
  PanelLeft,
  PlusCircle,
  Send,
  SlidersHorizontal,
  Square,
} from "lucide-react";
import { COVER_ILLUSTRATION_PATH, countWords } from "../data/chapters";
import type {
  BookProject,
  CanvasMode,
  ChapterData,
  DnaKnowledgeBase,
  GlossaryEntry,
  ReadingTheme,
  UserRole,
  WatchdogAuditResult,
} from "../types/book";
import {
  buildFullBookMarkdown,
  buildFullBookPlainText,
  downloadTextFile,
} from "../utils/exportBook";
import { type ClickableEntity, MizoProseRenderer } from "./MizoProseRenderer";

interface ManuscriptWorkspaceProps {
  book: BookProject;
  chapter: ChapterData;
  kb: DnaKnowledgeBase;
  glossary: GlossaryEntry[];
  userRole: UserRole;
  canvasMode: CanvasMode;
  readingTheme: ReadingTheme;
  includeObscureDetails: boolean;
  isGenerating: boolean;
  generationMode: "generate" | "expand" | null;
  generationError: string | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onChangeCanvasMode: (mode: CanvasMode) => void;
  onChangeReadingTheme: (theme: ReadingTheme) => void;
  onToggleObscureDetails: () => void;
  onUpdateContent: (chapterId: number, content: string) => void;
  onUpdateCustomFocus: (chapterId: number, focus: string) => void;
  onSaveNewRevision: (chapterId: number) => void;
  onSwitchRevision: (chapterId: number, revisionId: string) => void;
  onSubmitChapterForAudit: (
    chapter: ChapterData,
    proposedContent: string,
    auditResult?: WatchdogAuditResult
  ) => { status: "approved" | "flagged_to_admin"; message: string };
  onGenerateChapter: (chapterId: number, mode: "generate" | "expand") => void;
  onStopGeneration: () => void;
  onSelectChapter: (chapterId: number) => void;
  onInspectEntity: (entity: ClickableEntity) => void;
}

export const ManuscriptWorkspace: React.FC<ManuscriptWorkspaceProps> = ({
  book,
  chapter,
  kb,
  glossary,
  userRole,
  canvasMode,
  readingTheme,
  includeObscureDetails,
  isGenerating,
  generationMode,
  generationError,
  sidebarOpen,
  onToggleSidebar,
  onChangeCanvasMode,
  onChangeReadingTheme,
  onToggleObscureDetails,
  onUpdateContent,
  onUpdateCustomFocus,
  onSaveNewRevision,
  onSwitchRevision,
  onSubmitChapterForAudit,
  onGenerateChapter,
  onStopGeneration,
  onSelectChapter,
  onInspectEntity,
}) => {
  const isReader = userRole === "reader";
  const isContributor = userRole === "contributor";

  const [showFocusInput, setShowFocusInput] = useState(false);
  const [contributorDraft, setContributorDraft] = useState(chapter.content);
  const [isAuditingChapter, setIsAuditingChapter] = useState(false);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    setContributorDraft(chapter.content);
    setAuditNotice(null);
  }, [chapter.id, chapter.content]);

  const effectiveCanvasMode: CanvasMode =
    isReader && canvasMode === "edit" ? "read" : canvasMode;

  const wordCount = countWords(chapter.content);
  const readingMinutes = Math.max(1, Math.round(wordCount / 180));
  const hasContent = chapter.content.trim().length > 0;
  const isFocusMode = effectiveCanvasMode === "focus";
  const totalChapters = book.chapters.length;

  const clickableEntities = useMemo<ClickableEntity[]>(() => {
    const list: ClickableEntity[] = [];
    for (const p of kb.people) {
      list.push({ id: p.id, label: p.fullName, kind: "person" });
      for (const alias of p.aliases) {
        if (alias.trim().length >= 3) {
          list.push({ id: p.id, label: alias, kind: "person" });
        }
      }
    }
    for (const c of kb.clans) {
      list.push({ id: c.id, label: c.name, kind: "clan" });
    }
    for (const v of kb.villages) {
      list.push({ id: v.id, label: v.name, kind: "village" });
    }
    return list;
  }, [kb]);

  const formattedUpdated = chapter.updatedAt
    ? new Date(chapter.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const activeTextValue = isContributor ? contributorDraft : chapter.content;

  const handleTextChange = (val: string) => {
    if (isReader) return;
    if (isContributor) {
      setContributorDraft(val);
    } else {
      onUpdateContent(chapter.id, val);
    }
  };

  const insertMarkdownSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      handleTextChange(
        activeTextValue ? `${activeTextValue}\n\n${snippet}` : snippet
      );
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = activeTextValue.slice(0, start);
    const after = activeTextValue.slice(end);
    const updated = `${before}${snippet}${after}`;
    handleTextChange(updated);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleContributorSubmitChapter = async () => {
    if (!contributorDraft.trim()) return;
    setIsAuditingChapter(true);
    setAuditNotice(null);

    const makeOfflineAudit = (): WatchdogAuditResult => ({
      overallSeverity: "minor_discrepancy",
      flags: [
        {
          category: "historical_conflict",
          severity: "minor_discrepancy",
          targetName: `${chapter.bungLabel}: ${chapter.title}`,
          summaryMizoEnglish:
            "Offline / Unverified Watchdog — Admin Review Required",
          detail:
            "Internet awm loh avang emaw AI Watchdog server biak theih loh avangin Admin-in a en hma chu chapter thar hi publish/overwrite phal a ni lo.",
        },
      ],
      auditReportMizoEnglish:
        "Offline chapter revision queued for Admin Alert Inbox.",
    });

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const outcome = onSubmitChapterForAudit(
        chapter,
        contributorDraft,
        makeOfflineAudit()
      );
      setAuditNotice(outcome.message);
      setIsAuditingChapter(false);
      return;
    }

    try {
      const res = await fetch("/api/watchdog/audit-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: "chapter_edit",
          titleOrName: `${chapter.bungLabel}: ${chapter.title}`,
          contentOrDetails: contributorDraft,
          existingContext: chapter.summary,
        }),
      });
      const auditResult = res.ok
        ? ((await res.json()) as WatchdogAuditResult)
        : makeOfflineAudit();
      const outcome = onSubmitChapterForAudit(
        chapter,
        contributorDraft,
        auditResult
      );
      setAuditNotice(outcome.message);
    } catch {
      const outcome = onSubmitChapterForAudit(
        chapter,
        contributorDraft,
        makeOfflineAudit()
      );
      setAuditNotice(outcome.message);
    } finally {
      setIsAuditingChapter(false);
    }
  };

  const handleDownloadMd = () => {
    const md = buildFullBookMarkdown(
      book.chapters,
      glossary,
      book.title,
      book.subtitle
    );
    downloadTextFile(
      `${book.title.replace(/\s+/g, "_")}.md`,
      md,
      "text/markdown;charset=utf-8"
    );
  };

  const handleDownloadTxt = () => {
    const txt = buildFullBookPlainText(
      book.chapters,
      glossary,
      book.title,
      book.subtitle
    );
    downloadTextFile(
      `${book.title.replace(/\s+/g, "_")}.txt`,
      txt,
      "text/plain;charset=utf-8"
    );
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Workspace Utility Toolbar */}
      <div className="no-print sticky top-0 z-10 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-xs px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {!isFocusMode && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label={
                sidebarOpen ? "Hide chapter outline" : "Show chapter outline"
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)] border border-[var(--border-hairline)] rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <PanelLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {sidebarOpen ? "Thupui Thukru" : "Bung Te"}
              </span>
            </button>
          )}

          {/* Canvas Mode Segmented Control */}
          <div className="inline-flex items-center p-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md">
            <button
              type="button"
              onClick={() => onChangeCanvasMode("read")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                effectiveCanvasMode === "read"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chhiarna</span>
            </button>
            {!isReader && (
              <button
                type="button"
                onClick={() => onChangeCanvasMode("edit")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  effectiveCanvasMode === "edit"
                    ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ziahna</span>
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onChangeCanvasMode(isFocusMode ? "read" : "focus")
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                isFocusMode
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              {isFocusMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>Focus</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 text-xs text-[var(--text-muted)] tabular-nums">
            <span>{wordCount.toLocaleString()} thumal</span>
            {wordCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>~{readingMinutes} min chhiar</span>
              </>
            )}
            {formattedUpdated && (
              <>
                <span aria-hidden="true">·</span>
                <span>Vawn that {formattedUpdated}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownloadMd}
            title="Download Book (.md)"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] rounded hover:border-[var(--text-muted)] whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.MD</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            title="Download Book (.txt)"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] rounded hover:border-[var(--text-muted)] whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT</span>
          </button>

          <div
            role="group"
            aria-label="Reading theme"
            className="inline-flex items-center p-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md"
          >
            {(
              [
                { id: "paper", label: "Paper" },
                { id: "sepia", label: "Sepia" },
                { id: "night", label: "Night" },
              ] as const
            ).map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChangeReadingTheme(theme.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  readingTheme === theme.id
                    ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Centered Literary Sheet */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-10 sm:py-14">
        <div
          className={`mx-auto ${
            effectiveCanvasMode === "edit" ? "max-w-3xl" : "max-w-[68ch]"
          }`}
        >
          {/* Chapter Masthead */}
          <header className="pb-8 border-b border-[var(--border-hairline)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-ui font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
                <span>{chapter.bungLabel}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">
                  ·
                </span>
                <span className="text-[var(--text-muted)] font-medium">
                  {chapter.eraOrTheme}
                </span>
                {isReader && (
                  <>
                    <span aria-hidden="true" className="text-[var(--text-muted)]">
                      ·
                    </span>
                    <span className="text-[var(--text-muted)] font-medium">
                      Read-Only
                    </span>
                  </>
                )}
              </div>

              {/* Revisions */}
              <div className="no-print flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                {chapter.revisions.map((rev) => (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => onSwitchRevision(chapter.id, rev.id)}
                    className={`px-2 py-0.5 font-code text-[11px] rounded border transition-colors ${
                      chapter.activeRevisionId === rev.id
                        ? "border-[var(--accent-ink)] bg-[var(--accent-subtle)] text-[var(--accent-ink)] font-semibold"
                        : "border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                    }`}
                  >
                    {rev.label}
                  </button>
                ))}
                {!isReader && (
                  <button
                    type="button"
                    onClick={() => onSaveNewRevision(chapter.id)}
                    className="px-2 py-0.5 font-code text-[11px] border border-dashed border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)] rounded"
                  >
                    + Save Rev {chapter.revisions.length + 1}
                  </button>
                )}
              </div>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-[1.18] tracking-tight text-[var(--text-ink)] [text-wrap:balance]">
              {chapter.title}
            </h1>

            <p className="mt-4 font-book text-[15.5px] leading-relaxed text-[var(--text-muted)]">
              {chapter.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-ui text-[var(--text-muted)]">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-[var(--text-ink)]">
                  Thu leh Mi Pawimawh:
                </span>
                {chapter.keyFigures.map((fig, i) => (
                  <React.Fragment key={fig}>
                    {i > 0 && <span aria-hidden="true">·</span>}
                    <span>{fig}</span>
                  </React.Fragment>
                ))}
              </div>
              {hasContent && effectiveCanvasMode !== "edit" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-ink)]">
                  <GitBranch className="w-3 h-3" />
                  <span>Hming tin click-in DNA Dossier a hawng theih</span>
                </span>
              )}
            </div>
          </header>

          {/* Generator Engine Controls (Admin & Contributor only) */}
          {!isFocusMode && !isReader && (
            <section
              aria-label="Chapter generator controls"
              className="no-print py-6 border-b border-[var(--border-hairline)] space-y-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--text-ink)] text-[var(--bg-canvas)] rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {generationMode === "expand"
                        ? "Chhunzawm Tihtawp (Stop)"
                        : "Ziah Tihtawp (Stop)"}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onGenerateChapter(chapter.id, "generate")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Ziak Chhuak Rawh (Generate)</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isGenerating || !hasContent}
                  onClick={() => onGenerateChapter(chapter.id, "expand")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] disabled:opacity-45 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Chhunzawm Rawh (Expand Deeply)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFocusInput((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Kaihhruaina</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeObscureDetails}
                  aria-label="Mi Hmingthang Lem Lo Telh Belh"
                  onClick={onToggleObscureDetails}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-150 ${
                    includeObscureDetails
                      ? "bg-[var(--accent-ink)] border-[var(--accent-ink)]"
                      : "bg-[var(--bg-surface)] border-[var(--border-hairline)]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 mt-[1px] ${
                      includeObscureDetails
                        ? "translate-x-4"
                        : "translate-x-[1px]"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={onToggleObscureDetails}
                  className="text-left"
                >
                  <span className="text-xs font-semibold text-[var(--text-ink)]">
                    Mi Hmingthang Lem Lo Telh Belh (Include Obscure Figures)
                  </span>
                  <span className="block text-[11.5px] text-[var(--text-muted)]">
                    Khaw hlui, hnam peng tenau, pasaltha hmingthang lem lo leh upate kâ-a thawnthute a telh belh ang.
                  </span>
                </button>
              </div>

              {showFocusInput && (
                <div className="pt-2">
                  <label
                    htmlFor={`focus-note-${chapter.id}`}
                    className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
                  >
                    Thuziak Kaihhruaina Bik (Optional)
                  </label>
                  <input
                    id={`focus-note-${chapter.id}`}
                    type="text"
                    value={chapter.customFocus}
                    onChange={(e) =>
                      onUpdateCustomFocus(chapter.id, e.target.value)
                    }
                    placeholder="Entirnan: Khawbel leh Hualngo khaw hlui chanchin leh Bawlpu hla hlui uar bik rawh..."
                    className="w-full px-3.5 py-2 text-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
                  />
                </div>
              )}

              {generationError && (
                <div
                  role="alert"
                  className="px-4 py-3 border border-[var(--accent-ink)]/50 bg-[var(--accent-subtle)] text-sm text-[var(--text-ink)] rounded-md"
                >
                  {generationError}
                </div>
              )}
            </section>
          )}

          {auditNotice && (
            <div
              role="status"
              className="mt-6 px-4 py-3 border border-[var(--accent-ink)]/40 bg-[var(--accent-subtle)] text-sm text-[var(--text-ink)] rounded-md"
            >
              {auditNotice}
            </div>
          )}

          {/* Reading / Editing Body */}
          <div className="py-10">
            {effectiveCanvasMode === "edit" && !isReader ? (
              <div className="space-y-4">
                <div className="no-print flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-hairline)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)] mr-1">
                      Chhinchhiahna:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet("\n## Thupui Thar\n\n")
                      }
                      className="px-2.5 py-1 text-xs border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-ink)] rounded"
                    >
                      + Thupui (##)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet("\n### Thlirzauna\n\n")
                      }
                      className="px-2.5 py-1 text-xs border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-ink)] rounded"
                    >
                      + Thlirzauna
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertMarkdownSnippet(
                          "\n> *Hla hlui / Hlado chang ziakna...*\n\n"
                        )
                      }
                      className="px-2.5 py-1 text-xs border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-ink)] rounded"
                    >
                      + Hla / Hlado (&gt;)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSnippet("\n---\n\n")}
                      className="px-2.5 py-1 text-xs border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-ink)] rounded"
                    >
                      + Scene Break
                    </button>
                  </div>

                  {isContributor && (
                    <button
                      type="button"
                      disabled={isAuditingChapter || !contributorDraft.trim()}
                      onClick={handleContributorSubmitChapter}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] disabled:opacity-50 rounded whitespace-nowrap shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isAuditingChapter
                          ? "AI Watchdog Endik mek..."
                          : "Submit Revision to AI Watchdog"}
                      </span>
                    </button>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  value={activeTextValue}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={`${chapter.bungLabel} thu ziak tan rawh le...`}
                  rows={28}
                  className="w-full min-h-[60vh] p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded-md font-book text-[17px] leading-[1.85] text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)] resize-y"
                />
              </div>
            ) : hasContent ? (
              <div>
                <MizoProseRenderer
                  content={chapter.content}
                  entities={clickableEntities}
                  onSelectEntity={onInspectEntity}
                />
                {isGenerating && (
                  <p className="mt-6 font-ui text-xs text-[var(--accent-ink)] tracking-wide">
                    Zawlbuk meipui bulah thawnthu ziah chhunzawm mek a ni...
                  </p>
                )}
              </div>
            ) : (
              <div className="py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
                <div className="mx-auto md:mx-0 w-48 sm:w-52">
                  <img
                    src={COVER_ILLUSTRATION_PATH}
                    alt="Zofate Sulhnu illustration"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto border border-[var(--border-hairline)]"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="font-display text-2xl font-semibold text-[var(--text-ink)]">
                    He Bung Hi A La Ruak A Ni
                  </h2>
                  <p className="font-book text-[16px] leading-relaxed text-[var(--text-muted)]">
                    {isReader
                      ? "He bung hi Admin leh Ziaktu te ziah chhuah mek a la ni rih. Bung dang ziah tawhte thlir rawh."
                      : "Ziak Chhuak Rawh (Generate) tih hi hmet la, Zawlbuk mei lum bula upa thawnthu thiam tak ang maiin Mizo tawng ril leh mawi takin (thumal 2,000 chuang) a rawn ziak chhuak nghal ang."}
                  </p>
                  {!isReader && (
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onGenerateChapter(chapter.id, "generate")}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        <Feather className="w-3.5 h-3.5" />
                        <span>Ziak Chhuak Rawh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeCanvasMode("edit")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md transition-colors whitespace-nowrap shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Kuta Ziak Tan</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="no-print pt-8 border-t border-[var(--border-hairline)] flex items-center justify-between gap-4">
            {chapter.id > 1 ? (
              <button
                type="button"
                onClick={() => onSelectChapter(chapter.id - 1)}
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bung {chapter.id - 1}</span>
              </button>
            ) : (
              <span />
            )}

            {chapter.id < totalChapters && (
              <button
                type="button"
                onClick={() => onSelectChapter(chapter.id + 1)}
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors"
              >
                <span>Bung {chapter.id + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
};
