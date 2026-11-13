import React from "react";
import { motion } from "motion/react";
import {
  Flame,
  Scroll,
  ShieldCheck,
  Video as VideoIcon,
  Volume2,
  Sparkles,
} from "lucide-react";

export interface ClickableEntity {
  id: string;
  label: string;
  kind: "person" | "clan" | "village";
}

interface MizoProseRendererProps {
  content: string;
  compact?: boolean;
  entities?: ClickableEntity[];
  onSelectEntity?: (entity: ClickableEntity) => void;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderTextWithEntities(
  text: string,
  entityMap: Map<string, ClickableEntity>,
  entityRegex: RegExp | null,
  onSelectEntity?: (entity: ClickableEntity) => void
): React.ReactNode {
  if (!entityRegex || !onSelectEntity) return text;

  const parts = text.split(entityRegex);
  return parts.map((part, idx) => {
    const matched = entityMap.get(part.toLowerCase());
    if (!matched) return part;
    return (
      <button
        key={`${part}-${idx}`}
        type="button"
        onClick={() => onSelectEntity(matched)}
        title={`En rawh: ${matched.label} (${matched.kind})`}
        className="inline font-inherit text-inherit underline decoration-dotted decoration-[var(--accent-ink)]/70 underline-offset-4 hover:text-[var(--accent-ink)] hover:decoration-solid transition-colors cursor-pointer print:no-underline"
      >
        {part}
      </button>
    );
  });
}

function renderInlineFormatting(
  text: string,
  entityMap: Map<string, ClickableEntity>,
  entityRegex: RegExp | null,
  onSelectEntity?: (entity: ClickableEntity) => void
): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <React.Fragment key={`t-${lastIndex}`}>
          {renderTextWithEntities(
            text.slice(lastIndex, match.index),
            entityMap,
            entityRegex,
            onSelectEntity
          )}
        </React.Fragment>
      );
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong
          key={`b-${match.index}`}
          className="font-semibold text-[var(--text-ink)]"
        >
          {renderTextWithEntities(
            token.slice(2, -2),
            entityMap,
            entityRegex,
            onSelectEntity
          )}
        </strong>
      );
    } else {
      tokens.push(
        <em key={`i-${match.index}`} className="italic">
          {renderTextWithEntities(
            token.slice(1, -1),
            entityMap,
            entityRegex,
            onSelectEntity
          )}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(
      <React.Fragment key={`t-${lastIndex}`}>
        {renderTextWithEntities(
          text.slice(lastIndex),
          entityMap,
          entityRegex,
          onSelectEntity
        )}
      </React.Fragment>
    );
  }

  return tokens;
}

interface ParsedBlock {
  type:
    | "h2"
    | "h3"
    | "thlirzauna"
    | "quote"
    | "hr"
    | "list"
    | "paragraph"
    | "image"
    | "video"
    | "callout_history"
    | "callout_tale"
    | "callout_hlado";
  text: string;
  src?: string;
  title?: string;
  lines?: string[];
}

function parseMarkdownBlocks(raw: string): ParsedBlock[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
      blocks.push({ type: "hr", text: "" });
      i++;
      continue;
    }

    const videoMatch = line.match(/^!video\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (videoMatch) {
      blocks.push({
        type: "video",
        text: videoMatch[1],
        src: videoMatch[2],
      });
      i++;
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
    if (imgMatch) {
      blocks.push({
        type: "image",
        text: imgMatch[1],
        src: imgMatch[2],
        title: imgMatch[3] || imgMatch[1],
      });
      i++;
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("# ")) {
      const clean = line.replace(/^#{1,2}\s+/, "").trim();
      blocks.push({ type: "h2", text: clean });
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      const clean = line.replace(/^###\s+/, "").trim();
      if (clean.toLowerCase().includes("thlirzauna")) {
        blocks.push({ type: "thlirzauna", text: clean });
      } else {
        blocks.push({ type: "h3", text: clean });
      }
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const firstLine = quoteLines[0]?.trim() || "";
      if (firstLine.startsWith("[!HISTORY]")) {
        quoteLines.shift();
        blocks.push({
          type: "callout_history",
          text: quoteLines.join("\n"),
          lines: quoteLines,
        });
      } else if (
        firstLine.startsWith("[!TALE]") ||
        firstLine.startsWith("[!FOLKLORE]") ||
        firstLine.startsWith("[!PASALTHA]")
      ) {
        quoteLines.shift();
        blocks.push({
          type: "callout_tale",
          text: quoteLines.join("\n"),
          lines: quoteLines,
        });
      } else if (
        firstLine.startsWith("[!HLADO]") ||
        firstLine.startsWith("[!HLA]") ||
        firstLine.startsWith("[!BAWHHLA]")
      ) {
        quoteLines.shift();
        blocks.push({
          type: "callout_hlado",
          text: quoteLines.join("\n"),
          lines: quoteLines,
        });
      } else {
        blocks.push({
          type: "quote",
          text: quoteLines.join("\n"),
          lines: quoteLines,
        });
      }
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const listLines: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listLines.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({
        type: "list",
        text: "",
        lines: listLines,
      });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paraLines.join(" "),
      });
    }
  }

  return blocks;
}

