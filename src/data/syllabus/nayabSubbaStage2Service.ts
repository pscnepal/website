import { NAYAB_SUBBA_PAPER_2 } from './nayabSubbaStage1And2Common.ts';
import type {
  PscExamPhase,
  PscServiceStreamGroup,
  PscSyllabusPaper,
} from './types.ts';

export const NAYAB_SUBBA_PAPER_3_ADMIN: PscSyllabusPaper = {
  id: 'ns-paper-3',
  code: 'Paper III',
  title:
    'Service-Group Subject (General Administration & Federal Parliament)',
  nepaliTitle:
    'सेवा–समूह सम्बन्धी विषय (नेपाल प्रशासन सेवा, सामान्य प्रशासन समूह र संघीय संसद सेवा)',
  serviceStreamId: 'ns-stream-general-admin',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    '14 Short Questions × 5 Marks (70M) + 3 Long Questions × 10 Marks (30M) = 100 Marks across Sections A (35M), B (35M) & C (30M)',
  scoringRule:
    'Minimum 40 marks required · Counted directly in 240-mark Final Merit',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p3-u1',
      branchNumber: 1,
      unitCode: 'Section A · 35M',
      title:
        'Office Operations & Organizational Behavior (5×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (क) कार्यालय सञ्चालन र संगठनात्मक व्यवहार (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers all 14 official topics of Chapter 1—spanning Darta/Chalani/correspondence, Tippani/reports, PR, grievance redressal, meeting/seminar/record/progress management, Jinsi Sresta & forms, job descriptions, inspection, work clearance, and organizational status norms.',
      subtopics: [
        '1.1 Darta, Chalani, filing & correspondence, 1.2 Tippani, proposal & report writing, 1.3 Public relations, 1.4 Grievance management, 1.5 Meeting & minuting, 1.6 Seminar/workshop management, and 1.7–1.8 Record & progress management',
        '1.9–1.10 Jinsi Sresta, Maag Faram, Purchase Order, Dakhila Report & Jinsi Khata, 1.11 Job description & delegation, 1.12 Inspection & monitoring, 1.13 Administrative work clearance (Karya Phachhyaut), and 1.14 Organizational norms & status system',
      ],
      chapters: [
        {
          id: 'NS-P3A-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Office Operations and Organizational Behavior',
          nepaliChapterName: '१. कार्यालय सञ्चालन र संगठनात्मक व्यवहार',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Equips Nayab Subba officers to run day-to-day administrative desks, inventory ledgers, official meetings, and citizen grievance counters.',
          topics: [
            {
              id: 'NS-P3A-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic:
                'Registration (Darta), Dispatch (Chalani), Filing and Official Correspondence',
              nepaliTopic: 'दर्ता, चलानी, फाइलिङ र पत्राचार',
              brief:
                'Covers inward/outward mail registration protocols, priority classification (ordinary, urgent, immediate, confidential), subject-wise/numerical/chronological filing, and standard official letter formats.',
            },
            {
              id: 'NS-P3A-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic: 'Tippani, Proposal and Report Writing',
              nepaliTopic: 'टिप्पणी, प्रस्ताव र प्रतिवेदन लेखन',
              brief:
                'Details upward decision memo (Tippani) drafting—summarizing background facts, quoting statutory rules/budget lines, evaluating options, and submitting clear recommendations—alongside Cabinet/project proposals and analytical reports.',
            },
            {
              id: 'NS-P3A-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3–1.4',
              topic:
                'Public Relations (PR) and Service-Seeker Grievance Management',
              nepaliTopic: 'जनसम्पर्क र सेवाग्राहीको गुनासो व्यवस्थापन',
              brief:
                'Covers citizen-friendly desk etiquette, Nodal Grievance Officer duties (Gunaso Sunne Adhikari), complaint boxes, Hello Sarkar, and timely corrective feedback under Good Governance Rules.',
            },
            {
              id: 'NS-P3A-B01-CH01-T04',
              topicNumber: 4,
              code: '1.5–1.6',
              topic:
                'Meeting Management & Minute Writing, and Seminar/Workshop Management',
              nepaliTopic:
                'बैठक व्यवस्थापन र माइन्यूट लेखन तथा गोष्ठी/कार्यशाला व्यवस्थापन',
              brief:
                'Covers pre-meeting agenda/quorum notice, orderly deliberation, accurate recording of attendance and resolutions (Minuting), logistics of workshops, and follow-up action tracking.',
            },
            {
              id: 'NS-P3A-B01-CH01-T05',
              topicNumber: 5,
              code: '1.7–1.8',
              topic:
                'Record Management and Monthly/Annual Progress Report Management',
              nepaliTopic: 'अभिलेख व्यवस्थापन र मासिक/वार्षिक प्रगति व्यवस्थापन',
              brief:
                'Covers record lifecycle (creation, classification, retention schedule, disposal/archiving under Archives Preservation Act), GIOMS digitization, and NPC-format physical/financial progress reporting.',
            },
            {
              id: 'NS-P3A-B01-CH01-T06',
              topicNumber: 6,
              code: '1.9–1.10',
              topic:
                'Store/Inventory Accounting (Jinsi Sresta): Requisition (Maag Faram), Purchase Order, Receipt Report (Dakhila) and Store Ledger (Jinsi Khata)',
              nepaliTopic:
                'जिन्सी स्रेस्ता: माग फाराम, खरिद आदेश, दाखिला रिपोर्ट र जिन्सी खाता',
              brief:
                'Covers AGF store forms (Ma.Le.Pa. 401–408), separation of expendable (Khapne) and capital/non-expendable (Nakhapne) ledgers, PAMS entry, and annual store verification.',
            },
            {
              id: 'NS-P3A-B01-CH01-T07',
              topicNumber: 7,
              code: '1.11–1.12',
              topic:
                'Job Description & Delegation of Authority, and Office Inspection & Monitoring',
              nepaliTopic:
                'कार्यविवरण र अधिकार प्रत्यायोजन तथा कार्यालय निरीक्षण र अनुगमन',
              brief:
                'Examines mandatory individual job descriptions (Karyabibaran) linked to performance evaluation, lawful written delegation without abdicating ultimate responsibility, and periodic supervisory inspection checklists.',
            },
            {
              id: 'NS-P3A-B01-CH01-T08',
              topicNumber: 8,
              code: '1.13–1.14',
              topic:
                'Administrative Work Clearance (Karya Phachhyaut) and Organizational Norms & Status System',
              nepaliTopic:
                'प्रशासकीय कार्य फर्छ्यौट र संगठनात्मक मूल्य–मान्यता तथा मर्यादा प्रणाली',
              brief:
                'Covers statutory decision-making time limits under the Good Governance Act (Sections 14–18), clearing file backlogs, workplace culture, protocol hierarchy, and collaborative organizational behavior.',
            },
          ],
        },
      ],
      keyReferences:
        'Official Nayab Subba Phase II PDF (Pages 5–6) · Good Governance Act, 2064',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      writtenHref: '/written/PSC-WR-401',
      writtenLabel: 'Service Delivery & E-Gov Q&A',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-u2',
      branchNumber: 2,
      unitCode: 'Section B · 35M',
      title: 'Administration & Management (5×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) प्रशासन तथा व्यवस्थापन (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers Public & Development Administration, Civil Service personnel conditions, Organization bases, key Constitutional/Central Agencies (CIAA, PSC, OAG, OPMCM, MoFAGA, Parliament Secretariat), leadership/motivation, coordination, group dynamics, OD, and time management.',
      subtopics: [
        '2.1–2.2 Public Administration & Development Administration, 2.3 Civil employee appointment, Kaaj, transfer, promotion, leave, conduct, retirement & punishment, and 2.4 Organization bases',
        '2.5 CIAA, PSC, OAG, OPMCM, MoFAGA & Federal Parliament Secretariat (2.5.1–2.5.6)',
        '2.6 Management functions, 2.7 Leadership/decision/motivation/morale, 2.8 Control & coordination, 2.9 Group dynamics, 2.10 Organizational change & development, and 2.11 Time management',
      ],
      chapters: [
        {
          id: 'NS-P3A-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Administration and Management',
          nepaliChapterName: '२. प्रशासन तथा व्यवस्थापन',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Synthesizes public administration theory, civil service HR provisions, central oversight institutions, and supervisory management skills.',
          topics: [
            {
              id: 'NS-P3A-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1–2.2',
              topic:
                'Public Administration (concept, objectives & functions) and Development Administration',
              nepaliTopic: 'सार्वजनिक प्रशासन र विकास प्रशासन',
              brief:
                'Compares regulatory law-and-order administration with change-oriented, participatory, socio-economic Development Administration.',
            },
            {
              id: 'NS-P3A-B02-CH02-T02',
              topicNumber: 2,
              code: '2.3',
              topic:
                'Civil Service Personnel Conditions: appointment, deputation (Kaaj), transfer, promotion, leave, code of conduct, retirement and departmental punishment',
              nepaliTopic:
                'निजामती कर्मचारीको नियुक्ति, काज, सरुवा, बढुवा, बिदा, आचरण, अवकाश र विभागीय सजाय',
              brief:
                'Detailed statutory study under the Civil Service Act, 2049 and Rules, 2050—probation, Kaaj limits, geographical transfer cycles, promotion marks, 9 types of leave, conduct rules, 58-year/tenure retirement, and ordinary vs special disqualification penalties.',
            },
            {
              id: 'NS-P3A-B02-CH02-T03',
              topicNumber: 3,
              code: '2.4–2.5',
              topic:
                'Organization Bases (4Ps) and Central/Constitutional Agencies: CIAA (2.5.1), PSC (2.5.2), OAG (2.5.3), OPMCM (2.5.4), MoFAGA (2.5.5) and Federal Parliament Secretariat (2.5.6)',
              nepaliTopic:
                'संगठनका आधारहरू र प्रमुख निकायहरूको कार्य (अख्तियार, लोक सेवा, महालेखापरीक्षक, प्र.म. कार्यालय, संघीय मामिला मन्त्रालय र संसद सचिवालय)',
              brief:
                'Covers Luther Gulick’s 4Ps of organization (Purpose, Process, Persons, Place) and the constitutional/central coordination mandates of Nepal’s six apex administrative and oversight bodies.',
            },
            {
              id: 'NS-P3A-B02-CH02-T04',
              topicNumber: 4,
              code: '2.6–2.8',
              topic:
                'Management Functions, Leadership, Decision-Making, Motivation & Morale, and Control & Coordination',
              nepaliTopic:
                'व्यवस्थापनका कार्य, नेतृत्व, निर्णय प्रक्रिया, उत्प्रेरणा र मनोबल तथा नियन्त्रण र समन्वय',
              brief:
                'Applies POSDCORB management functions, Maslow/Herzberg motivation theories, participative leadership, internal/external coordination, and feedback control to public offices.',
            },
            {
              id: 'NS-P3A-B02-CH02-T05',
              topicNumber: 5,
              code: '2.9–2.11',
              topic:
                'Group Dynamics, Organizational Change & Development, and Time Management',
              nepaliTopic:
                'समूह गतिशीलता, संगठनात्मक परिवर्तन तथा विकास र समय व्यवस्थापन',
              brief:
                'Examines team formation, overcoming resistance to administrative/digital change, planned OD, and prioritization matrices (urgent vs important) for timely service delivery.',
            },
          ],
        },
      ],
      keyReferences:
        'Civil Service Act, 2049 & Rules, 2050 · Constitution Parts 21–23',
      materialPath: '/materials/civil-service-act-2049.pdf',
      materialTitle: 'Civil Service Act, 2049',
      writtenHref: '/written/PSC-WR-204',
      writtenLabel: 'Merit & Inclusion 10M Q&A',
      simulatePresetId: 'written-paper-2',
    },
    {
      id: 'ns-p3-u3',
      branchNumber: 3,
      unitCode: 'Section C · 30M',
      title:
        'Legal Provisions Related to Public Service Management (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) सार्वजनिक सेवा व्यवस्थापन सम्बन्धी कानूनी व्यवस्था (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers all 10 statutory instruments specified in Chapter 3—Allocation of Business Rules, LGOA 2074, Local Admin Act 2028, Good Governance Act 2064, Procurement Law, RTI Law, Fiscal Accountability Law, DRRM Law, Anti-Money Laundering Law, and Parliament Secretariat Act 2064.',
      subtopics: [
        '3.1 GoN Allocation of Business Rules, 3.2 Local Government Operation Act 2074, 3.3 Local Administration Act 2028, 3.4 Good Governance Act 2064, and 3.5 Public Procurement Act & Rules',
        '3.6 Right to Information Act & Rules, 3.7 Fiscal Procedures & Financial Accountability Act & Rules, 3.8 DRRM Act & Rules, 3.9 Anti-Money Laundering (AML) Act, and 3.10 Federal Parliament Secretariat Act 2064 & Rules 2065',
      ],
      chapters: [
        {
          id: 'NS-P3A-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Legal Provisions Related to Public Service Management',
          nepaliChapterName:
            '३. सार्वजनिक सेवा व्यवस्थापन सम्बन्धी कानूनी व्यवस्था',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Tests direct statutory application of ten core administrative, local governance, procurement, financial, disaster, and integrity laws of Nepal.',
          topics: [
            {
              id: 'NS-P3A-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic:
                'Government of Nepal (Allocation of Business) Rules (कार्यविभाजन नियमावली)',
              nepaliTopic: 'नेपाल सरकार (कार्यविभाजन) नियमावली',
              brief:
                'Delineates thematic portfolios and functional jurisdictions across OPMCM and federal ministries pursuant to Article 82 of the Constitution.',
            },
            {
              id: 'NS-P3A-B03-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic: 'Local Government Operation Act, 2074',
              nepaliTopic: 'स्थानीय सरकार सञ्चालन ऐन, २०७४',
              brief:
                'Covers classification of municipalities/rural municipalities, Ward Committee powers, 7-step local planning, local revenue, Chief Administrative Officer duties, and Judicial Committee jurisdiction (Section 47).',
            },
            {
              id: 'NS-P3A-B03-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic: 'Local Administration Act, 2028',
              nepaliTopic: 'स्थानीय प्रशासन ऐन, २०२८',
              brief:
                'Examines the powers and functions of the Chief District Officer (CDO) as federal representative in the district—peace and security, curfew/prohibitory orders, market monitoring, public property protection, and disaster coordination.',
            },
            {
              id: 'NS-P3A-B03-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic:
                'Good Governance (Management and Operation) Act, 2064 and Rules, 2065',
              nepaliTopic:
                'सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ र नियमावली, २०६५',
              brief:
                'Covers administrative/ministerial accountability, conflict-of-interest prohibition, time-bound decision making, Citizen Charter, mobile service, public hearing, spokesperson, and governance reform unit.',
            },
            {
              id: 'NS-P3A-B03-CH03-T05',
              topicNumber: 5,
              code: '3.5',
              topic: 'Public Procurement Act, 2063 and Rules, 2064',
              nepaliTopic: 'सार्वजनिक खरिद ऐन, २०६३ र नियमावली, २०६४',
              brief:
                'Covers procurement methods, thresholds (direct purchase, sealed quotation, open tender), bid/performance security, evaluation committees, e-GP, and blacklisting.',
            },
            {
              id: 'NS-P3A-B03-CH03-T06',
              topicNumber: 6,
              code: '3.6',
              topic: 'Right to Information Act, 2064 and Rules, 2065',
              nepaliTopic: 'सूचनाको हक सम्बन्धी ऐन, २०६४ र नियमावली, २०६५',
              brief:
                'Covers quarterly proactive disclosure, Information Officer responsibilities, 15-day/immediate life-safety timelines, appeal to Office Chief and NIC, and penalties for withholding information.',
            },
            {
              id: 'NS-P3A-B03-CH03-T07',
              topicNumber: 7,
              code: '3.7',
              topic:
                'Fiscal Procedures and Financial Accountability Act, 2076 and Rules, 2077',
              nepaliTopic:
                'आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ र नियमावली, २०७७',
              brief:
                'Covers Consolidated Fund operation, budget authorization/virement, internal control, internal & final audit, and Beruju clearance.',
            },
            {
              id: 'NS-P3A-B03-CH03-T08',
              topicNumber: 8,
              code: '3.8',
              topic:
                'Disaster Risk Reduction and Management Act, 2074 and Rules, 2076',
              nepaliTopic:
                'विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४ र नियमावली, २०७६',
              brief:
                'Covers National Council, Executive Committee, NDRRMA, Provincial/District/Local Disaster Management Committees, and Disaster Management Funds.',
            },
            {
              id: 'NS-P3A-B03-CH03-T09',
              topicNumber: 9,
              code: '3.9',
              topic:
                'Concept of Anti-Money Laundering (AML) and Asset (Money) Laundering Prevention Act, 2064',
              nepaliTopic:
                'सम्पत्ति शुद्धीकरणको अवधारणा र सम्पत्ति शुद्धीकरण (मनी लाउन्डरिङ) निवारण ऐन, २०६४',
              brief:
                'Covers placement-layering-integration stages, KYC/CDD obligations of reporting entities, Financial Information Unit (FIU-Nepal), Department of Money Laundering Investigation (DMLI), and terrorist financing controls.',
            },
            {
              id: 'NS-P3A-B03-CH03-T10',
              topicNumber: 10,
              code: '3.10',
              topic:
                'Federal Parliament Secretariat Act, 2064 and Personnel Administration Rules, 2065',
              nepaliTopic:
                'संघीय संसद सचिवालय सम्बन्धी ऐन, २०६४ र कर्मचारी प्रशासन नियमावली, २०६५',
              brief:
                'Covers autonomous functioning of the Federal Parliament Secretariat, Operation & Management Committee, Secretary General/Secretaries, and specialized parliamentary service conditions.',
            },
          ],
        },
      ],
      keyReferences:
        'LGOA 2074 · Local Admin Act 2028 · Good Governance Act 2064 · Procurement Act 2063 · AML Act 2064',
      materialPath: '/materials/local-government-operation-act-2074.pdf',
      materialTitle: 'Local Government Operation Act, 2074',
      quizHref: '/quiz/laws-and-constitution',
      quizLabel: 'Public Laws Quiz',
      writtenHref: '/written/PSC-WR-205',
      writtenLabel: 'Good Governance Act Q&A',
      simulatePresetId: 'written-paper-2',
    },
  ],
};

