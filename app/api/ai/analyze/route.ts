import { NextResponse, type NextRequest } from 'next/server'
import { analyzeInstagramProfile } from '@/lib/gemini/client'
import { saveAnalysis } from '@/lib/firebase/firestore'
import type { InstagramMetrics } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { uid, metrics }: { uid: string; metrics: InstagramMetrics } = await request.json()
    const insights = await analyzeInstagramProfile(metrics)
    const id = await saveAnalysis(uid, { metrics, insights })
    return NextResponse.json({ id, insights })
  } catch (error) {
    console.error('[ai/analyze]', error)
    return NextResponse.json({ error: 'Falha ao analisar perfil' }, { status: 500 })
  }
}
