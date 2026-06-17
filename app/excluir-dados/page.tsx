'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, CheckCircle2, Loader2, ShieldCheck, Clock, Database, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'

export default function ExcluirDadosPage() {
  const { user } = useAuth()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      })
      if (!res.ok) throw new Error()
      await signOut()
      await fetch('/api/auth/session', { method: 'DELETE' })
      setDone(true)
    } catch {
      setError('Erro ao excluir dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-xl font-bold text-zinc-100">Dados excluídos</h1>
          <p className="text-zinc-400 text-sm">Todos os seus dados foram removidos permanentemente.</p>
          <Link href="/" className="inline-block mt-4 text-violet-400 hover:text-violet-300 text-sm">
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Sennin.ai
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 space-y-10">
        {/* Título */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Exclusão de dados</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Veja abaixo como funciona o processo de exclusão e o que é removido quando você solicita a exclusão dos seus dados no Sennin.ai.
          </p>
        </div>

        {/* Como funciona */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-200">Como funciona a exclusão</h2>
          <div className="space-y-3">
            {[
              {
                icon: LogOut,
                title: 'Desconexão imediata',
                desc: 'Ao confirmar, sua sessão é encerrada e o token de acesso ao Instagram é invalidado imediatamente.',
              },
              {
                icon: Database,
                title: 'Remoção dos dados',
                desc: 'Todos os documentos associados à sua conta (perfil, análises, carrosséis e roteiros) são apagados permanentemente do banco de dados.',
              },
              {
                icon: Clock,
                title: 'Conclusão em até 30 dias',
                desc: 'Eventuais cópias de segurança automáticas são purificadas dentro de 30 dias corridos após a solicitação.',
              },
              {
                icon: ShieldCheck,
                title: 'Sem recuperação',
                desc: 'A exclusão é irreversível. Não é possível recuperar os dados depois de confirmada a solicitação.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-100">{title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* O que será excluído */}
        <section className="p-5 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3 text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">O que será excluído:</p>
          <ul className="space-y-1.5">
            <li>• Perfil e dados de conta (nome, e-mail, foto)</li>
            <li>• Token de acesso do Instagram / Facebook</li>
            <li>• Histórico de análises de perfil geradas pela IA</li>
            <li>• Carrosséis e roteiros criados na plataforma</li>
          </ul>
          <p className="pt-1 text-xs text-zinc-500">
            Após a exclusão, você pode revogar as permissões concedidas ao Sennin.ai diretamente nas{' '}
            <a
              href="https://www.facebook.com/settings?tab=applications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              configurações do Facebook
            </a>.
          </p>
        </section>

        {/* Formulário de exclusão */}
        {user ? (
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-zinc-200">Confirmar exclusão</h2>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">
                Digite <span className="text-red-400 font-mono">EXCLUIR</span> para confirmar
              </label>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="EXCLUIR"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition font-mono"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'EXCLUIR' || loading}
              className={cn(
                'w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2',
                'bg-red-600 hover:bg-red-500 text-white',
                (confirmText !== 'EXCLUIR' || loading) && 'opacity-40 cursor-not-allowed'
              )}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Excluindo...</>
                : <><Trash2 className="w-4 h-4" /> Excluir todos os meus dados</>}
            </button>
          </section>
        ) : (
          <section className="text-center space-y-3">
            <p className="text-zinc-400 text-sm">Faça login para solicitar a exclusão dos seus dados.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition"
            >
              Fazer login
            </Link>
          </section>
        )}

        <p className="text-center text-xs text-zinc-600">
          Dúvidas?{' '}
          <a href="mailto:contato@sennin.ai" className="text-zinc-500 hover:text-zinc-400">
            contato@sennin.ai
          </a>
          {' '}·{' '}
          <Link href="/privacidade" className="text-zinc-500 hover:text-zinc-400">
            Política de Privacidade
          </Link>
        </p>
      </main>
    </div>
  )
}
