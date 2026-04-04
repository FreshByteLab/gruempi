import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getMatchesByTournament } from "@/lib/gruempi/queries/matches";
import { getTeamsByTournament } from "@/lib/gruempi/queries/teams";
import { PHASE_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/gruempi/constants";
import type { MatchStatus } from "@/lib/gruempi/types";
import { MatchAdminRow } from "./MatchAdminRow";
import { CreateMatchForm } from "./CreateMatchForm";
import { Calendar } from "lucide-react";

export const metadata: Metadata = { title: "Spielplan" };

export default async function SpielePage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="text-gray-500">Kein aktives Turnier.</p>;

  const [matches, teams] = await Promise.all([
    getMatchesByTournament(tournament.id),
    getTeamsByTournament(tournament.id),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Spielplan</h1>
          <p className="text-gray-500 text-sm mt-1">{matches.length} Spiele erfasst</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-primary-600" />
          Neues Spiel erfassen
        </h2>
        <CreateMatchForm
          tournamentId={tournament.id}
          categories={tournament.categories}
          teams={teams}
        />
      </div>

      {/* Match list grouped by category */}
      {tournament.categories.map((cat) => {
        const catMatches = matches.filter((m) => m.categoryId === cat.id);
        if (catMatches.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-primary-600" />
              {cat.name}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {catMatches.map((match, idx) => (
                <div key={match.id}>
                  <MatchAdminRow match={match} teams={teams.filter(t => t.categoryId === cat.id)} />
                  {idx < catMatches.length - 1 && <div className="mx-4 border-b border-gray-100" />}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {matches.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <p>Noch keine Spiele erfasst. Erstelle das erste Spiel oben.</p>
        </div>
      )}
    </div>
  );
}
