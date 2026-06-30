'use client'

import Image from 'next/image'
import Link from 'next/link'

const list = [
  { src: '/images/hero-armani.jpg', accent: '#d4722a', name: 'Stronger With You Intensely', brand: 'Emporio Armani', tag: 'Homme · EDP', href: '/boutique?type=homme' },
  { src: '/images/hero-burberry.jpg', accent: '#c9a0b4', name: 'Burberry Her Elixir', brand: 'Burberry', tag: 'Femme · EDP', href: '/boutique?type=femme' },
  { src: '/images/hero-jbg.jpg', accent: '#3aaa76', name: 'Le Beau', brand: 'Jean Paul Gaultier', tag: 'Homme · EDT', href: '/boutique?type=homme' },
]

export function Showcase() {
  return (
    <section style={{ background: 'var(--bg-base)', padding: '4.5rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: 'var(--gold-mid)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Nos Coups de Cœur
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.6rem)', color: 'var(--fg-primary)' }}>
            Fragrances Iconiques
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {list.map((p, i) => (
            <Link key={i} href={p.href} className="group"
              style={{ textDecoration: 'none', display: 'block', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border-gold)', background: 'var(--bg-surface)', transition: 'transform 0.35s ease, box-shadow 0.35s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${p.accent}25` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
              <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                <Image src={p.src} alt={p.name} fill className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  style={{ transition: 'transform 0.6s ease' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${p.accent}30 0%, transparent 50%)`, opacity: 0, transition: 'opacity 0.35s ease' }}
                  className="group-hover:opacity-100" />
              </div>
              <div style={{ padding: '1.1rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: p.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{p.brand}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--fg-primary)', marginBottom: '0.3rem', lineHeight: 1.2 }}>
                  {p.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>{p.tag}</p>
                <div style={{ height: 1, width: 0, background: p.accent, marginTop: '0.85rem', borderRadius: 1, transition: 'width 0.35s ease' }} className="group-hover:w-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
