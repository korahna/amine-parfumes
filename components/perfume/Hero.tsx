'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface HeroSlide {
  id: string
  src: string
  name: string
  sub: string
  mood: string
  accent: string
  tag: string
}

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: '0', src: '/images/hero-armani.jpg', name: 'Stronger With You', sub: 'Intensely · Emporio Armani', mood: 'Chaud & Ambré', accent: '#d4722a', tag: 'Homme' },
  { id: '1', src: '/images/hero-burberry.jpg', name: 'Burberry Her', sub: 'Elixir de Parfum', mood: 'Floral & Fruité', accent: '#c9a0a0', tag: 'Femme' },
  { id: '2', src: '/images/hero-jbg.jpg', name: 'Le Beau', sub: 'Jean Paul Gaultier', mood: 'Boisé & Exotique', accent: '#3aaa76', tag: 'Homme' },
]

export function Hero({ slides }: { slides?: HeroSlide[] }) {
  const heroSlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES
  const count = heroSlides.length

  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTrans] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advance = useCallback((next: number) => {
    if (transitioning) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setTrans(true)
    setPrev(active)
    setActive(next)
    setTimeout(() => { setPrev(null); setTrans(false) }, 700)
  }, [active, transitioning])

  useEffect(() => {
    timerRef.current = setTimeout(() => advance((active + 1) % count), 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, advance, count])

  const cur = heroSlides[active]
  const prv = prev !== null ? heroSlides[prev] : null

  return (
    <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#05060d' }}>
      {/* BG layers */}
      {heroSlides.map((p, i) => (
        <div key={p.id} style={{
          position: 'absolute', inset: 0, zIndex: i === active ? 1 : i === prev ? 2 : 0,
          opacity: i === active ? 1 : i === prev ? 0 : 0,
          transition: 'opacity 0.8s ease',
        }}>
          <Image src={p.src} alt="" fill priority={i === 0}
            className="object-cover"
            style={{ opacity: 0.18, transform: 'scale(1.05)' }}
            sizes="100vw"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(5,6,13,0.92) 0%, rgba(5,6,13,0.55) 55%, rgba(5,6,13,0.75) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 72% 50%, ${p.accent}20 0%, transparent 70%)` }} />
        </div>
      ))}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full" style={{ position: 'relative', zIndex: 10, paddingTop: '5.5rem', paddingBottom: '4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', alignItems: 'center' }}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* LEFT — text */}
          <div>
            <div key={`tag-${active}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem', animation: 'hFadeUp 0.55s ease forwards', opacity: 0 }}>
              <div style={{ height: 1, width: 36, background: `linear-gradient(90deg, transparent, ${cur.accent})` }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.35em', color: cur.accent, textTransform: 'uppercase' }}>
                {cur.tag} · {cur.mood}
              </span>
            </div>

            <h1 key={`h1-${active}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem,6.5vw,4.8rem)', color: '#fdf8ee', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '0.4rem', animation: 'hFadeUp 0.55s ease 0.1s forwards', opacity: 0 }}>
              {cur.name}
            </h1>

            <p key={`sub-${active}`} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem,2vw,1.35rem)', color: cur.accent, fontStyle: 'italic', marginBottom: '1.5rem', animation: 'hFadeUp 0.55s ease 0.18s forwards', opacity: 0 }}>
              {cur.sub}
            </p>

            <p key={`desc-${active}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(253,248,238,0.5)', lineHeight: 1.85, maxWidth: 380, marginBottom: '2rem', animation: 'hFadeUp 0.55s ease 0.26s forwards', opacity: 0 }}>
              Disponible maintenant dans notre boutique avec livraison partout au Maroc.
            </p>

            <div key={`cta-${active}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginBottom: '2rem', animation: 'hFadeUp 0.55s ease 0.34s forwards', opacity: 0 }}>
              <Link href="/boutique" className="btn-gold-filled" style={{ fontSize: '0.68rem' }}>
                Commander maintenant
              </Link>
              <Link href="/boutique" className="btn-gold" style={{ fontSize: '0.68rem' }}>
                <span>Voir la collection</span>
              </Link>
            </div>

            {/* Trust */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', text: 'Livraison Maroc' },
                { icon: '💵', text: 'Paiement livraison' },
                { icon: '✅', text: 'Authenticité' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>{b.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'rgba(253,248,238,0.28)', letterSpacing: '0.08em' }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — bottle image */}
          <div className="hidden lg:flex" style={{ position: 'relative', height: 500, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: `1px solid ${cur.accent}20`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'border-color 0.8s' }} />
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${cur.accent}18 0%, transparent 70%)`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'background 0.8s' }} />

            {prv && (
              <div style={{ position: 'absolute', zIndex: 1, animation: 'bOut 0.7s ease forwards' }}>
                <div style={{ width: 320, height: 400, position: 'relative' }}>
                  <Image src={prv.src} alt={prv.name} fill className="object-contain"
                    style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.5))', borderRadius: 'var(--r-lg)' }} />
                </div>
              </div>
            )}

            <div key={`bottle-${active}`} style={{ position: 'relative', zIndex: 2, animation: 'bIn 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards', opacity: 0 }}>
              <div style={{ animation: 'bottleFloat 5s ease-in-out infinite', width: 320, height: 400, position: 'relative' }}>
                <Image src={cur.src} alt={cur.name} fill priority className="object-contain"
                  sizes="320px"
                  style={{ filter: `drop-shadow(0 32px 56px ${cur.accent}50)`, borderRadius: 'var(--r-lg)' }} />
              </div>
            </div>

            <div key={`card-${active}`} style={{
              position: 'absolute', bottom: 24, right: 0,
              background: 'rgba(5,6,13,0.88)',
              border: `1px solid ${cur.accent}25`,
              padding: '0.7rem 1.1rem', borderRadius: 8,
              animation: 'hFadeUp 0.6s ease 0.5s forwards', opacity: 0, minWidth: 150,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: cur.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 2 }}>{cur.mood}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fdf8ee' }}>{cur.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => advance(i)}
            style={{ width: i === active ? 28 : 7, height: 7, borderRadius: 4, background: i === active ? cur.accent : 'rgba(253,248,238,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.35s ease', padding: 0 }} />
        ))}
      </div>

      {/* Arrow nav */}
      {(['prev', 'next'] as const).map((dir) => (
        <button key={dir} onClick={() => advance(dir === 'next' ? (active + 1) % count : (active - 1 + count) % count)}
          className="hidden sm:flex"
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [dir === 'prev' ? 'left' : 'right']: '1.25rem',
            zIndex: 20, width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(5,6,13,0.7)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>
          {dir === 'prev' ? '‹' : '›'}
        </button>
      ))}
    </section>
  )
}
