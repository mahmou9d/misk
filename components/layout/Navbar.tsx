"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./Cartdrawer";
import { useAuth, useGetRole } from "@/hooks/useAuth";
import { useGetCartItems } from "@/hooks/useCart";
import { useCats } from "@/lib/CatsContext";
import { useTranslation } from "@/lib/Usetranslation";
import {
  ArrowLeft,
  ArrowRight,
  BagIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DashboardIcon,
  LogoutIcon,
  MenuToggleIcon,
  SearchIcon,
  UserIcon,
} from "@/public/svg/Svgs";
import { useGetCategory, useGetPublicSettings } from "@/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderHistory } from "@/hooks/usePayment";

// ─── Logo ─────────────────────────────────────────────────────────────────────
const Logo = ({ locale }: { locale: string }) => (
  <Link
    href={`/${locale.toLowerCase()}`}
    className="flex flex-col items-center select-none leading-none group"
  >
    <span
      className="
         font-bold -widest transition-all duration-300
        text-3xl md:text-5xl
        [background:linear-gradient(135deg,#c9a84c_0%,#f0d080_45%,#b8912e_100%)]
        [background-clip:text]
        [letter-spacing:6px]
        [filter:drop-shadow(0_1px_6px_rgba(201,168,76,0.25))]
      "
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Misk
    </span>

    {/* Gold divider */}
    <span className="block h-px w-full mt-0.5 [background:linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)]" />
  </Link>
);

// ─── IconBtn ──────────────────────────────────────────────────────────────────
function IconBtn({
  children,
  badge,
  onClick,
  title,
}: {
  children: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative p-2.5 rounded-full transition-all duration-200 group text-[#666]"
    >
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 [background:rgba(201,168,76,0.08)]" />
      <span className="relative block transition-colors duration-200 group-hover:text-[var(--purple-deep)]">
        {children}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center rounded-full font-bold text-[#1a0a3d] w-[15px] h-[15px] text-[8px] [background:linear-gradient(135deg,#c9a84c,#e8b840)] [box-shadow:0_1px_4px_rgba(201,168,76,0.5)]">
          {badge}
        </span>
      )}
    </button>
  );
}

function UserActions({ locale }: { locale: string }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    setIsAdmin(localStorage.getItem("role"));
  }, []);

  if (!mounted)
    return (
      <div className="p-2.5">
        <div className="w-5 h-5" />
      </div>
    );

  if (isLoading)
    return (
      <div className="p-2.5">
        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );

  if (!isAuthenticated)
    return (
      <Link
        href={`/${locale.toLowerCase()}/login`}
        className="p-2.5 rounded-full transition-all duration-200 flex items-center group text-[#666]"
        title={t.navbar.signIn}
      >
        <span className="group-hover:text-[var(--purple-deep)] transition-colors">
          <UserIcon />
        </span>
      </Link>
    );

  const handleDashboardClick = () => {
    queryClient.clear();
  };

  return (
    <div className="flex items-center gap-[12px]">
      {isAdmin && (
        <>
          <Link
            href={`/${locale.toLowerCase()}/admin`}
            className="p-2.5 rounded-full transition-all duration-200 flex items-center group text-[#666]"
            title={t.navbar.dashboard}
            onClick={handleDashboardClick}
          >
            <span className="group-hover:text-[var(--purple-deep)] transition-colors">
              <DashboardIcon />
            </span>
          </Link>
          <span className="block xl:hidden w-1 h-8 [background:linear-gradient(180deg,transparent,rgba(201,168,76,0.3),transparent)]" />
        </>
      )}
      <IconBtn onClick={() => logout()} title={t.navbar.signOut}>
        <LogoutIcon />
      </IconBtn>
    </div>
  );
}
// ─── LangSwitcher ─────────────────────────────────────────────────────────────
function LangSwitcher() {
  const pathname = usePathname();
  const { isArabic } = useTranslation();
  const router = useRouter();
  const [arRef, setArRef] = useState<HTMLSpanElement | null>(null);
  const [enRef, setEnRef] = useState<HTMLSpanElement | null>(null);
  const [thumbStyle, setThumbStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(false);
const queryClient = useQueryClient();
  const switchLang = () => {
    if (loading) return;
    setLoading(true);
    const newLocale = isArabic ? "en" : "ar";
    const currentPath = pathname.replace(/^\/(ar|en)/, "") || "/";
    queryClient.clear();
    router.push(`/${newLocale}${currentPath}`);
  };

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(id);
  }, [loading]);

  useEffect(() => {
    const active = isArabic ? arRef : enRef;
    if (!active) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThumbStyle({
      left: active.offsetLeft - 3,
      width: active.offsetWidth + 3,
    });
  }, [isArabic, arRef, enRef]);

  const spinAr = loading && isArabic;
  const spinEn = loading && !isArabic;

  return (
    <button
      onClick={switchLang}
      disabled={loading}
      title={isArabic ? "Switch to English" : "التبديل للعربية"}
      className={`relative inline-flex items-center rounded-full p-[3px] select-none [background:rgba(0,0,0,0.04)] [border:0.5px_solid_rgba(201,168,76,0.25)] ${loading ? "cursor-default" : "cursor-pointer"}`}
    >
      <span
        className="absolute top-[3px] bottom-[3px] rounded-full pointer-events-none [background:linear-gradient(135deg,#c9a84c,#e8c847)] [box-shadow:0_1px_6px_rgba(201,168,76,0.35)] [transition:left_0.26s_cubic-bezier(0.32,0.13,0,1),width_0.26s_cubic-bezier(0.32,0.13,0,1)]"
        style={thumbStyle}
      />

      {/* AR slot */}
      <span
        ref={setArRef}
        className="relative z-[1] flex items-center justify-center h-[22px] w-10 overflow-hidden rounded-full px-3 text-xs font-medium transition-colors duration-[220ms]"
        style={{ color: isArabic ? "#1a0a3d" : "#888" }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-150"
          style={{
            opacity: spinAr ? 0 : 1,
            transform: spinAr ? "scale(0.7)" : "scale(1)",
          }}
        >
          عربي
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-150"
          style={{
            opacity: spinAr ? 1 : 0,
            transform: spinAr ? "scale(1)" : "scale(0.7)",
          }}
        >
          <LSSpin color="#1a0a3d" />
        </span>
      </span>

      {/* EN slot */}
      <span
        ref={setEnRef}
        className="relative z-[1] flex items-center justify-center h-[22px] w-8 overflow-hidden rounded-full px-3 text-xs font-medium [letter-spacing:0.5px] transition-colors duration-[220ms]"
        style={{ color: !isArabic ? "#1a0a3d" : "#888" }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-150"
          style={{
            opacity: spinEn ? 0 : 1,
            transform: spinEn ? "scale(0.7)" : "scale(1)",
          }}
        >
          EN
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-150"
          style={{
            opacity: spinEn ? 1 : 0,
            transform: spinEn ? "scale(1)" : "scale(0.7)",
          }}
        >
          <LSSpin color="#1a0a3d" />
        </span>
      </span>
    </button>
  );
}

// ─── LSSpin ───────────────────────────────────────────────────────────────────
function LSSpin({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      className="flex-shrink-0 animate-[ls-spin_0.65s_linear_infinite]"
    >
      <style>{`@keyframes ls-spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.32, 0.132, 0, 1];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { t, isArabic, locale, dir } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const { cartOpen, setCartOpen } = useCats();
  const [ddOpen, setDdOpen] = useState(false);
  const { data: cartData } = useGetCartItems();
  const { data: categories } = useGetCategory();
  const { data } = useGetPublicSettings();
const {data: orderHistory} = useOrderHistory()
console.log(orderHistory,"o")
  const cartCount = cartData?.reduce(
    (acc, item) => acc + Number(item?.quantity),
    0,
  );

  const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";
  const closeAll = () => {
    setDrawerOpen(false);
    setCatsOpen(false);
  };
  const handleSearchClick = () =>
    router.push(`/${locale.toLowerCase()}/search`);

  // const categories = [
  //   {
  //     label: t.navbar.womens,
  //     href: `/${locale.toLowerCase()}/collections/womens`,
  //   },
  //   { label: t.navbar.mens, href: `/${locale.toLowerCase()}/collections/mens` },
  // ];

  const links = [
    {
      label: t.navbar.home,
      href: `/${locale.toLowerCase()}`,
      active: cleanPath === `/${locale.toLowerCase()}`,
      dropdown: false,
    },
    { label: t.navbar.categories, href: "", active: false, dropdown: true },
    {
      label: t.navbar.orderhistory,
      href: `/${locale.toLowerCase()}/orderhistory`,
      active: cleanPath === `/${locale.toLowerCase()}/orderhistory`,
      dropdown: false,
    },
    {
      label: t.navbar.returnPolicy,
      href: `/${locale.toLowerCase()}/pages/return-policy`,
      active: cleanPath === `/${locale.toLowerCase()}/pages/return-policy`,
      dropdown: false,
    },

    {
      label: t.navbar.businesshourslocation,
      href: `/${locale.toLowerCase()}/businesshourslocation`,
      active: cleanPath === `/${locale.toLowerCase()}`,
      dropdown: false,
    },
  ];

  return (
    <>
      {/* ── Header ── */}
      <header
        className="w-full bg-white relative z-40 [border-bottom:1px_solid_rgba(201,168,76,0.2)] [box-shadow:0_1px_20px_rgba(45,27,105,0.06),0_4px_32px_rgba(45,27,105,0.04)]"
        dir={dir}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1280px] h-[68px]">
          <div className="flex items-center justify-between h-full w-full">
            {/* Hamburger */}
            <button
              className="xl:hidden text-gray-500 hover:text-[var(--purple-deep)] transition-colors flex-shrink-0 p-1 me-3"
              onClick={() => {
                setDrawerOpen((v) => !v);
                setCatsOpen(false);
              }}
            >
              <MenuToggleIcon open={drawerOpen} />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo locale={locale.toLowerCase()} />
            </div>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center flex-1 justify-start gap-0 ms-6">
              {links.map((l) =>
                l.dropdown ? (
                  <div
                    key={l.label}
                    className="relative "
                    onMouseEnter={() => setDdOpen(true)}
                    onMouseLeave={() => setDdOpen(false)}
                  >
                    <button
                      className={`flex text-[16px] items-center px-4 py-2 whitespace-nowrap transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[2px] after:left-4 after:right-3 after:h-[2.5px] after:bg-[linear-gradient(90deg,var(--purple-deep),rgba(201,168,76,0.6))] after:scale-x-0 after:origin-${isArabic ? "right" : "left"} after:transition-transform after:duration-300 hover:after:scale-x-100 bg-transparent border-0 cursor-pointer text-[length:16px] font-normal [letter-spacing:0.3px] hover:after:scale-x-100 active:after:scale-x-100 hover:!text-[var(--purple-deep)]`}
                      style={{ color: ddOpen ? "var(--purple-deep)" : "#555" }}
                    >
                      {l.label}
                      <ChevronDown open={ddOpen} />
                    </button>

                    <AnimatePresence>
                      {ddOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-[calc(100%+4px)] min-w-[220px] list-none py-2 bg-white rounded-sm [box-shadow:0_12px_40px_rgba(45,27,105,0.12),0_0_0_1px_rgba(201,168,76,0.18)]"
                          style={{ [isArabic ? "right" : "left"]: 0 }}
                        >
                          <div className="absolute top-0 left-4 right-4 h-px [background:linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)]" />

                          {categories?.map((cat, i) => (
                            <motion.li
                              key={cat.name}
                              initial={{ opacity: 0, x: isArabic ? 6 : -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.15 }}
                              className={`relative 
                                  before:content-['']
                                  before:absolute
                                  ${isArabic ? "before:right-0" : "before:left-0"}
                                  before:top-[20%]
                                  before:bottom-[20%]
                                  before:w-[2px]
                                  before:bg-[linear-gradient(180deg,transparent,var(--gold),transparent)]
                                  before:opacity-0
                                  before:transition-opacity
                                  before:duration-200
                                  hover:before:opacity-100`}
                            >
                              <Link
                                href={`/${locale.toLowerCase()}/collections/${cat.name.toLowerCase()}`}
                                onClick={closeAll}
                                className="flex items-center gap-2 py-[11px] px-5 text-gray-600 hover:text-[var(--purple-deep)] hover:bg-purple-50 transition-all text-[length:16px] [letter-spacing:0.2px]"
                              >
                                {cat.name}
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className={`relative after:content-[''] after:absolute after:bottom-[2px] after:left-3 after:right-3 after:h-[2.5px] after:bg-[linear-gradient(90deg,var(--purple-deep),rgba(201,168,76,0.6))] after:scale-x-0 after:origin-${isArabic ? "right" : "left"} after:transition-transform after:duration-300 hover:after:scale-x-100 px-4 py-2 whitespace-nowrap transition-colors duration-200 no-underline text-[length:16px] [letter-spacing:0.3px] ${l.active ? "active font-bold text-[var(--purple-deep)]" : "font-medium text-[#555]"} hover:!text-[var(--purple-deep)] hover:after:scale-x-100 active:after:scale-x-100`}
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center shrink-0">
              <LangSwitcher />

              <button
                onClick={handleSearchClick}
                title={t.navbar.search}
                className="hidden xl:block p-2.5 transition hover:text-[var(--purple-deep)] hover:bg-[rgba(201,168,76,0.08)] hover:rounded-full transition-all duration-200 text-[#666]"
              >
                <SearchIcon />
              </button>

              <span className="hidden xl:flex ">
                <UserActions locale={locale} />
              </span>

              <button
                onClick={() => setCartOpen(true)}
                className="hidden xl:block  relative p-2.5 transition hover:text-[var(--purple-deep)] hover:bg-[rgba(201,168,76,0.08)] hover:rounded-full transition-all duration-200 text-[#666]"
              >
                <BagIcon />
                {cartCount !== undefined && cartCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center rounded-full font-bold text-[#1a0a3d] w-4 h-4 text-[15px] top-1 [background:linear-gradient(135deg,#c9a84c,#e8b840)] [box-shadow:0_1px_5px_rgba(201,168,76,0.45)]"
                    style={{ [isArabic ? "left" : "right"]: 4 }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <style>{`body { overflow: hidden; }`}</style>

            {/* Main menu panel */}
            <AnimatePresence>
              {!catsOpen && (
                <motion.nav
                  className={`fixed z-40 bg-white xl:hidden flex flex-col ${data?.is_announcement_active ? "top-[105px]" : "top-[67px]"}  bottom-0 left-0 right-0 overflow-y-hidden`}
                  dir={dir}
                  initial={{ x: isArabic ? "100%" : "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: isArabic ? "100%" : "-100%" }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="h-px [background:linear-gradient(90deg,rgba(201,168,76,0.5),rgba(201,168,76,0.1))]" />

                  {links.map((l, i) => (
                    <motion.div
                      key={l.label}
                      initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                    >
                      {l.dropdown ? (
                        <button
                          onClick={() => setCatsOpen(true)}
                          className="w-full flex items-center justify-between text-gray-800 hover:bg-gray-50 transition-colors h-14 px-5 border-b border-black/5 text-[length:15px] font-normal "
                        >
                          <span>{l.label}</span>
                          <span className="text-[rgba(201,168,76,0.7)]">
                            {isArabic ? <ChevronLeft /> : <ChevronRight />}
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={l.href}
                          onClick={closeAll}
                          className={`flex items-center h-14 px-5 hover:bg-purple-50 transition-colors border-b border-black/5 text-[length:15px]  ${l.active ? "font-medium text-[var(--purple-deep)] [border-inline-start:2px_solid_var(--gold)]" : "font-normal text-[#444] [border-inline-start:2px_solid_transparent]"}`}
                        >
                          {l.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  <div className=" mt-auto p-5 [border-top:1px_solid_rgba(201,168,76,0.15)]">
                    <UserActions locale={locale} />
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Categories sub-panel */}
            <AnimatePresence>
              {catsOpen && (
                <motion.div
                  className={`fixed z-40 bg-white xl:hidden flex flex-col ${data?.is_announcement_active ? "top-[105px]" : "top-[67px]"} bottom-0 left-0 right-0 overflow-y-hidden`}
                  dir={dir}
                  initial={{ x: isArabic ? "-100%" : "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: isArabic ? "-100%" : "100%" }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="h-px [background:linear-gradient(90deg,rgba(201,168,76,0.5),transparent)]" />

                  {/* Back row */}
                  <div
                    className="flex items-center gap-3 shrink-0 cursor-pointer hover:bg-gray-50 transition-colors h-14 px-5 border-b border-black/5"
                    onClick={() => setCatsOpen(false)}
                  >
                    <button className="text-gray-400 hover:text-[var(--purple-deep)] transition-colors p-1 -ms-1">
                      {isArabic ? <ArrowRight /> : <ArrowLeft />}
                    </button>
                    <span className="text-[length:15px] font-medium text-[#333] ">
                      {t.navbar.categoriesTitle}
                    </span>
                  </div>

                  {categories?.map((cat, ci) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: isArabic ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + ci * 0.05, duration: 0.18 }}
                    >
                      <Link
                        href={`/${locale.toLowerCase()}/collections/${cat.name.toLowerCase()}`}
                        onClick={closeAll}
                        className="flex items-center gap-3 h-14 px-5 text-gray-700 hover:text-[var(--purple-deep)] hover:bg-purple-50 transition-colors border-b border-black/5 text-[length:15px]  [border-inline-start:2px_solid_transparent]"
                      >
                        {cat.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom Mobile Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 xl:hidden bg-white [border-top:1px_solid_rgba(201,168,76,0.2)] [box-shadow:0_-4px_20px_rgba(45,27,105,0.08)]"
        dir={dir}
      >
        <div className="flex items-center justify-around h-[60px] px-4">
          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="flex flex-col items-center gap-1 flex-1 py-2 text-[#888] hover:text-[var(--purple-deep)] transition-colors"
          >
            <SearchIcon />
            <span className="text-[10px] font-medium">{t.navbar.search}</span>
          </button>

          {/* Divider */}
          <span className="w-1 h-8 [background:linear-gradient(180deg,transparent,rgba(201,168,76,0.3),transparent)]" />

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-col items-center gap-1 flex-1 py-2 text-[#888] hover:text-[var(--purple-deep)] transition-colors"
          >
            <span className="relative">
              <BagIcon />
              {cartCount !== undefined && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold text-[#1a0a3d] w-4 h-4 text-[8px] [background:linear-gradient(135deg,#c9a84c,#e8b840)] [box-shadow:0_1px_5px_rgba(201,168,76,0.45)]">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">
              {isArabic ? "السلة" : "Cart"}
            </span>
          </button>

          {/* Divider */}
          <span className="w-1 h-8 [background:linear-gradient(180deg,transparent,rgba(201,168,76,0.3),transparent)]" />

          <button className="flex flex-col items-center gap-1 flex-1 py-2 text-[#888] hover:text-[var(--purple-deep)] transition-colors">
            <UserActions locale={locale} />
          </button>
        </div>

        {/* Gold top line */}
        <div className="absolute top-0 left-6 right-6 h-px [background:linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)]" />
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
