import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { idToken } = await request.json()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('session', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('session')
  return response
}
