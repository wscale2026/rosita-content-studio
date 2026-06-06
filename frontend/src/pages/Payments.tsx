import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function Payments() {
  const [page, setPage] = useState(1);
  const { data: summary } = trpc.payment.summary.useQuery();
  const { data, isLoading } = trpc.payment.list.useQuery({ page, limit: 10 });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
          Paiements
        </h1>
        <p className="text-sm text-[#49454F] mt-1">
          Suivi des transactions GeniusPay
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#E8F5E9] border border-[#2E7D32]/20">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-[#2E7D32]" />
            <span className="text-[11px] font-medium text-[#2E7D32] uppercase tracking-wider">
              Ce mois
            </span>
          </div>
          <p className="text-3xl font-medium text-[#2E7D32] tracking-tight">
            €{(summary?.monthlyRevenue ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#2E7D32]/70 mt-1">Revenus confirmés</p>
        </div>

        <div className="p-5 rounded-xl bg-[#EADDFF] border border-[#6750A4]/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-[#6750A4]" />
            <span className="text-[11px] font-medium text-[#6750A4] uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-3xl font-medium text-[#6750A4] tracking-tight">
            €{(summary?.totalRevenue ?? 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[#6750A4]/70 mt-1">
            {summary?.confirmedCount ?? 0} paiements confirmés
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#FFF3E0] border border-[#E65100]/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-[#E65100]" />
            <span className="text-[11px] font-medium text-[#E65100] uppercase tracking-wider">
              En attente
            </span>
          </div>
          <p className="text-3xl font-medium text-[#E65100] tracking-tight">
            {summary?.pendingCount ?? 0}
          </p>
          <p className="text-xs text-[#E65100]/70 mt-1">Paiements en attente</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E7E0EC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E0EC] bg-[#FEF7FF]">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  ID Transaction
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Produit
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Montant
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0EC]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 bg-[#E7E0EC] rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                data?.items.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-[rgba(103,80,164,0.02)] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[#49454F]" />
                        <span className="text-sm font-mono text-[#49454F]">
                          {payment.geniusPayId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#1C1B1F]">
                      {payment.prospectName || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#1C1B1F]">
                      {payment.productName || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#1C1B1F]">
                        €{Number(payment.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {payment.status === "confirmed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E8F5E9] text-[#2E7D32]">
                          <CheckCircle2 className="h-3 w-3" />
                          Confirmé
                        </span>
                      ) : payment.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFF3E0] text-[#E65100]">
                          <Clock className="h-3 w-3" />
                          En attente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFEBEE] text-[#BA1A1A]">
                          <AlertCircle className="h-3 w-3" />
                          Remboursé
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#49454F]">
                      {new Date(payment.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E7E0EC]">
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
    </div>
  );
}
