export type WrittenPaperCode =
  | 'Paper II: Governance Systems'
  | 'Paper III: Contemporary Issues & Development'
  | 'Paper IV: Service Delivery & Case Analysis';

export type WrittenQuestionMarks = 5 | 10;

export type WrittenQuestionType =
  | 'Short Analytical'
  | 'Long Analytical'
  | 'Case Study';

export interface BilingualSection {
  heading: string;
  points: string[];
}

export interface LocalizedAnswerContent {
  title: string;
  question: string;
  marksAllocation: string;
  introduction: string;
  sections: BilingualSection[];
  conclusion: string;
}

export interface BilingualRubricPoint {
  en: string;
  ne: string;
}

export interface WrittenQuestion {
  id: string;
  paper: WrittenPaperCode;
  subject: string;
  postTarget: string;
  marks: WrittenQuestionMarks;
  recommendedMinutes: number;
  questionType: WrittenQuestionType;
  sourceTitle: string;
  sourcePath: string;
  en: LocalizedAnswerContent;
  ne: LocalizedAnswerContent;
  rubric: BilingualRubricPoint[];
}

export const WRITTEN_PAPERS: readonly WrittenPaperCode[] = [
  'Paper II: Governance Systems',
  'Paper III: Contemporary Issues & Development',
  'Paper IV: Service Delivery & Case Analysis',
] as const;

