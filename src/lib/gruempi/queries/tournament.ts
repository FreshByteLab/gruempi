import { prisma } from "../db";
import type { TournamentWithCategories } from "../types";

export async function getActiveTournament(): Promise<TournamentWithCategories | null> {
  const t = await prisma.tournament.findFirst({
    where: { isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { teams: true } } },
      },
    },
  });
  return t as TournamentWithCategories | null;
}

export async function getAllTournaments() {
  return prisma.tournament.findMany({
    orderBy: { year: "desc" },
    include: {
      _count: { select: { teams: true, matches: true } },
    },
  });
}

export async function getTournamentById(id: string) {
  return prisma.tournament.findUnique({
    where: { id },
    include: {
      categories: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateTournament(
  id: string,
  data: Partial<{
    heroText: string;
    description: string;
    entryFee: number;
    teamSize: number;
    fieldPlayers: number;
    maxSubstitutes: number;
    matchDuration: number;
    registrationDeadline: Date | null;
    isActive: boolean;
  }>
) {
  return prisma.tournament.update({ where: { id }, data });
}
