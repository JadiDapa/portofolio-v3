/**
 * The three projects that came out of Daffa's thesis (chili ripeness detection
 * on a CNC gantry, UNSRI 2026). Images are figures pulled out of the thesis
 * .docx and named by their `word/media/` file; prisma/scripts/import-chili-projects.ts
 * uploads them and swaps each `fig` for its URL.
 */
import type { Section } from "../../servers/validators/project.validator";

/** A thesis figure, by its file name in the .docx's `word/media/`. */
export type Fig = { fig: string; alt?: string };

export type DraftBlock =
  | { kind: "grid"; items: [Fig, Fig] }
  | { kind: "image"; item: Fig };

export type DraftSection =
  | Exclude<Section, { type: "gallery" }>
  | { id: string; type: "gallery"; blocks: DraftBlock[] };

export type ChiliProject = {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  content: string;
  cover: Fig;
  websiteUrl?: string;
  year: number;
  featured: boolean;
  order: number;
  sections: DraftSection[];
};

const CLIENT = "Universitas Sriwijaya — Undergraduate Thesis";

export const CHILI_PROJECTS: ChiliProject[] = [
  {
    slug: "chili-ripeness-cnc-gantry",
    title: "Chili Ripeness Detection on a CNC Gantry",
    client: CLIENT,
    category: "Electrical Engineering",
    summary:
      "A three-axis CNC gantry that rolls over a 2 × 6 m chili bed, photographs all 27 plants and tells you which ones are ready to pick.",
    content:
      "Chili prices in Indonesia swing hard (cayenne hit around Rp 120,000/kg in March 2025), yet deciding when a plant is ready still comes down to someone walking the rows and judging which fruit looks red enough. It's slow, it's subjective, and it gets worse the bigger the farm.\n\n" +
      "This thesis hands that walk to a machine. Inside a smart greenhouse at Universitas Sriwijaya, an aluminium gantry carries a camera over every plant in the bed, a Raspberry Pi runs a YOLOv11 model on each photo, and a web dashboard turns the fruit counts into a harvest call per plant. The gantry, its electronics and firmware, the model and the dashboard were all designed and built from scratch.",
    cover: { fig: "image79.jpeg", alt: "The CNC gantry spanning the chili planter bed" },
    year: 2026,
    featured: true,
    order: 0,
    sections: [
      { id: "p1-hero", type: "hero" },
      { id: "p1-intro", type: "intro" },
      {
        id: "p1-results",
        type: "results",
        title: "Results",
        items: [
          { value: "0.47 mm", label: "Mean positioning error along the 6 m axis" },
          { value: "94.3%", label: "Detection precision in the greenhouse" },
          { value: "25 / 27", label: "Harvest calls matching a hand count" },
          { value: "11.8 min", label: "To scan all 27 plants" },
        ],
      },
      {
        id: "p1-site",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image44.jpeg", alt: "The smart greenhouse from outside" } },
          {
            kind: "grid",
            items: [
              { fig: "image45.jpeg", alt: "The three planter beds before planting" },
              { fig: "image50.jpeg", alt: "Fruiting chili plants in the main bed" },
            ],
          },
        ],
      },
      {
        id: "p1-greenhouse",
        type: "text",
        title: "The greenhouse",
        body:
          "The system lives in an 8 × 10 m greenhouse on the Faculty of Engineering campus in Indralaya: a C75 light-steel frame, a 250-micron UV polyethylene roof, and 50-mesh insect-net walls that let air through but keep pests out. Inside are three raised planter beds of 2 × 6 m, each laid out for 27 plants on a 3 × 9 grid, plus a small control room with 220 V power.\n\n" +
          "The plants were grown for it too. Kaliber cayenne seeds were sown on 16 December 2025, raised in polybags through the vegetative and flowering stages, and moved into the main bed with their root balls at 164 days old, already carrying fruit at every stage of ripeness.",
      },
      {
        id: "p1-axes",
        type: "text",
        title: "Three axes over a 2 × 6 m bed",
        body:
          "The X axis runs the full 6 m of the bed. Two 20×60 aluminium columns ride V-wheels along 20×20 rails fixed to both edges of the bed, and each column has its own NEMA17 (X1 and X2) driving a GT2 belt, so both sides travel together.\n\n" +
          "Bridging the columns is a 2 m 20×60 cross-slide for the Y axis. A 5 mm steel carriage plate rolls along it on five V-wheels and carries five more on its back face for the Z riser: a 1 m aluminium post driven by an 8 mm lead screw with a 2 mm pitch, so the camera holds its height without slipping when the motor is idle.\n\n" +
          "X and Y use GT2 belts on 20-tooth pulleys at 1/16 microstepping, which works out to 80 steps per millimetre. Drag chains carry the cables and the irrigation hose along with the carriage, and a limit switch at the end of every axis gives the machine a hard zero. It homes Z first, then Y, then X.",
      },
      {
        id: "p1-build",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image30.png", alt: "3D design of the gantry over the planter bed" } },
          {
            kind: "grid",
            items: [
              { fig: "image80.jpeg", alt: "Gantry columns X1 and X2" },
              { fig: "image82.jpeg", alt: "The Y-axis rail" },
            ],
          },
          {
            kind: "grid",
            items: [
              { fig: "image81.png", alt: "Gantry column with corner bracket, motor and panel box" },
              { fig: "image83.png", alt: "Cross-slide carriage with pulley, belt and drag chain" },
            ],
          },
          {
            kind: "grid",
            items: [
              { fig: "image84.jpeg", alt: "The Z-axis camera riser" },
              { fig: "image86.jpeg", alt: "Panel box with the ESP32, DRV8825 drivers and relays" },
            ],
          },
        ],
      },
      {
        id: "p1-electronics",
        type: "features",
        title: "Electronics",
        items: [
          {
            title: "Raspberry Pi 4",
            description:
              "The brain. Runs a FastAPI service that takes session commands from the dashboard, sequences every move, runs the YOLOv11 model and streams video and status to the browser.",
          },
          {
            title: "ESP32 #1: motion",
            description:
              "On the Pi's USB. Drives four DRV8825 stepper drivers (X1, X2, Y, Z), the two MG90S servos of the pan-tilt head, a VL53L1X time-of-flight sensor over I²C, and the relays for the solenoid valve and pump.",
          },
          {
            title: "ESP32 #2: soil",
            description:
              "On the Pi's UART. Reads capacitive soil-moisture probes buried along each third of the bed for the watering logic.",
          },
          {
            title: "Camera head",
            description:
              "A 1080p Logitech C922 on the pan-tilt servos at the top of the Z riser, so the framing can be set for each plant before every shot.",
          },
        ],
      },
      {
        id: "p1-wiring",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image89.png", alt: "How the Pi, both ESP32s, drivers, servos and sensors connect" } },
          { kind: "image", item: { fig: "image88.png", alt: "ESP32 #1 schematic with four DRV8825 drivers" } },
        ],
      },
      {
        id: "p1-scan",
        type: "text",
        title: "One scan, start to finish",
        body:
          "A scan starts on the dashboard, which creates the session and hands its ID to the Pi. If another session is already running the Pi refuses with a 409, so two jobs can never fight over the motors. Otherwise it enables the drivers and homes all three axes.\n\n" +
          "Then it walks the grid. At each of the 27 plants the gantry moves into position, the servos set the camera angle, and the system waits for the frame to stop swaying before it captures. The photo is uploaded to the dashboard and run through YOLOv11 on the Pi; the counts per class go back over HTTP while a Server-Sent Event updates the browser live. A failed move or capture triggers an emergency stop instead of a half-finished run.\n\n" +
          "After the last plant, any plant with more than five ripe fruits is flagged as ready to harvest, the gantry homes again and the drivers switch off.",
      },
      {
        id: "p1-watering",
        type: "text",
        title: "It waters, too",
        body:
          "The same gantry runs a watering pass. It first sweeps the bed with the downward-facing ToF sensor to find the height of the tallest plants, and reads the soil-moisture probes. Both feed a type-2 fuzzy controller that decides how long the solenoid valve should stay open, and the gantry then stops along the bed, opening the valve for that long at each stop.",
      },
      {
        id: "p1-motion",
        type: "results",
        title: "Motion tests",
        items: [
          { value: "0.47 mm", label: "Mean X error over 27 points (max 0.8 mm, tolerance ±5 mm)" },
          { value: "0.33 mm", label: "Mean Y error over 27 points (max 0.5 mm)" },
          { value: "≤ 0.25 mm", label: "Skew between the X1 and X2 motors along the rail" },
          { value: "0.03 mm", label: "Worst homing deviation across 10 runs per axis" },
        ],
      },
      {
        id: "p1-field",
        type: "text",
        title: "Seven days in the greenhouse",
        body:
          "The finished system ran a full scan every afternoon at around 17:00 from 1 to 7 July 2026. Six of the seven sessions covered all 27 plants. On 5 July the network between the Pi and the dashboard dropped after plant 11 and the session stopped; the gantry and the model had been working normally up to that point.\n\n" +
          "Before scanning, every fruit on every plant was counted by hand. Against that count the system found 863 of 950 fruits with 52 false detections (94.3% precision, 90.8% recall), and its harvest call matched reality on 25 of 27 plants. Both misses were plants sitting right on the five-ripe-fruit threshold.\n\n" +
          "A full scan takes 709 seconds on average, within a few seconds across three runs. Homing takes 5.3 s, a move to the next row 5.8 s and capture plus inference 4.1 s, but each move across to the next column takes 28.6 s. The bottleneck is moving the frame, not running the model.",
      },
      {
        id: "p1-detection",
        type: "gallery",
        blocks: [
          {
            kind: "grid",
            items: [
              { fig: "image107.jpeg", alt: "One plant as the gantry camera sees it" },
              { fig: "image108.jpeg", alt: "The same plant with YOLOv11 detections" },
            ],
          },
        ],
      },
      {
        id: "p1-next",
        type: "text",
        title: "What's next",
        body:
          "The field run points at three improvements. The Pi should buffer results locally and reconnect on its own, so a network blip pauses a session instead of ending it. The column moves are where the time goes, so they're the place to tune speed and acceleration. And midday sun overexposes the camera and shifts the chili colours, which is why scans ran in the late afternoon; a diffuser on the camera housing would open up the rest of the day.",
      },
      {
        id: "p1-tools",
        type: "tools",
        title: "Built with",
        items: [
          "Raspberry Pi 4",
          "ESP32",
          "NEMA17",
          "DRV8825",
          "VL53L1X",
          "MG90S",
          "Logitech C922",
          "Aluminium T-slot",
          "GT2 belt",
          "Lead screw",
          "Python",
          "FastAPI",
          "YOLOv11",
          "Next.js",
          "PostgreSQL",
        ],
      },
    ],
  },
  {
    slug: "chili-ripeness-yolov11",
    title: "Chili Ripeness Model with YOLOv11",
    client: CLIENT,
    category: "IoT & AI Systems",
    summary:
      "A YOLOv11 detector trained from scratch to find every chili on a plant and grade it unripe, turning, ripe or broken, small enough to run on a Raspberry Pi 4.",
    content:
      "The gantry can put a camera over any plant, but a photo of a chili bush is a hard thing to read: dozens of fruits per frame, half of them hidden behind leaves, and green fruit that's almost the same colour as the foliage around it. Classifying cropped single fruits, which most earlier chili studies did, doesn't help here. The model has to find every fruit in a busy scene and grade each one.\n\n" +
      "This is the vision half of the thesis. The dataset was collected and labelled for the project, the model was trained from random weights with no pretrained backbone, it was tuned over four runs and benchmarked against YOLOv8s and Faster R-CNN. It then ran for a week on the Raspberry Pi in the greenhouse, where it was checked against a hand count of every fruit.",
    cover: { fig: "image66.jpeg", alt: "YOLOv11 detections on a fruiting chili plant" },
    year: 2026,
    featured: false,
    order: 0,
    sections: [
      { id: "p2-hero", type: "hero" },
      { id: "p2-intro", type: "intro" },
      {
        id: "p2-results",
        type: "results",
        title: "Results",
        items: [
          { value: "0.855", label: "mAP@50 on the held-out test set" },
          { value: "0.838", label: "Precision (recall 0.771, mAP@50-95 0.593)" },
          { value: "170 ms", label: "Per image on a Raspberry Pi 4 (~5.5 FPS)" },
          { value: "94.3%", label: "Precision against a hand count in the greenhouse" },
        ],
      },
      {
        id: "p2-classes",
        type: "features",
        title: "Four classes",
        items: [
          {
            title: "Unripe",
            description: "Light to dark green, small and firm. No damage, just not ready yet.",
          },
          {
            title: "Turning",
            description: "Partway from green to orange or red, skin starting to soften. The in-between stage.",
          },
          {
            title: "Ripe",
            description: "Evenly orange to bright red, full-sized, smooth and glossy. Ready to pick.",
          },
          {
            title: "Broken",
            description:
              "Brown, black or spotted; soft, wrinkled or holed. Judged against the Indonesian national standard (SNI) for fresh chili, whatever the cause.",
          },
        ],
      },
      {
        id: "p2-dataset",
        type: "text",
        title: "Building the dataset",
        body:
          "Every image comes from a camera pointed at real plants. 526 were shot in a home garden where the plants were raised, from straight-on and angled-down viewpoints in the morning, midday and afternoon. 208 came from the gantry's own top-down camera in the greenhouse, including evening shots. Healthy plants rarely have rotten fruit, so 195 images from a public Roboflow set of diseased chilies filled in the broken class.\n\n" +
          "Footage was recorded as 1080p video at 30 fps and sampled at two frames per second, then cleaned of blurry, duplicate and chili-free frames. That left 929 images, labelled by hand in Roboflow with 28,263 bounding boxes: about 30 fruits per image. The classes are far from balanced (16,907 unripe, 8,209 ripe, 2,767 turning, 380 broken), which is simply what a plant looks like mid-season.\n\n" +
          "The images were split 70/20/10 into 650 training, 186 validation and 93 test images, and the training set was tripled to 1,950 with 90° rotations, light noise and horizontal flips.",
      },
      {
        id: "p2-dataset-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image55.png", alt: "A labelled frame with dozens of unripe, turning and ripe boxes" } },
          {
            kind: "grid",
            items: [
              { fig: "image54.jpeg", alt: "A rotting chili on the plant" },
              { fig: "image56.png", alt: "Broken fruit labelled in Roboflow" },
            ],
          },
        ],
      },
      {
        id: "p2-runs",
        type: "results",
        title: "Four tuning runs (mAP@50)",
        items: [
          { value: "0.780", label: "Run 1: YOLOv11n at 640 px, default SGD" },
          { value: "0.812", label: "Run 2: same model at 960 px" },
          { value: "0.824", label: "Run 3: AdamW with a cosine learning-rate schedule" },
          { value: "0.858", label: "Run 4: YOLOv11s at 1280 px, tighter regularisation" },
        ],
      },
      {
        id: "p2-tuning",
        type: "text",
        title: "What each run fixed",
        body:
          "Run 1 was a baseline with Ultralytics defaults. Its mAP@50 and mAP@50-95 sat 0.285 apart, a sign of sloppy boxes: at 640 px a single frame packs 40-plus fruits into very few pixels each. Raising the resolution to 960 px in Run 2 lifted both numbers, but the curves plateaued by epoch 123 with the learning rate stuck where it started.\n\n" +
          "Run 3 swapped in AdamW at a lower learning rate with cosine decay and a longer warmup. Training stayed stable to the last epoch, but gained only 0.012. That pointed at the nano model's capacity, not the optimiser, as the limit.\n\n" +
          "Run 4 moved to YOLOv11s at 1280 px and tightened regularisation (more weight decay, mixup, a heavier classification loss, a longer warmup and close-mosaic window) so the bigger network wouldn't overfit while learning from scratch. It peaked between epochs 108 and 127 and early-stopped at 177, after about 4 hours on two Tesla T4s on Kaggle.",
      },
      {
        id: "p2-config",
        type: "tools",
        title: "Final configuration",
        items: [
          "YOLOv11s, from scratch",
          "1280 px input",
          "Batch 16",
          "AdamW, lr0 0.005",
          "Cosine LR",
          "Warmup 8 epochs",
          "Weight decay 0.0007",
          "cls loss 0.7",
          "Mixup 0.1",
          "close_mosaic 20",
          "Patience 50",
          "NMS IoU 0.45",
        ],
      },
      {
        id: "p2-curves",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image60.png", alt: "Run 4 training and validation losses, precision, recall and mAP" } },
          { kind: "image", item: { fig: "image61.png", alt: "Normalised confusion matrix of the final model" } },
          { kind: "image", item: { fig: "image64.png", alt: "F1-confidence curve peaking at 0.80 at confidence 0.489" } },
        ],
      },
      {
        id: "p2-per-class",
        type: "results",
        title: "mAP@50 by class",
        items: [
          { value: "0.900", label: "Broken" },
          { value: "0.895", label: "Ripe" },
          { value: "0.883", label: "Unripe" },
          { value: "0.743", label: "Turning" },
        ],
      },
      {
        id: "p2-turning",
        type: "text",
        title: "The turning problem",
        body:
          "Three classes are solid. Turning isn't. The confusion matrix gets it right 71% of the time, with the rest mostly lost to background or called unripe: a fruit that's half green and half orange sits between two classes and, from above, looks a lot like the leaves around it. The background row shows the same thing in reverse, with leaves, stems and shadows mistaken for unripe fruit.\n\n" +
          "The F1-confidence curve sets the deployed threshold. F1 peaks at 0.80 at a confidence of 0.489 and stays flat between about 0.1 and 0.7. Precision only reaches 1.0 at 0.959, by which point recall has collapsed, so 0.489 is what the Pi uses.\n\n" +
          "YOLOv8s and Faster R-CNN, trained on the same data, both show the same weakness, at 0.726 and 0.600 mAP@50 for turning. That points at the data, not the architecture.",
      },
      {
        id: "p2-stress",
        type: "text",
        title: "Stress tests",
        body:
          "Before going near the hardware, the model was checked image by image, with every fruit counted by hand. Six scenes covered a top-down view in the greenhouse, a side-on view at plant height, a close-up, a plant outside the greenhouse, a dense frame from the gantry camera and a frame built around rotten fruit.\n\n" +
          "Across 257 detections it scored 94.9% precision and 87.5% recall. Side-on views hurt recall most (82.1%), since leaves hide more fruit. The gantry view caught every fruit but over-detected a little (85.3% precision), and the outside-the-greenhouse plant scored 95.8% on both, so the model isn't tied to one setting.",
      },
      {
        id: "p2-stress-gallery",
        type: "gallery",
        blocks: [
          {
            kind: "grid",
            items: [
              { fig: "image67.jpeg", alt: "Top-down test image before detection" },
              { fig: "image68.jpeg", alt: "The same image with YOLOv11 detections" },
            ],
          },
        ],
      },
      {
        id: "p2-compare",
        type: "results",
        title: "Against the alternatives",
        items: [
          { value: "0.855", label: "YOLOv11s mAP@50, 170 ms per image on the Pi" },
          { value: "0.845", label: "YOLOv8s mAP@50, 195 ms per image on the Pi" },
          { value: "0.734", label: "Faster R-CNN (ResNet-50 FPN) mAP@50, 1,650 ms per image" },
          { value: "9.7×", label: "How much faster YOLOv11s runs than Faster R-CNN on the Pi" },
        ],
      },
      {
        id: "p2-compare-text",
        type: "text",
        title: "Why YOLOv11",
        body:
          "All three were trained from scratch on the same data and hardware, with hyperparameters matched as closely as each architecture allowed. YOLOv8s came close: slightly higher recall (0.799), slightly lower mAP across the board, and 25 ms slower on the Pi despite having more parameters (about 11.2M against 9.4M).\n\n" +
          "Faster R-CNN was the outlier. Each epoch took about 372 seconds against roughly 80 for the YOLO models, and the run hit Kaggle's 12-hour session cap at epoch 106. Its precision of 0.560 against a recall of 0.796 shows a model that over-predicts, and at 1.65 s per image on the Pi it's too slow for a scan that already spends its time moving.",
      },
      {
        id: "p2-compare-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image165.png", alt: "Faster R-CNN's normalised confusion matrix" } },
        ],
      },
      {
        id: "p2-field",
        type: "text",
        title: "In the field",
        body:
          "The real test was a week of scans in the greenhouse, 1 to 7 July 2026. Before a scan, every fruit on all 27 plants was counted by hand: 950 fruits in total. The model found 863 of them, with 52 false detections and 87 misses, for 94.3% precision and 90.8% recall. Misses outnumber false alarms, which fits what the camera sees: fruit tucked behind leaves.\n\n" +
          "Ripe and unripe both held above 95% precision and 91% recall. Turning dropped to 75.4% and 77.8%, the same weak spot as on the test set. Over six complete sessions the class mix barely moved from day to day, with unripe making up about two thirds of detections and ripe about 30%.\n\n" +
          "The harvest rule (more than five ripe fruits means pick it) matched the hand count on 25 of 27 plants. Both misses were false alarms on plants sitting right at the threshold, where one wrong ripe call flips the decision.",
      },
      {
        id: "p2-next",
        type: "text",
        title: "Next",
        body:
          "Turning needs more examples, plus augmentation aimed at that colour range, such as targeted colour jitter and hard-negative mining on the fruit it confuses with ripe and unripe. The broken class should be rebuilt from real greenhouse photos instead of a borrowed dataset. And midday light, which washes out the colours and is why every scan ran in the late afternoon, needs either training data from those hours or a diffuser on the camera.",
      },
      {
        id: "p2-tools",
        type: "tools",
        title: "Built with",
        items: [
          "Ultralytics YOLOv11",
          "PyTorch",
          "Roboflow",
          "Kaggle (2× Tesla T4)",
          "OpenCV",
          "Python",
          "Raspberry Pi 4",
        ],
      },
    ],
  },
  {
    slug: "chili-gantry-dashboard",
    title: "Chili Gantry Control Dashboard",
    client: CLIENT,
    category: "Software Development",
    summary:
      "The web app that runs the greenhouse: start a scan, watch the gantry work live, and keep every photo, detection and harvest call on record.",
    content:
      "A gantry, two microcontrollers, a camera and a model on a Raspberry Pi don't add up to a tool anyone can use until something ties them together. That something is this dashboard: the place where scans and watering runs are started or scheduled, followed live plant by plant, and looked back on later.\n\n" +
      "It's a full-stack Next.js app backed by PostgreSQL, and it's the single source of truth for the whole system. The Pi runs a small, stateless FastAPI service that does the physical work and reports back as it goes. The browser talks to the Pi directly only for the things that have to be live: the event stream and the camera feed.",
    cover: { fig: "image92.png", alt: "The dashboard overview with sensors, schedule and live CCTV" },
    websiteUrl: "https://chili.cocisresearchgroup.my.id",
    year: 2026,
    featured: false,
    order: 1,
    sections: [
      { id: "p3-hero", type: "hero" },
      { id: "p3-intro", type: "intro" },
      {
        id: "p3-architecture",
        type: "features",
        title: "Who talks to whom",
        items: [
          {
            title: "Next.js + PostgreSQL",
            description:
              "Owns every record. Sessions are always created here and their IDs handed to the Pi, never the other way round.",
          },
          {
            title: "FastAPI on the Pi",
            description:
              "Stateless. Drives the ESP32s over USB and UART, runs YOLOv11, and writes each plant's photo and results back to Next.js the moment they exist, not in a batch at the end.",
          },
          {
            title: "Browser ↔ Pi",
            description:
              "Server-Sent Events and the MJPEG camera feed come straight from the Pi. Next.js is never in the live path, so streaming doesn't load the app server.",
          },
          {
            title: "Sensor node → Next.js",
            description:
              "A separate ESP32 posts temperature, humidity and light directly to the dashboard; the Pi isn't involved.",
          },
        ],
      },
      {
        id: "p3-architecture-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image89.png", alt: "System architecture: router, PC server, Raspberry Pi, two ESP32s and peripherals" } },
        ],
      },
      {
        id: "p3-session",
        type: "text",
        title: "Life of a session",
        body:
          "Pressing Start Scan creates a session in Postgres as PENDING and posts its ID to the Pi. If the Pi is already busy it answers 409 Conflict, so two sessions can never run at once; otherwise it marks the session RUNNING and the browser subscribes to its event stream.\n\n" +
          "From there the events tell the story: session_started, motors_homed, then a gantry_moved and plant_scanned for each of the 27 plants, and finally session_complete, or session_error if a move or capture fails and the gantry stops. Behind each plant_scanned, the Pi has already uploaded the photo to Next.js and posted the per-class counts, so a refresh or a second viewer sees exactly the same state. If the selected model fails to load, the Pi falls back to the default weights instead of aborting the run.\n\n" +
          "Each finished plant appears as a card with the raw and annotated photo side by side, its fruit counts per class, and a ready-to-harvest badge once it passes five ripe fruits.",
      },
      {
        id: "p3-session-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image102.png", alt: "Raw photo and YOLOv11 detections compared side by side for one plant" } },
        ],
      },
      {
        id: "p3-pages",
        type: "features",
        title: "Inside the dashboard",
        items: [
          {
            title: "Overview",
            description:
              "Greenhouse conditions at a glance: environment sensors, soil moisture and the last watering, today's schedule, weekly ripe detections and a live CCTV feed.",
          },
          {
            title: "Plants and beds",
            description:
              "Ripeness totals per class and a harvest-readiness gauge for the whole crop, then a page per bed with the live camera, a 27-plant status grid and the history of every capture.",
          },
          {
            title: "Gantry controls",
            description:
              "A live feed with a 70 × 70 cm region-of-interest overlay, grid layout settings (rows, columns, spacing), camera tuning (resolution, exposure, white balance, focus) and manual jogging of every axis and the pan-tilt head.",
          },
          {
            title: "Scheduling",
            description:
              "A weekly timeline of recurring scan and watering sessions. The Pi polls for due jobs, so nobody needs to keep the page open.",
          },
          {
            title: "Three kinds of session",
            description:
              "Ripeness scans, full-bed watering passes, and dataset-collection runs that capture fresh images for the next round of training.",
          },
          {
            title: "Signed in only",
            description:
              "Clerk guards everything, so only registered users can see the data or move the machine.",
          },
        ],
      },
      {
        id: "p3-pages-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image94.png", alt: "All plants: monthly detection summary and harvest readiness" } },
          { kind: "image", item: { fig: "image98.png", alt: "Bed detail with the region-of-interest overlay and camera settings" } },
          { kind: "image", item: { fig: "image93.png", alt: "Weekly schedule of scanning and watering sessions" } },
        ],
      },
      {
        id: "p3-partner",
        type: "text",
        title: "Plugging in a partner app",
        body:
          "A research partner built their own greenhouse dashboard in Laravel, and it needed to start and follow scans too. Rather than share a database, it goes through a small API on this app: POST /api/partner/sessions to create and start a session, GET /api/partner/sessions and /api/partner/sessions/:id for history and detail, and POST /api/partner/sessions/:id/stop to halt one.\n\n" +
          "For live progress it subscribes to the same Pi event stream (GET /sessions/:id/events) the main dashboard uses. Both apps stay independent, but they drive the same hardware and read the same history.",
      },
      {
        id: "p3-partner-gallery",
        type: "gallery",
        blocks: [
          { kind: "image", item: { fig: "image105.jpeg", alt: "The partner's Laravel app starting a scan and showing live captures" } },
        ],
      },
      {
        id: "p3-reliability",
        type: "text",
        title: "Built for flaky hardware",
        body:
          "Every hardware service on the Pi degrades to a stub when its device is missing: gantry commands succeed instantly, soil sensors return plausible random readings, the camera serves a synthetic frame stamped STUB MODE, and the model returns random detections. A full session can be run end to end on a laptop, with faster fake moves, long before the gantry is wired up.\n\n" +
          "The week of field testing showed where it still falls short. On one of seven days the network between the Pi and the dashboard dropped mid-scan and the session ended. Next on the list are automatic reconnects and a local buffer on the Pi, so a blip pauses a session instead of ending it.",
      },
      {
        id: "p3-tools",
        type: "tools",
        title: "Built with",
        items: [
          "Next.js",
          "TypeScript",
          "PostgreSQL",
          "Prisma",
          "Clerk",
          "Tailwind CSS",
          "shadcn/ui",
          "Zod",
          "React Hook Form",
          "FastAPI",
          "Server-Sent Events",
          "MJPEG",
        ],
      },
    ],
  },
];
