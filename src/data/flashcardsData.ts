/**
 * Interactive Spaced Repetition Flashcards (स्मरण कार्ड) for PSC Nepal
 * Leitner System for rapid memorization of Constitution of Nepal,
 * Geographic statistics, Economic milestones, and Historical dates.
 */

export type FlashcardDeckId =
  | 'constitution-rights'
  | 'constitutional-organs'
  | 'geography-belts'
  | 'history-treaties'
  | 'economy-16th-plan'
  | 'international-affairs';

export interface FlashcardItem {
  id: string;
  deckId: FlashcardDeckId;
  deckNameNe: string;
  deckNameEn: string;
  frontNe: string;
  frontEn: string;
  backNe: string;
  backEn: string;
  mnemonicTipNe?: string;
  examContext: string;
  cadreRelevance: Array<'section-officer' | 'nayab-subba' | 'kharidar'>;
  defaultDifficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardDeck {
  id: FlashcardDeckId;
  nameNe: string;
  nameEn: string;
  descriptionNe: string;
  descriptionEn: string;
  totalCards: number;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'crimson';
}

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'constitution-rights',
    nameNe: 'मौलिक हक (धारा १६ देखि ४६ सम्म)',
    nameEn: 'Fundamental Rights (Articles 16–46)',
    descriptionNe: 'संविधानको भाग ३ मा रहेका ३१ वटा मौलिक हकहरूको धारा, शीर्षक र प्रमुख उपधाराहरू।',
    descriptionEn: '31 Fundamental rights, article numbers, and statutory sub-clauses under Part 3 of the Constitution of Nepal.',
    totalCards: 12,
    badgeColor: 'blue',
  },
  {
    id: 'constitutional-organs',
    nameNe: 'संवैधानिक निकाय तथा अङ्गहरू',
    nameEn: 'Constitutional Bodies & Commissions',
    descriptionNe: 'अख्तियार, महालेखापरीक्षक, लोक सेवा आयोग, निर्वाचन आयोग र राष्ट्रिय मानव अधिकार आयोग।',
    descriptionEn: 'Tenure, qualification, composition, and functions of constitutional commissions.',
    totalCards: 8,
    badgeColor: 'purple',
  },
  {
    id: 'geography-belts',
    nameNe: 'नेपालको भूगोल, नदी तथा निकुञ्ज',
    nameEn: 'Nepal Geography, Rivers & Parks',
    descriptionNe: 'क्षेत्रफल, सिमाना, हिमशृङ्खला, नदी प्रणाली, ताल, भञ्ज्याङ र संरक्षित क्षेत्रहरू।',
    descriptionEn: 'Area, boundaries, river basins, mountain peaks, passes, and national parks.',
    totalCards: 10,
    badgeColor: 'emerald',
  },
  {
    id: 'history-treaties',
    nameNe: 'इतिहास, सन्धि-सम्झौता तथा मिति',
    nameEn: 'History, Treaties & Key Dates',
    descriptionNe: 'सुगौली सन्धि, विसं २००७, २०४६, २०६२/६३ का आन्दोलन र मुख्य ऐतिहासिक कोसेढुङ्गाहरू।',
    descriptionEn: 'Sugauli Treaty, 1950 revolution, 2062/63 Jana Andolan, and constitutional evolution.',
    totalCards: 8,
    badgeColor: 'amber',
  },
  {
    id: 'economy-16th-plan',
    nameNe: 'अर्थतन्त्र, बजेट र १६ औँ योजना लक्ष्य',
    nameEn: 'Economy, Budget & 16th Plan Targets',
    descriptionNe: 'आर्थिक परिसूचक, प्रतिव्यक्ति आय, गरिबी दर, मुद्रास्फीति र १६ औँ योजनाका राष्ट्रिय लक्ष्यहरू।',
    descriptionEn: 'Macroeconomic indicators, per capita income, poverty rates, and periodic plan metrics.',
    totalCards: 8,
    badgeColor: 'crimson',
  },
  {
    id: 'international-affairs',
    nameNe: 'अन्तर्राष्ट्रिय सम्बन्ध र संस्था',
    nameEn: 'International Organizations & Summits',
    descriptionNe: 'संयुक्त राष्ट्रसंघ (UN), सार्क (SAARC), बिमस्टेक (BIMSTEC) र विश्व व्यापार संगठन (WTO)।',
    descriptionEn: 'UN organs, SAARC & BIMSTEC summits, secretariats, and multilateral treaties.',
    totalCards: 8,
    badgeColor: 'blue',
  },
];

