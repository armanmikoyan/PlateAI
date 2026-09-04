export type PrivacySectionBlock = Readonly<{
  heading: string;
  body: string;
  bodyLink?: Readonly<{
    label: string;
    href: string;
  }>;
}>;

export type PrivacyContent = Readonly<{
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: readonly PrivacySectionBlock[];
}>;
