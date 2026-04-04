import { auth } from "@/lib/gruempi/auth";
import { redirect } from "next/navigation";
import { getActiveTournament } from "@/lib/gruempi/queries/tournament";
import { getTodayMatches, getActiveMatches } from "@/lib/gruempi/queries/matches";
import { FeldClient } from "./FeldClient";
import { Smartphone } from "lucide-react";

export default async function FeldPage() {
  const session = await auth();
  if (!session?.user) redirect("/gruempi/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "SCORER") {
    redirect("/gruempi");
  }

  const tournament = await getActiveTournament();
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Kein aktives Turnier.</p>
      </div>
    );
  }

  // Try today's matches first, fall back to all active matches
  let matches = await getTodayMatches(tournament.id);
  if (matches.length === 0) {
    matches = await getActiveMatches(tournament.id);
  }

  return (
    <FeldClient
      matches={matches}
      userName={session.user.name ?? session.user.email}
      tournamentName={tournament.name}
    />
  );
}
