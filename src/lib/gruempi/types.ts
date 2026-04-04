// Domain types derived from Prisma models + string enum constants

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";
export type MatchStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type Phase = "GROUP" | "QUARTERFINAL" | "SEMIFINAL" | "FINAL" | "THIRD_PLACE";
export type Role = "ADMIN" | "SCORER";

export type TournamentWithCategories = {
  id: string;
  name: string;
  year: number;
  date: Date;
  startTime: string;
  endTime: string;
  lunchStart: string | null;
  lunchEnd: string | null;
  location: string;
  organizer: string;
  heroText: string | null;
  description: string | null;
  registrationDeadline: Date | null;
  entryFee: number;
  teamSize: number;
  fieldPlayers: number;
  goalieCount: number;
  maxSubstitutes: number;
  matchDuration: number;
  isActive: boolean;
  categories: CategoryWithTeamCount[];
};

export type CategoryWithTeamCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  _count?: { teams: number };
};

export type TeamWithDetails = {
  id: string;
  tournamentId: string;
  categoryId: string;
  name: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  notes: string | null;
  paymentStatus: PaymentStatus;
  isConfirmed: boolean;
  registeredAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string };
  players: Player[];
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  birthYear: number;
};

export type MatchWithTeams = {
  id: string;
  tournamentId: string;
  categoryId: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  field: string | null;
  scheduledAt: Date | null;
  phase: Phase;
  groupName: string | null;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  notes: string | null;
  matchNumber: number | null;
  category: { id: string; name: string; slug: string };
  homeTeam: { id: string; name: string } | null;
  awayTeam: { id: string; name: string } | null;
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type StandingsByCategory = {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  standings: StandingRow[];
};
