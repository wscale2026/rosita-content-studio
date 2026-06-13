import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Share2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_LINKS } from '../config/payments';

type OfferType = keyof typeof PAYMENT_LINKS;

interface CheckoutEventDetail {
  offer: OfferType;
}

export default function CheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [offer, setOffer] = useState<OfferType | null>(null);

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    source: '',
  });

  useEffect(() => {
    const handleOpenCheckout = (e: Event) => {
      const customEvent = e as CustomEvent<CheckoutEventDetail>;
      setOffer(customEvent.detail.offer);
      setIsOpen(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.addEventListener('open-checkout', handleOpenCheckout);
    return () => {
      window.removeEventListener('open-checkout', handleOpenCheckout);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setOffer(null), 300); // Wait for transition
    document.body.style.overflow = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = 
    formData.lastName.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.phone.trim() !== '' && 
    formData.source.trim() !== '';

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !offer || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`}/payments/initiate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, offer }),
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        console.log('[Checkout] Redirecting to GeniusPay:', data.checkout_url);
        window.open(data.checkout_url, '_self');
      } else {
        console.error('[Checkout] Error:', data.error);
        toast.error("Erreur lors de l'initialisation du paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('[Checkout] Exception:', error);
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !offer) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div 
        className={`relative w-full max-w-md bg-[var(--color-bg)] rounded-[32px] overflow-hidden shadow-2xl transition-transform duration-300 flex flex-col max-h-[90vh] ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 relative shrink-0">
          <button 
            onClick={handleClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-[var(--color-bg-alt)] transition-colors text-gray-400 hover:text-[var(--color-dark)]"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-black text-[var(--color-dark)] mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Dernière étape
          </h2>
          <p className="text-sm text-[var(--color-body)]">
            Laissez-nous vos coordonnées pour finaliser votre inscription.
          </p>
        </div>

        {/* Form (Scrollable area) */}
        <div className="overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-dark)] mb-1.5 ml-1">Nom *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-alt)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-dark)] mb-1.5 ml-1">Prénom (Optionnel)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-alt)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-dark)] mb-1.5 ml-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@exemple.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-alt)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-dark)] mb-1.5 ml-1">Téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-alt)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            {/* Source */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-dark)] mb-1.5 ml-1">Où nous avez-vous connu ? *</label>
              <div className="relative">
                <Share2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-alt)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                >
                  <option value="" disabled>Sélectionnez une option</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Proche">Un proche</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                opacity: isValid && !loading ? 1 : 0.5,
                cursor: isValid && !loading ? 'pointer' : 'not-allowed'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? "Chargement..." : "Passer au paiement"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
