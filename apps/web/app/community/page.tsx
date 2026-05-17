import React from 'react';
import Link from 'next/link';

export default function CommunityPage() {
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
          <Link href="/community" className="text-white font-semibold transition-colors">
            Community
          </Link>
          <a href="https://github.com/zoherr/xaocs" target="_blank" rel="noreferrer" className="text-[#888888] hover:text-white transition-colors">
            GitHub
          </a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white">Join the Community</h1>
        <p className="text-[#888888] text-lg mb-12">
          XAOCS is open-source and community-driven.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {links.map(link => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg text-left block"
            >
              <div className="text-3xl mb-4 bg-[#2a2a2a] w-12 h-12 rounded-lg flex items-center justify-center shadow-inner">{link.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{link.title}</h3>
              <p className="text-sm text-[#888888] leading-relaxed">{link.description}</p>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-12 px-6 text-center text-sm text-[#888888] mt-20">
        <p>© 2026 XAOCS Framework. Built with passion for AI-native development.</p>
      </footer>
    </div>
  );
}

const links = [
  {
    icon: '💬',
    title: 'Discord',
    url: 'https://discord.gg/xaocs',
    description: 'Chat with the team and other XAOCS developers in real-time.',
  },
  {
    icon: '🐙',
    title: 'GitHub',
    url: 'https://github.com/zoherr/xaocs',
    description: 'Star the repo, file issues, and contribute code.',
  },
  {
    icon: '🐦',
    title: 'Twitter / X',
    url: 'https://x.com/xaocsdev',
    description: 'Follow for updates, tips, and framework announcements.',
  },
];
