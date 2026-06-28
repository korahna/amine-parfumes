'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/store'
import { SkeletonProductDetail } from '@/components/perfume/SkeletonProductDetail'

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  description_fr: string
  description_ar: string
  brand: string
  type: 'full' | 'decant'
  price: number
  volume: number | null
  images: string[]
  scent_notes: { top: string[]; heart: string[]; base: string[] }
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVolume, setSelectedVolume] = useState<string>('')
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (data) {
        setProduct(data)
        if (data.volume) setSelectedVolume(`${data.volume} ML`)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4">
          <button className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
            <span className="material-symbols-outlined">language</span>
          </button>
          <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg italic text-on-surface">
            amine.parfume
          </Link>
          <button className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </header>
        <main className="pt-32 pb-section-padding px-gutter max-w-container-max mx-auto">
          <SkeletonProductDetail />
        </main>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4">
          <button className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
            <span className="material-symbols-outlined">language</span>
          </button>
          <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg italic text-on-surface">
            amine.parfume
          </Link>
          <button className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </header>
        <main className="pt-32 pb-section-padding px-gutter max-w-container-max mx-auto">
          <div className="text-center py-24">
            <p className="font-display-lg text-display-lg-mobile italic text-on-surface-variant">
              Ce parfum n&apos;existe pas...
            </p>
            <Link href="/boutique" className="mt-8 inline-block font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase tracking-[0.2em]">
              Retour à la boutique
            </Link>
          </div>
        </main>
      </>
    )
  }

  const allNotes = [
    ...(product.scent_notes?.top ?? []),
    ...(product.scent_notes?.heart ?? []),
    ...(product.scent_notes?.base ?? []),
  ]
  const volumes = product.type === 'decant' ? ['5 ML', '10 ML'] : ['30 ML', '50 ML', '100 ML']

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl flex justify-between items-center px-gutter py-4">
        <button className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
          <span className="material-symbols-outlined" data-icon="language">language</span>
        </button>
        <Link href="/" className="font-display-lg text-display-lg-mobile md:text-display-lg italic text-on-surface dark:text-on-surface text-center">
          amine.parfume
        </Link>
        <button onClick={openCart} className="text-on-surface-variant hover:opacity-70 transition-opacity duration-500">
          <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-section-padding px-gutter max-w-container-max mx-auto fade-in">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* Product Image */}
          <div className="md:col-span-7 relative group">
            <div className="skeleton absolute inset-0 rounded-lg -z-10" />
            <Image
              src={product.images?.[0] ?? '/images/placeholder.jpg'}
              alt={product.name_fr}
              width={800}
              height={1000}
              className="w-full h-auto object-cover rounded-sm shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ aspectRatio: '4/5' }}
            />
          </div>

          {/* Product Details */}
          <div className="md:col-span-5 flex flex-col pt-8 md:pt-16">
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.3em] mb-4">{product.brand.toUpperCase()}</p>
            <h1 className="font-display-lg-mobile md:text-display-lg text-on-surface mb-4">
              {product.name_fr}
            </h1>
            {product.description_fr && (
              <p className="font-body-md text-body-md text-on-surface mb-12 leading-relaxed">
                {product.description_fr}
              </p>
            )}

            {/* Scent Pyramid */}
            {(product.scent_notes?.top?.length > 0 || product.scent_notes?.heart?.length > 0 || product.scent_notes?.base?.length > 0) && (
              <div className="mb-12 bg-surface-container-low p-6 rounded-sm border border-surface-container-highest">
                <h3 className="font-label-caps text-label-caps text-primary mb-6 text-center">Pyramide Olfactive</h3>
                <div className="flex flex-col items-center gap-4 text-center">
                  {product.scent_notes.top?.length > 0 && (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-on-surface-variant font-label-caps text-[10px]">TÊTE</span>
                        <span className="text-on-surface font-body-md">{product.scent_notes.top.join(' · ')}</span>
                      </div>
                      <div className="w-px h-6 bg-outline-variant" />
                    </>
                  )}
                  {product.scent_notes.heart?.length > 0 && (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-on-surface-variant font-label-caps text-[10px]">CŒUR</span>
                        <span className="text-on-surface font-body-md">{product.scent_notes.heart.join(' · ')}</span>
                      </div>
                      <div className="w-px h-6 bg-outline-variant" />
                    </>
                  )}
                  {product.scent_notes.base?.length > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="text-on-surface-variant font-label-caps text-[10px]">FOND</span>
                      <span className="text-on-surface font-body-md">{product.scent_notes.base.join(' · ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Volume Selector */}
            <div className="mb-12">
              <span className="block font-label-caps text-label-caps text-on-surface-variant mb-4">FORMAT</span>
              <div className="flex gap-4">
                {volumes.map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`flex-1 py-3 border font-label-caps text-label-caps transition-colors duration-300 ${
                      selectedVolume === vol
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-outline hover:border-primary text-on-surface'
                    }`}
                  >
                    {vol}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name_fr,
                    brand: product.brand,
                    price: Number(product.price),
                    image: product.images?.[0] ?? '/images/placeholder.jpg',
                    type: product.type,
                  })
                  openCart()
                }}
                className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-5 px-8 hover:bg-primary-fixed transition-colors duration-300 tracking-widest"
              >
                AJOUTER AU PANIER — {Number(product.price).toLocaleString('fr-MA')} DH
              </button>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000'}?text=${encodeURIComponent(
                  `Bonjour, je suis intéressé(e) par:\n\n*${product.brand} — ${product.name_fr}*\n${product.type === 'decant' ? 'Échantillon' : 'Flacon'} — ${Number(product.price).toLocaleString('fr-MA')} MAD\n\nMerci!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-inverse-surface text-inverse-surface font-label-caps text-label-caps py-5 px-8 hover:bg-inverse-surface hover:text-surface transition-colors duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                COMMANDER VIA WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-4 px-2 bg-surface-container/90 dark:bg-surface-container/90 backdrop-blur-md z-50">
        <Link href="/" className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
          <span className="material-symbols-outlined" data-icon="home">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </Link>
        <Link href="/boutique" className="flex flex-col items-center justify-center text-primary font-bold">
          <span className="material-symbols-outlined" data-icon="storefront">storefront</span>
          <span className="font-label-caps text-label-caps mt-1">Boutique</span>
        </Link>
        <button className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="font-label-caps text-label-caps mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary-fixed-dim hover:text-primary transition-colors duration-300">
          <span className="material-symbols-outlined" data-icon="person">person</span>
          <span className="font-label-caps text-label-caps mt-1">Account</span>
        </button>
      </nav>
    </>
  )
}
