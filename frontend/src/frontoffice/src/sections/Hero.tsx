import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Mic, TrendingUp as TrendUp, Clock, Users, TrendingUp, Target } from 'lucide-react';
import { openPayment } from '../config/payments';
import KineticSculpture from '../components/three/KineticSculpture';

const springTransition = { type: 'spring', stiffness: 100, damping: 20 };

const avatars = [
  { src: '/images/avatar-sarah.jpg', name: 'Sarah' },
  { src: '/images/avatar-aissatou.jpg', name: 'Aïssatou' },
  { src: '/images/avatar-koffi.jpg', name: 'Koffi' },
  { src: '/images/avatar-nadege.jpg', name: 'Nadège' },
];

const reassurance = [
  { icon: Users, text: '**Accompagnement réel**Du done‑with‑you, pas une formation en replay.' },
  { icon: TrendingUp, text: '**+15 000 clientes**Passées de 200‑300 vues à +1000 vues en moins d\'1 mois.' },
  { icon: Target, text: '**Tu arrêtes de deviner**Une stratégie claire, reproductible, sans prise de tête.' },
];

const successStories = [
  { avatar: '/images/avatar-sarah.jpg', name: 'Sarah', niche: 'E-commerce', views: '+50k vues', time: '14 Jours' },
  { avatar: '/images/avatar-aissatou.jpg', name: 'Aïssatou', niche: 'Coach sportive', views: '+10k abonnés', time: '21 Jours' },
  { avatar: '/images/avatar-koffi.jpg', name: 'Koffi', niche: 'Restauration', views: '+150% CA', time: '1 Mois' },
  { avatar: '/images/avatar-nadege.jpg', name: 'Nadège', niche: 'Salon de coiffure', views: '20 rdv/sem.', time: '7 Jours' },
];

