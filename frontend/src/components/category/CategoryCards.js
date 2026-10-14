import React from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Internal imports
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CategoryServices from "@services/CategoryServices";

const CategoryCards = () => {
  const router = useRouter();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const { data: dbCategories, isLoading } = useQuery({
    queryKey: ["category-cards-home"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const categories = (Array.isArray(dbCategories) && dbCategories.length > 0)
    ? dbCategories.map((c, idx) => {
        const title = showingTranslateValue(c.name) || c.name?.en || c.name?.default || "Category";
        const slug = c.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return {
          id: c._id || idx,
          _id: c._id,
          title,
          image: c.icon || c.image || `/flags/cat${(idx % 6) + 1}.webp`,
          slug,
        };
      })
    : [];

  const handleCategoryClick = (category) => {
    router.push(`/search?category=${encodeURIComponent(category.title)}&_id=${category._id}`);
  };

  // Loading skeleton state to prevent empty layout shifts
  if (isLoading) {
    return (
      <div className="w-full bg-black py-8 md:py-12 relative overflow-hidden">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8 pb-2">
            <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-zinc-800 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/60 border border-white/5 animate-pulse">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-zinc-800 mb-3" />
                <div className="h-4 w-24 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const isGrid = categories.length <= 6;

  // Responsive grid class based on category count for centered, balanced layout
  const getGridColsClass = () => {
    switch (categories.length) {
      case 1:
        return "grid-cols-1 max-w-xs";
      case 2:
        return "grid-cols-2 max-w-md";
      case 3:
        return "grid-cols-1 sm:grid-cols-3 max-w-3xl";
      case 4:
        return "grid-cols-2 sm:grid-cols-4 max-w-5xl";
      case 5:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-6xl";
      case 6:
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-7xl";
    }
  };

  return (
    <div className="w-full bg-black py-8 md:py-12 relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {storeCustomizationSetting?.home?.hero_title ? "Shop by Categories" : "Shop by Categories"}
            </h2>
          </div>

          {/* View All Button */}
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue-600/40 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            View All
            <span className="text-sm font-normal">→</span>
          </button>
        </div>

        {/* Categories Showcase: Grid for <= 6 items, Carousel for > 6 items */}
        {isGrid ? (
          <div className={`grid ${getGridColsClass()} gap-4 sm:gap-6 mx-auto justify-center`}>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-blue-500/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] cursor-pointer text-center select-none"
              >
                {/* Category Image Box */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-contain filter drop-shadow-md rounded-lg"
                    onError={(e) => {
                      e.target.src = "/flags/cat1.webp";
                    }}
                  />
                </div>

                {/* Category Title */}
                <h3 className="mt-3 text-xs sm:text-sm md:text-base font-semibold text-zinc-100 text-center tracking-tight px-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <Swiper
              key={`cat-swiper-${categories.length}`}
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              slidesPerView={2.2}
              observer={true}
              observeParents={true}
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
                    onClick={() => handleCategoryClick(category)}
                    className="group flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-blue-500/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] cursor-pointer text-center select-none"
                  >
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5 group-hover:border-blue-500/30 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-contain filter drop-shadow-md rounded-lg"
                        onError={(e) => {
                          e.target.src = "/flags/cat1.webp";
                        }}
                      />
                    </div>

                    <h3 className="mt-3 text-xs sm:text-sm md:text-base font-semibold text-zinc-100 text-center tracking-tight px-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Slide Navigation Buttons */}
            <button
              className="cat-prev absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 z-30 flex items-center justify-center rounded-full bg-black/85 border border-white/20 text-white shadow-2xl hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none"
              aria-label="Previous"
            >
              <IoChevronBack className="text-lg sm:text-xl" />
            </button>
            <button
              className="cat-next absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 z-30 flex items-center justify-center rounded-full bg-black/85 border border-white/20 text-white shadow-2xl hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none"
              aria-label="Next"
            >
              <IoChevronForward className="text-lg sm:text-xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCards;