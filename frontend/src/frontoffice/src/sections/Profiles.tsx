import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Clock, Zap, Phone } from 'lucide-react';

/* ─── Design Direction: "Soft Editorial Cards" ───────────────────────────
   Structure from reference: centered title, 3 icon-cards side by side,
   eligibility note centered below.
   Magic spells: card hover lift + icon ring pulse, gradient eyebrow line,
   staggered entrance with spring physics.
─────────────────────────────────────────────────────────────────────── */

const criteria = [
  {
    icon: Briefcase,
    title: "Tu as déjà une activité",
    desc: "Coaching, salon, boutique en ligne tu veux la développer via TikTok et te construire une vraie audience qui achète.",
  },
  {
    icon: Clock,
    title: "Tu peux consacrer 3 à 5h/semaine",
    desc: "Pour tourner, apprendre et appliquer. Pas besoin d'être parfaite juste présente et engagée.",
  },
  {
    icon: Zap,
    title: "Tu es prête à passer à l'action",
    desc: "Pas de théorie, on crée ensemble. Tu repars avec du contenu prêt à poster dès la première session.",
  },
];

export default function Profiles() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-white section-padding overflow-hidden relative">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg-alt)"></path>
        </svg>
      </div>
      <div className="content-container">

        {/* ── Header (centered, like reference) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase"
            style={{ background: 'rgba(255,59,111,0.08)', color: 'var(--color-primary)' }}
          >
            Mentorship VIP 5 places/mois
          </div>
          <h2
            className="text-[clamp(26px,4vw,48px)] font-black leading-tight"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Les profils qu'on accepte dans{' '}
            <span style={{ color: 'var(--color-primary)' }}>le mentorship VIP</span>
          </h2>
        </motion.div>

        {/* ── 3 Profile Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {criteria.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + 0.12 * i, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[24px] p-7 flex flex-col gap-4 cursor-default transition-all duration-500 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 248, 253, 0.75)',
                backdropFilter: 'blur(20px) saturate(1.6)',
                border: '1px solid rgba(255,255,255,0.85)',
                boxShadow: '0 4px 24px rgba(255,59,111,0.06), 0 1px 0 rgba(255,255,255,0.95) inset',
              }}
            >
              {/* Icon with animated ring on hover */}
              <div className="relative w-fit">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(255,59,111,0.10)' }}
                >
                  <c.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
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
                  {c.title}
                </h3>
                <p className="text-[13px] text-body leading-relaxed">{c.desc}</p>
              </div>

              {/* Bottom accent line — grows on hover */}
              <div
                className="h-[2px] rounded-full mt-auto origin-left transition-all duration-700 scale-x-0 group-hover:scale-x-100"
                style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom: Scarcity + eligibility note (centered, like reference) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Scarcity pill */}
          <motion.div
            animate={isInView ? { scale: [1, 1.03, 1] } : {}}
            transition={{ delay: 0.9, duration: 0.6, repeat: 2 }}
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-2 rounded-[20px] sm:rounded-full text-white text-[12px] sm:text-[13px] font-semibold mb-5 w-[90%] sm:w-auto"
            style={{ background: 'var(--color-primary)' }}
          >
            <span className="text-white/90 font-normal text-center leading-tight">On accepte peu de nouvelles personnes chaque mois pour</span>
            <strong className="text-center whitespace-nowrap">garder un vrai 1:1.</strong>
          </motion.div>

          <p className="text-[13px] sm:text-[14px] text-body leading-relaxed mb-6">
            La seule façon d'entrer, c'est{' '}
            <strong className="text-dark">un appel d'éligibilité de 30 minutes</strong>{' '}
            : diagnostic, premiers conseils, et validation de ton profil.
          </p>

          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-5 py-3 sm:px-7 sm:py-3 rounded-[20px] sm:rounded-full text-white text-[13px] sm:text-[14px] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-[90%] sm:w-auto mx-auto"
            style={{
              background: 'var(--color-primary)',
              boxShadow: '0 4px 20px rgba(255,59,111,0.25)',
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="leading-tight text-center">Réserver mon appel découverte</span>
            </div>
          </a>

          <p className="text-[11px] sm:text-[12px] text-body/60 mt-4 italic max-w-[280px] sm:max-w-none mx-auto leading-tight sm:leading-normal">
            Pas sûre d'être éligible ? On fait le point ensemble 100% gratuit, 0 engagement.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
