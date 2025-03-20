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
      <body className="font-sans">
        <div className="hidden lg:block">{children}</div>
        <div className="lg:hidden flex items-center justify-center h-screen text-center px-4">
          <p className="text-lg text-gray-600 max-w-md">
            Please use this application on a desktop. Smaller devices are not
            supported at this time. 😊
          </p>
        </div>
      </body>
      <Toaster />
    </html>
  );
}
