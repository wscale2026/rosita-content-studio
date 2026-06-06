import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Clock,
  Palette,
  Globe,
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  const { user, logout, isAdmin } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const sections = [
    {
      title: "Compte",
      items: [
        {
          icon: User,
          label: "Profil",
          sublabel: user?.name || "Non défini",
          action: "view" as const,
        },
        {
          icon: Shield,
          label: "Rôle",
          sublabel: user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : "—",
          action: "view" as const,
        },
      ],
    },
    {
      title: "Apparence",
      items: [
        {
          icon: Palette,
          label: "Thème",
          sublabel: theme === "light" ? "Clair" : theme === "dark" ? "Sombre" : "Système",
          action: "toggle" as const,
          content: (
            <div className="flex gap-2 mt-2">
              {([
                { value: "light", icon: Sun, label: "Clair" },
                { value: "dark", icon: Moon, label: "Sombre" },
                { value: "system", icon: Monitor, label: "Système" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === option.value
                      ? "bg-[#6750A4] text-white shadow-sm"
                      : "bg-[#E7E0EC] text-[#49454F] hover:bg-[#EADDFF]"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          ),
        },
        {
          icon: Globe,
          label: "Langue",
          sublabel: "Français",
          action: "view" as const,
        },
      ],
    },
    {
      title: "Sécurité",
      items: [
        {
          icon: Clock,
          label: "Session",
          sublabel: "Expire après 30 min d'inactivité",
          action: "view" as const,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
          Paramètres
        </h1>
        <p className="text-sm text-[#49454F] mt-1">
          Gérer ton compte et tes préférences
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-5 rounded-xl bg-[#EADDFF] border border-[#6750A4]/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#6750A4] flex items-center justify-center text-white text-lg font-medium">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1C1B1F]">
              {user?.name || "Utilisateur"}
            </h3>
            <p className="text-sm text-[#49454F]">{user?.email || "—"}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#6750A4] text-white mt-1 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-sm font-medium text-[#49454F] uppercase tracking-wider px-1">
            {section.title}
          </h2>
          <div className="bg-white rounded-xl border border-[#E7E0EC] overflow-hidden divide-y divide-[#E7E0EC]">
            {section.items.map((item) => (
              <div key={item.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FEF7FF] flex items-center justify-center">
                      <item.icon className="h-4.5 w-4.5 text-[#6750A4]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1B1F]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#49454F]">{item.sublabel}</p>
                    </div>
                  </div>
                  {item.action === "view" && (
                    <ChevronRight className="h-4 w-4 text-[#49454F]" />
                  )}
                </div>
                {item.content && <div className="mt-2 ml-12">{item.content}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFEBEE] text-[#BA1A1A] text-sm font-medium hover:bg-[#FFCDD2] transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>
    </div>
  );
}
