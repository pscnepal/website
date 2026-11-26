import type { QuizQuestion } from '../../types/assessment';

const COMP_TECH_PHASE2_PDF =
  'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf';

const ETA_2063_PDF =
  'https://giwmscdnone.gov.np/media/pdf_upload/15.%20%E0%A4%B5%E0%A4%BF%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A5%81%E0%A4%A4%E0%A5%80%E0%A4%AF%20(%E0%A4%87%E0%A4%B2%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%8B%E0%A4%A8%E0%A4%BF%E0%A4%95)%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8B%E0%A4%AC%E0%A4%BE%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_jkxllj0.pdf';

export const NTC_TECH_QUESTIONS: QuizQuestion[] = [
  {
    id: 'NTC-L7-001',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I & II: Exam Scheme',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-SCHEME',
    topic: 'NTC Level 7 Examination Blueprint',
    subtopicId: 'NTC-SCHEME-01',
    subtopic: 'Merit Weightage & Marking Rules',
    question:
      'In Nepal Telecom’s Computer Engineer (Level 7) examination scheme, what is the full mark distribution of Paper I, Paper II, and Oral Interview, and what is the negative marking rate on the 30 MCQs in each paper?',
    questionNe:
      'नेपाल टेलिकमको कम्प्युटर इन्जिनियर (तह ७) परीक्षा योजनाअनुसार प्रथम पत्र, द्वितीय पत्र र अन्तर्वार्ताको पूर्णाङ्क कति हुन्छ र प्रत्येक पत्रका ३० वस्तुगत प्रश्नमा नकारात्मक अङ्क कति कट्टा गरिन्छ?',
    options: [
      {
        key: 'A',
        text: 'Paper I (100M, Pass 40) + Paper II (100M, Pass 40) + Interview (30M) = 230 Marks; 20% (-0.20M) negative marking per wrong MCQ',
        textNe: 'प्रथम पत्र (१००, उत्तीर्ण ४०) + द्वितीय पत्र (१००, उत्तीर्ण ४०) + अन्तर्वार्ता (३०) = २३० अङ्क; गलत उत्तरमा २०% (-०.२० अङ्क)',
      },
      {
        key: 'B',
        text: 'Paper I (100M qualifying only) + Paper II (200M) + Interview (40M) = 240 Marks; no negative marking',
        textNe: 'प्रथम पत्र छनोट मात्र (१००) + द्वितीय पत्र (२००) + अन्तर्वार्ता (४०) = २४० अङ्क; नकारात्मक अङ्क नहुने',
      },
      {
        key: 'C',
        text: 'Paper I (50M) + Paper II (150M) + Interview (50M) = 250 Marks; 25% negative marking',
        textNe: 'प्रथम पत्र (५०) + द्वितीय पत्र (१५०) + अन्तर्वार्ता (५०) = २५० अङ्क; २५% नकारात्मक अङ्क',
      },
      {
        key: 'D',
        text: 'Paper I (100M) + Paper II (100M) + IT Practical (20M) + Interview (30M) = 250 Marks',
        textNe: 'प्रथम पत्र (१००) + द्वितीय पत्र (१००) + आईटी प्रयोगात्मक (२०) + अन्तर्वार्ता (३०) = २५० अङ्क',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Each NTC Level 7 written paper carries 100 marks (30 MCQs × 1M + 10 Short × 4M + 3 Long × 10M, pass mark 40, -20% on wrong MCQs, non-programmable calculators permitted), totaling 230 marks with the 30-mark interview.',
    explanationNe:
      'नेपाल टेलिकम तह ७ मा प्रथम र द्वितीय दुवै पत्र १००–१०० अङ्कका हुन्छन् (प्रत्येकमा ३० MCQ × १ + १० छोटो × ४ + ३ लामो × १०, उत्तीर्णाङ्क ४०, २०% नकारात्मक अङ्क) र ३० अङ्कको अन्तर्वार्तासहित कुल २३० पूर्णाङ्क हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Level 7 Technical Reference Syllabus',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-002',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I (General): Section B',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-LAW',
    topic: 'Telecom & Cyber Statutes',
    subtopicId: 'NTC-LAW-01',
    subtopic: 'Electronic Transactions Act 2063',
    question:
      'Under the Electronic Transactions Act, 2063 (2006) of Nepal, which statutory authority licenses and supervises Certifying Authorities issuing digital signature certificates, and which judicial body hears cyber offense cases under Chapter 9?',
    questionNe:
      'नेपालको विद्युतीय (इलेक्ट्रोनिक) कारोबार ऐन, २०६३ बमोजिम डिजिटल हस्ताक्षर प्रमाणपत्र जारी गर्ने निकायलाई इजाजतपत्र र नियमन गर्ने पदाधिकारी को हुन् र परिच्छेद ९ का साइबर कसुरको सुनुवाइ कुन निकायले गर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Controller of Certification (प्रमाणीकरण नियन्त्रक) and Information Technology Tribunal (सूचना प्रविधि न्यायाधिकरण)',
        textNe: 'प्रमाणीकरण नियन्त्रक र सूचना प्रविधि न्यायाधिकरण',
      },
      {
        key: 'B',
        text: 'Nepal Telecommunications Authority (NTA) and Commercial Bench of High Court',
        textNe: 'नेपाल दूरसञ्चार प्राधिकरण र उच्च अदालतको वाणिज्य इजलास',
      },
      {
        key: 'C',
        text: 'Ministry of Home Affairs and Chief District Officer',
        textNe: 'गृह मन्त्रालय र प्रमुख जिल्ला अधिकारी',
      },
      {
        key: 'D',
        text: 'Office of the Company Registrar and Revenue Tribunal',
        textNe: 'कम्पनी रजिष्ट्रारको कार्यालय र राजस्व न्यायाधिकरण',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Under ETA 2063, the Office of the Controller of Certification (OCC) regulates Certifying Authorities, while original jurisdiction for cyber crimes lies with the Information Technology Tribunal (appealable to the IT Appellate Tribunal).',
    explanationNe:
      'विद्युतीय कारोबार ऐन, २०६३ अनुसार प्रमाणीकरण नियन्त्रकले प्रमाणित गर्ने निकायको नियमन गर्दछ भने दफा ६० बमोजिम सूचना प्रविधि न्यायाधिकरणले साइबर कसुरको सुरु कारबाही र किनारा गर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'विद्युतीय (इलेक्ट्रोनिक) कारोबार ऐन, २०६३',
    sourcePath: ETA_2063_PDF,
  },
  {
    id: 'NTC-L7-003',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I (General): Section B',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-LAW',
    topic: 'Telecom Regulatory Governance',
    subtopicId: 'NTC-LAW-02',
    subtopic: 'Telecommunications Act 2053',
    question:
      'Under the Nepal Telecommunications Act, 2053, what is the maximum initial tenure of a telecommunications service license granted by Nepal Telecommunications Authority (NTA), and what annual RTDF contribution rate applies to licensed operators?',
    questionNe:
      'दूरसञ्चार ऐन, २०५३ बमोजिम दूरसञ्चार सेवा सञ्चालनको इजाजतपत्रको अधिकतम अवधि कति वर्ष हुन्छ र ग्रामीण दूरसञ्चार विकास कोष (RTDF) मा वार्षिक कुल आयको कति प्रतिशत रकम जम्मा गर्नुपर्छ?',
    options: [
      {
        key: 'A',
        text: 'Maximum 25 years license tenure (initial grant ≤10 years, renewable for ≤5-year terms); 2% of annual gross revenue to RTDF',
        textNe: 'अधिकतम २५ वर्ष अवधि (पहिलो पटक १० वर्षसम्म र ५–५ वर्षमा नवीकरण); वार्षिक कुल आयको २% ग्रामीण दूरसञ्चार विकास कोषमा',
      },
      {
        key: 'B',
        text: 'Maximum 15 years tenure; 5% of annual gross revenue to RTDF',
        textNe: 'अधिकतम १५ वर्ष अवधि; वार्षिक आयको ५% RTDF मा',
      },
      {
        key: 'C',
        text: 'Perpetual license once issued; 1% of net profit to RTDF',
        textNe: 'स्थायी इजाजतपत्र; खुद नाफाको १% RTDF मा',
      },
      {
        key: 'D',
        text: 'Maximum 30 years tenure; 4% royalty and 0% RTDF',
        textNe: 'अधिकतम ३० वर्ष अवधि; ४% रोयल्टी र ०% RTDF',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Section 25 of the Nepal Telecommunications Act 2053 caps total license duration at 25 years (initially up to 10 years, renewed up to 5 years at a time), and Section 30(4) mandates operators contribute 2% of annual gross income into the Rural Telecommunications Development Fund (RTDF).',
    explanationNe:
      'दूरसञ्चार ऐन, २०५३ को दफा २५ अनुसार इजाजतपत्रको कुल अवधि २५ वर्ष ननाघ्ने गरी प्रदान गरिन्छ र दफा ३०(४) अनुसार इजाजतपत्रप्राप्त व्यक्तिले वार्षिक कुल आयको २ प्रतिशत रकम ग्रामीण दूरसञ्चार विकास कोषमा जम्मा गर्नुपर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'Nepal Telecommunications Act 2053 & Reference Syllabus',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-004',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Computer Communications',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-NET',
    topic: 'IPv4 CIDR & Subnetting',
    subtopicId: 'NTC-NET-01',
    subtopic: 'Carrier Subnet Sizing',
    question:
      'An NTC metro-ring gateway is allocated the CIDR prefix 10.64.16.0/21. Which of the following correctly states the total usable host addresses and the broadcast address of this block?',
    questionNe:
      'नेपाल टेलिकमको मेट्रो–रिङ गेटवेलाई 10.64.16.0/21 CIDR ब्लक दिइएको छ। यस नेटवर्कमा प्रयोगयोग्य होस्ट ठेगानाको सङ्ख्या र ब्रोडकास्ट ठेगाना कुन सही हो?',
    options: [
      {
        key: 'A',
        text: '2,046 usable hosts; broadcast address 10.64.23.255',
        textNe: '२,०४६ प्रयोगयोग्य होस्ट; ब्रोडकास्ट ठेगाना 10.64.23.255',
      },
      {
        key: 'B',
        text: '1,022 usable hosts; broadcast address 10.64.19.255',
        textNe: '१,०२२ प्रयोगयोग्य होस्ट; ब्रोडकास्ट ठेगाना 10.64.19.255',
      },
      {
        key: 'C',
        text: '4,094 usable hosts; broadcast address 10.64.31.255',
        textNe: '४,०९४ प्रयोगयोग्य होस्ट; ब्रोडकास्ट ठेगाना 10.64.31.255',
      },
      {
        key: 'D',
        text: '2,048 usable hosts; broadcast address 10.64.24.255',
        textNe: '२,०४८ प्रयोगयोग्य होस्ट; ब्रोडकास्ट ठेगाना 10.64.24.255',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'A /21 prefix leaves 32 - 21 = 11 host bits: 2^11 - 2 = 2,046 usable host addresses. Spanning 2^(24-21) = 8 /24 blocks from 10.64.16.0 gives 10.64.16.0 through 10.64.23.255 as broadcast.',
    explanationNe:
      '/21 प्रिफिक्समा ३२ − २१ = ११ होस्ट बिट हुन्छन्, जसबाट 2^11 − 2 = २,०४६ होस्ट मिल्छन्। तेस्रो अक्टेटमा ८ को ब्लक साइज हुँदा 10.64.16.0 देखि ब्रोडकास्ट 10.64.23.255 सम्म पर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper II — Computer Communications Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-005',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Data Structures & Algorithms',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DSA',
    topic: 'Asymptotic Time Complexity',
    subtopicId: 'NTC-DSA-01',
    subtopic: 'Sorting, Heaps & Shortest Paths',
    question:
      'Which time complexities accurately describe (i) building a binary heap in-place from an unsorted array of n elements, and (ii) Dijkstra’s single-source shortest path on a sparse graph (|E| ≈ |V|) using a binary min-heap?',
    questionNe:
      '(i) n वटा अवयव भएको एरेबाट इन–प्लेस बाइनरी हिप निर्माण गर्ने र (ii) बाइनरी मिन–हिप प्रयोग गरी स्पार्स ग्राफमा Dijkstra को Shortest Path निकाल्ने सही टाइम कम्प्लेक्सिटी कुन हो?',
    options: [
      {
        key: 'A',
        text: 'Build-Heap: O(n); Dijkstra with binary min-heap: O((|V| + |E|) log |V|)',
        textNe: 'हिप निर्माण: O(n); बाइनरी हिप सहित Dijkstra: O((|V| + |E|) log |V|)',
      },
      {
        key: 'B',
        text: 'Build-Heap: O(n log n); Dijkstra: O(|V|³)',
        textNe: 'हिप निर्माण: O(n log n); Dijkstra: O(|V|³)',
      },
      {
        key: 'C',
        text: 'Build-Heap: O(log n); Dijkstra: O(|V| · |E|)',
        textNe: 'हिप निर्माण: O(log n); Dijkstra: O(|V| · |E|)',
      },
      {
        key: 'D',
        text: 'Build-Heap: O(n²); Dijkstra: O(|E| log |E|²)',
        textNe: 'हिप निर्माण: O(n²); Dijkstra: O(|E| log |E|²)',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Bottom-up Floyd Build-Heap runs in linear O(n) time because most nodes sit near leaves with short sift-down heights. Dijkstra with a binary min-heap performs |V| Extract-Min and |E| Decrease-Key operations, yielding O((|V|+|E|) log |V|).',
    explanationNe:
      'बटम–अप Floyd विधिबाट बाइनरी हिप निर्माण गर्दा तल्लो तहका अधिकांश नोडमा थोरै सफ्ट–डाउन अपरेसन हुने भएकाले O(n) लाग्दछ, र बाइनरी मिन–हिपमा Dijkstra को कम्प्लेक्सिटी O((|V|+|E|) log |V|) हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper II — Program Design & Data Structures',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-006',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Operating Systems',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-OS',
    topic: 'Virtual Memory & Page Replacement',
    subtopicId: 'NTC-OS-01',
    subtopic: 'Belady’s Anomaly & Stack Algorithms',
    question:
      'In operating systems virtual memory management, which page replacement algorithms are free from Belady’s Anomaly (guaranteeing that adding physical page frames never increases page faults)? (Multi-select)',
    questionNe:
      'अपरेटिङ सिस्टमको भर्चुअल मेमोरी व्यवस्थापनमा कुन–कुन पेज रिप्लेसमेन्ट अल्गोरिदमहरू Belady’s Anomaly बाट मुक्त हुन्छन् (फ्रेम बढाउँदा पेज फल्ट कहिल्यै बढ्दैन)? (एकभन्दा बढी छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'Least Recently Used (LRU)',
        textNe: 'Least Recently Used (LRU)',
      },
      {
        key: 'B',
        text: 'Optimal Page Replacement (OPT / Belady’s MIN)',
        textNe: 'Optimal Page Replacement (OPT)',
      },
      {
        key: 'C',
        text: 'First-In First-Out (FIFO)',
        textNe: 'First-In First-Out (FIFO)',
      },
      {
        key: 'D',
        text: 'Random Replacement',
        textNe: 'Random Replacement',
      },
    ],
    correct_options: ['A', 'B'],
    is_multi_select: true,
    explanation:
      'Both LRU and Optimal (OPT) are stack algorithms: the set of pages kept in memory for n frames is always a subset of the pages kept for n+1 frames (inclusion property), making Belady’s Anomaly impossible. FIFO notoriously suffers from Belady’s Anomaly.',
    explanationNe:
      'LRU र Optimal दुवै स्ट्याक अल्गोरिदम भएकाले Inclusion Property पालना गर्दछन् र Belady’s Anomaly बाट मुक्त हुन्छन्, जबकि FIFO मा फ्रेम बढाउँदा पनि पेज फल्ट बढ्न सक्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper II — Operating Systems Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-007',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Databases',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DBMS',
    topic: 'Relational Normalization',
    subtopicId: 'NTC-DBMS-01',
    subtopic: '3NF vs BCNF Properties',
    question:
      'For a relational database schema decomposition, which statement accurately compares Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF)?',
    questionNe:
      'रिलेसनल डेटाबेस स्किमा डिकम्पोजिसनका सन्दर्भमा 3NF र BCNF बीचको तुलनाबारे कुन कथन सही छ?',
    options: [
      {
        key: 'A',
        text: 'Every relation in BCNF is in 3NF; lossless-join AND dependency-preserving decomposition is always achievable into 3NF, whereas BCNF guarantees lossless-join but may sacrifice dependency preservation',
        textNe: 'BCNF मा रहेको हरेक रिलेसन 3NF मा हुन्छ; 3NF मा lossless-join र dependency preservation दुवै सधैँ सम्भव हुन्छ तर BCNF मा dependency preservation नहुन पनि सक्छ',
      },
      {
        key: 'B',
        text: '3NF eliminates all partial dependencies only, while BCNF removes multivalued dependencies (MVDs)',
        textNe: '3NF ले आंशिक निर्भरता मात्र हटाउँछ भने BCNF ले multivalued dependency हटाउँछ',
      },
      {
        key: 'C',
        text: 'BCNF is strictly weaker than 3NF and permits non-trivial functional dependencies from non-superkeys',
        textNe: 'BCNF 3NF भन्दा कमजोर रूप हो',
      },
      {
        key: 'D',
        text: 'Neither 3NF nor BCNF can eliminate transitive functional dependencies',
        textNe: '3NF वा BCNF दुवैले ट्रान्जिटिभ निर्भरता हटाउन सक्दैनन्',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'BCNF requires that for every non-trivial FD X → Y, X must be a superkey. Any relation in BCNF satisfies 3NF. While any schema can always be decomposed into 3NF with both lossless-join and dependency preservation, BCNF decomposition cannot always preserve every FD.',
    explanationNe:
      'BCNF मा हरेक non-trivial FD X → Y का लागि X सुपरकी हुनैपर्दछ। हरेक स्किमालाई lossless-join र dependency-preserving गरी 3NF मा लैजान सकिन्छ तर BCNF मा सधैँ dependency preservation सम्भव नहुन सक्छ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'NTC Paper II — Databases & File Systems',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-008',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Computer Architecture',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-ARCH',
    topic: 'Cache Performance & Pipelining',
    subtopicId: 'NTC-ARCH-01',
    subtopic: 'Amdahl’s Law & Cache AMAT',
    question:
      'A telecom processor has an L1 cache hit time of 1 ns, hit rate of 95%, and a miss penalty of 40 ns to main memory. What is the Average Memory Access Time (AMAT)?',
    questionNe:
      'एउटा प्रोसेसरको L1 क्यास हिट टाइम १ ns, हिट रेट ९५% र मेन मेमोरी मिस पेनाल्टी ४० ns छ। यसको औसत मेमोरी एक्सेस टाइम (AMAT) कति हुन्छ?',
    options: [
      {
        key: 'A',
        text: '3.0 ns',
        textNe: '३.० ns',
      },
      {
        key: 'B',
        text: '2.05 ns',
        textNe: '२.०५ ns',
      },
      {
        key: 'C',
        text: '4.5 ns',
        textNe: '४.५ ns',
      },
      {
        key: 'D',
        text: '38.0 ns',
        textNe: '३८.० ns',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'AMAT = Hit Time + (Miss Rate × Miss Penalty) = 1 ns + (0.05 × 40 ns) = 1 ns + 2 ns = 3.0 ns.',
    explanationNe:
      'AMAT = Hit Time + (Miss Rate × Miss Penalty) = 1 + (0.05 × 40) = 1 + 2 = 3.0 ns हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Paper II — Computer Architecture Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-009',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Digital Signal Processing',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DSP',
    topic: 'Z-Transform & System Stability',
    subtopicId: 'NTC-DSP-01',
    subtopic: 'Causal LTI Stability & FFT',
    question:
      'For a causal discrete-time Linear Time-Invariant (LTI) system to be Bounded-Input Bounded-Output (BIBO) stable, where must all poles of its rational system function H(z) lie in the z-plane?',
    questionNe:
      'कुनै Causal डिस्क्रीट–टाइम LTI प्रणाली BIBO स्टेबल (स्थिर) हुनका लागि यसको सिस्टम फङ्सन H(z) का सबै पोलहरू (Poles) z-plane को कहाँ रहनुपर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Strictly inside the unit circle (|p_k| < 1)',
        textNe: 'युनिट सर्कलभित्र (|p_k| < 1)',
      },
      {
        key: 'B',
        text: 'In the right half of the z-plane (Re(z) > 0)',
        textNe: 'दायाँ अर्ध–सतहमा (Re(z) > 0)',
      },
      {
        key: 'C',
        text: 'Strictly outside the unit circle (|p_k| > 1)',
        textNe: 'युनिट सर्कलबाहिर (|p_k| > 1)',
      },
      {
        key: 'D',
        text: 'On the imaginary axis only',
        textNe: 'काल्पनिक अक्ष (Imaginary axis) मा मात्र',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'A causal LTI discrete system has a Region of Convergence (ROC) extending outward |z| > |p_max|. For BIBO stability, the ROC must include the unit circle |z| = 1, requiring all poles to satisfy |p_k| < 1.',
    explanationNe:
      'Causal प्रणालीको ROC बाहिरतर्फ |z| > |p_max| हुने र स्थिरताका लागि ROC ले युनिट सर्कल |z| = 1 समेट्नुपर्ने भएकाले सबै पोलहरू युनिट सर्कलभित्र (|p_k| < 1) हुनुपर्दछ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper II — Digital Signal Processing Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-010',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): VLSI & Digital Design',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-VLSI',
    topic: 'CMOS Power & Memory Cells',
    subtopicId: 'NTC-VLSI-01',
    subtopic: 'Static CMOS & Dynamic Switching Power',
    question:
      'In CMOS VLSI design, how does dynamic switching power P_dyn scale with supply voltage V_DD, load capacitance C_L, activity factor α, and clock frequency f?',
    questionNe:
      'CMOS VLSI डिजाइनमा डाइनामिक स्विचिङ पावर (P_dyn) सप्लाई भोल्टेज V_DD, लोड क्यापासिटेन्स C_L, एक्टिभिटी फ्याक्टर α र क्लक फ्रिक्वेन्सी f सँग कुन सूत्रअनुसार सम्बन्धित हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'P_dyn = α · C_L · V_DD² · f (quadratically proportional to V_DD)',
        textNe: 'P_dyn = α · C_L · V_DD² · f (V_DD को वर्गसँग समानुपातिक)',
      },
      {
        key: 'B',
        text: 'P_dyn = C_L · V_DD / f',
        textNe: 'P_dyn = C_L · V_DD / f',
      },
      {
        key: 'C',
        text: 'P_dyn = ½ · V_DD · f²',
        textNe: 'P_dyn = ½ · V_DD · f²',
      },
      {
        key: 'D',
        text: 'P_dyn is independent of supply voltage V_DD in static CMOS',
        textNe: 'स्थिर CMOS मा डाइनामिक पावर V_DD मा निर्भर हुँदैन',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'CMOS dynamic switching power follows P_dyn = α · C_L · V_DD² · f, which explains why Dynamic Voltage and Frequency Scaling (DVFS) sharply cuts SoC energy by lowering V_DD.',
    explanationNe:
      'CMOS को डाइनामिक पावर P_dyn = α · C_L · V_DD² · f हुने भएकाले भोल्टेज (V_DD) घटाउँदा ऊर्जा खपत तीव्र रूपमा कम हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Paper II — Principles of VLSI Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-011',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Cryptography & Security',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-SEC',
    topic: 'Asymmetric & Symmetric Cryptography',
    subtopicId: 'NTC-SEC-01',
    subtopic: 'RSA Key Math & Digital Signatures',
    question:
      'In the RSA cryptosystem with primes p = 5 and q = 11 (so n = 55 and φ(n) = 40), if the public exponent is chosen as e = 7, what is the valid private decryption exponent d such that (e · d) ≡ 1 (mod 40)?',
    questionNe:
      'RSA क्रिप्टोसिस्टममा अभाज्य सङ्ख्याहरू p = 5 र q = 11 (अर्थात् n = 55, φ(n) = 40) तथा पब्लिक एक्सपोनेन्ट e = 7 लिँदा (e · d) ≡ 1 (mod 40) सन्तुष्ट पार्ने प्राइभेट की d को मान कति हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'd = 23 (since 7 × 23 = 161 = 4×40 + 1 ≡ 1 mod 40)',
        textNe: 'd = 23 (किनकि ७ × २३ = १६१ ≡ १ mod ४०)',
      },
      {
        key: 'B',
        text: 'd = 13',
        textNe: 'd = १३',
      },
      {
        key: 'C',
        text: 'd = 33',
        textNe: 'd = ३३',
      },
      {
        key: 'D',
        text: 'd = 17',
        textNe: 'd = १७',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Using modular inverse of 7 modulo φ(55) = (5-1)(11-1) = 40: 7 × 23 = 161 = 4(40) + 1, so d = 23.',
    explanationNe:
      'φ(55) = ४ × १० = ४० का सापेक्ष ७ को मोड्युलर इन्भर्स ७ × २३ = १६१ = ४ × ४० + १ हुने भएकाले d = २३ हुन्छ।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper II — Cryptography & Network Security',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-012',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Artificial Intelligence',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-AI',
    topic: 'Heuristic Search & Optimality',
    subtopicId: 'NTC-AI-01',
    subtopic: 'A* Admissibility & Consistency',
    question:
      'In A* search using f(n) = g(n) + h(n), when is h(n) guaranteed to lead A* (tree-search) to an optimal lowest-cost path to the goal?',
    questionNe:
      'A* सर्च अल्गोरिदम f(n) = g(n) + h(n) मा गोल नोडसम्म न्यूनतम लागतको सर्वोत्तम मार्ग (Optimal path) सुनिश्चित गर्न ह्युरिस्टिक फङ्सन h(n) कस्तो हुनुपर्दछ?',
    options: [
      {
        key: 'A',
        text: 'h(n) must be admissible — i.e., 0 ≤ h(n) ≤ h*(n), never overestimating true remaining cost',
        textNe: 'h(n) Admissible हुनुपर्दछ (० ≤ h(n) ≤ h*(n), वास्तविक लागतभन्दा कहिल्यै बढी अनुमान नगर्ने)',
      },
      {
        key: 'B',
        text: 'h(n) must always overestimate true remaining cost h*(n)',
        textNe: 'h(n) वास्तविक लागतभन्दा सधैँ बढी हुनुपर्दछ',
      },
      {
        key: 'C',
        text: 'h(n) must equal g(n)² at every frontier node',
        textNe: 'प्रत्येक नोडमा h(n) = g(n)² हुनुपर्दछ',
      },
      {
        key: 'D',
        text: 'A* does not depend on heuristic bounds to guarantee optimality',
        textNe: 'A* को सर्वोत्तमता ह्युरिस्टिक सीमामा निर्भर हुँदैन',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'An admissible heuristic never overestimates the true cost to reach the goal (h(n) ≤ h*(n)), guaranteeing A* tree-search optimality (and consistency h(n) ≤ c(n,a,n′) + h(n′) guarantees optimality in graph-search).',
    explanationNe:
      'ह्युरिस्टिक h(n) वास्तविक बाँकी लागत h*(n) भन्दा कहिल्यै बढी नहुने (Admissible) भएमा A* ले न्यूनतम लागतको सर्वोत्तम समाधान सुनिश्चित गर्दछ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Paper II — AI & Expert Systems Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-013',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Distributed Systems',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-DIST',
    topic: 'Clock Synchronization & Consensus',
    subtopicId: 'NTC-DIST-01',
    subtopic: 'Lamport vs Vector Clocks',
    question:
      'In distributed telecom event logging, what key capability do Vector Clocks provide over simple scalar Lamport Logical Clocks?',
    questionNe:
      'वितरित दूरसञ्चार प्रणालीका लगहरू मिलाउँदा सामान्य Lamport Logical Clock को तुलनामा Vector Clock ले कुन अतिरिक्त क्षमता प्रदान गर्दछ?',
    options: [
      {
        key: 'A',
        text: 'Vector clocks detect BOTH causal ordering (e1 → e2 iff V(e1) < V(e2)) AND concurrent independent events, whereas Lamport clocks only preserve one-way implication',
        textNe: 'Vector Clock ले कारण–परिणाम क्रम (e1 → e2) र समवर्ती (Concurrent) घटना दुवै सटिक पहिचान गर्दछ, जबकि Lamport Clock ले एकतर्फी क्रम मात्र देखाउँछ',
      },
      {
        key: 'B',
        text: 'Vector clocks eliminate the need for physical NTP servers and compute SHA hashes',
        textNe: 'Vector Clock ले स्वतः SHA ह्यास गणना गर्दछ',
      },
      {
        key: 'C',
        text: 'Vector clocks require O(1) fixed integer overhead regardless of cluster size',
        textNe: 'नोड सङ्ख्या जति भए पनि Vector Clock मा सधैँ O(1) आकार मात्र लाग्छ',
      },
      {
        key: 'D',
        text: 'Lamport clocks detect concurrency while Vector clocks cannot',
        textNe: 'Lamport Clock ले समवर्ती घटना पत्ता लगाउँछ तर Vector Clock ले सक्दैन',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'Lamport clocks satisfy e1 → e2 ⇒ L(e1) < L(e2), but the converse is false. Vector clocks satisfy e1 → e2 ⇔ V(e1) < V(e2), enabling exact causality vs. concurrency detection at O(N) vector space.',
    explanationNe:
      'Lamport Clock मा L(a) < L(b) भए पनि ती कारण–परिणाम हुन् वा समवर्ती भन्ने ठोकुवा गर्न सकिँदैन, तर Vector Clock ले e1 → e2 ⇔ V(e1) < V(e2) मार्फत दुवै छुट्ट्याउँछ।',
    difficulty: 'Hard',
    marks: 1,
    sourceTitle: 'NTC Paper II — Distributed Systems Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-014',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper II (Technical): Software Engineering',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-SE',
    topic: 'White-Box Testing & Metrics',
    subtopicId: 'NTC-SE-01',
    subtopic: 'McCabe Cyclomatic Complexity',
    question:
      'A telecom CDR mediation module has a control-flow graph with E = 18 edges, N = 13 nodes, and P = 1 connected component. What is its McCabe Cyclomatic Complexity V(G), representing the minimum linearly independent test paths?',
    questionNe:
      'एउटा CDR मेडिएसन मोड्युलको कन्ट्रोल–फ्लो ग्राफमा १८ वटा एज (E = 18), १३ वटा नोड (N = 13) र १ कम्पोनेन्ट (P = 1) भएमा McCabe Cyclomatic Complexity V(G) कति हुन्छ?',
    options: [
      {
        key: 'A',
        text: 'V(G) = 7',
        textNe: 'V(G) = ७',
      },
      {
        key: 'B',
        text: 'V(G) = 5',
        textNe: 'V(G) = ५',
      },
      {
        key: 'C',
        text: 'V(G) = 9',
        textNe: 'V(G) = ९',
      },
      {
        key: 'D',
        text: 'V(G) = 31',
        textNe: 'V(G) = ३१',
      },
    ],
    correct_options: ['A'],
    is_multi_select: false,
    explanation:
      'McCabe Cyclomatic Complexity is V(G) = E − N + 2P = 18 − 13 + 2(1) = 7 independent basis paths.',
    explanationNe:
      'McCabe Cyclomatic Complexity को सूत्र V(G) = E − N + 2P अनुसार १८ − १३ + २(१) = ७ हुन्छ।',
    difficulty: 'Easy',
    marks: 1,
    sourceTitle: 'NTC Paper II — Software Engineering Domain',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
  {
    id: 'NTC-L7-015',
    level: 'Officer Level 7 · Technical',
    service: 'Nepal Telecom (NDCL)',
    group: 'Technical (Computer Engineering)',
    post: 'Computer Engineer (Level 7)',
    paper: 'Paper I & II: Engineering Economics & Web',
    subject: 'Computer Engineering & Telecom',
    topicId: 'NTC-ECON-WEB',
    topic: 'HTTP/3, QUIC & SLA Costing',
    subtopicId: 'NTC-ECON-WEB-01',
    subtopic: 'Modern Transport & Tender Terms',
    question:
      'Which statements accurately apply to modern Internet transport (HTTP/3) and international telecom procurement contracts (Incoterms)? (Multi-select)',
    questionNe:
      'आधुनिक इन्टरनेट प्रोटोकल (HTTP/3) र अन्तर्राष्ट्रिय दूरसञ्चार खरिद ठेक्का (Incoterms) सम्बन्धी कुन–कुन कथन सही छन्? (एकभन्दा बढी छान्नुहोस्)',
    options: [
      {
        key: 'A',
        text: 'HTTP/3 runs over QUIC (UDP-based) with built-in TLS 1.3 encryption and independent stream multiplexing, eliminating TCP head-of-line blocking',
        textNe: 'HTTP/3 ले UDP आधारित QUIC र अन्तर्निहित TLS 1.3 प्रयोग गरी TCP को head-of-line blocking अन्त्य गर्दछ',
      },
      {
        key: 'B',
        text: 'Under CIF (Cost, Insurance & Freight) Incoterms, the supplier pays ocean freight and marine insurance up to the named destination port',
        textNe: 'CIF सर्तमा आपूर्तिकर्ताले गन्तव्य बन्दरगाहसम्मको लागत, समुद्री बीमा र ढुवानी खर्च व्यहोर्दछ',
      },
      {
        key: 'C',
        text: 'FOB (Free On Board) places international freight and marine insurance directly on the seller until warehouse installation in Kathmandu',
        textNe: 'FOB सर्तमा काठमाडौँको गोदामसम्मको सम्पूर्ण बीमा र भाडा आपूर्तिकर्ताले व्यहोर्दछ',
      },
      {
        key: 'D',
        text: 'HTTP/3 strictly requires 3-way TCP handshake plus separate TLS negotiation before transmitting frames',
        textNe: 'HTTP/3 लाई अनिवार्य रूपमा ३–चरण TCP ह्यान्डसेक आवश्यक पर्दछ',
      },
    ],
    correct_options: ['A', 'B'],
    is_multi_select: true,
    explanation:
      'HTTP/3 uses QUIC over UDP with integrated TLS 1.3 (0-RTT/1-RTT) and avoids TCP HoL blocking. Under Incoterms, CIF includes cost, insurance, and freight to destination port, whereas FOB transfers risk and freight cost to the buyer once loaded onboard at the origin port.',
    explanationNe:
      'HTTP/3 ले UDP माथि QUIC/TLS 1.3 प्रयोग गरी TCP HoL ब्लकिङ हटाउँछ र CIF मा आपूर्तिकर्ताले गन्तव्य बन्दरगाहसम्मको ढुवानी र बीमा व्यहोर्दछ (FOB मा प्रस्थान बन्दरगाहपछि क्रेताले व्यहोर्दछ)।',
    difficulty: 'Medium',
    marks: 1,
    sourceTitle: 'NTC Paper I & II — ICT, Economics & Internet Programming',
    sourcePath: COMP_TECH_PHASE2_PDF,
  },
];
