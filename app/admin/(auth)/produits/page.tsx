'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  brand: string
  type: 'full' | 'decant'
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
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const toggleStock = async (productId: string, currentStock: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ in_stock: !currentStock })
      .eq('id', productId)

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, in_stock: !currentStock } : p))
      )
    }
  }

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ featured: !currentFeatured })
      .eq('id', productId)

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, featured: !currentFeatured } : p))
      )
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Produits</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {products.length} produit{products.length !== 1 ? 's' : ''} en catalogue
          </p>
        </div>
        <Link
          href="/admin/produits/new"
          className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 hover:bg-primary-fixed transition-colors duration-300"
        >
          + AJOUTER
        </Link>
      </section>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-lg flex items-center gap-4">
              <div className="w-16 h-16 rounded skeleton flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 skeleton rounded" />
                <div className="h-3 w-24 skeleton rounded" />
              </div>
              <div className="h-8 w-20 skeleton rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">Aucun produit en catalogue.</p>
          <Link
            href="/admin/produits/new"
            className="inline-block font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
          >
            Ajouter votre premier produit
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-surface-container-low p-4 rounded-lg flex items-center gap-4 transition-opacity ${!product.in_stock ? 'opacity-50' : ''}`}
            >
              <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0 bg-surface-container-high">
                <Image
                  src={product.images?.[0] ?? '/images/placeholder.jpg'}
                  alt={product.name_fr}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-body-lg text-body-lg text-on-surface truncate">{product.name_fr}</h3>
                  {product.featured && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded flex-shrink-0">
                      Vedette
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant">
                  {product.brand} · {product.type === 'decant' ? 'Échantillon' : 'Flacon'} {product.volume ? `· ${product.volume}ml` : ''}
                </p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {product.category ?? 'Sans catégorie'}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-body-lg text-body-lg text-primary">
                  {Number(product.price).toLocaleString('fr-MA')} MAD
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(product.id, product.featured)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                      product.featured
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-on-surface-variant/30 text-on-surface-variant hover:border-primary'
                    }`}
                    title={product.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                  >
                    <span className="material-symbols-outlined text-sm">star</span>
                  </button>
                  <button
                    onClick={() => toggleStock(product.id, product.in_stock)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                      product.in_stock
                        ? 'border-green-500/30 text-green-400 bg-green-500/10'
                        : 'border-red-500/30 text-red-400 bg-red-500/10'
                    }`}
                    title={product.in_stock ? 'Marquer en rupture' : 'Marquer en stock'}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {product.in_stock ? 'check' : 'close'}
                    </span>
                  </button>
                  <Link
                    href={`/admin/produits/${product.id}/edit`}
                    className="w-8 h-8 rounded-full border border-on-surface-variant/30 text-on-surface-variant hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                    title="Modifier"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="w-8 h-8 rounded-full border border-on-surface-variant/30 text-on-surface-variant hover:border-red-500/30 hover:text-red-400 flex items-center justify-center transition-colors"
                    title="Supprimer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
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
