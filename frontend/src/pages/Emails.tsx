import { useState } from "react";
import { mockData } from "@/lib/mockData";
import { CheckCircle2, XCircle, Clock, PieChart, Send, Calendar, Activity } from "lucide-react";
import NewEmailModal from "@/components/NewEmailModal";

export default function Emails() {
  const { emails } = mockData;
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2">
              Séquences Emails
              <span className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-full">Auto</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Séquence 90 jours — le système convertit pour vous.</p>
          </div>
          <button
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs md:text-sm hover:opacity-90 shadow-lg shadow-primary/25 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvel Email Manuel</span>
            <span className="sm:hidden">Envoyer</span>
          </button>
        </div>

        {/* Stats Cards — horizontal scroll on mobile */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-3 md:p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-l-4 border-l-blue-500">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground">Envoyés</p>
              <p className="text-lg md:text-2xl font-bold text-foreground">{emails.stats.totalSent.toLocaleString("fr-FR")}</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-3 md:p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-l-4 border-l-emerald-500">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground">Ouverts</p>
              <p className="text-lg md:text-2xl font-bold text-foreground">{emails.stats.totalOpened.toLocaleString("fr-FR")}</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-3 md:p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-l-4 border-l-purple-500">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <PieChart className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground">Taux ouv.</p>
              <p className="text-lg md:text-2xl font-bold text-foreground">{emails.stats.averageOpenRate}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Sequence Timeline */}
          <div className="glass-card rounded-2xl p-4 md:p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Séquence 90 Jours</h2>
            </div>
            {/* Horizontal scroll timeline on mobile */}
            <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
              {emails.sequence.map((step, i) => (
                <div key={i} className="shrink-0 w-40 bg-muted/30 rounded-xl p-3 border border-border/50">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mb-2">Jour {step.day}</span>
                  <h3 className="text-xs font-bold text-foreground leading-tight">{step.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{step.description}</p>
                </div>
              ))}
            </div>
            {/* Vertical timeline on desktop */}
            <div className="hidden lg:block relative pl-5 space-y-5 border-l-2 border-primary/20 ml-2">
              {emails.sequence.map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[29px] w-3.5 h-3.5 rounded-full bg-background border-2 border-primary ring-2 ring-background" />
                  <div className="bg-muted/30 rounded-xl p-3 border border-border/50 hover:border-primary/30 transition-colors">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-1.5 inline-block">Jour {step.day}</span>
                    <h3 className="text-xs font-bold text-foreground">{step.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="glass-card rounded-2xl lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-4 md:p-5 border-b border-border flex items-center gap-2 bg-muted/20">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Journal récent</h2>
            </div>
            {/* Mobile list */}
            <div className="md:hidden divide-y divide-border">
              {emails.history.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3 p-4" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${e.type === "automated" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-500"}`}>
                    {e.type === "automated" ? <Clock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{e.prospectName}</p>
                    <p className="text-xs text-muted-foreground truncate">{e.subject}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {e.opened
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500"><CheckCircle2 className="h-3 w-3" /> {e.openCount}x</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground"><XCircle className="h-3 w-3" /> —</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Destinataire</th>
                    <th className="px-6 py-4">Sujet</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {emails.history.map((e, i) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                      <td className="px-6 py-4 font-semibold text-foreground">{e.prospectName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.subject}</td>
                      <td className="px-6 py-4">
                        {e.type === "automated"
                          ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary"><Clock className="h-3 w-3" /> Auto</span>
                          : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500"><Send className="h-3 w-3" /> Manuel</span>}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{new Date(e.sentAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                      <td className="px-6 py-4">
                        {e.opened
                          ? <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3" /> Ouvert</span><span className="text-[10px] text-muted-foreground">({e.openCount}x)</span></div>
                          : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground"><XCircle className="h-3 w-3" /> Non ouvert</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {emailModalOpen && <NewEmailModal onClose={() => setEmailModalOpen(false)} />}
    </>
  );
}
