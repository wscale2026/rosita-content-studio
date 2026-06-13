import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Video, Eye, Users, ExternalLink } from 'lucide-react';

const metrics = [
  { icon: Video, value: '200+', label: 'vidéos publiées' },
  { icon: Eye, value: '1,5M', label: 'de vues totales' },
  { icon: Users, value: '25K', label: 'abonnés' },
];

export default function OrganicProof() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-white py-[clamp(50px,6vw,80px)]">
      <div className="content-container text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-[28px] font-extrabold mb-8"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          La chaîne TikTok de Rosyta – +100 000 vues par mois
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-10 mb-8">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              className="flex flex-col items-center gap-2"
            >
              <m.icon className="w-7 h-7" style={{ color: 'var(--color-primary)' }} />
              <span className="text-2xl font-bold text-dark">{m.value}</span>
              <span className="text-sm text-body">{m.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <ExternalLink className="w-4 h-4" />
            👉 Voir la chaîne TikTok
          </a>
        </motion.div>
      </div>
    </section>
  );
}
