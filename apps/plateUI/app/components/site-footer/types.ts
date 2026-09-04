export type SiteFooterLinkProps = Readonly<{
  href: string;
  label: string;
}>;

export type SiteFooterProductLinkRow = Readonly<{
  KEY: string;
  LABEL: string;
  HREF: string;
}>;

export type SiteFooterCompanyItemRow = Readonly<{
  KEY: string;
  LABEL: string;
  /** When omitted, the item is shown as “coming soon” (no route yet). */
  HREF?: string;
}>;
