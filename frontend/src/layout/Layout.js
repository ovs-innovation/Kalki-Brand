import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

//internal import

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import MobileBottomNavigation from "@layout/footer/MobileBottomNavigation";
import FeatureCard from "@components/feature-card/FeatureCard";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette, DEFAULT_STORE_COLOR } from "@utils/themeColors";
import useCartSync from "@hooks/useCartSync";
import FloatingWhatsApp from "@components/common/FloatingWhatsApp";
import { pickBrandLogo } from "@utils/brandAssets";

const Layout = ({ title, description, children, hideMobileHeader, mainPaddingClass }) => {
  const router = useRouter();
  const isHome = router.pathname === "/";
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || DEFAULT_STORE_COLOR;
  const palette = getPalette(storeColor);

  // Sync prescription medicines to cart
  useCartSync();

  // Get dynamic title and favicon from settings
  const siteTitle = storeCustomizationSetting?.seo?.meta_title || globalSetting?.shop_name || "Kalki Brand";
  const favicon = "/favicon.png";
  const defaultDescription = storeCustomizationSetting?.seo?.meta_description || description || "Discover personalized merchandise, branded giveaways, and advertising essentials. Ideal for businesses, events, and promotions";

  const hexToRgb = (hex) => {
    if (!hex) return "37, 99, 235";
    const cleaned = hex.replace("#", "");
    if (cleaned.length === 3) {
      const expanded = cleaned.split("").map(c => c + c).join("");
      const num = parseInt(expanded, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }
    if (cleaned.length === 6) {
      const num = parseInt(cleaned, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }
    return "37, 99, 235";
  };

  return (
    <>
      <div className="font-sans min-h-screen bg-black text-white">
        <Head>
          <style>
            {`
              :root {
                --store-color-50: ${palette[50] || "#eff6ff"};
                --store-color-100: ${palette[100] || "#dbeafe"};
                --store-color-200: ${palette[200] || "#bfdbfe"};
                --store-color-300: ${palette[300] || "#93c5fd"};
                --store-color-400: ${palette[400] || "#60a5fa"};
                --store-color-500: ${palette[500] || "#3b82f6"};
                --store-color-600: ${palette[600] || "#2563eb"};
                --store-color-700: ${palette[700] || "#1d4ed8"};
                --store-color-800: ${palette[800] || "#1e40af"};
                --store-color-900: ${palette[900] || "#1e3a8a"};
                --store-color-rgb: ${palette[500]?.startsWith("#") ? hexToRgb(palette[500]) : "37, 99, 235"};
              }
            `}
          </style>
          <title>
            {title ? `${siteTitle} | ${title}` : siteTitle}
          </title>
          <meta name="description" content={description || defaultDescription} />
          <link rel="icon" href={favicon} />
          <link rel="shortcut icon" href={favicon} />
          <link rel="apple-touch-icon" href={favicon} />
        </Head>
        {/* Mobile header bar (fixed) */}
        {!hideMobileHeader && <MobileFooter />}

        {/* Mobile Bottom Navigation */}
        {!hideMobileHeader && <MobileBottomNavigation />}

        {/* Desktop: one sticky header — top bar + navbar + categories shift on scroll */}
        <div className="hidden lg:block" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
        }}>
          <NavBarTop />
          <Navbar />
        </div>

        <div className={mainPaddingClass || `${hideMobileHeader ? "pt-0" : (isHome ? "pt-0" : "pt-16")} ${isHome ? "lg:pt-[125px]" : "lg:pt-[130px]"} pb-16 lg:pb-0`}>
          {children}
        </div>
        <div className="  w-full">
          {/* <FooterTop  /> */}
          <div className="w-full">
            <Footer />
          </div>
        </div>
        <FloatingWhatsApp />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Layout;
