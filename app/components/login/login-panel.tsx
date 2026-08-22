import Link from 'next/link';
import { LOGIN } from './constants';
import { Button } from '@/app/ui/button';

type LoginPanelProps = Readonly<{
  error?: string | null;
}>;

export function LoginPanel({ error }: LoginPanelProps) {
  return (
    <section className="border-edge/60 flex flex-1 flex-col border-b bg-canvas py-8 sm:py-10 lg:py-12">
      <div className="layout-page-shell flex max-w-lg flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-content text-3xl font-medium tracking-tight sm:text-4xl">{LOGIN.TITLE}</h1>
          <p className="text-content-muted text-base sm:text-lg">{LOGIN.SUBTITLE}</p>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <Button render={<Link href={LOGIN.GOOGLE_HREF} />} nativeButton={false} className="w-fit">
          {LOGIN.CTA}
        </Button>
      </div>
    </section>
  );
}
