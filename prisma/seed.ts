import { PrismaClient, Prisma, Role } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    username: "admin",
    name: "Administrator",
    role: Role.ADMIN,
    posts: {
      create: [
        {
          title: "Welcome to Admin Dashboard",
          slug: "welcome-admin-dashboard",
          content: "This is the first admin post.",
          published: true,
        },
      ],
    },
  },
  {
    username: "alice",
    name: "Alice",
    role: Role.USER,
    posts: {
      create: [
        {
          title: "Join the Prisma Discord",
          slug: "join-prisma-discord",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Prisma on YouTube",
          slug: "prisma-on-youtube",
          content: "https://pris.ly/youtube",
          published: false,
        },
      ],
    },
  },
  {
    username: "bob",
    name: "Bob",
    role: Role.USER,
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          slug: "follow-prisma-twitter",
          content: "https://twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
];

const serviceData: Prisma.ServiceCreateInput[] = [
  {
    title: "Web Development",
    slug: "web-development",
    summary: "Fast, modern websites and web apps built with React & Next.js.",
    headline: "Built to *load* fast and last long",
    lead: "From marketing sites to full-stack products, I build for the people using them first, and for the people maintaining them second.",
    description:
      "<p>Whether you're launching a new product, replacing a site that has outgrown itself, or adding a dashboard to something that already works, I can take it from idea to deployed.</p><p>I build with React, Next.js and TypeScript, with a focus on performance, accessibility and code a team can pick up without a tour. Design handoff, CMS, auth, payments and hosting all come as part of the job.</p>",
    process: [
      {
        title: "Scoping",
        text: "Before any code, we agree on what the site has to do, who it is for and what done looks like, so the build has a clear target.",
        outcomes: ["Requirements brief", "Sitemap", "Technical plan"],
      },
      {
        title: "Building",
        text: "Short build cycles with a working preview at every step, so you can react to real pages instead of promises.",
        outcomes: ["Component library", "CMS and data layer", "Staging preview"],
      },
      {
        title: "Launch & Care",
        text: "I handle the deploy, monitoring and the first weeks of fixes, then stay around for changes as the product grows.",
        outcomes: ["Production deploy", "Performance audit", "Ongoing support"],
      },
    ],
    faqs: [
      {
        question: "Can you build a site from a design file?",
        answer:
          "Yes. I work from Figma or any other design handoff, and I'm happy to flag anything that will be awkward to build before it becomes expensive.",
      },
      {
        question: "Do you also handle the backend and database?",
        answer:
          "I do. API routes, databases, authentication and payments are all part of the same build, so there is one person responsible for the whole thing.",
      },
      {
        question: "Can I edit the content myself afterwards?",
        answer:
          "Yes. I set up a dashboard or CMS tailored to your content, so day-to-day changes never need a developer.",
      },
      {
        question: "Will you work with my existing team?",
        answer:
          "Gladly. I can join an existing codebase, follow your conventions and hand over documented, reviewable work.",
      },
    ],
    order: 0,
  },
  {
    title: "App Development",
    slug: "app-development",
    summary: "Cross-platform mobile apps that feel native.",
    headline: "Apps that feel *right* in the hand",
    lead: "One codebase for iOS and Android, built so it behaves like it was made for each platform.",
    description:
      "<p>I build mobile apps that ship on both iOS and Android from a single codebase, without giving up the performance and feel people expect from a native app.</p><p>From the first prototype to store submission and updates, I look after the whole path, including the API behind the app when it needs one.</p>",
    process: [
      {
        title: "Shaping the App",
        text: "We define the core flows, the platforms to target and the smallest version worth putting in front of real users.",
        outcomes: ["User flows", "Scope for v1", "Technical plan"],
      },
      {
        title: "Building & Testing",
        text: "Weekly builds on real devices, so navigation, gestures and performance get tested early rather than at the end.",
        outcomes: ["Working app builds", "Device testing", "API integration"],
      },
      {
        title: "Release & Updates",
        text: "I take care of store listings, review feedback and over-the-air updates once the app is live.",
        outcomes: ["Store submission", "Crash monitoring", "Update pipeline"],
      },
    ],
    faqs: [
      {
        question: "Should I build for iOS and Android together?",
        answer:
          "Usually yes. A shared codebase keeps cost and maintenance down, and still lets us treat each platform's details properly.",
      },
      {
        question: "Can you add an app to an existing product?",
        answer:
          "Yes. I can connect to your current API or build the missing pieces, so the app and your web product share the same data.",
      },
      {
        question: "Who handles the App Store and Play Store?",
        answer:
          "I do. Accounts, listings, screenshots and review rounds are all part of the release work.",
      },
      {
        question: "What happens after launch?",
        answer:
          "I can stay on for fixes, OS updates and new features, either as needed or on a small monthly arrangement.",
      },
    ],
    order: 1,
  },
  {
    title: "AI & Machine Learning",
    slug: "ai-machine-learning",
    summary: "Practical AI features, from prototypes to production.",
    headline: "Put the *smart* into your product",
    lead: "Useful machine learning is mostly data, evaluation and plumbing. I handle all three.",
    description:
      "<p>I integrate and fine-tune ML models to solve real problems: recommendations, computer vision and LLM-powered features that earn their place in a product.</p><p>The goal is not a demo. It's a feature that works on your data, can be measured, and keeps working after launch.</p>",
    process: [
      {
        title: "Framing the Problem",
        text: "We decide what the model should do, how success is measured and whether ML is even the right tool for it.",
        outcomes: ["Problem statement", "Success metrics", "Data review"],
      },
      {
        title: "Prototype & Evaluate",
        text: "A quick prototype against your real data, with honest evaluation so we know what works before building around it.",
        outcomes: ["Working prototype", "Evaluation report", "Model choice"],
      },
      {
        title: "Production",
        text: "Wrapping the model in an API, adding monitoring and guarding against drift so it holds up in daily use.",
        outcomes: ["Model API", "Monitoring", "Retraining plan"],
      },
    ],
    faqs: [
      {
        question: "Do I need a lot of data to start?",
        answer:
          "Not always. Many useful features can start from pre-trained or hosted models, and we only collect more data where it actually pays off.",
      },
      {
        question: "Can you add an AI feature to my existing app?",
        answer:
          "Yes. Most of my AI work is adding one well-scoped feature to a product that already exists.",
      },
      {
        question: "How do you handle accuracy and risk?",
        answer:
          "With evaluation sets, clear fallbacks and human review where mistakes are costly. Nothing ships on a gut feeling.",
      },
      {
        question: "Will my data stay private?",
        answer:
          "We choose the setup around your requirements, including self-hosted or private options when the data is sensitive.",
      },
    ],
    order: 2,
  },
  {
    title: "IoT & Hardware",
    slug: "iot-hardware",
    summary: "Connected devices, from sensor to cloud dashboard.",
    headline: "From *sensor* to screen",
    lead: "Connected products fail at the seams. I build the device, the connection and the software as one system.",
    description:
      "<p>With an Electrical Engineering background, I design and build IoT systems end to end: the firmware on the device, the connectivity, and the software that turns readings into something useful.</p><p>That means fewer handoffs, fewer finger-pointing moments between hardware and software, and a system that is easier to debug.</p>",
    process: [
      {
        title: "System Design",
        text: "We pick sensors, microcontrollers and connectivity around your power, cost and range constraints.",
        outcomes: ["Architecture", "Parts selection", "Power budget"],
      },
      {
        title: "Prototype",
        text: "A working device on the bench, streaming real data to a basic dashboard, so the idea gets tested early.",
        outcomes: ["Firmware", "Cloud pipeline", "Live dashboard"],
      },
      {
        title: "Hardening",
        text: "Field testing, over-the-air updates and fault handling, so the device behaves when nobody is watching.",
        outcomes: ["OTA updates", "Field test report", "Documentation"],
      },
    ],
    faqs: [
      {
        question: "Can you build both the device and the app?",
        answer:
          "Yes, that is the point. Firmware, backend and dashboard come from the same person, which keeps the system coherent.",
      },
      {
        question: "Which connectivity do you work with?",
        answer:
          "Wi-Fi, Bluetooth LE, LoRa and cellular, chosen based on range, power and cost for your use case.",
      },
      {
        question: "Can you take a prototype to production?",
        answer:
          "I can prepare the design for manufacture and hand over the files and documentation a manufacturer needs.",
      },
      {
        question: "Do you work with existing hardware?",
        answer:
          "Yes. I can add connectivity and software to equipment you already have, or take over firmware that needs fixing.",
      },
    ],
    order: 3,
  },
  {
    title: "Electronics Engineering",
    slug: "electronics-engineering",
    summary: "Circuit design, PCB layout, and embedded firmware.",
    headline: "Circuits that just *work*",
    lead: "Good electronics are boring in the best way: reliable, documented and easy to build again.",
    description:
      "<p>From schematic to prototype, I design circuits and write the embedded firmware that brings hardware projects to life.</p><p>I care about the unglamorous parts too: component choices that are actually in stock, layouts that are easy to assemble, and notes that let someone else pick it up later.</p>",
    process: [
      {
        title: "Requirements",
        text: "We pin down what the board has to do, the environment it lives in and the constraints on size, cost and power.",
        outcomes: ["Specification", "Block diagram", "Component shortlist"],
      },
      {
        title: "Design & Layout",
        text: "Schematic capture and PCB layout with attention to signal integrity, thermals and manufacturability.",
        outcomes: ["Schematic", "PCB layout", "Bill of materials"],
      },
      {
        title: "Bring-up",
        text: "Assembling and testing the first boards, writing the firmware and fixing what the bench turns up.",
        outcomes: ["Assembled prototype", "Firmware", "Test report"],
      },
    ],
    faqs: [
      {
        question: "Can you design a PCB from scratch?",
        answer:
          "Yes, from schematic through layout to manufacturing files, ready to send to a board house.",
      },
      {
        question: "Do you write the firmware too?",
        answer:
          "I do. The circuit and the code on it are designed together, which makes bring-up much faster.",
      },
      {
        question: "Can you fix or improve an existing board?",
        answer:
          "Often, yes. I can review the design, find the fault or limitation and propose a revision.",
      },
      {
        question: "Will I get the design files?",
        answer:
          "Always. You own the schematics, layout, firmware and documentation when the project is done.",
      },
    ],
    order: 4,
  },
];

