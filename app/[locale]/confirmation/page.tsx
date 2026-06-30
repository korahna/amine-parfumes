import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-md mx-auto px-4 py-20" style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <CheckCircle2 size={40} style={{ color: 'var(--gold-400)' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--fg-primary)', marginBottom: '1rem' }}>
          Commande confirmée !
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
          Merci pour votre commande. Nous vous contacterons sous 24h pour confirmer la livraison.
        </p>
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2.5rem' }}>
          <span style={{ fontSize: 18 }}>🚚</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>Paiement à la livraison — Livraison gratuite</span>
        </div>
        <div>
          <Link href="/boutique" className="btn-gold"><span>Continuer vos achats</span></Link>
        </div>
      </div>
    </div>
  )
}
