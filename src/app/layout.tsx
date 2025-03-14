import "./globals.css";

import { Inter } from "next/font/google";

import { Toaster } from "@components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Montra Notetaker",
  description: "AI-powered note management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
      <Toaster />
    </html>
  );
}
