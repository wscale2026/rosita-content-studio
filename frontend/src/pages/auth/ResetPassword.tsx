import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPasswordConfirm } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AuthContainer } from "./AuthContainer";

const resetSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uid || !token) {
      toast.error("Lien invalide ou expiré");
      navigate("/backoffice/login");
    }
  }, [uid, token, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!uid || !token) return;
    
    setIsLoading(true);
    try {
      await resetPasswordConfirm(uid, token, data.password);
      setIsSuccess(true);
      toast.success("Mot de passe modifié avec succès !");
    } catch (error: any) {
      toast.error("Erreur", { description: error.message || "Le lien est invalide ou a expiré." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthContainer title="Félicitations !" subtitle="Votre mot de passe a été mis à jour.">
        <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-center text-muted-foreground mb-8 text-sm leading-relaxed">
            Vous pouvez maintenant vous connecter à votre espace premium avec votre nouveau mot de passe.
          </p>
          <Link to="/backoffice/login" className="w-full flex justify-center py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
            Aller à la connexion
          </Link>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer 
      title="Nouveau mot de passe" 
      subtitle="Veuillez choisir un nouveau mot de passe sécurisé."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground ml-1 block">Nouveau mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border ${errors.password ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
            />
          </div>
          {errors.password && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground ml-1 block">Confirmer le mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border ${errors.confirmPassword ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
            />
          </div>
          {errors.confirmPassword && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Mettre à jour le mot de passe
        </button>
      </form>
    </AuthContainer>
  );
}
