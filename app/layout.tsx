import type { Metadata } from "next";
import { Inter, Noto_Serif, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "700"],
});

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-noto-malayalam",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Sanchari Speaks",
  description:
    "നിങ്ങളുടെ വാക്കുകൾ, സഞ്ചാരത്തിന്റെ ശൈലിയിൽ — Transform your words into the narrative style of Sancharam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ml" className={`${inter.variable} ${notoSerif.variable} ${notoSansMalayalam.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
