"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, CreditCard, CheckCircle } from "lucide-react";
import { Modal } from "@/components/gruempi/ui/Modal";
import { Button } from "@/components/gruempi/ui/Button";
import { Input } from "@/components/gruempi/ui/Input";
import { Select } from "@/components/gruempi/ui/Select";
import {
  deleteTeam,
  setPaymentStatus,
  setConfirmed,
  updateTeam,
  updatePlayers,
} from "@/lib/gruempi/actions/teams";
import type { TeamWithDetails } from "@/lib/gruempi/types";

interface Props {
  team: TeamWithDetails;
  categories: { id: string; name: string }[];
}

export function TeamActions({ team, categories }: Props) {
  const [open, setOpen] = useState<"edit" | "delete" | "payment" | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: team.name,
    captainName: team.captainName,
    captainEmail: team.captainEmail,
    captainPhone: team.captainPhone,
    categoryId: team.categoryId,
    notes: team.notes ?? "",
  });

  async function handleDelete() {
    setLoading(true);
    await deleteTeam(team.id);
    setOpen(null);
  }

  async function handlePayment(status: string) {
    setLoading(true);
    await setPaymentStatus(team.id, status);
    setOpen(null);
    setLoading(false);
  }

  async function handleConfirm() {
    await setConfirmed(team.id, !team.isConfirmed);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateTeam(team.id, editData);
    setOpen(null);
    setLoading(false);
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setOpen("payment")}
          className="p-1.5 rounded text-gray-400 hover:text-accent-600 hover:bg-accent-50 transition-colors"
          title="Zahlung"
        >
          <CreditCard size={16} />
        </button>
        <button
          onClick={handleConfirm}
          className={`p-1.5 rounded transition-colors ${
            team.isConfirmed
              ? "text-primary-600 bg-primary-50"
              : "text-gray-400 hover:text-primary-600 hover:bg-primary-50"
          }`}
          title="Bestätigen"
        >
          <CheckCircle size={16} />
        </button>
        <button
          onClick={() => setOpen("edit")}
          className="p-1.5 rounded text-gray-400 hover:text-navy-700 hover:bg-blue-50 transition-colors"
          title="Bearbeiten"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => setOpen("delete")}
          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Löschen"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Edit Modal */}
      <Modal open={open === "edit"} onClose={() => setOpen(null)} title={`Team bearbeiten: ${team.name}`} size="lg">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Teamname"
            required
            value={editData.name}
            onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
          />
          <Select
            label="Kategorie"
            required
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={editData.categoryId}
            onChange={(e) => setEditData((d) => ({ ...d, categoryId: e.target.value }))}
          />
          <Input
            label="Captain Name"
            required
            value={editData.captainName}
            onChange={(e) => setEditData((d) => ({ ...d, captainName: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="E-Mail"
              type="email"
              required
              value={editData.captainEmail}
              onChange={(e) => setEditData((d) => ({ ...d, captainEmail: e.target.value }))}
            />
            <Input
              label="Telefon"
              value={editData.captainPhone}
              onChange={(e) => setEditData((d) => ({ ...d, captainPhone: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(null)}>Abbrechen</Button>
            <Button type="submit" loading={loading}>Speichern</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={open === "delete"} onClose={() => setOpen(null)} title="Team löschen" size="sm">
        <p className="text-gray-600 mb-6">
          Willst du das Team <strong>«{team.name}»</strong> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setOpen(null)}>Abbrechen</Button>
          <Button variant="danger" loading={loading} onClick={handleDelete}>Löschen</Button>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal open={open === "payment"} onClose={() => setOpen(null)} title="Zahlungsstatus" size="sm">
        <p className="text-gray-600 mb-4">Zahlungsstatus für <strong>«{team.name}»</strong>:</p>
        <div className="flex flex-col gap-2">
          {[
            { value: "PENDING", label: "Ausstehend", color: "bg-accent-100 text-accent-700" },
            { value: "PAID", label: "Bezahlt", color: "bg-primary-100 text-primary-700" },
            { value: "REFUNDED", label: "Rückerstattet", color: "bg-gray-100 text-gray-600" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => handlePayment(s.value)}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm transition-opacity hover:opacity-80 ${s.color} ${
                team.paymentStatus === s.value ? "ring-2 ring-offset-1 ring-primary-400" : ""
              }`}
            >
              {s.label}
              {team.paymentStatus === s.value && " ✓"}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>Schliessen</Button>
        </div>
      </Modal>
    </>
  );
}
