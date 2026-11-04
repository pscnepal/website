import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ALL_SYLLABUS_UNITS,
  getCadreSyllabusById,
  PSC_CADRE_SYLLABI,
} from '../../data/pscSyllabusData';
import { ALL_QUIZ_QUESTIONS, QUIZ_DECKS } from '../../data/quizData';
import { READING_MATERIAL_CATEGORIES } from '../../data/readingMaterials';
import {
  getWrittenQuestionById,
  WRITTEN_QUESTIONS,
} from '../../data/writtenQuestionsData';

const BRAND_NAME = 'PSC Nepal';
const DEFAULT_TITLE = 'PSC Nepal | Lok Sewa Syllabus, Mock Exams & Study Hub';
const DEFAULT_DESCRIPTION =
  'Prepare for Nepal Lok Sewa Aayog exams on PSC Nepal with official syllabi, OMR & written simulations, timed MCQs, bilingual answers, and PDF flipbooks.';
const OG_IMAGE_PATH = '/og-psc-nepal.svg';
const ROUTE_JSONLD_SCRIPT_ID = 'psc-nepal-route-jsonld';

interface ResolvedSeoPayload {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogType: 'website' | 'article';
  jsonLd: Record<string, unknown>;
}

function clampText(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

function upsertMetaByName(name: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${CSS.escape(name)}"]`
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${CSS.escape(property)}"]`
  );
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertRouteJsonLd(payload: Record<string, unknown>): void {
  let script = document.getElementById(
    ROUTE_JSONLD_SCRIPT_ID
  ) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = ROUTE_JSONLD_SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function buildBreadcrumbList(
  origin: string,
  crumbs: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: `${origin}${crumb.path}`,
    })),
  };
}

