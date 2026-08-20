import Link from "next/link";

import { LocaleSwitcher } from "@/components/locale-switcher";
import type { Locale } from "@/i18n/config";

type SiteHeaderProps = {
  lang: Locale;
  labels: {
    home: string;
    math: string;
    language: string;
  };
};

export function SiteHeader({ lang, labels }: SiteHeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href={`/${lang}`}
            className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            MyScienceLab
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href={`/${lang}`}
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              {labels.home}
            </Link>
            <Link
              href={`/${lang}/math`}
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              {labels.math}
            </Link>
          </nav>
        </div>
        <LocaleSwitcher lang={lang} label={labels.language} />
      </div>
    </header>
  );
}
