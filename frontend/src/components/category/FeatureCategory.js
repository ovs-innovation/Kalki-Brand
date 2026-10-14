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
const CategoryIcon = ({ icon, name, isActive, isMobile = false }) => {
  const [imgError, setImgError] = useState(false);
  const initial = (name ? String(name).trim().charAt(0) : "C").toUpperCase();

  if (!icon || imgError) {
    return (
      <span className={`font-bold ${isMobile ? "text-xs" : "text-sm"} ${isActive ? "text-white" : "text-gray-300"}`}>
        {initial}
      </span>
    );
  }

  return (
    <img
      src={icon}
      alt=""
      onError={() => setImgError(true)}
      className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} object-contain transition-transform ${isActive ? "brightness-0 invert" : ""}`}
    />
  );
};

const FeatureCategory = ({ initialSelectedCategory, attributes }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const [selectedLeft, setSelectedLeft] = useState(null);

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
      cat.id === "" ||
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

  useEffect(() => {
    if (initialSelectedCategory) {
      setSelectedLeft(initialSelectedCategory);
    } else if (parentCategories.length > 0 && !selectedLeft) {
      setSelectedLeft(parentCategories[0]);
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
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-black text-white">

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 border-b border-white/10 pt-4 sm:pt-8 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Featured Categories
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
            Choose your necessary products from our top clinically verified medical collections.
          </p>
        </div>
        <button
          onClick={() => router.push('/search')}
          className="self-start sm:self-auto inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-blue-500 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-300 active:scale-95 shadow-md shadow-blue-900/30"
        >
          View All Products &rarr;
        </button>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[21rem_1fr] lg:gap-8 items-stretch">

        {/* Left Sidebar - Parent Categories */}
        <div className="w-full mb-6 lg:mb-0 flex flex-col min-h-0">

          {/* Desktop Sidebar Layout */}
          <div className="hidden lg:flex lg:flex-col bg-[#0b0c12] rounded-2xl shadow-xl border border-white/10 overflow-hidden flex-1 min-h-[480px]">
            <div className="bg-[#0f111a] px-6 py-5 flex-shrink-0 relative overflow-hidden border-b border-white/10">
              <div className="absolute -top-12 -right-6 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-blue-500/20 blur-xl" />
              <h2 className="text-lg font-extrabold text-white tracking-wide relative z-10">Departments</h2>
              <p className="text-gray-400 text-xs mt-1 relative z-10">Select a category to view sub-items</p>
            </div>

            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-1.5 mt-1">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                const catTitle = showingTranslateValue(category?.name);
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-blue-600/20 text-white font-bold border border-blue-500/40 shadow-sm"
                        : "hover:bg-white/5 text-gray-300 font-medium hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSideIndicator"
                        className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-blue-500"
                      />
                    )}

                    <div
                      className={`relative w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                        isActive ? "bg-blue-600 shadow-md shadow-blue-900/30" : "bg-white/5 group-hover:bg-blue-950/40"
                      }`}
                    >
                      <CategoryIcon
                        icon={category.icon}
                        name={catTitle}
                        isActive={isActive}
                      />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <span className="text-sm block truncate leading-tight tracking-tight">
                        {catTitle}
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? "text-blue-400 translate-x-0.5" : "text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
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
            <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory">
              {parentCategories.map((category) => {
                const isActive = selectedLeft?._id === category._id;
                const catTitle = showingTranslateValue(category?.name);
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedLeft(category)}
                    className={`flex-shrink-0 snap-start flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 min-w-[130px] border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40 font-bold"
                        : "bg-[#0b0c12] text-gray-300 border-white/10 hover:bg-white/5 font-medium"
                    }`}
                  >
                    <div
                      className={`relative w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden ${
                        isActive ? "bg-white/20" : "bg-white/5"
                      }`}
                    >
                      <CategoryIcon
                        icon={category.icon}
                        name={catTitle}
                        isActive={isActive}
                        isMobile
                      />
                    </div>
                    <span className="text-xs tracking-tight whitespace-nowrap">
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
          <div className="bg-[#0b0c12] rounded-2xl shadow-xl border border-white/10 overflow-hidden flex flex-col flex-1">

            {/* Active Subsection Banner Header */}
            <div className="bg-[#0f111a] px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                    {showingTranslateValue(selectedLeft?.name) || "Loading..."}
                  </h3>
                  {rightCategories.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      {rightCategories.length} Categories
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Explore collections under this department</p>
              </div>
            </div>

            {/* Subcategories Grid Content */}
            <div className="p-4 sm:p-6 lg:p-7 flex-1 min-h-0 bg-[#0b0c12] space-y-8">
              <AnimatePresence mode="wait">
                {rightCategories.length > 0 ? (
                  <motion.div
                    key={selectedLeft?._id || "empty"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                  >
                    {rightCategories.map((child) => (
                      <button
                        key={child._id}
                        onClick={() => handleSubcategoryClick(child)}
                        className="group relative bg-[#10121a] rounded-xl border border-white/10 p-3 sm:p-3.5 transition-all duration-300 hover:shadow-xl hover:border-blue-500/40 text-center flex flex-col items-center hover:-translate-y-0.5"
                      >
                        {/* Image Wrapper Block */}
                        <div className="w-full aspect-square mb-2.5 bg-[#161824] rounded-xl p-2.5 relative overflow-hidden flex items-center justify-center transition-colors group-hover:bg-blue-950/40">
                          <img
                            src={child.icon || "/placeholder.png"}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                            className="w-4/5 h-4/5 object-contain transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title text */}
                        <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-blue-400 line-clamp-2 transition-colors duration-200 min-h-[2rem] flex items-center justify-center px-1 tracking-tight leading-snug">
                          {showingTranslateValue(child?.name)}
                        </h4>

                        {/* Interactive Tiny Pill indicator */}
                        <div className="mt-1 text-[10px] font-extrabold text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5">
                          Explore &rarr;
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-10 text-center max-w-sm mx-auto"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-gray-400 mb-3 border border-white/10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-bold">No Subcategories Found</p>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      Explore other departments from the sidebar to browse items.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Section with Horizontal Slider and Left/Right Slide Buttons */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-5 sm:h-6 bg-blue-600 rounded-full shadow-sm shadow-blue-500/50"></span>
                    Popular in {showingTranslateValue(selectedLeft?.name)}
                  </h4>

                  {/* Header Slide Navigation Buttons */}
                  {productsData && productsData.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        className="prev-cat-prod w-8 h-8 rounded-full bg-[#161824] hover:bg-blue-600 border border-white/15 text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                        aria-label="Previous products"
                      >
                        <IoChevronBack className="text-base" />
                      </button>
                      <button
                        className="next-cat-prod w-8 h-8 rounded-full bg-[#161824] hover:bg-blue-600 border border-white/15 text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                        aria-label="Next products"
                      >
                        <IoChevronForward className="text-base" />
                      </button>
                    </div>
                  )}
                </div>

                {productsLoading ? (
                  <div className="flex gap-4 overflow-hidden py-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="min-w-[190px] sm:min-w-[215px] h-[320px] rounded-2xl border border-white/10 bg-[#12141f] animate-pulse" />
                    ))}
                  </div>
                ) : productsData && productsData.length > 0 ? (
                  <div className="relative group/catslider px-1">
                    {/* Floating Left Slide Button */}
                    <button
                      className="prev-cat-prod absolute -left-2.5 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/90 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-md"
                      aria-label="Previous product"
                    >
                      <IoChevronBack className="text-base sm:text-lg" />
                    </button>

                    {/* Floating Right Slide Button */}
                    <button
                      className="next-cat-prod absolute -right-2.5 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/90 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-md"
                      aria-label="Next product"
                    >
                      <IoChevronForward className="text-base sm:text-lg" />
                    </button>

                    <Swiper
                      modules={[Navigation, Autoplay]}
                      spaceBetween={12}
                      slidesPerView={1.4}
                      navigation={{
                        prevEl: ".prev-cat-prod",
                        nextEl: ".next-cat-prod",
                      }}
                      autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      breakpoints={{
                        420: { slidesPerView: 1.8, spaceBetween: 12 },
                        640: { slidesPerView: 2.3, spaceBetween: 14 },
                        768: { slidesPerView: 3, spaceBetween: 14 },
                        1024: { slidesPerView: 3.2, spaceBetween: 16 },
                        1280: { slidesPerView: 4.2, spaceBetween: 16 },
                        1536: { slidesPerView: 5, spaceBetween: 16 },
                      }}
                      className="catProductsSwiper !py-2 !px-1"
                    >
                      {productsData.map((product) => (
                        <SwiperSlide key={product._id} className="!h-auto flex justify-center py-1">
                          <ProductCard product={product} attributes={attributes} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="py-8 text-center max-w-sm mx-auto">
                    <p className="text-gray-400 text-xs leading-relaxed">
                      No products found in this category yet.
                    </p>
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