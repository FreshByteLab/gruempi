import type { Metadata } from "next";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { RegistrationForm } from "./RegistrationForm";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Anmeldung" };
export const revalidate = 300;

export default async function AnmeldungPage() {
  const tournament = await getActiveTournament();

  if (!tournament) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Kein aktives Turnier gefunden.</p>
      </div>
    );
  }

  const isOpen =
    !tournament.registrationDeadline || new Date() <= tournament.registrationDeadline;

  const formatDeadline = tournament.registrationDeadline
    ? new Intl.DateTimeFormat("de-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(tournament.registrationDeadline))
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Anmeldung</h1>
        <p className="text-gray-500 text-lg">
          Melde dein Team für das Grümpelturnier {tournament.year} an.
        </p>
        {formatDeadline && (
          <p className="text-sm text-gray-400 mt-1">Anmeldeschluss: {formatDeadline}</p>
        )}
      </div>

      {!isOpen ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-800 mb-1">Anmeldung geschlossen</h2>
          <p className="text-red-600 text-sm">
            Die Anmeldefrist ist leider abgelaufen. Bei Fragen: sandro@gruempi.ch
          </p>
        </div>
      ) : (
        <RegistrationForm
          categories={tournament.categories.filter((c) => c.isActive).map((c) => ({
            id: c.id,
            name: c.name,
          }))}
          tournamentTeamSize={tournament.teamSize}
        />
      )}
    </div>
  );
}
