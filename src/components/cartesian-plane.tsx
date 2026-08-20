"use client";

import {
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

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
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    lastClientX: number;
    lastClientY: number;
  } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const domain = equalAspectDomain(
    xMin + pan.x,
    xMax + pan.x,
    yMin + pan.y,
    yMax + pan.y,
  );
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

  function clientDeltaToMath(deltaClientX: number, deltaClientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

    const deltaViewX = (deltaClientX / rect.width) * VIEW_SIZE;
    const deltaViewY = (deltaClientY / rect.height) * VIEW_SIZE;

    return {
      x: deltaViewX / unitScale,
      y: deltaViewY / unitScale,
    };
  }

  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaClientX = event.clientX - drag.lastClientX;
    const deltaClientY = event.clientY - drag.lastClientY;
    drag.lastClientX = event.clientX;
    drag.lastClientY = event.clientY;

    const deltaMath = clientDeltaToMath(deltaClientX, deltaClientY);
    // Move the plane with the pointer (grab-the-paper).
    setPan((current) => ({
      x: current.x - deltaMath.x,
      y: current.y + deltaMath.y,
    }));
  }

  function endDrag(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className={`${className ?? ""} touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      role="img"
      aria-label="Cartesian plane"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
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

      {ticks.map((tick) => (
        <g key={`label-${tick}`} className="fill-zinc-500 text-xl dark:fill-zinc-400">
          <text x={toX(tick)} y={originY + 24} textAnchor="middle">
            {formatTick(tick)}
          </text>
          <text x={originX - 12} y={toY(tick) + 6} textAnchor="end">
            {formatTick(tick)}
          </text>
        </g>
      ))}

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
  if (range <= 30) return 1;
  if (range <= 60) return 2;
  if (range <= 150) return 5;

  const rough = range / 10;
  const power = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / power;

  if (normalized <= 1) return power;
  if (normalized <= 2) return 2 * power;
  if (normalized <= 5) return 5 * power;
  return 10 * power;
}

function formatTick(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
