import type {
  BloodGroup,
  ClanNode,
  ConflictItem,
  DnaKnowledgeBase,
  ExtractedIngestPayload,
  HealthRecord,
  HistoricalEventNode,
  LifeEvent,
  PersonNode,
  VerificationStatus,
  VillageNode,
} from "../types/book";

export interface TraceLayer {
  depth: number;
  nodes: PersonNode[];
}

export function traceForwardDescendants(
  rootId: string,
  people: PersonNode[],
  maxDepth = 8
): TraceLayer[] {
  const byId = new Map(people.map((p) => [p.id, p]));
  const root = byId.get(rootId);
  if (!root) return [];

  const visited = new Set<string>([root.id]);
  const layers: TraceLayer[] = [{ depth: 0, nodes: [root] }];

  let currentIds = [root.id];
  for (let d = 1; d <= maxDepth; d++) {
    const nextNodes: PersonNode[] = [];
    const nextIds: string[] = [];
    for (const id of currentIds) {
      const node = byId.get(id);
      if (!node) continue;
      // Children referenced explicitly or via parentIds reverse lookup
      const childSet = new Set<string>(node.childrenIds);
      for (const candidate of people) {
        if (candidate.parentIds.includes(id)) {
          childSet.add(candidate.id);
        }
      }
      for (const childId of childSet) {
        if (!visited.has(childId)) {
          const child = byId.get(childId);
          if (child) {
            visited.add(childId);
            nextNodes.push(child);
            nextIds.push(childId);
          }
        }
      }
    }
    if (nextNodes.length === 0) break;
    layers.push({ depth: d, nodes: nextNodes });
    currentIds = nextIds;
  }

  return layers;
}

export function traceReverseAncestors(
  startId: string,
  people: PersonNode[],
  maxDepth = 10
): TraceLayer[] {
  const byId = new Map(people.map((p) => [p.id, p]));
  const start = byId.get(startId);
  if (!start) return [];

  const visited = new Set<string>([start.id]);
  const layers: TraceLayer[] = [{ depth: 0, nodes: [start] }];

  let currentIds = [start.id];
  for (let d = 1; d <= maxDepth; d++) {
    const nextNodes: PersonNode[] = [];
    const nextIds: string[] = [];
    for (const id of currentIds) {
      const node = byId.get(id);
      if (!node) continue;
      const parentSet = new Set<string>(node.parentIds);
      for (const candidate of people) {
        if (candidate.childrenIds.includes(id)) {
          parentSet.add(candidate.id);
        }
      }
      for (const pId of parentSet) {
        if (!visited.has(pId)) {
          const p = byId.get(pId);
          if (p) {
            visited.add(pId);
            nextNodes.push(p);
            nextIds.push(pId);
          }
        }
      }
    }
    if (nextNodes.length === 0) break;
    layers.push({ depth: d, nodes: nextNodes });
    currentIds = nextIds;
  }

  return layers;
}

export interface PathStep {
  node: PersonNode;
  relationFromPrev: string;
}

