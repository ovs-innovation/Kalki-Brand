import Link from "next/link";
import Image from "next/image";
import useGetSetting from "@hooks/useGetSetting";
import { pickBrandLogo } from "@utils/brandAssets";
import { FiShield, FiTruck, FiClock } from "react-icons/fi";
import kalkibrand_logo from "../../../logo/kalkibrand_logo.png";

const TRUST_ITEMS = [
  { icon: FiShield, text: "Secure OTP" },
  { icon: FiTruck, text: "Fast Delivery" },
  { icon: FiClock, text: "Under 1 Min" },
];

/**
 * Clean, lightweight, and ultra-minimal wrapper shell for authentication routes.
 */
const AuthPageShell = ({
  title,
  subtitle,
  children,
  footer,
  alternateLink,
  badge,
}) => {
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const shopName = globalSetting?.shop_name || "Kalki Brand";
  const logoSrc = pickBrandLogo(
    storeCustomizationSetting?.navbar?.logo,
    storeCustomizationSetting?.seo?.favicon,
    globalSetting?.logo
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 sm:px-6">

      {/* Central Card Wrapper */}
      <div className="w-full max-w-[460px] bg-[#0c0d14] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white">

        {/* Header Block: Brand Logo & Strategic Minimal Trust Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <Link href="/" className="flex items-center gap-2 group" aria-label="KalkiBrand">
              <Image
                src={kalkibrand_logo}
                alt="logo"
                width={130}
                height={50}
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ height: "90px", width: "auto" }}
              />
            </Link>
          </div>

          {/* Inline Micro Badges */}
          <div className="flex items-center gap-3">
            {TRUST_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex items-center gap-1 text-gray-400" title={item.text}>
                  <IconComponent className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium text-gray-400 hidden xs:inline">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Title Context Group */}
        <div className="space-y-1">
          {badge && (
            <span className="inline-block rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
              {badge}
            </span>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content Injection (The main Form parameters) */}
        <div className="py-1">
          {children}
        </div>

        {/* Clean Alternate Footnote Interface Block */}
        {(alternateLink || footer) && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            {alternateLink && (
              <p className="text-center text-xs text-gray-400">
                {alternateLink.text}{" "}
                <Link
                  href={alternateLink.href}
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {alternateLink.label}
                </Link>
              </p>
            )}
            {footer && <div className="text-[10px] text-gray-400 text-center leading-normal">{footer}</div>}
          </div>
        )}

      </div>

      {/* Global Minimal Copy Note */}
      <p className="text-[11px] text-slate-400 font-medium mt-6">
        &copy; {new Date().getFullYear()} {shopName}. Secure Gateway.
      </p>

    </div>
  );
};

export default AuthPageShell;