import AboutTitle from "./AboutTitle";
import HalftonePhoto from "./HalftonePhoto";
import PhraseStrip from "./PhraseStrip";

const PHRASES = [
  "Ship it, then sharpen it",
  "Volts to vectors",
  "Curious by default",
  "Hello from Indonesia",
  "Measure twice, deploy once",
];

export default function AboutHero() {
  return (
    <div>
      <AboutTitle
        cmp="title"
        className="ab-pad"
        as="h1"
        left="Software"
        right="Electrical"
        heading="Circuit minded. Software driven."
        extrude={1}
        opening="Products and systems built with curiosity, care and stubbornness."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="relative col-span-2 lg:col-span-1">
          <PhraseStrip phrases={PHRASES} />
        </div>
        <div className="col-span-2 lg:col-span-3">
          <div className="ab-hero-photo wk-b ab-glass" data-cmp="photo">
            <div className="ab-hero-photo_inner">
              <HalftonePhoto
                src="/about/hero.jpg"
                alt="Daffa"
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
