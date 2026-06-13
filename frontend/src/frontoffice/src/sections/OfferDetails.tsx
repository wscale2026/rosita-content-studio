import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Video, BookOpen, PenTool, Camera, Scissors, BarChart3,
  ChevronDown, ArrowUpRight,
} from 'lucide-react';
import { openPayment } from '../config/payments';

const iconBar = [
  { icon: Video, label: '10 vidéos pro' },
  { icon: BookOpen, label: '2000+ idées de contenu' },
  { icon: PenTool, label: 'Formation storytelling' },
  { icon: Camera, label: 'Aisance face caméra' },
  { icon: Scissors, label: 'Montage CapCut' },
  { icon: BarChart3, label: 'Stratégie TikTok' },
];

const accordionItems = [
  {
    title: '10 vidéos professionnelles',
    content: 'On détermine ensemble les sujets qui vendent. Je te montre comment filmer avec ton téléphone (lumière, son, cadrage). On monte en direct sur CapCut. Tu repars avec les fichiers prêts à poster.',
  },
  {
    title: '2000+ idées de contenu',
    content: "À partir de tes 8 histoires de marque, on génère une bibliothèque de sujets pour les 12 prochains mois. Fini le syndrome de la page blanche.",
  },
  {
    title: 'Formation storytelling & scripts',
    content: "Une méthode simple en 3 étapes pour écrire des accroches qui arrêtent le scroll, et des scripts qui mènent à l'action (achat, rendez-vous, message).",
  },
  {
    title: 'Coaching aisance face caméra',
    content: "Exercices pratiques pour détendre ton corps, trouver ton ton naturel et ne plus bégayer. On enregistre, on regarde ensemble, on corrige.",
  },
  {
    title: 'Maîtrise de CapCut',
    content: "Tutoriel pas à pas : couper, ajouter du texte, de la musique, des effets. Tu seras autonome en 1h.",
  },
  {
    title: 'Stratégie de publication',
    content: "Calendrier éditorial, meilleurs jours et heures pour poster, utilisation des tendances et sons viraux.",
  },
];

export default function OfferDetails() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="offer" ref={sectionRef} className="bg-alt section-padding relative overflow-hidden">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg)"></path>
        </svg>
      </div>

      <div className="content-container relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-[clamp(24px,3.5vw,40px)] font-extrabold text-center mb-10"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Ce qu'on met en place pour toi
        </motion.h2>

        {/* Icon bar */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12">
          {iconBar.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center gap-2 w-[100px]"
            >
              <item.icon className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm font-semibold text-dark text-center">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3 mb-10">
          {accordionItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-dark">{item.title}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-body" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[15px] text-body leading-relaxed">
                      {item.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
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