function resolveRouteSeo(
  pathname: string,
  search: string,
  origin: string
): ResolvedSeoPayload {
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  const searchParams = new URLSearchParams(search);

  // 1. Home Hub (/)
  if (normalizedPath === '/') {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonicalPath: '/',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${origin}/#webpage`,
            url: `${origin}/`,
            name: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            inLanguage: ['en', 'ne'],
            isPartOf: { '@id': `${origin}/#website` },
          },
          {
            '@type': 'FAQPage',
            '@id': `${origin}/#faq`,
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Which Nepal Lok Sewa Aayog syllabi are covered on PSC Nepal?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `PSC Nepal covers the official Public Service Commission (Lok Sewa Aayog) non-technical curricula for Gazetted Class III Section Officer, Non-Gazetted Class I Nayab Subba, and Non-Gazetted Class II Kharidar across ${ALL_SYLLABUS_UNITS.length} structured syllabus units with attached original PSC PDFs.`,
                },
              },
              {
                '@type': 'Question',
                name: 'How are Lok Sewa Paper I objective mock exams scored on PSC Nepal?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Objective OMR simulations enforce official Nepal PSC rules: a strict reverse countdown timer, -20% negative marking deducted per wrong response, and a 45% qualifying pass threshold in Stage I screening.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are written exam model answers available in both English and Nepali?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes. PSC Nepal provides ${WRITTEN_QUESTIONS.length} structured 5-mark and 10-mark written Papers II–IV questions with side-by-side English and नेपाली introductions, analytical bullet points, statutory citations, and conclusions.`,
                },
              },
            ],
          },
        ],
      },
    };
  }

  // 2. Syllabus Hub (/syllabus & /syllabus/:cadreId)
  if (
    normalizedPath === '/syllabus' ||
    normalizedPath.startsWith('/syllabus/')
  ) {
    const rawCadreSlug = normalizedPath.startsWith('/syllabus/')
      ? decodeURIComponent(normalizedPath.slice('/syllabus/'.length))
      : null;
    const matchedCadre = rawCadreSlug
      ? getCadreSyllabusById(rawCadreSlug)
      : null;

    if (matchedCadre) {
      const title = clampText(
        `${matchedCadre.shortTitle} Syllabus (Stage I–III) | ${BRAND_NAME}`,
        60
      );
      const description = clampText(
        `Study the official ${matchedCadre.title} Lok Sewa syllabus on PSC Nepal with Stage I–III paper schemes, chapter briefs, topic checklists, and original PSC PDFs.`,
        158
      );
      const canonicalPath = `/syllabus/${matchedCadre.id}`;

      return {
        title,
        description,
        canonicalPath,
        robots: 'index, follow, max-image-preview:large',
        ogType: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            buildBreadcrumbList(origin, [
              { name: 'Home', path: '/' },
              { name: 'PSC Syllabus', path: '/syllabus' },
              { name: matchedCadre.shortTitle, path: canonicalPath },
            ]),
            {
              '@type': 'Course',
              name: `${matchedCadre.title} — Nepal Lok Sewa Syllabus`,
              alternateName: matchedCadre.nepaliTitle,
              description,
              url: `${origin}${canonicalPath}`,
              inLanguage: ['en', 'ne'],
              isAccessibleForFree: true,
              provider: {
                '@type': 'EducationalOrganization',
                name: BRAND_NAME,
                url: origin,
              },
              educationalLevel: matchedCadre.rankClassification,
              syllabusSections: matchedCadre.phases.map((phase) => ({
                '@type': 'Syllabus',
                name: phase.title,
                description: `${phase.papers.length} examination paper(s) · ${phase.papers
                  .map((p) => `${p.code} (${p.fullMarks}M)`)
                  .join(', ')}`,
              })),
            },
          ],
        },
      };
    }

    const title = `Official Lok Sewa Syllabus & Checklist | ${BRAND_NAME}`;
    const description =
      'Explore detailed Nepal PSC syllabi for Section Officer, Nayab Subba, and Kharidar with chapter briefs, topic checklists, and official Lok Sewa PDFs.';
    return {
      title,
      description,
      canonicalPath: '/syllabus',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'PSC Syllabus', path: '/syllabus' },
          ]),
          {
            '@type': 'ItemList',
            name: 'Nepal Lok Sewa Aayog Official Examination Syllabi',
            description,
            numberOfItems: PSC_CADRE_SYLLABI.length,
            itemListElement: PSC_CADRE_SYLLABI.map((cadre, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              url: `${origin}/syllabus/${cadre.id}`,
              name: `${cadre.title} (${cadre.nepaliTitle})`,
            })),
          },
        ],
      },
    };
  }

  // 3. Exam Hall Simulator (/simulate)
  if (normalizedPath === '/simulate') {
    const mode = searchParams.get('mode');
    const title =
      mode === 'merit-lab'
        ? `PSC Merit Score & Negative Mark Calculator | ${BRAND_NAME}`
        : `Lok Sewa OMR & Written Exam Simulator | ${BRAND_NAME}`;
    const description =
      'Sit realistic Nepal PSC mock exams with digital OMR bubble sheets, -20% negative marking, timed Paper II–IV written halls, and merit score calculators.';

    return {
      title,
      description,
      canonicalPath: '/simulate',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Exam Simulator', path: '/simulate' },
          ]),
          {
            '@type': 'LearningResource',
            name: 'PSC Nepal OMR & Written Examination Hall Simulator',
            description,
            url: `${origin}/simulate`,
            learningResourceType: 'Practice Exam Simulator',
            educationalUse: 'Self Assessment',
            inLanguage: ['en', 'ne'],
            isAccessibleForFree: true,
          },
        ],
      },
    };
  }

  // 4. Study Materials Catalog (/materials & /materials/:categoryId)
  if (
    normalizedPath === '/materials' ||
    normalizedPath.startsWith('/materials/')
  ) {
    const catSlug = normalizedPath.startsWith('/materials/')
      ? decodeURIComponent(normalizedPath.slice('/materials/'.length))
      : null;
    const category = catSlug
      ? READING_MATERIAL_CATEGORIES.find((c) => c.id === catSlug) ?? null
      : null;

    if (category) {
      const title = clampText(`${category.name} PDFs | ${BRAND_NAME}`, 60);
      const description = clampText(
        `${category.description} Read in two-page flipbook or continuous PDF view on PSC Nepal.`,
        158
      );
      const canonicalPath = `/materials/${category.id}`;

      return {
        title,
        description,
        canonicalPath,
        robots: 'index, follow, max-image-preview:large',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            buildBreadcrumbList(origin, [
              { name: 'Home', path: '/' },
              { name: 'Study Materials', path: '/materials' },
              { name: category.name, path: canonicalPath },
            ]),
            {
              '@type': 'CollectionPage',
              name: `${category.name} — PSC Nepal Study Collection`,
              description,
              url: `${origin}${canonicalPath}`,
              inLanguage: ['en', 'ne'],
              hasPart: category.items.map((item) => ({
                '@type': 'DigitalDocument',
                name: item.title,
                description: item.description,
                encodingFormat: 'application/pdf',
                numberOfPages: item.pages,
                url: `${origin}${item.path}`,
              })),
            },
          ],
        },
      };
    }

    const title = `Lok Sewa Study Books, Acts & PDFs | ${BRAND_NAME}`;
    const description =
      'Read Official PSC Syllabi, Nepal Parichaya, Constitution of Nepal 2072, Civil Service Acts, and 16th Plan PDFs in two-page flipbook or scroll mode.';

    return {
      title,
      description,
      canonicalPath: '/materials',
      robots: catSlug
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Study Materials', path: '/materials' },
          ]),
          {
            '@type': 'CollectionPage',
            name: 'PSC Nepal Curated Study Books, Official Syllabi & Statutes',
            description,
            url: `${origin}/materials`,
            inLanguage: ['en', 'ne'],
          },
        ],
      },
    };
  }

  // 5. Objective Quiz Hub (/quiz & /quiz/:deckId)
  if (normalizedPath === '/quiz' || normalizedPath.startsWith('/quiz/')) {
    const deckSlug = normalizedPath.startsWith('/quiz/')
      ? decodeURIComponent(normalizedPath.slice('/quiz/'.length))
      : null;
    const matchedDeck =
      deckSlug && deckSlug !== 'custom'
        ? QUIZ_DECKS.find((d) => d.id === deckSlug) ?? null
        : null;

    if (matchedDeck) {
      const title = clampText(`${matchedDeck.title} | ${BRAND_NAME}`, 60);
      const description = clampText(
        `${matchedDeck.description} Practice ${matchedDeck.questions.length} timed Lok Sewa MCQs with -20% negative marking on PSC Nepal.`,
        158
      );
      const canonicalPath = `/quiz/${matchedDeck.id}`;

      return {
        title,
        description,
        canonicalPath,
        robots: 'index, follow, max-image-preview:large',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            buildBreadcrumbList(origin, [
              { name: 'Home', path: '/' },
              { name: 'Objective Quiz', path: '/quiz' },
              { name: matchedDeck.title, path: canonicalPath },
            ]),
            {
              '@type': 'Quiz',
              name: matchedDeck.title,
              description,
              url: `${origin}${canonicalPath}`,
              inLanguage: ['en', 'ne'],
              isAccessibleForFree: true,
              numberOfQuestions: matchedDeck.questions.length,
            },
          ],
        },
      };
    }

    const title = `Lok Sewa Objective MCQ Quizzes & Bank | ${BRAND_NAME}`;
    const description =
      'Practice Nepal PSC Paper I objective MCQs by subject, topic, subtopic, and difficulty with 1-minute countdown timers and -20% negative marking.';

    return {
      title,
      description,
      canonicalPath: '/quiz',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Objective Quiz', path: '/quiz' },
          ]),
          {
            '@type': 'Quiz',
            name: 'PSC Nepal Master Objective MCQ Question Bank',
            description,
            url: `${origin}/quiz`,
            inLanguage: ['en', 'ne'],
            isAccessibleForFree: true,
            numberOfQuestions: ALL_QUIZ_QUESTIONS.length,
          },
        ],
      },
    };
  }

  // 6. Bilingual Written Q&A Studio (/written & /written/:questionId)
  if (normalizedPath === '/written' || normalizedPath.startsWith('/written/')) {
    const qSlug = normalizedPath.startsWith('/written/')
      ? decodeURIComponent(normalizedPath.slice('/written/'.length))
      : null;
    const matchedQuestion = qSlug ? getWrittenQuestionById(qSlug) : undefined;

    if (matchedQuestion) {
      const title = clampText(
        `${matchedQuestion.en.title} (${matchedQuestion.marks}M) | ${BRAND_NAME}`,
        60
      );
      const description = clampText(
        `Bilingual English & नेपाली Lok Sewa model answer (${matchedQuestion.marks} marks, ${matchedQuestion.paper}): ${matchedQuestion.en.question}`,
        158
      );
      const canonicalPath = `/written/${matchedQuestion.id}`;

      return {
        title,
        description,
        canonicalPath,
        robots: 'index, follow, max-image-preview:large',
        ogType: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            buildBreadcrumbList(origin, [
              { name: 'Home', path: '/' },
              { name: 'Written Q&A', path: '/written' },
              { name: matchedQuestion.id, path: canonicalPath },
            ]),
            {
              '@type': 'QAPage',
              url: `${origin}${canonicalPath}`,
              name: `${matchedQuestion.id}: ${matchedQuestion.en.title}`,
              inLanguage: ['en', 'ne'],
              mainEntity: {
                '@type': 'Question',
                name: matchedQuestion.en.question,
                text: `${matchedQuestion.en.question} / ${matchedQuestion.ne.question}`,
                answerCount: 1,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `${matchedQuestion.en.introduction} ${matchedQuestion.en.conclusion}`,
                },
              },
            },
          ],
        },
      };
    }

    const title = `Bilingual Written Q&A (EN & नेपाली) | ${BRAND_NAME}`;
    const description =
      'Practice 5 and 10-mark Lok Sewa Papers II–IV analytical questions and case studies with structured model answers in both English and नेपाली.';

    return {
      title,
      description,
      canonicalPath: '/written',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Written Q&A', path: '/written' },
          ]),
          {
            '@type': 'CollectionPage',
            name: 'PSC Nepal Bilingual Written Answer Bank (English & नेपाली)',
            description,
            url: `${origin}/written`,
            inLanguage: ['en', 'ne'],
          },
        ],
      },
    };
  }

  // 7. Study & Exam Readiness Tracker (/progress)
  if (normalizedPath === '/progress') {
    const title = `PSC Study & Exam Readiness Tracker | ${BRAND_NAME}`;
    const description =
      'Audit your Lok Sewa preparation progress across syllabus units, PDF reading coverage, MCQ accuracy, written rubrics, and simulated hall sittings.';
    return {
      title,
      description,
      canonicalPath: '/progress',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Progress Tracker', path: '/progress' },
          ]),
          {
            '@type': 'WebPage',
            name: title,
            description,
            url: `${origin}/progress`,
          },
        ],
      },
    };
  }

  // 8. Personal Library (/library)
  if (normalizedPath === '/library') {
    const title = `Personal PDF Study Library & Shelf | ${BRAND_NAME}`;
    const description =
      'Resume recently opened Lok Sewa PDF books, acts, and local handouts from your saved page with per-document reading time and pace analytics.';
    return {
      title,
      description,
      canonicalPath: '/library',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Personal Library', path: '/library' },
          ]),
          {
            '@type': 'CollectionPage',
            name: title,
            description,
            url: `${origin}/library`,
          },
        ],
      },
    };
  }

  // 9. Reader Features & Shortcuts (/features)
  if (normalizedPath === '/features') {
    const title = `PDF Flipbook Reader Guide & Shortcuts | ${BRAND_NAME}`;
    const description =
      'Explore PSC Nepal’s two-page PDF flipbook reader, continuous HiDPI viewer, paper acoustics, reading pace tracker, and single-key shortcuts.';
    return {
      title,
      description,
      canonicalPath: '/features',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Features & Shortcuts', path: '/features' },
          ]),
          {
            '@type': 'WebPage',
            name: title,
            description,
            url: `${origin}/features`,
          },
        ],
      },
    };
  }

  // 10. PDF Flipbook Reader (/read)
  if (normalizedPath === '/read') {
    const rawUrl = searchParams.get('url');
    const matchedDoc = rawUrl
      ? READING_MATERIAL_CATEGORIES.flatMap((c) => c.items).find((item) =>
          rawUrl.endsWith(item.path)
        )
      : undefined;

    const title = matchedDoc
      ? clampText(`${matchedDoc.title} | ${BRAND_NAME}`, 60)
      : `Two-Page PDF Flipbook & Document Reader | ${BRAND_NAME}`;
    const description = matchedDoc
      ? clampText(
          `Read ${matchedDoc.title} (${matchedDoc.pages} pages) in two-page flipbook or continuous HiDPI PDF mode on PSC Nepal.`,
          158
        )
      : 'Read Nepal PSC statutes, official syllabi, and custom PDF handouts in realistic two-page flipbook spreads or continuous HiDPI scroll mode.';

    return {
      title,
      description,
      canonicalPath: '/read',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'PDF Reader', path: '/read' },
          ]),
          {
            '@type': 'WebPage',
            name: title,
            description,
            url: `${origin}/read`,
          },
        ],
      },
    };
  }

  // 11. Contact & Errata (/contact)
  if (normalizedPath === '/contact') {
    const title = `Contact & PSC Question Errata Desk | ${BRAND_NAME}`;
    const description =
      'Report Lok Sewa quiz or written Q&A errata, request statutory PDFs or syllabus updates, and share feedback with the PSC Nepal editorial desk.';
    return {
      title,
      description,
      canonicalPath: '/contact',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@type': 'ContactPage',
            name: title,
            description,
            url: `${origin}/contact`,
          },
        ],
      },
    };
  }

  // 12. Privacy Policy (/privacy)
  if (normalizedPath === '/privacy') {
    const title = `Privacy Policy & Local Data Controls | ${BRAND_NAME}`;
    const description =
      'Review PSC Nepal’s local-first privacy architecture. All PDFs, reading progress, and exam scores stay in your browser with zero server uploads.';
    return {
      title,
      description,
      canonicalPath: '/privacy',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
          {
            '@type': 'WebPage',
            name: title,
            description,
            url: `${origin}/privacy`,
          },
        ],
      },
    };
  }

  // 13. Terms of Service (/terms)
  if (normalizedPath === '/terms') {
    const title = `Terms of Service & Study Disclaimer | ${BRAND_NAME}`;
    const description =
      'Read the Terms of Service and independent educational disclaimer for PSC Nepal’s Lok Sewa syllabus tracker, mock exams, and PDF flipbook reader.';
    return {
      title,
      description,
      canonicalPath: '/terms',
      robots: 'index, follow, max-image-preview:large',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          buildBreadcrumbList(origin, [
            { name: 'Home', path: '/' },
            { name: 'Terms of Service', path: '/terms' },
          ]),
          {
            '@type': 'WebPage',
            name: title,
            description,
            url: `${origin}/terms`,
          },
        ],
      },
    };
  }

  // 14. Fallback 404 Not Found
  return {
    title: `Page Not Found (404) | ${BRAND_NAME}`,
    description:
      'The requested page or study collection could not be found on PSC Nepal. Return to the main hub or browse curated Lok Sewa study materials.',
    canonicalPath: normalizedPath,
    robots: 'noindex, nofollow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Page Not Found (404) | ${BRAND_NAME}`,
      url: `${origin}${normalizedPath}`,
    },
  };
}

export function SeoManager() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const origin = window.location.origin;
    const seo = resolveRouteSeo(pathname, search, origin);
    const canonicalUrl = `${origin}${seo.canonicalPath}`;
    const ogImageUrl = `${origin}${OG_IMAGE_PATH}`;

    document.title = seo.title;

    upsertMetaByName('description', seo.description);
    upsertMetaByName('robots', seo.robots);
    upsertMetaByName('application-name', BRAND_NAME);

    upsertMetaByProperty('og:site_name', BRAND_NAME);
    upsertMetaByProperty('og:type', seo.ogType);
    upsertMetaByProperty('og:title', seo.title);
    upsertMetaByProperty('og:description', seo.description);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', ogImageUrl);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', seo.title);
    upsertMetaByName('twitter:description', seo.description);
    upsertMetaByName('twitter:image', ogImageUrl);

    upsertCanonicalLink(canonicalUrl);
    upsertRouteJsonLd(seo.jsonLd);
  }, [pathname, search]);

  return null;
}
