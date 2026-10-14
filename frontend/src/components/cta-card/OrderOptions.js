import React from "react";
import { FaPhoneVolume, FaWhatsapp } from "react-icons/fa";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { DEFAULT_STORE_COLOR, getPalette } from "@utils/themeColors";

const OrderOptions = () => {
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const storeColor = storeCustomizationSetting?.theme?.color || DEFAULT_STORE_COLOR;
  const palette = getPalette(storeColor);

  const contactNumber = 
    storeCustomizationSetting?.navbar?.phone || 
    showingTranslateValue(storeCustomizationSetting?.contact_us?.call_box_phone) ||
    globalSetting?.contact ||
    "09240250346";

  const cardBase =
    "flex items-center p-4 md:p-5 rounded-2xl transition-all duration-300 cursor-pointer group border overflow-hidden relative shadow-lg hover:shadow-2xl bg-[#0c0c0e] hover:bg-[#131317] border-white/10 hover:border-white/20";

  return (
    <div className="w-full max-w-4xl mx-auto my-4 md:my-6 px-4">
      <div className="flex items-center justify-center mb-5">
        <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-store-500/50" />
        <span className="px-4 text-store-400 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase">
          Place Your Order Via
        </span>
        <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-store-500/50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
        <a
          href={`tel:${contactNumber.replace(/\s+/g, '')}`}
          aria-label="Call to place order"
          className={cardBase}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `linear-gradient(135deg, rgba(20, 184, 166, 0.08), transparent)` }}
          />
          <div className="relative mr-4 shrink-0">
            <div
              className="p-3.5 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${palette[500]}, ${palette[700]})` }}
            >
              <FaPhoneVolume className="text-white text-xl" />
            </div>
          </div>
          <div className="relative flex flex-col">
            <span className="text-[11px] font-bold tracking-wide uppercase mb-0.5 text-store-400">
              Order via Call
            </span>
            <span className="text-white font-bold text-base md:text-lg leading-tight group-hover:text-store-300 transition-colors">
              {contactNumber}
            </span>
          </div>
        </a>

        {contactNumber && (
          <a
            href={`https://wa.me/${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I want to buy Medicine.")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via WhatsApp"
            className={cardBase}
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative mr-4 shrink-0">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3.5 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <FaWhatsapp className="text-white text-xl" />
              </div>
            </div>
            <div className="relative flex flex-col">
              <span className="text-[11px] text-emerald-400 font-bold tracking-wide uppercase mb-0.5">
                Order via WhatsApp
              </span>
              <span className="text-white font-bold text-base md:text-lg leading-tight group-hover:text-emerald-300 transition-colors">
                WhatsApp
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default OrderOptions;
