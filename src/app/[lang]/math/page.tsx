import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";

import { getDictionary } from "../dictionaries";

export default async function MathPage({
  params,
}: PageProps<"/[lang]/math">) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const simulations = [
    {
      href: `/${lang}/math/drawing-a-circle`,
      title: dict.math.simulations.drawingACircle.title,
    },
  ];

  return (
    <section className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {dict.math.headline}
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {dict.math.body}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {simulations.map((simulation) => (
          <li key={simulation.href}>
            <Link
              href={simulation.href}
              className="block rounded-xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <h2 className="text-lg font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
                {simulation.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
