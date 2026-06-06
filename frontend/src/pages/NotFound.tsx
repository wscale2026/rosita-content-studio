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
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6750A4] text-white text-sm font-medium hover:bg-[#4F378B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
