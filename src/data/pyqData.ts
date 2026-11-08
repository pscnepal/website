/**
 * Previous Years' Questions (PYQ) & Frequency Trend Data for PSC Nepal
 * Covers Lok Sewa examination papers from 2075 BS to 2080 BS for
 * Section Officer (शाखा अधिकृत), Nayab Subba (ना.सु.), and Kharidar (खरिदार).
 */

export interface PyqRecurringTopic {
  id: string;
  topicNameNe: string;
  topicNameEn: string;
  cadreFocus: Array<'section-officer' | 'nayab-subba' | 'kharidar'>;
  frequencyScore: number; // e.g. 8 out of 10 years
  recurrencePercentage: number; // e.g. 80%
  trend: 'rising' | 'evergreen' | 'stable';
  corePapers: string[];
  whyItRepeatsNe: string;
  whyItRepeatsEn: string;
  rankerTipNe: string;
  suggestedStatutes: string[];
}

export interface PyqQuestion {
  id: string;
  yearBS: string; // e.g. '२०८०', '२०७९', '२०७८', '२०७७', '२०७६', '२०७५'
  cadre: 'section-officer' | 'nayab-subba' | 'kharidar';
  cadreLabelNe: string;
  cadreLabelEn: string;
  paper: 'Paper I (OMR)' | 'Paper II' | 'Paper III' | 'Paper IV';
  paperNameNe: string;
  paperNameEn: string;
  marks: 5 | 10;
  questionType: 'subjective-short' | 'subjective-long' | 'case-study';
  questionNe: string;
  questionEn: string;
  topicCategory:
    | 'governance'
    | 'constitution-law'
    | 'economy-budget'
    | 'foreign-affairs'
    | 'social-development'
    | 'environment-disaster';
  topicCategoryLabelNe: string;
  topicCategoryLabelEn: string;
  recurringFrequencyBadge: 'Tested 7+ Times' | 'Tested 5+ Times' | 'Tested 3+ Times' | 'Standard Frequency';
  outlineHintsNe: string[];
  outlineHintsEn: string[];
  linkedWrittenQuestionId?: string;
  likes: number;
  views: number;
}

