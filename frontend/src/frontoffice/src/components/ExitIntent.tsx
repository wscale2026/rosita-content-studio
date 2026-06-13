import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ExitIntent() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
      setShow(true);
      sessionStorage.setItem('exitIntentShown', 'true');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setShow(false), 2000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShow(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-3xl p-8 md:p-10 max-w-[480px] w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          >
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-body" />
            </button>

            {!submitted ? (
              <>
                <h3
                  className="text-2xl font-bold mb-3 pr-8"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Attends — avant de partir, je t'offre les 2 guides gratuits
                </h3>
                <p className="text-[15px] text-body mb-6">
                  Pour savoir quoi poster demain matin. Aucun achat nécessaire.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Ton email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Recevoir mes guides
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">C'est envoyé !</h3>
                <p className="text-sm text-body">
                  Vérifie ta boîte mail (et tes spams) pour recevoir tes guides.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
