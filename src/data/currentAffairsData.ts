/**
 * Current Affairs & Samasamayik (समसामयिक) Knowledge Base for PSC Nepal
 * Curated specifically for Lok Sewa Gazetted & Non-Gazetted Examinations:
 * Section Officer (शाखा अधिकृत), Nayab Subba (ना.सु.), and Kharidar (खरिदार).
 */

export type CurrentAffairCategory =
  | 'national'
  | 'economy'
  | 'international'
  | 'science-environment'
  | 'governance'
  | 'sports-awards';

export interface CurrentAffairItem {
  id: string;
  titleEn: string;
  titleNe: string;
  dateBS: string;
  dateAD: string;
  monthBS: string; // e.g. '२०८१ फागुन', '२०८१ माघ', '२०८१ पुस'
  category: CurrentAffairCategory;
  categoryLabelEn: string;
  categoryLabelNe: string;
  cadreRelevance: Array<'section-officer' | 'nayab-subba' | 'kharidar'>;
  paperRelevance: string;
  summaryEn: string;
  summaryNe: string;
  keyFacts: string[];
  examTip: string;
  likes: number;
  dislikes: number;
  views: number;
  pinned?: boolean;
  source: string;
}

export const CURRENT_AFFAIRS_CATEGORIES: Array<{
  id: CurrentAffairCategory;
  labelEn: string;
  labelNe: string;
  color: 'amber' | 'emerald' | 'blue' | 'purple' | 'crimson' | 'zinc';
}> = [
  { id: 'national', labelEn: 'National Affairs', labelNe: 'राष्ट्रिय मामिला', color: 'amber' },
  { id: 'economy', labelEn: 'Economy & Budget', labelNe: 'आर्थिक तथा बजेट', color: 'emerald' },
  { id: 'governance', labelEn: 'Governance & Laws', labelNe: 'सुशासन तथा कानुन', color: 'blue' },
  { id: 'international', labelEn: 'International & Diplomacy', labelNe: 'अन्तर्राष्ट्रिय सम्बन्ध', color: 'purple' },
  { id: 'science-environment', labelEn: 'Science & Climate', labelNe: 'विज्ञान, प्रविधि र वातावरण', color: 'emerald' },
  { id: 'sports-awards', labelEn: 'Awards & Sports', labelNe: 'पुरस्कार, खेलकुद र व्यक्तित्व', color: 'crimson' },
];

