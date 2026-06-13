/**
 * Configuration des liens de paiement GeniusPay
 * ─────────────────────────────────────────────
 * Remplace chaque URL par le lien GeniusPay correspondant.
 * Format GeniusPay : https://pay.geniuspay.io/checkout/xxxxxxxx
 */

export const PAYMENT_LINKS = {
  /** Guide : Développe ton Contenu — 75 000 CFA */
  guide: 'https://pay.geniuspay.io/checkout/PLACEHOLDER_GUIDE',

  /** VIP Mentorship 1 mois — 350 000 CFA */
  mentorship: 'https://pay.geniuspay.io/checkout/PLACEHOLDER_MENTORSHIP',

  /** Formation Intensive 1 jour — 150 000 CFA */
  intensive: 'https://pay.geniuspay.io/checkout/PLACEHOLDER_INTENSIVE',

  /** Gestion 100% (sur devis) — contact direct */
  gestion: 'https://pay.geniuspay.io/checkout/PLACEHOLDER_GESTION',
} as const;

/** Ouvre le modal de checkout (intercepte le paiement) */
export function openPayment(offer: keyof typeof PAYMENT_LINKS) {
  const event = new CustomEvent('open-checkout', { detail: { offer } });
  window.dispatchEvent(event);
}
