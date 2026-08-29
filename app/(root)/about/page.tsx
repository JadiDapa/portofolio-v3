import { ExperienceService } from "@/servers/services/experience.service";
import ExperienceTimeline from "@/components/root/ExperienceTimeline";

const APPROACH = [
  {
    title: "Craft Over Chaos",
    description:
      "Whether it's a line of code or a trace on a PCB, I sweat the details so what I ship feels considered, not rushed.",
  },
  {
    title: "Full Stack, Literally",
    description:
      "From firmware to frontend, I like understanding the whole system — it makes for better decisions at every layer.",
  },
  {
    title: "Stay Curious",
    description:
      "Electrical engineering taught me to keep learning. I bring that same curiosity to every new framework, model or chip.",
  },
  {
    title: "Momentum Over Perfection",
    description:
      "I'd rather ship something solid and iterate than chase an imaginary finish line. Progress keeps projects alive.",
  },
];

const HIGHLIGHTS = [
  { label: "Software Engineer since", value: "2025" },
  { label: "Fields I work across", value: "6+" },
  { label: "Cups of coffee", value: "Countless" },
  { label: "Boring meetings held", value: "Zero" },
];

export default async function AboutPage() {
  const experience = await ExperienceService.getAll();

  return (
    <div>
      <section className="px-gutter py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Software · Hardware · Everything Between
          </p>
          <h1 className="text-section mt-2 font-semibold tracking-tight">
            Digital builder.{" "}
            <span className="text-primary">Electrical engineer at heart.</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-4">
            I&apos;m Daffa Althaf Ridovani, a Software Engineer with a
            background in Electrical Engineering — I like building products
            end to end, from the circuit board to the cloud.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-4 text-center">
          <p className="text-xl font-medium">
            I&apos;m graduating in 2026 with a Bachelor&apos;s degree in
            Electrical Engineering from Universitas Sriwijaya (UNSRI), and
            I&apos;ve been working as a Software Engineer at Taruna Anugerah
            Mandiri since January 2025.
          </p>
          <p className="text-muted-foreground text-lg">
            That mix means I&apos;m comfortable across the stack — web apps,
            mobile apps, AI features, IoT devices and the electronics that
            power them. I take on client projects alongside my day job,
            usually the kind that need someone who can move between
            software and hardware without missing a beat.
          </p>
        </div>
      </section>

      {experience.length > 0 && (
        <section className="bg-muted/30 border-y">
          <div className="px-gutter py-16">
            <h2 className="text-3xl text-center font-semibold tracking-tight">
              Experience & Education
            </h2>
            <div className="mt-10">
              <ExperienceTimeline experience={experience} />
            </div>
          </div>
        </section>
      )}

      <section className="px-gutter py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Values · Vibes
          </p>
          <h2 className="text-section mt-2 font-semibold tracking-tight">
            How I Work
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {APPROACH.map((item) => (
            <div key={item.title} className="bg-card rounded-lg border p-6">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-t">
        <div className="px-gutter py-16">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label}>
                <p className="text-primary text-section font-semibold">{h.value}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
