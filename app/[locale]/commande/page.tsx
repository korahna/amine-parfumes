'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { placeOrder } from '@/app/actions/order'

const SHIPPING_COST = 30
const FREE_ABOVE = 500

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', wilaya: '' })

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (items.length === 0) {
    router.push('/panier')
    return null
  }

  const subtotal = totalPrice()
  const shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_COST
  const grand = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.city || !form.address) return
    setLoading(true)

    const orderItems = items.map((item) => ({
      productId: item.productId, name: item.name, brand: item.brand, price: item.price, quantity: item.quantity,
    }))

    const result = await placeOrder({
      items: orderItems, customerName: form.name, customerPhone: form.phone,
      address: form.address, city: form.city, wilaya: form.wilaya, total: grand,
    })

    if (result.success) {
      clearCart()
      router.push('/confirmation')
    } else {
      setLoading(false)
      alert('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--fg-primary)', marginBottom: '2.5rem' }}>Finaliser la commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '1.5rem' }}>Informations de livraison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Nom complet *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input-luxury" required />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Téléphone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="input-luxury" type="tel" required />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Wilaya *</label>
                    <input name="wilaya" value={form.wilaya} onChange={handleChange} className="input-luxury" required />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Ville *</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input-luxury" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Adresse *</label>
                    <input name="address" value={form.address} onChange={handleChange} className="input-luxury" required />
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '1rem' }}>Mode de paiement</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-mid)', padding: '1rem', borderRadius: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold-400)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>💵 Paiement à la livraison</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg-primary)', marginBottom: '1.5rem' }}>Récapitulatif</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1rem', maxHeight: 256, overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={`${item.productId}-${item.volume ?? ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 56, position: 'relative', flexShrink: 0, borderRadius: 4, overflow: 'hidden', background: 'var(--bg-raised)' }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: 'var(--gold-400)', color: '#080b14', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--gold-500)' }}>{(item.price * item.quantity).toFixed(2)} MAD</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider-gold" style={{ margin: '1rem 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--fg-muted)' }}>Sous-total</span>
                  <span>{subtotal.toFixed(2)} MAD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--fg-muted)' }}>Livraison</span>
                  <span style={{ color: shipping === 0 ? 'var(--gold-500)' : '' }}>{shipping === 0 ? 'Livraison offerte' : `${shipping.toFixed(2)} MAD`}</span>
                </div>
                <div className="divider-gold" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--gold-400)' }}>{grand.toFixed(2)} MAD</span>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold-filled" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Traitement...' : 'Passer la commande'}
              </button>
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginTop: 12 }}>
                Paiement à la livraison
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
