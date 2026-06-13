import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, Video, Globe, Star, Mic, Briefcase } from 'lucide-react';

/* ─── Design Direction: "Editorial Founder Story" ──────────────────────────
   Layout matching the reference image: Centered title, Image left, Text right.
   Clean, typography-focused, with subtle Liquid Glass accents.
───────────────────────────────────────────────────────────────────────── */

const metrics = [
  { icon: Award, label: "4 ans d'expérience", sub: 'TikTok business' },
  { icon: Users, label: '+1000 clientes', sub: 'accompagnées' },
  { icon: Video, label: '+5000 vidéos', sub: 'produites avec mon équipe' },
  { icon: Globe, label: 'Top 3', sub: "Afrique de l'Ouest" },
  { icon: Star, label: '94 %', sub: 'de satisfaction clients' },
];

const team = [
  {
    name: 'Mr Ogba',
    role: 'Lead Coach & Stratège',
    image: '/images/case-sarah.jpg',
    bullets: [
      'A une agence web autour de 150 000 €/an.',
      "Sportif de haut niveau. Rythme, constance, discipline, c'est ce qu'il installe chez les élèves chaque semaine."
    ]
  },
  {
    name: 'Cécilia',
    role: 'Coach',
    image: '/images/case-sarah.jpg',
    bullets: [
      'A une agence web autour de 150 000 €/an.',
      "Sportive de haut niveau. Rythme, constance, discipline, c'est ce qu'elle installe chez les élèves chaque semaine."
    ]
  },
  {
    name: 'Gaëtan',
    role: 'Coach',
    image: '/images/case-koffi.jpg',
    bullets: [
      'A une agence ads qui génère + 255 000 € /an',
      'Grosse expérience du marché en région parisienne'
    ]
  }
];

export default function Founder() {
  const sectionRef = useRef(null);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Auto-scroll logic for the Team section
  useEffect(() => {
    const interval = setInterval(() => {
      if (teamScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = teamScrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // If we are at the end (or very close), go back to start
        if (scrollLeft >= maxScroll - 10) {
          teamScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to the next card (card width + gap is approx 474px on desktop)
          teamScrollRef.current.scrollBy({ left: 474, behavior: 'smooth' });
        }
      }
    }, 3000); // scrolls every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative section-padding overflow-hidden bg-[#fafafc]">
      {/* ── Background Orbs for subtle depth ── */}
      <div className="absolute top-0 right-[20%] w-[400px] h-[400px] bg-[var(--color-primary)] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-[10%] w-[300px] h-[300px] bg-[#f472b6] opacity-[0.03] rounded-full blur-[80px] pointer-events-none" />

      <div className="content-container max-w-[1100px] relative z-10">
        
        {/* ── Main Title (From reference structure) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2
            className="text-[clamp(28px,4vw,48px)] font-black leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#0a0a0a' }}
          >
            Pourquoi je sais exactement <br className="hidden md:block" />
            <span style={{ color: 'var(--color-primary)' }}>ce que tu vis aujourd'hui</span>
          </h2>
        </motion.div>

        {/* ── Two Columns Layout ── */}
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-20 items-center">
          
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Image Container with subtle Glassmorphism frame */}
            <div 
              className="relative rounded-[32px] overflow-hidden p-2"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.04)',
              }}
            >
              <img
                src="/images/founder-rosyta.jpg"
                alt="Rosyta - Fondatrice de ROSYTA CONTENT STUDIO"
                className="w-full rounded-[24px] object-cover"
                style={{ height: '550px', objectPosition: 'center top' }}
              />
              
              {/* Floating Pill Badge (Mic + Name) like reference image */}
              <div 
                className="absolute bottom-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'var(--color-primary)', boxShadow: '0 8px 20px rgba(255,59,111,0.3)' }}
              >
                <Mic className="w-4 h-4 text-white" />
                <span className="text-[13px] font-bold text-white tracking-wide">Rosyta</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-[18px] font-bold text-dark mb-4">
              Je m'appelle Rosyta
            </h3>
            
            <div className="space-y-4 text-[15px] text-body leading-[1.8] mb-8">
              <p>
                Avant 2020, j'étais comme toi : je postais au hasard, je galérais à avoir 200 vues.
              </p>
              <p>
                Aujourd'hui, j'ai accompagné plus de 1000 femmes entrepreneurs à percer sur TikTok. Mon équipe et moi sommes classés Top 3 des stratèges contenu en Afrique de l'Ouest.
              </p>
            </div>

            <h3 className="text-[16px] font-bold text-dark mb-5">
              Depuis 4 ans, j'accompagne des créatrices.
            </h3>

            {/* Bullet Points List */}
            <ul className="space-y-4">
              {metrics.map((m, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-50 flex-shrink-0">
                    <m.icon className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <span className="text-[14px] text-body">
                    <strong className="text-dark font-semibold">{m.label}</strong> {m.sub}
                  </span>
                </motion.li>
              ))}
            </ul>

          </motion.div>
        </div>

        {/* ── Team Section ── */}
        <div className="mt-28">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center text-[clamp(24px,3.5vw,40px)] font-black mb-12"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#0a0a0a' }}
          >
            L'équipe derrière <span style={{ color: 'var(--color-primary)' }}>ROSYTA</span>
          </motion.h2>

          {/* Horizontal Scroll / Cards */}
          <div 
            ref={teamScrollRef}
            className="flex flex-nowrap overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide px-4 md:px-0" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
                className="flex-shrink-0 w-[85vw] sm:w-[450px] snap-center rounded-[28px] p-2 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Photo */}
                <div className="w-full h-[220px] sm:h-full sm:min-h-[160px] sm:w-[150px] flex-shrink-0 rounded-[22px] overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-center" />
                </div>
                
                {/* Details */}
                <div className="flex-1 px-4 pb-4 sm:px-0 sm:py-4 sm:pr-4 flex flex-col justify-center">
                  <h3 className="text-[22px] font-black text-dark leading-tight">{member.name}</h3>
                  <p className="text-[13px] font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{member.role}</p>
                  
                  <ul className="space-y-2.5">
                    {member.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
                        <span className="text-[13px] text-body leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination Dots (Visual placeholder) */}
          <div className="flex justify-center items-center gap-2 mt-2">
             {[0,1,2,3,4,5,6].map((dot, i) => (
               <div 
                 key={i} 
                 className={`h-2 rounded-full transition-all duration-300 ${i === 3 ? 'w-8' : 'w-2 bg-white/60'}`}
                 style={{ 
                   background: i === 3 ? 'var(--color-primary)' : 'rgba(255,255,255,0.8)',
                   boxShadow: i === 3 ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.1)'
                 }}
               />
             ))}
          </div>
        </div>

      </div>
    </section>
  );
}
