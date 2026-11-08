"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";

const navigationItems = [
  { key: "services", href: "/services" },
  { key: "projects", href: "/realisations" },
  { key: "advice", href: "/conseil" },
  { key: "about", href: "/a-propos" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const otherLocale = locale === "fr" ? "en" : "fr";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link aria-label="Taloom — accueil" className="wordmark" href="/" onClick={closeMenu}>
          TALOOM<span aria-hidden="true">.</span>
        </Link>

        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("closeMenu") : t("menu")}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeMenu();
          }}
          type="button"
        >
          <span>{menuOpen ? "Fermer" : "Menu"}</span>
        </button>

        <nav
          aria-label={t("primary")}
          className={menuOpen ? "primary-navigation is-open" : "primary-navigation"}
          id="primary-navigation"
        >
          {navigationItems.map(({ key, href }) => (
            <Link href={href} key={key} onClick={closeMenu}>
              {t(key)}
            </Link>
          ))}
          <Link className="nav-estimate" href="/estimate" onClick={closeMenu}>
            {t("estimate")}
          </Link>
          <Link
            aria-label={t("switchToEnglish")}
            className="locale-link"
            href={pathname}
            locale={otherLocale}
            onClick={closeMenu}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
