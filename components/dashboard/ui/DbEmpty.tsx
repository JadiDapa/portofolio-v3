import GridButton from "@/components/root/work/GridButton";

type Props = {
  /** Use *asterisks* around a word to set it as an outline. */
  title: string;
  text?: string;
  href?: string;
  cta?: string;
};

export default function DbEmpty({ title, text, href, cta }: Props) {
  const parts = title.split(/\*(.+?)\*/g);

  return (
    <div className="db-empty">
      <h2 className="db-empty_title">
        {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}
      </h2>
      {text && <p className="db-empty_text">{text}</p>}
      {href && cta && <GridButton href={href}>{cta}</GridButton>}
    </div>
  );
}
