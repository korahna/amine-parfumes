'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { placeOrder } from '@/app/actions/order'

function buildWhatsAppUrl(items: ReturnType<typeof useCartStore.getState>['items'], total: number, customer: { name: string; phone: string; wilaya: string; city: string; address: string }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'
  const lines = [
    `*Nouvelle commande — amine.parfume*`,
    ``,
    ...items.map((item) => `• ${item.brand} — ${item.name} (${item.type === 'decant' ? 'Échantillon' : 'Flacon'}) x${item.quantity} — ${(item.price * item.quantity).toLocaleString('fr-MA')} MAD`),
    ``,
    `*Total: ${total.toLocaleString('fr-MA')} MAD*`,
    `*Paiement: À la livraison*`,
    ``,
    `*Client:* ${customer.name}`,
    `*Tél:* ${customer.phone}`,
    `*Wilaya:* ${customer.wilaya}`,
    `*Ville:* ${customer.city}`,
    `*Adresse:* ${customer.address}`,
  ]
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    wilaya: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setSubmitting(true)

    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      quantity: item.quantity,
    }))

    const result = await placeOrder({
      items: orderItems,
      customerName: form.name,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      wilaya: form.wilaya,
      total: totalPrice(),
    })

    if (result.success) {
      const whatsappUrl = buildWhatsAppUrl(items, totalPrice(), form)
      clearCart()
      window.location.href = whatsappUrl
    } else {
      setSubmitting(false)
      alert('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4">
          <div className="w-6 h-6" />
          <Link href="/" className="font-display-lg text-display-lg-mobile italic text-on-surface">
            amine.parfume
          </Link>
          <div className="w-6 h-6" />
        </header>
        <main className="flex-grow pt-24 pb-section-padding px-gutter max-w-container-max mx-auto w-full">
          <div className="text-center py-24">
            <p className="font-display-lg text-display-lg-mobile italic text-on-surface-variant">
              Votre panier est vide
            </p>
            <Link href="/boutique" className="mt-8 inline-block font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase tracking-[0.2em]">
              Découvrir la boutique
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4 transition-opacity duration-500">
        <Link href="/panier" aria-label="Retour au panier" className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
        </Link>
        <Link href="/" className="font-display-lg text-display-lg-mobile italic text-on-surface dark:text-on-surface tracking-tight">
          amine.parfume
        </Link>
        <div className="w-6 h-6" />
      </header>

      {/* Main Checkout Canvas */}
      <main className="flex-grow pt-24 pb-section-padding px-gutter md:px-0">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-stack-lg items-start">
          {/* Left Column: Checkout Form */}
          <div className="md:col-span-7 space-y-stack-md">
            <div className="space-y-stack-sm">
              <h1 className="font-headline-md text-headline-md font-arabic-headline">Finaliser la commande</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Veuillez entrer vos coordonnées pour la livraison.</p>
            </div>
            <form className="space-y-stack-md pt-stack-sm" onSubmit={handleSubmit}>
              <div className="space-y-stack-md">
                <div className="relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1" htmlFor="name">
                    Nom Complet
                  </label>
                  <input
                    className="input-underline w-full font-body-lg text-body-lg text-on-surface py-2 focus:ring-0"
                    id="name"
                    name="name"
                    placeholder="Votre nom complet"
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1" htmlFor="phone">
                    Numéro de Téléphone
                  </label>
                  <input
                    className="input-underline w-full font-body-lg text-body-lg text-on-surface py-2 focus:ring-0"
                    id="phone"
                    name="phone"
                    placeholder="+212 6 XX XX XX XX"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1" htmlFor="wilaya">
                    Wilaya
                  </label>
                  <input
                    className="input-underline w-full font-body-lg text-body-lg text-on-surface py-2 focus:ring-0"
                    id="wilaya"
                    name="wilaya"
                    placeholder="Votre wilaya"
                    required
                    type="text"
                    value={form.wilaya}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1" htmlFor="city">
                    Ville
                  </label>
                  <input
                    className="input-underline w-full font-body-lg text-body-lg text-on-surface py-2 focus:ring-0"
                    id="city"
                    name="city"
                    placeholder="Casablanca"
                    required
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1" htmlFor="address">
                    Adresse de Livraison
                  </label>
                  <input
                    className="input-underline w-full font-body-lg text-body-lg text-on-surface py-2 focus:ring-0"
                    id="address"
                    name="address"
                    placeholder="Avenue, Rue, Numéro"
                    required
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Payment Method Note */}
              <div className="mt-stack-lg p-stack-sm bg-surface-container-low rounded-DEFAULT border border-outline-variant flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                <div>
                  <h3 className="font-body-lg text-body-lg font-medium text-on-surface">Paiement à la livraison</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Vous paierez en espèces lors de la réception de votre commande.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-5 sticky top-32">
            <div className="glass-panel p-stack-md rounded-lg shadow-2xl space-y-stack-md relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/30 pb-4">Résumé</h2>
              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-surface-container-high rounded relative overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover opacity-80 mix-blend-luminosity"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-body-lg text-body-lg text-on-surface tracking-wide">{item.name}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.brand} - {item.type === 'decant' ? 'Échantillon' : 'Flacon'}</p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Qté: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body-lg text-body-lg text-primary">{(item.price * item.quantity).toLocaleString('fr-MA')} MAD</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="border-t border-outline-variant/30 pt-4 space-y-2">
                <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                  <span>Sous-total</span>
                  <span>{totalPrice().toLocaleString('fr-MA')} MAD</span>
                </div>
                <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                  <span>Livraison (Standard)</span>
                  <span>Gratuit</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">{totalPrice().toLocaleString('fr-MA')} MAD</span>
                </div>
              </div>
              {/* CTA Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-stack-md bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-caps text-label-caps uppercase py-5 px-8 transition-colors duration-500 tracking-widest relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{submitting ? 'Envoi en cours...' : 'Confirmer via WhatsApp'}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
              </button>
              <p className="text-center font-label-caps text-label-caps text-on-surface-variant mt-4 opacity-60">
                Paiement à la livraison
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
