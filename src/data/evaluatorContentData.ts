export type RubricDimensionKey =
  | 'intro'
  | 'core'
  | 'statutes'
  | 'conclusion';

export interface WrittenRubricDimensionConfig {
  id: RubricDimensionKey;
  orderNe: string;
  titleNe: string;
  titleEn: string;
  shortTitleNe: string;
  weightPercentNe: string;
  weightPercent: number;
  descriptionNe: string;
  guideSummaryNe: string;
  max10M: number;
  max5M: number;
  tierLabels: readonly [string, string, string];
}

export interface WrittenMeritTier {
  minPct: number;
  labelNe: string;
  labelEn: string;
  color: 'emerald' | 'blue' | 'amber' | 'crimson';
}

export const EVALUATOR_HERO_CONTENT = {
  breadcrumbLabel:
    'Answer Evaluator & Rubric Scorer (उत्तर लेखन स्व-मूल्याङ्कन)',
  badge: 'Official 1.8 Min/Mark Rubric Engine',
  headlineNe: 'उत्तर लेखन स्व-मूल्याङ्कन तथा रुब्रिक स्कोरर',
  description:
    'Draft subjective answers under authentic exam hall countdowns (9 mins for 5M, 18 mins for 10M), grade against official Lok Sewa 4-dimensional rubrics, and benchmark against top rankers.',
  quickMetrics: [
    { label: 'Standard Time Pacing', value: '१.८ मिनेट / अङ्क', tone: 'amber' },
    { label: 'Evaluation Dimensions', value: '४ अनिवार्य खण्डहरू', tone: 'white' },
    { label: 'Target Word Density', value: '१४०–१५० शब्द / पृष्ठ', tone: 'blue' },
  ] as const,
} as const;

export const WRITTEN_RUBRIC_DIMENSIONS: ReadonlyArray<WrittenRubricDimensionConfig> =
  [
    {
      id: 'intro',
      orderNe: '१',
      titleNe: 'परिचय तथा अवधारणागत स्पष्टता',
      titleEn: 'Introduction & Framing',
      shortTitleNe: '१. परिचय (१५%)',
      weightPercentNe: '१५%',
      weightPercent: 15,
      descriptionNe: 'विषयवस्तुको छोटो परिभाषा, पृष्ठभूमि, र स्पष्ट थालनी (भार: १५%)',
      guideSummaryNe:
        'विषयवस्तुको शाब्दिक अर्थ, अवधारणा, नेपालको सन्दर्भमा सान्दर्भिकता र स्पष्ट सुरुवात (३-४ वाक्य)।',
      max10M: 1.5,
      max5M: 0.75,
      tierLabels: [
        'कमजोर (अस्पष्ट परिभाषा)',
        'मध्यम (साधारण परिचय)',
        'उत्कृष्ट (स्पष्ट, सटिक र प्रभावकारी)',
      ],
    },
    {
      id: 'core',
      orderNe: '२',
      titleNe: 'मुख्य विषयवस्तुको बुँदागत विश्लेषण',
      titleEn: 'Core Arguments & Depth',
      shortTitleNe: '२. मुख्य विश्लेषण (५५%)',
      weightPercentNe: '५५%',
      weightPercent: 55,
      descriptionNe:
        'बोल्ड शीर्षक, स्पष्ट तर्क, सकारात्मक/नकारात्मक पक्ष र प्रस्तुति (भार: ५५%)',
      guideSummaryNe:
        'प्रश्नको माग अनुसार उपशीर्षक, सकारात्मक/नकारात्मक पक्ष, समस्याका कारण, बुँदागत स्पष्टता वा तुलनात्मक तालिका।',
      max10M: 5.5,
      max5M: 2.75,
      tierLabels: [
        'सतही बुँदाहरू',
        'सन्तोषजनक तर्क र बुँदाहरू',
        'गहन विश्लेषण, तालिका वा संरचना',
      ],
    },
    {
      id: 'statutes',
      orderNe: '३',
      titleNe: 'संवैधानिक तथा कानुनी आधार',
      titleEn: 'Statutory & Legal Citations',
      shortTitleNe: '३. कानुनी आधार (१५%)',
      weightPercentNe: '१५%',
      weightPercent: 15,
      descriptionNe:
        'संविधानका धारा, सम्बन्धित ऐन, नियम, तथा नीतिगत व्यवस्थाहरूको उल्लेख (भार: १५%)',
      guideSummaryNe:
        'नेपालको संविधानका सम्बन्धित धाराहरू, आवधिक योजना, सम्बन्धित ऐन तथा नियमावलीको सटिक उद्धरण।',
      max10M: 1.5,
      max5M: 0.75,
      tierLabels: [
        'कानुनी उल्लेख नभएको',
        'सामान्य ऐनको नाम मात्र',
        'सटिक धारा, दफा र नीतिको उद्धरण',
      ],
    },
    {
      id: 'conclusion',
      orderNe: '४',
      titleNe: 'सन्तुलित निष्कर्ष तथा भावी मार्गचित्र',
      titleEn: 'Forward-Looking Conclusion',
      shortTitleNe: '४. निष्कर्ष (१५%)',
      weightPercentNe: '१५%',
      weightPercent: 15,
      descriptionNe:
        'समस्याको व्यावहारिक समाधान र सकारात्मक भावी कार्यदिशा (भार: १५%)',
      guideSummaryNe:
        'समस्या समाधानका व्यावहारिक उपाय, सकारात्मक सन्देश र दूरदर्शी प्रशासनिक दृष्टिकोण सहितको टुंग्याउनी।',
      max10M: 1.5,
      max5M: 0.75,
      tierLabels: [
        'निष्कर्ष नभएको वा दोहोरो',
        'सामान्य निष्कर्ष',
        'सकारात्मक, दूरदर्शी र व्यावहारिक मार्गचित्र',
      ],
    },
  ];

