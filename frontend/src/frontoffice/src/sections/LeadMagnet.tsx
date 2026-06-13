import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Download, BookOpen, FileText, CheckCircle, ArrowUpRight, Sparkles } from 'lucide-react';

const DOCUMENTS = [
  {
    icon: BookOpen,
    label: 'Guide Scripts TikTok',
    desc: 'Comment transformer tes histoires en scripts qui vendent',
    file: '/downloads/guide-scripts-tiktok.pdf',
    color: 'rgba(255,59,111,0.12)',
    iconColor: 'var(--color-primary)',
  },
  {
    icon: FileText,
    label: 'Feuille de Travail',
    desc: 'Trouve tes 8 histoires de marque uniques',
    file: '/downloads/feuille-histoires-marque.pdf',
    color: 'rgba(139,92,246,0.10)',
    iconColor: '#7c3aed',
  },
];

// ── Download Card ────────────────────────────────────────────────────────────
function DownloadCard({ doc, index }: { doc: typeof DOCUMENTS[0]; index: number }) {
  const [downloaded, setDownloaded] = useState(false);
  const Icon = doc.icon;

  const handleDownload = () => {
    setDownloaded(true);
    // Trigger actual download
    const a = document.createElement('a');
    a.href = doc.file;
    a.download = doc.file.split('/').pop() || 'document.pdf';
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 120, damping: 20 }}
      className="flex items-center gap-4 p-4 rounded-[24px]"
      style={{
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1.5px 0 rgba(255,255,255,0.15) inset',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
        style={{ background: doc.color }}
      >
        <Icon className="w-5 h-5" style={{ color: doc.iconColor }} />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-white font-bold text-[14px] leading-tight">{doc.label}</span>
        <span className="text-white/60 text-[12px] mt-0.5 leading-tight">{doc.desc}</span>
      </div>

      {/* Download Button */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-colors"
        style={{
          background: downloaded ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.15)',
          border: `1px solid ${downloaded ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.25)'}`,
          color: downloaded ? '#4ade80' : 'white',
        }}
      >
        {downloaded ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Téléchargé</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LeadMagnet() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ lastName: '', firstName: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dynamicDocuments, setDynamicDocuments] = useState<any[]>(DOCUMENTS);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`}/prospects/lead-magnet/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          // Map backend documents to our frontend structure
          setDynamicDocuments(data.documents.map((d: any, i: number) => ({
            icon: i % 2 === 0 ? BookOpen : FileText,
            label: d.label,
            desc: d.desc,
            file: d.file,
            color: i % 2 === 0 ? 'rgba(255,59,111,0.12)' : 'rgba(139,92,246,0.10)',
            iconColor: i % 2 === 0 ? 'var(--color-primary)' : '#7c3aed',
          })));
        }
      } else {
        console.error("Erreur lors de l'enregistrement du prospect froid");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
    
    // Show download UI regardless of API success to not block user from getting the free document
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="lead-magnet" ref={sectionRef} className="bg-dark-surface section-padding relative overflow-hidden">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="#fafafc"></path>
        </svg>
      </div>
      <div className="content-container max-w-[600px] text-center relative z-10">

        {/* Header — always visible */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: 'rgba(255,59,111,0.18)', color: 'var(--color-primary)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            100% gratuit sans engagement
          </div>
          <h2
            className="text-[clamp(22px,3vw,36px)] font-extrabold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Pas encore prête à investir ?<br />
            <span style={{ color: 'var(--color-primary)' }}>Je t'offre 2 outils concrets</span> pour démarrer.
          </h2>
          <p className="text-white/70 text-[14px] leading-relaxed">
            Scripts TikTok + Feuille de travail sur tes histoires de marque téléchargement immédiat après inscription.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ── FORM ── */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Nom *"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white text-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B6F]"
              />
              <input
                type="text"
                placeholder="Prénom (optionnel)"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white text-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B6F]"
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white text-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B6F]"
              />
              <input
                type="tel"
                placeholder="Téléphone *"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-3.5 rounded-xl bg-white text-dark placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B6F]"
              />
              <motion.button
                  type="submit"
                  disabled={loading || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full inline-flex flex-col sm:flex-row items-center justify-center gap-2 px-5 py-3.5 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full text-white text-[13px] sm:text-[15px] font-bold transition-all relative overflow-hidden shadow-[0_8px_30px_rgba(255,59,111,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {loading ? (
                  <span className="flex items-center justify-center gap-2 w-full text-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full shrink-0"
                    />
                    <span className="leading-tight">Préparation de tes fichiers…</span>
                  </span>
                ) : (
                  <span className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
                    <span role="img" aria-label="download" className="shrink-0 text-base sm:text-lg">📥</span>
                    <span className="leading-tight text-center">Accéder à mes 2 cadeaux gratuits</span>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </span>
                )}
              </motion.button>
              <p className="text-white/40 text-[11px] pt-1">
                Aucun spam. Tu peux te désabonner à tout moment.
              </p>
            </motion.form>
          ) : (
            /* ── DOWNLOAD INTERFACE ── */
            <motion.div
              key="download"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
              {/* Success header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-6"
              >
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-white font-extrabold text-xl mb-1">
                  C'est prêt, {formData.firstName || formData.lastName} !
                </h3>
                <p className="text-white/60 text-[13px]">
                  Clique sur chaque document pour le télécharger directement.
                </p>
              </motion.div>

              {/* Download cards */}
              <div className="flex flex-col gap-3 mb-6">
                {dynamicDocuments.map((doc, i) => (
                  <DownloadCard key={i} doc={doc} index={i} />
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-[11px] uppercase tracking-widest">Et si tu veux aller plus loin</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* CTA to main offer */}
              <motion.button
                onClick={() => scrollToSection('pricing')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all"
                style={{ background: 'var(--color-primary)', boxShadow: '0 8px 30px rgba(255,59,111,0.35)' }}
              >
                🔥 Voir le Mentorship VIP à 350 000 CFA
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
