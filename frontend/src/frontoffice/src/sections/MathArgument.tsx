import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Percent, Tag, ArrowUpRight } from 'lucide-react';
import { openPayment } from '../config/payments';

/* ─── Design Direction: "Liquid Glass Data" ──────────────────────────────
   3 cards side-by-side for the variables (matching the Profiles structure).
   Premium glassmorphic table for the Before/After comparison.
──────────────────────────────────────────────────────────────────────── */

const variables = [
  { icon: Eye, title: 'Vues par vidéo', desc: 'Plus tu as de vues, plus tu as de chances de vendre.' },
  { icon: Percent, title: 'Taux de conversion', desc: 'Le pourcentage de spectateurs qui deviennent clients.' },
  { icon: Tag, title: 'Prix de vente moyen', desc: 'Ce que facturent tes produits ou services.' },
];

const tableRows = [
  { label: 'Vues', before: '200 vues / vidéo', after: '1 000+ vues / vidéo', highlightAfter: true },
  { label: 'Clients', before: '1 client / mois (200 000 CFA)', after: '3 clients / mois', highlightAfter: false },
  { label: 'Stratégie', before: 'Aucune stratégie', after: 'Système reproductible', highlightAfter: false },
  { label: 'Total', before: '= 200 000 CFA / mois', after: '= 600 000 CFA / mois', highlightAfter: true },
];

export default function MathArgument() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative section-padding overflow-hidden bg-[#fafafc]">
      {/* ── Orbes de fond pour faire réagir le Glassmorphism ── */}
      <div className="absolute top-10 left-[5%] w-[400px] h-[400px] bg-[var(--color-primary)] opacity-[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-[5%] w-[500px] h-[500px] bg-[#f472b6] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="content-container max-w-[1000px] relative z-10">
        
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase"
            style={{ background: 'rgba(255,59,111,0.08)', color: 'var(--color-primary)' }}
          >
            Logique & ROI
          </div>
          <h2
            className="text-[clamp(26px,4vw,48px)] font-black leading-tight mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Pourquoi le mentorship VIP, c'est{' '}
            <span style={{ color: 'var(--color-primary)' }}>juste des maths</span>{' '}
            <br className="hidden md:block" />
            <span className="text-body/60 text-[clamp(20px,3vw,32px)] font-bold">(et pas de la magie)</span>
          </h2>
          <p className="text-[16px] text-body max-w-2xl mx-auto">
            Ton chiffre d'affaires TikTok dépend de 3 chiffres très simples :
          </p>
        </motion.div>

        {/* ── 3 Variables Cards (Side-by-side structure) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {variables.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + 0.12 * i, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[24px] p-7 flex flex-col gap-4 cursor-default transition-all duration-500 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(40px) saturate(2.5)',
                WebkitBackdropFilter: 'blur(40px) saturate(2.5)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 12px 40px rgba(255, 59, 111, 0.08), inset 0 2px 24px rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Icon with animated ring on hover */}
              <div className="relative w-fit">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(255,59,111,0.10)' }}
                >
                  <v.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                {/* Pulse ring on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-125"
                  style={{ border: '1.5px solid rgba(255,59,111,0.25)' }}
                />
              </div>

              {/* Content */}
              <div>
                <h3
                  className="text-[17px] font-bold mb-2 leading-snug"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {v.title}
                </h3>
                <p className="text-[13px] text-body leading-relaxed">{v.desc}</p>
              </div>

              {/* Bottom accent line — grows on hover */}
              <div
                className="h-[2px] rounded-full mt-auto origin-left transition-all duration-700 scale-x-0 group-hover:scale-x-100"
                style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Before/After Glassmorphic Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[24px] overflow-hidden mb-10"
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(40px) saturate(2.5)',
            WebkitBackdropFilter: 'blur(40px) saturate(2.5)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 16px 50px rgba(0, 0, 0, 0.05), inset 0 2px 24px rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-gray-100/50">
            <div className="p-5 text-[13px] font-bold tracking-widest uppercase text-body/50"></div>
            <div className="p-5 text-[14px] font-bold text-center text-red-500 bg-red-50/30">
              Aujourd'hui (❌)
            </div>
            <div className="p-5 text-[14px] font-bold text-center text-emerald-600 bg-emerald-50/30">
              Après mentorship VIP (✅)
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100/50">
            {tableRows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 group hover:bg-white/40 transition-colors duration-300">
                <div className="p-5 text-[15px] font-bold text-dark flex items-center">
                  {row.label}
                </div>
                <div
                  className="p-5 text-[14px] text-center flex items-center justify-center"
                  style={{ background: 'rgba(239, 68, 68, 0.03)' }}
                >
                  <span className="text-body font-medium">{row.before}</span>
                </div>
                <motion.div
                  className="p-5 text-[14px] text-center flex items-center justify-center font-bold"
                  style={{
                    background: row.highlightAfter ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.03)',
                    color: row.highlightAfter ? 'var(--color-success)' : 'var(--color-dark)',
                  }}
                  animate={isInView && row.highlightAfter ? {
                    backgroundColor: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.08)'],
                  } : {}}
                  transition={{ delay: 1.0, duration: 1.5, ease: "easeOut" }}
                >
                  {row.after}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── ROI Text & CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div 
            className="inline-block rounded-2xl px-6 py-4 mb-8 relative"
            style={{ 
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(24px) saturate(2)',
              WebkitBackdropFilter: 'blur(24px) saturate(2)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 8px 32px rgba(255, 59, 111, 0.05), inset 0 1px 12px rgba(255, 255, 255, 0.8)',
            }}
          >
            <p className="text-[15px] font-semibold text-dark">
              <em>Investissement : 350 000 CFA → <span style={{ color: 'var(--color-primary)' }}>retour sur investissement potentiel en moins d'1 mois.</span></em>
            </p>
          </div>

          <div>
            <button
            onClick={() => openPayment('mentorship')}
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-5 py-3.5 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full text-white text-[13px] sm:text-[15px] font-bold transition-all hover:scale-105 hover:shadow-lg w-[90%] sm:w-auto mx-auto"
            style={{ background: 'var(--color-primary)' }}
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <span role="img" aria-label="credit-card" className="shrink-0 text-base sm:text-lg">💳</span>
              <span className="leading-tight text-center">Je m'inscris <span className="inline-block"> 350 000 CFA</span></span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-1" />
            </div>
          </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
