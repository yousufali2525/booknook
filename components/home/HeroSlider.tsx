'use client';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
const slides = [
  {
    id: 1,
    title: 'Discover Your Next Great Literary Journey',
    tagline: 'Curated Collection',
    description:
      'Explore over 10,000+ timeless classics, modern bestsellers, and scientific insights in our community library.',
    image: '/hero1.jpg',
    buttonText: 'Browse Books',
    buttonLink: '/books',
  },
  {
    id: 2,
    title: 'Borrow Freely, Read Deeply, Return Easily',
    tagline: 'Simple Borrowing System',
    description:
      'Experience hassle-free reading. Pick your favorite title, borrow with one click, and expand your perspective.',
    image: '/hero2.jpg',
    buttonText: 'Explore Catalog',
    buttonLink: '/books',
  },
  {
    id: 3,
    title: 'Share Books and Empower Fellow Readers',
    tagline: 'Community Library',
    description:
      'Got books that inspired you? Contribute them to BookNook and let another curious mind discover them today.',
    image: '/hero3.jpg',
    buttonText: 'Add a Book',
    buttonLink: '/add-book',
  },
];
export default function HeroSlider() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-stone-900 text-white shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false,  }}
        pagination={{
          clickable: true,
        }}
        navigation
        className="booknook-swiper" >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative h-[420px] sm:h-[460px] md:h-[500px] lg:h-[580px] w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}>
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-12 flex flex-col justify-center">
                <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md border border-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.tagline}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-stone-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm shadow-md transition-all hover:scale-105">
                      <BookOpen className="w-4 h-4" />
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-stone-100 text-xs sm:text-sm font-medium backdrop-blur-md transition-all border border-white/15" >  View All Catalog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}