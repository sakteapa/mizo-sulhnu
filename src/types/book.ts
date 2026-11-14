export type ReadingTheme = "paper" | "sepia" | "night";

export type CanvasMode = "read" | "edit" | "focus";

export type UserRole = "admin" | "contributor" | "reader";

export type StudioView =
  | "manuscript"
  | "dna"
  | "codex"
  | "gallery"
  | "upload"
  | "admin"
  | "submissions";

export type LoreRealm =
  | "vanchung"
  | "lasi_nature"
  | "monsters_spirits"
  | "dawi_magic"
  | "afterlife"
  | "kings_rulers"
  | "heroes_folklore";

export interface LoreEntity {
  id: string;
  title: string;
  aliases: string[];
  realm: LoreRealm;
  rarity: "Legendary" | "Mythic" | "Ancient" | "Folk";
  tagline: string;
  iconName: string;
  powers: string[];
  weaknessOrTaboo: string;
  lore: string;
  connectedEntityIds: string[];
  chapterRefs: { bookId: string; chapterId: number; label: string }[];
  secretClue: string;
  riddleOrHlado?: string;
}

export type GlossaryCategory =
  | "chief"
  | "clan"
  | "warrior"
  | "place"
  | "folklore";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type VerificationStatus =
  | "verified_history"
  | "verified_colonial"
  | "oral_tradition"
  | "needs_review";

export type IntegritySeverity = "clean" | "minor_discrepancy" | "high_risk";

export type SubmissionStatus = "approved" | "flagged_to_admin" | "rejected";

export interface IntegrityFlag {
  category: "historical_conflict" | "biological_timeline" | "spam_vandalism";
  severity: "minor_discrepancy" | "high_risk";
  targetName: string;
  summaryMizoEnglish: string;
  detail: string;
}

export interface ChapterRevision {
  id: string;
  label: string;
  content: string;
  createdAt: number;
  note?: string;
}

export interface ChapterData {
  id: number;
  bungLabel: string;
  title: string;
  eraOrTheme: string;
  summary: string;
  keyFigures: string[];
  content: string;
  customFocus: string;
  updatedAt: number | null;
  revisions: ChapterRevision[];
  activeRevisionId: string;
}

export interface BookProject {
  id: string;
  title: string;
  subtitle: string;
  mode: "master" | "single_story";
  topicFocus?: string;
  chapters: ChapterData[];
  createdAt: number;
}

export interface GlossaryEntry {
  id: string;
  name: string;
  category: GlossaryCategory;
  mizoDescription: string;
  chapterNumbers: number[];
  isCustom?: boolean;
}

export interface LifeEvent {
  id: string;
  year: string;
  title: string;
  category:
    | "birth"
    | "education"
    | "marriage"
    | "migration"
    | "church"
    | "war"
    | "expedition"
    | "treaty"
    | "achievement"
    | "other";
  description: string;
  location?: string;
}

export interface HealthRecord {
  id: string;
  condition: string;
  notes: string;
  hereditary: boolean;
  recordedYear?: string;
}

export interface PersonNode {
  id: string;
  fullName: string;
  aliases: string[];
  gender: "Male" | "Female" | "Unknown";
  nodeType: "person" | "ancestor" | "folklore" | "clan_founder";
  clan: string;
  subClan?: string;
  villages: string[];
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  ageAtDeath?: string;
  causeOfDeath?: string;
  burialSite?: string;
  bloodGroup: BloodGroup;
  bloodInheritanceNotes?: string;
  healthHistory: HealthRecord[];
  physicalTraits?: string;
  lifeEvents: LifeEvent[];
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
  biography: string;
  verification: VerificationStatus;
  sources: string[];
  chapterRefs: number[];
  updatedAt: number;
}

export interface ClanNode {
  id: string;
  name: string;
  parentClan?: string;
  rootAncestorId?: string;
  originPlace: string;
  migrationRoute: string[];
  description: string;
  verification: VerificationStatus;
}

