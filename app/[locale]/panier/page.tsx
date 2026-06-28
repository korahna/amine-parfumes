'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()

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
            <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-6 block">shopping_bag</span>
            <p className="font-display-lg text-display-lg-mobile italic text-on-surface-variant mb-4">
              Votre panier est vide
            </p>
            <Link href="/boutique" className="inline-block font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity duration-300 uppercase tracking-[0.2em]">
              Découvrir la boutique
            </Link>
          </div>
        </main>
      </>
    )
  }

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
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-12">
            Panier <span className="text-on-surface-variant font-body-md">({totalItems()} articles)</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Items */}
            <div className="md:col-span-7 space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 p-4 bg-surface-container-low rounded-sm">
                  <div className="w-24 h-24 relative flex-shrink-0 rounded-sm overflow-hidden bg-surface-container-high">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em]">{item.brand.toUpperCase()}</p>
                      <h3 className="font-body-lg text-body-lg text-on-surface">{item.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.type === 'decant' ? 'Échantillon' : 'Flacon'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 border border-on-surface-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-body-md text-body-md text-on-surface w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 border border-on-surface-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-body-lg text-body-lg text-primary">{(item.price * item.quantity).toLocaleString('fr-MA')} MAD</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="self-start text-on-surface-variant hover:text-primary transition-colors duration-300"
                    aria-label="Supprimer"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="md:col-span-5 sticky top-32">
              <div className="glass-panel p-stack-md rounded-lg shadow-2xl space-y-stack-md">
                <h2 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant/30 pb-4">Résumé</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                    <span>Sous-total</span>
                    <span>{totalPrice().toLocaleString('fr-MA')} MAD</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                    <span>Livraison</span>
                    <span>Gratuit</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-outline-variant/30">
                    <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                    <span className="font-headline-md text-headline-md text-primary">{totalPrice().toLocaleString('fr-MA')} MAD</span>
                  </div>
                </div>
                <Link
                  href="/commande"
                  className="block w-full text-center bg-primary text-on-primary font-label-caps text-label-caps py-5 px-8 hover:bg-primary-fixed transition-colors duration-300 tracking-widest uppercase"
                >
                  Commander
                </Link>
                <p className="text-center font-label-caps text-label-caps text-on-surface-variant opacity-60">
                  Paiement à la livraison
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
