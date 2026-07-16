import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Internal imports
import useGetSetting from "@hooks/useGetSetting";

const CategoryCards = () => {
  const router = useRouter();
  const { storeCustomizationSetting } = useGetSetting();

  // Matched exactly to your assets while adopting the color schemes from the screenshot
  const categories = [
    {
      id: 1,
      title: "Rice, Atta & Dals",
      image: "/flags/cat1.webp",
      searchQuery: "Rice & Dals",
      cardStyle: "border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-emerald-500/10 shadow-[inset_0_2px_8px_rgba(16,185,129,0.1)]",
    },
    {
      id: 2,
      title: "Hair Care",
      image: "/flags/cat4.webp",
      searchQuery: "Hair Care",
      cardStyle: "border-purple-500/20 hover:border-purple-500/60 hover:bg-purple-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-purple-500/10 shadow-[inset_0_2px_8px_rgba(168,85,247,0.1)]",
    },
    {
      id: 3,
      title: "Spices",
      image: "/flags/cat7.webp",
      searchQuery: "spices & seasonings",
      cardStyle: "border-amber-500/20 hover:border-amber-500/60 hover:bg-amber-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-amber-500/10 shadow-[inset_0_2px_8px_rgba(245,158,11,0.1)]",
    },
    {
      id: 4,
      title: "Oil & Ghee",
      image: "/flags/cat2.webp",
      searchQuery: "oil & ghee",
      cardStyle: "border-sky-500/20 hover:border-sky-500/60 hover:bg-sky-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-sky-500/10 shadow-[inset_0_2px_8px_rgba(14,165,233,0.1)]",
    },
    {
      id: 5,
      title: "Soft Drinks",
      image: "/flags/cat2.webp",
      searchQuery: "soft drinks",
      cardStyle: "border-yellow-500/20 hover:border-yellow-500/60 hover:bg-yellow-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-yellow-500/10 shadow-[inset_0_2px_8px_rgba(234,179,8,0.1)]",
    },
    {
      id: 6,
      title: "Chocolates",
      image: "/flags/cat3.webp",
      searchQuery: "chocolates",
      cardStyle: "border-rose-500/20 hover:border-rose-500/60 hover:bg-rose-950/20 bg-gradient-to-br from-[#0c1322] to-[#080d17]",
      //circleStyle: "bg-rose-500/10 shadow-[inset_0_2px_8px_rgba(244,63,94,0.1)]",
    },
  ];

  return (
    <div className="w-full bg-transparent py-12 md:py-16 relative overflow-hidden border-t border-slate-900/60">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Clean, Modern Header Block matching the screenshot structure */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-900">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              {storeCustomizationSetting?.home?.hero_title ? "Shop by Categories" : "Shop by Categories"}
            </h2>
          </div>

          {/* View All Linked Button */}
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
          >
            View All
            <span className="text-sm font-normal">→</span>
          </button>
        </div>

        {/* Carousel Window */}
        <div className="relative group">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2.2}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 16 },
              640: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: ".cat-prev", nextEl: ".cat-next" }}
            className="category-cards-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div
                  className="flex flex-col items-center cursor-pointer transition-all duration-300 select-none"
                  onClick={() => router.push(`/search?query=${encodeURIComponent(category.searchQuery)}`)}
                >
                  {/* Outer Squared Card Canvas */}
                  <div className={`w-full aspect-square ${category.cardStyle} rounded-2xl flex items-center justify-center p-4 transition-transform duration-300 hover:scale-[1.02] border`}>

                    {/* Inner Centralized Circular Frame */}
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${category.circleStyle} flex items-center justify-center`}>
                      <div className="relativew-20 h-20 md:w-24 md:h-24 transform transition-transform duration-300 hover:scale-105">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                          sizes="(max-width: 768px) 30vw, 15vw"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Clean Category Label Title directly below box container */}
                  <h3 className="mt-4 text-sm md:text-base font-bold text-slate-200 text-center tracking-tight px-1 line-clamp-1">
                    {category.title}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Minimal Hover Arrow Controllers */}
          <button className="cat-prev absolute left-[-16px] top-[40%] -translate-y-1/2 w-9 h-9 z-30 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-slate-800 hover:text-white">
            <IoChevronBack size={16} />
          </button>
          <button className="cat-next absolute right-[-16px] top-[40%] -translate-y-1/2 w-9 h-9 z-30 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-slate-800 hover:text-white">
            <IoChevronForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;