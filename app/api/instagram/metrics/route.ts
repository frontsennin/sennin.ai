import { NextResponse, type NextRequest } from 'next/server'
import { mockInstagramMetrics } from '@/lib/instagram/mock'
import { db } from '@/lib/firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'
import { getInstagramProfile, getMediaInsights } from '@/lib/instagram/api'
import type { InstagramMetrics } from '@/lib/types'

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get('uid')

  if (uid) {
    try {
      const userSnap = await getDoc(doc(db, 'users', uid))
      const instagram = userSnap.data()?.instagram

      if (instagram?.igUserId && instagram?.pageAccessToken) {
        const profile = await getInstagramProfile(instagram.igUserId, instagram.pageAccessToken)
        const media = await getMediaInsights(instagram.igUserId, instagram.pageAccessToken)

        const totalLikes = media.reduce((s, m) => s + (m.like_count ?? 0), 0)
        const totalComments = media.reduce((s, m) => s + (m.comments_count ?? 0), 0)
        const count = media.length || 1

        const metrics: InstagramMetrics = {
          username: profile.username,
          profilePicUrl: profile.profile_picture_url ?? '',
          followers: profile.followers_count ?? 0,
          following: profile.follows_count ?? 0,
          posts: profile.media_count ?? 0,
          avgLikes: Math.round(totalLikes / count),
          avgComments: Math.round(totalComments / count),
          engagementRate: profile.followers_count
            ? Number((((totalLikes + totalComments) / count / profile.followers_count) * 100).toFixed(2))
            : 0,
          topPostsUrls: [],
        }

        return NextResponse.json({ ...metrics, isReal: true })
      }
    } catch (err) {
      console.error('[metrics] Erro ao buscar dados reais, usando mock:', err)
    }
  }

  return NextResponse.json({ ...mockInstagramMetrics, isReal: false })
}