export const NAYAB_SUBBA_PAPER_3_ACCOUNTS_AUDIT: PscSyllabusPaper = {
  id: 'ns-paper-3-accounts',
  code: 'Paper III (Accounts & Audit)',
  title: 'Service-Group Subject (Accounts Group & Nepal Audit Service)',
  nepaliTitle:
    'सेवा–समूह सम्बन्धी विषय (नेपाल प्रशासन सेवा, लेखा समूह र नेपाल लेखापरीक्षण सेवा)',
  serviceStreamId: 'ns-stream-accounts-audit',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    '14 Short Questions × 5 Marks (70M) + 3 Long Questions × 10 Marks (30M) = 100 Marks across Sections A (30M), B (30M) & C (40M)',
  scoringRule:
    'Minimum 40 marks required · Counted in 240-mark Final Merit for Accounts & Audit',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p3-acc-u1',
      branchNumber: 1,
      unitCode: 'Section A · 30M',
      title: 'Financial Administration & Accounting System (4×5M + 1×10M)',
      nepaliTitle: 'खण्ड (क) आर्थिक प्रशासन र लेखा प्रणाली (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapter 1 (1.1–1.7): principles of accounting, trial balance/final accounts/bank reconciliation, Nepal’s cash & accrual government accounting, NPSAS, Chart of Accounts, TSA, CGAS, SuTRA, LMBIS, and expenditure/advance accounting.',
      subtopics: [
        '1.1–1.3 Double-entry accounting principles, Journal/Ledger/Trial Balance/Final Accounts/Bank Reconciliation, and Government Accounting in Nepal',
        '1.4–1.7 Cash vs Accrual & NPSAS, Chart of Accounts/TSA/CGAS/LMBIS/SuTRA, Goshwara Voucher/Bank Cash Book/Budget Sheet/Maskewari, and Advance (Peshki) clearance',
      ],
      chapters: [
        {
          id: 'NS-P3ACC-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Financial Administration and Government Accounting',
          nepaliChapterName: '१. आर्थिक प्रशासन र लेखा प्रणाली',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Covers commercial and government double-entry accounting, AGF forms, and digital treasury portals.',
          topics: [
            {
              id: 'NS-P3ACC-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1–1.2',
              topic:
                'Accounting principles, double-entry system, Trial Balance, Final Accounts and Bank Reconciliation Statement',
              nepaliTopic:
                'लेखाका सिद्धान्त, दोहोरो लेखा प्रणाली, सन्तुलन परीक्षण, अन्तिम खाता र बैंक हिसाब मिलान',
              brief:
                'Covers debit-credit rules, trading/profit-loss/balance sheet preparation, depreciation basics, and reconciling cash book vs bank statement differences.',
            },
            {
              id: 'NS-P3ACC-B01-CH01-T02',
              topicNumber: 2,
              code: '1.3–1.5',
              topic:
                'Government accounting system in Nepal, NPSAS, Chart of Accounts, TSA, CGAS, LMBIS/PLMBIS and SuTRA',
              nepaliTopic:
                'नेपालको सरकारी लेखा प्रणाली, NPSAS, लेखा संकेत, TSA, CGAS, LMBIS र SuTRA',
              brief:
                'Examines FCGO/DTCO treasury release, Chart of Accounts classification, online voucher entry in CGAS and local-level SuTRA, and NPSAS financial statements.',
            },
            {
              id: 'NS-P3ACC-B01-CH01-T03',
              topicNumber: 3,
              code: '1.6–1.7',
              topic:
                'Goshwara Voucher, Bank Cash Book, Budget Sheet, Monthly Maskewari and Advance (Peshki) accounting',
              nepaliTopic:
                'गोश्वारा भौचर, बैंक नगदी किताब, बजेट हिसाब, मास्केवारी र पेश्की लेखाङ्कन',
              brief:
                'Details operational posting in Ma.Le.Pa. 203, 208, 209, 210, and statutory conditions/deadlines for employee, contractor, and L/C advances.',
            },
          ],
        },
      ],
      keyReferences:
        'FCGO Accounting Manuals · Fiscal Accountability Act, 2076 · NPSAS',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Act Digest',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-acc-u2',
      branchNumber: 2,
      unitCode: 'Section B · 30M',
      title:
        'Public Procurement, Inventory (Jinsi) & Revenue/Deposit Accounting (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) सार्वजनिक खरिद, जिन्सी र राजस्व तथा धरौटी लेखाङ्कन (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapter 2 Public Procurement (2.1–2.6), Chapter 3 Inventory/PAMS Management (3.1–3.5), and Chapter 4 Revenue & Deposit Accounting via RMIS (4.1–4.7).',
      subtopics: [
        'Chapter 2: Procurement planning, cost estimate, bidding/quotation/direct purchase, e-GP & contract management',
        'Chapter 3: Store (Jinsi) classification, Maag Faram/Dakhila/Jinsi Khata, PAMS, annual inspection & auction/write-off',
        'Chapter 4: Revenue accounting, RMIS, Deposit (Dharauti) ledger, refund & forfeiture to Consolidated Fund',
      ],
      chapters: [
        {
          id: 'NS-P3ACC-B02-CH02',
          chapterNumber: 2,
          code: 'Chapters 2–4',
          chapterName:
            'Public Procurement, Inventory (Jinsi) & Revenue/Deposit Accounting',
          nepaliChapterName:
            '२–४. सार्वजनिक खरिद, जिन्सी व्यवस्थापन र राजस्व तथा धरौटी लेखा',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Integrates procurement compliance, PAMS store accounting, RMIS revenue books, and Dharauti accounts.',
          topics: [
            {
              id: 'NS-P3ACC-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1–2.6',
              topic:
                'Public procurement principles, procurement plans, methods (tender, sealed quotation, direct, user committee), securities and e-GP',
              nepaliTopic:
                'सार्वजनिक खरिदका सिद्धान्त, खरिद योजना, खरिद विधि, जमानत र विद्युतीय खरिद प्रणाली (e-GP)',
              brief:
                'Covers statutory thresholds, bid evaluation, variation orders, and PPMO electronic procurement procedures under PPA 2063 & PPR 2064.',
            },
            {
              id: 'NS-P3ACC-B02-CH02-T02',
              topicNumber: 2,
              code: '3.1–3.5',
              topic:
                'Store/Inventory (Jinsi) records, Public Assets Management System (PAMS), physical inspection, auction and write-off (Minaha)',
              nepaliTopic:
                'जिन्सी स्रेस्ता, सार्वजनिक सम्पत्ति व्यवस्थापन प्रणाली (PAMS), जिन्सी निरीक्षण, लिलाम र मिनाहा',
              brief:
                'Covers Ma.Le.Pa. 401–413 forms, real-time asset tracking in PAMS, annual store inspection reports, and disposal of obsolete/unserviceable assets.',
            },
            {
              id: 'NS-P3ACC-B02-CH02-T03',
              topicNumber: 3,
              code: '4.1–4.7',
              topic:
                'Revenue accounting, Revenue Management Information System (RMIS) and Deposit (Dharauti) accounting',
              nepaliTopic:
                'राजस्व लेखाङ्कन, राजस्व व्यवस्थापन सूचना प्रणाली (RMIS) र धरौटी लेखा',
              brief:
                'Covers electronic revenue collection/reconciliation via RMIS and individual/consolidated Dharauti ledgers (Ma.Le.Pa. 601–607), refund, and statutory lapse into revenue.',
            },
          ],
        },
      ],
      keyReferences:
        'Public Procurement Act, 2063 · FCGO PAMS & RMIS Directives',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Act Digest',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-acc-u3',
      branchNumber: 3,
      unitCode: 'Section C · 40M',
      title:
        'Auditing System & Accounting/Auditing Laws (6×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) लेखापरीक्षण प्रणाली र आर्थिक/लेखापरीक्षण कानूनहरू (६×५ + १×१० = ४० अङ्क)',
      marksWeight: 40,
      branchSummary:
        'Covers Chapter 5 Auditing System (5.1–5.10: internal vs final audit, audit evidence/working papers, performance/compliance/financial audit, NAMS, Beruju settlement) and Chapter 6 Laws (Constitution finance/OAG, Fiscal Accountability Act, Audit Act 2075, VAT/Income Tax TDS, Travel Rules, Intergovernmental Fiscal Act).',
      subtopics: [
        'Chapter 5: Internal control & internal audit, Final audit (OAG), regularity/performance/financial audit, audit working papers, NAMS & Beruju clearance',
        'Chapter 6: Constitutional finance/OAG articles, Fiscal Accountability Act 2076, Audit Act 2075, Income Tax TDS & VAT basics, Travel Expenses Rules 2064 & Intergovernmental Fiscal Act 2074',
      ],
      chapters: [
        {
          id: 'NS-P3ACC-B03-CH03',
          chapterNumber: 3,
          code: 'Chapters 5–6',
          chapterName: 'Auditing System and Public Finance Laws',
          nepaliChapterName:
            '५–६. लेखापरीक्षण प्रणाली र लेखा तथा लेखापरीक्षण सम्बन्धी कानून',
          marksAllocation: '6 Short Qs × 5M + 1 Long Q × 10M = 40 Marks',
          chapterBrief:
            'High-weightage focus on internal/external audit mechanics, NAMS, Beruju settlement, TDS/VAT compliance, and core fiscal statutes.',
          topics: [
            {
              id: 'NS-P3ACC-B03-CH03-T01',
              topicNumber: 1,
              code: '5.1–5.10',
              topic:
                'Internal control, internal vs final audit, financial/compliance/performance audit, working papers, NAMS and Beruju clearance (Samparikshan)',
              nepaliTopic:
                'आन्तरिक नियन्त्रण, आन्तरिक र अन्तिम लेखापरीक्षण, कार्यपत्र, NAMS र बेरुजु फर्छ्यौट/सम्परीक्षण',
              brief:
                'Examines DTCO/local internal audit, OAG audit planning/evidence/reporting via Nepal Audit Management System (NAMS), and statutory procedures for clearing recoverable, regularizable, and advance Beruju.',
            },
            {
              id: 'NS-P3ACC-B03-CH03-T02',
              topicNumber: 2,
              code: '6.1–6.7',
              topic:
                'Constitutional public finance/OAG provisions, Fiscal Accountability Act 2076, Audit Act 2075, Income Tax TDS, VAT, Travel Expenses Rules 2064 and Intergovernmental Fiscal Act 2074',
              nepaliTopic:
                'संवैधानिक आर्थिक कार्यप्रणाली, आर्थिक कार्यविधि ऐन २०७६, लेखापरीक्षण ऐन २०७५, अग्रिम कर कट्टी (TDS), मू.अ.कर र भ्रमण खर्च नियमावली',
              brief:
                'Covers statutory withholding tax (TDS) rates on payments/contracts, VAT invoicing/deduction by public bodies, TADA rules, and Section 8 audit criteria under the Audit Act, 2075.',
            },
          ],
        },
      ],
      keyReferences:
        'Audit Act, 2075 · Fiscal Accountability Act, 2076 · Income Tax Act, 2058 · VAT Act, 2052',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Act Digest',
      simulatePresetId: 'written-office-nasu',
    },
  ],
};

