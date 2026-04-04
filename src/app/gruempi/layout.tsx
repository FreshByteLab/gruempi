import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Grümpelturnier Hermetschwil-Staffeln 2026",
    default: "Grümpelturnier Hermetschwil-Staffeln 2026",
  },
  description:
    "Das Grümpelturnier für Kinder aus Hermetschwil-Staffeln – 27. Juni 2026 auf dem Fussballplatz Staffeln.",
  openGraph: {
    title: "Grümpelturnier Hermetschwil-Staffeln 2026",
    description: "Das Kinderfussballturnier am 27. Juni 2026",
    locale: "de_CH",
  },
};

// Bare layout — subgroups (public), admin, login, feld each own their shell.
export default function GruempiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
