import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  GitFork,
  Plus,
  Route,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { ARCHIVAL_SOURCE_CATALOG } from "../data/seedArchivalRecords";
import type {
  BloodGroup,
  DnaKnowledgeBase,
  PersonNode,
  UserRole,
  WatchdogAuditResult,
} from "../types/book";
import {
  findRelationshipPath,
  traceForwardDescendants,
  traceReverseAncestors,
} from "../utils/dnaGraph";
import { DnaGraphVisualizer } from "./DnaGraphVisualizer";
import { PersonDossierPanel } from "./PersonDossierModal";
import { VerificationTag } from "./VerificationTag";

interface DnaChainStudioProps {
  kb: DnaKnowledgeBase;
  userRole: UserRole;
  selectedPersonId: string;
  privacyLocked: boolean;
  onTogglePrivacyLock: () => void;
  onSelectPerson: (personId: string) => void;
  onSubmitPersonUpdate: (
    updated: PersonNode,
    auditResult?: WatchdogAuditResult
  ) => { status: "approved" | "flagged_to_admin"; message: string };
  onSubmitNewPerson: (
    newPerson: PersonNode,
    auditResult?: WatchdogAuditResult
  ) => { status: "approved" | "flagged_to_admin"; message: string };
}

type TraceMode = "forward" | "reverse" | "pathfinder" | "events";

type EventFilter =
  | "ALL"
  | "verified_history"
  | "verified_colonial"
  | "famine"
  | "war"
  | "folklore";

interface AiReverseStep {
  stepNumber: number;
  name: string;
  roleOrRelation: string;
  clan?: string;
  villages?: string[];
  era?: string;
  notesInMizo: string;
  verification: string;
}

