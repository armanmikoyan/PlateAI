import type { SiteFooterCompanyItemRow, SiteFooterProductLinkRow } from './types';

export const SITE_FOOTER_MAIN = {
  BRAND: 'PlateAI',
  TAGLINE: 'Photo-first logging that keeps pace with your day.',
  SUBLINE: 'Estimates, day context, and lists—without living in a spreadsheet.',
  CTA_LINE:
    'Public accounts are on the way. Until then, this page is a living preview of the product.',
  COPYRIGHT: '© 2026 PlateAI. All rights reserved.',
  LEGAL_NOTE:
    'Nutrition and health information is for general wellness only and is not medical advice. Consult a clinician for personal guidance.',
} as const;

export const SITE_FOOTER_COLUMNS = {
  PRODUCT_HEADING: 'Product',
  COMPANY_HEADING: 'Company',
  CONNECT_HEADING: 'Connect',
  SOON: 'soon',
} as const;

export const SITE_FOOTER_PRODUCT_LINKS: readonly SiteFooterProductLinkRow[] = [
  { KEY: 'snap', LABEL: 'Snap a plate', HREF: '/snap' },
  { KEY: 'how', LABEL: 'How it works', HREF: '/#how-it-works' },
  { KEY: 'features', LABEL: 'Features', HREF: '/#features' },
  { KEY: 'use-cases', LABEL: 'Use cases', HREF: '/#use-cases' },
  { KEY: 'feedback', LABEL: 'Wall of love', HREF: '/#feedback' },
  { KEY: 'pricing', LABEL: 'Pricing', HREF: '/pricing' },
  { KEY: 'faq', LABEL: 'FAQ', HREF: '/#faq' },
] as const;

export const SITE_FOOTER_COMPANY_ITEMS: readonly SiteFooterCompanyItemRow[] = [
  { KEY: 'privacy', LABEL: 'Privacy policy', HREF: '/privacy-policy' },
  { KEY: 'terms', LABEL: 'Terms of use', HREF: '/terms' },
] as const;

export const SITE_FOOTER_CONNECT = {
  BLURB:
    'Release notes, tips, and product teasers will land on our social channels when the beta opens—watch this space.',
  EMAIL_LABEL: 'Email the team',
  EMAIL_HREF: '/#contact',
  GITHUB_LABEL: 'GitHub',
  GITHUB_HREF: 'https://github.com/armanmikoyan/MealAI',
} as const;
