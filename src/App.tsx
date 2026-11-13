import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Printer, Shield } from "lucide-react";
import { AdminModerationDashboard } from "./components/AdminModerationDashboard";
import { ChapterSidebar } from "./components/ChapterSidebar";
import { ContributorSubmissionsView } from "./components/ContributorSubmissionsView";
import { DnaChainStudio } from "./components/DnaChainStudio";
import { DocumentUploadStudio } from "./components/DocumentUploadStudio";
import { ManuscriptWorkspace } from "./components/ManuscriptWorkspace";
import { MobileBottomNav } from "./components/MobileBottomNav";
import type { ClickableEntity } from "./components/MizoProseRenderer";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PersonDossierPanel } from "./components/PersonDossierModal";
import { PrintableBookDocument } from "./components/PrintableBookDocument";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { RolePortalModal } from "./components/RolePortalModal";
import {
  ALL_SEED_BOOKS,
  createSingleStoryBook,
  extractCanonicalTermsFromChapters,
  INITIAL_CHAPTERS,
  MASTER_BOOK_PROJECT,
} from "./data/chapters";
import { SEED_INITIAL_CONFLICTS } from "./data/seedArchivalRecords";
import { SEED_DNA_KNOWLEDGE_BASE } from "./data/seedKnowledgeBase";
import type {
  AuditLogEntry,
  BookProject,
  CanvasMode,
  ChapterData,
  ConflictItem,
  DnaKnowledgeBase,
  ExtractedIngestPayload,
  IntegritySeverity,
  PersonNode,
  ReadingTheme,
  StudioView,
  SubmissionRecord,
  UserRole,
  WatchdogAuditResult,
} from "./types/book";
import {
  dedupeConflicts,
  mergeExtractedIntoKnowledgeBase,
} from "./utils/dnaGraph";

const STORAGE_KEYS = {
  books: "zofate_dna_books_v5",
  legacyChapters: "zofate_sulhnu_chapters_v2",
  activeBookId: "zofate_dna_active_book_v5",
  kb: "zofate_dna_kb_v5",
  conflicts: "zofate_dna_conflicts_v5",
  auditLogs: "zofate_dna_audit_v5",
  submissions: "zofate_dna_submissions_v5",
  userRole: "zofate_dna_role_v3",
  contributorName: "zofate_dna_contributor_name_v3",
  readerMaskMedical: "zofate_dna_reader_mask_v3",
  privacyLock: "zofate_dna_privacy_lock_v2",
  theme: "zofate_sulhnu_theme_v1",
  activeChapter: "zofate_sulhnu_active_chapter_v1",
  obscureToggle: "zofate_sulhnu_obscure_toggle_v1",
};

function loadJsonFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function deepClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T;
}

function hydrateBooks(): BookProject[] {
  const savedBooks = loadJsonFromStorage<BookProject[] | null>(
    STORAGE_KEYS.books,
    null
  );
  const seedBookMap = new Map(ALL_SEED_BOOKS.map((b) => [b.id, b]));

  if (savedBooks && Array.isArray(savedBooks) && savedBooks.length > 0) {
    const existingIds = new Set(savedBooks.map((b) => b.id));
    const missingSeedBooks = ALL_SEED_BOOKS.filter((sb) => !existingIds.has(sb.id));
    const mergedList = [...savedBooks, ...missingSeedBooks];

    return mergedList.map((b) => {
      const seedMatch = seedBookMap.get(b.id);
      if (seedMatch) {
        return {
          ...b,
          title: seedMatch.title,
          subtitle: seedMatch.subtitle,
          topicFocus: seedMatch.topicFocus,
          chapters: seedMatch.chapters.map((seedCh) => {
            const userCh = b.chapters?.find((c) => c.id === seedCh.id);
            // If the cached chapter is empty, shorter than 100 characters, or missing,
            // unconditionally replace with full authoritative seed content!
            if (!userCh || !userCh.content || userCh.content.trim().length < 100) {
              return deepClone(seedCh);
            }
            return userCh;
          }),
        };
      }
      return b;
    });
  }

  return deepClone(ALL_SEED_BOOKS);
}

function hydrateKnowledgeBase(): DnaKnowledgeBase {
  const saved = loadJsonFromStorage<DnaKnowledgeBase | null>(
    STORAGE_KEYS.kb,
    null
  );
  if (!saved || !Array.isArray(saved.people)) {
    return SEED_DNA_KNOWLEDGE_BASE;
  }

  const seedPeopleById = new Map(
    SEED_DNA_KNOWLEDGE_BASE.people.map((p) => [p.id, p])
  );
  const existingPeopleIds = new Set(saved.people.map((p) => p.id));

  const mergedPeople = saved.people.map((p) => {
    const seedMatch = seedPeopleById.get(p.id);
    if (!seedMatch) return p;
    const biography =
      seedMatch.biography && (!p.biography || seedMatch.biography.length > p.biography.length)
        ? seedMatch.biography
        : p.biography;
    const lifeEvents =
      seedMatch.lifeEvents && (!p.lifeEvents || p.lifeEvents.length === 0)
        ? seedMatch.lifeEvents
        : p.lifeEvents;

    return {
      ...p,
      biography,
      lifeEvents,
      aliases: Array.from(new Set([...(p.aliases || []), ...seedMatch.aliases])),
      parentIds: Array.from(
        new Set([...(p.parentIds || []), ...seedMatch.parentIds])
      ),
      spouseIds: Array.from(
        new Set([...(p.spouseIds || []), ...seedMatch.spouseIds])
      ),
      childrenIds: Array.from(
        new Set([...(p.childrenIds || []), ...seedMatch.childrenIds])
      ),
      villages: Array.from(
        new Set([...(p.villages || []), ...seedMatch.villages])
      ),
    };
  });

  for (const sp of SEED_DNA_KNOWLEDGE_BASE.people) {
    if (!existingPeopleIds.has(sp.id)) {
      mergedPeople.push(sp);
    }
  }

  const existingClanIds = new Set((saved.clans || []).map((c) => c.id));
  const mergedClans = [
    ...(saved.clans || []),
    ...SEED_DNA_KNOWLEDGE_BASE.clans.filter((c) => !existingClanIds.has(c.id)),
  ];

  const existingVillageIds = new Set((saved.villages || []).map((v) => v.id));
  const mergedVillages = [
    ...(saved.villages || []),
    ...SEED_DNA_KNOWLEDGE_BASE.villages.filter(
      (v) => !existingVillageIds.has(v.id)
    ),
  ];

  const existingEventIds = new Set((saved.events || []).map((e) => e.id));
  const mergedEvents = [
    ...(saved.events || []),
    ...(SEED_DNA_KNOWLEDGE_BASE.events || []).filter(
      (e) => !existingEventIds.has(e.id)
    ),
  ];

  return {
    people: mergedPeople,
    clans: mergedClans,
    villages: mergedVillages,
    events: mergedEvents,
  };
}

