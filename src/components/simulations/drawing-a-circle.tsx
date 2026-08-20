"use client";

import { useState } from "react";

import { CartesianPlane } from "@/components/cartesian-plane";

type DrawingACircleLabels = {
  radius: string;
  centerX: string;
  centerY: string;
};

type DrawingACircleProps = {
  labels: DrawingACircleLabels;
};

const DOMAIN_PADDING = 2;

export function DrawingACircle({ labels }: DrawingACircleProps) {
  const [radius, setRadius] = useState(10);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const safeRadius = Number.isFinite(radius) ? Math.max(radius, 0) : 0;
  const safeCenterX = Number.isFinite(centerX) ? centerX : 0;
  const safeCenterY = Number.isFinite(centerY) ? centerY : 0;

  const xMin = safeCenterX - safeRadius - DOMAIN_PADDING;
  const xMax = safeCenterX + safeRadius + DOMAIN_PADDING;
  const yMin = safeCenterY - safeRadius - DOMAIN_PADDING;
  const yMax = safeCenterY + safeRadius + DOMAIN_PADDING;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex max-w-sm flex-col gap-3 self-start">
        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          {labels.radius}
          <input
            type="number"
            value={Number.isNaN(radius) ? "" : radius}
            onChange={(event) => setRadius(event.target.valueAsNumber)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          {labels.centerX}
          <input
            type="number"
            value={Number.isNaN(centerX) ? "" : centerX}
            onChange={(event) => setCenterX(event.target.valueAsNumber)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          {labels.centerY}
          <input
            type="number"
            value={Number.isNaN(centerY) ? "" : centerY}
            onChange={(event) => setCenterY(event.target.valueAsNumber)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400"
          />
        </label>
      </div>

      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        className="w-full max-w-3xl self-start rounded-xl border border-zinc-200 dark:border-zinc-800"
      >
        {({ toX, toY, toLength }) => (
          <circle
            cx={toX(safeCenterX)}
            cy={toY(safeCenterY)}
            r={toLength(safeRadius)}
            fill="none"
            strokeWidth={3}
            className="stroke-sky-600 dark:stroke-sky-400"
          />
        )}
      </CartesianPlane>
    </div>
  );
}
