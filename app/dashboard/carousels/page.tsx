'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CarouselPreview } from '@/components/instagram/CarouselPreview'
import { LayoutGrid, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CarouselSlide } from '@/lib/types'

export default function CarouselsPage() {
  const { user } = useAuth()
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('Criadores de conteúdo e empreendedores digitais')
  const [tone, setTone] = useState('Educativo e direto')
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !topic.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, topic, targetAudience, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSlides(data.slides)
    } catch {
      setError('Falha ao gerar carrossel. Verifique sua chave Gemini no .env.local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Planejador de Carrosséis</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Gere 8 slides com gancho, conteúdo denso e CTA em segundos.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Tema do Carrossel</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: 5 erros que destroem o alcance no Instagram"
            required
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Público-alvo</label>
            <input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Tom</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-violet-500 transition"
            >
              <option>Educativo e direto</option>
              <option>Inspirador e motivacional</option>
              <option>Provocativo e controverso</option>
              <option>Técnico e aprofundado</option>
              <option>Leve e bem-humorado</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition',
            'bg-violet-600 hover:bg-violet-500 text-white',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Gerando carrossel...</>
          ) : (
            <><LayoutGrid className="w-4 h-4" /> Gerar Carrossel</>
          )}
        </button>
      </form>

      {slides && <CarouselPreview slides={slides} />}
    </div>
  )
}
