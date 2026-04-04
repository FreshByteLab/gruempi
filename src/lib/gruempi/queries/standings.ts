import { prisma } from "../db";
import type { StandingRow, StandingsByCategory } from "../types";

export async function calculateStandings(tournamentId: string): Promise<StandingsByCategory[]> {
  const categories = await prisma.category.findMany({
    where: { tournamentId, isActive: true },
    orderBy: { order: "asc" },
    include: {
      teams: { select: { id: true, name: true } },
      matches: {
        where: { status: "COMPLETED" },
        select: {
          homeTeamId: true,
          awayTeamId: true,
          homeScore: true,
          awayScore: true,
          phase: true,
          groupName: true,
        },
      },
    },
  });

  return categories.map((cat) => {
    const teamMap = new Map<string, StandingRow>(
      cat.teams.map((t) => [
        t.id,
        {
          teamId: t.id,
          teamName: t.name,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        },
      ])
    );

    // Only group phase matches count for standings
    const groupMatches = cat.matches.filter((m) => m.phase === "GROUP");

    for (const match of groupMatches) {
      if (
        match.homeTeamId == null ||
        match.awayTeamId == null ||
        match.homeScore == null ||
        match.awayScore == null
      )
        continue;

      const home = teamMap.get(match.homeTeamId);
      const away = teamMap.get(match.awayTeamId);
      if (!home || !away) continue;

      const hs = match.homeScore;
      const as_ = match.awayScore;

      home.played++;
      away.played++;
      home.goalsFor += hs;
      home.goalsAgainst += as_;
      away.goalsFor += as_;
      away.goalsAgainst += hs;

      if (hs > as_) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (hs < as_) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        home.points += 1;
        away.drawn++;
        away.points += 1;
      }
    }

    const standings = Array.from(teamMap.values()).map((r) => ({
      ...r,
      goalDifference: r.goalsFor - r.goalsAgainst,
    }));

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName, "de");
    });

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      categorySlug: cat.slug,
      standings,
    };
  });
}
