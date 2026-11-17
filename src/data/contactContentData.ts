import type {
  ContactCategoryOption,
  ContactSupportTopic,
} from '../types/content';
import type { InquiryCategory } from '../types/workspace';
import { SITE_CONFIG } from './siteConfig';

export type { ContactCategoryOption, ContactSupportTopic };

export const CONTACT_PAGE_HEADER = {
  breadcrumbLabel: 'Contact',
  title: 'Contact & Editorial Feedback',
  description:
    'Report PSC question errata, request additional statutory PDFs or syllabus volumes, or share feedback on the PSC Nepal study, simulation, and flipbook workspace.',
} as const;

export const CONTACT_DIRECT_DESK = {
  label: 'Direct Editorial & Support Desk',
  email: SITE_CONFIG.supportEmail,
  copyToastMessage: 'Support email copied to clipboard.',
  sampleCodes: ['PSC-LANG-100', 'PSC-WR-201'] as const,
} as const;

export const CONTACT_CATEGORY_OPTIONS: ContactCategoryOption[] = [
  {
    value: 'quiz-errata',
    label: 'Quiz / Written Q&A Errata',
    placeholder: 'e.g. PSC-LANG-100, PSC-WR-201, or Article reference...',
  },
  {
    value: 'material-request',
    label: 'Reading Material / Syllabus Request',
    placeholder: 'e.g. Local Government Operation Act 2074 PDF...',
  },
  {
    value: 'reader-support',
    label: 'PDF Reader / Flipbook Support',
    placeholder: 'e.g. External PDF CORS link or zoom behavior...',
  },
  {
    value: 'general',
    label: 'General Inquiry & Feedback',
    placeholder: 'Optional document URL or quiz set name...',
  },
];

export function getInquiryCategoryLabel(category: InquiryCategory): string {
  return (
    CONTACT_CATEGORY_OPTIONS.find((opt) => opt.value === category)?.label ??
    'General Inquiry'
  );
}

export const CONTACT_SUPPORT_TOPICS: ReadonlyArray<ContactSupportTopic> = [
  {
    title: 'Question Bank & Statutory Updates',
    description:
      'When Acts, Periodic Plan benchmarks, or PSC curricula are amended, submit the updated citation so we can revise both the reference PDF and linked quiz explanations.',
  },
  {
    title: 'Privacy Notice',
    description:
      'Submitting the form logs your inquiry reference and prepares a direct email dispatch when you choose to send via your mail client.',
  },
];

export const CONTACT_QUICK_LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: '/privacy', label: 'Privacy Policy →' },
  { to: '/terms', label: 'Terms of Service →' },
  { to: '/features', label: 'Reader Guide →' },
];

export const CONTACT_FORM_COPY = {
  heading: 'Submit an Inquiry or Errata Note',
  footerNote: 'Assigns a ticket ID, syncs to your account when signed in, and prepares an optional email copy.',
  submitLabel: 'Submit Inquiry & Prepare Email',
  detailsPlaceholder:
    'Describe the question correction, requested study document, or reader feedback...',
} as const;
