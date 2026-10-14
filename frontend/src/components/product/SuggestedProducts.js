import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward, IoSparkles } from "react-icons/io5";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Internal imports
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SectionHeader from "@components/common/SectionHeader";

const SuggestedProducts = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";
  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setFetchLoading(true);
        let userInfo = null;
        try {
          const cookie = Cookies.get("userInfo");
          if (cookie) userInfo = JSON.parse(cookie);
        } catch (e) { }

        let params = {};
        let guestIds = [];
        const guestHistory = localStorage.getItem("recentlyViewed");
        if (guestHistory) {
          try {
            const parsed = JSON.parse(guestHistory);
            if (Array.isArray(parsed)) {
              const unique = Array.from(new Set(parsed.map(item => item._id)));
              guestIds = unique;
              params.productIds = guestIds.join(",");
            }
          } catch (e) {
            console.error("Error parsing guest history", e);
          }
        }
        const res = await ProductServices.getSuggestedProducts(params);
        
        const filtered = Array.isArray(res)
          ? res.filter((p, i, arr) => p && arr.findIndex(x => x._id === p._id) === i)
          : [];
        
        // If wholesaler, filter to wholesale-eligible products only
        if (isWholesaler) {
          setProducts(filtered.filter(p => (p.wholePrice && Number(p.wholePrice) > 0) || p.isWholesaler));
        } else {
          setProducts(filtered);
        }
      } catch (err) {
        console.error("SuggestedProducts: Error fetching suggested products:", err);
        setProducts([]);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSuggestedProducts();
  }, [isWholesaler]);

  if (fetchLoading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden w-full">
      <div className="relative z-10">
        {/* Header Section with Badge */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/30">
            <IoSparkles className="animate-pulse text-blue-400 text-sm" />
            <span>Picked For You</span>
          </div>
          <SectionHeader
            title="Suggested For You"
            subtitle="Personalized recommendations based on your activity"
            align="left"
          />
        </div>

        {/* Carousel Slider Area with Left & Right Slide Buttons */}
        <div className="relative group/slider">
          <div className="relative px-1">
            {/* Slide button on Left side shifted upper */}
            <button
              className="prev-suggested absolute top-[38%] -left-3 sm:-left-5 lg:-left-6 z-30 bg-black/85 backdrop-blur-md shadow-2xl border border-white/20 rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-white transition-all transform -translate-y-1/2 flex items-center justify-center active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
              aria-label="Previous"
            >
              <IoChevronBack className="text-lg sm:text-xl" />
            </button>

            {/* Slide button on Right side shifted upper */}
            <button
              className="next-suggested absolute top-[38%] -right-3 sm:-right-5 lg:-right-6 z-30 bg-black/85 backdrop-blur-md shadow-2xl border border-white/20 rounded-full w-9 h-9 sm:w-11 sm:h-11 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-white transition-all transform -translate-y-1/2 flex items-center justify-center active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed [&.swiper-button-disabled]:opacity-20 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
              aria-label="Next"
            >
              <IoChevronForward className="text-lg sm:text-xl" />
            </button>

            {/* Swiper Slider without background box */}
            <div>
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={12}
                slidesPerView={2}
                loop={products.length >= 6}
                navigation={{
                  prevEl: ".prev-suggested",
                  nextEl: ".next-suggested",
                }}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
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
                {products.map((product) => (
                  <SwiperSlide key={product._id} className="h-auto">
                    <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} />
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

export default SuggestedProducts;
