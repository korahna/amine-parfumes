export default function PolitiqueExpedition() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2rem' }}>
          Politique d&apos;expédition
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.9 }}>
          <p style={{ marginBottom: '1.5rem' }}>Chez Amine Parfumes, nous nous engageons à expédier vos commandes dans les meilleurs délais.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>1. Délais d&apos;expédition</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous expédions toutes les commandes dans un délai de 24 à 72 heures. Les délais peuvent légèrement varier selon votre emplacement ou en cas de circonstances exceptionnelles.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>2. Frais de livraison</h2>
          <p style={{ marginBottom: '1.5rem' }}>Les frais de livraison sont de 30 MAD. La livraison est gratuite pour toute commande supérieure à 500 MAD.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>3. Zone de livraison</h2>
          <p style={{ marginBottom: '1.5rem' }}>Livraison disponible partout au Maroc.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>4. Paiement</h2>
          <p style={{ marginBottom: '1.5rem' }}>Le paiement s&apos;effectue à la livraison (cash on delivery).</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>5. Suivi</h2>
          <p style={{ marginBottom: '1.5rem' }}>Une fois votre commande expédiée, vous recevrez un message de confirmation avec les détails de votre commande.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>6. Contact</h2>
          <p>En cas de problème ou de retard de livraison, contactez notre service client au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.</p>
        </div>
      </div>
    </div>
  )
}
