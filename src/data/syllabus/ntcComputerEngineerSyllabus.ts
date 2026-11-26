import type { PscCadreSyllabus } from './types.ts';

const ETA_2063_PDF =
  'https://giwmscdnone.gov.np/media/pdf_upload/15.%20%E0%A4%B5%E0%A4%BF%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A5%81%E0%A4%A4%E0%A5%80%E0%A4%AF%20(%E0%A4%87%E0%A4%B2%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%8B%E0%A4%A8%E0%A4%BF%E0%A4%95)%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8B%E0%A4%AC%E0%A4%BE%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_jkxllj0.pdf';

const COMP_TECH_PHASE2_PDF =
  'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf';

export const NTC_COMPUTER_ENGINEER_7_SYLLABUS: PscCadreSyllabus = {
  id: 'ntc-computer-engineer-7',
  shortTitle: 'NTC Comp. Eng. (L7)',
  title: 'Nepal Telecom · Computer Engineer (Level 7)',
  nepaliTitle:
    'नेपाल दूरसञ्चार कम्पनी लिमिटेड (नेपाल टेलिकम) · तह ७ (प्राविधिक) · कम्प्युटर इन्जिनियर',
  rankClassification: 'Officer Level 7 · Technical (Computer Engineering)',
  serviceScope:
    'Nepal Telecom (NDCL) Technical Service — Core IP Networks, Billing/OSS-BSS, Cloud Infrastructure, Enterprise Databases & Cybersecurity',
  eligibilitySummary:
    'Bachelor’s degree (BE/B.Tech/B.Sc.Eng.) in Computer Engineering, CSE, Electronics & Communication, or IT Engineering from a recognized university with active Nepal Engineering Council (NEC) registration.',
  effectiveFromBs: 'NTC Open Recruitment Syllabus · Level 7 (Technical)',
  negativeMarkingPercent: 20,
  screeningPassPercent: 40,
  meritCalculationNote:
    'Both Written Papers carry 100 Marks each (Pass Mark: 40 in Paper I and 40 in Paper II) and count directly toward Final Merit. Candidates passing both papers qualify for the 30-Mark Oral Interview. Final Merit = Paper I General Module (100M) + Paper II Specialized Computer Engineering (100M) + Oral Interview (30M) = 230 Marks.',
  generalExamRules: [
    'Paper I & Paper II format each: 30 MCQs × 1M (30M, 20% / -0.20M negative marking per wrong MCQ) + 10 Short Subjective × 4M (40M) + 3 Long Subjective × 10M (30M) = 100 Marks (2 Hours per paper).',
    'Non-programmable scientific calculators are permitted in both General and Specialized examination halls.',
    'Minimum qualifying score is 40 marks out of 100 in EACH paper separately before shortlisting for the 30-Mark Oral Interview.',
    'Telecommunications Act 2053, Electronic Transactions Act 2063, Public Procurement Act 2063, Company Act, and NTC Employee Service Bylaws amended up to 3 months prior apply.',
  ],
  syllabusPdfPath: COMP_TECH_PHASE2_PDF,
  officialPscPdfs: [
    {
      id: 'ntc-l7-reference-pdf-1',
      phaseLabel: 'Technical Reference & IT Syllabus',
      title:
        'Nepal IT Officer & Telecom Systems Reference Syllabus (Paper I & II Bridge)',
      nepaliTitle:
        'सूचना प्रविधि, कम्प्युटर प्रणाली तथा दूरसञ्चार सन्दर्भ पाठ्यक्रम (PDF)',
      pages: 10,
      approvedDateBs: 'NTC Level 7 Technical Reference',
      localPdfPath: COMP_TECH_PHASE2_PDF,
      officialPscUrl:
        'https://www.ntc.net.np/notices/syllabus-for-level-7-and-level-8',
    },
    {
      id: 'ntc-l7-eta-law-pdf',
      phaseLabel: 'Electronic Transactions Act 2063',
      title:
        'विद्युतीय (इलेक्ट्रोनिक) कारोबार ऐन, २०६३ — Official Act PDF for Paper I Sec. B',
      nepaliTitle:
        'विद्युतीय कारोबार ऐन, २०६३ तथा साइबर कानुन — प्रथम पत्र खण्ड (ख)',
      pages: 30,
      approvedDateBs: 'Act 2063 · Cyber & Telecom Compliance',
      localPdfPath: ETA_2063_PDF,
      officialPscUrl:
        'https://www.ntc.net.np/notices/syllabus-for-level-7-and-level-8',
    },
  ],
  defaultSimulationPreset: 'ntc-l7-omr',
  phases: [
    {
      id: 'ntc-l7-phase-1',
      phaseNumber: 1,
      title: 'Paper I · General Engineering, Management & Telecom Acts',
      nepaliTitle: 'प्रथम पत्र · सामान्य इन्जिनियरिङ, व्यवस्थापन र दूरसञ्चार कानुन',
      summary:
        '2-Hour Paper (100 Marks · Pass: 40): 30 MCQs × 1M (20% negative) + 10 Short Questions × 4M + 3 Long Questions × 10M. Covers Section A Engineering & ICT Basics (64M) and Section B Management, Economics & Telecom/Procurement Statutes (36M).',
      officialPdfPath: ETA_2063_PDF,
      officialPscUrl:
        'https://www.ntc.net.np/notices/syllabus-for-level-7-and-level-8',
      papers: [
        {
          id: 'ntc-l7-paper-1',
          code: 'Paper I (General)',
          title: 'General Engineering Fundamentals, Management & Regulatory Acts',
          nepaliTitle: 'सामान्य आधारभूत ज्ञान, व्यवस्थापन र ऐन/नियम',
          examFormat: 'Subjective Analytical & Case',
          fullMarks: 100,
          passMarks: 40,
          durationLabel: '2 Hours',
          questionBreakdown:
            '30 MCQs × 1M (Sec. A: 20 + Sec. B: 10) + 10 Short × 4M (6+4) + 3 Long × 10M (2+1) = 100 Marks',
          scoringRule:
            'Pass Marks: 40/100 · -0.20M (20%) per wrong MCQ · Non-programmable calculators allowed · 100% counts toward 230M merit',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'ntc-p1-u1',
              branchNumber: 1,
              unitCode: 'Section A · Part 1',
              title: 'Engineering Mathematics, Probability, Statistics & Numerical Methods',
              nepaliTitle: 'खण्ड (क) १. इन्जिनियरिङ गणित, तथ्याङ्क र न्यूमेरिकल मेथड्स',
              marksWeight: 22,
              branchSummary:
                'Linear algebra, calculus, differential equations, probability distributions, statistical inference, and numerical root-finding/integration.',
              subtopics: [
                'Matrix algebra, eigenvalues/eigenvectors, vector spaces & linear transformations',
                'Differential equations (1st & 2nd order), Laplace & Fourier transforms',
                'Probability axioms, Bayes’ theorem, Normal/Poisson/Binomial distributions & regression',
                'Numerical root finding (Newton-Raphson), interpolation & numerical integration (Simpson/Trapezoidal)',
              ],
              chapters: [
                {
                  id: 'NTC-P1-U1-CH01',
                  chapterNumber: 1,
                  code: 'Math-Stat',
                  chapterName: 'Mathematics & Engineering Statistics',
                  nepaliChapterName: 'गणित, सम्भाव्यता र तथ्याङ्कशास्त्र',
                  marksAllocation: 'Approx. 22 Marks across MCQ, Short & Long',
                  chapterBrief:
                    'Core quantitative tools used across signal analysis, queuing, and performance modeling.',
                  topics: [
                    {
                      id: 'NTC-P1-U1-CH01-T01',
                      topicNumber: 1,
                      code: '1.1',
                      topic: 'Linear Algebra, Calculus & Transforms',
                      nepaliTopic: 'रेखीय बीजगणित, क्याल्कुलस तथा ल्याप्लास/फोरियर रूपान्तरण',
                      brief:
                        'Determinants, rank, eigenvalues, partial derivatives, ODEs, and Laplace/Fourier series for LTI signals.',
                    },
                    {
                      id: 'NTC-P1-U1-CH01-T02',
                      topicNumber: 2,
                      code: '1.2',
                      topic: 'Probability, Statistics & Numerical Methods',
                      nepaliTopic: 'सम्भाव्यता वितरण, तथ्याङ्क र न्यूमेरिकल मेथड्स',
                      brief:
                        'Mean, variance, standard error, correlation/regression, Poisson traffic arrivals, and Newton-Raphson/RK4 methods.',
                    },
                  ],
                },
              ],
              keyReferences:
                'NTC Level 7 Paper I Section A · Erwin Kreyszig Engineering Mathematics',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'Technical Systems & Quantitative Syllabus PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              simulatePresetId: 'ntc-l7-omr',
            },
            {
              id: 'ntc-p1-u2',
              branchNumber: 2,
              unitCode: 'Section A · Parts 2–3',
              title: 'Applied Mechanics, Thermodynamics & Basic Electricity/Electronics',
              nepaliTitle: 'खण्ड (क) २–३. अप्लाइड मेकानिक्स, थर्मोडायनामिक्स तथा आधारभूत विद्युत्/इलेक्ट्रोनिक्स',
              marksWeight: 22,
              branchSummary:
                'Statics/dynamics fundamentals, laws of thermodynamics, DC/AC circuit laws, transformers, semiconductors, and basic digital gates.',
              subtopics: [
                'Laws of thermodynamics, heat transfer basics & data-center HVAC/power thermal principles',
                'Ohm’s/Kirchhoff’s laws, Thevenin/Norton equivalents, RLC circuits & AC phasors',
                'Single/three-phase transformers, DC generators/motors & UPS/rectifier power backups',
                'PN junction diodes, BJT biasing, operational amplifiers & Boolean logic gates',
              ],
              chapters: [
                {
                  id: 'NTC-P1-U2-CH01',
                  chapterNumber: 1,
                  code: 'Mech-Elec',
                  chapterName: 'Mechanics, Thermodynamics & Electrical Basics',
                  nepaliChapterName: 'मेकानिक्स, थर्मोडायनामिक्स र बेसिक इलेक्ट्रिकल/इलेक्ट्रोनिक्स',
                  marksAllocation: 'Approx. 22 Marks',
                  chapterBrief:
                    'Shared multi-discipline engineering fundamentals required across NTC telecom infrastructure.',
                  topics: [
                    {
                      id: 'NTC-P1-U2-CH01-T01',
                      topicNumber: 1,
                      code: '2.1',
                      topic: 'Applied Mechanics & Thermodynamics Basics',
                      nepaliTopic: 'मेकानिक्स र थर्मोडायनामिक्सका आधारभूत सिद्धान्त',
                      brief:
                        'Force systems, equilibrium, stress/strain basics, First & Second Laws of Thermodynamics, and Carnot efficiency.',
                    },
                    {
                      id: 'NTC-P1-U2-CH01-T02',
                      topicNumber: 2,
                      code: '2.2',
                      topic: 'Basic Electricity, Transformers & Semiconductor Devices',
                      nepaliTopic: 'विद्युतीय परिपथ, ट्रान्सफर्मर तथा अर्धचालक उपकरण',
                      brief:
                        'KVL/KCL, AC power factor, single-phase transformer efficiency, diode rectifiers, BJT switching, and logic gates.',
                    },
                  ],
                },
              ],
              keyReferences:
                'NTC Level 7 Paper I Section A (Parts 2 & 3)',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'Technical Systems Reference PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              simulatePresetId: 'ntc-l7-omr',
            },
            {
              id: 'ntc-p1-u3',
              branchNumber: 3,
              unitCode: 'Section A · Part 4',
              title: 'Information & Communication Technology (ICT) Fundamentals',
              nepaliTitle: 'खण्ड (क) ४. सूचना तथा सञ्चार प्रविधि (ICT) का आधारभूत पक्ष',
              marksWeight: 20,
              branchSummary:
                'Computing hardware/software architecture, OSI/TCP-IP basics, transmission media, telecom evolution, and Digital Nepal ICT frameworks.',
              subtopics: [
                'Evolution of computers, I/O subsystems, storage hierarchy & system vs. application software',
                'OSI 7-layer vs TCP/IP models, fiber-optic/microwave/cellular (4G LTE, 5G) basics',
                'Cloud computing models (IaaS, PaaS, SaaS), virtualization & enterprise data centers',
                'E-Governance architecture, Digital Signature PKI & Nepal’s Digital Nepal Framework',
              ],
              chapters: [
                {
                  id: 'NTC-P1-U3-CH01',
                  chapterNumber: 1,
                  code: 'ICT-Core',
                  chapterName: 'ICT Systems, Networks & Telecom Foundations',
                  nepaliChapterName: 'आइसिटी प्रणाली, नेटवर्क र दूरसञ्चार आधार',
                  marksAllocation: 'Approx. 20 Marks',
                  chapterBrief:
                    'Connects foundational computing with telecom core, fiber backhaul, and enterprise IT.',
                  topics: [
                    {
                      id: 'NTC-P1-U3-CH01-T01',
                      topicNumber: 1,
                      code: '3.1',
                      topic: 'Computing Systems, Storage & Virtualization',
                      nepaliTopic: 'कम्प्युटर प्रणाली, स्टोरेज र भर्चुअलाइजेशन',
                      brief:
                        'CPU/memory/bus basics, RAID levels, SAN/NAS storage, hypervisors, and containerization.',
                    },
                    {
                      id: 'NTC-P1-U3-CH01-T02',
                      topicNumber: 2,
                      code: '3.2',
                      topic: 'Telecommunication Media, Cellular & ICT Policy',
                      nepaliTopic: 'दूरसञ्चार माध्यम, सेलुलर नेटवर्क र आइसिटी नीति',
                      brief:
                        'Optical fiber (DWDM/FTTH), GSM/LTE/5G evolution, and ICT policy in Nepal.',
                    },
                  ],
                },
              ],
              keyReferences: 'NTC Level 7 Paper I Section A (Part 4) · MoCIT ICT Policy',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'IT Officer & Systems Syllabus PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              writtenHref: '/written?paper=NTC%20Paper%20II%3A%20Computer%20Engineering',
              writtenLabel: 'Written Models',
              simulatePresetId: 'ntc-l7-omr',
            },
            {
              id: 'ntc-p1-u4',
              branchNumber: 4,
              unitCode: 'Section B · Parts 1–3',
              title: 'Project Management, Engineering Economics & Management Principles',
              nepaliTitle: 'खण्ड (ख) १–३. परियोजना व्यवस्थापन, इन्जिनियरिङ अर्थशास्त्र र व्यवस्थापन',
              marksWeight: 18,
              branchSummary:
                'CPM/PERT scheduling, engineering cashflow analysis, depreciation, FOB/CIF procurement costing, and organizational management.',
              subtopics: [
                'Project life cycle, WBS, Gantt charts, CPM critical path, PERT variance & risk matrix',
                'Time value of money, NPV, IRR, Benefit-Cost Ratio (BCR), payback period & depreciation methods',
                'Contract estimation, BOQ, Letter of Credit (L/C), FOB/CIF pricing & bid evaluation',
                'Management functions (POSDCORB), leadership, motivation theories, HR & MIS',
              ],
              chapters: [
                {
                  id: 'NTC-P1-U4-CH01',
                  chapterNumber: 1,
                  code: 'PM-Econ',
                  chapterName: 'Project Planning & Engineering Economics',
                  nepaliChapterName: 'परियोजना योजना तथा इन्जिनियरिङ अर्थशास्त्र',
                  marksAllocation: 'Approx. 18 Marks',
                  chapterBrief:
                    'Essential quantitative project & financial management tools for telecom rollouts.',
                  topics: [
                    {
                      id: 'NTC-P1-U4-CH01-T01',
                      topicNumber: 1,
                      code: '4.1',
                      topic: 'CPM/PERT Scheduling & Resource Levelling',
                      nepaliTopic: 'सीपीएम/पर्ट तालिका र जोखिम व्यवस्थापन',
                      brief:
                        'Network diagrams, float/slack calculation, project crashing, and risk mitigation plans.',
                    },
                    {
                      id: 'NTC-P1-U4-CH01-T02',
                      topicNumber: 2,
                      code: '4.2',
                      topic: 'Engineering Economics, Depreciation & Tender Costing',
                      nepaliTopic: 'इन्जिनियरिङ अर्थशास्त्र, ह्रासकट्टी र बोलपत्र लागत',
                      brief:
                        'NPV, IRR, BCR, straight-line vs. declining balance depreciation, FOB/CIF terms, and SLA cost evaluation.',
                    },
                  ],
                },
              ],
              keyReferences: 'NTC Level 7 Paper I Section B · Engineering Economics',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              simulatePresetId: 'written-ntc-l7',
            },
            {
              id: 'ntc-p1-u5',
              branchNumber: 5,
              unitCode: 'Section B · Part 4',
              title: 'Telecom Act 2053, Electronic Transactions Act 2063, PPA 2063 & NTC Bylaws',
              nepaliTitle: 'खण्ड (ख) ४. दूरसञ्चार ऐन २०५३, विद्युतीय कारोबार ऐन २०६३, सार्वजनिक खरिद ऐन र नियमावली',
              marksWeight: 18,
              branchSummary:
                'Legal & regulatory framework governing Nepal Telecom operations, NTA licensing, cyber compliance, and public procurement.',
              subtopics: [
                'Nepal Telecommunications Act 2053 & Regulations 2054: NTA mandate, licensing, spectrum, consumer rights & penalties',
                'Electronic Transactions Act 2063: digital signatures, Controller of Certification, cyber offenses (Sec. 44–58) & IT Tribunal',
                'Public Procurement Act 2063 & Rules: NCB/ICB bidding, technical-financial evaluation, bid security, SLA & performance bonds',
                'Company Act 2063 basics, Nepal Engineering Council Act 2055 & NTC Employee Service Bylaws (code of conduct)',
              ],
              chapters: [
                {
                  id: 'NTC-P1-U5-CH01',
                  chapterNumber: 1,
                  code: 'Acts-Regs',
                  chapterName: 'Telecommunications & Cyber Statutes of Nepal',
                  nepaliChapterName: 'दूरसञ्चार, विद्युतीय कारोबार तथा खरिद ऐन',
                  marksAllocation: 'Approx. 18 Marks',
                  chapterBrief:
                    'Statutory compliance tested in Section B MCQs, 4M short notes, and 10M regulatory analysis.',
                  topics: [
                    {
                      id: 'NTC-P1-U5-CH01-T01',
                      topicNumber: 1,
                      code: '5.1',
                      topic: 'Telecommunications Act 2053 & NTA Regulatory Powers',
                      nepaliTopic: 'दूरसञ्चार ऐन, २०५३ र दूरसञ्चार प्राधिकरणको भूमिका',
                      brief:
                        'Licensing tiers, spectrum allocation, interconnection rules, Rural Telecom Development Fund (RTDF), and tariff regulation.',
                    },
                    {
                      id: 'NTC-P1-U5-CH01-T02',
                      topicNumber: 2,
                      code: '5.2',
                      topic: 'Electronic Transactions Act 2063 & Public Procurement Act 2063',
                      nepaliTopic: 'विद्युतीय कारोबार ऐन २०६३ र सार्वजनिक खरिद ऐन २०६३',
                      brief:
                        'Electronic record validity, PKI certification hierarchy, IT cyber penalties, and transparent IT/telecom procurement.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Telecommunications Act 2053 · Electronic Transactions Act 2063 · Public Procurement Act 2063',
              materialPath: ETA_2063_PDF,
              materialTitle: 'Electronic Transactions Act 2063 Official PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              writtenHref: '/written?paper=NTC%20Paper%20II%3A%20Computer%20Engineering',
              writtenLabel: 'Written Models',
              simulatePresetId: 'written-ntc-l7',
            },
          ],
        },
      ],
    },
    {
      id: 'ntc-l7-phase-2',
      phaseNumber: 2,
      title: 'Paper II · Specialized Computer Engineering (16 Core Domains)',
      nepaliTitle: 'द्वितीय पत्र · विशिष्टीकृत कम्प्युटर इन्जिनियरिङ (१६ मुख्य विषय क्षेत्र)',
      summary:
        '2-Hour Specialized Paper (100 Marks · Pass: 40): 30 MCQs × 1M (20% negative) + 10 Short Subjective × 4M + 3 Long Subjective × 10M. Encompasses all 16 official Computer Engineering domains from Hardware & VLSI to OS, DBMS, Distributed Systems, AI, and Network Security.',
      officialPdfPath: COMP_TECH_PHASE2_PDF,
      officialPscUrl:
        'https://www.ntc.net.np/notices/syllabus-for-level-7-and-level-8',
      papers: [
        {
          id: 'ntc-l7-paper-2',
          code: 'Paper II (Technical)',
          title: 'Computer Engineering Core & Telecom Infrastructure Systems',
          nepaliTitle: 'कम्प्युटर इन्जिनियरिङ विषयगत तथा दूरसञ्चार प्रणाली',
          examFormat: 'Subjective Analytical & Case',
          fullMarks: 100,
          passMarks: 40,
          durationLabel: '2 Hours',
          questionBreakdown:
            '30 MCQs × 1M (30M) + 10 Short Questions × 4M (40M) + 3 Long Questions × 10M (30M) = 100 Marks',
          scoringRule:
            'Pass Marks: 40/100 · -0.20M (20%) per wrong MCQ · Non-programmable calculators allowed · 100% counts toward 230M merit',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'ntc-p2-u1',
              branchNumber: 1,
              unitCode: 'Domains 1–3',
              title: 'Electronics, Digital Systems Design & Digital Signal Processing (DSP)',
              nepaliTitle: '१–३. इलेक्ट्रोनिक्स, डिजिटल सिस्टम्स डिजाइन र डिजिटल सिग्नल प्रोसेसिङ',
              marksWeight: 25,
              branchSummary:
                'Small-signal BJT/FET analysis, wave-shaping circuits, combinational/sequential state machines, and DFT/FFT & digital filter design.',
              subtopics: [
                'Domain 1 (Electronics): Diode clippers/clampers, BJT/MOSFET biasing, hybrid-pi AC models, differential amplifiers & op-amp oscillators',
                'Domain 2 (DSP): Discrete-time LTI systems, Z-transform, ROC, DFT/FFT butterfly algorithms, FIR/IIR filter design & quantization noise',
                'Domain 3 (Digital Systems Design): K-map/Quine-McCluskey minimization, MUX/decoder design, synchronous counters, Mealy/Moore FSMs & VHDL/Verilog basics',
              ],
              chapters: [
                {
                  id: 'NTC-P2-U1-CH01',
                  chapterNumber: 1,
                  code: 'Elec-Dig',
                  chapterName: 'Analog Electronics & Digital Logic Design',
                  nepaliChapterName: 'एनालग इलेक्ट्रोनिक्स र डिजिटल लजिक डिजाइन',
                  marksAllocation: 'Approx. 16 Marks',
                  chapterBrief:
                    'Device-level circuit analysis and finite state machine synthesis.',
                  topics: [
                    {
                      id: 'NTC-P2-U1-CH01-T01',
                      topicNumber: 1,
                      code: '1.1',
                      topic: 'BJT/FET Small-Signal Analysis & Wave Shaping',
                      nepaliTopic: 'BJT/FET स्माल-सिग्नल विश्लेषण र वेभ सेपिङ',
                      brief:
                        'Rectifiers, Zener regulation, h-parameter & r_e models, multistage gain, and Schmitt triggers.',
                    },
                    {
                      id: 'NTC-P2-U1-CH01-T02',
                      topicNumber: 2,
                      code: '1.2',
                      topic: 'Combinational & Sequential Logic (FSM & HDL)',
                      nepaliTopic: 'कम्बिनेसनल/सिक्वेन्सियल लजिक र FSM',
                      brief:
                        'Adders, PLAs, flip-flop excitation tables, state reduction, hazards/races, and RTL Verilog/VHDL modeling.',
                    },
                  ],
                },
                {
                  id: 'NTC-P2-U1-CH02',
                  chapterNumber: 2,
                  code: 'DSP',
                  chapterName: 'Digital Signal Processing',
                  nepaliChapterName: 'डिजिटल सिग्नल प्रोसेसिङ (DSP)',
                  marksAllocation: 'Approx. 9 Marks',
                  chapterBrief:
                    'Sampling theorem, Z-domain stability, FFT complexity, and digital filters.',
                  topics: [
                    {
                      id: 'NTC-P2-U1-CH02-T01',
                      topicNumber: 1,
                      code: '2.1',
                      topic: 'Z-Transform, DFT/FFT & IIR/FIR Filters',
                      nepaliTopic: 'Z-ट्रान्सफर्म, FFT र डिजिटल फिल्टर डिजाइन',
                      brief:
                        'Nyquist sampling, poles/zeros stability, Radix-2 DIT/DIF FFT (O(N log N)), bilinear transform, and windowing.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Boylestad Electronics · Morris Mano Digital Design · Oppenheim & Schafer DSP',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'Technical Reference PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              simulatePresetId: 'ntc-l7-omr',
            },
            {
              id: 'ntc-p2-u2',
              branchNumber: 2,
              unitCode: 'Domains 4–6',
              title: 'Computer Architecture, Advanced Pipelining & Principles of VLSI',
              nepaliTitle: '४–६. कम्प्युटर आर्किटेक्चर, एडभान्स्ड आर्किटेक्चर र भीएलएसआई (VLSI)',
              marksWeight: 25,
              branchSummary:
                'ISA/control unit design, cache coherence, instruction-level parallelism, CMOS scaling rules, and programmable logic devices.',
              subtopics: [
                'Domain 4 (Computer Architecture): Addressing modes, hardwired vs. microprogrammed control, cache mapping, DMA & interrupt I/O',
                'Domain 5 (Advanced Architecture): 5-stage RISC pipeline, structural/data/control hazards, branch prediction, superscalar, SMP/NUMA & MESI cache coherence',
                'Domain 6 (Principles of VLSI): CMOS inverter VTC, lambda design rules, stick diagrams, static/dynamic CMOS logic, SRAM/DRAM cells, FPGA & ASIC flows',
              ],
              chapters: [
                {
                  id: 'NTC-P2-U2-CH01',
                  chapterNumber: 1,
                  code: 'Arch-Adv',
                  chapterName: 'Computer & Advanced Pipelined Architecture',
                  nepaliChapterName: 'कम्प्युटर आर्किटेक्चर र पाइपलाइनिङ',
                  marksAllocation: 'Approx. 17 Marks',
                  chapterBrief:
                    'Quantitative performance (Amdahl’s Law, CPI), memory hierarchy, and parallel architectures.',
                  topics: [
                    {
                      id: 'NTC-P2-U2-CH01-T01',
                      topicNumber: 1,
                      code: '3.1',
                      topic: 'Memory Hierarchy, Cache Mapping & I/O DMA',
                      nepaliTopic: 'क्यास मेमोरी, म्यापिङ र DMA इनपुट/आउटपुट',
                      brief:
                        'Direct/associative/set-associative cache hit-miss latency, write-back/through, TLB, and cycle-stealing DMA.',
                    },
                    {
                      id: 'NTC-P2-U2-CH01-T02',
                      topicNumber: 2,
                      code: '3.2',
                      topic: 'Pipelining, Hazards, Superscalar & Cache Coherence',
                      nepaliTopic: 'पाइपलाइन हजार्ड, सुपरस्केलर र मल्टिप्रोसेसर',
                      brief:
                        'Operand forwarding, Tomasulo/scoreboarding, Flynn’s taxonomy (SIMD/MIMD), and snooping MESI protocol.',
                    },
                  ],
                },
                {
                  id: 'NTC-P2-U2-CH02',
                  chapterNumber: 2,
                  code: 'VLSI',
                  chapterName: 'Principles of VLSI Design',
                  nepaliChapterName: 'भीएलएसआई डिजाइनका सिद्धान्तहरू',
                  marksAllocation: 'Approx. 8 Marks',
                  chapterBrief:
                    'CMOS fabrication steps, delay/power scaling, and memory/FPGA structures.',
                  topics: [
                    {
                      id: 'NTC-P2-U2-CH02-T01',
                      topicNumber: 1,
                      code: '4.1',
                      topic: 'CMOS Logic, Design Rules & Memory Arrays',
                      nepaliTopic: 'CMOS लजिक, लेआउट नियम र 6T SRAM/1T DRAM',
                      brief:
                        'Dynamic power (C·V²·f), CMOS propagation delay, Elmore delay, Domino logic, and LUT-based FPGA architecture.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Hennessy & Patterson Computer Architecture · Weste & Harris CMOS VLSI Design',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'Technical Reference PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              writtenHref: '/written?paper=NTC%20Paper%20II%3A%20Computer%20Engineering',
              writtenLabel: 'Written Models',
              simulatePresetId: 'ntc-l7-omr',
            },
            {
              id: 'ntc-p2-u3',
              branchNumber: 3,
              unitCode: 'Domains 10–13',
              title: 'Data Structures & Algorithms, Operating Systems, DBMS & Software Engineering',
              nepaliTitle: '१०–१३. डेटा स्ट्रक्चर/अल्गोरिदम, अपरेटिङ सिस्टम, डेटाबेस र सफ्टवेयर इन्जिनियरिङ',
              marksWeight: 25,
              branchSummary:
                'High-frequency systems engineering pillar covering asymptotic complexity, OS scheduling/virtual memory, ACID RDBMS, and Agile/SDLC.',
              subtopics: [
                'Domain 10 (Data Structures & Algorithms): Big-O/Theta/Omega, heaps, AVL/B+ trees, Dijkstra/Kruskal/Prim, DP & hashing',
                'Domain 11 (Operating Systems): CPU scheduling, semaphores/monitors, Banker’s deadlock avoidance, paging/page replacement & inode file systems',
                'Domain 12 (Software Engineering): SDLC/Agile/DevOps, UML, COCOMO estimation, cyclomatic complexity, unit/integration testing & SQA',
                'Domain 13 (Databases & File Systems): ER/EER diagrams, relational algebra/SQL, 1NF–BCNF normalization, 2PL/MVCC, B+ indexing & distributed DBs',
              ],
              chapters: [
                {
                  id: 'NTC-P2-U3-CH01',
                  chapterNumber: 1,
                  code: 'DSA-OS',
                  chapterName: 'Data Structures, Algorithms & Operating Systems',
                  nepaliChapterName: 'डेटा स्ट्रक्चर, अल्गोरिदम र अपरेटिङ सिस्टम',
                  marksAllocation: 'Approx. 13 Marks',
                  chapterBrief:
                    'Algorithmic efficiency and OS kernel resource/memory concurrency control.',
                  topics: [
                    {
                      id: 'NTC-P2-U3-CH01-T01',
                      topicNumber: 1,
                      code: '5.1',
                      topic: 'Trees, Graphs, Sorting & Complexity Analysis',
                      nepaliTopic: 'ट्री, ग्राफ अल्गोरिदम, सर्टिङ र टाइम कम्प्लेक्सिटी',
                      brief:
                        'Quicksort/Mergesort/Heapsort, Red-Black/AVL rotations, BFS/DFS, shortest paths, and MST algorithms.',
                    },
                    {
                      id: 'NTC-P2-U3-CH01-T02',
                      topicNumber: 2,
                      code: '5.2',
                      topic: 'OS Process Sync, Deadlocks & Virtual Memory',
                      nepaliTopic: 'प्रोसेस सिन्क्रोनाइजेसन, डेडलक र भर्चुअल मेमोरी',
                      brief:
                        'Preemptive/MLFQ scheduling, Producer-Consumer semaphores, Banker’s algorithm, Belady’s anomaly, and thrashing.',
                    },
                  ],
                },
                {
                  id: 'NTC-P2-U3-CH02',
                  chapterNumber: 2,
                  code: 'DBMS-SE',
                  chapterName: 'Database Management & Software Engineering',
                  nepaliChapterName: 'डेटाबेस प्रणाली (DBMS) र सफ्टवेयर इन्जिनियरिङ',
                  marksAllocation: 'Approx. 12 Marks',
                  chapterBrief:
                    'Schema normalization, telecom-scale transaction concurrency, and software quality assurance.',
                  topics: [
                    {
                      id: 'NTC-P2-U3-CH02-T01',
                      topicNumber: 1,
                      code: '6.1',
                      topic: 'Normalization (BCNF), Transactions & Distributed DBs',
                      nepaliTopic: 'नर्मलाइजेसन (BCNF), ACID ट्रान्जेक्सन र वितरित डेटाबेस',
                      brief:
                        'Lossless join decomposition, serializability, Strict 2PL, WAL recovery, sharding, and CAP theorem.',
                    },
                    {
                      id: 'NTC-P2-U3-CH02-T02',
                      topicNumber: 2,
                      code: '6.2',
                      topic: 'SDLC, UML, Software Testing & CI/CD',
                      nepaliTopic: 'सफ्टवेयर जीवनचक्र, UML, टेस्टिङ र गुणस्तर आश्वासन',
                      brief:
                        'Black-box/white-box testing, McCabe cyclomatic complexity, ISO 9001/CMMI, and telecom OSS/BSS release engineering.',
                    },
                  ],
                },
              ],
              keyReferences:
                'CLRS Algorithms · Silberschatz OS · Elmasri & Navathe DBMS · Pressman Software Engineering',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'IT Officer Phase II Syllabus PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              writtenHref: '/written?paper=NTC%20Paper%20II%3A%20Computer%20Engineering',
              writtenLabel: 'Written Models',
              simulatePresetId: 'written-ntc-l7',
            },
            {
              id: 'ntc-p2-u4',
              branchNumber: 4,
              unitCode: 'Domains 7–9 & 14–16',
              title: 'Computer Communications, Distributed Systems, AI, Web & Network Security',
              nepaliTitle: '७–९ र १४–१६. कम्प्युटर कम्युनिकेसन, डिस्ट्रिब्युटेड सिस्टम, AI, वेब र नेटवर्क सुरक्षा',
              marksWeight: 25,
              branchSummary:
                'Telecom-critical networking, distributed consensus, AI search/ML, HTTP/REST microservices, client-server middleware, and PKI/TLS security.',
              subtopics: [
                'Domain 7 (Computer Communications): Nyquist/Shannon capacity, modulation (QAM/OFDM), circuit vs. packet/MPLS switching, IPv4/IPv6 CIDR, OSPF/BGP, TCP congestion & VoIP/SIP',
                'Domain 8 (AI & Expert Systems): A*/minimax search, predicate logic, Bayesian networks, decision trees & neural network basics',
                'Domain 9 (Distributed Systems): RPC/gRPC, Lamport/vector clocks, Raft/Paxos consensus, DFS, fault tolerance & microservices',
                'Domains 14–15 (Internet & Client-Server Computing): HTTP/2–3, DNS, REST/TLS, 3-tier middleware, message queues & enterprise data warehousing',
                'Domain 16 (Cryptography & Network Security): AES, RSA, Diffie-Hellman, SHA-256, X.509 PKI, IPSec, TLS 1.3, NGFW/IDS & zero-trust telecom defense',
              ],
              chapters: [
                {
                  id: 'NTC-P2-U4-CH01',
                  chapterNumber: 1,
                  code: 'Net-Dist',
                  chapterName: 'Computer Communications, Distributed Systems & Web',
                  nepaliChapterName: 'सञ्चार नेटवर्क, डिस्ट्रिब्युटेड सिस्टम र इन्टरनेट प्रविधि',
                  marksAllocation: 'Approx. 15 Marks',
                  chapterBrief:
                    'Core carrier IP routing, telecom packet backbones, and scalable distributed services.',
                  topics: [
                    {
                      id: 'NTC-P2-U4-CH01-T01',
                      topicNumber: 1,
                      code: '7.1',
                      topic: 'Carrier Networking, IPv6/Subnetting, OSPF/BGP & MPLS',
                      nepaliTopic: 'राउटिङ प्रोटोकल (OSPF/BGP), IPv6 र MPLS स्विचिङ',
                      brief:
                        'CIDR VLSM subnetting calculations, sliding window ARQ, TCP AIMD congestion control, MPLS VPNs, and SIP/RTP VoIP.',
                    },
                    {
                      id: 'NTC-P2-U4-CH01-T02',
                      topicNumber: 2,
                      code: '7.2',
                      topic: 'Distributed Consensus, Client-Server Middleware & Web',
                      nepaliTopic: 'डिस्ट्रिब्युटेड सिन्क्रोनाइजेसन, क्लाइन्ट-सर्भर र वेब सुरक्षा',
                      brief:
                        'Logical clocks, 2PC vs Raft consensus, RESTful stateless APIs, caching/CDN, and OWASP Top 10 mitigations.',
                    },
                  ],
                },
                {
                  id: 'NTC-P2-U4-CH02',
                  chapterNumber: 2,
                  code: 'Sec-AI',
                  chapterName: 'Cryptography, Network Security & AI Systems',
                  nepaliChapterName: 'क्रिप्टोग्राफी, नेटवर्क सुरक्षा र आर्टिफिसियल इन्टेलिजेन्स',
                  marksAllocation: 'Approx. 10 Marks',
                  chapterBrief:
                    'Mathematical cryptosystems, PKI/TLS protocols, and intelligent search/ML foundations.',
                  topics: [
                    {
                      id: 'NTC-P2-U4-CH02-T01',
                      topicNumber: 1,
                      code: '8.1',
                      topic: 'AES, RSA, Digital Signatures, PKI & Telecom Security',
                      nepaliTopic: 'AES, RSA, डिजिटल हस्ताक्षर, PKI र नेटवर्क सुरक्षा',
                      brief:
                        'Symmetric vs. asymmetric encryption math, HMAC, X.509 certificate chains, IPSec tunnel mode, DDoS defense & SIEM.',
                    },
                    {
                      id: 'NTC-P2-U4-CH02-T02',
                      topicNumber: 2,
                      code: '8.2',
                      topic: 'AI Heuristic Search, Expert Systems & ML Basics',
                      nepaliTopic: 'एआई ह्युरिस्टिक सर्च, एक्सपर्ट सिस्टम र मेसिन लर्निङ',
                      brief:
                        'BFS/A* admissibility, alpha-beta pruning, forward/backward rule chaining, supervised learning, and telecom anomaly detection.',
                    },
                  ],
                },
              ],
              keyReferences:
                'Tanenbaum/Kurose Computer Networks · Stallings Cryptography · Russell & Norvig AI',
              materialPath: COMP_TECH_PHASE2_PDF,
              materialTitle: 'IT Officer Phase II Syllabus PDF',
              quizHref: '/quiz?deck=ntc-computer-engineering',
              quizLabel: 'Practice NTC MCQs',
              writtenHref: '/written?paper=NTC%20Paper%20II%3A%20Computer%20Engineering',
              writtenLabel: 'Written Models',
              simulatePresetId: 'written-ntc-l7',
            },
          ],
        },
      ],
    },
    {
      id: 'ntc-l7-phase-3',
      phaseNumber: 3,
      title: 'Final Stage · Technical Oral Interview (अन्तर्वार्ता)',
      nepaliTitle: 'अन्तिम चरण · प्राविधिक व्यक्तिगत अन्तर्वार्ता (३० अङ्क)',
      summary:
        'Candidates who score at least 40/100 in both Paper I and Paper II are shortlisted for the 30-mark Oral Interview board assessing engineering judgment, telecom troubleshooting, system architecture, and regulatory awareness.',
      officialPscUrl:
        'https://www.ntc.net.np/notices/syllabus-for-level-7-and-level-8',
      papers: [
        {
          id: 'ntc-l7-paper-viva',
          code: 'Final Viva',
          title: 'Technical Board & Competency Interview',
          nepaliTitle: 'प्राविधिक बोर्ड र व्यक्तिगत अन्तर्वार्ता',
          examFormat: 'Practical & Oral Viva',
          fullMarks: 30,
          passMarks: null,
          durationLabel: '20–30 Minutes',
          questionBreakdown:
            'Oral Interview Board (30 Marks) — Combined with Paper I (100M) + Paper II (100M) = 230 Marks Final Merit',
          scoringRule:
            'Evaluates core Computer Engineering troubleshooting, telecom billing/network resilience scenarios, and NTC service ethics.',
          countsTowardFinalMerit: true,
          units: [
            {
              id: 'ntc-p3-u1',
              branchNumber: 1,
              unitCode: 'Interview Board',
              title: 'Telecom Systems Troubleshooting, Project Leadership & Ethics',
              nepaliTitle: 'दूरसञ्चार प्रणाली समस्या समाधान, परियोजना नेतृत्व र आचारसंहिता',
              marksWeight: 30,
              branchSummary:
                'Assessment of practical software/network architecture decisions, outage RCA, public procurement ethics, and Nepal Telecom service mandate.',
              subtopics: [
                'Scenario-based troubleshooting: core IP congestion, database deadlocks, high-availability SLA & DDoS incident response',
                'Architecture defense: scalability trade-offs, disaster recovery (DR/BCP), cloud migration & FTTH/5G backend support',
                'Regulatory awareness: NTA compliance, ETA 2063 cybersecurity obligations, and ethical conduct under NTC Employee Bylaws',
              ],
              chapters: [
                {
                  id: 'NTC-P3-U1-CH01',
                  chapterNumber: 1,
                  code: 'Viva-Board',
                  chapterName: 'Oral Interview & Scenario Defense',
                  nepaliChapterName: 'मौखिक अन्तर्वार्ता तथा प्राविधिक विश्लेषण',
                  marksAllocation: '30 Marks',
                  chapterBrief:
                    'Final 30-mark panel determining overall merit rank out of 230.',
                  topics: [
                    {
                      id: 'NTC-P3-U1-CH01-T01',
                      topicNumber: 1,
                      code: '9.1',
                      topic: 'Outage Root-Cause Analysis & Architecture Trade-offs',
                      nepaliTopic: 'प्रणाली अवरोध विश्लेषण (RCA) र आर्किटेक्चर निर्णय',
                      brief:
                        'Explaining structured debugging across Layer 1–7 networks, DB replication lag, and telecom billing resilience.',
                    },
                    {
                      id: 'NTC-P3-U1-CH01-T02',
                      topicNumber: 2,
                      code: '9.2',
                      topic: 'Procurement Integrity & NTC Digital Mandate',
                      nepaliTopic: 'खरिद निष्ठा र नेपाल टेलिकमको डिजिटल उत्तरदायित्व',
                      brief:
                        'Handling technical bid evaluation objectively under Public Procurement Act 2063 and NEC ethical codes.',
                    },
                  ],
                },
              ],
              keyReferences:
                'NTC Level 7 Selection Guidelines · NEC Professional Code of Conduct',
              materialPath: ETA_2063_PDF,
              materialTitle: 'Electronic Transactions Act 2063 PDF',
              simulatePresetId: 'ntc-l7-omr',
            },
          ],
        },
      ],
    },
  ],
};
