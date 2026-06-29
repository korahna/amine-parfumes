'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface Category {
  id: string
  slug: string
  name_fr: string
}

interface Product {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  description_fr: string | null
  description_ar: string | null
  brand: string
  type: 'full' | 'decant'
  price: number
  volume: number | null
  category: string | null
  featured: boolean
  in_stock: boolean
  images: string[]
  scent_notes: { top: string[]; heart: string[]; base: string[] }
}

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
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
    in_stock: true,
    notes_top: '',
    notes_heart: '',
    notes_base: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const [productRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('categories').select('id, slug, name_fr').order('sort_order'),
      ])

      if (productRes.data) {
        const p = productRes.data as Product
        setForm({
          name_fr: p.name_fr,
          name_ar: p.name_ar,
          description_fr: p.description_fr ?? '',
          description_ar: p.description_ar ?? '',
          brand: p.brand,
          type: p.type,
          price: String(p.price),
          volume: p.volume ? String(p.volume) : '',
          category: p.category ?? '',
          slug: p.slug,
          featured: p.featured,
          in_stock: p.in_stock,
          notes_top: (p.scent_notes?.top ?? []).join(', '),
          notes_heart: (p.scent_notes?.heart ?? []).join(', '),
          notes_base: (p.scent_notes?.base ?? []).join(', '),
        })
        setSelectedImage(p.images?.[0] ?? null)
      }

      setCategories(categoriesRes.data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [id])

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
    const { error } = await supabase
      .from('products')
      .update({
        name_fr: form.name_fr,
        name_ar: form.name_ar,
        description_fr: form.description_fr || null,
        description_ar: form.description_ar || null,
        brand: form.brand,
        type: form.type,
        price: parseFloat(form.price),
        volume: form.volume ? parseInt(form.volume) : null,
        category: form.category || null,
        slug: form.slug,
        featured: form.featured,
        in_stock: form.in_stock,
        images: selectedImage ? [selectedImage] : [],
        scent_notes: {
          top: form.notes_top.split(',').map((s) => s.trim()).filter(Boolean),
          heart: form.notes_heart.split(',').map((s) => s.trim()).filter(Boolean),
          base: form.notes_base.split(',').map((s) => s.trim()).filter(Boolean),
        },
      })
      .eq('id', id)

    if (!error) {
      router.push('/admin/produits')
    } else {
      alert('Erreur: ' + error.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-stack-lg max-w-4xl">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="h-6 w-64 skeleton rounded" />
        <div className="h-64 w-full skeleton rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-stack-lg max-w-4xl">
      <section>
        <h2 className="font-headline-md text-headline-md text-on-surface">Modifier le Produit</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{form.name_fr}</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-stack-lg">
        {/* Image Upload */}
        <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">Image du produit</h3>
          <ImageUpload
            onUpload={(url) => setSelectedImage(url || null)}
            currentUrl={selectedImage}
          />
        </div>

        {/* Bilingual Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {/* French */}
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary">Français</h3>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Nom</label>
              <input required name="name_fr" value={form.name_fr} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Description</label>
              <textarea name="description_fr" value={form.description_fr} onChange={handleChange} rows={3} className="input-underline w-full font-body-md text-on-surface py-2 resize-none" />
            </div>
          </div>
          {/* Arabic */}
          <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
            <h3 className="font-label-caps text-label-caps text-primary">العربية</h3>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">الاسم</label>
              <input required name="name_ar" value={form.name_ar} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" dir="rtl" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">الوصف</label>
              <textarea name="description_ar" value={form.description_ar} onChange={handleChange} rows={3} className="input-underline w-full font-body-md text-on-surface py-2 resize-none" dir="rtl" />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant">Détails</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Marque</label>
              <input required name="brand" value={form.brand} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Slug</label>
              <input required name="slug" value={form.slug} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" />
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
              <input required name="price" type="number" value={form.price} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2" />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Volume (ml)</label>
              <select name="volume" value={form.volume} onChange={handleChange} className="input-underline w-full font-body-md text-on-surface py-2 bg-transparent">
                <option value="">Choisir</option>
                <optgroup label="Échantillons">
                  <option value="1">1 ml</option>
                  <option value="2">2 ml</option>
                  <option value="3">3 ml</option>
                  <option value="5">5 ml</option>
                  <option value="10">10 ml</option>
                </optgroup>
                <optgroup label="Flacons">
                  <option value="30">30 ml</option>
                  <option value="50">50 ml</option>
                  <option value="75">75 ml</option>
                  <option value="100">100 ml</option>
                  <option value="125">125 ml</option>
                  <option value="150">150 ml</option>
                  <option value="200">200 ml</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <span className="font-body-md text-body-md text-on-surface">Mettre en vedette</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input name="in_stock" type="checkbox" checked={form.in_stock} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <span className="font-body-md text-body-md text-on-surface">En stock</span>
            </label>
          </div>
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

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="font-label-caps text-label-caps bg-primary text-on-primary px-8 py-4 hover:bg-primary-fixed transition-colors duration-300 tracking-widest disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'ENREGISTRER'}
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
