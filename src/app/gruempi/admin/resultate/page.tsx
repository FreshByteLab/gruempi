import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getMatchesByTournament } from "@/lib/gruempi/queries/matches";
import { ResultEditor } from "./ResultEditor";
import { ClipboardList } from "lucide-react";

export const metadata: Metadata = { title: "Resultate" };

export default async function ResultatePage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="text-gray-500">Kein aktives Turnier.</p>;

  const matches = await getMatchesByTournament(tournament.id);
  const relevant = matches.filter((m) =>
    m.homeTeamId && m.awayTeamId && m.status !== "CANCELLED"
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Resultate</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resultate erfassen und korrigieren
        </p>
      </div>

      {relevant.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
          <p>Noch keine Spiele erfasst. Erstelle zuerst den Spielplan.</p>
        </div>
      )}

      {tournament.categories.map((cat) => {
        const catMatches = relevant.filter((m) => m.categoryId === cat.id);
        if (catMatches.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-primary-600" />
              {cat.name}
            </h2>
            <div className="space-y-3">
              {catMatches.map((match) => (
                <ResultEditor key={match.id} match={match} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
