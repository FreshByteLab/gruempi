"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { auth } from "../auth";
import { z } from "zod";

export async function deleteTeam(teamId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.team.delete({ where: { id: teamId } });
  revalidatePath("/gruempi/admin/teams");
  return { success: true };
}

export async function setPaymentStatus(teamId: string, paymentStatus: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.team.update({ where: { id: teamId }, data: { paymentStatus } });
  revalidatePath("/gruempi/admin/teams");
  return { success: true };
}

export async function setConfirmed(teamId: string, isConfirmed: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.team.update({ where: { id: teamId }, data: { isConfirmed } });
  revalidatePath("/gruempi/admin/teams");
  return { success: true };
}

const editTeamSchema = z.object({
  name: z.string().min(2),
  captainName: z.string().min(2),
  captainEmail: z.string().email(),
  captainPhone: z.string().min(8),
  categoryId: z.string().min(1),
  notes: z.string().optional().nullable(),
});

export async function updateTeam(teamId: string, input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  const parsed = editTeamSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Ungültige Eingabe" };

  await prisma.team.update({ where: { id: teamId }, data: parsed.data });
  revalidatePath("/gruempi/admin/teams");
  return { success: true };
}

export async function updatePlayers(
  teamId: string,
  players: { id?: string; name: string; birthYear: number }[]
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  // Delete all existing players and recreate
  await prisma.player.deleteMany({ where: { teamId } });
  await prisma.player.createMany({
    data: players.map((p) => ({ teamId, name: p.name, birthYear: p.birthYear })),
  });
  revalidatePath("/gruempi/admin/teams");
  return { success: true };
}

export async function createCategory(tournamentId: string, data: {
  name: string;
  slug: string;
  description?: string;
  order?: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.category.create({
    data: { tournamentId, ...data },
  });
  revalidatePath("/gruempi/admin/kategorien");
  return { success: true };
}

export async function updateCategory(id: string, data: {
  name?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.category.update({ where: { id }, data });
  revalidatePath("/gruempi/admin/kategorien");
  return { success: true };
}

export async function updateTournamentContent(
  tournamentId: string,
  data: { heroText?: string; description?: string }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.tournament.update({ where: { id: tournamentId }, data });
  revalidatePath("/gruempi");
  revalidatePath("/gruempi/info");
  return { success: true };
}

export async function updateLegalPage(slug: string, title: string, content: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Keine Berechtigung" };

  await prisma.legalPage.upsert({
    where: { slug },
    update: { title, content },
    create: { slug, title, content },
  });
  revalidatePath(`/gruempi/${slug}`);
  return { success: true };
}
