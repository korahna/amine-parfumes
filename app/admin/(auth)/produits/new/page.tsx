'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  slug: string
  name_fr: string
}

import { UnsplashPicker } from '@/components/admin/UnsplashPicker'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default function AdminNewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageSource, setImageSource] = useState<'upload' | 'unsplash'>('upload')
  const [form, setForm] = useState({
    name_fr: '',
    name_ar: '',
    description_fr: '',
    description_ar: '',
    brand: '',
    type: 'full' as 'full' | 'decant',
    price: '',
    volume: '',
    category: '',
    slug: '',
    featured: false,
    notes_top: '',
    notes_heart: '',
    notes_base: '',
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('id, slug, name_fr').order('sort_order')
      setCategories(data ?? [])
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      name_fr: form.name_fr,
      name_ar: form.name_ar,
      description_fr: form.description_fr,
      description_ar: form.description_ar,
      brand: form.brand,
      type: form.type,
      price: parseFloat(form.price),
      volume: form.volume ? parseInt(form.volume) : null,
      category: form.category || null,
      slug: form.slug,
      featured: form.featured,
      images: selectedImage ? [selectedImage] : [],
      in_stock: true,
      scent_notes: {
        top: form.notes_top.split(',').map((s) => s.trim()).filter(Boolean),
        heart: form.notes_heart.split(',').map((s) => s.trim()).filter(Boolean),
        base: form.notes_base.split(',').map((s) => s.trim()).filter(Boolean),
      },
    })

    if (!error) {
      router.push('/admin/produits')
    } else {
      alert('Erreur: ' + error.message)
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-stack-lg max-w-4xl">
      <section>
        <h2 className="font-headline-md text-headline-md text-on-surface">Nouveau Produit</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Ajouter un produit à votre catalogue.</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-stack-lg">
        {/* Image Selection */}
        <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">Image du produit</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setImageSource('upload')}
              className={`font-label-caps text-label-caps px-4 py-2 transition-colors ${
                imageSource === 'upload'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
              }`}
            >
              Upload PC
            </button>
            <button
              type="button"
              onClick={() => setImageSource('unsplash')}
              className={`font-label-caps text-label-caps px-4 py-2 transition-colors ${
                imageSource === 'unsplash'
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
              }`}
            >
              Unsplash
            </button>
          </div>
          {imageSource === 'upload' ? (
            <ImageUpload
              onUpload={(url) => setSelectedImage(url || null)}
              currentUrl={selectedImage}
            />
          ) : (
            <UnsplashPicker
              selected={selectedImage}
              onSelect={setSelectedImage}
              brand={form.brand}
            />
          )}
        </div>

        {/* Bilingual Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {/* French */}
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary">Français</h3>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Nom</label>
              <input required name="name_fr" value={form.name_fr} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="Nuit d'Ambre" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Description</label>
              <textarea name="description_fr" value={form.description_fr} onChange={handleChange} rows={3} className="input-underline w-full font-body-md text-on-surface py-2 resize-none" placeholder="Une fragrance envoûtante..." />
            </div>
          </div>
          {/* Arabic */}
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary">العربية</h3>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">الاسم</label>
              <input required name="name_ar" value={form.name_ar} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="ليل العنبر" dir="rtl" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">الوصف</label>
              <textarea name="description_ar" value={form.description_ar} onChange={handleChange} rows={3} className="input-underline w-full font-body-md text-on-surface py-2 resize-none" placeholder="عطر ساحر..." dir="rtl" />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">Détails</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Marque</label>
              <input required name="brand" value={form.brand} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="amine.parfume" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Slug</label>
              <input required name="slug" value={form.slug} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="nuit-dambre" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Catégorie</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2 bg-transparent">
                <option value="">Aucune</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name_fr}>{c.name_fr}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2 bg-transparent">
                <option value="full">Flacon</option>
                <option value="decant">Échantillon</option>
              </select>
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Prix (MAD)</label>
              <input required name="price" type="number" value={form.price} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="250" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Volume (ml)</label>
              <input name="volume" type="number" value={form.volume} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="50" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-5 h-5 accent-primary" />
            <span className="font-body-md text-body-md text-on-surface">Mettre en vedette</span>
          </label>
        </div>

        {/* Scent Notes */}
        <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">Notes olfactives (séparées par des virgules)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Notes de tête</label>
              <input name="notes_top" value={form.notes_top} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="Bergamote, Citron" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Notes de cœur</label>
              <input name="notes_heart" value={form.notes_heart} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="Rose, Jasmin" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Notes de fond</label>
              <input name="notes_base" value={form.notes_base} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" placeholder="Oud, Musc, Ambre" />
            </div>
          </div>
        </div>

        {/* Preview */}
        {form.name_fr && selectedImage && (
          <div className="bg-surface-container-low p-6 rounded-lg space-y-3">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant">Aperçu</h3>
            <div className="flex gap-6 items-start">
              <div className="w-32 h-32 relative rounded overflow-hidden flex-shrink-0">
                <Image src={selectedImage} alt={form.name_fr} fill className="object-cover" sizes="128px" />
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant">{form.brand.toUpperCase()}</p>
                <h4 className="font-display-lg text-headline-md text-on-surface">{form.name_fr}</h4>
                {form.price && <p className="font-body-lg text-primary mt-1">{parseFloat(form.price).toLocaleString('fr-MA')} MAD</p>}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="font-label-caps text-label-caps bg-primary text-on-primary px-8 py-4 hover:bg-primary-fixed transition-colors duration-300 tracking-widest disabled:opacity-50"
          >
            {saving ? 'Création en cours...' : 'CRÉER LE PRODUIT'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/produits')}
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors px-8 py-4"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
