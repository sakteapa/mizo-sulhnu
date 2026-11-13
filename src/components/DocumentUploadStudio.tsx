import React, { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import type {
  DnaKnowledgeBase,
  ExtractedIngestPayload,
  UserRole,
} from "../types/book";
import { SeverityTag } from "./SeverityAndStatusTag";
import { VerificationTag } from "./VerificationTag";

interface DocumentUploadStudioProps {
  kb: DnaKnowledgeBase;
  userRole: UserRole;
  onSubmitIngestPayload: (
    payload: ExtractedIngestPayload,
    sourceName: string,
    forceAdminApprove?: boolean
  ) => {
    status: "approved" | "flagged_to_admin";
    addedCount: number;
    updatedCount: number;
    conflictsCount: number;
  };
  onNavigateToAuditOrSubmissions: () => void;
}

type ExtractionMode = "auto" | "mizo_history" | "english_colonial";

export const DocumentUploadStudio: React.FC<DocumentUploadStudioProps> = ({
  kb,
  userRole,
  onSubmitIngestPayload,
  onNavigateToAuditOrSubmissions,
}) => {
  const [sourceName, setSourceName] = useState("Church Jubilee / Family Record");
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>("auto");
  const [batchSectionInstruction, setBatchSectionInstruction] = useState("");
  const [rawText, setRawText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>("image/jpeg");
  const [uploadedPdfMeta, setUploadedPdfMeta] = useState<{
    name: string;
    sizeKb: number;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedIngestPayload | null>(
    null
  );
  const [submitResult, setSubmitResult] = useState<{
    status: "approved" | "flagged_to_admin";
    addedCount: number;
    updatedCount: number;
    conflictsCount: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceName(file.name);
    setSubmitResult(null);
    setError(null);

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (file.type.startsWith("image/") || isPdf) {
      const maxBytes = 18 * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(
          `File a lian lutuk (${Math.round(
            file.size / (1024 * 1024)
          )} MB). Khawngaihin 18 MB hnuai lam PDF/thlalak hmang rawh (or paste chapter text).`
        );
        return;
      }

      const mime = isPdf ? "application/pdf" : file.type;
      setFileMimeType(mime);
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        const commaIdx = result.indexOf(",");
        const base64 = commaIdx >= 0 ? result.slice(commaIdx + 1) : result;
        setFileBase64(base64);
        if (isPdf) {
          setImageDataUrl(null);
          setUploadedPdfMeta({
            name: file.name,
            sizeKb: Math.max(1, Math.round(file.size / 1024)),
          });
        } else {
          setUploadedPdfMeta(null);
          setImageDataUrl(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImageDataUrl(null);
      setUploadedPdfMeta(null);
      setFileBase64(null);
      const reader = new FileReader();
      reader.onload = () => {
        setRawText(String(reader.result || ""));
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!rawText.trim() && !fileBase64) {
      setError("PDF, thlalak upload emaw thu ziak lut hmasa rawh.");
      return;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError(
        "Internet a awm rih lo (Offline Mode). AI PDF/OCR analysis hman turin internet connect phawt la; offline-ah erawh data leh lehkhabu awm sa i chhiar thei reng."
      );
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/ingest/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          sourceName,
          extractionMode,
          batchSectionInstruction: batchSectionInstruction.trim() || undefined,
          fileBase64: fileBase64 || undefined,
          fileMimeType,
          existingPeopleSummary: kb.people.map((p) => ({
            fullName: p.fullName,
            aliases: p.aliases,
            clan: p.clan,
            birthDate: p.birthDate,
            deathDate: p.deathDate,
            bloodGroup: p.bloodGroup,
            villages: p.villages,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze document.");
      }

      setExtracted(data as ExtractedIngestPayload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze document."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFlagged =
    extracted &&
    (extracted.overallSeverity !== "clean" ||
      extracted.flags.length > 0 ||
      extracted.conflicts.length > 0);

  const handleConfirmSubmit = (forceAdminApprove = false) => {
    if (!extracted) return;
    const outcome = onSubmitIngestPayload(
      extracted,
      sourceName,
      forceAdminApprove
    );
    setSubmitResult(outcome);
  };

  const clearBinaryUploads = () => {
    setImageDataUrl(null);
    setUploadedPdfMeta(null);
    setFileBase64(null);
    setExtracted(null);
    setSubmitResult(null);
    setError(null);
  };

  const loadSampleJubileeText = () => {
    clearBinaryUploads();
    setExtractionMode("auto");
    setSourceName("Champhai Kohhran Jubilee Souvenir (Clean Sample)");
    setRawText(
      `Pu Lalchhuanawma Sailo (B. 1938-06-12, Champhai - D. 2011-11-04, Blood Group: O+) leh a nupui Pi Rohlupuii Ralte (B. 1942-09-20, Blood: A+) te fapa thar Pu Vanlalruata Sailo (B. 1975-08-03, Champhai, Blood Group: A+, Health: Asthma, Thlah kal chhawng chi ni lo).
Pu Vanlalruata Sailo hian kum 2002-ah Lunglei lamah hna avangin a pem a, Pi Lalnunmawii Fanai (B. 1979-01-14, Lunglei, Blood: O+) nen an innei a, fanu Zonunsangi Sailo (B. 2005-11-22, Blood: O+) an nei.`
    );
  };

  const loadSampleMizoChanchin = () => {
    clearBinaryUploads();
    setExtractionMode("mizo_history");
    setSourceName("Mizo Chanchin — Rev. Liangkhaia (Archival Excerpt)");
    setRawText(
      `Hmanlaiin Zofate thlahtu bul chu Chhinlung aṭanga chhuakin Khawpui leh Tiau lui kamah an pem zel a. Seipui khuaah Hnamte hovin Zahmuaka chu lal atan an sawm a; Zahmuaka leh a nupui Pi Lawivari fapate — Zadenga, Paliana, Thangluaha, Rivunga, Rokhuma leh Thangura — aṭangin Lusei lal hnam parukte an lo chhuak. Thangura fapa Sailova thlah Lallula chuan c. 1780-ah Zopui khuaah Thlanrawn ralho a rawt. Kum 1862-ah Mautam tam rapthlak a thleng a, kum 1881 leh 1929-ah Thingtam a thleng bawk.`
    );
  };

  const loadSampleColonialEnglish = () => {
    clearBinaryUploads();
    setExtractionMode("english_colonial");
    setSourceName("Mizoram State Archives — South Lushai & Colonial Despatch (1871–1898)");
    setRawText(
      `Political Report on South Lushai Hills (1888–1895): Following the raid at Alexandrapur in January 1871, the Thangluah chief Rutton Poia (Demagiri) assisted Capt. T.H. Lewin in negotiating the release of Mary Winchester. In Eastern Lushai territory, Vanolel's successor and the western chief Sookpilal concluded early frontier sanads. In February 1888, Lt. John Fraser Stewart's survey party was ambushed near the Lungleh frontier by the Pawi (Chinzah) chief Howsatta of Lungtian, succeeded by Dokoola. During the Chin-Lushai Expedition (1889–1890), Brig. Gen. V.W. Tregear established Fort Tregear, while southern chief Jakopa and widow chief Ropuiliani (wife of Vandoolah of Ralvawng) resisted forced labour and house tax until her detention at Chittagong in 1895. Lakher (Mara) boundary settlements near Shiha were later compiled in 1942.`
    );
  };

  const loadSampleAnomalyText = () => {
    clearBinaryUploads();
    setExtractionMode("auto");
    setSourceName("Suspicious / Conflicting Family Note (Watchdog Test)");
    setRawText(
      `Lallula (B. 1955-01-01, British Army General, Blood Group: AB-) leh a fapa Pu Lalchhuanawma Sailo (B. 1938-06-12, Blood Group: O+). Pu Lalchhuanawma fapa Lalrinmawia Sailo hi kum 2010-ah a piang a, a pa aiin a upa zawk bawk.`
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            AI Integrity Watchdog &amp; Multimodal PDF/OCR
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-semibold text-[var(--text-ink)]">
            Data, PDF &amp; Thlalak Upload
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)] max-w-2xl">
            PDF lehkhabu hlui, Colonial archives (1871–1942), Kohhran Jubilee, pianni/thihni certificate, blood card emaw text upload rawh. AI Watchdog-in Mizo tawng dikin a let ang a, history leh timeline a enfiah hnuah database-ah a lut ang.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={loadSampleJubileeText}
            className="px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md whitespace-nowrap shrink-0"
          >
            Clean Sample
          </button>
          <button
            type="button"
            onClick={loadSampleMizoChanchin}
            className="px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md whitespace-nowrap shrink-0"
          >
            Mizo Chanchin Sample
          </button>
          <button
            type="button"
            onClick={loadSampleColonialEnglish}
            className="px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--accent-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            Colonial 1871–1942 Sample
          </button>
          <button
            type="button"
            onClick={loadSampleAnomalyText}
            className="px-3 py-2 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--accent-ink)] hover:border-[var(--accent-ink)] rounded-md whitespace-nowrap shrink-0"
          >
            Watchdog Flag Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              1. PDF / Thlalak / Document Upload
            </label>
            <span className="text-[11px] text-[var(--text-muted)]">
              PDF, PNG, JPG, WEBP, TXT, CSV
            </span>
          </div>

          <label className="flex flex-col items-center justify-center p-6 border border-dashed border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded-md cursor-pointer hover:border-[var(--accent-ink)] transition-colors text-center">
            <Upload className="w-6 h-6 text-[var(--accent-ink)] mb-2" />
            <span className="text-sm font-medium text-[var(--text-ink)]">
              PDF Lehkhabu, Thlalak emaw Document thlang rawh
            </span>
            <span className="text-xs text-[var(--text-muted)] mt-1">
              Mizo Chanchin PDF, State Archives PDF, Jubilee booklet, CSV/TXT (Max 18 MB)
            </span>
            <input
              type="file"
              accept="image/*,application/pdf,.txt,.csv,.json,.md"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {uploadedPdfMeta && (
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border border-[var(--accent-ink)]/40 bg-[var(--accent-subtle)] rounded text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[var(--accent-ink)] shrink-0" />
                <span className="font-medium text-[var(--text-ink)] truncate">
                  {uploadedPdfMeta.name}
                </span>
              </div>
              <span className="font-code text-[var(--text-muted)] shrink-0 tabular-nums">
                PDF · {uploadedPdfMeta.sizeKb} KB
              </span>
            </div>
          )}

          {imageDataUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{sourceName}</span>
              </div>
              <img
                src={imageDataUrl}
                alt="Uploaded document preview"
                className="max-h-56 w-auto border border-[var(--border-hairline)] rounded"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Extraction &amp; Translation Mode
              </label>
              <select
                value={extractionMode}
                onChange={(e) =>
                  setExtractionMode(e.target.value as ExtractionMode)
                }
                className="w-full px-3 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
              >
                <option value="auto">Auto-Detect (Mizo / English)</option>
                <option value="mizo_history">
                  Mizo History (Mizo Chanchin / Genealogy)
                </option>
                <option value="english_colonial">
                  English Colonial (1871–1942) → Literary Mizo
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Source Hming (Record Reference)
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
              Phek / Bung Thlanna (Batch Section Instruction — Optional for Long PDFs)
            </label>
            <input
              type="text"
              value={batchSectionInstruction}
              onChange={(e) => setBatchSectionInstruction(e.target.value)}
              placeholder="Entirnan: Phek 1–30 chauh, Bung 3: Sailo Lalte chanchin chauh, emaw Pages 40–65..."
              className="w-full px-3 py-2 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
            />
          </div>
        </div>

        <div className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--accent-ink)]" />
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              2. Mizo / English Archival Text (Optional if PDF uploaded)
            </label>
          </div>
          <textarea
            rows={10}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Hetah hian chhungkaw chanchin, Mizo Chanchin bung thenkhat, emaw English colonial archive report paste rawh..."
            className="flex-1 w-full p-3.5 text-sm font-book bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded resize-y focus:outline-none focus:border-[var(--accent-ink)]"
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:opacity-50 rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAnalyzing
                ? "AI Watchdog & Translator Endik mek..."
                : "AI Watchdog-in Chhiar La, Mizo-in Zirchiang Rawh"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="px-4 py-3 border border-[var(--accent-ink)]/40 bg-[var(--accent-subtle)] text-sm text-[var(--text-ink)] rounded-md"
        >
          {error}
        </div>
      )}

      {/* AI Watchdog Extraction & Integrity Report */}
      {extracted && (
        <section className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
                  AI Integrity Watchdog Report
                </span>
                <SeverityTag severity={extracted.overallSeverity} />
              </div>
              <p className="font-book text-sm text-[var(--text-ink)]">
                {extracted.auditReportMizoEnglish}
              </p>
              <p className="font-code text-[11px] text-[var(--text-muted)]">
                Extracted: {extracted.people.length} people ·{" "}
                {extracted.clans.length} clans · {extracted.villages.length}{" "}
                villages · {extracted.events?.length || 0} historical events
              </p>
            </div>

            {!submitResult ? (
              <div className="flex flex-wrap gap-2 shrink-0">
                {!isFlagged ? (
                  <button
                    type="button"
                    onClick={() => handleConfirmSubmit(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] rounded-md whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Clean — Merge into Live Database</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirmSubmit(false)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 rounded-md whitespace-nowrap shrink-0"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Flagged — Send to Admin Alert Inbox</span>
                    </button>
                    {userRole === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleConfirmSubmit(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] rounded-md whitespace-nowrap shrink-0"
                      >
                        <span>Admin Override: Approve Now</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onNavigateToAuditOrSubmissions}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border border-[var(--accent-ink)] text-[var(--accent-ink)] rounded-md whitespace-nowrap shrink-0"
              >
                <span>
                  {submitResult.status === "flagged_to_admin"
                    ? "Escalated to Admin Queue — En Rawh"
                    : `Live Merged (+${submitResult.addedCount} / ${submitResult.updatedCount} updated) — Log En`}
                </span>
              </button>
            )}
          </div>

          {/* Itemized Anomaly Flags */}
          {extracted.flags.length > 0 && (
            <div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded-md space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>
                  Auto-Overwrite Blocked: {extracted.flags.length} Discrepancies
                  Detected
                </span>
              </div>
              <div className="divide-y divide-[var(--border-hairline)]">
                {extracted.flags.map((flag, i) => (
                  <div key={i} className="py-2 text-xs space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--text-ink)]">
                        {flag.targetName}
                      </span>
                      <span className="font-code text-[var(--text-muted)]">
                        [{flag.category}]
                      </span>
                      <SeverityTag severity={flag.severity} />
                    </div>
                    <p className="text-[var(--text-ink)]">
                      {flag.summaryMizoEnglish}
                    </p>
                    <p className="text-[var(--text-muted)]">{flag.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted People Summary */}
          {extracted.people.length > 0 && (
            <div className="space-y-2">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Mi Hming Phawrh Chhuahte ({extracted.people.length})
              </p>
              <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                {extracted.people.map((p, idx) => (
                  <div key={idx} className="py-3.5 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-display text-base font-semibold text-[var(--text-ink)]">
                          {p.fullName}
                        </span>
                        {p.aliases && p.aliases.length > 0 && (
                          <span className="font-code text-[11px] text-[var(--accent-ink)]">
                            (Aliases: {p.aliases.join(", ")})
                          </span>
                        )}
                        <span className="text-xs text-[var(--text-muted)]">
                          {p.clan || "Zofate"} · Blood: {p.bloodGroup || "Unknown"}
                          {p.birthDate ? ` · B. ${p.birthDate}` : ""}
                          {p.deathDate ? ` · D. ${p.deathDate}` : ""}
                        </span>
                      </div>
                      <VerificationTag status={p.verification} />
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {p.biography}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Historical Events & Folklore */}
          {extracted.events && extracted.events.length > 0 && (
            <div className="space-y-2">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Thil Thleng &amp; Thawnthu Phawrh Chhuahte (
                {extracted.events.length})
              </p>
              <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                {extracted.events.map((ev, idx) => (
                  <div key={idx} className="py-3 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
                        <span className="font-code text-xs text-[var(--accent-ink)]">
                          {ev.year}
                        </span>
                        <span className="font-display text-sm font-semibold text-[var(--text-ink)]">
                          {ev.title}
                        </span>
                        <span className="font-code text-[10px] uppercase text-[var(--text-muted)]">
                          [{ev.isFolklore ? "Folklore" : ev.category || "History"}]
                        </span>
                      </div>
                      <VerificationTag status={ev.verification} />
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {ev.summaryMizo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

