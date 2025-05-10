import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Towizaza | Official Artist Website",
  description:
    "Official website for music artist Towizaza - Stream music, buy merchandise, and connect with the artist.",
  keywords: ["Towizaza", "music", "artist", "merchandise", "streaming"],
  authors: [{ name: "Towizaza" }],
  creator: "Towizaza",
  openGraph: {
    title: "Towizaza | Official Artist Website",
    description:
      "Official website for music artist Towizaza - Stream music, buy merchandise, and connect with the artist.",
    url: "https://towizaza.com",
    siteName: "Towizaza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Towizaza | Official Artist Website",
    description:
      "Official website for music artist Towizaza - Stream music, buy merchandise, and connect with the artist.",
    creator: "@towizaza",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-dark text-light`}
      >
        {children}
      </body>
      <SanityLive />
    </html>
  );
}
