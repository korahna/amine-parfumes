'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFilterStore, useCartStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { SkeletonGrid } from '@/components/perfume/SkeletonCard'

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

const categories = ['Tous', 'Pour Elle', 'Pour Lui', 'Unisexe']
const scentFamilies = ['Tous', 'Floral', 'Boisé', 'Oriental', 'Frais', 'Citronné']

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { category, scentFamily, type, setCategory, setScentFamily, setType, resetFilters } = useFilterStore()
  const openCart = useCartStore((s) => s.openCart)
  const addItem = useCartStore((s) => s.addItem)

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

  const filtered = products.filter((p) => {
    if (category && category !== 'Tous' && p.category !== category) return false
    if (scentFamily && scentFamily !== 'Tous') {
      const allNotes = [
        ...(p.scent_notes?.top ?? []),
        ...(p.scent_notes?.heart ?? []),
        ...(p.scent_notes?.base ?? []),
      ].map((n) => n.toLowerCase())
      if (!allNotes.some((n) => n.includes(scentFamily.toLowerCase()))) return false
    }
    if (type && p.type !== type) return false
    return true
  })

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl transition-all duration-500 hover:opacity-70">
        <div className="flex justify-between items-center px-gutter py-4 w-full max-w-container-max mx-auto">
          <button aria-label="Language" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>language</span>
          </button>
          <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg italic text-on-surface dark:text-on-surface text-center">
            amine.parfume
          </Link>
          <button aria-label="Shopping Bag" onClick={openCart} className="text-on-surface-variant hover:text-primary transition-colors duration-300 relative">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-section-padding px-gutter max-w-container-max mx-auto w-full">
        {/* Page Header */}
        <div className="mb-stack-lg text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-stack-md">
          <div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase tracking-widest">BOUTIQUE</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm max-w-md">
              Découvrez notre collection de fragrances exclusives, élaborées avec les essences les plus rares.
            </p>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap justify-center md:justify-end gap-stack-sm font-label-caps text-label-caps">
            <select
              value={category ?? 'Tous'}
              onChange={(e) => setCategory(e.target.value === 'Tous' ? null : e.target.value)}
              className="px-6 py-3 border border-on-surface-variant/30 hover:border-primary text-on-surface-variant hover:text-primary transition-colors duration-300 uppercase bg-transparent cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'Tous' ? 'Catégorie' : c}</option>
              ))}
            </select>
            <select
              value={scentFamily ?? 'Tous'}
              onChange={(e) => setScentFamily(e.target.value === 'Tous' ? null : e.target.value)}
              className="px-6 py-3 border border-on-surface-variant/30 hover:border-primary text-on-surface-variant hover:text-primary transition-colors duration-300 uppercase bg-transparent cursor-pointer"
            >
              {scentFamilies.map((f) => (
                <option key={f} value={f}>{f === 'Tous' ? 'Famille Olfactive' : f}</option>
              ))}
            </select>
            {(category || scentFamily || type) && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 text-primary hover:text-primary-fixed transition-colors duration-300 uppercase tracking-widest"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display-lg text-display-lg-mobile italic text-on-surface-variant">
              Aucun parfum ne correspond à votre recherche...
            </p>
            <button
              onClick={resetFilters}
              className="mt-8 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase tracking-[0.2em]"
            >
              Voir tous les parfums
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-stack-lg">
            {filtered.map((product) => {
              const allNotes = [
                ...(product.scent_notes?.top ?? []),
                ...(product.scent_notes?.heart ?? []),
                ...(product.scent_notes?.base ?? []),
              ].slice(0, 3)

              return (
                <article key={product.id} className="group flex flex-col relative">
                  <Link href={`/produit/${product.slug}`}>
                    <div className="relative w-full aspect-square mb-stack-md overflow-hidden bg-surface-container-low transition-all duration-700">
                      <Image
                        src={product.images?.[0] ?? '/images/placeholder.jpg'}
                        alt={product.name_fr}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-90 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-stack-md">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            addItem({
                              productId: product.id,
                              name: product.name_fr,
                              brand: product.brand,
                              price: Number(product.price),
                              image: product.images?.[0] ?? '/images/placeholder.jpg',
                              type: product.type,
                            })
                          }}
                          className="font-label-caps text-label-caps bg-primary-container text-on-primary-container px-8 py-3 hover:bg-primary transition-colors duration-300 w-[80%] uppercase tracking-widest"
                        >
                          AJOUTER
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col items-center text-center">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mb-2 tracking-[0.3em]">{product.brand.toUpperCase()}</span>
                    <Link href={`/produit/${product.slug}`}>
                      <h2 className="font-display-lg text-headline-md md:text-headline-md text-on-surface mb-2 leading-tight hover:text-primary transition-colors duration-300">{product.name_fr}</h2>
                    </Link>
                    {allNotes.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                        {allNotes.map((note) => (
                          <span key={note} className="text-[10px] border border-on-surface-variant/30 text-on-surface-variant px-2 py-0.5 rounded-full">
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="font-body-md text-body-md text-primary">{Number(product.price).toLocaleString('fr-MA')} MAD</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Load More */}
        {!loading && filtered.length > 0 && (
          <div className="mt-section-padding flex justify-center">
            <button className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase tracking-[0.2em]">
              Voir Plus
            </button>
          </div>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface-container/90 dark:bg-surface-container/90 backdrop-blur-md">
        <div className="flex justify-around items-center py-4 px-2">
          <Link href="/" className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontWeight: 300 }}>home</span>
            <span className="font-label-caps text-label-caps">Home</span>
          </Link>
          <Link href="/boutique" className="flex flex-col items-center justify-center text-primary font-bold">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1", fontWeight: 400 }}>storefront</span>
            <span className="font-label-caps text-label-caps">Boutique</span>
          </Link>
          <button className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontWeight: 300 }}>search</span>
            <span className="font-label-caps text-label-caps">Search</span>
          </button>
          <button className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0", fontWeight: 300 }}>person</span>
            <span className="font-label-caps text-label-caps">Account</span>
          </button>
        </div>
      </nav>
      {/* Padding for mobile nav */}
      <div className="h-24 md:hidden" />
    </>
  )
}
