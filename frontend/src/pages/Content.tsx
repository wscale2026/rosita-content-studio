import { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, File, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/auth";


export default function Content() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/`, { headers: getAuthHeaders() });
      if (res.ok) {
        setDocuments(await res.json());
      }
    } catch (error) {
      console.error("Erreur chargement documents", error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", file.name.replace(/\.pdf$/i, ""));
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/content/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          // Don't set Content-Type here, browser sets it automatically with boundary for FormData
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Document ajouté !", { description: file.name, icon: <CheckCircle2 className="h-4 w-4" /> });
        loadDocuments();
      } else {
        toast.error("Erreur lors de l'ajout du document");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setDocuments(documents.filter((d) => d.id !== id));
        toast.success("Document supprimé.");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDownload = async (id: number, title: string) => {
    try {
      // First hit the download endpoint to increment the counter and get the file
      const res = await fetch(`${API_BASE_URL}/content/${id}/download/`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        loadDocuments(); // Refresh downloads count
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleToggleLeadMagnet = async (id: number, currentValue: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/content/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ is_lead_magnet: !currentValue })
      });
      if (res.ok) {
        toast.success(currentValue ? "Retiré des lead magnets" : "Ajouté aux lead magnets");
        loadDocuments();
      } else {
        toast.error("Erreur lors de la modification");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Contenu & Ressources</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Gérez vos lead magnets et guides offerts.</p>
      </div>

      {/* Upload zone */}
      <div
        className={`glass-card rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-8 md:p-12 transition-all duration-300 ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/20"}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-foreground">Ajouter un document</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 mb-5">
          <span className="hidden sm:inline">Glissez un fichier PDF ici, ou </span>cliquez pour parcourir.
        </p>
        <label className={`cursor-pointer px-5 py-2.5 rounded-xl text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-md ${isUploading ? 'bg-muted text-muted-foreground' : 'bg-primary'}`}>
          {isUploading ? 'Chargement...' : 'Choisir un fichier'}
          <input type="file" className="hidden" accept=".pdf" disabled={isUploading} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
        </label>
      </div>

      {/* Document Grid — 1 col mobile, 2 col tablet, list on md+ */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Vos ressources ({documents.length})</h2>

        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {documents.map((doc, i) => (
            <div key={doc.id} className="glass-card rounded-2xl p-4 flex flex-col gap-2" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <File className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-foreground leading-tight line-clamp-2">{doc.title}</p>
              <p className="text-[10px] text-muted-foreground">{doc.size}</p>
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                  <Download className="h-3 w-3" /> {doc.downloads}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleToggleLeadMagnet(doc.id, doc.is_lead_magnet)} className={`p-1.5 rounded-lg transition-colors ${doc.is_lead_magnet ? 'text-amber-500 hover:bg-amber-500/10' : 'text-muted-foreground hover:bg-muted'}`} title="Définir comme Lead Magnet (gratuit)">
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDownload(doc.id, doc.title)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block glass-card rounded-2xl overflow-hidden border border-border shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Taille</th>
                  <th className="px-6 py-4">Ajouté le</th>
                  <th className="px-6 py-4">Téléch.</th>
                  <th className="px-6 py-4 text-center">Lead Magnet</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc, i) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors" style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><File className="h-4 w-4" /></div>
                        <p className="font-semibold text-foreground truncate max-w-[220px]">{doc.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{doc.size}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500"><Download className="h-3 w-3" /> {doc.downloads}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleToggleLeadMagnet(doc.id, doc.is_lead_magnet)} className={`p-2 rounded-xl transition-colors ${doc.is_lead_magnet ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500'}`} title="Définir comme document gratuit">
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDownload(doc.id, doc.title)} className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"><Download className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground"><FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />Aucun document.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {documents.length === 0 && (
          <div className="md:hidden py-12 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
