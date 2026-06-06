import { mockData } from "@/lib/mockData";
import { User, Shield, Users, Save, Key, Clock, MonitorSmartphone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Tab = "profile" | "team" | "security";

const tabs: { id: Tab; icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: "profile",  icon: User,   label: "Profil"    },
  { id: "team",     icon: Users,  label: "Équipe"    },
  { id: "security", icon: Shield, label: "Sécurité"  },
];

export default function Settings() {
  const [active, setActive] = useState<Tab>("profile");

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Profil, équipe et sécurité.</p>
      </div>

      {/* Tab bar — horizontal scroll on mobile */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap flex-1 justify-center transition-all duration-200 ${
              active === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {active === "profile" && (
        <div className="glass-card rounded-2xl p-4 md:p-8 space-y-6 border border-border shadow-md animate-fade-in">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">R</div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Rosita Content Studio</h2>
              <p className="text-xs text-muted-foreground">Consultant TikTok Expert</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Nom complet</label>
              <input type="text" defaultValue="Rosita Content Studio" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Email</label>
              <input type="email" defaultValue="hello@rosita-studio.com" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">Nouveau mot de passe</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => toast.success("Paramètres enregistrés !")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-md"
            >
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Team */}
      {active === "team" && (
        <div className="glass-card rounded-2xl p-4 md:p-8 space-y-5 border border-border shadow-md animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base md:text-lg font-bold text-foreground">Accès Équipe</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Gérez les membres de votre espace.</p>
            </div>
            <button className="px-3 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors">Inviter</button>
          </div>
          {[
            { initials: "R", name: "Rosita Content Studio", email: "hello@rosita-studio.com", role: "Propriétaire", color: "bg-primary/20 text-primary" },
            { initials: "M", name: "Marie Assistant", email: "marie@rosita-studio.com", role: "Éditeur", color: "bg-emerald-500/20 text-emerald-500" },
          ].map((member) => (
            <div key={member.email} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
              <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center font-bold shrink-0`}>{member.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground shrink-0">{member.role}</span>
            </div>
          ))}
        </div>
      )}

      {/* Security */}
      {active === "security" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card rounded-2xl p-4 md:p-6 border border-border shadow-md space-y-4">
            <h2 className="text-base md:text-lg font-bold text-foreground border-b border-border pb-4">Sécurité du compte</h2>
            {[
              { icon: Clock, label: "Déconnexion automatique", desc: "Après 30 min d'inactivité.", enabled: true, color: "text-orange-500 bg-orange-500/10" },
              { icon: MonitorSmartphone, label: "Double authentification", desc: "Protection par SMS (2FA).", enabled: false, color: "text-blue-500 bg-blue-500/10" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                {item.enabled ? (
                  <div className="relative w-11 h-6 rounded-full bg-primary cursor-pointer shrink-0">
                    <div className="absolute top-1 right-1 bg-white w-4 h-4 rounded-full shadow-sm" />
                  </div>
                ) : (
                  <button className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-muted-foreground/20 transition-colors shrink-0">Activer</button>
                )}
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-4 md:p-6 border border-border shadow-md space-y-3">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-3">Journal des activités</h2>
            {mockData.securityLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{log.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.user} · {log.ip}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