export const NAYAB_SUBBA_PAPER_3_REVENUE: PscSyllabusPaper = {
  id: 'ns-paper-3-revenue',
  code: 'Paper III (Revenue)',
  title: 'Service-Group Subject (Nepal Administration Service — Revenue Group)',
  nepaliTitle: 'सेवा–समूह सम्बन्धी विषय (नेपाल प्रशासन सेवा, राजस्व समूह)',
  serviceStreamId: 'ns-stream-revenue',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    '14 Short Questions × 5 Marks (70M) + 3 Long Questions × 10 Marks (30M) = 100 Marks across Sections A (35M), B (35M) & C (30M)',
  scoringRule:
    'Minimum 40 marks required · Counted in 240-mark Final Merit for Revenue Group',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p3-rev-u1',
      branchNumber: 1,
      unitCode: 'Section A · 35M',
      title: 'Economy of Nepal & Public Finance (5×5M + 1×10M)',
      nepaliTitle: 'खण्ड (क) नेपालको अर्थतन्त्र र सार्वजनिक वित्त (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers Chapter 1 (1.1–1.10): Nepalese macroeconomic features, GDP/national income, fiscal & monetary policies, inflation, foreign trade/BoP, foreign aid/debt, budget system, and fiscal federalism.',
      subtopics: [
        '1.1–1.5 Structure of Nepalese economy, National Income (GDP/GNP), Public Finance (income, expenditure, public debt), Budget system & Fiscal Policy',
        '1.6–1.10 Monetary Policy, Inflation, Foreign Trade & Balance of Payments, Foreign Aid/FDI, and Fiscal Federalism in Nepal',
      ],
      chapters: [
        {
          id: 'NS-P3REV-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Economy of Nepal and Macroeconomic Policy',
          nepaliChapterName: '१. नेपालको अर्थतन्त्र',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Tests macroeconomic indicators, fiscal/monetary policy instruments, external trade/BoP, and intergovernmental fiscal transfers.',
          topics: [
            {
              id: 'NS-P3REV-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1–1.5',
              topic:
                'Features of Nepalese economy, GDP/GNI accounting, public revenue/expenditure/debt, budget cycle and fiscal policy',
              nepaliTopic:
                'नेपालको अर्थतन्त्रका विशेषता, राष्ट्रिय आय, सार्वजनिक आय/खर्च/ऋण, बजेट प्रणाली र वित्त नीति',
              brief:
                'Analyzes sectoral GDP shifts, domestic revenue-to-GDP ratio, recurrent vs capital spending, Public Debt Management Act, and growth-oriented fiscal policy.',
            },
            {
              id: 'NS-P3REV-B01-CH01-T02',
              topicNumber: 2,
              code: '1.6–1.10',
              topic:
                'Monetary policy, inflation, foreign trade & BoP, foreign investment/aid and intergovernmental fiscal arrangements',
              nepaliTopic:
                'मौद्रिक नीति, मुद्रास्फीति, वैदेशिक व्यापार र शोधनान्तर स्थिति, वैदेशिक लगानी र वित्तीय संघीयता',
              brief:
                'Covers NRB monetary tools, demand-pull/cost-push inflation, trade deficit remedies, foreign exchange reserves, and three-tier revenue sharing.',
            },
          ],
        },
      ],
      keyReferences:
        'Economic Survey (MoF) · NRB Monetary Policy · 16th Periodic Plan',
      materialPath: '/materials/sixteenth-plan-summary.pdf',
      materialTitle: 'Sixteenth Plan Summary',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-rev-u2',
      branchNumber: 2,
      unitCode: 'Section B · 35M',
      title:
        'Taxation Principles & Major Revenue Statutes (5×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) राजस्व प्रशासन र कर सम्बन्धी कानूनी व्यवस्था (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers Chapter 2 (2.1–2.3): canons of taxation, direct vs indirect taxes, non-tax revenue, Customs Act 2064, Income Tax Act 2058, VAT Act 2052, Excise Duty Act 2058, and Liquor Act 2031.',
      subtopics: [
        '2.1–2.2 Principles of taxation, direct vs indirect tax, progressive/proportional tax & non-tax revenue (fees, royalties, dividends)',
        '2.3 Core Revenue Laws: Customs Act 2064 (2.3.1), Income Tax Act 2058 (2.3.2), Value Added Tax Act 2052 (2.3.3), Excise Duty Act 2058 (2.3.4) & Liquor Act 2031 (2.3.5)',
      ],
      chapters: [
        {
          id: 'NS-P3REV-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Revenue Principles and Core Tax Laws of Nepal',
          nepaliChapterName: '२. राजस्व प्रशासन र कानूनी व्यवस्था',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Focuses on statutory assessment, PAN/VAT registration, customs valuation/clearance, excise physical/self-removal systems, and appeal remedies.',
          topics: [
            {
              id: 'NS-P3REV-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1–2.2',
              topic:
                'Concept & principles of taxation, direct vs indirect taxes and non-tax revenue administration',
              nepaliTopic: 'करका सिद्धान्त, प्रत्यक्ष र अप्रत्यक्ष कर तथा गैरकर राजस्व',
              brief:
                'Compares incidence/shifting of direct and indirect taxes and examines service charges, penalties, royalties, and public enterprise dividends.',
            },
            {
              id: 'NS-P3REV-B02-CH02-T02',
              topicNumber: 2,
              code: '2.3.1–2.3.5',
              topic:
                'Customs Act 2064, Income Tax Act 2058, Value Added Tax Act 2052, Excise Duty Act 2058 and Liquor Act 2031',
              nepaliTopic:
                'भन्सार ऐन २०६४, आयकर ऐन २०५८, मूल्य अभिवृद्धि कर ऐन २०५२, अन्तःशुल्क ऐन २०५८ र मदिरा ऐन २०३१',
              brief:
                'Covers WTO GATT customs valuation & ASYCUDA clearance, employment/business/investment income & TDS/self-assessment, 13% VAT credit/refund/billing, excise stickers/licensing, and administrative review vs Revenue Tribunal appeals.',
            },
          ],
        },
      ],
      keyReferences:
        'Income Tax Act, 2058 · VAT Act, 2052 · Customs Act, 2064 · Excise Act, 2058',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Act Digest',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-rev-u3',
      branchNumber: 3,
      unitCode: 'Section C · 30M',
      title:
        'Revenue Institutions, Leakage Control & Financial Sector (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) राजस्व प्रशासनका निकाय, चुहावट नियन्त्रण र वित्तीय क्षेत्र (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapter 3 (3.1–3.8): MoF, IRD, DoC, DRI, Revenue Tribunal, Revenue Leakage (Investigation & Control) Act 2052, AML Act 2064, WTO/SAFTA/BIMSTEC trade regimes, and banking/capital/insurance markets.',
      subtopics: [
        '3.1–3.4 Ministry of Finance, Inland Revenue Dept (IRD), Dept of Customs (DoC), Dept of Revenue Investigation (DRI), Revenue Tribunal & Revenue Leakage Control Act 2052',
        '3.5–3.8 Taxpayer service & e-taxation (ITS/ASYCUDA/RMIS), Banking/Insurance/Capital Market (NRB, SEBON, NEPSE), AML Act 2064, and WTO/SAFTA/BIMSTEC customs regimes',
      ],
      chapters: [
        {
          id: 'NS-P3REV-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName:
            'Revenue Institutions, Leakage Control and Financial Sector',
          nepaliChapterName:
            '३. राजस्व प्रशासनको संगठन, चुहावट नियन्त्रण र वित्तीय क्षेत्र',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Examines institutional tax administration, anti-smuggling/evasion enforcement, digital tax portals, and financial sector regulation.',
          topics: [
            {
              id: 'NS-P3REV-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1–3.4',
              topic:
                'MoF, IRD, DoC, DRI, Revenue Tribunal and Revenue Leakage (Investigation and Control) Act, 2052',
              nepaliTopic:
                'अर्थ मन्त्रालय, आन्तरिक राजस्व विभाग, भन्सार विभाग, राजस्व अनुसन्धान विभाग, राजस्व न्यायाधिकरण र राजस्व चुहावट नियन्त्रण ऐन, २०५२',
              brief:
                'Covers organizational roles, VCTS (Vehicle and Consignment Tracking System), investigation/prosecution of tax evasion and customs smuggling, and specialized Revenue Tribunal adjudication.',
            },
            {
              id: 'NS-P3REV-B03-CH03-T02',
              topicNumber: 2,
              code: '3.5–3.8',
              topic:
                'Taxpayer education & IT in revenue, NRB/BFIs/Capital Market/Insurance, Anti-Money Laundering and WTO/SAFTA/BIMSTEC',
              nepaliTopic:
                'करदाता सेवा र सूचना प्रविधि, बैंक तथा वित्तीय संस्था/पूँजी बजार/बीमा, सम्पत्ति शुद्धीकरण र WTO/SAFTA/BIMSTEC',
              brief:
                'Examines voluntary tax compliance, electronic billing, financial sector supervision (NRB, SEBON, NIA), AML/CFT enforcement, and rules of origin/tariff concessions under regional and multilateral trade agreements.',
            },
          ],
        },
      ],
      keyReferences:
        'Revenue Leakage Control Act, 2052 · NRB Act, 2058 · Official Nayab Subba Phase II PDF',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      simulatePresetId: 'written-office-nasu',
    },
  ],
};

