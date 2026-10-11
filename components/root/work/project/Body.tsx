/** Plain text becomes paragraphs; anything that already contains markup is kept as-is. */
export default function Body({ content }: { content: string }) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <>
      {content
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className={i > 0 ? "mt-[1.4em]" : undefined}>
            {para}
          </p>
        ))}
    </>
  );
}
