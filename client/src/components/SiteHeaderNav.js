"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";

function isInternalHref(url) {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
}

function Chevron({ open }) {
  return (
    <svg
      className={`size-3.5 transition ${open ? "rotate-180 text-brand" : "text-slate-400"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function NavLink({ href, className, onClick, children }) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function buildTableRows(columns) {
  const maxRows = Math.max(0, ...columns.map((c) => (c.navLinks || []).length));
  return Array.from({ length: maxRows }, (_, rowIndex) =>
    columns.map((column) => (column.navLinks || [])[rowIndex] || null)
  );
}

function MegaTable({ columns, onNavigate }) {
  const rows = buildTableRows(columns);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((column) => (
              <th
                key={String(column._id)}
                className="min-w-[160px] px-4 py-3 text-[11px] font-bold tracking-[0.08em] text-brand uppercase first:pl-0 last:pr-0"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
            >
              {row.map((link, colIndex) => (
                <td
                  key={`${columns[colIndex]?._id || colIndex}-${rowIndex}`}
                  className="border-r border-slate-100 px-4 py-2.5 align-top last:border-r-0 dark:border-slate-800 first:pl-0 last:pr-0"
                >
                  {link ? (
                    <NavLink
                      href={link.url || "#"}
                      onClick={onNavigate}
                      className="block text-sm text-slate-700 no-underline hover:text-brand dark:text-slate-200 dark:hover:text-brand"
                    >
                      {link.name}
                    </NavLink>
                  ) : (
                    <span className="block min-h-[1.25rem]" aria-hidden="true" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileColumnTable({ column, onNavigate }) {
  const links = column.navLinks || [];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-brand uppercase dark:border-slate-700 dark:bg-slate-900">
        {column.name}
      </div>
      <table className="w-full border-collapse text-left">
        <tbody>
          {links.map((link, index) => (
            <tr
              key={String(link._id)}
              className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
            >
              <td className="w-8 px-3 py-2.5 text-xs tabular-nums text-slate-400">
                {index + 1}
              </td>
              <td className="px-2 py-2.5">
                <NavLink
                  href={link.url || "#"}
                  onClick={onNavigate}
                  className="block text-sm text-slate-700 no-underline hover:text-brand dark:text-slate-200"
                >
                  {link.name}
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DesktopNav({ navigation }) {
  const [openId, setOpenId] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function onDocClick(event) {
      if (!navRef.current?.contains(event.target)) {
        setOpenId(null);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <ul ref={navRef} className="m-0 hidden list-none items-center gap-1 p-0 lg:flex">
      {navigation.map((item) => {
        const id = String(item._id);
        const isOpen = openId === id;
        return (
          <li key={id} className="relative">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setOpenId(isOpen ? null : id);
              }}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent px-3 py-2 text-sm font-medium ${
                isOpen
                  ? "text-brand"
                  : "text-slate-700 hover:text-brand dark:text-slate-200 dark:hover:text-brand"
              }`}
            >
              <span>{item.name}</span>
              <Chevron open={isOpen} />
            </button>

            {isOpen && (
              <div
                className="absolute top-[calc(100%+0.75rem)] left-0 z-30 min-w-[560px] max-w-[min(920px,calc(100vw-3rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                onClick={(e) => e.stopPropagation()}
              >
                {item.columns?.length ? (
                  <MegaTable
                    columns={item.columns}
                    onNavigate={() => setOpenId(null)}
                  />
                ) : (
                  <p className="m-0 text-sm text-slate-400">No columns</p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MobileNavSections({ navigation, onNavigate }) {
  const [openId, setOpenId] = useState(null);

  return (
    <ul className="m-0 grid list-none gap-2 p-0">
      {navigation.map((item) => {
        const id = String(item._id);
        const isOpen = openId === id;
        return (
          <li
            key={id}
            className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-3 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              <span>{item.name}</span>
              <Chevron open={isOpen} />
            </button>
            {isOpen && (
              <div className="grid gap-3 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
                {item.columns?.length ? (
                  item.columns.map((column) => (
                    <MobileColumnTable
                      key={String(column._id)}
                      column={column}
                      onNavigate={onNavigate}
                    />
                  ))
                ) : (
                  <p className="m-0 text-sm text-slate-400">No columns</p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteHeaderNav({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!navigation?.length) {
    return <p className="m-0 text-sm text-slate-400">No navigation items.</p>;
  }

  return (
    <>
      <div className="lg:hidden">
        <HamburgerButton
          label="Open navigation"
          onClick={() => setDrawerOpen(true)}
        />
      </div>

      <DesktopNav navigation={navigation} />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Menu"
        side="left"
      >
        <MobileNavSections
          navigation={navigation}
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>
    </>
  );
}
