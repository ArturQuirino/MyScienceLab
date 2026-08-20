import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-BR": () =>
    import("./dictionaries/pt-BR.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (!isLocale(locale)) notFound();
  return dictionaries[locale as Locale]();
};
