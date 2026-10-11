import { stripHtml } from "@/lib/format";

export type Heading = { id: string; text: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Reading stats and a table of contents for a journal entry. Every `<h2>` gets an id so
 * the contents list can link to it. Plain-text entries have no headings and pass through.
 */
export function prepareArticle(content: string | null | undefined) {
  const source = content ?? "";
  const text = stripHtml(source);
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  const headings: Heading[] = [];
  let html = source;

  if (/<[a-z][\s\S]*>/i.test(source)) {
    const used = new Set<string>();

    html = source.replace(
      /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
      (_match, attrs: string, inner: string) => {
        const label = stripHtml(inner);
        const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];

        let id = existing ?? (slugify(label) || `section-${headings.length + 1}`);
        while (!existing && used.has(id)) id = `${id}-${headings.length + 1}`;
        used.add(id);
        headings.push({ id, text: label });

        return existing
          ? `<h2${attrs}>${inner}</h2>`
          : `<h2${attrs} id="${id}">${inner}</h2>`;
      },
    );
  }

  return { html, headings, words, minutes };
}