function hydrateConflicts(): ConflictItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.conflicts);
    if (!raw) {
      return SEED_INITIAL_CONFLICTS;
    }
    const parsed = JSON.parse(raw) as ConflictItem[];
    if (!Array.isArray(parsed)) return SEED_INITIAL_CONFLICTS;
    const savedKb = loadJsonFromStorage<DnaKnowledgeBase | null>(
      STORAGE_KEYS.kb,
      null
    );
    const hadArchivalEvents = Boolean(
      savedKb && Array.isArray(savedKb.events) && savedKb.events.length > 0
    );
    if (!hadArchivalEvents) {
      const existingIds = new Set(parsed.map((c) => c.id));
      return [
        ...parsed,
        ...SEED_INITIAL_CONFLICTS.filter((c) => !existingIds.has(c.id)),
      ];
    }
    return parsed;
  } catch {
    return SEED_INITIAL_CONFLICTS;
  }
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  contributor: "Contributor",
  reader: "Reader",
};

export default function App() {
  const [books, setBooks] = useState<BookProject[]>(hydrateBooks);
  const [activeBookId, setActiveBookId] = useState<string>(() =>
    loadJsonFromStorage<string>(
      STORAGE_KEYS.activeBookId,
      MASTER_BOOK_PROJECT.id
    )
  );
  const [activeChapterId, setActiveChapterId] = useState<number>(() =>
    loadJsonFromStorage<number>(STORAGE_KEYS.activeChapter, 1)
  );

  const [kb, setKb] = useState<DnaKnowledgeBase>(hydrateKnowledgeBase);
  const [conflicts, setConflicts] = useState<ConflictItem[]>(hydrateConflicts);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadJsonFromStorage<AuditLogEntry[]>(STORAGE_KEYS.auditLogs, [])
  );
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() =>
    loadJsonFromStorage<SubmissionRecord[]>(STORAGE_KEYS.submissions, [])
  );

  const [userRole, setUserRole] = useState<UserRole>(() =>
    loadJsonFromStorage<UserRole>(STORAGE_KEYS.userRole, "admin")
  );
  const [contributorName, setContributorName] = useState<string>(() =>
    loadJsonFromStorage<string>(
      STORAGE_KEYS.contributorName,
      "Mimal Contributor"
    )
  );
  const [readerMaskMedical, setReaderMaskMedical] = useState<boolean>(() =>
    loadJsonFromStorage<boolean>(STORAGE_KEYS.readerMaskMedical, true)
  );
  const [privacyLocked, setPrivacyLocked] = useState<boolean>(() =>
    loadJsonFromStorage<boolean>(STORAGE_KEYS.privacyLock, false)
  );
  const [showRolePortal, setShowRolePortal] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<StudioView>("manuscript");
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() =>
    loadJsonFromStorage<ReadingTheme>(STORAGE_KEYS.theme, "paper")
  );
  const [canvasMode, setCanvasMode] = useState<CanvasMode>("read");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [includeObscureDetails, setIncludeObscureDetails] = useState<boolean>(
    () => loadJsonFromStorage<boolean>(STORAGE_KEYS.obscureToggle, true)
  );

  const [selectedDnaPersonId, setSelectedDnaPersonId] = useState<string>(
    () => kb.people[0]?.id || "person-chhinlung-thlahtu"
  );
  const [modalPersonId, setModalPersonId] = useState<string | null>(null);
  const [modalNotice, setModalNotice] = useState<string | null>(null);

  const [generatingChapterId, setGeneratingChapterId] = useState<number | null>(
    null
  );
  const [generationMode, setGenerationMode] = useState<
    "generate" | "expand" | null
  >(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const effectivePrivacyLocked =
    userRole === "reader" ? readerMaskMedical : privacyLocked;

  const actorDisplayName =
    userRole === "admin"
      ? "Admin (Enkawltu Ber)"
      : userRole === "contributor"
      ? contributorName
      : "Reader (Chhiartu)";

  // Auto-repair hook: if any chapter of any seed book is empty or corrupted,
  // immediately restore full authoritative seed text into active state.
  useEffect(() => {
    setBooks((currentBooks) => {
      let changed = false;
      const updated = currentBooks.map((b) => {
        const seed = ALL_SEED_BOOKS.find((sb) => sb.id === b.id);
        if (!seed) return b;
        const newChapters = b.chapters.map((ch) => {
          const seedCh = seed.chapters.find((sc) => sc.id === ch.id);
          if (seedCh && (!ch.content || ch.content.trim().length < 100)) {
            changed = true;
            return deepClone(seedCh);
          }
          return ch;
        });
        return changed ? { ...b, chapters: newChapters } : b;
      });
      return changed ? updated : currentBooks;
    });
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(books));
      localStorage.setItem(
        STORAGE_KEYS.activeBookId,
        JSON.stringify(activeBookId)
      );
      localStorage.setItem(STORAGE_KEYS.kb, JSON.stringify(kb));
      localStorage.setItem(STORAGE_KEYS.conflicts, JSON.stringify(conflicts));
      localStorage.setItem(STORAGE_KEYS.auditLogs, JSON.stringify(auditLogs));
      localStorage.setItem(
        STORAGE_KEYS.submissions,
        JSON.stringify(submissions)
      );
      localStorage.setItem(STORAGE_KEYS.userRole, JSON.stringify(userRole));
      localStorage.setItem(
        STORAGE_KEYS.contributorName,
        JSON.stringify(contributorName)
      );
      localStorage.setItem(
        STORAGE_KEYS.readerMaskMedical,
        JSON.stringify(readerMaskMedical)
      );
      localStorage.setItem(
        STORAGE_KEYS.privacyLock,
        JSON.stringify(privacyLocked)
      );
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(readingTheme));
      localStorage.setItem(
        STORAGE_KEYS.activeChapter,
        JSON.stringify(activeChapterId)
      );
      localStorage.setItem(
        STORAGE_KEYS.obscureToggle,
        JSON.stringify(includeObscureDetails)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    books,
    activeBookId,
    kb,
    conflicts,
    auditLogs,
    submissions,
    userRole,
    contributorName,
    readerMaskMedical,
    privacyLocked,
    readingTheme,
    activeChapterId,
    includeObscureDetails,
  ]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", readingTheme);
    if (readingTheme === "night") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [readingTheme]);

  // Enforce RBAC view & canvas boundaries whenever role changes
  const handleSelectRole = useCallback(
    (nextRole: UserRole, nextContributorName?: string) => {
      setUserRole(nextRole);
      if (nextContributorName && nextContributorName.trim()) {
        setContributorName(nextContributorName.trim());
      }
      if (nextRole === "reader") {
        setCanvasMode((prev) => (prev === "edit" ? "read" : prev));
        if (
          activeView === "upload" ||
          activeView === "admin" ||
          activeView === "submissions"
        ) {
          setActiveView("manuscript");
        }
      } else if (nextRole === "contributor") {
        if (activeView === "admin") {
          setActiveView("submissions");
        }
      } else if (nextRole === "admin") {
        if (activeView === "submissions") {
          setActiveView("admin");
        }
      }
    },
    [activeView]
  );

  const activeBook = useMemo(
    () => books.find((b) => b.id === activeBookId) ?? books[0],
    [books, activeBookId]
  );

  const activeChapter = useMemo(
    () =>
      activeBook.chapters.find((c) => c.id === activeChapterId) ??
      activeBook.chapters[0],
    [activeBook, activeChapterId]
  );

  const bookGlossary = useMemo(
    () => extractCanonicalTermsFromChapters(activeBook.chapters),
    [activeBook.chapters]
  );

  const modalPerson = useMemo(
    () =>
      modalPersonId
        ? kb.people.find((p) => p.id === modalPersonId) ?? null
        : null,
    [kb.people, modalPersonId]
  );

  const appendAuditLog = useCallback(
    (
      action: string,
      sourceName: string,
      summary: string,
      counts?: { added?: number; updated?: number; conflicts?: number }
    ) => {
      setAuditLogs((prev) => [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: Date.now(),
          actorRole: userRole,
          actorName: actorDisplayName,
          action,
          sourceName,
          summary,
          addedCount: counts?.added ?? 0,
          updatedCount: counts?.updated ?? 0,
          conflictsDetected: counts?.conflicts ?? 0,
        },
        ...prev,
      ]);
    },
    [actorDisplayName, userRole]
  );

  const updateActiveBookChapters = useCallback(
    (updater: (chapters: ChapterData[]) => ChapterData[]) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === activeBook.id ? { ...b, chapters: updater(b.chapters) } : b
        )
      );
    },
    [activeBook.id]
  );

  const applyChapterContentChange = useCallback(
    (bookId: string, chapterId: number, content: string, revNote?: string) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== bookId) return b;
          return {
            ...b,
            chapters: b.chapters.map((ch) => {
              if (ch.id !== chapterId) return ch;
              const nextNum = ch.revisions.length + 1;
              const newRevId = `rev-${Date.now()}`;
              return {
                ...ch,
                content,
                updatedAt: Date.now(),
                revisions: revNote
                  ? [
                      ...ch.revisions,
                      {
                        id: newRevId,
                        label: `Rev ${nextNum}`,
                        content,
                        createdAt: Date.now(),
                        note: revNote,
                      },
                    ]
                  : ch.revisions.map((r) =>
                      r.id === ch.activeRevisionId ? { ...r, content } : r
                    ),
                activeRevisionId: revNote ? newRevId : ch.activeRevisionId,
              };
            }),
          };
        })
      );
    },
    []
  );

  const handleUpdateContent = useCallback(
    (chapterId: number, content: string) => {
      if (userRole === "reader") return;
      updateActiveBookChapters((chs) =>
        chs.map((ch) => {
          if (ch.id !== chapterId) return ch;
          const updatedRevs = ch.revisions.map((r) =>
            r.id === ch.activeRevisionId ? { ...r, content } : r
          );
          return {
            ...ch,
            content,
            updatedAt: Date.now(),
            revisions: updatedRevs,
          };
        })
      );
    },
    [updateActiveBookChapters, userRole]
  );

  const handleUpdateCustomFocus = useCallback(
    (chapterId: number, customFocus: string) => {
      if (userRole === "reader") return;
      updateActiveBookChapters((chs) =>
        chs.map((ch) => (ch.id === chapterId ? { ...ch, customFocus } : ch))
      );
    },
    [updateActiveBookChapters, userRole]
  );

  const handleSaveNewRevision = useCallback(
    (chapterId: number) => {
      if (userRole === "reader") return;
      updateActiveBookChapters((chs) =>
        chs.map((ch) => {
          if (ch.id !== chapterId) return ch;
          const nextNum = ch.revisions.length + 1;
          const newRevId = `rev-${Date.now()}`;
          return {
            ...ch,
            revisions: [
              ...ch.revisions,
              {
                id: newRevId,
                label: `Rev ${nextNum}`,
                content: ch.content,
                createdAt: Date.now(),
                note: `Snapshot Rev ${nextNum}`,
              },
            ],
            activeRevisionId: newRevId,
          };
        })
      );
    },
    [updateActiveBookChapters, userRole]
  );

  const handleSwitchRevision = useCallback(
    (chapterId: number, revisionId: string) => {
      updateActiveBookChapters((chs) =>
        chs.map((ch) => {
          if (ch.id !== chapterId) return ch;
          const targetRev = ch.revisions.find((r) => r.id === revisionId);
          if (!targetRev) return ch;
          return {
            ...ch,
            activeRevisionId: targetRev.id,
            content: targetRev.content,
          };
        })
      );
    },
    [updateActiveBookChapters]
  );

  const handleCreateStoryBook = useCallback(
    (title: string, topicFocus: string, chapterCount: number) => {
      if (userRole === "reader") return;
      const created = createSingleStoryBook(title, topicFocus, chapterCount);
      setBooks((prev) => [...prev, created]);
      setActiveBookId(created.id);
      setActiveChapterId(1);
    },
    [userRole]
  );

  const handleAddChapterToStoryBook = useCallback(() => {
    if (userRole === "reader") return;
    updateActiveBookChapters((chs) => {
      if (chs.length >= 30) return chs;
      const nextNum = chs.length + 1;
      const revId = `rev-1-${Date.now()}`;
      return [
        ...chs,
        {
          id: nextNum,
          bungLabel: `Bung ${nextNum}`,
          title: `${activeBook.title} — Chanchin Bung ${nextNum}`,
          eraOrTheme: activeBook.topicFocus || "Single-Story Deep-Dive",
          summary: `${activeBook.title} Bung ${nextNum}`,
          keyFigures: [activeBook.title],
          content: "",
          customFocus: activeBook.topicFocus || "",
          updatedAt: null,
          revisions: [
            {
              id: revId,
              label: "Rev 1",
              content: "",
              createdAt: Date.now(),
            },
          ],
          activeRevisionId: revId,
        },
      ];
    });
  }, [activeBook.title, activeBook.topicFocus, updateActiveBookChapters, userRole]);

  const handleStopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setGeneratingChapterId(null);
    setGenerationMode(null);
  }, []);

  const handleGenerateChapter = useCallback(
    async (chapterId: number, mode: "generate" | "expand") => {
      if (userRole === "reader") return;
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setGenerationError(
          "Offline Mode-ah chuan AI chapter generator a hman theih rih loh. Internet a awm hunah i bei leh dawn nia; manual-a ziah leh chhiar erawh a theih reng e."
        );
        return;
      }
      const target = activeBook.chapters.find((c) => c.id === chapterId);
      if (!target) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setGenerationError(null);
      setGeneratingChapterId(chapterId);
      setGenerationMode(mode);
      if (canvasMode === "edit") {
        setCanvasMode("read");
      }

      const startingContent =
        mode === "expand" && target.content.trim().length > 0
          ? `${target.content.trim()}\n\n`
          : "";

      if (mode === "generate") {
        handleUpdateContent(chapterId, "");
      }

      let accumulated = startingContent;

      try {
        const response = await fetch("/api/chapters/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            bookTitle: `${activeBook.title}: ${activeBook.subtitle}`,
            chapterNumber: target.id,
            chapterTitle: target.title,
            chapterSummary: target.summary,
            keyFigures: target.keyFigures,
            mode,
            includeObscureDetails,
            existingContent: target.content,
            customFocus: target.customFocus,
          }),
        });

        if (!response.ok || !response.body) {
          const errPayload = await response
            .json()
            .catch(() => ({ error: "Failed to start generation." }));
          throw new Error(errPayload.error || "Failed to generate chapter.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const evt of events) {
            const line = evt
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!line) continue;
            const rawJson = line.slice(6);
            try {
              const payload = JSON.parse(rawJson) as {
                text?: string;
                done?: boolean;
                error?: string;
              };
              if (payload.error) {
                throw new Error(payload.error);
              }
              if (payload.text) {
                accumulated += payload.text;
                handleUpdateContent(chapterId, accumulated);
              }
            } catch (parseErr) {
              if (
                parseErr instanceof Error &&
                !parseErr.message.includes("JSON")
              ) {
                throw parseErr;
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setGenerationError(
            err instanceof Error
              ? err.message
              : "Generation failed. Please check your connection."
          );
        }
      } finally {
        setGeneratingChapterId(null);
        setGenerationMode(null);
        abortControllerRef.current = null;
      }
    },
    [
      activeBook,
      canvasMode,
      handleUpdateContent,
      includeObscureDetails,
      userRole,
    ]
  );

  // Clickable entity in prose -> open DNA Profile Dossier modal
  const handleInspectEntity = useCallback(
    (entity: ClickableEntity) => {
      if (entity.kind === "person") {
        setModalPersonId(entity.id);
        return;
      }
      if (entity.kind === "clan") {
        const match = kb.people.find(
          (p) => p.clan.toLowerCase() === entity.label.toLowerCase()
        );
        if (match) {
          setModalPersonId(match.id);
          return;
        }
      }
      if (entity.kind === "village") {
        const match = kb.people.find((p) =>
          p.villages.some((v) => v.toLowerCase() === entity.label.toLowerCase())
        );
        if (match) {
          setModalPersonId(match.id);
          return;
        }
      }
      setActiveView("dna");
    },
    [kb.people]
  );

  // --- Watchdog-Audited Submission Handlers ---

  const handleSubmitChapterForAudit = useCallback(
    (
      chapter: ChapterData,
      proposedContent: string,
      auditResult?: WatchdogAuditResult
    ): { status: "approved" | "flagged_to_admin"; message: string } => {
      const severity: IntegritySeverity =
        auditResult?.overallSeverity ?? "clean";
      const flags = auditResult?.flags ?? [];
      const report =
        auditResult?.auditReportMizoEnglish ||
        "AI Watchdog endikna a fihlim (Clean).";

      const isFlagged =
        userRole === "contributor" &&
        (severity !== "clean" || flags.length > 0);

      if (isFlagged) {
        const sub: SubmissionRecord = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          submittedByRole: userRole,
          submitterName: actorDisplayName,
          submissionType: "chapter_edit",
          sourceName: `${activeBook.title} · ${chapter.bungLabel}`,
          summary: `${chapter.title} (${proposedContent.split(/\s+/).length} words)`,
          auditReportMizoEnglish: report,
          overallSeverity: severity,
          flags,
          status: "flagged_to_admin",
          chapterPatch: {
            bookId: activeBook.id,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            previousContent: chapter.content,
            proposedContent,
          },
        };
        setSubmissions((prev) => [sub, ...prev]);
        appendAuditLog(
          "Watchdog Flagged Chapter Edit",
          sub.sourceName,
          report
        );
        return {
          status: "flagged_to_admin",
          message:
            "AI Watchdog-in thu inkalh / ennawn ngai a hmu a, Admin Alert Inbox-ah a thawn ta (core book a la khawih lo).",
        };
      }

      const snapshotBeforeBooks = deepClone(books);
      applyChapterContentChange(
        activeBook.id,
        chapter.id,
        proposedContent,
        `Audited submission (${actorDisplayName})`
      );

      const sub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        submittedAt: Date.now(),
        submittedByRole: userRole,
        submitterName: actorDisplayName,
        submissionType: "chapter_edit",
        sourceName: `${activeBook.title} · ${chapter.bungLabel}`,
        summary: `${chapter.title} approved & saved as new revision`,
        auditReportMizoEnglish: report,
        overallSeverity: severity,
        flags,
        status: "approved",
        chapterPatch: {
          bookId: activeBook.id,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          previousContent: chapter.content,
          proposedContent,
        },
        snapshotBeforeBooks,
        reviewedAt: Date.now(),
      };
      setSubmissions((prev) => [sub, ...prev]);
      appendAuditLog(
        "Chapter Revision Approved",
        sub.sourceName,
        sub.summary,
        { updated: 1 }
      );
      return {
        status: "approved",
        message: "AI Watchdog-in a pawm a, revision thar ziah luh a ni (Pawm Tawh).",
      };
    },
    [
      activeBook.id,
      activeBook.title,
      actorDisplayName,
      appendAuditLog,
      applyChapterContentChange,
      books,
      userRole,
    ]
  );

  const applyPersonAdd = useCallback((newPerson: PersonNode) => {
    setKb((prev) => {
      const updatedPeople = prev.people.map((p) => {
        if (newPerson.parentIds.includes(p.id)) {
          return {
            ...p,
            childrenIds: Array.from(new Set([...p.childrenIds, newPerson.id])),
          };
        }
        return p;
      });
      return {
        ...prev,
        people: [...updatedPeople, newPerson],
      };
    });
  }, []);

  const applyPersonUpdate = useCallback((updated: PersonNode) => {
    setKb((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === updated.id ? updated : p)),
    }));
  }, []);

  const handleSubmitNewPerson = useCallback(
    (
      newPerson: PersonNode,
      auditResult?: WatchdogAuditResult
    ): { status: "approved" | "flagged_to_admin"; message: string } => {
      const severity: IntegritySeverity =
        auditResult?.overallSeverity ?? "clean";
      const flags = auditResult?.flags ?? [];
      const report =
        auditResult?.auditReportMizoEnglish ||
        "AI Watchdog endikna a fihlim (Clean).";

      const isFlagged =
        userRole === "contributor" &&
        (severity !== "clean" || flags.length > 0);

      if (isFlagged) {
        const sub: SubmissionRecord = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          submittedByRole: userRole,
          submitterName: actorDisplayName,
          submissionType: "person_entry",
          sourceName: `New DNA Entry: ${newPerson.fullName}`,
          summary: `${newPerson.fullName} (${newPerson.clan}, Blood ${newPerson.bloodGroup})`,
          auditReportMizoEnglish: report,
          overallSeverity: severity,
          flags,
          status: "flagged_to_admin",
          personPatch: newPerson,
        };
        setSubmissions((prev) => [sub, ...prev]);
        appendAuditLog(
          "Watchdog Flagged New Person",
          sub.sourceName,
          report
        );
        return {
          status: "flagged_to_admin",
          message:
            "AI Watchdog-in thu inkalh / timeline fiah lo a hmu a, Admin Enmek turin a thawn ta.",
        };
      }

      const snapshotBeforeKb = deepClone(kb);
      applyPersonAdd(newPerson);

      const sub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        submittedAt: Date.now(),
        submittedByRole: userRole,
        submitterName: actorDisplayName,
        submissionType: "person_entry",
        sourceName: `New DNA Entry: ${newPerson.fullName}`,
        summary: `Added ${newPerson.fullName} (${newPerson.clan})`,
        auditReportMizoEnglish: report,
        overallSeverity: severity,
        flags,
        status: "approved",
        personPatch: newPerson,
        snapshotBeforeKb,
        reviewedAt: Date.now(),
      };
      setSubmissions((prev) => [sub, ...prev]);
      appendAuditLog("Person Added to DNA Chain", sub.sourceName, sub.summary, {
        added: 1,
      });
      return {
        status: "approved",
        message: "Pawm Tawh — DNA Chain database-ah dah luh a ni.",
      };
    },
    [actorDisplayName, appendAuditLog, applyPersonAdd, kb, userRole]
  );

  const handleSubmitPersonUpdate = useCallback(
    (
      updated: PersonNode,
      auditResult?: WatchdogAuditResult
    ): { status: "approved" | "flagged_to_admin"; message: string } => {
      if (userRole === "reader") {
        return {
          status: "flagged_to_admin",
          message: "Reader role cannot modify records.",
        };
      }

      const severity: IntegritySeverity =
        auditResult?.overallSeverity ?? "clean";
      const flags = auditResult?.flags ?? [];
      const report =
        auditResult?.auditReportMizoEnglish ||
        "AI Watchdog endikna a fihlim (Clean).";

      const isFlagged =
        userRole === "contributor" &&
        (severity !== "clean" || flags.length > 0);

      if (isFlagged) {
        const sub: SubmissionRecord = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          submittedByRole: userRole,
          submitterName: actorDisplayName,
          submissionType: "person_entry",
          sourceName: `Profile Update: ${updated.fullName}`,
          summary: `Proposed update for ${updated.fullName} (${updated.clan})`,
          auditReportMizoEnglish: report,
          overallSeverity: severity,
          flags,
          status: "flagged_to_admin",
          personPatch: updated,
        };
        setSubmissions((prev) => [sub, ...prev]);
        appendAuditLog(
          "Watchdog Flagged Profile Update",
          sub.sourceName,
          report
        );
        return {
          status: "flagged_to_admin",
          message:
            "AI Watchdog-in thu inkalh a hmu a, Admin Enmek turin a thawn ta (record hlui a la him).",
        };
      }

      const snapshotBeforeKb = deepClone(kb);
      applyPersonUpdate(updated);

      const sub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        submittedAt: Date.now(),
        submittedByRole: userRole,
        submitterName: actorDisplayName,
        submissionType: "person_entry",
        sourceName: `Profile Update: ${updated.fullName}`,
        summary: `Updated ${updated.fullName} (${updated.clan})`,
        auditReportMizoEnglish: report,
        overallSeverity: severity,
        flags,
        status: "approved",
        personPatch: updated,
        snapshotBeforeKb,
        reviewedAt: Date.now(),
      };
      setSubmissions((prev) => [sub, ...prev]);
      appendAuditLog("Person Profile Updated", sub.sourceName, sub.summary, {
        updated: 1,
      });
      return {
        status: "approved",
        message: "Pawm Tawh — Mimal chanchin siamthat a ni.",
      };
    },
    [actorDisplayName, appendAuditLog, applyPersonUpdate, kb, userRole]
  );

  const handleModalPersonUpdate = useCallback(
    async (updated: PersonNode) => {
      if (userRole === "reader") return;
      if (userRole === "admin") {
        const res = handleSubmitPersonUpdate(updated);
        setModalNotice(res.message);
        return;
      }
      setModalNotice("AI Watchdog-in a endik mek...");
      const makeOfflineAudit = (): WatchdogAuditResult => ({
        overallSeverity: "minor_discrepancy",
        flags: [
          {
            category: "historical_conflict",
            severity: "minor_discrepancy",
            targetName: updated.fullName,
            summaryMizoEnglish: "Offline / Unverified Watchdog — Admin Review Required",
            detail:
              "Internet awm loh avang emaw Watchdog server biak theih loh avangin AI-in a endik thei rih lo. Admin-in a en hma chu core database khawih phal a ni lo.",
          },
        ],
        auditReportMizoEnglish:
          "Offline submission queued for Admin Alert Inbox.",
      });
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const outcome = handleSubmitPersonUpdate(updated, makeOfflineAudit());
        setModalNotice(outcome.message);
        return;
      }
      try {
        const parent = kb.people.find((p) => updated.parentIds.includes(p.id));
        const existingContext = parent
          ? `Parent: ${parent.fullName} (DOB: ${parent.birthDate || "?"}, Blood: ${parent.bloodGroup}, Clan: ${parent.clan})`
          : "";
        const res = await fetch("/api/watchdog/audit-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionType: "person_entry",
            titleOrName: updated.fullName,
            contentOrDetails: JSON.stringify({
              fullName: updated.fullName,
              clan: updated.clan,
              villages: updated.villages,
              birthDate: updated.birthDate,
              deathDate: updated.deathDate,
              bloodGroup: updated.bloodGroup,
              healthHistory: updated.healthHistory,
              biography: updated.biography,
            }),
            existingContext,
          }),
        });
        const auditResult = res.ok
          ? ((await res.json()) as WatchdogAuditResult)
          : makeOfflineAudit();
        const outcome = handleSubmitPersonUpdate(updated, auditResult);
        setModalNotice(outcome.message);
      } catch {
        const outcome = handleSubmitPersonUpdate(updated, makeOfflineAudit());
        setModalNotice(outcome.message);
      }
    },
    [handleSubmitPersonUpdate, kb.people, userRole]
  );

  const handleSubmitIngestPayload = useCallback(
    (
      payload: ExtractedIngestPayload,
      sourceName: string,
      forceAdminApprove = false
    ) => {
      const hasDiscrepancies =
        payload.overallSeverity !== "clean" ||
        payload.flags.length > 0 ||
        payload.conflicts.length > 0;

      const shouldHoldForAdmin =
        !forceAdminApprove &&
        (userRole !== "admin" ? hasDiscrepancies : false);

      // Even for Admin, if they click "Submit with Watchdog", only auto-merge if clean or Admin explicitly forces it.
      if (shouldHoldForAdmin) {
        const sub: SubmissionRecord = {
          id: `sub-${Date.now()}`,
          submittedAt: Date.now(),
          submittedByRole: userRole,
          submitterName: actorDisplayName,
          submissionType: "document_upload",
          sourceName,
          summary: payload.processingSummary,
          auditReportMizoEnglish: payload.auditReportMizoEnglish,
          overallSeverity: payload.overallSeverity,
          flags: payload.flags,
          status: "flagged_to_admin",
          extractedPayload: payload,
        };
        setSubmissions((prev) => [sub, ...prev]);
        appendAuditLog(
          "Watchdog Escalated Upload to Admin",
          sourceName,
          payload.auditReportMizoEnglish,
          { conflicts: payload.conflicts.length }
        );
        return {
          status: "flagged_to_admin" as const,
          addedCount: 0,
          updatedCount: 0,
          conflictsCount: payload.conflicts.length + payload.flags.length,
        };
      }

      const snapshotBeforeKb = deepClone(kb);
      const { nextKb, addedCount, updatedCount, newConflicts } =
        mergeExtractedIntoKnowledgeBase(kb, payload, sourceName);

      setKb(nextKb);
      if (newConflicts.length > 0) {
        setConflicts((prev) => dedupeConflicts(prev, newConflicts));
      }

      const sub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        submittedAt: Date.now(),
        submittedByRole: userRole,
        submitterName: actorDisplayName,
        submissionType: "document_upload",
        sourceName,
        summary: payload.processingSummary,
        auditReportMizoEnglish: payload.auditReportMizoEnglish,
        overallSeverity: payload.overallSeverity,
        flags: payload.flags,
        status: "approved",
        extractedPayload: payload,
        snapshotBeforeKb,
        reviewedAt: Date.now(),
      };
      setSubmissions((prev) => [sub, ...prev]);

      appendAuditLog(
        "AI Multimodal Extraction Merge",
        sourceName,
        payload.processingSummary,
        {
          added: addedCount,
          updated: updatedCount,
          conflicts: newConflicts.length,
        }
      );

      return {
        status: "approved" as const,
        addedCount,
        updatedCount,
        conflictsCount: newConflicts.length,
      };
    },
    [actorDisplayName, appendAuditLog, kb, userRole]
  );

  // --- Admin Moderation Handlers ---

  const handleApproveSubmission = useCallback(
    (submissionId: string, editedNotes?: string) => {
      if (userRole !== "admin") return;
      const target = submissions.find((s) => s.id === submissionId);
      if (!target) return;

      let snapshotBeforeKb: DnaKnowledgeBase | undefined;
      let snapshotBeforeBooks: BookProject[] | undefined;
      let added = 0;
      let updated = 0;
      let conflictsCount = 0;

      if (target.submissionType === "document_upload" && target.extractedPayload) {
        snapshotBeforeKb = deepClone(kb);
        const merged = mergeExtractedIntoKnowledgeBase(
          kb,
          target.extractedPayload,
          target.sourceName
        );
        setKb(merged.nextKb);
        if (merged.newConflicts.length > 0) {
          setConflicts((prev) => dedupeConflicts(prev, merged.newConflicts));
        }
        added = merged.addedCount;
        updated = merged.updatedCount;
        conflictsCount = merged.newConflicts.length;
      } else if (
        target.submissionType === "chapter_edit" &&
        target.chapterPatch
      ) {
        snapshotBeforeBooks = deepClone(books);
        applyChapterContentChange(
          target.chapterPatch.bookId,
          target.chapterPatch.chapterId,
          target.chapterPatch.proposedContent,
          `Admin Approved (${target.submitterName})`
        );
        updated = 1;
      } else if (
        target.submissionType === "person_entry" &&
        target.personPatch
      ) {
        snapshotBeforeKb = deepClone(kb);
        const exists = kb.people.some((p) => p.id === target.personPatch!.id);
        if (exists) {
          applyPersonUpdate(target.personPatch);
          updated = 1;
        } else {
          applyPersonAdd(target.personPatch);
          added = 1;
        }
      }

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: "approved",
                adminNotes: editedNotes || s.adminNotes || "Approved by Admin",
                reviewedAt: Date.now(),
                snapshotBeforeKb,
                snapshotBeforeBooks,
              }
            : s
        )
      );

      appendAuditLog(
        "Admin Approved Submission",
        target.sourceName,
        `Approved submission from ${target.submitterName}${
          editedNotes ? ` — ${editedNotes}` : ""
        }`,
        { added, updated, conflicts: conflictsCount }
      );
    },
    [
      appendAuditLog,
      applyChapterContentChange,
      applyPersonAdd,
      applyPersonUpdate,
      books,
      kb,
      submissions,
      userRole,
    ]
  );

  const handleEditAndApproveChapterSubmission = useCallback(
    (submissionId: string, editedContent: string, adminNote: string) => {
      if (userRole !== "admin") return;
      const target = submissions.find((s) => s.id === submissionId);
      if (!target || !target.chapterPatch) return;

      const snapshotBeforeBooks = deepClone(books);
      applyChapterContentChange(
        target.chapterPatch.bookId,
        target.chapterPatch.chapterId,
        editedContent,
        `Admin Edited & Approved (${target.submitterName})`
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: "approved",
                adminNotes: adminNote || "Edited & Approved by Admin",
                reviewedAt: Date.now(),
                snapshotBeforeBooks,
                chapterPatch: s.chapterPatch
                  ? { ...s.chapterPatch, proposedContent: editedContent }
                  : undefined,
              }
            : s
        )
      );

      appendAuditLog(
        "Admin Edited & Approved Chapter",
        target.sourceName,
        adminNote || `Edited & approved ${target.submitterName}'s revision`,
        { updated: 1 }
      );
    },
    [appendAuditLog, applyChapterContentChange, books, submissions, userRole]
  );

  const handleRejectSubmission = useCallback(
    (submissionId: string, reason: string) => {
      if (userRole !== "admin") return;
      const target = submissions.find((s) => s.id === submissionId);
      if (!target) return;

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: "rejected",
                adminNotes: reason,
                reviewedAt: Date.now(),
              }
            : s
        )
      );

      appendAuditLog(
        "Admin Rejected Submission",
        target.sourceName,
        `Rejected (${target.submitterName}): ${reason}`
      );
    },
    [appendAuditLog, submissions, userRole]
  );

  const handleRollbackSubmission = useCallback(
    (submissionId: string) => {
      if (userRole !== "admin") return;
      const target = submissions.find((s) => s.id === submissionId);
      if (!target || target.rolledBack) return;

      if (target.snapshotBeforeKb) {
        setKb(target.snapshotBeforeKb);
      }
      if (target.snapshotBeforeBooks) {
        setBooks(target.snapshotBeforeBooks);
      }

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                status: "rejected",
                rolledBack: true,
                adminNotes: `${
                  s.adminNotes ? `${s.adminNotes} · ` : ""
                }Rolled back by Admin`,
                reviewedAt: Date.now(),
              }
            : s
        )
      );

      appendAuditLog(
        "Admin Rolled Back Submission",
        target.sourceName,
        `Restored snapshot prior to "${target.sourceName}"`
      );
    },
    [appendAuditLog, submissions, userRole]
  );

  const handleResolveConflict = useCallback(
    (
      conflictId: string,
      resolution: "accepted_incoming" | "kept_existing" | "merged_both"
    ) => {
      if (userRole !== "admin") return;
      const targetConflict = conflicts.find((c) => c.id === conflictId);
      if (!targetConflict) return;

      if (
        resolution === "accepted_incoming" &&
        targetConflict.targetNodeId
      ) {
        setKb((prev) => ({
          ...prev,
          people: prev.people.map((p) => {
            if (p.id !== targetConflict.targetNodeId) return p;
            const fieldLower = targetConflict.field.toLowerCase();
            if (fieldLower.includes("birth") || fieldLower.includes("dob")) {
              return { ...p, birthDate: targetConflict.incomingValue };
            }
            if (fieldLower.includes("death") || fieldLower.includes("dod")) {
              return { ...p, deathDate: targetConflict.incomingValue };
            }
            if (fieldLower.includes("blood")) {
              return {
                ...p,
                bloodGroup: targetConflict.incomingValue as PersonNode["bloodGroup"],
              };
            }
            if (fieldLower.includes("clan")) {
              return { ...p, clan: targetConflict.incomingValue };
            }
            return p;
          }),
        }));
      }

      setConflicts((prev) =>
        prev.map((c) =>
          c.id === conflictId ? { ...c, status: resolution } : c
        )
      );
      appendAuditLog(
        "Conflict Resolved",
        targetConflict.incomingSource,
        `${targetConflict.targetName} (${targetConflict.field}) -> ${resolution}`,
        { updated: 1 }
      );
    },
    [appendAuditLog, conflicts, userRole]
  );

  const handleExportFullDatabase = useCallback(() => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        books,
        kb,
        conflicts,
        submissions,
        auditLogs,
      },
      null,
      2
    );
  }, [books, kb, conflicts, submissions, auditLogs]);

  const handleImportFullBackup = useCallback(
    (jsonString: string) => {
      if (userRole !== "admin") return;
      const parsed = JSON.parse(jsonString) as {
        books?: BookProject[];
        kb?: DnaKnowledgeBase;
        conflicts?: ConflictItem[];
        submissions?: SubmissionRecord[];
        auditLogs?: AuditLogEntry[];
      };
      if (parsed.books && Array.isArray(parsed.books)) {
        setBooks(parsed.books);
      }
      if (parsed.kb && Array.isArray(parsed.kb.people)) {
        setKb(parsed.kb);
      }
      if (parsed.conflicts && Array.isArray(parsed.conflicts)) {
        setConflicts(parsed.conflicts);
      }
      if (parsed.submissions && Array.isArray(parsed.submissions)) {
        setSubmissions(parsed.submissions);
      }
      if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) {
        setAuditLogs(parsed.auditLogs);
      }
      appendAuditLog(
        "Database Backup Imported",
        "JSON Backup",
        "Restored master studio backup"
      );
    },
    [appendAuditLog, userRole]
  );

  const handlePrintBook = useCallback(() => {
    window.print();
  }, []);

  const pendingFlaggedCount = submissions.filter(
    (s) => s.status === "flagged_to_admin"
  ).length;
  const pendingConflictCount = conflicts.filter(
    (c) => c.status === "pending"
  ).length;
  const totalAdminAlertCount = pendingFlaggedCount + pendingConflictCount;
  const myContributorCount = submissions.filter(
    (s) => s.submittedByRole === "contributor"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-ink)]">
      {/* Strict 3-Zone Top Bar Contract (Mobile-First Responsive) */}
      <header className="no-print border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6 shrink-0">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView("manuscript");
          }}
          className="font-display text-base sm:text-xl font-bold tracking-tight text-[var(--text-ink)] whitespace-nowrap shrink-0"
        >
          Zofate DNA &amp; Sulhnu
        </a>

        {/* Zone 2: Concise single-line RBAC navigation tabs (Desktop/Tablet; Mobile uses MobileBottomNav) */}
        <nav
          aria-label="Studio modules"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-medium overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveView("manuscript")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeView === "manuscript"
                ? "border-[var(--accent-ink)] text-[var(--text-ink)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            }`}
          >
            {userRole === "reader" ? "Lehkhabu Chhiarna" : "Lehkhabu Ziahna"}
          </button>
          <button
            type="button"
            onClick={() => setActiveView("dna")}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeView === "dna"
                ? "border-[var(--accent-ink)] text-[var(--text-ink)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
            }`}
          >
            {userRole === "reader"
              ? "DNA Chain Explorer"
              : "DNA Chain & Chhuizuina"}
          </button>

          {userRole !== "reader" && (
            <button
              type="button"
              onClick={() => setActiveView("upload")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === "upload"
                  ? "border-[var(--accent-ink)] text-[var(--text-ink)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Data &amp; Thlalak Upload
            </button>
          )}

          {userRole === "admin" && (
            <button
              type="button"
              onClick={() => setActiveView("admin")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 tabular-nums ${
                activeView === "admin"
                  ? "border-[var(--accent-ink)] text-[var(--text-ink)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Admin Moderation
              {totalAdminAlertCount > 0 ? ` (${totalAdminAlertCount})` : ""}
            </button>
          )}

          {userRole === "contributor" && (
            <button
              type="button"
              onClick={() => setActiveView("submissions")}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 tabular-nums ${
                activeView === "submissions"
                  ? "border-[var(--accent-ink)] text-[var(--text-ink)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Ka Thil Thawn Te
              {myContributorCount > 0 ? ` (${myContributorCount})` : ""}
            </button>
          )}
        </nav>

        {/* Zone 3: PWA Install + Role Switcher + Primary Print Action */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton variant="header" />

          <button
            type="button"
            onClick={() => setShowRolePortal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:border-[var(--text-muted)] text-[var(--text-ink)] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
            <span>{ROLE_LABELS[userRole]}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintBook}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </header>

      {/* Dismissible PWA Install Banner when browser exposes beforeinstallprompt or iOS */}
      <PWAInstallButton variant="banner" />

      {/* Main Studio Body */}
      <main className="no-print flex-1 flex flex-col min-h-0 pb-16 md:pb-0">
        {activeView === "manuscript" && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {sidebarOpen && canvasMode !== "focus" && (
              <ChapterSidebar
                books={books}
                activeBook={activeBook}
                activeChapterId={activeChapter.id}
                generatingChapterId={generatingChapterId}
                readOnly={userRole === "reader"}
                onSelectBook={(id) => {
                  setActiveBookId(id);
                  setActiveChapterId(1);
                }}
                onCreateStoryBook={handleCreateStoryBook}
                onAddChapterToStoryBook={handleAddChapterToStoryBook}
                onSelectChapter={setActiveChapterId}
              />
            )}
            <ManuscriptWorkspace
              book={activeBook}
              chapter={activeChapter}
              kb={kb}
              glossary={bookGlossary}
              userRole={userRole}
              canvasMode={canvasMode}
              readingTheme={readingTheme}
              includeObscureDetails={includeObscureDetails}
              isGenerating={generatingChapterId === activeChapter.id}
              generationMode={
                generatingChapterId === activeChapter.id ? generationMode : null
              }
              generationError={generationError}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              onChangeCanvasMode={setCanvasMode}
              onChangeReadingTheme={setReadingTheme}
              onToggleObscureDetails={() =>
                setIncludeObscureDetails((prev) => !prev)
              }
              onUpdateContent={handleUpdateContent}
              onUpdateCustomFocus={handleUpdateCustomFocus}
              onSaveNewRevision={handleSaveNewRevision}
              onSwitchRevision={handleSwitchRevision}
              onSubmitChapterForAudit={handleSubmitChapterForAudit}
              onGenerateChapter={handleGenerateChapter}
              onStopGeneration={handleStopGeneration}
              onSelectChapter={setActiveChapterId}
              onInspectEntity={handleInspectEntity}
            />
          </div>
        )}

        {activeView === "dna" && (
          <DnaChainStudio
            kb={kb}
            userRole={userRole}
            selectedPersonId={selectedDnaPersonId}
            privacyLocked={effectivePrivacyLocked}
            onTogglePrivacyLock={() => {
              if (userRole === "admin") {
                setPrivacyLocked((p) => !p);
              }
            }}
            onSelectPerson={setSelectedDnaPersonId}
            onSubmitPersonUpdate={handleSubmitPersonUpdate}
            onSubmitNewPerson={handleSubmitNewPerson}
          />
        )}

        {activeView === "upload" && userRole !== "reader" && (
          <DocumentUploadStudio
            kb={kb}
            userRole={userRole}
            onSubmitIngestPayload={handleSubmitIngestPayload}
            onNavigateToAuditOrSubmissions={() =>
              setActiveView(userRole === "admin" ? "admin" : "submissions")
            }
          />
        )}

        {activeView === "admin" && userRole === "admin" && (
          <AdminModerationDashboard
            submissions={submissions}
            conflicts={conflicts}
            auditLogs={auditLogs}
            privacyLocked={privacyLocked}
            readerMaskMedical={readerMaskMedical}
            activeBook={activeBook}
            glossary={bookGlossary}
            kb={kb}
            onTogglePrivacyLock={() => setPrivacyLocked((p) => !p)}
            onToggleReaderMaskMedical={() => setReaderMaskMedical((m) => !m)}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onRollbackSubmission={handleRollbackSubmission}
            onEditAndApproveChapterSubmission={
              handleEditAndApproveChapterSubmission
            }
            onResolveConflict={handleResolveConflict}
            onImportFullBackup={handleImportFullBackup}
            onExportFullDatabase={handleExportFullDatabase}
            onPrintBook={handlePrintBook}
          />
        )}

        {activeView === "submissions" && userRole === "contributor" && (
          <ContributorSubmissionsView
            contributorName={contributorName}
            submissions={submissions}
          />
        )}
      </main>

      {/* Role Switcher / Login Portal Modal */}
      {showRolePortal && (
        <RolePortalModal
          currentRole={userRole}
          contributorName={contributorName}
          onSelectRole={handleSelectRole}
          onClose={() => setShowRolePortal(false)}
        />
      )}

      {/* Inline Clickable Entity -> DNA Profile Dossier Modal */}
      {modalPerson && (
        <div className="contents">
          <PersonDossierPanel
            isModal
            person={modalPerson}
            allPeople={kb.people}
            privacyLocked={effectivePrivacyLocked}
            readOnly={userRole === "reader"}
            canUnlockPrivacy={userRole === "admin"}
            onTogglePrivacyLock={() => {
              if (userRole === "admin") {
                setPrivacyLocked((p) => !p);
              }
            }}
            onUpdatePerson={handleModalPersonUpdate}
            onSelectPerson={(id) => {
              setModalNotice(null);
              setModalPersonId(id);
            }}
            onOpenInGraph={(id) => {
              setSelectedDnaPersonId(id);
              setModalPersonId(null);
              setModalNotice(null);
              setActiveView("dna");
            }}
            onClose={() => {
              setModalNotice(null);
              setModalPersonId(null);
            }}
          />
          {modalNotice && (
            <div className="fixed bottom-5 right-5 z-[60] max-w-md px-4 py-3 text-xs border border-[var(--accent-ink)] bg-[var(--bg-elevated)] text-[var(--text-ink)] rounded shadow-lg">
              {modalNotice}
            </div>
          )}
        </div>
      )}

      {/* Mobile Collapsible Bottom Navigation Bar */}
      <MobileBottomNav
        userRole={userRole}
        activeView={activeView}
        adminAlertCount={totalAdminAlertCount}
        contributorCount={myContributorCount}
        onSelectView={setActiveView}
      />

      {/* Offline / Online Status Banner */}
      <OfflineIndicator />

      {/* Dedicated Full-Book Print Layout */}
      <PrintableBookDocument book={activeBook} glossary={bookGlossary} />
    </div>
  );
}
