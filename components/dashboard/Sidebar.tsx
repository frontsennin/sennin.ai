'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, LayoutGrid, Film, Home, LogOut } from 'lucide-react'
import { signOut } from '@/lib/firebase/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: Home },
  { href: '/dashboard/analysis', label: 'Análise de Perfil', icon: BarChart3 },
  { href: '/dashboard/carousels', label: 'Carrosséis', icon: LayoutGrid },
  { href: '/dashboard/scripts', label: 'Roteiros', icon: Film },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-800">
        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Sennin.ai
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
              pathname === href
                ? 'bg-violet-600 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
