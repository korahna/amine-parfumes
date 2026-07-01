'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface Category {
  id: string
  slug: string
  name_fr: string
  name_ar: string
  sort_order: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name_fr: '', name_ar: '', slug: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true })
    setCategories(data ?? [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editing) {
      await supabase.from('categories').update({ name_fr: form.name_fr, name_ar: form.name_ar, slug: form.slug }).eq('id', editing.id)
    } else {
      await supabase.from('categories').insert({ name_fr: form.name_fr, name_ar: form.name_ar, slug: form.slug, sort_order: categories.length })
    }

    resetForm()
    fetchCategories()
  }

  const resetForm = () => {
    setForm({ name_fr: '', name_ar: '', slug: '' })
    setShowForm(false)
    setEditing(null)
    setSaving(false)
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name_fr: cat.name_fr, name_ar: cat.name_ar, slug: cat.slug })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  const card: React.CSSProperties = { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '1.5rem' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--fg-primary)' }}>Catégories</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-gold-filled" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.65rem' }}>
          <Plus size={14} /> AJOUTER
        </button>
      </section>

      {showForm && (
        <form onSubmit={handleSubmit} style={card}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-600)', marginBottom: '1rem' }}>
            {editing ? 'Modifier' : 'Nouvelle catégorie'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Nom (FR) *</label>
              <input required value={form.name_fr} onChange={(e) => setForm(f => ({ ...f, name_fr: e.target.value }))} className="input-luxury" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Nom (AR)</label>
              <input value={form.name_ar} onChange={(e) => setForm(f => ({ ...f, name_ar: e.target.value }))} className="input-luxury" dir="rtl" />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', marginBottom: 6, display: 'block' }}>Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="input-luxury" placeholder="floral" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} className="btn-gold-filled" style={{ fontSize: '0.65rem', opacity: saving ? 0.5 : 1 }}>{editing ? 'Modifier' : 'Ajouter'}</button>
            <button type="button" onClick={resetForm} className="btn-gold" style={{ fontSize: '0.65rem' }}><span>Annuler</span></button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ ...card, height: 60 }} />)}
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fg-subtle)', marginBottom: '1rem' }}>Aucune catégorie.</p>
          <button onClick={() => setShowForm(true)} className="btn-gold"><span>Créer la première</span></button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ ...card, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--fg-subtle)', width: 24 }}>{cat.sort_order + 1}</span>
                <div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--fg-primary)' }}>{cat.name_fr}</span>
                  {cat.name_ar && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--fg-muted)', marginRight: 12 }}>{cat.name_ar}</span>}
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--fg-subtle)', background: 'var(--bg-raised)', padding: '2px 8px', borderRadius: 4 }}>{cat.slug}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(cat)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:border-[var(--gold-400)] hover:text-[var(--gold-400)]"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:border-red-400 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
