import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    headline1: "EXPERIENCE FASHION",
    headline2: "BEYOND IMAGES",
    cta2: "SHOP NOW",
    link2: "/shop",
  },
  {
    headline1: "DISCOVER THE STYLE",
    headline2: "LIKE NEVER BEFORE",
    cta2: "SHOP NOW",
    link2: "/shop",
  },
  {
    headline1: "UNLEASH YOUR COMFORT",
    headline2: "UNRESTRICTED STYLE",
    cta2: "SHOP NOW",
    link2: "/shop",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current, animating]);

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setAnimating(false);
    }, 350);
  };

  const goPrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setAnimating(false);
    }, 350);
  };

  const slide = slides[current];

  return (
    <section
      id="test-hero"
      className="test-hero"
      aria-label="Hero section"
    >
      {/* ── Background decorative border frame ── */}
      <div className="test-hero__frame" aria-hidden="true">
        <div className="test-hero__frame-inner" />
      </div>

      {/* ── Side nav arrows ── */}
      <button
        id="test-hero-prev"
        className="test-hero__arrow test-hero__arrow--left"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <button
        id="test-hero-next"
        className="test-hero__arrow test-hero__arrow--right"
        onClick={goNext}
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      {/* ── Main content ── */}
      <div className={`test-hero__content ${animating ? "test-hero__content--exit" : "test-hero__content--enter"}`}>
        {/* Headline */}
        <h1 className="test-hero__headline1">{slide.headline1}</h1>
        <p className="test-hero__headline2">{slide.headline2}</p>

        {/* Buttons */}
        <div className="test-hero__actions">
          <Link to={slide.link2} id="test-hero-book" className="test-hero__btn test-hero__btn--filled">
            {slide.cta2}
          </Link>
        </div>
      </div>

      {/* ── 3D Product / Character image ── */}
      <div className="test-hero__product-wrap">
        <div className="test-hero__product-shadow" aria-hidden="true" />
        <img
          src="/images/hero-hoodie.png"
          alt="3D Fashion Experience"
          className="test-hero__product-img"
        />
      </div>

      {/* ── Slide dots ── */}
      <div className="test-hero__dots" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            id={`test-hero-dot-${i}`}
            className={`test-hero__dot ${i === current ? "test-hero__dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
