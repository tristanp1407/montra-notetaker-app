import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
