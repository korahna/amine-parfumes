export default function ConditionsService() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2rem' }}>
          Conditions d&apos;utilisation
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.9 }}>
          <p style={{ marginBottom: '1.5rem' }}>Bienvenue sur Amine Parfumes. En passant commande sur notre site, vous acceptez les conditions suivantes.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>1. Commandes</h2>
          <p style={{ marginBottom: '1.5rem' }}>En passant commande, vous vous engagez à acheter les produits au prix indiqué et à fournir des informations correctes pour le traitement et la livraison. Les commandes sont confirmées une fois que le paiement est validé (paiement à la livraison).</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>2. Prix et paiement</h2>
          <p style={{ marginBottom: '1.5rem' }}>Tous les prix sont indiqués en dirhams marocains (MAD). Le paiement se fait à la livraison (cash on delivery).</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>3. Livraison</h2>
          <p style={{ marginBottom: '1.5rem' }}>La livraison est effectuée dans un délai de 24 à 72 heures. Nous livrons partout au Maroc avec des frais fixes de 30 MAD (gratuite à partir de 500 MAD).</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>4. Retours</h2>
          <p style={{ marginBottom: '1.5rem' }}>Vous disposez de 7 jours pour retourner un produit. Les frais de retour sont à la charge du client sauf si le produit est défectueux.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>5. Qualité</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous nous engageons à fournir des produits de haute qualité et authentiques.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>6. Contact</h2>
          <p>Pour toute question ou réclamation, contactez-nous par téléphone au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.</p>
        </div>
      </div>
    </div>
  )
}
