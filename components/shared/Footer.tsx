'use client'

import Link from 'next/link'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }} className="mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-400)' }} className="text-2xl mb-3">
              Amine Parfumes
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-muted)' }} className="text-sm leading-relaxed max-w-xs">
              Des fragrances d&apos;exception, livrées chez vous.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" style={{ color: 'var(--fg-subtle)' }} className="hover:text-[var(--gold-400)] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" style={{ color: 'var(--fg-subtle)' }} className="hover:text-[var(--gold-400)] transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-600)' }} className="text-xs tracking-[0.2em] uppercase mb-5">
              Liens utiles
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/boutique', label: 'Catalogue' },
                { href: '/boutique?type=homme', label: 'Homme' },
                { href: '/boutique?type=femme', label: 'Femme' },
                { href: '/panier', label: 'Panier' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-muted)' }} className="text-sm hover:text-[var(--gold-400)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="divider-gold" style={{ margin: '0.5rem 0' }} />
              {[
                { href: '/politique-de-confidentialite', label: 'Politique de confidentialité' },
                { href: '/conditions-de-service', label: 'Conditions de service' },
                { href: '/politique-d-expedition', label: 'Politique d\'expédition' },
                { href: '/politique-de-retour', label: 'Politique de retour' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)' }} className="text-xs hover:text-[var(--gold-400)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-600)' }} className="text-xs tracking-[0.2em] uppercase mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
                <Phone size={14} style={{ color: 'var(--gold-600)' }} className="flex-shrink-0" />
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm">{process.env.NEXT_PUBLIC_PHONE || '+212 6XX XXX XXX'}</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
                <Mail size={14} style={{ color: 'var(--gold-600)' }} className="flex-shrink-0" />
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm">{process.env.NEXT_PUBLIC_EMAIL || 'contact@amineparfumes.ma'}</span>
              </li>
              <li className="flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
                <MapPin size={14} style={{ color: 'var(--gold-600)' }} className="flex-shrink-0" />
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm">Agadir, Maroc</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-2" style={{ color: 'var(--gold-700)' }}>
              <span className="text-lg">💳</span>
              <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs tracking-wider uppercase">
                Paiement à la livraison
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="divider-gold mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)' }} className="text-xs">
            © {year} Amine Parfumes – Tous droits réservés
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-700)' }} className="text-xs">
            Créations d&apos;Exception
          </p>
        </div>
      </div>
    </footer>
  )
}
