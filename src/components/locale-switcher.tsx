"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/i18n/config";

type LocaleSwitcherProps = {
  lang: Locale;
  label: string;
};

export function LocaleSwitcher({ lang, label }: LocaleSwitcherProps) {
  const pathname = usePathname();

  const pathnameWithoutLocale =
    pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "") || "/";

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="sr-only">{label}</span>
      {locales.map((locale) => {
        const href =
          pathnameWithoutLocale === "/"
            ? `/${locale}`
            : `/${locale}${pathnameWithoutLocale}`;

        const isActive = locale === lang;

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            className={
              isActive
                ? "font-medium text-zinc-950 dark:text-zinc-50"
                : "transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {locale === "pt-BR" ? "PT" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}
