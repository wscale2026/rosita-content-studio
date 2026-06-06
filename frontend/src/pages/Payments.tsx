import { mockData } from "@/lib/mockData";
import { Euro, TrendingUp, Download, ExternalLink, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export default function Payments() {
  const { payments } = mockData;
  const totalRevenue = payments.filter(p => p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
  const confirmed = payments.filter(p => p.status === "confirmed").length;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2">
            Paiements
            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              GeniusPay
            </span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Encaissements en temps réel.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-md">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        <div className="glass-card rounded-2xl p-4 md:p-6 border-l-4 border-l-emerald-500 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><Euro className="w-24 h-24" /></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-muted-foreground">Encaissements</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">€{totalRevenue.toLocaleString("fr-FR")}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-500 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" /><span>+15% ce mois</span>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-6 border-l-4 border-l-blue-500">
          <p className="text-xs font-semibold text-muted-foreground">Transactions</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{confirmed}</p>
          <p className="text-xs text-muted-foreground mt-2">Taux de succès : 98%</p>
        </div>
        <div className="glass-card rounded-2xl p-4 md:p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><span className="text-white font-bold text-[10px]">GP</span></div>
              <span className="font-bold text-sm text-foreground">GeniusPay</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Connecté</span>
          </div>
          <p className="text-xs text-muted-foreground">Versements sous 48h ouvrées.</p>
          <button className="mt-3 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            Gérer <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Transactions récentes</h2>
        {payments.map((p, i) => (
          <div key={p.id} className="glass-card rounded-2xl p-4" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{p.clientName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.product}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">{p.id}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-foreground">€{p.amount.toLocaleString("fr-FR")}</p>
                <div className="mt-1">
                  {p.status === "confirmed" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Confirmé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                      <XCircle className="h-2.5 w-2.5" /> Échoué
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card rounded-2xl overflow-hidden border border-border shadow-md">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-base font-bold text-foreground">Dernières transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID Transaction</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p, i) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{p.clientName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.product}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(p.date).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-6 py-4">
                    {p.status === "confirmed"
                      ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3" /> Confirmé</span>
                      : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500"><XCircle className="h-3 w-3" /> Échoué</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground">€{p.amount.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
