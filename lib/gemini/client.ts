import { GoogleGenerativeAI } from '@google/generative-ai'
import type { InstagramMetrics, AnalysisInsights, CarouselSlide, ScriptContent } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

function parseJson<T>(text: string): T {
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean) as T
}

export async function analyzeInstagramProfile(metrics: InstagramMetrics): Promise<AnalysisInsights> {
  const prompt = `Você é um Social Media Auditor Sênior especializado em crescimento no Instagram para o mercado brasileiro. Analise as métricas abaixo e retorne APENAS um JSON válido (sem markdown) com a estrutura exata fornecida.

MÉTRICAS:
${JSON.stringify(metrics, null, 2)}

ESTRUTURA DE SAÍDA (retorne exatamente isso, sem texto extra):
{
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "weaknesses": ["ponto fraco 1", "ponto fraco 2", "ponto fraco 3"],
  "editorialLines": ["linha editorial 1 (ex: tutoriais de X)", "linha editorial 2", "linha editorial 3"]
}

EXEMPLO DE SAÍDA:
{
  "strengths": ["Taxa de engajamento de 5.4% está acima da média do setor (1-3%)", "Base de seguidores altamente engajada com média de 18 comentários por post", "Relação seguidores/seguindo saudável indica crescimento orgânico"],
  "weaknesses": ["Volume de posts (87) pode ser insuficiente para o algoritmo priorizar o perfil", "Poucos seguidores para o nível de engajamento — falta de estratégia de alcance", "Sem consistência visível no calendário de publicações"],
  "editorialLines": ["Bastidores do desenvolvimento de software e IA (build in public)", "Tutoriais rápidos de produtividade com ferramentas de IA para criadores de conteúdo", "Cases de crescimento no Instagram usando dados e estratégia"]
}`

  const result = await model.generateContent(prompt)
  return parseJson<AnalysisInsights>(result.response.text())
}

export async function generateCarousel(topic: string, targetAudience: string, tone: string): Promise<CarouselSlide[]> {
  const prompt = `Você é um estrategista de conteúdo de alta retenção para Instagram especializado no mercado brasileiro. Crie um carrossel de 8 slides sobre o tema abaixo. Retorne APENAS um JSON válido (sem markdown).

TEMA: ${topic}
PÚBLICO-ALVO: ${targetAudience}
TOM: ${tone}

ESTRUTURA OBRIGATÓRIA (exatamente 8 slides):
{
  "slides": [
    { "index": 1, "title": "GANCHO PODEROSO", "body": "Frase de impacto que faz o usuário parar o scroll. Máx 15 palavras." },
    { "index": 2, "title": "Título do slide 2", "body": "Conteúdo denso e formatado. Use • para listas quando necessário." },
    { "index": 3, "title": "Título do slide 3", "body": "..." },
    { "index": 4, "title": "Título do slide 4", "body": "..." },
    { "index": 5, "title": "Título do slide 5", "body": "..." },
    { "index": 6, "title": "Título do slide 6", "body": "..." },
    { "index": 7, "title": "Título do slide 7", "body": "..." },
    { "index": 8, "title": "CALL TO ACTION", "body": "Instrução clara de ação: salvar, compartilhar, comentar ou seguir." }
  ]
}`

  const result = await model.generateContent(prompt)
  const data = parseJson<{ slides: CarouselSlide[] }>(result.response.text())
  return data.slides
}

export async function generateScript(
  type: 'reel' | 'story_sequence',
  topic: string,
  duration?: number
): Promise<ScriptContent> {
  const isReel = type === 'reel'
  const prompt = isReel
    ? `Você é um roteirista de vídeo curto especializado nos primeiros 3 segundos de retenção para Reels do Instagram no mercado brasileiro. Retorne APENAS um JSON válido (sem markdown).

TEMA: ${topic}
DURAÇÃO: ${duration || 30} segundos

{
  "hook": "Frase de gancho magnético para os primeiros 3 segundos (máx 10 palavras, impacto imediato)",
  "scenes": [
    "Cena 1: [0-3s] Descrição do que aparece + legenda/fala",
    "Cena 2: [3-10s] Desenvolvimento do tema principal",
    "Cena 3: [10-20s] Conteúdo de valor / prova",
    "Cena 4: [20-30s] Conclusão e CTA"
  ],
  "caption": "Legenda completa com emojis, hashtags relevantes e CTA para comentários (máx 150 palavras)",
  "cta": "Call to action direto para o final do vídeo (ex: 'Comenta QUERO abaixo')"
}`
    : `Você é um especialista em sequências de Stories no Instagram para o mercado brasileiro. Crie uma sequência de 5 stories usando gatilhos mentais. Retorne APENAS um JSON válido (sem markdown).

TEMA: ${topic}

{
  "hook": "Título do Story 1 — deve gerar curiosidade extrema",
  "scenes": [
    "Story 1 (Bastidores/Gancho): Descrição visual + texto de tela + enquete ou pergunta",
    "Story 2 (Problema): Mostre a dor do público de forma direta",
    "Story 3 (Agitação): Aprofunde o problema, mostre consequências",
    "Story 4 (Solução): Apresente a solução de forma clara e simples",
    "Story 5 (CTA): Direcione para o link, post, ou ação específica"
  ],
  "caption": "Texto de apoio para o story fixado (se houver)",
  "cta": "Ação final que você quer que o seguidor tome"
}`

  const result = await model.generateContent(prompt)
  return parseJson<ScriptContent>(result.response.text())
}
