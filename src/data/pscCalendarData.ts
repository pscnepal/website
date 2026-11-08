/**
 * Nepal Public Service Commission (लोक सेवा आयोग)
 * Official Annual Vacancy Calendar & Notice Board Data (आधिकारिक वार्षिक पदपूर्ति कार्यतालिका तथा सूचना)
 * Curated for Section Officer, Nayab Subba, Kharidar, and Technical Services.
 */

export type PscCadreType =
  | 'section-officer'
  | 'nayab-subba'
  | 'kharidar'
  | 'joint-secretary'
  | 'under-secretary'
  | 'technical-health'
  | 'technical-engineering';

export type EventStatus =
  | 'application-open'
  | 'exam-scheduled'
  | 'ad-published'
  | 'upcoming'
  | 'completed';

export interface CalendarEvent {
  id: string;
  cadreId: PscCadreType;
  cadreTitleEn: string;
  cadreTitleNe: string;
  levelRankEn: string;
  levelRankNe: string;
  serviceGroup: string; // e.g. 'General Administration / Foreign / Judicial'
  competitionType: 'open-inclusive' | 'internal' | 'both';
  competitionTypeLabel: string;
  adPublishDateBS: string;
  adPublishDateAD: string;
  applicationDeadlineBS: string;
  stage1ExamDateBS: string;
  stage1ExamDateAD: string;
  stage2ExamDateBS: string;
  stage2ExamDateAD: string;
  status: EventStatus;
  statusLabelNe: string;
  estimatedSeats: number;
  syllabusUrl: string;
  simulationPreset: string;
  eligibilitySnippet: string;
  examCenterNoticeSnippet?: string;
  isHighPriority?: boolean;
}

export type NoticeCategory =
  | 'vacancy-ad'
  | 'exam-center'
  | 'written-result'
  | 'syllabus-revision'
  | 'general-notice';

export interface PscNotice {
  id: string;
  noticeNumber: string;
  titleNe: string;
  titleEn: string;
  category: NoticeCategory;
  categoryLabelNe: string;
  categoryLabelEn: string;
  publishedDateBS: string;
  publishedDateAD: string;
  targetCadres: PscCadreType[];
  summaryNe: string;
  summaryEn: string;
  isImportant?: boolean;
  officialSource: string;
  actionUrl?: string;
}

