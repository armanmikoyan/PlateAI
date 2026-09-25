'use client';

import { useRef } from 'react';
import { cn } from '@/app/utils/cn';
import type { FeatureDemoSceneKey, FeatureDemoTabsProps } from './types';

export function FeatureDemoTabs({ rows, activeKey, onSelect }: FeatureDemoTabsProps) {
  const buttonRefs = useRef(new Map<FeatureDemoSceneKey, HTMLButtonElement>());
  const activeIndex = rows.findIndex((row) => row.KEY === activeKey);

  const moveFocus = (direction: 1 | -1) => {
    if (activeIndex < 0) {
      return;
    }
    const nextIndex = (activeIndex + direction + rows.length) % rows.length;
    const nextRow = rows[nextIndex];
    const nextButton = buttonRefs.current.get(nextRow.KEY);
    nextButton?.focus();
    onSelect(nextRow.KEY);
  };

  return (
    <div role="tablist" aria-orientation="vertical" className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-col">
      {rows.map((row) => {
        const Icon = row.ICON;
        const isActive = row.KEY === activeKey;

        return (
          <button
            key={row.KEY}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(row.KEY, node);
              } else {
                buttonRefs.current.delete(row.KEY);
              }
            }}
            id={`feature-tab-${row.KEY}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="feature-demo-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(row.KEY)}
            onMouseEnter={() => {
              if (window.matchMedia('(hover: hover)').matches) {
                onSelect(row.KEY);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                moveFocus(1);
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                moveFocus(-1);
              }
            }}
            className={cn(
              'group flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta lg:gap-3 lg:p-4.5',
              isActive
                ? 'border-cta/30 bg-cta/[0.06]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]',
            )}
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 lg:size-10',
                row.ACCENT_SHELL,
              )}
            >
              <Icon aria-hidden className="size-4.5 lg:size-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span
                className={cn(
                  'text-xs font-semibold tracking-tight lg:text-sm',
                  isActive ? 'text-white' : 'text-white/75',
                )}
              >
                {row.TITLE}
              </span>
              <span className="mt-1 hidden text-xs/relaxed text-white/45 lg:block">{row.BODY}</span>
            </span>
            <span
              aria-hidden
              className={cn(
                'ml-auto mt-1 hidden size-1.5 shrink-0 self-start rounded-full transition-opacity duration-200 lg:block',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
              )}
              style={{ backgroundColor: row.ACCENT_HEX }}
            />
          </button>
        );
      })}
    </div>
  );
}
