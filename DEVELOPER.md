# Grümpelturnier – Developer Documentation

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma 5 + SQLite (dev) |
| Auth | NextAuth v5 (Credentials) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

---

## Getting Started

```bash
npm install
DATABASE_URL="file:./dev.db" npx prisma db push
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000/gruempi](http://localhost:3000/gruempi)

**Default credentials:**
- Admin: `admin@gruempi.ch` / `gruempi2026`
- Scorer: `scorer@gruempi.ch` / `scorer2026`

---

## Routes

### Public (`/gruempi/*`)

| Route | Description |
|---|---|
| `/gruempi` | Homepage – Hero, Kategorien, Turnierinfos, Kontakt |
| `/gruempi/info` | Detaillierte Turnierregeln |
| `/gruempi/anmeldung` | Anmeldeformular mit Validierung |
| `/gruempi/spielplan` | Live-Spielplan, gruppiert nach Kategorie und Phase |
| `/gruempi/rangliste` | Automatische Rangliste nach Gruppenphase |
| `/gruempi/datenschutz` | Datenschutzerklärung (aus DB) |
| `/gruempi/teilnahmebedingungen` | Teilnahmebedingungen (aus DB) |
| `/gruempi/haftung` | Haftungsausschluss (aus DB) |

### Auth

| Route | Description |
|---|---|
| `/gruempi/login` | Login für Admin und Scorer |

### Admin (`/gruempi/admin/*`) — nur ADMIN

| Route | Description |
|---|---|
| `/gruempi/admin` | Dashboard mit Statistiken |
| `/gruempi/admin/teams` | Teams anzeigen, bearbeiten, löschen, Zahlung verwalten |
| `/gruempi/admin/spiele` | Spielplan erstellen und verwalten |
| `/gruempi/admin/resultate` | Resultate erfassen und korrigieren |
| `/gruempi/admin/kategorien` | Kategorien bearbeiten, sortieren, aktivieren |
| `/gruempi/admin/inhalte` | Turniertexte und rechtliche Seiten bearbeiten |

### Feld (`/gruempi/feld`) — ADMIN oder SCORER

| Route | Description |
|---|---|
| `/gruempi/feld` | Mobile Resultaterfassung mit grossen Buttons |

---

## Authentifizierung

- **NextAuth v5** mit Credentials Provider (E-Mail + Passwort)
- Passwörter werden mit bcrypt gehasht (Faktor 12)
- JWT-Session mit eingebettetem `role`-Feld
- `middleware.ts` schützt `/gruempi/admin/*` und `/gruempi/feld`
- Server Actions prüfen zusätzlich die Session via `auth()`

**Rollen:**
- `ADMIN` – Vollzugriff auf alles
- `SCORER` – nur `/gruempi/feld` (Resultaterfassung)

---

## Datenmodell (Prisma/SQLite)

```
Tournament  →  Category[]  →  Team[]  →  Player[]
           →  Match[]
```

**Tournament** – Ein Eintrag pro Jahr. Das aktive Turnier trägt `isActive: true`.

**Category** – Kategorie (Kindergarten, 1.–3. Klasse etc.) pro Turnier.

**Team** – Angemeldetes Team. Enthält Kontaktdaten und Spielerliste.

**Player** – Kind in einem Team (Name + Jahrgang).

**Match** – Spiel mit Phase, Status, optionalem Resultat.
- `status`: `SCHEDULED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`
- `phase`: `GROUP` | `QUARTERFINAL` | `SEMIFINAL` | `FINAL` | `THIRD_PLACE`

**User** – Admin oder Scorer mit gehashtem Passwort.

**LegalPage** – Bearbeitbare Rechtstexte (slug-basiert).

---

## Rangliste

Berechnung in `src/lib/gruempi/queries/standings.ts`:
- Nur Gruppenspiele (`phase === "GROUP"`) zählen
- Punkte: Sieg = 3, Unentschieden = 1, Niederlage = 0
- Sortierung: Punkte → Tordifferenz → Tore erzielt → Teamname

Keine separate Tabelle – live berechnet bei jedem Seitenaufruf.

---

## Server Actions

| Action | Datei | Beschreibung |
|---|---|---|
| `registerTeam` | `actions/registration.ts` | Öffentliche Anmeldung |
| `updateMatchScore` | `actions/matches.ts` | Resultat erfassen (Scorer + Admin) |
| `createMatch` / `updateMatch` / `deleteMatch` | `actions/matches.ts` | Spielverwaltung (Admin) |
| `deleteTeam` / `setPaymentStatus` / `updateTeam` | `actions/teams.ts` | Teamverwaltung (Admin) |
| `updateCategory` | `actions/teams.ts` | Kategorieverwaltung (Admin) |
| `updateTournamentContent` / `updateLegalPage` | `actions/teams.ts` | Inhaltspflege (Admin) |

---

## Layout-Struktur

```
src/app/
  layout.tsx                    ← Root (font, globals.css)
  page.tsx                      ← Redirect → /gruempi
  gruempi/
    layout.tsx                  ← Bare (Metadata only)
    (public)/
      layout.tsx                ← Navbar + Footer
      page.tsx                  ← /gruempi
      info/ spielplan/ ...
    admin/
      layout.tsx                ← AdminSidebar (auth check)
      page.tsx dashboard/ ...
    feld/
      page.tsx                  ← Standalone full-screen
    login/
      page.tsx                  ← Standalone
```

---

## Für 2027 / neues Turnier anlegen

1. **Neuen Tournament-Datensatz erstellen** in Prisma Studio oder per Script:
   ```ts
   await prisma.tournament.create({
     data: {
       name: "Grümpelturnier Hermetschwil-Staffeln 2027",
       year: 2027,
       date: new Date("2027-06-26T09:00:00"),
       // ... weitere Felder
       isActive: false, // erst aktivieren wenn bereit
     }
   })
   ```

2. **Altes Turnier deaktivieren:**
   ```ts
   await prisma.tournament.update({ where: { year: 2026 }, data: { isActive: false } })
   ```

3. **Neues Turnier aktivieren:**
   ```ts
   await prisma.tournament.update({ where: { year: 2027 }, data: { isActive: true } })
   ```

4. **Kategorien für 2027 erstellen** (analog zu 2026, per Seed oder Admin → Kategorien)

Die URL `/gruempi` zeigt immer das aktive Turnier. Teams, Spielplan und Resultate sind an das jeweilige Turnier gebunden — historische Daten bleiben erhalten.

**Was sich nie ändern muss:**
- Code, Routen, Komponenten
- Auth-Konfiguration
- Admin-Bereich

**Was pro Jahr angepasst wird:**
- Turnierdatum, -ort, Anmeldeschluss
- Startgeld, Teamgrösse (falls nötig)
- Hero-Text und Beschreibung (Admin → Inhalte)
- Kategorienliste (Admin → Kategorien)

---

## Deployment-Hinweise

- Für Produktion: PostgreSQL statt SQLite empfohlen (Prisma-Provider auf `postgresql` umstellen)
- `AUTH_SECRET` muss ein sicheres, zufälliges Secret sein
- `DATABASE_URL` muss auf die Produktionsdatenbank zeigen
- `.env.local` **nicht** ins Git-Repository
- `prisma db push` oder `prisma migrate deploy` im Deployment-Prozess ausführen
- Für SQLite auf Produktionsserver: Sicherstellen dass der Pfad schreibbar ist

---

## Kontakt / Anpassen

- Kontaktperson ändern: `src/components/gruempi/layout/Footer.tsx` + `src/app/gruempi/(public)/page.tsx`
- Farben ändern: `src/app/globals.css` (@theme Block)
- Kategorien umbenennen: Admin → Kategorien
- Rechtliche Texte: Admin → Inhalte
