import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const testimonials = [
  {
    quote: "Je bloquais à 300 vues, après 2 semaines j'étais à 1500 vues. Et surtout, je sais quoi poster.",
    name: 'Sarah',
    sector: 'salon de coiffure',
    avatar: '/images/avatar-sarah.jpg',
    badge: '+1200 vues / 15 jours',
  },
  {
    quote: "Avant je postais au hasard. Maintenant j'ai une stratégie et mes clients me reconnaissent dans la rue.",
    name: 'Aïssatou',
    sector: 'coach',
    avatar: '/images/avatar-aissatou.jpg',
    badge: '5 leads qualifiés / semaine',
  },
  {
    quote: "J'ai vendu 8 000 CFA de produits dès ma 3e vidéo. Le système fonctionne vraiment.",
    name: 'Koffi',
    sector: 'e‑commerce',
    avatar: '/images/avatar-koffi.jpg',
    badge: '8 000 CFA en 7 jours',
  },
  {
    quote: "Je ne savais pas me filmer. En 1 mois, j'ai sorti 10 vidéos pro et je n'ai plus peur.",
    name: 'Nadège',
    sector: 'e‑commerce',
    avatar: '/images/avatar-nadege.jpg',
    badge: '10 vidéos prêtes',
  },
  {
    quote: "Rosyta m'a aidée à trouver mes 8 histoires de marque. Maintenant je ne manque jamais d'idées.",
    name: 'Mamie',
    sector: 'salon de coiffure',
    avatar: '/images/avatar-mamie.jpg',
    badge: '2000 idées de contenu',
  },
  {
    quote: "J'ai gagné en confiance et mes vidéos attirent des clients, pas juste des vues.",
    name: 'Christelle',
    sector: 'coach',
    avatar: '/images/avatar-christelle.jpg',
    badge: '3 contrats signés',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section ref={sectionRef} className="bg-alt section-padding overflow-hidden relative">
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
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-[clamp(28px,4vw,48px)] font-extrabold text-center mb-12"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Elles l'ont fait et ça marche
        </motion.h2>

        <div className="relative">
          {/* Navigation arrows - desktop */}
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform hidden lg:flex"
          >
            <ChevronLeft className="w-5 h-5 text-dark" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform hidden lg:flex"
          >
            <ChevronRight className="w-5 h-5 text-dark" />
          </button>

          {/* Cards container */}
          <div className="overflow-hidden pb-4">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 * i, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ y: -4 }}
                  className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] rounded-[28px] p-6 flex flex-col transition-all duration-300"
                  style={{
                    background: 'rgba(255, 238, 244, 0.6)',
                    backdropFilter: 'blur(20px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                    border: '1px solid rgba(255, 200, 220, 1)',
                    boxShadow: '0 4px 24px rgba(255,59,111,0.06), 0 1.5px 0 rgba(255,255,255,0.9) inset',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ color: 'var(--color-primary)' }} className="text-[14px]">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[14px] text-dark leading-relaxed flex-1 mb-6 font-medium">
                    "{t.quote}"
                  </p>

                  {/* Author & Badge */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-black text-dark text-[15px] leading-tight">{t.name}</span>
                        <span className="text-[11px] font-semibold" style={{ color: 'var(--color-primary)' }}>{t.sector}</span>
                      </div>
                    </div>
                    <div
                      className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-full w-full sm:w-auto sm:self-start"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      <Check className="w-3 h-3 text-white shrink-0" strokeWidth={3} />
                      <span className="text-[11px] font-bold text-white whitespace-nowrap truncate">{t.badge}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots - pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6' : 'w-2 opacity-30 hover:opacity-60'
                }`}
                style={{
                  background: 'var(--color-primary)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
