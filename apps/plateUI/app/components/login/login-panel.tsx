import { AlertCircleIcon } from 'lucide-react';

import { GoogleSignInButton } from './google-sign-in-button';
import { LOGIN } from './constants';
import { Alert, AlertDescription } from '@/app/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/ui/card';

type LoginPanelProps = Readonly<{
  error?: string | null;
}>;

export function LoginPanel({ error }: LoginPanelProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
      <Card className="w-full max-w-lg gap-5 py-6 shadow-sm sm:py-8">
        <CardHeader className="items-center gap-2 px-6 text-center sm:px-8">
          <CardTitle className="text-2xl sm:text-3xl">{LOGIN.TITLE}</CardTitle>
          <CardDescription className="text-base sm:text-lg">{LOGIN.SUBTITLE}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6 sm:px-8">
          {error ? (
            <Alert variant="destructive">
              <AlertCircleIcon data-icon="inline-start" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <GoogleSignInButton />
        </CardContent>
        <CardFooter className="justify-center border-t-0 bg-transparent px-6 pt-0 sm:px-8">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">{LOGIN.FOOTER}</p>
        </CardFooter>
      </Card>
    </section>
  );
}
