'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'api' | 'controller' | 'orm' | 'migration'>('api');

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0f0f0f]/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
            <span className="text-blue-500">XAOCS</span> Framework
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="http://localhost:3001/docs" className="text-[#888888] hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="/changelog" className="text-[#888888] hover:text-white transition-colors">
            Changelog
          </Link>
          <Link href="/community" className="text-[#888888] hover:text-white transition-colors">
            Community
          </Link>
          <a href="https://github.com/zoherr/xaocs" target="_blank" rel="noreferrer" className="text-[#888888] hover:text-white transition-colors">
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero Section (Sprint 141) */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
          <span>🚀</span> v1.0 — Now in Beta
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-white">
          Build faster.<br />
          <span className="text-blue-500 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
            Ship cleaner.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-[#888888] mb-12 max-w-2xl mx-auto leading-relaxed">
          XAOCS is a full-stack TypeScript framework — one server, one port, backend API + React frontend, built for AI-native development.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="http://localhost:3001/docs"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Get Started →
          </Link>
          <code className="w-full sm:w-auto px-6 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm font-mono text-[#e5e5e5] flex items-center justify-center shadow-inner">
            bunx create-xacos-app my-app
          </code>
        </div>
        <div className="mt-6 animate-fade-in">
          <a href="https://xaocs-blog-demo.fly.dev" className="text-blue-400 underline hover:text-blue-300 transition-colors text-base font-medium">
            View live demo →
          </a>
        </div>
      </section>

      {/* Interactive Code Showcase Section (Sprint 142) */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Code Showcase</h2>
          <p className="text-[#888888] max-w-xl mx-auto">
            Explore the clean, intuitive APIs and architectural patterns that make XAOCS a joy to use.
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-[#2a2a2a] bg-[#0f0f0f]/50 px-4 pt-4 gap-2">
            {[
              { id: 'api', label: 'user.api.ts' },
              { id: 'controller', label: 'UserController.ts' },
              { id: 'orm', label: 'User.ts (XModel)' },
              { id: 'migration', label: 'create_users_table.ts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-all border-t border-x border-transparent flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-[#1a1a1a] text-white border-[#2a2a2a]'
                    : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]/50'
                  }`}
              >
                <span className="text-blue-500">📄</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 font-mono text-sm overflow-x-auto bg-[#141414]">
            {activeTab === 'api' && (
              <pre className="text-blue-400 leading-relaxed">
                {`import { XRouter, app } from '@xacos/core';
import { UserController } from '../app/controllers/UserController';

export const router = new XRouter();
const controller = app.make<UserController>('UserController');

// GET /api/user
router.get('/', (req, res) => controller.index(req, res));

// GET /api/user/:id
router.get('/:id', (req, res) => controller.show(req, res));`}
              </pre>
            )}

            {activeTab === 'controller' && (
              <pre className="text-purple-400 leading-relaxed">
                {`import { XController } from '@xacos/core';
import { UserService } from '../services/UserService';

export class UserController extends XController {
  static inject = ['UserService'];

  constructor(private userService: UserService) {
    super();
  }

  async index(req: XRequest, res: XResponse) {
    const users = await this.userService.getAllUsers();
    return this.json(res, { users });
  }

  async show(req: XRequest, res: XResponse) {
    const user = await this.userService.getUserById(Number(req.params.id));
    return this.json(res, { user });
  }
}`}
              </pre>
            )}

            {activeTab === 'orm' && (
              <pre className="text-emerald-400 leading-relaxed">
                {`import { XModel, Column, HasMany } from '@xacos/orm';
import { Post } from './Post';

export class User extends XModel {
  static tableName = 'users';

  @Column()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ hidden: true }) // Stripped from JSON
  password!: string;

  @HasMany(() => Post, 'user_id')
  posts!: Post[];
}`}
              </pre>
            )}

            {activeTab === 'migration' && (
              <pre className="text-amber-400 leading-relaxed">
                {`import { Migration, Schema } from '@xacos/orm';

export class CreateUsersTable extends Migration {
  async up() {
    await Schema.createTable('users', (table) => {
      table.id();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.xacosTimestamps();
      table.xacosSoftDeletes();
    });
  }

  async down() {
    await Schema.dropTable('users');
  }
}`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid Section (Sprint 141) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'One Server', description: 'Frontend and API on port 5000. No proxy config, no CORS headaches.' },
            { icon: '📁', title: 'File-Based Routing', description: 'user.api.ts → /api/user. index.tsx → /. Zero manual registration.' },
            { icon: '🧠', title: 'AI-Native', description: 'Folder structure and conventions optimized for Cursor, Claude, and Copilot.' },
            { icon: '🛡️', title: 'Type-Safe ORM', description: 'XModel with Eloquent-style queries. MySQL, Postgres, SQLite, MongoDB.' },
            { icon: '🔐', title: 'Auth Built-In', description: 'Email + password, JWT, cookie-based sessions. Zero setup.' },
            { icon: '🚀', title: 'Laravel DX', description: 'The comfort of Laravel conventions — in TypeScript, on Bun.' },
          ].map(f => (
            <div
              key={f.title}
              className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-4 bg-[#2a2a2a] w-12 h-12 rounded-lg flex items-center justify-center shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-12 px-6 text-center text-sm text-[#888888]">
        <p>© 2026 XAOCS Framework. Built with passion for AI-native development.</p>
      </footer>
    </div>
  );
}
