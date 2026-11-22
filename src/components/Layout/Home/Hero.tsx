'use client';

import React, { useEffect, useState } from 'react';

const images = [
  '/images/banner1.png',
  '/images/banner2.png',
  '/images/banner3.png',
  '/images/banner4.png',
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-136 overflow-hidden">
      {/* Background images (fade effect) */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Halka dark overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Button (Downbar er container er sathe aligned) */}
      <div className="absolute inset-x-0 bottom-4 z-10">
        <div className="mx-auto w-full max-w-7xl">
          <button className="w-56 rounded-md border border-white/60 bg-transparent py-3 text-lg font-medium uppercase tracking-wide text-white/90 transition hover:bg-white/10 hover:text-white">
            Read More
          </button>
        </div>
      </div>

      {/* Hollow dots (bottom-center) */}
      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 w-3 rounded-full border border-white/80 transition ${index === current ? 'bg-white/90' : 'bg-transparent'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;