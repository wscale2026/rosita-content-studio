import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Send,
  Users,
  ChevronDown,
  Sparkles,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Snowflake,
  Flame,
  Crown,
  Bold,
  Italic,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/auth";


interface NewEmailModalProps {
  onClose: () => void;
}

const TEMPLATES = [
  {
    id: 1,
    label: "🎁 Ressources offertes",
    subject: "Voici tes guides gratuits 🎁",
    body: `Salut [Prénom],\n\nComme promis, voici tes guides gratuits pour débuter sur TikTok :\n\n📘 Guide de démarrage TikTok (tout ce que j'aurais aimé savoir au début)\n📋 Checklist des 8 histoires qui convertissent\n\nPrends le temps de les lire attentivement, il y a des pépites dedans !\n\nÀ très vite,\nRosyta 🌟`,
  },
  {
    id: 2,
    label: "🔥 Invitation LIVE",
    subject: "Je t'invite à mon LIVE exclusif ce soir 🎙️",
    body: `Salut [Prénom],\n\nJ'organise un LIVE exclusif ce soir à 20h sur TikTok où je vais révéler ma méthode complète pour monétiser ton compte.\n\n🎯 Ce que tu vas apprendre :\n- Comment trouver ta niche en 10 min\n- Le script parfait pour vendre sans vendre\n- Les erreurs qui tuent le reach (et comment les éviter)\n\nC'est GRATUIT, mais les places sont limitées. Rejoins-moi ce soir !\n\nRosyta ✨`,
  },
  {
    id: 3,
    label: "💎 Offre Mentorship VIP",
    subject: "Une opportunité rare pour toi 💎",
    body: `Salut [Prénom],\n\nJe t'écris personnellement parce que j'ai suivi ton parcours et je pense que tu es prête pour la prochaine étape.\n\nMon Mentorship VIP ouvre ses portes pour seulement 5 personnes ce mois-ci.\n\nVoici ce que tu vas obtenir :\n✅ 3 mois d'accompagnement personnalisé\n✅ Accès à tous mes templates & scripts\n✅ Feedback hebdomadaire sur tes vidéos\n✅ Communauté privée d'entrepreneures\n\nTu veux en savoir plus ? Réponds simplement à cet email et on planifie un appel découverte gratuit.\n\nRosyta 💜`,
  },
  {
    id: 4,
    label: "📞 Relance douce",
    subject: "Tu avais téléchargé mes guides...",
    body: `Salut [Prénom],\n\nIl y a quelques semaines tu avais téléchargé mes guides TikTok.\n\nJ'espère qu'ils t'ont été utiles !\n\nJe voulais juste prendre de tes nouvelles et savoir où tu en es dans ton aventure TikTok ?\n\nSi tu as des questions ou que tu veux qu'on en parle, je suis là.\n\nRosyta 🌸`,
  },
];

const statusIcons: Record<string, React.FC<{ className?: string }>> = {
  froid: Snowflake,
  chaud: Flame,
  cliente: Crown,
};
const statusColors: Record<string, string> = {
  froid: "text-blue-500",
  chaud: "text-orange-500",
  cliente: "text-emerald-500",
};