export function findRelationshipPath(
  sourceId: string,
  targetId: string,
  people: PersonNode[]
): PathStep[] | null {
  if (sourceId === targetId) {
    const single = people.find((p) => p.id === sourceId);
    return single ? [{ node: single, relationFromPrev: "Start" }] : null;
  }

  const byId = new Map(people.map((p) => [p.id, p]));
  if (!byId.has(sourceId) || !byId.has(targetId)) return null;

  interface Edge {
    toId: string;
    label: string;
  }

  const adj = new Map<string, Edge[]>();
  const addEdge = (from: string, to: string, label: string) => {
    const list = adj.get(from) ?? [];
    list.push({ toId: to, label });
    adj.set(from, list);
  };

  for (const p of people) {
    for (const parentId of p.parentIds) {
      if (byId.has(parentId)) {
        addEdge(p.id, parentId, "Thlahtu / Nu leh Pa (Parent)");
        addEdge(parentId, p.id, "Thlah / Fa (Child)");
      }
    }
    for (const childId of p.childrenIds) {
      if (byId.has(childId)) {
        addEdge(p.id, childId, "Thlah / Fa (Child)");
        addEdge(childId, p.id, "Thlahtu / Nu leh Pa (Parent)");
      }
    }
    for (const spouseId of p.spouseIds) {
      if (byId.has(spouseId)) {
        addEdge(p.id, spouseId, "Nupui / Pasal (Spouse)");
      }
    }
  }

  // Secondary clan & shared village bridges
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i];
      const b = people[j];
      const alreadyLinked = (adj.get(a.id) ?? []).some(
        (e) => e.toId === b.id
      );
      if (alreadyLinked) continue;

      if (a.clan && b.clan && a.clan.toLowerCase() === b.clan.toLowerCase()) {
        addEdge(a.id, b.id, `Hnam Peng Khat (${a.clan})`);
        addEdge(b.id, a.id, `Hnam Peng Khat (${a.clan})`);
      } else {
        const sharedVillage = a.villages.find((v) =>
          b.villages.some((bv) => bv.toLowerCase() === v.toLowerCase())
        );
        if (sharedVillage) {
          addEdge(a.id, b.id, `Khaw Khat (${sharedVillage})`);
          addEdge(b.id, a.id, `Khaw Khat (${sharedVillage})`);
        }
      }
    }
  }

  const queue: string[] = [sourceId];
  const visited = new Set<string>([sourceId]);
  const parentMap = new Map<string, { prevId: string; label: string }>();

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) {
      const path: PathStep[] = [];
      let trace: string | undefined = targetId;
      while (trace) {
        const node = byId.get(trace)!;
        const link = parentMap.get(trace);
        path.unshift({
          node,
          relationFromPrev: link ? link.label : "Inṭanna (Start)",
        });
        trace = link?.prevId;
      }
      return path;
    }

    for (const edge of adj.get(curr) ?? []) {
      if (!visited.has(edge.toId)) {
        visited.add(edge.toId);
        parentMap.set(edge.toId, { prevId: curr, label: edge.label });
        queue.push(edge.toId);
      }
    }
  }

  return null;
}

// ABO/Rh Compatibility: Can `donor` donate RBCs to `recipient`?
export function isCompatibleBloodDonor(
  donor: BloodGroup,
  recipient: BloodGroup
): boolean {
  if (donor === "Unknown" || recipient === "Unknown") return false;
  const parse = (bg: string) => ({
    abo: bg.replace(/[+-]/, ""),
    rh: bg.endsWith("+") ? "+" : "-",
  });
  const d = parse(donor);
  const r = parse(recipient);

  if (d.rh === "+" && r.rh === "-") return false;
  if (d.abo === "O") return true;
  if (d.abo === "A") return r.abo === "A" || r.abo === "AB";
  if (d.abo === "B") return r.abo === "B" || r.abo === "AB";
  if (d.abo === "AB") return r.abo === "AB";
  return false;
}

export interface FamilyHealthAnalysis {
  parents: PersonNode[];
  siblings: PersonNode[];
  children: PersonNode[];
  spouses: PersonNode[];
  compatibleDonors: PersonNode[];
  hereditaryPatterns: Array<{
    condition: string;
    members: string[];
  }>;
}

