import type { Metadata } from "next";
import { getActiveTournamentStatic, calculateStandingsStatic } from "@/lib/gruempi/static-data";
import { Trophy } from "lucide-react";

export const metadata: Metadata = { title: "Rangliste" };
export default async function RanglistePage() {
  const tournament = getActiveTournamentStatic();
  if (!tournament) return <p className="p-8 text-gray-500">Kein aktives Turnier.</p>;

  const standings = calculateStandingsStatic();
  const hasData = standings.some((s) => s.standings.some((r) => r.played > 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Rangliste</h1>
        <p className="text-gray-500">
          Aktuelle Rangliste nach Gruppenphase – aktualisiert nach jedem Spiel
        </p>
      </div>

      {!hasData && (
        <div className="text-center py-20 text-gray-400">
          <Trophy size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Noch keine Resultate erfasst.</p>
          <p className="text-sm mt-1">Die Rangliste wird während des Turniers laufend aktualisiert.</p>
        </div>
      )}

      <div className="space-y-10">
        {standings.map(({ categoryId, categoryName, standings: rows }) => (
          <div key={categoryId}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primary-600 inline-block" />
              {categoryName}
            </h2>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left w-8">#</th>
                    <th className="px-4 py-3 text-left">Team</th>
                    <th className="px-4 py-3 text-center w-10">Sp</th>
                    <th className="px-4 py-3 text-center w-10">S</th>
                    <th className="px-4 py-3 text-center w-10">U</th>
                    <th className="px-4 py-3 text-center w-10">N</th>
                    <th className="px-4 py-3 text-center w-16">Tore</th>
                    <th className="px-4 py-3 text-center w-12">Diff</th>
                    <th className="px-4 py-3 text-center w-12 text-primary-700 font-bold">Pkt</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.teamId}
                      className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                        idx === 0 ? "bg-accent-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        {idx === 0 ? (
                          <Trophy size={16} className="text-accent-500 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-400">{idx + 1}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${idx === 0 ? "text-accent-700 font-bold" : "text-gray-800"}`}>
                          {row.teamName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{row.played}</td>
                      <td className="px-4 py-3 text-center text-sm text-primary-600 font-medium">{row.won}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{row.drawn}</td>
                      <td className="px-4 py-3 text-center text-sm text-red-500">{row.lost}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {row.goalsFor}:{row.goalsAgainst}
                      </td>
                      <td className={`px-4 py-3 text-center text-sm font-medium ${
                        row.goalDifference > 0 ? "text-primary-600" :
                        row.goalDifference < 0 ? "text-red-500" : "text-gray-500"
                      }`}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-bold">
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">
                        Noch keine Spiele in dieser Kategorie
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 px-1">
              Sp = Spiele · S = Siege · U = Unentschieden · N = Niederlagen · Pkt = Punkte
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
