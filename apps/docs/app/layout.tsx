import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XAOCS Documentation",
  description: "Official documentation for the XAOCS Framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-[#0f0f0f] text-[#e5e5e5]">
        {children}
      </body>
    </html>
  );
}