export const MizoProseRenderer: React.FC<MizoProseRendererProps> = ({
  content,
  compact = false,
  entities = [],
  onSelectEntity,
}) => {
  const blocks = React.useMemo(() => parseMarkdownBlocks(content), [content]);

  const { entityMap, entityRegex } = React.useMemo(() => {
    const map = new Map<string, ClickableEntity>();
    const labels: string[] = [];
    for (const ent of entities) {
      const clean = ent.label.trim();
      if (clean.length < 3) continue;
      if (!map.has(clean.toLowerCase())) {
        map.set(clean.toLowerCase(), ent);
        labels.push(clean);
      }
    }
    if (labels.length === 0) {
      return { entityMap: map, entityRegex: null };
    }
    labels.sort((a, b) => b.length - a.length);
    const pattern = `\\b(${labels.map(escapeRegExp).join("|")})\\b`;
    return {
      entityMap: map,
      entityRegex: new RegExp(pattern, "gi"),
    };
  }, [entities]);

  let firstParagraphSeen = false;

  return (
    <div
      className={`font-book text-[var(--text-ink)] ${
        compact ? "text-[15.5px] leading-[1.8]" : "text-[17.5px] leading-[1.88]"
      }`}
    >
      {blocks.map((block, idx) => {
        if (block.type === "hr") {
          return (
            <div
              key={idx}
              className="my-10 flex items-center justify-center gap-4 text-[var(--text-muted)]"
              aria-hidden="true"
            >
              <span className="h-px w-16 bg-[var(--border-hairline)]" />
              <span className="text-xs tracking-[0.35em]">✦</span>
              <span className="h-px w-16 bg-[var(--border-hairline)]" />
            </div>
          );
        }

        if (block.type === "image" && block.src) {
          return (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="my-10 mx-auto max-w-2xl rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-md print-avoid-break group"
            >
              <div className="relative overflow-hidden aspect-[16/10] bg-stone-900/10">
                <img
                  src={block.src}
                  alt={block.text || "Mizo history illustration"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {block.text && (
                <figcaption className="p-3.5 text-center text-xs sm:text-sm italic font-ui text-[var(--text-muted)] border-t border-[var(--border-hairline)] bg-[var(--bg-card)]">
                  {block.text}
                </figcaption>
              )}
            </motion.figure>
          );
        }

        if (block.type === "video" && block.src) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="my-10 mx-auto max-w-2xl rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)] shadow-lg print-avoid-break"
            >
              <div className="relative aspect-video bg-black/90 flex items-center justify-center">
                <video
                  src={block.src}
                  controls
                  className="w-full h-full object-contain"
                  poster="/images/bung1_chhinlung_migration.jpg"
                />
              </div>
              {block.text && (
                <div className="p-3 text-center text-xs sm:text-sm font-ui text-[var(--text-muted)] flex items-center justify-center gap-2 border-t border-[var(--border-hairline)] bg-[var(--bg-card)]">
                  <VideoIcon className="w-4 h-4 text-[var(--accent-ink)]" />
                  <span>{block.text}</span>
                </div>
              )}
            </motion.div>
          );
        }

        if (block.type === "callout_history") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="my-8 p-5 sm:p-6 rounded-2xl border-l-4 border-amber-800/80 bg-amber-950/10 shadow-sm print-avoid-break"
            >
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-ui text-xs font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>CHHINCHHIAHNA DIK &bull; HISTORICAL ARCHIVE</span>
              </div>
              <div className="space-y-2 text-[16px] leading-relaxed text-[var(--text-ink)]">
                {block.lines?.map((line, lIdx) => (
                  <p key={lIdx}>
                    {renderInlineFormatting(line, entityMap, entityRegex, onSelectEntity)}
                  </p>
                ))}
              </div>
            </motion.div>
          );
        }

        if (block.type === "callout_tale") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="my-8 p-5 sm:p-6 rounded-2xl border-l-4 border-emerald-800/80 bg-emerald-950/10 shadow-sm print-avoid-break"
            >
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-ui text-xs font-semibold uppercase tracking-wider mb-2">
                <Scroll className="w-4 h-4" />
                <span>THAWNTHU HLUI &bull; ORAL FOLKLORE &amp; PASALTHA</span>
              </div>
              <div className="space-y-2 text-[16px] leading-relaxed text-[var(--text-ink)] italic">
                {block.lines?.map((line, lIdx) => (
                  <p key={lIdx}>
                    {renderInlineFormatting(line, entityMap, entityRegex, onSelectEntity)}
                  </p>
                ))}
              </div>
            </motion.div>
          );
        }

        if (block.type === "callout_hlado") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="my-8 py-6 px-6 sm:px-10 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)]/70 text-center shadow-inner print-avoid-break relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-ui font-semibold uppercase tracking-widest text-[var(--accent-ink)] bg-[var(--accent-ink)]/10 mb-3">
                <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>HLADO &bull; BAWH HLA &bull; CHANTS</span>
              </div>
              <div className="space-y-1.5 font-display text-[1.12rem] sm:text-[1.2rem] italic leading-[2] text-[var(--text-ink)]">
                {block.lines?.map((line, lIdx) => (
                  <p key={lIdx}>
                    {renderInlineFormatting(line, entityMap, entityRegex, onSelectEntity)}
                  </p>
                ))}
              </div>
            </motion.div>
          );
        }

        if (block.type === "h2") {
          return (
            <h2
              key={idx}
              className="font-display text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-[var(--text-ink)] mt-12 mb-5 pb-3 border-b border-[var(--border-hairline)] [text-wrap:balance] print-avoid-break"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "thlirzauna") {
          return (
            <div
              key={idx}
              className="mt-10 mb-4 pt-6 border-t border-[var(--border-hairline)] print-avoid-break"
            >
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-ink)] mb-1">
                Historical &amp; Cultural Reflection
              </p>
              <h3 className="font-display text-xl font-semibold text-[var(--text-ink)]">
                {block.text}
              </h3>
            </div>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={idx}
              className="font-display text-xl font-semibold text-[var(--text-ink)] mt-8 mb-3 [text-wrap:balance] print-avoid-break"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="my-8 py-6 px-4 sm:px-8 border-y border-[var(--border-hairline)] text-center italic text-[1.08rem] leading-[1.9] text-[var(--text-ink)] bg-[var(--bg-surface)]/45 print-avoid-break"
            >
              {block.lines?.map((line, lineIdx) => (
                <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
                  {renderInlineFormatting(
                    line,
                    entityMap,
                    entityRegex,
                    onSelectEntity
                  )}
                </p>
              ))}
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={idx}
              className="my-5 space-y-2.5 pl-6 list-disc marker:text-[var(--accent-ink)]"
            >
              {block.lines?.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {renderInlineFormatting(
                    item,
                    entityMap,
                    entityRegex,
                    onSelectEntity
                  )}
                </li>
              ))}
            </ul>
          );
        }

        const isFirstPara = !firstParagraphSeen;
        if (isFirstPara) {
          firstParagraphSeen = true;
        }

        return (
          <p
            key={idx}
            className={`mb-5 ${
              isFirstPara && !compact ? "book-dropcap" : ""
            }`}
          >
            {renderInlineFormatting(
              block.text,
              entityMap,
              entityRegex,
              onSelectEntity
            )}
          </p>
        );
      })}
    </div>
  );
};
