import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const p = new PrismaClient();

const TOURNAMENT_ID = "cmnixbq5r0002hsjd6dwvun3u";

const tournament = await p.tournament.findFirst({
  where: { isActive: true },
  include: {
    categories: {
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        teams: { select: { id: true, name: true } },
      },
    },
  },
});

const matches = await p.match.findMany({
  where: { tournamentId: TOURNAMENT_ID },
  include: {
    category: { select: { id: true, name: true, slug: true } },
    homeTeam: { select: { id: true, name: true } },
    awayTeam: { select: { id: true, name: true } },
  },
  orderBy: [{ scheduledAt: "asc" }, { matchNumber: "asc" }],
});

const legal = await p.legalPage.findMany();

await p.$disconnect();

mkdirSync("src/data", { recursive: true });

writeFileSync("src/data/tournament.json", JSON.stringify(tournament, null, 2));
writeFileSync("src/data/matches.json", JSON.stringify(matches, null, 2));
writeFileSync("src/data/legal.json", JSON.stringify(legal, null, 2));

console.log("Exported tournament:", tournament?.name);
console.log("Exported matches:", matches.length);
console.log("Exported legal pages:", legal.length);
