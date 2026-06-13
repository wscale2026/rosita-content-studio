import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Banknote, Video } from 'lucide-react';

/* ─── Design Direction: "Luxury Editorial Data" ─────────────────────────
   Aesthetic: Each metric is a hero — oversized, typographic, with a
   circular SVG ring that fills on scroll-reveal. Cards use deep glass
   with a strong pink tint, asymmetric layout, and staggered entrance.
   The memorable anchor: animated SVG rings + counter sync.
─────────────────────────────────────────────────────────────────────── */

function useCounter(target: number, active: boolean, delay: number) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (active && !done.current) {
      done.current = true;
      const duration = 2200;
      const start = performance.now();
      const run = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4); // ease-out quartic
        setCount(Math.floor(e * target));
        if (p < 1) requestAnimationFrame(run);
      };
      setTimeout(() => requestAnimationFrame(run), delay * 1000);
    }
  }, [active, target, delay]);
  return count;
}

interface RingProps { progress: number; size: number; stroke: number; color: string }
function Ring({ progress, size, stroke, color }: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 2.2s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </svg>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  prefix?: string;
  value: string;
  displayCount: number;
  suffix?: string;
  label: string;
  sublabel: string;
  progress: number; // 0–1 for the ring
  delay: number;
  isInView: boolean;
  accent: string;
  size?: 'large' | 'medium';
}

function MetricCard({
  icon: Icon, prefix, displayCount, suffix, label, sublabel,
  progress, delay, isInView, accent, size = 'medium'
}: MetricCardProps) {
  const [ringProg, setRingProg] = useState(0);
  useEffect(() => {
    if (isInView) {
      setTimeout(() => setRingProg(progress), delay * 1000 + 200);
    }
  }, [isInView, progress, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[28px] p-8 overflow-hidden flex flex-col justify-between group"
      style={{
        background: 'rgba(255, 248, 253, 0.72)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 40px rgba(255,59,111,0.08), 0 1px 0 rgba(255,255,255,0.95) inset',
        minHeight: size === 'large' ? '320px' : '280px',
      }}
    >
      {/* Decorative background ring (large, faded) */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transition-all duration-500 group-hover:opacity-20 group-hover:scale-105">
        <Ring progress={1} size={220} stroke={30} color={accent} />
      </div>

      {/* Top row: icon + ring */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {/* Animated progress ring */}
        <div style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          <Ring progress={ringProg} size={52} stroke={4} color={accent} />
        </div>
      </div>

      {/* Hero number */}
      <div className="flex-1">
        <div
          className="font-black leading-none mb-3 tracking-tight"
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            color: '#0a0a0a',
            fontSize: size === 'large' ? 'clamp(52px, 6vw, 80px)' : 'clamp(40px, 4.5vw, 64px)',
          }}
        >
          {prefix}{isInView ? displayCount.toLocaleString() : '0'}{suffix}
        </div>
        <p className="text-[15px] font-semibold text-dark leading-snug mb-1">{label}</p>
        <p className="text-[13px] text-body leading-relaxed">{sublabel}</p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: delay + 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-[2px] rounded-full mt-6 origin-left"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </motion.div>
  );
}

export default function Metrics() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const vues   = useCounter(1000,   isInView, 0);
  const ca     = useCounter(350000, isInView, 0.15);
  const videos = useCounter(10,     isInView, 0.3);

  const primaryColor = 'var(--color-primary)';

  return (
    <section ref={sectionRef} className="bg-alt section-padding overflow-hidden relative">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-bg)"></path>
        </svg>
      </div>
      <div className="content-container">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-[2px] w-10 rounded-full"
              style={{ background: primaryColor }}
            />
            <span
              className="text-[12px] font-bold tracking-[0.18em] uppercase"
              style={{ color: primaryColor }}
            >
              Résultats prouvés
            </span>
          </div>
          <h2
            className="text-[clamp(26px,4vw,48px)] font-black leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Une fois ROSYTA CONTENT STUDIO en place {' '}
            <em style={{ color: primaryColor, fontStyle: 'italic' }}>
              voilà ce que nos clientes génèrent
            </em>
          </h2>
        </motion.div>

        {/* ── Asymmetric metric grid ── */}
        {/* Desktop: 1 large card left + 2 stacked right */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Card 1 — Vues (large) */}
          <div className="lg:col-span-1">
            <MetricCard
              icon={TrendingUp}
              prefix="+"
              value="+1000"
              displayCount={vues}
              label="vues en moyenne"
              sublabel="dès la 2e semaine de programme, sans budget pub"
              progress={0.75}
              delay={0}
              isInView={isInView}
              accent={primaryColor}
              size="large"
            />
          </div>

          {/* Card 2 — CA */}
          <div className="lg:col-span-1">
            <MetricCard
              icon={Banknote}
              value="350 000"
              displayCount={ca}
              suffix=" CFA"
              label="de CA supplémentaire"
              sublabel="pour 60% des clientes dans les 3 premiers mois"
              progress={0.88}
              delay={0.15}
              isInView={isInView}
              accent={primaryColor}
              size="large"
            />
          </div>

          {/* Card 3 — Vidéos */}
          <div className="lg:col-span-1">
            <MetricCard
              icon={Video}
              value="10"
              displayCount={videos}
              suffix=" vidéos"
              label="produites en 1 mois"
              sublabel="prêtes à poster, montées, scriptées, filmées livrées"
              progress={0.95}
              delay={0.3}
              isInView={isInView}
              accent={primaryColor}
              size="large"
            />
          </div>

        </div>

        {/* ── Footnote ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.55 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[12px] italic text-body text-center mt-10"
        >
          Moyenne relevée chez les clientes du programme en 2025  résultats individuels variables.
        </motion.p>

      </div>
    </section>
  );
}
