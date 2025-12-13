import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Commands",
    url: "#how-to-use",
  },
  {
    id: "2",
    title: "Documentation",
    url: "#roadmap",
  },
  {
    id: "3",
    title: "Get Started",
    url: "#pricing",
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Professional Structure",
  "TypeScript Support",
  "Auto-wiring Routes",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Project Initialization",
    text: "Create production-ready Node.js backend projects with a single command. Support for JavaScript and TypeScript with professional folder structure.",
    date: "v1.0.0",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Database Integration",
    text: "Seamless setup for MongoDB with Mongoose or Prisma ORM. Automatic database configuration and connection management.",
    date: "v1.0.0",
    status: "done",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Module Generation",
    text: "Generate complete modules with controller, service, model, and routes. Auto-wiring routes for instant API endpoints.",
    date: "v1.0.0",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Advanced Features",
    text: "Redis caching, WebSocket support, Socket.io integration, message queues with BullMQ, and Docker deployment ready.",
    date: "v1.0.8",
    status: "done",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "Xacos integrates seamlessly with the modern Node.js ecosystem. Build faster with industry-standard tools and best practices.";

export const collabContent = [
  {
    id: "0",
    title: "Express.js Framework",
    text: collabText,
  },
  {
    id: "1",
    title: "TypeScript Support",
  },
  {
    id: "2",
    title: "Production Ready",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Express.js",
    icon: yourlogo,
    width: 36,
    height: 36,
  },
  {
    id: "1",
    title: "MongoDB",
    icon: yourlogo,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Prisma",
    icon: yourlogo,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Redis",
    icon: yourlogo,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "TypeScript",
    icon: yourlogo,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Docker",
    icon: yourlogo,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Socket.io",
    icon: yourlogo,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "GitHub Actions",
    icon: yourlogo,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Quick Start",
    description: "Get started in seconds with npx",
    price: "0",
    features: [
      "Initialize projects with one command",
      "JavaScript and TypeScript support",
      "Professional folder structure",
      "Auto-wired routes and modules",
    ],
  },
  {
    id: "1",
    title: "Full Stack",
    description: "Complete backend with all features",
    price: "0",
    features: [
      "Everything in Quick Start",
      "MongoDB or Prisma ORM setup",
      "Redis caching integration",
      "WebSocket and Socket.io support",
      "Docker and CI/CD ready",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Production-ready with advanced features",
    price: "0",
    features: [
      "Everything in Full Stack",
      "Message queues with BullMQ",
      "Pub/Sub event system",
      "GitHub Actions CI/CD",
      "Complete documentation",
      "Community support",
    ],
  },
];

export const benefits = [
  {
    id: "0",
    title: "One Command Setup",
    text: "Initialize a complete production-ready backend project with a single command. No configuration needed.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "TypeScript Ready",
    text: "Full TypeScript support with type definitions. Write type-safe code from day one with IntelliSense support.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Database Options",
    text: "Choose between MongoDB with Mongoose or Prisma ORM. Both options include optimized connection handling.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Auto-wired Routes",
    text: "Generate modules with controller, service, model, and routes. Routes are automatically registered in your app.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Real-time Support",
    text: "Built-in WebSocket and Socket.io support. Add real-time features to your application effortlessly.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "Production Ready",
    text: "Docker configuration, CI/CD workflows, Redis caching, and message queues. Deploy with confidence.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];
