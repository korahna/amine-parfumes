'use client'

export function WhyUs() {
  const items = [
    { icon: '🚚', title: 'Livraison partout au Maroc', desc: 'Délai 24–72h' },
    { icon: '💵', title: 'Paiement à la livraison', desc: 'Payez en cash' },
    { icon: '🌹', title: 'Sélection haut de gamme', desc: 'Fragrances authentiques' },
  ]

  return (
    <section style={{ background: 'var(--bg-surface)', padding: '3.5rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {items.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: 28, display: 'block', marginBottom: '0.85rem' }}>{item.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold-mid)', marginBottom: '0.4rem' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
