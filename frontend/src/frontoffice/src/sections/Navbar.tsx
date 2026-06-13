import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { openPayment } from '../config/payments';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`sticky top-0 z-[1000] transition-all duration-300 ${
        scrolled 
          ? 'glass-nav shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2' 
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="content-container flex items-center justify-between py-3">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/images/logo.jpeg"
            alt="ROSYTA CONTENT STUDIO"
            className="h-10 w-auto rounded-full"
          />
          <span className="hidden sm:block font-bold text-sm tracking-tight text-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
            ROSYTA CONTENT STUDIO
          </span>
        </button>

        {/* Social Proof */}
        <div className="hidden md:flex items-center gap-2 text-sm text-body">
          <span className="text-[#FBBF24] tracking-wider">{'\u2605'.repeat(5)}</span>
          <span className="font-medium">4,9/5</span>
          <span className="text-[var(--color-border)]"></span>
          <span className="font-semibold text-dark">+1000 clientes</span>
          <span className="text-body">accompagnées</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* CTA */}
        <button
          onClick={() => openPayment('mentorship')}
          className="btn-primary text-sm py-3 px-5 shrink-0"
        >
          <span className="hidden sm:inline">S'inscrire · 350 000 CFA</span>
          <span className="sm:hidden">S'inscrire</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
        </div>
      </div>
    </motion.nav>
  );
}
