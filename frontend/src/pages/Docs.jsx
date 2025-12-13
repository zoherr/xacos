import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const docsSections = [
  {
    title: "Getting Started",
    items: [
      { id: "installation", title: "Installation", path: "/docs/installation" },
      { id: "quick-start", title: "Quick Start", path: "/docs/quick-start" },
      { id: "project-structure", title: "Project Structure", path: "/docs/project-structure" },
    ],
  },
  {
    title: "Commands",
    items: [
      { id: "init", title: "init", path: "/docs/commands/init" },
      { id: "add", title: "add", path: "/docs/commands/add" },
      { id: "create-redis", title: "create:redis", path: "/docs/commands/create-redis" },
      { id: "create-prisma", title: "create:prisma", path: "/docs/commands/create-prisma" },
      { id: "create-ws", title: "create:ws", path: "/docs/commands/create-ws" },
      { id: "create-socketio", title: "create:socket.io", path: "/docs/commands/create-socketio" },
      { id: "make-docker", title: "make:docker", path: "/docs/commands/make-docker" },
      { id: "make-git-action", title: "make:git-action", path: "/docs/commands/make-git-action" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "typescript", title: "TypeScript Setup", path: "/docs/guides/typescript" },
      { id: "mongodb", title: "MongoDB Setup", path: "/docs/guides/mongodb" },
      { id: "prisma", title: "Prisma Setup", path: "/docs/guides/prisma" },
      { id: "redis", title: "Redis Setup", path: "/docs/guides/redis" },
      { id: "docker", title: "Docker Deployment", path: "/docs/guides/docker" },
    ],
  },
];

const Docs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getDocContent = () => {
    const path = location.pathname;
    
    if (path.includes("/installation")) {
      return {
        title: "Installation",
        content: `# Installation

Xacos CLI can be installed globally via npm or used directly with npx.

## Global Installation

\`\`\`bash
npm install -g xacos
\`\`\`

## Using npx (Recommended)

You can use Xacos without installing it globally:

\`\`\`bash
npx xacos <command>
\`\`\`

## Verify Installation

After installation, verify that Xacos is working:

\`\`\`bash
xacos --version
# or
npx xacos --version
\`\`\`

## Requirements

- Node.js 16.x or higher
- npm 7.x or higher`,
      };
    }
    
    if (path.includes("/quick-start")) {
      return {
        title: "Quick Start",
        content: `# Quick Start

Get started with Xacos CLI in minutes.

## Create Your First Project

\`\`\`bash
npx xacos init my-api --js --mongodb
\`\`\`

This command creates a new backend project with:
- Express.js setup
- MongoDB with Mongoose
- Professional folder structure
- Auto-wired routes

## Start Development Server

\`\`\`bash
cd my-api
npm install
npm run dev
\`\`\`

## Add Your First Module

\`\`\`bash
npx xacos add Users
\`\`\`

This generates:
- Controller
- Service
- Model
- Routes (auto-registered)

## Next Steps

- Read about [Project Structure](/docs/project-structure)
- Learn about [Commands](/docs/commands/init)
- Check out [TypeScript Setup](/docs/guides/typescript)`,
      };
    }

    if (path.includes("/project-structure")) {
      return {
        title: "Project Structure",
        content: `# Project Structure

After running \`xacos init\`, you'll get a professional folder structure:

\`\`\`
my-backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server bootstrap
│   ├── config/             # Configuration files
│   │   ├── db.js
│   │   └── env.js
│   ├── routes/             # API routes
│   │   └── index.js
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   ├── middlewares/        # Custom middlewares
│   ├── utils/              # Utility functions
│   │   ├── logger.js
│   │   └── response.js
│   ├── sockets/            # WebSocket/Socket.io
│   ├── queues/             # Message queues
│   └── subscribers/        # Event subscribers
├── prisma/                 # Prisma schema (if --prisma)
├── docker/                 # Docker files (if --docker)
├── .github/workflows/      # CI/CD (if --git-action)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── xacos.json              # CLI metadata
\`\`\`

## Key Directories

### src/controllers/
Contains route controllers that handle HTTP requests.

### src/services/
Business logic layer. Controllers call services.

### src/models/
Database models (Mongoose or Prisma).

### src/routes/
API route definitions. Routes are auto-wired.`,
      };
    }

    return {
      title: "Documentation",
      content: `# Xacos CLI Documentation

Welcome to the Xacos CLI documentation. Get started by reading the [Installation Guide](/docs/installation) or jump to [Quick Start](/docs/quick-start).

## What is Xacos?

Xacos is a powerful CLI tool that helps you scaffold production-ready Node.js backend projects with Express.js, following industry best practices.

## Features

- ✅ Professional folder structure
- ✅ TypeScript support
- ✅ Database options (MongoDB, Prisma)
- ✅ Real-time support (WebSocket, Socket.io)
- ✅ Redis caching
- ✅ Docker ready
- ✅ CI/CD workflows

## Quick Links

- [Installation](/docs/installation)
- [Quick Start](/docs/quick-start)
- [Commands](/docs/commands/init)
- [Guides](/docs/guides/typescript)`,
    };
  };

  const content = getDocContent();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1 pt-[5.25rem]">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[5.25rem] left-0 h-[calc(100vh-5.25rem)] w-64 bg-n-11 border-r border-n-6 overflow-y-auto z-40 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden mb-4 text-n-4 hover:text-n-1"
            >
              ✕ Close
            </button>
            <nav>
              {docsSections.map((section) => (
                <div key={section.title} className="mb-8">
                  <h3 className="text-sm font-semibold text-n-2 mb-3 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            location.pathname === item.path
                              ? "bg-color-1/10 text-color-1 font-medium"
                              : "text-n-4 hover:text-n-1 hover:bg-n-7"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-20 left-4 z-50 bg-white border border-n-6 rounded-md px-4 py-2 text-sm shadow-lg"
            >
              ☰ Menu
            </button>
            <article className="prose prose-slate max-w-none">
              <h1 className="text-4xl font-bold text-n-1 mb-8">{content.title}</h1>
              <div
                className="text-n-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: content.content
                    .replace(/#{3}\s(.+)/g, '<h3 class="text-2xl font-semibold mt-8 mb-4 text-n-1">$1</h3>')
                    .replace(/#{2}\s(.+)/g, '<h2 class="text-3xl font-semibold mt-10 mb-6 text-n-1">$1</h2>')
                    .replace(/#{1}\s(.+)/g, '<h1 class="text-4xl font-bold mt-12 mb-8 text-n-1">$1</h1>')
                    .replace(/```bash\n([\s\S]*?)```/g, '<pre class="bg-n-11 border border-n-6 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm">$1</code></pre>')
                    .replace(/```\n([\s\S]*?)```/g, '<pre class="bg-n-11 border border-n-6 rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm">$1</code></pre>')
                    .replace(/`([^`]+)`/g, '<code class="bg-n-11 px-1.5 py-0.5 rounded text-sm font-mono text-color-1">$1</code>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-n-1">$1</strong>')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Docs;
