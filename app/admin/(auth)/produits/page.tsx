'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, Check, X, Pencil, Trash2 } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  brand: string
  type: 'full' | 'decant' | 'pack'
  price: number
  volume: number | null
  images: string[]
  in_stock: boolean
  featured: boolean
  category: string | null
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const toggleStock = async (productId: string, currentStock: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from('products').update({ in_stock: !currentStock }).eq('id', productId)
    if (!error) setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, in_stock: !currentStock } : p)))
  }

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from('products').update({ featured: !currentFeatured }).eq('id', productId)
    if (!error) setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, featured: !currentFeatured } : p)))
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const card: React.CSSProperties = { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'opacity 0.2s' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Produits</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>
            {products.length} produit{products.length !== 1 ? 's' : ''} en catalogue
          </p>
        </div>
        <Link href="/admin/produits/new" className="btn-gold-filled" style={{ fontSize: '0.65rem' }}>
          + AJOUTER
        </Link>
      </section>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ ...card, height: 80 }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--fg-muted)', marginBottom: '1rem' }}>Aucun produit en catalogue.</p>
          <Link href="/admin/produits/new" className="btn-gold" style={{ fontSize: '0.65rem' }}><span>Ajouter votre premier produit</span></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {products.map((product) => (
            <div key={product.id} style={{ ...card, opacity: product.in_stock ? 1 : 0.5 }}>
              <div style={{ width: 56, height: 56, position: 'relative', borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-raised)' }}>
                <Image src={product.images?.[0] ?? '/images/placeholder.jpg'} alt={product.name_fr} fill className="object-cover" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name_fr}</h3>
                  {product.featured && (
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 100, background: 'rgba(201,162,39,0.1)', color: 'var(--gold-400)', border: '1px solid rgba(201,162,39,0.2)', flexShrink: 0 }}>
                      Vedette
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-muted)' }}>
                  {product.brand} · {product.type === 'decant' ? 'Échantillon' : product.type === 'pack' ? 'Pack' : 'Flacon'} {product.volume ? `· ${product.volume}ml` : ''}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)' }}>
                  {product.category ?? 'Sans catégorie'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--gold-400)', fontWeight: 500 }}>
                  {Number(product.price).toLocaleString('fr-MA')} MAD
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => toggleFeatured(product.id, product.featured)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${product.featured ? 'rgba(201,162,39,0.3)' : 'var(--border)'}`, background: product.featured ? 'rgba(201,162,39,0.1)' : 'transparent', color: product.featured ? 'var(--gold-400)' : 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    title={product.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}>
                    <Star size={14} />
                  </button>
                  <button onClick={() => toggleStock(product.id, product.in_stock)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${product.in_stock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, background: product.in_stock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: product.in_stock ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    title={product.in_stock ? 'Marquer en rupture' : 'Marquer en stock'}>
                    {product.in_stock ? <Check size={14} /> : <X size={14} />}
                  </button>
                  <Link href={`/admin/produits/${product.id}/edit`}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    className="hover:border-[var(--gold-400)] hover:text-[var(--gold-400)]" title="Modifier">
                    <Pencil size={14} />
                  </Link>
                  <button onClick={() => deleteProduct(product.id)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                    className="hover:border-red-400 hover:text-red-400" title="Supprimer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
