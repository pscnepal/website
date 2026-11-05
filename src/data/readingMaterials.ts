export interface ReadingMaterialItem {
  id: string;
  title: string;
  authority: string;
  codeOrEdition: string;
  pages: number;
  path: string;
  description: string;
  externalSourceUrl?: string;
}

export interface ReadingMaterialCategory {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  items: ReadingMaterialItem[];
}

export const READING_MATERIAL_CATEGORIES: ReadingMaterialCategory[] = [
  {
    id: 'official-psc-syllabi',
    name: 'Official PSC Syllabi',
    subtitle: 'Authentic Lok Sewa Aayog (psc.gov.np) Original PDFs',
    description:
      'Verbatim official syllabus gazettes published by the Public Service Commission of Nepal (लोक सेवा आयोग) for Section Officer, Nayab Subba, and Kharidar Phase I and Phase II examinations.',
    items: [
      {
        id: 'psc-official-so-phase1',
        title:
          'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Amended 2082/08/22',
        pages: 24,
        path: '/materials/official-psc/psc-official-section-officer-phase1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
        description:
          'Original Lok Sewa Aayog joint examination scheme and Paper I Administrative Aptitude Test (50 GK · 30 Aptitude · 20 English) with 45% qualifying cutoff.',
      },
      {
        id: 'psc-official-so-phase2',
        title:
          'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Main Written Papers',
        pages: 31,
        path: '/materials/official-psc/psc-official-section-officer-phase2.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
        description:
          'Original Lok Sewa Aayog Phase II syllabi covering Paper II Governance Systems, Paper III Contemporary Issues, and Paper IV Service-Related Subject.',
      },
      {
        id: 'psc-official-nasu-phase1',
        title:
          'Official PSC Nayab Subba (Non-Gazetted Class I) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Effective FY 2081/82',
        pages: 11,
        path: '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
        description:
          'Original Lok Sewa Aayog unified Non-Gazetted First Class examination scheme and Paper I (30 GK + 20 GMAT × 2 Marks = 100 Marks, Pass 45).',
      },
      {
        id: 'psc-official-nasu-phase2',
        title:
          'Official PSC Nayab Subba (Non-Gazetted Class I) Syllabus — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Papers II & III',
        pages: 12,
        path: '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
        description:
          'Original Lok Sewa Aayog Phase II syllabus for Paper II (Contemporary Studies & Public Service Management) and Paper III (General Administration — 14×5M + 3×10M).',
      },
      {
        id: 'psc-official-kharidar-phase1',
        title:
          'Official PSC Kharidar (Non-Gazetted Class II) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · GK & BOST',
        pages: 9,
        path: '/materials/official-psc/psc-official-kharidar-phase1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
        description:
          'Original Lok Sewa Aayog unified Non-Gazetted Second Class scheme and Paper I General Knowledge (60M) & Basic Office Skills Test (40M).',
      },
      {
        id: 'psc-official-kharidar-phase2',
        title:
          'Official PSC Kharidar (Non-Gazetted Class II) Syllabus — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Papers II & III',
        pages: 4,
        path: '/materials/official-psc/psc-official-kharidar-phase2.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
        description:
          'Original Lok Sewa Aayog Phase II common written papers: Paper II Office Management & Mathematics (12×5M + 4×10M) and Paper III Job Knowledge (8×5M + 6×10M).',
      },
    ],
  },
  {
    id: 'psc-syllabus',
    name: 'PSC Syllabus Digests',
    subtitle: 'Structured English Summaries & Weightage Matrices',
    description:
      'Clean English paper-by-paper examination blueprints, mark weightage tables, and qualifying/merit rules distilled from official Lok Sewa Aayog syllabi.',
    items: [
      {
        id: 'psc-section-officer',
        title: 'PSC Gazetted Third Class (Section Officer) Syllabus Digest',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Gazetted III · 360M Merit Scheme',
        pages: 4,
        path: '/materials/psc-section-officer-syllabus.pdf',
        description:
          'Structured English digest of Phase I AAT (45% pass gate, 0% carryover), Phase II Papers II–IV (300M), and Final Stage IT, Group Test & Viva (60M).',
      },
      {
        id: 'psc-nayab-subba',
        title: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum Digest',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Non-Gazetted I · 240M Merit Scheme',
        pages: 4,
        path: '/materials/psc-nayab-subba-syllabus.pdf',
        description:
          'Structured English digest of FY 2081/82 Stage I GK & GMAT (45M pass, 0% carryover), Papers II & III (14×5M + 3×10M each), Computer Skill (10M), and Viva (30M).',
      },
      {
        id: 'psc-kharidar',
        title: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus Digest',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Non-Gazetted II · 240M Merit Scheme',
        pages: 4,
        path: '/materials/psc-kharidar-syllabus.pdf',
        description:
          'Structured English digest of Stage I GK & BOST (45M pass, 0% carryover), Paper II Office Management & Math, Paper III Job Knowledge, and 40M Final Stage.',
      },
      {
        id: 'psc-gk-matrix',
        title: 'PSC General Knowledge & Aptitude Master Reference',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Cross-Level Specification Grid',
        pages: 3,
        path: '/materials/psc-gk-aptitude-outline.pdf',
        description:
          'Unit-by-unit topic weightage comparison across Geography, History, Polity, Economy, Environment, Science, International Affairs, and -20% OMR strategy.',
      },
    ],
  },
  {
    id: 'nepal-parichaya',
    name: 'Nepal Parichaya (नेपाल परिचय)',
    subtitle: 'All 13 Official Editions & Curated Syllabus Volumes',
    description:
      'Official compendiums published by the Department of Information and Broadcasting (सूचना तथा प्रसारण विभाग), Government of Nepal, covering geography, history, culture, constitution, 2078 census demographics, and federal governance across all 13 editions.',
    items: [
      {
        id: 'nepal-parichaya-13th-edition-2082',
        title: 'नेपाल परिचय (१३ औं संस्करण), २०८२',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '13th Edition · 2082 BS (2025 AD)',
        pages: 428,
        path: '/materials/nepal-parichaya-13th-edition-2082.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2013th%20edition_2082_Finall_g0xrjjr.pdf',
        description:
          'Latest baseline compendium covering geography, history, Census 2078 demographics, 753 local government units, and updated macroeconomic indicators.',
      },
      {
        id: 'nepal-parichaya-12th-edition-2081',
        title: 'नेपाल परिचय (१२ औं संस्करण), २०८१',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '12th Edition · 2081 BS (2024 AD)',
        pages: 412,
        path: '/materials/nepal-parichaya-12th-edition-2081.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal_Parichaya_12th_edition_2081_website_Final.pdf',
        description:
          'Comprehensive update of provincial GDP contributions, ecological conservation zones, flora/fauna reserves, and civil service administration.',
      },
      {
        id: 'nepal-parichaya-11th-edition-2080',
        title: 'नेपाल परिचय (११ औं संस्करण), २०८०',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '11th Edition · 2080 BS (2023 AD)',
        pages: 396,
        path: '/materials/nepal-parichaya-11th-edition-2080.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/app/public/23/posts/1697528158_10.pdf',
        description:
          'First edition integrating official National Census 2078 results (142 castes/ethnicities, 124 mother tongues, and revised literacy matrices).',
      },
      {
        id: 'nepal-parichaya-10th-edition-2079',
        title: 'नेपाल परिचय (१० औं संस्करण), २०७९',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '10th Edition · 2079 BS (2022 AD)',
        pages: 384,
        path: '/materials/nepal-parichaya-10th-edition-2079.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/app/public/23/posts/1663745737_77.pdf',
        description:
          'Tenth jubilee edition highlighting public administrative reform, national heritage monuments, and periodic planning targets.',
      },
      {
        id: 'nepal-parichaya-9th-edition-2078',
        title: 'नेपाल परिचय (९ औं संस्करण), २०७८',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '9th Edition · 2078 BS (2021 AD)',
        pages: 376,
        path: '/materials/nepal-parichaya-9th-edition-2078.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-9',
        description:
          'Focuses on Sustainable Development Goals (SDGs), pandemic recovery governance, and modern diplomatic relations.',
      },
      {
        id: 'nepal-parichaya-8th-edition-2077',
        title: 'नेपाल परिचय (८ औं संस्करण), २०७७',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '8th Edition · 2077 BS (2020 AD)',
        pages: 368,
        path: '/materials/nepal-parichaya-8th-edition-2077.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-8',
        description:
          'Features the historic updated political map of Nepal (चुच्चे नक्सा) incorporating Limpiyadhura, Lipulekh, and Kalapani.',
      },
      {
        id: 'nepal-parichaya-7th-edition-2076',
        title: 'नेपाल परिचय (७ औं संस्करण), २०७६',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '7th Edition · 2076 BS (2019 AD)',
        pages: 360,
        path: '/materials/nepal-parichaya-7th-edition-2076.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-7',
        description:
          'Cooperative federalism frameworks, intergovernmental fiscal transfers, and provincial administrative centers.',
      },
      {
        id: 'nepal-parichaya-6th-edition-2075',
        title: 'नेपाल परिचय (६ औं संस्करण), २०७५',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '6th Edition · 2075 BS (2018 AD)',
        pages: 352,
        path: '/materials/nepal-parichaya-6th-edition-2075.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-6',
        description:
          'Post-2017 general election three-tier government structure and Local Government Operation Act (LGOA 2074) mandates.',
      },
      {
        id: 'nepal-parichaya-5th-edition-2074',
        title: 'नेपाल परिचय (५ औं संस्करण), २०७४',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '5th Edition · 2074 BS (2017 AD)',
        pages: 344,
        path: '/materials/nepal-parichaya-5th-edition-2074.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-5',
        description:
          'Rollout of the 7-province system and restructuring of Nepal into 753 local government units.',
      },
      {
        id: 'nepal-parichaya-4th-edition-2073',
        title: 'नेपाल परिचय (४ औं संस्करण), २०७३',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '4th Edition · 2073 BS (2016 AD)',
        pages: 336,
        path: '/materials/nepal-parichaya-4th-edition-2073.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-4',
        description:
          'First edition published after the promulgation of the Constitution of Nepal (२०७२), featuring fundamental rights and state directives.',
      },
      {
        id: 'nepal-parichaya-3rd-edition-2072',
        title: 'नेपाल परिचय (३ औं संस्करण), २०७२',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '3rd Edition · 2072 BS (2015 AD)',
        pages: 320,
        path: '/materials/nepal-parichaya-3rd-edition-2072.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-3',
        description:
          'Comprehensive pre-constitution reference on Nepal physical geography, river basins, cultural heritage, and administrative divisions.',
      },
      {
        id: 'nepal-parichaya-2nd-edition-2070',
        title: 'नेपाल परिचय (२ औं संस्करण), २०७०',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '2nd Edition · 2070 BS (2013 AD)',
        pages: 312,
        path: '/materials/nepal-parichaya-2nd-edition-2070.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-2',
        description:
          'Second revised edition updating economic indicators, energy developments, and census trends.',
      },
      {
        id: 'nepal-parichaya-1st-edition-2069',
        title: 'नेपाल परिचय (१ औं संस्करण - पूर्ण परिमार्जित), २०६९',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '1st Revised Edition · 2069 BS (2012 AD)',
        pages: 304,
        path: '/materials/nepal-parichaya-1st-edition-2069.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316#edition-1',
        description:
          'The foundational master revised compendium commissioned by the Government of Nepal for public knowledge and civil service preparation.',
      },
      {
        id: 'np-geography',
        title: 'Nepal Parichaya: Physical Geography & Ecological Belts',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. I · Geography',
        pages: 5,
        path: '/materials/nepal-parichaya-geography.pdf',
        description:
          '147,516 sq. km area, Himal/Pahad/Terai physiography, Koshi-Gandaki-Karnali river basins, altitudinal climate zones, and protected areas.',
      },
      {
        id: 'np-history',
        title: 'Nepal Parichaya: Historical Timeline & Modern Transition',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. II · History',
        pages: 5,
        path: '/materials/nepal-parichaya-history.pdf',
        description:
          'Kirat, Licchavi, and Malla foundations, national unification, social reform decrees, and the 2007, 2046, and 2062/63 BS democratic milestones.',
      },
      {
        id: 'np-culture',
        title: 'Nepal Parichaya: Culture, Languages & National Heritage',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. III · Heritage',
        pages: 4,
        path: '/materials/nepal-parichaya-culture-heritage.pdf',
        description:
          'National Census 2078 demographics (142 groups, 124 languages), UNESCO Cultural and Natural World Heritage Sites, and constitutional emblems.',
      },
      {
        id: 'np-federal',
        title: 'Nepal Parichaya: Federal Structure & Local Governance',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. IV · Polity',
        pages: 4,
        path: '/materials/nepal-parichaya-federal-structure.pdf',
        description:
          'Cooperative federalism principles (Article 232), all 7 provinces with capitals and Schedule-4 districts, and the 753 local government tiers.',
      },
    ],
  },
  {
    id: 'laws-and-acts',
    name: 'Laws & Legislation',
    subtitle: 'Constitution, Civil Service, RTI & Good Governance Acts',
    description:
      'Core constitutional provisions, civil service recruitment & conduct statutes, citizen right-to-information timelines, and administrative governance laws.',
    items: [
      {
        id: 'law-constitution-2072',
        title: 'Constitution of Nepal (2072) — Core Articles & Rights',
        authority: 'Nepal Law Commission Digest',
        codeOrEdition: '2072 BS · 35 Parts · 308 Articles',
        pages: 5,
        path: '/materials/constitution-of-nepal-2072.pdf',
        description:
          'Constitutional supremacy, Part 3 Fundamental Rights & Duties (Articles 16–48), Federal Legislature/Executive/Judiciary, Schedules 5–9, and 13 Commissions.',
      },
      {
        id: 'law-civil-service-2049',
        title: 'Civil Service Act, 2049 (1993) — Core Provisions',
        authority: 'Public Administration Statutes',
        codeOrEdition: 'Act 2049 · Consolidated',
        pages: 4,
        path: '/materials/civil-service-act-2049.pdf',
        description:
          'Gazetted and Non-Gazetted classification, PSC merit recruitment, Section 7(7) 45% inclusive reservation breakdown, probation, tenure, and code of conduct.',
      },
      {
        id: 'law-rti-2064',
        title: 'Right to Information Act, 2064 (2007)',
        authority: 'Public Administration Statutes',
        codeOrEdition: 'Act 2064 · Transparency',
        pages: 4,
        path: '/materials/right-to-information-act-2064.pdf',
        description:
          'Section 5 quarterly proactive disclosure, Information Officer duties, 15-day & 24-hour response timelines, Section 3(3) exemptions, and NIC appeals.',
      },
      {
        id: 'law-good-governance-2064',
        title: 'Good Governance (Management & Operation) Act, 2064',
        authority: 'Public Administration Statutes',
        codeOrEdition: 'Act 2064 · Service Delivery',
        pages: 3,
        path: '/materials/good-governance-act-2064.pdf',
        description:
          'Administrative decision accountability, Citizen Charters with compensation (Sec. 25), Public Hearings (Sec. 30), Conflict of Interest (Sec. 18), and Grievance Boxes.',
      },
    ],
  },
  {
    id: 'planning-and-governance-statutes',
    name: 'Plan, Local Govt & Integrity Acts',
    subtitle: '16th Plan, Local Govt Operation, Anti-Corruption & Procurement',
    description:
      'Compulsory PSC Papers II–IV statutes and policy digests covering the Sixteenth Periodic Plan, Local Government Operation Act 2074, Corruption Prevention Act 2059, and Public Procurement & Fiscal Accountability Acts.',
    items: [
      {
        id: 'plan-sixteenth',
        title: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
        authority: 'National Planning Commission Digest',
        codeOrEdition: '16th Plan · Strategic Summary',
        pages: 3,
        path: '/materials/sixteenth-plan-summary.pdf',
        description:
          '"Good Governance, Social Justice, and Prosperity" vision, macroeconomic growth & poverty reduction benchmarks, 2026 LDC graduation, and green/digital priorities.',
      },
      {
        id: 'law-lgoa-2074',
        title: 'Local Government Operation Act, 2074 — Core PSC Provisions',
        authority: 'Public Administration Statutes',
        codeOrEdition: 'Act 2074 · Local Governance',
        pages: 4,
        path: '/materials/local-government-operation-act-2074.pdf',
        description:
          'Municipal classification, Ward Committee frontline functions, 7-step participatory local planning & Ashadh 10 budget cycle, Article 217 Judicial Committee, and CAO role.',
      },
      {
        id: 'law-corruption-2059',
        title: 'Prevention of Corruption Act, 2059 & CIAA Mandate',
        authority: 'Public Integrity Statutes',
        codeOrEdition: 'Act 2059 · Anti-Corruption',
        pages: 4,
        path: '/materials/corruption-prevention-act-2059.pdf',
        description:
          'Statutory corruption offenses (bribery, revenue leakage, public property loss, illicit enrichment), 60-day property declaration (Sec. 50), CIAA Article 239 powers, and NVC.',
      },
      {
        id: 'law-procurement-2063',
        title:
          'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
        authority: 'Public Financial Management Statutes',
        codeOrEdition: 'Acts 2063 & 2076 · PFM',
        pages: 4,
        path: '/materials/public-procurement-fiscal-act.pdf',
        description:
          'Procurement methods, sealed quotation & e-GP bidding, security deposits, Accounting Officer accountability, TSA/LMBIS, internal control, and 35-day Beruju settlement.',
      },
    ],
  },
];