export const PSC_ANNUAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-so-2081',
    cadreId: 'section-officer',
    cadreTitleEn: 'Section Officer (Sakha Adhikrit)',
    cadreTitleNe: 'शाखा अधिकृत (अप्राविधिक)',
    levelRankEn: 'Gazetted Class III',
    levelRankNe: 'रा.प. तृतीय श्रेणी',
    serviceGroup: 'नेपाल प्रशासन सेवा (सामान्य प्रशासन, लेखा, राजस्व), परराष्ट्र, न्याय',
    competitionType: 'both',
    competitionTypeLabel: 'खुला तथा समावेशी र आन्तरिक',
    adPublishDateBS: '२०८१ मङ्सिर २६ (अन्तिम बुधबार)',
    adPublishDateAD: 'Dec 11, 2024',
    applicationDeadlineBS: '२०८१ पुस १७ (दोब्बर दस्तुर: पुस २४)',
    stage1ExamDateBS: '२०८१ माघ २६ (शनिबार, बिहान ११:०० बजे)',
    stage1ExamDateAD: 'Feb 8, 2025',
    stage2ExamDateBS: '२०८१ चैत २१ देखि २३ गतेसम्म',
    stage2ExamDateAD: 'Apr 3–5, 2025',
    status: 'exam-scheduled',
    statusLabelNe: 'परीक्षा तालिका प्रकाशित',
    estimatedSeats: 560,
    syllabusUrl: '/syllabus/section-officer',
    simulationPreset: 'Section Officer (Paper I)',
    eligibilitySnippet: 'स्नातक तह (Bachelor’s Degree) उत्तीर्ण, २१ वर्ष पूरा भई ३५ वर्ष ननाघेको (महिला तथा अपाङ्गता भएकाको हकमा ४० वर्ष)',
    examCenterNoticeSnippet: 'काठमाडौँ उपत्यका तथा धनकुटा, जलेश्वर, पोखरा, बुटवल, सुर्खेत र दिपायल केन्द्रहरूमा परीक्षा सञ्चालन हुने।',
    isHighPriority: true,
  },
  {
    id: 'cal-nasu-2081',
    cadreId: 'nayab-subba',
    cadreTitleEn: 'Nayab Subba (Na.Su.)',
    cadreTitleNe: 'नायब सुब्बा वा सोसरह (अप्राविधिक)',
    levelRankEn: 'Non-Gazetted Class I',
    levelRankNe: 'रा.प.अनं. प्रथम श्रेणी',
    serviceGroup: 'नेपाल प्रशासन सेवा, लेखा, राजस्व तथा न्याय सेवा',
    competitionType: 'both',
    competitionTypeLabel: 'खुला तथा समावेशी र आन्तरिक',
    adPublishDateBS: '२०८१ पुस २५ (अन्तिम बुधबार)',
    adPublishDateAD: 'Jan 8, 2025',
    applicationDeadlineBS: '२०८१ माघ १६ (दोब्बर दस्तुर: माघ २३)',
    stage1ExamDateBS: '२०८१ फागुन २६ (शनिबार, दिउँसो १:०० बजे)',
    stage1ExamDateAD: 'Mar 10, 2025',
    stage2ExamDateBS: '२०८२ वैशाख १८ देखि २० गतेसम्म',
    stage2ExamDateAD: 'Apr 30 – May 2, 2025',
    status: 'exam-scheduled',
    statusLabelNe: 'लिखित परीक्षा तालिका तय',
    estimatedSeats: 820,
    syllabusUrl: '/syllabus/nayab-subba',
    simulationPreset: 'Nayab Subba (Paper I)',
    eligibilitySnippet: 'प्रविणता प्रमाणपत्र तह वा १०+२ (10+2 / Intermediate) उत्तीर्ण, १८ वर्ष पूरा भई ३५ वर्ष ननाघेको (महिला तथा अपाङ्गको हकमा ४० वर्ष)',
    examCenterNoticeSnippet: 'सबै प्रदेशका लोक सेवा आयोग कार्यालयहरू तथा सम्बन्धित जिल्ला परीक्षा केन्द्रहरू।',
    isHighPriority: true,
  },
  {
    id: 'cal-kharidar-2081',
    cadreId: 'kharidar',
    cadreTitleEn: 'Kharidar (Non-Technical)',
    cadreTitleNe: 'खरिदार वा सोसरह (अप्राविधिक)',
    levelRankEn: 'Non-Gazetted Class II',
    levelRankNe: 'रा.प.अनं. द्वितीय श्रेणी',
    serviceGroup: 'नेपाल प्रशासन सेवा (सामान्य प्रशासन र लेखा) तथा न्याय सेवा',
    competitionType: 'both',
    competitionTypeLabel: 'खुला, समावेशी तथा आन्तरिक',
    adPublishDateBS: '२०८१ चैत २७ (अन्तिम बुधबार)',
    adPublishDateAD: 'Apr 9, 2025',
    applicationDeadlineBS: '२०८२ वैशाख १७ (दोब्बर दस्तुर: वैशाख २४)',
    stage1ExamDateBS: '२०८२ जेठ १७ (शनिबार, बिहान ११:०० बजे)',
    stage1ExamDateAD: 'May 31, 2025',
    stage2ExamDateBS: '२०८२ साउन २३ र २४ गते',
    stage2ExamDateAD: 'Aug 8–9, 2025',
    status: 'upcoming',
    statusLabelNe: 'आगामी विज्ञापन (तयारी चरण)',
    estimatedSeats: 950,
    syllabusUrl: '/syllabus/kharidar',
    simulationPreset: 'Kharidar (Paper I)',
    eligibilitySnippet: 'माध्यमिक शिक्षा परीक्षा (SEE/SLC) कम्तीमा GPA 1.6 सहित उत्तीर्ण, १८ वर्ष पूरा भई ३५ वर्ष ननाघेको (महिला/अपाङ्ग ४० वर्ष)',
    examCenterNoticeSnippet: 'केन्द्रीय कार्यालय र क्षेत्रीय/प्रादेशिक केन्द्रहरू।',
    isHighPriority: true,
  },
  {
    id: 'cal-tech-eng-2081',
    cadreId: 'technical-engineering',
    cadreTitleEn: 'Engineering Services (Civil, Electrical, IT)',
    cadreTitleNe: 'इन्जिनियरिङ सेवा (सिभिल, विद्युत्, कम्प्युटर)',
    levelRankEn: 'Gazetted Class III & Sub-Engineer',
    levelRankNe: 'रा.प. तृतीय तथा रा.प.अनं. प्रथम',
    serviceGroup: 'नेपाल इन्जिनियरिङ सेवा',
    competitionType: 'open-inclusive',
    competitionTypeLabel: 'खुला तथा समावेशी',
    adPublishDateBS: '२०८१ कात्तिक २८ (अन्तिम बुधबार)',
    adPublishDateAD: 'Nov 13, 2024',
    applicationDeadlineBS: '२०८१ मङ्सिर १८',
    stage1ExamDateBS: '२०८१ माघ १२ (शनिबार)',
    stage1ExamDateAD: 'Jan 25, 2025',
    stage2ExamDateBS: '२०८१ फागुन १५ गते',
    stage2ExamDateAD: 'Feb 26, 2025',
    status: 'completed',
    statusLabelNe: 'प्रथम चरण परीक्षा सम्पन्न',
    estimatedSeats: 320,
    syllabusUrl: '/syllabus',
    simulationPreset: 'Section Officer (Paper I)',
    eligibilitySnippet: 'सम्बन्धित विषयमा B.E./B.Tech वा डिप्लोमा उत्तीर्ण र नेपाल इन्जिनियरिङ काउन्सिल (NEC) मा दर्ता भएको।',
    isHighPriority: false,
  },
  {
    id: 'cal-tech-health-2081',
    cadreId: 'technical-health',
    cadreTitleEn: 'Health Services (Medical Officers & Staff Nurses)',
    cadreTitleNe: 'स्वास्थ्य सेवा (सातौँ तथा पाँचौँ तह)',
    levelRankEn: 'Health Service Level 7 & Level 5',
    levelRankNe: 'स्वास्थ्य सेवा ७ औँ र ५ औँ तह',
    serviceGroup: 'नेपाल स्वास्थ्य सेवा (विभिन्न समूह)',
    competitionType: 'open-inclusive',
    competitionTypeLabel: 'खुला तथा समावेशी',
    adPublishDateBS: '२०८१ असोज ३० (अन्तिम बुधबार)',
    adPublishDateAD: 'Oct 16, 2024',
    applicationDeadlineBS: '२०८१ कात्तिक २०',
    stage1ExamDateBS: '२०८१ पुस १४ (शनिबार)',
    stage1ExamDateAD: 'Dec 28, 2024',
    stage2ExamDateBS: '२०८१ माघ २० गते',
    stage2ExamDateAD: 'Feb 2, 2025',
    status: 'completed',
    statusLabelNe: 'लिखित नतिजा प्रकाशन प्रक्रियामा',
    estimatedSeats: 410,
    syllabusUrl: '/syllabus',
    simulationPreset: 'Nayab Subba (Paper I)',
    eligibilitySnippet: 'MBBS/BSc Nursing वा PCL Nursing उत्तीर्ण र सम्बन्धित व्यावसायिक परिषद् (NMC/NNC) दर्ता प्रमाणपत्र।',
    isHighPriority: false,
  },
  {
    id: 'cal-under-sec-2081',
    cadreId: 'under-secretary',
    cadreTitleEn: 'Under Secretary (Upa-Sachiv)',
    cadreTitleNe: 'उपसचिव वा सोसरह (अप्राविधिक/प्राविधिक)',
    levelRankEn: 'Gazetted Class II',
    levelRankNe: 'रा.प. द्वितीय श्रेणी',
    serviceGroup: 'प्रशासन, न्याय, लेखापरीक्षण, परराष्ट्र',
    competitionType: 'both',
    competitionTypeLabel: 'खुला, समावेशी तथा आन्तरिक बढुवा',
    adPublishDateBS: '२०८१ असोज ३०',
    adPublishDateAD: 'Oct 16, 2024',
    applicationDeadlineBS: '२०८१ कात्तिक २०',
    stage1ExamDateBS: '२०८१ पुस २२ देखि २७ गतेसम्म',
    stage1ExamDateAD: 'Jan 5–10, 2025',
    stage2ExamDateBS: '२०८१ फागुन १८ देखि',
    stage2ExamDateAD: 'Mar 2, 2025',
    status: 'completed',
    statusLabelNe: 'लिखित परीक्षा सम्पन्न',
    estimatedSeats: 180,
    syllabusUrl: '/syllabus',
    simulationPreset: 'Section Officer (Paper I)',
    eligibilitySnippet: 'स्नातकोत्तर (Master’s Degree) उत्तीर्ण र अधिकृत स्तरमा कम्तीमा ५ वर्षको सेवा अनुभव।',
    isHighPriority: false,
  },
];

