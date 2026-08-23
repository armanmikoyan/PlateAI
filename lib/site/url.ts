export function readSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;

  if (configured) {
    return new URL(configured);
  }

  return new URL('http://localhost:3000');
}
