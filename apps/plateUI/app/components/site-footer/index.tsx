import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import SiGithub from '@icons-pack/react-simple-icons/icons/SiGithub';
import { Separator } from '@/app/ui/separator';
import Image from 'next/image';
import {
  SITE_FOOTER_COLUMNS,
  SITE_FOOTER_COMPANY_ITEMS,
  SITE_FOOTER_CONNECT,
  SITE_FOOTER_MAIN,
  SITE_FOOTER_PRODUCT_LINKS,
} from './constants';

type SiteFooterLinkProps = Readonly<{
  href: string;
  label: string;
}>;

function SiteFooterLink({ href, label }: SiteFooterLinkProps) {
  return (
    <Button
      className="h-auto justify-start px-0"
      nativeButton={false}
      render={<Link href={href} />}
      size="sm"
      variant="link"
    >
      {label}
    </Button>
  );
}

export default function SiteFooter() {
  return (
    <footer
      id="footer"
      className="scroll-mt-28 border-t bg-surface py-14 sm:py-16 lg:py-20"
      aria-labelledby="site-footer-heading"
    >
      <div className="layout-page-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
          <Image
            src="/icons/logo.png"
            alt="PlateAI Logo"
            width={200}
            height={100}
          />
            <p className="text-muted-foreground mt-3 max-w-sm text-sm/relaxed">
              {SITE_FOOTER_MAIN.TAGLINE}
            </p>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm/relaxed">
              {SITE_FOOTER_MAIN.SUBLINE}
            </p>
            <p className="text-muted-foreground mt-5 max-w-md border-l-2 border-accent/40 pl-4 text-sm/relaxed">
              {SITE_FOOTER_MAIN.CTA_LINE}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3 lg:gap-8">
            <nav aria-labelledby="site-footer-product-heading">
              <h3
                id="site-footer-product-heading"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                {SITE_FOOTER_COLUMNS.PRODUCT_HEADING}
              </h3>
              <ul className="mt-4 flex flex-col items-start gap-1">
                {SITE_FOOTER_PRODUCT_LINKS.map((item) => (
                  <li key={item.KEY}>
                    <SiteFooterLink href={item.HREF} label={item.LABEL} />
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="site-footer-company-heading">
              <h3
                id="site-footer-company-heading"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                {SITE_FOOTER_COLUMNS.COMPANY_HEADING}
              </h3>
              <ul className="mt-4 flex flex-col items-start gap-1">
                {SITE_FOOTER_COMPANY_ITEMS.map((item) => (
                  <li key={item.KEY}>
                    {item.HREF ? (
                      <SiteFooterLink href={item.HREF} label={item.LABEL} />
                    ) : (
                      <span className="text-muted-foreground inline-flex items-center gap-2 px-0 py-1 text-sm">
                        {item.LABEL}
                        <Badge variant="secondary">{SITE_FOOTER_COLUMNS.SOON}</Badge>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div aria-labelledby="site-footer-connect-heading">
              <h3
                id="site-footer-connect-heading"
                className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
              >
                {SITE_FOOTER_COLUMNS.CONNECT_HEADING}
              </h3>
              <p className="text-muted-foreground mt-4 text-sm/relaxed">
                {SITE_FOOTER_CONNECT.BLURB}
              </p>
              <div className="mt-5 flex flex-col items-start gap-1">
                <Button
                  className="h-auto gap-1.5 px-0"
                  nativeButton={false}
                  render={<a href={SITE_FOOTER_CONNECT.EMAIL_HREF} />}
                  size="sm"
                  variant="link"
                >
                  <Mail data-icon="inline-start" />
                  {SITE_FOOTER_CONNECT.EMAIL_LABEL}
                </Button>
                <Button
                  className="h-auto gap-1.5 px-0"
                  nativeButton={false}
                  render={
                    <a href={SITE_FOOTER_CONNECT.GITHUB_HREF} rel="noreferrer" target="_blank" />
                  }
                  size="sm"
                  variant="link"
                >
                  <span
                    className="inline-flex size-3.5 shrink-0 items-center justify-center"
                    data-icon="inline-start"
                  >
                    <SiGithub className="size-3.5" color="currentColor" title="GitHub" />
                  </span>
                  {SITE_FOOTER_CONNECT.GITHUB_LABEL}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-14 sm:mt-16" />
        <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-muted-foreground text-xs sm:text-sm">{SITE_FOOTER_MAIN.COPYRIGHT}</p>
          <p className="text-muted-foreground max-w-xl text-xs/relaxed sm:text-right sm:text-sm">
            {SITE_FOOTER_MAIN.LEGAL_NOTE}
          </p>
        </div>
      </div>
    </footer>
  );
}
