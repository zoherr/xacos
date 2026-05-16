import React from 'react';
import Link from 'next/link';
import { sidebar } from '../../lib/sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e5e5] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#2a2a2a] bg-[#0f0f0f]/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg text-white flex items-center gap-2">
            <span className="text-blue-500">XAOCS</span> Docs
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="http://localhost:3001" className="text-[#888888] hover:text-white transition-colors">
            Web App
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#888888] hover:text-white transition-colors">
            GitHub
          </a>
        </nav>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#2a2a2a] p-6 hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-6">
            {sidebar.map((section, i) => (
              <div key={i}>
                {section.href ? (
                  <Link
                    href={section.href}
                    className="block font-semibold text-white hover:text-blue-400 transition-colors text-sm mb-2"
                  >
                    {section.title}
                  </Link>
                ) : (
                  <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-[#888888]">
                    {section.title}
                  </h3>
                )}
                {section.items && (
                  <ul className="space-y-2 pl-3 border-l border-[#2a2a2a]">
                    {section.items.map((item, j) => (
                      <li key={j}>
                        <Link
                          href={item.href ?? '#'}
                          className="block text-sm text-[#888888] hover:text-white hover:border-blue-500 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* MDX Content Area */}
        <main className="flex-1 p-8 md:p-12 max-w-4xl overflow-x-auto prose prose-invert prose-blue">
          {children}
        </main>
      </div>
    </div>
  );
}
