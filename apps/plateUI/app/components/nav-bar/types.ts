import type { AuthUser } from '@/app/api/auth/types';

export type NavMainSectionLinkRow = Readonly<{
  HREF: string;
  LABEL: string;
  SECTION_ID: string;
}>;

export type NavBarSectionLinksVariant = 'desktop' | 'drawer';

export type NavBarSectionLinksProps = Readonly<{
  onAfterNavigate?: () => void;
  variant: NavBarSectionLinksVariant;
}>;

/** `bar` renders in the top bar at `xl` and up; `drawer` in the sheet footer below it. */
export type NavBarAuthVariant = 'bar' | 'drawer';

export type NavBarAuthProps = Readonly<{
  variant: NavBarAuthVariant;
}>;

export type NavAuthSession = Readonly<{
  PENDING_COUNT: number;
  USER: AuthUser | null;
}>;

export type NavHashClickModifiers = Readonly<{
  META: boolean;
  CTRL: boolean;
  SHIFT: boolean;
  ALT: boolean;
  BUTTON: number;
}>;
