import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Check, X, AlertTriangle } from 'lucide-react';
import { openPayment } from '../config/payments';


const rows = [
  { criterion: 'Expertise sectorielle', Rosyta: 'TikTok business, storytelling, vente', RosytaIcon: 'check', formations: 'souvent du général', formationsIcon: 'cross', coaching: 'rarement spécialisé TikTok', coachingIcon: 'cross' },
  { criterion: 'Format des sessions', Rosyta: '1:1 en live + ateliers pratiques', RosytaIcon: 'check', formations: 'replay asynchrone', formationsIcon: 'cross', coaching: '1:1 mais sans méthode éprouvée', coachingIcon: 'check' },
  { criterion: 'Personnalisation', Rosyta: "100% sur ton business, tes produits", RosytaIcon: 'check', formations: '0 personnalisation', formationsIcon: 'cross', coaching: 'variable, souvent cher', coachingIcon: 'warning' },
  { criterion: 'Livrables concrets', Rosyta: '10 vidéos pro produites', RosytaIcon: 'check', formations: 'rien de produit', formationsIcon: 'cross', coaching: 'juste des conseils', coachingIcon: 'cross' },
  { criterion: 'Résultats scalables', Rosyta: 'système reproductible à l\'infini', RosytaIcon: 'check', formations: 'tu es seul après', formationsIcon: 'cross', coaching: 'dépend du coach', coachingIcon: 'warning' },
  { criterion: 'Communauté de pairs', Rosyta: 'accès à un groupe privé d\'entraide', RosytaIcon: 'check', formations: 'rien', formationsIcon: 'cross', coaching: 'rien', coachingIcon: 'cross' },
];

function CircularIcon({ type, isPrimary }: { type: string, isPrimary?: boolean }) {
  const bg = isPrimary ? 'bg-[var(--color-primary)]' : 'bg-[#1a1a1a]';
  return (
    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mb-3`}>
      {type === 'check' && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />}
      {type === 'cross' && <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />}
      {type === 'warning' && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />}
    </div>
  );
}

export default function Comparison() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="bg-white section-padding relative overflow-hidden">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="#fafafc"></path>
        </svg>
      </div>
      <div className="content-container max-w-[1100px] relative z-10">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <h2
            className="text-[clamp(28px,4vw,48px)] font-black leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#0a0a0a' }}
          >
            La différence entre <span style={{ color: 'var(--color-primary)' }}>ROSYTA</span> <br className="hidden md:block" />
            et les alternatives du marché
          </h2>
        </motion.div>

        {/* Table - desktop */}
        <div className="hidden md:block max-w-5xl mx-auto">
          {/* Header Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr] items-end"
          >
            <div></div>
            {/* Highlighted Column Header */}
            <div className="pt-8 pb-6 px-4 text-center rounded-t-[32px]" style={{ backgroundColor: 'rgba(255, 59, 111, 0.05)' }}>
              <h3 className="text-xl lg:text-2xl font-black text-dark tracking-wide">ROSYTA</h3>
            </div>
            <div className="pb-6 px-4 text-center border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-bold text-dark leading-tight">Formations<br/>classiques</h3>
            </div>
            <div className="pb-6 px-4 text-center border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-bold text-dark leading-tight">Coaching<br/>généraliste</h3>
            </div>
          </motion.div>

          {/* Rows */}
          {rows.map((row, i) => {
            const isLast = i === rows.length - 1;
            const borderClass = isLast ? '' : 'border-b border-gray-200';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + 0.05 * i, duration: 0.5 }}
                className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr] items-stretch"
              >
                {/* Cell 1: Feature */}
                <div className={`py-6 lg:py-8 pr-6 flex items-center ${borderClass}`}>
                  <span className="font-bold text-dark text-sm lg:text-[15px] leading-snug">{row.criterion}</span>
                </div>
                
                {/* Cell 2: Rosyta Highlight */}
                <div 
                  className={`py-6 lg:py-8 px-4 flex flex-col items-center justify-center text-center ${isLast ? 'rounded-b-[32px]' : ''}`} 
                  style={{ backgroundColor: 'rgba(255, 59, 111, 0.05)' }}
                >
                  <CircularIcon type={row.RosytaIcon} isPrimary />
                  <span className="text-sm text-dark font-semibold leading-relaxed">{row.Rosyta}</span>
                </div>

                {/* Cell 3: Formations */}
                <div className={`py-6 lg:py-8 px-4 flex flex-col items-center justify-center text-center ${borderClass}`}>
                  <CircularIcon type={row.formationsIcon} />
                  <span className="text-[13px] text-body leading-relaxed">{row.formations}</span>
                </div>

                {/* Cell 4: Coaching */}
                <div className={`py-6 lg:py-8 px-4 flex flex-col items-center justify-center text-center ${borderClass}`}>
                  <CircularIcon type={row.coachingIcon} />
                  <span className="text-[13px] text-body leading-relaxed">{row.coaching}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile table */}
        <div className="md:hidden space-y-6">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100"
            >
              <h4 className="font-extrabold text-dark text-lg mb-5 text-center">{row.criterion}</h4>
              
              <div className="space-y-4">
                {/* Rosyta */}
                <div className="flex items-start gap-4 p-4 rounded-[20px]" style={{ backgroundColor: 'rgba(255, 59, 111, 0.05)' }}>
                  <CircularIcon type={row.RosytaIcon} isPrimary />
                  <div className="pt-0.5">
                    <strong className="block text-[13px] font-black text-dark mb-1 tracking-wide">ROSYTA</strong>
                    <span className="text-sm text-dark font-medium">{row.Rosyta}</span>
                  </div>
                </div>
                
                {/* Formations */}
                <div className="flex items-start gap-4 p-3">
                  <CircularIcon type={row.formationsIcon} />
                  <div className="pt-0.5">
                    <strong className="block text-[12px] uppercase text-body font-bold mb-1">Formations</strong>
                    <span className="text-[13px] text-body">{row.formations}</span>
                  </div>
                </div>

                {/* Coaching */}
                <div className="flex items-start gap-4 p-3">
                  <CircularIcon type={row.coachingIcon} />
                  <div className="pt-0.5">
                    <strong className="block text-[12px] uppercase text-body font-bold mb-1">Coaching</strong>
                    <span className="text-[13px] text-body">{row.coaching}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Conclusion & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16 lg:mt-24"
        >
          <p className="text-lg md:text-xl font-bold text-dark mb-8 max-w-2xl mx-auto leading-relaxed">
            Pour 350 000 CFA, tu obtiens un accompagnement opérationnel, pas une formation que tu ne finiras jamais.
          </p>
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
        </motion.div>
      </div>
    </section>
  );
}