export const NAYAB_SUBBA_PAPER_3_JUSTICE: PscSyllabusPaper = {
  id: 'ns-paper-3-justice',
  code: 'Paper III (Justice & Law)',
  title:
    'Service-Group Subject (Nepal Justice Service — Justice, Law & Govt. Attorney)',
  nepaliTitle:
    'सेवा–समूह सम्बन्धी विषय (नेपाल न्याय सेवा — न्याय, कानून र सरकारी वकिल समूह)',
  serviceStreamId: 'ns-stream-justice',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    '14 Short Questions × 5 Marks (70M) + 3 Long Questions × 10 Marks (30M) = 100 Marks across Sections A (30M), B (40M) & C (30M)',
  scoringRule:
    'Minimum 40 marks required · Counted in 240-mark Final Merit for Nepal Justice Service',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p3-jus-u1',
      branchNumber: 1,
      unitCode: 'Section A · 30M',
      title:
        'General Knowledge of Law & Statutory Interpretation (4×5M + 1×10M)',
      nepaliTitle: 'खण्ड (क) कानूनको सामान्य जानकारी (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapter 1 (1.1–1.10): jurisprudence basics, substantive vs procedural law, civil vs criminal law, legislative drafting, delegated legislation, Nepal Kanoon Vyakhya Act 2010, natural justice, writ jurisdiction, and treaty law.',
      subtopics: [
        '1.1–1.5 Concept/sources/classification of law (substantive vs procedural, civil vs criminal), law-making process & delegated legislation',
        '1.6–1.10 Interpretation of statutes (Interpretation of Laws Act, 2010), Principles of Natural Justice, Constitutional writs (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto) & Nepal Treaty Act, 2047',
      ],
      chapters: [
        {
          id: 'NS-P3JUS-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'General Knowledge of Law',
          nepaliChapterName: '१. कानून सम्बन्धी सामान्य जानकारी',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Covers foundational legal concepts, statutory interpretation rules, natural justice, and constitutional remedies.',
          topics: [
            {
              id: 'NS-P3JUS-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1–1.5',
              topic:
                'Nature, sources & classification of law, legislative drafting and delegated legislation (प्रत्यायोजित विधायन)',
              nepaliTopic:
                'कानूनको परिचय, स्रोत र वर्गीकरण, कानून तर्जुमा प्रक्रिया र प्रत्यायोजित विधायन',
              brief:
                'Distinguishes substantive vs procedural and public vs private law, traces bill drafting through Ministry of Law and Parliament, and examines judicial/parliamentary controls over ultra vires delegated rules.',
            },
            {
              id: 'NS-P3JUS-B01-CH01-T02',
              topicNumber: 2,
              code: '1.6–1.10',
              topic:
                'Statutory interpretation (Act 2010), Natural Justice, Writ Jurisdiction (Arts. 133 & 144) and Nepal Treaty Act, 2047',
              nepaliTopic:
                'कानून व्याख्या सम्बन्धी ऐन २०१०, प्राकृतिक न्यायको सिद्धान्त, रिट क्षेत्राधिकार र नेपाल सन्धि ऐन २०४७',
              brief:
                'Covers literal/golden/mischief rules, Nemo judex in causa sua & Audi alteram partem, the five extraordinary writs, PIL, and Section 9 treaty primacy.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution Part 11 · Interpretation of Laws Act, 2010 · Nepal Treaty Act, 2047',
      materialPath: '/materials/constitution-of-nepal-2072.pdf',
      materialTitle: 'Constitution of Nepal (2072)',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-jus-u2',
      branchNumber: 2,
      unitCode: 'Section B · 40M',
      title: 'Justice Administration & Court Procedures (6×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) न्याय प्रशासन र अदालती कार्यविधि (६×५ + १×१० = ४० अङ्क)',
      marksWeight: 40,
      branchSummary:
        'Covers Chapter 2 (2.1–2.18): Supreme/High/District Courts, Judicial Council, Judicial Service Commission, Local Judicial Committees, Muluki Dewani Samhita & Civil Procedure Code 2074 (Firadpatra, Pratiuttar, Myad Tameli, Hadmyad, Hakdaiya, Waresnama, mediation, execution of judgments, court fees).',
      subtopics: [
        '2.1–2.6 Three-tier Judiciary, Special/Administrative Courts, Judicial Council, Judicial Service Commission, Local Judicial Committee (Art. 217) & Judicial Administration Act 2073',
        '2.7–2.18 Muluki Civil Code & Civil Procedure Code 2074: Hakdaiya, Hadmyad, Jurisdiction, Firadpatra, Darpeeth, Pratiuttar, Myad Tameli, Tarikh/Waresnama, Interim Orders, Mediation, Judgment Execution & Court Fee/Legal Aid',
      ],
      chapters: [
        {
          id: 'NS-P3JUS-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Justice Administration and Civil Procedure',
          nepaliChapterName: '२. न्याय प्रशासन र देवानी कार्यविधि',
          marksAllocation: '6 Short Qs × 5M + 1 Long Q × 10M = 40 Marks',
          chapterBrief:
            'Equips Bench Assistants/Nayab Subbas in courts with mastery of case registration, summons service, bench management, and judgment execution.',
          topics: [
            {
              id: 'NS-P3JUS-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1–2.6',
              topic:
                'Court structure & jurisdiction (Judicial Administration Act, 2073), Judicial Council, Judicial Service Commission and Local Judicial Committees',
              nepaliTopic:
                'अदालतको संरचना र क्षेत्राधिकार, न्याय परिषद्, न्याय सेवा आयोग र स्थानीय न्यायिक समिति',
              brief:
                'Covers original, appellate, and revision jurisdictions of District, High, and Supreme Courts, specialized tribunals, and local dispute settlement/mediation under LGOA Section 47.',
            },
            {
              id: 'NS-P3JUS-B02-CH02-T02',
              topicNumber: 2,
              code: '2.7–2.18',
              topic:
                'Muluki Civil Code & Civil Procedure Code, 2074: Locus standi (Hakdaiya), Limitation (Hadmyad), Plaint (Firadpatra), Darpeeth, Summons Service (Myad Tameli), Power of Attorney (Waresnama), Mediation, Judgment Execution and Free Legal Aid',
              nepaliTopic:
                'मुलुकी देवानी संहिता र कार्यविधि संहिता २०७४: हकदैया, हदम्याद, फिरादपत्र, दरपीठ, प्रतिउत्तर, म्याद तामेली, तारिख/वारेसनामा, मेलमिलाप र फैसला कार्यान्वयन',
              brief:
                'Covers end-to-end civil registry operations—scrutinizing deeds, court fees (Adalati Shulka), electronic/in-person Myad Tameli, case-flow calendar (Differentiated Case Management), court-referred mediation, and Tehsildar judgment enforcement.',
            },
          ],
        },
      ],
      keyReferences:
        'Judicial Administration Act, 2073 · Muluki Civil Code & Civil Procedure Code, 2074',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-jus-u3',
      branchNumber: 3,
      unitCode: 'Section C · 30M',
      title:
        'Crime Investigation, Prosecution & Government Attorney (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) अपराध अनुसन्धान, अभियोजन र सरकारी वकिल (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapter 3 (3.1–3.10): Muluki Criminal Code & Criminal Procedure Code 2074, Criminal Offences (Sentencing & Execution) Act 2074, Evidence Act 2031, Attorney General powers (Art. 158), FIR, arrest/remand, charge-sheet, bail/detention hearing (Thunchek), victim protection, and Government Cases Rules.',
      subtopics: [
        '3.1–3.5 Principles of criminal justice, Muluki Criminal Code & Criminal Procedure Code 2074, FIR (Jaheri), Arrest/Search/Seizure (Muchulka), Remand & Charge-sheet (Abhiyogpatra)',
        '3.6–3.10 Bail/Detention hearing (Thunchek), Evidence Act 2031 (burden of proof, witness examination), Sentencing Act 2074, Victim Justice & Attorney General (Art. 158 / Govt. Attorney Rules)',
      ],
      chapters: [
        {
          id: 'NS-P3JUS-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName:
            'Criminal Procedure, Evidence and Government Attorney Administration',
          nepaliChapterName:
            '३. अपराध अनुसन्धान, अभियोजन र सरकारी वकिल सम्बन्धी व्यवस्था',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Covers state-party criminal investigation, prosecution, evidentiary burden, sentencing, and Office of the Attorney General functions.',
          topics: [
            {
              id: 'NS-P3JUS-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1–3.6',
              topic:
                'Muluki Criminal Code & Criminal Procedure Code, 2074: FIR (Jaheri), Arrest Warrant, Crime Scene/Seizure Muchulka, Custody Remand, Charge-Sheet (Abhiyogpatra) and Preliminary Bail/Detention Hearing (Thunchek)',
              nepaliTopic:
                'मुलुकी अपराध संहिता र फौजदारी कार्यविधि संहिता २०७४: जाहेरी दरखास्त, पक्राउ पुर्जी, मुचुल्का, म्याद थप, अभियोगपत्र र थुनछेक आदेश',
              brief:
                'Traces Schedule 1 & 2 state-party criminal investigation from FIR filing through prosecutor-supervised investigation, 25-day custody ceiling, charge-sheet filing, and judicial Thunchek (remand to custody, bail, or ordinary date).',
            },
            {
              id: 'NS-P3JUS-B03-CH03-T02',
              topicNumber: 2,
              code: '3.7–3.10',
              topic:
                'Evidence Act 2031, Sentencing & Execution Act 2074, Crime Victim Protection Act 2075, and Constitutional/Statutory Role of the Attorney General (Article 158)',
              nepaliTopic:
                'प्रमाण ऐन २०३१, फौजदारी कसूर (सजाय निर्धारण तथा कार्यान्वयन) ऐन २०७४, अपराध पीडित संरक्षण ऐन २०७५ र महान्यायाधिवक्ताको काम, कर्तव्य र अधिकार',
              brief:
                'Covers documentary/oral/forensic/digital evidence, burden of proof, two-stage conviction and sentencing hearings (probation, community service, open prison), victim compensation, and the Attorney General as chief legal advisor and final prosecuting authority.',
            },
          ],
        },
      ],
      keyReferences:
        'Muluki Criminal Code & Procedure Code, 2074 · Evidence Act, 2031 · Constitution Art. 158',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      simulatePresetId: 'written-office-nasu',
    },
  ],
};

export const NAYAB_SUBBA_PAPER_3_FOREIGN: PscSyllabusPaper = {
  id: 'ns-paper-3-foreign',
  code: 'Paper III (Foreign Affairs)',
  title: 'Service-Group Subject (Nepal Foreign Affairs Service)',
  nepaliTitle:
    'सेवा–समूह सम्बन्धी विषय (नेपाल परराष्ट्र सेवा — अंग्रेजी भाषा, कूटनीति र परराष्ट्र मामिला)',
  serviceStreamId: 'ns-stream-foreign',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    'Section A: English Language (10×2M + 2×10M = 40M) · Section B: IR & Multilateralism (4×5M + 1×10M = 30M) · Section C: Foreign Policy & Consular Practice (4×5M + 1×10M = 30M)',
  scoringRule:
    'Minimum 40 marks required · Counted in 240-mark Final Merit for Nepal Foreign Affairs Service',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p3-for-u1',
      branchNumber: 1,
      unitCode: 'Section A · 40M',
      title:
        'English Language: Translation, Communicative Grammar, Comprehension & Essay (40M)',
      nepaliTitle:
        'खण्ड (क) अंग्रेजी भाषा: अनुवाद, व्याकरण, बोध र निबन्ध (१०×२ + २×१० = ४० अङ्क)',
      marksWeight: 40,
      branchSummary:
        'Covers Chapter 1 (1.1–1.4): Nepali-to-English translation, 10×2M communicative grammar items, reading comprehension, and a 200-word analytical English essay.',
      subtopics: [
        '1.1 Nepali to English Translation & 1.2 Communicative Grammar (10×2M = 20M: tense, voice, speech, prepositions, concord, clauses)',
        '1.3 Unseen Reading Comprehension & 1.4 Short Analytical Essay (~200 words)',
      ],
      chapters: [
        {
          id: 'NS-P3FOR-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'English Language Proficiency',
          nepaliChapterName: '१. अंग्रेजी भाषा दक्षता',
          marksAllocation: '10 × 2 Marks + 2 × 10 Marks = 40 Marks',
          chapterBrief:
            'Evaluates functional diplomatic English writing, translation, syntax, and comprehension.',
          topics: [
            {
              id: 'NS-P3FOR-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1–1.2',
              topic:
                'Translation (Nepali to English) and Communicative Grammar (articles, prepositions, concord, tense, voice, reported speech & sentence transformation)',
              nepaliTopic: 'नेपालीबाट अंग्रेजी अनुवाद र प्रयोगात्मक व्याकरण',
              brief:
                'Tests accurate rendering of Nepali administrative/diplomatic passages into English and error-free application of formal English grammar.',
            },
            {
              id: 'NS-P3FOR-B01-CH01-T02',
              topicNumber: 2,
              code: '1.3–1.4',
              topic:
                'Reading Comprehension and Short Analytical Essay (~200 words)',
              nepaliTopic: 'अंग्रेजी गद्यांश बोध र संक्षिप्त निबन्ध लेखन (२०० शब्द)',
              brief:
                'Assesses critical extraction of main arguments from unseen diplomatic texts and concise, coherent essay composition in ~200 words.',
            },
          ],
        },
      ],
      keyReferences: 'Official Nayab Subba Phase II PDF (Pages 11–12)',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      quizHref: '/quiz/custom?subject=English',
      quizLabel: 'English Competence MCQs',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-for-u2',
      branchNumber: 2,
      unitCode: 'Section B · 30M',
      title:
        'IR, International Law, UN, Regional Cooperation & LDCs/LLDCs (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) अन्तर्राष्ट्रिय सम्बन्ध, अन्तर्राष्ट्रिय कानून, राष्ट्रसंघ, क्षेत्रीय सहयोग र LDC/LLDC (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapters 2–6: diplomacy & soft power, international law & treaties, Nepal in the UN/UNPKO/WTO, SAARC/BIMSTEC/ASEAN/EU/SCO/BBIN, and LDC graduation & LLDC transit rights.',
      subtopics: [
        'Chapters 2–3: Concept of IR & diplomacy (bilateral, multilateral, economic, public, cultural), International Law sources & Nepal Treaty Act 2047',
        'Chapters 4–6: UN & specialized agencies, Nepal in UN Peacekeeping, SAARC/BIMSTEC/ASEAN/EU/SCO/ACD/BBIN, and LDCs (2026 graduation) & Landlocked Developing Countries (LLDCs)',
      ],
      chapters: [
        {
          id: 'NS-P3FOR-B02-CH02',
          chapterNumber: 2,
          code: 'Chapters 2–6',
          chapterName:
            'International Relations, International Law, Multilateral & Regional Cooperation',
          nepaliChapterName:
            '२–६. अन्तर्राष्ट्रिय सम्बन्ध, कानून, राष्ट्रसंघ र क्षेत्रीय सहयोग',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Covers multilateral/regional organizations, treaty practice, and Nepal’s LDC/LLDC diplomacy.',
          topics: [
            {
              id: 'NS-P3FOR-B02-CH02-T01',
              topicNumber: 1,
              code: 'Ch. 2–3',
              topic:
                'Diplomacy (types & changing nature), International Law basics and Treaty-Making under Nepal Treaty Act, 2047',
              nepaliTopic:
                'कूटनीतिका स्वरूप, अन्तर्राष्ट्रिय कानून र नेपाल सन्धि ऐन, २०४७',
              brief:
                'Covers bilateral/multilateral/economic/public diplomacy, sovereign equality, and signature/ratification/accession procedures in Nepal.',
            },
            {
              id: 'NS-P3FOR-B02-CH02-T02',
              topicNumber: 2,
              code: 'Ch. 4–6',
              topic:
                'UN & Bretton Woods/WTO, Regional Blocs (SAARC, BIMSTEC, ASEAN, EU, SCO, BBIN, ACD) and LDC Graduation / LLDC Transit Rights',
              nepaliTopic:
                'संयुक्त राष्ट्रसंघ, क्षेत्रीय संगठनहरू (SAARC, BIMSTEC आदि) र LDC स्तरोन्नति तथा भूपरिवेष्ठित राष्ट्रका अधिकार',
              brief:
                'Examines Nepal’s UN Peacekeeping legacy, regional connectivity frameworks, Smooth Transition Strategy for 2026 LDC graduation, and UNCLOS sea-access rights.',
            },
          ],
        },
      ],
      keyReferences:
        'Official Nayab Subba Phase II PDF (Pages 11–12) · MoFA Reports',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p3-for-u3',
      branchNumber: 3,
      unitCode: 'Section C · 30M',
      title:
        'Nepal’s Foreign Policy, Consular/Passport/Migrant Functions & Diplomatic Terms (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) नेपालको परराष्ट्र नीति, कन्सुलर तथा राहदानी कार्य र कूटनीतिक शब्दावली (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Chapters 7–9: Nepal’s Foreign Policy & Sagarmatha Sambaad, MoFA & Mission consular duties, e-Passports/MRTDs, Foreign Employment rescue/welfare, Vienna Conventions, protocol, and diplomatic terminologies.',
      subtopics: [
        'Chapter 7: Constitutional foreign policy directives, neighborhood relations (India & China), major powers, economic diplomacy & Sagarmatha Sambaad',
        'Chapters 8–9: MoFA/Department of Consular Services/Department of Passports (e-Passport & MRTDs), Foreign Employment cycle & migrant rescue, diplomatic privileges/protocol & diplomatic terminologies',
      ],
      chapters: [
        {
          id: 'NS-P3FOR-B03-CH03',
          chapterNumber: 3,
          code: 'Chapters 7–9',
          chapterName:
            'Foreign Policy Execution, Consular/Passport Services and Diplomatic Protocol',
          nepaliChapterName:
            '७–९. नेपालको परराष्ट्र नीति, कन्सुलर/राहदानी सेवा र कूटनीतिक शिष्टाचार',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Focuses directly on operational desks handled by Foreign Service Nayab Subbas in MoFA, Department of Passports, Department of Consular Services, and Embassies.',
          topics: [
            {
              id: 'NS-P3FOR-B03-CH03-T01',
              topicNumber: 1,
              code: '7.1–7.5',
              topic:
                'Nepal’s Foreign Policy (Art. 51(m) & Policy 2077), relations with neighbors & major powers, Economic Diplomacy and Sagarmatha Sambaad',
              nepaliTopic:
                'नेपालको परराष्ट्र नीति, छिमेकी तथा मित्रराष्ट्रसँगको सम्बन्ध, आर्थिक कूटनीति र सगरमाथा संवाद',
              brief:
                'Covers Panchsheel, non-alignment, balanced neighborhood diplomacy, trade/FDI/tourism promotion, and Nepal’s flagship global mountain/climate dialogue forum Sagarmatha Sambaad.',
            },
            {
              id: 'NS-P3FOR-B03-CH03-T02',
              topicNumber: 2,
              code: '8.1–9.1',
              topic:
                'MoFA & Mission functions, Consular attestation/legalization, Passport Act & e-Passports (MRTDs), Migrant Worker Rescue/Repatriation, Protocol/Immunities and Diplomatic Terminologies',
              nepaliTopic:
                'परराष्ट्र मन्त्रालय र नियोगका कार्य, कन्सुलर सेवा, विद्युतीय राहदानी (MRTDs), वैदेशिक रोजगार उद्धार, कूटनीतिक उन्मुक्ति र कूटनीतिक शब्दावली',
              brief:
                'Covers ICAO-compliant e-Passports (Passport Act, 2076), consular attestation, legal aid/repatriation of distressed Nepali workers abroad, VCDR/VCCR immunities, Note Verbale drafting, and diplomatic vocabulary.',
            },
          ],
        },
      ],
      keyReferences:
        'Passport Act, 2076 · Foreign Policy, 2077 · Vienna Conventions 1961/1963',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      writtenHref: '/written/PSC-WR-304',
      writtenLabel: 'Economic Diplomacy 5M Q&A',
      simulatePresetId: 'written-office-nasu',
    },
  ],
};

