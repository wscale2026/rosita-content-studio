import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';

const faqs = [
  {
    q: "Est-ce que c'est une formation ou un accompagnement ?",
    a: "C'est un accompagnement 1:1 en live. On travaille main dans la main pendant 1 mois. Tu ne regardes pas des vidéos seul(e) – on crée tes vidéos ensemble.",
  },
  {
    q: "Combien de temps par semaine dois-je consacrer ?",
    a: "Compte 3 à 5 heures par semaine : 1h de call avec Rosyta, 2-4h de tournage et montage. C'est intensif mais très concret.",
  },
  {
    q: "Je n'ai jamais tourné de vidéo, j'ai peur. C'est pour moi ?",
    a: "Oui, c'est exactement pour toi. On commence par des exercices de prise de confiance. Aucune de nos clientes n'était à l'aise au début.",
  },
  {
    q: "Pourquoi 350 000 CFA ?",
    a: "Parce que tu repars avec 10 vidéos pro, un système de contenu illimité, et des compétences pour toute ta vie. Compare à 12 mois à tâtonner – c'est 10x moins cher.",
  },
  {
    q: "Puis-je payer en plusieurs fois ?",
    a: "Oui, nous proposons un paiement en 2x sans frais via GeniusPay. Contacte‑nous pour les modalités.",
  },
  {
    q: "Quels résultats puis-je vraiment espérer ?",
    a: "Nos clientes passent en moyenne de 200-300 vues à 1000+ vues dès la 2e semaine. Certaines signent des contrats dès le 1er mois. Les résultats varient selon ton engagement.",
  },
  {
    q: "Que se passe-t-il après le mois ?",
    a: "Tu reprends le système seul(e) – tu as toutes les clés. Et tu peux continuer avec nous à la carte si besoin.",
  },
  {
    q: "Je veux parler à Rosyta avant de m'engager. C'est possible ?",
    a: "Oui : réserve un appel découverte gratuit de 15 min. On discute de ton business, et on voit si le programme est fait pour toi.",
  },
];

export default function FAQ() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="bg-alt section-padding relative overflow-hidden">
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-primary)"></path>
        </svg>
      </div>
      <div className="content-container max-w-[800px] relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-[clamp(24px,3.5vw,40px)] font-extrabold text-center mb-10"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Tu te poses sûrement ces questions
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-dark text-[15px] pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
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
                      {faq.a}
                    </p>
                    {i === 7 && (
                      <div className="px-5 pb-5">
                        <a
                          href="https://calendly.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          <Phone className="w-4 h-4" />
                          📞 Je réserve
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
