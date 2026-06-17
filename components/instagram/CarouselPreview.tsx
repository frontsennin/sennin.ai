import type { CarouselSlide } from '@/lib/types'

interface CarouselPreviewProps {
  slides: CarouselSlide[]
}

const SLIDE_COLORS = [
  'from-violet-600 to-purple-700',
  'from-purple-700 to-fuchsia-700',
  'from-fuchsia-700 to-pink-700',
  'from-pink-700 to-rose-700',
  'from-rose-600 to-orange-600',
  'from-orange-600 to-amber-600',
  'from-violet-700 to-blue-700',
  'from-blue-700 to-violet-600',
]

export function CarouselPreview({ slides }: CarouselPreviewProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{slides.length} slides</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slides.map((slide) => (
          <div
            key={slide.index}
            className={`bg-gradient-to-br ${SLIDE_COLORS[(slide.index - 1) % SLIDE_COLORS.length]} rounded-xl p-4 aspect-square flex flex-col justify-between`}
          >
            <span className="text-xs font-bold text-white/60">
              {slide.index === 1 ? 'GANCHO' : slide.index === slides.length ? 'CTA' : `Slide ${slide.index}`}
            </span>
            <div>
              <p className="text-white font-bold text-sm leading-tight mb-1">{slide.title}</p>
              <p className="text-white/80 text-xs line-clamp-3">{slide.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {slides.map((slide) => (
          <div key={slide.index} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                Slide {slide.index}
              </span>
              <span className="text-xs font-semibold text-zinc-200">{slide.title}</span>
            </div>
            <p className="text-sm text-zinc-400 whitespace-pre-line">{slide.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
