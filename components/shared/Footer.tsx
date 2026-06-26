import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0805] border-t border-[#2a2218]/30">
      <div className="max-w-[1440px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-[Cormorant_Garamond] italic text-2xl tracking-[0.15em] text-[#f0ead8]">
              amine.parfume
            </h3>
            <p className="mt-3 text-sm text-[#8a7d65] leading-relaxed max-w-xs">
              L&apos;art du parfum, soigneusement sélectionné pour les connaisseurs les plus exigeants.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#8a7d65] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/boutique', label: 'Boutique' },
                { href: '/boutique?type=decant', label: 'Décants' },
                { href: '/panier', label: 'Panier' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#8a7d65] hover:text-[#f0ead8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#8a7d65] mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-[#8a7d65]">
              <li>Maroc</li>
              <li>contact@amine-parfume.com</li>
              <li>+212 6 00 00 00 00</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#2a2218]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#8a7d65] tracking-wider">
            © {year} amine.parfume. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#8a7d65] tracking-wider">
              Paiement à la livraison
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
