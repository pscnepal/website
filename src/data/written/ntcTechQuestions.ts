import type { WrittenQuestion } from './types';

const COMP_TECH_PHASE2_PDF =
  'https://psc.gov.np/site_uploads/course/20231110070338654dd5cad73731.pdf';

const ETA_2063_PDF =
  'https://giwmscdnone.gov.np/media/pdf_upload/15.%20%E0%A4%B5%E0%A4%BF%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A5%81%E0%A4%A4%E0%A5%80%E0%A4%AF%20(%E0%A4%87%E0%A4%B2%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%8B%E0%A4%A8%E0%A4%BF%E0%A4%95)%20%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%8B%E0%A4%AC%E0%A4%BE%E0%A4%B0%20%E0%A4%90%E0%A4%A8%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AC%E0%A5%A9_jkxllj0.pdf';

export const NTC_TECH_QUESTIONS: WrittenQuestion[] = [
  {
    id: 'PSC-WR-501',
    paper: 'NTC Paper II: Computer Engineering',
    subject: 'Computer Communications & Network Security',
    postTarget: 'NTC Computer Engineer (Level 7)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle:
      'Nepal IT Officer & Telecom Systems Reference Syllabus (Paper II)',
    sourcePath: COMP_TECH_PHASE2_PDF,
    en: {
      title: 'Carrier IP Routing (OSPF/BGP), MPLS Backbone & Zero-Trust Defense',
      question:
        'Differentiate between OSPF and BGP in telecom carrier networks and explain how MPLS traffic engineering combined with PKI/TLS 1.3 and Zero-Trust architecture safeguards Nepal Telecom’s core billing and subscriber data.',
      marksAllocation: '4 + 6 = 10 Marks',
      introduction:
        'Carrier-grade telecommunication backbones require deterministic intra-domain convergence alongside policy-driven inter-domain reachability. Combining IGP/EGP routing discipline with MPLS label switching and defense-in-depth cryptography is fundamental to high-availability OSS/BSS operations.',
      sections: [
        {
          heading: '1. OSPF (IGP) vs. BGP (EGP) in Telecom Backbones',
          points: [
            'Scope & Metric: OSPF uses Dijkstra SPF shortest-path trees based on link bandwidth cost within an Autonomous System (AS), whereas BGP uses TCP-based path-vector attributes (AS_PATH, LOCAL_PREF, MED) across autonomous domains.',
            'Convergence & Scalability: OSPF areas (Backbone Area 0) provide sub-second Fast Reroute (BFD/LFA) inside metro fiber rings; BGP handles global internet peering tables (>900k prefixes) and policy isolation via route reflectors.',
          ],
        },
        {
          heading: '2. MPLS Traffic Engineering & Cryptographic Hardening',
          points: [
            'MPLS Label Switching: Separates L3VPN customer/OSS traffic using VRFs and fixed-length 20-bit labels, supporting RSVP-TE / Segment Routing (SR-MPLS) with <50 ms ring protection.',
            'Zero-Trust & PKI/TLS 1.3: Enforces mutual TLS (mTLS) between billing microservices, AES-256-GCM payload encryption, X.509 certificate pinning, DDoS BGP Flowspec scrubbing, and SIEM telemetry.',
          ],
        },
      ],
      conclusion:
        'Resilient OSPF/BGP/MPLS transport coupled with cryptographic Zero-Trust segmentation ensures carrier SLA compliance (99.999%) and protects critical national telecom infrastructure.',
    },
    ne: {
      title: 'दूरसञ्चार कोर नेटवर्क राउटिङ (OSPF/BGP), MPLS र जिरो–ट्रस्ट सुरक्षा',
      question:
        'दूरसञ्चार क्यारियर नेटवर्कमा OSPF र BGP बीचको भिन्नता स्पष्ट पार्दै MPLS ट्राफिक इन्जिनियरिङ तथा PKI/TLS 1.3 र Zero-Trust सुरक्षाले नेपाल टेलिकमको बिलिङ तथा ग्राहक डेटा कसरी सुरक्षित गर्दछ, विश्लेषण गर्नुहोस् ।',
      marksAllocation: '४ + ६ = १० अङ्क',
      introduction:
        'नेपाल टेलिकमजस्तो राष्ट्रिय दूरसञ्चार सेवा प्रदायकको कोर नेटवर्कमा उच्च उपलब्धता (99.999% SLA) र डेटा सुरक्षा सुनिश्चित गर्न आन्तरिक तथा बाह्य राउटिङ प्रोटोकलसँगै क्रिप्टोग्राफिक सुरक्षा तह अनिवार्य हुन्छ ।',
      sections: [
        {
          heading: '१. OSPF (IGP) र BGP (EGP) बीचको तुलनात्मक विश्लेषण',
          points: [
            'कार्यक्षेत्र र मेट्रिक: OSPF ले एकै Autonomous System (AS) भित्र ब्यान्डविथ लागतमा आधारित Dijkstra SPF अल्गोरिदम प्रयोग गर्दछ भने BGP ले विभिन्न AS बीच TCP पोर्ट १७९ मार्फत AS_PATH र नीतिगत एट्रिब्युटका आधारमा राउटिङ गर्दछ ।',
            'कन्भर्जेन्स र स्केलेबिलिटी: OSPF Area 0 र BFD ले मेट्रो फाइबर रिङमा ५० मिलिसेकेन्डभित्र वैकल्पिक मार्ग खोज्दछ भने BGP ले इन्टरनेट पियरिङ र L3VPN सेवाहरू विस्तार गर्दछ ।',
          ],
        },
        {
          heading: '२. MPLS लेबल स्विचिङ र नेटवर्क सुरक्षा संयन्त्र',
          points: [
            'MPLS र VRF विभाजन: ग्राहक र आन्तरिक OSS/BSS ट्राफिकलाई VRF मार्फत पृथक राखी लेबल स्विचिङद्वारा द्रुत र गुणस्तरीय सेवा (QoS) प्रदान गरिन्छ ।',
            'Zero-Trust तथा क्रिप्टोग्राफी: बिलिङ एपीआईबीच Mutual TLS 1.3, AES-256 इन्क्रिप्सन, X.509 PKI र DDoS/SIEM निगरानी लागू गरी साइबर जोखिम न्यूनीकरण गरिन्छ ।',
          ],
        },
      ],
      conclusion:
        'सक्षम OSPF/BGP/MPLS टोपोलोजी र बहु–स्तरीय क्रिप्टोग्राफिक सुरक्षाको एकीकृत प्रयोगबाट मात्र विश्वसनीय तथा सुरक्षित दूरसञ्चार सेवा प्रवाह सम्भव हुन्छ ।',
    },
    rubric: [
      {
        en: 'Accurately contrasted OSPF (Link-state/Dijkstra/IGP) with BGP (Path-vector/AS policy/EGP).',
        ne: 'OSPF र BGP का प्रोटोकल, मेट्रिक र कन्भर्जेन्स भिन्नता स्पष्ट पारिएको ।',
      },
      {
        en: 'Explained MPLS VRF/Traffic Engineering separation for carrier services.',
        ne: 'MPLS लेबल स्विचिङ र VRF द्वारा ट्राफिक पृथकीकरण व्याख्या गरिएको ।',
      },
      {
        en: 'Integrated TLS 1.3/PKI/Zero-Trust safeguards relevant to telecom OSS/BSS.',
        ne: 'PKI, TLS र Zero-Trust सुरक्षा उपायहरू बिलिङ/कोर प्रणालीसँग जोडिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-502',
    paper: 'NTC Paper II: Computer Engineering',
    subject: 'Databases, OS & Distributed Systems',
    postTarget: 'NTC Computer Engineer (Level 7)',
    marks: 10,
    recommendedMinutes: 18,
    questionType: 'Long Analytical',
    sourceTitle:
      'Nepal IT Officer & Telecom Systems Reference Syllabus (Paper II)',
    sourcePath: COMP_TECH_PHASE2_PDF,
    en: {
      title: 'ACID Transactions, Strict 2PL & Distributed Telecom Billing Design',
      question:
        'Explain ACID properties, Strict Two-Phase Locking (2PL), and deadlock handling in enterprise RDBMS, and evaluate how distributed telecom databases balance CAP theorem trade-offs for real-time prepaid charging.',
      marksAllocation: '5 + 5 = 10 Marks',
      introduction:
        'High-concurrency Online Charging Systems (OCS) and CDR mediation pipelines execute thousands of concurrent balance updates per second. Ensuring both strict serializability and fault-tolerant horizontal scale requires rigorous transaction management.',
      sections: [
        {
          heading: '1. ACID Guarantees, Strict 2PL & Deadlock Resolution',
          points: [
            'ACID & WAL: Write-Ahead Logging (ARIES redo/undo) preserves Atomicity and Durability across power failures, while constraints preserve Consistency and concurrency control enforces Isolation.',
            'Strict 2PL: Exclusive (X) locks are held until transaction COMMIT/ABORT, eliminating cascading aborts and dirty reads; deadlocks are handled via Wait-For Graph cycle detection or timeout-based victim rollback (Wait-Die / Wound-Wait).',
          ],
        },
        {
          heading: '2. Distributed Partitioning & CAP Theorem Trade-offs',
          points: [
            'Sharding & Replication: Horizontal partitioning by subscriber MSISDN prefix isolates regional write hotspots while synchronous Raft/Paxos replication preserves linearizable balance state (CP).',
            'AP vs. CP Hybrid: Core wallet deduction requires CP (Consistency over Availability during partition) to prevent double-spend, whereas CDR analytics/logs adopt AP eventual consistency for high write throughput.',
          ],
        },
      ],
      conclusion:
        'Partition-aware CP balance stores backed by Strict 2PL/MVCC and asynchronous AP event streaming provide both financial accuracy and telecom-scale responsiveness.',
    },
    ne: {
      title: 'ACID ट्रान्जेक्सन, Strict 2PL र वितरित दूरसञ्चार डेटाबेस डिजाइन',
      question:
        'उद्यम RDBMS मा ACID गुण, Strict Two-Phase Locking (2PL) र डेडलक व्यवस्थापन व्याख्या गर्दै वास्तविक–समय प्रिपेड बिलिङ प्रणालीमा वितरित डेटाबेसले CAP प्रमेयको सन्तुलन कसरी मिलाउँछ, मूल्याङ्कन गर्नुहोस् ।',
      marksAllocation: '५ + ५ = १० अङ्क',
      introduction:
        'नेपाल टेलिकमको प्रिपेड चार्जिङ र कल डिटेल रेकर्ड (CDR) प्रणालीमा प्रतिसेकेन्ड हजारौँ समवर्ती ट्रान्जेक्सन हुने हुँदा डेटा शुद्धता र स्केलेबिलिटी दुवै अपरिहार्य हुन्छन् ।',
      sections: [
        {
          heading: '१. ACID गुण, Strict 2PL र डेडलक निराकरण',
          points: [
            'ACID र Write-Ahead Logging: प्रणाली क्र्यास हुँदा समेत Atomicity र Durability जोगाउन ARIES लगिङ र चेकपोइन्ट प्रयोग गरिन्छ ।',
            'Strict 2PL र डेडलक: Exclusive लक ट्रान्जेक्सन COMMIT नहुँदासम्म नछोड्नाले Cascading Rollback रोकिन्छ; Wait-For Graph र Wait-Die/Wound-Wait बाट डेडलक समाधान गरिन्छ ।',
          ],
        },
        {
          heading: '२. डेटा सार्डिङ र CAP प्रमेयको सन्तुलन',
          points: [
            'ग्राहक MSISDN अनुसार क्षैतिज विभाजन (Sharding) गरी Raft/Paxos मार्फत डेटा रेप्लिकेसन गरिन्छ ।',
            'वित्तीय ब्यालेन्स कटौतीमा CP (Consistency) र CDR लगर विश्लेषणमा AP (Eventual Consistency) रणनीति अपनाइन्छ ।',
          ],
        },
      ],
      conclusion:
        'वित्तीय ब्यालेन्सका लागि बलियो कन्सिस्टेन्सी (CP) र विश्लेषणात्मक लगका लागि उच्च उपलब्धता (AP) को मिश्रित डिजाइन नै आधुनिक टेलिकम डेटाबेसको आधार हो ।',
    },
    rubric: [
      {
        en: 'Explained all 4 ACID properties and Strict 2PL lock-release behavior clearly.',
        ne: 'ACID का चारै गुण र Strict 2PL को लक नियम स्पष्ट पारिएको ।',
      },
      {
        en: 'Addressed deadlock detection/prevention schemes (Wait-For Graph / timestamps).',
        ne: 'डेडलक पहिचान तथा रोकथाम विधिहरू (Wait-For Graph / टाइमस्ट्याम्प) समेटिएको ।',
      },
      {
        en: 'Applied CAP theorem (CP vs AP) appropriately to telecom prepaid vs CDR workloads.',
        ne: 'टेलिकम प्रिपेड ब्यालेन्स र CDR प्रणालीमा CAP प्रमेयको व्यावहारिक प्रयोग गरिएको ।',
      },
    ],
  },
  {
    id: 'PSC-WR-503',
    paper: 'NTC Paper II: Computer Engineering',
    subject: 'Telecom Law, Procurement & Engineering Economics',
    postTarget: 'NTC Computer Engineer (Level 7)',
    marks: 5,
    recommendedMinutes: 9,
    questionType: 'Short Analytical',
    sourceTitle: 'Electronic Transactions Act, 2063 (Nepal Law Commission PDF)',
    sourcePath: ETA_2063_PDF,
    en: {
      title: 'Electronic Transactions Act 2063 & Telecom Procurement Governance',
      question:
        'Highlight the core digital signature and cyber-compliance obligations of a licensed telecom operator under the Electronic Transactions Act 2063 and Public Procurement Act 2063 during core IT infrastructure acquisition.',
      marksAllocation: '2.5 + 2.5 = 5 Marks',
      introduction:
        'As a public-listed telecom enterprise regulated by the Nepal Telecommunications Act 2053, NTC must align digital service delivery with statutory PKI rules and transparent procurement standards.',
      sections: [
        {
          heading: '1. Compliance Under Electronic Transactions Act 2063',
          points: [
            'Recognizes legally binding electronic records and asymmetric-key digital signatures verified by licensed Certifying Authorities under the Office of the Controller of Certification (OCC).',
            'Mandates protection against unauthorized system access, data alteration, and denial-of-service offenses (Sections 44–58) prosecuted before the IT Tribunal.',
          ],
        },
        {
          heading: '2. IT/Telecom Acquisition Under Public Procurement Act 2063',
          points: [
            'Requires neutral technical specifications (without vendor lock-in), Quality and Cost-Based Selection (QCBS) or open ICB/NCB e-GP bidding, and clear SLA/warranty penalty clauses.',
            'Enforces bid security, performance bank guarantees, and life-cycle TCO evaluation (NPV/maintenance costs) before awarding hardware/software contracts.',
          ],
        },
      ],
      conclusion:
        'Combining statutory PKI/cybersecurity diligence with vendor-neutral, TCO-driven procurement safeguards public investment and service continuity.',
    },
    ne: {
      title: 'विद्युतीय कारोबार ऐन २०६३ र दूरसञ्चार आईटी खरिद सुशासन',
      question:
        'कोर आईटी पूर्वाधार खरिद तथा डिजिटल सेवा सञ्चालनका क्रममा विद्युतीय कारोबार ऐन, २०६३ र सार्वजनिक खरिद ऐन, २०६३ अन्तर्गत इजाजतप्राप्त दूरसञ्चार सेवाप्रदायकको प्रमुख कानुनी दायित्व उल्लेख गर्नुहोस् ।',
      marksAllocation: '२.५ + २.५ = ५ अङ्क',
      introduction:
        'नेपाल टेलिकमजस्तो सार्वजनिक स्वामित्वको दूरसञ्चार संस्थाले आईटी पूर्वाधार खरिद तथा डिजिटल प्रमाणीकरणमा प्रचलित साइबर र खरिद कानुनको पूर्ण पालना गर्नुपर्दछ ।',
      sections: [
        {
          heading: '१. विद्युतीय कारोबार ऐन, २०६३ बमोजिमका दायित्व',
          points: [
            'प्रमाणीकरण नियन्त्रकको कार्यालय (OCC) मातहत इजाजतप्राप्त निकायबाट जारी डिजिटल हस्ताक्षर र विद्युतीय अभिलेखको कानुनी मान्यता सुनिश्चित गर्ने ।',
            'दफा ४४–५८ अन्तर्गत अनधिकृत पहुँच, डेटा हेरफेर र साइबर अपराध रोकथामका लागि लग तथा सुरक्षा अडिट कायम राख्ने ।',
          ],
        },
        {
          heading: '२. सार्वजनिक खरिद ऐन, २०६३ अनुसार खरिद प्रक्रिया',
          points: [
            'कुनै विशेष ब्रान्डमा सीमित नहुने तटस्थ प्राविधिक स्पेसिफिकेसन, e-GP बोलपत्र, QCBS मूल्याङ्कन र स्पष्ट SLA/वारेन्टी सर्त समावेश गर्ने ।',
            'बोलपत्र जमानत, कार्यसम्पादन जमानत र जीवनचक्र लागत (TCO/NPV) विश्लेषणका आधारमा पारदर्शी ठेक्का सम्झौता गर्ने ।',
          ],
        },
      ],
      conclusion:
        'विद्युतीय सुरक्षा र पारदर्शी खरिद मापदण्डको समन्वयले दूरसञ्चार लगानीको प्रतिफल र संस्थागत विश्वसनीयता सुदृढ बनाउँछ ।',
    },
    rubric: [
      {
        en: 'Cited ETA 2063 digital signature/OCC validation and Sections 44–58 cyber compliance.',
        ne: 'विद्युतीय कारोबार ऐन २०६३ को डिजिटल हस्ताक्षर (OCC) र साइबर कसुर प्रावधान उल्लेख गरिएको ।',
      },
      {
        en: 'Identified PPA 2063 neutral specs, e-GP/QCBS evaluation, SLA, and TCO safeguards.',
        ne: 'सार्वजनिक खरिद ऐन २०६३ को तटस्थ स्पेसिफिकेसन, e-GP, SLA र जीवनचक्र लागत समेटिएको ।',
      },
    ],
  },
];