const projectData: Prisma.ProjectCreateInput[] = [
  {
    title: "Northlight Ordering Platform",
    slug: "northlight-ordering-platform",
    client: "Northlight Coffee Co.",
    category: "Web Development",
    summary:
      "A full-stack ordering platform for an independent coffee roaster.",
    content:
      "Built a Next.js storefront with an admin dashboard for managing orders, inventory and subscriptions — end to end, from database schema to deployment.",
    coverImage:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop",
    year: 2025,
    published: true,
    featured: true,
  },
  {
    title: "Fernway Health App",
    slug: "fernway-health-app",
    client: "Fernway Health",
    category: "App Development",
    summary: "A cross-platform mobile app for a growing wellness platform.",
    content:
      "Designed and built a React Native app with a component library that could keep pace with a fast-moving product team.",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    year: 2025,
    published: true,
    featured: true,
  },
  {
    title: "Basecamp Trail Sensor Network",
    slug: "basecamp-trail-sensor-network",
    client: "Basecamp Outdoors",
    category: "IoT & Hardware",
    summary: "A solar-powered trail sensor network with a live dashboard.",
    content:
      "Built a network of low-power environmental sensors and the cloud dashboard that visualises trail conditions in real time.",
    coverImage:
      "https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=1200&auto=format&fit=crop",
    year: 2026,
    published: true,
    featured: true,
  },
  {
    title: "Lumen Films Site",
    slug: "lumen-films-site",
    client: "Lumen Films",
    category: "Web Development",
    summary: "A cinematic one-pager for an indie film studio.",
    content:
      "A single-page showcase built around Lumen's showreel, optimised for fast load times without sacrificing visual impact.",
    coverImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    websiteUrl: "https://example.com",
    gallery: [
      {
        kind: "grid",
        items: [
          { src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop" },
          { src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop" },
        ],
      },
      {
        kind: "image",
        item: { src: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1800&auto=format&fit=crop" },
      },
      {
        kind: "grid",
        items: [
          { src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop" },
          { src: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1200&auto=format&fit=crop" },
        ],
      },
    ],
    year: 2024,
    published: true,
    featured: false,
  },
  {
    title: "Drift Skincare Recommender",
    slug: "drift-skincare-recommender",
    client: "Drift Skincare",
    category: "AI & Machine Learning",
    summary: "A product recommendation engine for a skincare line.",
    content:
      "Built a lightweight recommendation model that suggests products based on quiz answers, integrated directly into their storefront.",
    coverImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    year: 2024,
    published: true,
    featured: false,
  },
];

const testimonialData: Prisma.TestimonialCreateInput[] = [
  {
    quote:
      "Daffa was an incredible person to work with! He understood exactly what we needed and delivered a platform that exceeded our expectations.",
    authorName: "Maya Chen",
    authorTitle: "Founder",
    company: "Northlight Coffee Co.",
    published: true,
  },
  {
    quote:
      "He took the time to understand our product and then ran with it, shipping an app that exceeded our expectations on a tight timeline.",
    authorName: "Devon Marsh",
    authorTitle: "Head of Product",
    company: "Fernway Health",
    published: true,
  },
  {
    quote:
      "Rare to find someone who's equally comfortable with hardware and software. The sensor network just works, quietly, every day.",
    authorName: "Priya Anand",
    authorTitle: "Operations Lead",
    company: "Basecamp Outdoors",
    published: true,
  },
  {
    quote:
      "A true full-stack engineer — I could put any problem in front of him, from firmware to frontend, and he'd find the right way to solve it.",
    authorName: "Sam Whitfield",
    authorTitle: "Director",
    company: "Lumen Films",
    published: true,
  },
  {
    quote:
      "He caught edge cases we hadn't even thought to worry about, and explained every tradeoff in plain terms before we had to ask.",
    authorName: "Elena Kovac",
    authorTitle: "CTO",
    company: "Driftwood Analytics",
    published: true,
  },
  {
    quote:
      "Fast, communicative, and genuinely invested in getting the details right. Our launch went smoother than any release before it.",
    authorName: "Marcus Idowu",
    authorTitle: "Founder",
    company: "Harbor & Finch",
    published: true,
  },
];

const experienceData: Prisma.ExperienceCreateInput[] = [
  {
    type: "WORK",
    organization: "Taruna Anugerah Mandiri (TAM)",
    role: "Software Engineer",
    description:
      "Building and maintaining software products as part of the engineering team.",
    startDate: new Date("2025-01-01"),
    endDate: null,
    order: 0,
  },
  {
    type: "EDUCATION",
    organization: "Universitas Sriwijaya (UNSRI)",
    role: "B.Eng. Electrical Engineering",
    description: "Expected graduation: 2026.",
    startDate: new Date("2022-08-01"),
    endDate: null,
    order: 0,
  },
];

const recognitionData: Prisma.RecognitionCreateInput[] = [
  { source: "Placeholder Source", kind: "AWARD", title: "Edit me in /dashboard/recognition", order: 1 },
  { source: "Placeholder Source", kind: "CERTIFICATION", title: "Certification title — Issuer", order: 2 },
  { source: "Placeholder Source", kind: "COMPETITION", title: "Competition result — Project name", order: 3 },
  { source: "Placeholder Source", kind: "PRESS", title: "Feature or interview — Publication", order: 4 },
];

export async function main() {
  console.log("Seeding database...");

  for (const u of userData) {
    await prisma.user.create({
      data: u,
    });
  }

  for (const s of serviceData) {
    await prisma.service.create({ data: s });
  }

  for (const p of projectData) {
    await prisma.project.create({ data: p });
  }

  for (const t of testimonialData) {
    await prisma.testimonial.create({ data: t });
  }

  for (const e of experienceData) {
    await prisma.experience.create({ data: e });
  }

  for (const r of recognitionData) {
    await prisma.recognition.create({ data: r });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
