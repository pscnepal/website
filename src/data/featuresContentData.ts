import {
  BarChart3,
  BookOpen,
  Columns2,
  Maximize2,
  Sliders,
  Volume2,
} from 'lucide-react';
import type { ReaderFeatureItem, ReaderShortcutItem } from '../types/content';

export type { ReaderFeatureItem, ReaderShortcutItem };

export const FEATURES_PAGE_HEADER = {
  breadcrumbLabel: 'Features & Shortcuts',
  headline: 'Built for unhurried reading and technical inspection alike.',
  lead: 'PSC Nepal combines the quiet poise of a printed statute volume with the responsive precision of PDF.js vector rendering.',
} as const;

export const READER_FEATURE_ITEMS: ReadonlyArray<ReaderFeatureItem> = [
  {
    index: '01.',
    title: 'Realistic Two-Page Flipbook',
    description:
      'Turn actual PDF pages with tactile corner folding, natural spine shading, two-page desktop spreads, and single-page portrait framing on mobile.',
    icon: BookOpen,
  },
  {
    index: '02.',
    title: 'Precision Document Viewer',
    description:
      'Switch effortlessly to continuous vertical scrolling or single-page inspection with HiDPI canvas clarity, fit-to-width, and fit-to-page scaling.',
    icon: Columns2,
  },
  {
    index: '03.',
    title: 'Gentle Paper Acoustics',
    description:
      'Experience a delicate, feather-light paper-turn sound effect in flipbook mode that can be toggled on or muted anytime from the toolbar.',
    icon: Volume2,
  },
  {
    index: '04.',
    title: 'Spatial Page Thumbnails',
    description:
      'Scan visual silhouettes of long statutes and official PSC syllabi in a collapsible thumbnail rail with lazy low-resolution previews and instant page jumps.',
    icon: Sliders,
  },
  {
    index: '05.',
    title: 'Per-Book Reading Analytics',
    description:
      'Track active reading duration, unique pages covered, and live pages-per-minute pace stored individually for every PDF document.',
    icon: BarChart3,
  },
  {
    index: '06.',
    title: 'Distraction-Free Fullscreen & Themes',
    description:
      'Expand any book across your entire display in balanced light or dark reading themes while automatically saving your last-read page.',
    icon: Maximize2,
  },
];

export const READER_SHORTCUTS_INTRO = {
  title: 'Keyboard Shortcuts Reference',
  description:
    'Every core reader action responds to single-key shortcuts whenever you are inside the reading workspace without touching the mouse.',
  dialogTitle: 'Keyboard Shortcuts',
  dialogSubtitle: 'Active whenever the reader workspace is focused.',
} as const;

export const READER_SHORTCUT_ITEMS: ReadonlyArray<ReaderShortcutItem> = [
  {
    id: 'prev-page',
    keys: '←',
    dialogKey: '←',
    action: 'Previous page or spread',
    dialogDescription: 'Previous page or spread',
    showInGuide: false,
    showInDialog: true,
  },
  {
    id: 'next-page',
    keys: '→',
    dialogKey: '→',
    action: 'Next page or spread',
    dialogDescription: 'Next page or spread',
    showInGuide: false,
    showInDialog: true,
  },
  {
    id: 'nav-arrows',
    keys: '← / →',
    dialogKey: '← / →',
    action: 'Previous or next page',
    dialogDescription: 'Previous or next page',
    showInGuide: true,
    showInDialog: false,
  },
  {
    id: 'page-up-down',
    keys: 'PgUp / PgDn',
    dialogKey: 'PgUp / PgDn',
    action: 'Step backward or forward',
    dialogDescription: 'Step backward or forward',
    showInGuide: true,
    showInDialog: false,
  },
  {
    id: 'zoom-in-out-guide',
    keys: '+ / -',
    dialogKey: '+ / -',
    action: 'Zoom in or zoom out',
    dialogDescription: 'Zoom in or zoom out',
    showInGuide: true,
    showInDialog: false,
  },
  {
    id: 'zoom-in',
    keys: '+ or =',
    dialogKey: '+ or =',
    action: 'Zoom in',
    dialogDescription: 'Zoom in',
    showInGuide: false,
    showInDialog: true,
  },
  {
    id: 'zoom-out',
    keys: '-',
    dialogKey: '-',
    action: 'Zoom out',
    dialogDescription: 'Zoom out',
    showInGuide: false,
    showInDialog: true,
  },
  {
    id: 'fit-page',
    keys: '0',
    dialogKey: '0',
    action: 'Fit page to viewport',
    dialogDescription: 'Fit page to screen',
    showInGuide: true,
    showInDialog: true,
  },
  {
    id: 'switch-mode',
    keys: 'M',
    dialogKey: 'M',
    action: 'Switch Standard / Flipbook',
    dialogDescription: 'Switch between Flipbook and Standard PDF',
    showInGuide: true,
    showInDialog: true,
  },
  {
    id: 'fullscreen',
    keys: 'F',
    dialogKey: 'F',
    action: 'Toggle fullscreen reading',
    dialogDescription: 'Toggle fullscreen reading',
    showInGuide: true,
    showInDialog: true,
  },
  {
    id: 'sound',
    keys: 'S',
    dialogKey: 'S',
    action: 'Toggle page-turn sound',
    dialogDescription: 'Toggle page-turning sound',
    showInGuide: true,
    showInDialog: true,
  },
  {
    id: 'stats',
    keys: 'I',
    dialogKey: 'I',
    action: 'Open Reading Stats panel',
    dialogDescription: 'Open or close Reading Stats',
    showInGuide: true,
    showInDialog: true,
  },
  {
    id: 'escape',
    keys: 'Esc',
    dialogKey: 'Esc',
    action: 'Close active dialog or panel',
    dialogDescription: 'Exit fullscreen or close active panel',
    showInGuide: true,
    showInDialog: true,
  },
];

export const FEATURES_CALLOUT_CONTENT = {
  title: 'Ready to start reading?',
  description:
    'Open one of the curated reading materials or paste any direct PDF URL on the home screen.',
  primaryCtaLabel: 'Browse Books & Materials',
  primaryCtaTo: '/materials',
  secondaryCtaLabel: 'Open Reader Workspace',
  secondaryCtaTo: '/read',
} as const;
