import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ 
  weight: '900',
  subsets: ["latin"],
  style: 'italic',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "United Hero Selector",
  description: "Choose your character from heroes in the United Game System, featuring DC and Marvel United",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: '/icons/LOGO.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    shortcut: '/favicon.ico',
    apple: '/icons/LOGO.ico',
  },
  openGraph: {
    title: "United Hero Selector",
    description: "Choose your character from heroes in the United Game System, featuring DC and Marvel United",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "United Hero Selector",
    description: "Choose your character from heroes in the United Game System, featuring DC and Marvel United",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable}`}>{children}</body>
    </html>
  );
}

