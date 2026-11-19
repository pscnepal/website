import type {
  ReadingMaterialCategory,
  ReadingMaterialItem,
} from '../types/materials';

export type { ReadingMaterialCategory, ReadingMaterialItem };

export const READING_MATERIAL_CATEGORIES: ReadingMaterialCategory[] = [
  {
    id: 'official-psc-syllabi',
    name: 'Official PSC Syllabi',
    subtitle: 'Authentic Lok Sewa Aayog (psc.gov.np) Original PDFs',
    description:
      'Verbatim official syllabus gazettes published by the Public Service Commission of Nepal (लोक सेवा आयोग) across Gazetted Class III Section Officer, Non-Gazetted Class I Nayab Subba, Non-Gazetted Class II Kharidar, Justice, Parliament, Audit, IT, Economist, Statistics, and NHRC tracks.',
    items: [
      {
        id: 'psc-official-so-phase1',
        title:
          'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Amended 2082/08/22',
        pages: 24,
        path: 'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
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
        path: 'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
        description:
          'Original Lok Sewa Aayog Phase II syllabi covering Paper II Governance Systems, Paper III Contemporary Issues, and Paper IV Service-Related Subject (Admin, Foreign, Audit, Parliament).',
      },
      {
        id: 'psc-official-so-justice-phase1',
        title:
          'Official PSC Nepal Justice / Law / Govt Attorney (Gazetted III) — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Judicial Service · Preliminary',
        pages: 10,
        path: 'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd.pdf',
        description:
          'Official Lok Sewa Aayog Phase I screening syllabus for Nepal Justice Service (Law, Justice, and Government Attorney groups).',
      },
      {
        id: 'psc-official-so-justice-phase2',
        title:
          'Official PSC Nepal Justice / Law / Govt Attorney (Gazetted III) — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Judicial Service · Main Written',
        pages: 14,
        path: 'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd1.pdf',
        description:
          'Official Phase II written examination syllabus covering Constitutional Law, Jurisprudence, Procedural Codes, and Judicial Drafting for Law Officer candidates.',
      },
      {
        id: 'psc-official-so-justice-phase3',
        title:
          'Official PSC Nepal Justice / Law / Govt Attorney (Gazetted III) — Final Stage',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Judicial Service · Stage III',
        pages: 6,
        path: 'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd2.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/201812170257005c176860edfcd2.pdf',
        description:
          'Official Final Stage practical IT skill test, legal case presentation, and interview assessment scheme for Nepal Judicial Service.',
      },
      {
        id: 'psc-official-so-parliament-phase1',
        title:
          'Official PSC Federal Parliament Service (Section Officer) — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Internal Promotion · Amended 2082/08',
        pages: 8,
        path: 'https://psc.gov.np/site_uploads/course/20251210094330693940c2115ff.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20251210094330693940c2115ff.pdf',
        description:
          'Updated 2082 BS Lok Sewa Aayog Phase I syllabus for Nepal Parliament Service General Administration Section Officer.',
      },
      {
        id: 'psc-official-so-parliament-phase2',
        title:
          'Official PSC Federal Parliament Service (Section Officer) — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Parliamentary Procedure & Bills · 2082/08',
        pages: 10,
        path: 'https://psc.gov.np/site_uploads/course/2025120911140069380478ac8271.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2025120911140069380478ac8271.pdf',
        description:
          'Updated 2082 BS Phase II syllabus covering Legislative Procedure, Parliamentary Committees, Secretariat Operations, and Privilege Rules.',
      },
      {
        id: 'psc-official-so-economist-phase1',
        title: 'Official PSC Economist (Gazetted III) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Miscellaneous Service · Paper I',
        pages: 8,
        path: 'https://psc.gov.np/site_uploads/course/20231110072806654ddb86628df.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110072806654ddb86628df.pdf',
        description:
          'Official Lok Sewa Aayog Phase I objective syllabus for Gazetted Third Class Economist posts under Nepal Miscellaneous Service.',
      },
      {
        id: 'psc-official-so-economist-phase2',
        title: 'Official PSC Economist (Gazetted III) Syllabus — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Macroeconomics, Public Finance & Econometrics',
        pages: 12,
        path: 'https://psc.gov.np/site_uploads/course/20231110072806654ddb86628df1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110072806654ddb86628df1.pdf',
        description:
          'Official Phase II written syllabus covering Micro/Macroeconomic Theory, Nepalese Public Finance, Development Economics, and Econometric Modeling.',
      },
      {
        id: 'psc-official-so-stats-phase1',
        title:
          'Official PSC Statistics / Demographer Officer (Gazetted III) — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Economic Planning & Statistics Service',
        pages: 8,
        path: 'https://psc.gov.np/site_uploads/course/20231110081301654de60d75131.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110081301654de60d75131.pdf',
        description:
          'Official Phase I syllabus for Economic Planning and Statistics Service Demographer and Statistics Officer candidates.',
      },
      {
        id: 'psc-official-so-stats-phase2',
        title:
          'Official PSC Statistics / Demographer Officer (Gazetted III) — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Sampling, Demography & National Accounts',
        pages: 12,
        path: 'https://psc.gov.np/site_uploads/course/20231110081301654de60d751311.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110081301654de60d751311.pdf',
        description:
          'Official Phase II written syllabus covering Statistical Inference, Survey Sampling, Demographic Analysis, and System of National Accounts.',
      },
      {
        id: 'psc-official-so-computer-phase1',
        title:
          'Official PSC Computer Officer (Gazetted III) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Miscellaneous IT Service · Paper I',
        pages: 7,
        path: 'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad7373.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad7373.pdf',
        description:
          'Official Lok Sewa Aayog Phase I technical screening syllabus for Computer Officer positions.',
      },
      {
        id: 'psc-official-so-computer-phase2',
        title:
          'Official PSC Computer Officer (Gazetted III) Syllabus — Phase II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Systems, Databases, Networks & E-Governance',
        pages: 10,
        path: 'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf',
        description:
          'Official Phase II technical written syllabus covering Operating Systems, RDBMS, Cybersecurity, Software Engineering, and Nepal Electronic Transactions Act.',
      },
      {
        id: 'psc-official-nhrc-hr-phase2',
        title:
          'Official PSC Human Rights Officer (NHRC Gazetted III) — Phase I & II',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'National Human Rights Service · Complete',
        pages: 14,
        path: 'https://psc.gov.np/site_uploads/course/20221213030523639894b3a72631.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20221213030523639894b3a7263.pdf',
        description:
          'Official Lok Sewa Aayog syllabus for Human Rights Officer covering International Human Rights Instruments, NHRC Act 2068, and Fundamental Rights enforcement.',
      },
      {
        id: 'psc-official-nasu-phase1',
        title:
          'Official PSC Nayab Subba (Non-Gazetted Class I) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · Effective FY 2081/82',
        pages: 11,
        path: 'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
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
        path: 'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
        description:
          'Original Lok Sewa Aayog Phase II syllabus for Paper II (Contemporary Studies & Public Service Management) and Paper III (General Admin, Accounts, Revenue, Justice, Foreign).',
      },
      {
        id: 'psc-official-nasu-computer-op',
        title:
          'Official PSC Computer Operator (Non-Gazetted Class I) Syllabus',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Miscellaneous Service · Level I',
        pages: 9,
        path: 'https://psc.gov.np/site_uploads/course/2024020706362365c324e776b76.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024020706362365c324e776b76.pdf',
        description:
          'Official Lok Sewa Aayog syllabus for Computer Operator covering Windows/Linux, Office Suite, Database, Networking, Nepali Typing, and IT Practical.',
      },
      {
        id: 'psc-official-nasu-stats',
        title:
          'Official PSC Statistics Assistant / Customs Inspector (Non-Gazetted I)',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Economic Planning & Statistics Service',
        pages: 9,
        path: 'https://psc.gov.np/site_uploads/course/2024020607541765c1e5a907381.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024020607541765c1e5a907381.pdf',
        description:
          'Official Non-Gazetted First Class syllabus for Statistics Assistant, Supervisor, and Customs Signal Inspector posts.',
      },
      {
        id: 'psc-official-kharidar-phase1',
        title:
          'Official PSC Kharidar (Non-Gazetted Class II) Syllabus — Phase I',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Approved 2081/03/20 · GK & BOST',
        pages: 9,
        path: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
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
        path: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca1.pdf',
        description:
          'Original Lok Sewa Aayog Phase II common written papers: Paper II Office Management & Mathematics (12×5M + 4×10M) and Paper III Job Knowledge (8×5M + 6×10M).',
      },
      {
        id: 'psc-official-kharidar-internal',
        title:
          'Official PSC Kharidar Internal Promotion (Admin, Accounts, Audit & Justice)',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Unified Internal Promotion Scheme',
        pages: 10,
        path: 'https://psc.gov.np/site_uploads/course/20220906011439631747bf3c7d9.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/20220906011439631747bf3c7d9.pdf',
        description:
          'Official internal promotion syllabus for Kharidar, Assistant Accountant, Audit Inspector, and Judicial Dittha/Tameldar across Admin, Accounts, Audit, and Justice.',
      },
      {
        id: 'psc-official-kharidar-asst-comp',
        title:
          'Official PSC Assistant Computer Operator (Non-Gazetted Class II)',
        authority: 'Public Service Commission, Nepal (लोक सेवा आयोग)',
        codeOrEdition: 'Nepal Miscellaneous Service · Level II',
        pages: 8,
        path: 'https://psc.gov.np/site_uploads/course/2024030801502265eb179e0ecf3.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024030801502265eb179e0ecf3.pdf',
        description:
          'Official Non-Gazetted Second Class syllabus for Assistant Computer Operator covering Office Automation, Hardware Basics, and Practical Skill Test.',
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
        path: 'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
        description:
          'Structured English digest of Phase I AAT (45% pass gate, 0% carryover), Phase II Papers II–IV (300M), and Final Stage IT, Group Test & Viva (60M).',
      },
      {
        id: 'psc-nayab-subba',
        title: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum Digest',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Non-Gazetted I · 240M Merit Scheme',
        pages: 4,
        path: 'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
        description:
          'Structured English digest of FY 2081/82 Stage I GK & GMAT (45M pass, 0% carryover), Papers II & III (14×5M + 3×10M each), Computer Skill (10M), and Viva (30M).',
      },
      {
        id: 'psc-kharidar',
        title: 'PSC Kharidar (Non-Gazetted Second Class) Syllabus Digest',
        authority: 'PSC Curriculum Study Series',
        codeOrEdition: 'Non-Gazetted II · 240M Merit Scheme',
        pages: 4,
        path: 'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/2024072511005966a2306b5a7ca.pdf',
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
        externalSourceUrl:
          'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
        description:
          'Unit-by-unit topic weightage comparison across Geography, History, Polity, Economy, Environment, Science, International Affairs, and -20% OMR strategy.',
      },
    ],
  },
  {
    id: 'nepal-parichaya',
    name: 'Nepal Parichaya (नेपाल परिचय)',
    subtitle: 'All 14 Official Editions, English Edition & Curated Volumes',
    description:
      'Official compendiums published by the Department of Information and Broadcasting (सूचना तथा प्रसारण विभाग), Government of Nepal, covering geography, history, culture, constitution, 2078 census demographics, and federal governance from the 1st edition (२०६९) to the latest 14th edition (२०८३) plus the Official English Edition.',
    items: [
      {
        id: 'nepal-parichaya-14th-edition-2083',
        title: 'नेपाल परिचय (१४ औं संस्करण), २०८३',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '14th Edition · 2083 BS (2026 AD)',
        pages: 440,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        description:
          'Latest official 14th edition (2083 BS) from DoIB integrating updated 16th Plan milestones, Census 2078 disaggregations, 753 local level indicators, and current state affairs.',
      },
      {
        id: 'nepal-parichaya-english-edition',
        title: 'Introduction to Nepal (Nepal Parichaya — Official English Edition)',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: 'Official English Translation · DoIB',
        pages: 380,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%20Final_English_Website_x4mezwe.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%20Final_English_Website_x4mezwe.pdf',
        description:
          'Official English-language compendium published by DoIB covering Nepalese history, topography, biodiversity, constitutional evolution, economy, and foreign relations.',
      },
      {
        id: 'nepal-parichaya-13th-edition-2082',
        title: 'नेपाल परिचय (१३ औं संस्करण), २०८२',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '13th Edition · 2082 BS (2025 AD)',
        pages: 428,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2013th%20edition_2082_Finall_g0xrjjr.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2013th%20edition_2082_Finall_g0xrjjr.pdf',
        description:
          'Baseline 2082 BS compendium covering geography, history, Census 2078 demographics, 753 local government units, and updated macroeconomic indicators.',
      },
      {
        id: 'nepal-parichaya-12th-edition-2081',
        title: 'नेपाल परिचय (१२ औं संस्करण), २०८१',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '12th Edition · 2081 BS (2024 AD)',
        pages: 412,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal_Parichaya_12th_edition_2081_website_Final.pdf',
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
        path: 'https://giwmscdnone.gov.np/media/app/public/23/posts/1697528158_10.pdf',
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
        path: 'https://giwmscdnone.gov.np/media/app/public/23/posts/1663745737_77.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/app/public/23/posts/1663745737_77.pdf',
        description:
          'Tenth jubilee edition highlighting public administrative reform, national heritage monuments, and periodic planning targets.',
      },
      {
        id: 'nepal-parichaya-9th-edition-2078',
        title: 'नेपाल परिचय (९ औं संस्करण), २०७८',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '9th Edition · 2078 BS (Archive Digest)',
        pages: 376,
        path: '/materials/nepal-parichaya-9th-edition-2078.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Focuses on Sustainable Development Goals (SDGs), pandemic recovery governance, and modern diplomatic relations.',
      },
      {
        id: 'nepal-parichaya-8th-edition-2077',
        title: 'नेपाल परिचय (८ औं संस्करण), २०७७',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '8th Edition · 2077 BS (Archive Digest)',
        pages: 368,
        path: '/materials/nepal-parichaya-8th-edition-2077.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Features the historic updated political map of Nepal (चुच्चे नक्सा) incorporating Limpiyadhura, Lipulekh, and Kalapani.',
      },
      {
        id: 'nepal-parichaya-7th-edition-2076',
        title: 'नेपाल परिचय (७ औं संस्करण), २०७६',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '7th Edition · 2076 BS (Archive Digest)',
        pages: 360,
        path: '/materials/nepal-parichaya-7th-edition-2076.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Cooperative federalism frameworks, intergovernmental fiscal transfers, and provincial administrative centers.',
      },
      {
        id: 'nepal-parichaya-6th-edition-2075',
        title: 'नेपाल परिचय (६ औं संस्करण), २०७५',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '6th Edition · 2075 BS (Archive Digest)',
        pages: 352,
        path: '/materials/nepal-parichaya-6th-edition-2075.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Post-2017 general election three-tier government structure and Local Government Operation Act (LGOA 2074) mandates.',
      },
      {
        id: 'nepal-parichaya-5th-edition-2074',
        title: 'नेपाल परिचय (५ औं संस्करण), २०७४',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '5th Edition · 2074 BS (Archive Digest)',
        pages: 344,
        path: '/materials/nepal-parichaya-5th-edition-2074.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Rollout of the 7-province system and restructuring of Nepal into 753 local government units.',
      },
      {
        id: 'nepal-parichaya-4th-edition-2073',
        title: 'नेपाल परिचय (४ औं संस्करण), २०७३',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '4th Edition · 2073 BS (Archive Digest)',
        pages: 336,
        path: '/materials/nepal-parichaya-4th-edition-2073.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'First edition published after the promulgation of the Constitution of Nepal (२०७२), featuring fundamental rights and state directives.',
      },
      {
        id: 'nepal-parichaya-3rd-edition-2072',
        title: 'नेपाल परिचय (३ औं संस्करण), २०७२',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '3rd Edition · 2072 BS (Archive Digest)',
        pages: 320,
        path: '/materials/nepal-parichaya-3rd-edition-2072.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Comprehensive pre-constitution reference on Nepal physical geography, river basins, cultural heritage, and administrative divisions.',
      },
      {
        id: 'nepal-parichaya-2nd-edition-2070',
        title: 'नेपाल परिचय (२ औं संस्करण), २०७०',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '2nd Edition · 2070 BS (Archive Digest)',
        pages: 312,
        path: '/materials/nepal-parichaya-2nd-edition-2070.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'Second revised edition updating economic indicators, energy developments, and census trends.',
      },
      {
        id: 'nepal-parichaya-1st-edition-2069',
        title: 'नेपाल परिचय (१ औं संस्करण - पूर्ण परिमार्जित), २०६९',
        authority: 'Department of Information and Broadcasting (DoIB)',
        codeOrEdition: '1st Revised Edition · 2069 BS (Archive Digest)',
        pages: 304,
        path: '/materials/nepal-parichaya-1st-edition-2069.pdf',
        externalSourceUrl: 'https://doib.gov.np/category/1316',
        description:
          'The foundational master revised compendium commissioned by the Government of Nepal for public knowledge and civil service preparation.',
      },
      {
        id: 'np-geography',
        title: 'Nepal Parichaya: Physical Geography & Ecological Belts',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. I · Geography Study Digest',
        pages: 5,
        path: '/materials/nepal-parichaya-geography.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        description:
          '147,516 sq. km area, Himal/Pahad/Terai physiography, Koshi-Gandaki-Karnali river basins, altitudinal climate zones, and protected areas.',
      },
      {
        id: 'np-history',
        title: 'Nepal Parichaya: Historical Timeline & Modern Transition',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. II · History Study Digest',
        pages: 5,
        path: '/materials/nepal-parichaya-history.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        description:
          'Kirat, Licchavi, and Malla foundations, national unification, social reform decrees, and the 2007, 2046, and 2062/63 BS democratic milestones.',
      },
      {
        id: 'np-culture',
        title: 'Nepal Parichaya: Culture, Languages & National Heritage',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. III · Heritage Study Digest',
        pages: 4,
        path: '/materials/nepal-parichaya-culture-heritage.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        description:
          'National Census 2078 demographics (142 groups, 124 languages), UNESCO Cultural and Natural World Heritage Sites, and constitutional emblems.',
      },
      {
        id: 'np-federal',
        title: 'Nepal Parichaya: Federal Structure & Local Governance',
        authority: 'Dept. of Information Compendium',
        codeOrEdition: 'Vol. IV · Polity Study Digest',
        pages: 4,
        path: '/materials/nepal-parichaya-federal-structure.pdf',
        externalSourceUrl:
          'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Parichaya%2014th%20edition_2083_With%20Cover_fjr5vfa.pdf',
        description:
          'Cooperative federalism principles (Article 232), all 7 provinces with capitals and Schedule-4 districts, and the 753 local government tiers.',
      },
    ],
  },
  {
    id: 'laws-and-acts',
    name: 'Constitution & Admin Laws',
    subtitle: 'Nepal Law Commission Official Statutes & Rules',
    description:
      'Authentic consolidated Nepali & English PDFs from the Nepal Law Commission covering the Constitution of Nepal (updated 2081 BS), Civil Service Act & Rules, PSC Act 2079, Good Governance Act & Rules, Right to Information Act, and Monitoring & Evaluation Act 2080.',
    items: [
      {
        id: 'law-constitution-2072',
        title: 'नेपालको संविधान (अद्यावधिक भाद्र २०८१) — Constitution of Nepal',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: '2072 BS (Updated Bhadra 2081) · Nepali',
        pages: 224,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8B%20%E0%A4%B8_%E0%A4%82%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%E0%A4%A8%20unicode%20%E0%A4%AD%E0%A4%BE%E0%A4%A6%E0%A5%8D%E0%A4%B0%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A7_mtbuyjt.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13437/nepal-s-constitution/',
        description:
          'Official Unicode PDF of the Constitution of Nepal (35 Parts, 308 Articles, 9 Schedules) including Fundamental Rights, Federalism, and Constitutional Bodies.',
      },
      {
        id: 'law-constitution-english',
        title: 'Constitution of Nepal (2nd Amendment) — Official English Text',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: '2015 (With 2nd Amendment) · English',
        pages: 226,
        path: 'https://giwmscdnone.gov.np/media/files/Constitution%20of%20Nepal%20(2nd%20amd.%20English)_xf33zb3.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13437/nepal-s-constitution/',
        description:
          'Official English translation published by the Nepal Law Commission incorporating the Second Amendment (political map Schedule-3 update).',
      },
      {
        id: 'law-civil-service-2049',
        title: 'निजामती सेवा ऐन, २०४९ — Civil Service Act, 2049',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2049 · Consolidated',
        pages: 78,
        path: 'https://giwmscdnone.gov.np/media/app/public/275/posts/1719471204_53.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/12254/12254-civil-service-act-2049/',
        description:
          'Gazetted and Non-Gazetted classification, PSC merit recruitment, Section 7(7) 45% inclusive reservation breakdown, promotion, tenure, and conduct.',
      },
      {
        id: 'law-civil-service-rules-2050',
        title: 'निजामती सेवा नियमावली, २०५० — Civil Service Rules, 2050',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Rules 2050 · Consolidated',
        pages: 136,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/4.%E0%A4%A8%E0%A4%BF%E0%A4%9C%E0%A4%BE%E0%A4%AE%E0%A4%A4%E0%A5%80%20%E0%A4%B8%E0%A5%87%E0%A4%B5%E0%A4%BE%20%E0%A4%A8%E0%A4%BF%E0%A4%AF%E0%A4%AE%E0%A4%BE%E0%A4%B5%E0%A4%B2%E0%A5%80%2C%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%A6_pfvrlxe.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1765/',
        description:
          'Detailed service conditions, performance evaluation (KaSaMu) forms, leave rules, departmental action procedures, and retirement benefits.',
      },
      {
        id: 'law-psc-act-2079',
        title: 'लोक सेवा आयोग ऐन, २०७९ — Public Service Commission Act, 2079',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2079 BS · Statutory Mandate',
        pages: 26,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A5%A8%E0%A5%AC._%E0%A4%B2%E0%A4%95_%E0%A4%B8%E0%A4%B5_%E0%A4%86%E0%A4%AF%E0%A4%97_%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AF.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Statutory authority, examination integrity rules, advisory consultation mandate for civil, security, and corporate bodies under Article 243.',
      },
      {
        id: 'law-good-governance-2064',
        title:
          'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ — Good Governance Act, 2064',
        authority: 'Nepal Law Commission / CIAA',
        codeOrEdition: 'Act 2064 · Service Delivery',
        pages: 24,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/10.%E0%A4%B8%E0%A5%81%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A4%A8%20(%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%AA%E0%A4%A8%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B8%E0%A4%9E%E0%A5%8D%E0%A4%9A%E0%A4%BE%E0%A4%B2%E0%A4%A8)%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AA_rbx6erv.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Administrative decision accountability, Citizen Charters with compensation (Sec. 25), Public Hearings (Sec. 30), Conflict of Interest (Sec. 18), and Grievance Boxes.',
      },
      {
        id: 'law-good-governance-rules-2065',
        title:
          'सुशासन (व्यवस्थापन तथा सञ्चालन) नियमावली, २०६५ — Good Governance Rules',
        authority: 'CIAA / Government of Nepal',
        codeOrEdition: 'Rules 2065 · Operational Manual',
        pages: 28,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/https___ciaa.gov.np_uploads_publicationsAndReports_TWZrQm_zuyj2qp.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'Implementing regulations for ministry/department decision timelines, nodal officer responsibilities, public audits, and spokesperson standards.',
      },
      {
        id: 'law-rti-2064',
        title: 'सूचनाको हक सम्बन्धी ऐन, २०६४ — Right to Information Act, 2064',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2064 · Transparency',
        pages: 22,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/16.%E0%A4%B8%E0%A4%9A%E0%A4%A8%E0%A4%95_%E0%A4%B9%E0%A4%95_%E0%A4%B8%E0%A4%AE%E0%A4%AC%E0%A4%A8%E0%A4%A7_%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AA.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1784/',
        description:
          'Section 5 quarterly proactive disclosure, Information Officer duties, 15-day & 24-hour response timelines, Section 3(3) exemptions, and NIC appeals.',
      },
      {
        id: 'law-monitoring-eval-2080',
        title:
          'अनुगमन तथा मूल्याङ्कन ऐन, २०८० — Monitoring & Evaluation Act, 2080',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2080 BS · Project Governance',
        pages: 18,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%85%E0%A4%A8%E0%A5%81%E0%A4%97%E0%A4%AE%E0%A4%A8%20%E0%A4%AE%E0%A5%82%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%99%E0%A5%8D%E0%A4%95%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A6_zj0hpd3.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Results-based national development monitoring framework across federal, provincial, and local projects, National Pride Projects, and NDAC review.',
      },
      {
        id: 'law-constitutional-council-2066',
        title:
          'संवैधानिक परिषद् सम्बन्धी ऐन, २०६६ — Constitutional Council Act, 2066',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2066 · Appointments',
        pages: 12,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/11.%E0%A4%B8%E0%A4%82%E0%A4%B5%E0%A5%88%E0%A4%A7%E0%A4%BE%E0%A4%A8%E0%A4%BF%E0%A4%95%20%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B7%E0%A4%A6%E0%A5%8D%2C%20(%E0%A4%95%E0%A4%BE%E0%A4%AE%2C%20%E0%A4%95%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%B5%E0%A5%8D%E0%A4%AF%2C%20%E0%A4%85%E0%A4%A7%E0%A4%BF%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B0%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF)%20%E0%A4%B8%E0%A4%AE%E0%A5%8D%E0%A4%AC%E0%A4%A8%E0%A5%8D%E0%A4%A7%E0%A5%80%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AC_c0yycyx.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Constitutional Council meeting quorum, recommendation rules for Chief Justice and heads/members of Constitutional Commissions.',
      },
    ],
  },
  {
    id: 'planning-and-governance-statutes',
    name: '16th Plan, Federalism & Integrity',
    subtitle: 'NPC Periodic Plans, SDGs, LGOA 2074 & Anti-Corruption Acts',
    description:
      'Authentic Government of Nepal documents covering the 16th Periodic Plan & Action Plan, MTEF, SDG Costing Strategy, Local Government Operation Act 2074, Federal Coordination Act 2077, Corruption Prevention Act 2059, CIAA Act & Annual Report.',
    items: [
      {
        id: 'plan-sixteenth',
        title:
          'सोह्रौँ योजना (आ.व. २०८१/८२–२०८५/८६) — Sixteenth Periodic Plan',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: '16th Plan · Full Official PDF',
        pages: 348,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B8%E0%A5%8B%E0%A4%B9%E0%A5%8D%E0%A4%B0%E0%A5%8C%E0%A4%82%20%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%E0%A4%BE_rfucaur.pdf',
        externalSourceUrl:
          'https://npc.gov.np/content/6461/sixteen-plan--fy-fy-fy-fythting-2081-81-8285-85-86-/',
        description:
          '"Good Governance, Social Justice, and Prosperity" vision, macroeconomic growth & poverty reduction benchmarks, 2026 LDC graduation, and green/digital transformation.',
      },
      {
        id: 'plan-sixteenth-action',
        title:
          'Sixteenth Plan Implementation Action Plan (2081/82–2085/86)',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: '16th Plan · Execution Matrix',
        pages: 215,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/16th%20Plan%20implementation%20plan_Final_2esu7p1.pdf',
        externalSourceUrl:
          'https://npc.gov.np/content/6783/sixteenth-plan-implementation-action-plan--fiscal-year/',
        description:
          'Ministry-wise milestones, structural transformation projects, indicator baselines, and annual policy deliverable tracker for the 16th Plan.',
      },
      {
        id: 'plan-mtef-2083-86',
        title:
          'मध्यमकालीन खर्च संरचना (२०८३/८४–२०८५/८६) — Medium-Term Expenditure Framework',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: 'MTEF FY 2083/84–2085/86',
        pages: 280,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%AE%E0%A4%95%E0%A4%BE%E0%A4%B2%E0%A5%80%E0%A4%A8%20%E0%A4%96%E0%A4%B0%E0%A5%8D%E0%A4%9A%20%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%9A%E0%A4%A8%E0%A4%BE%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A9-%E0%A5%AE%E0%A5%AA_rzni3qs.pdf',
        externalSourceUrl:
          'https://npc.gov.np/content/6803/medium-term-expenditure-structure--fy-2083-84--2085-86-/',
        description:
          'Three-year rolling fiscal envelope, macro-fiscal projections, priority P1/P2/P3 project ceilings, and annual development program linkage.',
      },
      {
        id: 'plan-sdg-costing-2025',
        title:
          'Nepal SDG Needs Assessment, Costing & Financing Strategy (2025)',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: '2025 Official SDG Strategy',
        pages: 192,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/SDG%20Costing%20and%20Financing%20Strategy%202025_lulmmvs.pdf',
        externalSourceUrl:
          'https://npc.gov.np/content/6460/nepal-s-sustainable-development-goals-needs-assessment--costing/',
        description:
          'Updated financing gap analysis, federal/provincial/local SDG localization targets, and 2030 Agenda progress indicators for Paper III.',
      },
      {
        id: 'law-lgoa-2074',
        title:
          'स्थानीय सरकार सञ्चालन ऐन, २०७४ — Local Government Operation Act, 2074',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Local Governance',
        pages: 112,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/5.%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%A8%E0%A5%80%E0%A4%AF%20%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B8%E0%A4%9E%E0%A5%8D_%E0%A4%9A%E0%A4%BE%E0%A4%B2%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_uhq3r7x.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/12760/12760-local-government-regu-/',
        description:
          'Municipal classification, Ward Committee frontline functions, 7-step participatory local planning & Ashadh 10 budget cycle, Article 217 Judicial Committee, and CAO role.',
      },
      {
        id: 'law-federal-coordination-2077',
        title:
          'संघ, प्रदेश र स्थानीय तह (समन्वय तथा अन्तरसम्बन्ध) ऐन, २०७७',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2077 · Cooperative Federalism',
        pages: 26,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/25.%20%E0%A4%B8%E0%A4%82%E0%A4%98%2C%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A6%E0%A5%87%E0%A4%B6%20%E0%A4%B0%20%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%A8%E0%A5%80%E0%A4%AF%20%E0%A4%A4%E0%A4%B9%20(%E0%A4%B8%E0%A4%AE%E0%A4%A8%E0%A5%8D%E0%A4%B5%E0%A4%AF%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%85%E0%A4%A8%E0%A5%8D%E0%A4%A4%E0%A4%B0%E0%A4%B8%E0%A4%AE%E0%A5%8D%E0%A4%AC%E0%A4%A8%E0%A5%8D%E0%A4%A7)%20%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AD_djosufp.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Federation, Province and Local Level (Coordination & Inter-relation) Act governing National Coordination Council, Provincial Coordination Councils, and concurrent jurisdiction.',
      },
      {
        id: 'law-corruption-2059',
        title:
          'भ्रष्टाचार निवारण ऐन, २०५९ — Prevention of Corruption Act, 2059',
        authority: 'Nepal Law Commission / CIAA',
        codeOrEdition: 'Act 2059 · Anti-Corruption',
        pages: 34,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/4.%E0%A4%AD%E0%A5%8D%E0%A4%B0%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A4%BE%E0%A4%9A%E0%A4%BE%E0%A4%B0%20%E0%A4%A8%E0%A4%BF%E0%A4%B5%E0%A4%BE%E0%A4%B0%E0%A4%A3%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%AF_clwpfdz.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'Statutory corruption offenses (bribery, revenue leakage, public property loss, illicit enrichment), 60-day property declaration (Sec. 50), and National Vigilance Center.',
      },
      {
        id: 'law-ciaa-2048',
        title:
          'अख्तियार दुरुपयोग अनुसन्धान आयोग ऐन, २०४८ — CIAA Act, 2048',
        authority: 'Nepal Law Commission / CIAA',
        codeOrEdition: 'Act 2048 · Constitutional Mandate',
        pages: 32,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/1.%E0%A4%85%E0%A4%96%E0%A4%A4%E0%A4%AF%E0%A4%B0_%E0%A4%A6%E0%A4%B0%E0%A4%AA%E0%A4%AF%E0%A4%97_%E0%A4%85%E0%A4%A8%E0%A4%B8%E0%A4%A8%E0%A4%A7%E0%A4%A8_%E0%A4%86%E0%A4%AF%E0%A4%97_%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AA%E0%A5%AE.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'Governs Commission for the Investigation of Abuse of Authority powers, inquiry procedures, preventive directives, and prosecution before the Special Court.',
      },
      {
        id: 'law-ciaa-rules-2059',
        title:
          'अख्तियार दुरुपयोग अनुसन्धान आयोग नियमावली, २०५९ — CIAA Rules, 2059',
        authority: 'CIAA Nepal (अख्तियार दुरुपयोग अनुसन्धान आयोग)',
        codeOrEdition: 'Rules 2059 · Procedural Rules',
        pages: 24,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/https___ciaa.gov.np_uploads_publicationsAndReports_SejCBk_vpqqpuh.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'Procedural rules for complaint registration, preliminary inquiry, raid/seizure warrants, expert verification, and departmental action recommendations.',
      },
      {
        id: 'report-ciaa-35th-ar',
        title:
          'अख्तियार दुरुपयोग अनुसन्धान आयोगको ३५ औँ वार्षिक प्रतिवेदन (२०८१/८२)',
        authority: 'CIAA Nepal (अख्तियार दुरुपयोग अनुसन्धान आयोग)',
        codeOrEdition: '35th Annual Report · FY 2081/82',
        pages: 320,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/https___ciaa.gov.np_uploads_publicationsAndReports_g5a7AK_o8hkh0m.pdf',
        externalSourceUrl:
          'https://ciaa.gov.np/content/18/thirty-fifth-annual-report-financial-year-2081-82/',
        description:
          'Official 35th Annual Report submitted to the President detailing corruption complaint trends by sector, Special Court conviction rates, and governance reform recommendations.',
      },
    ],
  },
  {
    id: 'public-finance-revenue-audit',
    name: 'Public Finance, Revenue & Audit',
    subtitle: 'Procurement, Fiscal Accountability, Tax Acts & OAG Reports',
    description:
      'Essential statutes and official audit reports for Administration, Revenue, Accounts, and Nepal Audit Service candidates: Public Procurement Act 2063, Fiscal Accountability Act 2076, Audit Act 2075, OAG 63rd & 62nd Annual Reports, Income Tax, VAT, and Customs Act 2082.',
    items: [
      {
        id: 'law-procurement-2063',
        title:
          'सार्वजनिक खरिद ऐन, २०६३ — Public Procurement Act, 2063',
        authority: 'Nepal Law Commission / PPMO',
        codeOrEdition: 'Act 2063 · Consolidated',
        pages: 56,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/8.%E0%A4%B8%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%9C%E0%A4%A8%E0%A4%BF%E0%A4%95%20%E0%A4%96%E0%A4%B0%E0%A4%BF%E0%A4%A6%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_dsrretl.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Procurement methods, sealed quotation & e-GP bidding thresholds, bid security, variation orders, blacklisting, and Public Procurement Review Committee.',
      },
      {
        id: 'law-fiscal-accountability-2076',
        title:
          'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ — Fiscal Accountability Act',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2076 · PFM Core Statute',
        pages: 48,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/13.%E0%A4%86%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%BF%E0%A4%95%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A5%80%E0%A4%AF%20%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%A4%E0%A4%B0%E0%A4%A6%E0%A4%BE%E0%A4%AF%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%B5%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AC_ytzs5bu.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Budget formulation calendar, LMBIS/TSA/CGAS systems, Accounting Officer personal responsibility, internal audit, and 35-day Beruju settlement.',
      },
      {
        id: 'law-audit-2075',
        title: 'लेखापरीक्षण ऐन, २०७५ — Audit Act, 2075',
        authority: 'Nepal Law Commission / OAG Nepal',
        codeOrEdition: 'Act 2075 · Public Auditing',
        pages: 20,
        path: 'https://giwmscdnone.gov.np/media/app/public/275/posts/1720419986_57.pdf',
        externalSourceUrl: 'https://oag.gov.np/',
        description:
          'Constitutional audit scope of the Auditor General: regularity, economy, efficiency, effectiveness (4Es), risk-based audit, and PAC reporting.',
      },
      {
        id: 'report-oag-63rd-2083',
        title:
          'महालेखापरीक्षकको त्रिसट्ठिऔँ वार्षिक प्रतिवेदन, २०८३ (63rd OAG Annual Report)',
        authority: 'Office of the Auditor General (महालेखापरीक्षकको कार्यालय)',
        codeOrEdition: '63rd Annual Report · 2083 BS',
        pages: 650,
        path: 'https://oag.gov.np/site_uploads/mahalkhaparakashhakaka-ou-varashhaka-paratavathana-1435411017.pdf',
        externalSourceUrl: 'https://oag.gov.np/reports/annual-report',
        description:
          'Latest 63rd Annual Report of the Auditor General of Nepal auditing federal ministries, provinces, 753 local levels, and public enterprises (Beruju & fiscal compliance).',
      },
      {
        id: 'report-oag-62nd-2082',
        title:
          'महालेखापरीक्षकको बासट्ठिऔँ वार्षिक प्रतिवेदन, २०८२ (62nd OAG Annual Report)',
        authority: 'Office of the Auditor General (महालेखापरीक्षकको कार्यालय)',
        codeOrEdition: '62nd Annual Report · 2082 BS',
        pages: 620,
        path: 'https://oag.gov.np/site_uploads/mahalkhaparakashhakaka-bsatathaou-varashhaka-paratavathana-0-com-1853199838.pdf',
        externalSourceUrl: 'https://oag.gov.np/reports/annual-report',
        description:
          '62nd OAG Annual Report covering FY 2080/81 audit findings, cumulative Beruju breakdown, and performance audit recommendations.',
      },
      {
        id: 'law-intergov-fiscal-2074',
        title:
          'अन्तर-सरकारी वित्त व्यवस्थापन ऐन, २०७४ — Intergovernmental Fiscal Arrangement Act',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Fiscal Federalism',
        pages: 28,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/12.%E0%A4%85%E0%A4%A8%E0%A4%A4%E0%A4%B0%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%B0_%E0%A4%B5%E0%A4%A4%E0%A4%A4_%E0%A4%B5%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A4%A5%E0%A4%AA%E0%A4%A8_%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Revenue sharing formulas (70:15:15 VAT & Excise), natural resource royalties, four types of federal grants, and Ashadh 1 / Ashadh 10 budget timelines.',
      },
      {
        id: 'law-public-debt-2079',
        title:
          'सार्वजनिक ऋण व्यवस्थापन ऐन, २०७९ — Public Debt Management Act, 2079',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2079 · Sovereign Debt',
        pages: 22,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/14.%E0%A4%B8%E0%A4%B0%E0%A4%B5%E0%A4%9C%E0%A4%A8%E0%A4%95_%E0%A4%8B%E0%A4%A3_%E0%A4%B5%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A4%A5%E0%A4%AA%E0%A4%A8__%E0%A4%90%E0%A4%A8_%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AF.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Public Debt Management Office (PDMO) powers, domestic and external borrowing limits, treasury bills, development bonds, and sovereign guarantees.',
      },
      {
        id: 'law-income-tax-2058',
        title: 'आयकर ऐन, २०५८ — Income Tax Act, 2058',
        authority: 'Nepal Law Commission / IRD',
        codeOrEdition: 'Act 2058 · Direct Taxation',
        pages: 132,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/3.%20%E0%A4%86%E0%A4%AF%E0%A4%95%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%AE_aevruby.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Direct tax base (employment, business, investment, windfall), residency rules, deductions, withholding tax (TDS), assessment, and administrative review.',
      },
      {
        id: 'law-vat-2052',
        title:
          'मूल्य अभिवृद्धि कर ऐन, २०५२ (आर्थिक ऐन २०८२ संशोधन सहित) — VAT Act, 2052',
        authority: 'Inland Revenue Department (आन्तरिक राजस्व विभाग)',
        codeOrEdition: 'Amended FY 2082 · Indirect Tax',
        pages: 48,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%82%E0%A4%B2%E0%A5%8D%E0%A4%AF%20%E0%A4%85%E0%A4%AD%E0%A4%BF%E0%A4%B5%E0%A5%83%E0%A4%A6%E0%A5%8D%E0%A4%A7%E0%A4%BF%20%E0%A4%95%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%A8%20(%E0%A4%86%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%BF%E0%A4%95%20%E0%A4%90%E0%A4%A8%2C%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A8%20%E0%A4%B2%E0%A5%87%20%E0%A4%97%E0%A4%B0%E0%A5%87%E0%A4%95%E0%A5%8B%20%E0%A4%B8%E0%A4%82%E0%A4%B6%E0%A5%8B%E0%A4%A7%E0%A4%A8%20%E0%A4%B8%E0%A4%B9%E0%A4%BF%E0%A4%A4)_ty8cysa.pdf',
        externalSourceUrl:
          'https://ird.gov.np/content/13407/value-added-tax-act--2052--as-amended/',
        description:
          'Updated Value Added Tax statute covering registration thresholds, 13% standard rate, zero-rated exports, tax credit chain, and electronic billing.',
      },
      {
        id: 'law-customs-2082',
        title: 'भन्सार ऐन, २०८२ — New Customs Act, 2082',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2082 BS · Modernized Customs',
        pages: 72,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AD%E0%A4%A8%E0%A5%8D%E0%A4%B8%E0%A4%BE%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A8_ez8dbqc.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13544/customs-act--2082/',
        description:
          'Newly enacted Customs Act, 2082 covering WTO valuation, post-clearance audit, national single window, risk-based clearance, and bonded warehousing.',
      },
      {
        id: 'law-excise-2058',
        title: 'अन्तःशुल्क ऐन, २०५८ — Excise Duty Act, 2058',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2058 · Excise Control',
        pages: 44,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/2.%20%E0%A4%85%E0%A4%A8%E0%A5%8D%E0%A4%A4%E0%A4%83%20%E0%A4%B6%E0%A5%81%E0%A4%B2%E0%A5%8D%E0%A4%95%20%E0%A4%90%E0%A4%A8%2C%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%AE_l6pkeme.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Excise licensing, self-removal and physical control systems, excise stickers, assessment, and seizure/penalty rules for Revenue Service candidates.',
      },
      {
        id: 'law-revenue-leakage-2052',
        title:
          'राजस्व चुहावट (अनुसन्धान तथा नियन्त्रण) ऐन, २०५२ — Revenue Leakage Control Act',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2052 · Enforcement',
        pages: 24,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/8.%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A4%B8%E0%A5%8D%E0%A4%B5%20%E0%A4%9A%E0%A5%81%E0%A4%B9%E0%A4%BE%E0%A4%B5%E0%A4%9F%20(%E0%A4%85%E0%A4%A8%E0%A5%81%E0%A4%B8%E0%A4%A8%E0%A5%8D%E0%A4%A7%E0%A4%BE%E0%A4%A8%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%A8%E0%A4%BF%E0%A4%AF%E0%A4%A8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%A3)%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AB%E0%A5%A8_wsrsuq5.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1767/',
        description:
          'Defines tax/customs evasion offenses, Department of Revenue Investigation (DRI) search/audit powers, VCTS tracking compliance, and penalties.',
      },
      {
        id: 'law-economic-act-2083',
        title:
          'आर्थिक ऐन, २०८३ (राजपत्र प्रकाशित) — Finance / Economic Act, 2083',
        authority: 'Inland Revenue Department (आन्तरिक राजस्व विभाग)',
        codeOrEdition: 'FY 2083/84 Gazette · Tax Rates',
        pages: 96,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%86%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%BF%E0%A4%95%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A9%20(%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%AE%E0%A4%BE%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B6%E0%A4%BF%E0%A4%A4%20%E0%A4%AE%E0%A4%BF%E0%A4%A4%E0%A4%BF%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A9%E0%A5%A4%E0%A5%A6%E0%A5%A9%E0%A5%A4%E0%A5%A9%E0%A5%A6)_vzvsbtv.pdf',
        externalSourceUrl:
          'https://ird.gov.np/content/13566/economic-act--2083--date-of-publication-in/',
        description:
          'Official Nepal Gazette Finance Act for FY 2083/84 setting current tax slabs, customs schedules, digital service tax, and fiscal concessions.',
      },
      {
        id: 'report-ird-annual-2081-82',
        title:
          'आन्तरिक राजस्व विभाग वार्षिक प्रतिवेदन २०८१/८२ — IRD Annual Report',
        authority: 'Inland Revenue Department (आन्तरिक राजस्व विभाग)',
        codeOrEdition: 'FY 2081/82 · Revenue Performance',
        pages: 148,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/annual1_wl3ihtb.pdf',
        externalSourceUrl:
          'https://ird.gov.np/content/13350/annual-report-2081-82/',
        description:
          'Official Inland Revenue Department annual report detailing PAN registration, Income Tax, VAT & Excise collection targets, and taxpayer reforms.',
      },
    ],
  },
  {
    id: 'economy-budget-statistics',
    name: 'Economy, Budget & Statistics',
    subtitle: 'MoF Economic Survey & Budget, NRB Monetary Policy & NSO Census',
    description:
      'High-yield official data reports for Paper I Contemporary GK and Papers II–IV analytical answers: Ministry of Finance Economic Surveys & Budget Speeches, Nepal Rastra Bank Monetary Policy & Macro Reports, and National Statistics Office Census 2078 & Yearbook 2025.',
    items: [
      {
        id: 'eco-survey-2082-83',
        title: 'आर्थिक सर्वेक्षण २०८२/८३ — Economic Survey FY 2082/83',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2082/83 · Official Survey',
        pages: 340,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Economic%20Survey%202082%2083%20(1)_cimkjjb.pdf',
        externalSourceUrl:
          'https://mof.gov.np/content/1738/economic-survey-2082-83/',
        description:
          'Official Ministry of Finance annual economic health report covering GDP growth, provincial accounts, inflation, public finance, trade, energy, and social sectors.',
      },
      {
        id: 'eco-survey-2081-82',
        title: 'आर्थिक सर्वेक्षण २०८१/८२ — Economic Survey FY 2081/82',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2081/82 · Official Survey',
        pages: 332,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%86%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3%202081-82_ksjdgmv.pdf',
        externalSourceUrl:
          'https://mof.gov.np/content/1520/economic-survey-2081-82/',
        description:
          'Baseline economic survey of the first year of the Sixteenth Periodic Plan with sector-by-sector fiscal and monetary performance tables.',
      },
      {
        id: 'eco-survey-english-2023-24',
        title: 'Economic Survey 2023/24 (Official English Edition)',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2023/24 (2080/81) · English',
        pages: 295,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/MOF_Economic%20Survey%20ENG%202023-24%20book%20Final_for%20WEB_miwtpw0.pdf',
        externalSourceUrl:
          'https://mof.gov.np/content/281/economic-survey-2023-24/',
        description:
          'Official English translation of Nepal Economic Survey with macroeconomic terminology, fiscal deficit tables, and external sector indicators for English-medium answers.',
      },
      {
        id: 'budget-speech-2083-84-np',
        title: 'आ.व. २०८३/८४ को बजेट वक्तव्य — Federal Budget Speech 2083/84 (Nepali)',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2083/84 (2026/27) · Nepali',
        pages: 86,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/budget%20speech%202083_nz9wmgt_cix58wu.pdf',
        externalSourceUrl: 'https://mof.gov.np/category/budget-speech/',
        description:
          'Complete Federal Budget Statement presented to Parliament covering revenue estimates, recurrent/capital/financing allocations, and fiscal reforms.',
      },
      {
        id: 'budget-speech-2083-84-en',
        title:
          'Budget Speech of Fiscal Year 2026/27 (2083/84) — English Translation',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2026/27 (2083/84) · English',
        pages: 78,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Budget%20Speech%202026_27%20English%20Translation_ysmw9xe.pdf',
        externalSourceUrl: 'https://mof.gov.np/category/budget-speech/',
        description:
          'Official English translation of Nepal FY 2026/27 (2083/84 BS) Federal Budget priorities, sectoral outlays, and tax policy announcements.',
      },
      {
        id: 'budget-speech-2082-83-en',
        title:
          'Budget Speech of Fiscal Year 2025/26 (2082/83) — English Translation',
        authority: 'Ministry of Finance, Nepal (अर्थ मन्त्रालय)',
        codeOrEdition: 'FY 2025/26 (2082/83) · English',
        pages: 72,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Budget%20Translation_2082-2083_nzrwuof.pdf',
        externalSourceUrl: 'https://mof.gov.np/category/budget-speech/',
        description:
          'Official English budget speech for FY 2082/83 covering federal grants, infrastructure priorities, and social protection outlays.',
      },
      {
        id: 'nrb-monetary-policy-2083-84',
        title: 'Monetary Policy for FY 2083/84 (2026/27) — Nepal Rastra Bank',
        authority: 'Nepal Rastra Bank (नेपाल राष्ट्र बैंक)',
        codeOrEdition: 'FY 2083/84 · Official Policy',
        pages: 38,
        path: 'https://www.nrb.org.np/contents/uploads/2026/07/Monetary_Policy-2083_84-1.pdf',
        externalSourceUrl:
          'https://www.nrb.org.np/contents/uploads/2026/07/Monetary_Policy-2083_84-1.pdf',
        description:
          'Official Central Bank Monetary Policy setting policy rate corridor, CRR/SLR ratios, inflation & credit growth targets, and external reserve adequacy benchmarks.',
      },
      {
        id: 'nrb-macro-situation-2024-25',
        title:
          'Current Macroeconomic and Financial Situation of Nepal (Annual 2024/25)',
        authority: 'Nepal Rastra Bank (नेपाल राष्ट्र बैंक)',
        codeOrEdition: 'Annual Macro Report · FY 2081/82',
        pages: 34,
        path: 'https://www.nrb.org.np/contents/uploads/2025/08/Current-Macroeconomic-and-Financial-Situation-English-Based-on-Annual-data-of-2024.25.pdf',
        externalSourceUrl:
          'https://www.nrb.org.np/category/current-macroeconomic-situation/?department=red',
        description:
          'Authoritative CPI inflation, Balance of Payments (BoP), remittance inflows, forex reserves, and monetary aggregate figures for PSC Paper I & III.',
      },
      {
        id: 'nrb-financial-stability-report',
        title: 'Financial Stability Report — Nepal Rastra Bank',
        authority: 'Nepal Rastra Bank (नेपाल राष्ट्र बैंक)',
        codeOrEdition: 'Banking & Macro-Prudential Report',
        pages: 110,
        path: 'https://www.nrb.org.np/contents/uploads/2025/04/Financial-Stability-Report.pdf',
        externalSourceUrl:
          'https://www.nrb.org.np/category/financial-stability-report/?department=bfr',
        description:
          'Comprehensive review of Class A/B/C/D financial institutions, NPL ratios, capital adequacy, liquidity stress tests, and payment systems.',
      },
      {
        id: 'nrb-act-2002-english',
        title: 'Nepal Rastra Bank Act, 2002 (2058) — Consolidated English',
        authority: 'Nepal Rastra Bank (नेपाल राष्ट्र बैंक)',
        codeOrEdition: 'Act 2058 (2002) · Central Banking',
        pages: 64,
        path: 'https://www.nrb.org.np/contents/uploads/2019/12/Nepal-Rastra-Bank-Act-2002-English2074.12.21.pdf',
        externalSourceUrl:
          'https://www.nrb.org.np/category/acts/?department=lgd',
        description:
          'Statutory objectives, monetary policy autonomy, currency issuance, foreign exchange management, and BFI supervision powers of NRB.',
      },
      {
        id: 'nso-census-2078-national-report',
        title:
          'National Population and Housing Census 2021 (2078 BS) — National Report',
        authority: 'National Statistics Office (राष्ट्रिय तथ्याङ्क कार्यालय)',
        codeOrEdition: 'Census 2078 · Official National Report',
        pages: 392,
        path: 'https://censusresults.nsonepal.gov.np/files/result-folder/National%20Report_English.pdf',
        externalSourceUrl: 'https://censusnepal.cbs.gov.np/',
        description:
          'Master Census 2078 English report: 29,164,578 population, 0.92% growth rate, 76.2% literacy, province/district density, age pyramid, and household amenities.',
      },
      {
        id: 'nso-statistical-yearbook-2025',
        title: 'Nepal Statistical Year Book 2025 — NSO Official Compendium',
        authority: 'National Statistics Office (राष्ट्रिय तथ्याङ्क कार्यालय)',
        codeOrEdition: '2025 Edition · Multi-Sector Data',
        pages: 510,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/NEPAL%20STATISTICAL%20YEAR%20BOOK%202025_gmwl5dv.pdf',
        externalSourceUrl: 'https://nsonepal.gov.np/',
        description:
          'Complete statistical reference across climate, agriculture, forestry, energy, transport, education, health, national accounts, and public finance.',
      },
      {
        id: 'nso-nepal-in-figures-2082',
        title: 'नेपालको तथ्याङ्कीय झलक २०८२ — Nepal in Figures 2082',
        authority: 'National Statistics Office (राष्ट्रिय तथ्याङ्क कार्यालय)',
        codeOrEdition: '2082 BS · Pocket Factsheet',
        pages: 48,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8B%20%E0%A4%A4%E0%A4%A5%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%99%E0%A5%8D%E0%A4%95%E0%A5%80%E0%A4%AF%20%E0%A4%9D%E0%A4%B2%E0%A4%95%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A8_qpqayza.pdf',
        externalSourceUrl:
          'https://nsonepal.gov.np/content/13394/fossils-of-nepal-2082/',
        description:
          'High-yield quick-revision NSO pocket factsheet containing latest demographic, GDP, CPI, literacy, and infrastructure statistics.',
      },
      {
        id: 'nso-national-accounts-2025-26',
        title: 'National Accounts Statistics of Nepal 2025/26 — NSO',
        authority: 'National Statistics Office (राष्ट्रिय तथ्याङ्क कार्यालय)',
        codeOrEdition: 'FY 2025/26 · GDP & GNI Series',
        pages: 145,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/National%20Accounts%20Statistics%20of%20Nepal%202025_26_oszafcl.pdf',
        externalSourceUrl:
          'https://nsonepal.gov.np/content/13488/national-accounts-statistics-of-nepal-2025-26/',
        description:
          'Official GDP by industrial origin, per capita GNI, gross fixed capital formation, savings rate, and provincial economic growth figures.',
      },
      {
        id: 'nso-nlss-iv-report',
        title:
          'Nepal Living Standards Survey IV (NLSS-IV 2022/23) Statistical Report',
        authority: 'National Statistics Office (राष्ट्रिय तथ्याङ्क कार्यालय)',
        codeOrEdition: 'NLSS-IV · Poverty & Gini Report',
        pages: 218,
        path: 'https://giwmscdnone.gov.np/media/app/public/36/posts/1719375782_27.pdf',
        externalSourceUrl:
          'https://nsonepal.gov.np/content/12061/12061-nepal-living-standards-survey/',
        description:
          'Official NSO report establishing Nepal poverty headcount (20.27%), Gini inequality index, household consumption, and provincial living standards.',
      },
    ],
  },
  {
    id: 'justice-rights-foreign-env',
    name: 'Justice, Foreign Policy & Environment',
    subtitle: 'Muluki Codes, MoFA Foreign Policy, NHRC, Environment & DRRM Acts',
    description:
      'Specialized official statutes and policy papers for Nepal Justice, Foreign Affairs, Environment/Forest, IT, and Human Rights syllabi: Muluki Civil & Criminal Codes, Evidence Act, AML Act, Nepal Foreign Policy 2077, MoFA Annual Report, Environment & DRRM Acts.',
    items: [
      {
        id: 'law-muluki-civil-code-2074',
        title: 'मुलुकी देवानी संहिता, २०७४ — Muluki Civil Code, 2074',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Substantive Civil Law',
        pages: 296,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A5%81%E0%A4%95%E0%A5%80-%E0%A4%A6%E0%A5%87%E0%A4%B5%E0%A4%BE%E0%A4%A8%E0%A5%80-%E0%A4%B8%E0%A4%82%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A4%BE-%E0%A4%90%E0%A4%A8-%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_zpq6wk7.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13455/civil-code-2074/',
        description:
          'Foundational civil code governing persons, family law, property, contracts, torts, quasi-contracts, and private international law for Justice & Admin exams.',
      },
      {
        id: 'law-muluki-criminal-code-2074',
        title: 'मुलुकी अपराध संहिता, २०७४ — Muluki Criminal Code, 2074',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Substantive Criminal Law',
        pages: 184,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A5%81%E0%A4%95%E0%A5%80%20%E0%A4%85%E0%A4%AA%E0%A4%B0%E0%A4%BE%E0%A4%A7%20%E0%A4%B8%E0%A4%82%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A4%BE%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_it7vg66.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13454/criminal-code-2074/',
        description:
          'Substantive penal code defining criminal liability, general defenses, offenses against state/public peace, economic crimes, and sentencing.',
      },
      {
        id: 'law-muluki-civil-proc-2074',
        title:
          'मुलुकी देवानी कार्यविधि संहिता, २०७४ — Muluki Civil Procedure Code',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Civil Litigation',
        pages: 192,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A5%81%E0%A4%95%E0%A5%80-%E0%A4%A6%E0%A5%87%E0%A4%B5%E0%A4%BE%E0%A4%A8%E0%A5%80-%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF-%E0%A4%90%E0%A4%A8-%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_01adtvr.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13456/civil-code-procedure-2074/',
        description:
          'Civil jurisdiction, plaints, summons, limitation, interim orders, decree execution, and appeal procedures.',
      },
      {
        id: 'law-muluki-criminal-proc-2074',
        title:
          'मुलुकी फौजदारी कार्यविधि संहिता, २०७४ — Muluki Criminal Procedure Code',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Criminal Investigation',
        pages: 156,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A5%81%E0%A4%95%E0%A5%80%20%E0%A4%AB%E0%A5%8C%E0%A4%9C%E0%A4%A6%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF%20%E0%A4%B8%E0%A4%82%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A4%BE%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA(4)_nomy0tn.pdf',
        externalSourceUrl:
          'https://lawcommission.gov.np/content/13458/civil-criminal-procedure-code-2074/',
        description:
          'FIR registration, arrest and remand safeguards, charge-sheet filing by Government Attorney, bail hearings, and criminal trials.',
      },
      {
        id: 'law-evidence-2031',
        title: 'प्रमाण ऐन, २०३१ — Evidence Act, 2031',
        authority: 'Nepal Law Commission / CIAA',
        codeOrEdition: 'Act 2031 · Judicial Evidence',
        pages: 26,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/https___ciaa.gov.np_uploads_publicationsAndReports_cIbxEU_ikxcfmc.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'Admissibility of oral, documentary, and electronic evidence, burden of proof, estoppel, judicial notice, and dying declarations.',
      },
      {
        id: 'law-aml-2064',
        title:
          'सम्पत्ति शुद्धीकरण (मनी लाउण्डरिङ्ग) निवारण ऐन, २०६४ — AML Act, 2064',
        authority: 'CIAA / Department of Money Laundering Investigation',
        codeOrEdition: 'Act 2064 · Financial Integrity',
        pages: 38,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/https___ciaa.gov.np_uploads_publicationsAndReports_mbFgNf_4mbrrg4.pdf',
        externalSourceUrl: 'https://ciaa.gov.np/category/act-regulations/',
        description:
          'KYC/CDD obligations, Politically Exposed Persons (PEPs), FIU-Nepal suspicious transaction reporting, and FATF anti-money laundering compliance.',
      },
      {
        id: 'law-nhrc-2068',
        title:
          'राष्ट्रिय मानव अधिकार आयोग ऐन, २०६८ — National Human Rights Commission Act',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2068 · Human Rights',
        pages: 22,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/12.%E0%A4%B0%E0%A4%BE%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%AF%20%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%B5%20%E0%A4%85%E0%A4%A7%E0%A4%BF%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%86%E0%A4%AF%E0%A5%8B%E0%A4%97%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%AE%20(1)_oncnbfm.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1762/',
        description:
          'Investigative powers, detention center inspection, compensation recommendations, and Paris Principles status of NHRC.',
      },
      {
        id: 'policy-mofa-foreign-2077',
        title: 'नेपालको परराष्ट्र नीति, २०७७ — Nepal Foreign Policy, 2077',
        authority: 'Ministry of Foreign Affairs (परराष्ट्र मन्त्रालय)',
        codeOrEdition: '2077 BS · Official White Paper',
        pages: 46,
        path: 'https://giwmscdnone.gov.np/media/pages/files/%E0%A4%AA%E0%A4%B0%E0%A4%B0%E0%A4%BE%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0-%E0%A4%A8%E0%A5%80%E0%A4%A4%E0%A4%BF-%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AD_2pavhb3.pdf',
        externalSourceUrl:
          'https://mofa.gov.np/pages/foreign-policy-of-nepal-1/',
        description:
          'First consolidated Foreign Policy document covering Panchasheel, non-alignment, economic diplomacy, neighborhood policy, multilateralism, and diaspora engagement.',
      },
      {
        id: 'report-mofa-annual-2023-24',
        title:
          "Report on Nepal's Foreign Affairs (2023–2024) — MoFA Annual Report",
        authority: 'Ministry of Foreign Affairs (परराष्ट्र मन्त्रालय)',
        codeOrEdition: 'FY 2023/24 · Diplomatic Record',
        pages: 184,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Annual%20Report%202023-2024_16ovpix.pdf',
        externalSourceUrl: 'https://mofa.gov.np/category/annual-report/',
        description:
          'Authoritative MoFA report on high-level bilateral visits, UN/SAARC/BIMSTEC participation, consular services, and economic diplomacy.',
      },
      {
        id: 'report-mofa-ifa-2024',
        title: 'Institute of Foreign Affairs (IFA) Annual Report 2024',
        authority: 'Ministry of Foreign Affairs / IFA Nepal',
        codeOrEdition: '2024 Edition · Foreign Policy Research',
        pages: 112,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Final__EDIT%20Annual%20Report%20NFA%202024%20New%20One%20(1)_zmeru3c.pdf',
        externalSourceUrl: 'https://mofa.gov.np/category/annual-report/',
        description:
          'Official diplomatic training, Track-II policy dialogues, climate diplomacy, and LDC graduation external sector briefs.',
      },
      {
        id: 'law-environment-2076',
        title:
          'वातावरण संरक्षण ऐन, २०७६ — Environment Protection Act, 2076',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2076 · EIA, IEE & Climate',
        pages: 34,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/9.%20%E0%A4%B5%E0%A4%BE%E0%A4%A4%E0%A4%BE%E0%A4%B5%E0%A4%B0%E0%A4%A3%20%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AC_d91zo4v.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1787/',
        description:
          'Mandatory BES/IEE/EIA environmental assessments, pollution control standards, climate adaptation, carbon trade, and Environment Protection Fund.',
      },
      {
        id: 'law-drrm-2074',
        title:
          'विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४ — DRRM Act, 2074',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Disaster Governance',
        pages: 32,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/26.%E0%A4%B5%E0%A4%BF%E0%A4%AA%E0%A4%A6%E0%A5%8D%20%E0%A4%9C%E0%A5%8B%E0%A4%96%E0%A4%BF%E0%A4%AE%20%E0%A4%A8%E0%A5%8D%E0%A4%AF%E0%A5%82%E0%A4%A8%E0%A5%80%E0%A4%95%E0%A4%B0%E0%A4%A3%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A4%BE%E0%A4%AA%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_l7irfre.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1765/',
        description:
          'NDRRMA mandate, National Council chaired by PM, federal/provincial/district/local disaster committees, and Sendai Framework alignment.',
      },
      {
        id: 'law-forest-2076',
        title: 'वन ऐन, २०७६ — Forest Act, 2076',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2076 · Forest & Community Governance',
        pages: 54,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/8.%20%E0%A4%B5%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AC_yeu0can.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1787/',
        description:
          'National, Community, Collaborative, Leasehold, and Religious forests, carbon sequestration revenue sharing, and federal-provincial forest division.',
      },
      {
        id: 'law-labour-2074',
        title: 'श्रम ऐन, २०७४ — Labour Act, 2074',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · Employment & Social Security',
        pages: 74,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/15.%20%20%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%AE%20%E0%A4%90%E0%A4%A8%2C_oinkgks.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1783/',
        description:
          'Employment contracts, working hours, OSH standards, collective bargaining, Labour Court jurisdiction, and social security contributions.',
      },
      {
        id: 'law-eta-2063',
        title:
          'विद्युतीय (इलेक्ट्रोनिक) कारोबार ऐन, २०६३ — Electronic Transactions Act, 2063',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2063 · Cyber Law & E-Governance',
        pages: 30,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/15.%20%E0%A4%B5%E0%A4%BF%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A5%81%E0%A4%A4%E0%A5%80%E0%A4%AF%20(%E0%A4%87%E0%A4%B2%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%8B%E0%A4%A8%E0%A4%BF%E0%A4%95)%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8B%E0%A4%AC%E0%A4%BE%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_jkxllj0.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1784/',
        description:
          'Digital signatures, electronic record authentication, Office of the Controller of Certification, cyber offenses (Sec. 44–58), and IT Tribunal.',
      },
      {
        id: 'law-citizenship-2063',
        title: 'नेपाल नागरिकता ऐन, २०६३ — Nepal Citizenship Act, 2063',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2063 · Constitutional Citizenship',
        pages: 22,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%20%E0%A4%A8%E0%A4%BE%E0%A4%97%E0%A4%B0%E0%A4%BF%E0%A4%95%E0%A4%A4%E0%A4%BE%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_otncitm.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1765/',
        description:
          'Citizenship by descent, birth, naturalization, and Non-Resident Nepali (NRN) citizenship provisions under Part 2 of the Constitution.',
      },
      {
        id: 'law-election-hor-2074',
        title:
          'प्रतिनिधि सभा सदस्य निर्वाचन ऐन, २०७४ — House of Representatives Election Act',
        authority: 'Nepal Law Commission (नेपाल कानून आयोग)',
        codeOrEdition: 'Act 2074 · FPTP & PR Electoral Law',
        pages: 48,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/9.%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A4%E0%A4%BF%E0%A4%A8%E0%A4%BF%E0%A4%A7%E0%A4%BF%20%E0%A4%B8%E0%A4%AD%E0%A4%BE%20%E0%A4%B8%E0%A4%A6%E0%A4%B8%E0%A5%8D%E0%A4%AF%20%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%9A%E0%A4%A8%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AA_catoxij.pdf',
        externalSourceUrl: 'https://lawcommission.gov.np/category/1764/',
        description:
          'Mixed electoral system (165 FPTP + 110 PR), 3% proportional threshold, inclusive PR closed-list quotas, and candidate qualification rules.',
      },
    ],
  },
  {
    id: 'current-affairs-samasamayik',
    name: 'Current Affairs & Official Briefings (समसामयिक)',
    subtitle: 'Cabinet Decisions, DoIB Nepal Bimonthly, NPC Proactive Reports & Directives',
    description:
      'Live-verified official Government of Nepal contemporary briefings and decision digests for daily, weekly, and monthly Samasamayik preparation: DoIB Nepal Bimonthly Issue #256, Council of Ministers 2083 BS Cabinet Decisions, NPC Q1 Proactive Disclosure, PDNA Summary, and OPMCM Public Procurement Labour Procedure 2083.',
    items: [
      {
        id: 'ca-doib-nepal-bimonthly-256',
        title: 'नेपाल द्वैमासिक (अङ्क २५६) — DoIB Official Current Affairs Bimonthly',
        authority: 'Department of Information and Broadcasting (सूचना तथा प्रसारण विभाग)',
        codeOrEdition: 'Issue #256 · Official Bimonthly Digest',
        pages: 64,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Nepal%20Bimonthly_%20256_Final%20For%20Web_nutxxqx.pdf',
        externalSourceUrl: 'https://doib.gov.np/',
        description:
          'Official Government of Nepal current affairs periodical published by DoIB covering national development milestones, diplomatic briefings, cultural heritage, and administrative reforms.',
      },
      {
        id: 'ca-cabinet-decisions-2083-asoj',
        title: '२०८३ असोज महिनाको मन्त्रिपरिषद् बैठकका निर्णयहरू — Cabinet Decisions (Asoj 2083)',
        authority: 'Ministry of Communication & IT / Council of Ministers',
        codeOrEdition: 'Asoj 2083 BS · Monthly Cabinet Digest',
        pages: 28,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/2083%20%E0%A4%85%E0%A4%B8%E0%A5%8B%E0%A4%9C%20%E0%A4%AE%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A4%BE%E0%A4%95%E0%A5%8B%20%E0%A4%AE%E0%A4%A8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B7%E0%A4%A6%E0%A5%8D%20%E0%A4%AC%E0%A5%88%E0%A4%A0%E0%A4%95%E0%A4%95%E0%A4%BE%20%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%A3%E0%A4%AF%E0%A4%B9%E0%A4%B0%E0%A5%81_mrxonxh.pdf',
        externalSourceUrl: 'https://mocit.gov.np/',
        description:
          'Consolidated Council of Ministers resolutions for Asoj 2083 covering bilateral MOUs, administrative appointments, policy directives, and public infrastructure approvals.',
      },
      {
        id: 'ca-cabinet-decisions-2083-bhadra',
        title: '२०८३ भाद्र महिनाको मन्त्रिपरिषद् बैठकका निर्णयहरू — Cabinet Decisions (Bhadra 2083)',
        authority: 'Office of the Prime Minister and Council of Ministers (OPMCM)',
        codeOrEdition: 'Bhadra 2083 BS · Monthly Cabinet Digest',
        pages: 24,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/Bhadra%20CABINET%202083_kmninpp.pdf',
        externalSourceUrl: 'https://opmcm.gov.np/',
        description:
          'Official OPMCM compilation of Federal Cabinet decisions for Bhadra 2083 BS across governance, economic regulation, and international cooperation.',
      },
      {
        id: 'ca-npc-proactive-disclosure-2083',
        title: 'राष्ट्रिय योजना आयोग स्वतः प्रकाशन (श्रावण–असोज २०८३) — NPC Q1 Progress',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: 'FY 2083/84 Q1 · RTI Sec. 5(3) Release',
        pages: 32,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%A4%E0%A4%83%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B6%E0%A4%A8%20%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%BE%E0%A4%B5%E0%A4%A3%20%E0%A4%A6%E0%A5%87%E0%A4%96%E0%A4%BF%20%E0%A4%85%E0%A4%B8%E0%A5%8B%E0%A4%9C%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A9%20Final_bhfrwlv.pdf',
        externalSourceUrl: 'https://npc.gov.np/',
        description:
          'Quarterly proactive publication under RTI Act Sec. 5(3) detailing 16th Plan monitoring milestones, budget execution, and NPC policy decisions for Shrawan–Asoj 2083.',
      },
      {
        id: 'ca-opmcm-procurement-labour-2083',
        title: 'सार्वजनिक खरिदमा आबद्ध श्रमिकको पारिश्रमिक तथा सामाजिक सुरक्षा कार्यविधि, २०८३',
        authority: 'Office of the Prime Minister and Council of Ministers (OPMCM)',
        codeOrEdition: 'Procedure 2083 · Labour & Procurement',
        pages: 16,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/1.%E0%A4%B8%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%9C%E0%A4%A8%E0%A4%BF%E0%A4%95%20%E0%A4%96%E0%A4%B0%E0%A4%BF%E0%A4%A6%E0%A4%AE%E0%A4%BE%20%E0%A4%86%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A7%20%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%AE%E0%A4%BF%E0%A4%95%E0%A4%95%E0%A5%8B%20%E0%A4%AA%E0%A4%BE%E0%A4%B0%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%AE%E0%A4%BF%E0%A4%95%20%E0%A4%A4%E0%A4%A5%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A5%81%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%B8%E0%A4%AE%E0%A5%8D%E0%A4%AC%E0%A4%A8%E0%A5%8D%E0%A4%A7%E0%A5%80%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BF%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AE%E0%A5%A9_j1gm0vt.pdf',
        externalSourceUrl: 'https://opmcm.gov.np/',
        description:
          '2083 BS governance directive mandating fair minimum wages, formal banking payments, and Social Security Fund (SSF) protection for workers engaged in public procurement contracts.',
      },
      {
        id: 'ca-npc-pdna-summary',
        title: 'Post-Disaster Needs Assessment (PDNA) Executive Summary & Reconstruction Brief',
        authority: 'National Planning Commission (राष्ट्रिय योजना आयोग)',
        codeOrEdition: 'Official Disaster Recovery Brief',
        pages: 18,
        path: 'https://giwmscdnone.gov.np/media/pdf_upload/PDNA%20Summary%20Report%20Press%20Release-1_4ldruuv.pdf',
        externalSourceUrl: 'https://npc.gov.np/',
        description:
          'Verified NPC post-disaster economic loss estimation, sectoral damage breakdown, and Build-Back-Better reconstruction financing priorities for Paper III Disaster Governance.',
      },
    ],
  },
];
