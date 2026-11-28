import type { QuizQuestion } from '../../types/assessment';

const COMP_TECH_PHASE2_PDF =
  'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf';

export const EXTRA_CURRENT_AFFAIRS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'PSC-CA-517',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba / Kharidar target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-NAT',
    topic: 'Poverty & Living Standards',
    subtopicId: 'CA-NAT-02',
    subtopic: 'NLSS-IV Poverty & Provincial Rates',
    question:
      'In the Fourth Nepal Living Standards Survey (NLSS-IV 2022/23) published by NSO, what annual per-capita consumption expenditure threshold defines the updated national poverty line, and which province recorded the highest poverty incidence (~34.16%)?',
    questionNe:
      'राष्ट्रिय तथ्याङ्क कार्यालय (NSO) को चौथो जीवनस्तर सर्वेक्षण (NLSS-IV) अनुसार अद्यावधिक राष्ट्रिय गरिबी रेखा प्रतिव्यक्ति वार्षिक कति खर्च तोकिएको छ र कुन प्रदेशमा सबैभन्दा उच्च (~३४.१६%) गरिबी दर देखिएको छ?',
    options: [
      {
        key: 'A',
        text: 'NPR 72,908 per person/year; Sudurpashchim Province',
        textNe: 'प्रतिव्यक्ति वार्षिक रु. ७२,९०८; सुदूरपश्चिम प्रदेश',
      },
      {
        key: 'B',
        text: 'NPR 48,500 per person/year; Karnali Province',
        textNe: 'प्रतिव्यक्ति वार्षिक रु. ४८,५००; कर्णाली प्रदेश',
      },
      {
        key: 'C',
        text: 'NPR 19,261 per person/year; Madhesh Province',
        textNe: 'प्रतिव्यक्ति वार्षिक रु. १९,२६१; मधेश प्रदेश',
      },
      {
        key: 'D',
        text: 'NPR 95,400 per person/year; Koshi Province',
        textNe: 'प्रतिव्यक्ति वार्षिक रु. ९५,४००; कोशी प्रदेश',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'NLSS-IV set the updated poverty line at NPR 72,908/person/year (~20.27% national incidence), with Sudurpashchim recording the highest provincial headcount (~34.16%) and Gandaki the lowest (~11.88%).',
    explanationNe:
      'NLSS-IV ले प्रतिव्यक्ति वार्षिक रु. ७२,९०८ खर्च सीमा तय गरेको छ जसमा सुदूरपश्चिममा सर्वाधिक करिब ३४.१६% र गण्डकीमा न्यूनतम करिब ११.८८% गरिबी छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Living Standards Survey IV (NLSS-IV 2022/23) Report',
    sourcePath: '/materials/nso-nlss-iv-report.pdf',
  },
  {
    id: 'PSC-CA-518',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-GOV',
    topic: 'Constitutional Audit & Integrity',
    subtopicId: 'CA-GOV-01',
    subtopic: 'OAG 63rd Annual Report & Audit Act 2075',
    question:
      'Under the Constitution of Nepal (Article 294) and the Audit Act, 2075, which five core criteria govern public audits conducted by the Office of the Auditor General?',
    questionNe:
      'नेपालको संविधान (धारा २४१/२९४) र लेखापरीक्षण ऐन, २०७५ बमोजिम महालेखापरीक्षकले सार्वजनिक लेखापरीक्षण गर्दा मुख्य कुन पाँच आधारमा परीक्षण गर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Regularity, Economy, Efficiency, Effectiveness, and Propriety',
        textNe: 'नियमितता, मितव्ययिता, कार्यदक्षता, प्रभावकारिता र औचित्य',
      },
      {
        key: 'B',
        text: 'Profitability, Liquidity, Leverage, Taxation, and Dividends',
        textNe: 'नाफा, तरलता, ऋण अनुपात, कर र लाभांश',
      },
      {
        key: 'C',
        text: 'Secrecy, Centralization, Discretion, Tenure, and Patronage',
        textNe: 'गोपनीयता, केन्द्रीकरण, स्वविवेक, पदावधि र संरक्षण',
      },
      {
        key: 'D',
        text: 'Tariff, Quota, Subsidy, Embargo, and Licensing',
        textNe: 'भन्सार, कोटा, अनुदान, नाकाबन्दी र इजाजत',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Article 241 and the Audit Act, 2075 mandate auditing every public institution’s accounts on five pillars: Regularity (नियमितता), Economy (मितव्ययिता), Efficiency (कार्यदक्षता), Effectiveness (प्रभावकारिता), and Propriety (औचित्य).',
    explanationNe:
      'लेखापरीक्षण ऐन, २०७५ ले नियमितता, मितव्ययिता, कार्यदक्षता, प्रभावकारिता र औचित्य गरी पाँच आधारमा सार्वजनिक लेखापरीक्षण गर्ने व्यवस्था गरेको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: '63rd Annual Report of the Auditor General (2083 BS)',
    sourcePath: '/materials/oag-63rd-report-2083.pdf',
  },
  {
    id: 'PSC-CA-519',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-INTL',
    topic: 'LDC Graduation & Trade Diplomacy',
    subtopicId: 'CA-INTL-01',
    subtopic: 'Nov 2026 UN LDC Graduation',
    question:
      'Which two out of the three UN Committee for Development Policy (CDP) criteria did Nepal pass to qualify for graduation from the Least Developed Country (LDC) category effective November 24, 2026?',
    questionNe:
      'सन् २०२६ नोभेम्बर २४ देखि लागू हुने गरी अतिकम विकसित मुलुक (LDC) बाट स्तरोन्नतिका लागि नेपालले संयुक्त राष्ट्रसंघका तीनमध्ये कुन दुई सूचक पूरा गरेको हो?',
    options: [
      {
        key: 'A',
        text: 'Human Assets Index (HAI) and Economic & Environmental Vulnerability Index (EVI)',
        textNe: 'मानव सम्पत्ति सूचकाङ्क (HAI) र आर्थिक तथा वातावरणीय जोखिम सूचकाङ्क (EVI)',
      },
      {
        key: 'B',
        text: 'GNI per capita and Industrial Export Ratio',
        textNe: 'प्रतिव्यक्ति कुल राष्ट्रिय आय (GNI) र औद्योगिक निर्यात अनुपात',
      },
      {
        key: 'C',
        text: 'Foreign Direct Investment (FDI) and Sovereign Credit Rating',
        textNe: 'प्रत्यक्ष वैदेशिक लगानी (FDI) र क्रेडिट रेटिङ',
      },
      {
        key: 'D',
        text: 'GNI per capita and Human Assets Index (HAI)',
        textNe: 'प्रतिव्यक्ति आय (GNI) र मानव सम्पत्ति सूचकाङ्क (HAI)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Nepal satisfied two of the three triennial graduation thresholds—Human Assets Index (HAI) and Economic & Environmental Vulnerability Index (EVI)—despite GNI per capita remaining below the standalone income threshold.',
    explanationNe:
      'प्रतिव्यक्ति कुल राष्ट्रिय आय (GNI) मापदण्ड पूरा नभए पनि नेपालले मानव सम्पत्ति सूचकाङ्क (HAI) र आर्थिक तथा वातावरणीय जोखिम सूचकाङ्क (EVI) पूरा गरी स्तरोन्नतिका लागि योग्यता हासिल गरेको हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Smooth Transition Strategy (STS) — National Planning Commission',
    sourcePath: '/materials/sixteenth-plan-2081-86.pdf',
  },
  {
    id: 'PSC-CA-520',
    level: 'Gazetted Third Class',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-INTL',
    topic: 'LDC Graduation & Trade Diplomacy',
    subtopicId: 'CA-INTL-01',
    subtopic: 'EU EBA Grace Period & GSP+',
    question:
      'Following Nepal’s LDC graduation in November 2026, how long does the European Union’s Everything But Arms (EBA) duty-free transition grace period extend before GSP+ qualification becomes critical?',
    questionNe:
      'सन् २०२६ नोभेम्बरमा LDC स्तरोन्नति भएपश्चात् युरोपेली सङ्घको Everything But Arms (EBA) भन्साररहित सहुलियत संक्रमणकालीन अवधि (Grace Period) कति वर्षसम्म कायम रहन्छ?',
    options: [
      { key: 'A', text: '1 year (until 2027)', textNe: '१ वर्ष (सन् २०२७ सम्म)' },
      { key: 'B', text: '3 years (until November 2029)', textNe: '३ वर्ष (सन् २०२९ नोभेम्बरसम्म)' },
      { key: 'C', text: '7 years (until 2033)', textNe: '७ वर्ष (सन् २०३३ सम्म)' },
      { key: 'D', text: '10 years (until 2036)', textNe: '१० वर्ष (सन् २०३६ सम्म)' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'The EU provides an automatic 3-year EBA transition grace period post-graduation (until late 2029), during which Nepal aims to secure EU GSP+ status by fulfilling 27 core international human rights, labour, climate, and governance conventions.',
    explanationNe:
      'स्तरोन्नतिपछि पनि युरोपेली सङ्घले ३ वर्ष (सन् २०२९ सम्म) EBA सुविधा निरन्तरता दिन्छ र त्यसपछि GSP+ प्राप्त गर्न २७ अन्तर्राष्ट्रिय महासन्धिको कार्यान्वयन आवश्यक पर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Smooth Transition Strategy (STS) — NPC & MoFA',
    sourcePath: '/materials/mofa-ifa-2024.pdf',
  },
  {
    id: 'PSC-CA-521',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-ECON',
    topic: 'Monetary Policy & Central Banking',
    subtopicId: 'CA-ECON-02',
    subtopic: 'NRB Interest Rate Corridor',
    question:
      'Under Nepal Rastra Bank’s monetary operating framework (NRB Act, 2058), what constitute the upper bound and lower bound of the Interest Rate Corridor respectively?',
    questionNe:
      'नेपाल राष्ट्र बैंकको मौद्रिक नीति सञ्चालन ढाँचामा ब्याजदर करिडोर (Interest Rate Corridor) को माथिल्लो सीमा र तल्लो सीमा क्रमशः कुन-कुन दर हुन्?',
    options: [
      {
        key: 'A',
        text: 'Bank Rate (upper bound) and Standing Deposit Facility / Deposit Collection Rate (lower bound)',
        textNe: 'बैंक दर (माथिल्लो सीमा) र स्थायी निक्षेप सुविधा / निक्षेप संकलन दर (तल्लो सीमा)',
      },
      {
        key: 'B',
        text: 'Treasury Bill Rate (upper bound) and Inflation Rate (lower bound)',
        textNe: 'ट्रेजरी बिल दर (माथिल्लो) र मुद्रास्फीति दर (तल्लो)',
      },
      {
        key: 'C',
        text: 'Base Rate (upper bound) and Exchange Rate (lower bound)',
        textNe: 'आधार दर (माथिल्लो) र विनिमय दर (तल्लो)',
      },
      {
        key: 'D',
        text: 'Customs Tariff (upper bound) and VAT Rate (lower bound)',
        textNe: 'भन्सार दर (माथिल्लो) र VAT दर (तल्लो)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'NRB’s Interest Rate Corridor sets the Bank Rate (SLF rate) as the ceiling, the Policy Rate (Repo rate) in the middle, and the Standing Deposit Facility (SDF) rate as the floor to anchor interbank money market rates.',
    explanationNe:
      'राष्ट्र बैंकको ब्याजदर करिडोरमा बैंक दर (SLF) माथिल्लो सीमा, नीतिगत दर मध्य विन्दु र स्थायी निक्षेप सुविधा (SDF) तल्लो सीमाका रूपमा रहन्छन्।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NRB Monetary Policy FY 2083/84 — Nepal Rastra Bank',
    sourcePath: '/materials/nrb-monetary-policy-2083-84.pdf',
  },
  {
    id: 'PSC-CA-522',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-GOV',
    topic: 'Anti-Corruption & CPI Index',
    subtopicId: 'CA-GOV-03',
    subtopic: 'Transparency International CPI',
    question:
      'In Transparency International’s Corruption Perceptions Index (CPI) 2024 evaluating 180 countries, what score (out of 100) and global rank did Nepal receive?',
    questionNe:
      'ट्रान्सपरेन्सी इन्टरनेसनलद्वारा १८० देश समेटेर सार्वजनिक गरिएको भ्रष्टाचार अवधारणा सूचकाङ्क (CPI २०२४) मा नेपालले १०० मा कति अङ्क र विश्व वरीयतामा कतिऔँ स्थान प्राप्त गर्‍यो?',
    options: [
      { key: 'A', text: 'Score 35 / Rank 108th', textNe: '३५ अङ्क / १०८ औँ स्थान' },
      { key: 'B', text: 'Score 50 / Rank 72nd', textNe: '५० अङ्क / ७२ औँ स्थान' },
      { key: 'C', text: 'Score 28 / Rank 145th', textNe: '२८ अङ्क / १४५ औँ स्थान' },
      { key: 'D', text: 'Score 68 / Rank 26th', textNe: '६८ अङ्क / २६ औँ स्थान' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Nepal scored 35/100 (ranked 108th out of 180 countries/territories in CPI 2024), remaining below the 50 threshold indicating persistent public-sector corruption vulnerability.',
    explanationNe:
      'CPI २०२४ मा नेपालले ३५ अङ्क सहित १०८ औँ स्थान प्राप्त गरेको छ (१०० मा ५० भन्दा कम अङ्क गम्भीर भ्रष्टाचार जोखिमको सूचक मानिन्छ)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'CIAA 35th Annual Report & CPI Governance Brief',
    sourcePath: '/materials/ciaa-35th-report.pdf',
  },
  {
    id: 'PSC-CA-523',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-NAT',
    topic: 'Demography & National Accounts',
    subtopicId: 'CA-NAT-01',
    subtopic: 'National Census 2078 Key Indicators',
    question:
      'What are Nepal’s official Total Population, Annual Population Growth Rate, and Total Literacy Rate according to the Final Report of National Census 2078 (NSO)?',
    questionNe:
      'राष्ट्रिय जनगणना २०७८ को अन्तिम नतिजाअनुसार नेपालको कुल जनसङ्ख्या, वार्षिक जनसङ्ख्या वृद्धिदर र कुल साक्षरता दर (५ वर्ष वा सोभन्दा माथि) कति रहेको छ?',
    options: [
      {
        key: 'A',
        text: 'Population 29,164,578; Growth rate 0.92%; Literacy 76.2%',
        textNe: 'जनसङ्ख्या २,९१,६४,५७८; वृद्धिदर ०.९२%; साक्षरता दर ७६.२%',
      },
      {
        key: 'B',
        text: 'Population 26,494,504; Growth rate 1.35%; Literacy 65.9%',
        textNe: 'जनसङ्ख्या २,६४,९४,५०४; वृद्धिदर १.३५%; साक्षरता दर ६५.९%',
      },
      {
        key: 'C',
        text: 'Population 31,200,000; Growth rate 1.85%; Literacy 82.5%',
        textNe: 'जनसङ्ख्या ३,१२,००,०००; वृद्धिदर १.८५%; साक्षरता दर ८२.५%',
      },
      {
        key: 'D',
        text: 'Population 28,050,100; Growth rate 0.45%; Literacy 71.0%',
        textNe: 'जनसङ्ख्या २,८०,५०,१००; वृद्धिदर ०.४५%; साक्षरता दर ७१.०%',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Census 2078 recorded a population of 29,164,578 (48.96% male, 51.04% female), the lowest inter-censal annual growth rate in 80 years (0.92%), and an overall literacy rate of 76.2% (83.6% male, 69.4% female).',
    explanationNe:
      'राष्ट्रिय जनगणना २०७८ अनुसार कुल जनसङ्ख्या २ करोड ९१ लाख ६४ हजार ५७८, वार्षिक वृद्धिदर ०.९२% र साक्षरता दर ७६.२% (पुरुष ८३.६%, महिला ६९.४%) रहेको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'National Census 2078 Monograph — NSO',
    sourcePath: '/materials/nso-census-2078.pdf',
  },
  {
    id: 'PSC-CA-524',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-GOV',
    topic: 'Recent Governance Directives',
    subtopicId: 'CA-GOV-04',
    subtopic: 'OPMCM Procurement Labour Procedure 2083',
    question:
      'What key mandate does the OPMCM Procedure 2083 on Public Procurement Workers impose on contractors executing government civil works?',
    questionNe:
      'प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालयले लागू गरेको "सार्वजनिक खरिदमा आबद्ध श्रमिकको पारिश्रमिक तथा सामाजिक सुरक्षा कार्यविधि, २०८३" ले निर्माण ठेकेदारलाई के अनिवार्य गरेको छ?',
    options: [
      {
        key: 'A',
        text: 'Pay statutory minimum wages via banking/digital channels and enroll workers in the Contribution-Based Social Security Fund (SSF)',
        textNe: 'श्रमिकलाई न्यूनतम पारिश्रमिक बैंक/डिजिटल माध्यमबाट भुक्तानी गरी योगदानमा आधारित सामाजिक सुरक्षा कोष (SSF) मा आबद्ध गराउनु',
      },
      {
        key: 'B',
        text: 'Allow only cash daily-wage settlements without written payroll',
        textNe: 'कुनै अभिलेख बिना नगद दैनिक ज्याला मात्र भुक्तानी गर्नु',
      },
      {
        key: 'C',
        text: 'Exempt public works contractors from Labour Act, 2074 compliance',
        textNe: 'सार्वजनिक ठेक्का श्रमिकलाई श्रम ऐन, २०७४ बाट उन्मुक्ति दिनु',
      },
      {
        key: 'D',
        text: 'Transfer worker recruitment exclusively to the Election Commission',
        textNe: 'श्रमिक छनोटको जिम्मा निर्वाचन आयोगलाई दिनु',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'The 2083 OPMCM Procedure links Public Procurement Act, 2063 billing clearances to verified banking payment of statutory minimum wages and enrollment in the Social Security Fund (SSF) under Labour Act, 2074.',
    explanationNe:
      'उक्त कार्यविधि २०८३ ले सार्वजनिक निर्माण ठेक्कामा खटिने श्रमिकको न्यूनतम ज्याला बैंक खाताबाट भुक्तानी र सामाजिक सुरक्षा कोष (SSF) दर्ता अनिवार्य गरी रनिङ बिल भुक्तानीसँग आबद्ध गरेको छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'OPMCM Procedure 2083 on Public Contracting Labour Security',
    sourcePath: '/materials/opmcm-procurement-labour-2083.pdf',
  },
  {
    id: 'PSC-CA-525',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration / ICT',
    post: 'Section Officer / Nayab Subba / NTC Level 7 target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-GOV',
    topic: 'Digital Governance & Nagarik App',
    subtopicId: 'CA-GOV-05',
    subtopic: 'Digital Nepal Framework',
    question:
      'Under Nepal’s Digital Nepal Framework (DNF), how many foundational/priority sectors and digital transformation initiatives were structured to accelerate paperless governance alongside the Nagarik App?',
    questionNe:
      'नेपाल सरकारको "डिजिटल नेपाल फ्रेमवर्क" (Digital Nepal Framework) अन्तर्गत नागरिक एप र कागजरहित सेवा विस्तारका लागि मुख्य कति क्षेत्र (Sectors) र कति पहल (Initiatives) तय गरिएका छन्?',
    options: [
      { key: 'A', text: '8 sectors and 80 initiatives', textNe: '८ क्षेत्र र ८० पहलहरू' },
      { key: 'B', text: '5 sectors and 25 initiatives', textNe: '५ क्षेत्र र २५ पहलहरू' },
      { key: 'C', text: '12 sectors and 120 initiatives', textNe: '१२ क्षेत्र र १२० पहलहरू' },
      { key: 'D', text: '3 sectors and 30 initiatives', textNe: '३ क्षेत्र र ३० पहलहरू' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'The Digital Nepal Framework maps 80 digital initiatives across 8 sectors (Digital Foundation, Agriculture, Health, Education, Energy, Tourism, Finance, and Urban Infrastructure), complemented by single-window citizen integration on the Nagarik App.',
    explanationNe:
      'डिजिटल नेपाल फ्रेमवर्कमा डिजिटल पूर्वाधार, कृषि, स्वास्थ्य, शिक्षा, ऊर्जा, पर्यटन, वित्त र सहरी पूर्वाधार गरी ८ क्षेत्र र ८० पहलहरू समाविष्ट छन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Digital Nepal Framework & MoCIT e-Governance Brief',
    sourcePath: '/materials/nepal-bimonthly-256.pdf',
  },
  {
    id: 'PSC-CA-526',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'Administration / Foreign Service',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-INTL',
    topic: 'Foreign Policy & Multilateral Forums',
    subtopicId: 'CA-INTL-03',
    subtopic: 'Constitution Art. 51(m) & Panchasheel',
    question:
      'Which foundational principles guide Nepal’s Foreign Policy under Article 51(m) of the Constitution and the Foreign Policy 2077 White Paper? (Select all correct options)',
    questionNe:
      'संविधानको धारा ५१(ड) तथा नेपालको परराष्ट्र नीति २०७७ अनुसार नेपालको परराष्ट्र नीतिलाई निर्देशित गर्ने मुख्य सिद्धान्तहरू कुन-कुन हुन्? (सही सबै विकल्प छान्नुहोस्)',
    options: [
      { key: 'A', text: 'Five Principles of Peaceful Coexistence (Panchasheel)', textNe: 'पञ्चशीलको सिद्धान्त' },
      { key: 'B', text: 'Charter of the United Nations and Non-Alignment (NAM)', textNe: 'संयुक्त राष्ट्रसंघको बडापत्र र असंलग्नता' },
      { key: 'C', text: 'International law and norms of world peace', textNe: 'अन्तर्राष्ट्रिय कानुन र विश्व शान्तिको मान्यता' },
      { key: 'D', text: 'Joining permanent military defense pacts with neighboring powers', textNe: 'छिमेकी शक्तिहरूसँग स्थायी सैन्य गठबन्धनमा आबद्ध हुने नीति' },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Article 51(m) anchors Nepal’s independent foreign policy in Panchasheel, UN Charter, Non-Alignment, international law, and world peace—strictly avoiding military alliances.',
    explanationNe:
      'धारा ५१(ड) ले पञ्चशील, राष्ट्रसंघीय बडापत्र, असंलग्नता, अन्तर्राष्ट्रिय कानुन र विश्व शान्तिलाई परराष्ट्र नीतिको आधार मानेको छ; सैन्य गठबन्धनमा संलग्न नहुने नीति छ।',
    difficulty: 'Easy',
    marks: 2,
    sourceTitle: 'Nepal Foreign Policy, 2077 — MoFA',
    sourcePath: '/materials/nepal-foreign-policy-2077.pdf',
  },
  {
    id: 'PSC-CA-527',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-GOV',
    topic: 'Executive Decisions & RTI Disclosure',
    subtopicId: 'CA-GOV-06',
    subtopic: 'Cabinet & Quarterly Swatah Prakashan',
    question:
      'How frequently must every public body in Nepal update and publish its proactive disclosure ("Swatah Prakashan") report under Section 5(3) of the Right to Information Act, 2064?',
    questionNe:
      'सूचनाको हक सम्बन्धी ऐन, २०६४ को दफा ५(३) बमोजिम प्रत्येक सार्वजनिक निकायले आफ्नो कामकारबाहीसम्बन्धी विवरण "स्वतः प्रकाशन" कति-कति समयमा अद्यावधिक गरी सार्वजनिक गर्नुपर्दछ?',
    options: [
      { key: 'A', text: 'Every month', textNe: 'प्रत्येक महिना' },
      { key: 'B', text: 'Every 3 months (Quarterly)', textNe: 'प्रत्येक ३ महिनामा (त्रैमासिक)' },
      { key: 'C', text: 'Once every year', textNe: 'वर्षमा एक पटक' },
      { key: 'D', text: 'Every 5 years', textNe: 'प्रत्येक ५ वर्षमा' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Section 5(3) of the RTI Act, 2064 requires public bodies to publish 20+ categories of organizational, financial, and decision data every three months as "Swatah Prakashan" (proactive disclosure).',
    explanationNe:
      'सूचनाको हक ऐन २०६४ को दफा ५(३) ले सार्वजनिक निकायलाई प्रत्येक ३–३ महिनामा (त्रैमासिक रूपमा) स्वतः प्रकाशन सार्वजनिक गर्न अनिवार्य गरेको छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NPC Proactive Disclosure & RTI Rules',
    sourcePath: '/materials/rti-act-2064.pdf',
  },
  {
    id: 'PSC-CA-528',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-NAT',
    topic: 'Regional Connectivity & Transport',
    subtopicId: 'CA-NAT-04',
    subtopic: 'Kathmandu–Terai Fast Track Tunnels',
    question:
      'Under the Kathmandu–Terai/Madhesh Fast Track (Expressway) National Pride Project, which Nepali security/state institution manages overall execution, and between which two endpoints does the 70.977 km highway connect?',
    questionNe:
      'राष्ट्रिय गौरवको काठमाडौँ–तराई/मधेश द्रुतमार्ग (७०.९७७ कि.मि.) कुन संस्थाको व्यवस्थापनमा निर्माण भइरहेको छ र यसले कुन दुई बिन्दुलाई जोड्दछ?',
    options: [
      {
        key: 'A',
        text: 'Nepali Army; connects Khokana (Lalitpur) to Nijgadh (Bara)',
        textNe: 'नेपाली सेना; खोकना (ललितपुर) देखि निजगढ (बारा)',
      },
      {
        key: 'B',
        text: 'Department of Roads; connects Thankot to Birgunj directly',
        textNe: 'सडक विभाग; थानकोटदेखि वीरगन्ज',
      },
      {
        key: 'C',
        text: 'Armed Police Force; connects Dhulikhel to Janakpur',
        textNe: 'सशस्त्र प्रहरी बल; धुलिखेलदेखि जनकपुर',
      },
      {
        key: 'D',
        text: 'Investment Board Nepal; connects Pokhara to Lumbini',
        textNe: 'लगानी बोर्ड नेपाल; पोखरादेखि लुम्बिनी',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Managed by the Nepali Army since 2074 BS, the 70.977 km 4-lane Asian Highway Class-I expressway connects Khokana (Lalitpur) to Nijgadh (Bara) via major twin-tube tunnels including Dhedre, Lendanda, and Mahadevdanda.',
    explanationNe:
      'नेपाली सेनाको व्यवस्थापनमा निर्माणाधीन ७०.९७७ कि.मि. लामो द्रुतमार्गले ललितपुरको खोकनादेखि बाराको निजगढ (पूर्व–पश्चिम राजमार्ग) लाई जोड्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Nepal Parichaya 14th Edition (2083 BS) — DoIB',
    sourcePath: '/materials/nepal-parichaya-2083.pdf',
  },
  {
    id: 'PSC-CA-529',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-INTL',
    topic: 'Regional & Multilateral Organizations',
    subtopicId: 'CA-INTL-04',
    subtopic: 'BIMSTEC, SAARC & UN Peacekeeping',
    question:
      'In which international regional grouping headquartered in Dhaka (Bangladesh) does Nepal serve as a member bridging South Asia and Southeast Asia across seven Bay of Bengal littoral/hinterland nations?',
    questionNe:
      'दक्षिण एसिया र दक्षिण–पूर्वी एसियालाई जोड्ने बङ्गालको खाडी क्षेत्रका सात सदस्य राष्ट्रहरूको कुन क्षेत्रीय सङ्गठनको सचिवालय बङ्गलादेशको ढाकामा रहेको छ र नेपाल त्यसको सक्रिय सदस्य हो?',
    options: [
      { key: 'A', text: 'SAARC', textNe: 'सार्क (SAARC)' },
      { key: 'B', text: 'BIMSTEC', textNe: 'बिम्स्टेक (BIMSTEC)' },
      { key: 'C', text: 'ASEAN', textNe: 'आसियान (ASEAN)' },
      { key: 'D', text: 'SCO', textNe: 'शाङ्घाई सहयोग सङ्गठन (SCO)' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'BIMSTEC (Bay of Bengal Initiative for Multi-Sectoral Technical and Economic Cooperation), whose Permanent Secretariat is in Dhaka, unites Bangladesh, Bhutan, India, Myanmar, Nepal, Sri Lanka, and Thailand (SAARC Secretariat is in Kathmandu).',
    explanationNe:
      'नेपाल सदस्य रहेको बिम्स्टेक (BIMSTEC) को स्थायी सचिवालय ढाकामा छ (सार्क सचिवालय काठमाडौँमा रहेको छ)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'Report on Nepal’s Foreign Affairs — MoFA',
    sourcePath: '/materials/mofa-annual-report.pdf',
  },
  {
    id: 'PSC-CA-530',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-ECON',
    topic: 'Planning & Economic Policy',
    subtopicId: 'CA-ECON-03',
    subtopic: 'Monitoring & Evaluation Act 2080 & MTEF',
    question:
      'What statutory horizon does Nepal’s rolling Medium-Term Expenditure Framework (MTEF) cover to bridge annual budgets with the Sixteenth Periodic Plan?',
    questionNe:
      'वार्षिक बजेटलाई आवधिक योजनासँग आबद्ध गर्न नेपालमा लागू गरिएको मध्यमकालीन खर्च संरचना (MTEF) ले कति वर्षको रोलिङ वित्तीय खाका समेट्दछ?',
    options: [
      { key: 'A', text: '2 years', textNe: '२ वर्ष' },
      { key: 'B', text: '3 years (e.g., FY 2083/84–2085/86)', textNe: '३ वर्ष (जस्तै: आ.व. २०८३/८४–२०८५/८६)' },
      { key: 'C', text: '5 years fixed non-rolling', textNe: 'स्थिर ५ वर्ष' },
      { key: 'D', text: '10 years', textNe: '१० वर्ष' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'MTEF is a 3-year rolling fiscal framework (current fiscal year budget + 2 forward outer years) linking macro-fiscal resource envelopes with P1/P2/P3 priorities under the Financial Procedures and Fiscal Accountability Act, 2076 and M&E Act, 2080.',
    explanationNe:
      'मध्यमकालीन खर्च संरचना (MTEF) आगामी तीन आर्थिक वर्षको रोलिङ वित्तीय प्रक्षेपण खाका हो, जसले वार्षिक बजेटलाई पी–१, पी–२ र पी–३ प्राथमिकतासँग जोड्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'MTEF & SDG Costing Strategy — NPC',
    sourcePath: '/materials/sixteenth-plan-2081-86.pdf',
  },
  {
    id: 'PSC-CA-531',
    level: 'General PSC practice',
    service: 'Federal Civil Service preparation',
    group: 'General Administration',
    post: 'Section Officer / Nayab Subba target',
    paper: 'Paper I: General Knowledge (Current Affairs)',
    subject: 'Current Affairs & Samasamayik',
    topicId: 'CA-ENV',
    topic: 'Climate Diplomacy & International Events',
    subtopicId: 'CA-ENV-02',
    subtopic: 'Nepal GHG Share & Disaster Resilience',
    question:
      'Which statements accurately describe Nepal’s global greenhouse gas (GHG) footprint and mountain climate diplomacy position at UN COP summits? (Select all correct options)',
    questionNe:
      'संयुक्त राष्ट्रसंघीय जलवायु सम्मेलन (COP) हरूमा नेपालको हरितगृह ग्यास उत्सर्जन हिस्सा र पर्वतीय कूटनीतिबारे कुन-कुन कथन सत्य छन्? (सही सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Nepal contributes roughly ~0.027% of global GHG emissions yet ranks among the top 10–20 countries most vulnerable to climate disasters',
        textNe: 'नेपालले विश्वको करिब ०.०२७% मात्र हरितगृह ग्यास उत्सर्जन गरे पनि जलवायु जोखिमका हिसाबले उच्च संवेदनशील मुलुकमा पर्दछ',
      },
      {
        key: 'B',
        text: 'Nepal advocates direct grant-based access (rather than debt-creating loans) under the Loss and Damage Fund for Himalayan GLOF adaptation',
        textNe: 'नेपालले हानि–नोक्सानी कोष (Loss and Damage Fund) बाट ऋणको साटो सिधा अनुदान पहुँचको माग गर्दै आएको छ',
      },
      {
        key: 'C',
        text: 'Nepal targets achieving Net-Zero greenhouse gas emissions by 2045 AD',
        textNe: 'नेपालले सन् २०४५ सम्म खुद शून्य (Net-Zero) उत्सर्जन हासिल गर्ने लक्ष्य राखेको छ',
      },
      {
        key: 'D',
        text: 'Nepal relies primarily on domestic coal-fired thermal power plants for 85% of grid electricity',
        textNe: 'नेपालको राष्ट्रिय विद्युत् ग्रिडको ८५% ऊर्जा आन्तरिक कोइलाबाट उत्पादन हुन्छ',
      },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Statements A, B, and C reflect Nepal’s official Nationally Determined Contribution (NDC) and COP29 mountain agenda; Nepal’s grid generation is overwhelmingly clean hydropower, not coal (D).',
    explanationNe:
      'A, B र C सही छन् (०.०२७% उत्सर्जन हिस्सा, अनुदान आधारित Loss & Damage पहुँच र सन् २०४५ Net-Zero लक्ष्य); नेपालको विद्युत् उत्पादन मुख्यतः स्वच्छ जलविद्युत्‌मा आधारित छ।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'Environment Protection Act 2076 & MoFA COP Brief',
    sourcePath: '/materials/nepal-foreign-policy-2077.pdf',
  },
];

export const EXTRA_NTC_TECH_QUESTIONS: QuizQuestion[] = [
  {
    id: 'NTC-L7-016',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Networking & Telecom Core',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-NET',
    topic: 'Routing Protocols & MPLS',
    subtopicId: 'NTC-NET-02',
    subtopic: 'BGP & OSPF',
    question:
      'In carrier-grade IP backbones used by telecom operators, which transport protocol and port does BGP-4 use, and what underlying graph algorithm does OSPF compute for shortest-path trees?',
    questionNe:
      'टेलिकम अपरेटरको IP ब्याकबोनमा BGP-4 ले कुन ट्रान्सपोर्ट प्रोटोकल र पोर्ट प्रयोग गर्दछ, र OSPF ले छोटो मार्ग गणना गर्न कुन अल्गोरिदम प्रयोग गर्दछ?',
    options: [
      {
        key: 'A',
        text: 'BGP uses TCP port 179; OSPF runs Dijkstra’s Shortest Path First (SPF) algorithm over IP protocol 89',
        textNe: 'BGP ले TCP पोर्ट १७९ प्रयोग गर्छ; OSPF ले IP प्रोटोकल ८९ मा Dijkstra को SPF अल्गोरिदम चलाउँछ',
      },
      {
        key: 'B',
        text: 'BGP uses UDP port 520; OSPF runs Bellman-Ford distance vector',
        textNe: 'BGP ले UDP पोर्ट ५२० र OSPF ले Bellman-Ford प्रयोग गर्छ',
      },
      {
        key: 'C',
        text: 'BGP uses ICMP echo; OSPF runs spanning tree (STP)',
        textNe: 'BGP ले ICMP र OSPF ले STP प्रयोग गर्छ',
      },
      {
        key: 'D',
        text: 'BGP uses TCP port 80; OSPF runs Dual/EIGRP algorithm',
        textNe: 'BGP ले TCP पोर्ट ८० र OSPF ले DUAL अल्गोरिदम चलाउँछ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'BGP-4 establishes peering sessions over reliable TCP port 179 (path-vector exterior routing), whereas OSPF is a link-state interior protocol riding directly over IP protocol number 89 using Dijkstra’s SPF algorithm.',
    explanationNe:
      'BGP-4 ले TCP पोर्ट १७९ प्रयोग गर्छ र OSPF ले IP प्रोटोकल नम्बर ८९ माथि Dijkstra को SPF अल्गोरिदमद्वारा राउटिङ टेबल बनाउँछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Data Communication',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-017',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Telecom & Mobile Core',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-TEL',
    topic: '5G NR & LTE EPC Core',
    subtopicId: 'NTC-TEL-01',
    subtopic: '5G Service-Based Architecture',
    question:
      'In a 5G Standalone (SA) Service-Based Architecture (SBA), which core network function handles user-plane packet routing and forwarding (analogous to LTE S-GW/P-GW user plane)?',
    questionNe:
      '5G Standalone (SA) सेवा–आधारित आर्किटेक्चर (SBA) मा प्रयोगकर्ताको डेटा प्याकेट राउटिङ र फरवार्डिङ (User Plane) सम्हाल्ने मुख्य कोर नेटवर्क फङ्सन कुन हो?',
    options: [
      { key: 'A', text: 'UPF (User Plane Function)', textNe: 'UPF (User Plane Function)' },
      { key: 'B', text: 'AUSF (Authentication Server Function)', textNe: 'AUSF (Authentication Server Function)' },
      { key: 'C', text: 'UDM (Unified Data Management)', textNe: 'UDM (Unified Data Management)' },
      { key: 'D', text: 'NRF (Network Repository Function)', textNe: 'NRF (Network Repository Function)' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      '5G SBA separates Control and User Planes (CUPS): AMF handles mobility/access control, SMF manages sessions, UDM stores subscriber profiles, and UPF performs high-throughput user-plane packet routing, QoS enforcement, and GTP-U tunneling.',
    explanationNe:
      '5G SBA मा नियन्त्रण र डेटा सतह अलग हुन्छन्: AMF र SMF ले सिग्नलिङ/सेसन सम्हाल्छन् भने UPF ले वास्तविक युजर डेटा प्याकेट राउटिङ तथा QoS प्रवाह गर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Telecom Networks',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-018',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Optical & Access Networks',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-TEL',
    topic: 'Optical Fiber & FTTH',
    subtopicId: 'NTC-TEL-02',
    subtopic: 'Single-Mode Fiber & DWDM',
    question:
      'Why do long-haul optical backbones and FTTH networks use Single-Mode Fiber (SMF, ~9 µm core) operating in the C-band (~1550 nm) instead of 850 nm Multi-Mode Fiber?',
    questionNe:
      'लामो दूरीको अप्टिकल ब्याकबोन र FTTH सञ्जालमा ८५० nm मल्टि–मोड फाइबरको सट्टा करिब १५५० nm (C-band) मा चल्ने सिङ्गल–मोड फाइबर (SMF) किन प्रयोग गरिन्छ?',
    options: [
      {
        key: 'A',
        text: 'SMF eliminates intermodal dispersion and 1550 nm offers the lowest silica attenuation (~0.2 dB/km) plus EDFA amplification support',
        textNe: 'SMF ले इन्टरमोडल डिस्पर्सन हटाउँछ र १५५० nm मा न्यूनतम एटेन्युएसन (~०.२ dB/km) तथा EDFA एम्प्लिफिकेसन सम्भव हुन्छ',
      },
      {
        key: 'B',
        text: 'SMF works solely with cheap plastic cores and red LEDs',
        textNe: 'SMF मा सस्तो प्लास्टिक कोर र रातो LED मात्र प्रयोग हुन्छ',
      },
      {
        key: 'C',
        text: '1550 nm maximizes Rayleigh scattering losses intentionally',
        textNe: '१५५० nm ले जानिबुझी Rayleigh scattering क्षति अधिकतम बनाउँछ',
      },
      {
        key: 'D',
        text: 'Multi-mode fiber cannot carry frequencies above 10 MHz',
        textNe: 'मल्टि–मोड फाइबरले १० MHz भन्दा माथिको सिग्नल बोक्न सक्दैन',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Single-mode fiber allows only the fundamental LP01 propagation mode (eliminating modal dispersion), while the 1530–1565 nm C-band achieves minimal silica fiber loss (~0.18–0.22 dB/km) and aligns with Erbium-Doped Fiber Amplifiers (EDFAs) for DWDM.',
    explanationNe:
      'सिङ्गल–मोड फाइबरमा एउटै मात्र लाइट मोड प्रसारण हुने हुँदा मोडल डिस्पर्सन शून्यप्रायः हुन्छ र १५५० nm (C-band) मा क्षीणन (Attenuation) न्यूनतम तथा EDFA द्वारा DWDM सिग्नल प्रवर्द्धन सहज हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Optical Communication',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-019',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Core Computer Engineering',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DSA',
    topic: 'Asymptotic Time Complexity',
    subtopicId: 'NTC-DSA-02',
    subtopic: 'Sorting & Graph Complexity',
    question:
      'Which worst-case time complexity characterizes Binary Heap construction (build-heap via bottom-up heapify) on an unsorted array of n elements, and which sorting algorithm guarantees O(n log n) even in the worst case?',
    questionNe:
      'n ओटा तत्त्व भएको अव्यवस्थित एरेबाट Bottom-up Binary Heap निर्माण गर्ने समय जटिलता (Time Complexity) र Worst Case मा समेत सधैँ O(n log n) ग्यारेन्टी गर्ने सर्टिङ अल्गोरिदम कुन-कुन हुन्?',
    options: [
      {
        key: 'A',
        text: 'Build-heap is Θ(n); Merge Sort / Heap Sort guarantee O(n log n) worst case',
        textNe: 'Build-heap Θ(n) र Merge Sort / Heap Sort ले Worst case मा O(n log n) दिन्छन्',
      },
      {
        key: 'B',
        text: 'Build-heap is Θ(n²); QuickSort guarantees O(n log n) worst case',
        textNe: 'Build-heap Θ(n²) र QuickSort ले Worst case मा O(n log n) दिन्छ',
      },
      {
        key: 'C',
        text: 'Build-heap is Θ(n log n); Insertion Sort guarantees O(n log n) worst case',
        textNe: 'Build-heap Θ(n log n) र Insertion Sort ले O(n log n) दिन्छ',
      },
      {
        key: 'D',
        text: 'Build-heap is Θ(log n); Bubble Sort guarantees O(n log n) worst case',
        textNe: 'Build-heap Θ(log n) र Bubble Sort ले O(n log n) दिन्छ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Floyd’s bottom-up build-heap takes linear Θ(n) time because most nodes reside near leaves with small sift-down heights. Merge Sort and Heap Sort guarantee O(n log n) worst-case complexity, unlike standard QuickSort (O(n²) worst case).',
    explanationNe:
      'तल्लो तहका अधिकांश नोडमा sift-down कम हुने भएकाले build-heap को समय जटिलता Θ(n) मात्र हुन्छ र Merge Sort / Heap Sort ले worst case मा समेत O(n log n) ग्यारेन्टी गर्दछन्।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Data Structures & Algorithms',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-020',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Core Computer Engineering',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-OS',
    topic: 'Process Scheduling & Deadlocks',
    subtopicId: 'NTC-OS-02',
    subtopic: 'Deadlocks & Banker Algorithm',
    question:
      'Which four Coffman conditions must hold SIMULTANEOUSLY for a resource deadlock to occur in an operating system? (Select all correct options)',
    questionNe:
      'अपरेटिङ सिस्टममा डेडलक (Deadlock) उत्पन्न हुनका लागि कुन चार Coffman सर्तहरू एकैसाथ पूरा हुनुपर्दछ?',
    options: [
      { key: 'A', text: 'Mutual Exclusion and Hold-and-Wait', textNe: 'Mutual Exclusion र Hold-and-Wait' },
      { key: 'B', text: 'No Preemption of allocated resources', textNe: 'बाँडफाँट भइसकेका स्रोतहरूको No Preemption' },
      { key: 'C', text: 'Circular Wait among a cycle of processes', textNe: 'प्रक्रियाहरूबिच Circular Wait चक्र' },
      { key: 'D', text: 'Round-Robin CPU time slicing enabled', textNe: 'Round-Robin CPU टाइम स्लाइसिङ चालु हुनु' },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Deadlock requires all four Coffman conditions simultaneously: (1) Mutual Exclusion, (2) Hold and Wait, (3) No Preemption, and (4) Circular Wait. CPU time slicing (D) is a scheduling policy, not a deadlock condition.',
    explanationNe:
      'डेडलकका चार अनिवार्य सर्त Mutual Exclusion, Hold-and-Wait, No Preemption र Circular Wait हुन्; Round-Robin सेड्युलिङ सर्त होइन।',
    difficulty: 'Easy',
    marks: 2,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Operating Systems',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-021',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Core Computer Engineering',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DBMS',
    topic: 'Indexing & Concurrency Control',
    subtopicId: 'NTC-DBMS-02',
    subtopic: 'B+ Trees & Strict 2PL',
    question:
      'Why do relational database engines prefer B+ Trees over standard B-Trees for secondary and clustered disk indexes?',
    questionNe:
      'रिलेसनल डाटाबेस इन्जिनहरूले डिस्क इन्डेक्सिङका लागि सामान्य B-Tree भन्दा B+ Tree लाई किन प्राथमिकता दिन्छन्?',
    options: [
      {
        key: 'A',
        text: 'Internal nodes store only routing keys (higher fan-out, shallower height) and all leaf nodes are linked sequentially for fast range scans',
        textNe: 'आन्तरिक नोडमा Key मात्र रहने हुँदा उचाइ कम (उच्च fan-out) हुन्छ र सबै Leaf नोड Linked List मा जोडिने हुँदा Range Scan तीव्र हुन्छ',
      },
      {
        key: 'B',
        text: 'B+ Trees do not require balanced leaf depths',
        textNe: 'B+ Tree मा Leaf नोडहरू सन्तुलित (Balanced) हुनु पर्दैन',
      },
      {
        key: 'C',
        text: 'B+ Trees eliminate disk I/O by disabling write-ahead logging',
        textNe: 'B+ Tree ले WAL लगिङ बन्द गरेर डिस्क I/O हटाउँछ',
      },
      {
        key: 'D',
        text: 'B+ Trees store data rows randomly at the root node only',
        textNe: 'B+ Tree ले सबै डेटा रूट नोडमा मात्र भण्डारण गर्दछ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Keeping satellite/record pointers strictly in leaf nodes maximizes internal node fan-out (fewer disk block reads to reach leaves), while sibling pointers across leaves support sequential range queries without re-traversing upper levels.',
    explanationNe:
      'B+ Tree मा वास्तविक रेकर्ड पोइन्टर Leaf मा मात्र राखिँदा आन्तरिक नोडमा धेरै Key अटाउँछन् र Leaf नोडहरू एकअर्कामा लिङ्क भएकाले RANGE क्वेरी छिटो हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — DBMS',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-022',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Core Computer Engineering',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-ARCH',
    topic: 'Parallelism & Amdahl Law',
    subtopicId: 'NTC-ARCH-02',
    subtopic: 'Amdahl Law Speedup',
    question:
      'A telecom billing batch job spends 80% of its runtime in parallelizable loops and 20% in a strictly sequential phase. According to Amdahl’s Law, what is the theoretical maximum speedup even with an infinite number of CPU cores?',
    questionNe:
      'एउटा बिलिङ प्रोसेसको ८०% भाग प्यारलल चलाउन मिल्ने र २०% भाग अनिवार्य क्रमिक (Sequential) छ भने Amdahl को नियमअनुसार अनन्त CPU कोर राख्दा समेत अधिकतम सैद्धान्तिक Speedup कति हुन्छ?',
    options: [
      { key: 'A', text: '4×', textNe: '४×' },
      { key: 'B', text: '5×', textNe: '५×' },
      { key: 'C', text: '10×', textNe: '१०×' },
      { key: 'D', text: 'Infinite (∞)', textNe: 'अनन्त (∞)' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'By Amdahl’s Law, Speedup_max = 1 / ((1 − p) + p/N). As N → ∞ with p = 0.80, Speedup_max = 1 / (1 − 0.80) = 1 / 0.20 = 5×.',
    explanationNe:
      'Amdahl को नियम Speedup = 1 / ((1 − 0.80) + 0.80/∞) = 1 / 0.20 = ५× हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Computer Architecture',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-023',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Signals, DSP & Modulation',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DSP',
    topic: 'Sampling & Nyquist Theorem',
    subtopicId: 'NTC-DSP-02',
    subtopic: 'Nyquist Rate & PCM',
    question:
      'A standard ITU-T G.711 PSTN voice channel limits analog speech bandwidth to 4 kHz and samples at 8 kHz with 8 bits per sample (PCM). What is the resulting uncompressed bit rate of one DS0 voice channel?',
    questionNe:
      'मानक ITU-T G.711 टेलिफोन भ्वाइस च्यानलले ४ kHz ब्यान्डविथलाई ८ kHz दरमा प्रतिस्याम्पल ८ बिट (PCM) का दरले स्याम्पलिङ गर्दा एउटा DS0 च्यानलको बिट दर कति हुन्छ?',
    options: [
      { key: 'A', text: '32 kbps', textNe: '३२ kbps' },
      { key: 'B', text: '64 kbps', textNe: '६४ kbps' },
      { key: 'C', text: '128 kbps', textNe: '१२८ kbps' },
      { key: 'D', text: '2.048 Mbps', textNe: '२.०४८ Mbps' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Bit rate = Sampling frequency × Bits per sample = 8,000 samples/sec × 8 bits/sample = 64,000 bps = 64 kbps (30 voice channels + signaling/sync form a 2.048 Mbps E1 frame).',
    explanationNe:
      'बिट दर = ८,००० स्याम्पल/सेकेन्ड × ८ बिट = ६४,००० bps = ६४ kbps हुन्छ (३२ टाइम–स्लट मिलेर २.०४८ Mbps को E1 फ्रेम बन्छ)।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — DSP & Digital Telephony',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-024',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Cryptography & Network Security',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-SEC',
    topic: 'TLS 1.3 & Public Key Infrastructure',
    subtopicId: 'NTC-SEC-02',
    subtopic: 'Perfect Forward Secrecy & TLS 1.3',
    question:
      'How does TLS 1.3 enforce Perfect Forward Secrecy (PFS) and improve handshake latency over TLS 1.2?',
    questionNe:
      'TLS 1.3 ले Perfect Forward Secrecy (PFS) कसरी सुनिश्चित गर्दछ र TLS 1.2 को तुलनामा ह्यान्डसेक विलम्बता (Latency) कसरी घटाउँछ?',
    options: [
      {
        key: 'A',
        text: 'Mandates ephemeral Diffie-Hellman (ECDHE/DHE) key exchange (removing static RSA key transport) and completes initial handshakes in 1-RTT',
        textNe: 'स्थिर RSA की–ट्रान्सपोर्ट हटाई Ephemeral Diffie-Hellman (ECDHE) अनिवार्य गर्छ र १-RTT मै ह्यान्डसेक सम्पन्न गर्छ',
      },
      {
        key: 'B',
        text: 'Transmits symmetric AES keys in plaintext inside DNS TXT records',
        textNe: 'सिमेट्रिक AES कीहरू DNS TXT रेकर्डमा प्लेनटेक्स्ट पठाउँछ',
      },
      {
        key: 'C',
        text: 'Uses RC4 stream cipher with 3-RTT negotiation',
        textNe: 'RC4 साइफर र ३-RTT नेगोसिएसन प्रयोग गर्छ',
      },
      {
        key: 'D',
        text: 'Disables server X.509 certificate verification',
        textNe: 'सर्भर X.५०९ प्रमाणपत्र जाँच बन्द गर्दछ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'TLS 1.3 eliminates static RSA key exchange and legacy broken primitives (RC4, MD5, SHA-1, CBC ciphers), requiring ephemeral (EC)DHE for Forward Secrecy and cutting standard handshakes down to 1-RTT (0-RTT resumption supported).',
    explanationNe:
      'TLS 1.3 ले स्थिर RSA की विनिमय हटाई Ephemeral (EC)DHE मार्फत Forward Secrecy अनिवार्य गर्छ र 1-RTT मा ह्यान्डसेक पूरा गर्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Network Security',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-025',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Software Engineering & DevOps',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-SE',
    topic: 'Architecture & Reliability',
    subtopicId: 'NTC-SE-02',
    subtopic: 'Cohesion, Coupling & CAP Theorem',
    question:
      'In well-modularized enterprise telecom software architecture, which combination of module coupling and cohesion reflects optimal maintainability?',
    questionNe:
      'उच्च गुणस्तरको मोड्युलर सफ्टवेयर डिजाइनमा मर्मतसंहार र स्केलेबिलिटीका लागि Coupling र Cohesion को आदर्श संयोजन कुन हो?',
    options: [
      { key: 'A', text: 'Low (loose) Coupling and High Cohesion', textNe: 'न्यून (Loose) Coupling र उच्च (High) Cohesion' },
      { key: 'B', text: 'High (tight) Coupling and Low Cohesion', textNe: 'उच्च (Tight) Coupling र न्यून Cohesion' },
      { key: 'C', text: 'Content Coupling and Coincidental Cohesion', textNe: 'Content Coupling र Coincidental Cohesion' },
      { key: 'D', text: 'Zero Cohesion and Global Common Coupling', textNe: 'शून्य Cohesion र Common Coupling' },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Low coupling minimizes inter-module dependency/ripple effects when changing code, while high (especially Functional) cohesion ensures each module performs a single well-defined responsibility.',
    explanationNe:
      'मोड्युलहरूबिच निर्भरता कम (Low Coupling) र एउटै मोड्युलभित्रका कार्यहरूबिच एकरूपता उच्च (High Cohesion) हुनु उत्तम सफ्टवेयर डिजाइनको मूल सिद्धान्त हो।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Software Engineering',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-026',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: Distributed Systems',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DIST',
    topic: 'CAP Theorem & Consensus',
    subtopicId: 'NTC-DIST-02',
    subtopic: 'CAP Trade-offs & Raft',
    question:
      'According to Brewer’s CAP Theorem, during an unavoidable network partition (P) in a distributed database cluster, what fundamental trade-off must the system architect choose between?',
    questionNe:
      'ब्रेवरको CAP प्रमेय (CAP Theorem) अनुसार वितरित डाटाबेस प्रणालीमा नेटवर्क विभाजन (Partition) हुँदा प्रणालीले मुख्यतया कुन दुई गुणबिच एक रोज्नुपर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Linearizable Consistency (C) versus Availability (A)',
        textNe: 'स्थिरता/समानता (Consistency) र उपलब्धता (Availability) बिचको छनोट',
      },
      {
        key: 'B',
        text: 'Encryption versus Compression',
        textNe: 'इन्क्रिप्सन र कम्प्रेसन',
      },
      {
        key: 'C',
        text: 'Normalization versus Foreign Keys',
        textNe: 'नर्मलाइजेसन र फरेन की',
      },
      {
        key: 'D',
        text: 'DNS Caching versus ARP Resolution',
        textNe: 'DNS क्यासिङ र ARP रिजल्युसन',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'In distributed systems, network partitions (P) can occur over real WAN links; when partitioned, nodes must either reject writes/reads on the minority side to keep Consistency (CP, e.g., etcd/Raft) or serve potentially stale responses to remain Available (AP).',
    explanationNe:
      'वास्तविक नेटवर्कमा Partition (P) रोक्न नसकिने हुँदा विभाजनको बेला प्रणालीले Consistency (CP) वा Availability (AP) मध्ये एकलाई प्राथमिकता दिनुपर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Distributed Computing',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-027',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: AI & Machine Learning',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-AI',
    topic: 'Machine Learning Evaluation & Overfitting',
    subtopicId: 'NTC-AI-02',
    subtopic: 'Precision, Recall & Regularization',
    question:
      'In telecom fraud detection where fraudulent calls represent only 0.5% of traffic, why is raw Accuracy misleading and which metrics/techniques should engineers evaluate instead? (Select all correct options)',
    questionNe:
      'केवल ०.५% मात्र फ्रड (असङ्गत) ट्राफिक हुने टेलिकम फ्रड डिटेक्सन मोडेलमा केवल Accuracy मात्र किन भ्रामक हुन्छ र सट्टामा के-कस्ता मूल्याङ्कन विधि प्रयोग गरिन्छ? (सही सबै विकल्प छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'A trivial classifier predicting "non-fraud" always still scores 99.5% accuracy while catching zero fraud',
        textNe: 'सबैलाई "सामान्य" मात्र अनुमान गर्ने मोडेलले समेत ९९.५% Accuracy देखाउँछ तर एउटा पनि फ्रड पक्रँदैन',
      },
      {
        key: 'B',
        text: 'Precision, Recall, F1-Score, and Precision-Recall AUC measure minority-class detection faithfully',
        textNe: 'Precision, Recall, F1-Score र PR-AUC ले अल्पसङ्ख्यक वर्गको वास्तविक कार्यक्षमता मापन गर्छन्',
      },
      {
        key: 'C',
        text: 'Stratified k-fold cross-validation preserves class proportions across folds',
        textNe: 'Stratified k-fold cross-validation ले प्रत्येक फोल्डमा वर्ग अनुपात सुरक्षित राख्दछ',
      },
      {
        key: 'D',
        text: 'Removing all validation sets eliminates variance error automatically',
        textNe: 'भ्यालिडेसन सेट हटाउँदा मोडेलको Variance त्रुटि स्वतः शून्य हुन्छ',
      },
    ],
    correct_options: ['A', 'B', 'C'],
    is_multi_select: true,
    explanation:
      'Under severe class imbalance, Accuracy hides false negatives; Precision/Recall/F1/PR-AUC and Stratified cross-validation properly evaluate minority-class detection.',
    explanationNe:
      'वर्ग असन्तुलन (Class Imbalance) हुँदा Accuracy ले False Negative लुकाउँछ; तसर्थ Precision, Recall, F1-Score र Stratified Cross-Validation प्रयोग गरिन्छ।',
    difficulty: 'Medium',
    marks: 2,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — AI & Data Analytics',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-028',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I: General Section — Telecom Regulation',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-LAW',
    topic: 'Telecom Regulatory Governance',
    subtopicId: 'NTC-LAW-02',
    subtopic: 'Telecommunications Act 2053 & RTDF',
    question:
      'Under Section 30(4) of the Telecommunications Act, 2053 (1997) and Rural Telecommunications Development Fund (RTDF) Bylaws, what percentage of annual gross income must telecom licensees deposit into the RTDF managed by NTA?',
    questionNe:
      'दूरसञ्चार ऐन, २०५३ को दफा ३०(४) बमोजिम दूरसञ्चार सेवा प्रदायकहरूले आफ्नो वार्षिक कुल आयको कति प्रतिशत रकम ग्रामीण दूरसञ्चार विकास कोष (RTDF) मा जम्मा गर्नुपर्दछ?',
    options: [
      { key: 'A', text: '1% of annual gross income', textNe: 'वार्षिक कुल आयको १%' },
      { key: 'B', text: '2% of annual gross income', textNe: 'वार्षिक कुल आयको २%' },
      { key: 'C', text: '4% of annual gross income', textNe: 'वार्षिक कुल आयको ४%' },
      { key: 'D', text: '10% of annual net profit', textNe: 'वार्षिक खुद नाफाको १०%' },
    ],
    correct_options: ['B'],
    is_multi_select: false,
    explanation:
      'Section 30(4) of the Telecommunications Act, 2053 mandates licensees to contribute 2% of their annual gross income to the Rural Telecommunications Development Fund (RTDF) alongside the 4% Royalty under Section 32.',
    explanationNe:
      'दूरसञ्चार ऐन, २०५३ को दफा ३०(४) अनुसार अनुमतिपत्र प्राप्त संस्थाले वार्षिक कुल आयको २% रकम ग्रामीण दूरसञ्चार विकास कोष (RTDF) मा जम्मा गर्नुपर्दछ (र दफा ३२ अनुसार ४% रोयल्टी छुट्टै लाग्छ)।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Telecommunications Act, 2053 (दूरसञ्चार ऐन, २०५३)',
    sourcePath: '/materials/telecommunications-act-2053.pdf',
  },
  {
    id: 'NTC-L7-029',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Networking & Protocols',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-NET',
    topic: 'TCP Congestion & Flow Control',
    subtopicId: 'NTC-NET-03',
    subtopic: 'TCP Windowing & Congestion Control',
    question:
      'In TCP data transmission, what distinguishes Flow Control from Congestion Control?',
    questionNe:
      'TCP डेटा प्रसारणमा Flow Control र Congestion Control बिचको मुख्य भिन्नता के हो?',
    options: [
      {
        key: 'A',
        text: 'Flow control prevents overflowing the receiver’s buffer (via rwnd); Congestion control prevents overloading intermediate network links/routers (via cwnd)',
        textNe: 'Flow Control ले प्रापकको बफर ओभरफ्लो हुन नदिन (rwnd) र Congestion Control ले मध्यवर्ती नेटवर्क र राउटर ओभरलोड हुन नदिन (cwnd) गति नियन्त्रण गर्दछन्',
      },
      {
        key: 'B',
        text: 'Flow control operates at Layer 1 physical cables only',
        textNe: 'Flow Control भौतिक तह (Layer 1) मा मात्र काम गर्दछ',
      },
      {
        key: 'C',
        text: 'Congestion control uses ARP broadcast replies exclusively',
        textNe: 'Congestion Control ले ARP ब्रोडकास्ट मात्र प्रयोग गर्दछ',
      },
      {
        key: 'D',
        text: 'Both terms mean changing MAC addresses per hop',
        textNe: 'दुवैले प्रत्येक हपमा MAC ठेगाना परिवर्तन गर्ने काम गर्दछन्',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'TCP limits unacknowledged in-flight bytes to min(rwnd, cwnd): rwnd (advertised receive window) enforces end-to-end flow control for the receiver, whereas cwnd (congestion window via Slow Start/AIMD) protects shared network routers.',
    explanationNe:
      'TCP ले पठाउने डेटा सीमा min(rwnd, cwnd) बाट निर्धारण गर्छ: rwnd ले प्रापकको क्षमता (Flow Control) र cwnd ले नेटवर्कको चाप (Congestion Control) नियन्त्रण गर्दछन्।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Computer Networks',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-030',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II: Digital Logic & VLSI',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-VLSI',
    topic: 'Digital Logic & Finite State Machines',
    subtopicId: 'NTC-VLSI-02',
    subtopic: 'Mealy vs Moore FSM & Flip-Flops',
    question:
      'How does a Moore Finite State Machine differ from a Mealy Finite State Machine in synchronous digital circuit design?',
    questionNe:
      'सिङ्क्रोनस डिजिटल सर्किट डिजाइनमा Moore Finite State Machine र Mealy Finite State Machine बिच के आधारभूत भिन्नता हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'Moore outputs depend solely on the current state; Mealy outputs depend on both the current state and current inputs',
        textNe: 'Moore मेसिनको आउटपुट वर्तमान अवस्था (State) मा मात्र निर्भर हुन्छ भने Mealy मेसिनको आउटपुट वर्तमान अवस्था र इनपुट दुवैमा निर्भर हुन्छ',
      },
      {
        key: 'B',
        text: 'Mealy machines never use flip-flops or clock signals',
        textNe: 'Mealy मेसिनमा फ्लिप–फ्लप वा क्लक सिग्नल हुँदैन',
      },
      {
        key: 'C',
        text: 'Moore machines always require fewer states than Mealy machines',
        textNe: 'Moore मेसिनलाई सधैँ Mealy भन्दा कम स्टेट चाहिन्छ',
      },
      {
        key: 'D',
        text: 'Mealy outputs change only on asynchronous reset pulses',
        textNe: 'Mealy आउटपुट असिङ्क्रोनस रिसेटमा मात्र परिवर्तन हुन्छ',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'A Moore machine’s outputs are a pure function of its state registers (glitch-free across input transitions), whereas a Mealy machine’s outputs depend on both current state and present inputs (often requiring fewer states and responding faster within one clock cycle).',
    explanationNe:
      'Moore मेसिनको आउटपुट वर्तमान स्टेटमा मात्र निर्भर हुने हुँदा ग्लिच–मुक्त हुन्छ, जबकि Mealy को आउटपुट स्टेट र इनपुट दुवैमा निर्भर भई कम स्टेटमै छिटो प्रतिक्रिया दिन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus — Digital Logic & VLSI',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
];
