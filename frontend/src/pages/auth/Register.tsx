import { useState } from "react";
import { Link } from "react-router";
import { registerUser } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthContainer } from "./AuthContainer";

const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      setIsSuccess(true);
      toast.success("Compte créé avec succès !");
    } catch (error: any) {
      toast.error("Erreur lors de l'inscription", { description: error.message || "Veuillez réessayer plus tard." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthContainer title="Bienvenue !" subtitle="Votre compte a été créé avec succès.">
        <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-center text-muted-foreground mb-8 text-sm leading-relaxed">
            Vous pouvez maintenant vous connecter à votre espace premium avec vos identifiants fraîchement créés.
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
      title="Créer un compte" 
      subtitle="Rejoignez Rosyta Content Studio dès aujourd'hui."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground ml-1 block">Prénom</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("firstName")}
                type="text"
                placeholder="Jean"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border ${errors.firstName ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
              />
            </div>
            {errors.firstName && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground ml-1 block">Nom</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register("lastName")}
                type="text"
                placeholder="Dupont"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border ${errors.lastName ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
              />
            </div>
            {errors.lastName && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground ml-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("email")}
              type="email"
              placeholder="votre@email.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
            />
          </div>
          {errors.email && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground ml-1 block">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border ${errors.password ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground ml-1 block">Confirmer</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border ${errors.confirmPassword ? 'border-destructive' : 'border-border'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Créer mon compte
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link to="/backoffice/login" className="text-primary font-bold hover:underline">Se connecter</Link>
      </div>
    </AuthContainer>
  );
}