export const PYQ_RECURRING_TOPIC_STATS: PyqRecurringTopic[] = [
  {
    id: 'rec-governance',
    topicNameNe: 'सुशासन तथा नागरिक बडापत्र (Good Governance & Citizen Charter)',
    topicNameEn: 'Good Governance Principles & Citizen Charter Effectiveness',
    cadreFocus: ['section-officer', 'nayab-subba', 'kharidar'],
    frequencyScore: 9,
    recurrencePercentage: 90,
    trend: 'evergreen',
    corePapers: ['Paper II (Governance)', 'Paper II (Public Admin)'],
    whyItRepeatsNe: 'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन २०६४ र नागरिक बडापत्र सार्वजनिक सेवा प्रवाहको आधारस्तम्भ भएकाले हरेक वर्ष सैद्धान्तिक वा व्यवहारिक समस्या समाधानका रूपमा सोधिन्छ।',
    whyItRepeatsEn: 'Citizen Charter and Good Governance Act 2064 form the bedrock of citizen-centric administrative delivery and statutory accountability.',
    rankerTipNe: 'परिभाषा मात्र नलेखी क्षतिपूर्ति सहितको नागरिक बडापत्रको अभ्यास, व्यावहारिक समस्याहरू र डिजिटल बडापत्र (Nagarik App) को सन्दर्भ जोडेर ५ वा १० नम्बरको उत्तर सन्तुलित बनाउनुहोस्।',
    suggestedStatutes: ['सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४', 'नागरिक बडापत्र दिग्दर्शन'],
  },
  {
    id: 'rec-federalism',
    topicNameNe: 'संघीयता तथा तीन तहबीचको अन्तरसम्बन्ध (Inter-governmental Relations)',
    topicNameEn: 'Federalism Dynamics, Fiscal Devolution & Inter-tier Coordination',
    cadreFocus: ['section-officer', 'nayab-subba'],
    frequencyScore: 8,
    recurrencePercentage: 80,
    trend: 'evergreen',
    corePapers: ['Paper II (Governance)', 'Paper III (Contemporary Issues)'],
    whyItRepeatsNe: 'संविधानको धारा २३२ ले व्यवस्था गरेको सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्त, वित्तीय हस्तान्तरण र अधिकारको साझा सूची व्यवस्थापन नेपालको वर्तमान मुख्य प्रशासनिक चुनौती हो।',
    whyItRepeatsEn: 'Article 232 of the Constitution mandates cooperation, coexistence, and coordination among federation, provinces, and local bodies.',
    rankerTipNe: 'संविधानको अनुसूची ५, ६, ७, ८, ९ को स्पष्ट उल्लेख, राष्ट्रिय समन्वय परिषद् (NCC) र वित्तीय समानीकरण अनुदानका तथ्याङ्क प्रस्तुत गर्दा उच्च अङ्क प्राप्त हुन्छ।',
    suggestedStatutes: ['नेपालको संविधान २०७२ धारा २३२', 'अन्तरसरकारी वित्त व्यवस्थापन ऐन, २०७४', 'स्थानीय सरकार सञ्चालन ऐन, २०७४'],
  },
  {
    id: 'rec-rti',
    topicNameNe: 'सूचनाको हक र पारदर्शिता (Right to Information & Transparency)',
    topicNameEn: 'Right to Information (RTI) as a Catalyst for Public Integrity',
    cadreFocus: ['section-officer', 'nayab-subba', 'kharidar'],
    frequencyScore: 7,
    recurrencePercentage: 70,
    trend: 'stable',
    corePapers: ['Paper II (Governance)', 'Paper II (Administration)'],
    whyItRepeatsNe: 'संविधानको धारा २७ मा मौलिक हकका रूपमा व्यवस्थित सूचनाको हकले भ्रष्टाचार नियन्त्रण र खुला सरकारको अवधारणा प्रवर्द्धन गर्दछ।',
    whyItRepeatsEn: 'Article 27 fundamental right promoting proactive disclosure, open governance, and curbing bureaucratic secrecy.',
    rankerTipNe: 'सूचनाको हक ऐन २०६४ को दफा ३ (अधिकार), दफा ५ (सार्वजनिक निकायको दायित्व) र दफा ७ (प्रक्रिया) का दफाहरू उत्तरमा अनिवार्य उद्धृत गर्नुहोस्।',
    suggestedStatutes: ['नेपालको संविधान धारा २७', 'सूचनाको हक सम्बन्धी ऐन, २०६४'],
  },
  {
    id: 'rec-climate',
    topicNameNe: 'जलवायु परिवर्तन र विपद् व्यवस्थापन (Climate Resilience & Disaster Risk Reduction)',
    topicNameEn: 'Climate Change Adaptation, Mountain Fragility & Disaster Risk Management',
    cadreFocus: ['section-officer', 'nayab-subba'],
    frequencyScore: 7,
    recurrencePercentage: 70,
    trend: 'rising',
    corePapers: ['Paper III (Contemporary Issues)'],
    whyItRepeatsNe: 'नेपाल विश्वमै जलवायु जोखिमयुक्त मुलुक हुनु, हिमनदी पग्लने जोखिम र अन्तर्राष्ट्रिय मञ्चमा हानि–नोक्सानी कोष (Loss and Damage) को बहस तीव्र बनेकाले बारम्बार सोधिने विषय हो।',
    whyItRepeatsEn: 'Mountain vulnerability, GLOF risks, COP28/29 Loss & Damage negotiations, and Sendai Disaster Framework alignment.',
    rankerTipNe: 'पेरिस सम्झौता, नेपालको सन् २०४५ सम्म खुद शून्य कार्बन उत्सर्जन (Net-Zero) को राष्ट्रिय प्रतिबद्धता (NDC) र स्थानीय विपद् व्यवस्थापन योजना (LDCRP) को सन्दर्भ जोड्नुहोस्।',
    suggestedStatutes: ['विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४', 'राष्ट्रिय जलवायु परिवर्तन नीति, २०७६'],
  },
  {
    id: 'rec-procurement',
    topicNameNe: 'सार्वजनिक खरिद व्यवस्थापन र वित्तीय जवाफदेहिता (Public Procurement & Financial Control)',
    topicNameEn: 'Public Procurement Integrity, E-GP & Fiscal Transparency',
    cadreFocus: ['section-officer', 'nayab-subba'],
    frequencyScore: 6,
    recurrencePercentage: 60,
    trend: 'stable',
    corePapers: ['Paper II (Governance)', 'Paper IV (Service Rules)'],
    whyItRepeatsNe: 'विकास बजेट खर्च नहुने र खरिद प्रक्रियामा ढिलासुस्ती तथा अनियमितता नेपालको सार्वजनिक व्यवस्थापनको निरन्तर रोग हो।',
    whyItRepeatsEn: 'Persistent low capital spending, public procurement litigation, and electronic government procurement (e-GP) systems.',
    rankerTipNe: 'सार्वजनिक खरिद ऐन २०६३ का आधारभूत सिद्धान्तहरू (प्रतिस्पर्धा, मितव्ययिता, पारदर्शिता, औचित्य) र ई–जिपी प्रणालीका फाइदाहरू तालिकामा लेख्नुहोस्।',
    suggestedStatutes: ['सार्वजनिक खरिद ऐन, २०६३', 'सार्वजनिक खरिद नियमावली, २०६४'],
  },
  {
    id: 'rec-civil-service',
    topicNameNe: 'निजामती सेवामा निष्पक्षता, तटस्थता र वृत्ति विकास (Civil Service Neutrality & Merit)',
    topicNameEn: 'Civil Service Professionalism, Political Neutrality & Meritocracy',
    cadreFocus: ['section-officer', 'nayab-subba', 'kharidar'],
    frequencyScore: 8,
    recurrencePercentage: 80,
    trend: 'rising',
    corePapers: ['Paper II (Governance)', 'Paper II (Public Administration)'],
    whyItRepeatsNe: 'प्रशासनको राजनीतिकरण, कर्मचारीको कार्यसम्पादन मूल्याङ्कन, र संघीय निजामती सेवा ऐन जारी हुन नसकेको वर्तमान द्वन्द्व परीक्षाको प्रमुख विषय हो।',
    whyItRepeatsEn: 'Bureaucratic neutrality vs political responsiveness, merit-based career progression, and federal adaptation friction.',
    rankerTipNe: 'तटस्थता (Neutrality) र प्रतिबद्धता (Commitment) बीचको फरक स्पष्ट पारी संविधान र लोककल्याणकारी राज्यप्रतिको प्रतिबद्धता तर दलप्रतिको तटस्थताको सिद्धान्त व्याख्या गर्नुहोस्।',
    suggestedStatutes: ['निजामती सेवा ऐन, २०४९', 'संघीय निजामती सेवा विधेयक'],
  },
];

