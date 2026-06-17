'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Film, Loader2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScriptContent } from '@/lib/types'

export default function ScriptsPage() {
  const { user } = useAuth()
  const [type, setType] = useState<'reel' | 'story_sequence'>('reel')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(30)
  const [script, setScript] = useState<ScriptContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !topic.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, type, topic, duration }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setScript(data.content)
    } catch {
      setError('Falha ao gerar roteiro. Verifique sua chave Gemini no .env.local')
    } finally {
      setLoading(false)
    }
  }

  function copyAll() {
    if (!script) return
    const text = [
      `GANCHO: ${script.hook}`,
      '',
      'CENAS:',
      ...script.scenes.map((s, i) => `${i + 1}. ${s}`),
      '',
      `LEGENDA:\n${script.caption}`,
      '',
      `CTA: ${script.cta}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Gerador de Roteiros</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Crie roteiros de Reels (primeiros 3s de retenção) ou sequências de Stories com gatilhos mentais.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex gap-2">
          {(['reel', 'story_sequence'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition',
                type === t
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'
              )}
            >
              {t === 'reel' ? 'Reel' : 'Sequência de Stories'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Tema</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={type === 'reel' ? 'Ex: Como dobrei meu alcance mudando um hábito' : 'Ex: Bastidores de como lanço um produto em 7 dias'}
            required
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        {type === 'reel' && (
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
              Duração (segundos): {duration}s
            </label>
            <input
              type="range"
              min={15}
              max={90}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>15s</span><span>30s</span><span>45s</span><span>60s</span><span>90s</span>
            </div>
          </div>
        )}

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
            <><Loader2 className="w-4 h-4 animate-spin" /> Gerando roteiro...</>
          ) : (
            <><Film className="w-4 h-4" /> Gerar Roteiro</>
          )}
        </button>
      </form>

      {script && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-100">Roteiro gerado</h2>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar tudo'}
            </button>
          </div>

          <ScriptBlock label="GANCHO (primeiros 3 segundos)" content={script.hook} accent="violet" />

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Cenas</p>
            {script.scenes.map((scene, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-zinc-300">{scene}</p>
              </div>
            ))}
          </div>

          <ScriptBlock label="Legenda" content={script.caption} accent="blue" />
          <ScriptBlock label="Call to Action" content={script.cta} accent="pink" />
        </div>
      )}
    </div>
  )
}

function ScriptBlock({ label, content, accent }: { label: string; content: string; accent: 'violet' | 'blue' | 'pink' }) {
  const colors = {
    violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    pink: 'border-pink-500/30 bg-pink-500/5 text-pink-400',
  }
  return (
    <div className={cn('rounded-xl border p-5 space-y-2', colors[accent])}>
      <p className="text-xs uppercase tracking-wider font-medium opacity-70">{label}</p>
      <p className="text-sm text-zinc-200 whitespace-pre-line">{content}</p>
    </div>
  )
}
