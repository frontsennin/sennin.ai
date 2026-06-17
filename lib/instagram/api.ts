const GRAPH = 'https://graph.facebook.com/v20.0'

export async function exchangeCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
    code,
  })
  const res = await fetch(`${GRAPH}/oauth/access_token?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Falha ao trocar código')
  return data.access_token
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    fb_exchange_token: shortToken,
  })
  const res = await fetch(`${GRAPH}/oauth/access_token?${params}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Falha ao obter token longo')
  return data.access_token
}

export async function getInstagramAccountId(pageAccessToken: string, pageId: string): Promise<string> {
  const res = await fetch(
    `${GRAPH}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
  )
  const data = await res.json()
  if (!data.instagram_business_account?.id) {
    throw new Error('Nenhuma conta Instagram Business vinculada a esta página')
  }
  return data.instagram_business_account.id
}

export async function getPages(userToken: string): Promise<{ id: string; access_token: string; name: string }[]> {
  const res = await fetch(`${GRAPH}/me/accounts?access_token=${userToken}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Falha ao buscar páginas')
  return data.data ?? []
}

export async function getInstagramProfile(igUserId: string, token: string) {
  const fields = 'username,name,biography,followers_count,follows_count,media_count,profile_picture_url'
  const res = await fetch(`${GRAPH}/${igUserId}?fields=${fields}&access_token=${token}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Falha ao buscar perfil')
  return data
}

export async function getMediaInsights(igUserId: string, token: string) {
  const fields = 'id,like_count,comments_count,timestamp,media_type'
  const res = await fetch(
    `${GRAPH}/${igUserId}/media?fields=${fields}&limit=20&access_token=${token}`
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Falha ao buscar mídia')
  return (data.data ?? []) as Array<{
    id: string
    like_count: number
    comments_count: number
    timestamp: string
    media_type: string
  }>
}
