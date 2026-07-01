'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface Category {
  id: string
  slug: string
  name_fr: string
}

const sectionStyle: React.CSSProperties = { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6, display: 'block' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: '1rem' }

export default function AdminNewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [variants, setVariants] = useState<{ volume: number; price: string }[]>([])
  const [form, setForm] = useState({
    name_fr: '',
    name_ar: '',
    description_fr: '',
    description_ar: '',
    brand: '',
    type: 'full' as 'full' | 'decant' | 'pack',
    category: '',
    slug: '',
    featured: false,
    notes_top: '',
    notes_heart: '',
    notes_base: '',
  })

  const volumeOptions = {
    Échantillons: [3, 5, 10],
    'Parfum Complet': [50, 75, 100, 125],
  }

  const toggleVolume = (vol: number) => {
    setVariants((prev) => {
      const exists = prev.find((v) => v.volume === vol)
      if (exists) return prev.filter((v) => v.volume !== vol)
      return [...prev, { volume: vol, price: '' }].sort((a, b) => a.volume - b.volume)
    })
  }

  const updateVariantPrice = (vol: number, price: string) => {
    setVariants((prev) => prev.map((v) => (v.volume === vol ? { ...v, price } : v)))
  }

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

    const validVariants = variants.filter((v) => v.price && parseFloat(v.price) > 0)
    if (validVariants.length === 0) {
      alert('Sélectionnez au moins un volume avec un prix')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      name_fr: form.name_fr,
      name_ar: form.name_ar,
      description_fr: form.description_fr,
      description_ar: form.description_ar,
      brand: form.brand,
      type: form.type,
      price: parseFloat(validVariants[0].price),
      volume: validVariants[0].volume,
      variants: validVariants.map((v) => ({ volume: v.volume, price: parseFloat(v.price) })),
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '56rem' }}>
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Nouveau Produit</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>Ajouter un produit à votre catalogue.</p>
      </section>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Image Upload */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Image du produit</h3>
          <ImageUpload onUpload={(url) => setSelectedImage(url || null)} currentUrl={selectedImage} />
        </div>

        {/* Bilingual Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={sectionStyle}>
            <h3 style={{ ...headingStyle, color: 'var(--gold-400)' }}>Français</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Nom</label>
              <input required name="name_fr" value={form.name_fr} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="Nuit d'Ambre" />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description_fr" value={form.description_fr} onChange={handleChange} rows={3} className="input-luxury" style={{ width: '100%', resize: 'none' }} placeholder="Une fragrance envoûtante..." />
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={{ ...headingStyle, color: 'var(--gold-400)' }}>العربية</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>الاسم</label>
              <input required name="name_ar" value={form.name_ar} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="ليل العنبر" dir="rtl" />
            </div>
            <div>
              <label style={labelStyle}>الوصف</label>
              <textarea name="description_ar" value={form.description_ar} onChange={handleChange} rows={3} className="input-luxury" style={{ width: '100%', resize: 'none' }} placeholder="عطر ساحر..." dir="rtl" />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Détails</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Marque</label>
              <input required name="brand" value={form.brand} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="amine.parfume" />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input required name="slug" value={form.slug} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="nuit-dambre" />
            </div>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-luxury" style={{ width: '100%' }}>
                <option value="">Aucune</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name_fr}>{c.name_fr}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-luxury" style={{ width: '100%', maxWidth: 280 }}>
              <option value="full">Parfum Complet</option>
              <option value="decant">Échantillon</option>
              <option value="pack">Pack</option>
            </select>
          </div>

          {/* Volume & Price */}
          <div style={{ marginTop: '1rem' }}>
            <label style={labelStyle}>Volumes & Prix</label>
            {Object.entries(volumeOptions).map(([group, vols]) => (
              <div key={group} style={{ marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: '0.5rem' }}>{group}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {vols.map((vol) => {
                    const selected = variants.find((v) => v.volume === vol)
                    return (
                      <div key={vol} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleVolume(vol)}
                          style={{
                            width: 64, height: 40, fontSize: '0.82rem', fontWeight: 500, borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                            background: selected ? 'var(--gold-400)' : 'transparent',
                            color: selected ? 'var(--bg-base)' : 'var(--fg-muted)',
                            border: selected ? '1px solid var(--gold-400)' : '1px solid var(--border)',
                          }}
                        >
                          {vol} ml
                        </button>
                        {selected && (
                          <input
                            type="number"
                            value={selected.price}
                            onChange={(e) => updateVariantPrice(vol, e.target.value)}
                            placeholder="Prix MAD"
                            className="input-luxury"
                            style={{ flex: 1, fontSize: '0.82rem' }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--gold-400)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-primary)' }}>Mettre en vedette</span>
          </label>
        </div>

        {/* Scent Notes */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Notes olfactives (séparées par des virgules)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Notes de tête</label>
              <input name="notes_top" value={form.notes_top} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="Bergamote, Citron" />
            </div>
            <div>
              <label style={labelStyle}>Notes de cœur</label>
              <input name="notes_heart" value={form.notes_heart} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="Rose, Jasmin" />
            </div>
            <div>
              <label style={labelStyle}>Notes de fond</label>
              <input name="notes_base" value={form.notes_base} onChange={handleChange} className="input-luxury" style={{ width: '100%' }} placeholder="Oud, Musc, Ambre" />
            </div>
          </div>
        </div>

        {/* Preview */}
        {form.name_fr && selectedImage && (
          <div style={sectionStyle}>
            <h3 style={headingStyle}>Aperçu</h3>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: 128, height: 128, position: 'relative', borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0 }}>
                <Image src={selectedImage} alt={form.name_fr} fill className="object-cover" sizes="128px" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{form.brand.toUpperCase()}</p>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--fg-primary)' }}>{form.name_fr}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {variants.filter((v) => v.price).map((v) => (
                    <span key={v.volume} style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', padding: '2px 10px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                      {v.volume}ml — {parseFloat(v.price).toLocaleString('fr-MA')} MAD
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={saving} className="btn-gold-filled" style={{ fontSize: '0.65rem', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'Création en cours...' : 'CRÉER LE PRODUIT'}
          </button>
          <button type="button" onClick={() => router.push('/admin/produits')} className="btn-gold" style={{ fontSize: '0.65rem' }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
