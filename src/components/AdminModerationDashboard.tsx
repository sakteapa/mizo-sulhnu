import React, { useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Download,
  Edit3,
  Lock,
  Printer,
  RotateCcw,
  ShieldCheck,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import type {
  AuditLogEntry,
  BookProject,
  ConflictItem,
  DnaKnowledgeBase,
  GlossaryEntry,
  SubmissionRecord,
} from "../types/book";
import {
  buildFullBookMarkdown,
  buildFullBookPlainText,
  downloadTextFile,
} from "../utils/exportBook";
import { SeverityTag, SubmissionStatusTag } from "./SeverityAndStatusTag";

interface AdminModerationDashboardProps {
  submissions: SubmissionRecord[];
  conflicts: ConflictItem[];
  auditLogs: AuditLogEntry[];
  privacyLocked: boolean;
  readerMaskMedical: boolean;
  activeBook: BookProject;
  glossary: GlossaryEntry[];
  kb: DnaKnowledgeBase;
  onTogglePrivacyLock: () => void;
  onToggleReaderMaskMedical: () => void;
  onApproveSubmission: (submissionId: string, editedNotes?: string) => void;
  onRejectSubmission: (submissionId: string, reason: string) => void;
  onRollbackSubmission: (submissionId: string) => void;
  onEditAndApproveChapterSubmission: (
    submissionId: string,
    editedContent: string,
    adminNote: string
  ) => void;
  onResolveConflict: (
    conflictId: string,
    resolution: "accepted_incoming" | "kept_existing" | "merged_both"
  ) => void;
  onImportFullBackup: (jsonString: string) => void;
  onExportFullDatabase: () => string;
  onPrintBook: () => void;
}

export const AdminModerationDashboard: React.FC<
  AdminModerationDashboardProps
> = ({
  submissions,
  conflicts,
  auditLogs,
  privacyLocked,
  readerMaskMedical,
  activeBook,
  glossary,
  kb,
  onTogglePrivacyLock,
  onToggleReaderMaskMedical,
  onApproveSubmission,
  onRejectSubmission,
  onRollbackSubmission,
  onEditAndApproveChapterSubmission,
  onResolveConflict,
  onImportFullBackup,
  onExportFullDatabase,
  onPrintBook,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [adminNotesMap, setAdminNotesMap] = useState<Record<string, string>>(
    {}
  );
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editedChapterDraft, setEditedChapterDraft] = useState("");

  const flaggedSubmissions = submissions.filter(
    (s) => s.status === "flagged_to_admin"
  );
  const historySubmissions = submissions.filter(
    (s) => s.status !== "flagged_to_admin"
  );
  const pendingConflicts = conflicts.filter((c) => c.status === "pending");

  const handleDownloadDbJson = () => {
    const json = onExportFullDatabase();
    downloadTextFile(
      "Zofate_DNA_Chain_Master_Database.json",
      json,
      "application/json;charset=utf-8"
    );
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImportFullBackup(String(reader.result || ""));
        setBackupMessage("Database backup hlawhtling taka lak luh a ni.");
      } catch (err) {
        setBackupMessage(
          err instanceof Error ? err.message : "Invalid backup JSON file."
        );
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBookMd = () => {
    const content = buildFullBookMarkdown(
      activeBook.chapters,
      glossary,
      activeBook.title,
      activeBook.subtitle
    );
    downloadTextFile(
      `${activeBook.title.replace(/\s+/g, "_")}.md`,
      content,
      "text/markdown;charset=utf-8"
    );
  };

  const handleDownloadBookTxt = () => {
    const content = buildFullBookPlainText(
      activeBook.chapters,
      glossary,
      activeBook.title,
      activeBook.subtitle
    );
    downloadTextFile(
      `${activeBook.title.replace(/\s+/g, "_")}.txt`,
      content,
      "text/plain;charset=utf-8"
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            Admin (Enkawltu Ber) · Moderation &amp; AI Audit Dashboard
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-ink)]">
            Admin Alert Inbox &amp; System Integrity
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)] tabular-nums">
            {flaggedSubmissions.length} Flagged Alerts ·{" "}
            {pendingConflicts.length} Conflicts · {kb.people.length} People ·{" "}
            {kb.clans.length} Clans · {kb.villages.length} Villages ·{" "}
            {kb.events?.length || 0} Events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleReaderMaskMedical}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border rounded-md transition-colors whitespace-nowrap shrink-0 ${
              readerMaskMedical
                ? "border-[var(--accent-ink)] bg-[var(--accent-subtle)] text-[var(--accent-ink)]"
                : "border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)]"
            }`}
          >
            {readerMaskMedical ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
            <span>
              Reader Medical Mask: {readerMaskMedical ? "ON" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            onClick={onTogglePrivacyLock}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            {privacyLocked ? (
              <Lock className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
            <span>Admin Lock: {privacyLocked ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* 1. AI Integrity Watchdog Alert Inbox */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--accent-ink)]" />
          <h2 className="font-display text-2xl font-semibold text-[var(--text-ink)]">
            Admin Alert Inbox ({flaggedSubmissions.length})
          </h2>
        </div>

        {flaggedSubmissions.length === 0 ? (
          <div className="p-6 border border-dashed border-[var(--border-hairline)] rounded-md text-sm text-[var(--text-muted)]">
            AI Integrity Watchdog-in a man chhuah thu inkalh leh thil felhlel (flagged submissions) en ngai a awm rih lo.
          </div>
        ) : (
          <div className="space-y-5">
            {flaggedSubmissions.map((sub) => {
              const isEditingChapter =
                editingSubId === sub.id && sub.chapterPatch;
              return (
                <article
                  key={sub.id}
                  className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-[var(--border-hairline)]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-xl font-semibold text-[var(--text-ink)]">
                          {sub.sourceName}
                        </h3>
                        <SeverityTag severity={sub.overallSeverity} />
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)] tabular-nums">
                        Submitted by <strong>{sub.submitterName}</strong> (
                        {sub.submittedByRole}) · Type: {sub.submissionType} ·{" "}
                        {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <SubmissionStatusTag status={sub.status} />
                  </div>

                  {/* AI Watchdog Bilingual Report */}
                  <div className="p-4 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded space-y-2">
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
                      AI Watchdog Audit Report (Mizo &amp; English)
                    </p>
                    <p className="font-book text-sm leading-relaxed text-[var(--text-ink)]">
                      {sub.auditReportMizoEnglish}
                    </p>
                  </div>

                  {/* Itemized Anomaly Flags */}
                  {sub.flags.length > 0 && (
                    <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                      {sub.flags.map((flag, idx) => (
                        <div key={idx} className="py-2.5 text-xs space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[var(--text-ink)]">
                              {flag.targetName}
                            </span>
                            <span className="font-code text-[var(--text-muted)]">
                              ({flag.category})
                            </span>
                            <SeverityTag severity={flag.severity} />
                          </div>
                          <p className="text-[var(--text-ink)]">
                            {flag.summaryMizoEnglish}
                          </p>
                          <p className="text-[var(--text-muted)]">
                            {flag.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Chapter Edit Preview if chapter_edit */}
                  {isEditingChapter && sub.chapterPatch && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-[var(--text-muted)]">
                        Admin Direct Edit Before Approving ({sub.chapterPatch.chapterTitle})
                      </label>
                      <textarea
                        rows={10}
                        value={editedChapterDraft}
                        onChange={(e) => setEditedChapterDraft(e.target.value)}
                        className="w-full p-3 text-sm font-book bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                      />
                    </div>
                  )}

                  {/* Admin Decision Bar */}
                  <div className="pt-2 space-y-3">
                    <input
                      type="text"
                      value={adminNotesMap[sub.id] || ""}
                      onChange={(e) =>
                        setAdminNotesMap((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="Admin Review Note (pawm chhan emaw siamthat ngaihna)..."
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                    />

                    <div className="flex flex-wrap items-center gap-2.5">
                      {isEditingChapter ? (
                        <button
                          type="button"
                          onClick={() => {
                            onEditAndApproveChapterSubmission(
                              sub.id,
                              editedChapterDraft,
                              adminNotesMap[sub.id] || "Edited & approved by Admin"
                            );
                            setEditingSubId(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Edit &amp; Approve</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onApproveSubmission(sub.id, adminNotesMap[sub.id])
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Pawm &amp; Merge (Approve)</span>
                        </button>
                      )}

                      {sub.chapterPatch && !isEditingChapter && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubId(sub.id);
                            setEditedChapterDraft(
                              sub.chapterPatch?.proposedContent || ""
                            );
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Before Approving</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onRejectSubmission(
                            sub.id,
                            adminNotesMap[sub.id] ||
                              "Rejected by Admin due to integrity discrepancies."
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-rose-700 dark:text-rose-400 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Hnawl (Reject)</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Side-by-Side Field Conflict Resolver */}
      {pendingConflicts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-ink)]" />
            <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
              Field-Level Conflict Resolver ({pendingConflicts.length})
            </h2>
          </div>
          <div className="space-y-4">
            {pendingConflicts.map((c) => (
              <div
                key={c.id}
                className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-[var(--text-ink)]">
                    {c.targetName} —{" "}
                    <span className="text-[var(--accent-ink)]">{c.field}</span>
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    Source: {c.incomingSource}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded text-xs">
                    <p className="font-semibold text-[var(--text-muted)]">
                      Existing
                    </p>
                    <p className="mt-1 text-[var(--text-ink)]">
                      {c.existingValue}
                    </p>
                  </div>
                  <div className="p-3 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded text-xs">
                    <p className="font-semibold text-[var(--accent-ink)]">
                      Incoming
                    </p>
                    <p className="mt-1 text-[var(--text-ink)]">
                      {c.incomingValue}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onResolveConflict(c.id, "accepted_incoming")}
                    className="px-3 py-1.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded"
                  >
                    Accept Incoming
                  </button>
                  <button
                    type="button"
                    onClick={() => onResolveConflict(c.id, "kept_existing")}
                    className="px-3 py-1.5 text-xs border border-[var(--border-hairline)] rounded"
                  >
                    Keep Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => onResolveConflict(c.id, "merged_both")}
                    className="px-3 py-1.5 text-xs border border-[var(--border-hairline)] rounded"
                  >
                    Retain Both
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Approved Submissions & One-Click Rollback */}
      {historySubmissions.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
            Submission History &amp; Rollback Controls
          </h2>
          <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {historySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[var(--text-ink)]">
                      {sub.sourceName}
                    </span>
                    <SubmissionStatusTag status={sub.status} />
                    {sub.rolledBack && (
                      <span className="font-code text-[11px] text-[var(--text-muted)]">
                        [Rolled Back]
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    By {sub.submitterName} · {sub.summary}
                    {sub.adminNotes ? ` · Note: ${sub.adminNotes}` : ""}
                  </p>
                </div>
                {sub.status === "approved" &&
                  !sub.rolledBack &&
                  (sub.snapshotBeforeKb || sub.snapshotBeforeBooks) && (
                    <button
                      type="button"
                      onClick={() => onRollbackSubmission(sub.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:border-[var(--accent-ink)] text-[var(--text-ink)] rounded shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback</span>
                    </button>
                  )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Export & Backup Hub */}
      <section className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4">
        <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
          Database Backup &amp; Book Publishing Export
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadDbJson}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded-md whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup (.json)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleDownloadBookMd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Book (.md)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBookTxt}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Book (.txt)</span>
          </button>

          <button
            type="button"
            onClick={onPrintBook}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
        {backupMessage && (
          <p className="text-xs text-[var(--accent-ink)]">{backupMessage}</p>
        )}
      </section>

      {/* 5. Admin Audit & Change Log */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
          Admin Audit &amp; Change Log
        </h2>
        {auditLogs.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            Change log la awm rih lo.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--text-ink)]">
                    {log.action}{" "}
                    <span className="text-xs font-normal text-[var(--text-muted)]">
                      · {log.actorName} ({log.actorRole}) · {log.sourceName}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {log.summary}
                  </p>
                </div>
                <span className="font-code text-[11px] text-[var(--text-muted)] tabular-nums shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
