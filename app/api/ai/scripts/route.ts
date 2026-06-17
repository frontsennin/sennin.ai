import { NextResponse, type NextRequest } from 'next/server'
import { generateScript } from '@/lib/gemini/client'
import { saveScript } from '@/lib/firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { uid, type, topic, duration } = await request.json()
    const content = await generateScript(type, topic, duration)
    const id = await saveScript(uid, { type, topic, content })
    return NextResponse.json({ id, content })
  } catch (error) {
    console.error('[ai/scripts]', error)
    return NextResponse.json({ error: 'Falha ao gerar roteiro' }, { status: 500 })
  }
}
