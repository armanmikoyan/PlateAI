export function readLoginRedirectPath(next: string | undefined): string {
  if (next?.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  return '/snap';
}
