import {
  SECTION_OFFICER_PAPER_2,
  SECTION_OFFICER_PAPER_3,
} from './sectionOfficerStage2Common.ts';
import type {
  PscExamPhase,
  PscServiceStreamGroup,
  PscSyllabusPaper,
} from './types.ts';

export const SECTION_OFFICER_PAPER_4_ADMIN: PscSyllabusPaper = {
  id: 'so-paper-4',
  code: 'Paper IV',
  title: 'Service-Related Subject (Administration & Federal Parliament)',
  nepaliTitle:
    'सेवा समूह सम्बन्धी विषय (नेपाल प्रशासन सेवा — सामान्य प्रशासन, लेखा तथा राजस्व समूह र संघीय संसद सेवा)',
  serviceStreamId: 'so-stream-admin-parliament',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    '10 Questions × 10 Marks = 100 Marks across Sections A (30M), B (20M), C (30M) & D (20M) · Includes problem-solving / case analysis',
  scoringRule:
    'Minimum 40 marks required · Counted in 360-mark Final Merit Total',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-p4-u1',
      branchNumber: 1,
      unitCode: 'Section A · Chapter 1',
      title: 'Public Management (3 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (क) सार्वजनिक व्यवस्थापन (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers personnel administration, organizational design, managerial directing/M&E, administrative reform commissions in Nepal, management audit, professional conduct, citizen performance evaluation, innovative trends, and ICT in service delivery.',
      subtopics: [
        '1.1 Scope & role of public management, 1.2 Personnel management (classification, recruitment, promotion, appraisal & separation), and 1.3 Organization & organizational development',
        '1.4 Directing, controlling, leadership, delegation, coordination & M&E, 1.5 Evolution & administrative reforms in Nepal, and 1.6 Management audit',
        '1.7 Professionalism & code of conduct, 1.8 Citizen involvement (public hearing, social audit, third-party evaluation), 1.9 Innovative trends, and 1.10 ICT & social networking in service delivery',
      ],
      chapters: [
        {
          id: 'SO-P4A-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Public Management',
          nepaliChapterName: '१. सार्वजनिक व्यवस्थापन',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Examines institutional design, civil service personnel systems, administrative reform history, social accountability, and digital public management.',
          topics: [
            {
              id: 'SO-P4A-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic: 'Introduction and scope of public management',
              nepaliTopic: 'सार्वजनिक व्यवस्थापनको परिचय र क्षेत्र',
              brief:
                'Traces the transition from rule-bound classical public administration to results-oriented public management integrating strategic planning, performance contracts, resource optimization, and public value creation.',
            },
            {
              id: 'SO-P4A-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic:
                'Personnel management: job classification, recruitment, selection, appointment, placement, promotion, compensation, motivation, career development, performance appraisal and separation',
              nepaliTopic:
                'कर्मचारी व्यवस्थापन: पद वर्गीकरण, भर्ना, छनोट, नियुक्ति, पदस्थापन, बढुवा, पारिश्रमिक, उत्प्रेरणा, वृत्ति विकास, कार्यसम्पादन मूल्याङ्कन र अवकाश',
              brief:
                'Comprehensive cradle-to-retirement civil service HR cycle under the Civil Service Act, 2049 and Rules, 2050—covering rank-in-person vs rank-in-post classification, PSC merit selection, probation, promotion criteria (work performance, seniority, academic qualification, geographical/training marks), motivation theories, and retirement/resignation.',
            },
            {
              id: 'SO-P4A-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3',
              topic:
                'Organization: concept, nature, types and organizational development',
              nepaliTopic:
                'संगठन: अवधारणा, प्रकृति, प्रकार र संगठनात्मक विकास',
              brief:
                'Examines formal vs informal, line vs staff, functional, matrix, and network organizations alongside planned Organizational Development (OD) interventions, O&M (Organization and Management) surveys, and right-sizing.',
            },
            {
              id: 'SO-P4A-B01-CH01-T04',
              topicNumber: 4,
              code: '1.4',
              topic:
                'Directing, controlling, hierarchy, decision-making, leadership, coordination, delegation and devolution of authority, supervision, monitoring and evaluation',
              nepaliTopic:
                'निर्देशन, नियन्त्रण, पदसोपान, निर्णय निर्माण, नेतृत्व, समन्वय, अधिकार प्रत्यायोजन तथा निक्षेपण, सुपरिवेक्षण र अनुगमन तथा मूल्याङ्कन',
              brief:
                'Synthesizes core managerial processes: scalar chain (hierarchy), rational and bounded-rational decision-making, transformational/adaptive leadership, inter-agency coordination, statutory delegation vs constitutional devolution, supportive supervision, and results-based M&E.',
            },
            {
              id: 'SO-P4A-B01-CH01-T05',
              topicNumber: 5,
              code: '1.5',
              topic:
                'Evolution of Nepalese public administration, organizational structure, features, reform efforts and challenges',
              nepaliTopic:
                'नेपालको सार्वजनिक प्रशासनको विकासक्रम, संगठनात्मक स्वरूप, विशेषता, सुधारका प्रयास र चुनौतीहरू',
              brief:
                'Reviews administrative history post-2007 BS and major Administrative Reform Commissions—Buch Commission (2009), Acharya Commission (2013), Jha Commission (2025), Thapa Commission (2032), Koirala Commission (2048), ARMC (2065), Kashiraj Dahal High-Level Committee (2070), and federal employee adjustment.',
            },
            {
              id: 'SO-P4A-B01-CH01-T06',
              topicNumber: 6,
              code: '1.6',
              topic: 'Management audit',
              nepaliTopic: 'व्यवस्थापन परीक्षण (म्यानेजमेन्ट अडिट)',
              brief:
                'Examines Section 72A of the Civil Service Act, 2049 empowering MoFAGA (and PSC oversight on personnel matters) to audit compliance with delegated authority, organizational efficiency, Citizens’ Charter execution, grievance redressal, and service quality.',
            },
            {
              id: 'SO-P4A-B01-CH01-T07',
              topicNumber: 7,
              code: '1.7',
              topic: 'Professionalism, discipline and code of conduct',
              nepaliTopic: 'व्यावसायिकता, अनुशासन र आचारसंहिता',
              brief:
                'Analyzes civil service professionalism (competence, impartiality, merit, ethical integrity) and statutory conduct obligations under Chapter 7 of the Civil Service Act, 2049—restrictions on gifts, political participation, outside business, strikes, and social media misuse.',
            },
            {
              id: 'SO-P4A-B01-CH01-T08',
              topicNumber: 8,
              code: '1.8',
              topic:
                'Citizens’ involvement in public performance evaluation: public hearing, social audit, public testing and third-party evaluation',
              nepaliTopic:
                'सार्वजनिक कार्यसम्पादन मूल्याङ्कनमा नागरिक संलग्नता: सार्वजनिक सुनुवाइ, सामाजिक परीक्षण, सार्वजनिक परीक्षण र तेस्रो पक्ष मूल्याङ्कन',
              brief:
                'Compares downward accountability instruments mandated by the Good Governance Act, 2064 and LGOA, 2074: Public Hearing (direct Q&A on service quality), Social Audit (holistic organizational governance review), Public Audit (project cost/output verification), and independent Third-Party Evaluation.',
            },
            {
              id: 'SO-P4A-B01-CH01-T09',
              topicNumber: 9,
              code: '1.9',
              topic: 'Innovative trends of public management',
              nepaliTopic: 'सार्वजनिक व्यवस्थापनका नवीनतम प्रवृत्तिहरू',
              brief:
                'Explores New Public Governance, Digital Era Governance, Whole-of-Government/Joined-Up Government, agile & anticipatory governance, behavioral nudges, co-creation, and performance-based contracting.',
            },
            {
              id: 'SO-P4A-B01-CH01-T10',
              topicNumber: 10,
              code: '1.10',
              topic:
                'Use of computer, internet, social networking and ICT in public service delivery: opportunities and challenges',
              nepaliTopic:
                'सार्वजनिक सेवा प्रवाहमा कम्प्युटर, इन्टरनेट, सामाजिक सञ्जाल र सूचना प्रविधिको प्रयोग: अवसर र चुनौतीहरू',
              brief:
                'Evaluates cloud government platforms, integrated data exchange, official social media grievance desks (Hello Sarkar), paperless GIOMS workflows, data privacy, misinformation risks, cybersecurity threats, and digital literacy gaps.',
            },
          ],
        },
      ],
      keyReferences:
        'Civil Service Act, 2049 · Good Governance Act, 2064 · Official SO Phase II PDF (pp. 9–12)',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      writtenHref: '/written/PSC-WR-401',
      writtenLabel: 'Service Delivery & DPI Q&A',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-u2',
      branchNumber: 2,
      unitCode: 'Section B · Chapter 2',
      title: 'Revenue Administration (2 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (ख) राजस्व प्रशासन (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers public financial procedures, canons of taxation, public income/expenditure/debt, Nepal’s direct and indirect tax regime, intergovernmental fiscal transfers, fiscal/monetary policy coordination, and the budget cycle.',
      subtopics: [
        '2.1 Financial procedures, 2.2 Concept & principles of revenue, and 2.3 Public income, expenditure & public debt',
        '2.4 Tax system in Nepal (VAT, Income Tax, Excise, Customs, Local & other taxes) and 2.5 Intergovernmental fiscal transfer & revenue allocation',
        '2.6 Economic, financial & monetary policy and 2.7 Budget cycle (formulation, implementation & evaluation)',
      ],
      chapters: [
        {
          id: 'SO-P4A-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Revenue Administration',
          nepaliChapterName: '२. राजस्व प्रशासन',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Examines domestic resource mobilization, tax administration, fiscal federalism transfers, macroeconomic policy alignment, and budget execution.',
          topics: [
            {
              id: 'SO-P4A-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Financial procedures',
              nepaliTopic: 'आर्थिक कार्यप्रणाली',
              brief:
                'Covers Parts 10, 16, and 19 of the Constitution (no tax without law, Federal/Provincial/Local Consolidated Funds, Appropriation, Vote on Account, Supplementary Estimates) and the Fiscal Procedures and Financial Accountability Act, 2076.',
            },
            {
              id: 'SO-P4A-B02-CH02-T02',
              topicNumber: 2,
              code: '2.2',
              topic: 'Concept and principles of revenue',
              nepaliTopic: 'राजस्वको अवधारणा र सिद्धान्तहरू',
              brief:
                'Analyzes tax and non-tax public revenue alongside Adam Smith’s classic canons (equity, certainty, convenience, economy) and modern principles of neutrality, buoyancy, elasticity, simplicity, and broad-based low-rate taxation.',
            },
            {
              id: 'SO-P4A-B02-CH02-T03',
              topicNumber: 3,
              code: '2.3',
              topic: 'Public income, expenditure and public debt',
              nepaliTopic: 'सार्वजनिक आय, खर्च र सार्वजनिक ऋण',
              brief:
                'Examines classification and trends of government revenue, recurrent vs capital vs financial financing expenditure, capital budget absorption bottlenecks, and domestic/external public debt management under the Public Debt Management Act, 2079.',
            },
            {
              id: 'SO-P4A-B02-CH02-T04',
              topicNumber: 4,
              code: '2.4',
              topic:
                'Tax system in Nepal: Value Added Tax, Income Tax, Excise Duty, Customs Duty, local taxes and other taxes',
              nepaliTopic:
                'नेपालको कर प्रणाली: मूल्य अभिवृद्धि कर, आयकर, अन्तःशुल्क, भन्सार महसुल, स्थानीय कर र अन्य करहरू',
              brief:
                'Covers statutory structure and administration (IRD & DoC) of Income Tax Act 2058, Value Added Tax Act 2052 (13% single rate), Excise Duty Act 2058, Customs Act 2064 (ASycuda World), and provincial/local taxes under Schedules 6, 8, and 9.',
            },
            {
              id: 'SO-P4A-B02-CH02-T05',
              topicNumber: 5,
              code: '2.5',
              topic:
                'Intergovernmental financial transfer and revenue allocation',
              nepaliTopic: 'अन्तर–सरकारी वित्त हस्तान्तरण र राजस्व बाँडफाँट',
              brief:
                'Analyzes Article 60, Article 251 (National Natural Resources and Fiscal Commission), and the Intergovernmental Fiscal Arrangement Act, 2074—covering the four grants (Fiscal Equalization, Conditional, Complementary, Special) and VAT/internal excise sharing (70% Federal, 15% Provincial, 15% Local) plus natural resource royalty sharing (50:25:25).',
            },
            {
              id: 'SO-P4A-B02-CH02-T06',
              topicNumber: 6,
              code: '2.6',
              topic: 'Economic, financial and monetary policy',
              nepaliTopic: 'आर्थिक, वित्त र मौद्रिक नीति',
              brief:
                'Examines fiscal policy formulated by the Ministry of Finance (taxation, public spending, deficit financing for growth and equity) and monetary policy formulated by Nepal Rastra Bank (interest rate corridor, CRR/SLR, inflation targeting, external sector stability) and their harmonic coordination.',
            },
            {
              id: 'SO-P4A-B02-CH02-T07',
              topicNumber: 7,
              code: '2.7',
              topic:
                'Budget cycle: formulation, implementation and evaluation',
              nepaliTopic: 'बजेट चक्र: तर्जुमा, कार्यान्वयन र मूल्याङ्कन',
              brief:
                'Traces the four stages of Nepal’s budget cycle—resource estimation & ceiling setting, parliamentary authorization & appropriation, treasury release/procurement execution, and accounting/audit/performance evaluation—addressing year-end "Asare Bikash" bunching.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution Arts. 60, 115–125 & 251 · Intergovernmental Fiscal Arrangement Act, 2074 · Fiscal Accountability Act, 2076',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Accountability Act',
      quizHref:
        '/quiz/custom?source=%2Fmaterials%2Fpublic-procurement-fiscal-act.pdf',
      quizLabel: 'PFM & Procurement MCQs',
      writtenHref: '/written/PSC-WR-302',
      writtenLabel: 'Fiscal & Capital Budget Q&A',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-u3',
      branchNumber: 3,
      unitCode: 'Section C · Chapters 3–4',
      title:
        'Government Financial Accounting & Reporting (20M) and Auditing System (10M)',
      nepaliTitle:
        'खण्ड (ग) सरकारी आर्थिक कारोबारको लेखाङ्कन तथा प्रतिवेदन (२०) र लेखापरीक्षण प्रणाली (१०) — ३० अङ्क',
      marksWeight: 30,
      branchSummary:
        'Combines Chapter 3 on government accounting, TSA/RMIS/PAMS, NPSAS, and Public Procurement Law (20 Marks) with Chapter 4 on internal/final auditing, Beruju settlement, OAG, and INTOSAI/ASOSAI standards (10 Marks).',
      subtopics: [
        'Chapter 3 (20M): Government financial ledger/reporting, Cash vs Accrual, Chart of Accounts/TSA/RMIS, Store & Deposit accounting, NPSAS, and Public Procurement Act 2063',
        'Chapter 4 (10M): Auditing types & principles, auditing standards, Beruju settlement, three-tier & SOE audit, Auditor General law, and ICAN/INTOSAI/ASOSAI',
      ],
      chapters: [
        {
          id: 'SO-P4A-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName:
            'Accounting and Reporting of Government Financial Transactions',
          nepaliChapterName:
            '३. सरकारी आर्थिक कारोबारको लेखाङ्कन तथा प्रतिवेदन',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Covers double-entry public accounting, digital treasury systems, asset/deposit records, NPSAS reporting, and public procurement procedures.',
          topics: [
            {
              id: 'SO-P4A-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic:
                'Introduction to government financial transactions, ledger and reporting',
              nepaliTopic:
                'सरकारी आर्थिक कारोबारको परिचय, लेखाङ्कन र प्रतिवेदन',
              brief:
                'Covers AGF-prescribed forms (Ma.Le.Pa. forms), Goshwara Voucher, Bank Cash Book, Budget Sheet, monthly Maskewari, and consolidated annual financial statements prepared by FCGO.',
            },
            {
              id: 'SO-P4A-B03-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic: 'Double-entry, cash and accrual accounting systems',
              nepaliTopic: 'दोहोरो लेखा, नगद र प्रोद्भावी लेखा प्रणाली',
              brief:
                'Compares double-entry debit-credit mechanics under cash-basis accounting (recognizing transactions upon cash receipt/payment) versus accrual-basis accounting (recognizing receivables, payables, and asset depreciation when incurred) and Nepal’s phased transition roadmap.',
            },
            {
              id: 'SO-P4A-B03-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic:
                'Accounting Classification List (Chart of Accounts), Treasury Single Account (TSA) and Revenue Management Information System (RMIS)',
              nepaliTopic:
                'लेखा संकेत तथा वर्गीकरण सूची, एकल खाता कोष प्रणाली र राजस्व व्यवस्थापन सूचना प्रणाली',
              brief:
                'Examines GFSM-2014-aligned economic/functional Chart of Accounts codes, real-time cash consolidation via TSA across DTCOs/PTCOs, and online taxpayer revenue accounting via RMIS and CGAS.',
            },
            {
              id: 'SO-P4A-B03-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic:
                'Accounting of public assets, inventory (Jinsi) and deposits (Dharauti)',
              nepaliTopic: 'सार्वजनिक सम्पत्ति, जिन्सी तथा धरौटी लेखाङ्कन',
              brief:
                'Covers expendable (Khapne) vs non-expendable (Nakhapne) store records, Public Assets Management System (PAMS), annual physical verification, auction/write-off, and security/bid/judicial deposit (Dharauti) accounting, refund, or forfeiture to revenue.',
            },
            {
              id: 'SO-P4A-B03-CH03-T05',
              topicNumber: 5,
              code: '3.5',
              topic:
                'Nepal Public Sector Accounting Standards (NPSAS) and legal provisions on financial procedures',
              nepaliTopic:
                'नेपाल सार्वजनिक क्षेत्र लेखामान र आर्थिक कार्यविधि सम्बन्धी कानूनी व्यवस्था',
              brief:
                'Analyzes IPSAS-aligned NPSAS financial statement formats alongside fiduciary responsibilities of Accounting Officers (Secretaries) and Responsible Officers (Office Chiefs) under the Fiscal Procedures and Financial Accountability Act, 2076 and Rules, 2077.',
            },
            {
              id: 'SO-P4A-B03-CH03-T06',
              topicNumber: 6,
              code: '3.6',
              topic: 'Public procurement management and legal provisions',
              nepaliTopic: 'सार्वजनिक खरिद व्यवस्थापन र कानूनी व्यवस्था',
              brief:
                'Examines procurement planning (master & annual plans), cost estimation, bidding methods (NCB/ICB open tender, sealed quotation, direct purchase, user committee, consultancy QCBS), e-GP portal, PPMO oversight, and review committee under the Public Procurement Act, 2063 and Rules, 2064.',
            },
          ],
        },
        {
          id: 'SO-P4A-B03-CH04',
          chapterNumber: 4,
          code: 'Chapter 4',
          chapterName: 'Auditing System',
          nepaliChapterName: '४. लेखापरीक्षण प्रणाली',
          marksAllocation: '1 Question × 10 Marks = 10 Marks',
          chapterBrief:
            'Examines constitutional and statutory auditing standards, Beruju clearance mechanisms, three-tier public audit, and supreme audit institutions.',
          topics: [
            {
              id: 'SO-P4A-B03-CH04-T01',
              topicNumber: 1,
              code: '4.1',
              topic:
                'Introduction, purpose, types, principles and importance of auditing',
              nepaliTopic:
                'लेखापरीक्षणको परिचय, उद्देश्य, प्रकार, सिद्धान्त र महत्व',
              brief:
                'Distinguishes internal audit (management corrective control) from independent final statutory audit, and examines regularity, financial, compliance, performance (3Es), propriety (औचित्य), IT, and forensic audits.',
            },
            {
              id: 'SO-P4A-B03-CH04-T02',
              topicNumber: 2,
              code: '4.2',
              topic: 'Government and corporate sector auditing standards',
              nepaliTopic: 'सरकारी तथा संस्थागत क्षेत्रका लेखापरीक्षण मानहरू',
              brief:
                'Compares Nepal Government Auditing Standards (NGAS/ISSAI-aligned) issued by OAG for public entities with Nepal Standards on Auditing (NSA/ISA-aligned) issued by AuSB/ICAN for corporate and state-owned enterprises.',
            },
            {
              id: 'SO-P4A-B03-CH04-T03',
              topicNumber: 3,
              code: '4.3',
              topic: 'Irregularities (Beruju) and their settlement',
              nepaliTopic: 'बेरुजु र बेरुजु फर्छ्यौट व्यवस्था',
              brief:
                'Classifies audit arrears into recoverable (असुल उपर गर्नुपर्ने), regularizable (नियमित गर्नुपर्ने: unsubstantiated/unauthorized), and unsettled advances (पेश्की), detailing 35-day response timelines, Accounting Officer liability, and Public Accounts Committee scrutiny.',
            },
            {
              id: 'SO-P4A-B03-CH04-T04',
              topicNumber: 4,
              code: '4.4',
              topic:
                'Audit of federal, provincial and local levels, and wholly or substantially government-owned corporate bodies',
              nepaliTopic:
                'संघ, प्रदेश र स्थानीय तह तथा पूर्ण वा अधिकांश सरकारी स्वामित्वका संगठित संस्थाहरूको लेखापरीक्षण',
              brief:
                'Analyzes OAG’s constitutional jurisdiction under Article 241 over all federal, provincial, and 753 local governments, wholly government-owned enterprises, and consultative role in >50% state-owned corporate bodies.',
            },
            {
              id: 'SO-P4A-B03-CH04-T05',
              topicNumber: 5,
              code: '4.5',
              topic:
                'Legal provisions relating to the Auditor General and auditing',
              nepaliTopic: 'महालेखापरीक्षक र लेखापरीक्षण सम्बन्धी कानूनी व्यवस्था',
              brief:
                'Covers Part 22 of the Constitution (Articles 240–241) and the Audit Act, 2075—detailing Auditor General appointment, 6-year tenure, unrestricted access to documents, Section 8 audit criteria (regularity, economy, efficiency, effectiveness, propriety), and annual reporting.',
            },
            {
              id: 'SO-P4A-B03-CH04-T06',
              topicNumber: 6,
              code: '4.6',
              topic:
                'Institute of Chartered Accountants of Nepal (ICAN), INTOSAI and ASOSAI',
              nepaliTopic:
                'नेपाल चार्टर्ड एकाउन्टेन्ट्स संस्था (ICAN), इन्टोसाई (INTOSAI) र एसोसाई (ASOSAI)',
              brief:
                'Examines ICAN’s statutory regulation of the accounting profession (Nepal Chartered Accountants Act, 2053) alongside global Supreme Audit Institution standard-setting and capacity building under INTOSAI (Lima & Mexico Declarations, ISSAIs) and ASOSAI.',
            },
          ],
        },
      ],
      keyReferences:
        'Public Procurement Act, 2063 · Audit Act, 2075 · Fiscal Accountability Act, 2076',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Public Procurement & Fiscal Act Digest',
      writtenHref: '/written/PSC-WR-403',
      writtenLabel: 'Office Turnaround Case Q&A',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-u4',
      branchNumber: 4,
      unitCode: 'Section D · Chapter 5',
      title:
        'Parliamentary Process and Federal System (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (घ) संसदीय प्रक्रिया र संघीय प्रणाली (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Examines cooperative federalism, three-tier legislative interrelations, parliamentary bill procedures, bicameral HoR–National Assembly relations, parliamentary committees, Speaker/Opposition roles, Federal Parliament Secretariat, three-tier civil services, and parliamentary ethics.',
      subtopics: [
        '5.1 Federalism in Nepal, 5.2 Three-tier legislative interrelations, 5.3 Parliamentary management & law-making, and 5.4 HoR & National Assembly interrelation',
        '5.5 Parliament, Parliamentary Committees & Constitutional Bodies, 5.6 Role of Parliamentary Officials, Parties & Opposition, and 5.7 Secretariat Operation & Management Committee',
        '5.8 Operation of government services at Federal, Provincial & Local levels and 5.9 Code of conduct & ethics of Parliamentarians and elected representatives',
      ],
      chapters: [
        {
          id: 'SO-P4A-B04-CH05',
          chapterNumber: 5,
          code: 'Chapter 5',
          chapterName: 'Parliamentary Process and Federal System',
          nepaliChapterName: '५. संसदीय प्रक्रिया र संघीय प्रणाली',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Covers parliamentary procedure, bicameral dynamics, committee oversight, intergovernmental coordination, and legislative ethics.',
          topics: [
            {
              id: 'SO-P4A-B04-CH05-T01',
              topicNumber: 1,
              code: '5.1',
              topic: 'Federal system and federalism in Nepal',
              nepaliTopic: 'संघीय प्रणाली र नेपालमा संघीयता',
              brief:
                'Analyzes coming-together vs holding-together federalism and Nepal’s cooperative three-tier model (Part 20, Article 232; Schedules 5–9; National Coordination Council under the Federation, Province and Local Level Coordination and Inter-relation Act, 2077).',
            },
            {
              id: 'SO-P4A-B04-CH05-T02',
              topicNumber: 2,
              code: '5.2',
              topic:
                'Legislative interrelation among federal, provincial and local levels',
              nepaliTopic:
                'संघ, प्रदेश र स्थानीय तहबीचको विधायिकी अन्तरसम्बन्ध',
              brief:
                'Examines Article 57 distribution of legislative power, doctrine of repugnancy on concurrent lists (provincial/local laws inconsistent with federal law void to the extent of inconsistency), residual federal powers (Art. 58), and inter-tier legislative coordination.',
            },
            {
              id: 'SO-P4A-B04-CH05-T03',
              topicNumber: 3,
              code: '5.3',
              topic: 'Parliamentary management procedures and law-making process',
              nepaliTopic: 'संसदीय कार्यसञ्चालन प्रक्रिया र कानून निर्माण विधि',
              brief:
                'Covers summoning/prorogation of sessions, Zero Hour and Special Hour, Question Hour, motions (attention, public importance, adjournment, confidence/no-confidence), and the stages of bill readings, clause-by-clause amendment, passage, and authentication.',
            },
            {
              id: 'SO-P4A-B04-CH05-T04',
              topicNumber: 4,
              code: '5.4',
              topic:
                'Interrelation between the House of Representatives and the National Assembly',
              nepaliTopic: 'प्रतिनिधि सभा र राष्ट्रिय सभाबीचको अन्तरसम्बन्ध',
              brief:
                'Compares the 275-member House of Representatives and permanent 59-member National Assembly—analyzing Money Bill exclusivity in HoR, 60-day message/amendment timelines under Article 111, joint sittings (Art. 95/104), and joint committees.',
            },
            {
              id: 'SO-P4A-B04-CH05-T05',
              topicNumber: 5,
              code: '5.5',
              topic:
                'Interrelation among Parliament, Parliamentary Committees and Constitutional Bodies',
              nepaliTopic:
                'संसद, संसदीय समितिहरू र संवैधानिक निकायहरूबीचको अन्तरसम्बन्ध',
              brief:
                'Examines thematic "mini-parliaments" (Public Accounts Committee, State Affairs & Good Governance Committee, Parliamentary Hearing Committee under Art. 292) scrutinizing annual reports of Constitutional Commissions and holding the executive accountable.',
            },
            {
              id: 'SO-P4A-B04-CH05-T06',
              topicNumber: 6,
              code: '5.6',
              topic:
                'Role of Parliamentary Officials, Parliamentary Parties and the Opposition',
              nepaliTopic:
                'संसदका पदाधिकारी, संसदीय दल र विपक्षी दलको भूमिका',
              brief:
                'Analyzes the neutral presiding authority of the Speaker and National Assembly Chairperson, whips of parliamentary parties, and the constructive watchdog role of the Main Opposition Party as "government-in-waiting."',
            },
            {
              id: 'SO-P4A-B04-CH05-T07',
              topicNumber: 7,
              code: '5.7',
              topic:
                'Role of the Federal Parliament Secretariat Operation and Management Committee',
              nepaliTopic:
                'संघीय संसद सचिवालय सञ्चालन तथा व्यवस्थापन समितिको भूमिका',
              brief:
                'Covers Article 107 of the Constitution and the Federal Parliament Secretariat Act, 2064—examining autonomous administrative, financial, and personnel policy oversight exercised by the Secretariat Operation and Management Committee chaired by the Speaker.',
            },
            {
              id: 'SO-P4A-B04-CH05-T08',
              topicNumber: 8,
              code: '5.8',
              topic:
                'Jurisdictions and policy provisions for the operation of government services at Federal, Provincial and Local levels',
              nepaliTopic:
                'संघ, प्रदेश र स्थानीय तहमा सरकारी सेवा सञ्चालन सम्बन्धी क्षेत्राधिकार र नीतिगत व्यवस्था',
              brief:
                'Examines Article 285 (constitution of Federal, Provincial, and Local government services), Article 243/244 (Federal and Provincial PSC mandates), Employee Adjustment Act 2075, and umbrella Federal Civil Service standards.',
            },
            {
              id: 'SO-P4A-B04-CH05-T09',
              topicNumber: 9,
              code: '5.9',
              topic:
                'Code of conduct, discipline, integrity and ethics of Parliamentarians and elected representatives',
              nepaliTopic:
                'सांसद तथा जनप्रतिनिधिहरूको आचारसंहिता, अनुशासन, सदाचार र नैतिकता',
              brief:
                'Evaluates conflict-of-interest disclosure, parliamentary privilege boundaries (Art. 103), anti-defection rules (Political Parties Act), asset transparency, and ethical accountability of federal, provincial, and local elected officials.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution Parts 8–9 & 20 · Federal Inter-Relations Act, 2077 · Parliament Secretariat Act, 2064',
      materialPath: '/materials/nepal-parichaya-federal-structure.pdf',
      materialTitle: 'Federal Structure & Local Governance',
      writtenHref: '/written/PSC-WR-202',
      writtenLabel: 'Cooperative Federalism Q&A',
      simulatePresetId: 'written-paper-4',
    },
  ],
};

export const SECTION_OFFICER_PAPER_4_AUDIT: PscSyllabusPaper = {
  id: 'so-paper-4-audit',
  code: 'Paper IV (Audit)',
  title: 'Service-Related Subject (Nepal Audit Service)',
  nepaliTitle: 'सेवा समूह सम्बन्धी विषय (नेपाल लेखापरीक्षण सेवा)',
  serviceStreamId: 'so-stream-audit',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    '10 Questions × 10 Marks = 100 Marks across Sections A (30M), B (30M), C (20M) & D (20M)',
  scoringRule:
    'Minimum 40 marks required · Counted in 360-mark Final Merit Total for Nepal Audit Service',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-p4-aud-u1',
      branchNumber: 1,
      unitCode: 'Section A · Chapters 1–2',
      title:
        'Accounting & Auditing Laws (20M) and Government Accounting & Auditing System (10M)',
      nepaliTitle:
        'खण्ड (क) लेखा तथा लेखापरीक्षण सम्बन्धी कानूनी व्यवस्था (२०) र सरकारी लेखा तथा लेखापरीक्षण प्रणाली (१०) — ३० अङ्क',
      marksWeight: 30,
      branchSummary:
        'Covers constitutional and statutory public finance/audit laws (20M) alongside Nepal’s government accounting, NPSAS, project accounting, and OAG financial/performance/compliance audit guidelines (10M).',
      subtopics: [
        'Chapter 1 (20M): Constitutional OAG/finance provisions, Audit Act 2075, Fiscal Accountability Act 2076, Intergovernmental Fiscal Act, Procurement law, Travel Rules & Public Expenditure law',
        'Chapter 2 (10M): Cash & Accrual accounting, NPSAS, government vouchers/ledgers/reports, central vs operating accounting, OAG audit guidelines & project audit',
      ],
      chapters: [
        {
          id: 'SO-P4AUD-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Legal Provisions Related to Accounting and Auditing',
          nepaliChapterName:
            '१. लेखा तथा लेखापरीक्षण सम्बन्धी कानूनी व्यवस्था',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Tests statutory mastery of fiscal accountability, public procurement, expenditure norms, and the Audit Act, 2075.',
          topics: [
            {
              id: 'SO-P4AUD-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic:
                'Provisions in the Constitution of Nepal regarding public finance and the Auditor General',
              nepaliTopic:
                'नेपालको संविधानमा आर्थिक कार्यप्रणाली र महालेखापरीक्षक सम्बन्धी व्यवस्था',
              brief:
                'Covers Consolidated Funds, appropriation rules across three tiers (Parts 10, 16, 19), and Articles 240–241 defining the appointment, independence, powers, and annual reporting of the Auditor General.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic: 'Audit Act, 2075',
              nepaliTopic: 'लेखापरीक्षण ऐन, २०७५',
              brief:
                'Analyzes audit methods, Section 8 matters to be audited (regularity, economy, efficiency, effectiveness, propriety), corporate body audit appointment, access to electronic/paper records, directives, and immunity.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3',
              topic:
                'Fiscal Procedures and Financial Accountability Act, 2076 and Rules, 2077',
              nepaliTopic:
                'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ र नियमावली, २०७७',
              brief:
                'Examines budget formulation/surrender, internal control and internal audit, fiduciary duties of Secretaries and Office Chiefs, retention of records, and statutory Beruju classification and settlement.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T04',
              topicNumber: 4,
              code: '1.4',
              topic: 'Intergovernmental Fiscal Arrangement Act, 2074',
              nepaliTopic: 'अन्तर–सरकारी वित्त व्यवस्थापन ऐन, २०७४',
              brief:
                'Covers revenue/royalty sharing formulas, fiscal transfers, borrowing limits, deficit budget conditions, and fiscal discipline across Federal, Provincial, and Local governments.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T05',
              topicNumber: 5,
              code: '1.5',
              topic: 'Prevailing Public Procurement Act and Rules',
              nepaliTopic: 'प्रचलित सार्वजनिक खरिद ऐन तथा नियमावली',
              brief:
                'Audits compliance with procurement plans, cost estimates, bidding security, bid evaluation, variation orders, price adjustment, contract termination, and blacklisting under PPA 2063 & PPR 2064.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T06',
              topicNumber: 6,
              code: '1.6',
              topic: 'Travel Expenses Rules, 2064',
              nepaliTopic: 'भ्रमण खर्च नियमावली, २०६४',
              brief:
                'Covers deputation (Kaaj) authorization, daily and travel allowances (TADA), foreign travel norms, advance settlement timelines, and audit verification against irregular TADA claims.',
            },
            {
              id: 'SO-P4AUD-B01-CH01-T07',
              topicNumber: 7,
              code: '1.7',
              topic:
                'Prevailing laws and standards relating to public expenditure management and austerity',
              nepaliTopic:
                'सार्वजनिक खर्च व्यवस्थापन तथा मितव्ययिता सम्बन्धी प्रचलित कानून र मापदण्डहरू',
              brief:
                'Examines Ministry of Finance Public Expenditure Standards and austerity directives governing vehicle purchase, consultancy, contingencies, norms-based costing, and multi-year contract approvals.',
            },
          ],
        },
        {
          id: 'SO-P4AUD-B01-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Government Accounting and Auditing System of Nepal',
          nepaliChapterName: '२. नेपालको सरकारी लेखा तथा लेखापरीक्षण प्रणाली',
          marksAllocation: '1 Question × 10 Marks = 10 Marks',
          chapterBrief:
            'Focuses on public sector accounting mechanics, central/operating books, OAG audit manuals, and donor-funded project audits.',
          topics: [
            {
              id: 'SO-P4AUD-B01-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Cash-based and Accrual-based Accounting Systems',
              nepaliTopic: 'नगद र प्रोद्भावीमा आधारित लेखा प्रणाली',
              brief:
                'Compares recognition timing, balance sheet completeness, liability tracking, and modified cash practices in Nepal’s public sector.',
            },
            {
              id: 'SO-P4AUD-B01-CH02-T02',
              topicNumber: 2,
              code: '2.2',
              topic: 'Nepal Public Sector Accounting Standards (NPSAS)',
              nepaliTopic: 'नेपाल सार्वजनिक क्षेत्र लेखामान (NPSAS)',
              brief:
                'Covers mandatory presentation of cash receipts and payments, budget vs actual comparisons, notes to accounts, and consolidation across government entities.',
            },
            {
              id: 'SO-P4AUD-B01-CH02-T03',
              topicNumber: 3,
              code: '2.3',
              topic:
                'Journal Vouchers, Bank Cash Book, Budget Sheet, Monthly Reports and Financial Statements',
              nepaliTopic:
                'गोश्वारा भौचर, बैंक नगदी किताब, बजेट हिसाब, मासिक प्रतिवेदन र वित्तीय विवरण',
              brief:
                'Examines preparation, cross-reconciliation, and audit trail verification of primary AGF forms from transaction entry to annual closing.',
            },
            {
              id: 'SO-P4AUD-B01-CH02-T04',
              topicNumber: 4,
              code: '2.4',
              topic: 'Central-level and Operating-level Accounting',
              nepaliTopic: 'केन्द्रीय स्तर र कार्यसञ्चालन स्तरको लेखा',
              brief:
                'Distinguishes treasury/ministry central consolidation accounts from spending-unit operating accounts and reconciles inter-level fund releases.',
            },
            {
              id: 'SO-P4AUD-B01-CH02-T05',
              topicNumber: 5,
              code: '2.5',
              topic:
                'Auditing guidelines (Financial, Performance and Compliance Audit)',
              nepaliTopic:
                'लेखापरीक्षण निर्देशिकाहरू (वित्तीय, कार्यमूलक र परिपालना लेखापरीक्षण)',
              brief:
                'Applies OAG Nepal’s ISSAI-based Financial Audit, Performance Audit, and Compliance Audit manuals across audit planning, sampling, evidence gathering, and reporting.',
            },
            {
              id: 'SO-P4AUD-B01-CH02-T06',
              topicNumber: 6,
              code: '2.6',
              topic: 'Project Accounting and Audit',
              nepaliTopic: 'आयोजना लेखा तथा लेखापरीक्षण',
              brief:
                'Covers Direct Payment, Reimbursement, Imprest/Designated Foreign Currency Accounts, Statement of Expenditure (SOE) verification, and donor covenant compliance in foreign-aided projects.',
            },
          ],
        },
      ],
      keyReferences:
        'Audit Act, 2075 · Fiscal Accountability Act, 2076 · NPSAS · OAG Audit Guidelines',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Accountability Act',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-aud-u2',
      branchNumber: 2,
      unitCode: 'Section B · Chapter 3',
      title: 'Business Accounting (3 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (ख) व्यावसायिक लेखा (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers GAAP, books of original entry, bank reconciliation, corporate financial statements, capital budgeting, ratio/trend analysis, CVP analysis, asset valuation/depreciation, and NFRS implementation.',
      subtopics: [
        '3.1 Accounting principles, 3.2 Journal/Ledger/Trial Balance/Cash Book, 3.3 Bank Reconciliation, and 3.4 Corporate Financial Statements',
        '3.5 Capital Budgeting, 3.6 Ratio & Trend Analysis, 3.7 Cost-Volume-Profit (CVP) Analysis, 3.8 Asset Valuation & Depreciation, and 3.9 NFRS',
      ],
      chapters: [
        {
          id: 'SO-P4AUD-B02-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Business Accounting',
          nepaliChapterName: '३. व्यावसायिक लेखा',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Equips Audit Officers to audit state-owned enterprises, corporate bodies, financial ratios, capital investments, and NFRS-compliant accounts.',
          topics: [
            {
              id: 'SO-P4AUD-B02-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic: 'Basic Principles and Concepts of Accounting',
              nepaliTopic: 'लेखाका आधारभूत सिद्धान्त तथा अवधारणाहरू',
              brief:
                'Covers entity, going concern, accrual, matching, prudence/conservatism, materiality, consistency, and historical cost vs fair value conventions.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic: 'Journal, Ledger, Trial Balance and Bank/Cash Book',
              nepaliTopic: 'गोश्वारा, खाता, सन्तुलन परीक्षण र बैंक/नगदी किताब',
              brief:
                'Covers double-entry recording, subsidiary books, ledger posting, trial balance preparation, and rectification of accounting errors.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic: 'Bank Reconciliation Statement',
              nepaliTopic: 'बैंक हिसाब मिलान विवरण',
              brief:
                'Identifies timing differences (unpresented cheques, uncredited deposits) and book/bank errors to reconcile cash book and bank passbook balances.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic:
                'Financial Statements: Statement of Financial Position, Income Statement, Cash Flow Statement, Statement of Changes in Equity and Notes',
              nepaliTopic:
                'वित्तीय विवरणहरू: वित्तीय अवस्थाको विवरण, आय विवरण, नगद प्रवाह विवरण, इक्विटी परिवर्तन विवरण र लेखा सम्बन्धी टिप्पणीहरू',
              brief:
                'Examines preparation and audit verification of all five complete general-purpose corporate financial statements.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T05',
              topicNumber: 5,
              code: '3.5',
              topic: 'Capital Budgeting',
              nepaliTopic: 'पूँजीगत बजेटिङ',
              brief:
                'Evaluates long-term investment viability using Payback Period, Accounting Rate of Return (ARR), Net Present Value (NPV), Internal Rate of Return (IRR), and Profitability Index.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T06',
              topicNumber: 6,
              code: '3.6',
              topic: 'Financial Statement, Ratio and Trend Analysis',
              nepaliTopic: 'वित्तीय विवरण, अनुपात तथा प्रवृत्ति विश्लेषण',
              brief:
                'Analyzes liquidity, solvency/leverage, activity/turnover, and profitability ratios alongside horizontal and vertical common-size trend analysis.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T07',
              topicNumber: 7,
              code: '3.7',
              topic: 'Cost-Volume-Profit (CVP) Analysis',
              nepaliTopic: 'लागत–परिमाण–नाफा (CVP) विश्लेषण',
              brief:
                'Covers fixed vs variable cost behavior, contribution margin, break-even point (BEP), margin of safety, and target profit modeling.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T08',
              topicNumber: 8,
              code: '3.8',
              topic: 'Asset Valuation and Depreciation',
              nepaliTopic: 'सम्पत्ति मूल्याङ्कन र ह्रासकट्टी',
              brief:
                'Examines inventory valuation (FIFO, weighted average, NRV), PPE recognition/impairment, and straight-line vs diminishing-balance/pool depreciation methods.',
            },
            {
              id: 'SO-P4AUD-B02-CH03-T09',
              topicNumber: 9,
              code: '3.9',
              topic: 'Implementation of Nepal Financial Reporting Standards (NFRS)',
              nepaliTopic: 'नेपाल वित्तीय प्रतिवेदन मान (NFRS) को कार्यान्वयन',
              brief:
                'Analyzes IFRS-converged NFRS issued by Accounting Standards Board Nepal, fair-value measurement challenges, disclosure rigor, and adoption across banks, insurers, and public enterprises.',
            },
          ],
        },
      ],
      keyReferences:
        'Official Section Officer Phase II PDF (Audit Service) · NFRS (ASB Nepal)',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-aud-u3',
      branchNumber: 3,
      unitCode: 'Section C · Chapter 4',
      title:
        'International Practices and Standards of Auditing (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (ग) लेखापरीक्षणका अन्तर्राष्ट्रिय अभ्यास तथा मानहरू (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers Supreme Audit Institutions (SAIs), INTOSAI/ASOSAI governance, ISSAIs/ISAs/NGAS, audit report follow-up, SAI-PMF, and audit quality assurance.',
      subtopics: [
        '4.1 SAI models, 4.2 INTOSAI & OAG Nepal, 4.3 INTOSAI Congress & Goal Committees, and 4.4 ASOSAI',
        '4.5 SAI principles, ISAs & NGAS, 4.6 Audit report implementation best practices, 4.7 SAI-PMF, and 4.8 Audit quality management & review',
      ],
      chapters: [
        {
          id: 'SO-P4AUD-B03-CH04',
          chapterNumber: 4,
          code: 'Chapter 4',
          chapterName: 'International Practices and Standards of Auditing',
          nepaliChapterName:
            '४. लेखापरीक्षणका अन्तर्राष्ट्रिय अभ्यास तथा मानहरू',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Aligns Nepal’s public audit methodologies with global Supreme Audit Institution frameworks and quality-control benchmarks.',
          topics: [
            {
              id: 'SO-P4AUD-B03-CH04-T01',
              topicNumber: 1,
              code: '4.1',
              topic: 'Structure and role of Supreme Audit Institutions (SAIs)',
              nepaliTopic: 'सर्वोच्च लेखापरीक्षण संस्थाहरूको संरचना र भूमिका',
              brief:
                'Compares Westminster (Auditor General monocratic model, as in Nepal), Judicial/Court of Accounts (Napoleonic), and Collegiate/Board SAI models.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T02',
              topicNumber: 2,
              code: '4.2',
              topic: 'INTOSAI and Office of the Auditor General of Nepal',
              nepaliTopic: 'इन्टोसाई (INTOSAI) र नेपालको महालेखापरीक्षकको कार्यालय',
              brief:
                'Examines INTOSAI’s motto ("Experientia Mutua Omnibus Prodest"), Lima Declaration (ISSAI-P 1) and Mexico Declaration on SAI Independence (ISSAI-P 10), and OAG Nepal’s active participation.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T03',
              topicNumber: 3,
              code: '4.3',
              topic: 'INTOSAI Congress (INCOSAI) and Goal Committees',
              nepaliTopic: 'इन्टोसाई महाधिवेशन र लक्ष्य समितिहरू',
              brief:
                'Covers triennial INCOSAI governance and the four strategic Goal Committees: Professional Standards (PSC), Capacity Building (CBC), Knowledge Sharing (KSC), and Policy, Finance & Administration (PFAC).',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T04',
              topicNumber: 4,
              code: '4.4',
              topic:
                'Asian Organization of Supreme Audit Institutions (ASOSAI)',
              nepaliTopic:
                'एसियाली सर्वोच्च लेखापरीक्षण संस्थाहरूको संगठन (ASOSAI)',
              brief:
                'Examines regional cooperative audits, Bangkok/Hanoi declarations, capacity development workshops, and peer-learning programs among Asian SAIs.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T05',
              topicNumber: 5,
              code: '4.5',
              topic:
                'Foundational SAI principles, International Standards on Auditing (ISAs) and Nepal Government Auditing Standards (NGAS)',
              nepaliTopic:
                'सर्वोच्च लेखापरीक्षणका आधारभूत सिद्धान्त, अन्तर्राष्ट्रिय लेखापरीक्षण मान र नेपाल सरकारी लेखापरीक्षण मान',
              brief:
                'Maps the IFPP/ISSAI framework and IAASB ISAs onto Nepal Government Auditing Standards governing auditor ethics, skepticism, materiality, documentation, and opinion formulation.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T06',
              topicNumber: 6,
              code: '4.6',
              topic: 'International best practices in audit report implementation',
              nepaliTopic:
                'लेखापरीक्षण प्रतिवेदन कार्यान्वयनका अन्तर्राष्ट्रिय असल अभ्यासहरू',
              brief:
                'Studies digital recommendation tracking, legislative Public Accounts Committee hearings, executive action-taken reports, and citizen-accessible audit summaries.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T07',
              topicNumber: 7,
              code: '4.7',
              topic: 'SAI Performance Measurement Framework (SAI-PMF)',
              nepaliTopic: 'सर्वोच्च लेखापरीक्षण संस्था कार्यसम्पादन मापन प्रारूप (SAI-PMF)',
              brief:
                'Evaluates SAI institutional maturity across six domains: independence/legal framework, internal governance/ethics, audit quality & reporting, financial management, human resources, and communication/stakeholder management.',
            },
            {
              id: 'SO-P4AUD-B03-CH04-T08',
              topicNumber: 8,
              code: '4.8',
              topic: 'Audit quality management, quality control and quality review',
              nepaliTopic:
                'लेखापरीक्षण गुणस्तर व्यवस्थापन, गुणस्तर नियन्त्रण र गुणस्तर पुनरावलोकन',
              brief:
                'Distinguishes hot engagement-level supervision/quality control from independent cold post-audit Quality Assurance Reviews (ISSAI 140) and international peer reviews.',
            },
          ],
        },
      ],
      keyReferences:
        'INTOSAI IFPP / ISSAI Framework · NGAS · OAG Nepal Annual Reports',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-p4-aud-u4',
      branchNumber: 4,
      unitCode: 'Section D · Chapters 5–6',
      title:
        'Auditor General External Relations (10M) and Modern Concepts & IT in Auditing (10M)',
      nepaliTitle:
        'खण्ड (घ) बाह्य निकायसँग महालेखापरीक्षकको सम्बन्ध (१०) र लेखापरीक्षणमा नवीनतम अवधारणा तथा सूचना प्रविधि (१०) — २० अङ्क',
      marksWeight: 20,
      branchSummary:
        'Covers OAG synergy with PAC, regulators, and anti-corruption bodies (10M) plus citizen participatory audit, environmental/risk/IT audit, PFM portals (NAMS, SuTRA, CGAS, TSA, PAMS, RMIS), and CAATs/AI analytics (10M).',
      subtopics: [
        'Chapter 5 (10M): Public Accounts Committee (PAC), three-tier Beruju settlement, GoN/donors/beneficiaries, NRB/NIA/SEBON/ICAN/ASB/AuSB, and CIAA/NNRFC/DMLI',
        'Chapter 6 (10M): Citizen participation, Environmental/Risk/IT Audit, NAMS/LMBIS/SuTRA/CGAS/TSA/PAMS/RMIS, and CAATs/AI/Big Data/IDEA/ACL',
      ],
      chapters: [
        {
          id: 'SO-P4AUD-B04-CH05',
          chapterNumber: 5,
          code: 'Chapter 5',
          chapterName: 'Relationship of the Auditor General with External Bodies',
          nepaliChapterName: '५. बाह्य निकायहरूसँग महालेखापरीक्षकको सम्बन्ध',
          marksAllocation: '1 Question × 10 Marks = 10 Marks',
          chapterBrief:
            'Examines institutional oversight linkages between OAG, legislative committees, financial regulators, and investigative agencies.',
          topics: [
            {
              id: 'SO-P4AUD-B04-CH05-T01',
              topicNumber: 1,
              code: '5.1',
              topic:
                'Public Accounts Committee (PAC) and deliberations on audit reports',
              nepaliTopic:
                'सार्वजनिक लेखा समिति र महालेखापरीक्षकको प्रतिवेदनमाथिको छलफल',
              brief:
                'Analyzes the symbiotic accountability partnership where OAG provides technical audit findings and PAC summons Accounting Officers to enforce corrective directives.',
            },
            {
              id: 'SO-P4AUD-B04-CH05-T02',
              topicNumber: 2,
              code: '5.2',
              topic:
                'Settlement of irregularities across Federal, Provincial and Local levels and corporate bodies',
              nepaliTopic:
                'संघ, प्रदेश र स्थानीय तह तथा संगठित संस्थाको बेरुजु फर्छ्यौट प्रक्रिया',
              brief:
                'Compares institutional mechanisms for Beruju clearance (Samparikshan) across federal ministries, Provincial Public Accounts Committees, Local Assemblies, and SOE boards.',
            },
            {
              id: 'SO-P4AUD-B04-CH05-T03',
              topicNumber: 3,
              code: '5.3',
              topic:
                'Collaboration with Government of Nepal, development partners and beneficiary groups',
              nepaliTopic:
                'नेपाल सरकार, विकास साझेदार र लाभग्राही समूहसँगको सहकार्य',
              brief:
                'Covers joint PFM reform dialogue, fiduciary assurance for donor-funded programs, and civil society/beneficiary engagement without compromising audit independence.',
            },
            {
              id: 'SO-P4AUD-B04-CH05-T04',
              topicNumber: 4,
              code: '5.4',
              topic:
                'Coordination with regulatory and standard-setting bodies: NRB, NIA, SEBON, ICAN, ASB and AuSB',
              nepaliTopic:
                'नियामक तथा मान निर्धारक निकायहरूसँग समन्वय (नेपाल राष्ट्र बैंक, बीमा प्राधिकरण, धितोपत्र बोर्ड, ICAN, लेखामान बोर्ड र लेखापरीक्षण मान बोर्ड)',
              brief:
                'Examines regulatory alignment, panel-auditor appointment oversight, and convergence of public/corporate accounting and auditing standards.',
            },
            {
              id: 'SO-P4AUD-B04-CH05-T05',
              topicNumber: 5,
              code: '5.5',
              topic: 'Interrelationship with CIAA, NNRFC and DMLI',
              nepaliTopic:
                'अख्तियार दुरुपयोग अनुसन्धान आयोग, राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोग र सम्पत्ति शुद्धीकरण अनुसन्धान विभागसँगको अन्तरसम्बन्ध',
              brief:
                'Analyzes information sharing on suspected corruption/fraud with CIAA, fiscal performance indicators used by NNRFC for grant formulas, and suspicious financial flows relevant to DMLI.',
            },
          ],
        },
        {
          id: 'SO-P4AUD-B04-CH06',
          chapterNumber: 6,
          code: 'Chapter 6',
          chapterName:
            'Modern Concepts and Information Technology in Auditing',
          nepaliChapterName:
            '६. लेखापरीक्षणमा नवीनतम अवधारणा तथा सूचना प्रविधि',
          marksAllocation: '1 Question × 10 Marks = 10 Marks',
          chapterBrief:
            'Covers specialized contemporary audits, Nepal’s digital PFM suite, and data-driven audit analytics.',
          topics: [
            {
              id: 'SO-P4AUD-B04-CH06-T01',
              topicNumber: 1,
              code: '6.1',
              topic: 'Citizen and stakeholder participation in auditing',
              nepaliTopic: 'लेखापरीक्षणमा नागरिक तथा सरोकारवालाको सहभागिता',
              brief:
                'Examines Citizen Participatory Audit (CPA) practices integrating civil society inputs in audit topic selection, field verification of local service delivery, and report dissemination.',
            },
            {
              id: 'SO-P4AUD-B04-CH06-T02',
              topicNumber: 2,
              code: '6.2',
              topic: 'Environmental Audit',
              nepaliTopic: 'वातावरणीय लेखापरीक्षण',
              brief:
                'Evaluates compliance with EIA/IEE commitments, biodiversity/forest conservation, pollution control, and climate adaptation expenditure.',
            },
            {
              id: 'SO-P4AUD-B04-CH06-T03',
              topicNumber: 3,
              code: '6.3',
              topic: 'Risk-Based Audit',
              nepaliTopic: 'जोखिममा आधारित लेखापरीक्षण',
              brief:
                'Focuses scarce audit resources on high inherent, control, and detection risk areas using entity risk matrices rather than uniform 100% voucher checking.',
            },
            {
              id: 'SO-P4AUD-B04-CH06-T04',
              topicNumber: 4,
              code: '6.4',
              topic: 'Information Technology (IT) Audit',
              nepaliTopic: 'सूचना प्रविधि (IT) लेखापरीक्षण',
              brief:
                'Audits general IT controls, application controls, database integrity, cybersecurity resilience, disaster recovery, and e-governance software procurement.',
            },
            {
              id: 'SO-P4AUD-B04-CH06-T05',
              topicNumber: 5,
              code: '6.5',
              topic:
                'Nepal Audit Management System (NAMS) and PFM portals: LMBIS, PLMBIS, SuTRA, CGAS, TSA, PAMS and RMIS',
              nepaliTopic:
                'नेपाल लेखापरीक्षण व्यवस्थापन प्रणाली (NAMS) तथा सार्वजनिक वित्तीय व्यवस्थापन प्रणालीहरू (LMBIS, PLMBIS, SuTRA, CGAS, TSA, PAMS, RMIS)',
              brief:
                'Covers end-to-end paperless remote/hybrid auditing via OAG’s NAMS integrated directly with federal, provincial, and local digital budget, accounting, asset, and revenue systems.',
            },
            {
              id: 'SO-P4AUD-B04-CH06-T06',
              topicNumber: 6,
              code: '6.6',
              topic:
                'Computer-Assisted Audit Techniques (CAATs), Artificial Intelligence, Big Data, Data Analytics, IDEA and ACL',
              nepaliTopic:
                'कम्प्युटरमा आधारित लेखापरीक्षण प्रविधि (CAATs), कृत्रिम बौद्धिकता (AI), बिग डाटा, डाटा एनालिटिक्स, IDEA र ACL',
              brief:
                'Examines full-population anomaly detection, duplicate payment screening, Benford’s Law testing, and predictive fraud analytics using specialized audit software (IDEA, ACL) and AI tools.',
            },
          ],
        },
      ],
      keyReferences:
        'Audit Act, 2075 · OAG NAMS & IT/Performance Audit Manuals',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
  ],
};

export const SECTION_OFFICER_FOREIGN_EXTRA_1: PscSyllabusPaper = {
  id: 'so-paper-foreign-1',
  code: 'Extra Paper I (Foreign)',
  title: 'English Language (Nepal Foreign Affairs Service)',
  nepaliTitle: 'अतिरिक्त प्रथम पत्र · अंग्रेजी भाषा (नेपाल परराष्ट्र सेवा)',
  serviceStreamId: 'so-stream-foreign',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    'Section A: Essay (20M) · Section B: Translation EN↔NE (30M) · Section C: Comprehension & Précis (30M) · Section D: Diplomatic Correspondence (20M)',
  scoringRule:
    'Medium: Strictly English (except Nepali translation) · Minimum 40 marks required · Counted in 470-mark Foreign Service Merit',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-pf1-u1',
      branchNumber: 1,
      unitCode: 'Sections A & B · 50M',
      title:
        'Analytical Essay Composition (20M) and Bilateral Translation EN↔NE (30M)',
      nepaliTitle:
        'खण्ड (क) निबन्ध लेखन (२० अङ्क) र खण्ड (ख) अनुवाद अंग्रेजी↔नेपाली (३० अङ्क)',
      marksWeight: 50,
      branchSummary:
        'Tests advanced English analytical prose (800–1,000 words) and high-precision diplomatic/legal translation between English and Nepali.',
      subtopics: [
        'Section A — 1. Essay Composition (800–1,000 words = 20 Marks) on international relations, diplomacy, economy, governance, or global affairs',
        'Section B — 2. English to Nepali Translation (15M) and 3. Nepali to English Translation (15M)',
      ],
      chapters: [
        {
          id: 'SO-PF1-B01-CH01',
          chapterNumber: 1,
          code: 'Section A',
          chapterName: 'Essay Composition',
          nepaliChapterName: '१. निबन्ध रचना (८००–१००० शब्द)',
          marksAllocation: '1 Essay × 20 Marks = 20 Marks',
          chapterBrief:
            'Evaluates thesis clarity, argument coherence, diplomatic register, lexical precision, and persuasive synthesis.',
          topics: [
            {
              id: 'SO-PF1-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic: 'Analytical Essay Composition (800–1,000 words)',
              nepaliTopic: 'विश्लेषणात्मक अंग्रेजी निबन्ध लेखन',
              brief:
                'Requires writing one well-structured 800–1,000-word essay from given choices on contemporary geopolitics, multilateralism, climate diplomacy, economic integration, or global governance.',
            },
          ],
        },
        {
          id: 'SO-PF1-B01-CH02',
          chapterNumber: 2,
          code: 'Section B',
          chapterName: 'Bilateral Translation (English ↔ Nepali)',
          nepaliChapterName: '२–३. अनुवाद (अंग्रेजीबाट नेपाली र नेपालीबाट अंग्रेजी)',
          marksAllocation: '15 Marks + 15 Marks = 30 Marks',
          chapterBrief:
            'Assesses semantic fidelity, terminological accuracy, and natural formal syntax across both official working languages of MoFA.',
          topics: [
            {
              id: 'SO-PF1-B01-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Translation from English into Nepali (15 Marks)',
              nepaliTopic: 'अंग्रेजी गद्यांशको नेपालीमा अनुवाद (१५ अङ्क)',
              brief:
                'Translating a formal diplomatic, treaty, economic, or policy passage from English into idiomatic, standard administrative Nepali without distortion or omission.',
            },
            {
              id: 'SO-PF1-B01-CH02-T02',
              topicNumber: 2,
              code: '3.1',
              topic: 'Translation from Nepali into English (15 Marks)',
              nepaliTopic: 'नेपाली गद्यांशको अंग्रेजीमा अनुवाद (१५ अङ्क)',
              brief:
                'Rendering an official Nepali policy, constitutional, or diplomatic text into crisp, grammatically exact international English.',
            },
          ],
        },
      ],
      keyReferences:
        'Official Section Officer Phase II PDF (Foreign Affairs Extra Paper I) · Diplomatic Style Manuals',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      quizHref: '/quiz/custom?subject=English',
      quizLabel: 'English Competence MCQs',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-pf1-u2',
      branchNumber: 2,
      unitCode: 'Sections C & D · 50M',
      title:
        'Reading Comprehension & Précis Writing (30M) and Diplomatic Correspondence (20M)',
      nepaliTitle:
        'खण्ड (ग) बोध र संक्षेपीकरण (३० अङ्क) र खण्ड (घ) कूटनीतिक पत्राचार (२० अङ्क)',
      marksWeight: 50,
      branchSummary:
        'Evaluates unseen critical comprehension, one-third précis condensation, and formal drafting of diplomatic notes, joint communiqués, and press statements.',
      subtopics: [
        'Section C — 4. Reading Comprehension (5 Qs × 3M = 15M) and 5. Précis Writing in one-third length (15M)',
        'Section D — 6. Diplomatic Correspondence (2 × 10M = 20M): First person note, Third person note (Note Verbale), Joint communiqué & Press statement',
      ],
      chapters: [
        {
          id: 'SO-PF1-B02-CH03',
          chapterNumber: 3,
          code: 'Section C',
          chapterName: 'Comprehension and Précis Writing',
          nepaliChapterName: '४–५. गद्यांश बोध र संक्षेपीकरण',
          marksAllocation: '15 Marks + 15 Marks = 30 Marks',
          chapterBrief:
            'Tests rapid extraction of diplomatic nuance and concise executive briefing skills.',
          topics: [
            {
              id: 'SO-PF1-B02-CH03-T01',
              topicNumber: 1,
              code: '4.1',
              topic: 'Unseen Prose Comprehension (5 Questions × 3 Marks)',
              nepaliTopic: 'अदृष्ट अंग्रेजी गद्यांश बोध',
              brief:
                'Answering five analytical comprehension questions in one’s own words rather than verbatim lifting from complex international affairs prose.',
            },
            {
              id: 'SO-PF1-B02-CH03-T02',
              topicNumber: 2,
              code: '5.1',
              topic: 'Précis Writing in One-Third Length (15 Marks)',
              nepaliTopic: 'एक तिहाइ शब्दमा संक्षेपीकरण (प्रिसी लेखन)',
              brief:
                'Condensing a lengthy passage to strictly one-third of its original word count in indirect third-person prose with an apt title while preserving core logic.',
            },
          ],
        },
        {
          id: 'SO-PF1-B02-CH04',
          chapterNumber: 4,
          code: 'Section D',
          chapterName: 'Diplomatic Correspondence Drafting',
          nepaliChapterName: '६. कूटनीतिक पत्राचार लेखन',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Tests mastery of Vienna protocol formulas, diplomatic courtesy clauses, and public diplomatic messaging.',
          topics: [
            {
              id: 'SO-PF1-B02-CH04-T01',
              topicNumber: 1,
              code: '6.1',
              topic:
                'First Person Note, Third Person Note (Note Verbale), Joint Communiqué and Press Statement',
              nepaliTopic:
                'प्रथम पुरुष कूटनीतिक नोट, तृतीय पुरुष नोट (नोट भर्बाल), संयुक्त वक्तव्य र प्रेस विज्ञप्ति',
              brief:
                'Covers exact structural conventions, complimentary opening and assurance-of-highest-consideration closing formulas of First Person Diplomatic Notes and unsigned, initialed/stamped Third Person Notes Verbales, alongside bilateral Joint Communiqués and official MoFA Press Statements.',
            },
          ],
        },
      ],
      keyReferences:
        'Satow’s Diplomatic Practice · Official SO Phase II PDF (pp. 24–25)',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
  ],
};

export const SECTION_OFFICER_FOREIGN_EXTRA_2: PscSyllabusPaper = {
  id: 'so-paper-foreign-2',
  code: 'Extra Paper II (Foreign)',
  title: 'Foreign Policy and International Relations (Foreign Service)',
  nepaliTitle:
    'अतिरिक्त द्वितीय पत्र · परराष्ट्र नीति तथा अन्तर्राष्ट्रिय सम्बन्ध (नेपाल परराष्ट्र सेवा)',
  serviceStreamId: 'so-stream-foreign',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    '10 Questions × 10 Marks = 100 Marks across Sections A (20M), B (30M), C (20M) & D (30M)',
  scoringRule:
    'Medium: Nepali or English · Minimum 40 marks required · Counted in 470-mark Foreign Service Merit',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-pf2-u1',
      branchNumber: 1,
      unitCode: 'Section A · Chapters 1–2',
      title:
        'Nepal’s Foreign Policy and Strategic & Political Relations (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (क) नेपालको परराष्ट्र नीति र रणनीतिक तथा राजनीतिक सम्बन्ध (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Examines determinants and constitutional principles of Nepal’s foreign policy, human rights/climate/counter-terrorism/refugee diplomacy, and strategic relations with SAARC neighbors, major powers, EU, and development partners.',
      subtopics: [
        'Chapter 1: Evolution, determinants & principles of Nepal’s Foreign Policy, democratization, human rights, climate change, counter-terrorism, globalization & refugees',
        'Chapter 2: Strategic & political relations with SAARC countries, major powers, EU & major development partners',
      ],
      chapters: [
        {
          id: 'SO-PF2-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Nepal’s Foreign Policy',
          nepaliChapterName: '१. नेपालको परराष्ट्र नीति',
          marksAllocation: 'Section A (Combined 20 Marks)',
          chapterBrief:
            'Covers historical evolution, Article 51(m) constitutional directives, Foreign Policy 2077, and global thematic engagements.',
          topics: [
            {
              id: 'SO-PF2-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1–1.3',
              topic:
                'Evolution, determinants and guiding principles of Nepal’s foreign policy',
              nepaliTopic:
                'नेपालको परराष्ट्र नीतिको विकासक्रम, निर्धारक तत्वहरू र निर्देशक सिद्धान्तहरू',
              brief:
                'Traces foreign policy from Prithvi Narayan Shah’s Divyopadesh ("yam between two boulders") to Foreign Policy 2077—guided by Article 51(m), UN Charter, Panchsheel, Non-Alignment, international law, and world peace.',
            },
            {
              id: 'SO-PF2-B01-CH01-T02',
              topicNumber: 2,
              code: '1.4–1.6',
              topic:
                'Democratization of foreign policy, international human rights obligations and climate change diplomacy',
              nepaliTopic:
                'परराष्ट्र नीतिको लोकतान्त्रिकीकरण, अन्तर्राष्ट्रिय मानव अधिकार दायित्व र जलवायु परिवर्तन',
              brief:
                'Analyzes parliamentary/public consensus in foreign policy, UPR and human rights treaty compliance, and Nepal’s mountain climate advocacy (Sagarmatha Sambaad, COP negotiations, Loss & Damage).',
            },
            {
              id: 'SO-PF2-B01-CH01-T03',
              topicNumber: 3,
              code: '1.7–1.9',
              topic:
                'Counter-terrorism instruments, globalization impacts and refugee issues in Nepal',
              nepaliTopic:
                'आतंकवाद विरुद्धका अन्तर्राष्ट्रिय संयन्त्र, विश्वव्यापीकरण र शरणार्थी समस्या',
              brief:
                'Examines UN/SAARC counter-terrorism conventions, FATF standards, globalization’s asymmetric effects on small states, and humanitarian diplomacy regarding Bhutanese and Tibetan refugees.',
            },
          ],
        },
        {
          id: 'SO-PF2-B01-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Strategic and Political Relations',
          nepaliChapterName: '२. रणनीतिक तथा राजनीतिक सम्बन्ध',
          marksAllocation: 'Section A (Combined 20 Marks)',
          chapterBrief:
            'Assesses bilateral neighborhood policy and balanced engagement with global powers.',
          topics: [
            {
              id: 'SO-PF2-B01-CH02-T01',
              topicNumber: 1,
              code: '2.1–2.3',
              topic:
                'Relations with SAARC countries (especially India and China), major powers (USA, UK, Russia, Japan), European Union and development partners',
              nepaliTopic:
                'सार्क राष्ट्रहरू, प्रमुख शक्ति राष्ट्रहरू, युरोपेली संघ र विकास साझेदारहरूसँगको सम्बन्ध',
              brief:
                'Analyzes sovereign equality, connectivity, border management, trade/transit, and balanced non-aligned strategic autonomy vis-à-vis immediate neighbors and major global powers.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution Art. 51(m) · Nepal’s Foreign Policy, 2077 · MoFA Annual Reports',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      writtenHref: '/written/PSC-WR-304',
      writtenLabel: 'Economic Diplomacy 5M Q&A',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-pf2-u2',
      branchNumber: 2,
      unitCode: 'Section B · Chapters 3–5',
      title:
        'UN & Multilateral Institutions, NAM/LDCs/LLDCs & Regional Organizations (3 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (ख) संयुक्त राष्ट्रसंघ, असंलग्न आन्दोलन/अतिकम विकसित राष्ट्र र क्षेत्रीय संगठनहरू (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers UN reform, disarmament, UN peacekeeping, Bretton Woods/WTO/ADB, NAM, LDC/LLDC/G77 advocacy, UNCLOS transit rights, and EU/ASEAN/SAARC/BIMSTEC/SCO.',
      subtopics: [
        'Chapter 3: UN structure & reform, Nepal in UN, Disarmament, UNPKO, World Bank, IMF, WTO & ADB',
        'Chapter 4: NAM principles & Nepal, LDCs/LLDCs/G77, South-South cooperation & transit rights of landlocked states',
        'Chapter 5: Regionalism, EU, ASEAN, SAARC, BIMSTEC & SCO, and Nepal’s role in SAARC & BIMSTEC',
      ],
      chapters: [
        {
          id: 'SO-PF2-B02-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Nepal and International Organizations',
          nepaliChapterName: '३. नेपाल र अन्तर्राष्ट्रिय संघसंस्थाहरू',
          marksAllocation: 'Section B (Combined 30 Marks)',
          chapterBrief:
            'Examines multilateral diplomacy at the UN and international financial/trade institutions.',
          topics: [
            {
              id: 'SO-PF2-B02-CH03-T01',
              topicNumber: 1,
              code: '3.1–3.4',
              topic:
                'UN structure & reform, Nepal’s role in the UN, disarmament & non-proliferation, and UN Peacekeeping Operations (UNPKO)',
              nepaliTopic:
                'संयुक्त राष्ट्रसंघको संरचना र सुधार, राष्ट्रसंघमा नेपालको भूमिका, निशस्त्रीकरण र शान्ति सेना परिचालन',
              brief:
                'Analyzes UNSC reform debates, Nepal’s multilateral diplomacy since 1955, NPT/CTBT/TPNW disarmament regimes, and Nepal’s distinction as a top troop- and police-contributing country to UN Peacekeeping.',
            },
            {
              id: 'SO-PF2-B02-CH03-T02',
              topicNumber: 2,
              code: '3.5–3.8',
              topic:
                'Bretton Woods Institutions (World Bank & IMF), World Trade Organization (WTO) and Asian Development Bank (ADB)',
              nepaliTopic:
                'विश्व बैंक, अन्तर्राष्ट्रिय मुद्रा कोष, विश्व व्यापार संगठन (WTO) र एसियाली विकास बैंक (ADB)',
              brief:
                'Evaluates concessional development financing, balance-of-payments support, Nepal’s 2004 WTO accession commitments, preference erosion post-LDC graduation, and regional infrastructure lending.',
            },
          ],
        },
        {
          id: 'SO-PF2-B02-CH04',
          chapterNumber: 4,
          code: 'Chapter 4',
          chapterName: 'Non-Aligned Movement, LDCs and Landlocked States',
          nepaliChapterName:
            '४. असंलग्न आन्दोलन (NAM), अतिकम विकसित तथा भूपरिवेष्ठित राष्ट्रहरू',
          marksAllocation: 'Section B (Combined 30 Marks)',
          chapterBrief:
            'Covers Global South solidarity, LDC graduation, and international law of transit.',
          topics: [
            {
              id: 'SO-PF2-B02-CH04-T01',
              topicNumber: 1,
              code: '4.1–4.5',
              topic:
                'NAM relevance, LDCs/LLDCs/G-77 advocacy, South-South cooperation and transit rights of landlocked countries',
              nepaliTopic:
                'असंलग्न आन्दोलनको सान्दर्भिकता, LDC/LLDC/G-77, दक्षिण–दक्षिण सहयोग र भूपरिवेष्ठित राष्ट्रको पारवहन अधिकार',
              brief:
                'Examines Bandung/Belgrade NAM legacy in a multipolar era, Doha/Awaza Programmes of Action for LDCs and LLDCs, and unrestricted freedom of transit to and from the sea under Part X of UNCLOS (1982).',
            },
          ],
        },
        {
          id: 'SO-PF2-B02-CH05',
          chapterNumber: 5,
          code: 'Chapter 5',
          chapterName: 'Regional Organizations',
          nepaliChapterName: '५. क्षेत्रीय संगठनहरू',
          marksAllocation: 'Section B (Combined 30 Marks)',
          chapterBrief:
            'Compares European, Southeast Asian, South Asian, Bay of Bengal, and Eurasian regional architectures.',
          topics: [
            {
              id: 'SO-PF2-B02-CH05-T01',
              topicNumber: 1,
              code: '5.1–5.4',
              topic:
                'Regionalism theories, EU, ASEAN, SAARC, BIMSTEC, SCO, and Nepal’s role as SAARC Chair/Host and BIMSTEC member',
              nepaliTopic:
                'क्षेत्रीयतावाद तथा EU, ASEAN, SAARC, BIMSTEC र SCO मा नेपालको भूमिका',
              brief:
                'Evaluates comparative regional integration models, SAARC revitalization challenges, BIMSTEC energy-grid and transport connectivity between South and Southeast Asia, and Nepal’s Dialogue Partner engagement in SCO.',
            },
          ],
        },
      ],
      keyReferences:
        'UN Charter · UNCLOS 1982 (Part X) · SAARC & BIMSTEC Charters',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-pf2-u3',
      branchNumber: 3,
      unitCode: 'Section C · Chapters 6–7',
      title:
        'Economic Diplomacy and Ministry of Foreign Affairs & Missions (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (ग) आर्थिक कूटनीति तथा परराष्ट्र मन्त्रालय र कूटनीतिक नियोगहरू (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers the seven pillars of Nepal’s economic diplomacy alongside MoFA structure, Foreign Service professionalism, diplomatic missions abroad, and the 1961/1963 Vienna Conventions.',
      subtopics: [
        'Chapter 6: Economic diplomacy — foreign aid, trade deficit, foreign employment/remittance, tourism, hydropower, FDI & Non-Resident Nepalis (NRNs)',
        'Chapter 7: MoFA role, Nepal Foreign Service, Diplomatic Missions abroad, and Vienna Conventions on Diplomatic (1961) & Consular Relations (1963)',
      ],
      chapters: [
        {
          id: 'SO-PF2-B03-CH06',
          chapterNumber: 6,
          code: 'Chapter 6',
          chapterName: 'Economic Diplomacy',
          nepaliChapterName: '६. आर्थिक कूटनीति',
          marksAllocation: 'Section C (Combined 20 Marks)',
          chapterBrief:
            'Operationalizes country-specific economic diplomacy targets for Nepalese embassies and consulates.',
          topics: [
            {
              id: 'SO-PF2-B03-CH06-T01',
              topicNumber: 1,
              code: '6.1–6.7',
              topic:
                'Development cooperation, export trade promotion, safe foreign employment & remittances, tourism, hydropower trade, FDI attraction and NRN mobilization',
              nepaliTopic:
                'वैदेशिक सहायता, व्यापार घाटा न्यूनीकरण, वैदेशिक रोजगारी, पर्यटन, जलविद्युत, प्रत्यक्ष वैदेशिक लगानी र गैरआवासीय नेपाली परिचालन',
              brief:
                'Analyzes High-Level Economic Diplomacy Monitoring mechanisms, cross-border power trade agreements, consular protection of migrant workers, and harnessing NRN capital, skills, and diaspora networks.',
            },
          ],
        },
        {
          id: 'SO-PF2-B03-CH07',
          chapterNumber: 7,
          code: 'Chapter 7',
          chapterName: 'MoFA, Missions and Vienna Conventions',
          nepaliChapterName:
            '७. परराष्ट्र मन्त्रालय, कूटनीतिक नियोग र भियना महासन्धिहरू',
          marksAllocation: 'Section C (Combined 20 Marks)',
          chapterBrief:
            'Covers institutional diplomacy, mission management, and codified diplomatic/consular immunities.',
          topics: [
            {
              id: 'SO-PF2-B03-CH07-T01',
              topicNumber: 1,
              code: '7.1–7.6',
              topic:
                'Role of MoFA, Nepal Foreign Service, functions & challenges of Nepalese Missions, and Vienna Conventions on Diplomatic Relations (1961) & Consular Relations (1963)',
              nepaliTopic:
                'परराष्ट्र मन्त्रालयको भूमिका, परराष्ट्र सेवा, कूटनीतिक नियोगका कार्य र चुनौती तथा सन् १९६१ र १९६३ का भियना महासन्धिहरू',
              brief:
                'Examines MoFA’s coordinating mandate, ambassadorial appointment criteria, representation/negotiation/reporting/protection duties under VCDR 1961 (inviolability of premises/archives/diplomatic bag, persona non grata) and consular assistance under VCCR 1963.',
            },
          ],
        },
      ],
      keyReferences:
        'Vienna Conventions (1961 & 1963) · MoFA Country-Specific Economic Diplomacy Guidelines',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
    {
      id: 'so-pf2-u4',
      branchNumber: 4,
      unitCode: 'Section D · Chapters 8–10',
      title:
        'Bilateral Treaties, Modern Diplomacy & IR Theories and International Law (3 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (घ) द्विपक्षीय सन्धिहरू, कूटनीतिका आयाम, अन्तर्राष्ट्रिय सम्बन्धका सिद्धान्त र अन्तर्राष्ट्रिय कानून (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers landmark Nepal-India and Nepal-China treaties, multi-track/public/digital diplomacy and negotiation skills, IR theories, and public international law & treaty-making.',
      subtopics: [
        'Chapter 8: 1950 Nepal-India Peace & Friendship Treaty, 1953 Extradition Treaty, 1960 Trade & Transit Treaty, and 1960 Nepal-China Peace & Friendship Treaty',
        'Chapter 9: Evolution & changing nature of diplomacy, Track I/II/public/cultural/virtual/preventive diplomacy, diplomatic terminologies & negotiation skills',
        'Chapter 10: IR Theories (Realism, Liberalism, Constructivism, etc.) & International Law (principles, recognition of states/governments, treaty making & Full Powers)',
      ],
      chapters: [
        {
          id: 'SO-PF2-B04-CH08',
          chapterNumber: 8,
          code: 'Chapter 8',
          chapterName: 'Major Bilateral Treaties of Nepal',
          nepaliChapterName: '८. प्रमुख द्विपक्षीय सन्धि–सम्झौताहरू',
          marksAllocation: 'Section D (Combined 30 Marks)',
          chapterBrief:
            'Critically examines foundational bilateral treaties shaping Nepal’s political, security, and transit relations.',
          topics: [
            {
              id: 'SO-PF2-B04-CH08-T01',
              topicNumber: 1,
              code: '8.1–8.4',
              topic:
                '1950 Nepal-India Treaty of Peace and Friendship, 1953 Extradition Treaty, 1960 Trade & Transit framework (and renewals), and 1960 Nepal-China Treaty of Peace and Friendship',
              nepaliTopic:
                'सन् १९५० को नेपाल–भारत शान्ति तथा मैत्री सन्धि, १९५३ को सुपुर्दगी सन्धि, व्यापार तथा पारवहन सन्धि र १९६० को नेपाल–चीन शान्ति तथा मैत्री सन्धि',
              brief:
                'Analyzes key articles, reciprocity questions, EPG discourse, evolution of separate Trade and Transit treaties with India and Transit & Transport Agreement with China, and peaceful coexistence under the 1960 Sino-Nepalese treaty.',
            },
          ],
        },
        {
          id: 'SO-PF2-B04-CH09',
          chapterNumber: 9,
          code: 'Chapter 9',
          chapterName: 'Diplomacy and Negotiation',
          nepaliChapterName: '९. कूटनीति र वार्ता सीप',
          marksAllocation: 'Section D (Combined 30 Marks)',
          chapterBrief:
            'Covers contemporary diplomatic modalities, Latin/French diplomatic lexicon, and multilateral/bilateral negotiation craft.',
          topics: [
            {
              id: 'SO-PF2-B04-CH09-T01',
              topicNumber: 1,
              code: '9.1–9.5',
              topic:
                'Evolution & changing nature of diplomacy, Track I/Track II/Public/Citizen/Cultural/Virtual/Conference/Preventive diplomacy, diplomatic terminologies and negotiation skills',
              nepaliTopic:
                'कूटनीतिको विकासक्रम, प्रकारहरू (ट्र्याक १/२, सार्वजनिक, सांस्कृतिक, भर्चुअल, निवारक), कूटनीतिक शब्दावली र वार्ता सीप',
              brief:
                'Covers soft-power public and digital diplomacy, precision usage of terms (Agrément, Chargé d’affaires, Démarche, Aide-mémoire, Persona non grata, Pacta sunt servanda), and BATNA/principled negotiation strategies.',
            },
          ],
        },
        {
          id: 'SO-PF2-B04-CH10',
          chapterNumber: 10,
          code: 'Chapter 10',
          chapterName:
            'International Relations Theories and International Law',
          nepaliChapterName:
            '१०. अन्तर्राष्ट्रिय सम्बन्धका सिद्धान्त र अन्तर्राष्ट्रिय कानून',
          marksAllocation: 'Section D (Combined 30 Marks)',
          chapterBrief:
            'Synthesizes major theoretical lenses of IR with Vienna Convention on the Law of Treaties (1969) and Nepal Treaty Act, 2047.',
          topics: [
            {
              id: 'SO-PF2-B04-CH10-T01',
              topicNumber: 1,
              code: '10.1',
              topic:
                'Theories of International Relations: Realism, Liberalism, Democratic Peace, Institutionalism, Marxist/Critical theory, Constructivism and Functionalism',
              nepaliTopic:
                'अन्तर्राष्ट्रिय सम्बन्धका प्रमुख सिद्धान्तहरू (यथार्थवाद, उदारवाद, संरचनावाद, संस्थावाद आदि)',
              brief:
                'Compares balance-of-power and security-dilemma explanations (Realism/Neorealism) with complex interdependence and international regimes (Liberal Institutionalism), shared norms/identities (Constructivism), and small-state survival strategies.',
            },
            {
              id: 'SO-PF2-B04-CH10-T02',
              topicNumber: 2,
              code: '10.2',
              topic: 'Public International Law and Treaty Practice',
              nepaliTopic: 'अन्तर्राष्ट्रिय कानून र सन्धि निर्माण प्रक्रिया',
              brief:
                'Covers foundational doctrines of international law, state/government recognition, and constitutional/statutory treaty ratification in Nepal.',
              subtopics: [
                {
                  id: 'SO-PF2-B04-CH10-T02-S01',
                  subtopicNumber: 1,
                  code: '10.2.1',
                  subtopic:
                    'Sources and fundamental principles of International Law',
                  nepaliSubtopic: 'अन्तर्राष्ट्रिय कानूनका स्रोत र आधारभूत सिद्धान्त',
                  brief:
                    'Examines Article 38(1) of the ICJ Statute (treaties, custom, general principles, judicial decisions), jus cogens norms, sovereign equality, and non-intervention.',
                },
                {
                  id: 'SO-PF2-B04-CH10-T02-S02',
                  subtopicNumber: 2,
                  code: '10.2.2',
                  subtopic: 'Recognition of States and Governments (De jure & De facto)',
                  nepaliSubtopic: 'राज्य तथा सरकारको मान्यता (डि जुरे र डि फ्याक्टो)',
                  brief:
                    'Compares constitutive and declaratory theories of statehood (Montevideo Convention criteria) and legal consequences of de facto vs de jure recognition.',
                },
                {
                  id: 'SO-PF2-B04-CH10-T02-S03',
                  subtopicNumber: 3,
                  code: '10.2.3',
                  subtopic:
                    'Treaty-making stages, Full Powers, Reservations and parliamentary ratification (Article 279 & Nepal Treaty Act, 2047)',
                  nepaliSubtopic:
                    'सन्धि निर्माणका चरण, पूर्णाधिकार (Full Powers) र संसदीय अनुमोदन',
                  brief:
                    'Traces negotiation, issuance of Full Powers, adoption, signature, ratification/accession, and Article 279 of the Constitution requiring two-thirds or simple parliamentary majority for vital treaties.',
                },
              ],
            },
          ],
        },
      ],
      keyReferences:
        'VCLT 1969 · Nepal Treaty Act, 2047 · Constitution Art. 279 · Official SO Phase II PDF',
      materialPath:
        '/materials/official-psc/psc-official-section-officer-phase2.pdf',
      materialTitle: 'Official SO Phase II Syllabus PDF',
      simulatePresetId: 'written-paper-4',
    },
  ],
};

export const SECTION_OFFICER_SERVICE_STREAMS: PscServiceStreamGroup[] = [
  {
    id: 'so-stream-admin-parliament',
    shortLabel: 'Admin & Parliament (Paper IV)',
    serviceName:
      'Nepal Administration Service (General Admin, Accounts & Revenue) & Federal Parliament Service',
    nepaliServiceName:
      'नेपाल प्रशासन सेवा (सामान्य प्रशासन, लेखा र राजस्व समूह) तथा संघीय संसद सेवा',
    meritNote:
      'Common Papers II (100M) + III (100M) + Service Paper IV (100M) = 300 Written Marks + 60 Final Stage Marks = 360 Total Merit Marks.',
    papers: [SECTION_OFFICER_PAPER_4_ADMIN],
  },
  {
    id: 'so-stream-audit',
    shortLabel: 'Audit Service (Paper IV)',
    serviceName: 'Nepal Audit Service (Office of the Auditor General)',
    nepaliServiceName: 'नेपाल लेखापरीक्षण सेवा (महालेखापरीक्षकको कार्यालय)',
    meritNote:
      'Common Papers II (100M) + III (100M) + Audit Paper IV (100M) = 300 Written Marks + 60 Final Stage Marks = 360 Total Merit Marks.',
    papers: [SECTION_OFFICER_PAPER_4_AUDIT],
  },
  {
    id: 'so-stream-foreign',
    shortLabel: 'Foreign Affairs (Extra I & II)',
    serviceName: 'Nepal Foreign Affairs Service (MoFA)',
    nepaliServiceName: 'नेपाल परराष्ट्र सेवा (अतिरिक्त प्रथम र द्वितीय पत्र)',
    meritNote:
      'Common Papers II (100M) + III (100M) + Foreign Extra Paper I (100M) + Extra Paper II (100M) = 400 Written Marks + 70 Final Stage Marks (50M Viva) = 470 Total Merit Marks.',
    papers: [SECTION_OFFICER_FOREIGN_EXTRA_1, SECTION_OFFICER_FOREIGN_EXTRA_2],
  },
];

export const SECTION_OFFICER_PHASE_2: PscExamPhase = {
  id: 'so-phase-2',
  phaseNumber: 2,
  title: 'Stage II · Main Written Examination (मूल परीक्षा)',
  nepaliTitle: 'द्वितीय चरण · मुख्य लिखित परीक्षा (विषयगत — ३००/४०० अङ्क)',
  summary:
    'Compulsory 100-mark subjective analytical papers (10 Qs × 10 Marks each; pass mark 40 per paper; 3 Hours each). Papers II and III are common to all non-technical services; Paper IV / Extra Papers vary by target service stream (Admin/Parliament, Audit Service, or Foreign Affairs Service). Separate answer booklets are used for each section.',
  officialPdfPath:
    '/materials/official-psc/psc-official-section-officer-phase2.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
  papers: [
    SECTION_OFFICER_PAPER_2,
    SECTION_OFFICER_PAPER_3,
    SECTION_OFFICER_PAPER_4_ADMIN,
  ],
  serviceStreams: SECTION_OFFICER_SERVICE_STREAMS,
};
