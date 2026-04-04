"use client";

import { useState } from "react";
import { createMatch } from "@/lib/gruempi/actions/matches";
import { Button } from "@/components/gruempi/ui/Button";
import { Select } from "@/components/gruempi/ui/Select";
import { Input } from "@/components/gruempi/ui/Input";
import type { TeamWithDetails } from "@/lib/gruempi/types";

interface Props {
  tournamentId: string;
  categories: { id: string; name: string }[];
  teams: TeamWithDetails[];
}

const PHASE_OPTIONS = [
  { value: "GROUP", label: "Gruppenphase" },
  { value: "QUARTERFINAL", label: "Viertelfinal" },
  { value: "SEMIFINAL", label: "Halbfinal" },
  { value: "FINAL", label: "Final" },
  { value: "THIRD_PLACE", label: "Spiel um Platz 3" },
];

export function CreateMatchForm({ tournamentId, categories, teams }: Props) {
  const [categoryId, setCategoryId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [field, setField] = useState("Feld 1");
  const [scheduledAt, setScheduledAt] = useState("");
  const [phase, setPhase] = useState("GROUP");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredTeams = teams.filter((t) => t.categoryId === categoryId);
  const teamOptions = filteredTeams.map((t) => ({ value: t.id, label: t.name }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) return;
    setLoading(true);

    await createMatch({
      tournamentId,
      categoryId,
      homeTeamId: homeTeamId || null,
      awayTeamId: awayTeamId || null,
      field: field || null,
      scheduledAt: scheduledAt || null,
      phase,
      groupName: groupName || null,
    });

    setLoading(false);
    setSuccess(true);
    setHomeTeamId("");
    setAwayTeamId("");
    setScheduledAt("");
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select
          label="Kategorie"
          required
          placeholder="Wählen..."
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setHomeTeamId(""); setAwayTeamId(""); }}
        />
        <Select
          label="Heimteam"
          placeholder="Wählen..."
          options={teamOptions}
          value={homeTeamId}
          onChange={(e) => setHomeTeamId(e.target.value)}
        />
        <Select
          label="Auswärtsteam"
          placeholder="Wählen..."
          options={teamOptions}
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(e.target.value)}
        />
        <Input
          label="Datum & Zeit"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
        <Input
          label="Feld"
          placeholder="Feld 1"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <Select
          label="Phase"
          options={PHASE_OPTIONS}
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
        />
        <Input
          label="Gruppenname (optional)"
          placeholder="Gruppe A"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={loading} disabled={!categoryId}>
          Spiel erstellen
        </Button>
        {success && <span className="text-sm text-primary-600 font-medium">✓ Gespeichert</span>}
      </div>
    </form>
  );
}
