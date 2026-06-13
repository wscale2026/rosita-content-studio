import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';

export default function PaymentSuccess() {
  return (
    <div className="frontoffice-theme min-h-screen flex flex-col bg-white text-body font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-bg-alt rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-600"></div>
          
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-dark mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Paiement Confirmé !
          </h1>
          
          <p className="text-body mb-8">
            Félicitations, votre inscription a été validée avec succès. Vous recevrez très bientôt un email contenant tous les détails pour accéder à votre espace et commencer l'aventure.
          </p>
          
          <div className="bg-white rounded-xl p-4 flex items-start gap-3 text-left mb-8 border border-border">
            <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-dark">Vérifiez votre boîte mail</p>
              <p className="text-xs text-body mt-1">Si vous ne voyez rien d'ici 5 minutes, n'oubliez pas de vérifier vos spams ou courriers indésirables.</p>
            </div>
          </div>
          
          <a href="/" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-opacity-90 transition-all w-full">
            Retour à l'accueil
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
