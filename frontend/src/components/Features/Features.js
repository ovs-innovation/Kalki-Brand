import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoArrowForward,
  IoCheckmarkCircle,
  IoRibbonOutline
} from 'react-icons/io5';

const PharmacyPromoFeatures = () => {
  const trustFeatures = [
    {
      id: 1,
      title: '100% Genuine Quality',
      description: 'Every product is hand-inspected from certified farm partners and trusted brands.',
      icon: <IoShieldCheckmarkOutline className="w-6 h-6 text-blue-400" />
    },
    {
      id: 2,
      title: 'Superfast Doorstep Delivery',
      description: 'Your groceries and daily essentials dispatched with priority speed in minutes.',
      icon: <IoFlashOutline className="w-6 h-6 text-blue-400" />
    },
    {
      id: 3,
      title: 'Guaranteed Best Prices',
      description: 'Supermarket rates without hidden charges, plus secure digital & cash payments.',
      icon: <IoRibbonOutline className="w-6 h-6 text-blue-400" />
    }
  ];

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12 bg-transparent space-y-12">
      {/* 1. Modern Themed Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full rounded-3xl bg-gradient-to-br from-[#0c0d16] via-[#0e101a] to-[#08090f] border border-blue-500/20 hover:border-blue-500/40 overflow-hidden p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500"
      >
        {/* Dynamic Abstract Ambient Glows */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-600/[0.12] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-sky-500/[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full relative z-10">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <IoFlashOutline className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Supermarket Prices • Zero Waiting Lines</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Supermarket prices,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
                without the supermarket lines.
              </span>
            </h2>

            {/* Body Copy */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300 font-normal leading-relaxed max-w-xl">
              At KalkiBrand, we believe getting fresh groceries shouldn't be a chore. We connect directly with trusted local farmers and certified producers to bring farm-fresh vegetables, dairy, pantry staples, and daily essentials straight to your kitchen in minutes — at guaranteed lower prices.
            </p>

            {/* Key Metrics / Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 font-semibold bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2">
                <IoCheckmarkCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span>100% Farm Fresh</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 font-semibold bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2">
                <IoFlashOutline className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 font-semibold bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 col-span-2 sm:col-span-1">
                <IoRibbonOutline className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Wholesale Rates</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/search"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group"
              >
                <span>Shop Fresh Groceries</span>
                <IoArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-End 3D Visual Asset */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(37,99,235,0.25)] group">
              {/* Subtle Vignette & Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="/images/grocery_promo_banner.jpg"
                alt="Fresh Groceries Quick Delivery"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Trust Badges & Core Features Grid */}
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 pt-2">
        {trustFeatures.map((feature) => (
          <div
            key={feature.id}
            className="flex items-start gap-4 p-5 rounded-2xl bg-[#0c0d14] border border-white/10 hover:border-blue-500/30 hover:bg-[#11131e] transition-all duration-300 shadow-lg group"
          >
            {/* Blue Glow Icon Box */}
            <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:border-blue-500/40 group-hover:bg-blue-600/20 flex items-center justify-center shadow-inner transition-colors">
              {feature.icon}
            </div>

            {/* Description Text */}
            <div className="space-y-1 text-left">
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyPromoFeatures;