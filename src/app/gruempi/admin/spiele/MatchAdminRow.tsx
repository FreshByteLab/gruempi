"use client";

import { useState } from "react";
import { Trash2, Edit, Clock, MapPin } from "lucide-react";
import { deleteMatch, updateMatch } from "@/lib/gruempi/actions/matches";
import { PHASE_LABELS, STATUS_LABELS } from "@/lib/gruempi/constants";
import type { MatchWithTeams, TeamWithDetails, Phase, MatchStatus } from "@/lib/gruempi/types";
import { Modal } from "@/components/gruempi/ui/Modal";
import { Button } from "@/components/gruempi/ui/Button";
import { Input } from "@/components/gruempi/ui/Input";
import { Select } from "@/components/gruempi/ui/Select";
import { Badge } from "@/components/gruempi/ui/Badge";

const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Geplant" },
  { value: "IN_PROGRESS", label: "Läuft" },
  { value: "COMPLETED", label: "Beendet" },
  { value: "CANCELLED", label: "Abgesagt" },
];

const PHASE_OPTIONS = [
  { value: "GROUP", label: "Gruppenphase" },
  { value: "QUARTERFINAL", label: "Viertelfinal" },
  { value: "SEMIFINAL", label: "Halbfinal" },
  { value: "FINAL", label: "Final" },
  { value: "THIRD_PLACE", label: "Platz 3" },
];

const statusBadgeVariant: Record<MatchStatus, "gray" | "yellow" | "green" | "red"> = {
  SCHEDULED: "gray",
  IN_PROGRESS: "yellow",
  COMPLETED: "green",
  CANCELLED: "red",
};

function formatDateTime(d: Date | null) {
  if (!d) return "–";
  return new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(d));
}

interface Props {
  match: MatchWithTeams;
  teams: TeamWithDetails[];
}

export function MatchAdminRow({ match, teams }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  const [editData, setEditData] = useState({
    homeTeamId: match.homeTeamId ?? "",
    awayTeamId: match.awayTeamId ?? "",
    field: match.field ?? "",
    scheduledAt: match.scheduledAt
      ? new Date(match.scheduledAt).toISOString().slice(0, 16)
      : "",
    phase: match.phase,
    groupName: match.groupName ?? "",
    status: match.status,
    homeScore: match.homeScore?.toString() ?? "",
    awayScore: match.awayScore?.toString() ?? "",
    notes: match.notes ?? "",
  });

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateMatch(match.id, {
      homeTeamId: editData.homeTeamId || null,
      awayTeamId: editData.awayTeamId || null,
      field: editData.field || null,
      scheduledAt: editData.scheduledAt || null,
      phase: editData.phase,
      groupName: editData.groupName || null,
      status: editData.status,
      homeScore: editData.homeScore !== "" ? parseInt(editData.homeScore) : null,
      awayScore: editData.awayScore !== "" ? parseInt(editData.awayScore) : null,
      notes: editData.notes || null,
    });
    setLoading(false);
    setEditOpen(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteMatch(match.id);
    setDeleteOpen(false);
  }

  const status = match.status as MatchStatus;

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
        <div className="w-24 shrink-0 text-center">
          <p className="text-xs font-medium text-gray-700">{formatDateTime(match.scheduledAt)}</p>
          {match.field && (
            <p className="text-xs text-gray-400 flex items-center justify-center gap-0.5 mt-0.5">
              <MapPin size={10} />
              {match.field}
            </p>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="flex-1 text-sm text-gray-800 text-right truncate">
            {match.homeTeam?.name ?? "–"}
          </span>
          <div className="shrink-0 flex items-center gap-1 px-2">
            {match.status === "COMPLETED" ? (
              <span className="font-bold text-sm text-gray-900">
                {match.homeScore} : {match.awayScore}
              </span>
            ) : (
              <Clock size={16} className="text-gray-300" />
            )}
          </div>
          <span className="flex-1 text-sm text-gray-800 text-left truncate">
            {match.awayTeam?.name ?? "–"}
          </span>
        </div>

        <div className="shrink-0">
          <Badge variant={statusBadgeVariant[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        </div>

        <div className="shrink-0 flex gap-1">
          <button
            onClick={() => setEditOpen(true)}
            className="p-1.5 rounded text-gray-400 hover:text-navy-700 hover:bg-blue-50 transition-colors"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Spiel bearbeiten" size="lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Heimteam"
              placeholder="–"
              options={teamOptions}
              value={editData.homeTeamId}
              onChange={(e) => setEditData((d) => ({ ...d, homeTeamId: e.target.value }))}
            />
            <Select
              label="Auswärtsteam"
              placeholder="–"
              options={teamOptions}
              value={editData.awayTeamId}
              onChange={(e) => setEditData((d) => ({ ...d, awayTeamId: e.target.value }))}
            />
            <Input
              label="Datum & Zeit"
              type="datetime-local"
              value={editData.scheduledAt}
              onChange={(e) => setEditData((d) => ({ ...d, scheduledAt: e.target.value }))}
            />
            <Input
              label="Feld"
              value={editData.field}
              onChange={(e) => setEditData((d) => ({ ...d, field: e.target.value }))}
            />
            <Select
              label="Phase"
              options={PHASE_OPTIONS}
              value={editData.phase}
              onChange={(e) => setEditData((d) => ({ ...d, phase: e.target.value as Phase }))}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={editData.status}
              onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value as MatchStatus }))}
            />
            <Input
              label="Tore Heim"
              type="number"
              min={0}
              value={editData.homeScore}
              onChange={(e) => setEditData((d) => ({ ...d, homeScore: e.target.value }))}
            />
            <Input
              label="Tore Auswärts"
              type="number"
              min={0}
              value={editData.awayScore}
              onChange={(e) => setEditData((d) => ({ ...d, awayScore: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Abbrechen</Button>
            <Button type="submit" loading={loading}>Speichern</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Spiel löschen" size="sm">
        <p className="text-gray-600 mb-6">Willst du dieses Spiel wirklich löschen?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Abbrechen</Button>
          <Button variant="danger" loading={loading} onClick={handleDelete}>Löschen</Button>
        </div>
      </Modal>
    </>
  );
}
