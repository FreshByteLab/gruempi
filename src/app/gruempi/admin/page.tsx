import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getTeamsByTournament } from "@/lib/gruempi/queries/teams";
import { getMatchesByTournament } from "@/lib/gruempi/queries/matches";
import { Users, Calendar, CheckCircle, Clock, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const tournament = await getActiveTournament();
  if (!tournament) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Trophy size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Kein aktives Turnier.</p>
        <p className="text-sm mt-1">Erstelle zuerst ein Turnier in der Datenbank.</p>
      </div>
    );
  }

  const [teams, matches] = await Promise.all([
    getTeamsByTournament(tournament.id),
    getMatchesByTournament(tournament.id),
  ]);

  const paidTeams = teams.filter((t) => t.paymentStatus === "PAID").length;
  const completedMatches = matches.filter((m) => m.status === "COMPLETED").length;
  const scheduledMatches = matches.filter((m) => m.status === "SCHEDULED").length;
  const liveMatches = matches.filter((m) => m.status === "IN_PROGRESS").length;

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">{tournament.name}</h1>
        <p className="text-gray-500 mt-1">
          {formatDate(tournament.date)} · {tournament.startTime}–{tournament.endTime} Uhr · {tournament.location}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users size={20} className="text-primary-700" />}
          label="Teams angemeldet"
          value={teams.length}
          sub={`${paidTeams} bezahlt`}
          color="bg-primary-100"
          href="/gruempi/admin/teams"
        />
        <StatCard
          icon={<Calendar size={20} className="text-navy-700" />}
          label="Spiele total"
          value={matches.length}
          sub={`${scheduledMatches} geplant`}
          color="bg-blue-100"
          href="/gruempi/admin/spiele"
        />
        <StatCard
          icon={<CheckCircle size={20} className="text-green-700" />}
          label="Spiele beendet"
          value={completedMatches}
          color="bg-green-100"
          href="/gruempi/admin/resultate"
        />
        <StatCard
          icon={<Clock size={20} className="text-accent-700" />}
          label="Live"
          value={liveMatches}
          sub="Spiele laufen gerade"
          color="bg-accent-100"
          href="/gruempi/feld"
        />
      </div>

      {/* Teams per category */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-600" />
          Teams pro Kategorie
        </h2>
        <div className="space-y-3">
          {tournament.categories.map((cat) => {
            const count = teams.filter((t) => t.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-32 shrink-0">{cat.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((count / Math.max(teams.length, 1)) * 100 + 5, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/gruempi/admin/teams"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow text-center"
        >
          <Users size={24} className="text-primary-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900 text-sm">Teams verwalten</p>
        </Link>
        <Link
          href="/gruempi/admin/spiele"
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow text-center"
        >
          <Calendar size={24} className="text-primary-600 mx-auto mb-2" />
          <p className="font-semibold text-gray-900 text-sm">Spielplan erstellen</p>
        </Link>
        <Link
          href="/gruempi/feld"
          className="bg-primary-700 rounded-xl p-4 hover:bg-primary-800 transition-colors text-center"
        >
          <CheckCircle size={24} className="text-white mx-auto mb-2" />
          <p className="font-semibold text-white text-sm">Resultate erfassen</p>
        </Link>
      </div>
    </div>
  );
}
