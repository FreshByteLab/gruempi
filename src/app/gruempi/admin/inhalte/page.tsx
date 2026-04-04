import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { prisma } from "@/lib/gruempi/db";
import { ContentEditor } from "./ContentEditor";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "Inhalte" };

export default async function InhaltePage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="text-gray-500">Kein aktives Turnier.</p>;

  const legalPages = await prisma.legalPage.findMany();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Inhalte</h1>
        <p className="text-gray-500 text-sm mt-1">
          Turniertexte und rechtliche Seiten bearbeiten
        </p>
      </div>

      <ContentEditor
        tournament={{
          id: tournament.id,
          heroText: tournament.heroText ?? "",
          description: tournament.description ?? "",
        }}
        legalPages={legalPages.map((p) => ({
          slug: p.slug,
          title: p.title,
          content: p.content,
        }))}
      />
    </div>
  );
}
