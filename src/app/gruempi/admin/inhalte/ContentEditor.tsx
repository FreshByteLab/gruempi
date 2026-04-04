"use client";

import { useState } from "react";
import { updateTournamentContent, updateLegalPage } from "@/lib/gruempi/actions/teams";
import { Button } from "@/components/gruempi/ui/Button";
import { Check } from "lucide-react";

interface Props {
  tournament: { id: string; heroText: string; description: string };
  legalPages: { slug: string; title: string; content: string }[];
}

function SaveButton({ loading, saved }: { loading: boolean; saved: boolean }) {
  return (
    <Button size="sm" type="submit" loading={loading}>
      {saved ? (
        <><Check size={14} /> Gespeichert</>
      ) : "Speichern"}
    </Button>
  );
}

export function ContentEditor({ tournament, legalPages }: Props) {
  const [heroText, setHeroText] = useState(tournament.heroText);
  const [description, setDescription] = useState(tournament.description);
  const [tournamentSaving, setTournamentSaving] = useState(false);
  const [tournamentSaved, setTournamentSaved] = useState(false);

  const [legalData, setLegalData] = useState(
    Object.fromEntries(legalPages.map((p) => [p.slug, { title: p.title, content: p.content }]))
  );
  const [legalSaving, setLegalSaving] = useState<Record<string, boolean>>({});
  const [legalSaved, setLegalSaved] = useState<Record<string, boolean>>({});

  async function saveTournament(e: React.FormEvent) {
    e.preventDefault();
    setTournamentSaving(true);
    await updateTournamentContent(tournament.id, { heroText, description });
    setTournamentSaving(false);
    setTournamentSaved(true);
    setTimeout(() => setTournamentSaved(false), 2000);
  }

  async function saveLegal(e: React.FormEvent, slug: string) {
    e.preventDefault();
    setLegalSaving((s) => ({ ...s, [slug]: true }));
    const d = legalData[slug];
    if (d) await updateLegalPage(slug, d.title, d.content);
    setLegalSaving((s) => ({ ...s, [slug]: false }));
    setLegalSaved((s) => ({ ...s, [slug]: true }));
    setTimeout(() => setLegalSaved((s) => ({ ...s, [slug]: false })), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Tournament texts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Turniertexte</h2>
        <form onSubmit={saveTournament} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Hero-Text (Startseite)</label>
            <input
              type="text"
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Das grösste Kinderfussballturnier im Dorf..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Beschreibung (Info-Seite)</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
            />
          </div>
          <SaveButton loading={tournamentSaving} saved={tournamentSaved} />
        </form>
      </div>

      {/* Legal pages */}
      {legalPages.map((page) => (
        <div key={page.slug} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">{page.title}</h2>
          <form onSubmit={(e) => saveLegal(e, page.slug)} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Titel</label>
              <input
                type="text"
                value={legalData[page.slug]?.title ?? page.title}
                onChange={(e) =>
                  setLegalData((d) => ({
                    ...d,
                    [page.slug]: { ...d[page.slug]!, title: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Inhalt (Markdown)</label>
              <textarea
                rows={10}
                value={legalData[page.slug]?.content ?? page.content}
                onChange={(e) =>
                  setLegalData((d) => ({
                    ...d,
                    [page.slug]: { ...d[page.slug]!, content: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
              <p className="text-xs text-gray-400">
                ## Überschrift · ### Unterüberschrift · - Listeneintrag
              </p>
            </div>
            <SaveButton loading={legalSaving[page.slug] ?? false} saved={legalSaved[page.slug] ?? false} />
          </form>
        </div>
      ))}
    </div>
  );
}
