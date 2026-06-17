'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signInWithGoogle, signInWithFacebook } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function setSession(user: { getIdToken: () => Promise<string> }) {
    const idToken = await user.getIdToken()
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await signInWithEmail(email, password)
      await setSession(user)
      router.push('/dashboard')
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      await setSession(user)
      router.push('/dashboard')
    } catch {
      setError('Falha ao entrar com Google.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFacebookLogin() {
    setError('')
    setLoading(true)
    try {
      const user = await signInWithFacebook()
      await setSession(user)
      router.push('/dashboard')
    } catch {
      setError('Falha ao entrar com Facebook.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Sennin.ai
          </div>
          <p className="mt-2 text-zinc-400 text-sm">Entre na sua conta</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-3 rounded-lg font-semibold transition',
              'bg-violet-600 hover:bg-violet-500 text-white',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs text-zinc-500">
            <span className="bg-zinc-950 px-2">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={cn(
            'w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-3',
            'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <button
          onClick={handleFacebookLogin}
          disabled={loading}
          className={cn(
            'w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-3',
            'bg-[#1877F2] hover:bg-[#166FE5] text-white',
            loading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Entrar com Facebook
        </button>

        <p className="text-center text-sm text-zinc-500">
          Não tem conta?{' '}
          <Link href="/register" className="text-violet-400 hover:text-violet-300">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
