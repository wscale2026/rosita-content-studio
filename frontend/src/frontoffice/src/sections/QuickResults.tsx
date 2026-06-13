import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone } from 'lucide-react';

const results = [
  {
    avatar: '/images/avatar-sarah.jpg',
    name: 'Sarah',
    sector: 'salon de coiffure',
    bullets: ['📈 200→1500 vues / 2 semaines', '💇‍♀️ 3 clientes/semaine', '🎬 10 vidéos'],
  },
  {
    avatar: '/images/avatar-aissatou.jpg',
    name: 'Aïssatou',
    sector: 'coach',
    bullets: ['🎥 0→3 vidéos/semaine', '📞 5 leads/semaine', '💰 250K CFA contrat'],
  },
  {
    avatar: '/images/avatar-koffi.jpg',
    name: 'Koffi',
    sector: 'e-commerce',
    bullets: ['📈 300→2000 vues', '💰 8000 CFA ventes directes', '🔁 système clair'],
  },
  {
    avatar: '/images/avatar-nadege.jpg',
    name: 'Nadège',
    sector: 'e-commerce',
    bullets: ['🎥 10 vidéos produites', '🚀 500→2500 vues', '🤝 contrat B2B 250K'],
  },
];

export default function QuickResults() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="bg-white py-[clamp(50px,6vw,80px)]">
      <div className="content-container">
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-2xl p-7 border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-dark">{r.name}</p>
                  <p className="text-sm text-body">{r.sector}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {r.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-body">{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-body mb-4">Tout a commencé par un appel découverte gratuit.</p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Phone className="w-4 h-4" />
            📞 Je réserve mon appel
          </a>
        </motion.div>
      </div>
    </section>
  );
}
