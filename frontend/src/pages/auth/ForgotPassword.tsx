import { useState } from "react";
import { Link } from "react-router";
import { resetPassword } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { AuthContainer } from "./AuthContainer";

const forgotSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setIsSent(true);
      toast.success("Lien de réinitialisation envoyé !");
    } catch (error: any) {
      toast.error("Erreur", { description: error.message || "Veuillez réessayer plus tard." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthContainer title="Vérifiez vos emails" subtitle="Un lien de réinitialisation a été envoyé.">
        <div className="flex flex-col items-center py-4 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <p className="text-center text-muted-foreground mb-8 text-sm leading-relaxed">
            Si un compte existe avec cette adresse email, vous recevrez les instructions pour réinitialiser votre mot de passe d'ici quelques instants.
          </p>
          <Link to="/backoffice/login" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-colors border border-border">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer 
      title="Mot de passe oublié" 
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation."
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Envoyer le lien
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link to="/backoffice/login" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    </AuthContainer>
  );
}
