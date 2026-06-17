'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Link2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { InstagramMetrics } from '@/lib/types'

function DashboardContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [metrics, setMetrics] = useState<(InstagramMetrics & { isReal?: boolean }) | null>(null)
  const [loading, setLoading] = useState(true)

  const igStatus = searchParams.get('instagram')

  useEffect(() => {
    if (!user) return
    fetch(`/api/instagram/metrics?uid=${user.uid}`)
      .then((r) => r.json())
      .then((data) => setMetrics(data))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (igStatus) {
      const t = setTimeout(() => router.replace('/dashboard'), 4000)
      return () => clearTimeout(t)
    }
  }, [igStatus, router])

  function handleConnect() {
    if (!user) return
    window.location.href = `/api/instagram/connect?uid=${user.uid}`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Olá, {user?.displayName?.split(' ')[0] ?? 'criador'}
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Aqui está um resumo do seu Instagram</p>
      </div>

      {igStatus === 'connected' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Instagram conectado com sucesso! Métricas reais carregadas.
        </div>
      )}
      {(igStatus === 'error' || igStatus === 'no-page') && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {igStatus === 'no-page'
            ? 'Nenhuma Página do Facebook encontrada. Seu Instagram deve estar vinculado a uma Página.'
            : 'Erro ao conectar. Verifique as configurações do app no Meta for Developers.'}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : metrics?.isReal ? (
        <>
          <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <img
              src={metrics.profilePicUrl}
              alt={metrics.username}
              className="w-14 h-14 rounded-full"
            />
            <div>
              <p className="font-semibold text-zinc-100">@{metrics.username}</p>
              <p className="text-xs text-zinc-400">Dados reais via Instagram Graph API</p>
            </div>
            <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Conta conectada
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard label="Seguidores" value={metrics.followers.toLocaleString('pt-BR')} />
            <MetricCard label="Seguindo" value={metrics.following.toLocaleString('pt-BR')} />
            <MetricCard label="Posts" value={metrics.posts} />
            <MetricCard label="Média de Curtidas" value={metrics.avgLikes} />
            <MetricCard label="Média de Comentários" value={metrics.avgComments} />
            <MetricCard
              label="Taxa de Engajamento"
              value={`${metrics.engagementRate}%`}
              sub={metrics.engagementRate > 3 ? 'Acima da média do setor (1–3%)' : 'Foco em engajamento'}
              highlight={metrics.engagementRate > 3}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50">
          <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Link2 className="w-7 h-7 text-violet-400" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-semibold text-zinc-100">Conecte seu Instagram</p>
            <p className="text-sm text-zinc-400 max-w-xs">
              Vincule sua conta para visualizar métricas reais e usar as ferramentas de IA.
            </p>
          </div>
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition"
          >
            <Link2 className="w-4 h-4" /> Conectar Instagram
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Análise de Perfil', desc: 'IA audita seus pontos fortes, fracos e linhas editoriais', href: '/dashboard/analysis' },
          { title: 'Carrosséis', desc: 'Gere carrosséis de alta retenção em 30 segundos', href: '/dashboard/carousels' },
          { title: 'Roteiros', desc: 'Crie roteiros de Reels e Stories com ganchos magnéticos', href: '/dashboard/scripts' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-500/50 hover:bg-violet-500/5 transition group"
          >
            <h3 className="font-semibold text-zinc-100 group-hover:text-violet-300 transition">{item.title}</h3>
            <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-24 rounded-xl bg-zinc-800 animate-pulse" />}>
      <DashboardContent />
    </Suspense>
  )
}
