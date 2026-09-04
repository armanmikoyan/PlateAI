import type { ReactNode } from 'react';
import Link from 'next/link';
import SiteFooter from '@/app/components/site-footer';
import { Separator } from '@/app/ui/separator';
import { PRIVACY_CONTENT } from './constants';

export default function Privacy(): ReactNode {
  return (
    <>
      <div className="border-edge bg-canvas border-t py-16 sm:py-20 lg:py-24">
        <div className="layout-page-shell">
          <div className="mx-auto max-w-3xl">
            <p className="text-content-muted font-mono text-[11px] font-medium tracking-widest uppercase sm:text-xs">
              {PRIVACY_CONTENT.eyebrow}
            </p>
            <h1 className="text-content mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {PRIVACY_CONTENT.title}
            </h1>
            <p className="text-content-muted mt-4 text-base">{PRIVACY_CONTENT.intro}</p>
            <p className="text-content-muted mt-2 text-sm">
              {PRIVACY_CONTENT.lastUpdatedLabel}: {PRIVACY_CONTENT.lastUpdated}
            </p>

            <Separator className="mt-10" />

            <div className="flex flex-col gap-8">
              {PRIVACY_CONTENT.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-content mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.heading}
                  </h2>
                  <p className="text-content-muted mt-3 text-sm/relaxed sm:text-base/relaxed">
                    {section.body}
                  </p>
                  {section.bodyLink ? (
                    <Link
                      href={section.bodyLink.href}
                      className="text-accent-mid mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:opacity-90"
                    >
                      {section.bodyLink.label}
                    </Link>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
