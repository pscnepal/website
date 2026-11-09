import type { PscCadreSyllabus } from './types.ts';

export const KHARIDAR_SYLLABUS: PscCadreSyllabus = {
  id: 'kharidar',
  shortTitle: 'Kharidar',
  title: 'Non-Gazetted Second Class (Kharidar)',
  nepaliTitle:
    'राजपत्र अनंकित द्वितीय श्रेणी (अप्राविधिक) · खरिदार वा सो सरह (संयुक्त र एकीकृत परीक्षा प्रणाली)',
  rankClassification: 'Non-Gazetted Class II · Non-Technical',
  serviceScope:
    'Justice, Administration (General Admin, Accounts, Revenue), Audit & Legislature-Parliament Service',
  eligibilitySummary:
    'SLC / SEE or equivalent qualification from a recognized board (minimum GPA 2.0 under letter grading; age 18–35 years, up to 40 years for women and persons with disabilities).',
  effectiveFromBs: 'Approved 2081/03/20 BS · Effective from FY 2081/82',
  negativeMarkingPercent: 20,
  screeningPassPercent: 45,
  meritCalculationNote:
    'Stage I (100 Marks: 50 MCQs × 2 Marks) is strictly a qualifying screening test (pass mark: 45, i.e., 45%; 0% of Stage I marks are carried forward). Stage II Common Written Papers (Paper II 100M + Paper III 100M = 200 Marks) + Final Stage Computer Skill Test (10M) & Oral Interview (30M) = 240 Marks establish final merit.',
  generalExamRules: [
    'Stage I Pass Marks: 45 out of 100 (45%) · 20% (-0.40 mark) deducted per wrong MCQ · Calculators prohibited.',
    'Stage I marks are strictly qualifying and are NOT included in Stage II or Final Merit.',
    'Stage II Written Papers (Paper II & Paper III) are common across all non-technical services; separate answer booklets are used per section.',
    'Any Act, Rule, or Policy amended up to 3 months prior to the examination date is included in the syllabus.',
  ],
  syllabusPdfPath: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
  officialPscPdfs: [
    {
      id: 'kh-official-pdf-1',
      phaseLabel: 'Stage I & Exam Scheme (9p)',
      title:
        'Official PSC Kharidar Syllabus — Phase I (GK, BOST & Unified Scheme)',
      nepaliTitle:
        'राजपत्र अनंकित द्वितीय श्रेणी (खरिदार) प्रथम चरण — लोक सेवा आयोगको मूल PDF',
      pages: 9,
      approvedDateBs: '2081/03/20 (Effective FY 2081/82)',
      localPdfPath: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
    },
    {
      id: 'kh-official-pdf-2',
      phaseLabel: 'Stage II Written Papers (4p)',
      title:
        'Official PSC Kharidar Syllabus — Phase II (Paper II & Paper III)',
      nepaliTitle:
        'राजपत्र अनंकित द्वितीय श्रेणी (खरिदार) द्वितीय चरण — लोक सेवा आयोगको मूल PDF',
      pages: 4,
      approvedDateBs: '2081/03/20 (Effective FY 2081/82)',
      localPdfPath: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
    },
  ],
  defaultSimulationPreset: 'kharidar-phase1-omr',
  phases: [
    {
      id: 'kh-phase-1',
      phaseNumber: 1,
      title: 'Stage I · Preliminary Examination (प्रारम्भिक परीक्षा)',
      nepaliTitle: 'प्रथम चरण · प्रारम्भिक वस्तुगत छनोट परीक्षा (OMR)',
      summary:
        '45-minute OMR screening exam (50 MCQs × 2 Marks = 100 Marks) comprising Section A General Knowledge (30 Qs = 60M) and Section B Basic Office Skills Test (20 Qs = 40M). Minimum 45 marks required after 20% negative deduction (-0.40M per wrong answer) to qualify for Stage II.',
      officialPdfPath:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
      papers: [
        {
          id: 'kh-paper-1',
          code: 'Paper I',
          title: 'General Knowledge & Basic Office Skills Test (BOST)',
          nepaliTitle: 'सामान्य ज्ञान तथा आधारभूत कार्यालय सीप परीक्षण',
          examFormat: 'Objective MCQ (OMR)',
          fullMarks: 100,
          passMarks: 45,
          durationLabel: '45 Minutes',
          questionBreakdown:
            '50 MCQs × 2 Marks = 100 Marks (Section A: 30 GK [5 Chapters × 6 Qs] = 60M · Section B: 20 BOST [10 Tests × 2 Qs] = 40M)',
          scoringRule:
            'Pass Marks: 45 (45%) · -0.40M (20%) deducted per wrong response · Calculators prohibited · 0% carryover',
          countsTowardFinalMerit: false,
          units: [
            {
              id: 'kh-p1-u1',
              branchNumber: 1,
              unitCode: 'Section A · Chapters 1–3',
              title:
                'Solar System & Geography (6Q), World/Nepal History (6Q), and Society, Economy & Polity (6Q)',
              nepaliTitle:
                'खण्ड (क) १. सौर्यमण्डल र भूगोल (६), २. इतिहास (६) र ३. सामाजिक, आर्थिक एवं शासन पद्धति (६) — ३६ अङ्क',
              marksWeight: 36,
              branchSummary:
                'Covers Chapters 1, 2, and 3 of Kharidar Section A General Knowledge (18 MCQs × 2 Marks = 36 Marks).',
              subtopics: [
                'Chapter 1 (6 Qs = 12M): Solar system, Earth, continents/oceans, and Nepal’s ecological belts, rivers, lakes, climate & protected areas',
                'Chapter 2 (6 Qs = 12M): Major events of world history and ancient, medieval & modern political/social history of Nepal',
                'Chapter 3 (6 Qs = 12M): Nepalese religions, languages, customs, cultural heritage, economic sectors, periodic plans, and Constitution of Nepal basics',
              ],
              chapters: [
                {
                  id: 'KH-P1-B01-CH01',
                  chapterNumber: 1,
                  code: 'Chapter 1',
                  chapterName: 'Solar System and Geography',
                  nepaliChapterName: '१. सौर्यमण्डल र भूगोल',
                  marksAllocation: '6 Questions × 2 Marks = 12 Marks',
                  chapterBrief:
                    'Tests solar system astronomy, world continents/oceans, and Nepal’s physical and administrative geography.',
                  topics: [
                    {
                      id: 'KH-P1-B01-CH01-T01',
                      topicNumber: 1,
                      code: '1.1',
                      topic: 'Solar System and the Earth',
                      nepaliTopic: 'सौर्यमण्डल र पृथ्वी सम्बन्धी सामान्य जानकारी',
                      brief:
                        'Covers the Sun, 8 planets, satellites, comets, Earth’s origin, interior structure, rotation, revolution, latitude, and longitude.',
                    },
                    {
                      id: 'KH-P1-B01-CH01-T02',
                      topicNumber: 2,
                      code: '1.2',
                      topic: 'General Geography of the World',
                      nepaliTopic: 'विश्वको भूगोल सम्बन्धी सामान्य जानकारी',
                      brief:
                        'Covers continents, oceans, mountain ranges, major rivers, deserts, lakes, earthquakes, and volcanoes.',
                    },
                    {
                      id: 'KH-P1-B01-CH01-T03',
                      topicNumber: 3,
                      code: '1.3',
                      topic: 'Geography and Natural Resources of Nepal',
                      nepaliTopic: 'नेपालको धरातलीय स्वरूप, प्राकृतिक स्रोत र प्रशासनिक विभाजन',
                      brief:
                        'Covers Himal, Pahad, and Terai regions, Koshi/Gandaki/Karnali basins, lakes, climate zones, forests/minerals, and 7 Provinces, 77 Districts, and 753 Local Levels.',
                    },
                  ],
                },
                {
                  id: 'KH-P1-B01-CH02',
                  chapterNumber: 2,
                  code: 'Chapter 2',
                  chapterName: 'World and Nepalese History',
                  nepaliChapterName: '२. विश्व र नेपालको इतिहास',
                  marksAllocation: '6 Questions × 2 Marks = 12 Marks',
                  chapterBrief:
                    'Covers landmark world revolutions/wars and Nepal’s dynastic and modern democratic history.',
                  topics: [
                    {
                      id: 'KH-P1-B01-CH02-T01',
                      topicNumber: 1,
                      code: '2.1',
                      topic: 'Major Events of World History',
                      nepaliTopic: 'विश्वका प्रमुख ऐतिहासिक घटनाहरू',
                      brief:
                        'Covers Industrial Revolution, French Revolution, American Independence, Russian Revolution, First & Second World Wars, and Indian Independence.',
                    },
                    {
                      id: 'KH-P1-B01-CH02-T02',
                      topicNumber: 2,
                      code: '2.2',
                      topic: 'History of Nepal (Ancient, Medieval & Modern)',
                      nepaliTopic: 'नेपालको प्राचीन, मध्यकाल र आधुनिक इतिहास',
                      brief:
                        'Covers Kirat, Licchavi, and Malla social/economic/political life (2.2.1), plus unification, Anglo-Nepal War, Rana rule, 2007, 2046, and 2062/63 democratic movements (2.2.2).',
                    },
                  ],
                },
                {
                  id: 'KH-P1-B01-CH03',
                  chapterNumber: 3,
                  code: 'Chapter 3',
                  chapterName: 'Social, Economic Aspect and Polity of Nepal',
                  nepaliChapterName: '३. सामाजिक, आर्थिक अवस्था र शासन पद्धति',
                  marksAllocation: '6 Questions × 2 Marks = 12 Marks',
                  chapterBrief:
                    'Covers Nepalese cultural diversity, economic infrastructure, periodic plans, and foundational provisions of the Constitution.',
                  topics: [
                    {
                      id: 'KH-P1-B01-CH03-T01',
                      topicNumber: 1,
                      code: '3.1',
                      topic: 'Social and Cultural Heritage of Nepal',
                      nepaliTopic: 'नेपालको धर्म, जातजाति, भाषाभाषी, संस्कृति, कला, साहित्य र सम्पदा',
                      brief:
                        'Covers Census 2078 demographics, UNESCO World Heritage Sites, festivals, folk music/dances, and literary figures.',
                    },
                    {
                      id: 'KH-P1-B01-CH03-T02',
                      topicNumber: 2,
                      code: '3.2–3.3',
                      topic:
                        'Economic Indicators, Infrastructure and Periodic Plans of Nepal',
                      nepaliTopic: 'आर्थिक परिसूचक, विकासका पूर्वाधार र आवधिक योजना',
                      brief:
                        'Covers agriculture, industry, trade, tourism, transport, electricity, education/health, and Periodic Plans up to the Sixteenth Plan.',
                    },
                    {
                      id: 'KH-P1-B01-CH03-T03',
                      topicNumber: 3,
                      code: '3.4',
                      topic: 'Polity and Present Constitution of Nepal',
                      nepaliTopic: 'शासन पद्धति र नेपालको वर्तमान संविधान सम्बन्धी सामान्य जानकारी',
                      brief:
                        'Covers Parts 1–5 of the Constitution of Nepal (2072), citizenship, Fundamental Rights, federal structure, and state organs.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Official Kharidar Phase I PDF · Nepal Parichaya Vol. I–IV',
              materialPath: '/materials/nepal-parichaya-geography.pdf',
              materialTitle: 'Nepal Parichaya: Geography',
              quizHref: '/quiz/nepal-parichaya',
              quizLabel: 'GK Practice Quiz',
              simulatePresetId: 'kharidar-phase1-omr',
            },
            {
              id: 'kh-p1-u2',
              branchNumber: 2,
              unitCode: 'Section A · Chapters 4–5',
              title:
                'Science, Public Health & Environment (6Q) and International Relations & Current Affairs (6Q)',
              nepaliTitle:
                'खण्ड (क) ४. विज्ञान, जनस्वास्थ्य र वातावरण (६) तथा ५. अन्तर्राष्ट्रिय सम्बन्ध र समसामयिक (६) — २४ अङ्क',
              marksWeight: 24,
              branchSummary:
                'Covers Chapters 4 and 5 of Kharidar Section A General Knowledge (12 MCQs × 2 Marks = 24 Marks).',
              subtopics: [
                'Chapter 4 (6 Qs = 12M): Everyday science & ICT inventions, human health/nutrition/diseases, ecosystem, biodiversity, climate change & pollution',
                'Chapter 5 (6 Qs = 12M): Nepal’s diplomatic relations, UN, SAARC, BIMSTEC, and major national/international current events, sports & awards',
              ],
              chapters: [
                {
                  id: 'KH-P1-B02-CH04',
                  chapterNumber: 4,
                  code: 'Chapter 4',
                  chapterName:
                    'Science, Technology, Public Health and Environment',
                  nepaliChapterName:
                    '४. विज्ञान प्रविधि, जनस्वास्थ्य र वातावरण',
                  marksAllocation: '6 Questions × 2 Marks = 12 Marks',
                  chapterBrief:
                    'Tests everyday science/ICT, preventive public health, and ecology/biodiversity conservation.',
                  topics: [
                    {
                      id: 'KH-P1-B02-CH04-T01',
                      topicNumber: 1,
                      code: '4.1–4.2',
                      topic:
                        'Science, ICT Inventions and Public Health, Diseases & Nutrition',
                      nepaliTopic: 'विज्ञान प्रविधि तथा जनस्वास्थ्य, रोग, खोप र पोषण',
                      brief:
                        'Covers major scientific discoveries, computers/internet, communicable & non-communicable diseases, vaccines, and vitamins/nutrients.',
                    },
                    {
                      id: 'KH-P1-B02-CH04-T02',
                      topicNumber: 2,
                      code: '4.3',
                      topic:
                        'Ecosystem, Sustainable Development, Biodiversity, Climate Change and Pollution',
                      nepaliTopic:
                        'पारिस्थितिक पद्धति, दिगो विकास, जैविक विविधता, जलवायु परिवर्तन र प्रदूषण',
                      brief:
                        'Covers protected areas of Nepal, rare species, global warming, ozone layer, SDGs, and waste/pollution control.',
                    },
                  ],
                },
                {
                  id: 'KH-P1-B02-CH05',
                  chapterNumber: 5,
                  code: 'Chapter 5',
                  chapterName: 'International Relations and Current Affairs',
                  nepaliChapterName:
                    '५. अन्तर्राष्ट्रिय सम्बन्ध तथा समसामयिक गतिविधि',
                  marksAllocation: '6 Questions × 2 Marks = 12 Marks',
                  chapterBrief:
                    'Covers UN, SAARC, BIMSTEC, bilateral diplomatic ties, and recent national/global events.',
                  topics: [
                    {
                      id: 'KH-P1-B02-CH05-T01',
                      topicNumber: 1,
                      code: '5.1',
                      topic:
                        'Nepal’s International Relations and UNO, SAARC & BIMSTEC',
                      nepaliTopic:
                        'नेपालको अन्तर्राष्ट्रिय सम्बन्ध तथा संयुक्त राष्ट्रसंघ, सार्क र बिम्स्टेक',
                      brief:
                        'Covers diplomatic establishment dates, UN organs/specialized agencies, SAARC summits/regional centers, and BIMSTEC priority sectors.',
                    },
                    {
                      id: 'KH-P1-B02-CH05-T02',
                      topicNumber: 2,
                      code: '5.2',
                      topic:
                        'National and International Current Events, Sports, Prizes and Personalities',
                      nepaliTopic:
                        'राष्ट्रिय तथा अन्तर्राष्ट्रिय समसामयिक घटना, खेलकुद, पुरस्कार र व्यक्तित्व',
                      brief:
                        'Covers major political, economic, social, sports, scientific, and literary awards/events of public significance.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Official Kharidar Phase I PDF · PSC GK Master Reference',
              materialPath: '/materials/psc-gk-aptitude-outline.pdf',
              materialTitle: 'PSC GK & Aptitude Reference',
              quizHref: '/quiz/comprehensive-mock',
              quizLabel: 'Integrated GK Mock',
              simulatePresetId: 'kharidar-phase1-omr',
            },
            {
              id: 'kh-p1-u3',
              branchNumber: 3,
              unitCode: 'Section B · Sub-Tests 1–10',
              title:
                'Basic Office Skills Test (BOST — 10 Sub-Tests × 2 Questions = 40 Marks)',
              nepaliTitle:
                'खण्ड (ख) आधारभूत कार्यालय सीप परीक्षण (१० उपशीर्षक × २ प्रश्न = २० प्रश्न · ४० अङ्क)',
              marksWeight: 40,
              branchSummary:
                'Evaluates clerical speed, visual-textual accuracy, alphabetical/numerical filing, instruction compliance, and basic reasoning across 10 official sub-tests (2 Qs each).',
              subtopics: [
                '1. Verification Test (रुजु परीक्षण), 2. Completion (श्रेणी पूरा गर्ने), 3. Classification, 4. Analogy, and 5. Filing Aptitude (वर्णानुक्रम/संख्यात्मक फाइलिङ)',
                '6. Follows Written Instructions, 7. Numerical Reasoning (fractions, %, ratio, average), 8. Coding & Matching, 9. Analytical Reasoning, and 10. Direction & Distance Sense',
              ],
              chapters: [
                {
                  id: 'KH-P1-B03-CH06',
                  chapterNumber: 6,
                  code: 'Section B · BOST',
                  chapterName: 'Basic Office Skills Test (10 Official Sub-Tests)',
                  nepaliChapterName:
                    'खण्ड (ख) आधारभूत कार्यालय सीप परीक्षण (२० प्रश्न × २ = ४० अङ्क)',
                  marksAllocation: '10 Sub-Tests × 2 Qs × 2M = 40 Marks',
                  chapterBrief:
                    'Tests practical clerical accuracy, filing order, written instruction execution, and numerical/spatial aptitude.',
                  topics: [
                    {
                      id: 'KH-P1-B03-CH06-T01',
                      topicNumber: 1,
                      code: 'BOST 1–2',
                      topic:
                        '1. Verification Test (रुजु परीक्षण — 2Q) & 2. Series/Pattern Completion (खाली ठाउँ पूरा गर्ने — 2Q)',
                      nepaliTopic: '१. रुजु परीक्षण र २. खाली ठाउँ/श्रेणी पूरा गर्ने',
                      brief:
                        'Spotting subtle spelling, digit, address, or date discrepancies when cross-checking official records, and completing letter/number/figural sequences.',
                    },
                    {
                      id: 'KH-P1-B03-CH06-T02',
                      topicNumber: 2,
                      code: 'BOST 3–4',
                      topic:
                        '3. Classification / Odd-One-Out (वर्गीकरण — 2Q) & 4. Analogy (समरूपता — 2Q)',
                      nepaliTopic: '३. वर्गीकरण र ४. समरूपता परीक्षण',
                      brief:
                        'Grouping items by shared attributes to isolate the outlier and identifying parallel functional/semantic relationships across words, numbers, or figures.',
                    },
                    {
                      id: 'KH-P1-B03-CH06-T03',
                      topicNumber: 3,
                      code: 'BOST 5–6',
                      topic:
                        '5. Filing Aptitude Test (फाइलिङ अभिरुचि — 2Q) & 6. Follows Written Instructions (निर्देशन पालना — 2Q)',
                      nepaliTopic: '५. फाइलिङ अभिरुचि र ६. लिखित निर्देशन पालना परीक्षण',
                      brief:
                        'Sequencing names, file codes, and dates in strict English/Devanagari alphabetical or chronological order, and executing multi-step conditional office instructions accurately.',
                    },
                    {
                      id: 'KH-P1-B03-CH06-T04',
                      topicNumber: 4,
                      code: 'BOST 7–8',
                      topic:
                        '7. Numerical Reasoning Test (संख्यात्मक परीक्षण — 2Q) & 8. Coding and Matching Test (कोडिङ तथा मिलान — 2Q)',
                      nepaliTopic: '७. संख्यात्मक तार्किक र ८. कोडिङ तथा मिलान परीक्षण',
                      brief:
                        'Solving rapid arithmetic problems (fractions, decimals, percentages, ratios, averages) and decoding/matching alphanumeric office codes.',
                    },
                    {
                      id: 'KH-P1-B03-CH06-T05',
                      topicNumber: 5,
                      code: 'BOST 9–10',
                      topic:
                        '9. Analytical Reasoning Test (विश्लेषणात्मक परीक्षण — 2Q) & 10. Direction and Distance Sense Test (दिशा र दूरी — 2Q)',
                      nepaliTopic: '९. विश्लेषणात्मक तार्किक र १०. दिशा तथा दूरी बोध परीक्षण',
                      brief:
                        'Evaluating seating/ranking/blood-relation clues and tracking cardinal/intercardinal turns and shortest straight-line displacements.',
                    },
                  ],
                },
              ],
              keyReferences: 'Official Kharidar Phase I PDF (Pages 5–6)',
              materialPath:
                '/materials/official-psc/psc-official-kharidar-phase1.pdf',
              materialTitle: 'Official Kharidar Phase I PDF',
              quizHref: '/quiz/psc-and-planning',
              quizLabel: 'PSC & Aptitude Quiz',
              simulatePresetId: 'kharidar-phase1-omr',
            },
          ],
        },
      ],
    },
    {
      id: 'kh-phase-2',
      phaseNumber: 2,
      title: 'Stage II · Main Written Examination (मूल परीक्षा)',
      nepaliTitle:
        'द्वितीय चरण · मुख्य लिखित परीक्षा (२०० अङ्क — सबै सेवामा समान)',
      summary:
        'Two common 100-mark subjective written papers (2 Hours 30 Minutes each, Pass Marks: 40) across Justice, Administration, Audit, and Legislature-Parliament services. Separate answer booklets are used for each section.',
      officialPdfPath:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
      papers: [
        {
          id: 'kh-paper-2',
          code: 'Paper II',
          title: 'Office Management',
          nepaliTitle: 'कार्यालय व्यवस्थापन (सबै सेवा समूहका लागि अनिवार्य)',
          examFormat: 'Subjective Analytical & Case',
          fullMarks: 100,
          passMarks: 40,
          durationLabel: '2 Hours 30 Minutes',
          questionBreakdown:
            '12 Short Questions × 5 Marks (60M) + 4 Long Questions × 10 Marks (40M) = 100 Marks across Sections A (40M), B (30M) & C (30M)',
          scoringRule:
            'Minimum 40 marks required · Counted in 240-mark Final Merit Total',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'kh-p2-u1',
              branchNumber: 1,
              unitCode: 'Section A · 40M',
              title:
                'Office Management, Correspondence & Record Keeping (4×5M + 2×10M)',
              nepaliTitle:
                'खण्ड (क) कार्यालय व्यवस्थापन (४×५ + २×१० = ४० अङ्क)',
              marksWeight: 40,
              branchSummary:
                'Covers Chapter 1 (1.1–1.5): office & auxiliary staff, correspondence/Darta-Chalani/Circular/Notice/Tok-Aadesh/Tippani/Report, filing/indexing/record management, meeting/minuting, and PR/grievance handling.',
              subtopics: [
                '1.1 Office & Staff (types, auxiliary staff duties, office resources & communication) and 1.2 Office Procedure (correspondence, Darta-Chalani, Notice, Circular, Tok-Aadesh, Tippani & Report)',
                '1.3 Record Management (modern tech, filing methods & indexing), 1.4 Meeting Management & Minuting, and 1.5 Public Relations & Service-Seeker Grievance Handling',
              ],
              chapters: [
                {
                  id: 'KH-P2-B01-CH01',
                  chapterNumber: 1,
                  code: 'Chapter 1',
                  chapterName: 'Office Management and Procedures',
                  nepaliChapterName: '१. कार्यालय व्यवस्थापन',
                  marksAllocation: '4 Short Qs × 5M + 2 Long Qs × 10M = 40 Marks',
                  chapterBrief:
                    'Trains frontline Kharidar clerks in official correspondence, registration/dispatch, filing, minuting, and citizen desk relations.',
                  topics: [
                    {
                      id: 'KH-P2-B01-CH01-T01',
                      topicNumber: 1,
                      code: '1.1',
                      topic: 'Office and Auxiliary Staff (कार्यालय र कर्मचारी)',
                      nepaliTopic:
                        'कार्यालयको परिचय, सहायक कर्मचारीका कार्य/गुण, कार्यालय स्रोतसाधन र सञ्चार',
                      brief:
                        'Covers permanent vs temporary offices (1.1.1), duties and qualities of Sahayak staff (1.1.2), human/financial/physical/information office resources (1.1.3), and formal upward/downward/horizontal office communication (1.1.4).',
                    },
                    {
                      id: 'KH-P2-B01-CH01-T02',
                      topicNumber: 2,
                      code: '1.2',
                      topic:
                        'Office Procedures: Correspondence, Darta-Chalani, Notice, Circular, Tok-Aadesh, Tippani and Report Writing',
                      nepaliTopic:
                        'कार्यालय कार्यविधि: पत्राचार, दर्ता–चलानी, सूचना, परिपत्र, तोक–आदेश, टिप्पणी र प्रतिवेदन',
                      brief:
                        'Detailed study of official correspondence qualities & priority levels (1.2.1.1–1.2.1.2), Darta & Chalani registers (1.2.1.3), Notice (Suchana), Circular (Paripatra), and executive routing order (Tok-Aadesh) (1.2.1.4), plus Tippani (1.2.2) and Report drafting (1.2.3).',
                    },
                    {
                      id: 'KH-P2-B01-CH01-T03',
                      topicNumber: 3,
                      code: '1.3',
                      topic:
                        'Record Management, Filing Methods and Indexing',
                      nepaliTopic:
                        'अभिलेख व्यवस्थापन, आधुनिक प्रविधि, फाइलिङ विधि र अनुक्रमणिका (इन्डेक्सिङ)',
                      brief:
                        'Covers vital/important/useful/non-essential records (1.3.1), digital archiving & GIOMS (1.3.2), alphabetical, numerical, subject-wise, geographical, and chronological filing (1.3.3), and book/card/visible indexing (1.3.4).',
                    },
                    {
                      id: 'KH-P2-B01-CH01-T04',
                      topicNumber: 4,
                      code: '1.4–1.5',
                      topic:
                        'Meeting Management & Minuting, Public Relations and Service-Seeker Grievance Handling',
                      nepaliTopic:
                        'बैठक सञ्चालन र माइन्यूट लेखन तथा जनसम्पर्क र गुनासो व्यवस्थापन',
                      brief:
                        'Covers pre-meeting notice/agenda, quorum, accurate minute drafting, polite frontline public relations, and resolving service-seeker complaints promptly.',
                    },
                  ],
                },
              ],
              keyReferences: 'Official Kharidar Phase II PDF (Page 1)',
              materialPath:
                '/materials/official-psc/psc-official-kharidar-phase2.pdf',
              materialTitle: 'Official Kharidar Phase II PDF',
              quizHref: '/quiz/language-and-writing',
              quizLabel: 'Official Writing Quiz',
              writtenHref: '/written/PSC-WR-402',
              writtenLabel: 'Darta-Chalani 5M Q&A',
              simulatePresetId: 'written-office-nasu',
            },
            {
              id: 'kh-p2-u2',
              branchNumber: 2,
              unitCode: 'Section B · 30M',
              title: 'Constitution and Civic Conscience (2×5M + 2×10M)',
              nepaliTitle:
                'खण्ड (ख) संविधान र नागरिक सचेतना (२×५ + २×१० = ३० अङ्क)',
              marksWeight: 30,
              branchSummary:
                'Covers Chapter 2 (2.1–2.3): Fundamental Rights/Duties & Directive Principles of the Constitution, 8 key Constitutional/Central Bodies, and Civic Conscience/ethics.',
              subtopics: [
                '2.1 Constitution of Nepal: Fundamental Rights & Duties (2.1.1) and Directive Principles, Policies & Obligations (2.1.2)',
                '2.2 Introduction & Functions of CIAA, OAG, PSC, Election Commission, NHRC, OPMCM, MoFAGA & Federal Parliament Secretariat (2.2.1–2.2.8)',
                '2.3 Civic Conscience: character development, human values, civil rights & duties, discipline & positive thinking',
              ],
              chapters: [
                {
                  id: 'KH-P2-B02-CH02',
                  chapterNumber: 2,
                  code: 'Chapter 2',
                  chapterName: 'Constitution and Civic Conscience',
                  nepaliChapterName: '२. संविधान र नागरिक सचेतना',
                  marksAllocation: '2 Short Qs × 5M + 2 Long Qs × 10M = 30 Marks',
                  chapterBrief:
                    'Tests constitutional rights/policies, apex public institutions, and ethical civic consciousness.',
                  topics: [
                    {
                      id: 'KH-P2-B02-CH02-T01',
                      topicNumber: 1,
                      code: '2.1',
                      topic:
                        'Constitution of Nepal: Fundamental Rights & Duties (Part 3) and Directive Principles, Policies & State Obligations (Part 4)',
                      nepaliTopic:
                        'नेपालको संविधान: मौलिक हक र कर्तव्य तथा राज्यका निर्देशक सिद्धान्त, नीति र दायित्व',
                      brief:
                        'Covers Articles 16–48 (31 Fundamental Rights and 4 Citizen Duties) and Articles 49–55 guiding political, socio-economic, and administrative governance.',
                    },
                    {
                      id: 'KH-P2-B02-CH02-T02',
                      topicNumber: 2,
                      code: '2.2',
                      topic:
                        'Introduction and Functions of Organizations: CIAA, OAG, PSC, Election Commission, NHRC, OPMCM, MoFAGA and Federal Parliament Secretariat',
                      nepaliTopic:
                        'प्रमुख संवैधानिक तथा सरकारी निकायहरूको परिचय र कार्य (अख्तियार, महालेखापरीक्षक, लोक सेवा, निर्वाचन आयोग, रा.मा.अ.आ., प्र.म. कार्यालय, संघीय मामिला र संसद सचिवालय)',
                      brief:
                        'Examines constitutional composition and core functions of the five major Constitutional Bodies (2.2.1–2.2.5) and three central administrative/legislative secretariats (2.2.6–2.2.8).',
                    },
                    {
                      id: 'KH-P2-B02-CH02-T03',
                      topicNumber: 3,
                      code: '2.3',
                      topic:
                        'Civic Conscience: Character Development, Human Values, Civil Rights & Duties, Discipline and Positive Thinking',
                      nepaliTopic:
                        'नागरिक सचेतना: चरित्र निर्माण, मानवीय मूल्य–मान्यता, नागरिक अधिकार र कर्तव्य, अनुशासन र सकारात्मक सोच',
                      brief:
                        'Fosters public integrity, empathy toward service seekers, self-discipline, respect for public property, and constructive solution-oriented attitude.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Constitution of Nepal (2072) · Official Kharidar Phase II PDF',
              materialPath: '/materials/constitution-of-nepal-2072.pdf',
              materialTitle: 'Constitution of Nepal (2072)',
              quizHref: '/quiz/laws-and-constitution',
              quizLabel: 'Constitution Quiz',
              writtenHref: '/written/PSC-WR-203',
              writtenLabel: 'Rule of Law 5M Q&A',
              simulatePresetId: 'written-paper-2',
            },
            {
              id: 'kh-p2-u3',
              branchNumber: 3,
              unitCode: 'Section C · 30M',
              title: 'General Mathematics (6 Solved Problems × 5 Marks)',
              nepaliTitle: 'खण्ड (ग) सामान्य गणित (६ प्रश्न × ५ = ३० अङ्क)',
              marksWeight: 30,
              branchSummary:
                'Covers all 8 official subjective mathematics topics (3.1–3.8) requiring step-by-step written solutions without calculators.',
              subtopics: [
                '3.1 Fundamental operations & Unitary Method, 3.2 Fraction, Decimal, Percentage & Ratio, 3.3 Profit, Loss & Discount, and 3.4 Tax, Commission & Depreciation',
                '3.5 Simple & Compound Interest, 3.6 Average, 3.7 Household Arithmetic (electricity, water, telephone bills & currency exchange), and 3.8 Mensuration (Perimeter, Area & Volume)',
              ],
              chapters: [
                {
                  id: 'KH-P2-B03-CH03',
                  chapterNumber: 3,
                  code: 'Chapter 3',
                  chapterName: 'General Mathematics (Subjective Step-by-Step)',
                  nepaliChapterName: '३. सामान्य गणित (६ प्रश्न × ५ = ३० अङ्क)',
                  marksAllocation: '6 Solved Questions × 5 Marks = 30 Marks',
                  chapterBrief:
                    'High-scoring practical arithmetic and mensuration section requiring clear step-by-step working.',
                  topics: [
                    {
                      id: 'KH-P2-B03-CH03-T01',
                      topicNumber: 1,
                      code: '3.1–3.2',
                      topic:
                        'Fundamental Operations, Unitary Method (ऐकिक नियम), Time & Work, Fraction, Decimal, Percentage and Ratio/Proportion',
                      nepaliTopic:
                        'आधारभूत गणितीय क्रिया, ऐकिक नियम, भिन्न, दशमलव, प्रतिशत र अनुपात',
                      brief:
                        'Covers BODMAS simplification, direct/inverse variation in men-days-work problems, fraction-decimal-percentage conversions, and proportional division.',
                    },
                    {
                      id: 'KH-P2-B03-CH03-T02',
                      topicNumber: 2,
                      code: '3.3–3.4',
                      topic:
                        'Profit, Loss & Marked-Price Discount, and Tax (VAT/Income Tax), Commission & Depreciation',
                      nepaliTopic:
                        'नाफा, नोक्सान र छुट तथा कर, कमिसन र ह्रासकट्टी',
                      brief:
                        'Solves multi-step commercial problems combining marked price, discount %, 13% VAT addition, sales commission, and annual compound asset depreciation.',
                    },
                    {
                      id: 'KH-P2-B03-CH03-T03',
                      topicNumber: 3,
                      code: '3.5–3.6',
                      topic:
                        'Simple Interest, Compound Interest and Arithmetic Average',
                      nepaliTopic: 'साधारण ब्याज, चक्रीय ब्याज र औसत',
                      brief:
                        'Applies I = PTR/100, annual/semi-annual compound interest formulas, and weighted/group mean word problems.',
                    },
                    {
                      id: 'KH-P2-B03-CH03-T04',
                      topicNumber: 4,
                      code: '3.7–3.8',
                      topic:
                        'Household/Home Arithmetic (Electricity, Water, Telephone Bills & Foreign Exchange) and Mensuration (Perimeter, Area & Volume)',
                      nepaliTopic:
                        'घरायसी अंकगणित (बिजुली, खानेपानी, टेलिफोन महसुल र मुद्रा विनिमय) तथा क्षेत्रमिति (परिधि, क्षेत्रफल र आयतन)',
                      brief:
                        'Calculates tiered utility slab tariffs with rebates/penalties, NRB buying/selling currency exchange rates with devaluation, and area/volume of rectangles, triangles, circles, walls/rooms, cuboids, and cylinders.',
                    },
                  ],
                },
              ],
              keyReferences: 'Official Kharidar Phase II PDF (Page 2)',
              materialPath: '/materials/psc-kharidar-syllabus.pdf',
              materialTitle: 'Kharidar Syllabus Digest',
              quizHref: '/quiz/custom?subject=General%20Mental%20Ability%20(IQ)',
              quizLabel: 'Quantitative Practice',
            },
          ],
        },
        {
          id: 'kh-paper-3',
          code: 'Paper III',
          title: 'Job Knowledge Related Subject',
          nepaliTitle:
            'कार्य ज्ञान सम्बन्धी विषय (सबै सेवा समूहका लागि अनिवार्य र समान)',
          examFormat: 'Subjective Analytical & Case',
          fullMarks: 100,
          passMarks: 40,
          durationLabel: '2 Hours 30 Minutes',
          questionBreakdown:
            '8 Short Questions × 5 Marks (40M) + 6 Long Questions × 10 Marks (60M) = 100 Marks across Sections A (35M), B (35M) & C (30M)',
          scoringRule:
            'Minimum 40 marks required · Counted in 240-mark Final Merit Total',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'kh-p3-u1',
              branchNumber: 1,
              unitCode: 'Section A · 35M',
              title: 'Public Service Management (3×5M + 2×10M)',
              nepaliTitle:
                'खण्ड (क) सार्वजनिक सेवा व्यवस्थापन (३×५ + २×१० = ३५ अङ्क)',
              marksWeight: 35,
              branchSummary:
                'Covers all 12 official topics of Chapter 1—Civil Service Act/Rules, Service Delivery, Citizen Charter, Good Governance Act, RTI Act, Corruption Prevention Act, Federal Inter-relation Act, Right to Food Act, Vital Registration, National ID, E-governance, and ICT security.',
              subtopics: [
                '1.1 Civil Service Act & Rules (1.1.1–1.1.4), 1.2 Public service delivery, 1.3 Public Charter, 1.4 Good Governance Act (Ch. 1,2,4,5), 1.5 RTI Act (Ch. 1,2,4), and 1.6 Corruption Prevention Act (Ch. 1,2)',
                '1.7 Federal Inter-Relation Act 2077 (Ch. 2), 1.8 Right to Food Act 2075 (Ch. 1,2,3), 1.9 Vital Registration, 1.10 National Identity Card, 1.11 E-governance & 1.12 ICT importance/precautions',
              ],
              chapters: [
                {
                  id: 'KH-P3-B01-CH01',
                  chapterNumber: 1,
                  code: 'Chapter 1',
                  chapterName: 'Public Service Management and Service Laws',
                  nepaliChapterName: '१. सार्वजनिक सेवा व्यवस्थापन',
                  marksAllocation: '3 Short Qs × 5M + 2 Long Qs × 10M = 35 Marks',
                  chapterBrief:
                    'Tests statutory knowledge of civil service rules, citizen service delivery, Vital Registration, National ID, and exact prescribed chapters of five core Acts.',
                  topics: [
                    {
                      id: 'KH-P3-B01-CH01-T01',
                      topicNumber: 1,
                      code: '1.1',
                      topic:
                        'Civil Service Act, 2049 and Civil Service Rules, 2050',
                      nepaliTopic:
                        'निजामती सेवा ऐन, २०४९ र निजामती सेवा नियमावली, २०५०',
                      brief:
                        'Covers constitution of services/groups & inclusive recruitment (1.1.1–1.1.2), appointment, transfer, promotion, leave, departmental punishment & retirement (1.1.3), and employee conduct & duties (1.1.4).',
                    },
                    {
                      id: 'KH-P3-B01-CH01-T02',
                      topicNumber: 2,
                      code: '1.2–1.3',
                      topic:
                        'Public Service Delivery (meaning, agencies & modes) and Citizen Charter (नागरिक वडापत्र)',
                      nepaliTopic:
                        'सार्वजनिक सेवा प्रवाहका निकाय/तौरतरिका र नागरिक वडापत्रको महत्व',
                      brief:
                        'Covers frontline counter delivery, electronic delivery, mobile camps, and Citizen Charter components including compensation provisions.',
                    },
                    {
                      id: 'KH-P3-B01-CH01-T03',
                      topicNumber: 3,
                      code: '1.4–1.6',
                      topic:
                        'Good Governance Act 2064 (Ch. 1, 2, 4, 5), Right to Information Act 2064 (Ch. 1, 2, 4) and Prevention of Corruption Act 2059 (Ch. 1 & 2)',
                      nepaliTopic:
                        'सुशासन ऐन २०६४ (परिच्छेद १,२,४,५), सूचनाको हक ऐन २०६४ (परिच्छेद १,२,४) र भ्रष्टाचार निवारण ऐन २०५९ (परिच्छेद १,२)',
                      brief:
                        'Focuses strictly on the syllabus-prescribed statutory chapters: administrative responsibilities/procedures/accountability in Good Governance Act, citizen access & proactive disclosure in RTI Act, and corruption offences & punishments in Corruption Prevention Act.',
                    },
                    {
                      id: 'KH-P3-B01-CH01-T04',
                      topicNumber: 4,
                      code: '1.7–1.8',
                      topic:
                        'Federation, Province & Local Level (Coordination & Inter-relation) Act 2077 (Ch. 2) and Right to Food & Food Sovereignty Act 2075 (Ch. 1, 2, 3)',
                      nepaliTopic:
                        'संघ, प्रदेश र स्थानीय तह (समन्वय तथा अन्तरसम्बन्ध) ऐन २०७७ (परिच्छेद २) र खाद्य अधिकार तथा खाद्य सम्प्रभुता ऐन २०७५ (परिच्छेद १,२,३)',
                      brief:
                        'Covers bases of intergovernmental coordination/exclusive-concurrent law exercise (Act 2077 Ch. 2) and statutory guarantees against hunger, food safety, and farmers’ rights (Act 2075 Ch. 1–3).',
                    },
                    {
                      id: 'KH-P3-B01-CH01-T05',
                      topicNumber: 5,
                      code: '1.9–1.12',
                      topic:
                        'Vital Registration (व्यक्तिगत घटना दर्ता), National Identity Card, E-Governance and ICT Security Precautions',
                      nepaliTopic:
                        'व्यक्तिगत घटना दर्ता, राष्ट्रिय परिचयपत्र, विद्युतीय शासन र सूचना प्रविधि प्रयोगका सावधानीहरू',
                      brief:
                        'Covers 35-day registration of birth, death, marriage, divorce, and migration at Ward Offices (National ID and Civil Registration Act, 2076), biometric National ID, online e-services, and password/data cybersecurity hygiene.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Civil Service Act 2049 · Good Governance Act 2064 · RTI Act 2064 · National ID & Civil Registration Act 2076',
              materialPath: '/materials/civil-service-act-2049.pdf',
              materialTitle: 'Civil Service Act, 2049',
              quizHref: '/quiz/laws-and-constitution',
              quizLabel: 'Service Laws Quiz',
              writtenHref: '/written/PSC-WR-206',
              writtenLabel: 'RTI 5M Model Answer',
            },
            {
              id: 'kh-p3-u2',
              branchNumber: 2,
              unitCode: 'Section B · 35M',
              title:
                'Government Accounting, Public Procurement, Jinsi & Auditing (3×5M + 2×10M)',
              nepaliTitle:
                'खण्ड (ख) सरकारी लेखा, सार्वजनिक खरिद तथा जिन्सी र लेखापरीक्षण (३×५ + २×१० = ३५ अङ्क)',
              marksWeight: 35,
              branchSummary:
                'Covers Chapter 2 Accounting & Financial Admin (2.1–2.4), Chapter 3 Public Procurement, Jinsi & PAMS (3.1–3.3), and Chapter 4 Auditing, Beruju, VAT, Fiscal Accountability Act, Income Tax Ch. 17 TDS, and Audit Act Sec. 8 (4.1–4.6).',
              subtopics: [
                'Chapter 2: LMBIS budget approval, Chart of Accounts/TSA/RMIS/CGAS/Deposit, Goshwara Voucher, Bank Cash Book, Budget Hisab, Maskewari, Kharchako Phantwari & Bank Reconciliation',
                'Chapter 3: Public procurement methods/process, Jinsi forms (Maag Faram, Purchase Order, Dakhila, Jinsi Khata, Inspection & Auction) & PAMS',
                'Chapter 4: Auditing types, Beruju/Lagat/Samparikshan, VAT registration/returns/exemptions, Fiscal Accountability Act 2076, Income Tax Act Ch. 17 (TDS) & Audit Act Sec. 8',
              ],
              chapters: [
                {
                  id: 'KH-P3-B02-CH02',
                  chapterNumber: 2,
                  code: 'Chapter 2',
                  chapterName: 'Accounting System and Financial Administration',
                  nepaliChapterName: '२. लेखा प्रणाली र आर्थिक प्रशासन',
                  marksAllocation: 'Section B (Combined 35 Marks)',
                  chapterBrief:
                    'Covers LMBIS, digital treasury portals, deposit books, and AGF operational accounting forms.',
                  topics: [
                    {
                      id: 'KH-P3-B02-CH02-T01',
                      topicNumber: 1,
                      code: '2.1–2.4',
                      topic:
                        'Government Accounting, LMBIS, Chart of Accounts, TSA, RMIS, CGAS, Deposit Accounting, Goshwara Voucher, Bank Cash Book, Budget Hisab, Maskewari, Kharchako Phantwari & Bank Reconciliation',
                      nepaliTopic:
                        'सरकारी लेखा, LMBIS, एकल खाता कोष (TSA), RMIS, CGAS, धरौटी, गोश्वारा भौचर, बैंक नगदी किताब, बजेट हिसाब र मास्केवारी',
                      brief:
                        'Equips Kharidar accountants with practical knowledge of line-ministry budgeting (LMBIS), online voucher posting (CGAS), monthly expenditure statements, and bank reconciliation.',
                    },
                  ],
                },
                {
                  id: 'KH-P3-B02-CH03',
                  chapterNumber: 3,
                  code: 'Chapter 3',
                  chapterName:
                    'Public Procurement and Inventory (Jinsi) Management',
                  nepaliChapterName: '३. सार्वजनिक खरिद तथा जिन्सी व्यवस्थापन',
                  marksAllocation: 'Section B (Combined 35 Marks)',
                  chapterBrief:
                    'Covers public procurement methods, store ledger forms, auction, and PAMS.',
                  topics: [
                    {
                      id: 'KH-P3-B02-CH03-T01',
                      topicNumber: 1,
                      code: '3.1–3.3',
                      topic:
                        'Public Procurement methods/process, Jinsi Management (Maag Faram, Purchase Order, Dakhila Report, Jinsi Khata, Jinsi Inspection & Auction) and Public Assets Management System (PAMS)',
                      nepaliTopic:
                        'सार्वजनिक खरिद प्रक्रिया, जिन्सी व्यवस्थापन (माग फाराम, खरिद आदेश, दाखिला रिपोर्ट, जिन्सी खाता, निरीक्षण र लिलाम) तथा PAMS',
                      brief:
                        'Covers direct purchase/sealed quotation/tender basics and complete storekeeper duties from requisition to digital PAMS asset tracking and auction.',
                    },
                  ],
                },
                {
                  id: 'KH-P3-B02-CH04',
                  chapterNumber: 4,
                  code: 'Chapter 4',
                  chapterName:
                    'Public Financial Management, Tax Deduction and Auditing',
                  nepaliChapterName:
                    '४. सार्वजनिक वित्तीय व्यवस्थापन र लेखापरीक्षण प्रणाली',
                  marksAllocation: 'Section B (Combined 35 Marks)',
                  chapterBrief:
                    'Covers Beruju settlement, VAT compliance, Income Tax Chapter 17 TDS, Fiscal Accountability Act, and Audit Act Section 8.',
                  topics: [
                    {
                      id: 'KH-P3-B02-CH04-T01',
                      topicNumber: 1,
                      code: '4.1–4.6',
                      topic:
                        'Auditing types, Beruju/Lagat/Samparikshan, VAT (registration, returns, exempt items), Fiscal Accountability Act 2076 (internal control/audit), Income Tax Act 2058 Ch. 17 (TDS withholding) and Audit Act 2075 Section 8',
                      nepaliTopic:
                        'लेखापरीक्षण, बेरुजु र सम्परीक्षण, मू.अ.कर, आर्थिक कार्यविधि ऐन २०७६, आयकर ऐन परिच्छेद १७ (अग्रिम कर कट्टी) र लेखापरीक्षण ऐन दफा ८',
                      brief:
                        'Tests statutory withholding tax (TDS) deductions on office payments, VAT threshold/invoicing, internal control & audit responsibilities, OAG’s Section 8 audit criteria, and Beruju record clearing.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Public Procurement Act, 2063 · Fiscal Accountability Act, 2076 · Income Tax Act Ch. 17 · Audit Act Sec. 8',
              materialPath: '/materials/public-procurement-fiscal-act.pdf',
              materialTitle: 'Procurement & Fiscal Act Digest',
              quizHref:
                '/quiz/custom?source=%2Fmaterials%2Fpublic-procurement-fiscal-act.pdf',
              quizLabel: 'Procurement & Accounting MCQs',
            },
            {
              id: 'kh-p3-u3',
              branchNumber: 3,
              unitCode: 'Section C · 30M',
              title: 'Law and Justice Related Knowledge (2×5M + 2×10M)',
              nepaliTitle:
                'खण्ड (ग) कानून र न्याय सम्बन्धी जानकारी (२×५ + २×१० = ३० अङ्क)',
              marksWeight: 30,
              branchSummary:
                'Covers all 10 official topics of Chapter 5 (5.1–5.10): sources of law, Act/Rules/Rajpatra, Court tiers, Hakdaiya/Hadmyad/Myad/Tarikh, Likhat/Darta/Darpeeth, Myad Tameli, FIR/Arrest/Muchulka/Abhiyogpatra/Thunchek, Free Legal Aid, and Civil & Criminal Codes.',
              subtopics: [
                '5.1 Sources of law, 5.2 Act, Rules, Bylaws, Formation Order & Rajpatra, 5.3 Court structure & jurisdiction, 5.4 Hakdaiya, Hadmyad, Myad & Tarikh, and 5.5 Legal deeds (Likhat), Darta & Darpeeth',
                '5.6 Myad Tameli (summons service), 5.7 FIR (Jaheri), Arrest Warrant, Seizure Muchulka, Charge-sheet & Preliminary Hearing, 5.8 Free Legal Aid, and 5.9–5.10 Muluki Civil & Criminal Codes 2074',
              ],
              chapters: [
                {
                  id: 'KH-P3-B03-CH05',
                  chapterNumber: 5,
                  code: 'Chapter 5',
                  chapterName: 'Law and Justice Related Knowledge',
                  nepaliChapterName: '५. कानून र न्याय सम्बन्धी जानकारी',
                  marksAllocation: '2 Short Qs × 5M + 2 Long Qs × 10M = 30 Marks',
                  chapterBrief:
                    'Equips Kharidar clerks across courts, government attorney offices, and administrative benches with essential civil and criminal procedural knowledge.',
                  topics: [
                    {
                      id: 'KH-P3-B03-CH05-T01',
                      topicNumber: 1,
                      code: '5.1–5.3',
                      topic:
                        'Sources of Law, Act/Rules/Bylaws/Formation Order/Nepal Rajpatra, and Tiers, Structure & Jurisdiction of Courts in Nepal',
                      nepaliTopic:
                        'कानूनका स्रोत, ऐन/नियम/विनियम/गठन आदेश/राजपत्र र अदालतको तह, संरचना तथा क्षेत्राधिकार',
                      brief:
                        'Distinguishes primary statutes from delegated instruments published in the Nepal Gazette (Rajpatra) and outlines Supreme, High, and District Court jurisdictions.',
                    },
                    {
                      id: 'KH-P3-B03-CH05-T02',
                      topicNumber: 2,
                      code: '5.4–5.6',
                      topic:
                        'Hakdaiya (Locus Standi), Hadmyad (Limitation), Myad & Tarikh; Deeds (Likhat), Registration (Darta) & Rejection Endorsement (Darpeeth); and Summons Service (Myad Tameli)',
                      nepaliTopic:
                        'हकदैया, हदम्याद, म्याद र तारिख; लिखतको रीत, दर्ता र दरपीठ; तथा म्याद तामेली कार्यविधि',
                      brief:
                        'Covers statutory standing and filing deadlines, scrutinizing legal documents before registration vs formal Darpeeth refusal with reasons, and valid Myad Tameli procedures.',
                    },
                    {
                      id: 'KH-P3-B03-CH05-T03',
                      topicNumber: 3,
                      code: '5.7–5.10',
                      topic:
                        'FIR (Jaheri), Arrest Warrant, Seizure Muchulka, Charge-Sheet & Preliminary Hearing; Free Legal Aid; and Salient Features of Muluki Civil & Criminal Codes, 2074',
                      nepaliTopic:
                        'जाहेरी दरखास्त, पक्राउ पुर्जी, बरामदी मुचुल्का, अभियोगपत्र र प्रारम्भिक सुनुवाइ; निःशुल्क कानूनी सहायता; तथा मुलुकी देवानी र अपराध संहिता २०७४ का विशेषता',
                      brief:
                        'Covers criminal investigation/prosecution documents, Legal Aid Act 2054 support for indigent citizens (Article 20(10)), and landmark reforms introduced by the 2074 Civil and Criminal Codes.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Muluki Civil & Criminal Codes, 2074 · Legal Aid Act, 2054 · Official Kharidar Phase II PDF',
              materialPath: '/materials/corruption-prevention-act-2059.pdf',
              materialTitle: 'Prevention of Corruption Act, 2059',
              quizHref:
                '/quiz/custom?source=%2Fmaterials%2Fcorruption-prevention-act-2059.pdf',
              quizLabel: 'Anti-Corruption & Law MCQs',
            },
          ],
        },
      ],
    },
    {
      id: 'kh-phase-3',
      phaseNumber: 3,
      title: 'Final Stage · Computer Skill Test & Interview (अन्तिम चरण)',
      nepaliTitle:
        'अन्तिम चरण · कम्प्युटर सीप परीक्षण (१०) र अन्तर्वार्ता (३०) — ४० अङ्क',
      summary:
        '15-minute practical computer test (10 Marks) and 30-mark oral interview conducted for candidates passing Stage II written papers. Combined with Stage II (200M) for the 240-Mark Final Merit List.',
      officialPdfPath:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
      officialPscUrl:
        'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
      papers: [
        {
          id: 'kh-paper-4',
          code: 'Final Stage',
          title: 'Computer Skill Test & Oral Interview',
          nepaliTitle: 'कम्प्युटर प्रयोगात्मक सीप परीक्षण र अन्तर्वार्ता',
          examFormat: 'Practical & Oral Viva',
          fullMarks: 40,
          passMarks: null,
          durationLabel: '15 Min Practical + Viva',
          questionBreakdown:
            'Computer Skill Test (10 Marks · 15 Min: Devanagari 2.5M, English 2.5M, Windows & MS-Word 5M) · Oral Interview (30 Marks)',
          scoringRule:
            'Combined with Stage II (200 Marks) for 240-Mark Final Merit List',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'kh-p4-u1',
              branchNumber: 1,
              unitCode: 'Final Stage · 40M',
              title:
                'Unicode Nepali/English Typing, Windows & MS-Word (10M) and Interview (30M)',
              nepaliTitle:
                'युनिकोड टाइपिङ र एम.एस. वर्ड (१० अङ्क) तथा मौखिक अन्तर्वार्ता (३० अङ्क)',
              marksWeight: 40,
              branchSummary:
                'Tests 5-minute Devanagari typing, 5-minute English typing, 5-minute Windows & MS-Word practical formatting, and 30-mark oral board interview.',
              subtopics: [
                'Computer Skill Test (10 Marks, 15 Minutes): Devanagari typing (150 words text, 2.5M, 5 min), English typing (200 words text, 2.5M, 5 min), and Windows Basic & MS-Word document formatting (5M, 5 min)',
                'Oral Interview (30 Marks): Frontline citizen service courtesy, office awareness, and general civic/statutory knowledge',
              ],
              chapters: [
                {
                  id: 'KH-P3F-B01-CH01',
                  chapterNumber: 1,
                  code: 'Practical (10M)',
                  chapterName: 'Practical Computer Skill Test (15 Minutes)',
                  nepaliChapterName:
                    '१. कम्प्युटर प्रयोगात्मक सीप परीक्षण (१० अङ्क · १५ मिनेट)',
                  marksAllocation: '2.5M + 2.5M + 5M = 10 Marks',
                  chapterBrief:
                    'Evaluates bilingual typing accuracy and 5-step Windows/MS-Word document creation.',
                  topics: [
                    {
                      id: 'KH-P3F-B01-CH01-T01',
                      topicNumber: 1,
                      code: '1.1–1.2',
                      topic:
                        'Devanagari Unicode Typing (2.5 Marks · 5 Min) & English Typing (2.5 Marks · 5 Min)',
                      nepaliTopic:
                        'देवनगरी टाइपिङ (२.५ अङ्क) र अंग्रेजी टाइपिङ (२.५ अङ्क)',
                      brief:
                        'Evaluates net WPM after deducting wrong words from total words typed over 5 minutes (less than 5 correct words in Devanagari or 10 in English yields 0 marks).',
                    },
                    {
                      id: 'KH-P3F-B01-CH01-T02',
                      topicNumber: 2,
                      code: '1.3',
                      topic:
                        'Windows Basic and MS-Word Practical Formatting (5 Marks · 5 Min)',
                      nepaliTopic:
                        'विन्डोज बेसिक र एम.एस. वर्ड डकुमेन्ट फर्म्याटिङ (५ अङ्क)',
                      brief:
                        'Creating desktop/drive folders, setting page margins/orientation, applying bold/italic/underline, paragraph spacing, inserting/merging tables, adding page numbers/headers, and saving cleanly.',
                    },
                  ],
                },
                {
                  id: 'KH-P3F-B01-CH02',
                  chapterNumber: 2,
                  code: 'Viva (30M)',
                  chapterName: 'Oral Board Interview',
                  nepaliChapterName: '२. मौखिक अन्तर्वार्ता (३० अङ्क)',
                  marksAllocation: '30 Marks',
                  chapterBrief:
                    'Assesses frontline courtesy, integrity, and practical awareness of office duties.',
                  topics: [
                    {
                      id: 'KH-P3F-B01-CH02-T01',
                      topicNumber: 1,
                      code: '2.1',
                      topic: 'Individual Oral Interview (30 Marks)',
                      nepaliTopic: 'व्यक्तिगत मौखिक अन्तर्वार्ता',
                      brief:
                        'Evaluates communication clarity, citizen-service attitude, basic constitutional/office knowledge, and ethical discipline.',
                    },
                  ],
                },
              ],
              keyReferences: 'Official Kharidar Phase I PDF (Pages 7–9)',
              materialPath:
                '/materials/official-psc/psc-official-kharidar-phase1.pdf',
              materialTitle: 'Official Kharidar Scheme PDF',
            },
          ],
        },
      ],
    },
  ],
};
