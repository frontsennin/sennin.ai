import Link from 'next/link'
import { BarChart3, LayoutGrid, Film, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Sennin.ai
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition">
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-16">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Focado 100% em Instagram
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Seu{' '}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Diretor de Criação
            </span>
            {' '}de Bolso
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Analise seu perfil com IA, planeje carrosséis de alta retenção e crie roteiros de
            Reels e Stories — tudo em menos de 1 minuto.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition text-lg"
            >
              Começar grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            {
              icon: BarChart3,
              title: 'Análise de Perfil',
              desc: 'A IA audita suas métricas e entrega pontos fortes, fracos e 3 linhas editoriais prontas para usar.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
            },
            {
              icon: LayoutGrid,
              title: 'Planejador de Carrosséis',
              desc: 'Digite o tema e receba 8 slides estruturados: gancho magnético, conteúdo denso e CTA irresistível.',
              color: 'text-violet-400',
              bg: 'bg-violet-500/10 border-violet-500/30',
            },
            {
              icon: Film,
              title: 'Roteiros de Reels e Stories',
              desc: 'Gere roteiros com ganchos para os primeiros 3 segundos e sequências de Stories com gatilhos mentais.',
              color: 'text-pink-400',
              bg: 'bg-pink-500/10 border-pink-500/30',
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={`p-6 rounded-xl border ${bg} space-y-3 text-left`}>
              <Icon className={`w-6 h-6 ${color}`} />
              <h3 className="font-semibold text-zinc-100">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-4 flex items-center justify-center gap-4 text-xs text-zinc-600">
        <span>© 2026 Sennin.ai</span>
        <Link href="/privacidade" className="hover:text-zinc-400 transition">Política de Privacidade</Link>
        <Link href="/excluir-dados" className="hover:text-zinc-400 transition">Excluir meus dados</Link>
      </footer>
    </div>
  )
}
