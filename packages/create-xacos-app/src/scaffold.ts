import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';

export type DbDriver = 'sqlite' | 'mysql' | 'postgres' | 'mongodb';

export interface ScaffoldAnswers {
  projectName: string;
  dbDriver: DbDriver;
  includeAuth: boolean;
  includeExample: boolean;
}

export async function scaffold(nameArg?: string): Promise<void> {
  console.log('\n' + chalk.bold.cyan('  XAOCS — Create New App') + '\n');

  const answers = await prompts([
    {
      type: nameArg ? null : 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-xacos-app',
      validate: (v: string) => /^[a-z0-9-]+$/.test(v) || 'Use lowercase letters, numbers, and hyphens only',
    },
    {
      type: 'select',
      name: 'dbDriver',
      message: 'Database:',
      choices: [
        { title: 'SQLite (zero config, great for dev)', value: 'sqlite' },
        { title: 'MySQL', value: 'mysql' },
        { title: 'PostgreSQL', value: 'postgres' },
        { title: 'MongoDB', value: 'mongodb' },
      ],
      initial: 0,
    },
    {
      type: 'confirm',
      name: 'includeAuth',
      message: 'Include authentication (email + password)?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'includeExample',
      message: 'Include example API and page?',
      initial: true,
    },
  ]);

  const projectName: string = nameArg ?? answers['projectName'];
  const dbDriver: DbDriver = answers['dbDriver'];
  const includeAuth: boolean = answers['includeAuth'];
  const includeExample: boolean = answers['includeExample'];

  if (!projectName) {
    console.log(chalk.red('  Aborted.'));
    process.exit(1);
  }

  const projectDir = resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.error(chalk.red(`\n  Error: Directory "${projectName}" already exists.\n`));
    process.exit(1);
  }

  const spinner = ora(`Scaffolding ${projectName}…`).start();

  try {
    // ── Create directory structure ──────────────────────────────────────────
    const dirs = [
      'app/controllers',
      'app/services',
      'app/middlewares',
      'api',
      'views/layouts',
      'views/auth',
      'config',
      'database/models',
      'database/migrations',
      'database/seeders',
      'public',
    ];
    for (const dir of dirs) {
      mkdirSync(join(projectDir, dir), { recursive: true });
    }

    // ── Write template files ────────────────────────────────────────────────
    writePackageJson(projectDir, projectName);
    writeTsConfig(projectDir);
    writeXacosConfig(projectDir);
    writeEnv(projectDir, dbDriver);
    writeBaseFiles(projectDir, includeAuth);

    
    spinner.succeed('Project scaffolded');

    console.log('\n' + chalk.green.bold('  ✓ Done!') + '\n');
    console.log(`  ${chalk.cyan('cd')} ${projectName}`);
    console.log(`  ${chalk.cyan('bun install')}`);
    console.log(`  ${chalk.cyan('xacos dev')}\n`);

  } catch (err) {
    spinner.fail('Scaffolding failed');
    console.error(chalk.red((err as Error).message));
    process.exit(1);
  }
}

function writePackageJson(projectDir: string, projectName: string) {
  const pkg = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'xacos dev',
      build: 'xacos build',
      start: 'xacos start',
      migrate: 'xacos migrate',
      seed: 'xacos db:seed',
    },
    dependencies: {
      '@xacos/auth': 'latest',
      '@xacos/client': 'latest',
      '@xacos/core': 'latest',
      '@xacos/orm': 'latest',
      '@xacos/ui': 'latest',
      'react': '^18.3.1',
      'react-dom': '^18.3.1',
    },
    devDependencies: {
      '@xacos/cli': 'latest',
      '@types/react': '^18.3.12',
      '@types/react-dom': '^18.3.1',
      'typescript': '^5.7.3',
    },
  };
  writeFileSync(join(projectDir, 'package.json'), JSON.stringify(pkg, null, 2));
}

function writeTsConfig(projectDir: string) {
  const config = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      experimentalDecorators: true,
      useDefineForClassFields: false,
      esModuleInterop: true,
      skipLibCheck: true,
      baseUrl: '.',
      paths: {
        '@app/*': ['./app/*'],
        '@views/*': ['./views/*'],
        '@api/*': ['./api/*'],
        '@db/*': ['./database/*'],
      },
    },
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules', '.xacos'],
  };
  writeFileSync(join(projectDir, 'tsconfig.json'), JSON.stringify(config, null, 2));
}

function writeXacosConfig(projectDir: string) {
  const content = `import { defineConfig } from '@xacos/config';

export default defineConfig({
  port: Number(process.env['APP_PORT']) || 5000,
  views: { dir: './views', defaultLayout: 'main' },
  api: { prefix: '/api', dir: './api' },
});
`;
  writeFileSync(join(projectDir, 'xacos.config.ts'), content);
}

function writeEnv(projectDir: string, dbDriver: DbDriver) {
  const content = `# App
APP_NAME=XAOCS_App
APP_ENV=development
APP_PORT=5000
APP_URL=http://localhost:5000

# Security
JWT_SECRET=${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}
JWT_EXPIRES_IN=7d

# Database
DB_DRIVER=${dbDriver}
${dbDriver === 'sqlite' ? 'DB_PATH=./database/db.sqlite' : '# DB_HOST=localhost\n# DB_PORT=...\n# DB_DATABASE=...\n# DB_USERNAME=...\n# DB_PASSWORD=...'}
`;
  writeFileSync(join(projectDir, '.env'), content);
  writeFileSync(join(projectDir, '.env.example'), content);
}

function writeBaseFiles(projectDir: string, includeAuth: boolean) {
  // ── api/index.api.ts ──────────────────────────────────────────────────────
  const apiIndex = `import { XRouter } from '@xacos/core';

const router = new XRouter();

router.get('/', async (req, res) => {
  return res.json({
    message: 'Welcome to XAOCS API',
    version: '0.1.0'
  });
});

export default router;
`;
  writeFileSync(join(projectDir, 'api/index.api.ts'), apiIndex);

  // ── views/index.tsx ───────────────────────────────────────────────────────
  const viewIndex = `import React from 'react';

export const meta = {
  title: 'Welcome to XAOCS',
  description: 'Your new XAOCS application is ready.'
};

export default function IndexPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>XAOCS</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        The high-performance framework for rapid development.
      </p>
      <div style={{ marginTop: '40px' }}>
        <a href="/api" style={{ marginRight: '20px', color: '#0070f3' }}>View API</a>
        ${includeAuth ? '<a href="/login" style={{ color: "#0070f3" }}>Login</a>' : ''}
      </div>
    </div>
  );
}
`;
  writeFileSync(join(projectDir, 'views/index.tsx'), viewIndex);

  // ── views/layouts/main.tsx ────────────────────────────────────────────────
  const navbarActions = includeAuth ? 'actions={<NavLink href="/login">Login</NavLink>}' : "";
  const layoutMain = `import React from 'react';
import { Navbar, NavLink } from '@xacos/ui';
import { XLink } from '@xacos/client';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-xacos-bg text-xacos-text min-h-screen flex flex-col">
        <Navbar
          brand={<XLink href="/" className="font-bold text-lg no-underline text-xacos-text hover:text-primary-500">MyApp</XLink>}
          ${navbarActions}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </Navbar>
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
        <footer className="border-t border-xacos-border px-4 py-6 text-sm text-xacos-muted text-center">
          &copy; \${new Date().getFullYear()} XAOCS
        </footer>
      </body>
    </html>
  );
}
`;
  writeFileSync(join(projectDir, 'views/layouts/main.tsx'), layoutMain);
}


