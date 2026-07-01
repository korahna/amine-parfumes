'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/shared/Navbar'

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  brand: string
  type: 'full' | 'decant'
  price: number
  images: string[]
  scent_notes: { top: string[]; heart: string[]; base: string[] }
  category: string | null
}

const PAGE_TITLES: Record<string, string> = {
  homme: 'Parfums pour Homme',
  femme: 'Parfums pour Femme',
  decant: 'Échantillons & Décants',
  packs: 'Packs & Coffrets',
}

const categories = [
  { value: '', fr: 'Tous', ar: 'الكل' },
  { value: 'Pour Elle', fr: 'Pour Elle', ar: 'نسائي' },
  { value: 'Pour Lui', fr: 'Pour Lui', ar: 'رجالي' },
  { value: 'Unisexe', fr: 'Unisexe', ar: 'مختلط' },
  { value: 'Packs', fr: 'Packs', ar: 'حزم' },
]

const scentFamilies = [
  { value: '', fr: 'Toutes', ar: 'الكل' },
  { value: 'floral', fr: 'Floral', ar: 'زهري' },
  { value: 'boisé', fr: 'Boisé', ar: 'خشبي' },
  { value: 'oriental', fr: 'Oriental', ar: 'شرقي' },
  { value: 'frais', fr: 'Frais', ar: 'منعش' },
]

function BoutiqueContent() {
  const searchParams = useSearchParams()
  const urlType = searchParams.get('type') || ''
  const isFiltered = !!urlType

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [scentFamily, setScentFamily] = useState('')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter((p) => {
      // URL-based filters
      if (urlType === 'homme' && p.category !== 'Pour Lui') return false
      if (urlType === 'femme' && p.category !== 'Pour Elle') return false
      if (urlType === 'decant' && p.type !== 'decant') return false
      if (urlType === 'packs' && p.category !== 'Packs') return false
      // Sidebar filters (only when not URL-filtered)
      if (!isFiltered && category && p.category !== category) return false
      if (scentFamily) {
        const allNotes = [
          ...(p.scent_notes?.top ?? []),
          ...(p.scent_notes?.heart ?? []),
          ...(p.scent_notes?.base ?? []),
        ].map((n) => n.toLowerCase())
        if (!allNotes.some((n) => n.includes(scentFamily))) return false
      }
      if (q && !p.name_fr.toLowerCase().includes(q) && !(p.brand || '').toLowerCase().includes(q)) return false
      return true
    })
  }, [products, urlType, isFiltered, category, scentFamily, search])

  const hasFilters = category || scentFamily || search
  const pageTitle = PAGE_TITLES[urlType] || 'Catalogue'

  const label: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '0.58rem',
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'var(--gold-400)', marginBottom: '0.5rem', display: 'block',
  }
  const btn = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body)', fontSize: '0.78rem',
    color: active ? 'var(--gold-400)' : 'var(--fg-muted)',
    background: active ? 'rgba(201,162,39,0.09)' : 'transparent',
    border: active ? '1px solid rgba(201,162,39,0.28)' : '1px solid transparent',
    borderRadius: 4, padding: '0.3rem 0.65rem',
    cursor: 'pointer', width: '100%', textAlign: 'left',
    transition: 'all 0.1s ease',
  })

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '5.5rem', background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold-400)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            amine.parfume
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,5vw,3rem)', color: 'var(--fg-primary)', lineHeight: 1 }}>
              {pageTitle}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-subtle)' }}>
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Top bar */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Show filters button only on Catalogue (not filtered pages) */}
          {!isFiltered && (
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden"
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.45rem 0.8rem', border: '1px solid var(--border)', borderRadius: 4, background: showFilters ? 'rgba(201,162,39,0.08)' : 'transparent', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', fontSize: '0.73rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              <SlidersHorizontal size={13} />
              Filtres
            </button>
          )}

          <div style={{ flex: 1, position: 'relative', maxWidth: 300 }}>
            <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)', pointerEvents: 'none' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="input-luxury"
              style={{ paddingLeft: '1.9rem', fontSize: '0.78rem', height: 36 }} />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', display: 'flex', padding: 2 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {category && !isFiltered && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.25)', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--gold-400)' }}>
              {category}
              <button onClick={() => setCategory('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-400)', display: 'flex', padding: 0 }}><X size={10} /></button>
            </span>
          )}

          {hasFilters && (
            <button onClick={() => { setCategory(''); setScentFamily(''); setSearch('') }}
              style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 10px', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 100, background: 'rgba(239,68,68,0.06)', color: '#f87171', fontFamily: 'var(--font-body)', fontSize: '0.68rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <X size={10} />
              Tout effacer
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
          {/* Sidebar — only on Catalogue page */}
          {!isFiltered && (
            <aside className={`${showFilters ? 'flex' : 'hidden'} lg:flex`}
              style={{ flexDirection: 'column', gap: '1.25rem', width: 188, flexShrink: 0 }}>
              <div>
                <span style={label}>Catégories</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {categories.map((c) => (
                    <button key={c.value} style={btn(category === c.value)}
                      onClick={() => setCategory(category === c.value ? '' : c.value)}>
                      {c.fr}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span style={label}>Famille Olfactive</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {scentFamilies.map((f) => (
                    <button key={f.value} style={btn(scentFamily === f.value)}
                      onClick={() => setScentFamily(scentFamily === f.value ? '' : f.value)}>
                      {f.fr}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(182px, 1fr))', gap: '0.9rem' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card" style={{ height: 320, animation: 'shimmer 2s ease-in-out infinite', background: 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-raised) 50%, var(--bg-surface) 75%)', backgroundSize: '200% 100%' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: '1rem', opacity: 0.25 }}>🌸</span>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)', fontSize: '0.88rem' }}>
                  Aucun produit trouvé
                </p>
                {hasFilters && (
                  <button onClick={() => { setCategory(''); setScentFamily(''); setSearch('') }}
                    style={{ marginTop: '0.85rem', fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'var(--gold-400)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(182px, 1fr))', gap: '0.9rem' }}>
                {filtered.map((product) => (
                  <div key={product.id} className="product-card group" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-gold)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                    <Link href={`/produit/${product.slug}`}>
                      <div className="card-img relative" style={{ aspectRatio: '3/4', background: 'var(--bg-raised)', overflow: 'hidden' }}>
                        <Image src={product.images?.[0] ?? '/images/placeholder.jpg'} alt={product.name_fr} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                        <div className="overlay">
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem({ productId: product.id, name: product.name_fr, brand: product.brand, price: Number(product.price), image: product.images?.[0] ?? '/images/placeholder.jpg', type: product.type }); openCart() }}
                            className="btn-gold-filled" style={{ padding: '0.55rem 1.25rem', fontSize: '0.65rem' }}>
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '0.9rem 0.85rem 0.75rem' }}>
                        {product.brand && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--gold-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{product.brand}</p>}
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--fg-primary)', lineHeight: 1.2, marginBottom: '0.5rem', transition: 'color 0.2s' }} className="group-hover:text-[var(--gold-mid)]">{product.name_fr}</h3>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--gold-mid)', fontSize: '0.9rem' }}>{Number(product.price).toFixed(2)} MAD</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default function BoutiquePage() {
  return (
    <Suspense>
      <BoutiqueContent />
    </Suspense>
  )
}
