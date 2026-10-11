/** Zero-pads to two digits: 3 → "03". */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** True for mp4/webm URLs, which render in a <video> instead of an <img>. */
export const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/** "October 11, 2026". Pinned to UTC so a server and a browser never disagree on the day. */
export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** Plain text from an HTML string, for excerpts. */
export const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Periodic-table style symbol for a tool: "Next.js" → "Ne", "Tailwind CSS" → "TC". */
export const symbolOf = (name: string) => {
  const words = name.split(/[\s/&(),.+-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  const w = (words[0] ?? name).replace(/[^a-z0-9]/gi, "");
  return w.charAt(0).toUpperCase() + w.charAt(1).toLowerCase();
};
