import type { WrittenQuestion } from './types';

export const PAPER_4_QUESTIONS: WrittenQuestion[] = [
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
  {
    id: 'PSC-WR-404',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Public Procurement & E-GP Integrity',
    postTarget: 'Section Officer / Nayab Subba / Kharidar',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Public Procurement Act, 2063, E-GP & Value-for-Money Governance',
      question:
        'Explain the core principles and major procurement methods under the Public Procurement Act, 2063, and critically analyze common procurement distortions in Nepal along with remedial measures.',
      marksAllocation: '4 + 3 + 3 = 10 Marks',
      introduction:
        'Public procurement accounts for the largest share of government development expenditure. Enacted to maximize economy, efficiency, transparency, non-discrimination, and competition, the Public Procurement Act (PPA), 2063 and Rules, 2064 regulate the entire cycle from annual procurement planning to contract closeout, overseen by the Public Procurement Monitoring Office (PPMO).',
      sections: [
        {
          heading: '1. Core Principles & Procurement Methods under PPA, 2063',
          points: [
            'Core principles: Open competition, equality of opportunity, transparency (e-GP publishing), economy/Value for Money (3Es), and accountability without tailoring specifications to favor any bidder.',
            'Methods for goods, works & services: Open National/International Competitive Bidding (NCB/ICB) as the default rule; Two-stage bidding for complex turn-key systems; Sealed Quotation; Direct Purchase (small urgency thresholds); Force Account (Amaanat); Ration/Catalog shopping; and Community/Users’ Committee execution.',
            'Consultancy selection methods: QCBS (Quality and Cost Based Selection), QBS, Fixed Budget, Least Cost, and Direct Negotiation within statutory ceilings.',
          ],
        },
        {
          heading: '2. Common Procurement Distortions in Practice',
          points: [
            'Low-bidding trap & abandonment: Bidders quote unrealistically low rates (e.g., 30–40% below estimate), collect mobilization advances, and abandon or stall projects mid-way.',
            'Tailored specifications & package splitting: Splitting contracts to bypass open competitive thresholds or inserting brand-specific technical clauses to favor cronies.',
            'Chronic time extensions & variation orders: Weak initial DPR/cost estimates trigger repeated cost-escalation claims and years of project delay.',
            'Syndicate/collusion & user-committee capture: Intimidation in physical bidding and contractor infiltration inside local Consumers’ Committees.',
          ],
        },
        {
          heading: '3. Actionable Procurement Reforms',
          points: [
            'Full life-cycle e-GP & real-time bid-capacity alerts blocking overloaded contractors from bidding.',
            'Strict technical quality audits (NVC/PPMO), strict action on blacklisting, realistic DPR-based cost estimation, and performance-security forfeiture on defaults.',
            'Confine Users’ Committees strictly to small labor-intensive rural works without heavy machinery outsourcing.',
          ],
        },
      ],
      conclusion:
        'Sound procurement converts taxpayer money into durable public assets. Enforcing realistic cost estimation, automated contractor-capacity screening via e-GP, and uncompromising contract accountability protects both treasury and infrastructure quality.',
    },
    ne: {
      title: 'सार्वजनिक खरिद ऐन, २०६३: सिद्धान्त, विधि र खरिद सुशासन',
      question:
        'सार्वजनिक खरिद ऐन, २०६३ का आधारभूत सिद्धान्त र प्रमुख खरिद विधिहरू उल्लेख गर्दै नेपालको सार्वजनिक खरिद प्रक्रियामा देखिएका मुख्य विकृति तथा सुधारका उपायहरू विश्लेषण गर्नुहोस् ।',
      marksAllocation: '४ + ३ + ३ = १० अङ्क',
      introduction:
        'सरकारी विकास बजेटको मुख्य हिस्सा सार्वजनिक खरिदमार्फत नै खर्च हुन्छ । सार्वजनिक खरिद कार्यविधि, प्रक्रिया तथा निर्णयलाई अझ बढी खुला, पारदर्शी, वस्तुनिष्ठ र विश्वसनीय बनाई मितव्ययिता र स्वच्छ प्रतिस्पर्धा कायम गर्न सार्वजनिक खरिद ऐन, २०६३ तथा नियमावली, २०६४ लागू गरिएको छ ।',
      sections: [
        {
          heading: '१. खरिदका आधारभूत सिद्धान्त र प्रमुख विधिहरू',
          points: [
            'प्रमुख सिद्धान्त: खुला र स्वच्छ प्रतिस्पर्धा, पारदर्शिता (e-GP), समान अवसर, मितव्ययिता र गुणस्तर (Value for Money) तथा सार्वजनिक जवाफदेहिता ।',
            'निर्माण, मालसामान तथा अन्य सेवा खरिद विधि: राष्ट्रिय/अन्तर्राष्ट्रिय खुला बोलपत्र (NCB/ICB), दुई चरणको बोलपत्र, सिलबन्दी दरभाउपत्र, सोझै खरिद, अमानत, क्याटलग सपिङ र उपभोक्ता समितिमार्फत कार्यसञ्चालन ।',
            'परामर्श सेवा छनोट विधि: गुणस्तर र लागत विधि (QCBS), गुणस्तर विधि (QBS), निश्चित बजेट र न्यूनतम लागत विधि ।',
          ],
        },
        {
          heading: '२. सार्वजनिक खरिदमा देखिएका प्रमुख विकृतिहरू',
          points: [
            'न्यून कबोल (Low Bidding) र मोबिलाइजेसन दुरुपयोग: लागत अनुमानभन्दा अत्यधिक कम दरमा ठेक्का सकार्ने, पेस्की बुझ्ने र पछि काम अलपत्र पार्ने प्रवृत्ति ।',
            'टुक्रे खरिद र स्वार्थप्रेरित स्पेसिफिकेसन: खुला बोलपत्र छल्न खरिद टुक्र्याउने वा निश्चित आपूर्तिकर्ता अनुकूल प्राविधिक मापदण्ड तोक्ने ।',
            'अपूर्ण DPR र पटक–पटक म्याद थप: कमजोर पूर्वतयारीले भेरिएसन अर्डर र मूल्य समायोजन बढ्नु ।',
            'ठेक्का सिन्डिकेट र उपभोक्ता समितिको दुरुपयोग: स्थानीय उपभोक्ता समितिमा ठेकदारकै चलखेल र भारी उपकरण प्रयोग ।',
          ],
        },
        {
          heading: '३. खरिद सुशासन सुधारका उपायहरू',
          points: [
            'पूर्ण विद्युतीय खरिद (e-GP) मार्फत ठेकेदारको कार्यक्षमता (Bid Capacity) स्वचालित जाँच गरी क्षमताभन्दा बढी ठेक्का ओगट्न नदिने ।',
            'DPR यथार्थपरक बनाई म्याद थपमा कडाइ, काम नगर्नेलाई तत्काल कालोसूची (Blacklisting) र जमानत जफत गर्ने ।',
            'उपभोक्ता समितिलाई श्रममूलक साना सामुदायिक काममा मात्र सीमित गरी पारदर्शी सामाजिक परीक्षण अनिवार्य गर्ने ।',
          ],
        },
      ],
      conclusion:
        'सार्वजनिक खरिदको पवित्रतामा नै विकासको गुणस्तर निर्भर गर्दछ । प्राविधिक शुद्धता, e-GP पारदर्शिता र ठेक्का व्यवस्थापनको कडा अनुपालनबाट राज्यकोषको दुरुपयोग रोक्न सकिन्छ ।',
    },
    rubric: [
      {
        en: 'Listed core principles (transparency, competition, non-discrimination, Value for Money) and statutory methods under PPA 2063 (NCB/ICB, sealed quotation, direct purchase, users’ committee, QCBS).',
        ne: 'ऐन २०६३ का सिद्धान्त र खुला बोलपत्र, सिलबन्दी दरभाउपत्र, सोझै खरिद, उपभोक्ता समिति र QCBS लगायत खरिद विधि उल्लेख गरिएको ।',
      },
      {
        en: 'Identified specific distortions: extreme low-bidding, contract splitting, tailored specs, repeated extensions, and user-committee misuse.',
        ne: 'न्यून कबोल, टुक्रे खरिद, म्याद थप, र उपभोक्ता समिति दुरुपयोगजस्ता विकृति औँल्याइएको ।',
      },
      {
        en: 'Recommended bid-capacity checks in e-GP, strict blacklisting, PPMO/NVC technical audits, and realistic DPR prep.',
        ne: 'e-GP बिड-क्यापासिटी जाँच, कालोसूची कारबाही, प्राविधिक परीक्षण र यथार्थपरक DPR को उपाय सुझाइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-405',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Public Auditing & Beruju Settlement',
    postTarget: 'Section Officer / SO Audit / Nayab Subba / Kharidar',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Auditing System, Section 8 Criteria & Beruju Settlement Mechanism',
      question:
        'Differentiate between internal audit and final statutory audit, outline the Section 8 audit criteria under the Audit Act, 2075, and explain the classification and settlement process of financial irregularities (Beruju).',
      marksAllocation: '3 + 3 + 4 = 10 Marks',
      introduction:
        'Public auditing guarantees fiduciary accountability over taxpayers’ money across Nepal’s Federal, Provincial, and Local Consolidated Funds. Governed by Articles 240–241 of the Constitution, the Audit Act, 2075, and the Fiscal Procedures and Financial Accountability Act, 2076, Nepal combines management-level internal audit with independent external audit by the Office of the Auditor General (OAG).',
      sections: [
        {
          heading: '1. Internal Audit vs. Final Statutory Audit',
          points: [
            'Internal Audit: Conducted regularly by the Financial Comptroller General Office (DTCO/PTCO/local internal audit units) as a constructive management control to detect voucher gaps and errors before fiscal year closure.',
            'Final Statutory Audit: Conducted independently by the constitutional Office of the Auditor General (OAG) under Article 241 across all federal, provincial, 753 local entities, and >50% state-owned corporate bodies, submitting annual reports to the President and Provincial Heads for Public Accounts Committee (PAC) scrutiny.',
          ],
        },
        {
          heading: '2. Statutory Audit Criteria under Section 8 of Audit Act, 2075',
          points: [
            'OAG conducts financial, compliance, performance, and specialized (IT/environmental/forensic) audits testing five core pillars: (1) Regularity (कानुनसम्मत र रीत पुगेको); (2) Economy (मितव्ययिता — lowest cost for given quality); (3) Efficiency (कार्यदक्षता — output/input ratio); (4) Effectiveness (प्रभावकारिता — achieving policy goals); and (5) Propriety (औचित्य — ethical public-interest reasonableness beyond mere paperwork).',
          ],
        },
        {
          heading: '3. Classification & Settlement (Samparikshan) of Beruju',
          points: [
            'Three legal categories of Beruju: (a) Recoverable (असुल उपर गर्नुपर्ने) — overpayments, embezzlement, or uncollected revenue to be recovered personally; (b) Regularizable (नियमित गर्नुपर्ने) — procedural omissions, missing approvals, or unauthorized transfers without proven malice; and (c) Unsettled Advances (पेश्की बाँकी).',
            'Settlement workflow (Fiscal Accountability Act, 2076): Responsible Officers (Office Chiefs) must respond to preliminary audit memos within 35 days by recovering amounts, attaching missing receipts, or obtaining competent regularization approval; remaining arrears are audited by OAG via Samparikshan and scrutinized by PAC and the Central Beruju Clearance Evaluation Committee.',
          ],
        },
      ],
      conclusion:
        'Rising Beruju weakens public fiscal credibility. Strengthening internal controls via CGAS/SuTRA/NAMS, enforcing Accounting Officer responsibility within the 35-day window, and linking Beruju clearance to performance appraisal will instill enduring financial discipline.',
    },
    ne: {
      title: 'सार्वजनिक लेखापरीक्षण प्रणाली, दफा ८ का आधार र बेरुजु फर्छ्यौट',
      question:
        'आन्तरिक लेखापरीक्षण र अन्तिम लेखापरीक्षणबीचको भिन्नता स्पष्ट पार्दै लेखापरीक्षण ऐन, २०७५ को दफा ८ बमोजिम लेखापरीक्षणका आधारहरू र बेरुजुको वर्गीकरण तथा फर्छ्यौट प्रक्रिया वर्णन गर्नुहोस् ।',
      marksAllocation: '३ + ३ + ४ = १० अङ्क',
      introduction:
        'जनताबाट संकलित राजस्व र सार्वजनिक कोषको कानुनसम्मत एवं मितव्ययी उपयोग सुनिश्चित गर्ने प्रमुख औजार लेखापरीक्षण हो । नेपालको संविधान (धारा २४०–२४१), लेखापरीक्षण ऐन, २०७५ र आर्थिक कार्यविधि तथा वित्तीय उत्तरदायित्व ऐन, २०७६ ले सरकारी आर्थिक कारोबारको दोहोरो निगरानी प्रणाली स्थापित गरेको छ ।',
      sections: [
        {
          heading: '१. आन्तरिक र अन्तिम लेखापरीक्षणबीचको भिन्नता',
          points: [
            'आन्तरिक लेखापरीक्षण: व्यवस्थापकीय नियन्त्रणको अभिन्न अङ्गका रूपमा कोष तथा लेखा नियन्त्रक कार्यालय (को.ले.नि.का.) वा स्थानीय आन्तरिक लेखापरीक्षण शाखाबाट आर्थिक वर्षभित्रै त्रुटि सच्याउने उद्देश्यले गरिने परीक्षण ।',
            'अन्तिम लेखापरीक्षण: संविधानको धारा २४१ बमोजिम पूर्ण स्वतन्त्र संवैधानिक निकाय "महालेखापरीक्षक" बाट संघ, प्रदेश, ७५३ स्थानीय तह र सरकारी स्वामित्वका संस्थाको वार्षिक आर्थिक विवरणमाथि गरिने बाह्य र स्वतन्त्र परीक्षण ।',
          ],
        },
        {
          heading: '२. लेखापरीक्षण ऐन, २०७५ को दफा ८ का ५ आधारहरू',
          points: [
            'महालेखापरीक्षकले वित्तीय, परिपालना र कार्यमूलक लेखापरीक्षण गर्दा पाँचवटा कसौटीमा जाँच गर्दछ: (१) नियमितता (कानुन र रीत पुगे/नपुगेको); (२) मितव्ययिता (न्यून लागतमा गुणस्तर); (३) कार्यदक्षता (उपलब्धि र लागतको अनुपात); (४) प्रभावकारिता (लक्ष्य प्राप्ति); र (५) औचित्य (विवेकपूर्ण र सार्वजनिक हितअनुकूल खर्च भए/नभएको) ।',
          ],
        },
        {
          heading: '३. बेरुजुको वर्गीकरण र फर्छ्यौट (सम्परीक्षण) प्रक्रिया',
          points: [
            'बेरुजुका तीन प्रकार: (क) असुल उपर गर्नुपर्ने (बढी भुक्तानी, हिनामिना वा राजस्व बक्यौता); (ख) नियमित गर्नुपर्ने (प्रमाणीकरण नपुगेको, अनियमित वा अख्तियारीविपरीत); र (ग) पेश्की बाँकी ।',
            'फर्छ्यौट कार्यविधि (ऐन २०७६): प्रारम्भिक प्रतिवेदन प्राप्त भएको ३५ दिनभित्र कार्यालय प्रमुख/उत्तरदायी अधिकारीले रकम असुली गर्ने, प्रमाण जुटाउने वा सक्षम निकायबाट नियमित गराई प्रमाणसहित महालेखापरीक्षकमा सम्परीक्षणका लागि पेस गर्नुपर्ने र बाँकी बेरुजु संसदीय सार्वजनिक लेखा समिति (PAC) मा छलफल हुने व्यवस्था ।',
          ],
        },
      ],
      conclusion:
        'बेरुजुको चाङ बढ्नु कमजोर वित्तीय सुशासनको सूचक हो । CGAS, SuTRA र NAMS प्रणालीको समन्वय, ३५ दिने म्यादको कडाइ र उत्तरदायी अधिकारीको कार्यसम्पादन मूल्याङ्कनसँग बेरुजु फर्छ्यौट आबद्ध गरिनु आवश्यक छ ।',
    },
    rubric: [
      {
        en: 'Contrasted Internal Audit (FCGO/DTCO management check) vs. Final Statutory Audit (OAG Art. 241 independent external audit).',
        ne: 'आन्तरिक लेखापरीक्षण (को.ले.नि.का.) र अन्तिम लेखापरीक्षण (महालेखापरीक्षक धारा २४१) बीचको भिन्नता स्पष्ट पारिएको ।',
      },
      {
        en: 'Cited all 5 Section 8 criteria of Audit Act 2075: Regularity, Economy, Efficiency, Effectiveness, and Propriety.',
        ne: 'लेखापरीक्षण ऐन २०७५ को दफा ८ का पाँचै आधार (नियमितता, मितव्ययिता, कार्यदक्षता, प्रभावकारिता र औचित्य) उल्लेख गरिएको ।',
      },
      {
        en: 'Correctly classified Beruju (Asul Upar, Niyamit, Peshki) and explained 35-day response, Samparikshan, and PAC scrutiny.',
        ne: 'बेरुजुको वर्गीकरण (असुल उपर, नियमित, पेश्की) र ३५ दिने म्याद, सम्परीक्षण तथा लेखा समितिको भूमिका लेखिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-406',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Official Drafting & Tippani',
    postTarget: 'Nayab Subba / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'PSC Nayab Subba (Non-Gazetted First Class) Curriculum',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
    en: {
      title: 'Tippani Writing, Paripatra (Circulars) & Official Decision Records',
      question:
        'What is a Tippani (Decision Note) in Nepali public administration? Outline its essential structural elements and distinguish a Circular (Paripatra) from a Peremptory Order (Tok-Aadesh).',
      marksAllocation: '3 + 2 = 5 Marks',
      introduction:
        'In Nepal’s administrative system, a Tippani is an internal written submission moving upward from the initiating desk (Rayapesh/Assistant) through supervisory tiers to the competent deciding authority so that administrative decisions follow uniform law, precedent, and accountable written trace.',
      sections: [
        {
          heading: '1. Essential Structure of an Ideal Tippani',
          points: [
            'Subject & Matter (विषय र व्यहोरा): Concise factual summary, inward letter reference/Darta number, and verified chronology without emotional bias.',
            'Legal & Policy Basis (कानुनी र नीतिगत आधार): Exact quotation of relevant Act sections, Rules, approved budget head, or previous precedent decisions.',
            'Clear Opinion & Recommendation (राय र निर्णयको खाका): Specific actionable proposal ending with "निर्णयार्थ पेस गरिएको छ" (submitted for decision) and dated signatures across tiers.',
          ],
        },
        {
          heading: '2. Circular (Paripatra) vs. Peremptory Order (Tok-Aadesh)',
          points: [
            'Paripatra (परिपत्र / Circular): A formal written directive issued simultaneously to multiple subordinate offices or units to ensure uniform policy interpretation, procedural compliance, or information sharing.',
            'Tok-Aadesh (तोक आदेश): A concise written endorsement recorded directly on the top margin of an incoming application/letter by an authorized chief directing a subordinate section on immediate handling—legitimate for routine routing, never a substitute for statutory Tippani on policy/financial decisions.',
          ],
        },
      ],
      conclusion:
        'Clear, legally grounded Tippani writing and disciplined use of Paripatra and e-Tippani (GIOMS) protect civil servants from audit queries and ensure consistent, defensible administrative justice.',
    },
    ne: {
      title: 'टिप्पणी लेखन, परिपत्र (Paripatra) र तोक आदेशको प्रयोग',
      question:
        'सार्वजनिक प्रशासनमा टिप्पणी (Tippani) भन्नाले के बुझिन्छ ? आदर्श टिप्पणीमा हुनुपर्ने अनिवार्य तत्वहरू उल्लेख गर्दै परिपत्र र तोक आदेशबीचको भिन्नता स्पष्ट पार्नुहोस् ।',
      marksAllocation: '३ + २ = ५ अङ्क',
      introduction:
        'कार्यालयमा निर्णय गर्नुपर्ने कुनै विषयमा तथ्य, प्रमाण, प्रचलित कानुनी व्यवस्था र तल्लो तहदेखि माथिल्लो तहसम्मको राय/सिफारिस खुलाई अधिकारप्राप्त अधिकारीसमक्ष निर्णयका लागि पेस गरिने आधिकारिक लिखत नै टिप्पणी (Tippani) हो ।',
      sections: [
        {
          heading: '१. आदर्श टिप्पणीमा हुनुपर्ने अनिवार्य तत्वहरू',
          points: [
            'स्पष्ट विषय र तथ्य विवरण: प्राप्त निवेदन वा पत्रको दर्ता नम्बर, मिति र घटनाक्रमको संक्षिप्त, सत्यतथ्य एवं पूर्वाग्रहरहित प्रस्तुति ।',
            'प्रचलित कानुन र नजिरको उल्लेख: सम्बन्धित ऐन, नियम, कार्यविधि, बजेट शीर्षक वा पूर्वनिर्णयको दफागत उद्धरण ।',
            'स्पष्ट राय र प्रस्तावित निर्णय: दोधारे भाषा नराखी "निर्णयार्थ पेस गरिएको छ" भन्ने ठोस प्रस्ताव, पदसोपानअनुसारको हस्ताक्षर र मिति ।',
          ],
        },
        {
          heading: '२. परिपत्र (Circular) र तोक आदेश (Tok-Aadesh) बीचको भिन्नता',
          points: [
            'परिपत्र: एउटै नीतिगत निर्देशन, जानकारी वा कार्यविधिमा एकरूपता ल्याउन एकैपटक एकभन्दा बढी मातहतका निकाय वा शाखाहरूमा पठाइने औपचारिक पत्राचार हो ।',
            'तोक आदेश: प्राप्त निवेदन वा पत्रको शिरमा कार्यालय प्रमुख वा अधिकृतले कुन शाखाले आवश्यक कारबाही गर्ने भनी संक्षेपमा लेख्ने निर्देशनात्मक आदेश हो । नियमित कार्यविभाजनमा तोक आदेश उपयोगी भए पनि आर्थिक दायित्व वा नीतिगत निर्णयमा विधिवत् टिप्पणी नै अनिवार्य हुन्छ ।',
          ],
        },
      ],
      conclusion:
        'तथ्यपरक र कानुनसम्मत टिप्पणी लेखन कर्मचारीको व्यावसायिक दक्षताको ऐना हो । GIOMS मार्फत ई-टिप्पणीको प्रयोगले निर्णय प्रक्रियालाई छिटो, पारदर्शी र प्रमाणमुखी बनाउँछ ।',
    },
    rubric: [
      {
        en: 'Defined Tippani as bottom-up accountable decision submission and specified Facts, Legal Basis, Clear Recommendation, and Signatures.',
        ne: 'टिप्पणीको परिभाषा र अनिवार्य तत्वहरू (विषय/तथ्य, कानुनी आधार, स्पष्ट राय र पदसोपान हस्ताक्षर) समेटिएको ।',
      },
      {
        en: 'Accurately contrasted Paripatra (multi-recipient uniform policy/instruction letter) vs. Tok-Aadesh (top-margin routing endorsement).',
        ne: 'परिपत्र (बहु-निकाय एकरूप निर्देशन) र तोक आदेश (निवेदनमाथिको संक्षिप्त कारबाही निर्देशन) बीचको भिन्नता स्पष्ट पारिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-407',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Inventory (Jinsi Sresta) & PAMS',
    postTarget: 'Nayab Subba / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Government Store Management (Jinsi Sresta), Core Forms & PAMS',
      question:
        'Differentiate between expendable (Khapne) and non-expendable (Nakhapne) public goods in Jinsi Sresta, and explain the core store-accounting cycle from Maag Faram to digital PAMS asset tracking and auction.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Public property and inventory accounting (Jinsi Sresta) tracks acquisition, custody, utilization, annual physical verification, and lawful disposal of public goods—ensuring zero leakage of state assets.',
      sections: [
        {
          heading: '1. Expendable (Khapne) vs. Non-Expendable (Nakhapne) Goods',
          points: [
            'Khapne (खप्ने नहुने / Expendable): Consumable supplies exhausted within one fiscal use (stationery, fuel, printer toner, cleaning items), entered in AGF No. 407 Expendable Store Ledger.',
            'Nakhapne (खप्ने / Non-Expendable Durable Assets): Capital/durable equipment retained beyond one year (furniture, laptops, vehicles, machinery), tracked individually with asset IDs in AGF No. 408 Non-Expendable Store Ledger until auctioned or written off.',
          ],
        },
        {
          heading: '2. Core Store Cycle (AGF Forms) & PAMS Modernization',
          points: [
            'Requisition to Entry: Initiated via Maag Faram (AGF 401), procured via Purchase Order (Kharid Aadesh 402), verified for quality/quantity upon receipt through Dakhila Prativedan (403) before payment release, and issued via Kharcha/Hastantaran.',
            'Verification, Auction & PAMS: Annual Jinsi Inspection (Ma.Le.Pa. 411) identifies obsolete/unserviceable goods for statutory Auction (Lilaam) or Write-off (Minaha), now consolidated in real time across federal, provincial, and local offices through the Public Assets Management System (PAMS).',
          ],
        },
      ],
      conclusion:
        'Transparent store accounting prevents phantom purchases and idle asset hoarding. Full adoption of PAMS barcode/QR tagging and annual physical verification safeguards state property across Nepal.',
    },
    ne: {
      title: 'सरकारी जिन्सी श्रेस्ता, प्रमुख फाराम र PAMS प्रणाली',
      question:
        'सरकारी जिन्सी व्यवस्थापनमा खर्च भएर जाने (खपने होइन/खर्चने) र खर्च भएर नजाने (खप्ने) मालसामानबीचको भिन्नता स्पष्ट पार्दै माग फारामदेखि लिलाम तथा PAMS सम्मको जिन्सी लेखा चक्र संक्षेपमा वर्णन गर्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'सार्वजनिक निकायले खरिद वा प्राप्त गरेका मालसामान र सम्पत्तिको प्राप्ति, भण्डारण, उपयोग, भौतिक परीक्षण र लिलाम/मिनाहासम्मको व्यवस्थित अभिलेख प्रणाली नै जिन्सी श्रेस्ता (Jinsi Sresta) हो ।',
      sections: [
        {
          heading: '१. खर्च भएर जाने र खर्च भएर नजाने (खप्ने) जिन्सीबीच भिन्नता',
          points: [
            'खर्च भएर जाने (Expendable / म.ले.प. फा.नं. ४०७): एक पटक वा छोटो समयमै उपभोग भई सकिने सामग्री (जस्तै: मसलन्द, कागज, मसी, इन्धन) ।',
            'खर्च भएर नजाने / खप्ने सम्पत्ति (Non-Expendable / म.ले.प. फा.नं. ४०८): एक वर्षभन्दा बढी टिक्ने र लिलाम/मिनाहा नभएसम्म कार्यालयको स्वामित्वमा रहने टिकाउ सम्पत्ति (जस्तै: फर्निचर, कम्प्युटर, सवारी साधन) ।',
          ],
        },
        {
          heading: '२. जिन्सी लेखा चक्र र PAMS को भूमिका',
          points: [
            'मागदेखि दाखिलासम्म: शाखाबाट माग फाराम (४०१) भरेपछि खरिद आदेश (४०२) जारी गरी सामान प्राप्त हुनासाथ गुणस्तर जाँचेर दाखिला प्रतिवेदन (४०३) तयार भएपछि मात्र भुक्तानी र जिन्सी खातामा प्रविष्टि गरिन्छ ।',
            'निरीक्षण, लिलाम र PAMS: वार्षिक जिन्सी निरीक्षण प्रतिवेदन (४११) बाट काम नलाग्ने सामानको लिलाम वा मिनाहा गरिन्छ । हाल महालेखा नियन्त्रक कार्यालयको सार्वजनिक सम्पत्ति व्यवस्थापन प्रणाली (PAMS) मार्फत तीनै तहको सरकारी सम्पत्तिको वास्तविक समयमा डिजिटल ट्र्याकिङ गरिन्छ ।',
          ],
        },
      ],
      conclusion:
        'दाखिला नगरी भुक्तानी नदिने अनुशासन, नियमित भौतिक निरीक्षण र PAMS प्रणालीको पूर्ण कार्यान्वयनले सार्वजनिक सम्पत्तिको चुहावट र दुरुपयोग रोक्दछ ।',
    },
    rubric: [
      {
        en: 'Accurately distinguished Khapne/Expendable consumables (AGF 407) vs. Durable/Non-Expendable assets (AGF 408).',
        ne: 'खर्च भएर जाने (४०७) र खप्ने/खर्च भएर नजाने (४०८) जिन्सी मालसामानबीचको भिन्नता स्पष्ट पारिएको ।',
      },
      {
        en: 'Sequenced Maag Faram → Kharid Aadesh → Dakhila Prativedan → Inspection/Auction and referenced PAMS digital tracking.',
        ne: 'माग फाराम, खरिद आदेश, दाखिला प्रतिवेदन, निरीक्षण/लिलाम र PAMS प्रणालीको भूमिका लेखिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-408',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Revenue Administration & Tax Compliance',
    postTarget: 'Section Officer / Nayab Subba (Revenue) / Kharidar',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Nepal’s Tax Structure, Customs/VAT/TDS & Controlling Revenue Leakage',
      question:
        'Discuss the constitutional basis and major pillars of Nepal’s tax system (Income Tax, VAT, Customs, Excise, and TDS), and propose administrative and technological measures to expand the tax base and curb revenue leakage.',
      marksAllocation: '4 + 6 = 10 Marks',
      introduction:
        'Sustainable public finance depends on mobilizing predictable domestic revenue rather than relying heavily on debt or aid. Article 115 of the Constitution establishes "no taxation without law," empowering three-tier taxation managed federally by the Inland Revenue Department (IRD) and Department of Customs under the Ministry of Finance.',
      sections: [
        {
          heading: '1. Major Pillars of Nepal’s Tax Regime',
          points: [
            'Value Added Tax (VAT Act, 2052): Broad-based multi-stage consumption tax at a single 13% standard rate (0% on exports, statutory exemptions on basic agriculture/health/education) utilizing input-tax credit invoices.',
            'Income Tax (Income Tax Act, 2058) & TDS (Chapter 17): Progressive personal and corporate income taxation alongside statutory Tax Deduction at Source (TDS) by public/corporate withholding agents within stipulated timelines.',
            'Customs & Excise Duties: ASYCUDA-managed border customs valuation on imports (historically heavy share of total revenue) and Excise Duty Act, 2058 levies on tobacco, alcohol, vehicles, and controlled items.',
            'Intergovernmental Fiscal Arrangement Act, 2074: Shares VAT and domestic excise pools across Federal (70%), Provincial (15%), and Local (15%) tiers.',
          ],
        },
        {
          heading: '2. Revenue Leakage Challenges & Reform Measures',
          points: [
            'Key structural vulnerabilities: Over-reliance on import-based customs/VAT, informal cash transactions avoiding e-billing, under-invoicing at borders, fake VAT invoice schemes, and weak audit follow-up.',
            'Digital compliance tools: Expand real-time Electronic Billing (CBMS), Vehicle and Consignment Tracking System (VCTS) by Department of Revenue Investigation, ASYCUDA valuation risk profiling, and automated bank-IRD PAN reconciliation.',
            'Broadening base & voluntary compliance: Reduce compliance cost via simplified presumptive portals, taxpayer education, risk-based tax audits, and swift Revenue Tribunal adjudication alongside strict prosecution under Revenue Leakage Control Act, 2052.',
          ],
        },
      ],
      conclusion:
        'Shifting Nepal from import-centric taxation toward broad-based domestic income and consumption compliance requires widening the tax net without harassing honest taxpayers—combining VCTS/e-billing analytics with fair, predictable administration.',
    },
    ne: {
      title: 'नेपालको कर प्रणाली र राजस्व चुहावट नियन्त्रणका उपायहरू',
      question:
        'नेपालको कर प्रणालीका संवैधानिक आधार र प्रमुख स्तम्भहरू (आयकर, मू.अ.कर, भन्सार, अन्तःशुल्क र अग्रिम कर कट्टी/TDS) चर्चा गर्दै करको दायरा विस्तार र राजस्व चुहावट नियन्त्रण गर्ने प्रशासनिक तथा प्रविधिगत उपायहरू प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '४ + ६ = १० अङ्क',
      introduction:
        'दिगो विकास र वित्तीय आत्मनिर्भरताको मेरुदण्ड आन्तरिक राजस्व परिचालन हो । नेपालको संविधानको धारा ११५ ले "कानुनबमोजिमबाहेक कुनै कर लगाइने र उठाइने छैन" भन्ने सिद्धान्त स्थापित गर्दै संघ, प्रदेश र स्थानीय तहको कर अधिकार विभाजन गरेको छ ।',
      sections: [
        {
          heading: '१. नेपालको राजस्व तथा कर प्रणालीका प्रमुख स्तम्भहरू',
          points: [
            'मूल्य अभिवृद्धि कर (मू.अ.कर ऐन, २०५२): १३ प्रतिशतको एकल दरमा आधारित बहुचरण उपभोग कर, जहाँ निर्यातमा शून्य दर र आधारभूत कृषि/शिक्षा/स्वास्थ्यमा छुट तथा खरिद-बिक्री मिलान (Input Tax Credit) गरिन्छ ।',
            'आयकर (आयकर ऐन, २०५८) र अग्रिम कर कट्टी (परिच्छेद १७): प्रगतिशील व्यक्तिगत तथा संस्थागत आयकरका साथै सार्वजनिक र संगठित भुक्तानीमा स्रोतमा कर कट्टी (TDS) गरी राजस्व दाखिला गर्नुपर्ने बाध्यात्मक व्यवस्था ।',
            'भन्सार र अन्तःशुल्क: आयात विन्दुमा भन्सार विभाग (ASYCUDA) बाट उठाइने भन्सार महसुल तथा सुर्ती, मदिरा आदिमा लगाइने अन्तःशुल्क ऐन, २०५८ ।',
            'राजस्व बाँडफाँड (ऐन २०७४): मूल्य अभिवृद्धि कर र आन्तरिक अन्तःशुल्कको ७०% संघ, १५% प्रदेश र १५% स्थानीय तहमा विभाजन हुने संवैधानिक-कानुनी प्रबन्ध ।',
          ],
        },
        {
          heading: '२. करको दायरा विस्तार र राजस्व चुहावट नियन्त्रणका उपायहरू',
          points: [
            'विद्यमान समस्या: आयातमुखी भन्सार राजस्वमा अत्यधिक निर्भरता, न्यून बीजकीकरण (Under-invoicing), नक्कली भ्याट बिल र अनौपचारिक नगद कारोबार ।',
            'प्रविधिगत सुधार: आन्तरिक राजस्व विभागको अनलाइन बिलिङ (CBMS), राजस्व अनुसन्धान विभागको VCTS (मालवस्तु तथा ढुवानी साधन अनुगमन प्रणाली), आसिकुडा (ASYCUDA) जोखिम विश्लेषण र बैंक-PAN अन्तर-आबद्धता कडाइ गर्ने ।',
            'करदाता शिक्षा र निष्पक्ष कारबाही: कर अनुपालन लागत घटाउने, करदातामैत्री सेवा र कर लेखापरीक्षण (Tax Audit) सुदृढ गर्ने तथा राजस्व चुहावट (अनुसन्धान तथा नियन्त्रण) ऐन, २०५२ बमोजिम कडा अभियोजन गर्ने ।',
          ],
        },
      ],
      conclusion:
        'करको दर बढाउनुभन्दा करको दायरा फराकिलो बनाउनु दिगो राजस्व नीतिको मर्म हो । डिजिटल बिलिङ, VCTS र करदातामैत्री सुशासनको सन्तुलनले आन्तरिक राजस्वलाई सुदृढ तुल्याउँछ ।',
    },
    rubric: [
      {
        en: 'Referenced Constitution Art. 115 ("no tax without law") and core pillars (13% VAT, Income Tax/Ch. 17 TDS, Customs, Excise, 70:15:15 sharing).',
        ne: 'धारा ११५ को संवैधानिक सिद्धान्त र १३% मू.अ.कर, आयकर/TDS (परिच्छेद १७), भन्सार, अन्तःशुल्क तथा ७०:१५:१५ बाँडफाँड उल्लेख गरिएको ।',
      },
      {
        en: 'Diagnosed import-heavy vulnerability, under-invoicing, and informal cash economy.',
        ne: 'आयातमुखी राजस्व निर्भरता, न्यून बीजकीकरण र अनौपचारिक अर्थतन्त्रका चुनौती औँल्याइएको ।',
      },
      {
        en: 'Recommended e-Billing (CBMS), VCTS, ASYCUDA risk profiling, PAN-bank integration, and Revenue Leakage Control Act enforcement.',
        ne: 'ई-बिलिङ, VCTS, ASYCUDA जोखिम परीक्षण र राजस्व चुहावट ऐन २०५२ को प्रभावकारी कार्यान्वयन सुझाइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-409',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Government Accounting Systems (TSA, CGAS, LMBIS, NPSAS)',
    postTarget: 'Section Officer / SO Audit / Nayab Subba (Accounts) / Kharidar',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Modern Digital PFM Systems (LMBIS, TSA, CGAS, SuTRA) & NPSAS',
      question:
        'Briefly explain how LMBIS, Treasury Single Account (TSA), CGAS, and SuTRA operate together in Nepal’s digital government accounting ecosystem, and clarify the significance of NPSAS and Bank Reconciliation.',
      marksAllocation: '3 + 2 = 5 Marks',
      introduction:
        'Nepal has modernized public financial management from fragmented manual ledgers to real-time digital portals administered by the Ministry of Finance and Financial Comptroller General Office (FCGO), aligning reporting with Nepal Public Sector Accounting Standards (NPSAS).',
      sections: [
        {
          heading: '1. Integrated Digital PFM Architecture',
          points: [
            'LMBIS / PLMBIS: Line Ministry Budgetary Information System digitizing federal/provincial budget formulation, MTEF alignment, and work-plan virement.',
            'TSA & CGAS: Treasury Single Account consolidates government bank balances at NRB/agent banks under DTCOs eliminating idle cash pools, while Computerized Government Accounting System (CGAS) automates Goshwara vouchers, electronic EFT payments, and withholding tax deposits.',
            'SuTRA: Sub-National Treasury Regulatory Application standardizing budget, accounting, and financial reporting across all 753 local governments.',
          ],
        },
        {
          heading: '2. Role of NPSAS & Bank Reconciliation',
          points: [
            'NPSAS (IPSAS-aligned): Standardizes cash receipts/payments, budget-vs-actual comparisons, and disclosure notes for cross-government consolidation and audit transparency.',
            'Bank Reconciliation Statement: Monthly reconciliation matching entity Cash Book balances against Bank Statements catches unpresented cheques, uncredited deposits, or erroneous bank debits promptly before year-end closing.',
          ],
        },
      ],
      conclusion:
        'Interlinked digital PFM systems curb fiscal opacity, minimize idle bank floats, and provide citizens and OAG auditors verifiable real-time expenditure transparency.',
    },
    ne: {
      title: 'डिजिटल सरकारी लेखा प्रणाली (LMBIS, TSA, CGAS, SuTRA) र NPSAS',
      question:
        'नेपालको सार्वजनिक वित्तीय व्यवस्थापनमा LMBIS, एकल खाता कोष (TSA), CGAS र SuTRA प्रणालीको अन्तरसम्बन्ध स्पष्ट पार्दै नेपाल सार्वजनिक क्षेत्र लेखामान (NPSAS) र बैंक हिसाब मिलान विवरणको महत्त्व लेख्नुहोस् ।',
      marksAllocation: '३ + २ = ५ अङ्क',
      introduction:
        'सरकारी बजेट तर्जुमा, निकासा, खर्च लेखांकन र प्रतिवेदनलाई वास्तविक समयमा पारदर्शी बनाउन महालेखा नियन्त्रक कार्यालय र अर्थ मन्त्रालयले एकीकृत डिजिटल वित्तीय प्रणालीहरू सञ्चालनमा ल्याएका छन् ।',
      sections: [
        {
          heading: '१. एकीकृत डिजिटल लेखा प्रणालीको कार्यशृङ्खला',
          points: [
            'LMBIS / PLMBIS: संघ र प्रदेशस्तरको बजेट तर्जुमा, मध्यकालीन खर्च संरचना र कार्यक्रम संशोधनको डिजिटल प्रणाली ।',
            'TSA र CGAS: एकल खाता कोष (TSA) ले सरकारी बैंक खातालाई को.ले.नि.का. मार्फत एकीकृत गरी निष्क्रिय नगद मौज्दात रोक्दछ भने CGAS ले गोश्वारा भौचर, EFT मार्फत सोझै भुक्तानी र मास्केवारी तयार गर्दछ ।',
            'SuTRA: ७५३ वटै स्थानीय तहको बजेट, लेखाङ्कन र वित्तीय प्रतिवेदनमा एकरूपता कायम गर्ने सफ्टवेयर प्रणाली ।',
          ],
        },
        {
          heading: '२. NPSAS र बैंक हिसाब मिलान विवरणको महत्त्व',
          points: [
            'NPSAS (IPSAS मा आधारित): सरकारी वित्तीय विवरणमा नगद प्राप्ति/भुक्तानी, बजेट र यथार्थ खर्चको तुलना तथा लेखा टिपोटलाई अन्तर्राष्ट्रिय स्तरको विश्वसनीयता प्रदान गर्दछ ।',
            'बैंक हिसाब मिलान विवरण: कार्यालयको बैंक नगदी किताब र बैंक स्टेटमेन्टबीचको फरक (भुक्तानी हुन बाँकी चेक, जम्मा नभएको रकम वा बैंक गल्ती) मासिक रूपमा पहिचान गरी सच्याउन अनिवार्य हुन्छ ।',
          ],
        },
      ],
      conclusion:
        'डिजिटल PFM सञ्जाल र लेखामानको पालनाले सरकारी खर्चको पारदर्शिता र लेखापरीक्षण विश्वसनीयतालाई गुणात्मक उचाइमा पुर्‍याएको छ ।',
    },
    rubric: [
      {
        en: 'Correctly explained LMBIS (budgeting), TSA (cash consolidation), CGAS (vouchers/EFT), and SuTRA (753 local tiers).',
        ne: 'LMBIS, TSA, CGAS र SuTRA प्रणालीको सटिक कार्य र अन्तरसम्बन्ध स्पष्ट पारिएको ।',
      },
      {
        en: 'Highlighted NPSAS standardization value and purpose of monthly Bank Reconciliation Statements.',
        ne: 'NPSAS को प्रतिवेदन मानक र मासिक बैंक हिसाब मिलान विवरणको महत्त्व उल्लेख गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-410',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Parliamentary Law-Making & Oversight',
    postTarget: 'Section Officer (Gazetted III)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Nepal Parichaya: Federal Structure & Local Governance',
    sourcePath: '/materials/nepal-parichaya-federal-structure.pdf',
    en: {
      title: 'Bicameral Parliamentary Law-Making Process & Committee Oversight',
      question:
        'Trace the legislative procedure for passing a Bill in Nepal’s bicameral Federal Parliament under Part 9 of the Constitution, and analyze the oversight role of Parliamentary Committees—especially the Public Accounts Committee—in enforcing executive accountability.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Under Parts 8 and 9 of the Constitution of Nepal (2072), legislative authority is exercised by a bicameral Federal Parliament comprising the 275-member House of Representatives (HoR) and the 59-member permanent National Assembly (NA), balancing popular representation with provincial and senior-statesperson review.',
      sections: [
        {
          heading: '1. Bicameral Law-Making Procedure (Articles 110–113)',
          points: [
            'Introduction of Bills (Art. 110): Ordinary bills may originate in either House (Government or Private Member Bills), whereas Money Bills and Security-force bills may originate ONLY in the House of Representatives.',
            'Three-Stage Deliberation & Clause Review: Leave to introduce & publication → General theoretical debate → Clause-by-clause scrutiny in Thematic Parliamentary Committees with stakeholder/expert hearings → Passage by majority of House.',
            'Bicameral Message & Timelines (Art. 111): A bill passed by HoR goes to NA (15-day recommendation limit for Money Bills; 2-month return window for ordinary bills). Disagreements on non-money bills rejected by NA can be resolved by HoR absolute majority or a Joint Sitting where specified.',
            'Presidential Authentication (Art. 113): President authenticates ordinary bills within 15 days or may return non-money bills once for reconsideration (mandatory authentication if passed again).',
          ],
        },
        {
          heading: '2. Role of Parliamentary Committees & Public Accounts Committee (PAC)',
          points: [
            'Mini-Parliaments for detailed oversight: Thematic committees (State Affairs, Finance, Law & Human Rights, Parliamentary Hearing Art. 292) dissect bills free from plenary floor polarization and review delegated legislation.',
            'Public Accounts Committee (PAC): Conventionally chaired by the Main Opposition, PAC examines the Auditor General’s annual report, summons Ministry Secretaries (Chief Accounting Officers), directs recovery/action on major financial irregularities (Beruju), and monitors mega-procurement integrity.',
            'Practical challenges: Committee quorum absences, partisan tug-of-war delaying crucial federal bills, and weak executive compliance monitoring of committee directives.',
          ],
        },
      ],
      conclusion:
        'Meaningful legislative scrutiny and courageous committee oversight turn Parliament from a rubber-stamp chamber into the living conscience of constitutional democracy.',
    },
    ne: {
      title: 'संघीय संसदको कानून निर्माण प्रक्रिया र संसदीय समितिको निगरानी भूमिका',
      question:
        'नेपालको संविधानको भाग ९ बमोजिम द्विसदनात्मक संघीय संसदमा विधेयक पारित हुने विधायिकी प्रक्रियाको चरणबद्ध वर्णन गर्दै कार्यपालिकालाई जवाफदेही बनाउन संसदीय समितिहरू—विशेषतः सार्वजनिक लेखा समिति—को निगरानी भूमिका विश्लेषण गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'नेपालको संविधान (भाग ८ र ९) ले २७५ सदस्यीय प्रतिनिधि सभा र ५९ सदस्यीय स्थायी राष्ट्रिय सभासहितको द्विसदनात्मक संघीय व्यवस्थापिका स्थापना गरेको छ, जसले जनप्रतिनिधित्व र प्रादेशिक सन्तुलनसहित कानुन निर्माण र सरकारमाथि निगरानी गर्दछ ।',
      sections: [
        {
          heading: '१. द्विसदनात्मक विधेयक पारित प्रक्रिया (धारा ११०–११३)',
          points: [
            'विधेयक प्रस्तुति (धारा ११०): अर्थ विधेयक र सुरक्षा निकायसम्बन्धी विधेयक प्रतिनिधि सभामा मात्र र अन्य साधारण विधेयक दुवैमध्ये कुनै सदनमा पेस गर्न सकिने ।',
            'तीन चरण र दफावार छलफल: विधेयक प्रस्तुत गर्ने अनुमति र विरोध सूचना → सैद्धान्तिक सामान्य छलफल → विषयगत समितिमा सरोकारवाला/विज्ञसहित दफावार छलफल र संशोधन → सदनबाट बहुमतले पारित ।',
            'सदनबीच सन्देश र समयसीमा (धारा १११): प्रतिनिधि सभाबाट पारित अर्थ विधेयक १५ दिनभित्र राष्ट्रिय सभाले सुझावसहित फर्काउनुपर्ने र अन्य विधेयक २ महिनाभित्र पारित वा फिर्ता गर्नुपर्ने । गतिरोध भएमा प्रतिनिधि सभाको बहुमत वा संयुक्त बैठकबाट टुङ्गो लगाइने ।',
            'प्रमाणीकरण (धारा ११३): राष्ट्रपतिबाट १५ दिनभित्र प्रमाणीकरण हुने वा अर्थ विधेयकबाहेकका विधेयक एकपटक पुनर्विचारका लागि फिर्ता पठाउन सकिने (दोस्रो पटक पेस भए अनिवार्य प्रमाणीकरण) ।',
          ],
        },
        {
          heading: '२. संसदीय समिति र सार्वजनिक लेखा समितिको निगरानी भूमिका',
          points: [
            '"लघु संसद" (Mini-Parliament): राज्य व्यवस्था, अर्थ, संसदीय सुनुवाइ (धारा २९२) जस्ता समितिहरूले प्रत्यायोजित विधायन परीक्षण, विधेयक परिमार्जन र मन्त्रालयका कामको सूक्ष्म अध्ययन गर्दछन् ।',
            'सार्वजनिक लेखा समिति (PAC): परम्परागत रूपमा प्रमुख प्रतिपक्षी दलको नेतृत्वमा रहने लेखा समितिले महालेखापरीक्षकको वार्षिक प्रतिवेदनमाथि छलफल गरी मुख्य लेखा उत्तरदायी अधिकारी (सचिव) हरूलाई बोलाई बेरुजु फर्छ्यौट र खरिद अनियमिततामा कडा निर्देशन दिन्छ ।',
            'सुधारका क्षेत्र: बैठकमा गणपूरक संख्याको कमी, दलीय ध्रुवीकरण र समितिका निर्देशन कार्यान्वयनको फितलो अनुगमन अन्त्य गर्न वार्षिक विधायिकी क्यालेन्डर र फलोअप ड्यासबोर्ड आवश्यक छ ।',
          ],
        },
      ],
      conclusion:
        'सदन र समितिको सघन विमर्शले नै कानुनलाई गुणस्तरीय र कार्यपालिकालाई जनउत्तरदायी बनाउँछ । समयबद्ध विधायन र निर्देशन कार्यान्वयनको अनुगमनले संसदीय गरिमा उँचो राख्दछ ।',
    },
    rubric: [
      {
        en: 'Accurately cited Arts. 110–113: Money Bill HoR exclusivity, 15-day / 2-month NA timelines, clause-by-clause committee review, and Presidential authentication/return.',
        ne: 'धारा ११०–११३ का प्रबन्धहरू (अर्थ विधेयक प्रतिनिधि सभामा मात्र, १५ दिन र २ महिना समयसीमा, दफावार छलफल र प्रमाणीकरण) सही लेखिएको ।',
      },
      {
        en: 'Examined Parliamentary Hearing (Art. 292) & Public Accounts Committee (opposition chair, OAG report scrutiny, Secretary accountability).',
        ne: 'संसदीय सुनुवाइ र सार्वजनिक लेखा समिति (प्रतिपक्ष नेतृत्व, महालेखा प्रतिवेदन छलफल, सचिव जवाफदेहिता) को भूमिका विश्लेषण गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-411',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Vital Registration, National ID & Citizen Charter',
    postTarget: 'Kharidar / Nayab Subba',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Local Government Operation Act, 2074 — Core PSC Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
    en: {
      title: 'Vital Registration, National Identity Card (Act 2076) & Citizen Charter',
      question:
        'Explain the statutory provisions for Vital Events Registration and the National Identity Card under the National Identity Card and Civil Registration Act, 2076, and clarify how the Citizen Charter empowers citizens at Ward Offices.',
      marksAllocation: '3 + 2 = 5 Marks',
      introduction:
        'Reliable civil identity records form the bedrock of legal rights, social protection, and e-governance. Regulated by the National Identity Card and Civil Registration Act, 2076, Ward Offices serve as Local Registrars recording vital life events while the federal Department links biometric National IDs (NID).',
      sections: [
        {
          heading: '1. Vital Registration & National ID Provisions (Act, 2076)',
          points: [
            'Five Vital Events & 35-Day Rule: Birth, death, marriage, divorce, and internal migration must be notified to the concerned Local Registrar (Ward Secretary/Chief) within 35 days of occurrence (exempt from penalty; nominal fee if delayed) using standardized online/VERS-MIS certificates.',
            'National Identity Card (NID): Unique 10-digit National Identity Number integrating biometric data and digital QR/chip credentials serving as a single verified KYC key for passports, banking, tax PAN, and social security allowances.',
          ],
        },
        {
          heading: '2. Citizen Charter as Frontline Accountability Tool',
          points: [
            'Mandated by Good Governance Act Sec. 25 and LGOA 2074, a Ward Citizen Charter visibly displays required documents, official fee (Rs.), service delivery timeline (e.g., same-day recommendation), and accountable official—preventing arbitrary delays, hidden charges, and middlemen exploitation.',
          ],
        },
      ],
      conclusion:
        'Connecting accurate 35-day Ward vital registration with interoperable National IDs and strictly enforced Citizen Charters ensures dignified, paper-light public service from birth onward.',
    },
    ne: {
      title: 'व्यक्तिगत घटना दर्ता, राष्ट्रिय परिचयपत्र (ऐन २०७६) र नागरिक बडापत्र',
      question:
        'राष्ट्रिय परिचयपत्र तथा पञ्जीकरण ऐन, २०७६ बमोजिम व्यक्तिगत घटना दर्ता र राष्ट्रिय परिचयपत्र सम्बन्धी प्रमुख व्यवस्थाहरू उल्लेख गर्दै वडा कार्यालयमा नागरिक बडापत्रको व्यावहारिक उपयोगिता स्पष्ट पार्नुहोस् ।',
      marksAllocation: '३ + २ = ५ अङ्क',
      introduction:
        'नागरिकको कानुनी पहिचान, सामाजिक सुरक्षा र राज्यको योजना निर्माणको आधार व्यक्तिगत घटना दर्ता र राष्ट्रिय परिचयपत्र हो । राष्ट्रिय परिचयपत्र तथा पञ्जीकरण ऐन, २०७६ बमोजिम स्थानीय वडा कार्यालयमार्फत पञ्जीकरण र संघीय विभागमार्फत बायोमेट्रिक राष्ट्रिय परिचयपत्र वितरण गरिन्छ ।',
      sections: [
        {
          heading: '१. व्यक्तिगत घटना दर्ता र राष्ट्रिय परिचयपत्रका व्यवस्थाहरू',
          points: [
            '५ प्रकारका घटना र ३५ दिने म्याद: जन्म, मृत्यु, विवाह, सम्बन्ध विच्छेद र बसाइँसराइजस्ता घटना घटेको ३५ दिनभित्र सम्बन्धित स्थानीय पञ्जीकाधिकारी (वडा कार्यालय) मा निःशुल्क/नियमित अनलाइन दर्ता गराउनुपर्ने ।',
            'राष्ट्रिय परिचयपत्र (NID): नागरिकको वैयक्तिक र जैविक (Biometric) विवरणसहितको १० अङ्कको अद्वितीय राष्ट्रिय परिचय नम्बर जसले राहदानी, बैंकिङ, कर र सामाजिक सुरक्षा भत्तामा एकीकृत डिजिटल पहिचानको काम गर्दछ ।',
          ],
        },
        {
          heading: '२. वडा तहमा नागरिक बडापत्रको उपयोगिता',
          points: [
            'सुशासन ऐन (दफा २५) र स्थानीय सरकार सञ्चालन ऐनबमोजिम वडा कार्यालयमा राखिने नागरिक बडापत्रले आवश्यक कागजात, लाग्ने दस्तुर, सेवा पाउने समय र जिम्मेवार कर्मचारी खुलाउँछ—जसले सेवाग्राहीको अलमल, अतिरिक्त शुल्क असुली र बिचौलियाको प्रभाव अन्त्य गर्दछ ।',
          ],
        },
      ],
      conclusion:
        'समयमै हुने पञ्जीकरण, डिजिटल राष्ट्रिय परिचयपत्रको अन्तर-आबद्धता र बडापत्रको इमानदार पालनाले नै वडा कार्यालयलाई नागरिकमैत्री सरकारको जीवन्त उदाहरण बनाउँछ ।',
    },
    rubric: [
      {
        en: 'Named all 5 vital events (birth, death, marriage, divorce, migration) and the statutory 35-day registration window under Act 2076.',
        ne: 'जन्म, मृत्यु, विवाह, सम्बन्ध विच्छेद र बसाइँसराइ गरी ५ घटना र ३५ दिने म्याद (ऐन २०७६) उल्लेख गरिएको ।',
      },
      {
        en: 'Explained NID’s single-KYC role and Citizen Charter’s 4 components (documents, fee, time, responsible officer).',
        ne: 'राष्ट्रिय परिचयपत्रको एकीकृत पहिचान र नागरिक बडापत्रका ४ तत्व (कागजात, दस्तुर, समय, अधिकारी) स्पष्ट पारिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-412',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Justice Administration & Muluki Codes 2074',
    postTarget: 'Nayab Subba / Kharidar (Justice & Law)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Constitution of Nepal (2072) — Core Articles & Rights',
    sourcePath: '/materials/constitution-of-nepal-2072.pdf',
    en: {
      title: 'Extraordinary Writs, Summons Procedure (Myad Tameli) & Muluki Codes 2074',
      question:
        'Describe the five extraordinary constitutional writs under Articles 133 and 144 of the Constitution, clarify the procedural significance of Hadmyad, Darpeeth, and Myad Tameli in court registries, and highlight key reforms of the Muluki Civil & Criminal Codes, 2074.',
      marksAllocation: '4 + 3 + 3 = 10 Marks',
      introduction:
        'An independent judiciary safeguards constitutional supremacy and individual liberty through both extraordinary public-law writs and disciplined civil/criminal trial administration under Nepal’s modernized 2074 Codes.',
      sections: [
        {
          heading: '1. Five Constitutional Writs (Articles 133(3) & 144(2))',
          points: [
            'Habeas Corpus (बन्दीप्रत्यक्षीकरण): Commands authorities holding a person illegally to produce the detainee physically before court and justify lawful detention.',
            'Mandamus (परमादेश): Directs a public authority, official, or lower court to perform a mandatory statutory duty they have refused or neglected.',
            'Certiorari (उत्प्रेषण): Quashes unlawful decisions or proceedings made without jurisdiction or violating Natural Justice by a lower court or administrative tribunal.',
            'Prohibition (प्रतिषेध): Preemptively restrains a subordinate judicial/quasi-judicial body from continuing proceedings beyond its legal jurisdiction.',
            'Quo Warranto (अधिकारपृच्छा): Questions under what legal authority a person occupies a public office when eligibility is disputed.',
          ],
        },
        {
          heading: '2. Court Registry Concepts: Hadmyad, Darpeeth & Myad Tameli',
          points: [
            'Hadmyad (हदम्याद / Limitation): Strict statutory time limit within which a plaint (Firadpatra) or complaint must be filed; time-barred suits cannot proceed.',
            'Darpeeth (दरपीठ / Reasoned Endorsement): Formal administrative order by a Court Registrar/staff refusing registration of a defective, non-justiciable, or time-barred deed (Likhat) while stating explicit legal reasons (subject to judicial review by a Bench).',
            'Myad Tameli (म्याद तामेली): Lawful service of summons/notice on defendants via server or electronic/ward-witness procedure upholding Audi Alteram Partem ("hear the other side")—a major root of trial delay when manipulated.',
          ],
        },
        {
          heading: '3. Salient Reforms of Muluki Civil & Criminal Codes, 2074',
          points: [
            'Modernized 1910/2020 BS Muluki Ain: Codified autonomous civil contracts, tort liability, gender-equal property/divorce rights, privacy protection, and modern criminal jurisprudence separating two-stage conviction and sentencing hearings (probation, community service, victim compensation).',
          ],
        },
      ],
      conclusion:
        'Justice delayed by faulty Myad Tameli undermines substantive rights. Combining constitutional writ vigilance with digitized e-summons and disciplined registry scrutiny upholds speedy, accessible justice.',
    },
    ne: {
      title: 'संवैधानिक रिट क्षेत्राधिकार, अदालती कार्यविधि र मुलुकी संहिता २०७४',
      question:
        'नेपालको संविधानको धारा १३३ र १४४ बमोजिमका पाँच असाधारण रिटहरू वर्णन गर्दै अदालती कार्यविधिमा हदम्याद, दरपीठ र म्याद तामेलीको महत्त्व तथा मुलुकी देवानी र अपराध संहिता, २०७४ का मुख्य विशेषताहरू लेख्नुहोस् ।',
      marksAllocation: '४ + ३ + ३ = १० अङ्क',
      introduction:
        'मौलिक हक र कानुनी राज्यको संरक्षणका लागि अदालतको असाधारण रिट क्षेत्राधिकार जति महत्त्वपूर्ण छ, छिटो र निष्पक्ष न्याय सम्पादनका लागि अदालती दर्ता, म्याद तामेली र आधुनिक मुलुकी संहिताको कुशल कार्यान्वयन त्यत्तिकै निर्णायक हुन्छ ।',
      sections: [
        {
          heading: '१. संविधानका पाँच असाधारण रिटहरू (धारा १३३ र १४४)',
          points: [
            'बन्दीप्रत्यक्षीकरण (Habeas Corpus): गैरकानुनी थुना वा नजरबन्दमा राखिएको व्यक्तिलाई अदालतमा सशरीर उपस्थित गराई मुक्त गर्ने रिट ।',
            'परमादेश (Mandamus): कानुनी कर्तव्य पूरा नगर्ने सार्वजनिक निकाय वा अधिकारीलाई दायित्व निर्वाह गर्न आदेश दिने रिट ।',
            'उत्प्रेषण (Certiorari): क्षेत्राधिकारविना वा प्राकृतिक न्यायको सिद्धान्तविपरीत भएको गैरकानुनी निर्णय बदर गर्ने रिट ।',
            'प्रतिषेध (Prohibition): मातहतको अर्धन्यायिक निकायलाई क्षेत्राधिकार नाघेर कारबाही अघि नबढाउन रोक्ने पूर्वनिरोधात्मक आदेश ।',
            'अधिकारपृच्छा (Quo Warranto): अयोग्य व्यक्ति सार्वजनिक पदमा आसिन भएमा "कुन अधिकारले पद धारण गरेको हो ?" भनी प्रश्न गर्ने रिट ।',
          ],
        },
        {
          heading: '२. अदालती कार्यविधि: हदम्याद, दरपीठ र म्याद तामेली',
          points: [
            'हदम्याद (Hadmyad): फिराद वा उजुरी दायर गर्न कानुनले तोकेको अन्तिम समयसीमा—जसको पालनाबिना मुद्दा प्रवेश पाउँदैन ।',
            'दरपीठ (Darpeeth): रीत नपुगेको, हदम्याद नाघेको वा क्षेत्राधिकारबाहिरको लिखत दर्ता गर्न नमिल्ने कानुनी आधार र कारण जनाई स्रेस्तेदारबाट गरिने अस्वीकृति आदेश ।',
            'म्याद तामेली (Myad Tameli): प्रतिवादीलाई मुद्दाको सूचना र प्रतिउत्तर दिने अवसर (प्राकृतिक न्याय: दुवै पक्षको सुनुवाइ) पुर्‍याउने महत्त्वपूर्ण चरण, जसमा ढिलाइ हुँदा मुद्दा अड्किन्छ ।',
          ],
        },
        {
          heading: '३. मुलुकी देवानी र अपराध संहिता, २०७४ का मुख्य विशेषताहरू',
          points: [
            'पुरानो मुलुकी ऐनलाई प्रतिस्थापन गरी आधुनिक देवानी (करार, दुष्कृति, लैङ्गिक समानता, गोपनीयता हक) र फौजदारी न्याय (कसुर र सजाय निर्धारणको छुट्टै सुनुवाइ, प्रोबेसन, सामुदायिक सेवा र पीडित क्षतिपूर्ति) संस्थागत गरिएको ।',
          ],
        },
      ],
      conclusion:
        'डिजिटल म्याद तामेली, पारदर्शी स्रेस्ता जाँच र आधुनिक संहिताको निष्पक्ष प्रयोगले नागरिकलाई समयमै र कम खर्चमा न्यायको अनुभूति दिलाउँछ ।',
    },
    rubric: [
      {
        en: 'Accurately defined all 5 constitutional writs (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto) under Arts. 133 & 144.',
        ne: 'धारा १३३ र १४४ का पाँचै रिट (बन्दीप्रत्यक्षीकरण, परमादेश, उत्प्रेषण, प्रतिषेध र अधिकारपृच्छा) सही परिभाषित गरिएको ।',
      },
      {
        en: 'Clarified legal function of Hadmyad (limitation), Darpeeth (reasoned refusal), and Myad Tameli (due-process summons service).',
        ne: 'हदम्याद, दरपीठ र म्याद तामेलीको कानुनी कार्यविधिगत महत्त्व स्पष्ट पारिएको ।',
      },
      {
        en: 'Highlighted key 2074 Code reforms: torts/contracts, gender equity, two-stage sentencing, and victim protection.',
        ne: '२०७४ का संहिताका करार/दुष्कृति, दुई-चरणीय सजाय निर्धारण र पीडित संरक्षणजस्ता विशेषता समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-413',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Diplomatic Correspondence & Vienna Conventions',
    postTarget: 'Section Officer / Nayab Subba (Foreign Affairs)',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
    en: {
      title: 'Note Verbale, Diplomatic Immunities (Vienna Conventions) & Consular Aid',
      question:
        'Distinguish a First Person Diplomatic Note from a Note Verbale (Third Person Note), and summarize the key immunities and consular duties under the 1961 and 1963 Vienna Conventions.',
      marksAllocation: '2 + 3 = 5 Marks',
      introduction:
        'Formal diplomatic communication and mission immunities rely on standardized international law codified in the Vienna Convention on Diplomatic Relations (VCDR, 1961) and Vienna Convention on Consular Relations (VCCR, 1963), ensuring smooth sovereign intercourse and protection of nationals abroad.',
      sections: [
        {
          heading: '1. First Person Note vs. Note Verbale (Third Person Note)',
          points: [
            'First Person Note: Formal signed communication written in the first person ("I have the honour to...") from a Foreign Minister or Ambassador to a counterpart for solemn treaties, protests, or major policy commitments.',
            'Note Verbale (Third Person Note): The standard day-to-day unsigned official correspondence written in third person ("The Ministry of Foreign Affairs presents its compliments to the Embassy... and avails itself of this opportunity to renew assurances of its highest consideration"), bearing an official seal and officer’s initials.',
          ],
        },
        {
          heading: '2. Immunities (VCDR 1961) & Consular Protection (VCCR 1963)',
          points: [
            'VCDR 1961 safeguards: Inviolability of mission premises, archives, and diplomatic bag (Art. 22–27); personal inviolability and criminal immunity of diplomatic agents; balanced by host-state sovereign remedies of declaring a diplomat Persona Non Grata (Art. 9) or duty not to interfere in internal affairs.',
            'VCCR 1963 consular duties: Issuing/renewing e-Passports (Passport Act, 2076), attesting legal/academic documents, and protecting/repatriating distressed Nepali migrant workers—including prison access (Art. 36) and deceased-worker repatriation.',
          ],
        },
      ],
      conclusion:
        'Command of diplomatic protocol and Vienna safeguards enables Nepal Foreign Service officers to defend national sovereignty diplomatically while delivering compassionate consular protection to millions of Nepalis overseas.',
    },
    ne: {
      title: 'कूटनीतिक पत्राचार (नोट भर्बाल), भियना महासन्धि र कन्सुलर सेवा',
      question:
        'प्रथम पुरुष कूटनीतिक नोट र तृतीय पुरुष नोट (Note Verbale) बीचको भिन्नता स्पष्ट पार्दै सन् १९६१ र १९६३ का भियना महासन्धिबमोजिमका कूटनीतिक उन्मुक्ति तथा कन्सुलर दायित्वहरू संक्षेपमा उल्लेख गर्नुहोस् ।',
      marksAllocation: '२ + ३ = ५ अङ्क',
      introduction:
        'सार्वभौम राष्ट्रहरूबीचको औपचारिक संवाद, कूटनीतिक नियोगको सुरक्षा र विदेशमा रहेका नागरिकको संरक्षण सन् १९६१ को कूटनीतिक सम्बन्ध र सन् १९६३ को कन्सुलर सम्बन्ध सम्बन्धी भियना महासन्धिद्वारा निर्देशित हुन्छ ।',
      sections: [
        {
          heading: '१. प्रथम पुरुष नोट र नोट भर्बाल (तृतीय पुरुष नोट) बीचको भिन्नता',
          points: [
            'प्रथम पुरुष नोट: परराष्ट्र मन्त्री वा राजदूतबाट समकक्षीलाई गम्भीर विषय वा औपचारिक सम्झौताका सन्दर्भमा प्रथम पुरुष ("म") प्रयोग गरी हस्ताक्षरसहित पठाइने उच्चस्तरीय पत्र ।',
            'नोट भर्बाल (तृतीय पुरुष नोट): मन्त्रालय र राजदूतावासबीच दैनिक कूटनीतिक कार्यका लागि तृतीय पुरुषमा ("...मन्त्रालयले उच्च सम्मान प्रकट गर्दै...") लेखिने, हस्ताक्षरको सट्टा आधिकारिक छाप र अधिकृतको छोटकरी दस्तखत (Initial) रहने प्रचलित पत्राचार हो ।',
          ],
        },
        {
          heading: '२. भियना महासन्धि (१९६१ र १९६३) का उन्मुक्ति र कन्सुलर दायित्व',
          points: [
            'कूटनीतिक उन्मुक्ति (१९६१): नियोग भवन, अभिलेख र कूटनीतिक झोला (Diplomatic Bag) को अलङ्घनीयता, राजदूत/कूटनीतिज्ञलाई फौजदारी उन्मुक्ति तथा आतिथेय राष्ट्रको आन्तरिक मामिलामा अहस्तक्षेप र अवाञ्छित व्यक्ति (Persona Non Grata) घोषित गर्न सक्ने अधिकार (धारा ९) ।',
            'कन्सुलर सेवा र श्रमिक संरक्षण (१९६३): राहदानी ऐन २०७६ बमोजिम ई-पासपोर्ट जारी, कागजात प्रमाणीकरण, र विदेशमा अलपत्र/पीडित नेपाली श्रमिकको कानुनी प्रतिरक्षा, जेल भ्रमण अधिकार (धारा ३६) एवं उद्धार कार्य ।',
          ],
        },
      ],
      conclusion:
        'कूटनीतिक भाषाको शुद्धता र भियना महासन्धिको सन्तुलित अभ्यासले नेपालको अन्तर्राष्ट्रिय मर्यादा र प्रवासी नेपाली नागरिकको सुरक्षा दुवैलाई सुदृढ बनाउँछ ।',
    },
    rubric: [
      {
        en: 'Accurately distinguished First Person Note (signed, solemn) vs. Note Verbale (third-person opening/closing courtesy formulas, unsigned, stamped/initialed).',
        ne: 'प्रथम पुरुष नोट (हस्ताक्षरित, विशिष्ट विषय) र नोट भर्बाल (तृतीय पुरुष औपचारिक वाक्यांश, छाप र इनिसियल) बीच भिन्नता लेखिएको ।',
      },
      {
        en: 'Cited VCDR 1961 (inviolability of premises/bag, Persona Non Grata) and VCCR 1963 (migrant protection, Art. 36 access, e-passports).',
        ne: 'भियना महासन्धि १९६१ (भवन/झोला अलङ्घनीयता, PNG) र १९६३ (कन्सुलर उद्धार, ई-पासपोर्ट, श्रमिक सुरक्षा) उल्लेख गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-414',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Ethics, Procurement & Beruju Case Study',
    postTarget: 'Section Officer (Gazetted III)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Case Study',
    sourceTitle: 'Public Procurement Act, 2063 & Fiscal Accountability Act, 2076',
    sourcePath: '/materials/public-procurement-fiscal-act.pdf',
    en: {
      title: 'Case Study: Handling Procurement Irregularity, Conflict of Interest & Beruju Pressure',
      question:
        'Case Scenario: As an Administrative & Accounts Section Officer in a District Project Office, your superior orally instructs you to split an IT equipment purchase worth NPR 2.4 million into five small direct purchases to a firm owned by a local political leader’s relative before Ashadh 25, warning that otherwise funds will freeze and your transfer may follow. (a) Identify the statutory violations and ethical dilemmas involved. (b) Describe your lawful course of action and preventive institutional steps.',
      marksAllocation: '4 + 6 = 10 Marks',
      introduction:
        'Case Context: This scenario tests administrative integrity, statutory courage, and fiscal accountability under year-end ("Asare Bikash") budget-lapse pressure—pitfalls directly governed by the Public Procurement Act, 2063, Good Governance Act, 2064, Civil Service Act, 2049, and Fiscal Accountability Act, 2076.',
      sections: [
        {
          heading: '(a) Statutory Violations & Ethical Dilemmas',
          points: [
            'Illegal Contract Splitting (PPA 2063 Sec. 8(2)): Splitting a NPR 2.4M procurement into five fragments specifically to evade Sealed Quotation/Open Tender thresholds violates statutory procurement rules and invites recoverable/regularizable OAG Beruju.',
            'Conflict of Interest & Corruption Risk: Directing contracts to a politically connected relative violates Good Governance Act Sec. 18 (conflict of interest) and attracts prosecution by CIAA under Prevention of Corruption Act, 2059.',
            'Oral Order vs. Statutory Accountability: Under Financial Accountability Act 2076, the officer who initiates/signs payment files remains personally liable—oral instructions offer zero legal immunity.',
            'Ethical Dilemma: Choosing between personal fear of unfavorable transfer and upholding fiduciary duty, fairness to taxpayers, and civil service code of conduct.',
          ],
        },
        {
          heading: '(b) Lawful Course of Action & Institutional Remedies',
          points: [
            'Respectful Written Advice on File (Tippani): Record a clear, polite written Tippani citing PPA 2063 threshold prohibitions and Good Governance Act Sec. 18, explaining why five direct splits are unlawful and requesting formal e-GP/Sealed Quotation or NCB procurement—even if funds lapse lawfully rather than violating law.',
            'Confirm in Writing if Overruled by Competent Authority: Under administrative norms and Financial Rules, an officer compelled by written order must record written dissent detailing the legal violation; never process undocumented oral spending.',
            'Disclose Conflict & Protect Budget Integrity: Decline engagement with biased vendors, report attempted coercion confidentially to Departmental Head/Secretariat if escalated, and ensure next FY procurement starts in Shrawan under an approved Annual Procurement Plan (APP).',
          ],
        },
      ],
      conclusion:
        'Budget surrender is lawful; illegal splitting is a punishable offense. Putting statutory facts respectfully on written record safeguards public funds, prevents personal Beruju liability, and upholds civil service honor.',
    },
    ne: {
      title: 'मामिला अध्ययन (Case Study): खरिद अनियमितता, स्वार्थको द्वन्द्व र असारे दबाब',
      question:
        'घटना विवरण: एक जिल्लास्तरीय कार्यालयको प्रशासन तथा लेखा शाखामा कार्यरत शाखा अधिकृतका रूपमा तपाईंलाई कार्यालय प्रमुखले असार २५ गतेभित्र रु. २४ लाखको आईटी सामग्री खरिद बजेट फ्रिज हुन नदिन एक स्थानीय नेताको नातेदारको फर्मबाट ५ टुक्रामा विभाजन गरी सोझै खरिद गर्न मौखिक दबाब दिनुभएको छ र नमानेमा सरुवा गरिदिने संकेत गर्नुभएको छ । (क) यसमा संलग्न कानुनी उल्लङ्घन र नैतिक द्वन्द्व पहिचान गर्नुहोस् । (ख) राष्ट्रसेवकका रूपमा तपाईंको कानुनसम्मत कदम र संस्थागत रोकथामका उपाय प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '४ + ६ = १० अङ्क',
      introduction:
        'प्रस्तुत मामिलाले आर्थिक वर्षको अन्त्यमा बजेट फ्रिज हुने बहानामा आउने गैरकानुनी मौखिक दबाब, खरिद कानुनको उल्लङ्घन र राष्ट्रसेवकको नैतिक साहसको वास्तविक परीक्षाको प्रतिनिधित्व गर्दछ ।',
      sections: [
        {
          heading: '(क) कानुनी उल्लङ्घन र नैतिक द्वन्द्व',
          points: [
            'टुक्रे खरिदको निषेध (सार्वजनिक खरिद ऐन, २०६३ दफा ८(२)): प्रतिस्पर्धा छल्ने उद्देश्यले रु. २४ लाखको खरिदलाई ५ टुक्रा पारी सोझै खरिद गर्नु गैरकानुनी हो, जसले असुल उपर वा अनियमित बेरुजु सिर्जना गर्दछ ।',
            'स्वार्थको द्वन्द्व र भ्रष्टाचार जोखिम: राजनीतिक पहुँचवालाको नातेदारलाई ठेक्का दिनु सुशासन ऐन (दफा १८) र भ्रष्टाचार निवारण ऐन, २०५९ विपरीतको गम्भीर कसूर हो ।',
            'मौखिक आदेशको कानुनी शून्यता: वित्तीय उत्तरदायित्व ऐन, २०७६ अनुसार टिप्पणी र भुक्तानीमा हस्ताक्षर गर्ने कर्मचारी नै व्यक्तिगत रूपमा जवाफदेही हुन्छ; मौखिक आदेशले बचाउँदैन ।',
            'नैतिक द्वन्द्व: सरुवाको व्यक्तिगत डर मान्ने कि संविधान, कानुन र करदाताप्रतिको इमानदार कर्तव्य रोज्ने भन्ने द्वन्द्व ।',
          ],
        },
        {
          heading: '(ख) कानुनसम्मत कार्यकदम र संस्थागत सुधार',
          points: [
            'शिष्टाचारपूर्वक लिखित टिप्पणी राय: मौखिक विरोध वा विवाद नगरी फाइलमा स्पष्ट रूपमा खरिद ऐनको दफा ८(२) र सिलबन्दी/ई-खरिद सीमा उल्लेख गरी "टुक्र्याएर सोझै खरिद गर्न कानुनले नमिल्ने हुँदा विधिवत् प्रतिस्पर्धाबाट मात्र खरिद गर्न वा कानुनी रूपमा बजेट समर्पण गर्न" लिखित राय पेस गर्ने ।',
            'लिखित असहमति र अभिलेख संरक्षण: माथिल्लो अधिकारीले लिखित रूपमै अड्डी कसेमा प्रचलित आर्थिक कार्यविधि नियमबमोजिम आफ्नो कानुनी असहमति अभिलेखमा राख्ने; तर कहिल्यै मौखिक दबाबमा गैरकानुनी भौचर सदर नगर्ने ।',
            'संस्थागत रोकथाम: आगामी आ.व. को साउनमै वार्षिक खरिद योजना (APP) स्वीकृत गरी पहिलो त्रैमासिकमै ई-खरिद सुरु गर्ने र अनावश्यक दबाब बढेमा विभागीय प्रमुख/मन्त्रालयमा जानकारी गराउने ।',
          ],
        },
      ],
      conclusion:
        'बजेट फ्रिज हुनु सामान्य प्रशासनिक प्रक्रिया हो, तर कानुन मिचेर गरिएको टुक्रे खरिद व्यक्तिगत बेरुजु र भ्रष्टाचारको अभियोग बन्न सक्छ । शिष्ट लिखित कानुनी अडान नै इमानदार अधिकृतको सर्वोत्तम रक्षाकवच हो ।',
    },
    rubric: [
      {
        en: 'Identified exact legal breaches: contract splitting (PPA 2063 Sec. 8), conflict of interest (Good Governance Sec. 18), Corruption Act risk, and personal liability despite oral orders.',
        ne: 'टुक्रे खरिद निषेध (खरिद ऐन दफा ८), स्वार्थको द्वन्द्व (सुशासन ऐन दफा १८) र मौखिक आदेशले बचाउ नहुने कानुनी तथ्य किटान गरिएको ।',
      },
      {
        en: 'Refused unlawful splitting professionally through polite written Tippani advice rather than confrontation or silent compliance.',
        ne: 'टकराव वा गैरकानुनी सहमति नगरी शिष्ट लिखित टिप्पणी रायमार्फत कानुनी अडान लिएको ।',
      },
      {
        en: 'Recognized that lawful budget surrender is preferable to illegal expenditure and proposed early Q1 Annual Procurement Plan (APP).',
        ne: 'गैरकानुनी खर्चभन्दा विधिवत् बजेट फ्रिज स्वीकार्य हुने निष्कर्ष र साउनमै खरिद योजना लागू गर्ने सुधार सुझाइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-415',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Disaster Relief & Local Crisis Case Study',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Case Study',
    sourceTitle: 'Local Government Operation Act, 2074 — Core PSC Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
    en: {
      title: 'Case Study: Managing Monsoon Flood Relief, Rumor Control & Vulnerable Priority',
      question:
        'Case Scenario: Overnight cloudburst floods displace 350 families in three wards of a Municipality where you serve as Chief Administrative Officer (or Acting Local Coordinator). Road access to Ward 7 is cut off, two relief-distribution protests erupt alleging political bias in tarpaulin lists, and unverified social media rumors claim a nearby bridge has collapsed. Detail (a) immediate crisis priorities (First 24 Hours) and (b) fair relief governance & recovery coordination.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'Case Context: During sudden municipal disasters, institutional coordination speed, transparent beneficiary criteria, and credible communication separate lifesaving governance from chaos. Operations align directly with the DRRM Act, 2074, LGOA, 2074, and District Security/LEOC protocols.',
      sections: [
        {
          heading: '(a) Immediate Life-Saving & Crisis Priorities (First 24 Hours)',
          points: [
            'Activate Local Emergency Operations Center (LEOC): Convene emergency Local Disaster Management Committee briefing and coordinate immediately with District Administration Office (CDO), Nepal Police, APF, Nepali Army, and Red Cross for Search and Rescue (SAR) into cut-off Ward 7.',
            'Safe Shelter, Triage & Vulnerable First: Convert undamaged public schools/community halls into temporary shelters with clean water, ORS/medical camps, dignity kits, and priority care for infants, pregnant women, elderly, and persons with disabilities.',
            'Rapid Rumor Control & Verified Bulletin: Immediately deploy municipal engineers/police to verify the bridge condition, publish geo-tagged factual status updates via official social media/local FM to stop panic, and establish a 24/7 municipal toll-free helpline.',
          ],
        },
        {
          heading: '(b) Fair Relief Governance & Recovery Coordination (Days 2–30)',
          points: [
            'One-Door Transparent Distribution Policy: Route all municipal, NGO, and private donations through a single joint relief desk rather than parallel party distributions; compile verified ward-secretary + all-party + Red Cross beneficiary rolls publicly posted at shelters.',
            'Proportional Standard Kit & Grievance Desk: Distribute uniform relief kits (food grains, tarpaulins, blankets, hygiene packs) against signed NID/ID logs and open an immediate on-site verification desk for missed genuine victims.',
            'Early Infrastructure & Resilient Recovery: Mobilize emergency ward machinery to clear Ward 7 landslides, chlorinate contaminated drinking-water sources to prevent post-flood cholera/diarrhea, and submit verified damage assessments (IRA/PDNA) for provincial/federal DRRM Fund replenishment.',
          ],
        },
      ],
      conclusion:
        'Expected Outcome: Decisive LEOC activation, verified multi-stakeholder beneficiary lists, and rapid factual communication swiftly calm protests, protect cut-off citizens, and prevent secondary health or reputational crises.',
    },
    ne: {
      title: 'मामिला अध्ययन (Case Study): आकस्मिक बाढी विपद् उद्धार, राहत निष्पक्षता र अफवाह नियन्त्रण',
      question:
        'घटना विवरण: रातभरिको अविरल वर्षाले तपाईं कार्यरत नगरपालिकाका ३ वटा वडामा ३५० परिवार विस्थापित भएका छन् । वडा नं. ७ को सडक सम्पर्क विच्छेद भएको छ, राहत सामग्री (त्रिपाल) वितरणमा राजनीतिक पक्षपात भएको भन्दै दुई स्थानमा विरोध प्रदर्शन भएको छ र नजिकको पुल भत्किएको अपुष्ट हल्ला सामाजिक सञ्जालमा फैलिएको छ । यस अवस्थामा (क) पहिलो २४ घण्टाको आकस्मिक उद्धार प्राथमिकता र (ख) निष्पक्ष राहत तथा पुनर्लाभ कार्ययोजना प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'प्रस्तुत मामिलाले स्थानीय तहको आकस्मिक विपद् व्यवस्थापनमा जीवनरक्षा, पारदर्शी राहत वितरण र संकटकालीन सूचना व्यवस्थापनबीचको संवेदनशील सन्तुलनको माग गर्दछ, जुन विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन, २०७४ र स्थानीय सरकार सञ्चालन ऐन, २०७४ बाट निर्देशित छ ।',
      sections: [
        {
          heading: '(क) पहिलो २४ घण्टाको आकस्मिक प्राथमिकता (जीवनरक्षा र अफवाह नियन्त्रण)',
          points: [
            'स्थानीय आपत्कालीन कार्यसञ्चालन केन्द्र (LEOC) सक्रिय र खोज–उद्धार: तत्काल विपद् व्यवस्थापन समितिको बैठक राखी प्रजिअ, नेपाली सेना, नेपाल प्रहरी, सशस्त्र प्रहरी र रेडक्रससँगको समन्वयमा सम्पर्क विच्छेद भएको वडा नं. ७ मा हेलिकप्टर/बोट वा पैदल उद्धार टोली पठाउने ।',
            'सुरक्षित आश्रय र संवेदनशील वर्ग प्राथमिकता: सुरक्षित विद्यालय/सामुदायिक भवनमा अस्थायी सेल्टर बनाई शुद्ध पानी, स्वास्थ्य शिविर तथा सुत्केरी, बालबालिका, ज्येष्ठ नागरिक र अपाङ्गता भएकालाई विशेष प्राथमिकता दिने ।',
            'अफवाह नियन्त्रण र आधिकारिक बुलेटिन: प्राविधिक र प्रहरी टोली खटाई पुलको वास्तविक अवस्था स्थलगत जाँच गर्ने र स्थानीय एफएम तथा आधिकारिक पेजमार्फत २४/७ हेल्पलाइनसहित तथ्यपरक सूचना जारी गरी त्रास अन्त्य गर्ने ।',
          ],
        },
        {
          heading: '(ख) निष्पक्ष राहत वितरण र पुनर्लाभ समन्वय (२ देखि ३० दिन)',
          points: [
            'एकद्वार राहत प्रणाली र सर्वपक्षीय सूची प्रमाणीकरण: दलीय वा समानान्तर वितरण रोकी रेडक्रस, वडा सचिव र सर्वदलीय/नागरिक प्रतिनिधि संलग्न संयन्त्रबाट वास्तविक पीडितको नामावली तयार पारी आश्रयस्थलमै सार्वजनिक टाँस गर्ने ।',
            'मापदण्डअनुसार समान राहत र गुनासो सुनुवाइ: एकरूपताका साथ खाद्यान्न, त्रिपाल र स्वास्थ्य किट भरपाई गरी वितरण गर्ने तथा छुटेका वास्तविक पीडितको तत्काल स्थलगत पुनर्जाँच गर्ने ।',
            'पहुँच पुनःस्थापना र महामारी रोकथाम: वडा नं. ७ को पहिरो पन्छाउने, पानीका मुहान क्लोरिनेसन गरी हैजा/झाडापखाला रोक्ने र प्रारम्भिक क्षति विवरण (IRA) संकलन गरी प्रदेश/संघीय विपद् कोषसँग समन्वय गर्ने ।',
          ],
        },
      ],
      conclusion:
        'अपेक्षित नतिजा: तत्काल LEOC परिचालन, तथ्यमा आधारित एकद्वार राहत प्रणाली र पारदर्शी सञ्चारले प्रदर्शन मत्थर पारी वडा नं. ७ का नागरिकको जीवनरक्षा र जनविश्वास दुवै सुरक्षित गर्दछ ।',
    },
    rubric: [
      {
        en: 'Prioritized first 24 hours: LEOC + CDO/security SAR into cut-off Ward 7, vulnerable triage shelters, and rapid engineering verification to counter social media panic.',
        ne: 'पहिलो २४ घण्टामा LEOC, सुरक्षा निकायमार्फत वडा ७ उद्धार, संवेदनशील वर्ग प्राथमिकता र पुलको तथ्य जाँचद्वारा अफवाह नियन्त्रण समेटिएको ।',
      },
      {
        en: 'Resolved relief-protest friction using One-Door Distribution, multi-stakeholder verified beneficiary lists, public posting, and on-site grievance verification.',
        ne: 'एकद्वार प्रणाली, सर्वपक्षीय सूची प्रमाणीकरण, सार्वजनिक टाँस र गुनासो पुनर्जाँचमार्फत राहत विवाद समाधान गरिएको ।',
      },
      {
        en: 'Included post-flood sanitation/water chlorination and DRRM Act 2074 coordination.',
        ne: 'पानी शुद्धीकरण/महामारी रोकथाम र विपद् ऐन २०७४ अनुसारको समन्वय उल्लेख गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-416',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Business Accounting, Capital Budgeting & NFRS',
    postTarget: 'Section Officer (Audit Service / Accounts)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
    en: {
      title: 'Corporate Accounting of Public Enterprises: Capital Budgeting, Ratios & NFRS',
      question:
        'Why must Nepal Audit Service officers master corporate financial analysis when auditing State-Owned Enterprises (SOEs)? Explain key Capital Budgeting and Ratio Analysis tools, and evaluate major challenges in implementing Nepal Financial Reporting Standards (NFRS) across Nepal’s public corporations.',
      marksAllocation: '2 + 4 + 4 = 10 Marks',
      introduction:
        'Under Article 241 of the Constitution and the Audit Act, 2075, the Office of the Auditor General audits wholly or substantially government-owned corporate bodies and public enterprises (e.g., NEA, NOC, Nepal Telecom, NAC). Unlike cash-based ministries, SOEs operate on accrual corporate accounting governed by NFRS and evaluated through commercial viability metrics.',
      sections: [
        {
          heading: '1. Core Financial Evaluation Tools for SOE Auditors',
          points: [
            'Capital Budgeting Appraisal: Assessing mega capital investments using Discounted Cash Flow (NPV > 0, IRR > cost of capital, Profitability Index) versus non-discounted Payback Period and ARR—vital for detecting white-elephant projects or inflated feasibility assumptions.',
            'Financial Ratio & Trend Analysis: Diagnosing Liquidity (Current/Quick Ratio), Solvency/Leverage (Debt-to-Equity, Interest Coverage), Activity/Turnover (Inventory/Receivables days), and Profitability (ROA, ROE, Operating Margin) plus Cost-Volume-Profit (Break-Even) sustainability.',
          ],
        },
        {
          heading: '2. NFRS Implementation Challenges in Nepalese SOEs & Remedies',
          points: [
            'Challenges: Backlog in timely audits and un-reconciled fixed-asset/receivable ledgers; complex fair-value measurement (NFRS 13) and expected credit loss (NFRS 9) valuations in illiquid markets; acute shortage of NFRS-trained accounting staff inside SOEs; and inconsistent actuarial employee-benefit disclosures.',
            'Remedies: Enforce statutory AGM/audit timelines under Companies Act and Financial Accountability Act 2076, build joint OAG–ICAN–ASB technical training clinics, deploy integrated ERP accounting, and link SOE CEO performance contracts to clean, timely NFRS audit opinions.',
          ],
        },
      ],
      conclusion:
        'Strong corporate accounting, capital-appraisal scrutiny, and full NFRS compliance convert audit reports into early warning radars against SOE bailouts, fiscal risks, and hidden public liabilities.',
    },
    ne: {
      title: 'सार्वजनिक संस्थानको व्यावसायिक लेखा: पुँजीगत बजेटिङ, अनुपात विश्लेषण र NFRS कार्यान्वयन',
      question:
        'पूर्ण वा अधिकांश सरकारी स्वामित्व भएका संगठित संस्था (सार्वजनिक संस्थान) को लेखापरीक्षण गर्दा लेखापरीक्षण सेवाका अधिकृतहरूलाई व्यावसायिक वित्तीय विश्लेषणको ज्ञान किन आवश्यक पर्दछ ? पुँजीगत बजेटिङ र अनुपात विश्लेषणका औजार स्पष्ट पार्दै नेपालमा NFRS कार्यान्वयनका चुनौतीहरू मूल्याङ्कन गर्नुहोस् ।',
      marksAllocation: '२ + ४ + ४ = १० अङ्क',
      introduction:
        'नेपालको संविधानको धारा २४१ र लेखापरीक्षण ऐन, २०७५ बमोजिम महालेखापरीक्षकले सरकारी स्वामित्वका संगठित संस्था (जस्तै: विद्युत् प्राधिकरण, आयल निगम, टेलिकम आदि) को लेखापरीक्षण गर्दछ । सरकारी कार्यालय नगदमा आधारित भए पनि संस्थानहरू प्रोद्भावी व्यावसायिक लेखा र नेपाल वित्तीय प्रतिवेदन मान (NFRS) द्वारा सञ्चालित हुने भएकाले व्यावसायिक विश्लेषण अपरिहार्य हुन्छ ।',
      sections: [
        {
          heading: '१. संस्थान लेखापरीक्षणमा पुँजीगत बजेटिङ र अनुपात विश्लेषणको उपयोग',
          points: [
            'पुँजीगत बजेटिङ मूल्याङ्कन: ठूला आयोजनामा लगानीको आर्थिक सम्भाव्यता जाँच्न डिस्काउन्टेड विधि (NPV, IRR, Profitability Index) र पेब्याक अवधि/ARR तथा समविच्छेद बिन्दु (CVP/BEP) परीक्षण गरी अनुत्पादक खर्च रोक्ने ।',
            'वित्तीय अनुपात विश्लेषण: तरलता अनुपात (Current/Quick), ऋण–पुँजी सन्तुलन (Debt-Equity, Interest Coverage), कार्यकुशलता (Receivables/Inventory Turnover) र नाफादायकता (ROA, ROE) मार्फत संस्थानको वित्तीय स्वास्थ्य र जोखिम मूल्याङ्कन गर्ने ।',
          ],
        },
        {
          heading: '२. सार्वजनिक संस्थानमा NFRS कार्यान्वयनका चुनौती र सुधार उपाय',
          points: [
            'चुनौतीहरू: वर्षौंदेखिको लेखापरीक्षण बक्यौता र सम्पत्ति–दायित्व यकिन नहुनु, बजार अभावमा Fair Value (NFRS 13) र Expected Credit Loss (NFRS 9) मापन जटिल हुनु, कर्मचारी दायित्व (Actuarial Valuation) नखुलाइनु र दक्ष जनशक्ति अभाव ।',
            'सुधार उपायहरू: समयमै वार्षिक लेखापरीक्षण र साधारण सभा अनिवार्य गर्ने, OAG–ICAN–लेखामान बोर्ड (ASB) बीच संयुक्त क्षमता विकास गर्ने, ERP प्रणाली लागू गर्ने र संस्थान प्रमुखको कार्यसम्पादन करारलाई स्वच्छ NFRS लेखापरीक्षण प्रतिवेदनसँग आबद्ध गर्ने ।',
          ],
        },
      ],
      conclusion:
        'व्यावसायिक वित्तीय विश्लेषण र NFRS को इमानदार कार्यान्वयनले सार्वजनिक संस्थानमा लुकेको वित्तीय जोखिम समयमै पहिचान गरी राज्यको सम्भावित आर्थिक दायित्व जोगाउँछ ।',
    },
    rubric: [
      {
        en: 'Linked Art. 241 & Audit Act 2075 SOE mandate to accrual corporate accounting vs cash-based ministries.',
        ne: 'धारा २४१ र ऐन २०७५ बमोजिम संस्थानको प्रोद्भावी व्यावसायिक लेखापरीक्षणको औचित्य स्पष्ट पारिएको ।',
      },
      {
        en: 'Accurately outlined Capital Budgeting (NPV, IRR, PI, Payback, CVP) and Financial Ratios (Liquidity, Solvency, Turnover, Profitability).',
        ne: 'पुँजीगत बजेटिङ (NPV, IRR, Payback, CVP) र वित्तीय अनुपातका चारै वर्ग समेटिएको ।',
      },
      {
        en: 'Evaluated NFRS bottlenecks (audit backlog, fair-value/ECL valuation, actuarial liabilities, staff skills) with ERP/contract remedies.',
        ne: 'NFRS कार्यान्वयनका बाधा (लेखापरीक्षण ढिलाइ, फेयर भ्यालु, जनशक्ति कमी) र ERP/करार सुधार सुझाइएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-417',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Criminal Justice, Evidence & Govt. Attorney',
    postTarget: 'Nayab Subba / Section Officer (Justice & Law)',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Official PSC Nayab Subba Syllabus',
    sourcePath: '/materials/psc-nayab-subba-syllabus.pdf',
    en: {
      title: 'Criminal Prosecution, Two-Stage Sentencing & Role of Attorney General (Art. 158)',
      question:
        'Trace the key procedural stages of a state-party criminal case from FIR (Jaheri) to Preliminary Hearing (Thunchek), and highlight the constitutional powers of the Attorney General (Article 158) alongside two-stage sentencing reform.',
      marksAllocation: '3 + 2 = 5 Marks',
      introduction:
        'Under the Muluki Criminal Procedure Code, 2074, Criminal Offences (Sentencing and Execution) Act, 2074, and Article 158 of the Constitution, Nepal modernized criminal justice by separating investigation from independent state prosecution and decoupling guilt determination from individualized sentencing.',
      sections: [
        {
          heading: '1. Key Procedural Stages from FIR to Thunchek',
          points: [
            'Investigation Trigger & Evidence Collection: Filing of FIR (Jaheri Darkhast) in Schedule 1/2 state-party crimes, crime-scene and seizure Muchulka, arrest with warrant/urgent notice, and court-supervised custody remand (generally up to 25 days) supervised by the Government Attorney.',
            'Prosecution & Thunchek Hearing: Filing the Charge-Sheet (Abhiyogpatra) backed by Evidence Act, 2031 proof standards (burden on prosecution beyond reasonable doubt), followed by Preliminary Hearing (Thunchek Aadesh)—deciding pre-trial detention, bail/guarantee (Dharauti), or release on ordinary date (Tarikh).',
          ],
        },
        {
          heading: '2. Attorney General (Art. 158) & Two-Stage Sentencing Reform',
          points: [
            'Article 158 Mandate: Chief legal advisor to Government of Nepal holding final authority to decide whether to institute/withdraw state-party prosecutions, represent the state in all courts, and monitor detention conditions.',
            'Two-Stage Sentencing & Victim Rights: Following conviction, a separate hearing determines proportionate punishment—introducing non-custodial alternatives (probation, community service, open prison) and victim compensation under the Crime Victim Protection Act, 2075.',
          ],
        },
      ],
      conclusion:
        'Fair investigation, evidence-led prosecution by independent Government Attorneys, and rehabilitative two-stage sentencing balance public security with constitutional fair-trial rights (Art. 20).',
    },
    ne: {
      title: 'फौजदारी अभियोजन, दुई-चरणीय सजाय निर्धारण र महान्यायाधिवक्ताको भूमिका (धारा १५८)',
      question:
        'सरकारवादी फौजदारी मुद्दामा जाहेरी दरखास्तदेखि थुनछेक आदेशसम्मका मुख्य कार्यविधिगत चरणहरू उल्लेख गर्दै संविधानको धारा १५८ बमोजिम महान्यायाधिवक्ताको अधिकार र दुई-चरणीय सजाय निर्धारण प्रणालीको महत्त्व स्पष्ट पार्नुहोस् ।',
      marksAllocation: '३ + २ = ५ अङ्क',
      introduction:
        'मुलुकी फौजदारी कार्यविधि संहिता, २०७४, फौजदारी कसूर (सजाय निर्धारण तथा कार्यान्वयन) ऐन, २०७४ र संविधानको धारा १५८ ले नेपालको फौजदारी न्याय प्रणालीलाई प्रमाणमुखी अभियोजन र सुधारमुखी दण्ड व्यवस्थातर्फ रूपान्तरण गरेको छ ।',
      sections: [
        {
          heading: '१. जाहेरी दरखास्तदेखि थुनछेक आदेशसम्मका मुख्य चरण',
          points: [
            'अनुसन्धान चरण: अनुसूची १/२ बमोजिमको अपराधमा जाहेरी दरखास्त दर्ता, घटनास्थल तथा बरामदी मुचुल्का, पक्राउ पुर्जी र सरकारी वकिलको निगरानीमा अदालतबाट म्याद थप (सामान्यतः अधिकतम २५ दिनसम्म) गरी प्रमाण संकलन ।',
            'अभियोजन र थुनछेक सुनुवाइ: प्रमाण ऐन, २०३१ का आधारमा वस्तुनिष्ठ प्रमाणसहित अभियोगपत्र दर्ता गरेपछि अदालतले तत्काल प्राप्त प्रमाणका आधारमा अभियुक्तलाई पुर्पक्षका लागि थुनामा राख्ने, धरौटी/जमानत माग्ने वा साधारण तारेखमा छाड्ने "थुनछेक आदेश" गर्दछ ।',
          ],
        },
        {
          heading: '२. महान्यायाधिवक्ताको अधिकार (धारा १५८) र दुई-चरणीय सजाय निर्धारण',
          points: [
            'धारा १५८ को संवैधानिक अधिकार: नेपाल सरकारको मुख्य कानुनी सल्लाहकारका रूपमा सरकारवादी मुद्दा चलाउने वा नचलाउने अन्तिम निर्णय गर्ने, अदालतमा प्रतिनिधित्व गर्ने र थुनुवाको मानव अधिकार अवस्था अनुगमन गर्ने ।',
            'दुई-चरणीय सजाय र पीडित संरक्षण: कसूर ठहर भएपछि अलग्गै सुनुवाइमार्फत सजाय तोक्ने, प्रोबेसन/सामुदायिक सेवा/खुला कारागारजस्ता सुधारात्मक विकल्प प्रयोग गर्ने र अपराध पीडित संरक्षण ऐन, २०७५ बमोजिम क्षतिपूर्ति दिलाउने ।',
          ],
        },
      ],
      conclusion:
        'वस्तुनिष्ठ प्रमाणमा आधारित अभियोजन, स्वतन्त्र सरकारी वकिल र सुधारात्मक सजाय प्रणालीले संविधानको धारा २० बमोजिमको स्वच्छ सुनुवाइ र पीडितको न्याय दुवै सुनिश्चित गर्दछन् ।',
    },
    rubric: [
      {
        en: 'Accurately traced state-party criminal stages: Jaheri (FIR), Muchulka, remand (25-day cap), Abhiyogpatra, Evidence Act burden, and Thunchek options.',
        ne: 'जाहेरी, मुचुल्का, म्याद थप, अभियोगपत्र, प्रमाण ऐन र थुनछेक आदेश (थुना/धरौटी/साधारण तारेख) सही क्रममा लेखिएको ।',
      },
      {
        en: 'Explained Attorney General final prosecution authority under Art. 158, two-stage sentencing (probation/community service), and Crime Victim Protection Act 2075.',
        ne: 'धारा १५८ को अधिकार, दुई-चरणीय सजाय (प्रोबेसन/सामुदायिक सेवा) र पीडित संरक्षण ऐन २०७५ समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-418',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Bilateral Treaties, Art. 279 & Regionalism',
    postTarget: 'Section Officer / Nayab Subba (Foreign Affairs)',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Official PSC Section Officer (Gazetted Class III) Syllabus — Phase I',
    sourcePath: '/materials/psc-section-officer-syllabus.pdf',
    en: {
      title: 'Treaty Ratification (Article 279), Bilateral Treaties & SAARC/BIMSTEC Diplomacy',
      question:
        'Explain the constitutional classification for treaty ratification under Article 279 of the Constitution of Nepal (and Nepal Treaty Act, 2047). Discuss how Nepal can leverage SAARC and BIMSTEC alongside updated bilateral frameworks with India and China.',
      marksAllocation: '2.5 + 2.5 = 5 Marks',
      introduction:
        'Treaty-making and regional diplomacy anchor Nepal’s sovereign external engagement. Domestically, treaty validity is governed by Article 279 of the Constitution and the Nepal Treaty Act, 2047, while regional connectivity operates through SAARC, BIMSTEC, and bilateral instruments.',
      sections: [
        {
          heading: '1. Constitutional Treaty Ratification Thresholds (Article 279)',
          points: [
            'Two-Thirds Majority of Both Houses: Mandatory for treaties concerning (a) peace and friendship, (b) defence and strategic alliance, (c) boundaries of Nepal, and (d) natural resources and the distribution of their uses (with simple majority option for ordinary/non-detrimental natural resource agreements).',
            'Simple Majority / Executive Notification: Ordinary treaties outside these four vital categories follow simple parliamentary approval or executive ratification under Nepal Treaty Act, 2047 (whose Section 9 grants ratified treaties precedence over inconsistent domestic statutes).',
          ],
        },
        {
          heading: '2. Updating Bilateral Diplomacy & Revitalizing SAARC/BIMSTEC',
          points: [
            'Bilateral Balance: Constructively update historic frameworks (such as the 1950 Nepal-India Treaty via EPG dialogue, Trade & Transit pacts, and 1960 Nepal-China Peace & Friendship / Belt & Road transit protocols) based on sovereign equality and mutual economic benefit.',
            'Regional Complementarity: Overcome SAARC stalemate as current Chair through Track II consensus while accelerating BIMSTEC (with newly operationalized Charter) for Bay of Bengal grid connectivity, trade, and mountain climate resilience.',
          ],
        },
      ],
      conclusion:
        'Transparent parliamentary scrutiny under Article 279 builds domestic consensus behind treaties, empowering Nepal’s diplomats to advance balanced connectivity across South and Southeast Asia.',
    },
    ne: {
      title: 'सन्धि अनुमोदन (धारा २७९), द्विपक्षीय सन्धि र सार्क/बिम्स्टेक क्षेत्रीय कूटनीति',
      question:
        'नेपालको संविधानको धारा २७९ र नेपाल सन्धि ऐन, २०४७ बमोजिम सन्धि अनुमोदनका संवैधानिक मापदण्ड स्पष्ट पार्दै भारत र चीनसँगका द्विपक्षीय सन्धिलाई समयानुकूल बनाउँदै सार्क र बिम्स्टेकबाट नेपालले कसरी लाभ लिन सक्छ, लेख्नुहोस् ।',
      marksAllocation: '२.५ + २.५ = ५ अङ्क',
      introduction:
        'नेपालको अन्तर्राष्ट्रिय दायित्व र सार्वभौम कूटनीतिक सम्बन्ध सन्धि–सम्झौता र क्षेत्रीय संगठनहरूमार्फत सञ्चालित हुन्छ । संविधानको धारा २७९ र नेपाल सन्धि ऐन, २०४७ ले सन्धि अनुमोदन र कार्यान्वयनको स्पष्ट संवैधानिक विधि निर्धारण गरेका छन् ।',
      sections: [
        {
          heading: '१. धारा २७९ बमोजिम सन्धि अनुमोदनको संवैधानिक व्यवस्था',
          points: [
            'दुई-तिहाइ बहुमत आवश्यक पर्ने ४ विषय: (क) शान्ति र मैत्री, (ख) सुरक्षा एवं सामरिक सम्बन्ध, (ग) नेपाल राज्यको सिमाना, र (घ) प्राकृतिक स्रोत तथा त्यसको उपयोगको बाँडफाँट (राष्ट्रमा व्यापक/गम्भीर असर नपर्ने सामान्य प्राकृतिक स्रोत र अन्य सन्धि साधारण बहुमतबाट पारित हुन सक्ने) ।',
            'नेपाल सन्धि ऐन, २०४७ (दफा ९): संसद्‌बाट अनुमोदित वा नेपाल पक्ष भएका सन्धिहरू नेपाल कानुनसरह लागू हुने र घरेलु ऐन बाझिएमा सन्धिको व्यवस्था प्रभावी हुने ।',
          ],
        },
        {
          heading: '२. द्विपक्षीय सन्धि अद्यावधिक र सार्क/बिम्स्टेक परिचालन',
          points: [
            'द्विपक्षीय सन्तुलन: १९५० को नेपाल-भारत शान्ति तथा मैत्री सन्धि (EPG प्रतिवेदन लगायत कूटनीतिक संवादमार्फत) तथा व्यापार/पारवहन र १९६० को नेपाल-चीन सन्धि एवं पारवहन प्रोटोकललाई समयानुकूल आपसी हितमा कार्यान्वयन गर्ने ।',
            'क्षेत्रीय सहकार्य: सार्क अध्यक्षका रूपमा अवरुद्ध प्रक्रिया खुलाउन सक्रिय कूटनीति गर्दै बडापत्र (Charter) लागू भइसकेको बिम्स्टेकमार्फत दक्षिण र दक्षिण-पूर्वी एसियाबीच ऊर्जा, व्यापार र जलवायु सहकार्य विस्तार गर्ने ।',
          ],
        },
      ],
      conclusion:
        'धारा २७९ अनुसार संसदीय अपनत्वसहित पारदर्शी सन्धि अभ्यास र सन्तुलित द्विपक्षीय/क्षेत्रीय कूटनीतिले भूपरिवेष्ठित नेपाललाई भू-जडित (Land-linked) राष्ट्रमा रूपान्तरण गर्दछ ।',
    },
    rubric: [
      {
        en: 'Accurately listed all 4 Article 279 categories requiring two-thirds joint parliamentary ratification and cited Nepal Treaty Act 2047 (Sec. 9).',
        ne: 'धारा २७९ का दुई-तिहाइ बहुमत चाहिने ४ क्षेत्र र सन्धि ऐन २०४७ (दफा ९) सही लेखिएको ।',
      },
      {
        en: 'Connected sovereign bilateral treaty updates (1950/1960 & transit) with SAARC revitalization and BIMSTEC connectivity.',
        ne: 'द्विपक्षीय सन्धि अद्यावधिक, पारवहन तथा सार्क पुनर्जागरण र बिम्स्टेक ऊर्जा/व्यापार सहकार्य समेटिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-419',
    paper: 'Paper IV: Service Delivery & Case Analysis',
    subject: 'Federal Coordination & CAO Neutrality Case Study',
    postTarget: 'Section Officer / Nayab Subba',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Case Study',
    sourceTitle: 'Local Government Operation Act, 2074 — Core PSC Provisions',
    sourcePath: '/materials/local-government-operation-act-2074.pdf',
    en: {
      title: 'Case Study: Resolving Assembly Deadlock, Illegal Local Tax & CAO Neutrality',
      question:
        'Case Scenario: In a Municipality where you serve as Chief Administrative Officer (CAO), the Municipal Assembly has failed to pass the annual budget by Ashadh 30 due to a political dispute between the Mayor and Deputy Mayor. Meanwhile, the Mayor demands you execute an executive order imposing a new "Inter-District Highway Transit Fee" not included in the Finance Act, and requests transferring a Ward Secretary who pointed out missing grant compliance. (a) Identify the legal/constitutional anomalies and neutrality challenges. (b) Detail your lawful step-by-step resolution plan.',
      marksAllocation: '4 + 6 = 10 Marks',
      introduction:
        'Case Context: Political polarization inside local executives frequently places the Chief Administrative Officer (CAO)—the federal civil servant acting as statutory member-secretary and Accounting Officer—in direct tension between elected authority and statutory legality under the Constitution, LGOA 2074, and Intergovernmental Fiscal Arrangement Act, 2074.',
      sections: [
        {
          heading: '(a) Legal & Constitutional Anomalies Identified',
          points: [
            'Budget Paralysis (Sec. 71 LGOA & Fiscal Act): Without Assembly passage of the Appropriation and Finance Acts, zero municipal expenditure (beyond statutory limits) or tax collection is constitutionally permissible under Article 228 ("No tax except in accordance with law").',
            'Unlawful Highway Transit Fee: Under Schedule 8 and the Intergovernmental Fiscal Arrangement Act, local bodies cannot obstruct inter-district/national highway transit or invent levies outside passed Finance Acts.',
            'Retaliatory Transfer Threat & Accountability Breach: Penalizing a compliant Ward Secretary for flagging grant documentation gaps violates Civil Service Act neutrality, whistleblower protection norms, and financial fiduciary duty.',
          ],
        },
        {
          heading: '(b) Lawful Step-by-Step Resolution Strategy',
          points: [
            'Formal Statutory Briefing on Budget Freeze: Present a neutral, non-partisan written note jointly to the Mayor, Deputy Mayor, and Executive members explaining the legal freeze under LGOA Sec. 71 and NNRFC grant-penalty consequences, catalyzing an emergency all-party consensus Assembly session.',
            'Respectful Rejection of Extra-Statutory Tax: Issue a polite written legal memo quoting Article 228 and Schedule 8 showing the proposed highway fee is ultra vires; suspend collection instructions immediately and propose lawful Finance Act revenue reforms instead.',
            'Protect the Whistleblowing Staff & Restore Harmony: Decline arbitrary punitive transfer without lawful administrative grounds, verify and regularize the grant documentation neutrally, and act as an impartial professional bridge facilitating dialogue between the Mayor and Deputy Mayor without taking political sides.',
          ],
        },
      ],
      conclusion:
        'A CAO succeeds neither by obeying unlawful executive orders nor by engaging in municipal politics, but by anchoring both rival factions to transparent statutory rules so essential citizen services resume smoothly.',
    },
    ne: {
      title: 'मामिला अध्ययन (Case Study): स्थानीय बजेट गतिरोध, गैरकानुनी कर र प्रमुख प्रशासकीय अधिकृतको तटस्थता',
      question:
        'घटना विवरण: तपाईं प्रमुख प्रशासकीय अधिकृत (CAO) कार्यरत नगरपालिकामा प्रमुख र उपप्रमुखबीचको राजनीतिक विवादका कारण असार मसान्तसम्म पनि वार्षिक बजेट पारित हुन सकेको छैन । यसैबीच नगरप्रमुखले आर्थिक ऐनमा नभएको "अन्तर–जिल्ला राजमार्ग प्रवेश शुल्क" कार्यपालिकाको निर्णयबाट तत्काल असुल गर्न र अनुदानको कागजात अपुग भएको औँल्याउने एक वडा सचिवलाई तत्काल सरुवा गर्न निर्देशन दिनुभएको छ । (क) यसमा रहेका संवैधानिक-कानुनी त्रुटि र तटस्थताका चुनौती पहिचान गर्नुहोस् । (ख) निकासका लागि तपाईंको चरणबद्ध कार्ययोजना प्रस्तुत गर्नुहोस् ।',
      marksAllocation: '४ + ६ = १० अङ्क',
      introduction:
        'प्रस्तुत मामिलाले स्थानीय तहको राजनीतिक ध्रुवीकरणका बीच संघीय निजामती सेवाबाट खटिएको प्रमुख प्रशासकीय अधिकृतले संवैधानिक कानुन, वित्तीय उत्तरदायित्व र राजनीतिक तटस्थताबीच कसरी समन्वयकारी निकास निकाल्नुपर्छ भन्ने वास्तविक परीक्षण गर्दछ ।',
      sections: [
        {
          heading: '(क) संवैधानिक–कानुनी त्रुटि र प्रशासनिक चुनौतीहरू',
          points: [
            'बजेट शून्यता (संविधान धारा २२८ र LGOA दफा ७१): नगर सभाबाट विनियोजन र आर्थिक ऐन पारित नभई कुनै पनि खर्च र कर असुली कानुनसम्मत हुँदैन ।',
            'गैरकानुनी राजमार्ग शुल्क: अनुसूची ८ र अन्तर-सरकारी वित्त व्यवस्थापन ऐन, २०७४ विपरीत राष्ट्रिय/अन्तर–जिल्ला राजमार्गमा आवतजावत अवरुद्ध गर्ने कर कार्यपालिकाले मात्र तोक्न मिल्दैन ।',
            'प्रतिशोधात्मक सरुवा र सुशासन आघात: अनुदान प्रक्रियाको कमजोरी औँल्याउने वडा सचिवलाई दण्डित गर्नु निजामती सेवा आचरण, सुशासन ऐन र वित्तीय जवाफदेहिता विपरीत हो ।',
          ],
        },
        {
          heading: '(ख) कानुनसम्मत चरणबद्ध समाधान योजना',
          points: [
            'बजेट निकासका लागि निष्पक्ष सहजीकरण: प्रमुख, उपप्रमुख र कार्यपालिका सदस्यसमक्ष बजेट पारित नहुँदा रोकिने तलब, सेवा, र NNRFC को कार्यसम्पादन अनुदान कटौतीबारे संयुक्त कानुनी ब्रिफिङ गरी विशेष/सहमतिको नगर सभा बोलाउन तटस्थ पहल गर्ने ।',
            'अवैध करको शिष्ट लिखित इन्कारी: संविधानको धारा २२८ र आर्थिक ऐनको सीमा उल्लेख गरी राजमार्ग शुल्क लगाउन कानुनले नमिल्ने लिखित राय दिई ठेक्का/असुली रोक्ने र वैधानिक कर दायरा विस्तारको विकल्प पेस गर्ने ।',
            'कर्मचारी संरक्षण र संस्थागत सन्तुलन: वडा सचिवमाथिको पूर्वाग्रही सरुवा रोकी निजले उठाएको अनुदान कागजात विधिवत् सुधार गर्ने तथा प्रमुख–उपप्रमुखबीच कुनै पक्षमा नलागी कानुनी मध्यस्थताद्वारा सेवा प्रवाह सुचारु राख्ने ।',
          ],
        },
      ],
      conclusion:
        'प्रमुख प्रशासकीय अधिकृतको बल कानुन, तथ्य र तटस्थतामा निहित हुन्छ । अवैध आदेशलाई शिष्टतापूर्वक अस्वीकार गर्दै संवादबाट बजेट निकास निकाल्नु नै व्यावसायिक प्रशासनको सफलता हो ।',
    },
    rubric: [
      {
        en: 'Identified all 3 legal issues: Art. 228/LGOA Sec. 71 budget & tax invalidity, ultra vires inter-district highway levy, and unlawful retaliation against compliant staff.',
        ne: 'धारा २२८/बजेट अभावमा कर–खर्च अमान्य हुने, अवैध राजमार्ग शुल्क र प्रतिशोधात्मक सरुवाको गैरकानुनीपन पहिचान गरिएको ।',
      },
      {
        en: 'Maintained strict civil-service neutrality between Mayor and Deputy Mayor while using statutory briefings (NNRFC impact) to break budget gridlock.',
        ne: 'प्रमुख–उपप्रमुखबीच निष्पक्ष रही NNRFC अनुदान असरसहित कानुनी ब्रिफिङद्वारा बजेट निकास खोजिएको ।',
      },
      {
        en: 'Protected subordinate staff raising compliance gaps and refused ultra vires tax collection politely in writing.',
        ne: 'वडा सचिवको कानुनी अडानको संरक्षण गर्दै अवैध कर असुली लिखित रूपमा रोकिएको ।',
      },
    ],
  },
];