export const WRITTEN_MERIT_TIERS: ReadonlyArray<WrittenMeritTier> = [
  {
    minPct: 75,
    labelNe: 'टपर / उत्कृष्ट मेरिट स्तर (Merit Ranker Level)',
    labelEn: 'Topper / Outstanding Competitive Grade',
    color: 'emerald',
  },
  {
    minPct: 60,
    labelNe: 'प्रतिस्पर्धात्मक उत्तीर्ण (Competitive Pass)',
    labelEn: 'Competitive Passing Tier',
    color: 'blue',
  },
  {
    minPct: 45,
    labelNe: 'सामान्य उत्तीर्ण स्तर (Average Qualifying)',
    labelEn: 'Average Qualifying Tier',
    color: 'amber',
  },
  {
    minPct: 0,
    labelNe: 'सुधार आवश्यक (Needs Remediation)',
    labelEn: 'Below Qualifying Threshold',
    color: 'crimson',
  },
];

export function getWrittenMeritLevel(pct: number): WrittenMeritTier {
  return (
    WRITTEN_MERIT_TIERS.find((tier) => pct >= tier.minPct) ??
    WRITTEN_MERIT_TIERS[WRITTEN_MERIT_TIERS.length - 1]
  );
}

export const EVALUATOR_PRESET_RATIOS = [
  { label: 'Topper (80%)', ratio: 0.8, tone: 'emerald' },
  { label: 'Pass (65%)', ratio: 0.65, tone: 'blue' },
  { label: 'Average (50%)', ratio: 0.5, tone: 'amber' },
] as const;

export const EVALUATOR_DRAFT_PLACEHOLDERS = {
  authenticated:
    'यहाँ आफ्नो उत्तर टाइप गर्नुहोस् (Type your answer here in Nepali or English)...\n\n१. परिचय / अवधारणा (Introduction)\n२. मुख्य विषयवस्तु र बुँदागत विश्लेषण (Core Analytical Arguments)\n३. कानुनी तथा नीतिगत व्यवस्थाहरू (Statutory Provisions)\n४. निष्कर्ष तथा भावी कार्यदिशा (Balanced Conclusion)',
  guest:
    'Sign in with Google above (or tap here) to unlock timed answer writing & rubric evaluation...',
} as const;

export const EVALUATOR_AUTH_GATE_CONTENT = {
  description:
    'All written prompts, marking criteria, and past model guides are free to browse. Sign in with Google to write timed answers and score your attempts on the official rubric.',
  benefits: [
    'Unlocks timed answer drafting with the 1.8 min/mark exam clock',
    'Enables 4-dimensional Lok Sewa rubric self-evaluation & scorecards',
  ],
  actionLabel: 'Continue with Google to Write',
} as const;
