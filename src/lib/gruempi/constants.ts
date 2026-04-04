import type { Phase, MatchStatus, PaymentStatus } from "./types";

export const PHASE_LABELS: Record<Phase, string> = {
  GROUP: "Gruppenphase",
  QUARTERFINAL: "Viertelfinal",
  SEMIFINAL: "Halbfinal",
  FINAL: "Final",
  THIRD_PLACE: "Spiel um Platz 3",
};

export const STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: "Geplant",
  IN_PROGRESS: "Läuft",
  COMPLETED: "Beendet",
  CANCELLED: "Abgesagt",
};

export const STATUS_COLORS: Record<MatchStatus, string> = {
  SCHEDULED: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-accent-100 text-accent-700",
  COMPLETED: "bg-primary-100 text-primary-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Ausstehend",
  PAID: "Bezahlt",
  REFUNDED: "Rückerstattet",
};

export const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-accent-100 text-accent-700",
  PAID: "bg-primary-100 text-primary-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  kindergarten: "Für die Kleinsten – Spass und Bewegung stehen im Vordergrund.",
  "1-3-klasse": "1. bis 3. Klasse – erste Turnierluft schnuppern.",
  "4-6-klasse": "4. bis 6. Klasse – Technik und Teamgeist zählen.",
  oberstufe: "Oberstufe – der Wettkampf wird ernst.",
};
