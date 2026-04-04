import Link from "next/link";
import { CalendarDays, MapPin, Clock, Users, Trophy, ChevronRight, Star, Mail } from "lucide-react";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { Button } from "@/components/gruempi/ui/Button";

export const revalidate = 300; // 5 minutes

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatDeadline(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const categoryIcons: Record<string, string> = {
  kindergarten: "🌟",
  "1-3-klasse": "⚽",
  "4-6-klasse": "🏆",
  oberstufe: "🔥",
};

export default async function HomePage() {
  const tournament = await getActiveTournament();

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500 text-lg">Kein aktives Turnier gefunden.</p>
      </div>
    );
  }

  const isRegistrationOpen =
    !tournament.registrationDeadline || new Date() <= tournament.registrationDeadline;

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-primary-800 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 hero-stripes" />
        <div className="absolute inset-0 field-pattern opacity-30" />
        {/* Diagonal accent band */}
        <div className="absolute -right-20 top-0 w-96 h-full bg-accent-600/20 skew-x-6" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Trophy size={15} className="text-accent-400" />
              <span>EVHS präsentiert</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              Grümpelturnier{" "}
              <span className="text-accent-400">Hermetschwil-</span>
              <span className="text-accent-400">Staffeln</span>
              <br />
              <span className="text-white/90 text-3xl sm:text-4xl">2026</span>
            </h1>

            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              {tournament.heroText ||
                "Das grösste Kinderfussballturnier im Dorf – sei dabei!"}
            </p>

            {/* Key facts */}
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium">
                <CalendarDays size={16} className="text-accent-400" />
                <span>{formatDate(tournament.date)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium">
                <Clock size={16} className="text-accent-400" />
                <span>{tournament.startTime} – {tournament.endTime} Uhr</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium">
                <MapPin size={16} className="text-accent-400" />
                <span>{tournament.location}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              {isRegistrationOpen ? (
                <Link href="/gruempi/anmeldung">
                  <Button variant="accent" size="xl">
                    Jetzt anmelden
                    <ChevronRight size={20} />
                  </Button>
                </Link>
              ) : (
                <span className="inline-flex items-center px-6 py-3 bg-white/20 rounded-xl text-white/70 font-semibold text-lg">
                  Anmeldung geschlossen
                </span>
              )}
              <Link href="/gruempi/info">
                <Button variant="ghost" size="xl" className="border-white/40 text-white hover:bg-white/10">
                  Mehr Infos
                </Button>
              </Link>
            </div>

            {/* Deadline notice */}
            {isRegistrationOpen && tournament.registrationDeadline && (
              <p className="mt-4 text-white/60 text-sm">
                Anmeldeschluss: {formatDeadline(tournament.registrationDeadline)}
              </p>
            )}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* ===== NOTICE ===== */}
      <section className="max-w-6xl mx-auto px-4 -mt-2 mb-8">
        <div className="bg-accent-50 border border-accent-200 rounded-xl px-5 py-3 flex items-start gap-3">
          <Star size={18} className="text-accent-600 shrink-0 mt-0.5" />
          <p className="text-accent-800 text-sm">
            <strong>Nur für Kinder aus Hermetschwil-Staffeln.</strong> Gemischte Teams
            aus Mädchen und Knaben sind herzlich willkommen.
          </p>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Kategorien</h2>
          <p className="text-gray-500">Für jede Altersgruppe das passende Turnier</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tournament.categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-4xl mb-3">
                {categoryIcons[cat.slug] ?? "🏅"}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {cat.description ?? ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TOURNAMENT INFO SUMMARY ===== */}
      <section className="bg-primary-800 text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">Das Wichtigste im Überblick</h2>
            <p className="text-white/70">Alles, was du für die Anmeldung wissen musst</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "💰", title: "Startgeld", value: `CHF ${tournament.entryFee}.–` },
              { icon: "👥", title: "Teamgrösse", value: `${tournament.teamSize} Kinder` },
              { icon: "⚽", title: "Auf dem Feld", value: `${tournament.fieldPlayers} Feldspieler + 1 Torhüter` },
              { icon: "⏱️", title: "Spielzeit", value: `${tournament.matchDuration} Minuten` },
              { icon: "🍽️", title: "Mittagspause", value: `${tournament.lunchStart ?? "12:00"} – ${tournament.lunchEnd ?? "13:00"} Uhr` },
              {
                icon: "📋",
                title: "Anmeldeschluss",
                value: tournament.registrationDeadline
                  ? formatDeadline(tournament.registrationDeadline)
                  : "Offen",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 flex items-center gap-4"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide font-medium">
                    {item.title}
                  </p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gruempi/info">
              <Button variant="ghost" className="border-white/40 text-white hover:bg-white/10">
                Alle Turnierinfos →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAIRPLAY ===== */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Fairplay steht im Vordergrund
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unser Grümpelturnier ist kein gewöhnlicher Wettkampf – es ist ein Fest
              für die ganze Dorfgemeinschaft. Respekt, Teamgeist und Spass zählen
              mehr als das Resultat.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Alle Kinder aus Hermetschwil-Staffeln sind willkommen – egal ob Anfänger
              oder erfahrene Fussballer. Gemischte Teams aus Mädchen und Knaben
              sind ausdrücklich erwünscht.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "🤝", text: "Respekt und Fairplay" },
              { emoji: "🎉", text: "Spass und Gemeinschaft" },
              { emoji: "🌈", text: "Alle sind willkommen" },
              { emoji: "🏅", text: "Jedes Team gewinnt" },
            ].map((item) => (
              <div
                key={item.text}
                className="bg-primary-50 rounded-xl p-4 text-center border border-primary-100"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-sm font-medium text-primary-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FESTWIRTSCHAFT ===== */}
      <section className="bg-accent-50 border-y border-accent-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🍔</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Festwirtschaft</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Den ganzen Tag frische Grillspezialitäten, Getränke und Snacks. Die
            Festwirtschaft ist für alle Zuschauer und Familien geöffnet.
          </p>
          <p className="text-sm text-gray-400 mt-2">Details folgen in Kürze.</p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Fragen?</h2>
        <p className="text-gray-500 mb-6">
          Wir helfen dir gerne weiter.
        </p>
        <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="mailto:sandro@gruempi.ch"
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-800 transition-colors"
          >
            <Mail size={18} />
            sandro@gruempi.ch
          </a>
          <span className="text-gray-400 text-sm">Veranstalter: EVHS</span>
        </div>
      </section>
    </div>
  );
}
