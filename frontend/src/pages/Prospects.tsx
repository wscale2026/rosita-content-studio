import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  Users,
  Search,
  Snowflake,
  Flame,
  Crown,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  Mail,
  Phone,
  Calendar,
  Download,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type StatusFilter = "all" | "froid" | "chaud" | "cliente";

export default function Prospects() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") as StatusFilter | null;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>(initialStatus || "all");
  const [page, setPage] = useState(1);
  const [selectedProspect, setSelectedProspect] = useState<number | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const { isEditor } = useAuth();

  const { data, isLoading, refetch } = trpc.prospect.list.useQuery({
    status: status === "all" ? undefined : status,
    search: search || undefined,
    page,
    limit: 10,
  });

  const { data: prospectDetail } = trpc.prospect.getById.useQuery(
    { id: selectedProspect! },
    { enabled: !!selectedProspect }
  );

  const updateStatus = trpc.prospect.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const sendEmail = trpc.prospect.sendEmail.useMutation({
    onSuccess: () => {
      setEmailModalOpen(false);
      setEmailSubject("");
      setEmailBody("");
      refetch();
    },
  });

  const statusConfig = {
    froid: { label: "Froid", icon: Snowflake, color: "#49454F", bgColor: "#E7E0EC" },
    chaud: { label: "Chaud", icon: Flame, color: "#6750A4", bgColor: "#EADDFF" },
    cliente: { label: "Cliente", icon: Crown, color: "#2E7D32", bgColor: "#E8F5E9" },
  };

  const getStatusBadge = (s: string) => {
    const config = statusConfig[s as keyof typeof statusConfig];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
        style={{ backgroundColor: config.bgColor, color: config.color }}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
            Prospects
          </h1>
          <p className="text-sm text-[#49454F] mt-1">
            {data?.total ?? 0} prospects au total
          </p>
        </div>
        {isEditor && (
          <button
            onClick={() => {
              setSelectedProspect(null);
              setEmailModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] text-white text-sm font-medium hover:bg-[#4F378B] transition-colors shadow-md"
          >
            <Send className="h-4 w-4" />
            Envoyer un email
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#49454F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E7E0EC] text-sm text-[#1C1B1F] placeholder:text-[#49454F]/60 focus:outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/20 transition-all"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-[#49454F]" />
            </button>
          )}
        </div>

        {/* Status Chips */}
        <div className="flex gap-2">
          {(["all", "froid", "chaud", "cliente"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === s
                  ? "bg-[#6750A4] text-white shadow-sm"
                  : "bg-white text-[#49454F] border border-[#E7E0EC] hover:border-[#6750A4]/30"
              }`}
            >
              {s === "all" ? "Tous" : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E7E0EC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E0EC] bg-[#FEF7FF]">
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Nom
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-medium text-[#49454F] uppercase tracking-wider">
                  Actions
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
                data?.items.map((prospect) => (
                  <tr
                    key={prospect.id}
                    className="hover:bg-[rgba(103,80,164,0.02)] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EADDFF] flex items-center justify-center text-[#6750A4] text-xs font-medium">
                          {prospect.firstName[0]}{prospect.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1C1B1F]">
                            {prospect.firstName} {prospect.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-[#1C1B1F]">
                          <Mail className="h-3.5 w-3.5 text-[#49454F]" />
                          {prospect.email}
                        </div>
                        {prospect.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-[#49454F]">
                            <Phone className="h-3.5 w-3.5" />
                            {prospect.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          const statuses: StatusFilter[] = ["froid", "chaud", "cliente"];
                          const currentIdx = statuses.indexOf(prospect.status as StatusFilter);
                          const nextStatus = statuses[(currentIdx + 1) % 3];
                          updateStatus.mutate({ id: prospect.id, status: nextStatus });
                        }}
                        disabled={!isEditor}
                        className={`transition-opacity ${!isEditor ? "cursor-default" : "hover:opacity-80"}`}
                      >
                        {getStatusBadge(prospect.status)}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#49454F]">{prospect.source || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[#49454F]">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(prospect.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditor && (
                          <button
                            onClick={() => {
                              setSelectedProspect(prospect.id);
                              setEmailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#EADDFF] transition-colors"
                            title="Envoyer un email"
                          >
                            <Send className="h-4 w-4 text-[#6750A4]" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedProspect(prospect.id)}
                          className="p-1.5 rounded-lg hover:bg-[#E7E0EC] transition-colors"
                          title="Voir les détails"
                        >
                          <Users className="h-4 w-4 text-[#49454F]" />
                        </button>
                      </div>
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

      {/* Prospect Detail Drawer */}
      {selectedProspect && prospectDetail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedProspect(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-[#1C1B1F]">Détails du prospect</h2>
                <button
                  onClick={() => setSelectedProspect(null)}
                  className="p-2 rounded-lg hover:bg-[#E7E0EC] transition-colors"
                >
                  <X className="h-5 w-5 text-[#49454F]" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#EADDFF] flex items-center justify-center text-[#6750A4] text-lg font-medium">
                    {prospectDetail.firstName[0]}{prospectDetail.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1C1B1F]">
                      {prospectDetail.firstName} {prospectDetail.lastName}
                    </h3>
                    {getStatusBadge(prospectDetail.status)}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 rounded-xl bg-[#FEF7FF] border border-[#E7E0EC] space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#1C1B1F]">
                    <Mail className="h-4 w-4 text-[#6750A4]" />
                    {prospectDetail.email}
                  </div>
                  {prospectDetail.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#1C1B1F]">
                      <Phone className="h-4 w-4 text-[#6750A4]" />
                      {prospectDetail.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[#49454F]">
                    <Calendar className="h-4 w-4 text-[#6750A4]" />
                    Inscrit le {new Date(prospectDetail.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  {prospectDetail.source && (
                    <div className="text-sm text-[#49454F]">
                      Source : {prospectDetail.source}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#EADDFF] text-center">
                    <p className="text-lg font-medium text-[#6750A4]">{prospectDetail.guidesDownloaded}</p>
                    <p className="text-[10px] text-[#6750A4]/70">Guides</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#E3F2FD] text-center">
                    <p className="text-lg font-medium text-[#1565C0]">{prospectDetail.emailsOpened}</p>
                    <p className="text-[10px] text-[#1565C0]/70">Emails ouverts</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#E8F5E9] text-center">
                    <p className="text-lg font-medium text-[#2E7D32]">{prospectDetail.payments?.length ?? 0}</p>
                    <p className="text-[10px] text-[#2E7D32]/70">Paiements</p>
                  </div>
                </div>

                {/* Payments */}
                {prospectDetail.payments && prospectDetail.payments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-[#1C1B1F] mb-2">Paiements</h4>
                    <div className="space-y-2">
                      {prospectDetail.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-[#E8F5E9]"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#1C1B1F]">{payment.productName}</p>
                            <p className="text-xs text-[#49454F]">{payment.geniusPayId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#2E7D32]">€{payment.amount}</p>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                payment.status === "confirmed"
                                  ? "bg-[#2E7D32] text-white"
                                  : "bg-[#FFF3E0] text-[#E65100]"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {prospectDetail.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-[#1C1B1F] mb-2">Notes</h4>
                    <p className="text-sm text-[#49454F] p-3 rounded-lg bg-[#FEF7FF] border border-[#E7E0EC]">
                      {prospectDetail.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {isEditor && (
                  <button
                    onClick={() => setEmailModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6750A4] text-white text-sm font-medium hover:bg-[#4F378B] transition-colors shadow-md"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer un email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setEmailModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 m-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium text-[#1C1B1F]">
                {selectedProspect
                  ? `Envoyer un email à ${prospectDetail?.firstName ?? ""}`
                  : "Envoyer un email"}
              </h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#E7E0EC] transition-colors"
              >
                <X className="h-5 w-5 text-[#49454F]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1C1B1F] mb-1.5 block">
                  Objet
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Sujet de l'email"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FEF7FF] border border-[#E7E0EC] text-sm text-[#1C1B1F] placeholder:text-[#49454F]/60 focus:outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1C1B1F] mb-1.5 block">
                  Message
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Contenu de l'email..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FEF7FF] border border-[#E7E0EC] text-sm text-[#1C1B1F] placeholder:text-[#49454F]/60 focus:outline-none focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]/20 transition-all resize-none"
                />
              </div>
              <button
                onClick={() => {
                  if (selectedProspect) {
                    sendEmail.mutate({
                      prospectId: selectedProspect,
                      subject: emailSubject,
                      body: emailBody,
                    });
                  }
                }}
                disabled={!emailSubject.trim() || !emailBody.trim() || sendEmail.isPending || !selectedProspect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6750A4] text-white text-sm font-medium hover:bg-[#4F378B] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendEmail.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
