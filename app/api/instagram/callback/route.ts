import { NextResponse, type NextRequest } from 'next/server'
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getPages,
  getInstagramAccountId,
  getInstagramProfile,
} from '@/lib/instagram/api'
import { db } from '@/lib/firebase/firestore'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const uid = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !uid) {
    return NextResponse.redirect(new URL('/dashboard?instagram=error', request.url))
  }

  try {
    const shortToken = await exchangeCodeForToken(code)
    const longToken = await getLongLivedToken(shortToken)

    const pages = await getPages(longToken)
    if (!pages.length) {
      return NextResponse.redirect(new URL('/dashboard?instagram=no-page', request.url))
    }

    const page = pages[0]
    const igAccountId = await getInstagramAccountId(page.access_token, page.id)
    const profile = await getInstagramProfile(igAccountId, page.access_token)

    await setDoc(
      doc(db, 'users', uid),
      {
        instagram: {
          igUserId: igAccountId,
          pageId: page.id,
          pageAccessToken: page.access_token,
          username: profile.username,
          profilePicUrl: profile.profile_picture_url ?? '',
          connectedAt: serverTimestamp(),
        },
      },
      { merge: true }
    )

    return NextResponse.redirect(new URL('/dashboard?instagram=connected', request.url))
  } catch (err) {
    console.error('[instagram/callback]', err)
    return NextResponse.redirect(new URL('/dashboard?instagram=error', request.url))
  }
}