export function analyzeFamilyBloodAndHealth(
  person: PersonNode,
  people: PersonNode[]
): FamilyHealthAnalysis {
  const byId = new Map(people.map((p) => [p.id, p]));

  const parentSet = new Set<string>(person.parentIds);
  const childSet = new Set<string>(person.childrenIds);
  const spouseSet = new Set<string>(person.spouseIds);

  for (const p of people) {
    if (p.childrenIds.includes(person.id)) parentSet.add(p.id);
    if (p.parentIds.includes(person.id)) childSet.add(p.id);
    if (p.spouseIds.includes(person.id)) spouseSet.add(p.id);
  }

  const parents = Array.from(parentSet)
    .map((id) => byId.get(id))
    .filter((p): p is PersonNode => Boolean(p));
  const children = Array.from(childSet)
    .map((id) => byId.get(id))
    .filter((p): p is PersonNode => Boolean(p));
  const spouses = Array.from(spouseSet)
    .map((id) => byId.get(id))
    .filter((p): p is PersonNode => Boolean(p));

  const siblings = people.filter(
    (other) =>
      other.id !== person.id &&
      other.parentIds.some((pid) => parentSet.has(pid))
  );

  const familyCircle = [...parents, ...siblings, ...children, ...spouses];
  const compatibleDonors = familyCircle.filter((rel) =>
    isCompatibleBloodDonor(rel.bloodGroup, person.bloodGroup)
  );

  const conditionMap = new Map<string, Set<string>>();
  for (const member of [person, ...familyCircle]) {
    for (const rec of member.healthHistory) {
      if (!rec.condition.trim()) continue;
      const key = rec.condition.trim();
      const set = conditionMap.get(key) ?? new Set<string>();
      set.add(member.fullName);
      conditionMap.set(key, set);
    }
  }

  const hereditaryPatterns = Array.from(conditionMap.entries()).map(
    ([condition, members]) => ({
      condition,
      members: Array.from(members),
    })
  );

  return {
    parents,
    siblings,
    children,
    spouses,
    compatibleDonors,
    hereditaryPatterns,
  };
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(pu|pi|upa|lal|brig\.?)\s+/i, "")
    .replace(/[^a-z0-9]/g, "");
}

const VALID_BLOOD_GROUPS = new Set<BloodGroup>([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
]);

function normalizeVerification(v?: string): VerificationStatus {
  if (
    v === "verified_history" ||
    v === "verified_colonial" ||
    v === "oral_tradition" ||
    v === "needs_review"
  ) {
    return v;
  }
  return "needs_review";
}