export const NAYAB_SUBBA_SERVICE_STREAMS: PscServiceStreamGroup[] = [
  {
    id: 'ns-stream-general-admin',
    shortLabel: 'General Admin & Parliament',
    serviceName:
      'Nepal Administration Service (General Administration Group) & Federal Parliament General Admin',
    nepaliServiceName:
      'नेपाल प्रशासन सेवा (सामान्य प्रशासन समूह) र संघीय संसद सेवा (सामान्य प्रशासन)',
    meritNote:
      'Common Paper II (100M) + General Admin Paper III (100M) = 200 Written Marks + 40 Final Stage Marks = 240 Total Merit Marks.',
    papers: [NAYAB_SUBBA_PAPER_3_ADMIN],
  },
  {
    id: 'ns-stream-accounts-audit',
    shortLabel: 'Accounts & Audit',
    serviceName:
      'Nepal Administration Service (Accounts Group) & Nepal Audit Service',
    nepaliServiceName:
      'नेपाल प्रशासन सेवा (लेखा समूह) र नेपाल लेखापरीक्षण सेवा',
    meritNote:
      'Common Paper II (100M) + Accounts/Audit Paper III (100M) = 200 Written Marks + 40 Final Stage Marks = 240 Total Merit Marks.',
    papers: [NAYAB_SUBBA_PAPER_3_ACCOUNTS_AUDIT],
  },
  {
    id: 'ns-stream-revenue',
    shortLabel: 'Revenue Group',
    serviceName: 'Nepal Administration Service (Revenue Group)',
    nepaliServiceName: 'नेपाल प्रशासन सेवा (राजस्व समूह)',
    meritNote:
      'Common Paper II (100M) + Revenue Paper III (100M) = 200 Written Marks + 40 Final Stage Marks = 240 Total Merit Marks.',
    papers: [NAYAB_SUBBA_PAPER_3_REVENUE],
  },
  {
    id: 'ns-stream-justice',
    shortLabel: 'Justice, Law & Govt. Attorney',
    serviceName:
      'Nepal Justice Service (Justice, Law & Government Attorney Groups)',
    nepaliServiceName:
      'नेपाल न्याय सेवा (न्याय, कानून र सरकारी वकिल समूह)',
    meritNote:
      'Common Paper II (100M) + Justice Service Paper III (100M) = 200 Written Marks + 40 Final Stage Marks = 240 Total Merit Marks.',
    papers: [NAYAB_SUBBA_PAPER_3_JUSTICE],
  },
  {
    id: 'ns-stream-foreign',
    shortLabel: 'Foreign Affairs Service',
    serviceName: 'Nepal Foreign Affairs Service (MoFA)',
    nepaliServiceName: 'नेपाल परराष्ट्र सेवा',
    meritNote:
      'Common Paper II (100M) + Foreign Affairs Paper III (100M) = 200 Written Marks + 40 Final Stage Marks = 240 Total Merit Marks.',
    papers: [NAYAB_SUBBA_PAPER_3_FOREIGN],
  },
];

export const NAYAB_SUBBA_PHASE_2: PscExamPhase = {
  id: 'ns-phase-2',
  phaseNumber: 2,
  title: 'Stage II · Main Written Examination (मूल परीक्षा)',
  nepaliTitle: 'द्वितीय चरण · मुख्य लिखित परीक्षा (२०० अङ्क)',
  summary:
    'Two compulsory 100-mark written papers (2 Hours 30 Minutes each). Paper II is common across all services; Paper III is specific to the candidate’s target service/group (General Admin, Accounts/Audit, Revenue, Justice/Law, or Foreign Affairs). Each paper typically carries 14 Short Questions × 5 Marks + 3 Long Questions × 10 Marks = 100 Marks (Pass Marks: 40).',
  officialPdfPath:
    '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f61.pdf',
  papers: [NAYAB_SUBBA_PAPER_2, NAYAB_SUBBA_PAPER_3_ADMIN],
  serviceStreams: NAYAB_SUBBA_SERVICE_STREAMS,
};