export interface VillageNode {
  id: string;
  name: string;
  region: string;
  foundedBy?: string;
  era?: string;
  historicalNotes: string;
  verification: VerificationStatus;
}

export interface ConflictItem {
  id: string;
  targetNodeId?: string;
  targetName: string;
  field: string;
  existingValue: string;
  incomingValue: string;
  incomingSource: string;
  status: "pending" | "accepted_incoming" | "kept_existing" | "merged_both";
  resolutionNote?: string;
  createdAt: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  actorRole: UserRole;
  actorName: string;
  action: string;
  sourceName: string;
  summary: string;
  addedCount: number;
  updatedCount: number;
  conflictsDetected: number;
}

export interface HistoricalEventNode {
  id: string;
  year: string;
  title: string;
  category:
    | "war"
    | "expedition"
    | "famine"
    | "treaty"
    | "migration"
    | "folklore"
    | "administration";
  isFolklore: boolean;
  clansInvolved: string[];
  villagesInvolved: string[];
  peopleInvolved: string[];
  summaryMizo: string;
  sourceCitation: string;
  verification: VerificationStatus;
}

export interface DnaKnowledgeBase {
  people: PersonNode[];
  clans: ClanNode[];
  villages: VillageNode[];
  events?: HistoricalEventNode[];
}

export interface ExtractedIngestPayload {
  people: Array<{
    fullName: string;
    aliases?: string[];
    gender?: "Male" | "Female" | "Unknown";
    clan?: string;
    subClan?: string;
    villages?: string[];
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    ageAtDeath?: string;
    causeOfDeath?: string;
    burialSite?: string;
    bloodGroup?: BloodGroup;
    healthConditions?: Array<{
      condition: string;
      notes: string;
      hereditary?: boolean;
      recordedYear?: string;
    }>;
    lifeEvents?: Array<{
      year: string;
      title: string;
      category?: string;
      description: string;
      location?: string;
    }>;
    parentNames?: string[];
    spouseNames?: string[];
    childrenNames?: string[];
    biography: string;
    verification: VerificationStatus;
  }>;
  clans: Array<{
    name: string;
    parentClan?: string;
    originPlace?: string;
    migrationRoute?: string[];
    description: string;
    verification: VerificationStatus;
  }>;
  villages: Array<{
    name: string;
    region?: string;
    foundedBy?: string;
    era?: string;
    historicalNotes: string;
    verification: VerificationStatus;
  }>;
  events?: Array<{
    year: string;
    title: string;
    category?: string;
    isFolklore?: boolean;
    clansInvolved?: string[];
    villagesInvolved?: string[];
    peopleInvolved?: string[];
    summaryMizo: string;
    sourceCitation?: string;
    verification: VerificationStatus;
  }>;
  conflicts: Array<{
    targetName: string;
    field: string;
    existingValue: string;
    incomingValue: string;
  }>;
  overallSeverity: IntegritySeverity;
  flags: IntegrityFlag[];
  auditReportMizoEnglish: string;
  processingSummary: string;
}

export interface WatchdogAuditResult {
  overallSeverity: IntegritySeverity;
  flags: IntegrityFlag[];
  auditReportMizoEnglish: string;
}

export interface SubmissionRecord {
  id: string;
  submittedAt: number;
  submittedByRole: UserRole;
  submitterName: string;
  submissionType: "document_upload" | "chapter_edit" | "person_entry";
  sourceName: string;
  summary: string;
  auditReportMizoEnglish: string;
  overallSeverity: IntegritySeverity;
  flags: IntegrityFlag[];
  status: SubmissionStatus;
  extractedPayload?: ExtractedIngestPayload;
  chapterPatch?: {
    bookId: string;
    chapterId: number;
    chapterTitle: string;
    previousContent: string;
    proposedContent: string;
  };
  personPatch?: PersonNode;
  snapshotBeforeKb?: DnaKnowledgeBase;
  snapshotBeforeBooks?: BookProject[];
  adminNotes?: string;
  reviewedAt?: number;
  rolledBack?: boolean;
}
