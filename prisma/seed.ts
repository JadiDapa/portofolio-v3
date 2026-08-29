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
    description:
      "From marketing sites to full-stack web apps, I build with React, Next.js and TypeScript — focused on performance, accessibility and clean code.",
    order: 0,
  },
  {
    title: "App Development",
    slug: "app-development",
    summary: "Cross-platform mobile apps that feel native.",
    description:
      "I build mobile apps that ship on both iOS and Android from a single codebase, without compromising on performance or feel.",
    order: 1,
  },
  {
    title: "AI & Machine Learning",
    slug: "ai-machine-learning",
    summary: "Practical AI features, from prototypes to production.",
    description:
      "I integrate and fine-tune ML models to solve real problems — recommendation systems, computer vision, and LLM-powered features.",
    order: 2,
  },
  {
    title: "IoT & Hardware",
    slug: "iot-hardware",
    summary: "Connected devices, from sensor to cloud dashboard.",
    description:
      "With an Electrical Engineering background, I design and build IoT systems end to end — firmware, connectivity, and the software that reads the data.",
    order: 3,
  },
  {
    title: "Electronics Engineering",
    slug: "electronics-engineering",
    summary: "Circuit design, PCB layout, and embedded firmware.",
    description:
      "From schematic to prototype, I design circuits and write the embedded firmware that brings hardware projects to life.",
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
