import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Design Direction: "Premium Video Wall" ─────────────────────────────
   Grid of video testimonials with glassmorphic cards.
   Using 5 unique videos.
──────────────────────────────────────────────────────────────────────── */

const videos = [
  {
    src: '', //'/videos/testimony_1.mp4',
    title: 'Power Beauty',
    desc: "Découvrez comment l'accompagnement a transformé sa présence en ligne.",
  },
  {
    src: 'https://res.cloudinary.com/drpkjky6y/video/upload/v1781332373/testimony_2_wlhmby.mp4', //'/videos/testimony_2.mp4',
    title: 'Doctor',
    desc: 'Un professionnel de la santé qui brise les codes sur TikTok.',
  },
  {
    src: 'https://res.cloudinary.com/drpkjky6y/video/upload/v1781332506/testimony_3_dttqht.mp4', //'/videos/testimony_3.mp4',
    title: 'Étudiante France',
    desc: 'Des résultats exceptionnels appliqués depuis la France.',
  },
  {
    src: 'https://res.cloudinary.com/drpkjky6y/video/upload/v1781332446/testimony_4_pob5mj.mp4', //'videos/testimony_4.mp4',
    title: 'Étudiant B2B',
    desc: 'Comment créer une audience engagée en partant de zéro.',
  },
  {
    src: 'https://res.cloudinary.com/drpkjky6y/video/upload/v1781332354/testimony_5_y15sq9.mp4', //'/videos/testimony_5.mp4',
    title: 'Étudiante France (Suite)',
    desc: 'La méthode appliquée à un marché international avec succès.',
  },
];

export default function CaseStudies() {
  const sectionRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="relative section-padding overflow-hidden bg-[#fafafc]">
      {/* ── Background Orbs for Glassmorphism ── */}
      <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[#f472b6] opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="content-container relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase"
            style={{ background: 'rgba(255,59,111,0.08)', color: 'var(--color-primary)' }}
          >
            Témoignages Vidéo
          </div>
          <h2
            className="text-[clamp(28px,4.5vw,52px)] font-black leading-tight max-w-3xl mx-auto mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#0a0a0a' }}
          >
            Ils étaient à ta place.<br />
            <span style={{ color: 'var(--color-primary)' }}>Voici ce qui a changé.</span>
          </h2>
          <p className="text-[16px] text-body max-w-2xl mx-auto">
            Écoute les résultats concrets de ceux qui ont suivi le Mentorship VIP. Pas de théorie, que de la pratique et des chiffres.
          </p>
        </motion.div>

        {/* ── Video Slider ── */}
        <div className="relative">
          {/* Navigation arrows - desktop */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform hidden lg:flex"
            style={{ border: '1px solid rgba(255,59,111,0.1)' }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform hidden lg:flex"
            style={{ border: '1px solid rgba(255,59,111,0.1)' }}
          >
            <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
          </button>

          {/* Slider Container */}
          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
            .flex-nowrap::-webkit-scrollbar {
              display: none;
            }
          `}</style>
            {videos.map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="group relative w-[85vw] sm:w-[320px] lg:w-[350px] flex-shrink-0 snap-center rounded-[24px] overflow-hidden flex flex-col cursor-default transition-transform duration-500 hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(30px) saturate(2)',
                  WebkitBackdropFilter: 'blur(30px) saturate(2)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04), inset 0 1px 12px rgba(255, 255, 255, 0.6)',
                }}
              >
                {/* Video container */}
                <div className="relative w-full aspect-[9/16] bg-black/5 overflow-hidden">
                  <video
                    controls
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  >
                    <source src={video.src} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>

                {/* Text Content */}
                <div className="p-6 relative">
                  {/* Decorative line top */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,59,111,0.3), transparent)' }}
                  />

                  <h3
                    className="text-[18px] font-bold mb-2 text-dark"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {video.title}
                  </h3>
                  <p className="text-[14px] text-body leading-relaxed">
                    {video.desc}
                  </p>

                  {/* Decorative icon bottom */}
                  <div className="mt-4 flex justify-end">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[rgba(255,59,111,0.1)]">
                      <PlayCircle className="w-5 h-5 text-body/40 group-hover:text-[var(--color-primary)] transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
