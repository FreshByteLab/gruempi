"use server";

import { z } from "zod";
import { prisma } from "../db";
import { getActiveTournament } from "../queries/tournament";

const playerSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  birthYear: z
    .number()
    .int()
    .min(2010, "Jahrgang ungültig")
    .max(new Date().getFullYear(), "Jahrgang liegt in der Zukunft"),
});

export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(2, "Teamname muss mindestens 2 Zeichen haben")
    .max(50, "Teamname darf maximal 50 Zeichen haben"),
  categoryId: z.string().min(1, "Bitte wähle eine Kategorie"),
  captainName: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  captainEmail: z.string().email("Ungültige E-Mail-Adresse"),
  captainPhone: z.string().min(8, "Telefonnummer zu kurz"),
  notes: z.string().max(500, "Bemerkungen darf maximal 500 Zeichen haben").optional(),
  players: z
    .array(playerSchema)
    .min(1, "Mindestens 1 Kind erforderlich")
    .max(8, "Maximal 8 Kinder pro Team"),
  acceptDataPrivacy: z.literal(true, {
    errorMap: () => ({ message: "Du musst die Datenschutzerklärung akzeptieren" }),
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Du musst die Teilnahmebedingungen akzeptieren" }),
  }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export type RegistrationResult =
  | { success: true; teamName: string }
  | { success: false; error: string };

export async function registerTeam(input: unknown): Promise<RegistrationResult> {
  // Validate
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { success: false, error: firstError.message };
  }

  const data = parsed.data;

  // Get active tournament
  const tournament = await getActiveTournament();
  if (!tournament) {
    return { success: false, error: "Kein aktives Turnier gefunden." };
  }

  // Check registration deadline
  if (tournament.registrationDeadline && new Date() > tournament.registrationDeadline) {
    return { success: false, error: "Die Anmeldefrist ist leider abgelaufen." };
  }

  // Check category belongs to tournament
  const category = tournament.categories.find((c) => c.id === data.categoryId);
  if (!category) {
    return { success: false, error: "Ungültige Kategorie." };
  }

  // Check for duplicate team name
  const existing = await prisma.team.findFirst({
    where: { tournamentId: tournament.id, name: data.teamName },
  });
  if (existing) {
    return {
      success: false,
      error: `Ein Team mit dem Namen «${data.teamName}» ist bereits angemeldet.`,
    };
  }

  // Create team + players
  await prisma.team.create({
    data: {
      tournamentId: tournament.id,
      categoryId: data.categoryId,
      name: data.teamName,
      captainName: data.captainName,
      captainEmail: data.captainEmail,
      captainPhone: data.captainPhone,
      notes: data.notes ?? null,
      players: {
        create: data.players.map((p) => ({
          name: p.name,
          birthYear: p.birthYear,
        })),
      },
    },
  });

  // TODO: Send confirmation email
  // await sendConfirmationEmail(data.captainEmail, data.teamName, tournament);

  return { success: true, teamName: data.teamName };
}
