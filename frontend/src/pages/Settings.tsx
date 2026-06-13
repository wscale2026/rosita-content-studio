import { mockData } from "@/lib/mockData";
import { User, Shield, Users, Save, Key, Clock, MonitorSmartphone, Eye, EyeOff, Camera, X, Send, Edit, Plus, Info, UserPlus, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { loginUser, getAuthHeaders } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/auth";


type Tab = "profile" | "team" | "security";

const tabs: { id: Tab; icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: "profile",  icon: User,   label: "Profil"    },
  { id: "team",     icon: Users,  label: "Équipe"    },
  { id: "security", icon: Shield, label: "Sécurité"  },
];

const profileSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Adresse email invalide"),
  oldPassword: z.string().optional(),
  password: z.string().optional().refine((v) => !v || v.length >= 8, {
    message: "Au moins 8 caractères",
  }),
  confirmPassword: z.string().optional(),
}).refine((d) => !d.password || d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).refine((d) => !d.password || d.oldPassword, {
  message: "L'ancien mot de passe est requis",
  path: ["oldPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground block">{label}</label>
      {children}
      {error && <p className="text-[10px] font-medium text-destructive mt-1">{error}</p>}
    </div>
  );
}

function ProfileTab() {
  const { user, refresh } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nameParts = (user?.name ?? "").split(" ");
  const defaultFirst = nameParts[0] ?? "";
  const defaultLast  = nameParts.slice(1).join(" ") || "";

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: defaultFirst,
      lastName: defaultLast,
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      const parts = (user.name ?? "").split(" ");
      reset({
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email ?? "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          old_password: data.oldPassword || undefined,
          password: data.password || undefined
        })
      });

      if (res.ok) {
        // Only update local if the server accepted it
        const stored = JSON.parse(localStorage.getItem("rosyta_auth_user") ?? "{}");
        stored.name  = `${data.firstName} ${data.lastName}`.trim();
        stored.email = data.email;
        localStorage.setItem("rosyta_auth_user", JSON.stringify(stored));
        refresh();
        toast.success("Profil mis à jour !");
        
        // Clear passwords after successful update
        reset((formValues) => ({
          ...formValues,
          oldPassword: "",
          password: "",
          confirmPassword: "",
        }));
        
        // If password changed, maybe force re-login? We don't have to for now.
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const inputBase = (err?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl bg-background border ${err ? "border-destructive" : "border-border"} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-4 md:p-8 space-y-6 border border-border shadow-md animate-fade-in">
      {/* Avatar header */}
      <div className="flex items-center gap-4 border-b border-border pb-5">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {(user?.name ?? "R").charAt(0).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={() => toast.info("Modification de la photo bientôt disponible")}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{user?.name || "Utilisateur"}</h2>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Prénom" error={errors.firstName?.message}>
          <input {...register("firstName")} type="text" placeholder="Jean" className={inputBase(!!errors.firstName)} />
        </Field>
        <Field label="Nom" error={errors.lastName?.message}>
          <input {...register("lastName")} type="text" placeholder="Dupont" className={inputBase(!!errors.lastName)} />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="votre@email.com" className={inputBase(!!errors.email)} />
      </Field>

      {/* Password section */}
      <div className="border-t border-border pt-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Changer le mot de passe</p>
        
        <div className="mb-4">
          <Field label="Ancien mot de passe" error={errors.oldPassword?.message}>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("oldPassword")}
                type={showOldPwd ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border ${errors.oldPassword ? "border-destructive" : "border-border"} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
              />
              <button type="button" onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showOldPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nouveau mot de passe" error={errors.password?.message}>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border ${errors.password ? "border-destructive" : "border-border"} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirmer le mot de passe" error={errors.confirmPassword?.message}>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border ${errors.confirmPassword ? "border-destructive" : "border-border"} focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Laissez vide si vous ne souhaitez pas changer de mot de passe.</p>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-md transition-opacity"
        >
          <Save className="h-4 w-4" /> Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}

function TeamTab() {
  const { user, isSuperadmin } = useAuth();
  const [members, setMembers] = useState<any[]>([]);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/team/`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        console.log("Team data received:", data);
        // Map to local structure
        setMembers(data.map((m: any) => ({
          id: m.id,
          initials: (m.name || m.email || "X").charAt(0).toUpperCase(),
          name: m.name || m.email,
          firstName: m.firstName || "",
          lastName: m.lastName || "",
          phone: m.phone || "",
          email: m.email,
          role: m.role || "Inconnu",
          color: "bg-primary/20 text-primary",
          status: m.status || "Inconnu",
          joinedAt: m.joinedAt || new Date().toISOString()
        })));
      } else {
        console.error("Failed to fetch team. Status:", res.status);
      }
    } catch (error) {
      console.error("Network or parsing error fetching team:", error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Éditeur",
    password: ""
  });

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for(let i=0; i<12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Mot de passe copié !");
  };

  const openCreateModal = () => {
    setCreateData({ ...createData, password: generateRandomPassword() });
    setIsCreateOpen(true);
  };

  const [viewMember, setViewMember] = useState<any | null>(null);
  const [resetedPassword, setResetedPassword] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<{id: number, email: string, role: string} | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.email || !createData.firstName || !createData.lastName) return;
    
    setIsCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/team/invite/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          email: createData.email, 
          first_name: createData.firstName,
          last_name: createData.lastName,
          phone: createData.phone,
          role: createData.role,
          password: createData.password
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Membre créé avec succès`);
        setIsCreateOpen(false);
        setCreateData({ firstName: "", lastName: "", email: "", phone: "", role: "Éditeur", password: "" });
        fetchTeam();
      } else {
        toast.error(data.error || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    
    setIsUpdatingRole(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/team/${editingMember.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ role: editingMember.role })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Rôle mis à jour");
        setEditingMember(null);
        fetchTeam();
      } else {
        toast.error(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/team/${memberToDelete}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Membre retiré.");
        fetchTeam();
        setMemberToDelete(null);
      } else {
        toast.error(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetPassword = async (memberId: number) => {
    setIsResetting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/team/${memberId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ reset_password: true })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setResetedPassword(data.new_password);
      } else {
        toast.error(data.error || "Erreur de réinitialisation");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-4 md:p-8 space-y-5 border border-border shadow-md animate-fade-in">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base md:text-lg font-bold text-foreground">Accès Équipe</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Gérez les membres de votre espace.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Créer un membre
          </button>
        </div>
        {members.map((member) => (
          <div key={member.email} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center font-bold shrink-0`}>{member.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
            </div>
            
            {member.role === "Propriétaire" ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                  {member.role}
                </span>
                {isSuperadmin && (
                  <button
                    onClick={() => setViewMember(member)}
                    className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
                    title="Voir les détails"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                )}
                {member.email !== user?.email && isSuperadmin && (
                  <button
                    onClick={() => setMemberToDelete(member.id)}
                    className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm"
                    aria-label="Supprimer le membre"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {member.role}
                </span>
                {isSuperadmin && (
                  <>
                    <button
                      onClick={() => setViewMember(member)}
                      className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
                      title="Voir les détails"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setEditingMember({ id: member.id, email: member.email, role: member.role })}
                      className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
                      aria-label="Modifier le rôle"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </>
                )}
                {member.email !== user?.email && isSuperadmin && (
                  <button
                    onClick={() => setMemberToDelete(member.id)}
                    className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shadow-sm"
                    aria-label="Supprimer le membre"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Member Details Modal Overlay */}
      {viewMember && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setViewMember(null); setResetedPassword(null); }} />
          <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-auto sm:max-h-[92vh] bg-card border-0 sm:border border-border rounded-none sm:rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">Détails du membre</h3>
              <button
                onClick={() => { setViewMember(null); setResetedPassword(null); }}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${viewMember.color} flex items-center justify-center text-2xl font-bold`}>
                  {viewMember.initials}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-foreground">{viewMember.firstName} {viewMember.lastName}</h4>
                  <span className="px-2.5 py-1 mt-1 inline-block rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {viewMember.role}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Prénom</label>
                    <p className="text-sm text-foreground font-medium">{viewMember.firstName || "Non renseigné"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Nom</label>
                    <p className="text-sm text-foreground font-medium">{viewMember.lastName || "Non renseigné"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email</label>
                  <p className="text-sm text-foreground font-medium">{viewMember.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Téléphone</label>
                  <p className="text-sm text-foreground font-medium">{viewMember.phone || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Statut</label>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${viewMember.status === 'Actif' ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                    <p className="text-sm text-foreground font-medium">{viewMember.status}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Date d'ajout</label>
                  <p className="text-sm text-foreground font-medium">{new Date(viewMember.joinedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="pt-4 border-t border-border mt-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Sécurité</label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Pour des raisons de sécurité, le mot de passe actuel n'est pas affichable (chiffré de bout en bout). Vous pouvez toutefois le réinitialiser.
                  </p>
                  
                  {resetedPassword ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 mb-2">
                      <p className="text-xs font-bold mb-1">Nouveau mot de passe généré :</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="font-mono text-lg font-bold break-all bg-emerald-500/20 p-2 rounded-lg text-center flex-1">{resetedPassword}</p>
                        <button
                          onClick={() => copyToClipboard(resetedPassword)}
                          className="p-3 rounded-lg bg-emerald-500 text-white hover:opacity-90 transition-opacity shrink-0 flex items-center justify-center shadow-md shadow-emerald-500/20"
                          title="Copier le mot de passe"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleResetPassword(viewMember.id)}
                      disabled={isResetting}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Patientez...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" /> Réinitialiser le mot de passe
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Modal Overlay */}
      {isCreateOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          {/* Dialog */}
          <div className="relative w-full sm:max-w-lg h-[100dvh] sm:h-auto sm:max-h-[92vh] bg-card border-0 sm:border border-border rounded-none sm:rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">Créer un membre</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">Prénom</label>
                  <input
                    type="text"
                    required
                    value={createData.firstName}
                    onChange={(e) => setCreateData({...createData, firstName: e.target.value})}
                    placeholder="Jean"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">Nom</label>
                  <input
                    type="text"
                    required
                    value={createData.lastName}
                    onChange={(e) => setCreateData({...createData, lastName: e.target.value})}
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Adresse email</label>
                <input
                  type="email"
                  required
                  value={createData.email}
                  onChange={(e) => setCreateData({...createData, email: e.target.value})}
                  placeholder="jean.dupont@entreprise.com"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Numéro de téléphone (Optionnel)</label>
                <input
                  type="tel"
                  value={createData.phone}
                  onChange={(e) => setCreateData({...createData, phone: e.target.value})}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Rôle d'accès</label>
                <select
                  value={createData.role}
                  onChange={(e) => setCreateData({...createData, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="Propriétaire">Propriétaire (Accès complet & admin)</option>
                  <option value="Administrateur">Administrateur (Gestion d'équipe)</option>
                  <option value="Éditeur">Éditeur (Gestion du contenu)</option>
                </select>
              </div>
              
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mt-4">
                <label className="text-xs font-bold text-primary block mb-2">Mot de passe généré (Temporaire)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createData.password}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-primary/30 font-mono text-center font-bold text-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    title="Copier le mot de passe"
                    onClick={() => copyToClipboard(createData.password)}
                    className="p-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors shrink-0 flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Générer un autre mot de passe"
                    onClick={() => setCreateData({ ...createData, password: generateRandomPassword() })}
                    className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity shrink-0 shadow-md shadow-primary/20 flex items-center justify-center"
                  >
                    <Key className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-primary/80 mt-2">Ce mot de passe sera envoyé par email au membre lors de la création.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Créer le compte
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Role Modal Overlay */}
      {editingMember && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditingMember(null)} />
          <div className="relative w-full sm:max-w-sm h-[100dvh] sm:h-auto sm:max-h-[92vh] bg-card border-0 sm:border border-border rounded-none sm:rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">Modifier le rôle</h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Nouveau rôle pour {editingMember.email}</label>
                <select
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="Propriétaire">Propriétaire</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Éditeur">Éditeur</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingRole}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdatingRole ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMemberToDelete(null)} />
          <div className="relative w-full sm:max-w-sm h-auto bg-card border-0 sm:border border-border rounded-none sm:rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-200 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-destructive/10">
              <h3 className="text-lg font-bold text-destructive">Supprimer ce membre</h3>
              <button onClick={() => setMemberToDelete(null)} className="p-2 rounded-full hover:bg-destructive/20 transition-colors text-destructive">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-sm text-muted-foreground">
                Êtes-vous sûr de vouloir retirer ce membre de l'équipe ? Il perdra immédiatement l'accès à ce tableau de bord.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMemberToDelete(null)}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteMember}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-destructive/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function SecurityTab() {
  const [autoLogout, setAutoLogout] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/security/`, { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          setAutoLogout(data.auto_logout);
          setTwoFactorAuth(data.two_factor_auth);
          setLogs(data.logs);
        }
      } catch (error) {
        console.error("Network error fetching security settings");
      }
    };
    fetchSecurityData();
  }, []);

  const toggleSetting = async (setting: 'auto_logout' | 'two_factor_auth', currentValue: boolean) => {
    const newValue = !currentValue;
    const body = setting === 'auto_logout' ? { auto_logout: newValue } : { two_factor_auth: newValue };
    
    // Optimistic update
    if (setting === 'auto_logout') setAutoLogout(newValue);
    if (setting === 'two_factor_auth') setTwoFactorAuth(newValue);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/security/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Paramètre mis à jour");
        // Refetch logs to see the new log
        const newRes = await fetch(`${API_BASE_URL}/auth/security/`, { headers: getAuthHeaders() });
        if (newRes.ok) {
          const newData = await newRes.json();
          setLogs(newData.logs);
        }
      } else {
        toast.error(data.error || "Erreur de mise à jour");
        // Revert on error
        if (setting === 'auto_logout') setAutoLogout(currentValue);
        if (setting === 'two_factor_auth') setTwoFactorAuth(currentValue);
      }
    } catch (error) {
      toast.error("Erreur réseau");
      if (setting === 'auto_logout') setAutoLogout(currentValue);
      if (setting === 'two_factor_auth') setTwoFactorAuth(currentValue);
    }
  };

  const securityItems = [
    { 
      id: 'auto_logout' as const, 
      icon: Clock, 
      label: "Déconnexion automatique", 
      desc: "Après 30 min d'inactivité.", 
      enabled: autoLogout, 
      color: "text-orange-500 bg-orange-500/10" 
    },
    { 
      id: 'two_factor_auth' as const, 
      icon: MonitorSmartphone, 
      label: "Double authentification", 
      desc: "Protection supplémentaire.", 
      enabled: twoFactorAuth, 
      color: "text-blue-500 bg-blue-500/10" 
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-card rounded-2xl p-4 md:p-6 border border-border shadow-md space-y-4">
        <h2 className="text-base md:text-lg font-bold text-foreground border-b border-border pb-4">Sécurité du compte</h2>
        {securityItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            {item.enabled ? (
              <div 
                onClick={() => toggleSetting(item.id, item.enabled)}
                className="relative w-11 h-6 rounded-full bg-primary cursor-pointer shrink-0 transition-colors"
              >
                <div className="absolute top-1 right-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform" />
              </div>
            ) : (
              <button 
                onClick={() => toggleSetting(item.id, item.enabled)}
                className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-muted-foreground/20 transition-colors shrink-0"
              >
                Activer
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4 md:p-6 border border-border shadow-md space-y-3">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">Journal des activités</h2>
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente.</p>
          ) : logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground truncate">{log.user} · IP: {log.ip}</p>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState<Tab>("profile");
  const { isAdmin } = useAuth();
  
  const visibleTabs = tabs.filter(t => t.id !== 'team' || isAdmin);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Paramètres</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Profil, équipe et sécurité.</p>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl overflow-x-auto hide-scrollbar">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap flex-1 justify-center transition-all duration-200 ${
              active === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {active === "profile"  && <ProfileTab />}

      {active === "team" && <TeamTab />}

      {active === "security" && <SecurityTab />}
    </div>
  );
}
