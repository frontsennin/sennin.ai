import type { FieldValue } from 'firebase/firestore'

export interface UserProfile {
  displayName: string
  email: string
  plan: 'free' | 'pro'
  createdAt: FieldValue
  instagram?: {
    username: string
    profilePicUrl: string
    connectedAt: FieldValue
  }
}

export interface InstagramMetrics {
  username: string
  profilePicUrl: string
  followers: number
  following: number
  posts: number
  avgLikes: number
  avgComments: number
  engagementRate: number
  topPostsUrls: string[]
}

export interface AnalysisInsights {
  strengths: string[]
  weaknesses: string[]
  editorialLines: string[]
}

export interface Analysis {
  id?: string
  createdAt?: FieldValue
  metrics: InstagramMetrics
  insights: AnalysisInsights
}

export interface CarouselSlide {
  index: number
  title: string
  body: string
}

export interface Carousel {
  id?: string
  topic: string
  createdAt?: FieldValue
  slides: CarouselSlide[]
}

export interface ScriptContent {
  hook: string
  scenes: string[]
  caption: string
  cta: string
}

export interface Script {
  id?: string
  type: 'reel' | 'story_sequence'
  topic: string
  createdAt?: FieldValue
  content: ScriptContent
}
