import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Sennin.ai — Diretor de Criação para Instagram',
  description: 'Analise seu perfil, planeje carrosséis e crie roteiros de Reels com IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