export const WRITTEN_QUESTIONS: WrittenQuestion[] = [
  {
    id: 'PSC-WR-201',
    paper: 'Paper II: Governance Systems',
    subject: 'Constitution & Fundamental Rights',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
    en: {
      title: 'Constitutionalism, Fundamental Rights & Enforcement Challenges',
      question:
        'Clarify the concept of fundamental rights and analyze the major challenges in ensuring the effective enforcement of fundamental rights enshrined in the Constitution of Nepal, along with practical measures for reform.',
      marksAllocation: '3 + 4 + 3 = 10 Marks',
      introduction:
        'Fundamental rights are constitutionally guaranteed, enforceable human rights essential for human dignity, liberty, and holistic citizen development. Part 3 (Articles 16 to 46) of the Constitution of Nepal (2072) enshrines 31 broad civil, political, economic, social, and cultural rights, backed by judicial remedies under Articles 46, 133, and 144.',
      sections: [
        {
          heading: '1. Core Characteristics of Fundamental Rights in Nepal',
          points: [
            'Expansion from classical civil-political liberties to progressive socio-economic entitlements including health (Art. 35), education (Art. 31), food sovereignty (Art. 36), housing (Art. 37), and social security (Art. 43).',
            'Targeted group-specific rights protecting women (Art. 38), children (Art. 39), Dalits (Art. 40), senior citizens (Art. 41), and marginalized communities (Art. 42).',
            'Constitutional mandate under Article 47 requiring statutory enactment within three years and extraordinary writ jurisdiction of the Supreme Court and High Courts.',
          ],
        },
        {
          heading: '2. Key Challenges in Practical Enforcement',
          points: [
            'Fiscal and institutional gap: Ambitious socio-economic rights (employment, housing, free basic healthcare) outpace state revenue capacity and local infrastructure.',
            'Subordinate legislation bottlenecks: Although foundational Acts were passed under Article 47, delayed regulations (Niyamawali) and procedural guidelines hinder frontline execution.',
            'Inter-tier ambiguity: Unclear functional delineation among Federal, Provincial, and Local levels creates overlapping accountability in basic education, health, and social protection.',
            'Limited legal literacy and access to justice: Rural and marginalized citizens face geographical, financial, and procedural barriers in invoking constitutional remedies.',
          ],
        },
        {
          heading: '3. Practical Way Forward',
          points: [
            'Align annual federal, provincial, and local budgets directly with progressive realization benchmarks for socio-economic rights.',
            'Promptly promulgate pending regulations and establish clear service-delivery standards at all 753 local judicial and administrative units.',
            'Expand free legal aid, mobile public service camps, and civic awareness in local mother tongues.',
          ],
        },
      ],
      conclusion:
        'Constitutional rights gain meaning only when translated from parchment promises into lived citizen experience. Resource-backed legislation, coordinated three-tier execution, and accessible judicial oversight are indispensable to realize Part 3 of the Constitution.',
    },
    ne: {
      title: 'संवैधानिकता, मौलिक हक र कार्यान्वयनका चुनौतीहरू',
      question:
        'मौलिक हकको अवधारणा स्पष्ट पार्दै नेपालको संविधानमा व्यवस्था गरिएका मौलिक हकहरूको प्रभावकारी कार्यान्वयनमा देखिएका प्रमुख चुनौतीहरू र सुधारका व्यावहारिक उपायहरूको विश्लेषण गर्नुहोस् ।',
      marksAllocation: '३ + ४ + ३ = १० अङ्क',
      introduction:
        'नागरिकको सम्मानपूर्वक बाँच्न पाउने अधिकार, स्वतन्त्रता र व्यक्तित्व विकासका लागि संविधानद्वारा प्रत्याभूत गरिएका र उल्लङ्घन भएमा न्यायालयबाट उपचार पाइने आधारभूत मानव अधिकारलाई मौलिक हक भनिन्छ । नेपालको संविधान (२०७२) को भाग ३ (धारा १६ देखि ४६ सम्म) मा नागरिक, राजनीतिक, आर्थिक, सामाजिक र सांस्कृतिक गरी ३१ वटा मौलिक हकहरूको व्यापक व्यवस्था गरिएको छ ।',
      sections: [
        {
          heading: '१. नेपालको संविधानमा मौलिक हकका मूलभूत विशेषताहरू',
          points: [
            'परम्परागत नागरिक तथा राजनीतिक स्वतन्त्रताका अतिरिक्त शिक्षा (धारा ३१), स्वास्थ्य (धारा ३५), खाद्य सम्प्रभुता (धारा ३६), आवास (धारा ३७) र रोजगारी (धारा ३३) जस्ता आर्थिक-सामाजिक हकहरूको समावेशीकरण ।',
            'महिला (धारा ३८), बालबालिका (धारा ३९), दलित (धारा ४०), ज्येष्ठ नागरिक (धारा ४१) र सामाजिक न्याय (धारा ४२) मार्फत लक्षित वर्गको विशेष संरक्षण ।',
            'धारा ४७ बमोजिम तीन वर्षभित्र कानुन बनाई लागू गर्ने संवैधानिक प्रतिबद्धता तथा धारा ४६, १३३ र १४४ बमोजिम सर्वोच्च र उच्च अदालतबाट संवैधानिक उपचारको प्रत्याभूति ।',
          ],
        },
        {
          heading: '२. मौलिक हक कार्यान्वयनमा देखिएका प्रमुख चुनौतीहरू',
          points: [
            'स्रोत र सामर्थ्यको सीमितता: राज्यको आर्थिक तथा संस्थागत क्षमताभन्दा महत्त्वाकाङ्क्षी वितरणमुखी हकहरू (रोजगारी, आवास, निःशुल्क स्वास्थ्य) को पूर्ण प्रत्याभूतिमा बजेट अभाव ।',
            'प्रत्यायोजित विधायन र कार्यविधिगत ढिलाइ: मौलिक हकसम्बन्धी ऐनहरू निर्माण भए तापनि तिनका नियमावली, निर्देशिका र मापदण्ड समयमै नबन्दा कार्यान्वयन फितलो हुनु ।',
            'तहगत समन्वयको कमी: संघ, प्रदेश र स्थानीय तहबीच साझा अधिकारका विषय (शिक्षा, आधारभूत स्वास्थ्य) मा जिम्मेवारी र जवाफदेहिता स्पष्ट नहुनु ।',
            'कानुनी सचेतना र न्यायमा पहुँचको अभाव: दुर्गम तथा विपन्न नागरिकमा आफ्ना संवैधानिक हक र न्यायिक उपचार प्रक्रियाबारे पर्याप्त जानकारी र सहज पहुँच नहुनु ।',
          ],
        },
        {
          heading: '३. प्रभावकारी कार्यान्वयनका व्यावहारिक उपायहरू',
          points: [
            'आर्थिक-सामाजिक हकहरूलाई आवधिक योजना र तीनै तहको वार्षिक बजेटसँग आबद्ध गरी प्रगतिशील कार्यान्वयन (Progressive Realization) को समयसीमा तोक्ने ।',
            'बाँकी रहेका नियमावली तथा कार्यविधि तत्काल तर्जुमा गरी ७५३ वटै स्थानीय तहको सेवा प्रवाहसँग मौलिक हकको नतिजा जोड्ने ।',
            'निःशुल्क कानुनी सहायता, नागरिक सचेतना र न्यायिक समितिको क्षमता अभिवृद्धि मार्फत न्यायमा सहज पहुँच सुनिश्चित गर्ने ।',
          ],
        },
      ],
      conclusion:
        'मौलिक हकहरू संविधानको पानामा मात्र सीमित नभई नागरिकको दैनिक जीवनमा अनुभूत हुनुपर्दछ । तसर्थ राज्यको स्रोत क्षमताको विस्तार, कानुनी पूर्णता र तहगत समन्वयद्वारा मौलिक हकको वास्तविक कार्यान्वयन आजको प्राथमिक आवश्यकता हो ।',
    },
    rubric: [
      {
        en: 'Defined fundamental rights accurately with reference to Part 3 (Articles 16–46) & judicial remedies (Arts. 46/133/144).',
        ne: 'भाग ३ (धारा १६–४६) र संवैधानिक उपचार (धारा ४६/१३३/१४४) उल्लेख गर्दै मौलिक हकको सटिक परिभाषा दिइएको ।',
      },
      {
        en: 'Analyzed fiscal/institutional constraints and delayed subordinate regulations under Article 47.',
        ne: 'राज्यको स्रोत सीमितता र धारा ४७ बमोजिमका नियमावली/कार्यविधि निर्माणमा भएको ढिलाइ विश्लेषण गरिएको ।',
      },
      {
        en: 'Addressed three-tier federal coordination and citizen access-to-justice gaps.',
        ne: 'तीनै तहबीचको समन्वय अभाव र नागरिकको न्यायमा पहुँचको समस्या समेटिएको ।',
      },
      {
        en: 'Proposed actionable reforms linking periodic budgeting, local service delivery, and legal literacy.',
        ne: 'बजेट आबद्धता, स्थानीय सेवा प्रवाह र कानुनी सचेतनासहितको निष्कर्ष प्रस्तुत गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-202',
    paper: 'Paper II: Governance Systems',
    subject: 'Federalism & Inter-Governmental Relations',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
    en: {
      title: 'Cooperative Federalism & Inter-Level Coordination in Nepal',
      question:
        'What is meant by cooperative federalism? Examine the constitutional provisions governing inter-relations among Federal, Provincial, and Local levels in Nepal and suggest measures to resolve practical coordination issues.',
      marksAllocation: '3 + 4 + 3 = 10 Marks',
      introduction:
        'Cooperative federalism is a governance model in which national, sub-national, and local governments interact horizontally and vertically as interdependent partners rather than competing silos. Article 232(1) of the Constitution of Nepal explicitly anchors relations among the Federation, 7 Provinces, and 753 Local Levels on the principles of cooperation, coexistence, and coordination (3Cs).',
      sections: [
        {
          heading: '1. Constitutional Architecture of Inter-Relations (Part 20)',
          points: [
            'Foundational triad (Art. 232): Relations governed by cooperation (Sahakarita), coexistence (Saha-astitwa), and coordination (Samanwaya).',
            'Exclusive and concurrent powers (Arts. 57 & Schedules 5–9): Clear constitutional allocation of single and shared legislative/executive competencies.',
            'Dispute resolution mechanisms (Arts. 234 & 235): Inter-Provincial Council chaired by the Prime Minister for political disputes, Provincial Coordination Councils for provincial-local alignment, and the Constitutional Bench (Art. 137) for jurisdictional adjudication.',
            'Fiscal inter-relations (Art. 251): National Natural Resources and Fiscal Commission (NNRFC) determining equitable revenue sharing and fiscal equalization grants.',
          ],
        },
        {
          heading: '2. Practical Coordination Bottlenecks',
          points: [
            'Delayed umbrella laws: Prolonged delays in enacting Federal Civil Service, Police Adjustment, and Education Acts constrained provincial autonomy.',
            'Duplication in concurrent jurisdictions: Fragmented small-scale projects and overlapping tax/fee claims across tiers weaken allocative efficiency.',
            'Underutilized intergovernmental forums: Irregular meetings and weak secretariat follow-up of the Inter-Provincial Council and National Coordination Council.',
            'Asymmetric administrative capacity: Acute shortages of technical personnel and procedural clarity at local and provincial ministries.',
          ],
        },
        {
          heading: '3. Measures to Strengthen Cooperative Federalism',
          points: [
            'Enact remaining concurrent-list federal framework laws swiftly while respecting constitutional subsidiarity.',
            'Institutionalize regular calendars and binding implementation tracking under the Federalism Implementation and Inter-Governmental Relations Act, 2077.',
            'Adopt integrated digital project banks and NNRFC-guided fiscal discipline to eliminate project duplication.',
          ],
        },
      ],
      conclusion:
        'Nepal’s three-tier federal model succeeds not through hierarchy, but through constitutional partnership. Operationalizing the spirit of Article 232 via timely umbrella legislation, fiscal fairness, and active intergovernmental councils will turn federal structure into citizen-level prosperity.',
    },
    ne: {
      title: 'सहकारितामूलक संघीयता र तहगत अन्तरसम्बन्ध',
      question:
        'सहकारितामूलक संघीयता भन्नाले के बुझिन्छ ? नेपालमा संघ, प्रदेश र स्थानीय तहबीचको अन्तरसम्बन्ध सम्बन्धी संवैधानिक व्यवस्था उल्लेख गर्दै तहगत समन्वयमा देखिएका समस्या समाधानका उपायहरू सुझाउनुहोस् ।',
      marksAllocation: '३ + ४ + ३ = १० अङ्क',
      introduction:
        'शासनका विभिन्न तहहरूबीच प्रतिस्पर्धा वा नियन्त्रणको सट्टा पारस्परिक सहयोग, साझेदारी र साझा जवाफदेहिताका आधारमा राज्यशक्ति अभ्यास गर्ने प्रणाली नै सहकारितामूलक संघीयता हो । नेपालको संविधानको धारा २३२(१) ले संघ, ७ प्रदेश र ७५३ स्थानीय तहबीचको सम्बन्ध सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्तमा आधारित हुने स्पष्ट व्यवस्था गरेको छ ।',
      sections: [
        {
          heading: '१. अन्तरसम्बन्ध सम्बन्धी प्रमुख संवैधानिक व्यवस्थाहरू (भाग २०)',
          points: [
            'सैद्धान्तिक आधार (धारा २३२): संघ, प्रदेश र स्थानीय तहबीच सहकारिता, सहअस्तित्व र समन्वयको त्रिवेणी सिद्धान्त ।',
            'अधिकारको बाँडफाँड (धारा ५७ र अनुसूची ५–९): एकल तथा साझा अधिकार सूचीमार्फत कार्यजिम्मेवारी र विधायिकी क्षेत्राधिकारको निर्धारण ।',
            'विवाद समाधान र समन्वय संयन्त्र (धारा २३४, २३५ र १३७): राजनीतिक विवाद समाधानका लागि प्रधानमन्त्रीको अध्यक्षतामा अन्तरप्रदेश परिषद्, प्रदेश समन्वय परिषद् र संवैधानिक विवाद निरूपणका लागि सर्वोच्च अदालतको संवैधानिक इजलास ।',
            'वित्तीय अन्तरसम्बन्ध (धारा २५१): राष्ट्रिय प्राकृतिक स्रोत तथा वित्त आयोगमार्फत न्यायोचित राजस्व बाँडफाँड र वित्तीय समानीकरण अनुदानको सिफारिस ।',
          ],
        },
        {
          heading: '२. तहगत समन्वयमा देखिएका व्यावहारिक समस्याहरू',
          points: [
            'छाता कानुन निर्माणमा ढिलाइ: संघीय निजामती सेवा, प्रहरी समायोजन र संघीय शिक्षा ऐन जस्ता आधारभूत कानुन समयमा नबन्दा प्रदेश र स्थानीय तहको कार्यसम्पादन प्रभावित हुनु ।',
            'साझा अधिकारको प्रयोगमा दोहोरोपन: साना तथा टुक्रे आयोजनामा तीनै तहको बजेट दोहोरिने र राजस्व/कर संकलनमा क्षेत्राधिकारको विवाद देखिनु ।',
            'समन्वयकारी संयन्त्रको न्यून सक्रियता: अन्तरप्रदेश परिषद् र राष्ट्रिय समन्वय परिषद्का बैठकहरू नियमित नबस्नु तथा निर्णय कार्यान्वयनको अनुगमन कमजोर रहनु ।',
            'संस्थागत र जनशक्ति क्षमताको विषमता: स्थानीय र प्रदेश तहमा प्राविधिक जनशक्ति तथा प्रशासनिक स्थायित्वको अभाव रहनु ।',
          ],
        },
        {
          heading: '३. समन्वय सुदृढीकरणका व्यावहारिक उपायहरू',
          points: [
            'सन्निकटताको सिद्धान्त (Principle of Subsidiarity) बमोजिम साझा अधिकारका संघीय छाता कानुनहरू अविलम्ब निर्माण गरी अधिकार हस्तान्तरणलाई पूर्णता दिने ।',
            'संघ, प्रदेश र स्थानीय तह (समन्वय तथा अन्तरसम्बन्ध) ऐन, २०७७ का संयन्त्रहरूलाई कार्यतालिकाबद्ध र नतिजामुखी बनाउने ।',
            'एकीकृत राष्ट्रिय आयोजना बैंक र अन्तर-तह विद्युतीय सूचना आदानप्रदान प्रणाली लागू गरी बजेट तथा कार्यक्रमको दोहोरोपन अन्त्य गर्ने ।',
          ],
        },
      ],
      conclusion:
        'नेपालको संघीयता नियन्त्रणमुखी नभई साझेदारीमुखी प्रणाली हो । धारा २३२ को मर्मबमोजिम कानुनी स्पष्टता, वित्तीय सन्तुलन र संस्थागत संवादलाई जीवन्त तुल्याउन सकेमा मात्र संघीय लोकतान्त्रिक गणतन्त्रको लाभ घरदैलोमा पुग्न सक्छ ।',
    },
    rubric: [
      {
        en: 'Cited Article 232 principles: Cooperation, Coexistence, and Coordination.',
        ne: 'धारा २३२ को सहकारिता, सहअस्तित्व र समन्वयको सिद्धान्त स्पष्ट उल्लेख गरिएको ।',
      },
      {
        en: 'Covered Part 20 mechanisms (Arts. 234–235 Inter-Provincial Council, Schedules 5–9, Art. 251 NNRFC).',
        ne: 'भाग २० का संयन्त्रहरू (धारा २३४–२३५, अनुसूची ५–९ र धारा २५१ वित्त आयोग) समेटिएको ।',
      },
      {
        en: 'Identified practical friction points: delayed umbrella Acts, project duplication, and staffing gaps.',
        ne: 'छाता ऐनको ढिलाइ, आयोजना दोहोरोपन र जनशक्ति अभावजस्ता व्यावहारिक समस्या औँल्याइएको ।',
      },
      {
        en: 'Referenced Inter-Governmental Relations Act 2077 and subsidiarity principle in way forward.',
        ne: 'समन्वय तथा अन्तरसम्बन्ध ऐन, २०७७ र सन्निकटताको सिद्धान्तसहित समाधान प्रस्तुत गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-203',
    paper: 'Paper II: Governance Systems',
    subject: 'Rule of Law & Separation of Powers',
    postTarget: 'Section Officer / Nayab Subba / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
    en: {
      title: 'Rule of Law, Separation of Powers & Checks and Balances',
      question:
        'Explain how the principles of Separation of Powers and Checks and Balances are reflected in the Constitution of Nepal to uphold the Rule of Law.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Propounded systematically by Montesquieu, Separation of Powers prevents tyranny by dividing state authority among the Legislature, Executive, and Judiciary, while Checks and Balances ensure mutual constitutional restraint so no single organ becomes autocratic.',
      sections: [
        {
          heading: '1. Separation of Powers in the Constitution of Nepal',
          points: [
            'Executive power (Art. 75): Vested in the Council of Ministers in accordance with the Constitution and law.',
            'Legislative power (Arts. 83 & 109): Vested in the bicameral Federal Parliament (House of Representatives and National Assembly) and Provincial Assemblies.',
            'Judicial power (Art. 126): Exercised exclusively by independent courts and judicial bodies to uphold justice and the Rule of Law.',
          ],
        },
        {
          heading: '2. Constitutional Checks and Balances',
          points: [
            'Legislative check on Executive & Judiciary: Parliamentary confidence/no-confidence votes (Art. 100), budget approval, parliamentary hearings (Art. 292), and impeachment (Art. 101).',
            'Executive role in Legislature & Judiciary: Summoning/proroguing parliamentary sessions via the President, bill initiation, and execution of court decrees.',
            'Judicial check on Legislature & Executive: Supreme Court power of judicial review (Art. 133) to declare unconstitutional statutes ultra vires and void, alongside writ jurisdiction protecting citizen rights.',
          ],
        },
      ],
      conclusion:
        'Absolute separation causes institutional deadlock, whereas unchecked fusion breeds arbitrariness. Nepal’s Constitution harmonizes functional autonomy with reciprocal accountability to safeguard constitutional supremacy and the Rule of Law.',
    },
    ne: {
      title: 'कानुनी राज्य, शक्ति पृथकीकरण र नियन्त्रण तथा सन्तुलन',
      question:
        'कानुनी राज्यको संवर्द्धनका लागि नेपालको संविधानमा शक्ति पृथकीकरण तथा नियन्त्रण र सन्तुलनको सिद्धान्तलाई कसरी आत्मसात् गरिएको छ ? स्पष्ट पार्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'राज्यशक्तिको केन्द्रीकरण र निरङ्कुशता रोक्न कार्यपालिका, व्यवस्थापिका र न्यायपालिकाबीच कार्यविभाजन गर्नु शक्ति पृथकीकरण (Separation of Powers) हो भने ती अङ्गहरूबीच पारस्परिक अङ्कुश र समन्वय कायम राख्नु नियन्त्रण र सन्तुलन (Checks and Balances) हो ।',
      sections: [
        {
          heading: '१. नेपालको संविधानमा शक्ति पृथकीकरणको अभ्यास',
          points: [
            'कार्यकारिणी अधिकार (धारा ७५): संविधान र कानुनबमोजिम मन्त्रिपरिषद्मा निहित रहने व्यवस्था ।',
            'व्यवस्थापिकीय अधिकार (धारा ८३ र १०९): संघीय संसद (प्रतिनिधि सभा र राष्ट्रिय सभा) तथा प्रदेश सभाहरूमा कानून निर्माणको अधिकार ।',
            'न्यायसम्बन्धी अधिकार (धारा १२६): स्वतन्त्र, निष्पक्ष र सक्षम अदालत तथा न्यायिक निकायबाट प्रयोग हुने प्रत्याभूति ।',
          ],
        },
        {
          heading: '२. नियन्त्रण र सन्तुलनका संवैधानिक प्रबन्धहरू',
          points: [
            'व्यवस्थापिकाद्वारा नियन्त्रण: मन्त्रिपरिषद् संसदप्रति उत्तरदायी हुने, विश्वास/अविश्वासको प्रस्ताव (धारा १००), बजेट स्वीकृति, संसदीय सुनुवाइ (धारा २९२) र महाभियोग (धारा १०१) ।',
            'कार्यपालिकाको सन्तुलनकारी भूमिका: विधेयक प्रस्तुत गर्ने, राष्ट्रपतिमार्फत अधिवेशन आह्वान/अन्त्य गर्ने र अदालतको फैसला कार्यान्वयन तथा आममाफीको सिफारिस (धारा २७६) ।',
            'न्यायपालिकाद्वारा संवैधानिक परीक्षण: संसदले बनाएको बाझिएको कानुन अमान्य घोषित गर्ने न्यायिक पुनरावलोकनको अधिकार (धारा १३३) र कार्यपालिकाका स्वेच्छाचारी निर्णय बदर गर्ने रिट क्षेत्राधिकार ।',
          ],
        },
      ],
      conclusion:
        'निरपेक्ष पृथकीकरणले राज्यसंयन्त्रमा गतिरोध ल्याउँछ भने नियन्त्रणविहीन शक्तिले स्वेच्छाचारिता जन्माउँछ । नेपालको संविधानले अङ्गगत स्वायत्तता र पारस्परिक जवाफदेहिताको सन्तुलनमार्फत संवैधानिक सर्वोच्चता र कानुनी राज्यलाई संस्थागत गरेको छ ।',
    },
    rubric: [
      {
        en: 'Distinguished Separation of Powers (functional autonomy) from Checks and Balances (mutual restraint).',
        ne: 'शक्ति पृथकीकरण र नियन्त्रण तथा सन्तुलनको अवधारणागत भिन्नता र अन्तरसम्बन्ध स्पष्ट पारिएको ।',
      },
      {
        en: 'Cited Articles 75 (Executive), 83/109 (Legislature), and 126 (Judiciary).',
        ne: 'धारा ७५ (कार्यपालिका), धारा ८३/१०९ (व्यवस्थापिका) र धारा १२६ (न्यायपालिका) उल्लेख गरिएको ।',
      },
      {
        en: 'Illustrated reciprocal checks: judicial review (Art. 133), parliamentary confidence (Art. 100), impeachment (Art. 101), and hearings (Art. 292).',
        ne: 'न्यायिक पुनरावलोकन (धारा १३३), विश्वासको मत (धारा १००), महाभियोग (धारा १०१) र संसदीय सुनुवाइ (धारा २९२) समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-204',
    paper: 'Paper II: Governance Systems',
    subject: 'Public Administration & Civil Service',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Civil Service Act, 2049 (1993) — Core Provisions',
    sourcePath: '/materials/civil-service-act-2049.pdf',
    en: {
      title: 'Meritocracy, Inclusiveness & Reform in Nepal’s Civil Service',
      question:
        'Examine the role of meritocracy and the inclusive reservation policy under the Civil Service Act, 2049 in making Nepal’s public administration representative and high-performing. How can inclusion and competence be harmonized?',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Known as the permanent government, the civil service bridges state policies and citizens. Through the Second Amendment (2064) to the Civil Service Act, 2049, Nepal combined Public Service Commission (PSC) competitive merit selection with a landmark 45% inclusive reservation system to build a representative, professional bureaucracy.',
      sections: [
        {
          heading: '1. Meritocracy & Inclusive Provisions under Civil Service Act, 2049',
          points: [
            'Constitutional merit guardian (Art. 243): Independent Public Service Commission conducting anonymized, multi-stage written and practical examinations.',
            '45% Inclusive Reservation (Section 7(7)): 45% of open-competition seats are set aside and treated as 100%, distributed among Women (33%), Adibasi/Janajati (27%), Madhesi (22%), Dalit (9%), Persons with Disabilities (5%), and Backward Areas (4%).',
            'Decennial statutory review: Provision requiring periodic review every 10 years to assess socio-economic impact and target genuine deprivation.',
          ],
        },
        {
          heading: '2. Achievements and Emerging Challenges',
          points: [
            'Positive impact: Historic rise in the representation of women, indigenous nationalities, Madhesis, and Dalits across Gazetted and Non-Gazetted ranks, strengthening state legitimacy and empathy in frontline delivery.',
            'Elite capture within target groups: Repeated utilization of reservation benefits by already privileged individuals ("creamy layer") while ultra-marginalized rural youths remain underrepresented.',
            'Post-recruitment capability gap: Insufficient induction training, subjective performance appraisal (Ka.Sa.Mu.), and politicized trade unionism affecting administrative neutrality and output.',
          ],
        },
        {
          heading: '3. Harmonizing Inclusion with High Competence',
          points: [
            'Reorient reservation criteria by combining identity with socio-economic/human-development deprivation indices and limiting quota benefit to once per career.',
            'Maintain rigorous minimum qualifying thresholds in PSC examinations while expanding pre-exam preparatory academies for underprivileged aspirants.',
            'Enforce objective Key Performance Indicators (KPIs), mandatory post-entry training, and strict political neutrality.',
          ],
        },
      ],
      conclusion:
        'Inclusion and meritocracy are complementary, not adversarial: inclusion brings social equity and diverse perspective, while merit ensures professional execution. Refining reservation targeting alongside rigorous capacity development will build an agile, trusted Federal Civil Service.',
    },
    ne: {
      title: 'निजामती सेवामा योग्यता प्रणाली र समावेशीकरणको सन्तुलन',
      question:
        'नेपालको सार्वजनिक प्रशासनलाई प्रतिनिधिमूलक र उच्च कार्यसम्पादनयुक्त बनाउन निजामती सेवा ऐन, २०४९ मा रहेको योग्यता प्रणाली र समावेशी नीतिको भूमिका परीक्षण गर्नुहोस् । समावेशीकरण र सक्षमताबीच कसरी सामञ्जस्य कायम गर्न सकिन्छ ?',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'निजामती सेवालाई स्थायी सरकार (Permanent Government) मानिन्छ । निजामती सेवा ऐन, २०४९ (दोस्रो संशोधन २०६४) ले लोक सेवा आयोगको निष्पक्ष योग्यता प्रणालीसँगै राज्यसंयन्त्रमा सबै वर्गको अपनत्व स्थापित गर्न ४५ प्रतिशत समावेशी आरक्षणको ऐतिहासिक व्यवस्था अवलम्बन गरेको छ ।',
      sections: [
        {
          heading: '१. योग्यता प्रणाली र समावेशी कानुनी प्रबन्ध',
          points: [
            'योग्यताको संरक्षक (धारा २४३): लोक सेवा आयोगको तटस्थ, गोप्य र बहुचरणीय परीक्षामार्फत योग्यतम जनशक्तिको छनोट ।',
            '४५ प्रतिशत समावेशी व्यवस्था (दफा ७(७)): खुला प्रतियोगिताको ४५ प्रतिशत पद छुट्याई त्यसलाई शतप्रतिशत मानी महिला (३३%), आदिवासी/जनजाति (२७%), मधेशी (२२%), दलित (९%), अपाङ्गता भएका व्यक्ति (५%) र पिछडिएको क्षेत्र (४%) बीच प्रतिस्पर्धा गराइने ।',
            'पुनरावलोकनको व्यवस्था: आरक्षणको प्रभाव मूल्याङ्कन गरी प्रत्येक १० वर्षमा पुनरावलोकन गरिने कानुनी प्रावधान ।',
          ],
        },
        {
          heading: '२. प्राप्त उपलब्धि र देखिएका चुनौतीहरू',
          points: [
            'सकारात्मक उपलब्धि: राजपत्रांकित तथा राजपत्र अनंकित सेवामा महिला, जनजाति, मधेशी र दलित समुदायको उपस्थिति उल्लेखनीय रूपमा वृद्धि भई प्रशासनको सामाजिक वैधता बढेको ।',
            'तरमारा वर्ग (Creamy Layer) को वर्चस्व: लक्षित समुदायभित्रका सुगम र सम्पन्न व्यक्तिले पटक–पटक आरक्षणको लाभ लिने तर वास्तविक सीमान्तकृत वर्ग अझै बाहिरै पर्ने समस्या ।',
            'कार्यसम्पादन र तटस्थताको चुनौती: सेवा प्रवेशपछिको तालिमको कमी, वस्तुनिष्ठ कार्यसम्पादन मूल्याङ्कनको अभाव र दलीय ट्रेड युनियनको प्रभावले सेवा प्रवाह अपेक्षाकृत नतिजामुखी हुन नसक्नु ।',
          ],
        },
        {
          heading: '३. समावेशीकरण र सक्षमताबीच सामञ्जस्य कायम गर्ने उपायहरू',
          points: [
            'जातीय/लैङ्गिक पहिचानका साथै आर्थिक-सामाजिक विपन्नता सूचकाङ्क (Needs-cum-Identity) लागू गरी एक व्यक्तिले सेवावधिमा एक पटक मात्र आरक्षण पाउने व्यवस्था गर्ने ।',
            'सीमान्तकृत समुदायका युवालाई निःशुल्क पूर्व-तयारी कक्षाद्वारा सशक्तीकरण गर्दै प्रवेश परीक्षाको न्यूनतम गुणस्तर मापदण्ड (Threshold) अक्षुण्ण राख्ने ।',
            'सेवा प्रवेशपश्चात् सघन क्षमता विकास तालिम र नतिजामा आधारित वस्तुनिष्ठ कार्यसम्पादन सम्झौता लागू गर्ने ।',
          ],
        },
      ],
      conclusion:
        'समावेशीकरण र योग्यता प्रणाली एकअर्काका परिपूरक हुन्—समावेशीताले राज्यमा सामाजिक न्याय र अपनत्व सिर्जना गर्छ भने योग्यताले कार्यदक्षता सुनिश्चित गर्छ । आरक्षणको न्यायोचित पुनरावलोकन र निरन्तर क्षमता विकासबाट दुवै लक्ष्य एकसाथ हासिल गर्न सकिन्छ ।',
    },
    rubric: [
      {
        en: 'Accurately cited Section 7(7) of Civil Service Act 2049 with exact 45% breakdown (33%, 27%, 22%, 9%, 5%, 4%).',
        ne: 'निजामती सेवा ऐन, २०४९ को दफा ७(७) र ४५% भित्रको प्रतिशत बाँडफाँड (३३, २७, २२, ९, ५, ४) सही उल्लेख गरिएको ।',
      },
      {
        en: 'Balanced positive representation gains with "creamy layer" and post-entry performance critiques.',
        ne: 'प्रतिनिधित्व वृद्धिको उपलब्धि र तरमारा वर्ग (Creamy Layer) सम्बन्धी चुनौती दुवैको सन्तुलित चर्चा गरिएको ।',
      },
      {
        en: 'Proposed concrete harmonization: single-use quota cap, socio-economic indexing, preparatory empowerment, and KPI-based appraisal.',
        ne: 'एकपटक मात्र सहुलियत, विपन्नता सूचकाङ्क, क्षमता विकास तालिम र नतिजामूलक मूल्याङ्कनजस्ता ठोस उपाय दिइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-205',
    paper: 'Paper II: Governance Systems',
    subject: 'Good Governance & Accountability',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Good Governance (Management & Operation) Act, 2064',
    sourcePath: '/materials/good-governance-act-2064.pdf',
    en: {
      title: 'Good Governance Act, 2064 & Administrative Accountability',
      question:
        'Highlight the key instruments introduced by the Good Governance (Management and Operation) Act, 2064 to promote administrative accountability and citizen-friendly governance, and evaluate why governance deficits persist in practice.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Good governance signifies transparent, accountable, participatory, predictable, and rule-bound exercise of public authority for citizen welfare. Enacted to translate good governance into citizen entitlement, the Good Governance (Management and Operation) Act, 2064 establishes binding operational duties for ministers, secretaries, and office chiefs.',
      sections: [
        {
          heading: '1. Key Accountability Instruments in the Act (2064)',
          points: [
            'Clear demarcation of political and administrative roles: Ministers set policy direction while Secretaries/Department Heads execute administrative decisions within statutory timelines.',
            'Citizen Charter (Section 25): Mandatory display of service requirements, fees, timelines, responsible officials, and compensation provisions for unjustified delay.',
            'Social & Public Accountability tools: Mandatory Public Hearings (Section 30), Grievance Boxes (Section 31), Spokespersons/Nodal Officers, and Mobile Service Delivery (Ghumti Sewa).',
            'Ethical & Conflict-of-Interest safeguards: Mandatory declaration of conflict of interest (Section 18), transparent decision-making reasons, and annual performance reporting.',
          ],
        },
        {
          heading: '2. Why Governance Deficits Persist in Practice',
          points: [
            'Procedural formalism over outcomes: Citizen charters, public hearings, and annual reports are often treated as ritualistic checklists rather than genuine accountability mechanisms.',
            'Blurred political-administrative boundary: Frequent premature transfers of office chiefs and politicized interference dilute individual accountability.',
            'Impunity and weak reward-punishment: Compensation-for-delay clauses remain practically unimplemented, and high-integrity performers rarely receive differentiated recognition.',
            'Fragmented digital systems: Manual paper workflows create discretionary bottlenecks and middleman (bichauliya) opportunities.',
          ],
        },
      ],
      conclusion:
        'While the Good Governance Act, 2064 provides a progressive statutory blueprint, laws alone cannot guarantee integrity without institutional culture. Enforcing tenure stability, end-to-end e-governance, and strict reward-and-sanction accountability is vital to bridge the implementation gap.',
    },
    ne: {
      title: 'सुशासन ऐन, २०६४ र प्रशासनिक जवाफदेहिता',
      question:
        'प्रशासनिक जवाफदेहिता र नागरिकमैत्री शासन प्रवर्द्धन गर्न सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ ले अवलम्बन गरेका प्रमुख औजारहरू उल्लेख गर्दै व्यवहारमा सुशासनको अनुभूति कमजोर रहनुका कारणहरूको समीक्षा गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'जनताको सर्वोत्तम हितका लागि राज्यशक्तिको पारदर्शी, जवाफदेही, सहभागितामूलक र कानुनसम्मत अभ्यास नै सुशासन हो । मुलुकको सार्वजनिक प्रशासनलाई जनमुखी, पारदर्शी र नतिजामुखी बनाई सुशासन पाउने नागरिकको हकलाई व्यवहारमा उतार्न सुशासन (व्यवस्थापन तथा सञ्चालन) ऐन, २०६४ जारी गरिएको हो ।',
      sections: [
        {
          heading: '१. सुशासन ऐन, २०६४ का प्रमुख जवाफदेहितामूलक औजारहरू',
          points: [
            'राजनीतिक र प्रशासनिक कार्यजिम्मेवारीको स्पष्टता: मन्त्री, मुख्य सचिव, सचिव, विभागीय प्रमुख र कार्यालय प्रमुखको अधिकार तथा निर्णय गर्नुपर्ने समयावधि किटान ।',
            'क्षतिपूर्तिसहितको नागरिक बडापत्र (दफा २५): सेवाको प्रक्रिया, लाग्ने दस्तुर, समय र जिम्मेवार पदाधिकारी उल्लेख गरी मनासिब कारणबिना ढिलाइ भए क्षतिपूर्ति दिनुपर्ने व्यवस्था ।',
            'सामाजिक जवाफदेहिताका संयन्त्रहरू: सार्वजनिक सुनुवाइ (दफा ३०), गुनासो पेटिका (दफा ३१), प्रवक्ता र सूचना अधिकारीको व्यवस्था तथा घुम्ती सेवा सञ्चालन ।',
            'स्वार्थको द्वन्द्व निवारण र पारदर्शिता: निर्णय गर्दा आधार र कारण खुलाउनुपर्ने, स्वार्थ बाझिएमा निर्णय प्रक्रियाबाट अलग रहनुपर्ने (दफा १८) र वार्षिक प्रतिवेदन सार्वजनिक गर्नुपर्ने प्रावधान ।',
          ],
        },
        {
          heading: '२. व्यवहारमा सुशासन कमजोर रहनुका प्रमुख कारणहरू',
          points: [
            'प्रक्रियामुखी मानसिकता: नागरिक बडापत्र र सार्वजनिक सुनुवाइलाई नतिजा सुधार्ने माध्यमभन्दा कर्मकाण्डी औपचारिकतामा सीमित गरिनु ।',
            'अस्थिर प्रशासनिक नेतृत्व: कार्यालय प्रमुख र सचिवहरूको छिटो–छिटो सरुवा तथा राजनीतिक हस्तक्षेपले कार्यसम्पादन जवाफदेहिता कमजोर पार्नु ।',
            'दण्ड र पुरस्कारको फितलो कार्यान्वयन: सेवा ढिलाइ बापतको क्षतिपूर्ति व्यवहारमा लागू नहुनु र सदाचारी तथा कामचोर कर्मचारीबीच मूल्याङ्कनमा भिन्नता नदेखिनु ।',
            'प्रविधि र अन्तर-निकाय आबद्धताको कमी: कागजी ढड्डा प्रणाली र निकायगत समन्वय अभावले सेवाग्राहीले बिचौलियाको सहारा लिनुपर्ने बाध्यता कायमै रहनु ।',
          ],
        },
      ],
      conclusion:
        'सुशासन ऐन, २०६४ कानुनी दृष्टिले निकै अग्रगामी र नागरिकमैत्री छ; तर आचरणगत सुधार, प्रशासनिक स्थायित्व, पूर्ण विद्युतीय सुशासन (E-Governance) र कडा दण्ड-पुरस्कार प्रणाली लागू नगरिएसम्म नागरिकले वास्तविक सुशासनको अनुभूति गर्न सक्दैनन् ।',
    },
    rubric: [
      {
        en: 'Cited specific statutory tools of Good Governance Act 2064: Citizen Charter (Sec. 25), Public Hearing (Sec. 30), Grievance Box (Sec. 31), Conflict of Interest (Sec. 18).',
        ne: 'सुशासन ऐन, २०६४ का दफागत औजारहरू (नागरिक बडापत्र दफा २५, सार्वजनिक सुनुवाइ दफा ३०, स्वार्थको द्वन्द्व दफा १८) उल्लेख गरिएको ।',
      },
      {
        en: 'Critically evaluated implementation gaps: ritualistic compliance, frequent transfers, unimplemented compensation, and manual bottlenecks.',
        ne: 'कर्मकाण्डी प्रचलन, अस्थिर सरुवा प्रणाली, क्षतिपूर्ति कार्यान्वयन अभाव र बिचौलिया समस्याको वस्तुनिष्ठ समीक्षा गरिएको ।',
      },
      {
        en: 'Concluded with institutional reform pathways (e-governance, tenure stability, strict reward/sanction).',
        ne: 'प्रशासनिक स्थायित्व, विद्युतीय सुशासन र दण्ड-पुरस्कारसहितको संश्लेषणात्मक निष्कर्ष दिइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-206',
    paper: 'Paper II: Governance Systems',
    subject: 'Transparency & Right to Information',
    postTarget: 'Section Officer / Nayab Subba / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Right to Information Act, 2064 (2007)',
    sourcePath: '/materials/right-to-information-act-2064.pdf',
    en: {
      title: 'Right to Information Act, 2064 & Proactive Disclosure',
      question:
        'What is Proactive Disclosure (Swatah Prakashan)? Discuss the legal provisions and limits of the Right to Information in Nepal.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Guaranteed under Article 27 of the Constitution of Nepal and operationalized by the Right to Information (RTI) Act, 2064, RTI empowers citizens to seek and receive information of public importance held by public bodies, transforming governance from a culture of secrecy to open accountability.',
      sections: [
        {
          heading: '1. Proactive Disclosure & Core Statutory Provisions',
          points: [
            'Proactive Disclosure (Section 5): Mandatory duty of every public body to classify, update, and publish 20 categories of institutional, program, budget, and decision data every three months without waiting for a citizen application.',
            'Information Officer & Statutory Timelines (Sections 6 & 7): Dedicated Information Officer required; general information must be provided immediately or within 15 days, and within 24 hours where human life or safety is at stake.',
            'Independent Oversight: Right to appeal to the Office Chief within 7 days and subsequently to the independent National Information Commission (NIC), alongside whistleblower protection (Section 29).',
          ],
        },
        {
          heading: '2. Statutory Exemptions / Limits (Section 3(3))',
          points: [
            'Matters jeopardizing national sovereignty, territorial integrity, national security, or harmonious relations among federal units and communities.',
            'Ongoing criminal investigations, confidential trade/intellectual property secrets, and personal privacy records protected by law.',
          ],
        },
      ],
      conclusion:
        'Proactive disclosure reduces citizen friction and deters corruption at the source. Digitizing quarterly disclosures on standardized open portals while strictly limiting exemptions to Section 3(3) criteria strengthens democratic trust.',
    },
    ne: {
      title: 'सूचनाको हक सम्बन्धी ऐन, २०६४ र स्वतः प्रकाशन',
      question:
        'स्वतः प्रकाशन (Proactive Disclosure) भन्नाले के बुझिन्छ ? नेपालमा सूचनाको हकसम्बन्धी प्रमुख कानुनी व्यवस्था र यसका सीमाहरू चर्चा गर्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'नागरिकलाई राज्यका कामकारबाहीबारे सुसूचित बनाई लोकतन्त्रलाई पारदर्शी र जवाफदेही तुल्याउन नेपालको संविधानको धारा २७ र सूचनाको हक सम्बन्धी ऐन, २०६४ ले सार्वजनिक सरोकारको सूचना माग्ने र पाउने हक सुनिश्चित गरेको छ ।',
      sections: [
        {
          heading: '१. स्वतः प्रकाशन र प्रमुख कानुनी व्यवस्थाहरू',
          points: [
            'स्वतः प्रकाशन (दफा ५): नागरिकले निवेदन नदिए पनि सार्वजनिक निकायले आफ्नो स्वरूप, कार्य, बजेट, निर्णय र सेवा प्रवाहसम्बन्धी २० प्रकारका विवरण प्रत्येक ३/३ महिनामा अद्यावधिक गरी स्वयं सार्वजनिक गर्नुपर्ने बाध्यात्मक व्यवस्था नै स्वतः प्रकाशन हो ।',
            'सूचना अधिकारी र समयसीमा (दफा ६ र ७): प्रत्येक कार्यालयमा सूचना अधिकारी तोक्नुपर्ने; माग भएको सूचना तत्काल वा बढीमा १५ दिनभित्र र जीउज्यानको सुरक्षासँग सम्बन्धित सूचना २४ घण्टाभित्र उपलब्ध गराउनुपर्ने ।',
            'पुनरावेदन र संरक्षण: सूचना नपाए ७ दिनभित्र कार्यालय प्रमुखसमक्ष र सोउपर स्वतन्त्र राष्ट्रिय सूचना आयोगमा पुनरावेदन दिन सकिने तथा सूचनादाताको संरक्षण (दफा २९) हुने व्यवस्था ।',
          ],
        },
        {
          heading: '२. सूचनाको हकका कानुनी सीमाहरू (दफा ३(३))',
          points: [
            'नेपालको सार्वभौमसत्ता, अखण्डता, राष्ट्रिय सुरक्षा, सार्वजनिक शान्ति र संघीय इकाइ वा जातजातिबीचको सुसम्बन्धमा खलल पर्ने विषय ।',
            'अपराधको अनुसन्धान/तहकिकातमा असर पर्ने विषय, बौद्धिक सम्पत्ति वा व्यावसायिक गोपनीयता र व्यक्तिगत गोपनीयताका संवेदनशील विवरणहरू ।',
          ],
        },
      ],
      conclusion:
        'स्वतः प्रकाशनले गोपनीयतामुखी कर्मचारीतन्त्रलाई खुला र जनउत्तरदायी शासनमा रूपान्तरण गर्दछ । दफा ३(३) का अपवादबाहेक अधिकतम खुलापनको सिद्धान्त (Maximum Disclosure) अवलम्बन गर्नु सुशासनको आधारस्तम्भ हो ।',
    },
    rubric: [
      {
        en: 'Defined Proactive Disclosure with Section 5 quarterly (3-month) update requirement and Article 27.',
        ne: 'संविधानको धारा २७ र ऐनको दफा ५ बमोजिम ३/३ महिनाको स्वतः प्रकाशन स्पष्ट पारिएको ।',
      },
      {
        en: 'Stated exact timelines (15 days normal, 24 hours life-safety) and role of Information Officer / NIC.',
        ne: '१५ दिन र २४ घण्टाको समयसीमा तथा सूचना अधिकारी र राष्ट्रिय सूचना आयोगको भूमिका उल्लेख गरिएको ।',
      },
      {
        en: 'Outlined statutory exemptions under Section 3(3) (sovereignty, investigation, privacy).',
        ne: 'दफा ३(३) बमोजिम सूचना प्रवाह नहुने ५ प्रकारका संवेदनशील सीमाहरू समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-301',
    paper: 'Paper III: Contemporary Issues & Development',
    subject: 'Development Planning & Economy',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
    en: {
      title: 'Sixteenth Periodic Plan (2081/82–2085/86): Vision & Structural Transformation',
      question:
        'Outline the overarching vision, strategic priorities for structural transformation, and key implementation challenges of Nepal’s Sixteenth Periodic Plan (FY 2081/82–2085/86).',
      marksAllocation: '3 + 4 + 3 = 10 Marks',
      introduction:
        'Formulated by the National Planning Commission at a pivotal juncture—as Nepal graduates from Least Developed Country (LDC) status in 2026 and pursues the 2030 Sustainable Development Goals—the Sixteenth Periodic Plan (2081/82–2085/86) adopts the overarching vision of "Good Governance, Social Justice, and Prosperity."',
      sections: [
        {
          heading: '1. Vision & Macroeconomic Ambitions',
          points: [
            'Core Vision: Achieving political, administrative, and judicial good governance; establishing social justice in health, education, and employment; and attaining broad-based economic prosperity.',
            'Key Quantitative Benchmarks: Accelerating average economic growth toward ~7.1–7.3%, reducing absolute poverty toward ~12%, raising per-capita income, and expanding clean hydroelectricity generation and digital connectivity.',
          ],
        },
        {
          heading: '2. Structural Transformation Areas',
          points: [
            'Production, productivity, and domestic job creation: Shifting from remittance-fueled import consumption toward commercialized agriculture, green energy exports, IT services, and high-value tourism.',
            'Human capital & social protection: Enhancing quality public education, universal health insurance reform, and integrated lifecycle social security.',
            'Digital economy & green resilience: Mainstreaming e-governance, AI/IT export corridors, and climate-resilient infrastructure.',
            'Fiscal federalism & private-sector confidence: Improving business regulatory predictability to crowd in domestic and foreign direct investment (FDI).',
          ],
        },
        {
          heading: '3. Implementation Bottlenecks & Way Forward',
          points: [
            'Plan-budget disconnect: Annual budgets frequently bypass Medium-Term Expenditure Frameworks (MTEF) and National Project Bank screening.',
            'Chronic capital expenditure lag: Delayed procurement, land-acquisition hurdles, and weak contract management stall transformative projects.',
            'Solution: Enforce strict MTEF discipline, empower local/provincial productive value chains, and tie project-chief tenure directly to physical milestone completion.',
          ],
        },
      ],
      conclusion:
        'The Sixteenth Plan rightly diagnoses structural stagnation and places governance at the heart of prosperity. Bridging the historic gap between planning documents and annual budget execution will determine Nepal’s smooth LDC graduation.',
    },
    ne: {
      title: 'सोह्रौँ योजना (२०८१/८२–२०८५/८६): सोच, रूपान्तरणका क्षेत्र र कार्यान्वयन',
      question:
        'नेपालको सोह्रौँ आवधिक योजना (आ.व. २०८१/८२–२०८५/८६) को दीर्घकालीन सोच, संरचनात्मक रूपान्तरणका प्रमुख प्राथमिकताहरू र कार्यान्वयनका चुनौतीहरू प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '३ + ४ + ३ = १० अङ्क',
      introduction:
        'सन् २०२६ मा अतिकम विकसित मुलुक (LDC) बाट विकासशील राष्ट्रमा दिगो स्तरोन्नति हुने र सन् २०३० सम्म दिगो विकास लक्ष्य हासिल गर्ने महत्त्वपूर्ण सँघारमा राष्ट्रिय योजना आयोगद्वारा तर्जुमा गरिएको सोह्रौँ योजना (२०८१/८२–२०८५/८६) ले "सुशासन, सामाजिक न्याय र समृद्धि" को मूल सोच अङ्गीकार गरेको छ ।',
      sections: [
        {
          heading: '१. मूल सोच र समष्टिगत लक्ष्यहरू',
          points: [
            'मुख्य सोच: राजनीतिक, प्रशासनिक र न्यायिक क्षेत्रमा सुशासन कायम गर्ने; स्वास्थ्य, शिक्षा र रोजगारीमा सामाजिक न्याय स्थापित गर्ने; तथा स्वाधीन र समुन्नत अर्थतन्त्र निर्माणमार्फत समृद्धि हासिल गर्ने ।',
            'प्रमुख परिमाणात्मक लक्ष्यहरू: आर्थिक वृद्धिदरलाई ७ प्रतिशतमाथि पुर्‍याउने, निरपेक्ष गरिबीलाई करिब १२ प्रतिशतमा झार्ने, प्रतिव्यक्ति आय वृद्धि गर्ने र स्वच्छ जलविद्युत् तथा डिजिटल अर्थतन्त्रको विस्तार गर्ने ।',
          ],
        },
        {
          heading: '२. संरचनात्मक रूपान्तरणका प्रमुख क्षेत्रहरू',
          points: [
            'उत्पादन, उत्पादकत्व र आन्तरिक रोजगारी: विप्रेषण र आयातमुखी उपभोगको सट्टा व्यावसायिक कृषि, हरित ऊर्जा निर्यात, सूचना प्रविधि (IT) र उच्च मूल्ययुक्त पर्यटन प्रवर्द्धन ।',
            'मानव पुँजी निर्माण र सामाजिक सुरक्षा: सीपमूलक गुणस्तरीय शिक्षा, स्वास्थ्य बीमा सुधार र एकीकृत सामाजिक सुरक्षा प्रणाली ।',
            'विद्युतीय सुशासन र हरित उत्थानशीलता: डिजिटल सार्वजनिक पूर्वाधारको विस्तार र जलवायु अनुकूलनयुक्त दिगो पूर्वाधार विकास ।',
            'वित्तीय संघीयता र निजी क्षेत्रको प्रवर्द्धन: लगानीमैत्री नीतिगत स्थिरतामार्फत स्वदेशी तथा वैदेशिक लगानी परिचालन ।',
          ],
        },
        {
          heading: '३. कार्यान्वयनका चुनौती र सुधारका उपायहरू',
          points: [
            'योजना र बजेटबीचको तादात्म्य अभाव: मध्यकालीन खर्च संरचना (MTEF) र राष्ट्रिय आयोजना बैंकको मापदण्डविपरीत तयारीबिनाका टुक्रे आयोजनामा बजेट छर्ने प्रवृत्ति ।',
            'न्यून पुँजीगत खर्च र निर्माण ढिलाइ: जग्गा प्राप्ति, वन स्वीकृति र कमजोर ठेक्का व्यवस्थापनले रणनीतिक आयोजनाहरू समयमा नसकिनु ।',
            'सुधारको बाटो: आयोजना प्रमुखसँग नतिजामूलक कार्यसम्पादन सम्झौता, तीनै तहका आवधिक योजनाबीच सामञ्जस्य र निजी क्षेत्रसँग विश्वासिलो साझेदारी आवश्यक छ ।',
          ],
        },
      ],
      conclusion:
        'सोह्रौँ योजनाले विकासको पूर्वशर्तका रूपमा सुशासन र सामाजिक न्यायलाई स्थापित गरेको छ । योजनाको दस्तावेज र वार्षिक बजेट कार्यान्वयनबीचको खाडल पुर्न सकेमा मात्र स्तरोन्नतिपछिको आर्थिक रूपान्तरण दिगो बन्नेछ ।',
    },
    rubric: [
      {
        en: 'Accurately quoted the 16th Plan vision: "Good Governance, Social Justice, and Prosperity" with FY 2081/82–2085/86 timeframe.',
        ne: 'आ.व. २०८१/८२–२०८५/८६ उल्लेख गर्दै "सुशासन, सामाजिक न्याय र समृद्धि" को मूल सोच सटिक रूपमा लेखिएको ।',
      },
      {
        en: 'Connected context to 2026 LDC graduation and structural shift from remittance-import dependence to domestic production/IT/hydro.',
        ne: 'सन् २०२६ को LDC स्तरोन्नति र आयातमुखी अर्थतन्त्रबाट उत्पादनमुखी रूपान्तरणका प्राथमिकता स्पष्ट पारिएको ।',
      },
      {
        en: 'Analyzed MTEF/Project Bank alignment and capital expenditure execution bottlenecks.',
        ne: 'मध्यकालीन खर्च संरचना (MTEF), आयोजना बैंक र पुँजीगत खर्च सुधारका उपायहरू समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-302',
    paper: 'Paper III: Contemporary Issues & Development',
    subject: 'Public Finance & Fiscal Federalism',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Sixteenth Periodic Plan of Nepal (2081/82–2085/86)',
    sourcePath: '/materials/sixteenth-plan-summary.pdf',
    en: {
      title: 'Low Capital Budget Expenditure in Nepal: Causes & Reforms',
      question:
        'Despite constitutional fixing of Budget Day (Jestha 15), Nepal continues to face persistently low capital expenditure and last-quarter bunching ("Asare Bikash"). Critically analyze the root causes and recommend actionable public financial management reforms.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Capital expenditure drives physical infrastructure, crowds in private investment, and expands long-term productive capacity. Although Article 119(3) of the Constitution mandated presenting the federal budget on Jestha 15 to allow pre-fiscal readiness, capital budget absorption frequently stagnates around 60–65% with disproportionate fourth-quarter spending.',
      sections: [
        {
          heading: '1. Structural Causes of Low Capital Absorption',
          points: [
            'Unprepared project entry: Inclusion of politically driven projects into annual budgets without Detailed Project Reports (DPR), Environmental Impact Assessments (EIA), or land acquisition clearance.',
            'Inter-agency coordination friction: Prolonged delays among infrastructure ministries, Ministry of Forests, land revenue offices, and utility agencies regarding tree-felling and right-of-way.',
            'Procurement & contractor bottlenecks: Low-bid tendering without capacity verification, mobilization-advance misuse, weak contract supervision, and chronic shortages of construction materials.',
            'Bunched disbursement ("Asare Bikash"): Slow first-trimester procurement approval followed by hasty, quality-compromising billing in Ashadh.',
          ],
        },
        {
          heading: '2. Actionable Reforms for Capital Budget Efficiency',
          points: [
            'Strict National Project Bank gatekeeping: Prohibit budget allocation to any project lacking completed DPR, EIA/IEE, and land clearance.',
            'Pre-fiscal procurement readiness: Complete tender invitation and evaluation between Jestha 15 and Shrawan 1 so field execution starts immediately in the first quarter.',
            'Public Procurement Act modernization: Enforce contractor grading/capacity limits, e-GP transparency, milestone-linked payments, and two-shift execution on national pride projects.',
            'Single-window inter-ministry clearance and uninterrupted tenure for high-performing project directors.',
          ],
        },
      ],
      conclusion:
        'Constitutional budget-calendar reform must be matched by project-readiness discipline and procurement accountability. Accelerating evenly paced, quality-assured capital spending is essential to unlock economic growth and fiscal credibility.',
    },
    ne: {
      title: 'न्यून पुँजीगत खर्च र "असारे विकास" प्रवृत्ति: कारण र सुधार',
      question:
        'जेठ १५ मै बजेट पेस गर्ने संवैधानिक व्यवस्था हुँदाहुँदै पनि नेपालमा पुँजीगत खर्च न्यून हुने र आर्थिक वर्षको अन्त्यमा खर्च थुप्रिने ("असारे विकास") प्रवृत्तिका मूल कारणहरू केलाउँदै सार्वजनिक वित्तीय व्यवस्थापन सुधारका ठोस उपायहरू सिफारिस गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'पुँजीगत खर्चले पूर्वाधार निर्माण, निजी लगानी आकर्षित र दीर्घकालीन आर्थिक वृद्धिको जग बसाल्छ । नेपालको संविधानको धारा ११९(३) ले पूर्वतयारीका लागि जेठ १५ मै संघीय बजेट ल्याउने व्यवस्था गरे तापनि वास्तविक पुँजीगत खर्च ६०–६५ प्रतिशतको हाराहारीमा खुम्चिने र असार महिनामा मात्र अत्यधिक भुक्तानी हुने संरचनागत समस्या कायमै छ ।',
      sections: [
        {
          heading: '१. पुँजीगत खर्च न्यून हुनुका मूल कारणहरू',
          points: [
            'पूर्वतयारीबिनाका आयोजना छनोट: विस्तृत आयोजना प्रतिवेदन (DPR), वातावरणीय प्रभाव मूल्याङ्कन (EIA) र जग्गा प्राप्ति नटुङ्गिएका आयोजनाहरू राजनीतिक दबाबमा बजेटमा समावेश गरिनु ।',
            'अन्तर-निकाय समन्वयको जटिलता: रूख कटान, मुआब्जा वितरण र युटिलिटी स्थानान्तरणमा विकासे मन्त्रालय, वन मन्त्रालय र स्थानीय प्रशासनबीच लामो प्रक्रियागत अल्झन ।',
            'खरिद कानुन र निर्माण व्यवसायीको क्षमता: न्यूनतम कबोल (Low Bidding) को विकृति, कार्यक्षमताभन्दा बढी ठेक्का ओगट्ने प्रवृत्ति, निर्माण सामग्रीको अभाव र कमजोर प्राविधिक सुपरिवेक्षण ।',
            'खर्चको असन्तुलित समयचक्र: प्रथम त्रैमासिकमा कार्यविधि र ठेक्कामै अल्झिने तथा आर्थिक वर्षको अन्त्यमा गुणस्तरहीन हतारो खर्च ("असारे विकास") गर्ने प्रचलन ।',
          ],
        },
        {
          heading: '२. पुँजीगत खर्च प्रभावकारिता बढाउने ठोस उपायहरू',
          points: [
            'राष्ट्रिय आयोजना बैंकको कडाइ: DPR, वातावरणीय स्वीकृति र जग्गा प्राप्ति सम्पन्न भएका "रेडी टु गो" आयोजनामा मात्र बजेट विनियोजन गर्ने कठोर वित्तीय अनुशासन ।',
            'पूर्व-बजेट खरिद तयारी: जेठ १५ देखि साउन १ भित्र खरिद कार्ययोजना र बोलपत्र प्रक्रिया अगाडि बढाई साउनदेखि नै कार्यस्थलमा निर्माण थाल्ने ।',
            'सार्वजनिक खरिद सुधार: निर्माण व्यवसायीको अधिकतम ठेक्का सीमा (Bid Capacity) कडाइका साथ लागू गर्ने, राष्ट्रिय गौरवका आयोजनामा दुई सिफ्टमा काम गराउने र माइलस्टोनमा आधारित भुक्तानी दिने ।',
            'एकद्वार समन्वय र आयोजना प्रमुखको स्थायित्व: वन तथा जग्गा विवाद सुल्झाउन अधिकारसम्पन्न एकद्वार संयन्त्र र आयोजना प्रमुखको कार्यसम्पादनमा आधारित स्थायित्व कायम गर्ने ।',
          ],
        },
      ],
      conclusion:
        'बजेट क्यालेन्डरको संवैधानिक सुधारलाई आयोजना पूर्वतयारी, खरिद सुशासन र त्रैमासिक खर्च अनुशासनले साथ दिएमा मात्र पुँजीगत खर्चको मात्रा र गुणस्तर दुवै अभिवृद्धि भई समृद्धिको लक्ष्य साकार हुन्छ ।',
    },
    rubric: [
      {
        en: 'Referenced Article 119(3) Jestha 15 constitutional budget calendar and diagnosed project-readiness (DPR/EIA/land) failures.',
        ne: 'संविधानको धारा ११९(३) को जेठ १५ को बजेट व्यवस्था र पूर्वतयारी (DPR/EIA/जग्गा प्राप्ति) को अभाव औँल्याइएको ।',
      },
      {
        en: 'Examined inter-ministry clearance delays, low-bid procurement distortions, and Q4 bunching ("Asare Bikash").',
        ne: 'अन्तर-मन्त्रालय समन्वय अभाव, न्यून कबोल ठेक्का विकृति र असारे विकास प्रवृत्तिको विश्लेषण गरिएको ।',
      },
      {
        en: 'Proposed Project Bank gatekeeping, Q1 procurement execution, bid-capacity enforcement, and project-chief accountability.',
        ne: 'आयोजना बैंकको कडाइ, प्रथम त्रैमासिक कार्यान्वयन र बिड क्यापासिटी सुधारका ठोस उपाय सुझाइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-303',
    paper: 'Paper III: Contemporary Issues & Development',
    subject: 'Environment, Ecology & Climate Change',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Nepal Parichaya: Physical Geography & Ecological Belts',
    sourcePath: '/materials/nepal-parichaya-geography.pdf',
    en: {
      title: 'Climate Change Vulnerability across Nepal’s Ecological Belts & Green Resilience',
      question:
        'Analyze the multidimensional impacts of climate change across Nepal’s Mountain, Hill, and Terai ecological belts, and propose policy and institutional strategies for climate adaptation and climate finance mobilization.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Despite contributing less than 0.1% of global greenhouse gas emissions, Nepal ranks among the world’s most climate-vulnerable nations due to its fragile young Himalayan topography, steep elevational gradient (59 m to 8,848.86 m), and monsoon-dependent agrarian livelihoods.',
      sections: [
        {
          heading: '1. Ecological Belt-Wise Climate Impacts',
          points: [
            'Himalayan Belt (Mountains): Accelerated glacial retreat, expansion of potentially dangerous glacial lakes raising Glacial Lake Outburst Flood (GLOF) risks to downstream hydropower and settlements, and upward shift of snowlines/alpine pastures.',
            'Pahad & Chure Belt (Hills): Erratic cloudbursts triggering landslides, drying up of traditional mountain springs (Mul Sukne), soil erosion, and forest fires degrading Chure-Bhawar recharge zones.',
            'Terai Belt (Plains): Recurrent flash floods, inundation, river-bank cutting, prolonged winter droughts, groundwater depletion, and spread of vector-borne diseases impacting national food security.',
          ],
        },
        {
          heading: '2. Strategic Adaptation, Mitigation & Climate Finance Measures',
          points: [
            'Localizing adaptation (LAPA & NAP): Mainstream National Adaptation Plan (2021–2050) priorities into all 753 local governments with watershed-based Chure-Terai conservation and spring-revival programs.',
            'Multi-hazard early warning & resilient infrastructure: Expand real-time GLOF/flood telemetry across Koshi, Gandaki, and Karnali basins and enforce climate-proofing standards for roads and hydro projects.',
            'Green energy transition: Accelerate Nepal’s Net-Zero 2045 pledge via clean hydroelectricity, electric mobility,clean cooking, and community forestry carbon sinks.',
            'Climate justice & Loss-and-Damage diplomacy: Strengthen institutional project-writing capacity to access Green Climate Fund (GCF), Loss and Damage Fund, and mountain-alliance climate diplomacy (Sagarmatha Sambaad).',
          ],
        },
      ],
      conclusion:
        'Climate resilience in Nepal requires an integrated upstream-downstream (Himal-Pahad-Terai) approach. Combining community-led local adaptation, green infrastructure standards, and proactive international climate finance diplomacy will safeguard both ecosystems and livelihoods.',
    },
    ne: {
      title: 'नेपालका पारिस्थितिकीय पेटीहरूमा जलवायु परिवर्तनको असर र अनुकूलन रणनीति',
      question:
        'नेपालको हिमाल, पहाड र तराई पारिस्थितिकीय पेटीहरूमा जलवायु परिवर्तनले पारेका बहुआयामिक असरहरूको विश्लेषण गर्दै जलवायु अनुकूलन तथा जलवायु वित्त परिचालनका रणनीतिक उपायहरू प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'विश्वव्यापी हरितगृह ग्यास उत्सर्जनमा नेपालको हिस्सा नगण्य (०.१ प्रतिशतभन्दा कम) रहे तापनि कमजोर भू-बनोट, तीव्र उचाइगत विविधता (५९ मि. देखि ८,८४८.८६ मि.) र मनसुनमा आधारित जीविकोपार्जनका कारण नेपाल जलवायु परिवर्तनको उच्च जोखिमयुक्त मुलुकमा पर्दछ ।',
      sections: [
        {
          heading: '१. भौगोलिक पेटीअनुसार जलवायु परिवर्तनका बहुआयामिक असरहरू',
          points: [
            'हिमाली प्रदेश: तापक्रम वृद्धिसँगै हिमनदीहरू तीव्र गतिमा पग्लिनु, हिमताल विस्फोटन (GLOF) को जोखिमले तल्लो तटीय जलविद्युत् र बस्ती असुरक्षित बन्नु तथा हिमरेखा र चरन क्षेत्र माथि सर्नु ।',
            'पहाडी तथा चुरे क्षेत्र: अतिवृष्टि र खण्डवृष्टिका कारण पहिरो, भू-क्षय, पानीका परम्परागत मूल सुक्ने समस्या र डढेलोको प्रकोपले चुरे जलाधार क्षेत्रको पुनर्भरण क्षमता घट्नु ।',
            'तराई प्रदेश: बाढी, डुबान, नदी कटान, शीतलहर/लु, भूमिगत जलस्तर ह्रास र कीटजन्य रोगको विस्तारले राष्ट्रिय खाद्य सुरक्षा र कृषि उत्पादकत्वमा प्रत्यक्ष धक्का पुग्नु ।',
          ],
        },
        {
          heading: '२. जलवायु अनुकूलन र जलवायु वित्त परिचालनका रणनीतिहरू',
          points: [
            'स्थानीय अनुकूलन (NAP र LAPA): राष्ट्रिय अनुकूलन योजना (२०२१–२०५०) लाई ७५३ वटै स्थानीय तहको योजना प्रक्रियामा मूलप्रवाहीकरण गर्दै मुहान संरक्षण र एकीकृत चुरे–तराई जलाधार व्यवस्थापन गर्ने ।',
            'पूर्वसूचना प्रणाली र उत्थानशील पूर्वाधार: कोशी, गण्डकी र कर्णाली नदी बेसिनमा बहुप्रकोप पूर्वसूचना प्रणाली विस्तार गर्ने तथा सडक र जलविद्युत् संरचनालाई जलवायु-उत्थानशील बनाउने ।',
            'हरित अर्थतन्त्र र शून्य कार्बन लक्ष्य: सन् २०४५ सम्म खुद शून्य उत्सर्जन (Net-Zero) हासिल गर्न स्वच्छ विद्युतीय यातायात, विद्युतीय चुल्हो र सामुदायिक वनको कार्बन व्यापार प्रवर्द्धन गर्ने ।',
            'जलवायु कूटनीति र हानि-नोक्सानी कोष: पर्वतीय राष्ट्रहरूको साझा एजेन्डा (सगरमाथा संवाद) सशक्त पार्दै हरित जलवायु कोष (GCF) र हानि-नोक्सानी कोष (Loss & Damage Fund) बाट अनुदान भित्र्याउन प्राविधिक प्रस्ताव लेखन क्षमता बढाउने ।',
          ],
        },
      ],
      conclusion:
        'हिमाल, पहाड र तराई पारिस्थितिकीय रूपमा अन्तरआबद्ध रहेकाले माथिल्लो र तल्लो तटीय अन्तरसम्बन्धमा आधारित अनुकूलन कार्यक्रम, हरित विकास र प्रभावकारी जलवायु कूटनीति नै नेपालको दिगो भविष्यको आधार हो ।',
    },
    rubric: [
      {
        en: 'Structured impacts systematically across Himal (GLOFs), Pahad/Chure (landslides, drying springs), and Terai (floods, food security).',
        ne: 'हिमाल (GLOF), पहाड/चुरे (मूल सुक्ने, पहिरो) र तराई (डुबान, खाद्य सुरक्षा) मा परेका असर पेटीगत रूपमा केलाइएको ।',
      },
      {
        en: 'Referenced NAP/LAPA localization, Net-Zero 2045 target, and upstream-downstream watershed linkage.',
        ne: 'राष्ट्रिय तथा स्थानीय अनुकूलन योजना (NAP/LAPA), सन् २०४५ नेट-जिरो लक्ष्य र तल्लो-माथिल्लो तटीय अन्तरसम्बन्ध उल्लेख गरिएको ।',
      },
      {
        en: 'Included international climate finance & Loss-and-Damage diplomacy.',
        ne: 'हरित जलवायु कोष (GCF) र हानि-नोक्सानी कोषमार्फत जलवायु वित्त परिचालनको उपाय समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-304',
    paper: 'Paper III: Contemporary Issues & Development',
    subject: 'Foreign Policy & Economic Diplomacy',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Nepal Parichaya: Historical Timeline & Modern Transition',
    sourcePath: '/materials/nepal-parichaya-history.pdf',
    en: {
      title: 'Constitutional Bases of Nepal’s Foreign Policy & Economic Diplomacy',
      question:
        'State the constitutional foundations of Nepal’s foreign policy and suggest measures to make Nepal’s economic diplomacy result-oriented.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Guided by geo-strategic sensitivity between two Asian economic giants and sovereign resilience throughout history, Nepal conducts an independent, balanced foreign policy rooted in Articles 50(4) and 51(m) of the Constitution of Nepal.',
      sections: [
        {
          heading: '1. Constitutional Foundations (Article 51(m))',
          points: [
            'Conducting an independent foreign policy safeguarding sovereignty, territorial integrity, independence, and supreme national interest.',
            'Five pillars: Charter of the United Nations, Non-Alignment, Principles of Panchsheel (peaceful coexistence), International Law, and Norms of World Peace.',
            'Reviewing past treaties and concluding new agreements strictly on the basis of equality and mutual benefit.',
          ],
        },
        {
          heading: '2. Making Economic Diplomacy Result-Oriented',
          points: [
            'Target-driven mission mandates: Assign measurable KPIs to diplomatic missions for FDI mobilization, export promotion, tourism branding, technology transfer, and safe dignified labor diplomacy.',
            'Post-LDC graduation readiness: Negotiate bilateral/regional preferential trade arrangements and transit efficiency ahead of 2026 LDC graduation.',
            'Institutional synergy: Strengthen coordination among MoFA, Ministry of Finance, Industry/Commerce, Investment Board Nepal, and Non-Resident Nepali (NRN) networks.',
          ],
        },
      ],
      conclusion:
        'Political diplomacy safeguards sovereignty, while economic diplomacy builds national prosperity. Equipping embassies with commercial expertise and unified inter-ministerial backing will turn Nepal’s geopolitical location into an economic bridge.',
    },
    ne: {
      title: 'नेपालको परराष्ट्र नीतिका संवैधानिक आधार र आर्थिक कूटनीति',
      question:
        'नेपालको परराष्ट्र नीतिका संवैधानिक आधारहरू उल्लेख गर्दै आर्थिक कूटनीतिलाई नतिजामुखी बनाउने उपायहरू प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'सार्वभौम स्वतन्त्रताको ऐतिहासिक विरासत र संवेदनशील भू-राजनीतिक अवस्थितिका बीच नेपालको संविधानको धारा ५०(४) र धारा ५१(ड) ले राष्ट्रिय हितको रक्षार्थ स्वतन्त्र र सन्तुलित परराष्ट्र नीतिको मार्गनिर्देश गरेको छ ।',
      sections: [
        {
          heading: '१. परराष्ट्र नीतिका संवैधानिक आधारहरू (धारा ५१(ड))',
          points: [
            'नेपालको सार्वभौमसत्ता, भौगोलिक अखण्डता, स्वाधीनता र राष्ट्रिय हितको रक्षा गर्न क्रियाशील रहने ।',
            'पाँच आधारस्तम्भ: संयुक्त राष्ट्रसंघको बडापत्र, असंलग्नता, पञ्चशीलको सिद्धान्त, अन्तर्राष्ट्रिय कानुन र विश्वशान्तिको मान्यताका आधारमा स्वतन्त्र परराष्ट्र नीति सञ्चालन गर्ने ।',
            'विगतका सन्धि–सम्झौताको पुनरावलोकन गर्दै समानता र पारस्परिक हितका आधारमा सन्धि–सम्झौता गर्ने ।',
          ],
        },
        {
          heading: '२. आर्थिक कूटनीतिलाई नतिजामुखी बनाउने उपायहरू',
          points: [
            'कूटनीतिक नियोगको नतिजामूलक कार्यसम्पादन: राजदूतावासहरूलाई वैदेशिक लगानी (FDI), निर्यात प्रवर्द्धन, पर्यटन प्रवर्द्धन, प्रविधि हस्तान्तरण र सुरक्षित श्रम कूटनीतिका मापनयोग्य लक्ष्य तोक्ने ।',
            'LDC स्तरोन्नतिपछिको व्यापार कूटनीति: सन् २०२६ पछिको सहुलियतपूर्ण बजार पहुँच र पारवहन सहजीकरणका लागि द्विपक्षीय तथा क्षेत्रीय आर्थिक सम्झौतामा जोड दिने ।',
            'संस्थागत समन्वय: परराष्ट्र, अर्थ, उद्योग/वाणिज्य मन्त्रालय, लगानी बोर्ड र गैरआवासीय नेपाली (NRN) सञ्जालबीच एकीकृत समन्वय कायम गर्ने ।',
          ],
        },
      ],
      conclusion:
        'राजनीतिक कूटनीतिले राष्ट्रिय स्वाभिमान जोगाउँछ भने आर्थिक कूटनीतिले स्वाधीन अर्थतन्त्र निर्माण गर्दछ । कूटनीतिक नियोगको व्यावसायिक क्षमता अभिवृद्धि र राष्ट्रिय सर्वसम्मतिबाट आर्थिक कूटनीतिलाई परिणाममुखी बनाउन सकिन्छ ।',
    },
    rubric: [
      {
        en: 'Cited Articles 50(4) & 51(m) and all five pillars (UN Charter, Non-Alignment, Panchsheel, International Law, World Peace).',
        ne: 'धारा ५०(४) र ५१(ड) तथा पञ्चआधार (राष्ट्रसंघ बडापत्र, असंलग्नता, पञ्चशील, अन्तर्राष्ट्रिय कानुन, विश्वशान्ति) उल्लेख गरिएको ।',
      },
      {
        en: 'Covered core dimensions of economic diplomacy: FDI, trade/transit, tourism, labor diplomacy, and NRN engagement.',
        ne: 'लगानी, व्यापार, पर्यटन, श्रम कूटनीति र गैरआवासीय नेपाली परिचालनसहितका व्यावहारिक उपाय समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-305',
    paper: 'Paper III: Contemporary Issues & Development',
    subject: 'Social Inclusion, Culture & Demographics',
    postTarget: 'Section Officer / Nayab Subba / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Nepal Parichaya: Culture, Languages & National Heritage',
    sourcePath: '/materials/nepal-parichaya-culture-heritage.pdf',
    en: {
      title: 'Cultural Diversity, National Unity & Harnessing Demographic Dividend',
      question:
        'Nepal is characterized by rich multi-ethnic and linguistic diversity alongside rapid youth out-migration. How can cultural heritage and youth human capital be leveraged together for national prosperity?',
      marksAllocation: '2.5 + 2.5 = 5 Marks',
      introduction:
        'Article 3 of the Constitution defines Nepal as a multi-ethnic, multi-lingual, multi-religious, and multi-cultural nation united by common aspirations. Per National Census 2078, Nepal hosts 142 caste/ethnic groups, 124 mother tongues, and a substantial working-age population window.',
      sections: [
        {
          heading: '1. Preserving Diversity & Cultural Heritage as Economic Assets',
          points: [
            'Protect tangible UNESCO World Heritage Sites and intangible indigenous knowledge, crafts, festivals, and languages through local curriculum integration and Language Commission initiatives.',
            'Link cultural heritage trails, homestays, and geographical-indication (GI) artisan products directly to rural heritage tourism and local livelihoods.',
          ],
        },
        {
          heading: '2. Retaining Youth & Capturing the Demographic Dividend',
          points: [
            'Convert remittance savings and returnee migrants’ skills, capital, and technology into domestic agro-processing, green enterprises, and IT freelancing hubs.',
            'Align technical and vocational education (TVET) and startup seed credit with local cultural, tourism, and productive sectors so youths find dignified careers within Nepal.',
          ],
        },
      ],
      conclusion:
        'Unity in diversity provides social harmony, while skilled youth provide productive dynamism. Connecting cultural entrepreneurship with youth innovation transforms heritage preservation into sustainable domestic employment.',
    },
    ne: {
      title: 'सांस्कृतिक विविधता संरक्षण र जनसाङ्ख्यिक लाभको उपयोग',
      question:
        'नेपाल बहुजातीय र बहुभाषिक विविधताले धनी रहँदारहँदै तीव्र युवा पलायनको चुनौती भोगिरहेको छ । सांस्कृतिक सम्पदा र युवा जनसाङ्ख्यिक लाभलाई राष्ट्रिय समृद्धिका लागि कसरी सँगसँगै उपयोग गर्न सकिन्छ ?',
      marksAllocation: '२.५ + २.५ = ५ अङ्क',
      introduction:
        'नेपालको संविधानको धारा ३ ले बहुजातीय, बहुभाषिक, बहुधार्मिक र बहुसांस्कृतिक विशेषतायुक्त राष्ट्रका रूपमा नेपाललाई परिभाषित गरेको छ । राष्ट्रिय जनगणना २०७८ अनुसार १४२ जातजाति र १२४ मातृभाषा रहेको नेपालमा हाल सक्रिय उमेर समूहको जनसाङ्ख्यिक लाभ (Demographic Dividend) समेत विद्यमान छ ।',
      sections: [
        {
          heading: '१. सांस्कृतिक विविधता र सम्पदाको उत्पादनशील संरक्षण',
          points: [
            'मूर्त विश्व सम्पदा र अमूर्त मौलिक कला, सीप, पर्व तथा भाषाहरूको स्थानीय पाठ्यक्रम र पुस्तान्तरणमार्फत संरक्षण गरी सामाजिक सद्भाव सुदृढ तुल्याउने ।',
            'सम्पदा पदमार्ग, सामुदायिक होमस्टे र मौलिक हस्तकला/रैथाने उत्पादनको ब्रान्डिङ गरी सांस्कृतिक पर्यटनलाई ग्रामीण आयआर्जनसँग जोड्ने ।',
          ],
        },
        {
          heading: '२. युवा पलायन न्यूनीकरण र जनसाङ्ख्यिक लाभको सदुपयोग',
          points: [
            'वैदेशिक रोजगारीबाट फर्किएका युवाको सीप, अनुभव र विप्रेषण पुँजीलाई स्वदेशी कृषि प्रशोधन, पर्यटन र स्टार्टअप उद्यममा रूपान्तरण गर्ने (Returnee Entrepreneurship) ।',
            'बजारको मागअनुसार प्राविधिक तथा व्यावसायिक शिक्षा (TVET), सहुलियतपूर्ण स्टार्टअप कर्जा र सूचना प्रविधि (IT) आउटसोर्सिङ विस्तार गरी स्वदेशमै मर्यादित रोजगारी सिर्जना गर्ने ।',
          ],
        },
      ],
      conclusion:
        'विविधतामा एकता सामाजिक स्थायित्वको जग हो भने सीपयुक्त युवा आर्थिक रूपान्तरणका संवाहक हुन् । मौलिक सम्पदामा आधारित उद्यमशीलता र युवा नवप्रवर्तनको संयोजनले स्वाधीन समृद्धिको ढोका खोल्दछ ।',
    },
    rubric: [
      {
        en: 'Referenced Article 3 / Census 2078 diversity context (142 groups, 124 languages).',
        ne: 'धारा ३ र जनगणना २०७८ को विविधताको सन्दर्भ (१४२ जातजाति, १२४ भाषा) उल्लेख गरिएको ।',
      },
      {
        en: 'Linked tangible/intangible cultural heritage to tourism, GI crafts, and returnee youth entrepreneurship/IT jobs.',
        ne: 'सम्पदा पर्यटन, रैथाने सीप र रिटर्नी युवा उद्यमशीलता/सूचना प्रविधि रोजगारीलाई जोडिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-401',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Public Service Delivery & E-Governance',
    postTarget: 'Section Officer / Nayab Subba / Kharidar',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
    en: {
      title: 'Public Service Delivery Modernization & E-Governance in Nepal',
      question:
        'Public service delivery is the visible face of the state. Critically assess the current state of public service delivery in Nepal and outline how Digital Public Infrastructure (E-Governance) can make services seamless, inclusive, and corruption-free.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Public service delivery encompasses all regulatory, welfare, and developmental services provided by state institutions to citizens. Citizens judge the legitimacy of democracy and federalism primarily through the speed, fairness, dignity, and cost-effectiveness of frontline public offices.',
      sections: [
        {
          heading: '1. Current Bottlenecks in Nepal’s Public Service Delivery',
          points: [
            'Process-heavy silos: Citizens must repeatedly submit identical photocopies across disconnected offices (citizenship, land revenue, transport, tax) due to weak system interoperability.',
            'Physical queues & broker interference: High-footfall offices suffer from server downtime, opaque token workflows, and middleman (bichauliya) rent-seeking.',
            'Digital & geographical divide: Elderly, rural, and differently-abled citizens face barriers in accessing online forms without assisted service desks.',
            'Weak frontline empowerment: Supply-driven bureaucratic attitude rather than citizen-as-sovereign service culture.',
          ],
        },
        {
          heading: '2. Role of E-Governance & Digital Public Infrastructure (DPI)',
          points: [
            'Once-Only Principle & Interoperability: Connect National Identity Card (NID), Nagarik App, land records, tax, and civil registration via secure API data-exchange layers so citizens never resubmit verified documents.',
            'Faceless, cashless, and paperless workflows: End-to-end online application, QR/digital payment, automated time-stamped tracking, and digital signatures eliminate discretionary contact and petty corruption.',
            'Resilient sovereign infrastructure: Upgrade Government Integrated Data Center (GIDC), cybersecurity audits, disaster recovery, and 24/7 uptime SLAs.',
            'Assisted digital inclusion: Establish Citizen Service Centers (Nagarik Sewa Kendra) and ward-level helpdesks so non-digital users also benefit equitably.',
          ],
        },
      ],
      conclusion:
        'Digitizing a broken manual process merely creates a broken digital process; therefore, e-governance must be paired with Business Process Re-engineering (BPR), interoperable National ID architecture, and empathetic frontline staff.',
    },
    ne: {
      title: 'सार्वजनिक सेवा प्रवाहको आधुनिकीकरण र विद्युतीय सुशासन (E-Governance)',
      question:
        'सार्वजनिक सेवा प्रवाह राज्यको प्रत्यक्ष अनुहार हो । नेपालको सार्वजनिक सेवा प्रवाहको वर्तमान अवस्थाको समालोचनात्मक मूल्याङ्कन गर्दै डिजिटल सार्वजनिक पूर्वाधार (विद्युतीय सुशासन) ले सेवा प्रवाहलाई कसरी सरल, समावेशी र भ्रष्टाचारमुक्त बनाउन सक्छ ? उल्लेख गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'राज्यले नागरिकको हित, नियमन र विकासका लागि उपलब्ध गराउने सम्पूर्ण वस्तु तथा सेवाको वितरण प्रक्रिया नै सार्वजनिक सेवा प्रवाह हो । आमनागरिकले सरकार र संघीय शासन प्रणालीको औचित्य सिंहदरबारका नीतिबाट भन्दा वडा तथा मालपोत/यातायात कार्यालयको व्यवहारबाट मूल्याङ्कन गर्दछन् ।',
      sections: [
        {
          heading: '१. नेपालको सार्वजनिक सेवा प्रवाहका विद्यमान समस्याहरू',
          points: [
            'अन्तर-आबद्धताको अभाव र दोहोरो कागजात: सरकारी सूचना प्रणालीहरू आपसमा नजोडिँदा नागरिकले एउटै परिचयपत्रको फोटोकपी हरेक कार्यालयमा बारम्बार बुझाउनुपर्ने झन्झट ।',
            'भीडभाड, सर्भर समस्या र बिचौलियाको प्रभाव: बढी चाप हुने कार्यालयहरूमा कमजोर सर्भर, झन्झटिलो कार्यविधि र बिचौलियाको चलखेल ।',
            'डिजिटल खाडल (Digital Divide): ग्रामीण, ज्येष्ठ नागरिक, निरक्षर र अपाङ्गता भएका सेवाग्राहीका लागि अनलाइन प्रणालीहरू एकल प्रयासमा प्रयोग गर्न कठिन हुनु ।',
            'आचरणगत समस्या: सेवाग्राहीलाई सार्वभौम मालिक ठान्नुको सट्टा शासकीय मनोवृत्ति देखाउने परम्परागत कार्यशैली ।',
          ],
        },
        {
          heading: '२. विद्युतीय सुशासन (E-Governance) मार्फत रूपान्तरणका उपायहरू',
          points: [
            'प्रणालीगत अन्तर-आबद्धता (Interoperability): राष्ट्रिय परिचयपत्र (NID), नागरिक एप, मालपोत, कर र पञ्जीकरण प्रणालीलाई एकीकृत डेटा एक्सचेन्ज प्लेटफर्ममा जोडी "एकपटक विवरण बुझाए पुग्ने" (Once-Only Principle) लागू गर्ने ।',
            'फेसलेस, पेपरलेस र क्यासलेस सेवा: अनलाइन आवेदन, विद्युतीय भुक्तानी, डिजिटल हस्ताक्षर र स्वचालित टाइम-स्ट्याम्प ट्र्याकिङद्वारा स्वविवेकी ढिलासुस्ती र अनियमितता अन्त्य गर्ने ।',
            'भरपर्दो डिजिटल पूर्वाधार र साइबर सुरक्षा: सरकारी एकीकृत डाटा सेन्टर (GIDC) को क्षमता विस्तार, ब्याकअप र नियमित सुरक्षा परीक्षण गरी "सर्भर डाउन" समस्या सदाका लागि अन्त्य गर्ने ।',
            'सहायताकक्ष र समावेशी पहुँच: डिजिटल साक्षरता कम भएका नागरिकका लागि वडा तहमा नागरिक सेवा केन्द्र तथा सहायता कक्ष (Help Desk) सञ्चालन गर्ने ।',
          ],
        },
      ],
      conclusion:
        'जटिल कागजी प्रक्रियालाई जस्ताको तस्तै कम्प्युटरमा सार्नु मात्र विद्युतीय सुशासन होइन; कार्यप्रक्रिया सरलीकरण (BPR), प्रणालीगत अन्तर-आबद्धता र नागरिकमैत्री कर्मचारी आचरणको त्रिवेणीले मात्र सेवा प्रवाहलाई आधुनिक र भ्रष्टाचारमुक्त बनाउँछ ।',
    },
    rubric: [
      {
        en: 'Diagnosed core frontline pain points: siloed systems, repeated documents, server downtime, broker rent-seeking, and digital divide.',
        ne: 'प्रणालीगत खण्डीकरण, दोहोरो कागजात, सर्भर समस्या, बिचौलिया र डिजिटल खाडलजस्ता वास्तविक समस्या औँल्याइएको ।',
      },
      {
        en: 'Explained Digital Public Infrastructure pillars: NID/Nagarik App API interoperability, faceless/cashless/paperless BPR, cybersecurity, and assisted ward helpdesks.',
        ne: 'अन्तर-आबद्धता, फेसलेस/क्यासलेस सेवा, कार्यप्रक्रिया सरलीकरण (BPR), साइबर सुरक्षा र सहायता कक्षको भूमिका स्पष्ट पारिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-402',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Office Management & Record System',
    postTarget: 'Nayab Subba / Kharidar / Section Officer',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
    en: {
      title: 'Registration, Dispatch (Darta-Chalani) & Modern Record Management',
      question:
        'Why is systematic Registration, Dispatch (Darta-Chalani), and Record Management considered the institutional memory of a public office? Suggest ways to modernize Nepal’s government filing and archiving practices.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Registration (Darta) records incoming correspondence, Dispatch (Chalani) authenticates outgoing communications, and Record Management preserves official documents across their lifecycle—from creation and active use to retention or lawful disposal.',
      sections: [
        {
          heading: '1. Importance as Institutional Memory',
          points: [
            'Ensures legal evidence, precedent continuity, and institutional memory even when officials transfer or retire.',
            'Tracks movement of files, prevents document loss, establishes clear accountability for decision timelines (Tippani), and supports Right to Information compliance.',
          ],
        },
        {
          heading: '2. Measures to Modernize Filing & Record Management',
          points: [
            'Deploy Government Integrated Office Management System (GIOMS) across all ministries and local offices for automated digital Darta-Chalani, e-Tippani, and barcode/QR file tracking.',
            'Classify records scientifically (vital, important, useful, routine) with statutory retention schedules to clear obsolete paper clutter safely.',
            'Maintain dual backup (cloud + off-site disaster-resilient archives) alongside fire/moisture-safe physical repositories for historic treaties and land records.',
          ],
        },
      ],
      conclusion:
        'An office with disorganized records loses both speed and credibility. Transitioning from manual ledger books to GIOMS-based digital archiving turns static files into searchable institutional intelligence.',
    },
    ne: {
      title: 'दर्ता–चलानी र आधुनिक अभिलेख व्यवस्थापन',
      question:
        'व्यवस्थित दर्ता–चलानी र अभिलेख व्यवस्थापनलाई सार्वजनिक कार्यालयको "संस्थागत स्मरण" (Institutional Memory) किन भनिन्छ ? सरकारी फाइलिङ तथा अभिलेख प्रणालीलाई आधुनिकीकरण गर्ने उपायहरू लेख्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'कार्यालयमा प्राप्त पत्रहरूको प्रारम्भिक अभिलेखीकरण दर्ता हो, बाहिर पठाइने पत्रहरूको प्रमाणीकरण चलानी हो भने कागजातको सिर्जनादेखि वर्गीकरण, उपयोग, संरक्षण र सुरक्षित धुल्याउनेसम्मको समग्र चक्र अभिलेख व्यवस्थापन हो ।',
      sections: [
        {
          heading: '१. संस्थागत स्मरणका रूपमा अभिलेखको महत्त्व',
          points: [
            'पदाधिकारी सरुवा वा अवकाश भए पनि कार्यालयका पूर्वनिर्णय, नजिर र कानुनी प्रमाणलाई जीवन्त राखी नीतिगत निरन्तरता दिने ।',
            'टिप्पणी आदेश, लेखापरीक्षण, न्यायिक निरूपण र नागरिकलाई १५ दिनभित्र सूचना उपलब्ध गराउने दायित्वलाई छरितो र जवाफदेही बनाउने ।',
          ],
        },
        {
          heading: '२. अभिलेख तथा फाइलिङ प्रणाली आधुनिकीकरणका उपायहरू',
          points: [
            'एकीकृत कार्यालय व्यवस्थापन प्रणाली (GIOMS) को विस्तार गरी विद्युतीय दर्ता–चलानी, ई-टिप्पणी र फाइल ट्र्याकिङ लागू गर्ने ।',
            'कागजातको महत्त्वका आधारमा वैज्ञानिक वर्गीकरण (अति महत्त्वपूर्ण, महत्त्वपूर्ण, उपयोगी र अनावश्यक) गरी प्रचलित कानुनबमोजिम समयबद्ध धुल्याउने व्यवस्था गर्ने ।',
            'ऐतिहासिक नक्सा, श्रेस्ता र सन्धिहरूलाई डिजिटाइजेसन गरी क्लाउड ब्याकअप तथा विपद्-सुरक्षित भौतिक अभिलेखालयमा दोहोरो संरक्षण गर्ने ।',
          ],
        },
      ],
      conclusion:
        'अभिलेख चुस्त नभएको कार्यालयले गति र विश्वसनीयता दुवै गुमाउँछ । परम्परागत ढड्डा प्रणालीबाट डिजिटल अभिलेखीकरणतर्फको रूपान्तरण नै आधुनिक कार्यालय व्यवस्थापनको मेरुदण्ड हो ।',
    },
    rubric: [
      {
        en: 'Explained Darta, Chalani, and lifecycle Record Management as institutional memory and legal evidence.',
        ne: 'दर्ता, चलानी र अभिलेख जीवनचक्रलाई संस्थागत स्मरण र कानुनी प्रमाणका रूपमा स्पष्ट पारिएको ।',
      },
      {
        en: 'Recommended GIOMS (e-Darta/e-Tippani), scientific classification/disposal, and disaster-safe digital backup.',
        ne: 'GIOMS (विद्युतीय दर्ता/टिप्पणी), वैज्ञानिक वर्गीकरण/धुल्याउने र डिजिटल ब्याकअपका उपाय उल्लेख गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-403',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Administrative Problem-Solving Case Study',
    postTarget: 'Section Officer (Gazetted III)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Case Study',
    sourceTitle: 'PSC Gazetted Third Class (Section Officer) Syllabus',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
    en: {
      title: 'Case Study: Reforming a High-Pressure Frontline Public Office',
      question:
        'Case Scenario: You have just been deputed as Office Chief of a busy District Service Office. Citizens wait 2–3 days for routine verifications, informal middlemen operate openly outside the gate, paper registers are scattered, staff morale is low due to unclear desk duties, and social media complaints are rising. (a) Identify the core problem and root causes. (b) Present a time-bound immediate and institutional action plan as Office Chief.',
      marksAllocation: '3 + 7 = 10 Marks',
      introduction:
        'Case Context: The scenario reflects a classic public-service governance breakdown where procedural opacity, weak internal supervision, and outdated manual workflows erode citizen trust and invite rent-seeking.',
      sections: [
        {
          heading: '(a) Core Problem & Root Causes',
          points: [
            'Core Problem: Severe erosion of citizen-centric service efficiency, transparency, and institutional credibility in a frontline public office.',
            'Root Causes: (1) Absence of queue/token management and simplified workflow; (2) Unchecked middleman nexus exploiting citizen confusion; (3) Disorganized paper records causing search delays; (4) Ambiguous job descriptions, uneven workload, and weak supervision lowering staff morale.',
          ],
        },
        {
          heading: '(b) Immediate Action Plan (First 7–30 Days)',
          points: [
            'Citizen Helpdesk & Digital Token Queue: Establish an official Citizen Helpdesk at the entrance with checklist slips, update the Citizen Charter visibly, and introduce first-come-first-served tokens (with priority lane for senior citizens, pregnant women, and persons with disabilities).',
            'Eliminate Broker Access: Restrict unauthorized entry inside service counters, mandate staff ID badges, and coordinate with District Administration/Police against illicit fee solicitation.',
            'Clear Desk Allocation & Daily Huddle: Issue written desk-wise responsibilities with turnaround time standards (TAT), rotate high-pressure counters fairly, and hold a 10-minute end-of-day bottleneck review.',
          ],
        },
        {
          heading: '(c) Medium-Term Institutional Reforms (1–6 Months)',
          points: [
            'Digitize Records & Online Pre-Booking: Index scattered registers, launch online slot booking / SMS status alerts, and enable QR/electronic fee payment.',
            'Accountability & Staff Motivation: Conduct monthly Public Hearings (Good Governance Act Sec. 30), install CCTV & grievance QR codes, recognize top-performing staff monthly, and enforce disciplinary action for willful delay.',
          ],
        },
      ],
      conclusion:
        'Expected Outcome: Combining firm anti-broker enforcement with simplified workflows, digital tracking, and fair staff empowerment rapidly restores citizen dignity, cuts waiting time from days to hours, and rebuilds public trust.',
    },
    ne: {
      title: 'मामिला अध्ययन (Case Study): सेवाग्राहीको अत्यधिक चाप भएको कार्यालयको सुधार',
      question:
        'घटना विवरण: तपाईं भर्खरै सेवाग्राहीको अत्यधिक चाप हुने एक जिल्लास्तरीय कार्यालयको प्रमुखका रूपमा खटिनुभएको छ । त्यहाँ सामान्य कामका लागि नागरिकले २–३ दिन लाइन बस्नुपरेको, मूलगेटबाहिर बिचौलियाको बिगबिगी रहेको, कागजी ढड्डाहरू अस्तव्यस्त भएको, कार्यविभाजन स्पष्ट नहुँदा कर्मचारीको मनोबल खस्किएको र सामाजिक सञ्जालमा व्यापक जनगुनासो बढेको अवस्था छ । (क) प्रस्तुत मामिलाको मुख्य समस्या र कारणहरू पहिचान गर्नुहोस् । (ख) कार्यालय प्रमुखको हैसियतले तत्काल र संस्थागत सुधारको समयबद्ध कार्ययोजना प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '३ + ७ = १० अङ्क',
      introduction:
        'प्रस्तुत मामिलाले अग्रपङ्क्तिको सार्वजनिक कार्यालयमा आन्तरिक व्यवस्थापनको कमजोरी, अपारदर्शी कार्यप्रक्रिया र फितलो सुपरिवेक्षणका कारण सिर्जित सेवा प्रवाहको संकट तथा गुम्दो जनविश्वासलाई चित्रण गर्दछ ।',
      sections: [
        {
          heading: '(क) मुख्य समस्या र अन्तर्निहित कारणहरू',
          points: [
            'मुख्य समस्या (Core Problem): अग्रपङ्क्तिको सार्वजनिक कार्यालयमा नागरिकमैत्री सेवा प्रवाह, पारदर्शिता र संस्थागत विश्वसनीयताको गम्भीर क्षयीकरण ।',
            'मूल कारणहरू: (१) टोकन प्रणाली र कार्यप्रक्रिया सरलीकरणको अभाव; (२) नागरिकको अन्योलताको फाइदा उठाउने अनधिकृत बिचौलियाको चलखेल; (३) अव्यवस्थित कागजी अभिलेखले फाइल खोज्न लाग्ने ढिलाइ; (४) अस्पष्ट कार्यविभाजन, असन्तुलित कार्यबोझ र उत्प्रेरणाको कमीले कर्मचारीको मनोबल कमजोर हुनु ।',
          ],
        },
        {
          heading: '(ख) तत्कालीन सुधार कार्ययोजना (पहिलो ७ देखि ३० दिनभित्र)',
          points: [
            'नागरिक सहायता कक्ष र टोकन प्रणाली: प्रवेशद्वारमै आधिकारिक सहायता कक्ष राखी आवश्यक कागजातको चेकलिस्ट दिने, नागरिक बडापत्र अद्यावधिक गर्ने र विद्युतीय टोकन प्रणाली (ज्येष्ठ नागरिक, गर्भवती र अपाङ्गता भएकालाई द्रुत लेनसहित) लागू गर्ने ।',
            'बिचौलिया निषेध: कार्यकक्षमा अनधिकृत व्यक्तिको प्रवेश पूर्णतः निषेध गर्ने, कर्मचारीलाई परिचयपत्र अनिवार्य गर्ने र स्थानीय प्रशासनसँगको समन्वयमा गैरकानुनी असुलीमाथि कारबाही चलाउने ।',
            'स्पष्ट कार्यविभाजन र कर्मचारी संवाद: प्रत्येक फाँटको कार्यविवरण (Job Description) र काम फर्स्यौट समयसीमा तोक्ने, कार्यबोझ सन्तुलन गर्ने र दैनिक साँझ १० मिनेट समीक्षा बैठक बसी गुनासो तत्काल सुल्झाउने ।',
          ],
        },
        {
          heading: '(ग) मध्यकालीन तथा संस्थागत सुधार (१ देखि ६ महिनाभित्र)',
          points: [
            'अभिलेख डिजिटाइजेसन र अनलाइन बुकिङ: पुराना ढड्डाहरूको अनुक्रमणिका (Indexing) र स्क्यानिङ गरी अनलाइन समय बुकिङ, एसएमएस जानकारी र विद्युतीय राजस्व भुक्तानी सुरु गर्ने ।',
            'सामाजिक जवाफदेहिता र उत्प्रेरणा: सुशासन ऐनको दफा ३० बमोजिम मासिक सार्वजनिक सुनुवाइ, सीसीटिभी निगरानी, क्यूआर गुनासो संकलन र उत्कृष्ट कार्यसम्पादन गर्ने कर्मचारीलाई मासिक सम्मान तथा ढिलासुस्ती गर्नेलाई कारबाही गर्ने ।',
          ],
        },
      ],
      conclusion:
        'अपेक्षित नतिजा: बिचौलिया नियन्त्रण, प्रविधिमैत्री कार्यप्रणाली र कर्मचारीको स्पष्ट जवाफदेहिताले २–३ दिन लाग्ने काम एकै दिनमा फर्स्यौट भई नागरिकको सम्मान र कार्यालयको साख पुनःस्थापित हुनेछ ।',
    },
    rubric: [
      {
        en: 'Pinpointed one clear Core Problem distinct from underlying symptoms/causes.',
        ne: 'लक्षण र कारणभन्दा अलग राखी एउटा स्पष्ट "मुख्य समस्या" (Core Problem) किटान गरिएको ।',
      },
      {
        en: 'Separated Action Plan into Immediate (7–30 days: token queue, helpdesk, broker ban, desk clarity) and Institutional (1–6 months: digitization, QR payment, public hearing).',
        ne: 'तत्कालीन (टोकन, सहायता कक्ष, बिचौलिया निषेध) र संस्थागत/मध्यकालीन (डिजिटाइजेसन, अनलाइन बुकिङ, सार्वजनिक सुनुवाइ) कार्ययोजना छुट्याइएको ।',
      },
      {
        en: 'Adopted realistic authority of an Office Chief addressing citizens, staff morale, and accountability together.',
        ne: 'कार्यालय प्रमुखको यथार्थपरक अधिकार क्षेत्रभित्र रही सेवाग्राही, कर्मचारी मनोबल र जवाफदेहिता तीनै पक्ष समेटिएको ।',
      },
    ],
  },
];

export function getWrittenQuestionById(
  questionId: string
): WrittenQuestion | undefined {
  return WRITTEN_QUESTIONS.find((q) => q.id === questionId);
}
