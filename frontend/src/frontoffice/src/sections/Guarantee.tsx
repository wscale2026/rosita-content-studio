import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { openPayment } from '../config/payments';

export default function Guarantee() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-[clamp(80px,10vw,120px)] px-6 overflow-hidden flex items-center justify-center min-h-[60vh]"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg)"></path>
        </svg>
      </div>

      {/* ── Background Noise Texture (Matches the image's premium textured look) ── */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle bottom gradient to mimic the horizon line in the noise texture */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

      <div className="content-container relative z-10 text-center text-white max-w-[1000px]">
        
        {/* Top small text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-sm md:text-base font-black tracking-wide text-white/90">
            Garantie zéro risque.
          </span>
        </motion.div>

        {/* Huge Title Promise */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(32px,5vw,64px)] font-black text-white leading-[1.1] tracking-tight mb-8"
        >
          Tu es satisfaite ou je te rembourse intégralement dans les 7 premiers jours.
        </motion.h2>

        {/* Subtitle / Conditions */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(15px,2vw,18px)] text-white/80 max-w-3xl mx-auto leading-relaxed mb-12 font-small"
        >
          Si tu es sélectionné pour travailler avec nous, ce n'est pas par hasard. On ne s'engage que quand on sait que ça peut marcher pour toi.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => openPayment('mentorship')}
            className="group mx-auto inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 bg-white text-dark w-[90%] sm:w-auto px-5 py-3.5 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <span className="font-extrabold text-[13px] sm:text-[15px] leading-tight text-center">
                💳 Je m'inscris maintenant
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 group-hover:bg-gray-200 transition-colors">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-dark" />
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
