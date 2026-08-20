import { notFound } from "next/navigation";

import { DrawingACircle } from "@/components/simulations/drawing-a-circle";
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
  const labels = dict.math.simulations.drawingACircle;

  return (
    <section className="flex w-full max-w-3xl flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {labels.title}
      </h1>

      <DrawingACircle
        labels={{
          radius: labels.radius,
          centerX: labels.centerX,
          centerY: labels.centerY,
        }}
      />
    </section>
  );
}
