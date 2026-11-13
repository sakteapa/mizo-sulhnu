import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = "gemini-4-hydrogen";

function createAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please check your environment secrets."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function buildStorytellerSystemInstruction(
  includeObscureDetails: boolean,
  bookTitle?: string
): string {
  const obscureDirective = includeObscureDetails
    ? `
OBSCURE & GRASSROOTS ORAL HISTORY MANDATE (ACTIVE):
- You MUST actively weave in lesser-known hill villages (khua hlui), sub-clans (chi leh kuang peng hrang hrangte—such as Hnamte, Ralte pengte, Khiangte, Chawngthu, Pachuau, Fanai, Chhakchhuak, Tochhawng, Vangchhia, Ngente, Sailo khaw per, Lai/Mara/Hmar peng te), unsung local warriors (pasaltha hmingthang lem lo te), local bawlpu/sadawt lineages, and grassroots oral traditions (upate titi leh kâ-a inhlanchhawn thu).
- Do not focus solely on the famous paramount chiefs; illuminate the lives of ordinary villagers, women, craftsmen (thirdeng, puantah thiam), and forgotten frontier hamlets.`
    : "";

  const targetBook =
    bookTitle?.trim() || "ZOFATE SULHNU: Tobul, Lalte, Thawnthu leh Chanchin Ril";

  return `You are a master Mizo historian, genealogist, elder, and literary storyteller sitting beside a warm Zawlbuk hearth, composing the definitive Mizo book titled "${targetBook}".

LANGUAGE & LITERARY STYLE (NON-NEGOTIABLE):
- Write STRICTLY in rich, poetic, literary Mizo (Duhlian tawng). Use proper Mizo orthography (including 'ṭ'/'Ṭ' or traditional literary spelling consistently and naturally), evocative idioms (tawngkam upa), proverbs (thufing), and rhythmic narrative cadence.
- Never write in English except for proper historical dates or universally recognized archival terms if strictly necessary inside parentheses (e.g. 1894, LADC/MADC). The prose itself MUST be 100% authentic literary Mizo.
- Write like a master storyteller around a Zawlbuk fire: vivid sensory imagery (meipui alh hlep hlep, chhum zing chiai, tlangram thlifim, dar ri ral ral), deep emotion, psychological suspense, and dramatic pacing.
- Include authentic, lively dialogues (inhnialna, khawtlang titi, lalte rorelna thu) in quotation marks.
- Weave in traditional chants, songs, and heroic cries (Hla hlui, Bawh hla, Hlado, Thuro chhiah, or Dawn hla) formatted as Markdown blockquotes (> ...).
- Include deep historical, sociological, and cultural analysis sections titled "### Thlirzauna" where you examine the deeper meaning, clan dynamics, moral philosophy (Tlawmngaihna, Hnatlang, Ram leh Hnam humhalhna), and historical consequences.

EXHAUSTIVE LENGTH & STRUCTURE MANDATE:
- NEVER summarize. NEVER write brief bullet-point outlines. NEVER skip scenes.
- Write exhaustive, deeply detailed, long-form narrative prose targeting 2,000 to 3,000+ words per generation.
- Use clean Markdown structure:
  - Use "## " for major chapter sections.
  - Use "### " for sub-scenes and "### Thlirzauna" analytical essays.
  - Use ">" blockquotes strictly for traditional Mizo chants (Hla hlui, Bawh hla, Hlado) and timeless elder proverbs.
  - Use "---" sparingly between major dramatic movements.
- Do not repeat the chapter title at the very top as an H1; start directly with an evocative literary opening or the first "## " section heading.${obscureDirective}`;
}

interface GenerateRequestBody {
  bookTitle?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  chapterSummary?: string;
  keyFigures?: string[];
  mode?: "generate" | "expand";
  includeObscureDetails?: boolean;
  existingContent?: string;
  customFocus?: string;
}

interface GlossaryExtractBody {
  chapters?: Array<{
    id: number;
    title: string;
    content: string;
  }>;
}