export default function NewEmailModal({ onClose }: NewEmailModalProps) {
  const [step, setStep] = useState<"compose" | "preview">("compose");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "status" | "individual">("all");
  const [selectedStatus, setSelectedStatus] = useState<"froid" | "chaud" | "cliente">("chaud");
  const [selectedProspectId, setSelectedProspectId] = useState<number | null>(null);
  const [prospectSearch, setProspectSearch] = useState("");
  const [prospectDropdownOpen, setProspectDropdownOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProspectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [prospects, setProspects] = useState<any[]>([]);
  const [loadingProspects, setLoadingProspects] = useState(true);

  // Fetch real prospects
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/prospects/`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setProspects(data);
        }
      } catch (err) {
        console.error("Failed to load prospects", err);
      } finally {
        setLoadingProspects(false);
      }
    };
    fetchProspects();
  }, []);

  const filteredProspects = prospects.filter((p) => {
    const q = prospectSearch.toLowerCase();
    const fname = (p.first_name || "").toLowerCase();
    const lname = (p.last_name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    return fname.includes(q) || lname.includes(q) || email.includes(q);
  });

  const selectedProspect = prospects.find((p) => p.id === selectedProspectId);

  const recipientCount =
    recipientType === "all"
      ? prospects.length
      : recipientType === "status"
      ? prospects.filter((p) => p.status === selectedStatus).length
      : selectedProspect
      ? 1
      : 0;

  const recipientLabel =
    recipientType === "all"
      ? `Tous les prospects (${recipientCount})`
      : recipientType === "status"
      ? `Statut "${selectedStatus}" (${recipientCount} prospects)`
      : selectedProspect
      ? `${selectedProspect.first_name || ""} ${selectedProspect.last_name || ""}`.trim() || selectedProspect.email
      : "Choisir un prospect…";

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  const insertFormat = (prefix: string, suffix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);
    const newText = body.slice(0, start) + prefix + selected + suffix + body.slice(end);
    setBody(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const payload: any = {
        subject,
        body,
        is_html: true,
      };

      if (recipientType === "individual" && selectedProspectId) {
        payload.prospect_id = selectedProspectId;
      } else if (recipientType === "status") {
        payload.status = selectedStatus;
      }

      const res = await fetch(`${API_BASE_URL}/emails/send/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Email envoyé avec succès ! 🎉", {
          description: data.message || `"${subject}" → ${recipientLabel}`,
          duration: 5000,
        });
        onClose();
      } else {
        toast.error(data.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setSending(false);
    }
  };

  const canSend =
    subject.trim() &&
    body.trim() &&
    (recipientType !== "individual" || selectedProspect);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[92vh] bg-card border-0 sm:border border-border rounded-none sm:rounded-2xl shadow-2xl flex flex-col animate-scale-in overflow-hidden z-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg leading-tight">Nouvel Email Manuel</h2>
              <p className="text-xs text-muted-foreground">Envoi hors séquence automatique</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <button
              onClick={() => setStep(step === "compose" ? "preview" : "compose")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                step === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {step === "preview" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {step === "preview" ? "Éditer" : "Aperçu"}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === "compose" ? (
            <div className="flex flex-col gap-0 divide-y divide-border">

              {/* ── Destinataires ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Destinataires
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["all", "status", "individual"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRecipientType(t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        recipientType === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "all" && <><Users className="h-3.5 w-3.5" /> Tous</>}
                      {t === "status" && <><Flame className="h-3.5 w-3.5" /> Par statut</>}
                      {t === "individual" && <><Send className="h-3.5 w-3.5" /> Individuel</>}
                    </button>
                  ))}
                </div>

                {/* Status picker */}
                {recipientType === "status" && (
                  <div className="flex gap-2 pt-1">
                    {(["froid", "chaud", "cliente"] as const).map((s) => {
                      const Icon = statusIcons[s];
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedStatus(s)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                            selectedStatus === s
                              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${statusColors[s]}`} />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Individual prospect picker */}
                {recipientType === "individual" && (
                  <div ref={dropdownRef} className="relative pt-1">
                    <button
                      onClick={() => setProspectDropdownOpen(!prospectDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors text-sm"
                    >
                      <span className={selectedProspect ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {selectedProspect
                          ? `${selectedProspect.first_name || ""} ${selectedProspect.last_name || ""} — ${selectedProspect.email}`.trim()
                          : "Rechercher un prospect…"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${prospectDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {prospectDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden animate-scale-in">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              autoFocus
                              type="text"
                              value={prospectSearch}
                              onChange={(e) => setProspectSearch(e.target.value)}
                              placeholder="Nom, email…"
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredProspects.length === 0 ? (
                            <p className="text-center py-6 text-sm text-muted-foreground">Aucun résultat</p>
                          ) : (
                            filteredProspects.map((p) => {
                              const Icon = statusIcons[p.status];
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => { setSelectedProspectId(p.id); setProspectDropdownOpen(false); setProspectSearch(""); }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                                    {(p.first_name?.[0] || "")}{(p.last_name?.[0] || "")}
                                    {(!p.first_name && !p.last_name) ? p.email[0] : ""}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                      {p.first_name} {p.last_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                                  </div>
                                  <Icon className={`h-3.5 w-3.5 shrink-0 ${statusColors[p.status || "froid"]}`} />
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary badge */}
                {(recipientType !== "individual" || selectedProspect) && (
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {recipientCount} destinataire{recipientCount > 1 ? "s" : ""} sélectionné{recipientCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Sujet ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Sujet
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex : Ton cadeau exclusif est à l'intérieur 🎁"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-medium"
                />
              </div>

              {/* ── Templates ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Templates rapides
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl)}
                      className="px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-xs font-semibold text-muted-foreground transition-colors border border-transparent hover:border-primary/20"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Corps ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Message
                  </label>
                  {/* Mini toolbar */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => insertFormat("**", "**")} title="Gras" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => insertFormat("_", "_")} title="Italique" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => insertFormat("[Prénom]", "")} title="Insérer prénom" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[10px] font-bold">
                      <Type className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Écris ton message ici… Utilise [Prénom] pour personnaliser automatiquement."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none min-h-[150px] sm:min-h-[250px] leading-relaxed font-mono"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {body.length} caractères
                </p>
              </div>
            </div>
          ) : (
            /* ── APERÇU ── */
            <div className="px-8 py-6">
              <div className="max-w-lg mx-auto">
                {/* Email preview card */}
                <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-lg">
                  {/* Email header bar */}
                  <div className="bg-primary/5 border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        R
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Rosyta Content Studio</p>
                        <p className="text-xs text-muted-foreground">hello@rosyta-studio.com</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground font-medium w-12">À :</span>
                        <span className="text-foreground font-semibold">{recipientLabel}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground font-medium w-12">Sujet :</span>
                        <span className="text-foreground font-bold">{subject || <em className="opacity-50">Sans sujet</em>}</span>
                      </div>
                    </div>
                  </div>
                  {/* Email body */}
                  <div className="px-6 py-6">
                    <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                      {body || <span className="text-muted-foreground italic">Aucun contenu…</span>}
                    </pre>
                    <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                      <p>Rosyta Content Studio · TikTok Mentorship</p>
                      <p className="mt-1">
                        <span className="underline cursor-pointer hover:text-primary">Se désabonner</span>
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Ceci est un aperçu. L'email réel peut différer légèrement selon le client mail.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex-col sm:flex-row px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/10 flex sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="text-xs text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            {canSend ? (
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Prêt à envoyer
              </span>
            ) : (
              "Complétez le sujet, le message et les destinataires."
            )}
          </div>
          <div className="flex gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors text-sm font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {sending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Envoi…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
