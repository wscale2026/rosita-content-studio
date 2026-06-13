import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Save,
  Clock,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/auth";


interface SequenceStep {
  id?: number;
  day: number;
  title: string;
  subject: string;
  body: string;
}

interface SequenceEditorModalProps {
  step: SequenceStep;
  onClose: () => void;
  onSaved: () => void;
}

export default function SequenceEditorModal({ step, onClose, onSaved }: SequenceEditorModalProps) {
  const [mode, setMode] = useState<"compose" | "preview">("compose");
  const [day, setDay] = useState(step.day);
  const [title, setTitle] = useState(step.title);
  const [subject, setSubject] = useState(step.subject);
  const [body, setBody] = useState(step.body);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { day, title, subject, body };
      const url = step.id 
        ? `${API_BASE_URL}/emails/sequence/${step.id}/`
        : `${API_BASE_URL}/emails/sequence/`;
      const method = step.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Étape de séquence sauvegardée !");
        onSaved();
        onClose();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erreur de sauvegarde. Vérifiez que le jour n'existe pas déjà.");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const canSave = title.trim() && subject.trim() && body.trim() && day > 0;

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
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg leading-tight">
                {step.id ? "Modifier l'étape" : "Nouvelle étape"}
              </h2>
              <p className="text-xs text-muted-foreground">Séquence Automatisée 90 jours</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === "compose" ? "preview" : "compose")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "preview" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {mode === "preview" ? "Éditer" : "Aperçu"}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mode === "compose" ? (
            <div className="flex flex-col gap-0 divide-y divide-border">
              
              {/* ── Configuration ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Jour d'envoi
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={day}
                    onChange={(e) => setDay(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-medium"
                  />
                  <p className="text-[10px] text-muted-foreground">Ex: 1 (le lendemain de l'inscription)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Titre Interne
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Email de bienvenue"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-medium"
                  />
                  <p className="text-[10px] text-muted-foreground">Pour vous organiser en interne</p>
                </div>
              </div>

              {/* ── Sujet ── */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Sujet de l'email
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Le sujet que le prospect verra"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm font-medium"
                />
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
                    <button onClick={() => insertFormat("{{prenom}}", "")} title="Insérer prénom" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-[10px] font-bold">
                      <Type className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Corps de l'email... Utilisez {{prenom}} pour le prénom."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none min-h-[150px] sm:min-h-[250px] leading-relaxed font-mono"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {body.length} caractères
                </p>
              </div>
            </div>
          ) : (
            /* ── APERÇU ── */
            <div className="px-4 sm:px-8 py-6">
              <div className="max-w-lg mx-auto">
                <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-lg">
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
                        <span className="text-muted-foreground font-medium w-12">Sujet :</span>
                        <span className="text-foreground font-bold">{subject || <em className="opacity-50">Sans sujet</em>}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-6">
                    <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">
                      {body || <span className="text-muted-foreground italic">Aucun contenu…</span>}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex-col sm:flex-row px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/10 flex sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="text-xs text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            Sera envoyé automatiquement au Jour {day}.
          </div>
          <div className="flex gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors text-sm font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? "Sauvegarde..." : (
                <>
                  <Save className="h-4 w-4" />
                  Sauvegarder
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
