import { useContext, useEffect, useState, useRef } from "react";
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

  // Search state: only open on /search or when user clicks search icon
  const [isSearchOpen, setIsSearchOpen] = useState(router.pathname === "/search");
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Sync search state with route
  useEffect(() => {
    if (router.pathname === "/search") {
      setIsSearchOpen(true);
      if (router.query.query) {
        setSearchText(router.query.query);
      }
    } else {
      setIsSearchOpen(false);
    }
  }, [router.pathname, router.query.query]);

  // Press Escape to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchOpen && router.pathname !== "/search") {
        setIsSearchOpen(false);
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, router.pathname]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    setShowSuggestions(false);
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
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="navbar-search-form flex items-center w-full max-w-3xl rounded-full border border-white/10 bg-[#0f0f12] p-1 focus-within:border-blue-500 transition-all shadow-xl"
                >
                  <div className="flex-1 relative min-w-0 flex items-center min-h-[42px]">
                    <IoSearchOutline className="absolute left-3.5 text-gray-400 text-lg pointer-events-none z-10" />
                    <input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search for medicine, healthcare & more..."
                      className="navbar-search-input w-full h-full py-2 pl-10 pr-2 text-sm !bg-transparent !border-0 !border-none !shadow-none !ring-0 !outline-none focus:!ring-0 focus:!border-0 focus:!outline-none placeholder-gray-500 text-white"
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
                    <SearchSuggestions
                      searchText={searchText}
                      showSuggestions={showSuggestions}
                      onSelect={() => {
                        setSearchText("");
                        setShowSuggestions(false);
                        if (router.pathname !== "/search") setIsSearchOpen(false);
                      }}
                      onClose={() => setShowSuggestions(false)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 border-0 outline-none shadow-md hover:shadow-lg transition-all"
                  >
                    Search
                  </button>
                  {router.pathname !== "/search" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setShowSuggestions(false);
                      }}
                      className="shrink-0 p-2 ml-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close search"
                      title="Close"
                    >
                      <FiX className="text-xl" />
                    </button>
                  )}
                </form>
              ) : (
                <LowerCategoryNavbar
                  variant="inline"
                  categories={categories}
                  showingTranslateValue={showingTranslateValue}
                />
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!isSearchOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 80);
                  }}
                  className="p-2 text-gray-300 hover:text-blue-400 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
                  aria-label="Search"
                  title="Search"
                >
                  <IoSearchOutline className="text-2xl" />
                </button>
              )}

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
