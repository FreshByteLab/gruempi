import { prisma } from "../db";
import type { MatchWithTeams } from "../types";

export async function getMatchesByTournament(tournamentId: string): Promise<MatchWithTeams[]> {
  const matches = await prisma.match.findMany({
    where: { tournamentId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
    },
    orderBy: [{ scheduledAt: "asc" }, { matchNumber: "asc" }],
  });
  return matches as MatchWithTeams[];
}

export async function getMatchById(id: string): Promise<MatchWithTeams | null> {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
    },
  });
  return match as MatchWithTeams | null;
}

export async function getTodayMatches(tournamentId: string): Promise<MatchWithTeams[]> {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const matches = await prisma.match.findMany({
    where: {
      tournamentId,
      scheduledAt: { gte: start, lt: end },
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });
  return matches as MatchWithTeams[];
}

export async function getActiveMatches(tournamentId: string): Promise<MatchWithTeams[]> {
  const matches = await prisma.match.findMany({
    where: {
      tournamentId,
      status: { in: ["SCHEDULED", "IN_PROGRESS"] },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
    },
    orderBy: [{ scheduledAt: "asc" }, { matchNumber: "asc" }],
  });
  return matches as MatchWithTeams[];
}