export function mergeExtractedIntoKnowledgeBase(
  current: DnaKnowledgeBase,
  extracted: ExtractedIngestPayload,
  sourceName: string
): {
  nextKb: DnaKnowledgeBase;
  addedCount: number;
  updatedCount: number;
  newConflicts: ConflictItem[];
} {
  const people = [...current.people];
  const clans = [...current.clans];
  const villages = [...current.villages];
  const events: HistoricalEventNode[] = [...(current.events || [])];
  let addedCount = 0;
  let updatedCount = 0;

  const findPersonByName = (name: string) => {
    const norm = normalizeName(name);
    return people.find(
      (p) =>
        normalizeName(p.fullName) === norm ||
        p.aliases.some((a) => normalizeName(a) === norm)
    );
  };

  // Pass 1: Add or update people
  const nameToId = new Map<string, string>();
  for (const p of people) {
    nameToId.set(normalizeName(p.fullName), p.id);
  }

  for (const item of extracted.people || []) {
    const existing = findPersonByName(item.fullName);
    const blood: BloodGroup = VALID_BLOOD_GROUPS.has(
      item.bloodGroup as BloodGroup
    )
      ? (item.bloodGroup as BloodGroup)
      : "Unknown";

    const incomingHealth: HealthRecord[] = (item.healthConditions || []).map(
      (h, idx) => ({
        id: `hr-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        condition: h.condition,
        notes: h.notes,
        hereditary: Boolean(h.hereditary),
        recordedYear: h.recordedYear,
      })
    );

    const incomingEvents: LifeEvent[] = (item.lifeEvents || []).map(
      (ev, idx) => ({
        id: `ev-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        year: ev.year || "?",
        title: ev.title,
        category:
          (ev.category as LifeEvent["category"]) || "other",
        description: ev.description,
        location: ev.location,
      })
    );

    if (existing) {
      const mergedVillages = Array.from(
        new Set([...existing.villages, ...(item.villages || [])])
      );
      const mergedHealth = [...existing.healthHistory];
      for (const h of incomingHealth) {
        if (
          !mergedHealth.some(
            (eh) => eh.condition.toLowerCase() === h.condition.toLowerCase()
          )
        ) {
          mergedHealth.push(h);
        }
      }
      const mergedEvents = [...existing.lifeEvents];
      for (const ev of incomingEvents) {
        if (
          !mergedEvents.some(
            (ee) => ee.title.toLowerCase() === ev.title.toLowerCase()
          )
        ) {
          mergedEvents.push(ev);
        }
      }

      const idx = people.findIndex((p) => p.id === existing.id);
      people[idx] = {
        ...existing,
        aliases: Array.from(
          new Set([...existing.aliases, ...(item.aliases || [])])
        ),
        clan: existing.clan || item.clan || "Lusei",
        subClan: existing.subClan || item.subClan,
        villages: mergedVillages,
        birthDate: existing.birthDate || item.birthDate,
        birthPlace: existing.birthPlace || item.birthPlace,
        deathDate: existing.deathDate || item.deathDate,
        ageAtDeath: existing.ageAtDeath || item.ageAtDeath,
        causeOfDeath: existing.causeOfDeath || item.causeOfDeath,
        burialSite: existing.burialSite || item.burialSite,
        bloodGroup:
          existing.bloodGroup !== "Unknown" ? existing.bloodGroup : blood,
        healthHistory: mergedHealth,
        lifeEvents: mergedEvents,
        biography:
          item.biography.length > existing.biography.length
            ? item.biography
            : existing.biography,
        sources: Array.from(new Set([...existing.sources, sourceName])),
        updatedAt: Date.now(),
      };
      nameToId.set(normalizeName(item.fullName), existing.id);
      updatedCount++;
    } else {
      const newId = `person-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;
      const newNode: PersonNode = {
        id: newId,
        fullName: item.fullName.trim(),
        aliases: item.aliases || [],
        gender:
          item.gender === "Male" || item.gender === "Female"
            ? item.gender
            : "Unknown",
        nodeType: "person",
        clan: item.clan || "Zofate",
        subClan: item.subClan,
        villages: item.villages || [],
        birthDate: item.birthDate,
        birthPlace: item.birthPlace,
        deathDate: item.deathDate,
        ageAtDeath: item.ageAtDeath,
        causeOfDeath: item.causeOfDeath,
        burialSite: item.burialSite,
        bloodGroup: blood,
        healthHistory: incomingHealth,
        lifeEvents: incomingEvents,
        parentIds: [],
        spouseIds: [],
        childrenIds: [],
        biography: item.biography,
        verification: normalizeVerification(item.verification),
        sources: [sourceName],
        chapterRefs: [],
        updatedAt: Date.now(),
      };
      people.push(newNode);
      nameToId.set(normalizeName(item.fullName), newId);
      addedCount++;
    }
  }

  // Pass 2: Link parent / spouse / child names symmetrically in both directions
  for (const item of extracted.people || []) {
    const id = nameToId.get(normalizeName(item.fullName));
    if (!id) continue;
    const targetIdx = people.findIndex((p) => p.id === id);
    if (targetIdx === -1) continue;

    const pIds = new Set(people[targetIdx].parentIds);
    for (const pName of item.parentNames || []) {
      const pid = nameToId.get(normalizeName(pName));
      if (pid && pid !== id) {
        pIds.add(pid);
        const pIdx = people.findIndex((p) => p.id === pid);
        if (pIdx !== -1 && !people[pIdx].childrenIds.includes(id)) {
          people[pIdx] = {
            ...people[pIdx],
            childrenIds: [...people[pIdx].childrenIds, id],
          };
        }
      }
    }

    const sIds = new Set(people[targetIdx].spouseIds);
    for (const sName of item.spouseNames || []) {
      const sid = nameToId.get(normalizeName(sName));
      if (sid && sid !== id) {
        sIds.add(sid);
        const sIdx = people.findIndex((p) => p.id === sid);
        if (sIdx !== -1 && !people[sIdx].spouseIds.includes(id)) {
          people[sIdx] = {
            ...people[sIdx],
            spouseIds: [...people[sIdx].spouseIds, id],
          };
        }
      }
    }

    const cIds = new Set(people[targetIdx].childrenIds);
    for (const cName of item.childrenNames || []) {
      const cid = nameToId.get(normalizeName(cName));
      if (cid && cid !== id) {
        cIds.add(cid);
        const cIdx = people.findIndex((p) => p.id === cid);
        if (cIdx !== -1 && !people[cIdx].parentIds.includes(id)) {
          people[cIdx] = {
            ...people[cIdx],
            parentIds: [...people[cIdx].parentIds, id],
          };
        }
      }
    }

    people[targetIdx] = {
      ...people[targetIdx],
      parentIds: Array.from(pIds),
      spouseIds: Array.from(sIds),
      childrenIds: Array.from(cIds),
    };
  }

  // Clans
  for (const c of extracted.clans || []) {
    const exists = clans.some(
      (ec) => ec.name.toLowerCase() === c.name.trim().toLowerCase()
    );
    if (!exists && c.name.trim()) {
      const newClan: ClanNode = {
        id: `clan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: c.name.trim(),
        parentClan: c.parentClan,
        originPlace: c.originPlace || "Zoram",
        migrationRoute: c.migrationRoute || [],
        description: c.description,
        verification: normalizeVerification(c.verification),
      };
      clans.push(newClan);
      addedCount++;
    }
  }

  // Villages
  for (const v of extracted.villages || []) {
    const exists = villages.some(
      (ev) => ev.name.toLowerCase() === v.name.trim().toLowerCase()
    );
    if (!exists && v.name.trim()) {
      const newVillage: VillageNode = {
        id: `village-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: v.name.trim(),
        region: v.region || "Mizoram",
        foundedBy: v.foundedBy,
        era: v.era,
        historicalNotes: v.historicalNotes,
        verification: normalizeVerification(v.verification),
      };
      villages.push(newVillage);
      addedCount++;
    }
  }

  // Historical Events & Oral Traditions
  const validEventCats = new Set<HistoricalEventNode["category"]>([
    "war",
    "expedition",
    "famine",
    "treaty",
    "migration",
    "folklore",
    "administration",
  ]);
  for (const ev of extracted.events || []) {
    if (!ev.title || !ev.title.trim()) continue;
    const exists = events.some(
      (ee) =>
        ee.title.toLowerCase() === ev.title.trim().toLowerCase() &&
        ee.year === (ev.year || "").trim()
    );
    if (!exists) {
      const cat = validEventCats.has(
        ev.category as HistoricalEventNode["category"]
      )
        ? (ev.category as HistoricalEventNode["category"])
        : ev.isFolklore
        ? "folklore"
        : "war";
      events.push({
        id: `hist-ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        year: (ev.year || "Hmanlai").trim(),
        title: ev.title.trim(),
        category: cat,
        isFolklore: Boolean(ev.isFolklore || cat === "folklore"),
        clansInvolved: ev.clansInvolved || [],
        villagesInvolved: ev.villagesInvolved || [],
        peopleInvolved: ev.peopleInvolved || [],
        summaryMizo: ev.summaryMizo || "",
        sourceCitation: ev.sourceCitation || sourceName,
        verification: normalizeVerification(ev.verification),
      });
      addedCount++;
    }
  }

  const newConflicts: ConflictItem[] = (extracted.conflicts || []).map(
    (conf, idx) => {
      const matchedPerson = findPersonByName(conf.targetName);
      return {
        id: `conflict-${Date.now()}-${idx}`,
        targetNodeId: matchedPerson?.id,
        targetName: conf.targetName,
        field: conf.field,
        existingValue: conf.existingValue,
        incomingValue: conf.incomingValue,
        incomingSource: sourceName,
        status: "pending",
        createdAt: Date.now(),
      };
    }
  );

  return {
    nextKb: { people, clans, villages, events },
    addedCount,
    updatedCount,
    newConflicts,
  };
}

export function dedupeConflicts(
  existing: ConflictItem[],
  incoming: ConflictItem[]
): ConflictItem[] {
  const seen = new Set(
    existing.map(
      (c) =>
        `${c.targetName.trim().toLowerCase()}::${c.field
          .trim()
          .toLowerCase()}::${c.incomingValue.trim().toLowerCase()}`
    )
  );
  const uniqueIncoming: ConflictItem[] = [];
  for (const item of incoming) {
    const sig = `${item.targetName.trim().toLowerCase()}::${item.field
      .trim()
      .toLowerCase()}::${item.incomingValue.trim().toLowerCase()}`;
    if (!seen.has(sig)) {
      seen.add(sig);
      uniqueIncoming.push(item);
    }
  }
  return [...uniqueIncoming, ...existing];
}
