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
    <div className="w-full relative overflow-hidden bg-[#03150d] pt-18 pb-8 sm:pt-28 sm:pb-12 md:pt-36 md:pb-20 lg:py-33 select-none">
      {/* Background Floating Leaves */}
      <div className="absolute top-8 left-[10%] w-8 h-8 text-emerald-600/10 pointer-events-none rotate-[45deg] animate-pulse">
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-16 left-[35%] w-6 h-6 text-emerald-600/10 pointer-events-none rotate-[-30deg] animate-bounce-slow">
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute top-24 right-[45%] w-10 h-10 text-emerald-600/10 pointer-events-none rotate-[15deg] animate-bounce-slow" style={{ animationDelay: '2s' }}>
        <LeafIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-12 right-[8%] w-12 h-12 text-emerald-600/10 pointer-events-none rotate-[-60deg] animate-pulse" style={{ animationDelay: '1s' }}>
        <LeafIcon className="w-full h-full" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 text-left space-y-4 sm:space-y-6 max-w-2xl">
            {/* Small Green Badge */}
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs md:text-sm">
              <span>🌱</span> FUEL YOUR DAY, LIVE HEALTHY.
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#e8f5e9] leading-tight font-serif">
              Eat Fresh. Live Well. <br />
              <span className="relative">
                Shop Smart.
                <span className="inline-block text-2xl sm:text-4xl md:text-5xl ml-2 sm:ml-3">🌱</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base md:text-lg text-[#a5d6a7] leading-relaxed max-w-lg">
              Discover a wide range of 100% organic products for a healthier you and a better planet.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => router.push("/search")}
                className="px-6 py-3 bg-[#1b4332] text-white font-bold rounded-xl hover:bg-[#0f2d1e] transition-all shadow-md hover:shadow-lg active:scale-95 text-xs sm:text-base"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/categories")}
                className="px-6 py-3 bg-transparent text-white font-bold rounded-xl border border-white/20 hover:border-white hover:bg-white/5 transition-all active:scale-95 text-xs sm:text-base"
              >
                Explore Categories
              </button>
            </div>

            {/* Bottom Features Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 sm:pt-6 border-t border-[#a5d6a7]/15">
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-[#a5d6a7]/90">
                <span className="text-emerald-400">🌱</span> 100% Original
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-[#a5d6a7]/90">
                <span className="text-emerald-400">🚚</span> Free Shipping on orders over $49
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-sm font-semibold text-[#a5d6a7]/90">
                <span className="text-emerald-400">🛡️</span> Secure Payment
              </div>
            </div>
          </div>

          {/* Right Column: Basket Graphic (Hidden on Mobile/Tablet for better flow) */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center">
            {/* 100% Organic Badge */}
            <div className="absolute top-4 right-4 md:right-8 lg:right-4 z-30 bg-[#40916c] text-white p-4 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg transform rotate-12 transition-transform hover:scale-105 duration-300 border border-white/20 select-none">
              <span className="text-base sm:text-lg leading-none">🌱</span>
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase mt-1">100%</span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">Original</span>
            </div>

            {/* Floating Card: Healthy Snacks */}
            <div className="absolute -top-4 left-4 md:left-8 lg:left-4 z-30 bg-slate-900/90 backdrop-blur px-4 py-2.5 rounded-2xl shadow-md border border-slate-800 flex items-center gap-2 animate-bounce-slow">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              <span className="text-xs font-bold text-emerald-400">Shop Easy</span>
            </div>

            {/* Image Container with subtle shadow and background glow */}
            <div className="relative w-full aspect-square max-w-[380px] sm:max-w-[420px] rounded-3xl overflow-hidden flex items-center justify-center p-4">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-emerald-200/30 rounded-full filter blur-3xl -z-10" />
              <img
                src="/images/healthy_snacks_basket.png"
                alt="Healthy Organic Snacks Basket"
                className="w-full h-auto object-contain max-h-[350px] drop-shadow-[0_20px_40px_rgba(27,67,50,0.15)] hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;