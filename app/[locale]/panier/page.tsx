'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'

const SHIPPING_COST = 30
const FREE_ABOVE = 500

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const subtotal = totalPrice()
  const shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_COST
  const grand = subtotal + shipping

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--fg-subtle)', opacity: 0.3 }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--fg-muted)', fontStyle: 'italic', marginBottom: '2rem' }}>Votre panier est vide</p>
          <Link href="/boutique" className="btn-gold"><span>Continuer mes achats</span></Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--fg-primary)', marginBottom: '2.5rem' }}>Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.volume ?? ''}`} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ width: 80, height: 96, position: 'relative', flexShrink: 0, overflow: 'hidden', borderRadius: 4, background: 'var(--bg-raised)' }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--fg-primary)', marginBottom: 4 }}>{item.name}</h3>
                  {item.brand && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--gold-700)', marginBottom: 8 }}>{item.brand}</p>}
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--gold-400)', fontWeight: 600 }}>{item.price.toFixed(2)} MAD</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.volume)}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={12} /></button>
                      <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.volume)}
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.volume)}
                      style={{ color: 'var(--fg-subtle)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                      className="hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg-muted)' }}>{(item.price * item.quantity).toFixed(2)} MAD</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--fg-primary)', marginBottom: '1.5rem' }}>Récapitulatif</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--fg-muted)' }}>Sous-total</span>
                <span style={{ color: 'var(--fg-muted)' }}>{subtotal.toFixed(2)} MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--fg-muted)' }}>Livraison</span>
                <span style={{ color: shipping === 0 ? 'var(--gold-500)' : 'var(--fg-muted)' }}>{shipping === 0 ? 'Livraison offerte' : `${shipping.toFixed(2)} MAD`}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>
                  Ajoutez {(FREE_ABOVE - subtotal).toFixed(0)} MAD pour la livraison gratuite
                </p>
              )}
              <div className="divider-gold" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                <span style={{ color: 'var(--fg-muted)' }}>Total</span>
                <span style={{ color: 'var(--gold-400)', fontSize: '1.1rem' }}>{grand.toFixed(2)} MAD</span>
              </div>
            </div>
            <Link href="/commande" className="btn-gold-filled" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Commander
            </Link>
            <Link href="/boutique" style={{ marginTop: 12, display: 'block', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', textDecoration: 'none' }}
              className="hover:text-[var(--gold-400)] transition-colors">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