export const PSC_OFFICIAL_NOTICES: PscNotice[] = [
  {
    id: 'not-2081-104',
    noticeNumber: 'सूचना नं. २८२/०८१-८२',
    titleNe: 'रा.प. तृतीय श्रेणी (अप्राविधिक) शाखा अधिकृत पदको प्रथम चरण वस्तुगत परीक्षा भवन कायम गरिएको सूचना',
    titleEn: 'Exam Center Allocation Notice for Section Officer (Gazetted III) Stage I Screening Examination',
    category: 'exam-center',
    categoryLabelNe: 'परीक्षा केन्द्र',
    categoryLabelEn: 'Exam Center',
    publishedDateBS: '२०८१ माघ १५',
    publishedDateAD: 'Jan 28, 2025',
    targetCadres: ['section-officer'],
    summaryNe:
      'आयोगको विज्ञापन नं. १६६९९–१६७०५/०८१-८२ अनुसार शाखा अधिकृत पदको मिति २०८१/१०/२६ गते बिहान ११:०० बजे सञ्चालन हुने प्रथम चरणको परीक्षाका लागि काठमाडौँ उपत्यकाभित्रका ४२ वटा परीक्षा केन्द्रहरू तोकिएको छ। परीक्षार्थीहरूले अनिवार्य रूपमा कालो मसी भएको बलपेन र सक्कल नागरिकता वा सरकारी परिचयपत्र साथमा ल्याउनुपर्नेछ।',
    summaryEn:
      'PSC designated 42 exam centers across Kathmandu Valley for the Section Officer Stage I objective examination scheduled for Magh 26, 2081. Candidates must carry admission cards and original citizenship/government IDs with black-ink ballpoint pens.',
    isImportant: true,
    officialSource: 'लोक सेवा आयोग, केन्द्रीय कार्यालय, कमलपोखरी, काठमाडौँ',
    actionUrl: '/simulate',
  },
  {
    id: 'not-2081-103',
    noticeNumber: 'सूचना नं. २६५/०८१-८२',
    titleNe: 'नायब सुब्बा वा सोसरह (अप्राविधिक) पदको खुला तथा समावेशी प्रतियोगितात्मक लिखित परीक्षाको विज्ञापन',
    titleEn: 'Official Vacancy Advertisement for Nayab Subba (Non-Gazetted I) Across All 7 Provinces',
    category: 'vacancy-ad',
    categoryLabelNe: 'नयाँ विज्ञापन',
    categoryLabelEn: 'Vacancy Ad',
    publishedDateBS: '२०८१ पुस २५',
    publishedDateAD: 'Jan 8, 2025',
    targetCadres: ['nayab-subba'],
    summaryNe:
      'प्रशासन, न्याय तथा लेखा समूहका लागि कुल ८२० पदमा खुला तथा समावेशी विज्ञापन प्रकाशित गरिएको छ। आयोगको अनलाइन दरखास्त प्रणाली (psconline1.psc.gov.np) मार्फत मिति २०८१ माघ १६ सम्म एकल दस्तुर र माघ २३ सम्म दोब्बर दस्तुर तिरी आवेदन दिन सकिनेछ।',
    summaryEn:
      'Official vacancy announcement for 820 Nayab Subba positions across administration, judicial, and audit groups. Applications submitted via psconline1.psc.gov.np.',
    isImportant: true,
    officialSource: 'लोक सेवा आयोग पदपूर्ति शाखा',
    actionUrl: '/syllabus/nayab-subba',
  },
  {
    id: 'not-2081-102',
    noticeNumber: 'सूचना नं. २३१/०८१-८२',
    titleNe: 'वस्तुगत बहुवैकल्पिक (MCQ) उत्तरपुस्तिकामा ओएमआर (OMR) मार्किङ निर्देशिका तथा नियमहरू',
    titleEn: 'Official Guidelines & OMR Bubble Sheet Instructions for Objective Multiple Choice Tests',
    category: 'general-notice',
    categoryLabelNe: 'परीक्षा निर्देशिका',
    categoryLabelEn: 'Guidelines',
    publishedDateBS: '२०८१ पुस १०',
    publishedDateAD: 'Dec 25, 2024',
    targetCadres: ['section-officer', 'nayab-subba', 'kharidar'],
    summaryNe:
      'आयोगको परीक्षा हलमा OMR सिटमा उत्तर केरमेट गरेमा वा सानो (a, b, c, d) लेखेमा वा दुईवटा घेरा लगाएमा सो प्रश्न रद्द हुनेछ। प्रत्येक गलत उत्तर बापत २० प्रतिशत (०.२ गुणा) अङ्क कट्टा गरिनेछ। क्यालकुलेटर वा मोबाइल फोन परीक्षा हलभित्र पूर्ण निषेध छ।',
    summaryEn:
      'Official guidelines for OMR bubble sheet tests: strict -20% negative marking per wrong answer, zero tolerance for multi-marking or stray marks, and total ban on electronic gadgets in exam centers.',
    isImportant: true,
    officialSource: 'लोक सेवा आयोग परीक्षा सञ्चालन शाखा',
    actionUrl: '/simulate',
  },
  {
    id: 'not-2081-101',
    noticeNumber: 'सूचना नं. १९४/०८१-८२',
    titleNe: 'रा.प. द्वितीय श्रेणी उपसचिव पदको प्रथम पत्र लिखित परीक्षाको नतिजा प्रकाशन',
    titleEn: 'Written Examination Result for Gazetted Class II Under Secretary Open Competition',
    category: 'written-result',
    categoryLabelNe: 'लिखित नतिजा',
    categoryLabelEn: 'Written Result',
    publishedDateBS: '२०८१ माघ ०८',
    publishedDateAD: 'Jan 21, 2025',
    targetCadres: ['under-secretary'],
    summaryNe:
      'आयोगद्वारा सञ्चालित नेपाल प्रशासन सेवा, सामान्य प्रशासन समूहको उपसचिव पदको प्रथम पत्र लिखित परीक्षामा सहभागी उम्मेदवारहरूमध्ये रोल नम्बर अनुसार छनोट भएका परीक्षार्थीहरूको नतिजा आयोगको वेबसाइटमा प्रकाशन गरिएको छ।',
    summaryEn:
      'PSC published the written examination result of Under Secretary (General Administration) candidates qualified for Stage II interview and presentation.',
    isImportant: false,
    officialSource: 'लोक सेवा आयोग नतिजा प्रकाशन शाखा',
  },
  {
    id: 'not-2081-100',
    noticeNumber: 'सूचना नं. १५२/०८१-८२',
    titleNe: 'खरिदार (अप्राविधिक) पदको परिमार्जित पाठ्यक्रम तथा अंकभार संरचना सम्बन्धी सूचना',
    titleEn: 'Clarification on Kharidar Non-Technical Stage I and II Marks Distribution and Syllabus Checklist',
    category: 'syllabus-revision',
    categoryLabelNe: 'पाठ्यक्रम सूचना',
    categoryLabelEn: 'Syllabus Notice',
    publishedDateBS: '२०८१ मङ्सिर ०५',
    publishedDateAD: 'Nov 20, 2024',
    targetCadres: ['kharidar'],
    summaryNe:
      'खरिदार पदको प्रथम पत्र सामान्य ज्ञान तथा आधारभूत बौद्धिक परीक्षण (१०० पूर्णाङ्क, ५० प्रश्न, ४५ मिनेट) र द्वितीय तथा तृतीय पत्रका विषयगत एकाइहरूको विस्तृत विश्लेषण आयोगको पाठ्यक्रम महाशाखाबाट अद्यावधिक गरिएको छ।',
    summaryEn:
      'Curriculum Division confirmed the 100-mark Stage I GK & Basic IQ structure (50 MCQs, 45 minutes, 40 pass mark) and Paper II/III descriptive distribution.',
    isImportant: false,
    officialSource: 'लोक सेवा आयोग पाठ्यक्रम तथा तालिम महाशाखा',
    actionUrl: '/syllabus/kharidar',
  },
];
