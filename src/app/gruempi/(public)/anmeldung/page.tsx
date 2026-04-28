import type { Metadata } from "next";
import { getActiveTournamentStatic } from "@/lib/gruempi/static-data";
import { AlertCircle, Mail, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Anmeldung" };

export default function AnmeldungPage() {
  const tournament = getActiveTournamentStatic();

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
            Die Anmeldefrist ist leider abgelaufen. Bei Fragen: sandrozwyssig@gmail.com
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
              <Mail size={28} className="text-primary-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Anmeldung per E-Mail</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Sende uns eine E-Mail mit Teamname, Kategorie, Name und Telefon der
              Kontaktperson sowie die Namen aller Spielerinnen und Spieler.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`mailto:sandrozwyssig@gmail.com?subject=${encodeURIComponent("Anmeldung Grümpelturnier 2026")}&body=${encodeURIComponent(
`Hallo

Ich möchte unser Team für das Grümpelturnier 2026 anmelden.

--- TEAMINFOS ---
Teamname:
Kategorie: (Kindergarten / 1.–3. Klasse / 4.–6. Klasse / Oberstufe)

--- KONTAKTPERSON ---
Name:
Telefon:
E-Mail:

--- KINDER (Name, Jahrgang) ---
1.
2.
3.
4.
5.
6. (Auswechselspieler, optional)

--- BEMERKUNGEN ---
(optional)

Freundliche Grüsse`
)}`}
              className="flex items-center justify-center gap-2 w-full bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-colors"
            >
              <Mail size={18} />
              sandrozwyssig@gmail.com
            </a>

            {formatDeadline && (
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <Clock size={14} />
                <span>Anmeldeschluss: {formatDeadline}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Startgeld: CHF {tournament.entryFee}.– pro Team · {tournament.teamSize} Kinder pro Team
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
