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

export type NavHashClickModifiers = Readonly<{
  META: boolean;
  CTRL: boolean;
  SHIFT: boolean;
  ALT: boolean;
  BUTTON: number;
}>;
