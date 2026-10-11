/**
 * One-off: loads the entries from public/resume.pdf into Experience and
 * refreshes each service's skills and FAQs from prisma/data/services.ts.
 * Nothing is deleted: the two placeholder rows (TAM work, UNSRI degree) are
 * updated in place and everything else is created. Safe to run twice.
 *   npx tsx prisma/scripts/import-resume.ts
 */
import { PrismaClient, Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { SERVICES } from "../data/services";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const d = (s: string) => new Date(`${s}T00:00:00.000Z`);

/** `replaces` is the placeholder row (matched by type + organization) this entry takes over. */
type Entry = Prisma.ExperienceCreateInput & { replaces?: string };

const EXPERIENCE: Entry[] = [
  {
    type: "WORK",
    organization: "PT Taruna Anugerah Mandiri",
    replaces: "Taruna Anugerah Mandiri (TAM)",
    role: "Full-Time Software Engineer",
    description:
      "Internal software for the company's operations, plus the servers it runs on.",
    highlights: [
      "Built and maintained 10+ internal systems, including inventory management, project workflow tracking, field documentation, attendance and document management, cutting manual processing time by up to 30%.",
      "Led the integration of 6+ standalone tools into a unified ERP platform.",
      "Managed 4 bare-metal internal servers hosting company applications, holding 99% uptime with a self-built smart monitoring and maintenance system.",
    ],
    tools: ["Next.js", "PostgreSQL", "Linux", "ERP"],
    startDate: d("2025-01-01"),
    endDate: d("2026-09-01"),
    order: 1,
  },
  {
    type: "WORK",
    organization: "Smart Greenhouse UNSRI Indralaya (Research)",
    role: "Robotics & Software Engineering",
    description:
      "Research project automating chili plant monitoring in a greenhouse.",
    highlights: [
      "Built a 3-axis CNC gantry with stepper motors, Raspberry Pi 4 and ESP32 to scan 27 chili trees across a 90 m² greenhouse with under 1% movement error.",
      "Designed and trained a YOLOv11 computer vision model that classifies chili ripeness with over 90% detection accuracy against manual inspection.",
      "Developed a full-stack Next.js and PostgreSQL dashboard for real-time monitoring and control, validated over 7 days of live field testing at over 90% system reliability.",
    ],
    tools: ["YOLOv11", "Raspberry Pi 4", "ESP32", "Next.js", "PostgreSQL", "Python"],
    startDate: d("2026-01-01"),
    endDate: d("2026-06-30"),
    order: 2,
  },
  {
    type: "WORK",
    organization: "PT Kilang Pertamina Internasional RU III Plaju",
    role: "Electrical & Instrumentation Engineer Intern",
    description: "Maintenance Area II, Polypropylene production unit.",
    highlights: [
      "Analysed end-to-end process instrumentation for pressure, temperature, flow and level, including PLC/SCADA/HMI communication and 4–20 mA signal systems, and calibrated 4 transmitters with a HART communicator.",
      "Evaluated Pressure Transmitter PT-2210 maintenance for reactor D-2201 and designed a Control Ticket system to standardise scheduling and documentation, improving tracking efficiency by 20%.",
      "Recommended redundant pressure transmitters on the D-2201 interlock, reducing single-point-of-failure risk by 50% across 3 critical measurement points.",
    ],
    tools: ["PLC", "SCADA", "HMI", "4–20 mA", "HART"],
    startDate: d("2025-07-01"),
    endDate: d("2025-09-30"),
    order: 3,
  },
  {
    type: "WORK",
    organization: "Freelance",
    role: "Software & Robotics Developer",
    description:
      "Independent work for institutional and private clients across software, robotics and electrical systems.",
    highlights: [
      "Delivered 20+ paid projects spanning web and mobile applications, robotics, AI/ML models and electrical and technical systems.",
      "Served clients including PLN Electrical Services, PLN Haleyora Power UP 6 and BP3MI Sumatera Selatan, with 95% project completion and client satisfaction.",
    ],
    tools: ["Next.js", "React Native", "Python", "Arduino", "ESP32"],
    startDate: d("2022-11-01"),
    endDate: null,
    order: 4,
  },
  {
    type: "ORGANIZATION",
    organization: "Society of Renewable Energy UNSRI",
    role: "Member, Brand & Marketing",
    description: "Visual communication and promotion for SRE's educational programmes.",
    highlights: [
      "Designed and illustrated 6+ visual communication pieces, including posters, infographics and social media content.",
      "Contributed to the publication and promotion of the Abdi Negara programme, including a 2,000 Wp solar power installation in Kampung Kreatif Sugih Waras.",
      "Took part in 10+ events as participant and organising committee member.",
    ],
    tools: ["Design", "Social media"],
    startDate: d("2024-01-01"),
    endDate: d("2025-12-31"),
    order: 1,
  },
  {
    type: "ORGANIZATION",
    organization: "Google Developer Student Clubs (GDSC) UNSRI",
    role: "Member, Front End Development",
    highlights: [
      "Completed 5+ web application projects with Next.js, React, Tailwind CSS and Git.",
      "Worked across Backend, UI/UX and Machine Learning teams through Git-based workflows.",
      "Served on the organising committee for 4 internal and external events.",
    ],
    tools: ["Next.js", "React", "Tailwind CSS", "Git"],
    startDate: d("2023-01-01"),
    endDate: d("2024-12-31"),
    order: 2,
  },
  {
    type: "ORGANIZATION",
    organization: "UNSRI Electrical Engineering Student Association (HME UNSRI)",
    role: "Member, Media Informasi dan Komunikasi",
    highlights: [
      "Designed and produced 5+ visual communication pieces to promote association activities and work programmes.",
      "Documented and published 6 events through photo, video and recap content.",
    ],
    tools: ["Design", "Photo & video"],
    startDate: d("2023-01-01"),
    endDate: d("2024-12-31"),
    order: 3,
  },
  {
    type: "ORGANIZATION",
    organization: "My UNSRI",
    role: "Programmer / Engineer",
    highlights: [
      "Designed, developed and maintained the company profile website in Laravel over a 10-month period.",
      "Contributed 2–3 social media content pieces per month, behind the scenes and on camera.",
    ],
    tools: ["Laravel", "PHP"],
    startDate: d("2023-01-01"),
    endDate: d("2024-12-31"),
    order: 4,
  },
  {
    type: "EDUCATION",
    organization: "Sriwijaya University",
    replaces: "Universitas Sriwijaya (UNSRI)",
    role: "Bachelor of Electrical Engineering",
    description: "Grade 3.89.",
    highlights: [
      "Focus on industrial automation, instrumentation and control.",
      "Certificates: From Wire to PLC (Udemy) and Siemens PLC & HMI 2025, TIA Portal V20 (Udemy).",
    ],
    tools: ["TIA Portal", "MATLAB", "ETAP", "AutoCAD"],
    startDate: d("2022-08-01"),
    endDate: d("2026-08-01"),
    order: 1,
  },
];

async function main() {
  for (const { replaces, ...data } of EXPERIENCE) {
    const match = await prisma.experience.findFirst({
      where: {
        type: data.type,
        organization: { in: [data.organization, ...(replaces ? [replaces] : [])] },
        role: { in: [data.role, ...(replaces ? ["Software Engineer", "B.Eng. Electrical Engineering"] : [])] },
      },
    });
    if (match) {
      await prisma.experience.update({ where: { id: match.id }, data });
      console.log(`updated  ${data.type.padEnd(12)} ${data.organization}`);
    } else {
      await prisma.experience.create({ data });
      console.log(`created  ${data.type.padEnd(12)} ${data.organization}`);
    }
  }

  for (const s of SERVICES) {
    await prisma.service.update({
      where: { slug: s.slug },
      data: { skills: s.skills, faqs: s.faqs },
    });
    console.log(`service skills ${s.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
