"use client";

import { useState } from "react";
import { updateCategory } from "@/lib/gruempi/actions/teams";
import { Button } from "@/components/gruempi/ui/Button";
import { Input } from "@/components/gruempi/ui/Input";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

interface Props {
  tournamentId: string;
  categories: Category[];
}

export function CategoryManager({ tournamentId, categories }: Props) {
  const [cats, setCats] = useState(categories);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleToggleActive(id: string, isActive: boolean) {
    await updateCategory(id, { isActive: !isActive });
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)));
  }

  async function handleMoveUp(idx: number) {
    if (idx === 0) return;
    const updated = [...cats];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    updated.forEach((c, i) => (c.order = i));
    setCats(updated);
    await Promise.all(updated.map((c, i) => updateCategory(c.id, { order: i })));
  }

  async function handleMoveDown(idx: number) {
    if (idx === cats.length - 1) return;
    const updated = [...cats];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    updated.forEach((c, i) => (c.order = i));
    setCats(updated);
    await Promise.all(updated.map((c, i) => updateCategory(c.id, { order: i })));
  }

  async function handleSaveEdit(id: string) {
    setLoading(true);
    await updateCategory(id, { name: editName, description: editDesc });
    setCats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: editName, description: editDesc } : c))
    );
    setEditing(null);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      {cats
        .sort((a, b) => a.order - b.order)
        .map((cat, idx) => (
          <div
            key={cat.id}
            className={`bg-white rounded-xl border shadow-sm p-4 ${
              cat.isActive ? "border-gray-200" : "border-gray-100 opacity-60"
            }`}
          >
            {editing === cat.id ? (
              <div className="space-y-3">
                <Input
                  label="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  label="Beschreibung"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" loading={loading} onClick={() => handleSaveEdit(cat.id)}>
                    Speichern
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Order buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                    disabled={idx === 0}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                    disabled={idx === cats.length - 1}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => handleToggleActive(cat.id, cat.isActive)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        cat.isActive ? "bg-primary-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          cat.isActive ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {cat.isActive ? "Aktiv" : "Inaktiv"}
                    </span>
                  </label>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(cat.id);
                      setEditName(cat.name);
                      setEditDesc(cat.description ?? "");
                    }}
                  >
                    Bearbeiten
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
