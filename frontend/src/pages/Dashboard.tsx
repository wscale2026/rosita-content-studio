import { useNavigate } from "react-router";
import {
  Users,
  Banknote,
  Mail,
  Flame,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAuthHeaders, logoutUser } from "@/lib/auth";
import { mockData } from "@/lib/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "@/lib/auth";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { headers: getAuthHeaders() }).then(res => {
  if (!res.ok) {
    if (res.status === 401) {
      logoutUser();
      window.location.href = "/backoffice/login";
    }
    throw new Error("Network response was not ok");
  }
  return res.json();
});


export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats = {
    totalRevenue: 0,
    totalProspects: 0,
    conversionRate: 0,
    activeClients: 0,
    sourceDistribution: [],
    leadsEvolution: [],
    recentActivity: []
  } } = useSWR(`${API_BASE_URL}/dashboard/stats/`, fetcher);

  const { dashboard } = mockData;

  const kpiCards = [
    {
      title: "Nouveaux Prospects",
      value: stats.totalProspects,
      label: "Total enregistré",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      onClick: () => navigate("/prospects"),
    },
    {
      title: "Revenus",
      value: `${(stats.totalRevenue || 0).toLocaleString("fr-FR")} CFA`,
      label: "+5% par rapport au mois dernier",
      icon: Banknote,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      onClick: () => navigate("/payments"),
    },
    {
      title: "Taux de conversion",
      value: `${stats.conversionRate}%`,
      label: "Basé sur les paiements",
      icon: Mail,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      onClick: () => navigate("/payments"),
    },
    {
      title: "Clients Actifs",
      value: stats.activeClients,
      label: "Prêts pour l'appel",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      onClick: () => navigate("/prospects"),
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            Tableau de bord
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Voici l'état de votre business.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20 shrink-0">
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Croissance stable</span>
          <span className="sm:hidden">+5%</span>
        </div>
      </div>

      {/* KPI Grid — 2 col on mobile, 4 col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {kpiCards.map((kpi, index) => (
          <button
            key={kpi.title}
            onClick={kpi.onClick}
            className="group relative flex flex-col text-left p-4 md:p-6 rounded-2xl glass-card transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 overflow-hidden"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-xl ${kpi.bgColor} mb-3`}>
              <kpi.icon className={`h-4 w-4 md:h-6 md:w-6 ${kpi.color}`} />
            </div>
            <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              {kpi.title}
            </p>
            <p className="text-xl md:text-3xl font-bold text-foreground mt-1 tracking-tight">
              {kpi.value}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium leading-tight hidden sm:block">{kpi.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Evolution Graph */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base md:text-lg font-bold text-foreground">Évolution des leads</h2>
              <p className="text-xs text-muted-foreground">30 derniers jours</p>
            </div>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="h-[200px] md:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.leadsEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold text-foreground">Activité récente</h2>
          </div>
          <div className="space-y-2">
            {(stats.recentActivity || []).map((item: any, idx: number) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 active:bg-muted transition-colors"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    item.type === "sale"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : item.type === "email"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-orange-500/10 text-orange-500"
                  }`}
                >
                  {item.type === "sale" ? (
                    <Banknote className="h-4 w-4" />
                  ) : item.type === "email" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.time}</p>
                </div>
                {item.amount && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    +{(item.amount || 0).toLocaleString("fr-FR")} CFA
                  </span>
                )}
              </div>
            ))}
            {(!stats.recentActivity || stats.recentActivity.length === 0) && (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune activité récente.</p>
            )}
          </div>
        </div>

        {/* Source Distribution Bar Chart */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 md:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold text-foreground">Répartition par Source</h2>
          </div>
          <div className="h-[200px] md:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sourceDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 600 }} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
