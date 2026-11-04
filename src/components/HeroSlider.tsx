import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  buttonText: string;
}
const slides: Slide[] = [
  {
    id: 1,
    badge: 'BOOKNOOK SANCTUARY',
    title: 'Share the books on your shelf',
    subtitle: 'Community Book Sharing',
    description: 'Add the books you have finished. Let other readers enjoy them too.',
    image: '/hero_reading_community_1793372263414.png',
    buttonText: 'Browse Books',
  },
  {
    id: 2,
    badge: 'COMMUNITY LENDING',
    title: 'Discover reads from nearby shelves',
    subtitle: 'The Core BookNook Philosophy',
    description: 'Borrow physical books from fellow bookworms in your neighborhood with a single click.',
    image: '/hero_library_sanctuary_1793372262984.png',
    buttonText: 'Explore Books',
  },
  {
    id: 3,
    badge: 'PASS IT FORWARD',
    title: 'Give your paperbacks a second life',
    subtitle: 'Boundless Horizons of Knowledge',
    description: 'Reduce waste and spread curiosity by passing along your well-loved copies.',
    image: '/hero_vintage_classics_1793372263916.png',
    buttonText: 'Start Reading',
  },
];
interface HeroSliderProps {
  slides?: any[];
  onBrowseBooks?: () => void;
  onBrowseClick?: () => void;
  onShareClick?: () => void;
}
export function HeroSlider({ onBrowseBooks, onBrowseClick, onShareClick }: HeroSliderProps) {
  const handleBrowse = onBrowseBooks || onBrowseClick || (() => {});
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);
  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  const activeSlide = slides[current];
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      <div className="relative h-[460px] sm:h-[520px] lg:h-[580px] w-full">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${ isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'  }`} >
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('.png')) {
                    target.src = target.src.replace(/\.png$/, '');
                  } else if (!target.src.includes('unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop';
                  }
                }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 max-w-2xl select-none">
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#d97746] uppercase font-sans">
                    {slide.badge}
                  </div>
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal text-white tracking-tight leading-[1.12] drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-stone-200/90 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-lg drop-shadow">
                    {slide.description}
                  </p>

                  <div className="pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={handleBrowse}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm sm:text-base font-semibold text-[#112216] bg-[#7da887] hover:bg-[#8eb898] shadow-lg hover:shadow-[#7da887]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer group focus:outline-none">
                      <BookOpen className="w-4 h-4 text-[#112216]" />
                      <span>{slide.buttonText}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex items-center gap-1.5 px-1">
          {slides.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${ i === current ? 'w-6 bg-[#e5a93c]' : 'w-2 bg-white/40 hover:bg-white/70' }`} /> ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer" >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
export default HeroSlider;