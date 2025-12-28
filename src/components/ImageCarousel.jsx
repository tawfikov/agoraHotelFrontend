import { useEffect, useState } from "react"

export const ImageCarousel = ({ images = [] }) => {
  const [current, setCurrent] = useState(0)
  const interval = 5000

  useEffect(() => {
    if (!images.length) return undefined
    const id = setInterval(() => {
      setCurrent((idx) => (idx + 1) % images.length)
    }, interval)
    return () => clearInterval(id)
  }, [images.length, interval])

  if (!images.length) {
    return (
      <div className="w-full h-64 sm:h-72 flex items-center justify-center bg-amber-50 text-amber-900 rounded-xl border border-amber-100" />
    )
  }

  const handleSelect = (idx) => setCurrent(idx)

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-md bg-white">
      <div className="h-72 sm:h-80 md:h-115">
        <img
          key={images[current]}
          src={images[current]}
          alt={`Carousel item ${current + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-3">
        <button
          aria-label="Previous image"
          className="bg-amber-900/60 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-amber-900 transition"
          onClick={() => handleSelect((current - 1 + images.length) % images.length)}
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          className="bg-amber-900/60 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-amber-900 transition"
          onClick={() => handleSelect((current + 1) % images.length)}
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => handleSelect(idx)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              idx === current ? "bg-amber-700" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
