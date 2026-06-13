import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, ArrowUpRight, ArrowRight, Zap, Star, ShieldCheck } from 'lucide-react';
import { openPayment } from '../config/payments';

export default function Pricing() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="pricing" ref={sectionRef} className="bg-[#fafafc] section-padding relative overflow-hidden">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg)"></path>
        </svg>
      </div>
      {/* ── Background Orbs for Glass Effect ── */}
      <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] bg-purple-400 opacity-[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="content-container max-w-[1200px] relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-[clamp(32px,4vw,48px)] font-black leading-tight mb-4 text-dark"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Choisis l'offre qui <span style={{ color: 'var(--color-primary)' }}>te correspond</span>
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Que tu veuilles apprendre en autonomie, être accompagné pas à pas, ou tout déléguer.
          </p>
        </motion.div>

        {/* ── Pricing Cards Grid (3 Columns) ── */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch mb-12">
          
          {/* Card 1: Guide Complet */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col rounded-[32px] p-8 transition-transform hover:-translate-y-2 relative"
            style={{ 
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-dark uppercase tracking-wide mb-4">
                <Zap className="w-3.5 h-3.5" /> Autonomie
              </span>
              <h3 className="text-2xl font-black text-dark mb-2">Guide Complet</h3>
              <p className="text-sm text-body min-h-[40px]">
                Pour ceux qui ont du mal à créer des vidéos engageantes ou ne savent pas quoi poster.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-3xl sm:text-4xl font-black text-dark">25 000</span>
                <span className="text-base sm:text-lg font-bold text-gray-500">CFA</span>
              </div>
              <p className="text-xs font-semibold text-gray-400 mt-1">Environ 50 $</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Vidéo explicative incluse",
                "400+ idées de contenu prêtes à l'emploi",
                "100+ accroches puissantes (3 premières sec)",
                "Structure simple pour scripts viraux",
                "44 stratégies de rétention et conversion"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-dark" />
                  <span className="text-[14px] text-body leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => openPayment('guide')}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-[15px] hover:bg-black transition-colors"
            >
              Acheter le guide
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3">Envoyé juste après paiement</p>
          </motion.div>

          {/* Card 2: VIP Mentorship (HIGHLIGHTED) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col rounded-[32px] p-8 relative transform lg:-translate-y-4 glow-primary"
            style={{ 
              background: 'rgba(255, 59, 111, 0.05)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              border: '1px solid rgba(255, 59, 111, 0.3)',
              boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.8), 0 12px 40px rgba(255, 59, 111, 0.15)',
            }}
          >
            {/* Top Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max max-w-[90%]">
              <span className="bg-[var(--color-primary)] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest py-1.5 px-3 sm:px-4 rounded-full shadow-lg whitespace-nowrap block truncate">
                Le plus demandé
              </span>
            </div>

            <div className="mb-6 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-[var(--color-primary)] uppercase tracking-wide mb-4">
                <Star className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Done-with-you</span>
              </span>
              <h3 className="text-3xl font-black text-dark mb-2">VIP Mentorship</h3>
              <p className="text-sm text-body min-h-[40px]">
                1 mois de travail direct avec moi et mon équipe. C'est une école, pas un cours à regarder.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-[36px] sm:text-[44px] font-black text-[var(--color-primary)] leading-none">350 000</span>
                <span className="text-base sm:text-lg font-bold text-gray-500">CFA</span>
              </div>
              <p className="text-xs font-semibold text-[var(--color-primary)] mt-2">Soit 650 $ / 550 €</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "1 mois d'accompagnement rapproché",
                "10 vidéos pro créées ensemble (script, tournage, montage)",
                "2000+ idées spécifiques à ton business",
                "Système de contenu répétable à vie",
                "Formation (storytelling, scripts, face caméra, CapCut, stratégie)"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-[var(--color-primary)]" />
                  <span className="text-[14px] text-dark font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => openPayment('mentorship')}
              className="w-full py-3.5 sm:py-4 px-2 rounded-[20px] text-white font-black text-[13px] sm:text-[15px] shadow-[0_10px_20px_rgba(255,59,111,0.3)] hover:scale-[1.02] transition-transform flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2" style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <span className="text-center whitespace-nowrap">Je choisis le Mentorship</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </div>
            </button>
            <p className="text-center text-[11px] text-gray-500 mt-3">Dès le paiement reçu, on programme la 1ère séance.</p>
          </motion.div>

          {/* Card 3: Gestion 100% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col rounded-[32px] p-8 transition-transform hover:-translate-y-2 relative"
            style={{ 
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-dark uppercase tracking-wide mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Done-for-you
              </span>
              <h3 className="text-2xl font-black text-dark mb-2">Gestion 100%</h3>
              <p className="text-sm text-body min-h-[40px]">
                On s'occupe absolument de tout. Délègue ton TikTok à des experts.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1 sm:gap-2 whitespace-nowrap">
                <span className="text-3xl sm:text-4xl font-black text-dark">500 000</span>
                <span className="text-base sm:text-lg font-bold text-gray-500">CFA</span>
                <span className="text-xs sm:text-sm font-medium text-gray-400 ml-1">/ mois</span>
              </div>
              <p className="text-xs font-semibold text-gray-400 mt-1">900 $ / 800 € • 1 mois min.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "12 vidéos produites / mois (3/semaine)",
                "Création complète : Idées, script, tournage, montage",
                "Publication optimisée (meilleurs moments)",
                "Stratégie (tendances, hashtags, sons viraux)",
                "Engagement (réponses commentaires) & Analyse"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 shrink-0 text-dark" />
                  <span className="text-[14px] text-body leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => openPayment('gestion')}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-[15px] hover:bg-black transition-colors"
            >
              Déléguer mon compte
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3">Envoie le reçu pour valider l'inscription.</p>
          </motion.div>

        </div>

        {/* ── Banner: Formation Individuelle Intensive ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-10 relative overflow-hidden mt-8 transition-transform hover:-translate-y-1"
          style={{ 
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.8), 0 8px 32px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-4 shadow-sm">
                 <span className="text-base sm:text-lg">⚡</span>
                 <span className="text-[10px] sm:text-xs font-bold text-dark uppercase tracking-widest">Fast-track</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-dark mb-4 leading-tight">
                Accompagnement intensif <span style={{ color: 'var(--color-primary)' }}>sur 1 jour ?</span>
              </h3>
              <p className="text-body text-[13px] sm:text-sm md:text-[15px] mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                J'offre aussi une <strong>formation individuelle intensive (en ligne ou en présentiel)</strong>. On travaille ensemble pendant toute une journée pour construire ta stratégie long terme, générer 1000+ idées, et maîtriser le tournage/montage.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/60 border border-gray-200 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm whitespace-nowrap">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-dark">110 000</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-500">CFA</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/60 border border-gray-200 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm whitespace-nowrap">
                  <span className="text-xs sm:text-sm font-bold text-gray-500">195 $</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center w-full">
              <button 
                onClick={() => openPayment('intensive')}
                className="w-full md:w-auto px-4 sm:px-8 py-3.5 sm:py-5 rounded-[20px] sm:rounded-full bg-gray-900 text-white font-black text-[13px] sm:text-[15px] hover:bg-black transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 shadow-lg"
              >
                <span className="text-center leading-tight">Réserver ma session intensive</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
              <p className="text-center text-[11px] sm:text-[12px] text-gray-400 mt-3 sm:mt-4 font-medium">Programmation dès paiement confirmé</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
