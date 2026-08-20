import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";

import { getDictionary } from "../../dictionaries";

export default async function DrawingACirclePage({
  params,
}: PageProps<"/[lang]/math/drawing-a-circle">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {dict.math.simulations.drawingACircle.title}
      </h1>
    </section>
  );
}
