import { prisma } from "../db";
import type { TeamWithDetails } from "../types";

export async function getTeamsByTournament(tournamentId: string): Promise<TeamWithDetails[]> {
  const teams = await prisma.team.findMany({
    where: { tournamentId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      players: true,
    },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  });
  return teams as TeamWithDetails[];
}

export async function getTeamById(id: string): Promise<TeamWithDetails | null> {
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      players: true,
    },
  });
  return team as TeamWithDetails | null;
}

export async function getTeamCount(tournamentId: string): Promise<number> {
  return prisma.team.count({ where: { tournamentId } });
}

export async function deleteTeam(id: string) {
  return prisma.team.delete({ where: { id } });
}

export async function updateTeamPayment(id: string, paymentStatus: string) {
  return prisma.team.update({ where: { id }, data: { paymentStatus } });
}

export async function updateTeamConfirmed(id: string, isConfirmed: boolean) {
  return prisma.team.update({ where: { id }, data: { isConfirmed } });
}
