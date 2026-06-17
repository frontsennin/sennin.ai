import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/firebase/firestore'
import {
  doc, collection, getDocs, writeBatch,
} from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json()
    if (!uid) return NextResponse.json({ error: 'uid obrigatório' }, { status: 400 })

    const batch = writeBatch(db)

    // Exclui documento do usuário
    batch.delete(doc(db, 'users', uid))

    // Exclui subcoleções
    for (const col of ['analyses', 'carousels', 'scripts']) {
      const snap = await getDocs(collection(db, col, uid, 'items'))
      snap.forEach((d) => batch.delete(d.ref))
      batch.delete(doc(db, col, uid))
    }

    await batch.commit()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[auth/delete]', err)
    return NextResponse.json({ error: 'Falha ao excluir dados' }, { status: 500 })
  }
}