interface IngestParseBody {
  rawText?: string;
  sourceName?: string;
  extractionMode?: "auto" | "mizo_history" | "english_colonial";
  batchSectionInstruction?: string;
  fileBase64?: string;
  fileMimeType?: string;
  imageBase64?: string;
  imageMimeType?: string;
  existingPeopleSummary?: Array<{
    fullName: string;
    aliases?: string[];
    clan: string;
    birthDate?: string;
    deathDate?: string;
    bloodGroup?: string;
    villages?: string[];
  }>;
}

interface WatchdogAuditBody {
  submissionType?: "chapter_edit" | "person_entry";
  titleOrName?: string;
  contentOrDetails?: string;
  existingContext?: string;
}

interface ReverseTraceBody {
  query?: string;
  clanHint?: string;
  villageHint?: string;
}

function formatGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("403") || raw.includes("PERMISSION_DENIED")) {
    return {
      status: 403,
      message:
        "Gemini API permission denied. Please verify your GEMINI_API_KEY in Settings > Secrets.",
    };
  }
  if (raw.includes("400") || raw.includes("API_KEY_INVALID")) {
    return {
      status: 400,
      message:
        "Invalid Gemini API key or malformed request. Please check Settings > Secrets.",
    };
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Gemini API rate limit or quota reached. Please wait a moment and try again.",
    };
  }
  return {
    status: 500,
    message: raw || "An unexpected error occurred while calling Gemini API.",
  };
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: "25mb" }));

  // Normalize path across local dev and Vercel serverless environments
  app.use((req: Request, _res: Response, next) => {
    let url = req.url || "/";
    if (url.startsWith("/api/index")) {
      url = url.replace(/^\/api\/index/, "/api");
    }
    if (url === "/api" || url === "/api/" || url === "/" || !url) {
      url = "/api/health";
    } else if (!url.startsWith("/api/")) {
      url = "/api" + (url.startsWith("/") ? url : "/" + url);
    }
    req.url = url;
    next();
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // 1. Streaming Literary Mizo Chapter Generator & Expander
  app.post("/api/chapters/generate", async (req: Request, res: Response) => {
    const body = req.body as GenerateRequestBody;
    const bookTitle = (body.bookTitle || "").trim();
    const chapterNumber = Number(body.chapterNumber) || 1;
    const chapterTitle = (body.chapterTitle || "").trim();
    const chapterSummary = (body.chapterSummary || "").trim();
    const keyFigures = Array.isArray(body.keyFigures) ? body.keyFigures : [];
    const mode = body.mode === "expand" ? "expand" : "generate";
    const includeObscureDetails = Boolean(body.includeObscureDetails);
    const existingContent = (body.existingContent || "").trim();
    const customFocus = (body.customFocus || "").trim();

    if (!chapterTitle) {
      res.status(400).json({ error: "Chapter title is required." });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const sendEvent = (payload: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    try {
      const ai = createAiClient();
      const systemInstruction = buildStorytellerSystemInstruction(
        includeObscureDetails,
        bookTitle
      );

      let prompt = "";
      if (mode === "expand" && existingContent.length > 0) {
        const tailContext =
          existingContent.length > 7000
            ? existingContent.slice(existingContent.length - 7000)
            : existingContent;

        prompt = `Tunah hian "${
          bookTitle || "ZOFATE SULHNU"
        }" bu-a Bung ${chapterNumber}: "${chapterTitle}" tih chu chhunzawm leh tihzauh (Expand & Deepen) a ngai a ni.

THU KAWNGHMANG LEH CHHUNG THU TUR:
${chapterSummary}
Mi hmingthang leh thu pawimawh tel turte: ${keyFigures.join(", ")}
${customFocus ? `Ziaktu duhdan bik (Author Focus): ${customFocus}` : ""}

A HNUAIAH HIAN TUN HMA ZIAH SA TAWP LAM A AWM E:
"""
${tailContext}
"""

TIH TUR PAWIMAWH:
1. A chunga ziah sa hi tawi te pawhin ziak nawn (repeat) suh. A ziah sa tawpna aṭang khan thiam takin zawm chho la, thawnthu leh chanchin la inphum ru zawng zawngte rawn hai chhuak zel rawh.
2. Scene thar, hmun leh khua hlui chanchin chipchiar zawkte, mi naran leh pasaltha hmingthang lo zawkte thawnthu, inbiakna (dialogues) nung tak takte, Hla hlui / Bawh hla / Hlado te rawn telh belh rawh.
3. "### Thlirzauna" tih thupui hmangin chanchin zirchianna ril tak rawn dah belh bawk rawh.
4. Thumal 2,000 aṭanga 2,500 chuang talin ziak sei leh belh rawh.`;
      } else {
        prompt = `Tunah hian "${
          bookTitle || "ZOFATE SULHNU: Tobul, Lalte, Thawnthu leh Chanchin Ril"
        }" bu-a Bung ${chapterNumber} hi a bul aṭangin kimchang leh ril em emin ziak chhuak rawh.

BUNG ${chapterNumber} THUPUI: ${chapterTitle}
BUNG TLANGPUI LEH HUAM CHIN: ${chapterSummary}
TELH NGEI TUR MI PAWIMAWH, HNAM LEH HMUNTE: ${keyFigures.join(", ")}
${customFocus ? `ZIAKTU DUHDAN BIK (Author Focus): ${customFocus}` : ""}

TIH TUR PAWIMAWH:
1. Bung chhung thu hi then hrangin (## sub-headings hmangin) chanchin kipkawi takin ziak chhuak vek rawh; telh tur tarlan te pakhat mah hmaih suh.
2. Zawlbuk mei lum bula upa thu thiam takin tlangvalte hnena chanchin a hrilh ang maiin, rilru khawih tak, mitthlaa lang uar uar thei turin, inbiakna (dialogue) nung tak tak nen ziak rawh.
3. Hla hlui, Bawh hla, Hlado, leh thufingte chu blockquote (> ...) hmangin rawn zep lut zel rawh.
4. Bung tawp lamah emaw, thupui pawimawh zawhah "### Thlirzauna" dah zelin, hnam nunphung, rorelna, leh khawvel thlirna ril tak rawn chhep chhuak rawh.
5. Thumal 2,200 aṭanga 3,000+ thlengin tawi lovin, chipchiar leh belhchian dawl takin ziak chhuak rawh.`;
      }

      const stream = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          sendEvent({ text });
        }
      }

      sendEvent({ done: true });
      res.end();
    } catch (err) {
      const formatted = formatGeminiError(err);
      sendEvent({ error: formatted.message, status: formatted.status });
      res.end();
    }
  });

  // 2. Book Glossary Extractor
  app.post("/api/glossary/extract", async (req: Request, res: Response) => {
    const body = req.body as GlossaryExtractBody;
    const chapters = Array.isArray(body.chapters)
      ? body.chapters.filter((c) => c.content && c.content.trim().length > 40)
      : [];

    if (chapters.length === 0) {
      res.json({ entries: [] });
      return;
    }

    try {
      const ai = createAiClient();
      const combinedContext = chapters
        .map((c) => {
          const snippet =
            c.content.length > 5500 ? c.content.slice(0, 5500) : c.content;
          return `[BUNG ${c.id}: ${c.title}]\n${snippet}`;
        })
        .join("\n\n---\n\n");

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `A hnuaia Mizo lehkhabu bung ziah tawhte aṭang hian Lalte, Hnam leh Chi pengte, Pasalthate, Khua leh Hmun hmingte, leh Thawnthu pawimawhte thlifim la JSON array-in pe chhuak rawh.

MANUSCRIPT TEXT:
${combinedContext}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                mizoDescription: { type: Type.STRING },
                chapterNumbers: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                },
              },
              required: [
                "name",
                "category",
                "mizoDescription",
                "chapterNumbers",
              ],
            },
          },
        },
      });

      const jsonText = (response.text || "[]").trim();
      const parsed = JSON.parse(jsonText);
      res.json({ entries: Array.isArray(parsed) ? parsed : [] });
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 3. Multimodal Document/PDF/Image OCR Parser + AI Integrity Watchdog
  app.post("/api/ingest/parse", async (req: Request, res: Response) => {
    const body = req.body as IngestParseBody;
    const rawText = (body.rawText || "").trim();
    const fileBase64 = (body.fileBase64 || body.imageBase64 || "").trim();
    const fileMimeType = (
      body.fileMimeType ||
      body.imageMimeType ||
      "image/jpeg"
    ).trim();
    const sourceName = (body.sourceName || "Uploaded Document").trim();
    const extractionMode = body.extractionMode || "auto";
    const batchSectionInstruction = (body.batchSectionInstruction || "").trim();
    const existingPeople = Array.isArray(body.existingPeopleSummary)
      ? body.existingPeopleSummary
      : [];

    if (!rawText && !fileBase64) {
      res
        .status(400)
        .json({ error: "Please provide text or upload a PDF/image/document." });
      return;
    }

    try {
      const ai = createAiClient();

      const existingSnapshot = existingPeople
        .slice(0, 100)
        .map(
          (p) =>
            `${p.fullName}${
              p.aliases && p.aliases.length > 0
                ? ` [Aliases: ${p.aliases.join(", ")}]`
                : ""
            } (Clan: ${p.clan}, DOB: ${p.birthDate || "?"}, DOD: ${
              p.deathDate || "?"
            }, Blood: ${p.bloodGroup || "Unknown"}, Villages: ${(
              p.villages || []
            ).join("/")})`
        )
        .join("\n");

      const modeDirective =
        extractionMode === "english_colonial"
          ? `
ACTIVE MODE — ENGLISH COLONIAL ARCHIVES (1871–1942) -> LITERARY MIZO:
- Translate ALL extracted biographies, event summaries ("summaryMizo"), and village "historicalNotes" into clear, accurate, literary Mizo (Duhlian tawng). Never leave descriptions or summaries in raw English!
- STANDARDIZE MIZO SPELLINGS while keeping the exact original colonial spelling in the person's "aliases" array (and mention in village historicalNotes) so search works for both:
  Examples: "Lallul" -> "Lallula", "Vanolel"/"Vonolel" -> "Vanhnuailiana", "Rutton Poia"/"Rutton Poea" -> "Rothangpuia", "Sookpilal"/"Sukpilal" -> "Suakpuilala", "Vonpilal" -> "Vanpuilala", "Howsatta" -> "Hausata", "Dokoola" -> "Dokulha", "Jakopa" -> "Zakapa", "Koangcherra" -> "Khuangchera", "Lungleh" -> "Lunglei", "Aijal" -> "Aizawl", "Champai" -> "Champhai", "Saiha"/"Shiha" -> "Siaha", "Lakher" -> "Mara", "Pawi"/"Poi" -> "Lai".
- Pay special attention to South Lushai Hills (Chhim lam), Lai (Pawi), Mara (Lakher), and Chin Hills chiefs, boundary disputes, expeditions (Vailian), treaties (Sanad), and village administration records (1871–1942).
- Tag every colonial-sourced person, clan, village, and event with verification: "verified_colonial" (unless it contradicts an existing oral tradition/DB record, in which case also emit a conflict entry and flag for Admin Audit Queue).`
          : extractionMode === "mizo_history"
          ? `
ACTIVE MODE — MIZO HISTORICAL ARCHIVE ("Mizo Chanchin" / Rev. Liangkhaia Style):
- Extract EVERY chief (Lal), warrior (Pasaltha), poet (Hla phuahtu), prophet (Zawlnei), and ordinary person mentioned (from famous chiefs down to obscure villagers).
- Map full genealogy: parentNames, spouseNames, childrenNames (Parent -> Child -> Descendant), plus birthDate, deathDate, causeOfDeath, and healthConditions if stated.
- Extract clans (Lusei, Sailo, Zadeng, Palian, Thangluah, Rivung, Rokhum, Lai, Mara, Hmar, Paite, Ralte, Fanai, Ngente, Khiangte, etc.) with originPlace and migrationRoute, and villages with founding year ("era") and founder ("foundedBy").
- Extract dated events (wars, raids, Mautam/Thingtam famines) cleanly separated from oral folklore (set "isFolklore": true and category "folklore" for myths/folktales, false for dated historical events).
- Tag reliable historical records as "verified_history" and oral traditions as "oral_tradition", while flagging any contradiction with EXISTING DATABASE RECORDS into "conflicts" and "flags".`
          : `
ACTIVE MODE — AUTO-DETECT ARCHIVAL DOCUMENT (Mizo History OR English Colonial Record):
- If the source is in English or contains colonial spellings (1871–1942), translate all biographies/summaries/historicalNotes into literary Mizo (Duhlian tawng), standardize Mizo spellings while keeping original colonial spellings in "aliases", and set verification to "verified_colonial".
- If the source is Mizo history or oral tradition, extract full parent/spouse/child genealogy, clans & migration routes, villages & founders, dated wars/famines (Mautam/Thingtam) separated from folklore ("isFolklore"), and tag "verified_history" or "oral_tradition".`;

      const batchDirective = batchSectionInstruction
        ? `\nBATCH SECTION SCOPE ("Phek / Bung Thlanna"): Focus exhaustively on this requested page range/chapter/section: "${batchSectionInstruction}". Extract every figure, clan, village, and event within that scope cleanly without truncating JSON.`
        : "";

      const instructionPrompt = `You are BOTH a master Mizo historian & genealogist AND the strict **AI Integrity Watchdog** for "ZOFATE DNA CHAIN & SULHNU STUDIO".
Analyze the provided document/PDF/image (Source: "${sourceName}").
${modeDirective}${batchDirective}

PART A — EXHAUSTIVE EXTRACTION:
1. Extract EVERY person mentioned (fullName, aliases, gender, clan, subClan, villages, birthDate, birthPlace, deathDate, ageAtDeath, causeOfDeath, burialSite, Blood Group [A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown], healthConditions, lifeEvents, parentNames, spouseNames, childrenNames, biography [in literary Mizo], verification [verified_history | verified_colonial | oral_tradition | needs_review]).
2. Extract Clans (name, parentClan, originPlace, migrationRoute, description [in literary Mizo], verification) and Villages (name, region, foundedBy, era, historicalNotes [in literary Mizo], verification).
3. Extract Historical Events & Oral Traditions in "events" (year, title [in Mizo], category [war | expedition | famine | treaty | migration | folklore | administration], isFolklore, clansInvolved, villagesInvolved, peopleInvolved, summaryMizo [in literary Mizo], sourceCitation, verification).

PART B — DEEP AI INTEGRITY WATCHDOG AUDIT (RIGOROUSLY CHECK ALL 3 PILLARS):
Cross-check against EXISTING DATABASE RECORDS:
${existingSnapshot || "(Empty database)"}

Check every extracted item for:
1) **Factual & Historical Consistency ("historical_conflict")**: Does it contradict established Mizo history, oral traditions, or existing DB dates/clans/blood groups/credits? List field-level DB mismatches in "conflicts" AND add a flag!
2) **Timeline & Biological Logic ("biological_timeline")**: Check impossible birth/death dates (death before birth, age > 125, parent born after child or <12 years older than child) AND ABO blood genetics (e.g., two O parents cannot biologically produce an A, B, or AB child; two AB parents cannot produce an O child).
3) **Spam, Fabrication & Vandalism Detection ("spam_vandalism")**: Flag keyboard mashing, gibberish, obvious troll/fictional pop-culture names inserted into Mizo history (e.g. "Batman Sailo", "asdfgh"), or malicious attempts to wipe/corrupt records.

Assign:
- "overallSeverity":
  - "high_risk": Major historical contradiction, biological/timeline impossibility, spam/vandalism, or severe conflict.
  - "minor_discrepancy": Minor date/spelling discrepancy, colonial-vs-oral discrepancy, or unverified claim needing Admin review.
  - "clean": Completely consistent, plausible, and conflict-free.
- "flags": Array of detected anomalies with category, severity ("minor_discrepancy" | "high_risk"), targetName, summaryMizoEnglish (clear bilingual label), and detail (explaining WHAT is wrong and WHY in Mizo + English).
- "auditReportMizoEnglish": Detailed bilingual Mizo/English audit report explaining the extraction and watchdog findings.
- "processingSummary": Concise Mizo summary.`;

      const parts: Array<
        { text: string } | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (fileBase64) {
        parts.push({
          inlineData: {
            mimeType: fileMimeType,
            data: fileBase64,
          },
        });
      }

      parts.push({
        text: rawText
          ? `${instructionPrompt}\n\nDOCUMENT TEXT INPUT:\n${rawText}`
          : instructionPrompt,
      });

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              people: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fullName: { type: Type.STRING },
                    aliases: { type: Type.ARRAY, items: { type: Type.STRING } },
                    gender: { type: Type.STRING },
                    clan: { type: Type.STRING },
                    subClan: { type: Type.STRING },
                    villages: { type: Type.ARRAY, items: { type: Type.STRING } },
                    birthDate: { type: Type.STRING },
                    birthPlace: { type: Type.STRING },
                    deathDate: { type: Type.STRING },
                    ageAtDeath: { type: Type.STRING },
                    causeOfDeath: { type: Type.STRING },
                    burialSite: { type: Type.STRING },
                    bloodGroup: { type: Type.STRING },
                    healthConditions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          condition: { type: Type.STRING },
                          notes: { type: Type.STRING },
                          hereditary: { type: Type.BOOLEAN },
                          recordedYear: { type: Type.STRING },
                        },
                        required: ["condition", "notes"],
                      },
                    },
                    lifeEvents: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          year: { type: Type.STRING },
                          title: { type: Type.STRING },
                          category: { type: Type.STRING },
                          description: { type: Type.STRING },
                          location: { type: Type.STRING },
                        },
                        required: ["year", "title", "description"],
                      },
                    },
                    parentNames: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    spouseNames: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    childrenNames: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    biography: { type: Type.STRING },
                    verification: { type: Type.STRING },
                  },
                  required: ["fullName", "biography", "verification"],
                },
              },
              clans: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    parentClan: { type: Type.STRING },
                    originPlace: { type: Type.STRING },
                    migrationRoute: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    description: { type: Type.STRING },
                    verification: { type: Type.STRING },
                  },
                  required: ["name", "description", "verification"],
                },
              },
              villages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    region: { type: Type.STRING },
                    foundedBy: { type: Type.STRING },
                    era: { type: Type.STRING },
                    historicalNotes: { type: Type.STRING },
                    verification: { type: Type.STRING },
                  },
                  required: ["name", "historicalNotes", "verification"],
                },
              },
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    year: { type: Type.STRING },
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    isFolklore: { type: Type.BOOLEAN },
                    clansInvolved: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    villagesInvolved: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    peopleInvolved: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    summaryMizo: { type: Type.STRING },
                    sourceCitation: { type: Type.STRING },
                    verification: { type: Type.STRING },
                  },
                  required: ["year", "title", "summaryMizo", "verification"],
                },
              },
              conflicts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    targetName: { type: Type.STRING },
                    field: { type: Type.STRING },
                    existingValue: { type: Type.STRING },
                    incomingValue: { type: Type.STRING },
                  },
                  required: [
                    "targetName",
                    "field",
                    "existingValue",
                    "incomingValue",
                  ],
                },
              },
              overallSeverity: { type: Type.STRING },
              flags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    targetName: { type: Type.STRING },
                    summaryMizoEnglish: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: [
                    "category",
                    "severity",
                    "targetName",
                    "summaryMizoEnglish",
                    "detail",
                  ],
                },
              },
              auditReportMizoEnglish: { type: Type.STRING },
              processingSummary: { type: Type.STRING },
            },
            required: [
              "people",
              "clans",
              "villages",
              "events",
              "conflicts",
              "overallSeverity",
              "flags",
              "auditReportMizoEnglish",
              "processingSummary",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 4. AI Integrity Watchdog Audit for Chapter Revisions & Manual Person Submissions
  app.post("/api/watchdog/audit-text", async (req: Request, res: Response) => {
    const body = req.body as WatchdogAuditBody;
    const submissionType = body.submissionType || "chapter_edit";
    const titleOrName = (body.titleOrName || "").trim();
    const contentOrDetails = (body.contentOrDetails || "").trim();
    const existingContext = (body.existingContext || "").trim();

    if (!contentOrDetails) {
      res.status(400).json({ error: "Submission content is required for audit." });
      return;
    }

    try {
      const ai = createAiClient();
      const snippet =
        contentOrDetails.length > 8000
          ? contentOrDetails.slice(0, 8000)
          : contentOrDetails;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `You are the **AI Integrity Watchdog** for "ZOFATE DNA CHAIN & SULHNU STUDIO".
Audit this ${submissionType} submission rigorously across 3 criteria:
1. **Factual & Historical Consistency ("historical_conflict")**: Does it contradict Mizo history, clan origins, or existing records?
2. **Timeline & Biological Logic ("biological_timeline")**: Are birth/death dates, ages, or blood group inheritances biologically/chronologically possible?
3. **Spam, Fabrication & Vandalism Detection ("spam_vandalism")**: Detect gibberish, fake names, insults, or vandalism.

TARGET TITLE/NAME: ${titleOrName}
${existingContext ? `EXISTING CONTEXT:\n${existingContext.slice(0, 2500)}` : ""}

SUBMITTED CONTENT:
"""
${snippet}
"""

Return JSON with overallSeverity ("clean" | "minor_discrepancy" | "high_risk"), flags array, and a clear bilingual Mizo/English auditReportMizoEnglish.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSeverity: { type: Type.STRING },
              flags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    targetName: { type: Type.STRING },
                    summaryMizoEnglish: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: [
                    "category",
                    "severity",
                    "targetName",
                    "summaryMizoEnglish",
                    "detail",
                  ],
                },
              },
              auditReportMizoEnglish: { type: Type.STRING },
            },
            required: ["overallSeverity", "flags", "auditReportMizoEnglish"],
          },
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 5. AI-Assisted Reverse Genealogical Tracing
  app.post("/api/dna/trace-reverse", async (req: Request, res: Response) => {
    const body = req.body as ReverseTraceBody;
    const query = (body.query || "").trim();
    const clanHint = (body.clanHint || "").trim();
    const villageHint = (body.villageHint || "").trim();

    if (!query) {
      res
        .status(400)
        .json({ error: "Please enter a name, clan, or village to trace." });
      return;
    }

    try {
      const ai = createAiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `You are a master Mizo genealogist ("Chhuizuina") tracing backward from a modern person, sub-clan, or village to ancestral Mizo chiefs, migration routes, and Chhinlung roots.

QUERY: "${query}"
${clanHint ? `CLAN / HNAM PENG HINT: "${clanHint}"` : ""}
${villageHint ? `VILLAGE / KHUA HINT: "${villageHint}"` : ""}

Reconstruct a plausible, historically grounded step-by-step reverse lineage chain in Mizo from the query back to ancestral clans/chiefs, migration waypoints (e.g., Selesih, Tiau Lui, Khawpui, Chhinlung), and explain the historical connection clearly in Mizo.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lineageSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    name: { type: Type.STRING },
                    roleOrRelation: { type: Type.STRING },
                    clan: { type: Type.STRING },
                    villages: { type: Type.ARRAY, items: { type: Type.STRING } },
                    era: { type: Type.STRING },
                    notesInMizo: { type: Type.STRING },
                    verification: { type: Type.STRING },
                  },
                  required: [
                    "stepNumber",
                    "name",
                    "roleOrRelation",
                    "notesInMizo",
                    "verification",
                  ],
                },
              },
              migrationPath: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              mizoSummary: { type: Type.STRING },
            },
            required: ["lineageSteps", "migrationPath", "mizoSummary"],
          },
        },
      });

      const parsed = JSON.parse((response.text || "{}").trim());
      res.json(parsed);
    } catch (err) {
      const formatted = formatGeminiError(err);
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // 404 fallback handler for API routes to prevent hangs on serverless runtimes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
    });
  });

  return app;
}

const apiApp = createApiApp();

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    apiApp.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    apiApp.use(express.static(distDir));
    apiApp.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  apiApp.listen(PORT, "0.0.0.0", () => {
    console.log(
      `ZOFATE DNA CHAIN & SULHNU STUDIO running on http://0.0.0.0:${PORT}`
    );
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export default apiApp;
