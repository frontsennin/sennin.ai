import { NextResponse, type NextRequest } from 'next/server'

const SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
].join(',')

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'uid obrigatório' }, { status: 400 })

  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    scope: SCOPES,
    response_type: 'code',
    state: uid,
  })

  return NextResponse.redirect(
    `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`
  )
}
