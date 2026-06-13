import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';

export default function PaymentCancel() {
  return (
    <div className="frontoffice-theme min-h-screen flex flex-col bg-white text-body font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-bg-alt rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-black text-dark mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Paiement Échoué
          </h1>
          
          <p className="text-body mb-8">
            Le paiement n'a pas pu aboutir ou a été annulé. Vous n'avez pas été débité. Si vous rencontrez des difficultés, n'hésitez pas à réessayer ou à nous contacter.
          </p>
          
          <div className="flex flex-col gap-3">
            <a href="/" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-opacity-90 transition-all w-full">
              <RefreshCw className="w-5 h-5" />
              Réessayer le paiement
            </a>
            
            <a href="mailto:support@rosyta-studio.com" className="inline-flex items-center justify-center gap-2 bg-white text-dark font-bold py-4 px-8 rounded-xl border border-border hover:bg-gray-50 transition-all w-full">
              <MessageCircle className="w-5 h-5" />
              Contacter le support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