export const CURRENT_AFFAIRS_ITEMS: CurrentAffairItem[] = [
  {
    id: 'ca-2081-01',
    titleEn: '16th Periodic Five-Year Plan (2081/82–2085/86) Officially Approved',
    titleNe: '१६ औँ पञ्चवर्षीय आवधिक योजना (२०८१/८२–२०८५/८६) मन्त्रिपरिषद्बाट स्वीकृत',
    dateBS: '२०८१ जेठ',
    dateAD: 'May 2024',
    monthBS: '२०८१ जेठ',
    category: 'economy',
    categoryLabelEn: 'Economy & Budget',
    categoryLabelNe: 'आर्थिक तथा बजेट',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK), Paper II (Economic Planning), Paper III (Development)',
    summaryEn:
      'National Planning Commission (NPC) finalized the 16th Periodic Plan anchored around "Good Governance, Social Justice, and Prosperity" (सुशासन, सामाजिक न्याय र समृद्धि). The plan sets economic growth, human capital development, and structural transformations as central targets.',
    summaryNe:
      'राष्ट्रिय योजना आयोगद्वारा तर्जुमा गरिएको १६ औँ आवधिक योजनाको मुख्य नारा "सुशासन, सामाजिक न्याय र समृद्धि" तय गरिएको छ। योजनाले आर्थिक वृद्धि, संरचनात्मक रूपान्तरण र रोजगारी सिर्जनालाई उच्च प्राथमिकता दिएको छ।',
    keyFacts: [
      'Core Motto: Good Governance, Social Justice, and Prosperity (सुशासन, सामाजिक न्याय र समृद्धि)',
      'Target Average Economic Growth Rate: 7.3% (वार्षिक औसत आर्थिक वृद्धिदर लक्ष्य: ७.३ प्रतिशत)',
      'Poverty Reduction Target: Reduce multi-dimensional poverty from 17.4% to below 11%',
      'LDC Graduation Pathway: Smooth, irreversible, and sustainable graduation target by November 2026',
      'Structural Reform Sectors: 12 key transformation areas including digital governance, agricultural industrialization, and clean energy',
    ],
    examTip:
      'High probability in Section Officer Paper II long questions: "Explain the vision, goals, and structural transformation pillars of the 16th Plan."',
    likes: 342,
    dislikes: 4,
    views: 4890,
    pinned: true,
    source: 'National Planning Commission (NPC) / राष्ट्रिय योजना आयोग',
  },
  {
    id: 'ca-2081-02',
    titleEn: 'Federal Budget 2081/82 Outlay & Revenue Mobilization Framework',
    titleNe: 'आर्थिक वर्ष २०८१/८२ को संघीय बजेट (कुल विनियोजन रु. १८ खर्ब ६० अर्ब ३० करोड)',
    dateBS: '२०८१ जेठ १५',
    dateAD: 'May 28, 2024',
    monthBS: '२०८१ जेठ',
    category: 'economy',
    categoryLabelEn: 'Economy & Budget',
    categoryLabelNe: 'आर्थिक तथा बजेट',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK), Paper II (Fiscal Policy & Public Finance)',
    summaryEn:
      'Finance Minister presented the FY 2081/82 budget of Rs 18.603 trillion, emphasizing structural economic reform, investment climate rejuvenation, production growth, and fiscal discipline across federal and sub-national levels.',
    summaryNe:
      'अर्थमन्त्रीद्वारा प्रस्तुत आव २०८१/८२ को कुल बजेट रु. १८ खर्ब ६० अर्ब ३० करोड रहेको छ। चालुतर्फ रु. ११ खर्ब ४० अर्ब ६६ करोड (६१.३१%), पुँजीगततर्फ रु. ३ खर्ब ५२ अर्ब ३५ करोड (१८.९४%), र वित्तीय व्यवस्थातर्फ रु. ३ खर्ब ६७ अर्ब २८ करोड (१९.७४%) विनियोजन गरिएको छ।',
    keyFacts: [
      'Total Budget Allocation: NPR 18 Kharba 60 Arba 30 Crore (Rs. 1,860.30 Billion)',
      'Recurrent Expenditure (चालु खर्च): 61.31% (Rs 1,140.66 Billion)',
      'Capital Expenditure (पुँजीगत खर्च): 18.94% (Rs 352.35 Billion)',
      'Financing / Debt Servicing (वित्तीय व्यवस्था): 19.74% (Rs 367.28 Billion) — notably surpassing capital budget for the second consecutive year',
      'Revenue Target: NPR 1,260 Billion from internal taxes and non-tax sources',
      'Target Economic Growth Rate: 6.0% with Inflation ceiling capped below 5.5%',
    ],
    examTip:
      'Essential for Na.Su. & Section Officer: Compare Capital vs Financial Management expenditure trends and discuss causes of declining capital capital absorption.',
    likes: 289,
    dislikes: 6,
    views: 4120,
    pinned: true,
    source: 'Ministry of Finance, Government of Nepal (अर्थ मन्त्रालय)',
  },
  {
    id: 'ca-2081-03',
    titleEn: 'Tripartite Power Trade Agreement: Nepal, India, and Bangladesh',
    titleNe: 'नेपाल, भारत र बङ्गलादेशबीच ऐतिहासिक त्रिपक्षीय विद्युत् व्यापार सम्झौता',
    dateBS: '२०८१ असोज १७',
    dateAD: 'October 3, 2024',
    monthBS: '२०८१ असोज',
    category: 'international',
    categoryLabelEn: 'International & Diplomacy',
    categoryLabelNe: 'अन्तर्राष्ट्रिय सम्बन्ध',
    cadreRelevance: ['section-officer', 'nayab-subba'],
    paperRelevance: 'Paper I (Current Affairs), Paper III (Foreign Policy & Energy Diplomacy)',
    summaryEn:
      'Nepal signed a landmark tripartite agreement in Kathmandu to export 40 MW of electricity to Bangladesh via the Indian transmission grid during the wet season (June 15 to November 15 each year), ushering in regional sub-continental power trading.',
    summaryNe:
      'नेपाल विद्युत् प्राधिकरण, भारतको एनटिपिसी विद्युत् व्यापार निगम (NVVN) र बङ्गलादेश पावर डेभलपमेन्ट बोर्ड (BPDB) बीच काठमाडौँमा ४० मेगावाट विद्युत् निर्यात गर्ने त्रिपक्षीय सम्झौतामा हस्ताक्षर भएको छ।',
    keyFacts: [
      'Export Volume: 40 Megawatts (MW) of clean hydro power',
      'Annual Period: 5 months (June 15 – November 15) during high river discharge',
      'Transmission Route: Dhalkebar–Muzaffarpur 400kV line through India to Bheramara (Bangladesh)',
      'Tariff Rate: Approximately 6.4 US Cents per kilowatt-hour (kWh)',
      'Strategic Landmark: First time Nepal exports energy to a third country beyond India',
    ],
    examTip:
      'Frequently framed in Section Officer Paper III on "Sub-regional energy integration: opportunities, bottlenecks, and geopolitical significance for Nepal."',
    likes: 412,
    dislikes: 2,
    views: 5240,
    pinned: false,
    source: 'Nepal Electricity Authority (NEA) & Ministry of Energy',
  },
  {
    id: 'ca-2081-04',
    titleEn: 'Federal Civil Service Bill Progress & Age Limit Revisions',
    titleNe: 'संघीय निजामती सेवा विधेयक २०८० को संसदीय दफावार छलफल र मुख्य प्रावधान',
    dateBS: '२०८१ मङ्सिर',
    dateAD: 'December 2024',
    monthBS: '२०८१ मङ्सिर',
    category: 'governance',
    categoryLabelEn: 'Governance & Laws',
    categoryLabelNe: 'सुशासन तथा कानुन',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (Public Admin), Paper II (Civil Service Laws & Bureaucracy)',
    summaryEn:
      'Parliamentary State Affairs and Good Governance Committee advanced deliberations on the long-pending Federal Civil Service Bill, defining inter-tier civil service adjustments, retirement age criteria, and inclusive reservation quotas.',
    summaryNe:
      'राज्य व्यवस्था तथा सुशासन समितिमा विचाराधीन संघीय निजामती सेवा विधेयकमा अवकाश उमेर हद ५८ बाट ६० वर्ष बनाउने, तहगत प्रणाली लागू गर्ने र ट्रेड युनियन अधिकारबारे गहन छलफल भएको छ।',
    keyFacts: [
      'Retirement Age: Proposed phased transition from 58 years to 60 years',
      'System Transition: Shift from Class-based (श्रेणीगत) to Tier/Level-based (तहगत - तह १ देखि १५ सम्म) structure',
      'Chief Administrative Officers (प्रमुख प्रशासकीय अधिकृत): Retained as Federal Civil Service deputation to safeguard federal liaison',
      'Affirmative Action (समावेशी कोटा): Proposed adjustment to 49% reservation with mandatory creamy layer exclusions',
      'Trade Union Rights: Deliberations on single official trade union vs multi-union structures',
    ],
    examTip:
      'Mandatory topic for Section Officer & Na.Su. Paper II: "Evaluate the major structural transitions proposed in the Federal Civil Service Bill."',
    likes: 512,
    dislikes: 11,
    views: 6410,
    pinned: true,
    source: 'Parliament Secretariat & Ministry of Federal Affairs and General Administration',
  },
  {
    id: 'ca-2081-05',
    titleEn: 'Transparency International CPI 2024: Nepal Scores 35 Ranks 108th',
    titleNe: 'ट्रान्सपरेन्सी इन्टरनेसनल भ्रष्टाचार अवधारणा सूचकाङ्क (CPI २०२४): नेपाल १०८ औँ स्थानमा',
    dateBS: '२०८१ माघ',
    dateAD: 'January 2025',
    monthBS: '२०८१ माघ',
    category: 'governance',
    categoryLabelEn: 'Governance & Laws',
    categoryLabelNe: 'सुशासन तथा कानुन',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK), Paper II (Anti-Corruption & Integrity in Governance)',
    summaryEn:
      'Transparency International released its Corruption Perceptions Index (CPI) ranking 180 countries. Nepal received a score of 35/100 (108th rank), persisting in the "high corruption vulnerability" bracket and underscoring institutional accountability deficits.',
    summaryNe:
      'ट्रान्सपरेन्सी इन्टरनेसनलद्वारा जारी प्रतिवेदन अनुसार नेपाल ३५ अङ्क सहित १०८ औँ स्थानमा रहेको छ। १८० देशहरूमा १०० मा ५० भन्दा कम अङ्क ल्याउने मुलुकहरूमा भ्रष्टाचार गम्भीर समस्या भएको मानिन्छ।',
    keyFacts: [
      'Nepal CPI Score: 35 out of 100 (Threshold below 50 indicates endemic corruption risks)',
      'Global Rank: 108th out of 180 evaluated nations and territories',
      'South Asia Comparison: Bhutan ranked best (68 pts, 26th), while Nepal placed behind Bhutan and India',
      'Key Weaknesses Cited: Political patronage, public procurement irregularities, delays in judicial adjudication, and weak internal control mechanisms',
      'Constitutional Organs: CIAA (अख्तियार), Auditor General (महालेखापरीक्षक), and NVC (राष्ट्रिय सतर्कता केन्द्र)',
    ],
    examTip:
      'Very common in written exams: "Analyze the reasons behind Nepal\'s stagnant CPI score and suggest statutory & structural remedies for integrity."',
    likes: 275,
    dislikes: 5,
    views: 3880,
    pinned: false,
    source: 'Transparency International / ट्रान्सपरेन्सी इन्टरनेसनल नेपाल',
  },
  {
    id: 'ca-2081-06',
    titleEn: 'Kathmandu-Terai/Madhesh Fast Track (द्रुतमार्ग) Progress & Tunneled Sections',
    titleNe: 'काठमाडौँ–तराई/मधेश द्रुतमार्ग (फास्ट ट्र्याक): सुरुङमार्ग तथा पुल निर्माण प्रगति',
    dateBS: '२०८१ पुस',
    dateAD: 'January 2025',
    monthBS: '२०८१ पुस',
    category: 'national',
    categoryLabelEn: 'National Affairs',
    categoryLabelNe: 'राष्ट्रिय मामिला',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK & Pride Projects), Paper III (Infrastructure & Connectivity)',
    summaryEn:
      'Nepal Army-supervised 70.977 km National Pride Project achieved historic breakthroughs on multiple tunnels (Dhedre, Lendanda, and Chhauredanda), cutting travel time between the capital valley and Nijgadh to under 1.5 hours upon completion.',
    summaryNe:
      'नेपाली सेनाद्वारा निर्माणाधीन ७०.९७७ कि.मी. लामो काठमाडौँ–तराई द्रुतमार्गमा लेनडाँडा, धेद्रे र महादेवडाँडा सुरुङमार्गको ‘ब्रेक थ्रु’ सम्पन्न भएको छ। आयोजनाको परिमार्जित लागत करिब रु. २ खर्ब ११ अर्ब ९८ करोड छ।',
    keyFacts: [
      'Total Length: 70.977 km (Asian Highway Class I Standard, 4 lanes)',
      'Starting Point: Khokana (Lalitpur) — Ending Point: Nijgadh (Bara)',
      'Total Tunnels: 6 twin-tube tunnels (Total tunnel length approx 10.055 km)',
      'Breakthrough Completed: Lendanda (१,६१२ मि.), Dhedre (१,६३३ मि.)',
      'Total Bridges: 89 bridges (including special high bridges up to 80m height)',
      'Contractor Model: Managed by Nepali Army with specialized international EPC contractors',
    ],
    examTip:
      'Crucial for Kharidar & Na.Su. Paper I: Remember the exact length (70.977 km), key tunnel names, and starting/ending points.',
    likes: 318,
    dislikes: 3,
    views: 4560,
    pinned: false,
    source: 'Nepali Army Fast Track Project Directorate',
  },
  {
    id: 'ca-2081-07',
    titleEn: 'Madan Puraskar & Jagadamba Shree Honors for 2080 BS Awarded',
    titleNe: 'विसं २०८० को मदन पुरस्कार ‘भोकको लेखापढी’ र जगदम्बा–श्री प्रा. डा. योगेन्द्रप्रसाद यादवलाई',
    dateBS: '२०८१ भाद्र',
    dateAD: 'September 2024',
    monthBS: '२०८१ भाद्र',
    category: 'sports-awards',
    categoryLabelEn: 'Awards & Sports',
    categoryLabelNe: 'पुरस्कार, खेलकुद र व्यक्तित्व',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (Objective General Knowledge — Literature & Honors)',
    summaryEn:
      'Madan Puraskar Guthi announced the prestigious Madan Puraskar 2080 for Mohan Mainali’s non-fiction research work "Bhokko Lekhapadi" (भोकको लेखापढी), and conferred Jagadamba-Shree 2080 upon senior linguist Prof. Dr. Yogendra Prasad Yadav.',
    summaryNe:
      'मदन पुरस्कार गुठीले वर्ष २०८० को मदन पुरस्कार मोहन मैनालीको गैरआख्यान कृति "भोकको लेखापढी" लाई र जगदम्बा–श्री २०८० वरिष्ठ भाषाविद् प्रा. डा. योगेन्द्रप्रसाद यादवलाई प्रदान गरेको छ।',
    keyFacts: [
      'Madan Puraskar 2080 Winner: Mohan Mainali (कृति: ‘भोकको लेखापढी’)',
      'Jagadamba-Shree 2080 Winner: Prof. Dr. Yogendra Prasad Yadav (Contributions to Nepal’s linguistic survey & indigenous tongues preservation)',
      'Cash Prize: NPR 400,000 (४ लाख रुपैयाँ) each along with citation plaques',
      'Historical Milestone: First Madan Puraskar was awarded in 2013 BS to Satyamohan Joshi, Chittaranjan Nepali, and Balaram Joshi',
    ],
    examTip:
      'Virtually guaranteed question in Paper I objective GK across all three tiers (Section Officer, Na.Su., Kharidar).',
    likes: 395,
    dislikes: 1,
    views: 5930,
    pinned: false,
    source: 'Madan Puraskar Guthi (मदन पुरस्कार गुठी)',
  },
  {
    id: 'ca-2081-08',
    titleEn: 'Nepal at ICC Men’s T20 World Cup 2024 & Cricket Infrastructure',
    titleNe: 'आईसीसी टी–२० विश्वकप २०२४ मा नेपालको सहभागिता र मूलपानी अन्तर्राष्ट्रिय मैदान',
    dateBS: '२०८१ असार',
    dateAD: 'June 2024',
    monthBS: '२०८१ असार',
    category: 'sports-awards',
    categoryLabelEn: 'Awards & Sports',
    categoryLabelNe: 'पुरस्कार, खेलकुद र व्यक्तित्व',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (Sports GK & Youth Policies)',
    summaryEn:
      'Nepal participated in the ICC Men’s T20 World Cup 2024 held in the United States and the West Indies for the second time in history (after 2014). Government subsequently elevated Mulpani, Kirtipur, and Bharatpur stadiums as National Pride Projects.',
    summaryNe:
      'नेपालले अमेरिका र वेस्टइन्डिजमा आयोजित टी–२० विश्वकप २०२४ मा १० वर्षपछि दोस्रो पटक सहभागिता जनाएको थियो। कप्तान रोहित पौडेलको नेतृत्वमा नेपालले दक्षिण अफ्रिका र बङ्गलादेशसँग प्रतिस्पर्धात्मक खेल खेलेको थियो।',
    keyFacts: [
      'Tournament: ICC Men’s T20 World Cup 2024 (9th Edition)',
      'Host Nations: United States of America & West Indies',
      'Nepal Captain: Rohit Kumar Paudel (रोहित कुमार पौडेल)',
      'Tournament Champion: India (defeated South Africa in final)',
      'National Sports Recognition: Mulpani and Girijaprasad Koirala (Baijanathpur) cricket stadium projects designated with accelerated national priority',
    ],
    examTip:
      'Watch out for captaincy, runner-up nation, and previous participation year (2014 Bangladesh) in objective MCQs.',
    likes: 460,
    dislikes: 7,
    views: 6180,
    pinned: false,
    source: 'Cricket Association of Nepal (CAN) & Ministry of Youth and Sports',
  },
  {
    id: 'ca-2081-09',
    titleEn: 'COP29 Climate Summit in Baku: Nepal Champions Mountain Agenda',
    titleNe: 'बाकुमा सम्पन्न कोप–२९ (COP29) जलवायु सम्मेलनमा नेपालको उच्चस्तरीय उपस्थिति र पर्वतीय एजेन्डा',
    dateBS: '२०८१ मङ्सिर',
    dateAD: 'November 2024',
    monthBS: '२०८१ मङ्सिर',
    category: 'science-environment',
    categoryLabelEn: 'Science & Climate',
    categoryLabelNe: 'विज्ञान, प्रविधि र वातावरण',
    cadreRelevance: ['section-officer', 'nayab-subba'],
    paperRelevance: 'Paper I (Environment GK), Paper III (Climate Change, Loss & Damage Fund)',
    summaryEn:
      'President of Nepal led the official delegation to the UN Climate Conference (COP29) in Baku, Azerbaijan, demanding direct and unhindered access to the Loss and Damage Fund for vulnerable mountain economies facing glacial lake outburst floods (GLOFs).',
    summaryNe:
      'अजरबैजानको बाकुमा आयोजित कोप–२९ सम्मेलनमा सम्माननीय राष्ट्रपति रामचन्द्र पौडेलको नेतृत्वमा नेपालले भाग लिएको थियो। नेपालले हिमाल पग्लिने समस्या, जलवायु न्याय र हानि–नोक्सानी कोष (Loss and Damage Fund) मा सहज पहुँचको माग जोडदार उठायो।',
    keyFacts: [
      'Location: Baku, Azerbaijan (अजरबैजानको बाकु)',
      'New Collective Quantified Goal (NCQG): Tripling global climate finance for developing nations to USD 300 billion annually by 2035',
      'Nepal’s Core Demands: Direct climate grants instead of loans; special mountain vulnerability recognition; operationalization of Loss and Damage Fund',
      'Nepal Vulnerability: Ranked among top 10 most vulnerable nations to climate-induced disasters despite contributing barely 0.027% to global GHG emissions',
      'Target Year for Net Zero Emissions: Nepal committed to Net-Zero GHG emissions by 2045 AD',
    ],
    examTip:
      'Crucial for Section Officer Paper III written questions on "Climate Diplomacy, Mountain Ecology Vulnerability, and Nepal\'s Net-Zero 2045 commitments."',
    likes: 312,
    dislikes: 2,
    views: 4320,
    pinned: false,
    source: 'Ministry of Forests and Environment (वन तथा वातावरण मन्त्रालय)',
  },
  {
    id: 'ca-2081-10',
    titleEn: 'National Census 2078 Demographic Dynamics: Fertility & Urbanization',
    titleNe: 'राष्ट्रिय जनगणना २०७८ को जनसांख्यिक सूचक: प्रजनन दर, सहरीकरण र श्रमशक्ति',
    dateBS: '२०८१',
    dateAD: '2024/2025',
    monthBS: '२०८१',
    category: 'national',
    categoryLabelEn: 'National Affairs',
    categoryLabelNe: 'राष्ट्रिय मामिला',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK), Paper II (Demography & Social Development)',
    summaryEn:
      'National Statistics Office (NSO) analytical monographs highlight unprecedented demographic shifts: Total Fertility Rate (TFR) dropping to 1.94 (below replacement level 2.1), while urban municipal concentration exceeded 66.2%.',
    summaryNe:
      'राष्ट्रिय तथ्याङ्क कार्यालयका अनुसार नेपालको कुल जनसंख्या २ करोड ९१ लाख ६४ हजार ५७८ रहेको छ। कुल प्रजनन दर (TFR) घटेर १.९४ मा झरेको छ भने विदेशमा बसोबास गर्ने नेपालीको संख्या २१ लाख ९० हजार ५९२ पुगेको छ।',
    keyFacts: [
      'Total Population: 29,164,578 (पुरुष: ४८.९६%, महिला: ५१.०४%)',
      'Annual Population Growth Rate: 0.92% (घटदो वृद्धिदर, विगत ८ दशककै न्यून)',
      'Sex Ratio (लैङ्गिक अनुपात): 95.59 males per 100 females',
      'Literacy Rate (साक्षरता दर): 76.2% (पुरुष: ८३.६%, महिला: ६९.४%)',
      'Density of Population: 198 persons per square kilometer',
      'Urban Population Ratio: 66.2% residing in municipalities/metropolitan areas',
      'Absentee Population Abroad: 2,190,592 persons',
    ],
    examTip:
      'High statistical citation value for both Paper I MCQs and Paper II essays on demographic dividend and migration.',
    likes: 421,
    dislikes: 3,
    views: 5740,
    pinned: true,
    source: 'National Statistics Office (NSO) / राष्ट्रिय तथ्याङ्क कार्यालय',
  },
  {
    id: 'ca-2081-11',
    titleEn: 'Digital Nepal Framework 2.0 & Nagarik App Government Services Integration',
    titleNe: 'डिजिटल नेपाल फ्रेमवर्क २.० र नागरिक एपमा सरकारी सेवाहरूको एकीकरण',
    dateBS: '२०८१ कात्तिक',
    dateAD: 'November 2024',
    monthBS: '२०८१ कात्तिक',
    category: 'governance',
    categoryLabelEn: 'Governance & Laws',
    categoryLabelNe: 'सुशासन तथा कानुन',
    cadreRelevance: ['section-officer', 'nayab-subba', 'kharidar'],
    paperRelevance: 'Paper I (GK / IT), Paper II (E-Governance & Public Service Delivery)',
    summaryEn:
      'Ministry of Communication and Information Technology updated the Digital Nepal Framework, integrating police clearance, land ownership records (Mero Kitta), driving license QR verifications, and public health records into the unified Nagarik App platform.',
    summaryNe:
      'डिजिटल नेपाल फ्रेमवर्क अन्तर्गत ८ वटा आयाम र ८० वटा पहलहरूलाई पुनरावलोकन गर्दै नागरिक एप मार्फत ६० भन्दा बढी सरकारी सेवाहरू डिजिटल माध्यमबाट प्रवाह गर्न थालिएको छ।',
    keyFacts: [
      'Digital Nepal Framework: 8 Sectors (Digital Foundation, Agriculture, Health, Education, Energy, Tourism, Finance, and Urban Infrastructure)',
      'Digital Initiatives: 80 specific digital transformation projects',
      'Nagarik App Capabilities: Driving license verification, social security fund status, PAN card registration, educational certificates, and voter ID integration',
      'Paperless Government: Target to eliminate physical document submissions across 90% of basic federal public services by 2085 BS',
    ],
    examTip:
      'Direct relevance for Paper II: "Evaluate the role of e-governance and the Nagarik App in reducing bureaucratic delays and promoting administrative transparency."',
    likes: 298,
    dislikes: 4,
    views: 3990,
    pinned: false,
    source: 'Ministry of Communication and Information Technology (सञ्चार तथा सूचना प्रविधि मन्त्रालय)',
  },
  {
    id: 'ca-2081-12',
    titleEn: 'LDC Graduation Timeline for Nepal: UN Status & Trade Implications',
    titleNe: 'नेपालको अतिकम विकसित मुलुक (LDC) बाट स्तरोन्नति: तयारी, अवसर र चुनौतीहरू',
    dateBS: '२०८१',
    dateAD: '2025/2026 Roadmap',
    monthBS: '२०८१',
    category: 'economy',
    categoryLabelEn: 'Economy & Budget',
    categoryLabelNe: 'आर्थिक तथा बजेट',
    cadreRelevance: ['section-officer', 'nayab-subba'],
    paperRelevance: 'Paper I (GK), Paper II & III (Foreign Trade, GSP Facilities & LDC Strategy)',
    summaryEn:
      'United Nations confirmed Nepal will graduate from the Least Developed Country (LDC) category by November 2026. The government has enacted a Smooth Transition Strategy (STS) to mitigate potential losses of preferential tariff treatments (EBA/GSP) and climate concessional aid.',
    summaryNe:
      'संयुक्त राष्ट्रसंघको महासभाद्वारा स्वीकृत मिति अनुसार नेपाल सन् २०२६ नोभेम्बर २४ मा अतिकम विकसित मुलुक (LDC) बाट विकासशील मुलुकमा स्तरोन्नति हुँदैछ। नेपालले तीनमध्ये दुई सूचक (HAI र EVI) पूरा गरेको छ।',
    keyFacts: [
      'Graduation Effective Date: November 24, 2026',
      'Three UN Criteria: (1) Gross National Income (GNI) per capita; (2) Human Assets Index (HAI); (3) Economic and Environmental Vulnerability Index (EVI)',
      'Nepal Status: Met HAI and EVI criteria successfully for two consecutive triennial reviews, qualifying for graduation despite GNI lagging below the single-criterion threshold',
      'Main Challenges: Potential loss of Duty-Free Quota-Free (DFQF) and Everything But Arms (EBA) access in European and North American markets',
      'Remedial Pathway: Transitioning to EU GSP+ mechanism and negotiating bilateral Free Trade Agreements (FTAs)',
    ],
    examTip:
      'Frequently asked in Section Officer Paper III: "Discuss the economic and commercial implications of Nepal\'s LDC graduation in 2026 and outline transitional safeguards."',
    likes: 382,
    dislikes: 3,
    views: 5120,
    pinned: true,
    source: 'United Nations CDP & National Planning Commission (NPC)',
  },
];
