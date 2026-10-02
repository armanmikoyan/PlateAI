'use client';

import SiGoogle from '@icons-pack/react-simple-icons/icons/SiGoogle';
import { LOGIN } from './constants';
import { cn } from '@/app/utils/cn';
import { trackLogin } from '@/app/utils/analytics';

type GoogleSignInButtonProps = Readonly<{
  className?: string;
}>;

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  return (
    <a
      href={LOGIN.GOOGLE_HREF}
      onClick={() => trackLogin('google')}
      className={cn(
        'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-5 text-base font-medium text-[#1f1f1f] shadow-sm hover:bg-[#f8f9fa] hover:shadow-md focus-visible:ring-3 focus-visible:ring-edge-strong/45 focus-visible:outline-none motion-safe:transition-[transform,box-shadow,background-color] motion-safe:duration-150 motion-safe:ease-out motion-safe:active:scale-[0.98] motion-reduce:transition-none',
        className,
      )}
    >
      <SiGoogle color="default" size={20} title="Google" />
      {LOGIN.GOOGLE_CTA}
    </a>
  );
}
