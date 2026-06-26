'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0805]">
      <div className="w-full max-w-sm px-6">
        <h1 className="mb-2 text-center font-[Cormorant_Garamond] text-3xl font-light tracking-widest text-[#f0ead8]">
          amine.parfume
        </h1>
        <p className="mb-10 text-center text-xs tracking-[0.2em] uppercase text-[#8a7d65]">
          Administration
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[10px] tracking-[0.2em] uppercase text-[#8a7d65]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#2a2218] bg-[#13100c] px-4 py-3 text-sm text-[#f0ead8] placeholder-[#8a7d65]/50 outline-none transition-colors focus:border-[#c9a84c]"
              placeholder="admin@amine-parfume.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[10px] tracking-[0.2em] uppercase text-[#8a7d65]">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#2a2218] bg-[#13100c] px-4 py-3 text-sm text-[#f0ead8] placeholder-[#8a7d65]/50 outline-none transition-colors focus:border-[#c9a84c]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-[#6b1f2a]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a84c] px-8 py-3 text-xs tracking-[0.15em] uppercase text-[#0a0805] transition-colors hover:bg-[#e8c97a] disabled:opacity-50"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  )
}
