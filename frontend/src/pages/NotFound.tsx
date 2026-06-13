import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF]">
      <div className="text-center">
        <h1 className="text-6xl font-medium text-[#6750A4] mb-4">404</h1>
        <p className="text-lg text-[#1C1B1F] mb-2">Page introuvable</p>
        <p className="text-sm text-[#49454F] mb-6">
          La page que vous cherchez n'existe pas.
        </p>
        <Link
          to="/backoffice"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
