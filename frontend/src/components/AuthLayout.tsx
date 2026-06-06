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
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AIChat } from "./AIChat";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/", roles: ["admin", "editor", "viewer"] },
  { icon: Users, label: "Prospects", path: "/prospects", roles: ["admin", "editor", "viewer"] },
  { icon: CreditCard, label: "Paiements", path: "/payments", roles: ["admin", "viewer"] },
  { icon: Mail, label: "Emails", path: "/emails", roles: ["admin", "editor", "viewer"] },
  { icon: FileText, label: "Contenu", path: "/content", roles: ["admin"] },
  { icon: Settings, label: "Paramètres", path: "/settings", roles: ["admin", "editor", "viewer"] },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout, isAdmin, isEditor, isViewer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const menuItems = allMenuItems.filter((item) => {
    if (isAdmin) return true;
    if (isEditor) return item.roles.includes("editor");
    if (isViewer) return item.roles.includes("viewer");
    return false;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEF7FF]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6750A4] border-t-transparent" />
          <p className="text-sm text-[#49454F]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEF7FF]">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-medium tracking-tight text-[#1C1B1F] text-center">
              Rosita Content Studio
            </h1>
            <p className="text-sm text-[#49454F] text-center max-w-sm">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = "/api/oauth/authorize";
            }}
            className="w-full py-3 px-6 rounded-xl bg-[#6750A4] text-white font-medium text-sm hover:bg-[#4F378B] transition-colors shadow-md"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FEF7FF]">
      {/* Navigation Rail */}
      <nav className="flex flex-col items-center w-20 min-w-[80px] h-full bg-[#E7E0EC] border-r border-[#E7E0EC]/50 py-3 z-50">
        {/* App Logo */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#6750A4] mb-6">
          <span className="text-white font-semibold text-lg">R</span>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-1 flex-1 w-full px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full py-3 px-1 rounded-3xl transition-all duration-200 group ${
                  isActive
                    ? "bg-[rgba(103,80,164,0.08)]"
                    : "hover:bg-[rgba(103,80,164,0.04)]"
                }`}
                title={item.label}
              >
                <item.icon
                  className={`h-6 w-6 transition-colors ${
                    isActive ? "text-[#6750A4]" : "text-[#49454F] group-hover:text-[#1C1B1F]"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span
                  className={`text-[10px] mt-1 font-medium leading-tight text-center transition-colors ${
                    isActive ? "text-[#6750A4]" : "text-[#49454F]"
                  }`}
                >
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* AI Chat Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`flex items-center justify-center w-12 h-12 rounded-2xl mb-3 transition-all duration-200 ${
            chatOpen
              ? "bg-[#6750A4] text-white shadow-lg"
              : "bg-[rgba(103,80,164,0.08)] text-[#6750A4] hover:bg-[rgba(103,80,164,0.12)]"
          }`}
          title="Assistant IA"
        >
          <Sparkles className="h-5 w-5" />
        </button>

        {/* User Avatar */}
        <div className="mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-10 w-10 border-2 border-[#6750A4]/20 cursor-pointer hover:border-[#6750A4]/50 transition-colors">
                  <AvatarFallback className="bg-[#EADDFF] text-[#6750A4] text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-[#1C1B1F]">{user.name || "Utilisateur"}</p>
                <p className="text-xs text-[#49454F] capitalize">{user.role}</p>
              </div>
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-[#BA1A1A] focus:text-[#BA1A1A] focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 relative">
        {children}
      </main>

      {/* AI Chat Panel */}
      <AIChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
