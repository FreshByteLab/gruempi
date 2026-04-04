"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Check, Trophy, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { updateMatchScore } from "@/lib/gruempi/actions/matches";
import type { MatchWithTeams } from "@/lib/gruempi/types";
import { PHASE_LABELS } from "@/lib/gruempi/constants";
import type { Phase } from "@/lib/gruempi/types";

interface Props {
  matches: MatchWithTeams[];
  userName: string;
  tournamentName: string;
}

function ScoreControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => onChange(Math.min(99, value + 1))}
        className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center transition-colors text-white"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
      <span className="text-5xl font-black text-white w-16 text-center tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center transition-colors text-white"
      >
        <Minus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MatchCard({
  match,
  onSaved,
}: {
  match: MatchWithTeams;
  onSaved: () => void;
}) {
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateMatchScore({ matchId: match.id, homeScore, awayScore });
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 3000);
    });
  }

  const isCompleted = match.status === "COMPLETED";
  const phase = PHASE_LABELS[match.phase as Phase] ?? match.phase;

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl ${isCompleted ? "opacity-70" : ""}`}>
      {/* Phase + field header */}
      <div className="bg-black/30 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-white/70 font-medium uppercase tracking-wide">
          {phase} {match.groupName ? `· ${match.groupName}` : ""}
        </span>
        {match.field && (
          <span className="text-xs text-white/60">{match.field}</span>
        )}
      </div>

      {/* Main score area */}
      <div className="bg-primary-700 px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base leading-tight mb-4 min-h-[2.5rem] flex items-center justify-center">
              {match.homeTeam?.name ?? "–"}
            </p>
            <ScoreControl value={homeScore} onChange={setHomeScore} />
          </div>

          {/* VS divider */}
          <div className="shrink-0 text-white/30 text-2xl font-black">:</div>

          {/* Away team */}
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base leading-tight mb-4 min-h-[2.5rem] flex items-center justify-center">
              {match.awayTeam?.name ?? "–"}
            </p>
            <ScoreControl value={awayScore} onChange={setAwayScore} />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isPending || saved}
          className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            saved
              ? "bg-accent-500 text-white"
              : "bg-white text-primary-800 hover:bg-gray-100 active:bg-gray-200"
          } disabled:opacity-70`}
        >
          {isPending ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : saved ? (
            <><Check size={22} /> Gespeichert!</>
          ) : (
            "Resultat speichern"
          )}
        </button>
      </div>

      {/* Scheduled time */}
      {match.scheduledAt && (
        <div className="bg-primary-800/50 px-4 py-2 text-center">
          <span className="text-xs text-white/50">
            {new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit" }).format(
              new Date(match.scheduledAt)
            )} Uhr
          </span>
        </div>
      )}
    </div>
  );
}

export function FeldClient({ matches, userName, tournamentName }: Props) {
  const router = useRouter();
  const [showCompleted, setShowCompleted] = useState(false);

  const activeMatches = matches.filter((m) => m.status !== "COMPLETED" && m.status !== "CANCELLED");
  const completedMatches = matches.filter((m) => m.status === "COMPLETED");

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-primary-900 px-4 pt-safe-top pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-accent-400" />
            <div>
              <p className="text-white font-bold text-sm">Feld-Eingabe</p>
              <p className="text-white/50 text-xs">{userName}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 text-xs"
          >
            Aktualisieren
          </button>
        </div>
      </div>

      <div className="px-4 py-4 pb-8 space-y-4 max-w-md mx-auto">
        {/* Active matches */}
        {activeMatches.length === 0 && completedMatches.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">Keine offenen Spiele</p>
            <p className="text-sm mt-1">Alle Spiele sind beendet oder noch nicht angelegt.</p>
          </div>
        )}

        {activeMatches.length === 0 && completedMatches.length > 0 && (
          <div className="bg-primary-900/50 rounded-xl p-4 text-center text-white/60 text-sm">
            Alle Spiele sind beendet. ✓
          </div>
        )}

        {activeMatches.map((match) => (
          <MatchCard key={match.id} match={match} onSaved={handleRefresh} />
        ))}

        {/* Completed matches (collapsible) */}
        {completedMatches.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-gray-400 text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <span>Beendete Spiele ({completedMatches.length})</span>
              {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showCompleted && (
              <div className="mt-2 space-y-3">
                {completedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} onSaved={handleRefresh} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