export const PYQ_QUESTION_ENTRIES: PyqQuestion[] = [
  {
    id: 'pyq-so-2080-01',
    yearBS: '२०८०',
    cadre: 'section-officer',
    cadreLabelNe: 'शाखा अधिकृत',
    cadreLabelEn: 'Section Officer',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: शासन व्यवस्था (Governance)',
    paperNameEn: 'Paper II: Governance System',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'सुशासन भन्नाले के बुझिन्छ? नेपालको सार्वजनिक प्रशासनमा सुशासन प्रवर्द्धन गर्न विद्यमान कानुनी तथा संस्थागत व्यवस्थाहरूको चर्चा गर्दै यसका प्रमुख कार्यान्वयन चुनौतीहरू विश्लेषण गर्नुहोस्। (२+४+४=१०)',
    questionEn:
      'What do you understand by good governance? Discuss the existing statutory and institutional mechanisms for promoting good governance in Nepal’s public administration and analyze key implementation challenges. (2+4+4=10)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'सुशासन तथा प्रशासन',
    topicCategoryLabelEn: 'Governance & Administration',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'परिचय (२ अङ्क): सुशासनको अवधारणा, संयुक्त राष्ट्रसंघका ८ आधारस्तम्भ (जनसहभागिता, विधिको शासन, पारदर्शिता, जवाफदेहिता आदि)।',
      'कानुनी तथा संस्थागत व्यवस्था (४ अङ्क): सुशासन ऐन २०६४, सूचनाको हक २०६४, अख्तियार (CIAA), राष्ट्रिय सतर्कता केन्द्र (NVC), महालेखापरीक्षक।',
      'चुनौती तथा निष्कर्ष (४ अङ्क): प्रक्रियामुखी संस्कार, नागरिक बडापत्रको फितलो कार्यान्वयन, दण्डहीनता; समाधानका उपाय सहित निष्कर्ष।',
    ],
    outlineHintsEn: [
      'Introduction (2 marks): UN 8 pillars (Rule of Law, Transparency, Accountability, Participation).',
      'Statutory & Institutional Framework (4 marks): Good Governance Act 2064, RTI Act 2064, CIAA, NVC, OAG.',
      'Challenges & Conclusion (4 marks): Proceduralism, weak citizen charter enforcement, lack of performance auditing.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-201',
    likes: 184,
    views: 3120,
  },
  {
    id: 'pyq-so-2080-02',
    yearBS: '२०८०',
    cadre: 'section-officer',
    cadreLabelNe: 'शाखा अधिकृत',
    cadreLabelEn: 'Section Officer',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: शासन व्यवस्था (Governance)',
    paperNameEn: 'Paper II: Governance System',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'नेपालको संविधानले परिकल्पना गरेको तीन तहका सरकारहरू बीचको सम्बन्धका आधारहरू स्पष्ट पार्नुहोस्। अन्तरतह समन्वयमा देखिएका व्यावहारिक समस्याहरू उल्लेख गर्दै सुधारका उपायहरू सुझाउनुहोस्। (४+३+३=१०)',
    questionEn:
      'Explain the foundations of relations among the three tiers of government envisaged by the Constitution of Nepal. Highlight practical challenges in inter-tier coordination and suggest remedies. (4+3+3=10)',
    topicCategory: 'constitution-law',
    topicCategoryLabelNe: 'संविधान तथा संघीयता',
    topicCategoryLabelEn: 'Constitution & Federalism',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'संवैधानिक आधार (४ अङ्क): धारा २३२ (सहकारिता, सहअस्तित्व, समन्वय), अन्तरसरकारी वित्त व्यवस्थापन, अनुसूची ५ देखि ९ सम्मका अधिकार सूची।',
      'समस्याहरू (३ अङ्क): दोहोरो क्षेत्राधिकार (साझा सूची), कर्मचारी समायोजन र खटनपटन, कानुन निर्माणमा ढिलासुस्ती, प्राकृतिक स्रोत बाँडफाँड विवाद।',
      'सुधारका उपाय (३ अङ्क): राष्ट्रिय समन्वय परिषद् (NCC) को प्रभावकारिता, वित्तीय समानीकरण अनुदानको न्यायोचित वितरण, एकीकृत प्रशासनिक संयन्त्र।',
    ],
    outlineHintsEn: [
      'Constitutional Foundations (4 marks): Article 232 (Cooperation, Coexistence, Coordination), Schedules 5-9.',
      'Operational Friction (3 marks): Concurrent list conflicts, civil service deployment delays, resource allocation friction.',
      'Remedial Pathways (3 marks): Active National Coordination Council meetings, objective fiscal equalization grants.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-202',
    likes: 156,
    views: 2840,
  },
  {
    id: 'pyq-so-2079-01',
    yearBS: '२०७९',
    cadre: 'section-officer',
    cadreLabelNe: 'शाखा अधिकृत',
    cadreLabelEn: 'Section Officer',
    paper: 'Paper III',
    paperNameNe: 'तृतीय पत्र: समसामयिक विषय (Contemporary Issues)',
    paperNameEn: 'Paper III: Contemporary Issues',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'नेपालको आर्थिक विकासमा विप्रेषण (Remittance) को भूमिका विश्लेषण गर्दै यसलाई उत्पादनशील क्षेत्रमा परिचालन गर्न नसकिनुका कारणहरू र भावी रणनीतिबारे चर्चा गर्नुहोस्। (३+३+४=१०)',
    questionEn:
      'Analyze the role of remittance in Nepal’s economic development. Discuss why it has not been mobilized in productive sectors and formulate future strategies. (3+3+4=10)',
    topicCategory: 'economy-budget',
    topicCategoryLabelNe: 'अर्थतन्त्र तथा बजेट',
    topicCategoryLabelEn: 'Economy & Budget',
    recurringFrequencyBadge: 'Tested 5+ Times',
    outlineHintsNe: [
      'भूमिका (३ अङ्क): कुल गार्हस्थ्य उत्पादन (GDP) मा करिब २५-२६% योगदान, विदेशी मुद्रा सञ्चिति, गरिबी निवारण र शिक्षा/स्वास्थ्यमा खर्च।',
      'अनुत्पादक खर्चका कारण (३ अङ्क): उपभोगमुखी खर्च (९०% भन्दा बढी आयातित उपभोगमा), वित्तीय साक्षरताको कमी, आकर्षक लगानी उपकरणको अभाव।',
      'भावी रणनीति (४ अङ्क): रेमिट्यान्स हाइड्रो बन्ड, औपचारिक बैंकिङ च्यानलमा प्रोत्साहन, स्वदेश फर्किएका युवालाई सहुलियतपूर्ण उद्यमशीलता कर्जा।',
    ],
    outlineHintsEn: [
      'Economic Role (3 marks): Approx 25-26% of GDP, foreign exchange buffer, poverty reduction.',
      'Barriers to Capitalization (3 marks): High import consumption (>90%), lack of targeted financial bonds, financial literacy gap.',
      'Future Strategy (4 marks): Remit-hydro bonds, preferential SME startup loans for returnee migrants, productive asset formation.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-302',
    likes: 142,
    views: 2610,
  },
  {
    id: 'pyq-nasu-2080-01',
    yearBS: '२०८०',
    cadre: 'nayab-subba',
    cadreLabelNe: 'नायब सुब्बा',
    cadreLabelEn: 'Nayab Subba',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: समसामयिक अध्ययन तथा सार्वजनिक सेवा व्यवस्थापन',
    paperNameEn: 'Paper II: Contemporary Studies & Public Management',
    marks: 5,
    questionType: 'subjective-short',
    questionNe:
      'नागरिक बडापत्रको अवधारणा प्रस्ट पार्दै यसले सेवाग्राहीको अधिकार संरक्षणमा कसरी मद्दत पुर्‍याउँछ? संक्षेपमा लेख्नुहोस्। (२+३=५)',
    questionEn:
      'Clarify the concept of Citizen Charter and explain briefly how it safeguards the rights of service-seekers. (2+3=5)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'सुशासन तथा सेवा प्रवाह',
    topicCategoryLabelEn: 'Governance & Service Delivery',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'अवधारणा (२ अङ्क): कार्यालयले दिने सेवा, लाग्ने समय, दस्तुर, आवश्यक कागजात, जिम्मेवार अधिकारी र क्षतिपूर्ति सहितको सार्वजनिक प्रतिबद्धता।',
      'अधिकार संरक्षण (३ अङ्क): सेवा प्राप्तिको निश्चितता, मनोमानी शुल्क/ढिलाइ नियन्त्रण, गुनासो सुनुवाइ र क्षतिपूर्ति दाबीको आधार।',
    ],
    outlineHintsEn: [
      'Concept (2 marks): Public written pledge detailing services, timelines, fees, required documents, and accountable officers.',
      'Safeguarding Rights (3 marks): Service certainty, curbing harassment/bribery, grievance redressal, compensatory rights.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-203',
    likes: 215,
    views: 3480,
  },
  {
    id: 'pyq-nasu-2079-01',
    yearBS: '२०७९',
    cadre: 'nayab-subba',
    cadreLabelNe: 'नायब सुब्बा',
    cadreLabelEn: 'Nayab Subba',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: समसामयिक अध्ययन तथा सार्वजनिक सेवा व्यवस्थापन',
    paperNameEn: 'Paper II: Contemporary Studies & Public Management',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'सूचनाको हक भन्नाले के बुझिन्छ? सार्वजनिक निकायमा सूचनाको हकको कार्यान्वयनका लागि भएका कानुनी व्यवस्थाहरू उल्लेख गर्दै यसको महत्त्व स्पष्ट गर्नुहोस्। (२+४+४=१०)',
    questionEn:
      'What is Right to Information (RTI)? Mention the legal provisions for the implementation of RTI in public bodies and explain its significance. (2+4+4=10)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'सुशासन तथा कानुन',
    topicCategoryLabelEn: 'Governance & Legal',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'परिभाषा (२ अङ्क): सार्वजनिक महत्त्वको सूचना माग्ने र पाउने नागरिकको संवैधानिक तथा कानुनी अधिकार (धारा २७)।',
      'कानुनी व्यवस्था (४ अङ्क): सूचनाको हक ऐन २०६४, सूचना अधिकारीको तोकाइ, प्रत्येक ३/३ महिनामा स्वतः प्रकाशन (Proactive Disclosure), राष्ट्रिय सूचना आयोग (NIC)।',
      'महत्त्व (४ अङ्क): भ्रष्टाचार नियन्त्रण, खुला सरकार, सार्वजनिक निकायको उत्तरदायित्व अभिवृद्धि र नागरिक सशक्तीकरण।',
    ],
    outlineHintsEn: [
      'Definition (2 marks): Article 27 constitutional right to demand and receive information of public importance.',
      'Legal Provisions (4 marks): RTI Act 2064, Information Officer mandate, quarterly proactive disclosure, National Information Commission.',
      'Significance (4 marks): Curbing corruption, promoting open governance, enhancing civic monitoring.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-203',
    likes: 198,
    views: 3220,
  },
  {
    id: 'pyq-kharidar-2080-01',
    yearBS: '२०८०',
    cadre: 'kharidar',
    cadreLabelNe: 'खरिदार',
    cadreLabelEn: 'Kharidar',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: कार्यालय सञ्चालन तथा सामान्य प्रशासन',
    paperNameEn: 'Paper II: Office Management & General Administration',
    marks: 5,
    questionType: 'subjective-short',
    questionNe:
      'दर्ता र चलानी बीचको भिन्नता प्रस्ट पार्दै कार्यालय व्यवस्थापनमा यिनीहरूको महत्त्व लेख्नुहोस्। (२+३=५)',
    questionEn:
      'Distinguish between Inward Registration (Darta) and Outward Dispatch (Chalani) and write their importance in office management. (2+3=5)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'कार्यालय कार्यविधि',
    topicCategoryLabelEn: 'Office Procedure',
    recurringFrequencyBadge: 'Tested 5+ Times',
    outlineHintsNe: [
      'भिन्नता (२ अङ्क): कार्यालयमा बाहिरबाट प्राप्त पत्रको अभिलेख (दर्ता) र कार्यालयबाट बाहिर पठाइने पत्रको अभिलेख (चलानी)।',
      'महत्त्व (३ अङ्क): पत्र हराउनबाट जोगाउने, कानुनी प्रमाण, भविष्यमा सन्दर्भ खोज्न सहज, र उत्तरदायित्व यकिन गर्ने माध्यम।',
    ],
    outlineHintsEn: [
      'Distinction (2 marks): Inward record of incoming correspondence vs outward record of outgoing dispatches.',
      'Importance (3 marks): Prevents loss of papers, establishes legal timeline proof, facilitates future retrieval.',
    ],
    likes: 240,
    views: 3890,
  },
  {
    id: 'pyq-kharidar-2079-01',
    yearBS: '२०७९',
    cadre: 'kharidar',
    cadreLabelNe: 'खरिदार',
    cadreLabelEn: 'Kharidar',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: कार्यालय सञ्चालन तथा सामान्य प्रशासन',
    paperNameEn: 'Paper II: Office Management & General Administration',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'टिप्पणी लेखन भन्नाले के बुझिन्छ? सरकारी कार्यालयमा टिप्पणी उठाउँदा ध्यान दिनुपर्ने कुराहरू तथा टिप्पणीको ढाँचा प्रस्तुत गर्नुहोस्। (२+४+४=१०)',
    questionEn:
      'What is meant by Administrative Note Sheet (Tippani) writing? What things should be considered while drafting a note sheet in government offices? Present its format. (2+4+4=10)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'कार्यालय कार्यविधि',
    topicCategoryLabelEn: 'Office Procedure',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'परिभाषा (२ अङ्क): तल्लो तहबाट तथ्य र कानुन उल्लेख गरी निर्णयका लागि माथिल्लो तहमा पेश गरिने लिखित प्रशासनिक प्रस्ताव।',
      'ध्यान दिनुपर्ने कुरा (४ अङ्क): संक्षिप्तता, स्पष्टता, तथ्य र कानुनको वस्तुगत उल्लेख, पूर्वाग्रहविहीन भाषा र स्पष्ट सिफारिस।',
      'ढाँचा (४ अङ्क): विषय, पृष्ठभूमि, कानुनी आधार, राय/सिफारिस, र दस्तखत/मिति खण्डको नमुना खाका।',
    ],
    outlineHintsEn: [
      'Definition (2 marks): Official note drafted from subordinate level to decision-maker synthesizing facts and law.',
      'Key Considerations (4 marks): Objectivity, exact legal citation, unbiased language, unambiguous recommendation.',
      'Format (4 marks): Subject line, factual background, statutory clause, recommendation, and signature block.',
    ],
    likes: 285,
    views: 4190,
  },
  {
    id: 'pyq-so-2078-01',
    yearBS: '२०७८',
    cadre: 'section-officer',
    cadreLabelNe: 'शाखा अधिकृत',
    cadreLabelEn: 'Section Officer',
    paper: 'Paper III',
    paperNameNe: 'तृतीय पत्र: समसामयिक विषय (Contemporary Issues)',
    paperNameEn: 'Paper III: Contemporary Issues',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'जलवायु परिवर्तनले नेपालको हिमाली पर्यावरण र अर्थतन्त्रमा पारेको असरको चर्चा गर्दै हानि–नोक्सानी (Loss & Damage) तथा जलवायु वित्त (Climate Finance) प्राप्तिमा नेपालले चाल्नुपर्ने कदमहरू सुझाउनुहोस्। (४+३+३=१०)',
    questionEn:
      'Discuss the impacts of climate change on Nepal’s mountain ecology and economy. Suggest steps Nepal should take to access Loss & Damage and Climate Finance. (4+3+3=10)',
    topicCategory: 'environment-disaster',
    topicCategoryLabelNe: 'वातावरण तथा जलवायु',
    topicCategoryLabelEn: 'Environment & Climate',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'असर (४ अङ्क): हिमनदी तीव्र रूपमा पग्लनु, हिमताल विस्फोट (GLOF) को जोखिम, कृषि चक्रमा फेरबदल, पानीको मुहान सुक्नु।',
      'जलवायु वित्त चुनौती (३ अङ्क): प्रक्रियागत जटिलता (Green Climate Fund), ऋणको सट्टा अनुदान प्राप्त गर्न कठिनाइ, परियोजना बैंकको कमी।',
      'चाल्नुपर्ने कदम (३ अङ्क): पर्वतीय एजेन्डाको अन्तर्राष्ट्रिय कूटनीति, कोप (COP) सम्मेलनहरूमा प्रभावकारी उपस्थिति, राष्ट्रिय स्तरमा प्रत्यक्ष पहुँच संयन्त्र निर्माण।',
    ],
    outlineHintsEn: [
      'Ecological & Economic Toll (4 marks): Glacial retreat, GLOF flashfloods, disruptions in agrarian calendar, hydrology decline.',
      'Climate Finance Bottlenecks (3 marks): Stringent GCF accreditation, grant vs loan dilemma, lack of bankable pipelines.',
      'Strategic Steps (3 marks): Mountain advocacy alliances, proactive COP diplomacy, dedicated domestic direct-access entity.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-301',
    likes: 177,
    views: 2950,
  },
  {
    id: 'pyq-so-2077-01',
    yearBS: '२०७७',
    cadre: 'section-officer',
    cadreLabelNe: 'शाखा अधिकृत',
    cadreLabelEn: 'Section Officer',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: शासन व्यवस्था (Governance)',
    paperNameEn: 'Paper II: Governance System',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'निजामती सेवामा राजनीतिक तटस्थता (Political Neutrality) र प्रतिबद्धता (Commitment) बीचको भिन्नता प्रस्ट पार्नुहोस्। नेपालको निजामती सेवालाई व्यावसायिक र निष्पक्ष बनाउन के–कस्ता उपायहरू अवलम्बन गर्नुपर्ला? (४+६=१०)',
    questionEn:
      'Distinguish between Political Neutrality and Administrative Commitment in Civil Service. What measures should be adopted to make Nepal’s civil service professional and impartial? (4+6=10)',
    topicCategory: 'governance',
    topicCategoryLabelNe: 'निजामती सेवा तथा प्रशासन',
    topicCategoryLabelEn: 'Civil Service & Admin',
    recurringFrequencyBadge: 'Tested 7+ Times',
    outlineHintsNe: [
      'तटस्थता भर्सेज प्रतिबद्धता (४ अङ्क): तटस्थता भनेको दलीय राजनीतिबाट पृथकता; प्रतिबद्धता भनेको संविधान, कानुन र जनताको सेवाप्रतिको निष्ठा।',
      'व्यावसायिकताका उपायहरू (६ अङ्क): योग्यता प्रणाली (Merit System) को कडा पालना, कार्यसम्पादनमा आधारित सरुवा/बढुवा, ट्रेड युनियनको दलीयकरण अन्त्य।',
    ],
    outlineHintsEn: [
      'Neutrality vs Commitment (4 marks): Neutrality is non-partisanship in politics; Commitment is unwavering dedication to constitutional goals and public interest.',
      'Professionalization Pathways (6 marks): Strict merit-based promotion, depoliticizing staff unions, objective KPI-driven evaluations.',
    ],
    linkedWrittenQuestionId: 'PSC-WR-201',
    likes: 168,
    views: 2790,
  },
  {
    id: 'pyq-nasu-2078-01',
    yearBS: '२०७८',
    cadre: 'nayab-subba',
    cadreLabelNe: 'नायब सुब्बा',
    cadreLabelEn: 'Nayab Subba',
    paper: 'Paper II',
    paperNameNe: 'द्वितीय पत्र: समसामयिक अध्ययन तथा सार्वजनिक सेवा व्यवस्थापन',
    paperNameEn: 'Paper II: Contemporary Studies & Public Management',
    marks: 10,
    questionType: 'subjective-long',
    questionNe:
      'स्थानीय तहको अधिकार सूची तथा यसको कार्यसम्पादनमा स्थानीय सरकार सञ्चालन ऐन, २०७४ को भूमिका चर्चा गर्नुहोस्। स्थानीय तहमा सेवा प्रवाह प्रभावकारी बनाउन देखिने अवरोधहरू के–के हुन्? (५+५=१०)',
    questionEn:
      'Discuss the exclusive powers of local levels and the role of the Local Government Operation Act 2074 in their performance. What are the obstacles in effective service delivery at the local tier? (5+5=10)',
    topicCategory: 'constitution-law',
    topicCategoryLabelNe: 'स्थानीय शासन तथा कानुन',
    topicCategoryLabelEn: 'Local Governance & Law',
    recurringFrequencyBadge: 'Tested 5+ Times',
    outlineHintsNe: [
      'अधिकार सूची तथा ऐनको भूमिका (५ अङ्क): अनुसूची ८ (२२ वटा एकल अधिकार), योजना तर्जुमा, स्थानीय कर संकलन, शिक्षा र आधारभूत स्वास्थ्य व्यवस्थापन।',
      'अवरोधहरू (५ अङ्क): दक्ष कर्मचारीको अभाव, आन्तरिक स्रोत संकलनमा कमजोरी, बजेट तर्जुमा तथा खर्च प्रक्रियामा पारदर्शिताको कमी।',
    ],
    outlineHintsEn: [
      'Exclusive Powers & Act (5 marks): Schedule 8 (22 exclusive powers), local revenue, primary health, and basic education.',
      'Service Delivery Impediments (5 marks): Human capital shortages, weak internal revenue generation, fiscal accountability lapses.',
    ],
    likes: 192,
    views: 3100,
  },
];
