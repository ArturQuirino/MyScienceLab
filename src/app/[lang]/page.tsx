import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";

import { getDictionary } from "./dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        MyScienceLab
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {dict.home.headline}
      </h1>
      <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {dict.home.body}
      </p>
    </section>
  );
}
