import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://calendargame.vercel.app/'),
  title: 'C-Game — The Calendar Turned Into a Web Game',
  description:
    'C-Game is an interactive web game based on a calendar. Each month hides clues to discover in a fun, immersive, and competitive experience.',

  openGraph: {
    title: 'C-Game — An Interactive Calendar Transformed Into a Web Game',
    description:
      'Discover C-Game, an interactive calendar where each month hides clues. A web mini-game combining logic, investigation, and score ranking.',
    url: '/',
    siteName: 'C-Game',
    images: [
      { url: '/images/cgamedesign.png', width: 1200, height: 630 },
    ],
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'C-Game — The Calendar Became a Web Game',
    description:
      'A calendar like no other: hidden clues, logic, investigation, and competition. Test your detective skills with C-Game.',
    images: ['/images/cgamedesign.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
