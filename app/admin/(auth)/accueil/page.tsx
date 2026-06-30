'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Pencil, Trash2, Plus, GripVertical, Eye, EyeOff, Star } from 'lucide-react'

interface HeroSlide {
  id: string
  name: string
  sub: string
  mood: string
  accent: string
  tag: string
  image_url: string
  sort_order: number
  is_active: boolean
}

export default function AdminAccueilPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<HeroSlide | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', sub: '', mood: '', accent: '#c9a227', tag: 'Homme',
  })

  useEffect(() => { fetchSlides() }, [])

  const fetchSlides = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('homepage_hero').select('*').order('sort_order')
    setSlides(data ?? [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage && !editing) return
    setSaving(true)
    const supabase = createClient()

    const payload = {
      name: form.name,
      sub: form.sub,
      mood: form.mood,
      accent: form.accent,
      tag: form.tag,
      image_url: selectedImage || editing?.image_url || '',
      sort_order: editing?.sort_order ?? slides.length + 1,
      is_active: true,
    }

    if (editing) {
      await supabase.from('homepage_hero').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('homepage_hero').insert(payload)
    }

    resetForm()
    fetchSlides()
  }

  const resetForm = () => {
    setForm({ name: '', sub: '', mood: '', accent: '#c9a227', tag: 'Homme' })
    setSelectedImage(null)
    setShowForm(false)
    setEditing(null)
    setSaving(false)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditing(slide)
    setForm({ name: slide.name, sub: slide.sub, mood: slide.mood, accent: slide.accent, tag: slide.tag })
    setSelectedImage(slide.image_url)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce slide ?')) return
    const supabase = createClient()
    await supabase.from('homepage_hero').delete().eq('id', id)
    fetchSlides()
  }

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient()
    await supabase.from('homepage_hero').update({ is_active: !current }).eq('id', id)
    fetchSlides()
  }

  const updateOrder = async (id: string, newOrder: number) => {
    const supabase = createClient()
    await supabase.from('homepage_hero').update({ sort_order: newOrder }).eq('id', id)
    fetchSlides()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Page d&apos;accueil</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>
            Gérez le carrousel hero et les sections de la page d&apos;accueil
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="btn-gold-filled" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> AJOUTER UN SLIDE
        </button>
      </section>

      {/* Info card */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Star size={18} style={{ color: 'var(--gold-400)', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)' }}>
          Les slides sont affichés dans le carrousel hero sur la page d&apos;accueil. Les produits &quot;Meilleures ventes&quot; sont gérés via le bouton étoile dans la page <a href="/admin/produits" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>Produits</a>.
        </p>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-600)' }}>
            {editing ? 'Modifier le slide' : 'Nouveau slide'}
          </h3>

          {/* Image */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Image du parfum</label>
            <ImageUpload onUpload={(url) => setSelectedImage(url || null)} currentUrl={selectedImage} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Nom du parfum *</label>
              <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-luxury" placeholder="Stronger With You" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Sous-titre</label>
              <input value={form.sub} onChange={(e) => setForm(f => ({ ...f, sub: e.target.value }))}
                className="input-luxury" placeholder="Intensely · Emporio Armani" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Ambiance</label>
              <input value={form.mood} onChange={(e) => setForm(f => ({ ...f, mood: e.target.value }))}
                className="input-luxury" placeholder="Chaud & Ambré" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Tag</label>
              <select value={form.tag} onChange={(e) => setForm(f => ({ ...f, tag: e.target.value }))}
                className="input-luxury">
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Mixte">Mixte</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Couleur d&apos;accent</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="color" value={form.accent} onChange={(e) => setForm(f => ({ ...f, accent: e.target.value }))}
                  style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
                <input value={form.accent} onChange={(e) => setForm(f => ({ ...f, accent: e.target.value }))}
                  className="input-luxury" style={{ flex: 1 }} placeholder="#d4722a" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} className="btn-gold-filled" style={{ opacity: saving ? 0.5 : 1 }}>
              {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" onClick={resetForm} className="btn-gold"><span>Annuler</span></button>
          </div>
        </form>
      )}

      {/* Slides List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card" style={{ padding: '1rem', height: 100, animation: 'shimmer 2s ease-in-out infinite', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)', marginBottom: '1rem' }}>Aucun slide configuré.</p>
          <button onClick={() => setShowForm(true)} className="btn-gold"><span>Créer le premier slide</span></button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slides.map((slide, idx) => (
            <div key={slide.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: slide.is_active ? 1 : 0.5 }}>
              {/* Order controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => idx > 0 && updateOrder(slides[idx - 1].id, slide.sort_order) || updateOrder(slide.id, slide.sort_order - 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', padding: 2 }}
                  disabled={idx === 0}>▲</button>
                <button onClick={() => idx < slides.length - 1 && updateOrder(slides[idx + 1].id, slide.sort_order) || updateOrder(slide.id, slide.sort_order + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-subtle)', padding: 2 }}
                  disabled={idx === slides.length - 1}>▼</button>
              </div>

              {/* Image preview */}
              <div style={{ width: 80, height: 80, position: 'relative', borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-raised)' }}>
                <Image src={slide.image_url} alt={slide.name} fill className="object-cover" />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--fg-primary)' }}>{slide.name}</h3>
                  <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: slide.accent, background: `${slide.accent}15`, border: `1px solid ${slide.accent}30`, padding: '2px 8px', borderRadius: 100, fontFamily: 'var(--font-body)' }}>{slide.tag}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--fg-muted)' }}>{slide.sub}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--fg-subtle)' }}>{slide.mood}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => toggleActive(slide.id, slide.is_active)}
                  title={slide.is_active ? 'Désactiver' : 'Activer'}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${slide.is_active ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, background: slide.is_active ? 'rgba(34,197,94,0.1)' : 'transparent', color: slide.is_active ? '#22c55e' : 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {slide.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleEdit(slide)} title="Modifier"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  className="hover:border-[var(--gold-400)] hover:text-[var(--gold-400)]">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(slide.id)} title="Supprimer"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  className="hover:border-red-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
