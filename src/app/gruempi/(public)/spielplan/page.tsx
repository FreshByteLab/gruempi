import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getMatchesByTournament } from "@/lib/gruempi/queries/matches";
import { PHASE_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/gruempi/constants";
import type { MatchWithTeams, MatchStatus } from "@/lib/gruempi/types";
import { Badge } from "@/components/gruempi/ui/Badge";
import { Clock, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Spielplan" };
export const revalidate = 60;

function formatTime(date: Date | null) {
  if (!date) return "–";
  return new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(date)
  );
}

const statusBadgeVariant: Record<MatchStatus, "gray" | "yellow" | "green" | "red"> = {
  SCHEDULED: "gray",
  IN_PROGRESS: "yellow",
  COMPLETED: "green",
  CANCELLED: "red",
};

function MatchRow({ match }: { match: MatchWithTeams }) {
  const status = match.status as MatchStatus;
  const isCompleted = status === "COMPLETED";
  const isLive = status === "IN_PROGRESS";

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors rounded-lg">
      {/* Time + field */}
      <div className="w-20 shrink-0 text-center">
        <p className="text-sm font-semibold text-gray-700">{formatTime(match.scheduledAt)}</p>
        {match.field && (
          <p className="text-xs text-gray-400 flex items-center justify-center gap-0.5 mt-0.5">
            <MapPin size={10} />
            {match.field}
          </p>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span
          className={`flex-1 text-sm font-medium truncate text-right ${
            isCompleted && match.homeScore! > match.awayScore! ? "text-primary-700 font-bold" : "text-gray-800"
          }`}
        >
          {match.homeTeam?.name ?? "–"}
        </span>

        {isCompleted && match.homeScore !== null && match.awayScore !== null ? (
          <div className="shrink-0 flex items-center gap-1">
            <span className="w-8 h-8 flex items-center justify-center bg-primary-700 text-white rounded-lg font-bold text-sm">
              {match.homeScore}
            </span>
            <span className="text-xs text-gray-400">:</span>
            <span className="w-8 h-8 flex items-center justify-center bg-primary-700 text-white rounded-lg font-bold text-sm">
              {match.awayScore}
            </span>
          </div>
        ) : isLive ? (
          <div className="shrink-0 flex items-center gap-1.5">
            <span className="w-8 h-8 flex items-center justify-center bg-accent-500 text-white rounded-lg font-bold text-sm">
              {match.homeScore ?? "–"}
            </span>
            <span className="text-xs text-gray-400 animate-pulse">●</span>
            <span className="w-8 h-8 flex items-center justify-center bg-accent-500 text-white rounded-lg font-bold text-sm">
              {match.awayScore ?? "–"}
            </span>
          </div>
        ) : (
          <div className="shrink-0 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Clock size={16} className="text-gray-400" />
          </div>
        )}

        <span
          className={`flex-1 text-sm font-medium truncate text-left ${
            isCompleted && match.awayScore! > match.homeScore! ? "text-primary-700 font-bold" : "text-gray-800"
          }`}
        >
          {match.awayTeam?.name ?? "–"}
        </span>
      </div>

      {/* Status badge */}
      <div className="w-20 shrink-0 text-right">
        <Badge variant={statusBadgeVariant[status]} dot={isLive}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>
    </div>
  );
}

export default async function SpielplanPage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="p-8 text-gray-500">Kein aktives Turnier.</p>;

  const matches = await getMatchesByTournament(tournament.id);

  // Group by category, then phase
  const byCategory = tournament.categories.map((cat) => {
    const catMatches = matches.filter((m) => m.categoryId === cat.id);
    const byPhase = new Map<string, MatchWithTeams[]>();
    for (const m of catMatches) {
      const list = byPhase.get(m.phase) ?? [];
      list.push(m);
      byPhase.set(m.phase, list);
    }
    return { category: cat, byPhase };
  });

  const hasAnyMatch = matches.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Spielplan</h1>
        <p className="text-gray-500">
          Alle Spiele des Grümpelturniers {tournament.year} – live aktualisiert
        </p>
      </div>

      {!hasAnyMatch && (
        <div className="text-center py-20 text-gray-400">
          <Clock size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Spielplan wird bald veröffentlicht.</p>
          <p className="text-sm mt-1">Schau am Turniertag wieder vorbei!</p>
        </div>
      )}

      <div className="space-y-10">
        {byCategory.map(({ category, byPhase }) => {
          if (byPhase.size === 0) return null;
          return (
            <div key={category.id}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-primary-600 inline-block" />
                {category.name}
              </h2>

              {Array.from(byPhase.entries()).map(([phase, phaseMatches]) => (
                <div key={phase} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 px-4">
                    {PHASE_LABELS[phase as keyof typeof PHASE_LABELS] ?? phase}
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {phaseMatches.map((match, idx) => (
                      <div key={match.id}>
                        <MatchRow match={match} />
                        {idx < phaseMatches.length - 1 && (
                          <div className="mx-4 border-b border-gray-100" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
