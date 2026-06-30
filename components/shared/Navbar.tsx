'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/boutique', label: 'Catalogue' },
    { href: '/boutique?type=homme', label: 'Homme' },
    { href: '/boutique?type=femme', label: 'Femme' },
    { href: '/boutique?type=decant', label: 'Décants' },
  ]

  const navBg = scrolled
    ? { background: '#080b14', borderColor: 'rgba(201,162,39,0.18)' }
    : { background: 'transparent', borderColor: 'transparent' }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${scrolled ? 'border-b' : ''}`}
        style={navBg}
      >
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <div className="w-9 h-9 relative rounded-full overflow-hidden" style={{ border: '1px solid rgba(201,162,39,0.25)' }}>
              <Image src="/images/logo.png" alt="Amine Parfumes" fill className="object-cover" />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-400)', fontSize: '1.05rem', lineHeight: 1, letterSpacing: '0.05em' }}>
                Amine
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-600)', fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 1 }}>
                Parfumes
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-5 flex-1 mx-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
                  className="hover:text-[var(--gold-400)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/panier" className="relative" style={{ color: 'var(--fg-muted)', display: 'flex', transition: 'color 0.15s' }} aria-label="Panier">
              <ShoppingBag size={18} className="hover:text-[var(--gold-400)]" />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: 'var(--gold-400)', color: '#080b14', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden" style={{ color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '1.25rem 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--fg-muted)', padding: '0.6rem 0.5rem', textDecoration: 'none', borderRadius: 4 }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
