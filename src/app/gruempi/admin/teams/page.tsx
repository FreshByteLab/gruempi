import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getTeamsByTournament } from "@/lib/gruempi/queries/teams";
import { PAYMENT_LABELS, PAYMENT_COLORS } from "@/lib/gruempi/constants";
import type { PaymentStatus } from "@/lib/gruempi/types";
import { Badge } from "@/components/gruempi/ui/Badge";
import { TeamActions } from "./TeamActions";
import { Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const tournament = await getActiveTournament();
  if (!tournament) return <p className="text-gray-500">Kein aktives Turnier.</p>;

  const teams = await getTeamsByTournament(tournament.id);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Teams</h1>
          <p className="text-gray-500 text-sm mt-1">{teams.length} angemeldete Teams</p>
        </div>
      </div>

      {teams.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Noch keine Teams angemeldet.</p>
        </div>
      )}

      {/* Group by category */}
      {tournament.categories.map((cat) => {
        const catTeams = teams.filter((t) => t.categoryId === cat.id);
        if (catTeams.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-primary-600" />
              {cat.name}
              <span className="ml-1 text-sm font-normal text-gray-400">
                ({catTeams.length} Teams)
              </span>
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-left">Captain</th>
                    <th className="px-4 py-3 text-left">Kinder</th>
                    <th className="px-4 py-3 text-center">Zahlung</th>
                    <th className="px-4 py-3 text-center">Bestätigt</th>
                    <th className="px-4 py-3 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {catTeams.map((team) => (
                    <tr key={team.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 text-sm">{team.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Intl.DateTimeFormat("de-CH").format(new Date(team.registeredAt))}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{team.captainName}</p>
                        <p className="text-xs text-gray-400">{team.captainEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{team.players.length} Kinder</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            PAYMENT_COLORS[team.paymentStatus as PaymentStatus]
                          }`}
                        >
                          {PAYMENT_LABELS[team.paymentStatus as PaymentStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {team.isConfirmed ? (
                          <CheckCircle size={18} className="text-primary-600 mx-auto" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-gray-300 inline-block" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <TeamActions team={team} categories={tournament.categories} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
