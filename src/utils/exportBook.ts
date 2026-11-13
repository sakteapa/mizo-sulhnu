import {
  BOOK_MAIN_TITLE,
  BOOK_SUBTITLE,
  countWords,
} from "../data/chapters";
import type { ChapterData, GlossaryEntry } from "../types/book";

export function buildFullBookMarkdown(
  chapters: ChapterData[],
  glossary: GlossaryEntry[],
  bookTitle = BOOK_MAIN_TITLE,
  bookSubtitle = BOOK_SUBTITLE
): string {
  const lines: string[] = [];
  const totalWords = chapters.reduce((sum, ch) => sum + countWords(ch.content), 0);

  lines.push(`# ${bookTitle}`);
  lines.push(`## ${bookSubtitle}`);
  lines.push("");
  lines.push(
    `*${bookTitle} — Master Manuscript (${totalWords.toLocaleString()} thumal)*`
  );
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## A CHHUNG THUTE (TABLE OF CONTENTS)");
  lines.push("");

  for (const ch of chapters) {
    const wc = countWords(ch.content);
    lines.push(
      `- **${ch.bungLabel}: ${ch.title}** (${
        wc > 0 ? `${wc.toLocaleString()} thumal` : "La ziah loh"
      })`
    );
  }

  lines.push("");
  lines.push("---");
  lines.push("");

  for (const ch of chapters) {
    lines.push(`# ${ch.bungLabel}: ${ch.title}`);
    lines.push(`*${ch.eraOrTheme}*`);
    lines.push("");
    if (ch.content.trim()) {
      lines.push(ch.content.trim());
    } else {
      lines.push(
        `*[He bung hi la ziah chhuah a ni lo. Ruahmanna: ${ch.summary}]*`
      );
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  if (glossary.length > 0) {
    lines.push("## MASTER INDEX LEH HRILHFIAHNA (GLOSSARY)");
    lines.push("");
    const sorted = [...glossary].sort((a, b) => a.name.localeCompare(b.name));
    for (const item of sorted) {
      const chRefs = item.chapterNumbers.map((n) => `Bung ${n}`).join(", ");
      lines.push(`- **${item.name}** (${chRefs}): ${item.mizoDescription}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function buildFullBookPlainText(
  chapters: ChapterData[],
  glossary: GlossaryEntry[],
  bookTitle = BOOK_MAIN_TITLE,
  bookSubtitle = BOOK_SUBTITLE
): string {
  const md = buildFullBookMarkdown(chapters, glossary, bookTitle, bookSubtitle);
  return md
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^>\s?/gm, "    ");
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
