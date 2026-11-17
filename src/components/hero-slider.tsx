"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Slider } from "@/lib/types";

export function HeroSlider({ slides }: { slides: Slider[] }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = touchStart.current - event.changedTouches[0].clientX;
        if (delta > 50) go(index + 1);
        if (delta < -50) go(index - 1);
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full shrink-0">
            <Link href={slide.link} className="relative block aspect-video w-full">
              <Image
                src={slide.image}
                alt="ChampeeTips promotion"
                fill
                sizes="(max-width: 500px) 100vw, 500px"
                className="object-cover"
                unoptimized
                priority
              />
            </Link>
          </div>
        ))}
      </div>

      {total > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${dotIndex + 1}`}
                onClick={() => go(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  dotIndex === index ? "w-6 bg-gold shadow-[0_0_8px_rgba(220,185,127,0.6)]" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
