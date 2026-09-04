export type TermsSectionBlock = Readonly<{
  heading: string;
  body: string;
  bodyLink?: Readonly<{
    label: string;
    href: string;
  }>;
}>;

export type TermsContent = Readonly<{
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: readonly TermsSectionBlock[];
}>;
