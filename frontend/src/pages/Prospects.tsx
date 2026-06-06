import { useState } from "react";
import {
  Users, Search, Snowflake, Flame, Crown,
  ChevronLeft, ChevronRight, Send, X, Mail, Phone, Calendar,
} from "lucide-react";
import { mockData } from "@/lib/mockData";
import { toast } from "sonner";

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
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState<Status>("all");
  const [, setPage]               = useState(1);
  const [selected, setSelected]   = useState<number | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [subject, setSubject]     = useState("");
  const [body, setBody]           = useState("");

  const filtered = mockData.prospects.filter((p) => {
    const matchStatus = status === "all" || p.status === status;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const detail = mockData.prospects.find((p) => p.id === selected);

  const handleSend = () => {
    toast.success("Email envoyé !", { description: `Sujet : ${subject}` });
    setEmailOpen(false);
    setSubject("");
    setBody("");
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Mes Prospects</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{filtered.length} contact{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { setSelected(null); setEmailOpen(true); }}
          className="flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Campagne</span>
          <span className="sm:hidden">Envoyer</span>
        </button>
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
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold shrink-0 text-sm shadow-sm">
              {p.firstName[0]}{p.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-foreground text-sm">{p.firstName} {p.lastName}</p>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{p.email}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{p.source}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(p.id); setEmailOpen(true); }}
              className="p-2 rounded-xl bg-primary/10 text-primary shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
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
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <p className="font-semibold text-foreground">{p.firstName} {p.lastName}</p>
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
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelected(p.id); setEmailOpen(true); }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"><Send className="h-4 w-4" /></button>
                      <button onClick={() => setSelected(p.id)} className="p-2 rounded-xl bg-muted text-muted-foreground transition-colors"><Users className="h-4 w-4" /></button>
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
      {selected && detail && !emailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-sm h-full bg-card border-l border-border shadow-2xl animate-slide-in-right overflow-y-auto p-5 pb-safe">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Profil</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-xl"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">{detail.firstName[0]}{detail.lastName[0]}</div>
              <div>
                <h3 className="text-xl font-bold">{detail.firstName} {detail.lastName}</h3>
                <div className="mt-1"><StatusBadge status={detail.status} /></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-primary shrink-0" /><span className="truncate">{detail.email}</span></div>
              {detail.phone && <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-primary shrink-0" /><span>{detail.phone}</span></div>}
            </div>
            <button onClick={() => setEmailOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-md">
              <Send className="h-4 w-4" /> Envoyer un message
            </button>
          </div>
        </div>
      )}

      {/* ── Email Modal ── */}
      {emailOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEmailOpen(false)} />
          {/* Sheet on mobile, centered modal on sm+ */}
          <div className="relative w-full sm:max-w-lg bg-card border border-border sm:rounded-2xl rounded-t-2xl shadow-2xl p-5 sm:p-6 animate-slide-up sm:animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">
                {detail ? `Message à ${detail.firstName}` : "Nouvelle campagne"}
              </h3>
              <button onClick={() => setEmailOpen(false)} className="p-2 rounded-xl hover:bg-muted"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block">Sujet</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Ton cadeau est là 🎁" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1.5 block">Message</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Écris ton message ici..." className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-sm resize-none" />
              </div>
              <button onClick={handleSend} disabled={!subject.trim() || !body.trim()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="h-4 w-4" /> Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
