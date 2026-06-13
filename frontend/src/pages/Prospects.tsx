import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users, Search, Snowflake, Flame, Crown,
  ChevronLeft, ChevronRight, Send, X, Mail, Phone, Calendar, Trash2, Code, AlignLeft, Eye, EyeOff, Copy
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders, logoutUser } from "@/lib/auth";
import { VercelConfirmModal } from "@/components/VercelConfirmModal";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/auth";


type Status = "all" | "froid" | "chaud" | "cliente";

const statusConfig = {
  froid:   { label: "Froid",   icon: Snowflake, color: "text-blue-500",    bg: "bg-blue-500/10"    },
  chaud:   { label: "Chaud",   icon: Flame,     color: "text-orange-500",  bg: "bg-orange-500/10"  },
  cliente: { label: "Cliente", icon: Crown,     color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.color}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

export default function Prospects() {
  const { isSuperadmin } = useAuth();
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState<Status>("all");
  const [, setPage]               = useState(1);
  const [selected, setSelected]   = useState<number | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailProspectId, setEmailProspectId] = useState<number | null>(null);
  const [subject, setSubject]     = useState("");
  const [body, setBody]           = useState("");
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isHtml, setIsHtml] = useState(false);
  const [emailMode, setEmailMode] = useState<"compose" | "preview">("compose");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProspectId, setDeleteProspectId] = useState<number | null>(null);
  const [isDeletingProspect, setIsDeletingProspect] = useState(false);

  const insertVariable = (variable: string) => {
    setBody(prev => prev + variable);
    toast.success(`Variable ${variable} insérée`, { duration: 2000 });
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/prospects/`, { headers: getAuthHeaders() })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            logoutUser();
            window.location.href = "/backoffice/login";
          }
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(data => {
        setProspects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error("Erreur de chargement des prospects");
        setLoading(false);
      });
  }, []);

  const filtered = prospects.filter((p) => {
    const matchStatus = status === "all" || p.status === status;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (p.first_name || "").toLowerCase().includes(q) ||
      (p.last_name || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const detail = prospects.find((p) => p.id === selected);
  const emailDetail = prospects.find((p) => p.id === emailProspectId);

  const openEmailModalWithTemplate = (prospectId: number | null) => {
    setEmailProspectId(prospectId);
    
    if (prospectId) {
      const p = prospects.find(x => x.id === prospectId);
      const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Client";
      
      if (p?.status === 'froid') {
        setSubject("Découvrez notre offre exclusive pour vous ! 🎁");
        setBody(`Bonjour ${name},\n\nNous avons remarqué votre intérêt. C'est le moment idéal pour franchir le pas et découvrir nos offres exceptionnelles conçues pour propulser votre activité.\n\nÀ très vite !`);
      } else if (p?.status === 'chaud') {
        setSubject("Finalisez votre inscription dès maintenant ! 🚀");
        setBody(`Bonjour ${name},\n\nVous y êtes presque ! Ne laissez pas passer cette opportunité. Finalisez votre paiement dès aujourd'hui pour accéder immédiatement à votre plateforme et commencer l'aventure.\n\nCordialement,`);
      } else if (p?.status === 'cliente') {
        setSubject("Merci pour votre confiance ! ❤️");
        setBody(`Bonjour ${name},\n\nUn grand merci de faire partie de la famille Rosyta Content Studio ! N'hésitez pas à nous contacter si vous avez la moindre question concernant votre abonnement.\n\nL'équipe Rosyta.`);
      } else {
        setSubject("");
        setBody("");
      }
    } else {
      // Global Campaign
      setSubject("Nouveautés chez Rosyta Content Studio 🌟");
      setBody(`Bonjour à tous,\n\nDécouvrez nos dernières nouveautés et les offres exclusives de la semaine. Restez connectés pour ne rien manquer !\n\nL'équipe Rosyta.`);
    }
    
    setEmailOpen(true);
  };

  const handleSend = async () => {
    setIsSendingEmail(true);
    try {
      const payload: any = { subject, body, is_html: isHtml };
      if (emailProspectId) {
        payload.prospect_id = emailProspectId;
      }
      
      const res = await fetch(`${API_BASE_URL}/prospects/send-email/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Erreur d'envoi");
      
      toast.success(data.message || "Email envoyé avec succès ! 🎉", {
        style: { backgroundColor: '#10b981', color: 'white', border: 'none' },
      });
      setEmailOpen(false);
      setEmailProspectId(null);
      setSubject("");
      setBody("");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'envoi de l'email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleClearProspects = async () => {
    setIsClearing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/prospects/clear/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Erreur");
      setProspects([]);
      toast.success("Tous les prospects ont été supprimés.", {
        style: { backgroundColor: '#10b981', color: 'white', border: 'none' },
      });
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false);
    }
  };

  const handleDeleteProspect = async () => {
    if (!deleteProspectId) return;
    setIsDeletingProspect(true);
    try {
      const res = await fetch(`${API_BASE_URL}/prospects/${deleteProspectId}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setProspects(prev => prev.filter(p => p.id !== deleteProspectId));
      toast.success("Prospect supprimé avec succès.", {
        style: { backgroundColor: '#10b981', color: 'white', border: 'none' },
      });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression.");
    } finally {
      setIsDeletingProspect(false);
      setIsDeleteModalOpen(false);
      setDeleteProspectId(null);
    }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Mes Prospects</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{filtered.length} contact{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {isSuperadmin && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Vider la liste</span>
            </button>
          )}
          <button
            onClick={() => openEmailModalWithTemplate(null)}
            className="flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Campagne</span>
            <span className="sm:hidden">Envoyer</span>
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {/* Status chips — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
          {(["all", "froid", "chaud", "cliente"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                status === s
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background border border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s === "all" ? "Tous" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile Card List ── */}
      <div className="md:hidden space-y-3">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
            style={{ animation: `fadeIn 0.3s ease-out ${i * 0.04}s both` }}
            onClick={() => setSelected(p.id)}
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner shrink-0">
              {(p.first_name?.[0] || "") + (p.last_name?.[0] || "")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {p.last_name} {p.first_name}
              </div>
              <div className="text-xs text-muted-foreground truncate">{p.email}</div>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{p.source}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); openEmailModalWithTemplate(p.id); }}
                className="p-2 rounded-xl bg-primary/10 text-primary"
              >
                <Send className="h-4 w-4" />
              </button>
              {isSuperadmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteProspectId(p.id); setIsDeleteModalOpen(true); }}
                  className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">Aucun prospect trouvé.</div>
        )}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block glass-card rounded-2xl overflow-hidden border border-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Coordonnées</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Inscription</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors group" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold shadow-sm">
                        {p.first_name?.[0] || ""}{p.last_name?.[0] || ""}
                      </div>
                      <p className="font-semibold text-foreground">{p.last_name} {p.first_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span>{p.email}</span></div>
                      {p.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /><span>{p.phone}</span></div>}
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{p.source}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(p.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); openEmailModalWithTemplate(p.id); }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"><Send className="h-4 w-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setSelected(p.id); }} className="p-2 rounded-xl bg-muted text-muted-foreground transition-colors"><Users className="h-4 w-4" /></button>
                      {isSuperadmin && (
                        <button onClick={(e) => { e.stopPropagation(); setDeleteProspectId(p.id); setIsDeleteModalOpen(true); }} className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Aucun prospect trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <span className="text-xs font-medium text-muted-foreground">{filtered.length} prospect{filtered.length > 1 ? "s" : ""}</span>
          <div className="flex gap-2">
            <button disabled className="p-2 rounded-lg border border-border bg-background text-muted-foreground opacity-50"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled className="p-2 rounded-lg border border-border bg-background text-muted-foreground opacity-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ── */}
      {selected && detail && createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm h-full bg-card border-l border-border shadow-2xl animate-slide-in-right overflow-y-auto p-5 pb-safe">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Profil</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-xl"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-3 shadow-inner">
                {(detail.first_name?.[0] || "") + (detail.last_name?.[0] || "")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{detail.last_name} {detail.first_name}</h2>
                <div className="mt-1"><StatusBadge status={detail.status} /></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-primary shrink-0" /><span className="truncate">{detail.email}</span></div>
              {detail.phone && <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-primary shrink-0" /><span>{detail.phone}</span></div>}
            </div>
            <button onClick={() => openEmailModalWithTemplate(detail.id)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-md">
              <Send className="h-4 w-4" /> Envoyer un message
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* ── Email Modal (Advanced Campaign Editor) ── */}
      {emailOpen && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => setEmailOpen(false)} />
          
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  {emailDetail ? `Message direct à ${emailDetail.last_name}` : "Nouvelle Campagne d'Emailing"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {emailDetail ? "Un seul destinataire" : `Envoi en masse à ${prospects.filter(p => p.email).length} contacts`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmailMode(emailMode === "compose" ? "preview" : "compose")}
                  className={`flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    emailMode === "preview"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {emailMode === "preview" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {emailMode === "preview" ? "Éditer" : "Aperçu"}
                </button>
                <button onClick={() => { setEmailOpen(false); setEmailProspectId(null); }} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
              
              {/* Left Column - Editor */}
              <div className={`w-full lg:w-1/2 border-r border-border p-5 overflow-y-auto ${emailMode === "compose" ? "flex flex-col" : "hidden lg:flex lg:flex-col"}`}>
                <div className="space-y-5">
                  {/* Subject */}
                  <div>
                    <label className="text-xs font-bold text-foreground mb-1.5 block">Objet de l'email</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Découvrez notre offre spéciale 🎁" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm font-medium shadow-sm" />
                  </div>

                  {/* Format Toggle & Variables */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                    <div className="flex items-center bg-background rounded-lg border border-border overflow-hidden shadow-sm">
                      <button onClick={() => setIsHtml(false)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${!isHtml ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                        <AlignLeft className="h-3.5 w-3.5" /> Texte
                      </button>
                      <button onClick={() => setIsHtml(true)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${isHtml ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                        <Code className="h-3.5 w-3.5" /> HTML
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {["{{prenom}}", "{{nom}}", "{{email}}", "{{telephone}}"].map(v => (
                        <button key={v} onClick={() => insertVariable(v)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-bold hover:bg-primary hover:text-primary-foreground transition-colors" title="Cliquez pour insérer">
                          <Copy className="h-2.5 w-2.5" /> {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Textarea */}
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <label className="text-xs font-bold text-foreground mb-1.5 flex items-center justify-between">
                      <span>Message</span>
                      {isHtml && <span className="text-[10px] font-normal text-muted-foreground bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-500/20">Mode Code HTML activé</span>}
                    </label>
                    <textarea 
                      value={body} 
                      onChange={(e) => setBody(e.target.value)} 
                      placeholder={isHtml ? "<h1>Titre</h1>\n<p>Bonjour {{prenom}}, ...</p>" : "Bonjour {{prenom}},\n\nÉcris ton message ici..."} 
                      className={`w-full flex-1 min-h-[300px] p-4 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm resize-none shadow-sm ${isHtml ? 'font-mono text-xs text-blue-400' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Live Preview */}
              <div className={`w-full lg:w-1/2 bg-muted/10 ${emailMode === "preview" ? "flex flex-col" : "hidden lg:flex lg:flex-col"}`}>
                <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aperçu en direct</span>
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-border/50 min-h-full p-6 sm:p-8 overflow-hidden text-black">
                    {/* Simulated Email Header */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <p className="text-xs text-gray-500">De : <span className="font-semibold text-gray-800">Rosyta Content Studio</span></p>
                      <p className="text-xs text-gray-500">À : <span className="font-semibold text-gray-800">{emailDetail ? emailDetail.email : "Tous vos contacts"}</span></p>
                      <p className="text-sm font-bold text-gray-900 mt-2">{subject.replace('{{prenom}}', emailDetail?.first_name || 'Jean').replace('{{nom}}', emailDetail?.last_name || 'Dupont') || "Sans objet"}</p>
                    </div>
                    {/* Content Preview */}
                    <div className="prose prose-sm max-w-none prose-p:my-2 prose-a:text-blue-600">
                      {isHtml ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: body
                            .replace(/{{prenom}}/g, emailDetail?.first_name || 'Jean')
                            .replace(/{{nom}}/g, emailDetail?.last_name || 'Dupont')
                            .replace(/{{email}}/g, emailDetail?.email || 'jean@exemple.com')
                            .replace(/{{telephone}}/g, emailDetail?.phone || '+33600000000')
                        }} />
                      ) : (
                        <div className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                          {body
                            .replace(/{{prenom}}/g, emailDetail?.first_name || 'Jean')
                            .replace(/{{nom}}/g, emailDetail?.last_name || 'Dupont')
                            .replace(/{{email}}/g, emailDetail?.email || 'jean@exemple.com')
                            .replace(/{{telephone}}/g, emailDetail?.phone || '+33600000000')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-between">
              <span className="text-xs text-muted-foreground hidden sm:block">Assurez-vous que l'aperçu correspond à vos attentes avant d'envoyer.</span>
              <button 
                onClick={handleSend} 
                disabled={!subject.trim() || !body.trim() || isSendingEmail} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className={`h-4 w-4 ${isSendingEmail ? "animate-pulse" : ""}`} /> 
                {isSendingEmail ? "Envoi en cours..." : (emailDetail ? "Envoyer le mail" : "Lancer la campagne")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <VercelConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearProspects}
        title="Supprimer tous les prospects"
        description="Cette action est irréversible. Elle supprimera définitivement l'ensemble de votre base de prospects (y compris leurs coordonnées et statuts)."
        confirmText="Supprimer définitivement"
        expectedWord="supprimer définitivement"
        isDeleting={isClearing}
      />

      <VercelConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeleteProspectId(null); }}
        onConfirm={handleDeleteProspect}
        title="Supprimer ce prospect"
        description="Cette action est irréversible. Ce prospect et toutes les données associées seront supprimés."
        confirmText="Supprimer"
        expectedWord="supprimer"
        isDeleting={isDeletingProspect}
      />
    </div>
  );
}
