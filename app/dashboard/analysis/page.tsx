'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisInsights } from '@/lib/types'

export default function AnalysisPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<AnalysisInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const metricsRes = await fetch(`/api/instagram/metrics?uid=${user.uid}`)
      const metrics = await metricsRes.json()

      const analysisRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, metrics }),
      })
      const data = await analysisRes.json()
      if (!analysisRes.ok) throw new Error(data.error)
      setInsights(data.insights)
    } catch {
      setError('Falha ao analisar. Verifique sua chave Gemini no .env.local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Análise de Perfil</h1>
        <p className="text-zinc-400 text-sm mt-1">
          A IA audita suas métricas e identifica pontos fortes, fracos e linhas editoriais.
        </p>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition',
          'bg-violet-600 hover:bg-violet-500 text-white',
          loading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analisando com Gemini...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Analisar meu perfil
          </>
        )}
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {insights && (
        <div className="space-y-6">
          <InsightSection
            title="Pontos Fortes"
            items={insights.strengths}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            itemColor="text-emerald-300"
            borderColor="border-emerald-500/30"
            bgColor="bg-emerald-500/5"
          />
          <InsightSection
            title="Pontos a Melhorar"
            items={insights.weaknesses}
            icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
            itemColor="text-amber-300"
            borderColor="border-amber-500/30"
            bgColor="bg-amber-500/5"
          />
          <InsightSection
            title="Linhas Editoriais Sugeridas"
            items={insights.editorialLines}
            icon={<Lightbulb className="w-5 h-5 text-violet-400" />}
            itemColor="text-violet-300"
            borderColor="border-violet-500/30"
            bgColor="bg-violet-500/5"
          />
        </div>
      )}
    </div>
  )
}

function InsightSection({
  title, items, icon, itemColor, borderColor, bgColor,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
  itemColor: string
  borderColor: string
  bgColor: string
}) {
  return (
    <div className={cn('rounded-xl border p-5 space-y-3', borderColor, bgColor)}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-semibold text-zinc-100">{title}</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={cn('text-sm flex gap-2', itemColor)}>
            <span className="mt-0.5 opacity-60">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
