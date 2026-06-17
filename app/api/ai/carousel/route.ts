import { NextResponse, type NextRequest } from 'next/server'
import { generateCarousel } from '@/lib/gemini/client'
import { saveCarousel } from '@/lib/firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { uid, topic, targetAudience, tone } = await request.json()
    const slides = await generateCarousel(topic, targetAudience, tone)
    const id = await saveCarousel(uid, { topic, slides })
    return NextResponse.json({ id, slides })
  } catch (error) {
    console.error('[ai/carousel]', error)
    return NextResponse.json({ error: 'Falha ao gerar carrossel' }, { status: 500 })
  }
}
