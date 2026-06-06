import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
  Presentation,
  Image,
} from "lucide-react";

export default function Content() {
  const { data: resources, refetch } = trpc.resource.list.useQuery();
  const trackDownload = trpc.resource.trackDownload.useMutation({
    onSuccess: () => refetch(),
  });
  const [toast, setToast] = useState<string | null>(null);

  const getIcon = (filename: string) => {
    if (filename.includes("checklist")) return FileSpreadsheet;
    if (filename.includes("template")) return Image;
    if (filename.includes("guide")) return Presentation;
    return FileText;
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-[#1C1B1F] tracking-tight">
            Contenu & Ressources
          </h1>
          <p className="text-sm text-[#49454F] mt-1">
            Gérer les lead magnets et documents
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources?.map((resource) => {
          const Icon = getIcon(resource.filename);
          return (
            <div
              key={resource.id}
              className="group p-5 rounded-xl bg-white border border-[#E7E0EC] hover:border-[#6750A4]/30 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#EADDFF]">
                  <Icon className="h-6 w-6 text-[#6750A4]" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      trackDownload.mutate({ id: resource.id });
                      showToast("Téléchargement en cours...");
                    }}
                    className="p-2 rounded-lg hover:bg-[#EADDFF] transition-colors"
                    title="Télécharger"
                  >
                    <Download className="h-4 w-4 text-[#6750A4]" />
                  </button>
                  <button
                    onClick={() => showToast("Fonctionnalité à venir")}
                    className="p-2 rounded-lg hover:bg-[#E7E0EC] transition-colors"
                    title="Remplacer"
                  >
                    <Upload className="h-4 w-4 text-[#49454F]" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-medium text-[#1C1B1F] mb-1">
                {resource.originalName || resource.filename}
              </h3>
              <p className="text-sm text-[#49454F] mb-3">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#49454F]">
                <span>{formatFileSize(resource.size)}</span>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{resource.downloadCount ?? 0} téléchargements</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E7E0EC] text-[11px] text-[#49454F]">
                Mis à jour le{" "}
                {new Date(resource.updatedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {(!resources || resources.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E7E0EC] flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-[#49454F]" />
          </div>
          <h3 className="text-lg font-medium text-[#1C1B1F] mb-1">
            Aucune ressource
          </h3>
          <p className="text-sm text-[#49454F]">
            Ajoute des lead magnets pour commencer
          </p>
        </div>
      )}

      {/* Toast / Snackbar */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1C1B1F] text-white text-sm shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
