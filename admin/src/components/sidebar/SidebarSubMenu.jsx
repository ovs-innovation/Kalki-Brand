import React, { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

const SidebarSubMenu = ({ route }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <li className="relative px-3 py-0.5" key={route.name}>
        <button
          className="inline-flex items-center justify-between focus:outline-none w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
        >
          <span className="inline-flex items-center">
            <route.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="ml-3 font-medium">{t(`${route.name}`)}</span>
          </span>
          <span className="text-xs opacity-70">
            {open ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
          </span>
        </button>
        {open && route.routes && (
          <ul
            className="mt-1 space-y-1 overflow-hidden pl-4 pr-1 py-1 text-sm font-medium"
            aria-label="submenu"
          >
            {route.routes.map((child, index) => (
              <li key={index}>
                {child.outside ? (
                  <a
                    href={child.path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center px-4 py-2 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mr-2.5"></span>
                    <span>{t(`${child.name}`)}</span>
                  </a>
                ) : (
                  <NavLink
                    to={child.path}
                    className="flex items-center px-4 py-2 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    activeClassName="!text-black dark:!text-white !bg-black/5 dark:!bg-white/10 font-semibold"
                    rel="noreferrer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5"></span>
                    <span>{t(`${child.name}`)}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default SidebarSubMenu;
