import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Internal imports
import CategoryServices from "@services/CategoryServices";
import ProductServices from "@services/ProductServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductCard from "@components/product/ProductCard";

// Resilient category icon component to avoid broken image alt-text spilling out
const CategoryIcon = ({ icon, name, isMobile = false }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (name ? String(name).trim().charAt(0) : "C").toUpperCase();

  useEffect(() => {
    setImgError(false);
  }, [icon]);

  if (!icon || imgError) {
    return (
      <span className={`font-bold ${isMobile ? "text-xs" : "text-sm"} text-blue-400`}>
        {initial}
      </span>
    );
  }

  return (
    <img
      src={icon}
      alt={name || "category"}
      onError={() => setImgError(true)}
      className="w-full h-full object-contain"
    />
  );
};

const FeatureCategory = ({ initialSelectedCategory, attributes }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const [selectedLeft, setSelectedLeft] = useState(initialSelectedCategory || null);

  const { data, error, isLoading: loading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["category-products", selectedLeft?._id],
    queryFn: async () => {
      if (!selectedLeft?._id) return [];
      const res = await ProductServices.getShowingStoreProducts({ category: selectedLeft._id });
      return res?.products || [];
    },
    enabled: !!selectedLeft?._id,
  });

  const parentCategories = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const homeRoot = data.find(cat =>
      cat.id === "Root" ||
      showingTranslateValue(cat?.name)?.toLowerCase() === "home"
    );

    let topLevel = [];
    if (homeRoot && homeRoot.children && homeRoot.children.length > 0) {
      topLevel = homeRoot.children;
    } else {
      topLevel = data;
    }

    return topLevel;
  }, [data, showingTranslateValue]);

  const rightCategories = useMemo(() => {
    return selectedLeft?.children || [];
  }, [selectedLeft]);

  // Set initial selected category once on load without resetting when user clicks another category
  useEffect(() => {
    if (!selectedLeft) {
      if (initialSelectedCategory) {
        setSelectedLeft(initialSelectedCategory);
      } else if (parentCategories.length > 0) {
        setSelectedLeft(parentCategories[0]);
      }
    }
  }, [parentCategories, initialSelectedCategory, selectedLeft]);

  const handleSubcategoryClick = (subcategory) => {
    const catName = showingTranslateValue(subcategory?.name) || "";
    router.push(
      {
        pathname: "/search",
        query: { category: catName, _id: subcategory._id },
      },
      undefined,
      { shallow: false }
    );
  };

  if (loading) return <CMSkeleton count={10} height={20} error={error} loading={loading} />;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 bg-black text-white">

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 border-b border-white/10 pb-2.5">
        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Categories
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Explore our curated collections of organic groceries and daily essentials.
          </p>
        </div>
        <button
          onClick={() => router.push('/search')}
          className="self-start sm:self-auto inline-flex items-center justify-center px-3.5 py-1.5 rounded-full border border-blue-500/30 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 active:scale-95 shadow-sm shadow-blue-500/20"
        >
          View All Products &rarr;
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[16.5rem_1fr] lg:gap-4 items-stretch">

        {/* Left Sidebar - Parent Categories */}
        <div className="w-full mb-3 lg:mb-0 flex flex-col min-h-0">

          {/* Desktop Sidebar Layout */}
          <div className="hidden lg:flex lg:flex-col bg-[#0b0c12] rounded-xl shadow-md border border-white/10 overflow-hidden">
            <div className="bg-[#0f111a] px-3.5 py-2 flex-shrink-0 flex items-center justify-between border-b border-white/10">
              <h3 className="text-xs font-bold text-gray-300 tracking-wider uppercase">Departments</h3>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/20">
                {parentCategories.length}
              </span>
            </div>

            <div className="p-1.5 space-y-1">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                const catTitle = showingTranslateValue(category?.name);
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group relative text-left ${
                      isActive
                        ? "bg-blue-600/20 text-white font-semibold border border-blue-500/40 shadow-sm"
                        : "hover:bg-white/5 text-gray-300 font-medium hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSideIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-blue-500"
                      />
                    )}

                    <div
                      className={`relative w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-200 p-1 ${
                        isActive ? "bg-blue-950/80 border border-blue-500/50 shadow-sm" : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <CategoryIcon
                        icon={category.icon}
                        name={catTitle}
                      />
                    </div>

                    <span className="flex-1 text-xs sm:text-[13px] truncate leading-tight tracking-tight">
                      {catTitle}
                    </span>

                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        isActive ? "text-blue-400 translate-x-0.5" : "text-gray-500 group-hover:text-gray-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                const catTitle = showingTranslateValue(category?.name);
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`flex-shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[110px] border text-left ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 shadow-md font-bold"
                        : "bg-[#0b0c12] text-gray-300 border-white/10 hover:bg-white/5 font-medium"
                    }`}
                  >
                    <div
                      className={`relative w-6 h-6 rounded-md flex items-center justify-center overflow-hidden p-0.5 ${
                        isActive ? "bg-white/20" : "bg-white/5"
                      }`}
                    >
                      <CategoryIcon
                        icon={category.icon}
                        name={catTitle}
                        isMobile
                      />
                    </div>
                    <span className="text-[11px] tracking-tight whitespace-nowrap">
                      {catTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content Area - Subcategories & Product Slider */}
        <div className="flex-1 min-w-0 w-full flex flex-col min-h-0">
          <div className="bg-[#0b0c12] rounded-xl shadow-md border border-white/10 overflow-hidden flex flex-col flex-1">

            {/* Unified Department Header Bar */}
            <div className="bg-[#0f111a] px-3.5 sm:px-4 py-2 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-inner">
                  <CategoryIcon
                    icon={selectedLeft?.icon}
                    name={showingTranslateValue(selectedLeft?.name)}
                  />
                </div>
                <div className="min-w-0 flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate tracking-tight">
                    {showingTranslateValue(selectedLeft?.name) || "Department"}
                  </h3>
                  {productsData && productsData.length > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      {productsData.length} {productsData.length === 1 ? "Product" : "Products"}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  const catName = showingTranslateValue(selectedLeft?.name) || "";
                  router.push(`/search?category=${encodeURIComponent(catName)}&_id=${selectedLeft?._id}`);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              >
                View in Search &rarr;
              </button>
            </div>

            {/* Subcategories & Products Content */}
            <div className="p-3 sm:p-4 flex-1 min-h-0 bg-[#0b0c12]">
              {rightCategories.length > 0 && (
                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="text-xs font-semibold text-gray-300 mb-2">Subcategories</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                    {rightCategories.map((child) => (
                      <button
                        key={child._id}
                        onClick={() => handleSubcategoryClick(child)}
                        className="group relative bg-[#10121a] rounded-lg border border-white/10 p-2 transition-all duration-150 hover:border-blue-500/40 text-center flex flex-col items-center hover:-translate-y-0.5"
                      >
                        <div className="w-10 h-10 mb-1.5 bg-[#161824] rounded-md p-1 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={child.icon || "/placeholder.png"}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="text-[11px] font-medium text-white group-hover:text-blue-400 line-clamp-1 truncate w-full">
                          {showingTranslateValue(child?.name)}
                        </h4>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-200 tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-500 rounded-full"></span>
                    Popular in {showingTranslateValue(selectedLeft?.name)}
                  </h4>

                  {/* Header Slide Navigation Buttons - Only shown when slider overflows */}
                  {productsData && productsData.length > 4 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        className="prev-cat-prod w-6 h-6 rounded-full bg-[#161824] hover:bg-blue-600 border border-white/15 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Previous products"
                      >
                        <IoChevronBack className="text-xs" />
                      </button>
                      <button
                        className="next-cat-prod w-6 h-6 rounded-full bg-[#161824] hover:bg-blue-600 border border-white/15 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Next products"
                      >
                        <IoChevronForward className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>

                {productsLoading ? (
                  <div className="flex gap-2.5 overflow-hidden py-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="min-w-[160px] sm:min-w-[180px] h-[240px] rounded-xl border border-white/10 bg-[#12141f] animate-pulse" />
                    ))}
                  </div>
                ) : productsData && productsData.length > 0 ? (
                  <div className="relative group/catslider px-0.5">
                    <Swiper
                      modules={[Navigation, Autoplay]}
                      spaceBetween={12}
                      slidesPerView={1.5}
                      navigation={{
                        prevEl: ".prev-cat-prod",
                        nextEl: ".next-cat-prod",
                      }}
                      autoplay={
                        productsData.length > 4
                          ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
                          : false
                      }
                      breakpoints={{
                        420: { slidesPerView: 2, spaceBetween: 10 },
                        640: { slidesPerView: 2.5, spaceBetween: 12 },
                        768: { slidesPerView: 3, spaceBetween: 12 },
                        1024: { slidesPerView: 3.5, spaceBetween: 12 },
                        1280: { slidesPerView: 4.2, spaceBetween: 14 },
                        1536: { slidesPerView: 5, spaceBetween: 14 },
                      }}
                      className="catProductsSwiper !py-1"
                    >
                      {productsData.map((product) => (
                        <SwiperSlide key={product._id} className="!h-auto flex justify-center">
                          <ProductCard product={product} attributes={attributes} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="py-8 text-center max-w-sm mx-auto">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gray-400 mb-2 border border-white/10">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-200 text-xs font-semibold">No products found in this category yet</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">Explore other departments or view all products.</p>
                    <button
                      onClick={() => router.push('/search')}
                      className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-medium transition-all"
                    >
                      Browse All Products &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styled JSX Custom Scrollbar overrides */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #232738;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #373e57;
        }
      `}</style>
    </div>
  );
};

export default FeatureCategory;