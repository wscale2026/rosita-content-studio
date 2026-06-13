import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, Heart, ArrowUpRight, XCircle, CheckCircle2 } from 'lucide-react';

const spring = { type: 'spring', stiffness: 90, damping: 20 };

const problems = [
  "**Tu ne sais jamais quoi poster** et tu passes des heures à chercher des idées.",
  "**Tu postes au hasard**, sans stratégie, et tes vidéos ne décollent pas.",
  "**Tu as peur de la caméra** et tu remets toujours à demain.",
  "**Tu n'attires pas de clients** juste des likes et des vues vides.",
  "**Tu perds du temps** à monter des vidéos qui ne rapportent rien.",
  "**Tu compares aux influenceuses** et tu te sens nulle.",
];

const desires = [
  "Un **système clair** pour savoir exactement quoi poster chaque jour.",
  "**Décoller à +1000 vues** en moins de 15 jours, sans chance.",
  "**Devenir à l'aise face caméra** grâce à une méthode progressive.",
  "**Attirer des clients payants** qui te contactent directement.",
  "**Monter tes vidéos rapidement** avec CapCut, sans galère.",
  "**T'inspirer de toi‑même** pas des autres.",
];

export default function Problems() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="bg-alt section-padding overflow-hidden">
      <div className="content-container max-w-[900px]">
        
        {/* PART 1: PROBLEMS (Split Layout) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16  mb-32">
          
          {/* Left: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="w-full lg:w-[50%] lg:sticky lg:top-32"
          >
            <h2
              className="text-[clamp(32px,4vw,48px)] font-extrabold mb-6 leading-[1.1]"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Les 6 problèmes <span style={{ color: 'var(--color-primary)' }}>récurrents</span> chez 80% des femmes entrepreneurs qu'on rencontre
            </h2>
            <p className="text-[15px] text-body leading-relaxed mb-8 max-w-md">
              Si tu te reconnais, c'est normal : on retrouve ces situations chez presque toutes les coachs, commerçantes et e-commerçantes bloquées sous les 500 vues.
            </p>
            <button
              onClick={() => scrollToSection('pricing')}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--color-primary)' }}
            >
              🔥 Voir les offres 
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/30">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </motion.div>

          {/* Right: Cards Stack */}
          <div className="w-full lg:w-[50%] max-w-[500px] flex flex-col gap-4">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="rounded-[28px] p-5 transition-all duration-300"
                style={{
                  background: 'rgba(255, 238, 244, 0.45)',
                  backdropFilter: 'blur(20px) saturate(1.8)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                  border: '1px solid rgba(255, 200, 220, 1)',
                  boxShadow: '0 4px 24px rgba(255,59,111,0.06), 0 1.5px 0 rgba(255,255,255,0.9) inset',
                }}
              >
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center mb-3" style={{ background: 'rgba(255,59,111,0.12)' }}>
                  <XCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                </div>
                <p
                  className="text-[13px] text-dark leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: p.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>'),
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* PART 2: DESIRES (Grid Layout) */}
        <div className="flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold mb-12 text-center"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Ce que tu veux <span style={{ color: 'var(--color-primary)' }}>vraiment</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-5 w-full mb-6 sm:mb-10">
            {desires.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + (0.1 * i), duration: 0.6 }}
                className="rounded-[28px] p-6 transition-all duration-300"
                style={{
                  background: 'rgba(236, 252, 243, 0.7)',
                  backdropFilter: 'blur(20px) saturate(1.8)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                  border: '1px solid rgba(167, 220, 193, 0.9)',
                  boxShadow: '0 4px 24px rgba(34,197,94,0.05), 0 1.5px 0 rgba(255,255,255,0.9) inset',
                }}
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mb-4" style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                </div>
                <p
                  className="text-[14px] text-dark leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: d.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>'),
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full rounded-[24px] md:rounded-full p-2.5 sm:p-3 md:p-3 md:pl-6 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4"
            style={{ background: 'var(--color-primary)' }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] sm:text-sm font-bold" style={{ color: 'var(--color-primary)' }}>★</span>
              </div>
              <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-medium text-center md:text-left leading-tight sm:leading-normal">
                <strong className="font-bold">La solution : Rosyta CONTENT STUDIO</strong> - L'accompagnement qui structure ton acquisition et pilote ta croissance.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('pricing')}
              className="flex-shrink-0 inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-dark text-[12px] sm:text-sm font-semibold transition-all hover:scale-105"
            >
              Voir les offres
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-dark/20">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-[13px] text-body mt-6 text-center max-w-lg"
          >
            C'est exactement ce que recherchent les +1000 clientes qu'on a accompagnées pour transformer leur visibilité en chiffre d'affaires.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
