import React from "react";
import { useRouter } from "next/router";

const LeafIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17 8C8 10 7 19 7 19S13.5 17.5 17 12C18.5 9.7 19.8 4.2 19.8 4.2S18.5 6.2 17 8Z" />
    <path d="M7 19C7 19 6.2 14.5 9.5 11.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const HeroBanner = () => {
  const router = useRouter();

  return (
    <div className="w-full relative overflow-hidden bg-black py-8 sm:py-10 md:py-12 lg:py-14 select-none border-b border-white/5 flex items-center">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-sky-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Background Floating Leaves */}
      <div className="absolute top-8 left-[10%] w-8 h-8 text-blue-500/15 pointer-events-none rotate-[45deg] animate-pulse">
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-16 left-[35%] w-6 h-6 text-blue-500/15 pointer-events-none rotate-[-30deg] animate-bounce-slow">
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute top-24 right-[45%] w-10 h-10 text-blue-500/15 pointer-events-none rotate-[15deg] animate-bounce-slow" style={{ animationDelay: '2s' }}>
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-12 right-[8%] w-12 h-12 text-blue-500/15 pointer-events-none rotate-[-60deg] animate-pulse" style={{ animationDelay: '1s' }}>
        <LeafIcon className="w-full h-full" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 text-left space-y-4 sm:space-y-6 max-w-2xl">
            {/* Small Blue Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
              <span>⚡</span> FUEL YOUR DAY, LIVE HEALTHY.
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
              Eat Fresh. Live Well. <br />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
                Shop Smart.

              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-lg font-sans">
              Discover a wide range of 100% organic products for a healthier you and a better planet.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => router.push("/search")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-950/50 hover:shadow-blue-900/60 active:scale-95 text-xs sm:text-base"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/categories")}
                className="px-6 py-3 bg-[#111114] text-white font-bold rounded-xl border border-white/15 hover:border-white/30 hover:bg-[#18181d] transition-all active:scale-95 text-xs sm:text-base"
              >
                Explore Categories
              </button>
            </div>

            {/* Bottom Features Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-gray-300">
                <span className="text-blue-400">✨</span> 100% Original
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-gray-300">
                <span className="text-blue-400">🚚</span> Free Shipping on orders over $49
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-gray-300">
                <span className="text-blue-400">🛡️</span> Secure Payment
              </div>
            </div>
          </div>

          {/* Right Column: Basket Graphic (Hidden on Mobile/Tablet for better flow) */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            {/* 100% Organic Badge */}
            <div className="absolute top-4 right-4 md:right-8 lg:right-4 z-30 bg-blue-600 text-white p-4 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-2xl transform rotate-12 transition-transform hover:scale-105 duration-300 border border-white/20 select-none">
              <span className="text-base sm:text-lg leading-none">✨</span>
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase mt-1">100%</span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">Original</span>
            </div>

            {/* Floating Card: Healthy Snacks */}
            <div className="absolute -top-4 left-4 md:left-8 lg:left-4 z-30 bg-[#111114]/95 backdrop-blur px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2 animate-bounce-slow">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              <span className="text-xs font-bold text-blue-400">Shop Easy</span>
            </div>

            {/* Image Container with subtle shadow and background glow */}
            <div className="relative w-full aspect-square max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden flex items-center justify-center p-4">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-3xl -z-10" />
              <img
                src="/images/healthy_snacks_basket.png"
                alt="Healthy Organic Snacks Basket"
                className="w-full h-auto object-contain max-h-[350px] drop-shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;