import { useState, useEffect } from "react";
import { getAuthHeaders, logoutUser } from "@/lib/auth";
import { toast } from "sonner";
import { Banknote, TrendingUp, Download, ExternalLink, RefreshCw, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { VercelConfirmModal } from "@/components/VercelConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/auth";


export default function Payments() {
  const { isSuperadmin } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState<number | null>(null);
  const [isDeletingPayment, setIsDeletingPayment] = useState(false);

  const loadPayments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/`, { headers: getAuthHeaders() });
      if (!res.ok) {
        if (res.status === 401) {
          logoutUser();
          window.location.href = "/backoffice/login";
        }
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur de chargement des paiements");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalRevenue = payments.filter(p => p.status === "success").reduce((s, p) => s + parseFloat(p.amount), 0);
  const confirmed = payments.filter(p => p.status === "success").length;

  const handleClearPayments = async () => {
    setIsClearing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/clear/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Erreur");
      setPayments([]);
      toast.success("Tous les paiements ont été supprimés.", {
        style: { backgroundColor: '#10b981', color: 'white', border: 'none' },
      });
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;
    setIsDeletingPayment(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${deletePaymentId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setPayments(prev => prev.filter(p => p.id !== deletePaymentId));
      toast.success("Paiement supprimé avec succès.", {
        style: { backgroundColor: '#10b981', color: 'white', border: 'none' },
      });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression.");
    } finally {
      setIsDeletingPayment(false);
      setIsDeleteModalOpen(false);
      setDeletePaymentId(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPayments();
  };

  const handleExportCSV = () => {
    if (payments.length === 0) {
      toast.error("Aucun paiement à exporter.");
      return;
    }

    const headers = ["ID Transaction", "Client", "Produit", "Montant", "Statut", "Date"];
    const rows = payments.map(p => [
      p.reference,
      `${p.prospect?.first_name || ""} ${p.prospect?.last_name || ""}`.trim(),
      p.offer_type,
      p.amount,
      p.status,
      new Date(p.created_at).toLocaleString("fr-FR")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `paiements_rosyta_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export réussi.");
  };

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
          <button onClick={handleRefresh} className={`p-2 rounded-xl bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors ${isRefreshing ? 'opacity-50' : ''}`}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-md">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          {isSuperadmin && (
            <button 
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Vider l'historique</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        <div className="glass-card rounded-2xl p-4 md:p-6 border-l-4 border-l-emerald-500 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-emerald-500/10"><Banknote className="w-24 h-24" /></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-muted-foreground">Encaissements</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{(totalRevenue || 0).toLocaleString("fr-FR")} CFA</p>
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
        <div className="max-h-[500px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {payments.map((p, i) => (
          <div key={p.id} className="glass-card rounded-2xl p-4" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground text-sm truncate">{p.prospect?.first_name} {p.prospect?.last_name}</p>
                  {isSuperadmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeletePaymentId(p.id); setIsDeleteModalOpen(true); }}
                      className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.offer_type}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">{p.reference}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-foreground">{(parseFloat(p.amount) || 0).toLocaleString("fr-FR")} CFA</p>
                <div className="mt-1">
                  {p.status === "success" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Confirmé
                    </span>
                  ) : p.status === "pending" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" /> En attente
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
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block glass-card rounded-2xl overflow-hidden border border-border shadow-md">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-base font-bold text-foreground">Dernières transactions</h2>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">ID Transaction</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Montant</th>
                {isSuperadmin && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((p, i) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors group" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.reference}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{p.prospect?.first_name} {p.prospect?.last_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.offer_type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(p.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-6 py-4">
                    {p.status === "success"
                      ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3" /> Confirmé</span>
                      : p.status === "pending"
                      ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500"><RefreshCw className="h-3 w-3 animate-spin" /> En attente</span>
                      : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500"><XCircle className="h-3 w-3" /> Échoué</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-foreground">{(parseFloat(p.amount) || 0).toLocaleString("fr-FR")} CFA</td>
                  {isSuperadmin && (
                    <td className="px-6 py-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setDeletePaymentId(p.id); setIsDeleteModalOpen(true); }} className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VercelConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearPayments}
        title="Supprimer tous les paiements"
        description="Cette action est irréversible. Elle supprimera définitivement l'historique complet de vos transactions et paiements de notre base de données."
        confirmText="Supprimer définitivement"
        expectedWord="supprimer définitivement"
        isDeleting={isClearing}
      />

      <VercelConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletePaymentId(null); }}
        onConfirm={handleDeletePayment}
        title="Supprimer ce paiement"
        description="Cette action est irréversible. Ce paiement et toutes les données associées seront supprimés. Êtes-vous sûr de vouloir continuer ?"
        confirmText="Supprimer"
        expectedWord="supprimer"
        isDeleting={isDeletingPayment}
      />
    </div>
  );
}
