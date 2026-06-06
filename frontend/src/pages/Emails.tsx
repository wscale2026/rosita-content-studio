import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  Mail,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Send,
  Bot,
  PenTool,
} from "lucide-react";

export default function Emails() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"all" | "automated" | "manual">("all");

  const { data, isLoading } = trpc.email.list.useQuery({
    page,
    limit: 10,
    type: type === "all" ? undefined : type,
  });
  const { data: stats } = trpc.email.stats.useQuery();

  const getOpenRateColor = (opened: boolean, openCount: number) => {
    if (!opened) return "text-[#49454F] bg-[#E7E0EC]";
    if (openCount >= 3) return "text-[#2E7D32] bg-[#E8F5E9]";
    if (openCount >= 1) return "text-[#6750A4] bg-[#EADDFF]";
    return "text-[#49454F] bg-[#E7E0EC]";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
          Emails
        </h1>
        <p className="text-sm text-[#49454F] mt-1">
          Historique des emails envoyés
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#EADDFF] border border-[#6750A4]/20">
          <div className="flex items-center justify-between mb-2">
            <Send className="h-5 w-5 text-[#6750A4]" />
            <span className="text-[11px] font-medium text-[#6750A4] uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-3xl font-medium text-[#6750A4] tracking-tight">
            {stats?.totalSent ?? 0}
          </p>
          <p className="text-xs text-[#6750A4]/70 mt-1">Emails envoyés</p>
        </div>

        <div className="p-5 rounded-xl bg-[#E8F5E9] border border-[#2E7D32]/20">
          <div className="flex items-center justify-between mb-2">
            <MailOpen className="h-5 w-5 text-[#2E7D32]" />
            <span className="text-[11px] font-medium text-[#2E7D32] uppercase tracking-wider">
              Ouverts
            </span>
          </div>
          <p className="text-3xl font-medium text-[#2E7D32] tracking-tight">
            {stats?.totalOpened ?? 0}
          </p>
          <p className="text-xs text-[#2E7D32]/70 mt-1">Emails ouverts</p>
        </div>

        <div className="p-5 rounded-xl bg-[#E3F2FD] border border-[#1565C0]/20">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="h-5 w-5 text-[#1565C0]" />
            <span className="text-[11px] font-medium text-[#1565C0] uppercase tracking-wider">
              Taux
            </span>
          </div>
          <p className="text-3xl font-medium text-[#1565C0] tracking-tight">
            {stats?.averageOpenRate ?? 0}%
          </p>
          <p className="text-xs text-[#1565C0]/70 mt-1">Taux d'ouverture</p>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {(["all", "automated", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              type === t
                ? "bg-[#6750A4] text-white shadow-sm"
                : "bg-white text-[#49454F] border border-[#E7E0EC] hover:border-[#6750A4]/30"
            }`}
          >
            {t === "automated" ? <Bot className="h-4 w-4" /> : t === "manual" ? <PenTool className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            {t === "all" ? "Tous" : t === "automated" ? "Automatisés" : "Manuels"}
          </button>
        ))}
      </div>

      {/* Email Cards */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-[#E7E0EC]">
              <div className="h-4 bg-[#E7E0EC] rounded animate-pulse w-3/4" />
            </div>
          ))
        ) : (
          data?.items.map((email) => (
            <div
              key={email.id}
              className="p-5 rounded-xl bg-white border border-[#E7E0EC] hover:border-[#6750A4]/20 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#1C1B1F]">
                      {email.prospectName || "—"}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        email.type === "automated"
                          ? "bg-[#E3F2FD] text-[#1565C0]"
                          : "bg-[#EADDFF] text-[#6750A4]"
                      }`}
                    >
                      {email.type === "automated" ? "Auto" : "Manuel"}
                    </span>
                  </div>
                  <h3 className="text-base text-[#1C1B1F] group-hover:text-[#6750A4] transition-colors">
                    {email.subject}
                  </h3>
                  <p className="text-sm text-[#49454F] mt-1 line-clamp-1">
                    {email.body}
                  </p>
                  <p className="text-[11px] text-[#49454F]/70 mt-2">
                    {new Date(email.sentAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${getOpenRateColor(
                      email.opened,
                      email.openCount ?? 0
                    )}`}
                  >
                    {email.opened ? (
                      <MailOpen className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                    {email.openCount ?? 0} ouverture{email.openCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#49454F]">
            Page {page} sur {data.totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg hover:bg-[#E7E0EC] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
              className="p-1.5 rounded-lg hover:bg-[#E7E0EC] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
