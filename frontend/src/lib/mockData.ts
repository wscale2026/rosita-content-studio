export const mockData = {
  dashboard: {
    newProspects: 142,
    revenue: 4500,
    openRate: 68.4,
    hotProspects: 34,
    recentActivity: [
      { id: 1, type: "sale", title: "Nouvelle vente", description: "Aïssatou a acheté le Mentorship VIP", time: "Il y a 5 min", amount: 1500 },
      { id: 2, type: "email", title: "Email envoyé", description: "Séquence J+14 envoyée à 45 prospects", time: "Il y a 2 heures" },
      { id: 3, type: "prospect", title: "Nouveau prospect chaud", description: "Koffi a téléchargé les 2 guides", time: "Il y a 4 heures" },
      { id: 4, type: "sale", title: "Nouvelle vente", description: "Sarah a acheté la Masterclass", time: "Hier" },
      { id: 5, type: "prospect", title: "Rosita a modifié un prospect", description: "Mise à jour du statut de Marie", time: "Hier" },
    ],
    chartData: Array.from({ length: 30 }).map((_, i) => ({
      name: `Jour ${i + 1}`,
      leads: Math.floor(Math.random() * 20) + 5,
    }))
  },
  prospects: [
    { id: 1, firstName: "Aïssatou", lastName: "Diallo", email: "aissatou.d@example.com", phone: "+221 77 123 45 67", status: "cliente", source: "TikTok", createdAt: "2026-06-05T10:00:00Z" },
    { id: 2, firstName: "Koffi", lastName: "Kouadio", email: "koffi.k@example.com", phone: "+225 07 89 01 23 45", status: "chaud", source: "Instagram", createdAt: "2026-06-04T15:30:00Z" },
    { id: 3, firstName: "Marie", lastName: "Dupont", email: "marie.d@example.com", phone: "+33 6 12 34 56 78", status: "froid", source: "TikTok", createdAt: "2026-06-01T09:15:00Z" },
    { id: 4, firstName: "Sarah", lastName: "Benali", email: "sarah.b@example.com", phone: "", status: "cliente", source: "Facebook", createdAt: "2026-05-28T14:20:00Z" },
    { id: 5, firstName: "Fatou", lastName: "Ndiaye", email: "fatou.n@example.com", phone: "+221 76 987 65 43", status: "froid", source: "TikTok", createdAt: "2026-06-06T08:45:00Z" },
    { id: 6, firstName: "Amadou", lastName: "Bah", email: "amadou.b@example.com", phone: "+224 62 345 67 89", status: "chaud", source: "Youtube", createdAt: "2026-06-02T11:10:00Z" },
    { id: 7, firstName: "Chloe", lastName: "Martin", email: "chloe.m@example.com", phone: "+33 7 89 01 23 45", status: "froid", source: "TikTok", createdAt: "2026-06-03T16:50:00Z" },
  ],
  payments: [
    { id: "gp_1x8y9z", clientName: "Aïssatou Diallo", amount: 1500, currency: "EUR", date: "2026-06-06T09:15:00Z", status: "confirmed", product: "Mentorship VIP" },
    { id: "gp_2a3b4c", clientName: "Sarah Benali", amount: 297, currency: "EUR", date: "2026-06-05T14:30:00Z", status: "confirmed", product: "Masterclass TikTok" },
    { id: "gp_5d6e7f", clientName: "Jean Marc", amount: 1500, currency: "EUR", date: "2026-06-04T10:00:00Z", status: "failed", product: "Mentorship VIP" },
    { id: "gp_8g9h0i", clientName: "Amina Sy", amount: 297, currency: "EUR", date: "2026-06-02T16:45:00Z", status: "confirmed", product: "Masterclass TikTok" },
  ],
  emails: {
    stats: { totalSent: 12450, totalOpened: 8520, averageOpenRate: 68.4 },
    sequence: [
      { day: 0, title: "Bienvenue + PDFs", description: "Envoi immédiat des ressources promises." },
      { day: 7, title: "Histoire de Sarah", description: "Comment Sarah a percé sur TikTok." },
      { day: 14, title: "Conseil TikTok", description: "L'erreur #1 qui tue votre reach." },
      { day: 21, title: "Témoignage Aïssatou", description: "De 0 à 10k abonnés en 1 mois." },
      { day: 28, title: "Trouver ses 8 histoires", description: "Méthode exclusive Rosita." },
      { day: 35, title: "Koffi, 8000 CFA de ventes", description: "Étude de cas monétisation." },
      { day: 42, title: "Invitation appel découverte", description: "Filtre pour le Mentorship VIP." },
      { day: 49, title: "Séquence hebdo (1/6)", description: "Contenu de valeur hebdomadaire." },
      { day: 91, title: "Offre spéciale prospect fidèle", description: "Réduction Masterclass." },
    ],
    history: [
      { id: 1, prospectName: "Marie Dupont", subject: "Voici tes guides gratuits 🎁", sentAt: "2026-06-06T09:15:00Z", opened: true, openCount: 2, type: "automated" },
      { id: 2, prospectName: "Fatou Ndiaye", subject: "Voici tes guides gratuits 🎁", sentAt: "2026-06-06T08:45:00Z", opened: false, openCount: 0, type: "automated" },
      { id: 3, prospectName: "Koffi Kouadio", subject: "L'erreur #1 qui tue votre reach", sentAt: "2026-06-06T08:00:00Z", opened: true, openCount: 1, type: "automated" },
      { id: 4, prospectName: "Tous les prospects", subject: "LIVE Exclusif ce soir !", sentAt: "2026-06-05T18:00:00Z", opened: true, openCount: 450, type: "manual" },
    ]
  },
  content: [
    { id: 1, title: "Guide de démarrage TikTok", type: "pdf", size: "2.4 MB", uploadedAt: "2026-05-15T10:00:00Z", downloads: 1432 },
    { id: 2, title: "Checklist 8 Histoires", type: "pdf", size: "1.1 MB", uploadedAt: "2026-05-20T14:30:00Z", downloads: 856 },
    { id: 3, title: "Template Script Viral", type: "pdf", size: "850 KB", uploadedAt: "2026-06-01T09:15:00Z", downloads: 342 },
  ],
  securityLogs: [
    { id: 1, action: "Connexion réussie", user: "Admin Dev", ip: "192.168.1.1", time: "Il y a 2 min" },
    { id: 2, action: "Modification de prospect", user: "Rosita", ip: "10.0.0.5", time: "Hier à 15:30" },
    { id: 3, action: "Export de données", user: "Admin Dev", ip: "192.168.1.1", time: "Hier à 10:15" },
    { id: 4, action: "Nouvel utilisateur invité", user: "Rosita", ip: "10.0.0.5", time: "Il y a 3 jours" },
  ]
};