// ── Snap Ticker: enters fast → pauses to read → exits fast ──────────────────
type ReassuranceItem = { icon: React.ElementType; text: string };
function SnapTicker({ items }: { items: ReassuranceItem[] }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'enter') {
      // After quick entry (400ms), switch to visible
      timer = setTimeout(() => setPhase('visible'), 400);
    } else if (phase === 'visible') {
      // Stay visible for 2.5s, then exit
      timer = setTimeout(() => setPhase('exit'), 2500);
    } else {
      // After quick exit (350ms), move to next item and re-enter
      timer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setPhase('enter');
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [phase, items.length]);

  const variants = {
    enter: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 35 } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } },
  };

  const item = items[index];
  const html = item.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark font-bold text-[13px] block mb-1 leading-tight">$1</strong>');

  return (
    <div className="w-full overflow-hidden md:hidden mb-5 mt-2 relative h-[85px] flex items-center justify-center">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={index}
          variants={variants}
          initial="enter"
          animate="visible"
          exit="exit"
          className="absolute text-[12px] text-body leading-snug text-center w-full px-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden pt-[5px] pb-24">
      {/* 3D Sculpture Background */}
      <KineticSculpture />

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 130% at 50% -10%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.7) 100%)',
        }}
      />

      <div className="relative z-[2] content-container flex flex-col items-center min-h-[calc(100dvh-120px)]">
        {/* Top Center Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-[960px] mx-auto w-full pt-4 sm:pt-14">

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, ...springTransition }}
            className="flex sm:inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 glass-panel rounded-2xl sm:rounded-full px-4 py-2 sm:p-2 sm:pr-5 mx-auto max-w-[90%] sm:max-w-none"
          >
            <div className="flex -space-x-2">
              {avatars.map((a, i) => (
                <div key={i} className="relative group">
                  <img
                    src={a.src}
                    alt={a.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover shadow-sm transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-dark tracking-tight text-center leading-tight">
              +94% de satisfaction sur +1000 clientes accompagnées depuis 2021
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...springTransition }}
            className="text-[clamp(20px,6vw,48px)] px-2 font-extrabold leading-[1.1] mb-2 text-dark"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Pour les femmes entrepreneures qui n'arrivent plus à se démarquer.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springTransition }}
            className="text-[clamp(20px,6vw,48px)] px-2 font-extrabold leading-[1.1] mb-4 sm:mb-5 text-gradient"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Explose sur TikTok même si tu détestes te filmer.
          </motion.h1>

          {/* Mobile Snap Ticker (Small screens only) */}
          <SnapTicker items={reassurance} />

          {/* Desktop Static Layout (Centered) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...springTransition }}
            className="hidden md:flex flex-row items-center justify-center w-full mb-8 py-5"
          >
            {reassurance.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, ...springTransition }}
                className={`flex flex-col items-center text-center flex-1 px-4 ${i !== 0 ? 'border-l border-border/50' : ''}`}
              >
                <p
                  className="text-[14px] text-body leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark font-bold text-[15px] block mb-2">$1</strong>') }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/*<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, ...springTransition }}
            className="mb-10 flex flex-col items-center"
          >
            <button
              onClick={() => openPayment('mentorship')}
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-5 py-3.5 sm:px-8 sm:py-4 rounded-[20px] sm:rounded-full text-white text-[13px] sm:text-[16px] font-bold transition-all hover:scale-105 shadow-[0_8px_30px_rgba(255,59,111,0.25)] w-[90%] sm:w-auto min-w-[280px] sm:min-w-[320px] mx-auto"
              style={{ background: 'var(--color-primary)' }}
            >
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="leading-tight text-center">Je m'inscris <span className="inline-block">— 350 000 CFA</span></span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-1" />
              </div>
            </button>
            <p className="text-[13px] font-medium text-body mt-3">
              Paiement sécurisé via GeniusPay · Wave · Stripe · 2x sans frais
            </p>
          </motion.div>*/}
        </div>

        {/* Bottom Grid: Video + Results */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, ...springTransition }}
          className="h-[400px] w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mx-auto items-stretch"
        >
          {/* Left: Video — Liquid Glass container */}
          <div
            className="hidden md:block relative w-full aspect-[4/3] rounded-[32px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(2px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(2px) saturate(1.4)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.18), 0 1.5px 0 rgba(255,255,255,0.6) inset, 0 -1px 0 rgba(0,0,0,0.08) inset',
              border: '1px solid rgba(255,255,255,0.45)',
            }}
          >
            {/* Inner glass shine — top reflection */}
            <div
              className="absolute top-0 left-0 right-0 h-[40%] z-10 pointer-events-none rounded-t-[32px]"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, transparent 100%)',
              }}
            />
            {/* Badge — Liquid Glass pill */}
            <div
              className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(20px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(255,59,111,0.4)' }}
              >
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-dark">Rosyta Content Studio</span>
            </div>
            <img
              src="/images/hero-rosyta.jpg"
              alt="Rosyta Content Studio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Infinite Auto-Scroll Results */}
          <div
            className="relative overflow-hidden w-full h-full rounded-[32px] p-3 bg-white"
          >
            {/* Top fade */}
            <div
              className="absolute top-0 left-0 right-0 h-10 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, transparent 100%)' }}
            />
            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-10 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%)' }}
            />

            {/* Scrolling track — duplicated for seamless loop */}
            <motion.div
              className="flex flex-col gap-3"
              animate={{ y: ['0%', '-50%'] }}
              transition={{
                duration: 8,
                ease: 'linear',
                repeat: Infinity,
              }}
              style={{ willChange: 'transform' }}
              whileHover={{ animationPlayState: 'paused' } as any}
            >
              {[...successStories, ...successStories].map((story, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-3 px-3 py-3 sm:px-4 flex-shrink-0"
                  style={{
                    background: 'rgba(255, 240, 245, 0.55)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 200, 220, 0.35)',
                  }}
                >
                  {/* Avatar */}
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                  />

                  {/* Left: Name + Niche */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-black text-dark text-[14px] sm:text-[15px] leading-tight truncate">{story.name}</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold truncate" style={{ color: 'var(--color-primary)' }}>{story.niche}</span>
                  </div>

                  {/* Right: Metric + Time + Desc */}
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-right pl-2">
                    <div className="flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                      <TrendUp className="w-3 h-3" />
                      <span className="font-black text-[12px] sm:text-[13px]">{story.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-2.5 h-2.5" />
                      <span className="text-[9px] sm:text-[10px] font-medium">{story.time}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 italic leading-tight max-w-[100px] sm:max-w-[130px] truncate">{story.desc}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile CTA (Below Grid) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 400, damping: 30 }}
          className="flex flex-col items-center mt-4 sm:mt-10 w-full"
        >
          <button
            onClick={() => openPayment('mentorship')}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-primary text-white text-[11px] sm:text-[13px] font-semibold hover:bg-primary/80 transition-colors shadow-lg"
          >
            Je m'inscris maintenant
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 shrink-0">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
