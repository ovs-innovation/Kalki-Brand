import { useContext, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart, FiHeart, FiX } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import { getUserSession } from "@lib/auth";
import useWishlist from "@hooks/useWishlist";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import SearchSuggestions from "@components/search/SearchSuggestions";
import LowerCategoryNavbar from "./LowerCategoryNavbar";
import CustomerNotificationBell from "@components/notification/CustomerNotificationBell";
import kalkibrand_logo from "../../../logo/kalkibrand_logo.png";

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="KalkiBrand">
      <Image
        src={kalkibrand_logo}
        alt="logo"
        width={158}
        height={190}
        priority
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        style={{ height: "95px", width: "auto" }}
      />
    </Link>
  );
};

const Navbar = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const router = useRouter();
  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const getLevel1Categories = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return [];

    const homeRoot = categories.find(
      (cat) =>
        cat.id === "Root" ||
        showingTranslateValue(cat?.name)?.toLowerCase() === "home"
    );

    let topLevel = homeRoot?.children?.length ? homeRoot.children : categories;
    return topLevel;
  };

  const categories = getLevel1Categories(categoriesData);

  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalUniqueItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const userInfo = getUserSession();

  const [mounted, setMounted] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync search input with route query if present
  useEffect(() => {
    if (router.pathname === "/search" && router.query.query) {
      setSearchText(router.query.query);
    }
  }, [router.pathname, router.query.query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchModalOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

  // Press Escape to close search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen]);

  // Close search modal on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsSearchModalOpen(false);
      setShowSuggestions(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    setShowSuggestions(false);
    setIsSearchModalOpen(false);
    searchInputRef.current?.blur();
    if (trimmed) {
      router
        .push(
          { pathname: "/search", query: { query: trimmed } },
          `/search?query=${encodeURIComponent(trimmed)}`,
          { shallow: false }
        )
        .then(() => setSearchText(""))
        .catch(() => {
          window.location.href = `/search?query=${encodeURIComponent(trimmed)}`;
        });
    }
  };

  return (
    <>
      <CartDrawer />
      <header className="hidden lg:block glass-header">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-4 transition-all duration-300 py-3">
            <NavbarLogo />

            <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
              <LowerCategoryNavbar
                variant="inline"
                categories={categories}
                showingTranslateValue={showingTranslateValue}
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen((prev) => !prev)}
                className="p-2 text-gray-300 hover:text-blue-400 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
                aria-label="Search"
                title="Search"
              >
                <IoSearchOutline className="text-2xl" />
              </button>

              <CustomerNotificationBell />
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-300 hover:text-store-400 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Wishlist"
              >
                <FiHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 text-[10px] font-bold text-white bg-store-500 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={toggleCartDrawer}
                className="relative p-2 text-gray-300 hover:text-store-400 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Cart"
              >
                <FiShoppingCart className="text-xl" />
                {totalUniqueItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 text-[10px] font-bold text-white bg-store-500 rounded-full flex items-center justify-center">
                    {totalUniqueItems}
                  </span>
                )}
              </button>
              <div className="w-px h-8 bg-white/10 mx-1" />
              {userInfo && (
                <Link
                  href="/user/dashboard"
                  className="text-sm font-semibold text-gray-200 hover:text-store-400 transition-colors mr-2 whitespace-nowrap"
                >
                  My Account
                </Link>
              )}
              {userInfo?.image ? (
                <Link href="/user/dashboard">
                  <Image
                    width={36}
                    height={36}
                    src={userInfo.image}
                    alt="Account"
                    className="rounded-full w-9 h-9 border-2 border-store-100 object-cover"
                  />
                </Link>
              ) : userInfo?.name ? (
                <Link
                  href="/user/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-store-500 text-store-600 font-bold text-sm"
                >
                  {userInfo.name[0]}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")}
                  className="text-sm font-bold text-white bg-gradient-to-r from-store-600 to-store-700 hover:from-store-700 hover:to-store-800 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {mounted && isSearchModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchModalOpen(false);
              setShowSuggestions(false);
            }
          }}
        >
          <div className="relative w-full max-w-2xl bg-[#0f1015] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <IoSearchOutline className="text-blue-400 text-lg" /> Search Kalki Brand
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSearchModalOpen(false);
                  setShowSuggestions(false);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close search"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1 flex items-center min-h-[46px]">
                <IoSearchOutline className="absolute left-3.5 text-gray-400 text-lg pointer-events-none z-10" />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for medicine, healthcare & more..."
                  className="w-full py-3 pl-11 pr-10 text-sm bg-black/60 border border-white/15 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
                  onBlur={(e) => {
                    const relatedTarget = e.relatedTarget;
                    const box = document.querySelector(".search-suggestions-container");
                    if (!relatedTarget || (box && !box.contains(relatedTarget))) {
                      setTimeout(() => {
                        const active = document.activeElement;
                        if (!box || !box.contains(active)) setShowSuggestions(false);
                      }, 200);
                    }
                  }}
                />
                {searchText && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText("");
                      setShowSuggestions(false);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 text-gray-400 hover:text-white p-1"
                    aria-label="Clear search"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
                <SearchSuggestions
                  searchText={searchText}
                  showSuggestions={showSuggestions}
                  onSelect={() => {
                    setSearchText("");
                    setShowSuggestions(false);
                    setIsSearchModalOpen(false);
                  }}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-3 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-between mt-4 pt-3 text-xs text-gray-400 border-t border-white/5">
              <span>Type at least 2 characters for suggestions</span>
              <div className="flex items-center gap-2 text-gray-400">
                <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono text-[11px]">Enter</kbd> to search</span>
                <span>•</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-200 font-mono text-[11px]">ESC</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style jsx global>{`
        .navbar-search-form .navbar-search-input {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          --tw-ring-shadow: 0 0 #0000 !important;
        }
        .navbar-search-form .navbar-search-input:focus {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
