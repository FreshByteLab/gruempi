"use client";

import { useState } from "react";
import { updateMatch } from "@/lib/gruempi/actions/matches";
import { Button } from "@/components/gruempi/ui/Button";
import { Badge } from "@/components/gruempi/ui/Badge";
import { STATUS_LABELS } from "@/lib/gruempi/constants";
import type { MatchWithTeams, MatchStatus } from "@/lib/gruempi/types";
import { Check } from "lucide-react";

const statusBadgeVariant: Record<MatchStatus, "gray" | "yellow" | "green" | "red"> = {
  SCHEDULED: "gray",
  IN_PROGRESS: "yellow",
  COMPLETED: "green",
  CANCELLED: "red",
};

export function ResultEditor({ match }: { match: MatchWithTeams }) {
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? "");
  const [status, setStatus] = useState(match.status);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    await updateMatch(match.id, {
      homeScore: homeScore !== "" ? parseInt(homeScore) : null,
      awayScore: awayScore !== "" ? parseInt(awayScore) : null,
      status: homeScore !== "" && awayScore !== "" ? "COMPLETED" : status,
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const ms = status as MatchStatus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Teams + score inputs */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="flex-1 text-sm font-semibold text-gray-800 text-right truncate">
            {match.homeTeam?.name ?? "–"}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="number"
              min={0}
              max={99}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-12 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
            <span className="text-gray-400 font-bold">:</span>
            <input
              type="number"
              min={0}
              max={99}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-12 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <span className="flex-1 text-sm font-semibold text-gray-800 text-left truncate">
            {match.awayTeam?.name ?? "–"}
          </span>
        </div>

        {/* Status + save */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={statusBadgeVariant[ms]}>
            {STATUS_LABELS[ms]}
          </Badge>
          <Button
            size="sm"
            onClick={handleSave}
            loading={loading}
            variant={saved ? "primary" : "primary"}
            className={saved ? "bg-primary-600" : ""}
          >
            {saved ? <Check size={16} /> : "Speichern"}
          </Button>
        </div>
      </div>

      {/* Phase + group info */}
      {(match.groupName || match.field) && (
        <p className="text-xs text-gray-400 mt-2">
          {match.groupName && <span>{match.groupName} · </span>}
          {match.field && <span>{match.field}</span>}
        </p>
      )}
    </div>
  );
}
