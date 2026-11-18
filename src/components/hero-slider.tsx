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
  const counter = String(index + 1).padStart(2, "0");
  const last = String(total).padStart(2, "0");

  return (
    <div
      className="hero-frame mb-3 sm:mb-7"
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
            <Link href={slide.link} className="relative block aspect-[2.4/1] w-full sm:aspect-video" aria-label="Open promotion">
              <Image
                src={slide.image}
                alt="Promotion"
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                className="object-cover"
                unoptimized
                priority
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-gold/40 bg-black/65 px-2.5 py-1.5 backdrop-blur">
        <span className="num text-xs font-bold text-gold">{counter}</span>
        <span className="h-3 w-px bg-gold/40" />
        <span className="num text-[10px] text-white/60">{last}</span>
      </div>

      <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-black/45 px-3 py-1.5 eyebrow !text-[8px] text-white/65 backdrop-blur">
        Featured slip
      </span>

      {total > 1 ? (
        <>
          <div className="absolute inset-x-4 bottom-4 z-10 flex items-center gap-1.5">
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${dotIndex + 1}`}
                onClick={() => go(dotIndex)}
                  className={`h-[3px] flex-1 rounded-full transition-all ${
                  dotIndex === index ? "bg-gold" : "bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
