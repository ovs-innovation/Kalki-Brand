import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoLockOpenOutline } from "react-icons/io5";
import {
  FiBell,
  FiCheck,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import Layout from "@layout/Layout";
import Card from "@components/order-card/Card";
import OrderServices from "@services/OrderServices";
import RecentOrder from "@pages/user/recent-order";
import { SidebarContext } from "@context/SidebarContext";
import { UserContext } from "@context/UserContext";
import Loading from "@components/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { setToken } from "@services/httpServices";

const Dashboard = ({ title, description, children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { state: userState, dispatch } = useContext(UserContext);
  const { isLoading, setIsLoading, currentPage } = useContext(SidebarContext);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = userState?.userInfo || session?.user;
  const userId = userInfo?._id || userInfo?.id;
  const isAuthenticated = !!userInfo?.token || status === "authenticated";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["orders", { currentPage, user: userId }],
    queryFn: async () =>
      await OrderServices.getOrderCustomer({
        page: currentPage,
        limit: 10,
      }),
    enabled: isAuthenticated,
  });

  const handleLogOut = () => {
    signOut({ redirect: false });
    Cookies.remove("userInfo");
    Cookies.remove("couponInfo");
    setToken(null);
    dispatch({ type: "USER_LOGOUT" });
    router.push("/");
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const userSidebar = [
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.dashboard_title
        ) || "Dashboard",
      href: "/user/dashboard",
      icon: FiGrid,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.my_order
        ) || "My Orders",
      href: "/user/my-orders",
      icon: FiList,
    },
    {
      title: "Notifications",
      href: "/user/notifications",
      icon: FiBell,
    },
    {
      title: "My Account",
      href: "/user/my-account",
      icon: FiUser,
    },
    {
      title: "Track Order",
      href: "/user/track-order",
      icon: FiTruck,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.update_profile
        ) || "Update Profile",
      href: "/user/update-profile",
      icon: FiSettings,
    },
    {
      title:
        showingTranslateValue(
          storeCustomizationSetting?.dashboard?.change_password
        ) || "Change Password",
      href: "/user/change-password",
      icon: IoLockOpenOutline,
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={title ? title : "Dashboard"}
          description={description ? description : "This is User Dashboard"}
          mainPaddingClass="pt-14 lg:pt-[100px] pb-16 lg:pb-0"
        >
          <div className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <div className="pt-0 pb-8 lg:pt-1 lg:pb-12 flex flex-col lg:flex-row w-full gap-5 lg:gap-6">
                {/* Sidebar Column */}
                <div className="shrink-0 w-full lg:w-72">
                  {/* Mobile Header / Drawer Toggle */}
                  <div className="bg-[#0c0d16] border border-white/10 p-4 rounded-2xl mb-4 lg:hidden flex justify-between items-center shadow-lg text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                        {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="text-left">
                        <h2 className="text-base font-bold text-white line-clamp-1">
                          {userInfo?.name || "My Account"}
                        </h2>
                        <span className="text-xs text-gray-400 line-clamp-1">
                          {userInfo?.email || userInfo?.phone || "—"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-all shadow-md shadow-blue-900/30"
                      aria-label="Toggle Navigation"
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sidebar Menu Card */}
                  <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-[#0c0d16] p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10 sticky top-28 text-white`}>
                    {/* User Profile Header (Desktop) */}
                    <div className="hidden lg:flex flex-col items-center mb-6 pb-6 border-b border-white/10">
                      <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-3xl font-black mb-3 shadow-inner shadow-blue-950">
                        {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <h2 className="text-lg font-bold text-white text-center line-clamp-1">
                        {userInfo?.name || "Customer"}
                      </h2>
                      <p className="text-xs text-gray-400 text-center line-clamp-1 mt-0.5">
                        {userInfo?.email || userInfo?.phone || "—"}
                      </p>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1.5" aria-label="User navigation">
                      {userSidebar.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            <item.icon
                              className={`shrink-0 h-5 w-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'
                                }`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        );
                      })}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogOut}
                        type="button"
                        className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 mt-4 border-t border-white/10 pt-4"
                      >
                        <IoLockOpenOutline className="shrink-0 h-5 w-5 mr-3 text-red-400" />
                        <span>{showingTranslateValue(storeCustomizationSetting?.navbar?.logout) || "Logout"}</span>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full min-w-0">
                  {!children ? (
                    <div className="space-y-6">
                      {/* Welcome Heading Banner */}
                      <div className="text-left bg-gradient-to-r from-[#0c0d16] to-[#121322] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-lg">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Welcome back,{" "}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
                            {userInfo?.name || "Shopper"}
                          </span>
                          !
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                          Manage your active orders, account settings, and delivery addresses from one place.
                        </p>
                      </div>

                      {/* 4 Stat Cards */}
                      <div className="grid gap-4 sm:gap-5 grid-cols-2 xl:grid-cols-4">
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.total_order
                            ) || "Total Orders"
                          }
                          Icon={FiShoppingCart}
                          quantity={data?.totalDoc}
                          className="text-red-500"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.pending_order
                            ) || "Pending Orders"
                          }
                          Icon={FiRefreshCw}
                          quantity={data?.pending}
                          className="text-orange-500"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.processing_order
                            ) || "Processing Orders"
                          }
                          Icon={FiTruck}
                          quantity={data?.processing}
                          className="text-blue-500"
                        />
                        <Card
                          title={
                            showingTranslateValue(
                              storeCustomizationSetting?.dashboard?.complete_order
                            ) || "Completed Orders"
                          }
                          Icon={FiCheck}
                          quantity={data?.delivered}
                          className="text-emerald-500"
                        />
                      </div>

                      {/* Recent Orders Section */}
                      <RecentOrder data={data} loading={loading} error={error} />
                    </div>
                  ) : (
                    children
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
