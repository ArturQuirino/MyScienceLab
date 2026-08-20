import type { ReactNode } from "react";

export type MathToSvg = {
  toX: (mathX: number) => number;
  toY: (mathY: number) => number;
  toLength: (mathLength: number) => number;
};

type CartesianPlaneProps = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  className?: string;
  children?: (math: MathToSvg) => ReactNode;
};

const VIEW_SIZE = 1000;
const PADDING = 48;

function equalAspectDomain(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  const xMid = (xMin + xMax) / 2;
  const yMid = (yMin + yMax) / 2;
  const half = Math.max(xMax - xMin, yMax - yMin, 1) / 2;

  return {
    xMin: xMid - half,
    xMax: xMid + half,
    yMin: yMid - half,
    yMax: yMid + half,
  };
}

export function CartesianPlane({
  xMin,
  xMax,
  yMin,
  yMax,
  className,
  children,
}: CartesianPlaneProps) {
  const domain = equalAspectDomain(xMin, xMax, yMin, yMax);
  const plotSize = VIEW_SIZE - PADDING * 2;
  const unitScale = plotSize / (domain.xMax - domain.xMin);

  const toX = (mathX: number) =>
    PADDING + (mathX - domain.xMin) * unitScale;
  const toY = (mathY: number) =>
    PADDING + (domain.yMax - mathY) * unitScale;
  const toLength = (mathLength: number) => Math.abs(mathLength) * unitScale;

  const originX = toX(0);
  const originY = toY(0);
  const plotLeft = PADDING;
  const plotRight = VIEW_SIZE - PADDING;
  const plotTop = PADDING;
  const plotBottom = VIEW_SIZE - PADDING;

  const tickStep = niceTickStep(domain.xMax - domain.xMin);
  const ticks: number[] = [];
  const tickStart = Math.ceil(domain.xMin / tickStep) * tickStep;
  for (let value = tickStart; value <= domain.xMax + 1e-9; value += tickStep) {
    const rounded = Number(value.toFixed(8));
    if (Math.abs(rounded) > 1e-9) {
      ticks.push(rounded);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className={className}
      role="img"
      aria-label="Cartesian plane"
    >
      <rect
        x={0}
        y={0}
        width={VIEW_SIZE}
        height={VIEW_SIZE}
        className="fill-zinc-50 dark:fill-zinc-950"
      />

      {ticks.map((tick) => (
        <g key={tick} className="stroke-zinc-200 dark:stroke-zinc-800">
          <line x1={toX(tick)} y1={plotTop} x2={toX(tick)} y2={plotBottom} />
          <line x1={plotLeft} y1={toY(tick)} x2={plotRight} y2={toY(tick)} />
        </g>
      ))}

      <g className="stroke-zinc-700 dark:stroke-zinc-300">
        <line
          x1={plotLeft}
          y1={originY}
          x2={plotRight}
          y2={originY}
          strokeWidth={2}
        />
        <line
          x1={originX}
          y1={plotTop}
          x2={originX}
          y2={plotBottom}
          strokeWidth={2}
        />
        <polygon
          points={`${plotRight},${originY} ${plotRight - 14},${originY - 7} ${plotRight - 14},${originY + 7}`}
          className="fill-zinc-700 stroke-none dark:fill-zinc-300"
        />
        <polygon
          points={`${originX},${plotTop} ${originX - 7},${plotTop + 14} ${originX + 7},${plotTop + 14}`}
          className="fill-zinc-700 stroke-none dark:fill-zinc-300"
        />
      </g>

      <text
        x={plotRight - 18}
        y={originY - 12}
        className="fill-zinc-700 text-2xl dark:fill-zinc-300"
      >
        x
      </text>
      <text
        x={originX + 12}
        y={plotTop + 28}
        className="fill-zinc-700 text-2xl dark:fill-zinc-300"
      >
        y
      </text>

      {children?.({ toX, toY, toLength })}
    </svg>
  );
}

function niceTickStep(range: number) {
  const rough = range / 8;
  const power = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / power;

  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}
