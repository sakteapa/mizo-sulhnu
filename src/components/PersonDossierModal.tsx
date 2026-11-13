import React, { useMemo, useState } from "react";
import {
  Activity,
  Droplets,
  Edit3,
  GitBranch,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Unlock,
  X,
} from "lucide-react";
import type {
  BloodGroup,
  HealthRecord,
  LifeEvent,
  PersonNode,
  VerificationStatus,
} from "../types/book";
import { analyzeFamilyBloodAndHealth } from "../utils/dnaGraph";
import { VerificationTag } from "./VerificationTag";

interface PersonDossierProps {
  person: PersonNode;
  allPeople: PersonNode[];
  privacyLocked: boolean;
  readOnly?: boolean;
  canUnlockPrivacy?: boolean;
  onTogglePrivacyLock: () => void;
  onUpdatePerson: (updated: PersonNode) => void;
  onSelectPerson: (personId: string) => void;
  onOpenInGraph?: (personId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

export const PersonDossierPanel: React.FC<PersonDossierProps> = ({
  person,
  allPeople,
  privacyLocked,
  readOnly = false,
  canUnlockPrivacy = true,
  onTogglePrivacyLock,
  onUpdatePerson,
  onSelectPerson,
  onOpenInGraph,
  onClose,
  isModal = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PersonNode>(person);

  React.useEffect(() => {
    setDraft(person);
    setIsEditing(false);
  }, [person]);

  const analysis = useMemo(
    () => analyzeFamilyBloodAndHealth(person, allPeople),
    [person, allPeople]
  );

  const [newCondition, setNewCondition] = useState("");
  const [newHealthNote, setNewHealthNote] = useState("");
  const [newHereditary, setNewHereditary] = useState(true);

  const [newEventYear, setNewEventYear] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventLoc, setNewEventLoc] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    onUpdatePerson({
      ...draft,
      updatedAt: Date.now(),
    });
    setIsEditing(false);
  };

  const handleAddHealth = () => {
    if (readOnly || !newCondition.trim()) return;
    const item: HealthRecord = {
      id: `hr-${Date.now()}`,
      condition: newCondition.trim(),
      notes: newHealthNote.trim(),
      hereditary: newHereditary,
    };
    const updated: PersonNode = {
      ...person,
      healthHistory: [...person.healthHistory, item],
      updatedAt: Date.now(),
    };
    onUpdatePerson(updated);
    setNewCondition("");
    setNewHealthNote("");
  };

  const handleAddLifeEvent = () => {
    if (readOnly || !newEventTitle.trim()) return;
    const ev: LifeEvent = {
      id: `ev-${Date.now()}`,
      year: newEventYear.trim() || "—",
      title: newEventTitle.trim(),
      category: "other",
      description: newEventDesc.trim(),
      location: newEventLoc.trim() || undefined,
    };
    const updated: PersonNode = {
      ...person,
      lifeEvents: [...person.lifeEvents, ev],
      updatedAt: Date.now(),
    };
    onUpdatePerson(updated);
    setNewEventYear("");
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventLoc("");
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
              {person.clan}
              {person.subClan ? ` · ${person.subClan}` : ""}
            </span>
            <VerificationTag status={person.verification} />
          </div>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-[var(--text-ink)]">
            {person.fullName}
          </h2>
          {person.aliases.length > 0 && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Hming dang: {person.aliases.join(" · ")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenInGraph && (
            <button
              type="button"
              onClick={() => onOpenInGraph(person.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>DNA Graph-ah En</span>
            </button>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--text-muted)] rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel" : "Siak / Edit"}</span>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dossier"
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {isEditing && !readOnly ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Hming Pum (Full Name)
              </label>
              <input
                type="text"
                required
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Hnam Peng (Clan)
              </label>
              <input
                type="text"
                value={draft.clan}
                onChange={(e) => setDraft({ ...draft, clan: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Khua (Villages, comma separated)
              </label>
              <input
                type="text"
                value={draft.villages.join(", ")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    villages: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Blood Group
              </label>
              <select
                value={draft.bloodGroup}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bloodGroup: e.target.value as BloodGroup,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Pianni (DOB)
              </label>
              <input
                type="text"
                value={draft.birthDate || ""}
                onChange={(e) =>
                  setDraft({ ...draft, birthDate: e.target.value })
                }
                placeholder="YYYY-MM-DD or c. 1850"
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Pianna Khua (Birthplace)
              </label>
              <input
                type="text"
                value={draft.birthPlace || ""}
                onChange={(e) =>
                  setDraft({ ...draft, birthPlace: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Thihni (DOD)
              </label>
              <input
                type="text"
                value={draft.deathDate || ""}
                onChange={(e) =>
                  setDraft({ ...draft, deathDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Phumna Hmun (Burial / Memorial Site)
              </label>
              <input
                type="text"
                value={draft.burialSite || ""}
                onChange={(e) =>
                  setDraft({ ...draft, burialSite: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Thih Chhan (Cause of Death)
              </label>
              <input
                type="text"
                value={draft.causeOfDeath || ""}
                onChange={(e) =>
                  setDraft({ ...draft, causeOfDeath: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Verification Status
              </label>
              <select
                value={draft.verification}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    verification: e.target.value as VerificationStatus,
                  })
                }
                className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
              >
                <option value="verified_history">
                  Verified History / Record Nghet
                </option>
                <option value="verified_colonial">
                  Verified Colonial Record (1871–1942)
                </option>
                <option value="oral_tradition">
                  Oral Tradition / Thawnthu
                </option>
                <option value="needs_review">Needs Review / Thu Inkalh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
              Chanchin Tawi (Biography)
            </label>
            <textarea
              rows={3}
              value={draft.biography}
              onChange={(e) => setDraft({ ...draft, biography: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-canvas)] border border-[var(--border-hairline)] rounded-md text-[var(--text-ink)]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--accent-ink)] text-[var(--accent-contrast)] rounded-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Dossier</span>
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="font-book text-[16px] leading-relaxed text-[var(--text-ink)]">
            {person.biography}
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 py-4 border-y border-[var(--border-hairline)] text-sm">
            <div>
              <dt className="text-xs text-[var(--text-muted)]">
                Pianni &amp; Hmun (DOB / Birthplace)
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-ink)] tabular-nums">
                {person.birthDate || "Chhinchhiah loh"}
                {person.birthPlace ? ` · ${person.birthPlace}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">
                Thihni &amp; Kum (DOD / Age)
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-ink)] tabular-nums">
                {person.deathDate || "Dam lai / Chhinchhiah loh"}
                {person.ageAtDeath ? ` (${person.ageAtDeath} yrs)` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">
                Khua Awmna Te (Villages)
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-ink)]">
                {person.villages.length > 0
                  ? person.villages.join(" · ")
                  : "Chhinchhiah loh"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-muted)]">
                Phumna / Thih Chhan
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-ink)]">
                {person.burialSite || "—"}
                {person.causeOfDeath ? ` · ${person.causeOfDeath}` : ""}
              </dd>
            </div>
          </dl>

          {/* Family Links */}
          <section className="space-y-2">
            <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Chhungkua leh Thlahtu Inzawmna
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Nu leh Pa / Thlahtu (Parents)
                </p>
                {analysis.parents.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">—</p>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    {analysis.parents.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectPerson(p.id)}
                        className="text-left text-xs font-medium text-[var(--accent-ink)] hover:underline"
                      >
                        {p.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Nupui / Pasal (Spouse)
                </p>
                {analysis.spouses.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">—</p>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    {analysis.spouses.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelectPerson(s.id)}
                        className="text-left text-xs font-medium text-[var(--accent-ink)] hover:underline"
                      >
                        {s.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Fate / Thlahte (Children)
                </p>
                {analysis.children.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">—</p>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    {analysis.children.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onSelectPerson(c.id)}
                        className="text-left text-xs font-medium text-[var(--accent-ink)] hover:underline"
                      >
                        {c.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Chhungkaw Hriselna & Blood Group Analyzer (RBAC Privacy Lock Aware) */}
          <section className="p-5 border border-[var(--border-hairline)] bg-[var(--bg-surface)]/55 rounded-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[var(--accent-ink)]" />
                <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-ink)]">
                  Chhungkaw Hriselna &amp; Blood Group Analyzer
                </h3>
              </div>
              {canUnlockPrivacy && (
                <button
                  type="button"
                  onClick={onTogglePrivacyLock}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] rounded transition-colors"
                >
                  {privacyLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
                      <span>Unlock Sensitive DNA</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Lock Records</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {privacyLocked ? (
              <div className="py-4 text-sm text-[var(--text-muted)] flex items-center gap-3">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  {canUnlockPrivacy
                    ? "Local Privacy Lock a in-khâr rih. Blood group leh hriselna chhinchhiahna en turin 'Unlock Sensitive DNA' hmet rawh."
                    : "Mimal hriselna leh blood group record te hi Admin/Owner-in a khâr rih (Masked for Public Readers)."}
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Blood Group
                    </p>
                    <p className="mt-0.5 font-code text-lg font-semibold text-[var(--accent-ink)]">
                      {person.bloodGroup}
                    </p>
                    {person.bloodInheritanceNotes && (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {person.bloodInheritanceNotes}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">
                      Chhungkaw Blood Donor Inmil Te (Compatible Family Donors)
                    </p>
                    {person.bloodGroup === "Unknown" ? (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Blood group chhinchhiah phawt a ngai.
                      </p>
                    ) : analysis.compatibleDonors.length === 0 ? (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Chhungkaw zingah blood group inmil record a la awm lo.
                      </p>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {analysis.compatibleDonors.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => onSelectPerson(d.id)}
                            className="font-medium text-[var(--text-ink)] underline decoration-[var(--border-hairline)] underline-offset-4 hover:text-[var(--accent-ink)]"
                          >
                            {d.fullName} ({d.bloodGroup})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-hairline)] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-ink)]">
                    <Activity className="w-3.5 h-3.5 text-[var(--accent-ink)]" />
                    <span>
                      Hriselna Chanchin &amp; Thlah Inkhawh (Hereditary Patterns)
                    </span>
                  </div>

                  {person.healthHistory.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)]">
                      Natna leh hriselna record la dah a awm lo.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-xs">
                      {person.healthHistory.map((hr) => (
                        <li key={hr.id} className="text-[var(--text-ink)]">
                          <span className="font-semibold">{hr.condition}</span>
                          {hr.recordedYear ? ` (${hr.recordedYear})` : ""}
                          {hr.hereditary ? " · Thlah Kal Chhawng Thei" : ""}
                          {hr.notes ? ` — ${hr.notes}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}

                  {analysis.hereditaryPatterns.length > 0 && (
                    <div className="pt-2 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-ink)]">
                        Chhungkaw Thlah Kal Chhawng Pattern:{" "}
                      </span>
                      {analysis.hereditaryPatterns
                        .map((hp) => `${hp.condition} (${hp.members.join(", ")})`)
                        .join(" · ")}
                    </div>
                  )}

                  {!readOnly && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        placeholder="Natna / Health condition..."
                        className="flex-1 min-w-[150px] px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                      />
                      <input
                        type="text"
                        value={newHealthNote}
                        onChange={(e) => setNewHealthNote(e.target.value)}
                        placeholder="Notes..."
                        className="flex-1 min-w-[140px] px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                      />
                      <label className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <input
                          type="checkbox"
                          checked={newHereditary}
                          onChange={(e) => setNewHereditary(e.target.checked)}
                        />
                        <span>Hereditary</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddHealth}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--text-muted)] rounded"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Telh</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--border-hairline)] flex items-start gap-2 text-[11px] text-[var(--text-muted)]">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent-ink)]" />
                  <span>
                    Hriattirna: Heng hriselna leh blood group chhinchhiahnate hi chhungkaw leh thlahtu chanchin chhinchhiahna (historical &amp; family reference) atan chauh a ni a, damdawi lam inenkawlna atan daktawr rawnna aiah hman tur a ni lo.
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Chronological Life Events */}
          <section className="space-y-3">
            <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Hringnun Thil Tawn (Chronological Life Events)
            </h3>
            {person.lifeEvents.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">
                Thil tawn chhinchhiah la awm lo.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-hairline)] border-y border-[var(--border-hairline)]">
                {person.lifeEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="py-2.5 flex items-baseline gap-4 text-sm"
                  >
                    <span className="font-code text-xs text-[var(--accent-ink)] w-16 shrink-0 tabular-nums">
                      {ev.year}
                    </span>
                    <div>
                      <p className="font-medium text-[var(--text-ink)]">
                        {ev.title}
                        {ev.location ? (
                          <span className="text-xs font-normal text-[var(--text-muted)]">
                            {" "}
                            · {ev.location}
                          </span>
                        ) : null}
                      </p>
                      {ev.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!readOnly && (
              <div className="pt-1 flex flex-wrap gap-2">
                <input
                  type="text"
                  value={newEventYear}
                  onChange={(e) => setNewEventYear(e.target.value)}
                  placeholder="Kum (Year)"
                  className="w-24 px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                />
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Thil tawn (e.g. Inneihna, Pem)..."
                  className="flex-1 min-w-[150px] px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                />
                <input
                  type="text"
                  value={newEventLoc}
                  onChange={(e) => setNewEventLoc(e.target.value)}
                  placeholder="Hmun..."
                  className="w-28 px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                />
                <input
                  type="text"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  placeholder="Sawifiahna..."
                  className="flex-1 min-w-[160px] px-2.5 py-1.5 text-xs bg-[var(--bg-elevated)] border border-[var(--border-hairline)] rounded"
                />
                <button
                  type="button"
                  onClick={handleAddLifeEvent}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--text-muted)] rounded"
                >
                  <Plus className="w-3 h-3" />
                  <span>Event Telh</span>
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );

  if (!isModal) {
    return (
      <div className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 rounded-md">
        {content}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${person.fullName} DNA Dossier`}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 sm:p-8 rounded-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
