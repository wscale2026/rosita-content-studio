import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthContainer } from "./AuthContainer";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  
  const { login, verify2FACode } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await login(data.email, data.password);
      if (res && res.requires_2fa) {
        setUserId(res.user_id);
        setStep("2fa");
        toast.info(res.message || "Code de vérification envoyé.");
      } else {
        toast.success("Connexion réussie !");
        setTimeout(() => navigate("/backoffice", { replace: true }), 200);
      }
    } catch (error) {
      console.error("[Login] error:", error);
      toast.error("Erreur de connexion", { description: "Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !otp) return;
    setIsLoading(true);
    try {
      await verify2FACode(userId, otp);
      toast.success("Connexion réussie !");
      setTimeout(() => navigate("/backoffice", { replace: true }), 200);
    } catch (error: any) {
      toast.error(error.message || "Code invalide");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "2fa") {
    return (
      <AuthContainer 
        title="Double Authentification" 
        subtitle="Un code vous a été envoyé par email."
      >
        <form onSubmit={onVerify2FA} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground ml-1 block text-center">Code à 6 chiffres</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-center text-2xl tracking-widest font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
            Valider
          </button>
          
          <button
            type="button"
            onClick={() => setStep("login")}
            className="w-full text-xs text-muted-foreground hover:text-foreground mt-4 text-center font-medium"
          >
            Annuler
          </button>
        </form>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer 
      title="Content Studio" 
      subtitle="Connectez-vous pour accéder à votre espace premium."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex items-center justify-between ml-1 mb-1">
            <label className="text-xs font-semibold text-foreground">Mot de passe</label>
            <Link to="/backoffice/forgot-password" className="text-xs text-primary hover:underline font-medium">Oublié ?</Link>
          </div>
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          Se connecter
        </button>
      </form>

    </AuthContainer>
  );
}
