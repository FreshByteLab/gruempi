import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed gestartet...");

  // Admin + Scorer Users
  const adminPassword = await bcrypt.hash("gruempi2026", 12);
  const scorerPassword = await bcrypt.hash("scorer2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gruempi.ch" },
    update: {},
    create: {
      email: "admin@gruempi.ch",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "scorer@gruempi.ch" },
    update: {},
    create: {
      email: "scorer@gruempi.ch",
      name: "Scorer",
      password: scorerPassword,
      role: "SCORER",
    },
  });

  console.log(`✅ Benutzer erstellt: ${admin.email}`);

  // Tournament 2026
  const tournament = await prisma.tournament.upsert({
    where: { year: 2026 },
    update: { isActive: true },
    create: {
      name: "Grümpelturnier Hermetschwil-Staffeln 2026",
      year: 2026,
      date: new Date("2026-06-27T09:00:00"),
      startTime: "09:00",
      endTime: "16:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
      location: "Fussballplatz Staffeln",
      organizer: "EVHS",
      heroText: "Das grösste Kinderfussballturnier im Dorf – sei dabei!",
      description:
        "Das Grümpelturnier Hermetschwil-Staffeln bringt alle Kinder des Dorfes auf den Fussballplatz. Fairplay, Spass und Gemeinschaft stehen im Vordergrund. Teams aus allen Altersstufen messen sich in spannenden Gruppen- und Finalspielen.",
      registrationDeadline: new Date("2026-04-30T23:59:59"),
      entryFee: 30,
      teamSize: 6,
      fieldPlayers: 4,
      goalieCount: 1,
      maxSubstitutes: 1,
      matchDuration: 10,
      isActive: true,
    },
  });

  console.log(`✅ Turnier erstellt: ${tournament.name}`);

  // Categories
  const categoriesData = [
    { name: "Kindergarten", slug: "kindergarten", description: "Für die Jüngsten – Spass und Bewegung im Vordergrund.", order: 0 },
    { name: "1.–3. Klasse", slug: "1-3-klasse", description: "Erste Turnierluft schnuppern – mit viel Begeisterung.", order: 1 },
    { name: "4.–6. Klasse", slug: "4-6-klasse", description: "Technik und Teamgeist zählen.", order: 2 },
    { name: "Oberstufe", slug: "oberstufe", description: "Die grossen Kicker – hier wird es ernst.", order: 3 },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { tournamentId_slug: { tournamentId: tournament.id, slug: cat.slug } },
      update: {},
      create: { tournamentId: tournament.id, ...cat },
    });
    categories[cat.slug] = created;
  }

  console.log(`✅ Kategorien erstellt: ${Object.keys(categories).join(", ")}`);

  // Sample Teams
  const teamsData = [
    // Kindergarten
    { name: "Die Zwerge", slug: "kindergarten", captain: "Maria Muster", email: "maria@example.ch", phone: "079 111 22 33" },
    { name: "Regenbogen FC", slug: "kindergarten", captain: "Peter Meier", email: "peter@example.ch", phone: "079 222 33 44" },
    { name: "Sternchen United", slug: "kindergarten", captain: "Anna Müller", email: "anna@example.ch", phone: "079 333 44 55" },
    // 1-3 Klasse
    { name: "Blitz & Donner", slug: "1-3-klasse", captain: "Hans Huber", email: "hans@example.ch", phone: "079 444 55 66" },
    { name: "FC Staffeln Junior", slug: "1-3-klasse", captain: "Eva Keller", email: "eva@example.ch", phone: "079 555 66 77" },
    { name: "Tornado Boys", slug: "1-3-klasse", captain: "Reto Bauer", email: "reto@example.ch", phone: "079 666 77 88" },
    // 4-6 Klasse
    { name: "Adler Hermetschwil", slug: "4-6-klasse", captain: "Sara Lüthi", email: "sara@example.ch", phone: "079 777 88 99" },
    { name: "Black Panthers", slug: "4-6-klasse", captain: "Mike Schmid", email: "mike@example.ch", phone: "079 888 99 00" },
    { name: "FC Dorfplatz", slug: "4-6-klasse", captain: "Claudia Frei", email: "claudia@example.ch", phone: "079 999 00 11" },
    // Oberstufe
    { name: "Stufe Sharks", slug: "oberstufe", captain: "Luca Wyss", email: "luca@example.ch", phone: "079 100 20 30" },
    { name: "FC Real Staffeln", slug: "oberstufe", captain: "Nina Wenger", email: "nina@example.ch", phone: "079 200 30 40" },
    { name: "Hermetschwil Kings", slug: "oberstufe", captain: "Jonas Bucher", email: "jonas@example.ch", phone: "079 300 40 50" },
  ];

  const createdTeams: Record<string, string[]> = {};
  for (const t of teamsData) {
    const cat = categories[t.slug];
    if (!cat) continue;

    const team = await prisma.team.upsert({
      where: { id: `seed-${t.slug}-${t.name.replace(/\s/g, "-").toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${t.slug}-${t.name.replace(/\s/g, "-").toLowerCase()}`,
        tournamentId: tournament.id,
        categoryId: cat.id,
        name: t.name,
        captainName: t.captain,
        captainEmail: t.email,
        captainPhone: t.phone,
        paymentStatus: Math.random() > 0.5 ? "PAID" : "PENDING",
        isConfirmed: Math.random() > 0.4,
        players: {
          create: Array.from({ length: 6 }, (_, i) => ({
            name: `Kind ${i + 1} (${t.name})`,
            birthYear: 2016 + Math.floor(Math.random() * 8),
          })),
        },
      },
    });

    if (!createdTeams[t.slug]) createdTeams[t.slug] = [];
    createdTeams[t.slug].push(team.id);
  }

  console.log(`✅ Teams erstellt`);

  // Sample matches for 4-6 Klasse (Gruppenphase)
  const teams46 = createdTeams["4-6-klasse"];
  const cat46 = categories["4-6-klasse"];
  if (teams46 && teams46.length >= 3 && cat46) {
    const matchesData = [
      { home: 0, away: 1, time: "09:00", homeScore: 3, awayScore: 1, status: "COMPLETED" },
      { home: 0, away: 2, time: "10:00", homeScore: 2, awayScore: 2, status: "COMPLETED" },
      { home: 1, away: 2, time: "11:00", homeScore: null, awayScore: null, status: "SCHEDULED" },
    ];

    const baseDate = new Date("2026-06-27");
    for (let i = 0; i < matchesData.length; i++) {
      const m = matchesData[i];
      const [h, min] = m.time.split(":").map(Number);
      const scheduledAt = new Date(baseDate);
      scheduledAt.setHours(h, min, 0, 0);

      await prisma.match.create({
        data: {
          tournamentId: tournament.id,
          categoryId: cat46.id,
          homeTeamId: teams46[m.home],
          awayTeamId: teams46[m.away],
          field: "Feld 1",
          scheduledAt,
          phase: "GROUP",
          groupName: "Gruppe A",
          matchNumber: i + 1,
          status: m.status,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
        },
      });
    }
    console.log(`✅ Beispielspiele erstellt`);
  }

  // Legal pages
  await prisma.legalPage.upsert({
    where: { slug: "datenschutz" },
    update: {},
    create: {
      slug: "datenschutz",
      title: "Datenschutzerklärung",
      content: `## Datenschutzerklärung

### Verantwortliche Stelle
EVHS – Einwohnervereinshaus Hermetschwil-Staffeln
Kontakt: sandro@gruempi.ch

### Erhobene Daten
Bei der Anmeldung zum Grümpelturnier werden folgende Daten erfasst:
- Name und Kontaktdaten der Kontaktperson (Captain)
- Teamname und Kategorie
- Namen und Jahrgänge der teilnehmenden Kinder
- Bemerkungen (freiwillig)

### Zweck der Datenerhebung
Die Daten werden ausschliesslich für die Organisation und Durchführung des Grümpelturniers verwendet. Dies umfasst:
- Verwaltung der Anmeldungen
- Erstellung des Spielplans
- Kommunikation rund ums Turnier

### Weitergabe von Daten
Die Daten werden nicht an Dritte weitergegeben. Namen der Teams können im Spielplan und in der Rangliste öffentlich angezeigt werden.

### Speicherung
Die Daten werden nur für das jeweilige Turnierjahr gespeichert und danach gelöscht.

### Rechte
Betroffene Personen können jederzeit Auskunft über ihre gespeicherten Daten verlangen und deren Löschung beantragen. Anfragen bitte an: sandro@gruempi.ch

### Änderungen
Diese Datenschutzerklärung kann jederzeit angepasst werden. Stand: April 2026.`,
    },
  });

  await prisma.legalPage.upsert({
    where: { slug: "teilnahmebedingungen" },
    update: {},
    create: {
      slug: "teilnahmebedingungen",
      title: "Teilnahmebedingungen",
      content: `## Teilnahmebedingungen

### Teilnahmeberechtigung
- Das Turnier richtet sich ausschliesslich an Kinder aus Hermetschwil-Staffeln.
- Gemischte Teams (Mädchen und Knaben) sind ausdrücklich erlaubt.
- Pro Team sind 6 Kinder zugelassen (5 auf dem Feld, 1 Auswechselspieler).

### Kategorien
- Kindergarten
- 1.–3. Klasse
- 4.–6. Klasse
- Oberstufe

Die Kategorie richtet sich nach dem Jahrgang des ältesten Kindes im Team. Bei Unklarheiten entscheidet die Turnierleitung.

### Anmeldung
- Die Anmeldung ist verbindlich und muss bis zum 30. April 2026 erfolgen.
- Das Startgeld beträgt CHF 30 pro Team.
- Die Zahlung ist Voraussetzung für die definitive Zulassung.

### Spielbetrieb
- Es gilt Fairplay. Unsportliches Verhalten führt zum Ausschluss.
- Die Entscheidungen des Schiedsrichters sind endgültig.
- Reklamationen sind ruhig und sachlich beim Turnierbüro einzureichen.
- Protest und aggressives Verhalten gegenüber Schiedsrichtern oder anderen Teilnehmenden wird nicht toleriert.

### Sicherheit
- Jeder Teilnehmer nimmt auf eigene Gefahr teil.
- Der Veranstalter haftet nicht für Unfälle oder Sachschäden.
- Die Eltern sind für eine angemessene Versicherung ihrer Kinder selbst verantwortlich.

### Änderungen
Der Veranstalter behält sich vor, den Spielplan oder die Kategorien bei Bedarf anzupassen. Angemeldete Teams werden informiert.`,
    },
  });

  await prisma.legalPage.upsert({
    where: { slug: "haftung" },
    update: {},
    create: {
      slug: "haftung",
      title: "Haftungsausschluss",
      content: `## Haftungsausschluss

### Teilnahme auf eigene Gefahr
Die Teilnahme am Grümpelturnier Hermetschwil-Staffeln 2026 erfolgt auf eigene Gefahr. Der Veranstalter EVHS übernimmt keine Haftung für Unfälle, Verletzungen oder Sachschäden, die im Zusammenhang mit der Teilnahme am Turnier entstehen.

### Versicherung
Für eine ausreichende Unfall- und Haftpflichtversicherung der Teilnehmenden sind die Erziehungsberechtigten selbst verantwortlich.

### Veranstaltungsgelände
Der Veranstalter kann nicht für Schäden durch äussere Einflüsse (Wetter, höhere Gewalt, technische Störungen) haftbar gemacht werden. Bei extremen Wetterbedingungen behält sich der Veranstalter das Recht vor, das Turnier abzusagen oder zu verschieben.

### Absage
Im Falle einer Absage aus wichtigen Gründen (z.B. Unwetter, Epidemie) wird das Startgeld vollständig zurückerstattet. Weitergehende Ansprüche sind ausgeschlossen.

### Website
Die Inhalte dieser Website werden mit grösster Sorgfalt erstellt. Der Veranstalter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte.

### Kontakt
Bei Fragen zum Haftungsausschluss: sandro@gruempi.ch`,
    },
  });

  console.log(`✅ Rechtliche Seiten erstellt`);
  console.log(`\n🎉 Seed abgeschlossen!`);
  console.log(`\n📋 Login-Daten:`);
  console.log(`   Admin: admin@gruempi.ch / gruempi2026`);
  console.log(`   Scorer: scorer@gruempi.ch / scorer2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
