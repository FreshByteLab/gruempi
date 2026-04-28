import type { Metadata } from "next";
import { getActiveTournamentStatic } from "@/lib/gruempi/static-data";
import { CalendarDays, MapPin, Clock, Users, Trophy, Target, Coffee, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/gruempi/ui/Button";

export const metadata: Metadata = { title: "Turnierinfos" };
export const revalidate = 300;

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-gray-900 font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function InfoPage() {
  const t = getActiveTournamentStatic();
  if (!t) return <p className="p-8 text-gray-500">Kein aktives Turnier gefunden.</p>;

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("de-CH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d));

  const formatDeadline = (d: Date) =>
    new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mb-2">
          <Trophy size={16} />
          <span>Turnierinfos</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Alles zum Turnier
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          {t.description ?? "Alle wichtigen Informationen zum Grümpelturnier Hermetschwil-Staffeln 2026."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Datum & Ort */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <CalendarDays size={20} className="text-primary-600" />
            Datum & Ort
          </h2>
          <p className="text-sm text-gray-500 mb-4">Wann und wo findet das Turnier statt?</p>
          <InfoRow icon={<CalendarDays size={18} />} label="Datum" value={formatDate(t.date)} />
          <InfoRow icon={<Clock size={18} />} label="Uhrzeit" value={`${t.startTime} – ${t.endTime} Uhr`} />
          {t.lunchStart && t.lunchEnd && (
            <InfoRow icon={<Coffee size={18} />} label="Mittagspause" value={`${t.lunchStart} – ${t.lunchEnd} Uhr`} />
          )}
          <InfoRow icon={<MapPin size={18} />} label="Ort" value={t.location} />
          <InfoRow icon={<Users size={18} />} label="Veranstalter" value={t.organizer} />
        </div>

        {/* Anmeldung */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Target size={20} className="text-primary-600" />
            Anmeldung
          </h2>
          <p className="text-sm text-gray-500 mb-4">Wer kann mitmachen?</p>
          <InfoRow
            icon={<Users size={18} />}
            label="Teilnahme"
            value="Nur Kinder aus Hermetschwil-Staffeln"
          />
          <InfoRow
            icon={<Trophy size={18} />}
            label="Teamgrösse"
            value={`${t.teamSize} Kinder (${t.fieldPlayers} Feldspieler + 1 Torhüter + ${t.maxSubstitutes} Ersatz)`}
          />
          <InfoRow
            icon={<Users size={18} />}
            label="Gemischte Teams"
            value="Mädchen und Knaben gemischt erlaubt"
          />
          <InfoRow
            icon={<AlertCircle size={18} />}
            label="Startgeld"
            value={`CHF ${t.entryFee}.– pro Team`}
          />
          {t.registrationDeadline && (
            <InfoRow
              icon={<CalendarDays size={18} />}
              label="Anmeldeschluss"
              value={formatDeadline(t.registrationDeadline)}
            />
          )}
        </div>

        {/* Spielmodus */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Target size={20} className="text-primary-600" />
            Spielmodus
          </h2>
          <p className="text-sm text-gray-500 mb-4">Wie wird gespielt?</p>
          <InfoRow icon={<Clock size={18} />} label="Spielzeit" value={`${t.matchDuration} Minuten pro Spiel`} />
          <InfoRow icon={<Users size={18} />} label="Auf dem Feld" value={`${t.fieldPlayers} Feldspieler + 1 Torhüter`} />
          <InfoRow icon={<Users size={18} />} label="Auswechslung" value={`${t.maxSubstitutes} Auswechselspieler`} />
          <InfoRow icon={<Trophy size={18} />} label="Modus" value="Gruppenphase + Finalrunde" />
          <InfoRow icon={<Trophy size={18} />} label="Punkte" value="Sieg = 3 Punkte, Remis = 1 Punkt" />
        </div>

        {/* Kategorien */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Trophy size={20} className="text-primary-600" />
            Kategorien
          </h2>
          <p className="text-sm text-gray-500 mb-4">Für jede Altersgruppe die passende Kategorie</p>
          <div className="space-y-3">
            {t.categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                <span className="text-2xl">{["🌟","⚽","🏆","🔥"][idx] ?? "🏅"}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fairplay */}
      <div className="mt-8 bg-primary-700 text-white rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-3">🤝 Fairplay ist oberstes Gebot</h2>
        <p className="text-white/85 leading-relaxed">
          Das Grümpelturnier steht für Respekt, Spass und Dorfgemeinschaft.
          Unsportliches Verhalten gegenüber Mitspielenden, Schiedsrichtern oder
          Zuschauenden wird nicht toleriert und kann zum Ausschluss führen.
          Entscheidungen des Schiedsrichters sind endgültig.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-4">Bereit? Dann meld dein Team jetzt an!</p>
        <Link href="/gruempi/anmeldung">
          <Button variant="primary" size="lg">Jetzt anmelden →</Button>
        </Link>
      </div>
    </div>
  );
}
