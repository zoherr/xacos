import React from 'react';
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
          brand={<XLink href="/" className="font-bold text-lg no-underline text-xacos-text hover:text-primary-500">XAOCS Blog</XLink>}
          actions={<NavLink href="/auth/login">Login</NavLink>}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </Navbar>
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
        <footer className="border-t border-xacos-border px-4 py-6 text-sm text-xacos-muted text-center">
          &copy; {new Date().getFullYear()} XAOCS Blog Demo
        </footer>
      </body>
    </html>
  );
}
