import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { CategoryManager } from "./CategoryManager";
import { Tag } from "lucide-react";

export const metadata: Metadata = { title: "Kategorien" };

export default async function KategorienPage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="text-gray-500">Kein aktives Turnier.</p>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Kategorien</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kategorien verwalten und sortieren
        </p>
      </div>

      <CategoryManager
        tournamentId={tournament.id}
        categories={tournament.categories}
      />
    </div>
  );
}
