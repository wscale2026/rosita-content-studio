import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";
import {
  Users,
  Euro,
  Mail,
  Flame,
  TrendingUp,
  Snowflake,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: kpis, isLoading } = trpc.dashboard.kpis.useQuery();
  const { data: activity } = trpc.dashboard.recentActivity.useQuery();
  const { data: statusBreakdown } = trpc.dashboard.statusBreakdown.useQuery();

  const kpiCards = [
    {
      title: "Nouveaux Prospects",
      value: kpis?.newProspectsThisWeek ?? 0,
      label: "cette semaine",
      icon: Users,
      color: "#6750A4",
      bgColor: "#EADDFF",
      onClick: () => navigate("/prospects"),
    },
    {
      title: "Revenus",
      value: `€${(kpis?.revenueThisMonth ?? 0).toLocaleString("fr-FR")}`,
      label: "ce mois-ci",
      icon: Euro,
      color: "#2E7D32",
      bgColor: "#E8F5E9",
      onClick: () => isAdmin && navigate("/payments"),
    },
    {
      title: "Emails Envoyés",
      value: kpis?.emailsSentThisMonth ?? 0,
      label: `${kpis?.emailsOpenRate ?? 0}% ouverts`,
      icon: Mail,
      color: "#1565C0",
      bgColor: "#E3F2FD",
      onClick: () => navigate("/emails"),
    },
    {
      title: "Leads Chauds",
      value: kpis?.warmLeadsCount ?? 0,
      label: "à contacter",
      icon: Flame,
      color: "#E65100",
      bgColor: "#FFF3E0",
      onClick: () => navigate("/prospects"),
    },
  ];

  const statusCards = [
    {
      label: "Froid",
      count: statusBreakdown?.froid ?? 0,
      icon: Snowflake,
      color: "#49454F",
      bgColor: "#E7E0EC",
      borderColor: "#CAC4D0",
      onClick: () => navigate("/prospects?status=froid"),
    },
    {
      label: "Chaud",
      count: statusBreakdown?.chaud ?? 0,
      icon: Flame,
      color: "#6750A4",
      bgColor: "#EADDFF",
      borderColor: "#6750A4",
      onClick: () => navigate("/prospects?status=chaud"),
    },
    {
      label: "Cliente",
      count: statusBreakdown?.cliente ?? 0,
      icon: Crown,
      color: "#2E7D32",
      bgColor: "#E8F5E9",
      borderColor: "#2E7D32",
      onClick: () => navigate("/prospects?status=cliente"),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "froid":
        return "bg-[#E7E0EC] text-[#49454F]";
      case "chaud":
        return "bg-[#EADDFF] text-[#6750A4]";
      case "cliente":
        return "bg-[#E8F5E9] text-[#2E7D32]";
      default:
        return "bg-[#E7E0EC] text-[#49454F]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6750A4] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-[#49454F] mt-1">
            Vue d'ensemble de ton activité
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#49454F]">
          <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
          <span>Tout va bien !</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <button
            key={kpi.title}
            onClick={kpi.onClick}
            className="group text-left p-5 rounded-xl bg-[#E7E0EC]/40 border border-transparent hover:border-[#6750A4]/30 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: kpi.bgColor }}
              >
                <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#49454F] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
              {kpi.title}
            </p>
            <p className="text-3xl font-medium text-[#1C1B1F] mt-1 tracking-tight">
              {kpi.value}
            </p>
            <p className="text-xs text-[#49454F] mt-1">{kpi.label}</p>
          </button>
        ))}
      </div>

      {/* Status Funnel + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Funnel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium text-[#1C1B1F]">Tunnel de conversion</h2>
          <div className="grid grid-cols-3 gap-4">
            {statusCards.map((status) => (
              <button
                key={status.label}
                onClick={status.onClick}
                className="group p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: status.bgColor,
                  borderColor: status.borderColor,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <status.icon className="h-5 w-5" style={{ color: status.color }} />
                  <span
                    className="text-2xl font-medium"
                    style={{ color: status.color }}
                  >
                    {status.count}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: status.color }}>
                  {status.label}
                </p>
                <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: status.color,
                      width: `${Math.min((status.count / 20) * 100, 100)}%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Mini chart - Conversion rates */}
          <div className="p-5 rounded-xl bg-white border border-[#E7E0EC]">
            <h3 className="text-sm font-medium text-[#1C1B1F] mb-4">
              Taux de conversion
            </h3>
            <div className="flex items-end gap-8 h-32 px-4">
              {[
                {
                  label: "Froid → Chaud",
                  rate: statusBreakdown
                    ? Math.round(
                        (statusBreakdown.chaud /
                          (statusBreakdown.froid + statusBreakdown.chaud)) *
                          100
                      )
                    : 0,
                  color: "#6750A4",
                },
                {
                  label: "Chaud → Cliente",
                  rate: statusBreakdown
                    ? Math.round(
                        (statusBreakdown.cliente /
                          (statusBreakdown.chaud + statusBreakdown.cliente)) *
                          100
                      )
                    : 0,
                  color: "#2E7D32",
                },
                {
                  label: "Global",
                  rate: statusBreakdown
                    ? Math.round(
                        (statusBreakdown.cliente /
                          (statusBreakdown.froid +
                            statusBreakdown.chaud +
                            statusBreakdown.cliente)) *
                          100
                      )
                    : 0,
                  color: "#1565C0",
                },
              ].map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-lg font-medium" style={{ color: item.color }}>
                    {item.rate}%
                  </span>
                  <div className="w-full bg-[#E7E0EC] rounded-full overflow-hidden" style={{ height: `${Math.max(item.rate * 1.2, 20)}px` }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: item.color,
                        width: "100%",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#49454F] text-center leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#1C1B1F]">Activité récente</h2>
          <div className="bg-white rounded-xl border border-[#E7E0EC] overflow-hidden">
            <div className="divide-y divide-[#E7E0EC]">
              {activity?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 hover:bg-[#FEF7FF] transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === "prospect"
                        ? "bg-[#EADDFF]"
                        : "bg-[#E8F5E9]"
                    }`}
                  >
                    {item.type === "prospect" ? (
                      <Users className="h-4 w-4 text-[#6750A4]" />
                    ) : (
                      <Euro className="h-4 w-4 text-[#2E7D32]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1B1F] truncate">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#49454F]">
                        {new Date(item.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {item.value && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusBadge(
                            item.value
                          )}`}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!activity || activity.length === 0) && (
                <div className="p-6 text-center text-sm text-[#49454F]">
                  Aucune activité récente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