export const FLASHCARD_ITEMS: FlashcardItem[] = [
  // 1. Constitution: Fundamental Rights
  {
    id: 'fc-cr-01',
    deckId: 'constitution-rights',
    deckNameNe: 'मौलिक हक',
    deckNameEn: 'Fundamental Rights',
    frontNe: 'नेपालको संविधानको धारा १६ मा कुन मौलिक हकको व्यवस्था छ?',
    frontEn: 'Which fundamental right is guaranteed under Article 16 of the Constitution of Nepal?',
    backNe: 'सम्मानपूर्वक बाँच्न पाउने हक (Right to live with dignity)',
    backEn: 'Right to Live with Dignity — Every citizen shall have the right to live with dignity, and no law shall be made which provides for the death penalty.',
    mnemonicTipNe: 'सम्झने सुत्र: "१६ वर्षमा नागरिक सम्मानपूर्वक बाँच्न सुरु गर्छन्" (१६ = सम्मानपूर्वक बाँच्न पाउने हक)। मृत्युदण्डको सजाय दिने कानुन बनाउन पाइँदैन।',
    examContext: 'Paper I (GK) Objective & Paper II (Constitution) Sub-clause citation.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-cr-02',
    deckId: 'constitution-rights',
    deckNameNe: 'मौलिक हक',
    deckNameEn: 'Fundamental Rights',
    frontNe: 'धारा १७ मा उल्लिखित स्वतन्त्रताको हक अन्तर्गत नागरिकलाई कति प्रकारका स्वतन्त्रता प्रदान गरिएको छ?',
    frontEn: 'Under Article 17 (Right to Freedom), how many specific freedoms are granted to Nepali citizens?',
    backNe: '६ वटा स्वतन्त्रता (विचार र अभिव्यक्ति, विनाहातहतियार भेला, दल खोल्ने, संघ-संस्था खोल्ने, आवतजावत र पेशा-व्यवसाय गर्ने)',
    backEn: '6 specific freedoms: (a) thought & expression; (b) assemble peacefully without arms; (c) political parties; (d) unions & associations; (e) move & reside anywhere; (f) practice any profession/occupation.',
    mnemonicTipNe: 'सुत्र: "वि-भे-द-स-आ-पे" (विचार, भेला, दल, संघ, आवतजावत, पेशा)',
    examContext: 'Frequently asked in Paper I and Paper II short answer questions.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'medium',
  },
  {
    id: 'fc-cr-03',
    deckId: 'constitution-rights',
    deckNameNe: 'मौलिक हक',
    deckNameEn: 'Fundamental Rights',
    frontNe: 'धारा २४ मा कुन हकको व्यवस्था छ र यसको मुख्य प्रतिबन्ध के हो?',
    frontEn: 'Which right is protected under Article 24 and what is its primary prohibition?',
    backNe: 'छुवाछूत तथा भेदभाव विरुद्धको हक (Right against untouchability and discrimination)',
    backEn: 'Right against Untouchability & Discrimination — Any act of untouchability or discrimination in public or private spaces is punishable by law with victim compensation.',
    mnemonicTipNe: 'धारा २४ = २४ सै घण्टा छुवाछूत पूर्ण निषेध। सार्वजनिक र निजी दुवै स्थानमा जातीय भेदभाव दण्डनीय छ।',
    examContext: 'High-yield citation in Social Justice & Inclusive Governance questions.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-cr-04',
    deckId: 'constitution-rights',
    deckNameNe: 'मौलिक हक',
    deckNameEn: 'Fundamental Rights',
    frontNe: 'धारा २७ मा कुन हकको व्यवस्था छ र कुन सूचना माग्न पाइँदैन?',
    frontEn: 'Which right is enshrined in Article 27 and what information is restricted?',
    backNe: 'सूचनाको हक (Right to Information) — कानुन बमोजिम गोप्य राख्नुपर्ने सूचना दिन बाध्य हुने छैन।',
    backEn: 'Right to Information — Every citizen has the right to demand and receive information on any matter of public interest or their personal interest, provided law does not mandate secrecy.',
    mnemonicTipNe: '२७ = सूचनाको अधिकार। सूचनाको हक सम्बन्धी ऐन २०६४ ले ५ प्रकारका सूचना गोप्य राख्ने छुट दिएको छ।',
    examContext: 'Guaranteed relevance in Good Governance and Administrative Transparency papers.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-cr-05',
    deckId: 'constitution-rights',
    deckNameNe: 'मौलिक हक',
    deckNameEn: 'Fundamental Rights',
    frontNe: 'संवैधानिक उपचारको हक नेपालको संविधानको कुन धारामा व्यवस्थित छ?',
    frontEn: 'Which article provides the Right to Constitutional Remedies?',
    backNe: 'धारा ४६ (संवैधानिक उपचारको हक — धारा १३३ वा १४४ बमोजिम उपचार पाउने)',
    backEn: 'Article 46 (Right to Constitutional Remedies — enforced via Supreme Court Article 133 or High Court Article 144 through 5 writs: Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari).',
    mnemonicTipNe: 'धारा ४६ = ३१ वटै मौलिक हकको ‘मुटु र ढुकढुकी’ (हक हनन भएमा उपचार पाउने हक)।',
    examContext: 'Always tested in Judicial and Administration Paper II.',
    cadreRelevance: ['section-officer', 'nayab-subba'],
    defaultDifficulty: 'medium',
  },

  // 2. Constitutional Organs
  {
    id: 'fc-co-01',
    deckId: 'constitutional-organs',
    deckNameNe: 'संवैधानिक निकाय',
    deckNameEn: 'Constitutional Bodies',
    frontNe: 'अख्तियार दुरुपयोग अनुसन्धान आयोग (CIAA) को व्यवस्था संविधानको कुन भाग र धारामा छ?',
    frontEn: 'In which Part and Article of the Constitution is the Commission for the Investigation of Abuse of Authority (CIAA) established?',
    backNe: 'भाग २१, धारा २३८ (गठन) र धारा २३९ (काम, कर्तव्य र अधिकार)',
    backEn: 'Part 21: Article 238 (Establishment with Chief Commissioner + 4 Commissioners) & Article 239 (Functions, Duties and Powers).',
    mnemonicTipNe: 'पदावधि: नियुक्ति भएको मितिले ६ वर्ष, अवकाश उमेर: ६५ वर्ष। भ्रष्टाचार निवारण ऐन २०५९ यसको मुख्य कार्यान्वयन कानुन हो।',
    examContext: 'Anti-corruption and integrity governance topics.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'medium',
  },
  {
    id: 'fc-co-02',
    deckId: 'constitutional-organs',
    deckNameNe: 'संवैधानिक निकाय',
    deckNameEn: 'Constitutional Bodies',
    frontNe: 'लोक सेवा आयोग (PSC) को व्यवस्था संविधानको कुन धारामा छ र यसमा कति पदाधिकारी रहन्छन्?',
    frontEn: 'Which Article governs the Public Service Commission (PSC) and what is its composition?',
    backNe: 'धारा २४२ (गठन: १ अध्यक्ष र ४ जना सदस्य गरी ५ जना; धारा २४३: काम, कर्तव्य र अधिकार)',
    backEn: 'Article 242 (1 Chairman + 4 Members = 5 Members total, appointed for 6 years). Article 243 defines recruitment for civil service and security bodies.',
    mnemonicTipNe: 'कम्तीमा ५०% सदस्य २० वर्ष वा सोभन्दा बढी सरकारी सेवामा रहेका व्यक्तिहरूबाट नियुक्त गर्नुपर्ने संवैधानिक बाध्यता छ।',
    examContext: 'Crucial for Civil Service recruitment procedures.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },

  // 3. Geography & Belts
  {
    id: 'fc-geo-01',
    deckId: 'geography-belts',
    deckNameNe: 'नेपालको भूगोल',
    deckNameEn: 'Nepal Geography',
    frontNe: 'नेपालको कुल क्षेत्रफल कति छ र प्रमाणिक समय कुन हिमाललाई आधार मानी तय गरिएको छ?',
    frontEn: 'What is Nepal’s official area and which mountain peak is the standard time meridian based on?',
    backNe: '१,४७,१८१ वर्ग कि.मी. (५६,८२७ वर्ग माइल) — गौरीशंकर हिमाल (८६° १५\' पूर्वी देशान्तर)',
    backEn: '147,181 sq km (56,827 sq miles) — Standard time is based on Mt. Gaurishankar (7,134m) at 86° 15\' East Longitude (+5 hrs 45 mins ahead of GMT, adopted 2042 Baisakh 1).',
    mnemonicTipNe: '२०४२ वैशाख १ गतेदेखि गौरीशंकर हिमाललाई आधार मानेर नेपालको आधिकारिक समय (GMT+5:45) लागू गरिएको।',
    examContext: 'Foundational Question in Paper I GK across all cadres.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-geo-02',
    deckId: 'geography-belts',
    deckNameNe: 'नेपालको भूगोल',
    deckNameEn: 'Nepal Geography',
    frontNe: 'सगरमाथाको नयाँ उचाइ कति कायम गरिएको छ र कहिले घोषणा गरियो?',
    frontEn: 'What is the revised height of Mt. Everest and when was it jointly announced?',
    backNe: '८,८४८.८६ मिटर (२९,०३१.७ फिट) — विसं २०७७ मङ्सिर २३ (8 Dec 2020)',
    backEn: '8,848.86 meters (29,031.7 feet) — Jointly announced by Nepal and China on December 8, 2020 (२०७७ मङ्सिर २३). Increased by 0.86m (86 cm).',
    mnemonicTipNe: '८६ सेमी थपिएको (.८६ मि.)। नेपाल सरकारको नापी विभागद्वारा पहिलो पटक आफ्नै स्रोतसाधनबाट मापन।',
    examContext: 'Paper I General Knowledge standard milestone.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },

  // 4. History & Treaties
  {
    id: 'fc-hist-01',
    deckId: 'history-treaties',
    deckNameNe: 'इतिहास तथा सन्धि',
    deckNameEn: 'History & Treaties',
    frontNe: 'ऐतिहासिक सुगौली सन्धि (Treaty of Sugauli) मा कहिले हस्ताक्षर भयो र कति धारा छन्?',
    frontEn: 'When was the historic Sugauli Treaty signed and ratified, and how many articles does it contain?',
    backNe: 'हस्ताक्षर: २ डिसेम्बर १८१५ / अनुमोदन: ४ मार्च १८१६ (विसं १८७२) — ९ वटा धाराहरू',
    backEn: 'Signed: 2 December 1815 / Ratified: 4 March 1816 — Consists of 9 Articles between East India Company and King of Nepal.',
    mnemonicTipNe: 'सुगौली सन्धिमा नेपालका तर्फबाट गजराज मिश्र र चन्द्रशेखर उपाध्याय, कम्पनीका तर्फबाट ब्राडशा (Bradshaw) ले हस्ताक्षर गरेका थिए। कुल ९ धारा।',
    examContext: 'Frequently tested in Nepal Diplomatic History & Border Geography.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'medium',
  },
  {
    id: 'fc-hist-02',
    deckId: 'history-treaties',
    deckNameNe: 'इतिहास तथा सन्धि',
    deckNameEn: 'History & Treaties',
    frontNe: 'नेपालको पहिलो लिखित संविधान कुन हो र कहिले जारी भयो?',
    frontEn: 'What was Nepal’s first written constitution and when was it promulgated?',
    backNe: 'नेपाल सरकार वैधानिक कानुन, २००४ (जारी: विसं २००४ माघ १३ — लागू हुन नसकेको)',
    backEn: 'Government of Nepal Act 2004 (Promulgated by Rana PM Padma Shumsher on 13 Magh 2004 BS, but never came into legal effect).',
    mnemonicTipNe: 'नेपालमा हालसम्म ७ वटा संविधान बनेका छन् (२००४, २००७, २०१५, २०१९, २०४७, २०६३ र २०७२)। पहिलो लागू भएको संविधान भने २००७ सालको अन्तरिम शासन विधान हो।',
    examContext: 'Constitutional History of Nepal (Paper I & II).',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },

  // 5. Economy & 16th Plan
  {
    id: 'fc-econ-01',
    deckId: 'economy-16th-plan',
    deckNameNe: 'अर्थतन्त्र र योजना',
    deckNameEn: 'Economy & 16th Plan',
    frontNe: '१६ औँ आवधिक योजना (२०८१/८२–२०८५/८६) को मुख्य नारा के हो?',
    frontEn: 'What is the core vision motto of the 16th Periodic Plan (2081/82–2085/86)?',
    backNe: '"सुशासन, सामाजिक न्याय र समृद्धि" (Good Governance, Social Justice, and Prosperity)',
    backEn: 'Motto: "Good Governance, Social Justice, and Prosperity" — Focuses on structural reforms across 12 key thematic areas.',
    mnemonicTipNe: '१५ औँ योजनाको नारा ‘समृद्ध नेपाल, सुखी नेपाली’ थियो भने १६ औँ योजनाको मुख्य त्रिपक्षीय नारा ‘सुशासन, सामाजिक न्याय र समृद्धि’ हो।',
    examContext: 'Indispensable citation for 16th Plan in Papers I, II & III.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-econ-02',
    deckId: 'economy-16th-plan',
    deckNameNe: 'अर्थतन्त्र र योजना',
    deckNameEn: 'Economy & 16th Plan',
    frontNe: '१६ औँ योजनाले वार्षिक औसत आर्थिक वृद्धिदर कति प्रतिशत पुर्‍याउने लक्ष्य राखेको छ?',
    frontEn: 'What is the average annual economic growth rate targeted by the 16th Plan?',
    backNe: 'वार्षिक औसत ७.३ प्रतिशत (Target: 7.3% Annual Average Growth)',
    backEn: 'Target Average Economic Growth Rate: 7.3% per annum over the 5-year period (2081/82 to 2085/86).',
    mnemonicTipNe: '१६ औँ योजना: आर्थिक वृद्धिदर ७.३%, बहुआयामिक गरिबी ११% भन्दा तल झार्ने, र २०२६ नोभेम्बरमा LDC स्तरोन्नति।',
    examContext: 'Standard objective target question in Paper I & II.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'medium',
  },

  // 6. International Affairs
  {
    id: 'fc-intl-01',
    deckId: 'international-affairs',
    deckNameNe: 'अन्तर्राष्ट्रिय संस्था',
    deckNameEn: 'International Bodies',
    frontNe: 'नेपालले संयुक्त राष्ट्रसंघ (UN) को सदस्यता कहिले प्राप्त गर्‍यो र कुन प्याकेज अन्तर्गत?',
    frontEn: 'When did Nepal gain membership to the United Nations and under which package deal?',
    backNe: '१४ डिसेम्बर १९५५ (विसं २०१२ मङ्सिर २९) — "प्याकेज डिल" (Package Deal) अन्तर्गत १६ राष्ट्रसँगै',
    backEn: 'December 14, 1955 (29 Mangsir 2012 BS) — Under the UN "Package Deal" simultaneously along with 15 other sovereign states.',
    mnemonicTipNe: 'नेपाल संयुक्त राष्ट्रसंघको ७२ औँ सदस्य राष्ट्र हो। नेपालले पहिलो पटक आवेदन १९४९ मा गरेको थियो।',
    examContext: 'Fundamental milestone in Nepal Foreign Relations & UN GK.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
  {
    id: 'fc-intl-02',
    deckId: 'international-affairs',
    deckNameNe: 'अन्तर्राष्ट्रिय संस्था',
    deckNameEn: 'International Bodies',
    frontNe: 'सार्क (SAARC) को बडापत्रमा कति धाराहरू छन् र सचिवालय कहाँ अवस्थित छ?',
    frontEn: 'How many articles are in the SAARC Charter and where is its Secretariat located?',
    backNe: '१० वटा धाराहरू — सचिवालय: काठमाडौँ, नेपाल (स्थापना: १६ जनवरी १९८७)',
    backEn: '10 Articles in SAARC Charter — Permanent Secretariat located in Kathmandu, Nepal (inaugurated 16 January 1987 by King Birendra).',
    mnemonicTipNe: 'सार्क स्थापना: ८ डिसेम्बर १९८५ (ढाका सम्मेलन)। कुल सदस्य: ८ (अफगानिस्तान १४ औँ नयाँ दिल्ली शिखर सम्मेलन २००७ मा थपिएको)।',
    examContext: 'Regional Cooperation Paper I and Paper III question.',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    defaultDifficulty: 'easy',
  },
];
