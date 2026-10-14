import React, { useMemo, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward, IoFlash } from "react-icons/io5";
import Cookies from "js-cookie";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";
import SectionHeader from "@components/common/SectionHeader";
import { UserContext } from "@context/UserContext";
import ProductCard from "@components/product/ProductCard";

const DealsYouLove = ({ products, attributes }) => {
  const { getNumber } = useUtilsFunction();

  // Determine wholesaler status from Context or Cookies
  const { state } = useContext(UserContext) || {};
  const isWholesaler = useMemo(() => {
    let role = state?.userInfo?.role;
    if (!role && typeof window !== "undefined") {
      try {
        const cookieUser = Cookies.get("userInfo");
        if (cookieUser) role = JSON.parse(cookieUser)?.role;
      } catch (e) { }
    }
    return role && role.toString().toLowerCase() === "wholesaler";
  }, [state]);

  // Filter products that have at least a 20% discount and match wholesaler criteria
  const dealProducts = useMemo(() => {
    if (!products) return [];

    return products
      .map(p => {
        const retailPrice = getNumber(p?.prices?.price);
        const originalPrice = getNumber(p?.prices?.originalPrice);
        let discountPercent = 0;
        if (originalPrice > retailPrice) {
          discountPercent = Math.round(((originalPrice - retailPrice) / originalPrice) * 100);
        }
        return { ...p, discountPercent };
      })
      .filter(p => p.discountPercent > 0)
      .filter(p => {
        if (!isWholesaler) return true;
        return (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler;
      });
  }, [products, isWholesaler, getNumber]);

  if (!dealProducts || dealProducts.length === 0) return null;

  return (
    <div className="relative lg:py-14 py-10 overflow-hidden bg-black">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="mb-6 flex flex-row items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
              <IoFlash className="animate-pulse text-amber-500 text-sm" /> Hot Offers
            </div>
            <SectionHeader
              title="Special Offers"
              subtitle="Grab these limited-time offers and top-tier value formulations before they're gone!"
              align="left"
            />
          </div>
        </div>

        {/* Carousel Slider Area */}
        <div className="relative group/slider">
          <div className="relative px-1">
            {/* Slide button on Left side shifted upper */}
            <button
              className="prev-deals absolute top-[38%] -left-3 sm:-left-5 lg:-left-6 z-30 bg-black/85 backdrop-blur-md shadow-2xl border border-white/20 rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-white transition-all transform -translate-y-1/2 flex items-center justify-center active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
              aria-label="Previous"
            >
              <IoChevronBack className="text-lg sm:text-xl" />
            </button>

            {/* Slide button on Right side shifted upper */}
            <button
              className="next-deals absolute top-[38%] -right-3 sm:-right-5 lg:-right-6 z-30 bg-black/85 backdrop-blur-md shadow-2xl border border-white/20 rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-white transition-all transform -translate-y-1/2 flex items-center justify-center active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
              aria-label="Next"
            >
              <IoChevronForward className="text-lg sm:text-xl" />
            </button>

            {/* Slider without background box */}
            <div>
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={12}
                slidesPerView={2}
                loop={dealProducts.length >= 6}
                navigation={{ prevEl: ".prev-deals", nextEl: ".next-deals" }}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  320: { slidesPerView: 2, spaceBetween: 10 },
                  480: { slidesPerView: 2.2, spaceBetween: 12 },
                  640: { slidesPerView: 3, spaceBetween: 14 },
                  768: { slidesPerView: 4, spaceBetween: 16 },
                  1024: { slidesPerView: 5, spaceBetween: 16 },
                  1280: { slidesPerView: 6, spaceBetween: 18 },
                  1536: { slidesPerView: 7, spaceBetween: 18 },
                }}
                className="mySwiper !pb-6 !pt-2"
              >
                {dealProducts.map((product) => (
                  <SwiperSlide key={product._id} className="h-auto">
                    <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} attributes={attributes} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsYouLove;