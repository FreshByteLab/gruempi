import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grümpelturnier Hermetschwil-Staffeln",
  description: "Das Grümpelturnier für Kinder aus Hermetschwil-Staffeln",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
