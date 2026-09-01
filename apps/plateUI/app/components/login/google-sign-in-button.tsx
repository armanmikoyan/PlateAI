import SiGoogle from '@icons-pack/react-simple-icons/icons/SiGoogle';
import { LOGIN } from './constants';
import { cn } from '@/app/utils/cn';

type GoogleSignInButtonProps = Readonly<{
  className?: string;
}>;

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  return (
    <a
      href={LOGIN.GOOGLE_HREF}
      className={cn(
        'inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-5 text-base font-medium text-[#1f1f1f] shadow-sm transition-[box-shadow,background-color] hover:bg-[#f8f9fa] hover:shadow-md focus-visible:ring-3 focus-visible:ring-edge-strong/45 focus-visible:outline-none',
        className,
      )}
    >
      <SiGoogle color="default" size={20} title="Google" />
      {LOGIN.GOOGLE_CTA}
    </a>
  );
}
