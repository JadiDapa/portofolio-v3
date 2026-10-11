/** The four services, shared by the seed and the one-off restructure script. */
export type SeedService = {
  title: string;
  slug: string;
  summary: string;
  headline: string;
  lead: string;
  description: string;
  process: { title: string; text: string; outcomes: string[] }[];
  faqs: { question: string; answer: string }[];
  skills: { name: string; summary?: string; tools: string[] }[];
  order: number;
};

export const SERVICES: SeedService[] = [
  {
    title: "Software Development",
    slug: "software-development",
    summary: "Websites, web apps and mobile apps, from database to screen to store.",
    headline: "Software that *ships* and keeps shipping",
    lead: "Web, mobile and the backend behind them, built by one person who is responsible for the whole thing.",
    description:
      "<p>Whether you're launching a new product, replacing a site that has outgrown itself, or putting an app on both iOS and Android, I can take it from idea to deployed.</p><p>I build with React, Next.js and TypeScript on the front, Node, Go or Python on the back, and React Native or Flutter when it has to live in a pocket. Design handoff, auth, payments, CI and hosting all come as part of the job.</p>",
    process: [
      {
        title: "Scoping",
        text: "Before any code, we agree on what the product has to do, who it is for and what done looks like, so the build has a clear target.",
        outcomes: ["Requirements brief", "Sitemap and user flows", "Technical plan"],
      },
      {
        title: "Building",
        text: "Short build cycles with a working preview on real devices at every step, so you react to real screens instead of promises.",
        outcomes: ["Component library", "API and data layer", "Staging preview"],
      },
      {
        title: "Launch & Care",
        text: "I handle the deploy, store submission, monitoring and the first weeks of fixes, then stay around as the product grows.",
        outcomes: ["Production deploy", "Performance audit", "Ongoing support"],
      },
    ],
    faqs: [
      {
        question: "Can you build from a design file?",
        answer:
          "Yes. I work from Figma or any other handoff, and I flag anything that will be awkward to build before it becomes expensive.",
      },
      {
        question: "Web or mobile app, which do I need?",
        answer:
          "Often a good web app is enough. When you need push notifications, offline use or device hardware, I build a cross-platform app from one codebase.",
      },
      {
        question: "Do you also handle the backend and database?",
        answer:
          "I do. APIs, databases, authentication and payments are part of the same build, so one person owns the whole thing.",
      },
      {
        question: "Will you work with my existing team?",
        answer:
          "Gladly. I can join an existing codebase, follow your conventions and hand over documented, reviewable work.",
      },
    ],
    skills: [
      {
        name: "Frontend Development",
        summary: "Fast, accessible interfaces.",
        tools: ["Next.js", "React", "Tailwind CSS", "JavaScript", "TypeScript"],
      },
      {
        name: "Backend Development",
        summary: "APIs, data and auth.",
        tools: ["Node.js", "Express", "Laravel", "Go", "Python (FastAPI)", "PostgreSQL", "Prisma"],
      },
      {
        name: "App Development",
        summary: "One codebase for iOS and Android.",
        tools: ["React Native", "Flutter", "Expo"],
      },
      {
        name: "DevOps & Servers",
        summary: "Bare-metal and cloud, monitored.",
        tools: ["Linux", "Docker", "Nginx", "Git", "GitHub Actions"],
      },
    ],
    order: 0,
  },
  {
    title: "IoT & AI Systems",
    slug: "iot-ai-systems",
    summary: "Connected devices and the models that make sense of their data.",
    headline: "Devices that *sense* and software that learns",
    lead: "From the sensor on the wire to the model in the cloud, one pipeline designed as one system.",
    description:
      "<p>I design connected hardware and the intelligence on top of it: firmware on the device, a reliable link, a data pipeline, and machine-learning models that turn readings into decisions.</p><p>Because I work across both sides, trade-offs get made once, in the right place, instead of being argued between a hardware team and a software team.</p>",
    process: [
      {
        title: "System Design",
        text: "We map what is sensed, what is decided and where, on the device, at the edge or in the cloud, before anything is ordered or trained.",
        outcomes: ["Architecture diagram", "Bill of materials", "Data plan"],
      },
      {
        title: "Prototype",
        text: "A working device and a first model on real data, early enough that the assumptions get tested instead of defended.",
        outcomes: ["Working prototype", "Baseline model", "Evaluation report"],
      },
      {
        title: "Hardening",
        text: "Power, connectivity, drift and failure modes are tested until the system behaves on a bad day, not just a good one.",
        outcomes: ["Field test results", "OTA update path", "Monitoring dashboard"],
      },
    ],
    faqs: [
      {
        question: "Do you build the hardware and the model?",
        answer:
          "Both. Firmware, electronics, backend and the machine-learning work are designed together, so the pieces fit.",
      },
      {
        question: "Does the model have to run in the cloud?",
        answer:
          "No. Many models run happily on an ESP32 or a Raspberry Pi, which keeps latency low and data local.",
      },
      {
        question: "Can you work with data I already have?",
        answer:
          "Yes. I start by checking what the data can and cannot answer, before promising a model.",
      },
    ],
    skills: [
      {
        name: "IoT & Embedded",
        summary: "Firmware and connectivity.",
        tools: ["ESP32", "Arduino IDE", "C/C++", "Raspberry Pi"],
      },
      {
        name: "Machine Learning",
        summary: "Models that survive production.",
        tools: ["Python", "YOLOv11", "Jupyter Notebook"],
      },
      {
        name: "Robotics",
        summary: "Motion you can measure.",
        tools: ["3-axis CNC gantry", "Stepper motors", "SolidWorks"],
      },
      {
        name: "Monitoring Dashboards",
        summary: "Live data in one place.",
        tools: ["Next.js", "PostgreSQL", "MATLAB"],
      },
    ],
    order: 1,
  },
  {
    title: "Electrical Engineering",
    slug: "electrical-engineering",
    summary: "Low-voltage electronics to high-voltage power systems.",
    headline: "From millivolts to *kilovolts*",
    lead: "Circuit boards, panels and power systems, designed, simulated and commissioned.",
    description:
      "<p>My electrical work spans both ends of the voltage range: low-voltage electronics and PCBs on one side, and high-voltage power systems, protection and installation design on the other.</p><p>Every design is simulated before it is built, documented so someone else can maintain it, and tested against the standards it has to meet.</p>",
    process: [
      {
        title: "Requirements",
        text: "Loads, voltages, environment and the standards the design has to meet are written down before a single symbol is drawn.",
        outcomes: ["Specification", "Standards checklist", "Risk list"],
      },
      {
        title: "Design & Analysis",
        text: "Schematics, layouts or single-line diagrams, backed by simulation: load flow, short circuit and protection studies where they apply.",
        outcomes: ["Schematics and layout", "Study reports", "Drawing package"],
      },
      {
        title: "Build & Commission",
        text: "Support through fabrication, panel build or installation, then bring-up and testing until it behaves as simulated.",
        outcomes: ["Test records", "As-built drawings", "Handover documents"],
      },
    ],
    faqs: [
      {
        question: "Do you cover both low and high voltage?",
        answer:
          "Yes. Electronics and PCBs at the low end, and power systems, protection and installation design at the high end.",
      },
      {
        question: "Can you fix or improve an existing design?",
        answer:
          "Often. I review the design, find the fault or limitation and propose a revision.",
      },
      {
        question: "Will I get the design files?",
        answer:
          "Always. You own the schematics, layouts, drawings and documentation when the project is done.",
      },
    ],
    skills: [
      {
        name: "Low Voltage & Electronics",
        summary: "Circuits and PCBs.",
        tools: ["Proteus", "Autodesk Eagle", "Arduino IDE"],
      },
      {
        name: "Power Systems",
        summary: "Studies and protection.",
        tools: ["ETAP", "MATLAB", "Simulink"],
      },
      {
        name: "Wiring & Electrical Design",
        summary: "Drawings that can be built.",
        tools: ["AutoCAD", "Wiring design"],
      },
      {
        name: "2D & 3D Design",
        summary: "Enclosures and layouts.",
        tools: ["SolidWorks", "AutoCAD"],
      },
    ],
    order: 2,
  },
  {
    title: "Process & Control Engineering",
    slug: "process-control-engineering",
    summary: "PLCs, SCADA and control loops that keep a plant steady.",
    headline: "Processes that stay *under control*",
    lead: "Automation from the field instrument to the operator screen, programmed to behave on the worst day.",
    description:
      "<p>I design and program the control side of a process: instrumentation, PLC logic, SCADA and HMI, and the control loops that hold a plant at its setpoints.</p><p>The goal is a system operators trust: clear alarms, predictable behaviour and documentation that survives the next shift change.</p>",
    process: [
      {
        title: "Process Understanding",
        text: "We walk the process, its instruments and its failure modes, and write the control philosophy before any logic is programmed.",
        outcomes: ["Control narrative", "I/O list", "Alarm philosophy"],
      },
      {
        title: "Programming & Simulation",
        text: "PLC logic, HMI screens and loop tuning are built and tested against a simulation, so commissioning is a confirmation, not a discovery.",
        outcomes: ["PLC program", "HMI and SCADA screens", "Tuning report"],
      },
      {
        title: "Commissioning",
        text: "Site acceptance, loop checks and operator training, then documentation that stays useful.",
        outcomes: ["SAT results", "Operator training", "Maintenance manual"],
      },
    ],
    faqs: [
      {
        question: "Which PLC platforms do you work with?",
        answer:
          "Siemens TIA Portal, Omron CX-Programmer and Schneider Machine Expert so far, and I am comfortable picking up others from the documentation.",
      },
      {
        question: "Can you upgrade an existing control system?",
        answer:
          "Yes. I audit what is there, plan a staged migration and keep the plant running throughout.",
      },
      {
        question: "Do you tune the control loops too?",
        answer:
          "Yes. Modelling, PID tuning and verification are part of the work, not an afterthought.",
      },
    ],
    skills: [
      {
        name: "PLC Programming",
        summary: "Logic that fails safe.",
        tools: ["TIA Portal", "CXProgrammer", "Machine Expert", "Ladder Diagram", "Structured Text"],
      },
      {
        name: "SCADA & HMI",
        summary: "Screens operators trust.",
        tools: ["WinCC", "Wonderware"],
      },
      {
        name: "Instrumentation",
        summary: "Field measurement and calibration.",
        tools: ["4–20 mA loops", "HART calibration", "Pressure transmitters", "Flow & level"],
      },
      {
        name: "Control Systems",
        summary: "Modelling and tuning.",
        tools: ["MATLAB", "Simulink"],
      },
    ],
    order: 3,
  },
];

/** Old service slug → the service that absorbed it. */
export const SERVICE_REDIRECTS: Record<string, string> = {
  "web-development": "software-development",
  "app-development": "software-development",
  "ai-machine-learning": "iot-ai-systems",
  "iot-hardware": "iot-ai-systems",
  "electronics-engineering": "electrical-engineering",
};

/** Old Project.category → new service title. */
export const CATEGORY_REMAP: Record<string, string> = {
  "Web Development": "Software Development",
  "App Development": "Software Development",
  "AI & Machine Learning": "IoT & AI Systems",
  "IoT & Hardware": "IoT & AI Systems",
  "Electronics Engineering": "Electrical Engineering",
};
