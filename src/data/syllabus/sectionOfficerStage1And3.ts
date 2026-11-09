import type { PscExamPhase } from './types.ts';

export const SECTION_OFFICER_PHASE_1: PscExamPhase = {
  id: 'so-phase-1',
  phaseNumber: 1,
  title: 'Stage I · Preliminary Examination (प्रारम्भिक परीक्षा)',
  nepaliTitle: 'प्रथम चरण · प्रारम्भिक छनोट परीक्षा (वस्तुगत OMR)',
  summary:
    'Objective multiple-choice OMR screening test (100 Qs × 1 Mark = 100 Marks · 1 Hour 30 Minutes). Candidates must score at least 45 marks (45%) after 20% negative deduction (-0.20 mark per wrong answer) to qualify for Stage II. Stage I marks are not added to Main Examination merit.',
  officialPdfPath:
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/202512091112156938040f1c8f0.pdf',
  papers: [
    {
      id: 'so-paper-1',
      code: 'Paper I',
      title: 'Administrative Aptitude Test (AAT)',
      nepaliTitle: 'प्रशासनिक अभिरुचि परीक्षण',
      examFormat: 'Objective MCQ (OMR)',
      fullMarks: 100,
      passMarks: 45,
      durationLabel: '1 Hour 30 Minutes',
      questionBreakdown:
        '100 MCQs × 1 Mark (Part A: 50 General Awareness [30 Level I + 20 Level II] · Part B: 30 Aptitude Test · Part C: 20 English Language Competence)',
      scoringRule:
        'Pass Marks: 45 (45%) · -0.20M (20%) per wrong answer · Calculators prohibited · 0% carried to Stage II',
      countsTowardFinalMerit: false,
      units: [
        {
          id: 'so-p1-u1',
          branchNumber: 1,
          unitCode: 'Part A · 1.1–1.2',
          title:
            'General Awareness I: Geography (6M) and History, Culture & Social System (6M)',
          nepaliTitle:
            'भाग (A) सामान्य सचेतना — १.१ भूगोल (६) र १.२ इतिहास, संस्कृति र सामाजिक व्यवस्था (६)',
          marksWeight: 12,
          branchSummary:
            'Covers Units 1.1 and 1.2 of Part A (12 MCQs × 1 Mark = 12 Marks). Across Units 1.1–1.4, Lok Sewa Aayog sets 14 Level I recall items (60%) and 10 Level II multi-statement, matching, chronological, or assertion-reason items (40%).',
          subtopics: [
            '1.1 Geography — physical, social & economic geography of Nepal and the World (6 Qs × 1M)',
            '1.2 History, Culture & Social System — World historical events (1.2.1), Ancient/Medieval/Modern Nepal (1.2.2), People’s Movements (1.2.3) & Religions, ethnicity, languages, literature and art (1.2.4) (6 Qs × 1M)',
          ],
          chapters: [
            {
              id: 'SO-P1-B01-CH01',
              chapterNumber: 1,
              code: 'Unit 1.1',
              chapterName: 'Geography of Nepal and the World',
              nepaliChapterName:
                '१.१ भूगोल — नेपाल तथा विश्वको भौतिक, सामाजिक र आर्थिक भूगोल',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Examines topographical divisions, river systems, climatic zones, demographic settlement patterns, and natural resource distribution across both Nepal and major global regions.',
              topics: [
                {
                  id: 'SO-P1-B01-CH01-T01',
                  topicNumber: 1,
                  code: '1.1 (a)',
                  topic: 'Physical geography of Nepal',
                  nepaliTopic: 'नेपालको भौतिक भूगोल र धरातलीय स्वरूप',
                  brief:
                    'Covers Nepal’s exact geographical coordinates (26°22\'N to 30°27\'N latitude and 80°04\'E to 88°12\'E longitude), total area (147,516 sq. km), three ecological belts (Himal, Pahad, and Terai, plus Inner Terai valleys), 8,000m+ Himalayan peaks, major river basins (Koshi, Gandaki, Karnali), glaciers, glacial lakes, tectonic zones, and monsoon-altitude climatic variations.',
                },
                {
                  id: 'SO-P1-B01-CH01-T02',
                  topicNumber: 2,
                  code: '1.1 (b)',
                  topic: 'Social and economic geography of Nepal',
                  nepaliTopic: 'नेपालको सामाजिक र आर्थिक भूगोल',
                  brief:
                    'Focuses on spatial distribution of population across provinces and ecological belts (Census 2078), administrative divisions (7 provinces, 77 districts, 753 local levels), agro-ecological cropping zones, hydropower potential, mineral deposits, industrial corridors, trade transit points, and highway connectivity.',
                },
                {
                  id: 'SO-P1-B01-CH01-T03',
                  topicNumber: 3,
                  code: '1.1 (c)',
                  topic:
                    'Physical, social, and economic geography of the World',
                  nepaliTopic: 'विश्वको भौतिक, सामाजिक र आर्थिक भूगोल',
                  brief:
                    'Encompasses the seven continents and five oceans, latitude, longitude, GMT time calculation (4 minutes per 1° longitude), International Date Line, major mountain ranges, deserts, straits, rivers, lakes, earthquakes, volcanoes, global wind belts (Trade Winds, Westerlies), climatic regions, and global resource/trade geography.',
                },
              ],
            },
            {
              id: 'SO-P1-B01-CH02',
              chapterNumber: 2,
              code: 'Unit 1.2',
              chapterName: 'History, Culture and Social System',
              nepaliChapterName: '१.२ इतिहास, संस्कृति र सामाजिक व्यवस्था',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Traces pivotal revolutions and global conflicts alongside Nepal’s dynastic evolution, democratic movements, and pluralistic socio-cultural heritage.',
              topics: [
                {
                  id: 'SO-P1-B01-CH02-T01',
                  topicNumber: 1,
                  code: '1.2.1',
                  topic: 'Major historical events of the World',
                  nepaliTopic: 'विश्वका प्रमुख ऐतिहासिक घटनाहरू',
                  brief:
                    'Studies landmark global transformations including the Magna Carta (1215), Renaissance, Industrial Revolution, American War of Independence (1776), French Revolution (1789), Russian October Revolution (1917), First and Second World Wars, Cold War, and Indian Independence Movement—analyzing their causes, chronology, treaties, and global impacts.',
                },
                {
                  id: 'SO-P1-B01-CH02-T02',
                  topicNumber: 2,
                  code: '1.2.2',
                  topic:
                    'Political, economic, and socio-cultural aspects of ancient, medieval, and modern Nepalese history',
                  nepaliTopic:
                    'नेपालको प्राचीनकाल, मध्यकाल र आधुनिक इतिहासको राजनीतिक, आर्थिक एवं सामाजिक-सांस्कृतिक अवस्था',
                  brief:
                    'Examines statecraft, land tenure, taxation, trade, architecture, and administrative institutions during the Gopal, Mahishpal, Kirat, Licchavi (Golden Age), and Malla (Kathmandu Valley, Karnali Khas, Baise-Chaubise) eras, followed by Prithvi Narayan Shah’s unification campaign, Anglo-Nepal War (Sugauli Treaty 1816), and the 104-year Rana regime.',
                },
                {
                  id: 'SO-P1-B01-CH02-T03',
                  topicNumber: 3,
                  code: '1.2.3',
                  topic: "People's Movements for democracy in Nepal",
                  nepaliTopic: 'नेपालमा लोकतन्त्रको लागि भएका जनआन्दोलनहरू',
                  brief:
                    'Covers the anti-Rana democratic revolution of 2007 BS, the 2036 BS referendum movement, the 2046 BS People’s Movement I restoring multiparty constitutional monarchy, the decade-long armed conflict and 12-Point Understanding, Comprehensive Peace Accord (2063 BS), and the 2062/63 BS People’s Movement II culminating in the federal democratic republic.',
                },
                {
                  id: 'SO-P1-B01-CH02-T04',
                  topicNumber: 4,
                  code: '1.2.4',
                  topic:
                    'Prevalent religions, culture, ethnicity, languages, literature, and art of Nepal',
                  nepaliTopic:
                    'नेपालका प्रचलित धर्म, संस्कृति, जातजाति, भाषा, साहित्य र कला',
                  brief:
                    'Addresses Nepal’s 142 caste/ethnic groups and 124 mother tongues (National Census 2078), major religious traditions (Hinduism, Buddhism, Kirat, Islam, Bon, Prakriti, Christianity), indigenous customs (Guthi, Rodhighar, Bheja, Badghar, Dhikur), pagoda/stupa/shikhar architecture, Paubha/Mithila painting, classical/folk music, and Nepali literary history.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Section Officer Phase I PDF · Nepal Parichaya Vol. I–III',
          materialPath: '/materials/nepal-parichaya-geography.pdf',
          materialTitle: 'Nepal Parichaya: Physical Geography',
          quizHref: '/quiz/custom?subject=Geography%20of%20Nepal',
          quizLabel: 'Geography & History MCQs',
          simulatePresetId: 'so-phase1-omr',
        },
        {
          id: 'so-p1-u2',
          branchNumber: 2,
          unitCode: 'Part A · 1.3–1.4',
          title:
            'General Awareness II: Polity & Governance (6M) and Economic Development (6M)',
          nepaliTitle:
            'भाग (A) सामान्य सचेतना — १.३ शासनपद्धति र शासन (६) तथा १.४ आर्थिक विकास (६)',
          marksWeight: 12,
          branchSummary:
            'Covers Units 1.3 and 1.4 of Part A (12 MCQs × 1 Mark = 12 Marks), evaluating constitutional literacy, rights-based governance, administrative history, development infrastructure, periodic planning, and external economic linkages.',
          subtopics: [
            '1.3 Polity and Governance — constitution, political system, rights-based issues & evolution of Nepalese administrative system (6 Qs × 1M)',
            '1.4 Economic Development — infrastructures of development (1.4.1), planning, resource mobilization, growth & employment (1.4.2), and Nepal’s economic interaction with the World (1.4.3) (6 Qs × 1M)',
          ],
          chapters: [
            {
              id: 'SO-P1-B02-CH01',
              chapterNumber: 1,
              code: 'Unit 1.3',
              chapterName: 'Polity and Governance',
              nepaliChapterName:
                '१.३ शासनपद्धति र शासन — संविधान, राजनैतिक व्यवस्था, अधिकार र प्रशासनिक विकासक्रम',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Tests constitutional history, the Constitution of Nepal (2072), rights-based jurisprudence, and the institutional evolution of Nepal’s public administration.',
              topics: [
                {
                  id: 'SO-P1-B02-CH01-T01',
                  topicNumber: 1,
                  code: '1.3 (a)',
                  topic: 'Constitution and political system of Nepal',
                  nepaliTopic: 'नेपालको संविधान र राजनैतिक व्यवस्था',
                  brief:
                    'Covers Nepal’s seven constitutions from 2004 BS to 2072 BS, the structure of the Constitution of Nepal (35 Parts, 308 Articles, 9 Schedules), parliamentary executive, bicameral federal legislature, three-tier judicial hierarchy, 13 Constitutional Bodies, and power distribution across Schedules 5–9.',
                },
                {
                  id: 'SO-P1-B02-CH01-T02',
                  topicNumber: 2,
                  code: '1.3 (b)',
                  topic: 'Rights-based issues and civic governance',
                  nepaliTopic: 'अधिकारमा आधारित सवाल तथा विषयहरू',
                  brief:
                    'Examines the 31 Fundamental Rights (Articles 16–46), Fundamental Duties (Article 48), international human rights conventions ratified by Nepal (UDHR, ICCPR, ICESCR, CEDAW, CRC, CAT), social inclusion, proportional representation, and constitutional writ remedies.',
                },
                {
                  id: 'SO-P1-B02-CH01-T03',
                  topicNumber: 3,
                  code: '1.3 (c)',
                  topic: 'Evolution of the Nepalese Administrative System',
                  nepaliTopic: 'नेपालको प्रशासनिक व्यवस्थाको विकासक्रम',
                  brief:
                    'Traces public administration from Licchavi/Malla offices (Mahabhatta,antarasan, Chautariya, Kaji) and Rana-era Adda/Muluki Ain (1910 BS) to modern bureaucratic institutionalization via the Buch Commission (2009 BS), Acharya Commission (2013 BS), Jha Commission (2025 BS), Thapa Commission (2032 BS), Koirala Commission (2048 BS), and post-2072 federal civil service adjustment.',
                },
              ],
            },
            {
              id: 'SO-P1-B02-CH02',
              chapterNumber: 2,
              code: 'Unit 1.4',
              chapterName: 'Economic Development',
              nepaliChapterName: '१.४ आर्थिक विकास',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Analyzes sectoral economic foundations, periodic development plans, macroeconomic indicators, and Nepal’s trade, investment, and aid relations.',
              topics: [
                {
                  id: 'SO-P1-B02-CH02-T01',
                  topicNumber: 1,
                  code: '1.4.1',
                  topic:
                    'Infrastructure development in Nepal (agriculture, industry, trade, tourism, transportation, communication, education, health, and electricity)',
                  nepaliTopic:
                    'नेपालमा विकासका पूर्वाधारहरू (कृषि, उद्योग, व्यापार, पर्यटन, यातायात, संचार, शिक्षा, स्वास्थ्य र विद्युत)',
                  brief:
                    'Assesses sectoral GDP contributions, agricultural commercialization and irrigation projects, industrial estates and SEZs, domestic/international airports, national pride highways, telecom/broadband penetration, literacy and health indicators, and installed hydropower generation capacity.',
                },
                {
                  id: 'SO-P1-B02-CH02-T02',
                  topicNumber: 2,
                  code: '1.4.2',
                  topic:
                    'Nepalese economic issues relating to planning, mobilization of resources, growth, development, and employment',
                  nepaliTopic:
                    'नेपालको अर्थतन्त्रसँग सम्बद्ध योजना, स्रोत परिचालन, वृद्धि, विकास तथा रोजगार सम्बन्धी सवालहरू',
                  brief:
                    'Covers Nepal’s planned development journey since 2013 BS up to the Sixteenth Periodic Plan (2081/82–2085/86: "Good Governance, Social Justice and Prosperity"), fiscal/monetary resource mobilization, per capita income, poverty reduction targets, domestic job creation, and the 2026 LDC graduation transition.',
                },
                {
                  id: 'SO-P1-B02-CH02-T03',
                  topicNumber: 3,
                  code: '1.4.3',
                  topic: "Nepal's economic interaction with the World",
                  nepaliTopic: 'नेपालको विश्वसँगको आर्थिक गतिविधिहरू',
                  brief:
                    'Examines Nepal’s foreign trade composition, balance of payments, foreign exchange reserves, remittance inflows, Foreign Direct Investment (FDI), bilateral/multilateral development assistance, and memberships in WTO (2004), SAFTA, BIMSTEC, World Bank, IMF, ADB, and AIIB.',
                },
              ],
            },
          ],
          keyReferences:
            'Constitution of Nepal (2072) · Sixteenth Periodic Plan Summary',
          materialPath: '/materials/constitution-of-nepal-2072.pdf',
          materialTitle: 'Constitution of Nepal (2072)',
          quizHref: '/quiz/laws-and-constitution',
          quizLabel: 'Polity & Laws Quiz',
          simulatePresetId: 'so-phase1-omr',
        },
        {
          id: 'so-p1-u3',
          branchNumber: 3,
          unitCode: 'Part A · 1.5–1.6',
          title:
            'General Awareness III: Sustainable Development, Ecology & Demography (6M) and Science & Technology (6M)',
          nepaliTitle:
            'भाग (A) सामान्य सचेतना — १.५ दिगो विकास, वातावरण, जनसांख्यिकी र सम्पदा (६) तथा १.६ विज्ञान र प्रविधि (६)',
          marksWeight: 12,
          branchSummary:
            'Covers Units 1.5 and 1.6 of Part A (6 + 6 = 12 MCQs × 1 Mark per official Table of Specification). Across Units 1.5–1.8 (26 items), 16 are Level I (60%) and 10 are Level II (40%).',
          subtopics: [
            '1.5 General issues on sustainable development, environmental ecology, biodiversity, climate change, demography, urbanization, settlement, pollution & conservation of natural/national heritage (6 Qs × 1M)',
            '1.6 Science & Technology — scientific discoveries/scientists (1.6.1), impact of S&T on society (1.6.2), and evolution, heredity, health & diseases (1.6.3) (6 Qs × 1M)',
          ],
          chapters: [
            {
              id: 'SO-P1-B03-CH01',
              chapterNumber: 1,
              code: 'Unit 1.5',
              chapterName:
                'Sustainable Development, Ecology, Demography and Heritage Conservation',
              nepaliChapterName:
                '१.५ दिगो विकास, वातावरणीय पारिस्थिति, जैविक विविधता, जनसांख्यिकी र राष्ट्रिय सम्पदा संरक्षण',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Integrates global sustainability frameworks (SDGs, UNFCCC/COP), Nepal’s protected area network, Census 2078 demographics, and UNESCO heritage conservation.',
              topics: [
                {
                  id: 'SO-P1-B03-CH01-T01',
                  topicNumber: 1,
                  code: '1.5 (a)',
                  topic:
                    'Sustainable development, environmental ecology, biodiversity, and climate change',
                  nepaliTopic:
                    'दिगो विकास, वातावरणीय पारिस्थिति, जैविक विविधता र जलवायु परिवर्तन',
                  brief:
                    'Covers the Brundtland Commission (1987), Rio Earth Summit (Agenda 21), 17 UN Sustainable Development Goals (2015–2030), trophic ecosystems, Nepal’s 118 ecosystems, 12 National Parks, 1 Wildlife Reserve, 1 Hunting Reserve, 6 Conservation Areas, 10 Ramsar wetlands, Kyoto Protocol, Paris Agreement, and Nepal’s 2045 Net-Zero commitment.',
                },
                {
                  id: 'SO-P1-B03-CH01-T02',
                  topicNumber: 2,
                  code: '1.5 (b)',
                  topic:
                    'Demography, urbanization, settlement, pollution, and natural/national heritage conservation',
                  nepaliTopic:
                    'जनसांख्यिकी, शहरीकरण, बसोवास, प्रदूषण तथा प्राकृतिक स्रोत र राष्ट्रिय सम्पदाहरूको संरक्षण',
                  brief:
                    'Focuses on National Population and Housing Census 2078 indicators (total population 29,164,578, growth rate 0.92%, sex ratio 95.59, literacy 76.2%, urban municipal population), internal/external migration trends, air/water/solid-waste pollution standards, protected wildlife species under NPWC Act 2029, and Nepal’s 10 UNESCO World Heritage Sites (8 cultural, 2 natural).',
                },
              ],
            },
            {
              id: 'SO-P1-B03-CH02',
              chapterNumber: 2,
              code: 'Unit 1.6',
              chapterName: 'Science and Technology',
              nepaliChapterName: '१.६ विज्ञान र प्रविधि',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Evaluates foundational scientific literacy, major inventions, digital/emerging technologies, human genetics, and public health.',
              topics: [
                {
                  id: 'SO-P1-B03-CH02-T01',
                  topicNumber: 1,
                  code: '1.6.1',
                  topic:
                    'Major scientific discoveries and inventions, famous scientists and their contributions',
                  nepaliTopic:
                    'प्रमुख वैज्ञानिक अन्वेषण र आविष्कारहरू, प्रसिद्ध वैज्ञानिक र तिनको योगदान',
                  brief:
                    'Covers landmark breakthroughs and laws formulated by Archimedes, Galileo, Newton, Faraday, Darwin, Mendel, Pasteur, Marie Curie, Einstein, Fleming, Watson & Crick, and Hawking, alongside scientific instruments (seismograph, barometer, heliograph, lactometer) and SI measurement units.',
                },
                {
                  id: 'SO-P1-B03-CH02-T02',
                  topicNumber: 2,
                  code: '1.6.2',
                  topic:
                    'Impact of science and technology in human life and society',
                  nepaliTopic:
                    'विज्ञान र प्रविधिको मानव जीवन र समाजमा परेको प्रभाव',
                  brief:
                    'Examines transformative applications of ICT, internet/cloud computing, artificial intelligence, satellite navigation, biotechnology, renewable energy (solar, wind, green hydrogen), nuclear energy, and cybersecurity in modern governance, economy, and daily life.',
                },
                {
                  id: 'SO-P1-B03-CH02-T03',
                  topicNumber: 3,
                  code: '1.6.3',
                  topic:
                    'General information on evolution, heredity, health, and diseases',
                  nepaliTopic:
                    'क्रमविकास, वंशाणु, स्वास्थ्य र रोग बारे सामान्य जानकारी',
                  brief:
                    'Studies Lamarckism, Darwin’s natural selection, mutation theory, Mendelian genetics, DNA/RNA chromosomes, DNA fingerprinting, human nutrition (vitamins, minerals, proteins), communicable diseases (viral, bacterial, protozoan, vector-borne), non-communicable lifestyle diseases, and national immunization vaccines.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Section Officer Phase I PDF · Census 2078 · 16th Plan',
          materialPath: '/materials/nepal-parichaya-culture-heritage.pdf',
          materialTitle: 'Culture, Census & Heritage Volume',
          quizHref: '/quiz/nepal-parichaya',
          quizLabel: '20-Q GK Mastery',
          simulatePresetId: 'so-phase1-omr',
        },
        {
          id: 'so-p1-u4',
          branchNumber: 4,
          unitCode: 'Part A · 1.7–1.8',
          title:
            'General Awareness IV: International Affairs & Institutions (6M) and Current Affairs (8M)',
          nepaliTitle:
            'भाग (A) सामान्य सचेतना — १.७ अन्तर्राष्ट्रिय मामिला तथा संघ/संस्था (६) र १.८ समसामयिक घटना (८)',
          marksWeight: 14,
          branchSummary:
            'Covers Units 1.7 (6 Marks) and 1.8 (8 Marks) per official Table of Specification (14 MCQs × 1 Mark = 14 Marks), testing diplomatic history, multilateral charters, and contemporary national/global events.',
          subtopics: [
            '1.7 International Affairs & Institutions — bilateral relations with SAARC & major powers (1.7.1) and UN System & multilateral arrangements (1.7.2) (6 Qs × 1M)',
            '1.8 Major Events and Current Affairs of National and International Importance — politics, economy, science, sports, books, prizes, arts & noted thinkers (8 Qs × 1M)',
          ],
          chapters: [
            {
              id: 'SO-P1-B04-CH01',
              chapterNumber: 1,
              code: 'Unit 1.7',
              chapterName:
                'International Affairs and International Institutions',
              nepaliChapterName:
                '१.७ अन्तर्राष्ट्रिय मामिला तथा अन्तर्राष्ट्रिय संघ/संस्था',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Covers Nepal’s bilateral diplomatic milestones with neighbors and major powers alongside the UN Charter, regional blocs, and multilateral institutions.',
              topics: [
                {
                  id: 'SO-P1-B04-CH01-T01',
                  topicNumber: 1,
                  code: '1.7.1',
                  topic:
                    "Nepal's relations with SAARC member countries and China, USA, UK, Russia, France, Germany, Switzerland, and Japan",
                  nepaliTopic:
                    'सार्क सदस्य राष्ट्रहरू तथा चीन, संयुक्त राज्य अमेरिका, संयुक्त अधिराज्य, रुस, फ्रान्स, जर्मनी, स्वीजरल्याण्ड र जापानसँग नेपालको सम्बन्ध',
                  brief:
                    'Tracks exact dates of diplomatic establishment (starting with UK 1816, USA 1947, India 1947, France 1949, China 1955, Russia 1956, Japan 1956, Switzerland 1956, Germany 1958, and all SAARC nations), major bilateral treaties, trade/transit agreements, and development cooperation milestones.',
                },
                {
                  id: 'SO-P1-B04-CH01-T02',
                  topicNumber: 2,
                  code: '1.7.2',
                  topic: 'UN System, multilateral arrangements, and Nepal',
                  nepaliTopic:
                    'संयुक्त राष्ट्रसंघ प्रणाली, बहुपक्षीय व्यवस्थापन र नेपाल',
                  brief:
                    'Examines the UN Charter (1945), 6 principal organs, 15+ specialized agencies (ILO, FAO, UNESCO, WHO, IMF, World Bank), Nepal’s UN admission (14 December 1955) and UN Peacekeeping contributions (since 1958), plus SAARC (Secretariat in Kathmandu, regional centers), BIMSTEC, ASEAN, EU, NAM, and WTO.',
                },
              ],
            },
            {
              id: 'SO-P1-B04-CH02',
              chapterNumber: 2,
              code: 'Unit 1.8',
              chapterName:
                'Major Events and Current Affairs of National and International Importance',
              nepaliChapterName:
                '१.८ राष्ट्रिय र अन्तर्राष्ट्रिय महत्वका समसामयिक घटना तथा नवीनतम गतिविधिहरू',
              marksAllocation: '8 Questions × 1 Mark = 8 Marks',
              chapterBrief:
                'Highest single-unit weightage in Part A (8 Marks), testing recent political, economic, scientific, cultural, literary, and sporting developments.',
              topics: [
                {
                  id: 'SO-P1-B04-CH02-T01',
                  topicNumber: 1,
                  code: '1.8 (a)',
                  topic:
                    'Contemporary political, social, economic, and scientific developments',
                  nepaliTopic:
                    'समसामयिक राजनीतिक, सामाजिक, आर्थिक र वैज्ञानिक घटनाक्रमहरू',
                  brief:
                    'Covers recent constitutional/legislative enactments, national budget and Economic Survey highlights, global indices (HDI, Corruption Perceptions Index, Global Peace Index, Press Freedom Index), international summits (UNGA, G20, COP, BIMSTEC, NAM), and space/scientific missions.',
                },
                {
                  id: 'SO-P1-B04-CH02-T02',
                  topicNumber: 2,
                  code: '1.8 (b)',
                  topic:
                    'Sports, books, prizes/rewards, arts, literature, music, and noted personalities/thinkers',
                  nepaliTopic:
                    'खेलकूद, पुस्तक, पुरस्कार, कला, साहित्य, संगीत तथा महत्वपूर्ण व्यक्तित्व र विचारकहरू',
                  brief:
                    'Includes Olympics, FIFA World Cup, Asian Games, Cricket World Cups, Madan Puraskar, Sajha Puraskar, Nobel Prizes, Ramon Magsaysay, Booker/Oscars, landmark philosophical/political thinkers (Socrates, Plato, Aristotle, Rousseau, Karl Marx, Abraham Lincoln, Mahatma Gandhi, BP Koirala), and their seminal works.',
                },
              ],
            },
          ],
          keyReferences:
            'PSC GK & Aptitude Master Reference · Official Phase I Syllabus',
          materialPath: '/materials/psc-gk-aptitude-outline.pdf',
          materialTitle: 'PSC GK & Aptitude Master Reference',
          quizHref: '/quiz/comprehensive-mock',
          quizLabel: '30-Q Integrated Mock',
          simulatePresetId: 'so-phase1-omr',
        },
        {
          id: 'so-p1-u5',
          branchNumber: 5,
          unitCode: 'Part B · 2.1–2.5',
          title:
            'Aptitude Test: Verbal, Non-Verbal, Quantitative, Logical & Data Interpretation (30M)',
          nepaliTitle:
            'भाग (B) बौद्धिक परीक्षण — शाब्दिक, अशाब्दिक, संख्यात्मक, तार्किक र तथ्याङ्क विश्लेषण (३० अङ्क)',
          marksWeight: 30,
          branchSummary:
            'Comprises 5 equally weighted chapters (6 Questions × 1 Mark each = 30 Marks), assessing analytical speed, pattern recognition, numerical problem-solving, deductive logic, and graphical/tabular data interpretation without calculators.',
          subtopics: [
            '2.1 Verbal Reasoning (6×1 = 6M) & 2.2 Non-Verbal Reasoning (6×1 = 6M)',
            '2.3 Quantitative Aptitude (6×1 = 6M) & 2.4 General Mental, Logical & Analytical Ability (6×1 = 6M)',
            '2.5 Data Interpretation — charts, graphs, tables & data sufficiency (6×1 = 6M)',
          ],
          chapters: [
            {
              id: 'SO-P1-B05-CH01',
              chapterNumber: 1,
              code: 'Unit 2.1',
              chapterName: 'Verbal Reasoning',
              nepaliChapterName: '२.१ शाब्दिक तार्किक परीक्षण (Verbal Reasoning)',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Evaluates language-based logical patterns, positional deductions, coding rules, and cause-effect reasoning.',
              topics: [
                {
                  id: 'SO-P1-B05-CH01-T01',
                  topicNumber: 1,
                  code: '2.1 (a)',
                  topic:
                    'Series, analogy, classification, coding-decoding, common property, and character matrices',
                  nepaliTopic:
                    'अनुक्रम, समरुपता, वर्गीकरण, कोडिङ-डिकोडिङ, साझा गुण र अक्षर मेट्रिक्स',
                  brief:
                    'Tests identification of alphabetical and lexical progressions, semantic word pairs, odd-one-out classification, letter-shift or substitution ciphers, missing character grids, and shared lexical properties.',
                },
                {
                  id: 'SO-P1-B05-CH01-T02',
                  topicNumber: 2,
                  code: '2.1 (b)',
                  topic:
                    'Direction and distance sense, ranking order, assertion-reason, induction, deduction, and courses of action',
                  nepaliTopic:
                    'दिशा र दूरी, श्रेणीक्रम, भनाइ र कारण, आगमन, निगमन र कार्यदिशा',
                  brief:
                    'Measures spatial orientation using cardinal turns and Pythagorean displacement, linear/queue rank shifts, causal evaluation of paired statements (Assertion & Reason), inductive/deductive inference, and selecting administrative courses of action.',
                },
              ],
            },
            {
              id: 'SO-P1-B05-CH02',
              chapterNumber: 2,
              code: 'Unit 2.2',
              chapterName: 'Non-Verbal Reasoning',
              nepaliChapterName:
                '२.२ अशाब्दिक तार्किक परीक्षण (Non-Verbal Reasoning)',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Tests visual-spatial intelligence through geometric sequences, figure counting, reflections, and pattern assembly.',
              topics: [
                {
                  id: 'SO-P1-B05-CH02-T01',
                  topicNumber: 1,
                  code: '2.2 (a)',
                  topic:
                    'Pictorial series, analogy, classification, Venn diagrams, and figure matrices',
                  nepaliTopic:
                    'चित्रात्मक अनुक्रम, समरुपता, वर्गीकरण, भेन चित्र र चित्र मेट्रिक्स',
                  brief:
                    'Evaluates rotational/additive transformations across problem figures, relational set representations via overlapping Venn circles, odd-figure grouping into classes, and 3×3 visual rule matrices.',
                },
                {
                  id: 'SO-P1-B05-CH02-T02',
                  topicNumber: 2,
                  code: '2.2 (b)',
                  topic:
                    'Construction and counting of squares/triangles, figure formation, dot situation, water/mirror images, and embedded figures',
                  nepaliTopic:
                    'वर्ग र त्रिभुज गणना/रचना, आकृति निर्माण, विन्दु स्थिति, पानी र ऐनाको आकृति तथा अन्तर्निहित चित्र',
                  brief:
                    'Covers combinatorial counting of triangles/squares in subdivided grids, fitting polygon pieces to form a square, matching topological dot placements, vertical (mirror) vs horizontal (water) reflections, and spotting hidden shapes inside complex figures.',
                },
              ],
            },
            {
              id: 'SO-P1-B05-CH03',
              chapterNumber: 3,
              code: 'Unit 2.3',
              chapterName: 'Quantitative Aptitude',
              nepaliChapterName:
                '२.३ संख्यात्मक अभियोग्यता (Quantitative Aptitude)',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Assesses mental arithmetic accuracy and speed across core commercial and numerical problem types without a calculator.',
              topics: [
                {
                  id: 'SO-P1-B05-CH03-T01',
                  topicNumber: 1,
                  code: '2.3 (a)',
                  topic:
                    'Arithmetical reasoning/operations, number sequences, fractions, decimals, percentage, ratio, and average',
                  nepaliTopic:
                    'अंकगणितीय तर्क, संख्या अनुक्रम, भिन्न, दशमलव, प्रतिशत, अनुपात र औसत',
                  brief:
                    'Covers wrong/missing number series, triangular/grid number puzzles, set-overlap percentage bounds, weighted averages, and proportional division word problems.',
                },
                {
                  id: 'SO-P1-B05-CH03-T02',
                  topicNumber: 2,
                  code: '2.3 (b)',
                  topic:
                    'Profit and loss, date and calendar, time and work, and combinatorics/puzzles',
                  nepaliTopic: 'नाफा-नोक्सान, मिति र पात्रो, समय र काम',
                  brief:
                    'Focuses on cost/selling price markups and discounts, odd-day calendar day-of-week calculations, reciprocal work rates (pipes/cisterns/teamwork), geometric doubling puzzles, and round-robin scheduling.',
                },
              ],
            },
            {
              id: 'SO-P1-B05-CH04',
              chapterNumber: 4,
              code: 'Unit 2.4',
              chapterName:
                'General Mental Ability, Logical Reasoning and Analytical Ability',
              nepaliChapterName:
                '२.४ सामान्य बौद्धिक क्षमता, तार्किक र विश्लेषणात्मक क्षमता',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Evaluates multi-constraint logical puzzles, syllogistic propositions, spatial cube views, and analytical case passages.',
              topics: [
                {
                  id: 'SO-P1-B05-CH04-T01',
                  topicNumber: 1,
                  code: '2.4 (a)',
                  topic:
                    'Comparative ordering, cubes/dice, graph-coloring logic, and categorical propositions',
                  nepaliTopic:
                    'तुलनात्मक क्रम, घन/पासा र तार्किक भनाइहरूको विश्लेषण',
                  brief:
                    'Tests transitive inequalities (height/weight comparisons), deducing opposite and adjacent faces from 3D cube views, minimum region coloring rules, and Aristotelean square of opposition (contraries, contradictories, sub-contraries).',
                },
                {
                  id: 'SO-P1-B05-CH04-T02',
                  topicNumber: 2,
                  code: '2.4 (b)',
                  topic:
                    'Constraint-based seating/assignment puzzles, blood-relation sufficiency, and analytical survey passages',
                  nepaliTopic:
                    'शर्तमा आधारित पजल, नाता सम्बन्ध पर्याप्तता र सर्वेक्षण विश्लेषण',
                  brief:
                    'Requires synthesizing multiple clues (e.g., houses, owners, and attributes) or two-way survey counts (gender vs voting outcomes) to answer multi-item analytical sets.',
                },
              ],
            },
            {
              id: 'SO-P1-B05-CH05',
              chapterNumber: 5,
              code: 'Unit 2.5',
              chapterName: 'Data Interpretation',
              nepaliChapterName: '२.५ तथ्याङ्क विश्लेषण (Data Interpretation)',
              marksAllocation: '6 Questions × 1 Mark = 6 Marks',
              chapterBrief:
                'Measures quantitative synthesis across statistical tables, cumulative frequency matrices, line/bar charts, pie graphs, and data sufficiency.',
              topics: [
                {
                  id: 'SO-P1-B05-CH05-T01',
                  topicNumber: 1,
                  code: '2.5 (a)',
                  topic:
                    'Tabular score matrices and cumulative cut-off distributions',
                  nepaliTopic: 'तालिका र संचयी प्राप्ताङ्क वितरण विश्लेषण',
                  brief:
                    'Involves computing candidate averages, aggregate percentages (handling absent papers), and extracting interval counts from cumulative "marks and above" examination tables.',
                },
                {
                  id: 'SO-P1-B05-CH05-T02',
                  topicNumber: 2,
                  code: '2.5 (b)',
                  topic:
                    'Line graphs, bar charts, pie charts, and data sufficiency',
                  nepaliTopic:
                    'रेखाचित्र, स्तम्भ चित्र, वृत्त चित्र र तथ्याङ्क पर्याप्तता',
                  brief:
                    'Covers interpreting ratio curves (e.g., imports-to-exports ratio over years), cross-referencing paired bar and pie charts (e.g., faculty gender by department + age breakdown), and recognizing when absolute values are insufficient to compute percentage growth ("Data inadequate").',
                },
              ],
            },
          ],
          keyReferences:
            'Official Section Officer Phase I PDF (Pages 6 & 12–18)',
          materialPath:
            '/materials/official-psc/psc-official-section-officer-phase1.pdf',
          materialTitle: 'Official SO Phase I Syllabus PDF',
          quizHref: '/quiz/custom?subject=General%20Mental%20Ability%20(IQ)',
          quizLabel: 'Aptitude IQ MCQs',
          simulatePresetId: 'so-phase1-omr',
        },
        {
          id: 'so-p1-u6',
          branchNumber: 6,
          unitCode: 'Part C · 3.1–3.3',
          title:
            'English Language Competence Test: Comprehension (5M), Vocabulary (7M) & Syntactic Ability (8M)',
          nepaliTitle:
            'भाग (C) अंग्रेजी भाषा दक्षता परीक्षण — बोध (५), शब्दभण्डार (७) र वाक्य संरचना (८) — २० अङ्क',
          marksWeight: 20,
          branchSummary:
            'Evaluates Class XII standard English proficiency across 20 objective questions (20 Marks): unseen prose comprehension (5M), lexical precision (7M), and grammatical/syntactic accuracy (8M).',
          subtopics: [
            '3.1 Comprehension (5×1 = 5M): fact finding, inferential, core theme, true/false, issues raised & language-based items',
            '3.2 Vocabulary (7×1 = 7M): literal/figurative/contextual word meaning, single-word substitution, synonyms/antonyms, derivatives & homonyms/homophones',
            '3.3 Syntactic Ability (8×1 = 8M): agreement, tense/aspect, parallel structures, clauses, modifiers, conditionals, phrasal expressions, shifts, transformations, prepositions/conjunctions & parts of speech',
          ],
          chapters: [
            {
              id: 'SO-P1-B06-CH01',
              chapterNumber: 1,
              code: 'Unit 3.1',
              chapterName: 'Reading Comprehension',
              nepaliChapterName: '३.१ बोध परीक्षण (Comprehension)',
              marksAllocation: '5 Questions × 1 Mark = 5 Marks',
              chapterBrief:
                'Assesses close reading of an unseen non-fiction prose passage through factual, thematic, and inferential multiple-choice questions.',
              topics: [
                {
                  id: 'SO-P1-B06-CH01-T01',
                  topicNumber: 1,
                  code: '3.1 (a)',
                  topic:
                    'Fact finding, true/false identification, and core theme',
                  nepaliTopic: 'तथ्य पहिचान, सत्य/असत्य र मुख्य भाव',
                  brief:
                    'Tests the candidate’s ability to locate explicit details, eliminate contradicted statements ("All the statements below are true, except—"), and synthesize the central argument of a paragraph or whole passage.',
                },
                {
                  id: 'SO-P1-B06-CH01-T02',
                  topicNumber: 2,
                  code: '3.1 (b)',
                  topic:
                    'Inferential, issues-raised, and language-based passage questions',
                  nepaliTopic: 'अनुमानपरक र भाषिक आशय सम्बन्धी प्रश्नहरू',
                  brief:
                    'Evaluates implied reasoning, authorial purpose behind examples or metaphors, rhetorical tone, and paraphrasing complex sentences within context.',
                },
              ],
            },
            {
              id: 'SO-P1-B06-CH02',
              chapterNumber: 2,
              code: 'Unit 3.2',
              chapterName: 'Vocabulary',
              nepaliChapterName: '३.२ शब्दभण्डार (Vocabulary)',
              marksAllocation: '7 Questions × 1 Mark = 7 Marks',
              chapterBrief:
                'Maps breadth and precision of English vocabulary across contextual passage words and standalone lexical items.',
              topics: [
                {
                  id: 'SO-P1-B06-CH02-T01',
                  topicNumber: 1,
                  code: '3.2 (a)',
                  topic:
                    'Literal, figurative, and contextual word meanings, synonyms, and antonyms',
                  nepaliTopic:
                    'शाब्दिक/सन्दर्भगत अर्थ, पर्यायवाची र विपरीतार्थी शब्द',
                  brief:
                    'Tests exact contextual meaning of words and idioms appearing in prose (e.g., "stand up to", "bring up", "fussy") as well as standalone synonyms, antonyms, and semantic collocations.',
                },
                {
                  id: 'SO-P1-B06-CH02-T02',
                  topicNumber: 2,
                  code: '3.2 (b)',
                  topic:
                    'Single-word substitution, derivatives, and homonyms/homophones',
                  nepaliTopic: 'एकल शब्द प्रतिस्थापन, व्युत्पन्न शब्द र समोच्चारित शब्द',
                  brief:
                    'Covers concise lexical terms for definitions (e.g., "possessor", "to orate", "dysfunctional"), morphological prefixes/suffixes (derivatives), word class identification in context, and confusable homophones.',
                },
              ],
            },
            {
              id: 'SO-P1-B06-CH03',
              chapterNumber: 3,
              code: 'Unit 3.3',
              chapterName: 'Syntactic Ability',
              nepaliChapterName: '३.३ वाक्य संरचना क्षमता (Syntactic Ability)',
              marksAllocation: '8 Questions × 1 Mark = 8 Marks',
              chapterBrief:
                'Examines command of formal English grammar, clause architecture, and sentence transformation.',
              topics: [
                {
                  id: 'SO-P1-B06-CH03-T01',
                  topicNumber: 1,
                  code: '3.3 (a)',
                  topic:
                    'Subject-verb agreement, tense and aspect, conditionals, and shifts',
                  nepaliTopic:
                    'कर्ता-क्रिया संगति, काल र पक्ष, शर्तबोधक वाक्य र एकरुपता',
                  brief:
                    'Covers proximity agreement ("Neither the manager nor the assistants know..."), present perfect continuous vs past tenses with "since/for", zero/first/second/third conditionals, modal structures ("had better + bare infinitive"), and avoiding faulty shifts in tense, number, or person.',
                },
                {
                  id: 'SO-P1-B06-CH03-T02',
                  topicNumber: 2,
                  code: '3.3 (b)',
                  topic:
                    'Parallel structures, clauses, modifiers, transformations, phrasal expressions, prepositions, conjunctions, articles, and parts of speech',
                  nepaliTopic:
                    'समानान्तर संरचना, उपवाक्य, विशेषण/क्रियाविशेषण स्थान, वाच्य परिवर्तन, नामयोगी, संयोजक र आर्टिकल',
                  brief:
                    'Tests adverb placement ("nearly earned" vs "earned nearly"), active-passive and direct-indirect transformations, gerund/infinitive complements ("have trouble remembering"), zero/definite article usage with proper nouns, prepositions of time/place, and English varieties.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Section Officer Phase I PDF (Pages 6 & 19–24)',
          materialPath:
            '/materials/official-psc/psc-official-section-officer-phase1.pdf',
          materialTitle: 'Official SO Phase I Syllabus PDF',
          quizHref: '/quiz/custom?subject=English',
          quizLabel: 'English Competence MCQs',
          simulatePresetId: 'so-phase1-omr',
        },
      ],
    },
  ],
};

export const SECTION_OFFICER_PHASE_3: PscExamPhase = {
  id: 'so-phase-3',
  phaseNumber: 3,
  title: 'Final Stage · IT Skill, Group Test & Interview (अन्तिम चरण)',
  nepaliTitle:
    'अन्तिम चरण · सूचना प्रविधि सीप परीक्षण (१०), सामूहिक परीक्षण (१०) र अन्तर्वार्ता (४०/५०)',
  summary:
    'Open exclusively to candidates selected from Stage II Main Written Examination. Evaluates practical office computing (10 Marks · 20 Min), leaderless group discussion & individual presentation (10 Marks · 30 Min), and oral interview board (40 Marks; 50 Marks for Foreign Service).',
  officialPdfPath:
    'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/202512091043336937fd55e8f3c1.pdf',
  papers: [
    {
      id: 'so-paper-5',
      code: 'Final Stage',
      title: 'IT Skill Test, Group Test & Oral Interview',
      nepaliTitle:
        'सूचना प्रविधि सीप परीक्षण (१०), सामूहिक परीक्षण (१०) र अन्तर्वार्ता (४०)',
      examFormat: 'Practical & Oral Viva',
      fullMarks: 60,
      passMarks: null,
      durationLabel: 'IT 20 Min + Group 30 Min + Viva',
      questionBreakdown:
        'IT Skill Test (10 Marks · 20 Min) · Group Test Presentation (10 Marks · 30 Min) · Oral Interview Board (40 Marks; 50M Foreign Service)',
      scoringRule:
        'Added directly to Stage II Written Marks (300M) for 360-Mark Final Merit List (470M for Foreign Service)',
      countsTowardFinalMerit: true,
      units: [
        {
          id: 'so-p5-u1',
          branchNumber: 1,
          unitCode: 'Final Stage · 60M',
          title:
            'Information Technology Practical (10M), Group Test (10M) & Oral Interview (40M)',
          nepaliTitle:
            'सूचना प्रविधि प्रयोगात्मक सीप (१०), सामूहिक परीक्षण (१०) र मौखिक अन्तर्वार्ता (४०)',
          marksWeight: 60,
          branchSummary:
            'Assesses hands-on computer fluency across typing and office productivity suites, collaborative policy problem-solving in a 3-member panel Group Test, and executive suitability before the PSC Interview Board.',
          subtopics: [
            'IT Skill Test (10 Marks · 20 Min): Devanagari Typing (2.5M, 5 min), English Typing (2.5M, 5 min), Word Processing (2M), Presentation System (1M), Electronic Spreadsheet (1M), and Windows Basic/Email/Internet (1M) [10 min]',
            'Group Test (10 Marks · 30 Min): Leaderless Group Discussion & Individual Presentation evaluated by PSC Chair/Member, Psychologist, and Subject Expert',
            'Oral Interview (40 Marks; 50M Foreign Service): Constitutional clarity, administrative judgment, communication & ethical integrity',
          ],
          chapters: [
            {
              id: 'SO-P5-B01-CH01',
              chapterNumber: 1,
              code: 'Part II · IT Skill',
              chapterName:
                'Information Technology Skill Test (Practical Examination)',
              nepaliChapterName:
                'सूचना प्रविधि सीप परीक्षण (प्रयोगात्मक परीक्षा — १० अङ्क, २० मिनेट)',
              marksAllocation: '10 Marks · 20 Minutes Total',
              chapterBrief:
                'Conducted on computer in two timed segments: 5 minutes Devanagari typing, 5 minutes English typing, and 10 minutes combined office suite tasks.',
              topics: [
                {
                  id: 'SO-P5-B01-CH01-T01',
                  topicNumber: 1,
                  code: 'IT-0',
                  topic:
                    'Devanagari and English Typing Skill Test & WPM Evaluation Formula',
                  nepaliTopic:
                    'देवनागरी (२.५ अङ्क) र अंग्रेजी (२.५ अङ्क) टाइपिङ सीप परीक्षण',
                  marksHint: '2.5M + 2.5M = 5 Marks · 5 + 5 Minutes',
                  brief:
                    'Candidates type a minimum 150-word Devanagari passage (5 minutes; full 2.50 marks at ≥25 correct WPM; 0 marks below 5 WPM) and a 200-word English passage (5 minutes; full 2.50 marks at ≥30 correct WPM; 0 marks below 6 WPM). Words omitting required punctuation are not counted, and net speed is computed via Correct WPM = (Total words typed − Wrong words) / 5.',
                },
                {
                  id: 'SO-P5-B01-CH01-T02',
                  topicNumber: 2,
                  code: 'IT-1',
                  topic: 'Windows Basic, Email and Internet',
                  nepaliTopic: '१. Windows Basic, Email र Internet (१ अङ्क)',
                  marksHint: '1 Mark (within 10-min practical)',
                  brief:
                    'Covers Graphical User Interface (GUI), starting/shutting down Windows, Desktop/Taskbar/My Computer/Recycle Bin, file/folder/menu/toolbar management and search, antivirus use and malware concepts (virus, worm, spam), web browsing and homepage configuration, email/mail client usage, and basic network/internet connectivity troubleshooting.',
                },
                {
                  id: 'SO-P5-B01-CH01-T03',
                  topicNumber: 3,
                  code: 'IT-2',
                  topic: 'Word Processing (MS Word)',
                  nepaliTopic: '२. Word Processing (२ अङ्क)',
                  marksHint: '2 Marks (within 10-min practical)',
                  brief:
                    'Tests creating, saving, and opening documents; typing in Devanagari and English; copying, moving, deleting, and formatting text; paragraph alignment, indentation, and line spacing; bullets/numbering; table creation/manipulation; borders and shading; multi-column newspaper layouts; document security; headers, footers, page numbers, pictures, and symbols; page setup/printing; and Mail Merge.',
                },
                {
                  id: 'SO-P5-B01-CH01-T04',
                  topicNumber: 4,
                  code: 'IT-3',
                  topic: 'Presentation System (MS PowerPoint)',
                  nepaliTopic: '३. Presentation System (१ अङ्क)',
                  marksHint: '1 Mark (within 10-min practical)',
                  brief:
                    'Covers creating, opening, and saving slide decks; formatting slides, applying slide designs, and inserting headers/footers; running slide shows and custom animations; and inserting built-in pictures, tables, charts, graphs, and organizational charts.',
                },
                {
                  id: 'SO-P5-B01-CH01-T05',
                  topicNumber: 5,
                  code: 'IT-4',
                  topic: 'Electronic Spreadsheet (MS Excel)',
                  nepaliTopic: '४. Electronic Spreadsheet (१ अङ्क)',
                  marksHint: '1 Mark (within 10-min practical)',
                  brief:
                    'Covers workbook/worksheet organization (cells, rows, columns); editing, formatting, text wrapping, and cell protection; formulas using relative and absolute cell references; core functions (IF, SUM, MAX, MIN, AVERAGE); sorting and filtering datasets; headers/footers; and page setup/print preview.',
                },
              ],
            },
            {
              id: 'SO-P5-B01-CH02',
              chapterNumber: 2,
              code: 'Part II · Personality',
              chapterName: 'Group Test and Oral Interview',
              nepaliChapterName:
                'सामूहिक परीक्षण (१० अङ्क) र मौखिक अन्तर्वार्ता (४०/५० अङ्क)',
              marksAllocation: '50 Marks (60 Marks for Foreign Service)',
              chapterBrief:
                'Evaluates interpersonal leadership, analytical articulation, and public service temperament before a multidisciplinary PSC panel.',
              topics: [
                {
                  id: 'SO-P5-B01-CH02-T01',
                  topicNumber: 1,
                  code: 'GT-1',
                  topic:
                    'Group Test: Leaderless Group Discussion & Individual Presentation',
                  nepaliTopic:
                    'सामूहिक परीक्षण — समूहमा व्यक्तिगत प्रस्तुति र सामूहिक छलफल (१० अङ्क, ३० मिनेट)',
                  marksHint: '10 Marks · 30 Minutes',
                  brief:
                    'Conducted as a 30-minute Leaderless Group Discussion (LGD) and sequential Individual Presentation on one contemporary policy challenge (e.g., energy crisis, poverty alleviation, health insurance, food security, brain drain). Assessed by a 3-member committee (PSC Chair/Member, Psychologist, and Subject Expert) on problem identification, logical reasoning, courtesy, team dynamics, leadership, and implementable solutions.',
                },
                {
                  id: 'SO-P5-B01-CH02-T02',
                  topicNumber: 2,
                  code: 'IV-1',
                  topic: 'Oral Interview Board Assessment',
                  nepaliTopic:
                    'अन्तर्वार्ता (परराष्ट्र बाहेक ४० अङ्क · परराष्ट्र सेवा ५० अङ्क)',
                  marksHint: '40 Marks (50M Foreign Service)',
                  brief:
                    'Assesses the candidate’s grasp of Nepal’s Constitution, public policy, current national/global affairs, service-specific responsibilities, ethical integrity, diplomatic/administrative poise, and citizen-centric attitude before final merit aggregation.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Section Officer Phase I PDF (p. 2) & Phase II PDF (Pages 27–31)',
          materialPath:
            '/materials/official-psc/psc-official-section-officer-phase2.pdf',
          materialTitle: 'Official SO Phase II & IT/Group Test PDF',
        },
      ],
    },
  ],
};
