import { getDb } from "../api/queries/connection";
import { prospects, payments, emailLogs, resources } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  const db = getDb();

  console.log("Seeding prospects...");
  const prospectData = [
    { firstName: "Aminata", lastName: "Diallo", email: "aminata.d@email.com", phone: "+221 77 123 4567", status: "froid" as const, source: "Instagram", guidesDownloaded: 1, emailsOpened: 0, callBooked: false, notes: "Downloaded guide but no email engagement" },
    { firstName: "Kofi", lastName: "Mensah", email: "kofi.m@email.com", phone: "+233 24 987 6543", status: "froid" as const, source: "Facebook", guidesDownloaded: 2, emailsOpened: 1, callBooked: false, notes: "Interested in content creation" },
    { firstName: "Fatou", lastName: "Ndiaye", email: "fatou.n@email.com", phone: "+221 76 456 7890", status: "froid" as const, source: "LinkedIn", guidesDownloaded: 1, emailsOpened: 2, callBooked: false, notes: "" },
    { firstName: "Ibrahim", lastName: "Touré", email: "ibrahim.t@email.com", phone: "+225 07 111 2223", status: "froid" as const, source: "Website", guidesDownloaded: 3, emailsOpened: 0, callBooked: false, notes: "Downloaded all 3 guides" },
    { firstName: "Mariam", lastName: "Koné", email: "mariam.k@email.com", phone: "+223 76 444 5556", status: "froid" as const, source: "Instagram", guidesDownloaded: 1, emailsOpened: 1, callBooked: false, notes: "" },
    { firstName: "Jean-Paul", lastName: "Kouamé", email: "jp.kouame@email.com", phone: "+225 05 777 8889", status: "froid" as const, source: "Referral", guidesDownloaded: 1, emailsOpened: 0, callBooked: false, notes: "Referred by Awa" },
    { firstName: "Sophie", lastName: "Bamba", email: "sophie.b@email.com", phone: "+221 78 333 4445", status: "froid" as const, source: "Facebook", guidesDownloaded: 2, emailsOpened: 2, callBooked: false, notes: "Engaged on social media" },
    { firstName: "Ousmane", lastName: "Sow", email: "ousmane.s@email.com", phone: "+221 77 666 7778", status: "froid" as const, source: "LinkedIn", guidesDownloaded: 1, emailsOpened: 0, callBooked: false, notes: "" },
    { firstName: "Awa", lastName: "Fall", email: "awa.f@email.com", phone: "+221 76 999 0001", status: "chaud" as const, source: "Instagram", guidesDownloaded: 2, emailsOpened: 5, callBooked: true, notes: "Booked discovery call for next week" },
    { firstName: "Moussa", lastName: "Diop", email: "moussa.d@email.com", phone: "+221 77 222 3334", status: "chaud" as const, source: "Website", guidesDownloaded: 1, emailsOpened: 4, callBooked: true, notes: "Very interested in coaching program" },
    { firstName: "Grace", lastName: "Addo", email: "grace.a@email.com", phone: "+233 20 555 6667", status: "chaud" as const, source: "Facebook", guidesDownloaded: 3, emailsOpened: 6, callBooked: false, notes: "High engagement, needs follow-up for call" },
    { firstName: "Amadou", lastName: "Ba", email: "amadou.b@email.com", phone: "+221 78 888 9990", status: "chaud" as const, source: "Referral", guidesDownloaded: 1, emailsOpened: 3, callBooked: true, notes: "Referred by existing client" },
    { firstName: "Esther", lastName: "Koffi", email: "esther.k@email.com", phone: "+225 01 444 5556", status: "chaud" as const, source: "Instagram", guidesDownloaded: 2, emailsOpened: 4, callBooked: false, notes: "Asking about pricing" },
    { firstName: "Bakary", lastName: "Fofana", email: "bakary.f@email.com", phone: "+223 76 111 2223", status: "chaud" as const, source: "LinkedIn", guidesDownloaded: 1, emailsOpened: 2, callBooked: true, notes: "Scheduled call confirmed" },
    { firstName: "Nadia", lastName: "Cissé", email: "nadia.c@email.com", phone: "+221 77 777 8888", status: "chaud" as const, source: "Website", guidesDownloaded: 2, emailsOpened: 3, callBooked: false, notes: "Downloaded checklist and templates" },
    { firstName: "Rosita", lastName: "Martinez", email: "rosita.m@email.com", phone: "+221 76 000 1112", status: "cliente" as const, source: "Instagram", guidesDownloaded: 3, emailsOpened: 8, callBooked: true, notes: "Full coaching program - 3 months" },
    { firstName: "Pierre", lastName: "Yao", email: "pierre.y@email.com", phone: "+225 07 333 4444", status: "cliente" as const, source: "Facebook", guidesDownloaded: 2, emailsOpened: 5, callBooked: true, notes: "VIP package" },
    { firstName: "Léa", lastName: "Ouattara", email: "lea.o@email.com", phone: "+221 78 555 6666", status: "cliente" as const, source: "Referral", guidesDownloaded: 1, emailsOpened: 4, callBooked: true, notes: "1-on-1 coaching" },
    { firstName: "Sékou", lastName: "Traoré", email: "sekou.t@email.com", phone: "+223 76 888 9999", status: "cliente" as const, source: "Website", guidesDownloaded: 2, emailsOpened: 6, callBooked: true, notes: "Group coaching + templates" },
    { firstName: "Yasmine", lastName: "Benali", email: "yasmine.b@email.com", phone: "+221 77 444 5555", status: "cliente" as const, source: "LinkedIn", guidesDownloaded: 1, emailsOpened: 3, callBooked: true, notes: "Corporate package" },
  ];

  for (const p of prospectData) {
    await db.insert(prospects).values(p);
  }

  const allProspects = await db.select({ id: prospects.id, status: prospects.status }).from(prospects);
  const clienteIds = allProspects.filter(p => p.status === "cliente").map(p => p.id);
  console.log(`Seeded ${allProspects.length} prospects. Cliente IDs: ${clienteIds.join(", ")}`);

  console.log("Seeding payments...");
  const paymentData = [
    { prospectId: clienteIds[0], amount: "297.00", currency: "EUR", status: "confirmed" as const, productName: "Coaching Complet 3 Mois", geniusPayId: "GP_20240601_001" },
    { prospectId: clienteIds[1], amount: "497.00", currency: "EUR", status: "confirmed" as const, productName: "Pack VIP", geniusPayId: "GP_20240605_002" },
    { prospectId: clienteIds[2], amount: "197.00", currency: "EUR", status: "confirmed" as const, productName: "Coaching Individuel", geniusPayId: "GP_20240610_003" },
    { prospectId: clienteIds[3], amount: "297.00", currency: "EUR", status: "confirmed" as const, productName: "Coaching Groupe + Templates", geniusPayId: "GP_20240612_004" },
    { prospectId: clienteIds[4], amount: "497.00", currency: "EUR", status: "confirmed" as const, productName: "Pack Entreprise", geniusPayId: "GP_20240615_005" },
    { prospectId: clienteIds[0], amount: "97.00", currency: "EUR", status: "confirmed" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240701_006" },
    { prospectId: clienteIds[1], amount: "97.00", currency: "EUR", status: "confirmed" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240705_007" },
    { prospectId: clienteIds[2], amount: "97.00", currency: "EUR", status: "pending" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240710_008" },
    { prospectId: clienteIds[3], amount: "97.00", currency: "EUR", status: "confirmed" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240712_009" },
    { prospectId: clienteIds[4], amount: "197.00", currency: "EUR", status: "confirmed" as const, productName: "Module Avancé", geniusPayId: "GP_20240715_010" },
    { prospectId: clienteIds[0], amount: "97.00", currency: "EUR", status: "confirmed" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240801_011" },
    { prospectId: clienteIds[1], amount: "97.00", currency: "EUR", status: "pending" as const, productName: "Renouvellement Mensuel", geniusPayId: "GP_20240805_012" },
  ];

  for (const p of paymentData) {
    await db.insert(payments).values(p);
  }
  console.log(`Seeded ${paymentData.length} payments`);

  console.log("Seeding email logs...");
  const subjects = [
    "Bienvenue ! Voici votre guide de lancement",
    "Astuce #1 : Comment définir votre niche",
    "Votre checklist Instagram est prête",
    "Rappel : Votre appel découverte demain",
    "Merci pour votre confiance ! Prochaines étapes",
    "Nouveau template Canva disponible",
    "Comment optimiser vos stories Instagram",
    "Votre séance de coaching de cette semaine",
    "Invitation : Webinaire gratuit ce jeudi",
    "Retour sur votre première semaine",
    "Les 3 erreurs à éviter sur Instagram",
    "Votre facture mensuelle",
    "Nouveau contenu dans votre espace membre",
    "Question : Comment se passe votre progression ?",
    "Dernière chance : Offre spéciale ce week-end",
    "Votre bilan de 30 jours",
    "Programme de la semaine",
    "Ressources supplémentaires",
    "Témoignage : Comment Awa a réussi",
    "Votre accès au groupe privé",
    "Alerte : Nouveau module disponible",
    "Invitation : Session Q&A en direct",
    "Votre planning de contenu",
    "Conseil : Engagez votre communauté",
    "Récapitulatif de votre parcours",
  ];

  for (let i = 0; i < 25; i++) {
    const prospectId = allProspects[i % allProspects.length].id;
    const opened = i % 3 !== 0;
    const openCount = opened ? Math.floor(Math.random() * 5) + 1 : 0;
    const emailType = i % 4 === 3 ? "manual" as const : "automated" as const;
    await db.insert(emailLogs).values({
      prospectId,
      subject: subjects[i],
      body: `Contenu de l'email : ${subjects[i]}...`,
      type: emailType,
      opened,
      openCount,
    });
  }
  console.log("Seeded 25 emails");

  console.log("Seeding resources...");
  const resourceData = [
    { filename: "guide-lancement-2024.pdf", originalName: "Guide de Lancement.pdf", mimeType: "application/pdf", size: 2450000, description: "Guide complet pour lancer votre activité de content creator" },
    { filename: "checklist-instagram.pdf", originalName: "Checklist Instagram.pdf", mimeType: "application/pdf", size: 1200000, description: "Checklist quotidienne pour optimiser votre présence Instagram" },
    { filename: "templates-canva.pdf", originalName: "Templates Canva.pdf", mimeType: "application/pdf", size: 8900000, description: "20 templates Canva prêts à l'emploi pour vos posts" },
  ];

  for (const r of resourceData) {
    await db.insert(resources).values(r);
  }
  console.log(`Seeded ${resourceData.length} resources`);

  console.log("Seed complete!");
}

seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
