'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/app/utils/cn';
import { VENOM_FIBERS, VENOM_FIBER_INK, VENOM_FIBER_SHEEN } from './venom-fibers-constants';

type VenomFiber = {
  ANCHOR_X: number;
  ANCHOR_Y: number;
  OFFSET_X: number;
  OFFSET_Y: number;
  WIDTH: number;
  CURL: number;
  SPEED: number;
  PHASE: number;
  DELAY: number;
  GROWTH: number;
};

type VenomFibersProps = Readonly<{
  className?: string;
}>;

function seededRandom(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function cubicPoint(start: number, control1: number, control2: number, end: number, t: number) {
  const u = 1 - t;
  return u * u * u * start + 3 * u * u * t * control1 + 3 * u * t * t * control2 + t * t * t * end;
}

function buildFibers(count: number): VenomFiber[] {
  const fibers: VenomFiber[] = [];
  const golden = 0.61803398875;

  for (let index = 0; index < count; index += 1) {
    const side = index % 4;
    const along = (index * golden) % 1;
    const radius = Math.sqrt(seededRandom(index, 3)) * VENOM_FIBERS.POINTER_RADIUS_PX;
    const angle = seededRandom(index, 7) * Math.PI * 2;

    let anchorX = along;
    let anchorY = along;

    if (side === 0) {
      anchorY = 0;
    } else if (side === 1) {
      anchorX = 1;
      anchorY = along;
    } else if (side === 2) {
      anchorX = along;
      anchorY = 1;
    } else {
      anchorX = 0;
    }

    fibers.push({
      ANCHOR_X: anchorX,
      ANCHOR_Y: anchorY,
      OFFSET_X: Math.cos(angle) * radius,
      OFFSET_Y: Math.sin(angle) * radius,
      WIDTH: VENOM_FIBERS.BASE_WIDTH_PX * (0.5 + seededRandom(index, 11)),
      CURL: seededRandom(index, 13) * 2 - 1,
      SPEED: 0.6 + seededRandom(index, 17) * 1.2,
      PHASE: seededRandom(index, 19) * Math.PI * 2,
      DELAY: seededRandom(index, 23) * 0.55,
      GROWTH: 0,
    });
  }

  return fibers;
}

export function VenomFibers({ className }: VenomFibersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvasNode = canvasRef.current;
    const hostNode = canvasNode?.parentElement;

    if (!canvasNode || !hostNode) {
      return;
    }

    const contextNode = canvasNode.getContext('2d');

    if (!contextNode) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasNode;
    const host: HTMLElement = hostNode;
    const context: CanvasRenderingContext2D = contextNode;
    const fibers = buildFibers(VENOM_FIBERS.COUNT);
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pressed = false;
    let energy = 0;
    let targetEnergy = 0;
    let raf = 0;
    let running = false;

    function resize() {
      const rect = host.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      width = rect.width;
      height = rect.height;
      dpr = Math.min(VENOM_FIBERS.DPR_CAP, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.x = Math.min(Math.max(target.x, 0), width);
      target.y = Math.min(Math.max(target.y, 0), height);
    }

    function updateFromPointer(event: PointerEvent) {
      if (host.getAttribute('aria-disabled') === 'true' || (host as HTMLButtonElement).disabled) {
        targetEnergy = 0;
        return;
      }

      const rect = host.getBoundingClientRect();
      const inset = VENOM_FIBERS.POINTER_INSET_PX;
      const insideX = Math.min(Math.max(event.clientX - rect.left, inset), rect.width - inset);
      const insideY = Math.min(Math.max(event.clientY - rect.top, inset), rect.height - inset);
      const outsideX = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const outsideY = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const distance = Math.hypot(outsideX, outsideY);

      target.x = insideX;
      target.y = insideY;
      targetEnergy = pressed ? 1 : distance === 0 ? 1 : Math.max(0, 1 - distance / VENOM_FIBERS.PROXIMITY_PX);

      if (targetEnergy > 0) {
        ensureLoop();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!host.contains(event.target as Node)) {
        return;
      }

      pressed = true;
      updateFromPointer(event);
      ensureLoop();
    }

    function handlePointerUp() {
      pressed = false;
      targetEnergy = 0;
      ensureLoop();
    }

    function reset() {
      pressed = false;
      targetEnergy = 0;
      ensureLoop();
    }

    function ensureLoop() {
      if (running) {
        return;
      }

      running = true;
      raf = requestAnimationFrame(frame);
    }

    function draw(time: number) {
      const { x: px, y: py } = pointer;
      const reach = Math.max(width, height) * 0.45;
      const glow = context.createRadialGradient(px, py, 0, px, py, reach);

      glow.addColorStop(0, `rgba(${VENOM_FIBER_INK}, ${0.22 * energy})`);
      glow.addColorStop(0.45, `rgba(${VENOM_FIBER_INK}, ${0.08 * energy})`);
      glow.addColorStop(1, `rgba(${VENOM_FIBER_INK}, 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.lineCap = 'round';

      for (const fiber of fibers) {
        if (fiber.GROWTH < 0.02) {
          continue;
        }

        const ax = fiber.ANCHOR_X * width;
        const ay = fiber.ANCHOR_Y * height;
        const tx = px + fiber.OFFSET_X;
        const ty = py + fiber.OFFSET_Y;
        const dx = tx - ax;
        const dy = ty - ay;
        const length = Math.hypot(dx, dy);

        if (length < 1) {
          continue;
        }

        const nx = -dy / length;
        const ny = dx / length;
        const wobble = Math.sin(time * fiber.SPEED + fiber.PHASE);
        const bend = fiber.CURL * Math.min(26, length * 0.22) + wobble * Math.min(9, length * 0.08);
        const c1x = ax + dx * 0.34 + nx * bend;
        const c1y = ay + dy * 0.34 + ny * bend;
        const c2x = ax + dx * 0.7 + nx * (bend * 0.5 - wobble * 4);
        const c2y = ay + dy * 0.7 + ny * (bend * 0.5 - wobble * 4);
        const steps = VENOM_FIBERS.SAMPLE_STEPS;
        const visible = Math.max(2, Math.ceil(fiber.GROWTH * steps));
        const flare = 0.32 + 0.16 * Math.sin(Math.PI * Math.min(1, fiber.GROWTH));
        let prevX = ax;
        let prevY = ay;

        for (let step = 1; step <= visible; step += 1) {
          const t = step / steps;
          const x = cubicPoint(ax, c1x, c2x, tx, t);
          const y = cubicPoint(ay, c1y, c2y, ty, t);

          context.beginPath();
          context.moveTo(prevX, prevY);
          context.lineTo(x, y);
          context.lineWidth = Math.max(0.3, fiber.WIDTH * (1 - t * 0.7));
          context.strokeStyle = `rgba(${VENOM_FIBER_INK}, ${energy * flare * (1 - t * 0.3)})`;
          context.stroke();

          prevX = x;
          prevY = y;
        }

        context.beginPath();
        context.arc(prevX, prevY, Math.max(0.6, fiber.WIDTH * 0.8), 0, Math.PI * 2);
        context.fillStyle = `rgba(${VENOM_FIBER_INK}, ${0.5 * energy})`;
        context.fill();

        context.beginPath();
        context.arc(prevX, prevY, Math.max(0.3, fiber.WIDTH * 0.3), 0, Math.PI * 2);
        context.fillStyle = `rgba(${VENOM_FIBER_SHEEN}, ${0.18 * energy})`;
        context.fill();
      }
    }

    function frame(now: number) {
      const time = now / 1000;
      energy += (targetEnergy - energy) * 0.12;
      pointer.x += (target.x - pointer.x) * 0.18;
      pointer.y += (target.y - pointer.y) * 0.18;

      context.clearRect(0, 0, width, height);

      for (const fiber of fibers) {
        const goal = Math.max(0, Math.min(1, (energy - fiber.DELAY) / (1 - fiber.DELAY)));
        const speed = 0.07 + fiber.SPEED * 0.035;
        fiber.GROWTH += (goal - fiber.GROWTH) * speed;
      }

      if (energy > 0.005) {
        draw(time);
      }

      if (energy > 0.01 || targetEnergy > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        context.clearRect(0, 0, width, height);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    window.addEventListener('pointermove', updateFromPointer, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('blur', reset);
    document.addEventListener('pointerleave', reset, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', updateFromPointer);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', reset);
      document.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 -z-10 size-full', className)}
      aria-hidden
    />
  );
}
