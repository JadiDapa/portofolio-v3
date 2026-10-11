/**
 * `next/image` blur placeholder built from the dominant colour that the upload action
 * bakes into the filename (`<uuid>-c8a7b5.webp`). Older uploads have no colour, so this
 * returns undefined and the image simply loads without a placeholder.
 */
export function placeholderFor(src?: string | null): string | undefined {
  const match = /-([0-9a-f]{6})\.webp(?:\?|$)/i.exec(src ?? "");
  if (!match) return undefined;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="#${match[1]}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** Spread onto `<Image>`: `<Image src={x} {...blurProps(x)} />`. */
export function blurProps(src?: string | null) {
  const blurDataURL = placeholderFor(src);
  return blurDataURL
    ? ({ placeholder: "blur", blurDataURL } as const)
    : ({ placeholder: "empty" } as const);
}
