import type { PscSyllabusPaper } from './types.ts';

export const SECTION_OFFICER_PAPER_2: PscSyllabusPaper = {
  id: 'so-paper-2',
  code: 'Paper II',
  title: 'Governance Systems',
  nepaliTitle: 'शासन प्रणाली (सबै सेवाका लागि अनिवार्य र समान)',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    '10 Questions × 10 Marks = 100 Marks across Sections A (30M), B (20M), C (30M) & D (20M) · Separate answer booklets per section',
  scoringRule:
    'Minimum 40 marks required · Counted in 360-mark Final Merit Total (470-mark Foreign Service Merit)',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-p2-u1',
      branchNumber: 1,
      unitCode: 'Section A · Unit 1',
      title: 'State and Governance (3 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (क) राज्य र शासन (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Examines theoretical foundations of governance, political-administrative organs, statutory transparency under the Right to Information Act, nation/state building, national security architecture, and multi-level governance in Nepal.',
      subtopics: [
        '1.1 Fundamentals of governance (concept, context & characteristics) and 1.2 Political & administrative structures of governance',
        '1.3 Right to Information and transparency (RTI Act, 2064) and 1.4 Nation building and state building in Nepal',
        '1.5 Governance systems in Nepal, 1.6 National security management, and 1.7 Multi-level governance (informal, civil society, local, cooperative, corporate & UNO)',
      ],
      chapters: [
        {
          id: 'SO-P2-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'State and Governance',
          nepaliChapterName: '१. राज्य र शासन',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Evaluates how state authority is organized, legitimized, held transparent, secured, and shared across governmental and non-governmental actors in federal Nepal.',
          topics: [
            {
              id: 'SO-P2-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic:
                'Fundamentals of governance: concept, context and characteristics',
              nepaliTopic: 'शासनका आधारभूत पक्षहरू: अवधारणा, सन्दर्भ र विशेषताहरू',
              brief:
                'Explores the shift from traditional state-centric "government" to networked, citizen-centric "governance" encompassing rule of law, participation, responsiveness, consensus orientation, equity, effectiveness, and accountability. Analyzes good governance, e-governance, collaborative governance, and regulatory governance in developing democracies.',
            },
            {
              id: 'SO-P2-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic: 'Political and administrative structures of governance',
              nepaliTopic: 'शासनका राजनीतिक र प्रशासनिक संरचनाहरू',
              brief:
                'Compares parliamentary, presidential, and mixed political systems alongside unitary and federal state structures, highlighting the doctrine of separation of powers and checks and balances. Examines how elected political executives formulate policy while permanent meritocratic bureaucracies execute laws across federal, provincial, and local tiers.',
            },
            {
              id: 'SO-P2-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3',
              topic: 'Right to information and transparency',
              nepaliTopic: 'सूचनाको हक र पारदर्शिता',
              brief:
                'Grounded in Article 27 of the Constitution of Nepal and the Right to Information Act, 2064 (and Rules, 2065), covering proactive disclosure (Swatah प्रकाशन every 3 months), appointment of Information Officers, statutory exemptions (Section 3(3)), whistleblower protection, and the quasi-judicial mandate of the National Information Commission.',
            },
            {
              id: 'SO-P2-B01-CH01-T04',
              topicNumber: 4,
              code: '1.4',
              topic: 'Nation building and state building',
              nepaliTopic: 'राष्ट्र निर्माण र राज्य निर्माण',
              brief:
                'Distinguishes nation building (forging shared civic identity, emotional unity in diversity, social cohesion, and cultural inclusion under Article 3) from state building (constructing capable, legitimate, accountable public institutions, fiscal capacity, and rule-of-law enforcement across territory). Analyzes how both processes reinforce peace and federal stability in Nepal.',
            },
            {
              id: 'SO-P2-B01-CH01-T05',
              topicNumber: 5,
              code: '1.5',
              topic: 'Governance systems in Nepal',
              nepaliTopic: 'नेपालको शासन प्रणाली',
              brief:
                'Analyzes Nepal’s federal democratic republican parliamentary system established by the Constitution of Nepal (2072), characterized by three tiers of government (Federation, 7 Provinces, and 753 Local Levels) operating on cooperation, coexistence, and coordination (Article 232). Reviews historical transitions from unitary centralization to inclusive federal governance.',
            },
            {
              id: 'SO-P2-B01-CH01-T06',
              topicNumber: 6,
              code: '1.6',
              topic:
                'National security management: concept, scope and existing provisions in Nepal',
              nepaliTopic:
                'राष्ट्रिय सुरक्षा व्यवस्थापन: अवधारणा, क्षेत्र र नेपालमा विद्यमान व्यवस्था',
              brief:
                'Covers both traditional territorial/military defense and non-traditional human security dimensions (food, cyber, economic, health, environmental, and disaster security). Examines Part 28 of the Constitution—National Security Council (Article 266), Nepali Army (Article 267), Nepal Police, Armed Police Force, National Investigation Department—and the National Security Policy.',
            },
            {
              id: 'SO-P2-B01-CH01-T07',
              topicNumber: 7,
              code: '1.7',
              topic:
                'Multi-level governance and Nepal: informal governance, civil society governance, local governance, cooperative governance, corporate governance and the United Nations Organization',
              nepaliTopic:
                'बहुस्तरीय शासन र नेपाल: अनौपचारिक, नागरिक समाज, स्थानीय, सहकारी र संस्थागत (कर्पोरेट) शासन तथा संयुक्त राष्ट्रसंघ',
              brief:
                'Examines polycentric authority operating simultaneously below, alongside, and above the central state: customary/indigenous informal institutions (Guthi, Badghar, Bheja), civil society watchdogs, constitutional local governments, member-controlled cooperatives, ethical board-led corporate governance, and global norms set by the United Nations.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution of Nepal (Arts. 3, 27, 51, 232, 266–268) · Right to Information Act, 2064 · Good Governance Act, 2064',
      materialPath: '/materials/right-to-information-act-2064.pdf',
      materialTitle: 'Right to Information Act, 2064',
      quizHref: '/quiz/laws-and-constitution',
      quizLabel: 'RTI & Governance MCQs',
      writtenHref: '/written/PSC-WR-206',
      writtenLabel: 'RTI 5M Analytical Q&A',
      simulatePresetId: 'written-paper-2',
    },
    {
      id: 'so-p2-u2',
      branchNumber: 2,
      unitCode: 'Section B · Unit 2',
      title: 'Constitution and Law (2 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (ख) संविधान र कानून (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers constitutionalism, Nepal’s seven-constitution trajectory, the 2072 Constitution in full detail, human rights, civic duties, statutory law-making, rule of law, and proportional inclusion.',
      subtopics: [
        '2.1 Constitutionalism, 2.2 Constitutional development in Nepal, and 2.3 Present Constitution of Nepal (2.3.1–2.3.3)',
        '2.4 Human rights, 2.5 Civic sense and duties (Article 48), and 2.6 Sources of law & law-making process in Nepal',
        '2.7 Rule of law, democratic values & norms, inclusion, proportional representation, and affirmative action',
      ],
      chapters: [
        {
          id: 'SO-P2-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Constitution and Law',
          nepaliChapterName: '२. संविधान र कानून',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Tests doctrinal mastery of limited government, constitutional architecture, fundamental rights jurisprudence, legislative drafting, and substantive equality.',
          topics: [
            {
              id: 'SO-P2-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Constitutionalism',
              nepaliTopic: 'संविधानवाद',
              brief:
                'Analyzes constitutionalism as the doctrine of limited, accountable government bound by supreme fundamental law rather than arbitrary ruler discretion. Distinguishes political, legal, and transformative/social constitutionalism—emphasizing judicial review, entrenched fundamental rights, independent constitutional commissions, and civilian supremacy.',
            },
            {
              id: 'SO-P2-B02-CH02-T02',
              topicNumber: 2,
              code: '2.2',
              topic: 'Constitutional development in Nepal',
              nepaliTopic: 'नेपालमा संवैधानिक विकासक्रम',
              brief:
                'Traces the comparative evolution of Nepal’s seven constitutions—from the Government of Nepal Act 2004 BS, Interim Government of Nepal Act 2007 BS, Constitution of the Kingdom of Nepal 2015 BS, Panchayat Constitution 2019 BS, Democratic Constitution 2047 BS, and Interim Constitution 2063 BS to the Constituent Assembly-promulgated Constitution of Nepal 2072 BS.',
            },
            {
              id: 'SO-P2-B02-CH02-T03',
              topicNumber: 3,
              code: '2.3',
              topic: 'Present Constitution of Nepal',
              nepaliTopic: 'नेपालको वर्तमान संविधान (२०७२)',
              brief:
                'Comprehensive analytical study of the Constitution of Nepal promulgated on 3 Ashoj 2072 BS (35 Parts, 308 Articles, and 9 Schedules), covering state organs, rights, directive policies, and oversight institutions.',
              subtopics: [
                {
                  id: 'SO-P2-B02-CH02-T03-S01',
                  subtopicNumber: 1,
                  code: '2.3.1',
                  subtopic:
                    'Salient features of the Constitution, executive, legislative and judiciary',
                  nepaliSubtopic:
                    'संविधानका मूलभूत विशेषताहरू तथा कार्यपालिका, व्यवस्थापिका र न्यायपालिका',
                  brief:
                    'Examines popular sovereignty, secularism, republicanism, three-tier federalism, mixed electoral system, Federal Executive (Part 7) & Provincial/Local Executives, bicameral Federal Parliament (Parts 8–9), and the integrated three-tier Judiciary (Part 11: Supreme, High, and District Courts plus Local Judicial Committees under Art. 217).',
                },
                {
                  id: 'SO-P2-B02-CH02-T03-S02',
                  subtopicNumber: 2,
                  code: '2.3.2',
                  subtopic:
                    'Fundamental rights, directive principles and policies of the State',
                  nepaliSubtopic:
                    'मौलिक हक तथा राज्यका निर्देशक सिद्धान्त, नीति र दायित्व',
                  brief:
                    'Analyzes the 31 enforceable civil, political, economic, social, and cultural Fundamental Rights (Articles 16–46, implementation under Art. 47, writ jurisdiction under Arts. 133/144) alongside Part 4 Directive Principles (Art. 50), 13 State Policies (Art. 51), State Obligations (Art. 52), and parliamentary reporting (Art. 53).',
                },
                {
                  id: 'SO-P2-B02-CH02-T03-S03',
                  subtopicNumber: 3,
                  code: '2.3.3',
                  subtopic:
                    'Function and jurisdiction of constitutional and statutory bodies',
                  nepaliSubtopic:
                    'संवैधानिक तथा कानूनी निकायहरूको काम, कर्तव्य र क्षेत्राधिकार',
                  brief:
                    'Studies the appointment (Constitutional Council Art. 284), tenure, and powers of all 13 Constitutional Commissions (CIAA, OAG, PSC, Election Commission, NHRC, NNRFC, Women, Dalit, Inclusion, Indigenous Nationalities, Madhesi, Tharu, and Muslim Commissions) plus key statutory bodies such as NIC, NVC, and NPC.',
                },
              ],
            },
            {
              id: 'SO-P2-B02-CH02-T04',
              topicNumber: 4,
              code: '2.4',
              topic: 'Human rights',
              nepaliTopic: 'मानव अधिकार',
              brief:
                'Covers the universality, indivisibility, and inalienability of human rights across three generations of rights, UDHR (1948), core UN human rights treaties ratified by Nepal (ICCPR, ICESCR, CEDAW, CRC, CERD, CAT, CRPD), Nepal Treaty Act 2047 (Section 9), and National Human Rights Commission enforcement.',
            },
            {
              id: 'SO-P2-B02-CH02-T05',
              topicNumber: 5,
              code: '2.5',
              topic: 'Civic sense, duties and responsibilities of people',
              nepaliTopic: 'नागरिक चेतना तथा नागरिकका कर्तव्य र जिम्मेवारी',
              brief:
                'Examines constitutional duties of citizens under Article 48 (allegiance to the nation, abiding by the Constitution and law, compulsory public service when required by the State, and protecting/conserving public property) alongside civic ethics, tax compliance, electoral participation, and social harmony.',
            },
            {
              id: 'SO-P2-B02-CH02-T06',
              topicNumber: 6,
              code: '2.6',
              topic: 'Sources of law and law-making process in Nepal',
              nepaliTopic: 'कानूनका स्रोतहरू र नेपालमा कानून निर्माण प्रक्रिया',
              brief:
                'Reviews primary and secondary sources of law (Constitution, statutes, delegated legislation, judicial precedent/Stare Decisis under Art. 128(4), custom, and international treaties) and traces bill drafting, Money vs Non-Money Bills, parliamentary committee scrutiny, bicameral passage, and Presidential authentication (Articles 109–114).',
            },
            {
              id: 'SO-P2-B02-CH02-T07',
              topicNumber: 7,
              code: '2.7',
              topic:
                'Rule of law, democratic values and norms, inclusion, proportional representation and affirmative action',
              nepaliTopic:
                'कानूनी राज्य, लोकतान्त्रिक मूल्य र मान्यता, समावेशीकरण, समानुपातिक प्रतिनिधित्व र सकारात्मक विभेद',
              brief:
                'Integrates A.V. Dicey’s and modern substantive Rule of Law principles with pluralistic democratic norms, Article 42 Right to Social Justice, 45% inclusive reservation in civil service (Civil Service Act Section 7(7)), 40% PR seats in legislatures, and targeted affirmative action to achieve substantive equality.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution of Nepal (2072) · Nepal Treaty Act, 2047 · Civil Service Act, 2049 (Sec. 7)',
      materialPath: '/materials/constitution-of-nepal-2072.pdf',
      materialTitle: 'Constitution of Nepal (2072)',
      quizHref: '/quiz/custom?subject=Constitution%20%26%20Governance',
      quizLabel: 'Constitution MCQs',
      writtenHref: '/written/PSC-WR-201',
      writtenLabel: 'Fundamental Rights 10M Q&A',
      simulatePresetId: 'written-paper-2',
    },
    {
      id: 'so-p2-u3',
      branchNumber: 3,
      unitCode: 'Section C · Unit 3',
      title: 'Public Service and Public Management (3 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (ग) सार्वजनिक सेवा तथा सार्वजनिक व्यवस्थापन (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Focuses on public service ethos, delivery modalities, bureaucratic neutrality, fiscal ethics, NPM/NPS paradigms, public policy analysis, Citizen Charters, and digital e-governance.',
      subtopics: [
        '3.1 Concept, functions & role of public service, 3.2 Public service delivery, and 3.3 Political neutrality, commitment, transparency & accountability',
        '3.4 Utilization of public funds, ethics & morality, and 3.5 Public management, civil service & bureaucracy',
        '3.6 Public policy formulation & analysis, 3.7 Public Service Charter, and 3.8 E-governance',
      ],
      chapters: [
        {
          id: 'SO-P2-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Public Service and Public Management',
          nepaliChapterName: '३. सार्वजनिक सेवा तथा सार्वजनिक व्यवस्थापन',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Connects classical Weberian bureaucracy and contemporary public management models with ethical, responsive, technology-enabled service delivery in Nepal.',
          topics: [
            {
              id: 'SO-P2-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic:
                'Concept, functions, characteristics and role of public service',
              nepaliTopic:
                'सार्वजनिक सेवाको अवधारणा, कार्य, विशेषता र भूमिका',
              brief:
                'Defines public service as non-profit, Continuity-bound, equitable state action serving sovereign citizens from "cradle to grave." Examines sovereign regulatory functions, welfare redistribution, infrastructure facilitation, and its role as the visible bridge between citizens and the state.',
            },
            {
              id: 'SO-P2-B03-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic: 'Public service delivery',
              nepaliTopic: 'सार्वजनिक सेवा प्रवाह',
              brief:
                'Analyzes direct state delivery, local ward-level decentralization, outsourcing, PPP, co-production, one-stop service centers, and mobile camps (Ghumti Sewa) under the Good Governance (Management and Operation) Act, 2064. Evaluates bottlenecks in accessibility, timeliness, cost-effectiveness, and citizen satisfaction.',
            },
            {
              id: 'SO-P2-B03-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic:
                'Political neutrality, commitment, transparency and accountability',
              nepaliTopic:
                'राजनीतिक तटस्थता, प्रतिबद्धता, पारदर्शिता र उत्तरदायित्व',
              brief:
                'Reconciles non-partisan impartiality (serving any elected government objectively without party bias) with unwavering commitment to constitutional mandates and public welfare. Examines upward, horizontal, and downward/social accountability mechanisms in Nepal’s civil service.',
            },
            {
              id: 'SO-P2-B03-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic: 'Utilization of public funds, ethics and morality',
              nepaliTopic: 'सार्वजनिक कोषको सदुपयोग, सदाचार र नैतिकता',
              brief:
                'Applies fiduciary trusteeship and the 3Es (Economy, Efficiency, Effectiveness) to taxpayer funds under the Fiscal Procedures and Financial Accountability Act, 2076 and Prevention of Corruption Act, 2059. Covers conflict-of-interest avoidance, integrity policies, asset declaration, and public morality.',
            },
            {
              id: 'SO-P2-B03-CH03-T05',
              topicNumber: 5,
              code: '3.5',
              topic: 'Public management, civil service and bureaucracy',
              nepaliTopic: 'सार्वजनिक व्यवस्थापन, निजामती सेवा र कर्मचारीतन्त्र',
              brief:
                'Compares Max Weber’s rational-legal bureaucracy with New Public Management (NPM), New Public Service (NPS), and New Public Governance (NPG). Examines the structure, dysfunctions (red-tapism, status-quoism), and federal restructuring of Nepal’s civil service under Article 285 and the Civil Service Act, 2049.',
            },
            {
              id: 'SO-P2-B03-CH03-T06',
              topicNumber: 6,
              code: '3.6',
              topic: 'Public policy: formulation process and analysis',
              nepaliTopic: 'सार्वजनिक नीति: तर्जुमा प्रक्रिया र विश्लेषण',
              brief:
                'Traces the policy cycle—agenda setting, problem structuring, policy formulation, legitimation, implementation, monitoring, and impact evaluation. Analyzes rational, incremental, institutional, and participatory policy models alongside evidence-based policy gaps in Nepal.',
            },
            {
              id: 'SO-P2-B03-CH03-T07',
              topicNumber: 7,
              code: '3.7',
              topic: 'Public Service Charter',
              nepaliTopic: 'नागरिक वडापत्र (क्षतिपूर्ति सहितको नागरिक वडापत्र)',
              brief:
                'Examines Section 25 of the Good Governance Act, 2064 and Rules, 2065 mandating every public office to display required documents, service fees, time limits, responsible officials, and grievance officers, including Compensation-Based Citizen Charters when delays occur without valid cause.',
            },
            {
              id: 'SO-P2-B03-CH03-T08',
              topicNumber: 8,
              code: '3.8',
              topic: 'E-governance',
              nepaliTopic: 'विद्युतीय शासन (ई–गभर्नेन्स)',
              brief:
                'Covers G2C, G2B, G2G, and G2E digital service architecture, Nagarik App, National ID, GIOMS, Electronic Transaction Act 2063, E-Governance Blueprint/Commission, interoperability, cybersecurity, and bridging Nepal’s rural-urban digital divide.',
            },
          ],
        },
      ],
      keyReferences:
        'Civil Service Act, 2049 · Good Governance Act, 2064 · Electronic Transaction Act, 2063',
      materialPath: '/materials/civil-service-act-2049.pdf',
      materialTitle: 'Civil Service Act, 2049',
      quizHref: '/quiz/custom?subject=Public%20Administration%20%26%20Law',
      quizLabel: 'Public Admin MCQs',
      writtenHref: '/written/PSC-WR-205',
      writtenLabel: 'Good Governance 10M Q&A',
      simulatePresetId: 'written-paper-2',
    },
    {
      id: 'so-p2-u4',
      branchNumber: 4,
      unitCode: 'Section D · Unit 4',
      title: 'Resource Management and Planning (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (घ) स्रोत व्यवस्थापन र योजना (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers the four-pillar HRM cycle, Nepal’s planning and MTEF budgeting system, government accounting/auditing, social accountability in PFM, the 16th Periodic Plan, and participatory planning.',
      subtopics: [
        '4.1 Human Resource Management (procurement, development, utilization & maintenance) and 4.2 Public financial management: planning & budgeting system in Nepal',
        '4.3 Government accounting & auditing system in Nepal and 4.4 Financial management & social accountability',
        '4.5 Development planning & current periodic plan (16th Plan) and 4.6 Participatory planning & development',
      ],
      chapters: [
        {
          id: 'SO-P2-B04-CH04',
          chapterNumber: 4,
          code: 'Chapter 4',
          chapterName: 'Resource Management and Planning',
          nepaliChapterName: '४. स्रोत व्यवस्थापन र योजना',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Integrates strategic human capital management, public financial discipline, periodic macroeconomic planning, and bottom-up citizen participation.',
          topics: [
            {
              id: 'SO-P2-B04-CH04-T01',
              topicNumber: 1,
              code: '4.1',
              topic:
                'Human Resource Management: procurement, development, utilization and maintenance',
              nepaliTopic:
                'मानव स्रोत व्यवस्थापन: प्राप्ति, विकास, उपयोग र सम्भार',
              brief:
                'Analyzes the four core HRM functions in public administration: acquisition/procurement (HR planning, PSC merit recruitment), development (induction/in-service training via NASC, career paths), utilization (right-person-right-job placement, delegation, performance appraisal), and maintenance (fair compensation, morale, occupational safety, and post-retirement security).',
            },
            {
              id: 'SO-P2-B04-CH04-T02',
              topicNumber: 2,
              code: '4.2',
              topic:
                'Public financial management: planning and budgeting system in Nepal',
              nepaliTopic:
                'सार्वजनिक वित्तीय व्यवस्थापन: नेपालमा योजना तथा बजेट प्रणाली',
              brief:
                'Examines linking periodic plans with annual budgets through the three-year Medium-Term Expenditure Framework (MTEF), National Project Bank, resource estimation committee, LMBIS/PLMBIS/SuTRA, and constitutional budget presentation timelines (Jestha 15 federal, Ashadh 1 provincial, Ashadh 10 local).',
            },
            {
              id: 'SO-P2-B04-CH04-T03',
              topicNumber: 3,
              code: '4.3',
              topic: 'Government accounting and auditing system in Nepal',
              nepaliTopic: 'नेपालको सरकारी लेखा तथा लेखापरीक्षण प्रणाली',
              brief:
                'Covers FCGO-administered Treasury Single Account (TSA), CGAS, RMIS, PAMS, NPSAS-aligned financial reporting, internal control and internal audit by Treasury Controller Offices (DTCO/PTCO), and independent final constitutional audit by the Office of the Auditor General under Article 241 and the Audit Act, 2075.',
            },
            {
              id: 'SO-P2-B04-CH04-T04',
              topicNumber: 4,
              code: '4.4',
              topic: 'Financial management and social accountability',
              nepaliTopic: 'वित्तीय व्यवस्थापन र सामाजिक उत्तरदायित्व',
              brief:
                'Links fiscal discipline and value-for-money expenditure with citizen-led oversight tools—participatory budgeting, public audit (Sarwajanik Parikshan), social audit, public hearing, expenditure tracking surveys, and transparent disclosure of procurement and grant utilization.',
            },
            {
              id: 'SO-P2-B04-CH04-T05',
              topicNumber: 5,
              code: '4.5',
              topic: 'Development planning and current periodic plan',
              nepaliTopic: 'विकास योजना र चालु आवधिक योजना (सोह्रौं योजना)',
              brief:
                'Reviews seven decades of planned development in Nepal since 2013 BS and analyzes the Sixteenth Periodic Plan (FY 2081/82–2085/86) built on the vision "Good Governance, Social Justice, and Prosperity," targeting smooth LDC graduation in 2026, structural economic transformation, capital expenditure efficiency, and SDG localization.',
            },
            {
              id: 'SO-P2-B04-CH04-T06',
              topicNumber: 6,
              code: '4.6',
              topic: 'Participatory planning and development',
              nepaliTopic: 'सहभागितामूलक योजना तथा विकास',
              brief:
                'Studies bottom-up planning where local communities, marginalized groups, and user committees actively participate in need identification, prioritization (7-step local level planning process under LGOA 2074), co-implementation, benefit sharing, and community monitoring for sustainable local ownership.',
            },
          ],
        },
      ],
      keyReferences:
        'Fiscal Procedures & Financial Accountability Act, 2076 · Audit Act, 2075 · 16th Periodic Plan (2081/82–2085/86)',
      materialPath: '/materials/public-procurement-fiscal-act.pdf',
      materialTitle: 'Procurement & Fiscal Accountability Act',
      quizHref: '/quiz/psc-and-planning',
      quizLabel: 'Planning & PFM Quiz',
      writtenHref: '/written/PSC-WR-302',
      writtenLabel: 'Capital Budget 10M Q&A',
      simulatePresetId: 'written-paper-2',
    },
  ],
};

export const SECTION_OFFICER_PAPER_3: PscSyllabusPaper = {
  id: 'so-paper-3',
  code: 'Paper III',
  title: 'Contemporary Issues',
  nepaliTitle: 'समसामयिक विषय (सबै सेवाका लागि अनिवार्य र समान)',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '3 Hours',
  questionBreakdown:
    '10 Questions × 10 Marks = 100 Marks across Sections A (30M), B (20M), C (30M) & D (20M) · Separate answer booklets per section',
  scoringRule:
    'Minimum 40 marks required · Counted in 360-mark Final Merit Total (470-mark Foreign Service Merit)',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'so-p3-u1',
      branchNumber: 1,
      unitCode: 'Section A · Unit 1',
      title: 'Social Issues (3 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (क) सामाजिक मामिलाहरू (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Analyzes social conflict resolution, distributive justice, social security, cultural mobilization, demographic shifts, transnational/organized crimes, and food sovereignty in Nepal.',
      subtopics: [
        '1.1 Social disputes & conflict, 1.2 Social justice & equality, 1.3 Socio-cultural transformation, and 1.4 Distributive justice & marginalization',
        '1.5 Social protection & social security, 1.6 Cultural diversity & social mobilization, and 1.7 Population, migration, urbanization, aging & refugees',
        '1.8 Organized crime (cyber crime, trafficking, cartelling, terrorism, corruption & money laundering) and 1.9 Food sovereignty & security',
      ],
      chapters: [
        {
          id: 'SO-P3-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Social Issues',
          nepaliChapterName: '१. सामाजिक मामिलाहरू',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Evaluates structural social inequities, demographic pressures, organized criminal threats, and rights-based social protection policies in contemporary Nepal.',
          topics: [
            {
              id: 'SO-P3-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic: 'Social disputes and conflict',
              nepaliTopic: 'सामाजिक विवाद तथा द्वन्द्व',
              brief:
                'Examines structural, identity-based, resource-driven, and ideological causes of social conflict alongside conflict resolution, mediation, Local Judicial Committee dispute settlement (Art. 217), transitional justice, and sustainable peacebuilding.',
            },
            {
              id: 'SO-P3-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic: 'Social justice and equality',
              nepaliTopic: 'सामाजिक न्याय र समानता',
              brief:
                'Analyzes formal vs substantive equality, John Rawls’ principles of justice, Article 18 Right to Equality, Article 24 Rights against Untouchability, and Article 42 Right to Social Justice ensuring dignified representation and opportunity for historically excluded groups.',
            },
            {
              id: 'SO-P3-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3',
              topic: 'Social and cultural transformation',
              nepaliTopic: 'सामाजिक तथा सांस्कृतिक रूपान्तरण',
              brief:
                'Studies modernization, education, remittance-led household shifts, digital media, gender empowerment, and legal reforms eliminating harmful traditional practices (Chhaupadi, dowry, witchcraft accusations, child marriage, caste discrimination) while preserving positive heritage.',
            },
            {
              id: 'SO-P3-B01-CH01-T04',
              topicNumber: 4,
              code: '1.4',
              topic:
                'Distributive justice of resources: disparities and marginalization (regional, caste/ethnicity, gender, rural and urban)',
              nepaliTopic:
                'स्रोतहरूको वितरणात्मक न्याय: असमानता र सीमान्तीकरण (क्षेत्रीय, जातीय, लैङ्गिक तथा ग्रामीण र शहरी)',
              brief:
                'Evaluates multi-dimensional inequality across ecological belts, provinces, gender, Dalit/indigenous/Madhesi communities, and rural-urban divides—and how fiscal equalization grants (Art. 60, NNRFC), progressive taxation, and targeted investments redress marginalization.',
            },
            {
              id: 'SO-P3-B01-CH01-T05',
              topicNumber: 5,
              code: '1.5',
              topic:
                'Social protection, social security and social responsibility',
              nepaliTopic:
                'सामाजिक संरक्षण, सामाजिक सुरक्षा र सामाजिक उत्तरदायित्व',
              brief:
                'Covers life-cycle social safety nets (Social Security Act, 2075), contributory Social Security Fund (Contribution-Based Social Security Act, 2074), health insurance, Article 43 Right to Social Security, fiscal sustainability of allowances, and Corporate Social Responsibility (CSR).',
            },
            {
              id: 'SO-P3-B01-CH01-T06',
              topicNumber: 6,
              code: '1.6',
              topic: 'Cultural diversity and social mobilization',
              nepaliTopic: 'सांस्कृतिक विविधता र सामाजिक परिचालन',
              brief:
                'Examines Nepal’s multi-ethnic, multi-lingual (124 languages), and multi-religious mosaic (Census 2078) as social capital, and analyzes social mobilization strategies empowering mothers’ groups, community forest user groups, and youth clubs in local governance.',
            },
            {
              id: 'SO-P3-B01-CH01-T07',
              topicNumber: 7,
              code: '1.7',
              topic:
                'Population: settlement, migration, urbanization, aging, refugee and displaced population',
              nepaliTopic:
                'जनसङ्ख्या: बसोबास, बसाइँसराइ, शहरीकरण, ज्येष्ठ नागरिक, शरणार्थी र विस्थापित जनसङ्ख्या',
              brief:
                'Analyzes Census 2078 findings (29,164,578 population; 0.92% growth; 53.61% Terai concentration; 34 depopulating hill districts), youth out-migration/brain drain, unplanned urbanization, demographic transition toward an aging society, climate-induced displacement, and refugee management.',
            },
            {
              id: 'SO-P3-B01-CH01-T08',
              topicNumber: 8,
              code: '1.8',
              topic:
                'Organized crime: cyber crime, human trafficking, cartelling/monopoly, terrorism, corruption and money laundering',
              nepaliTopic:
                'संगठित अपराध: साइबर अपराध, मानव बेचबिखन, कार्टेलिङ/एकाधिकार, आतंकवाद, भ्रष्टाचार र सम्पत्ति शुद्धीकरण',
              brief:
                'Examines transnational and organized criminal networks under the Organized Crime Prevention Act 2070, Electronic Transaction Act 2063, Human Trafficking Control Act 2064, Consumer Protection/Competition Act, Prevention of Corruption Act 2059, and Asset (Money) Laundering Prevention Act 2064 (FATF compliance).',
            },
            {
              id: 'SO-P3-B01-CH01-T09',
              topicNumber: 9,
              code: '1.9',
              topic: 'Food sovereignty and security',
              nepaliTopic: 'खाद्य सम्प्रभुता र खाद्य सुरक्षा',
              brief:
                'Distinguishes the four pillars of food security (availability, access, utilization, stability) from farmers’ right to food sovereignty enshrined in Article 36 of the Constitution and operationalized through the Right to Food and Food Sovereignty Act, 2075.',
            },
          ],
        },
      ],
      keyReferences:
        'Prevention of Corruption Act, 2059 · Right to Food Act, 2075 · AML Act, 2064 · Census 2078',
      materialPath: '/materials/corruption-prevention-act-2059.pdf',
      materialTitle: 'Prevention of Corruption Act, 2059',
      quizHref:
        '/quiz/custom?source=%2Fmaterials%2Fcorruption-prevention-act-2059.pdf',
      quizLabel: 'Anti-Corruption MCQs',
      writtenHref: '/written/PSC-WR-305',
      writtenLabel: 'Diversity & Youth 5M Q&A',
      simulatePresetId: 'written-paper-3',
    },
    {
      id: 'so-p3-u2',
      branchNumber: 2,
      unitCode: 'Section B · Unit 2',
      title: 'Economic Issues (2 Questions × 10 Marks)',
      nepaliTitle: 'खण्ड (ख) आर्थिक मामिलाहरू (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers macroeconomic growth vs development, productive sectors, three-pillar economy, foreign aid/FDI, technology transfer/IPR, trade liberalization, economic diplomacy, and poverty/unemployment.',
      subtopics: [
        '2.1 Economic growth & economic development, 2.2 Major aspects of economic development (agriculture, industry, trade, tourism, foreign employment & HR), and 2.3 Public, private & cooperative sectors',
        '2.4 Foreign assistance & cooperation, 2.5 Foreign investment (FDI & portfolio), 2.6 Technology transfer & IPR, and 2.7 Trade, market & labour liberalization',
        '2.8 Economic diplomacy and 2.9 Poverty & unemployment',
      ],
      chapters: [
        {
          id: 'SO-P3-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Economic Issues',
          nepaliChapterName: '२. आर्थिक मामिलाहरू',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Assesses structural bottlenecks, external sector resilience, investment climate, and inclusive growth strategies of the Nepalese economy.',
          topics: [
            {
              id: 'SO-P3-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Economic growth and economic development',
              nepaliTopic: 'आर्थिक वृद्धि र आर्थिक विकास',
              brief:
                'Contrasts quantitative real GDP expansion (economic growth) with multi-dimensional structural transformation in living standards, human capabilities, equity, and institutional quality (economic development), analyzing Nepal’s low-productivity trap and post-2026 LDC graduation imperatives.',
            },
            {
              id: 'SO-P3-B02-CH02-T02',
              topicNumber: 2,
              code: '2.2',
              topic:
                'Major aspects of economic development: agriculture, industry, trade, tourism, foreign employment and human resources',
              nepaliTopic:
                'आर्थिक विकासका प्रमुख पक्षहरू: कृषि, उद्योग, व्यापार, पर्यटन, वैदेशिक रोजगारी र मानव स्रोत',
              brief:
                'Examines commercialization of agriculture, premature deindustrialization, structural trade deficit, high-value sustainable tourism, safe/productive utilization of remittances and returnee skills, and domestic human capital formation.',
            },
            {
              id: 'SO-P3-B02-CH02-T03',
              topicNumber: 3,
              code: '2.3',
              topic: 'Role of public, private and cooperative sectors',
              nepaliTopic: 'सार्वजनिक, निजी र सहकारी क्षेत्रको भूमिका',
              brief:
                'Analyzes Nepal’s constitutional three-pillar economic model (Article 50(3) & 51(d)), delineating the state’s regulatory/welfare/infrastructure role, the private sector’s engine-of-growth and innovation role, and cooperatives’ grassroots savings/production role—alongside cooperative governance reforms.',
            },
            {
              id: 'SO-P3-B02-CH02-T04',
              topicNumber: 4,
              code: '2.4',
              topic: 'Foreign assistance and international cooperation',
              nepaliTopic: 'वैदेशिक सहायता र अन्तर्राष्ट्रिय सहयोग',
              brief:
                'Evaluates grants, concessional loans, and technical assistance under the International Development Cooperation Policy, examining aid alignment with national budgetary priorities, absorptive capacity constraints, debt sustainability, and concessional financing shifts after LDC graduation.',
            },
            {
              id: 'SO-P3-B02-CH02-T05',
              topicNumber: 5,
              code: '2.5',
              topic: 'Foreign investment (portfolio and direct)',
              nepaliTopic: 'वैदेशिक लगानी (प्रत्यक्ष तथा पोर्टफोलियो लगानी)',
              brief:
                'Distinguishes long-term greenfield/joint-venture Foreign Direct Investment (FITTA, 2075; Investment Board Act, 2068) from cross-border Foreign Portfolio Investment, analyzing sovereign credit ratings, single-window clearance, profit repatriation, and investment climate reforms.',
            },
            {
              id: 'SO-P3-B02-CH02-T06',
              topicNumber: 6,
              code: '2.6',
              topic:
                'Technology transfer including intellectual property rights',
              nepaliTopic: 'प्रविधि हस्तान्तरण तथा बौद्धिक सम्पत्ति अधिकार',
              brief:
                'Covers licensing, joint ventures, digital know-how diffusion, and protection of patents, designs, trademarks, geographical indications, and copyrights under Nepal’s Patent, Design and Trademark Act, Copyright Act, and WTO TRIPS obligations.',
            },
            {
              id: 'SO-P3-B02-CH02-T07',
              topicNumber: 7,
              code: '2.7',
              topic: 'Trade, market and labour liberalization',
              nepaliTopic: 'व्यापार, बजार र श्रम उदारीकरण',
              brief:
                'Examines tariff rationalization, WTO/SAFTA/BIMSTEC integration, competitive market regulation against cartels, cross-border labor mobility, bilateral labor agreements, and safeguarding domestic infant industries and workers’ rights.',
            },
            {
              id: 'SO-P3-B02-CH02-T08',
              topicNumber: 8,
              code: '2.8',
              topic: 'Economic diplomacy',
              nepaliTopic: 'आर्थिक कूटनीति',
              brief:
                'Analyzes leveraging Nepal’s diplomatic missions and MoFA-MoF-private sector coordination to expand export market access, attract FDI and climate finance, promote tourism and hydropower trade, and protect Nepali migrant workers abroad.',
            },
            {
              id: 'SO-P3-B02-CH02-T09',
              topicNumber: 9,
              code: '2.9',
              topic: 'Poverty and unemployment',
              nepaliTopic: 'गरिबी र बेरोजगारी',
              brief:
                'Evaluates absolute monetary poverty (NLSS IV: 20.27%) and Multidimensional Poverty Index (MPI), structural/seasonal/educated youth unemployment, Prime Minister Employment Programme, entrepreneurship ecosystems, and skill-market alignment under the 16th Plan.',
            },
          ],
        },
      ],
      keyReferences:
        'Sixteenth Periodic Plan (2081/82–2085/86) · Economic Survey · FITTA, 2075',
      materialPath: '/materials/sixteenth-plan-summary.pdf',
      materialTitle: 'Sixteenth Periodic Plan Summary',
      quizHref: '/quiz/psc-and-planning',
      quizLabel: '16th Plan & Economy Quiz',
      writtenHref: '/written/PSC-WR-301',
      writtenLabel: '16th Plan 10M Q&A',
      simulatePresetId: 'written-paper-3',
    },
    {
      id: 'so-p3-u3',
      branchNumber: 3,
      unitCode: 'Section C · Unit 3',
      title: 'Developmental Issues (3 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (ग) विकाससँग सम्बद्ध मामिलाहरू (३ प्रश्न × १० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Examines human and infrastructure development, sustainable resource carrying capacity, state/non-state roles, conflict-sensitive peacebuilding, decentralization, citizen/community partnerships, ICT, and globalization.',
      subtopics: [
        '3.1 Human development, 3.2 Infrastructure development, 3.3 Sustainable development (land, water & natural resources: carrying capacity & policy), and 3.4 State & non-state actors',
        '3.5 Peace & conflict-sensitive development, 3.6 Decentralization & local self-governance, and 3.7 Citizen engagement in development',
        '3.8 Partnership & community-based development, 3.9 Role of ICT in development, and 3.10 Globalization & development',
      ],
      chapters: [
        {
          id: 'SO-P3-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Developmental Issues',
          nepaliChapterName: '३. विकाससँग सम्बद्ध मामिलाहरू',
          marksAllocation: '3 Questions × 10 Marks = 30 Marks',
          chapterBrief:
            'Synthesizes people-centered capability expansion, resilient infrastructure, federal decentralization, and global development dynamics.',
          topics: [
            {
              id: 'SO-P3-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic: 'Human development',
              nepaliTopic: 'मानव विकास',
              brief:
                'Grounded in Amartya Sen and Mahbub ul Haq’s capability approach—measuring longevity, knowledge, and decent living standards (HDI, IHDI, GDI, GII)—and analyzing quality healthcare, foundational/technical education, and nutrition investments in Nepal.',
            },
            {
              id: 'SO-P3-B03-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic: 'Infrastructure development',
              nepaliTopic: 'पूर्वाधार विकास',
              brief:
                'Analyzes strategic transport (expressways, corridors, tunnels, aviation), clean hydropower generation & cross-border transmission, irrigation, urban utilities, and National Pride Projects—focusing on land acquisition delays, procurement bottlenecks, and lifecycle maintenance.',
            },
            {
              id: 'SO-P3-B03-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic:
                'Sustainable development (land, water and natural resources: carrying capacity and development policy)',
              nepaliTopic:
                'दिगो विकास (भूमि, जल तथा प्राकृतिक स्रोत: भारवहन क्षमता र विकास नीति)',
              brief:
                'Integrates the 2030 Agenda (17 SDGs), intergenerational equity, Land Use Act 2076 zoning, integrated water resources management, and ecological carrying capacity so fragile Chure and Himalayan ecosystems are not degraded by unplanned excavation or roads.',
            },
            {
              id: 'SO-P3-B03-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic:
                'Role of state and non-state actors in development process',
              nepaliTopic: 'विकास प्रक्रियामा राज्य र गैर–राज्य पात्रहरूको भूमिका',
              brief:
                'Examines complementarity and regulatory accountability among the developmental state, private investors, cooperatives, NGOs/INGOs, community organizations, diaspora networks, media, and think tanks.',
            },
            {
              id: 'SO-P3-B03-CH03-T05',
              topicNumber: 5,
              code: '3.5',
              topic: 'Peace and conflict-sensitive development',
              nepaliTopic: 'शान्ति र द्वन्द्व संवेदनशील विकास',
              brief:
                'Applies the "Do No Harm" principle to ensure development projects, resource sharing, and employment opportunities reduce horizontal grievances rather than inadvertently intensifying ethnic, regional, or local disputes.',
            },
            {
              id: 'SO-P3-B03-CH03-T06',
              topicNumber: 6,
              code: '3.6',
              topic: 'Decentralization and local self-governance',
              nepaliTopic: 'विकेन्द्रीकरण र स्थानीय स्वायत्त शासन',
              brief:
                'Distinguishes deconcentration, delegation, and constitutional devolution—analyzing Schedule 8 exclusive and Schedule 9 concurrent powers exercised by Nepal’s 753 local governments under the Local Government Operation Act, 2074 and the principle of subsidiarity.',
            },
            {
              id: 'SO-P3-B03-CH03-T07',
              topicNumber: 7,
              code: '3.7',
              topic: 'Citizen engagement in development',
              nepaliTopic: 'विकासमा नागरिक संलग्नता',
              brief:
                'Moves beyond token consultation along Arnstein’s ladder toward active citizen co-design, ward-level Tole Bikash Sanstha deliberation, beneficiary oversight, and civic feedback loops.',
            },
            {
              id: 'SO-P3-B03-CH03-T08',
              topicNumber: 8,
              code: '3.8',
              topic: 'Partnership and community-based development',
              nepaliTopic: 'साझेदारी तथा समुदायमा आधारित विकास',
              brief:
                'Studies Public-Private Partnerships (PPP and Investment Act, 2075) alongside Nepal’s globally recognized Community Forestry, rural drinking water, and micro-hydro models—while addressing elite capture and fiduciary risks in user committees.',
            },
            {
              id: 'SO-P3-B03-CH03-T09',
              topicNumber: 9,
              code: '3.9',
              topic: 'Role of ICT in development',
              nepaliTopic: 'विकासमा सूचना तथा सञ्चार प्रविधिको भूमिका',
              brief:
                'Examines Digital Nepal Framework initiatives across e-education, telemedicine, digital agriculture advisories, fintech/digital payments, IT service exports, and AI-assisted governance.',
            },
            {
              id: 'SO-P3-B03-CH03-T10',
              topicNumber: 10,
              code: '3.10',
              topic: 'Globalization and development',
              nepaliTopic: 'विश्वव्यापीकरण र विकास',
              brief:
                'Evaluates economic, technological, and cultural globalization alongside rising geo-economic fragmentation—analyzing opportunities in global value chains, knowledge flows, and diaspora linkages versus vulnerability to external supply-chain and price shocks.',
            },
          ],
        },
      ],
      keyReferences:
        'Local Government Operation Act, 2074 · Land Use Act, 2076 · PPP & Investment Act, 2075',
      materialPath: '/materials/local-government-operation-act-2074.pdf',
      materialTitle: 'Local Government Operation Act, 2074',
      quizHref:
        '/quiz/custom?source=%2Fmaterials%2Flocal-government-operation-act-2074.pdf',
      quizLabel: 'Local Governance MCQs',
      writtenHref: '/written/PSC-WR-304',
      writtenLabel: 'Economic Diplomacy 5M Q&A',
      simulatePresetId: 'written-paper-3',
    },
    {
      id: 'so-p3-u4',
      branchNumber: 4,
      unitCode: 'Section D · Unit 4',
      title: 'Environmental Issues (2 Questions × 10 Marks)',
      nepaliTitle:
        'खण्ड (घ) वातावरणसँग सम्बद्ध मामिलाहरू (२ प्रश्न × १० = २० अङ्क)',
      marksWeight: 20,
      branchSummary:
        'Covers ecosystems, biodiversity conservation, climate finance/carbon trade, environmental degradation, deforestation, disaster risk governance, green growth, clean energy, and waste management.',
      subtopics: [
        '4.1 Ecosystem, 4.2 Biodiversity & conservation, 4.3 Climate change & carbon trade, 4.4 Environment degradation, and 4.5 Deforestation',
        '4.6 Crisis/Disaster management, 4.7 Environment & development, 4.8 Energy crisis & conservation, and 4.9 Pollution & waste management',
      ],
      chapters: [
        {
          id: 'SO-P3-B04-CH04',
          chapterNumber: 4,
          code: 'Chapter 4',
          chapterName: 'Environmental Issues',
          nepaliChapterName: '४. वातावरणसँग सम्बद्ध मामिलाहरू',
          marksAllocation: '2 Questions × 10 Marks = 20 Marks',
          chapterBrief:
            'Addresses ecological resilience, Himalayan climate vulnerability, multi-hazard disaster risk reduction, and clean energy transition.',
          topics: [
            {
              id: 'SO-P3-B04-CH04-T01',
              topicNumber: 1,
              code: '4.1',
              topic: 'Ecosystem',
              nepaliTopic: 'पारिस्थितिकीय प्रणाली (इकोसिस्टम)',
              brief:
                'Studies biotic and abiotic interactions, food webs, trophic energy flow, biogeochemical cycles, and ecosystem services across Nepal’smountain, hill, wetland (Ramsar), forest, and Terai agro-ecosystems.',
            },
            {
              id: 'SO-P3-B04-CH04-T02',
              topicNumber: 2,
              code: '4.2',
              topic: 'Biodiversity and conservation',
              nepaliTopic: 'जैविक विविधता र संरक्षण',
              brief:
                'Covers genetic, species, and ecosystem diversity, in-situ conservation (12 National Parks, 1 Wildlife Reserve, 1 Hunting Reserve, 6 Conservation Areas, 13 Buffer Zones covering ~23.39% of Nepal’s area) and ex-situ gene banks, wildlife corridors, and human-wildlife conflict mitigation.',
            },
            {
              id: 'SO-P3-B04-CH04-T03',
              topicNumber: 3,
              code: '4.3',
              topic: 'Climate change and carbon trade',
              nepaliTopic: 'जलवायु परिवर्तन र कार्बन व्यापार',
              brief:
                'Analyzes greenhouse gas forcing, accelerated Hindu Kush-Himalayan cryosphere melt and GLOF risks, UNFCCC/Paris Agreement Article 6 carbon markets, REDD+ forest carbon payments, Loss and Damage Fund, Nepal’s NDCs, National Adaptation Plan, and 2045 Net-Zero target.',
            },
            {
              id: 'SO-P3-B04-CH04-T04',
              topicNumber: 4,
              code: '4.4',
              topic: 'Environment degradation',
              nepaliTopic: 'वातावरणीय ह्रास',
              brief:
                'Examines topsoil erosion, Chure-Bhabar fragility, river-bed over-extraction, groundwater depletion, agrochemical contamination, and habitat fragmentation alongside statutory mitigation under the Environment Protection Act, 2076.',
            },
            {
              id: 'SO-P3-B04-CH04-T05',
              topicNumber: 5,
              code: '4.5',
              topic: 'Deforestation',
              nepaliTopic: 'वन विनाश',
              brief:
                'Evaluates drivers of forest loss and degradation—encroachment, forest wildfires, linear infrastructure, and unsustainable harvesting—against sustainable forest management and community-based conservation under the Forest Act, 2076.',
            },
            {
              id: 'SO-P3-B04-CH04-T06',
              topicNumber: 6,
              code: '4.6',
              topic: 'Crisis/Disaster management',
              nepaliTopic: 'संकट तथा विपद् व्यवस्थापन',
              brief:
                'Covers the full disaster management cycle—risk assessment, prevention/mitigation, early warning preparedness, emergency response, and "Build Back Better" recovery—under the Disaster Risk Reduction and Management Act, 2074, NDRRMA, Sendai Framework, and three-tier disaster committees.',
            },
            {
              id: 'SO-P3-B04-CH04-T07',
              topicNumber: 7,
              code: '4.7',
              topic: 'Environment and development',
              nepaliTopic: 'वातावरण र विकास',
              brief:
                'Balances infrastructure and industrial growth with Article 30 Right to Clean Environment through Brief Environmental Study (BES), Initial Environmental Examination (IEE), Environmental Impact Assessment (EIA), green economy principles, and circular resource use.',
            },
            {
              id: 'SO-P3-B04-CH04-T08',
              topicNumber: 8,
              code: '4.8',
              topic: 'Energy crisis and energy conservation',
              nepaliTopic: 'ऊर्जा संकट र ऊर्जा संरक्षण',
              brief:
                'Analyzes dry-season vs wet-season hydro generation asymmetry, fossil-fuel import dependence, reservoir/pumped-storage hydropower, solar mix, electric mobility, industrial electrification, and energy-efficiency auditing.',
            },
            {
              id: 'SO-P3-B04-CH04-T09',
              topicNumber: 9,
              code: '4.9',
              topic: 'Pollution and waste management',
              nepaliTopic: 'प्रदूषण र फोहोरमैला व्यवस्थापन',
              brief:
                'Examines air, water, soil, noise, plastic, biomedical, and e-waste pollution control, the 3R/circular waste hierarchy, source segregation, and municipal responsibilities under the Solid Waste Management Act, 2068 and LGOA, 2074.',
            },
          ],
        },
      ],
      keyReferences:
        'Environment Protection Act, 2076 · DRRM Act, 2074 · Solid Waste Management Act, 2068',
      materialPath: '/materials/nepal-parichaya-geography.pdf',
      materialTitle: 'Physical Geography & Ecology',
      writtenHref: '/written/PSC-WR-303',
      writtenLabel: 'Climate Resilience 10M Q&A',
      simulatePresetId: 'written-paper-3',
    },
  ],
};