export const DnaChainStudio: React.FC<DnaChainStudioProps> = ({
  kb,
  userRole,
  selectedPersonId,
  privacyLocked,
  onTogglePrivacyLock,
  onSelectPerson,
  onSubmitPersonUpdate,
  onSubmitNewPerson,
}) => {
  const isReader = userRole === "reader";
  const [traceMode, setTraceMode] = useState<TraceMode>("forward");
  const [eventFilter, setEventFilter] = useState<EventFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [clanFilter, setClanFilter] = useState("ALL");

  const [pathNodeA, setPathNodeA] = useState<string>(
    kb.people[0]?.id || "person-chhinlung-thlahtu"
  );
  const [pathNodeB, setPathNodeB] = useState<string>(
    "person-zorinpuii-sailo"
  );

  const [reverseQuery, setReverseQuery] = useState("");
  const [reverseClanHint, setReverseClanHint] = useState("");
  const [reverseVillageHint, setReverseVillageHint] = useState("");
  const [isTracingAi, setIsTracingAi] = useState(false);
  const [aiReverseResult, setAiReverseResult] = useState<{
    lineageSteps: AiReverseStep[];
    migrationPath: string[];
    mizoSummary: string;
  } | null>(null);
  const [aiTraceError, setAiTraceError] = useState<string | null>(null);

  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newClan, setNewClan] = useState("Sailo");
  const [newVillages, setNewVillages] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newBlood, setNewBlood] = useState<BloodGroup>("O+");
  const [newParentId, setNewParentId] = useState("");
  const [newBio, setNewBio] = useState("");
  const [isAuditingPerson, setIsAuditingPerson] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  const selectedPerson = useMemo(
    () =>
      kb.people.find((p) => p.id === selectedPersonId) ??
      kb.people[0],
    [kb.people, selectedPersonId]
  );

  const uniqueClans = useMemo(() => {
    const set = new Set<string>();
    for (const p of kb.people) {
      if (p.clan) set.add(p.clan);
    }
    return Array.from(set).sort();
  }, [kb.people]);

  const filteredDirectory = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return (kb.people || []).filter((p) => {
      if (!p) return false;
      if (clanFilter !== "ALL" && p.clan !== clanFilter) return false;
      if (!q) return true;
      const name = (p.fullName || "").toLowerCase();
      const clan = (p.clan || "").toLowerCase();
      const subClan = (p.subClan || "").toLowerCase();
      const bio = (p.biography || "").toLowerCase();
      const villages = (p.villages || []).map((v) => (v || "").toLowerCase());
      const aliases = (p.aliases || []).map((a) => (a || "").toLowerCase());

      return (
        name.includes(q) ||
        clan.includes(q) ||
        subClan.includes(q) ||
        bio.includes(q) ||
        villages.some((v) => v.includes(q)) ||
        aliases.some((a) => a.includes(q))
      );
    });
  }, [kb.people, searchTerm, clanFilter]);

  const activeLayers = useMemo(() => {
    if (!selectedPerson) return [];
    if (traceMode === "reverse") {
      return traceReverseAncestors(selectedPerson.id, kb.people);
    }
    return traceForwardDescendants(selectedPerson.id, kb.people);
  }, [selectedPerson, traceMode, kb.people]);

  const computedPath = useMemo(() => {
    if (traceMode !== "pathfinder") return null;
    return findRelationshipPath(pathNodeA, pathNodeB, kb.people);
  }, [traceMode, pathNodeA, pathNodeB, kb.people]);

  const filteredEvents = useMemo(() => {
    const list = kb.events || [];
    return list.filter((ev) => {
      if (eventFilter === "ALL") return true;
      if (eventFilter === "verified_history")
        return ev.verification === "verified_history";
      if (eventFilter === "verified_colonial")
        return ev.verification === "verified_colonial";
      if (eventFilter === "famine") return ev.category === "famine";
      if (eventFilter === "war")
        return ev.category === "war" || ev.category === "expedition";
      if (eventFilter === "folklore")
        return ev.isFolklore || ev.category === "folklore";
      return true;
    });
  }, [kb.events, eventFilter]);

  const runLocalReverseTraceFallback = () => {
    const q = reverseQuery.trim().toLowerCase();
    const clanH = reverseClanHint.trim().toLowerCase();
    const villH = reverseVillageHint.trim().toLowerCase();

    // 1. Find matching person in local knowledge base
    let match = (kb.people || []).find(
      (p) =>
        (p.fullName || "").toLowerCase().includes(q) ||
        (p.aliases || []).some((a) => (a || "").toLowerCase().includes(q))
    );

    if (!match && clanH) {
      match = (kb.people || []).find(
        (p) => (p.clan || "").toLowerCase() === clanH
      );
    }

    if (!match && villH) {
      match = (kb.people || []).find((p) =>
        (p.villages || []).some((v) => (v || "").toLowerCase().includes(villH))
      );
    }

    if (!match) {
      match =
        (kb.people || []).find((p) => p.id === "person-lallula") ||
        (kb.people || [])[0];
    }

    if (!match) {
      setAiTraceError("Lineage record zawng hmuh a ni lo.");
      return;
    }

    // 2. Trace ancestor chain backwards up parentIds
    const steps: AiReverseStep[] = [];
    const visited = new Set<string>();
    const pathVillages = new Set<string>();
    let curr: PersonNode | undefined = match;
    let stepNum = 1;

    while (curr && !visited.has(curr.id) && stepNum <= 8) {
      visited.add(curr.id);
      (curr.villages || []).forEach((v) => pathVillages.add(v));
      steps.push({
        stepNumber: stepNum,
        name: curr.fullName,
        roleOrRelation:
          stepNum === 1
            ? `Chhui ṭanna (${curr.clan || "Zofate"})`
            : `Thlahtu Bul (${curr.clan || "Thlahtu"})`,
        clan: curr.clan,
        villages: curr.villages,
        era: curr.birthDate || "Hmanlai",
        notesInMizo: curr.biography
          ? curr.biography.slice(0, 160) + "..."
          : "Thlahtu chhuanvawr leh rorelna kengkawhtu.",
        verification: curr.verification || "verified_history",
      });

      const nextParentId: string | undefined = curr.parentIds?.[0];
      curr = nextParentId
        ? (kb.people || []).find((p) => p.id === nextParentId)
        : undefined;
      stepNum++;
    }

    // Ensure root Chhinlung or Zahmuaka is included
    if (!visited.has("person-chhinlung-thlahtu")) {
      steps.push({
        stepNumber: stepNum,
        name: "Thlahtu Bul (Chhinlung)",
        roleOrRelation: "Tobul Thlahtu Bul",
        clan: "Zofate Bul",
        villages: ["Chhinlung", "Khawpui"],
        era: "Pre-Migration Era",
        notesInMizo:
          "Zofate hnam peng zawng zawngte lo chhuahna lungpui hnuai (Chhinlung).",
        verification: "oral_tradition",
      });
      pathVillages.add("Chhinlung");
      pathVillages.add("Khawpui");
    }

    const villagesArr = Array.from(pathVillages);
    setAiReverseResult({
      lineageSteps: steps,
      migrationPath:
        villagesArr.length > 0
          ? villagesArr
          : ["Chhinlung", "Khawpui", "Selesih", "Aizawl"],
      mizoSummary: `I chhui mi '${reverseQuery}' (${match.clan || "Zofate"}) hi ${match.fullName} thlahte zungzam aṭangin Chhinlung leh Selesih kulhpui thlengin a inthlung chho a. Hnam ziarang leh thisen inzawmnaah Zofate tobul thlahtu bulte nena inzawm tlat a ni.`,
    });
    setAiTraceError(null);
  };

  const handleAiReverseTrace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reverseQuery.trim()) return;

    setIsTracingAi(true);
    setAiTraceError(null);

    try {
      const res = await fetch("/api/dna/trace-reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: reverseQuery.trim(),
          clanHint: reverseClanHint.trim(),
          villageHint: reverseVillageHint.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiReverseResult(data);
      } else {
        runLocalReverseTraceFallback();
      }
    } catch {
      runLocalReverseTraceFallback();
    } finally {
      setIsTracingAi(false);
    }
  };

  const makeOfflinePersonAudit = (fullName: string): WatchdogAuditResult => ({
    overallSeverity: "minor_discrepancy",
    flags: [
      {
        category: "historical_conflict",
        severity: "minor_discrepancy",
        targetName: fullName,
        summaryMizoEnglish:
          "Offline / Unverified Watchdog — Admin Review Required",
        detail:
          "Internet awm loh avang emaw AI Watchdog server biak theih loh avangin Admin-in a en hma chu core DNA registry-ah luh tir phal a ni lo.",
      },
    ],
    auditReportMizoEnglish:
      "Offline DNA profile submission queued for Admin Alert Inbox.",
  });

  const runWatchdogForPerson = async (
    person: PersonNode
  ): Promise<WatchdogAuditResult> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return makeOfflinePersonAudit(person.fullName);
    }

    const parent = kb.people.find((p) => person.parentIds.includes(p.id));
    const existingContext = parent
      ? `Parent: ${parent.fullName} (DOB: ${parent.birthDate || "?"}, Blood: ${parent.bloodGroup}, Clan: ${parent.clan})`
      : "";

    try {
      const res = await fetch("/api/watchdog/audit-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionType: "person_entry",
          titleOrName: person.fullName,
          contentOrDetails: JSON.stringify({
            fullName: person.fullName,
            clan: person.clan,
            villages: person.villages,
            birthDate: person.birthDate,
            deathDate: person.deathDate,
            bloodGroup: person.bloodGroup,
            healthHistory: person.healthHistory,
            biography: person.biography,
          }),
          existingContext,
        }),
      });

      if (!res.ok) return makeOfflinePersonAudit(person.fullName);
      return (await res.json()) as WatchdogAuditResult;
    } catch {
      return makeOfflinePersonAudit(person.fullName);
    }
  };

  const handleSaveNewPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReader || !newFullName.trim()) return;

    const id = `person-${Date.now()}`;
    const created: PersonNode = {
      id,
      fullName: newFullName.trim(),
      aliases: [],
      gender: "Unknown",
      nodeType: "person",
      clan: newClan.trim() || "Zofate",
      villages: newVillages
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
      birthDate: newDob.trim() || undefined,
      bloodGroup: newBlood,
      healthHistory: [],
      lifeEvents: [],
      parentIds: newParentId ? [newParentId] : [],
      spouseIds: [],
      childrenIds: [],
      biography:
        newBio.trim() || `${newFullName.trim()} chanchin chhinchhiahna.`,
      verification: "oral_tradition",
      sources: [userRole === "admin" ? "Admin Entry" : "Contributor Submission"],
      chapterRefs: [],
      updatedAt: Date.now(),
    };

    if (userRole === "contributor") {
      setIsAuditingPerson(true);
      setSubmissionNotice(null);
      try {
        const auditResult = await runWatchdogForPerson(created);
        const outcome = onSubmitNewPerson(created, auditResult);
        setSubmissionNotice(outcome.message);
        if (outcome.status === "approved") {
          onSelectPerson(id);
        }
      } finally {
        setIsAuditingPerson(false);
      }
    } else {
      const outcome = onSubmitNewPerson(created);
      setSubmissionNotice(outcome.message);
      onSelectPerson(id);
    }

    setNewFullName("");
    setNewVillages("");
    setNewDob("");
    setNewBio("");
    setShowAddPerson(false);
  };

  const handlePersonDossierUpdate = async (updated: PersonNode) => {
    if (isReader) return;
    if (userRole === "contributor") {
      setIsAuditingPerson(true);
      setSubmissionNotice(null);
      try {
        const auditResult = await runWatchdogForPerson(updated);
        const outcome = onSubmitPersonUpdate(updated, auditResult);
        setSubmissionNotice(outcome.message);
      } finally {
        setIsAuditingPerson(false);
      }
    } else {
      const outcome = onSubmitPersonUpdate(updated);
      setSubmissionNotice(outcome.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Left Directory Sidebar */}
      <aside className="w-full lg:w-80 xl:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border-hairline)] bg-[var(--bg-surface)]/50 flex flex-col">
        <div className="p-4 border-b border-[var(--border-hairline)] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              DNA Registry ({kb.people.length})
            </p>
            {!isReader && (
              <button
                type="button"
                onClick={() => setShowAddPerson((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded transition-colors whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Mi Thar</span>
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hming, Hnam, Khua zawnna..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-ink)]"
            />
          </div>

          <select
            value={clanFilter}
            onChange={(e) => setClanFilter(e.target.value)}
            aria-label="Filter by clan"
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
          >
            <option value="ALL">
              Hnam Peng Zawng Zawng ({kb.people.length})
            </option>
            {uniqueClans.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-hairline)] max-h-72 lg:max-h-none">
          {filteredDirectory.map((person) => {
            const active = person.id === selectedPerson?.id;
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelectPerson(person.id)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  active
                    ? "bg-[var(--bg-elevated)]"
                    : "hover:bg-[var(--bg-elevated)]/60"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`font-display text-sm font-semibold truncate ${
                      active
                        ? "text-[var(--accent-ink)]"
                        : "text-[var(--text-ink)]"
                    }`}
                  >
                    {person.fullName}
                  </span>
                  <span className="font-code text-[11px] text-[var(--text-muted)] shrink-0">
                    {privacyLocked ? "••" : person.bloodGroup}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-muted)] truncate">
                  {person.clan}
                  {person.villages.length > 0
                    ? ` · ${person.villages.join(", ")}`
                    : ""}
                </p>
                {person.aliases.length > 0 && (
                  <p className="mt-0.5 font-code text-[10px] text-[var(--text-muted)]/80 truncate">
                    AKA: {person.aliases.join(", ")}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main DNA Workspace */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
              Bi-Directional Genealogical DNA Chain
              {isReader ? " · Read-Only Explorer" : ""}
            </p>
            <h1 className="mt-1.5 font-display text-3xl font-semibold text-[var(--text-ink)]">
              Zofate Thlahtu &amp; Chhuizuina
            </h1>
          </div>

          <div className="inline-flex flex-wrap items-center p-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md gap-1">
            <button
              type="button"
              onClick={() => setTraceMode("forward")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                traceMode === "forward"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Forward (Thlahtu -&gt; Thlahte)</span>
            </button>
            <button
              type="button"
              onClick={() => setTraceMode("reverse")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                traceMode === "reverse"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <GitFork className="w-3.5 h-3.5 rotate-180" />
              <span>Reverse (Tunlai -&gt; Chhinlung)</span>
            </button>
            <button
              type="button"
              onClick={() => setTraceMode("pathfinder")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                traceMode === "pathfinder"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>Inlaichinna Zawnna</span>
            </button>
            <button
              type="button"
              onClick={() => setTraceMode("events")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                traceMode === "events"
                  ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Hunbi &amp; Archives ({kb.events?.length || 0})</span>
            </button>
          </div>
        </div>

        {submissionNotice && (
          <div
            role="status"
            className="px-4 py-3 border border-[var(--accent-ink)]/40 bg-[var(--accent-subtle)] text-sm text-[var(--text-ink)] rounded-md"
          >
            {submissionNotice}
          </div>
        )}

        {showAddPerson && !isReader && (
          <form
            onSubmit={handleSaveNewPerson}
            className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4"
          >
            <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
              Mi Thar DNA Node Dahna
              {userRole === "contributor"
                ? " (AI Watchdog Audited)"
                : ""}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Hming Pum *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Entirnan: Lalremruata"
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Hnam Peng (Clan)
                </label>
                <input
                  type="text"
                  value={newClan}
                  onChange={(e) => setNewClan(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Blood Group
                </label>
                <select
                  value={newBlood}
                  onChange={(e) => setNewBlood(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                >
                  {(
                    [
                      "O+",
                      "O-",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "Unknown",
                    ] as BloodGroup[]
                  ).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Khua (Villages, comma separated)
                </label>
                <input
                  type="text"
                  value={newVillages}
                  onChange={(e) => setNewVillages(e.target.value)}
                  placeholder="Aizawl, Champhai"
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Pianni (DOB)
                </label>
                <input
                  type="text"
                  value={newDob}
                  onChange={(e) => setNewDob(e.target.value)}
                  placeholder="1988-05-12"
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Thlahtu / Nu leh Pa (Link to Parent)
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                >
                  <option value="">-- Thlang rawh (Optional) --</option>
                  {kb.people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.clan})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Chanchin Tawi
              </label>
              <textarea
                rows={2}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddPerson(false)}
                className="px-4 py-2 text-xs text-[var(--text-muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAuditingPerson}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] disabled:opacity-50 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {isAuditingPerson
                    ? "AI Watchdog Endik mek..."
                    : userRole === "contributor"
                    ? "Submit via AI Watchdog"
                    : "Add to DNA Chain"}
                </span>
              </button>
            </div>
          </form>
        )}

        {traceMode === "reverse" && (
          <section className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text-ink)]">
                A Let Zawnga Chhuizuina (Reverse Trace Any Modern Name / Sub-Clan / Khua)
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Tunlai mi hming, hnam peng tenau, emaw khua eng pawh ziak lut la, Gemini-in Chhinlung leh thlahtu hluite thlenga chhuikirna kawng a chhutsak ang che.
              </p>
            </div>

            <form
              onSubmit={handleAiReverseTrace}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <input
                type="text"
                value={reverseQuery}
                onChange={(e) => setReverseQuery(e.target.value)}
                placeholder="Tunlai Mi / Chi / Khua..."
                required
                className="sm:col-span-2 px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
              />
              <input
                type="text"
                value={reverseClanHint}
                onChange={(e) => setReverseClanHint(e.target.value)}
                placeholder="Hnam peng (e.g. Ralte Siakeng)"
                className="px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reverseVillageHint}
                  onChange={(e) => setReverseVillageHint(e.target.value)}
                  placeholder="Khua..."
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
                />
                <button
                  type="submit"
                  disabled={isTracingAi}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:opacity-50 rounded whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isTracingAi ? "Chhui mek..." : "AI Chhui"}</span>
                </button>
              </div>
            </form>

            {aiTraceError && (
              <p className="text-xs text-[var(--accent-ink)]">{aiTraceError}</p>
            )}

            {aiReverseResult && (
              <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
                <p className="font-book text-sm leading-relaxed text-[var(--text-ink)]">
                  {aiReverseResult.mizoSummary}
                </p>
                {aiReverseResult.migrationPath.length > 0 && (
                  <p className="font-code text-xs text-[var(--accent-ink)]">
                    Migration Route:{" "}
                    {aiReverseResult.migrationPath.join("  →  ")}
                  </p>
                )}
                <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                  {aiReverseResult.lineageSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm"
                    >
                      <div>
                        <span className="font-code text-xs text-[var(--text-muted)] mr-2 tabular-nums">
                          {String(step.stepNumber).padStart(2, "0")}.
                        </span>
                        <span className="font-display font-semibold text-[var(--text-ink)]">
                          {step.name}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] ml-2">
                          ({step.roleOrRelation}
                          {step.era ? ` · ${step.era}` : ""})
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {step.notesInMizo}
                        </p>
                      </div>
                      <VerificationTag
                        status={
                          step.verification === "verified_history" ||
                          step.verification === "verified_colonial" ||
                          step.verification === "oral_tradition"
                            ? step.verification
                            : "needs_review"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {traceMode === "events" ? (
          <div className="space-y-6">
            {/* Archival PDF Sources Banner */}
            <section className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent-ink)]" />
                <h2 className="font-display text-lg font-semibold text-[var(--text-ink)]">
                  Archival Sources &amp; Historical Library Index
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ARCHIVAL_SOURCE_CATALOG.map((src) => (
                  <div
                    key={src.id}
                    className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-semibold text-[var(--text-ink)]">
                          {src.title}
                        </p>
                        <p className="font-code text-[11px] text-[var(--accent-ink)]">
                          {src.authorOrBody} · {src.year} ({src.language})
                        </p>
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-ink)] shrink-0"
                        title="Open source archival URL"
                      >
                        <span>PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {src.scope}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dated Events vs Oral Folklore */}
            <section className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
                    Indona, Mautam/Thingtam, Thuthlung &amp; Thawnthu ({filteredEvents.length})
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Thil thleng tak tak kum bi nei (Verified History &amp; Colonial Records 1871–1942) leh kâ-a inhlanchhawn thawnthu (Oral Folklore) thliar hranna.
                  </p>
                </div>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value as EventFilter)}
                  aria-label="Filter historical events"
                  className="px-3 py-1.5 text-xs bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded text-[var(--text-ink)]"
                >
                  <option value="ALL">Zawng Zawng ({kb.events?.length || 0})</option>
                  <option value="verified_history">[Verified History]</option>
                  <option value="verified_colonial">[Verified Colonial Record]</option>
                  <option value="war">Indona &amp; Vailian (Wars / Expeditions)</option>
                  <option value="famine">Mautam &amp; Thingtam (Famines)</option>
                  <option value="folklore">Thawnthu Hlui (Oral Folklore)</option>
                </select>
              </div>

              <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                {filteredEvents.map((ev) => (
                  <div key={ev.id} className="py-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-code text-xs font-semibold text-[var(--accent-ink)] tabular-nums">
                          {ev.year}
                        </span>
                        <span className="font-display text-base font-semibold text-[var(--text-ink)]">
                          {ev.title}
                        </span>
                        <span className="font-code text-[10px] uppercase px-1.5 py-0.5 border border-[var(--border-hairline)] rounded text-[var(--text-muted)]">
                          {ev.isFolklore ? "Folklore" : ev.category}
                        </span>
                      </div>
                      <VerificationTag status={ev.verification} />
                    </div>
                    <p className="font-book text-sm text-[var(--text-ink)]">
                      {ev.summaryMizo}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                      {ev.villagesInvolved.length > 0 && (
                        <span>Khua: {ev.villagesInvolved.join(", ")}</span>
                      )}
                      {ev.clansInvolved.length > 0 && (
                        <span>Hnam: {ev.clansInvolved.join(", ")}</span>
                      )}
                      <span>Source: {ev.sourceCitation}</span>
                    </div>
                    {ev.peopleInvolved.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ev.peopleInvolved.map((pname) => {
                          const match = kb.people.find(
                            (p) =>
                              p.fullName.toLowerCase() === pname.toLowerCase() ||
                              p.aliases.some(
                                (a) => a.toLowerCase() === pname.toLowerCase()
                              )
                          );
                          return match ? (
                            <button
                              key={pname}
                              type="button"
                              onClick={() => onSelectPerson(match.id)}
                              className="px-2 py-0.5 text-[11px] font-medium border border-[var(--accent-ink)]/40 text-[var(--accent-ink)] hover:bg-[var(--accent-subtle)] rounded"
                            >
                              {pname}
                            </button>
                          ) : (
                            <span
                              key={pname}
                              className="px-2 py-0.5 text-[11px] border border-[var(--border-hairline)] text-[var(--text-muted)] rounded"
                            >
                              {pname}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Villages & Clans Quick Reference */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-3">
                <h3 className="font-display text-lg font-semibold text-[var(--text-ink)]">
                  Khua Hlui &amp; Colonial Posts ({kb.villages.length})
                </h3>
                <div className="divide-y divide-[var(--border-hairline)] max-h-80 overflow-y-auto pr-1">
                  {kb.villages.map((v) => (
                    <div key={v.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-semibold text-[var(--text-ink)]">
                          {v.name}
                          {v.era ? (
                            <span className="ml-1.5 font-code text-[11px] font-normal text-[var(--text-muted)]">
                              ({v.era})
                            </span>
                          ) : null}
                        </span>
                        <VerificationTag status={v.verification} />
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {v.region}
                        {v.foundedBy ? ` · Dintu: ${v.foundedBy}` : ""}
                      </p>
                      <p className="text-xs text-[var(--text-ink)]/90">
                        {v.historicalNotes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-3">
                <h3 className="font-display text-lg font-semibold text-[var(--text-ink)]">
                  Hnam Peng &amp; Pem Kual Dan ({kb.clans.length})
                </h3>
                <div className="divide-y divide-[var(--border-hairline)] max-h-80 overflow-y-auto pr-1">
                  {kb.clans.map((c) => (
                    <div key={c.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-semibold text-[var(--text-ink)]">
                          {c.name}
                        </span>
                        <VerificationTag status={c.verification} />
                      </div>
                      <p className="font-code text-[11px] text-[var(--accent-ink)]">
                        {c.migrationRoute.join(" → ")}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : traceMode === "pathfinder" ? (
          <section className="p-6 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] rounded-md space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-ink)]">
                Inlaichinna Zawnna (Relationship Pathfinder)
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Mi pahnih thlang la, thisen inzawmna, inneihna, hnam peng, emaw khaw hlui inkalpawhna kawng dik tak a rawn chhui chhuak ang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Mi Pakhatna (Node A)
                </label>
                <select
                  value={pathNodeA}
                  onChange={(e) => setPathNodeA(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                >
                  {kb.people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.clan})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Mi Pahnihna (Node B)
                </label>
                <select
                  value={pathNodeB}
                  onChange={(e) => setPathNodeB(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded"
                >
                  {kb.people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.clan})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {computedPath ? (
              <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent-ink)] tabular-nums">
                  Inzawmna Hmuh A Ni ({computedPath.length - 1} steps)
                </p>
                <div className="flex flex-col gap-2">
                  {computedPath.map((step, i) => (
                    <div
                      key={`${step.node.id}-${i}`}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 border border-[var(--border-hairline)] bg-[var(--bg-canvas)] rounded"
                    >
                      <div>
                        {i > 0 && (
                          <p className="font-code text-[11px] text-[var(--accent-ink)] mb-0.5">
                            ↳ {step.relationFromPrev}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectPerson(step.node.id)}
                          className="font-display text-base font-semibold text-[var(--text-ink)] hover:text-[var(--accent-ink)]"
                        >
                          {step.node.fullName}
                        </button>
                        <span className="ml-2 text-xs text-[var(--text-muted)]">
                          {step.node.clan}
                          {step.node.villages.length > 0
                            ? ` · ${step.node.villages.join(", ")}`
                            : ""}
                        </span>
                      </div>
                      <VerificationTag status={step.node.verification} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Heng mi pahnihte inkarah hian record sa inzawmna a la awm rih lo.
              </p>
            )}
          </section>
        ) : (
          <DnaGraphVisualizer
            layers={activeLayers}
            orientation={traceMode === "reverse" ? "bottom-up" : "top-down"}
            selectedPersonId={selectedPerson?.id || ""}
            privacyLocked={privacyLocked}
            onToggleOrientation={() =>
              setTraceMode((m) => (m === "forward" ? "reverse" : "forward"))
            }
            onSelectPerson={onSelectPerson}
          />
        )}

        {selectedPerson && (
          <PersonDossierPanel
            person={selectedPerson}
            allPeople={kb.people}
            privacyLocked={privacyLocked}
            readOnly={isReader}
            canUnlockPrivacy={userRole === "admin"}
            onTogglePrivacyLock={onTogglePrivacyLock}
            onUpdatePerson={handlePersonDossierUpdate}
            onSelectPerson={onSelectPerson}
          />
        )}
      </div>
    </div>
  );
};
