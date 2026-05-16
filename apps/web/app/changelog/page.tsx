import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function getChangelogContent(): string {
  const possiblePaths = [
    path.join(process.cwd(), '../../CHANGELOG.md'),
    path.join(process.cwd(), 'CHANGELOG.md'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8');
    }
  }

  return '# XAOCS Changelog\n\nNo changelog entries found.';
}

export default function ChangelogPage() {
  const content = getChangelogContent();
  const lines = content.split('\n');

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] font-sans">
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
          <Link href="/changelog" className="text-white font-semibold transition-colors">
            Changelog
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#888888] hover:text-white transition-colors">
            GitHub
          </a>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-white mb-4">Changelog</h1>
        <p className="text-[#888888] mb-12 text-lg border-b border-[#2a2a2a] pb-6">
          All notable changes, sprints, and releases for the XAOCS Framework.
        </p>

        <div className="space-y-6 font-mono text-sm">
          {lines.map((line, i) => {
            if (!line.trim()) return null;

            if (line.startsWith('# ')) {
              return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-[#2a2a2a] pb-2 font-sans">{line.replace('# ', '')}</h2>;
            }

            if (line.startsWith('## ')) {
              return <h3 key={i} className="text-xl font-bold text-blue-400 mt-6 mb-3 font-sans">{line.replace('## ', '')}</h3>;
            }

            if (line.startsWith('- ')) {
              const text = line.replace('- ', '');
              const parts = text.split(': ');
              const dateOrSprint = parts[0];
              const desc = parts.slice(1).join(': ');

              return (
                <div key={i} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:border-[#3a3a3a] transition-colors">
                  <span className="text-blue-400 font-semibold shrink-0 bg-[#2a2a2a] px-2.5 py-1 rounded text-xs">
                    {dateOrSprint}
                  </span>
                  <span className="text-[#cccccc] font-sans text-base leading-relaxed">
                    {desc || dateOrSprint}
                  </span>
                </div>
              );
            }

            return <p key={i} className="text-[#888888] font-sans">{line}</p>;
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-12 px-6 text-center text-sm text-[#888888] mt-20">
        <p>© 2026 XAOCS Framework. Built with passion for AI-native development.</p>
      </footer>
    </div>
  );
}
