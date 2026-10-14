import React, { useContext, useState } from "react";
import { NavLink, Route } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button, WindmillContext } from "@windmill/react-ui";
import { IoLogOutOutline } from "react-icons/io5";
//import { Link } from "react-router-dom"
import kalkibrand_logo from "@/assets/img/logo/kalkibrand_logo.png";
import kalkibrand_logo_white_bg from "@/assets/img/logo/kalkibrand_logo_white_bg.png";


//internal import
import sidebar from "@/routes/sidebar";
// import SidebarSubMenu from "SidebarSubMenu";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import useGetCData from "@/hooks/useGetCData";
import { ADMIN_BRAND_LOGO } from "@/utils/cloudinaryUrl";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { dispatch } = useContext(AdminContext);
  const { globalSetting } = useContext(SidebarContext);
  const { accessList, role } = useGetCData();

  const allSidebarRouteKeys = sidebar
    .flatMap((route) => {
      if (route.routes) {
        return route.routes.map((r) => r.path?.split("?")[0].split("/")[1]);
      }
      if (route.path) {
        return [route.path.split("?")[0].split("/")[1]];
      }
      return [];
    })
    .filter(Boolean);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
  };

  // Filter out undefined values from the Effective Access List
  const effectiveAccessList =
    role === "Super Admin" || role === "Admin"
      ? allSidebarRouteKeys
      : Array.isArray(accessList) && accessList.length > 0
        ? accessList.filter(Boolean)
        : allSidebarRouteKeys;

  const updatedSidebar = sidebar
    .map((route) => {
      if (route.routes) {
        // Include all submenus regardless of accessList for now
        const validSubRoutes = route.routes.filter((subRoute) => {
          const routeKey = subRoute.path?.split("?")[0].split("/")[1];
          return (
            effectiveAccessList.includes(routeKey) || subRoute.outside || true // Include all submenus
          );
        });

        if (validSubRoutes.length > 0) {
          return { ...route, routes: validSubRoutes };
        }
        return null; // Exclude the main route if no sub-routes are valid
      }

      // Handle top-level routes
      if (route.type === "title") return route;
      const routeKey = route.path?.split("?")[0].split("/")[1];
      return routeKey && effectiveAccessList.includes(routeKey) ? route : null;
    })
    .filter(Boolean);

  return (
    <div className="py-4 text-neutral-500 dark:text-zinc-400">
      <div className="flex items-center justify-center px-4 py-2">
        <a href="/" rel="noreferrer" className="block">
          <img
            src={mode === "dark" ? kalkibrand_logo : kalkibrand_logo_white_bg}
            alt="logo"
            style={{ height: "85px", width: "auto" }}
            className="object-contain"
          />
        </a>
      </div>
      <ul className="mt-4 space-y-1">
        {updatedSidebar?.map((route) =>
          route.type === "title" ? (
            <li className="px-6 py-2 mt-4" key={route.name}>
              <span className="text-[10px] font-extrabold tracking-[0.12em] text-neutral-400 dark:text-zinc-500 uppercase">
                {t(route.name)}
              </span>
            </li>
          ) : route.routes ? (
            <SidebarSubMenu route={route} key={route.name} />
          ) : (
            <li className="relative px-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                target={`${route?.outside ? "_blank" : "_self"}`}
                className="px-4 py-3 rounded-xl inline-flex items-center w-full text-sm font-semibold transition-all duration-200 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                activeClassName="!text-black dark:!text-white !bg-black/5 dark:!bg-white/10 shadow-sm"
                rel="noreferrer"
              >
                <route.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="ml-3 font-medium">{t(`${route.name}`)}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <span className="px-4 py-4 block mt-4">
        <Button onClick={handleLogOut} size="large" className="w-full btn-modern !bg-zinc-900 hover:!bg-zinc-800 !text-white border border-white/10 rounded-xl transition-all shadow-md">
          <span className="flex items-center justify-center">
            <IoLogOutOutline className="mr-3 text-lg" />
            <span className="text-sm font-semibold">{t("LogOut")}</span>
          </span>
        </Button>
      </span>
    </div>
  );
};

export default SidebarContent;
