'use client'

import Image from 'next/image'

const items = [
  { src: '/images/hero-armani.jpg', label: 'Stronger With You Intensely' },
  { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
  { src: '/images/hero-jbg.jpg', label: 'Le Beau · JPG' },
  { src: '/images/hero-armani.jpg', label: 'Stronger With You Intensely' },
  { src: '/images/hero-burberry.jpg', label: 'Burberry Her Elixir' },
  { src: '/images/hero-jbg.jpg', label: 'Le Beau · JPG' },
]

export function Marquee() {
  return (
    <div style={{ overflow: 'hidden', padding: '1.5rem 0', borderTop: '1px solid var(--border-gold)', borderBottom: '1px solid var(--border-gold)', background: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', gap: '2rem', animation: 'marqueeScroll 20s linear infinite', width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-gold)', flexShrink: 0 }}>
              <Image src={item.src} alt={item.label} fill className="object-cover" sizes="44px" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--fg-muted)', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
              {item.label}
            </span>
            <span style={{ color: 'var(--gold-mid)', opacity: 0.35, fontSize: '1rem' }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
