export default function PolitiqueConfidentialite() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'var(--fg-primary)', marginBottom: '2rem' }}>
          Politique de confidentialité
        </h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-muted)', lineHeight: 1.9 }}>
          <p style={{ marginBottom: '1.5rem' }}>Chez Amine Parfumes, nous accordons une grande importance à la confidentialité de vos données personnelles.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>1. Collecte des données</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous collectons uniquement les informations nécessaires pour le traitement de vos commandes : nom, prénom, adresse de livraison, numéro de téléphone et adresse email.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>2. Utilisation des données</h2>
          <p style={{ marginBottom: '1.5rem' }}>Vos informations sont utilisées pour traiter et expédiér vos commandes, vous informer sur le statut de votre commande, et améliorer notre service client.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>3. Sécurité</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre toute perte, accès non autorisé, ou utilisation abusive.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>4. Partage des données</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous ne partageons jamais vos informations personnelles avec des tiers, sauf en cas d&apos;obligation légale.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>5. Cookies</h2>
          <p style={{ marginBottom: '1.5rem' }}>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez choisir de les désactiver dans les paramètres de votre navigateur.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>6. Vos droits</h2>
          <p style={{ marginBottom: '1.5rem' }}>Vous avez le droit de consulter, modifier ou supprimer vos informations personnelles. Pour toute demande, veuillez nous contacter par téléphone au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.</p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '0.75rem' }}>7. Contact</h2>
          <p>Pour toute question concernant la confidentialité de vos informations, contactez-nous au {process.env.NEXT_PUBLIC_PHONE || '+212 769 045 089'}.</p>
        </div>
      </div>
    </div>
  )
}
