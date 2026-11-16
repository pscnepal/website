import { SITE_CONFIG } from './siteConfig';

export interface HallRuleItem {
  id: string;
  titleNe: string;
  detailNe: string;
}

export interface OmrScoringRuleCard {
  id: string;
  titleNe: string;
  headlineNe: string;
  descriptionNe: string;
  tone: 'emerald' | 'crimson' | 'zinc';
}

export interface ExamDayChecklistItem {
  id: string;
  label: string;
}

export const CALENDAR_HERO_CONTENT = {
  breadcrumbLabel:
    'PSC Calendar & Official Notices (वार्षिक कार्यतालिका तथा सूचना)',
  badge: `आधिकारिक पदपूर्ति कार्यतालिका ${SITE_CONFIG.academicSessionYear}`,
  headlineNe: 'लोक सेवा आयोग परीक्षा तथा विज्ञापन कार्यतालिका',
  description:
    'Official Nepal PSC annual recruitment timeline, application deadlines, examination routines, hall venue notices, and OMR guidelines for Section Officer, Nayab Subba, and Kharidar.',
} as const;

export const EXAM_HALL_MANDATORY_ITEMS: ReadonlyArray<HallRuleItem> = [
  {
    id: 'admit-card',
    titleNe: 'सक्कल प्रवेशपत्र (Original Admit Card):',
    detailNe:
      'अनलाइन दरखास्त प्रणालीबाट डाउनलोड गरी स्पष्ट फोटो तथा विवरण प्रिन्ट गरिएको।',
  },
  {
    id: 'citizenship',
    titleNe: 'नागरिकता प्रमाणपत्र (Citizenship Card):',
    detailNe:
      'वा नेपाल सरकारबाट जारी भएको सक्कल फोटोसहितको परिचयपत्र (पासपोर्ट/सवारी चालक अनुमतिपत्र/मतदाता परिचयपत्र)।',
  },
  {
    id: 'black-pen',
    titleNe: 'कालो मसी भएको बलपेन (Black Ballpoint Pen):',
    detailNe:
      'OMR सिटमा सिसाकलम (Pencil) वा नीलो/रातो मसी प्रयोग गर्न पाइँदैन।',
  },
  {
    id: 'punctuality',
    titleNe: 'समय पालना:',
    detailNe:
      'परीक्षा सुरु हुनुभन्दा कम्तीमा १ घण्टा अगावै परीक्षा केन्द्रमा अनिवार्य उपस्थित हुनुपर्नेछ। परीक्षा सुरु भएको १५ मिनेटपछि प्रवेश निषेध छ।',
  },
];

export const EXAM_HALL_PROHIBITED_ITEMS: ReadonlyArray<HallRuleItem> = [
  {
    id: 'electronics',
    titleNe: 'मोबाइल फोन तथा इलेक्ट्रोनिक डिभाइस:',
    detailNe:
      'परीक्षा हलभित्र मोबाइल, स्मार्टवाच, ब्लुटुथ, वा कुनै पनि विद्युतीय उपकरण लैजान पूर्ण निषेध छ।',
  },
  {
    id: 'calculator',
    titleNe: 'क्यालकुलेटर (Calculators):',
    detailNe:
      'सामान्य ज्ञान, बौद्धिक परीक्षण (IQ) तथा प्रथम चरणका कुनै पनि वस्तुगत परीक्षामा क्यालकुलेटर निषेध गरिएको छ।',
  },
  {
    id: 'notes',
    titleNe: 'किताब, कापी तथा चिट:',
    detailNe:
      'कुनै पनि प्रकारको कागज, फाराम वा अध्ययन सामग्री हलभित्र लैजान पाइँदैन।',
  },
  {
    id: 'omr-tamper',
    titleNe: 'उत्तरपुस्तिका केरमेट:',
    detailNe:
      'OMR सिटमा दुईवटा घेरा लगाउने, टिपेक्स (Fluid) प्रयोग गर्ने वा ब्लेडले कोर्ने कार्य गरेमा प्रश्न रद्द हुनेछ।',
  },
];

export const OMR_SCORING_RULE_CARDS: ReadonlyArray<OmrScoringRuleCard> = [
  {
    id: 'correct',
    titleNe: 'सहि उत्तर बापत (Correct)',
    headlineNe: '+२ वा +१ अङ्क',
    descriptionNe:
      'अधिकृत प्रथम पत्रमा प्रति प्रश्न २ अङ्क, खरिदारमा प्रति प्रश्न २ अङ्क।',
    tone: 'emerald',
  },
  {
    id: 'wrong',
    titleNe: 'गलत उत्तर बापत (-२०% कट्टा)',
    headlineNe: '-०.४ वा -०.२ अङ्क',
    descriptionNe:
      'प्राप्त कुल प्राप्ताङ्कबाट २० प्रतिशत अङ्क स्वतः कट्टी गरिनेछ।',
    tone: 'crimson',
  },
  {
    id: 'unattempted',
    titleNe: 'खाली छोडेमा (Unattempted)',
    headlineNe: '० अङ्क (शून्य)',
    descriptionNe:
      'शंकास्पद प्रश्न खाली छोड्नु नेगेटिभ मार्किङबाट बच्ने उत्तम रणनीति हो।',
    tone: 'zinc',
  },
];

export const EXAM_DAY_CHECKLIST_ITEMS: ReadonlyArray<ExamDayChecklistItem> = [
  {
    id: 'admit-card',
    label: 'Admit Card Printed (सक्कल प्रवेशपत्र स्पष्ट छापिएको)',
  },
  {
    id: 'citizenship',
    label: 'Original Citizenship Card (सक्कल नागरिकता प्रमाणपत्र)',
  },
  {
    id: 'black-pens',
    label: 'Two Good Black Ballpoint Pens (२ वटा भरपर्दो कालो मसी बलपेन)',
  },
  {
    id: 'venue-checked',
    label: 'Exam Center Location Verified (परीक्षा भवनको सही स्थान यकिन गरिएको)',
  },
  {
    id: 'analog-watch',
    label: 'Standard Simple Analog Watch (सादा घडी, नो स्मार्टवाच)',
  },
  {
    id: 'water-bottle',
    label: 'Clear Transparent Water Bottle (पारदर्शी पानीको बोतल)',
  },
];
