import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Mail,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AIChat } from "./AIChat";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/",          roles: ["admin", "editor", "viewer"] },
  { icon: Users,           label: "Prospects",   path: "/prospects", roles: ["admin", "editor", "viewer"] },
  { icon: CreditCard,      label: "Paiements",   path: "/payments",  roles: ["admin", "viewer"] },
  { icon: Mail,            label: "Emails",      path: "/emails",    roles: ["admin", "editor", "viewer"] },
  { icon: FileText,        label: "Contenu",     path: "/content",   roles: ["admin"] },
  { icon: Settings,        label: "Paramètres",  path: "/settings",  roles: ["admin", "editor", "viewer"] },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout, isAdmin, isEditor, isViewer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme]         = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const menuItems = allMenuItems.filter((item) => {
    if (isAdmin) return true;
    if (isEditor) return item.roles.includes("editor");
    if (isViewer) return item.roles.includes("viewer");
    return false;
  });

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // ── Not authenticated ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-background p-4">
        <div className="flex flex-col items-center gap-6 p-8 w-full max-w-sm glass-card rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Rosita Content Studio</h1>
            <p className="text-sm text-muted-foreground">Connectez-vous pour accéder à votre espace premium.</p>
          </div>
          <button
            onClick={() => { window.location.href = "/api/oauth/authorize"; }}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const navigateTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // 5 most-used items for the bottom bar (exclude Settings, show it in mobile menu)
  const bottomBarItems = menuItems.slice(0, 5);

  // ── Main layout ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">

      {/* ══ DESKTOP SIDEBAR ══════════════════════════════════════════════════════ */}
      <aside className="hidden md:flex flex-col w-20 xl:w-64 shrink-0 h-full border-r border-border glass z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6 mb-2">
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="hidden xl:block font-bold text-lg tracking-tight text-foreground">Studio</span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1 px-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={item.label}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="hidden xl:block text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center xl:items-stretch gap-1 px-2 py-4 border-t border-border">
          <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all" title="Thème">
            {theme === "light" ? <Moon className="h-5 w-5 shrink-0" /> : <Sun className="h-5 w-5 shrink-0" />}
            <span className="hidden xl:block text-sm font-semibold">
              {theme === "light" ? "Mode sombre" : "Mode clair"}
            </span>
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${chatOpen ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} title="Assistant IA">
            <Sparkles className="h-5 w-5 shrink-0" />
            <span className="hidden xl:block text-sm font-semibold">Assistant IA</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full focus:outline-none">
                <Avatar className="h-7 w-7 shrink-0 border border-border">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name || "Utilisateur"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-48 glass-card border-border p-2 rounded-xl ml-2">
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="text-sm font-semibold text-foreground">{user.name || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg p-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ══ MAIN CONTENT (desktop) / Full width (mobile) ═════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── MOBILE TOP HEADER ────────────────────────────────────────────────── */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border glass z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            {/* Current page label */}
            <span className="font-bold text-base text-foreground">
              {menuItems.find((m) => m.path === location.pathname)?.label ?? "Studio"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors" aria-label="Thème">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`p-2 rounded-xl transition-colors ${chatOpen ? "text-primary" : "text-muted-foreground hover:bg-muted"}`} aria-label="Assistant IA">
              <Sparkles className="h-5 w-5" />
            </button>
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT ─────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Safe area: bottom padding = bottom bar (64px) + extra breathing room */}
          <div className="px-4 pt-5 pb-28 md:px-8 md:py-8 md:pb-8 max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV BAR ─────────────────────────────────────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
          {/* Safe area bottom for notched phones */}
          <div className="flex items-center justify-around px-2 pt-2 pb-safe-bottom" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
            {bottomBarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px] ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold leading-none transition-all duration-200 ${isActive ? "opacity-100" : "opacity-60"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            {/* More button → opens drawer */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-muted-foreground min-w-[56px]"
            >
              <div className="p-1.5 rounded-xl">
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <span className="text-[10px] font-semibold leading-none opacity-60">Plus</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ══ MOBILE SLIDE-OVER DRAWER ═════════════════════════════════════════════ */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          {/* Drawer panel */}
          <div className="relative ml-auto w-[80%] max-w-sm h-full bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-base">Rosita Studio</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* User card */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{user.name || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>

            {/* All Nav Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 pb-2">Navigation</p>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-muted font-semibold"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 1.8} />
                    {item.label}
                    {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="px-4 py-4 border-t border-border space-y-1">
              <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors font-semibold">
                {theme === "light" ? <Moon className="h-5 w-5 shrink-0" /> : <Sun className="h-5 w-5 shrink-0" />}
                {theme === "light" ? "Mode sombre" : "Mode clair"}
              </button>
              <button
                onClick={() => { setSidebarOpen(false); setTimeout(() => setChatOpen(true), 150); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 transition-colors font-semibold"
              >
                <Sparkles className="h-5 w-5 shrink-0" />
                Assistant IA
              </button>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-semibold">
                <LogOut className="h-5 w-5 shrink-0" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ AI CHAT PANEL ═══════════════════════════════════════════════════════ */}
      <AIChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
