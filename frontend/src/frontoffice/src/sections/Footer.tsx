export default function Footer() {
  return (
    <footer className="py-8 px-6 relative overflow-hidden" style={{ background: 'var(--color-dark)' }}>
      {/* Premium Shape Divider (Top Curve) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0" style={{ transform: 'translateY(-1px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[40px]">
          <path d="M0,0 C300,120 900,120 1200,0 L1200,0 L0,0 Z" fill="var(--color-dark-surface)"></path>
        </svg>
      </div>
      <div className="content-container text-center relative z-10">
        <p className="text-sm text-white mb-3" style={{ opacity: 0.8 }}>
          © 2026 ROSYTA CONTENT STUDIO – Tous droits réservés.
        </p>
        <div className="flex items-center justify-center gap-4 mb-3">
          <a
            href="#"
            className="text-[13px] transition-opacity hover:opacity-100"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Mentions légales
          </a>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <a
            href="#"
            className="text-[13px] transition-opacity hover:opacity-100"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Politique de confidentialité
          </a>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Design par WSCALE
        </p>
      </div>
    </footer>
  );
}
