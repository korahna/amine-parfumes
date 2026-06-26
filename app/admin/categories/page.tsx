'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setCategories(data ?? [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    if (editing) {
      await supabase
        .from('categories')
        .update({ name_fr: form.name_fr, name_ar: form.name_ar, slug: form.slug })
        .eq('id', editing.id)
    } else {
      await supabase
        .from('categories')
        .insert({ name_fr: form.name_fr, name_ar: form.name_ar, slug: form.slug, sort_order: categories.length })
    }

    setForm({ name_fr: '', name_ar: '', slug: '' })
    setShowForm(false)
    setEditing(null)
    setSaving(false)
    fetchCategories()
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name_fr: cat.name_fr, name_ar: cat.name_ar, slug: cat.slug })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Catégories</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ name_fr: '', name_ar: '', slug: '' }) }}
          className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 hover:bg-primary-fixed transition-colors duration-300"
        >
          + AJOUTER
        </button>
      </section>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Nom (FR)</label>
              <input
                required
                value={form.name_fr}
                onChange={(e) => setForm((f) => ({ ...f, name_fr: e.target.value }))}
                className="input-underline w-full font-body-md text-on-surface py-2"
                placeholder="Floral"
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Nom (AR)</label>
              <input
                required
                value={form.name_ar}
                onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                className="input-underline w-full font-body-md text-on-surface py-2"
                placeholder="زهري"
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Slug</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="input-underline w-full font-body-md text-on-surface py-2"
                placeholder="floral"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 hover:bg-primary-fixed transition-colors duration-300 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors px-6 py-3"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 skeleton rounded" />
                <div className="h-3 w-20 skeleton rounded" />
              </div>
              <div className="h-8 w-24 skeleton rounded" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">Aucune catégorie.</p>
          <button
            onClick={() => setShowForm(true)}
            className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
          >
            Créer votre première catégorie
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface-container-low p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-body-lg text-body-lg text-on-surface">{cat.name_fr}</h3>
                <p className="text-sm text-on-surface-variant">{cat.name_ar} · /{cat.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="font-label-caps text-label-caps text-on-surface-variant hover:text-red-400 transition-colors px-3 py-2"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
