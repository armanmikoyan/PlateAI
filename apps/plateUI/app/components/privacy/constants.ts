import type { PrivacyContent } from './types';

export const PRIVACY_CONTENT: PrivacyContent = {
  eyebrow: 'Legal',
  title: 'Privacy Policy',
  intro:
    'PlateAI is photo-first nutrition logging. This policy explains what we collect, why we collect it, and how we keep your data safe.',
  lastUpdatedLabel: 'Last updated',
  lastUpdated: 'September 4, 2026',
  sections: [
    {
      heading: 'Information we collect',
      body:
        'We collect the information you provide when you create an account and use the service, including your name, email address, and the meal photos and nutrition data you log. We also collect limited technical data needed to operate the service, such as device and usage information.',
    },
    {
      heading: 'How we use your information',
      body:
        'Your information is used to provide and improve the service, authenticate your account, process your nutrition analyses, respond to your messages, and communicate important updates. We do not sell your personal information or your meal data.',
    },
    {
      heading: 'Photos and nutrition data',
      body:
        'Meal photos you capture are used to generate your nutrition estimates. You can delete individually logged meals, and you can contact us to request deletion of your account and its associated data.',
    },
    {
      heading: 'Cookies and similar technologies',
      body:
        'We use cookies and similar technologies to keep you signed in and to remember your preferences so the service works as intended.',
    },
    {
      heading: 'Sharing your information',
      body:
        'We only share your information with service providers needed to run PlateAI, such as payment and email infrastructure, and only to the extent required to provide the service. We never sell your data.',
    },
    {
      heading: 'Data retention and security',
      body:
        'We keep your data only as long as needed to provide the service or as required by law, and we apply reasonable technical and organizational measures to protect it.',
    },
    {
      heading: 'Your rights',
      body:
        'You can request access to, correction, or deletion of your personal data, or ask us to explain how we process it. Send any request through our contact page.',
    },
    {
      heading: 'Changes to this policy',
      body:
        'We may update this policy from time to time. If we make material changes, we will update the "last updated" date above and, where appropriate, notify you.',
    },
    {
      heading: 'Contact us',
      body:
        'Questions about this policy? Reach us through the contact section on our site and we will get back to you within 24 hours.',
      bodyLink: { label: 'Contact us', href: '/#contact' },
    },
  ],
};
