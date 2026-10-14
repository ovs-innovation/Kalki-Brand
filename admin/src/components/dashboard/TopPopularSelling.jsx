import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdHealthAndSafety,
  MdScience,
  MdOutlineLocalShipping,
  MdOutlineAssignment,
  MdOutlineAddBox,
  MdOutlineMedicalInformation,
} from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const TopPopularSelling = ({ bestSeller = [], topBrands = [], goldCustomers = [] }) => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();

  // Brand icons
  const pharmacyIcons = [
    { icon: MdHealthAndSafety, color: "text-emerald-500", bgColor: "bg-emerald-500/10 border border-emerald-500/20" },
    { icon: MdScience, color: "text-blue-500", bgColor: "bg-blue-500/10 border border-blue-500/20" },
    { icon: MdOutlineLocalShipping, color: "text-teal-500", bgColor: "bg-teal-500/10 border border-teal-500/20" },
    { icon: MdOutlineAssignment, color: "text-cyan-500", bgColor: "bg-cyan-500/10 border border-cyan-500/20" },
    { icon: MdOutlineAddBox, color: "text-indigo-500", bgColor: "bg-indigo-500/10 border border-indigo-500/20" },
    { icon: MdOutlineMedicalInformation, color: "text-rose-500", bgColor: "bg-rose-500/10 border border-rose-500/20" },
  ];

  // Top brands
  const displayBrands =
    topBrands.length > 0
      ? topBrands.slice(0, 6)
      : [
          { name: "Kalki Essentials", count: 45 },
          { name: "Eco-Foods", count: 38 },
          { name: "NutriCare", count: 32 },
          { name: "Pure Herbal", count: 28 },
          { name: "Nature Harvest", count: 24 },
          { name: "Daily Munchies", count: 18 },
        ];

  // Top selling products
  const displayMeds =
    bestSeller.length > 0
      ? bestSeller.slice(0, 6).map((m) => ({
          name: showingTranslateValue(m.title) || m.title,
          sold: m.count,
          img: m.image?.[0] || "/flags/cat1.webp",
        }))
      : [
          { name: "Premium Almonds 500g", sold: 18, img: "/flags/cat1.webp" },
          { name: "Organic Cashews 250g", sold: 14, img: "/flags/cat2.webp" },
          { name: "Roasted Makhana", sold: 12, img: "/flags/cat3.webp" },
          { name: "Assam CTC Tea", sold: 10, img: "/flags/cat4.webp" },
          { name: "Cold Pressed Mustard Oil", sold: 8, img: "/flags/cat5.webp" },
          { name: "Pure Cow Ghee 1L", sold: 6, img: "/flags/cat6.webp" },
        ];

  // Most loved products
  const mostLovedProducts = [
    {
      name: "Organic Honey 500g",
      hearts: 212,
      img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Kashmiri Walnuts",
      hearts: 185,
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Chia Seeds Organic",
      hearts: 156,
      img: "https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Herbal Green Tea",
      hearts: 142,
      img: "https://images.unsplash.com/photo-1594631252845-29fc458639a6?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Cold Pressed Coconut Oil",
      hearts: 128,
      img: "https://images.unsplash.com/photo-1615485245832-378393c04205?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sun-Dried Raisins",
      hearts: 115,
      img: "https://images.unsplash.com/photo-1596755094514-b87a0423926c?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {/* Top Brands */}
      <div className="bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 transition-all duration-300 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{t("TopBrands")}</h3>
            <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 mt-0.5">Leading partner brands</p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
          >
            {t("ViewAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {displayBrands.map((brand, idx) => {
            const style = pharmacyIcons[idx % pharmacyIcons.length];
            const IconComponent = style.icon;

            return (
              <div
                key={idx}
                className="aspect-square bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500/40 transition-all group overflow-hidden p-2 text-center"
                title={showingTranslateValue(brand.name) || brand.name}
              >
                <div
                  className={`p-3 rounded-xl ${style.bgColor} group-hover:scale-110 transition-transform duration-300 mb-1.5`}
                >
                  <IconComponent className={`w-5 h-5 ${style.color}`} />
                </div>
                <span className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 truncate w-full px-1">
                  {showingTranslateValue(brand.name) || brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 transition-all duration-300 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Best Selling</h3>
            <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 mt-0.5">Highest volume products</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
          >
            {t("ViewAll")} →
          </Link>
        </div>

        <div className="space-y-3">
          {displayMeds.map((med, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                  <img src={med.img} alt={med.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 tracking-tight max-w-[140px] truncate">
                  {med.name}
                </span>
              </div>

              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <span className="text-xs font-black text-blue-400 whitespace-nowrap">
                  {med.sold} sold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Loved Products */}
      <div className="bg-white dark:bg-zinc-950/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 transition-all duration-300 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{t("MostLovedProducts")}</h3>
            <p className="text-xs font-semibold text-gray-400 dark:text-zinc-400 mt-0.5">Customer top favorites</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
          >
            {t("ViewAll")} →
          </Link>
        </div>

        <div className="space-y-3">
          {mostLovedProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 tracking-tight max-w-[140px] truncate">
                  {product.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                <span className="text-xs font-black text-rose-400">{product.hearts}</span>
                <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPopularSelling;