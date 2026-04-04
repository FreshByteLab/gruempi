"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { auth } from "../auth";

const updateScoreSchema = z.object({
  matchId: z.string().min(1),
  homeScore: z.number().int().min(0).max(99),
  awayScore: z.number().int().min(0).max(99),
});

export async function updateMatchScore(input: unknown) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Nicht angemeldet" };
  if (session.user.role !== "ADMIN" && session.user.role !== "SCORER") {
    return { success: false, error: "Keine Berechtigung" };
  }

  const parsed = updateScoreSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Ungültige Eingabe" };

  const { matchId, homeScore, awayScore } = parsed.data;

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, status: "COMPLETED" },
  });

  revalidatePath("/gruempi/spielplan");
  revalidatePath("/gruempi/rangliste");
  revalidatePath("/gruempi/feld");

  return { success: true };
}

export async function updateMatchStatus(matchId: string, status: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.match.update({ where: { id: matchId }, data: { status } });
  revalidatePath("/gruempi/spielplan");
  revalidatePath("/gruempi/feld");
  return { success: true };
}

const createMatchSchema = z.object({
  tournamentId: z.string(),
  categoryId: z.string(),
  homeTeamId: z.string().optional().nullable(),
  awayTeamId: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
  phase: z.string().default("GROUP"),
  groupName: z.string().optional().nullable(),
  matchNumber: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function createMatch(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  const parsed = createMatchSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Ungültige Eingabe" };

  const data = parsed.data;
  await prisma.match.create({
    data: {
      tournamentId: data.tournamentId,
      categoryId: data.categoryId,
      homeTeamId: data.homeTeamId ?? null,
      awayTeamId: data.awayTeamId ?? null,
      field: data.field ?? null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      phase: data.phase,
      groupName: data.groupName ?? null,
      matchNumber: data.matchNumber ?? null,
      notes: data.notes ?? null,
    },
  });

  revalidatePath("/gruempi/spielplan");
  revalidatePath("/gruempi/admin/spiele");
  return { success: true };
}

export async function deleteMatch(matchId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.match.delete({ where: { id: matchId } });
  revalidatePath("/gruempi/spielplan");
  revalidatePath("/gruempi/admin/spiele");
  return { success: true };
}

export async function updateMatch(matchId: string, data: {
  homeTeamId?: string | null;
  awayTeamId?: string | null;
  field?: string | null;
  scheduledAt?: string | null;
  phase?: string;
  groupName?: string | null;
  matchNumber?: number | null;
  notes?: string | null;
  status?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.match.update({
    where: { id: matchId },
    data: {
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });

  revalidatePath("/gruempi/spielplan");
  revalidatePath("/gruempi/admin/spiele");
  revalidatePath("/gruempi/admin/resultate");
  return { success: true };
}
