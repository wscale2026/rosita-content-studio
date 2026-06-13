import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { openPayment } from '../config/payments';

const steps = [
  {
    num: '01',
    title: 'On trouve tes 8 histoires de marque',
    desc: "On extrait tes expériences, tes valeurs et tes anecdotes pour créer un stock infini de sujets. Plus jamais de page blanche.",
  },
  {
    num: '02',
    title: 'On scripte 10 vidéos qui vendent',
    desc: "Je te montre notre méthode de copywriting TikTok : accroches, storytelling, call‑to‑action. Tu écris un script en 15 minutes.",
  },
  {
    num: '03',
    title: 'On tourne et monte ensemble',
    desc: "Séance pratique : placement devant caméra, ton de voix, montage CapCut. Tu repars avec 10 vidéos prêtes à poster.",
  },
];

export default function Differentiation() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="bg-white section-padding overflow-hidden relative">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg-alt)"></path>
        </svg>
      </div>

      <div className="content-container max-w-[900px] relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-4"
        >
          <h2
            className="text-[clamp(28px,4vw,48px)] font-black"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            ROSYTA CONTENT STUDIO{' '}
            <span style={{ color: 'var(--color-primary)' }}>n'est pas</span>{' '}
            une formation en ligne.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-base text-body text-center max-w-3xl mx-auto mb-12"
        >
          C'est un <strong className="text-dark">coaching 1:1 opérationnel</strong>. On installe avec toi le système "Story → Script → Vidéo → Client" qui a fait ses preuves :
        </motion.p>

        {/* Main 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-10">

          {/* Left: Stacked Glass Cards */}
          <div className="flex flex-col gap-5 w-full lg:w-[42%]">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="rounded-[24px] p-6 flex flex-col gap-2"
                style={{
                  background: 'rgba(255, 248, 253, 0.75)',
                  backdropFilter: 'blur(20px) saturate(1.6)',
                  border: '1px solid rgba(255,255,255,0.80)',
                  boxShadow: '0 4px 24px rgba(255,59,111,0.06), 0 1px 0 rgba(255,255,255,0.9) inset',
                }}
              >
                {/* Label */}
                <span
                  className="text-[12px] font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Étape {step.num}
                </span>
                {/* Title */}
                <h3
                  className="text-[19px] font-bold leading-snug"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {step.title}
                </h3>
                {/* Desc */}
                <p className="text-[14px] text-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full lg:w-[58%] rounded-[28px] overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            <img
              src="/images/hero-rosyta.jpg"
              alt="Rosyta en coaching avec une cliente"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay badge */}
            <div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm font-semibold text-white max-w-[85%]"
              style={{
                background: 'var(--color-primary)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 16px rgba(255,59,111,0.35)',
              }}
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="leading-tight truncate">Mentorship VIP  5 places/mois</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom result bar — same style as Problems section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full rounded-[24px] md:rounded-full p-2.5 sm:p-4 md:p-3 md:pl-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 mt-2"
          style={{ background: 'var(--color-primary)' }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] sm:text-sm font-bold" style={{ color: 'var(--color-primary)' }}>★</span>
            </div>
            <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-medium text-center md:text-left leading-tight sm:leading-normal">
              <strong className="font-bold">Résultat garanti :</strong> tu sors avec 10 vidéos pro, un système de contenu illimité, et la confiance pour te filmer seule.
            </p>
          </div>
          <button
            onClick={() => openPayment('mentorship')}
            className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-2.5 rounded-[20px] sm:rounded-full bg-white text-dark text-[12px] sm:text-sm font-semibold transition-all hover:scale-105"
          >
            <span role="img" aria-label="credit-card" className="shrink-0">💳</span> 
            <span className="leading-tight">Je m'inscris <span className="inline-block">350 000 CFA</span></span>
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dark/20 shrink-0 ml-1">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
