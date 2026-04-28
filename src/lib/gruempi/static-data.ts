import type {
  TournamentWithCategories,
  MatchWithTeams,
  StandingsByCategory,
  StandingRow,
} from "./types";

import tournamentJson from "@/data/tournament.json";
import matchesJson from "@/data/matches.json";
import legalJson from "@/data/legal.json";

type TeamStub = { id: string; name: string };
type CategoryWithTeams = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  teams: TeamStub[];
};
type TournamentWithTeams = Omit<
  TournamentWithCategories,
  "date" | "registrationDeadline" | "categories"
> & {
  date: string;
  registrationDeadline: string | null;
  categories: CategoryWithTeams[];
  createdAt?: string;
  updatedAt?: string;
};

const data = tournamentJson as unknown as TournamentWithTeams;

export function getActiveTournamentStatic(): TournamentWithCategories | null {
  if (!data?.isActive) return null;
  return {
    ...data,
    date: new Date(data.date),
    registrationDeadline: data.registrationDeadline
      ? new Date(data.registrationDeadline)
      : null,
    categories: data.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      order: cat.order,
      isActive: cat.isActive,
      _count: { teams: cat.teams.length },
    })),
  } as TournamentWithCategories;
}

export function getMatchesStatic(): MatchWithTeams[] {
  return (
    matchesJson as unknown as Array<
      Omit<MatchWithTeams, "scheduledAt"> & { scheduledAt: string | null }
    >
  ).map((m) => ({
    ...m,
    scheduledAt: m.scheduledAt ? new Date(m.scheduledAt) : null,
  })) as MatchWithTeams[];
}

export function calculateStandingsStatic(): StandingsByCategory[] {
  if (!data) return [];
  const matches = getMatchesStatic();

  return data.categories.map((cat) => {
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

    const groupMatches = matches.filter(
      (m) =>
        m.categoryId === cat.id &&
        m.phase === "GROUP" &&
        m.status === "COMPLETED"
    );

    for (const match of groupMatches) {
      if (
        !match.homeTeamId ||
        !match.awayTeamId ||
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
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
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

export function getLegalPageStatic(slug: string) {
  const page = (
    legalJson as Array<{
      id: string;
      slug: string;
      title: string;
      content: string;
      updatedAt: string;
    }>
  ).find((p) => p.slug === slug);
  if (!page) return null;
  return { ...page, updatedAt: new Date(page.updatedAt) };
}
