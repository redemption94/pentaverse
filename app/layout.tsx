import type { Metadata } from "next";
import "./globals.css"; // Vom crea și acest fișier imediat

export const metadata: Metadata = {
  title: "Pentaverse | CS2 Romania Leaderboard",
  description: "Urmărește elita CS2 din România",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
