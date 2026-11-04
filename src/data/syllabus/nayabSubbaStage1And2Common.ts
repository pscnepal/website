import type { PscExamPhase, PscSyllabusPaper } from './types.ts';

export const NAYAB_SUBBA_PHASE_1: PscExamPhase = {
  id: 'ns-phase-1',
  phaseNumber: 1,
  title: 'Stage I · Preliminary Examination (प्रारम्भिक परीक्षा)',
  nepaliTitle: 'प्रथम चरण · प्रारम्भिक वस्तुगत छनोट परीक्षा (OMR)',
  summary:
    '45-minute OMR screening examination with 50 MCQs at 2 marks each = 100 Marks (Part 1: 30 GK [18 Level I + 12 Level II] = 60M · Part 2: 20 GMAT = 40M). Minimum 45 marks (45%) required after 20% negative deduction (-0.40 mark per wrong answer) to qualify for Stage II; Stage I marks are not added to final merit.',
  officialPdfPath:
    '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
  papers: [
    {
      id: 'ns-paper-1',
      code: 'Paper I',
      title: 'General Knowledge & General Mental Ability Test (GMAT)',
      nepaliTitle: 'सामान्य ज्ञान र सामान्य बौद्धिक परीक्षण',
      examFormat: 'Objective MCQ (OMR)',
      fullMarks: 100,
      passMarks: 45,
      durationLabel: '45 Minutes',
      questionBreakdown:
        '50 MCQs × 2 Marks = 100 Marks (30 GK [18 Level I + 12 Level II] = 60M · 20 GMAT = 40M)',
      scoringRule:
        'Pass Marks: 45 (45%) · -0.40M (20% of 2M) per wrong answer · Calculators prohibited · 0% carryover',
      countsTowardFinalMerit: false,
      units: [
        {
          id: 'ns-p1-u1',
          branchNumber: 1,
          unitCode: 'Part 1 · 1.1–1.6',
          title:
            'Universe, World & Nepal Geography, World & Nepal History, and Socio-Cultural Heritage (14 Qs = 28M)',
          nepaliTitle:
            '१.१ ब्रह्माण्ड (१), १.२ विश्व भूगोल (२), १.३ नेपालको भूगोल (४), १.४–१.५ इतिहास (३) र १.६ सामाजिक-सांस्कृतिक (४) — १४ प्रश्न (२८ अङ्क)',
          marksWeight: 28,
          branchSummary:
            'Covers the first six General Knowledge sub-sections of Nayab Subba Paper I totaling 14 MCQs × 2 Marks = 28 Marks.',
          subtopics: [
            '1.1 Universe — Solar system & Earth (1Q = 2M), 1.2 World Geography (2Q = 4M), and 1.3 Geography of Nepal (4Q = 8M)',
            '1.4 World History (1Q = 2M) and 1.5 History of Nepal — Kirat, Licchavi, Malla & Modern era (2Q = 4M)',
            '1.6 Social & Cultural Aspects of Nepal — customs, religions, castes/ethnicities, languages, art, literature & cultural heritage (4Q = 8M)',
          ],
          chapters: [
            {
              id: 'NS-P1-B01-CH01',
              chapterNumber: 1,
              code: 'Units 1.1–1.3',
              chapterName: 'Universe, World Geography and Geography of Nepal',
              nepaliChapterName:
                '१.१ ब्रह्माण्ड, १.२ विश्वको भूगोल र १.३ नेपालको भूगोल',
              marksAllocation: '7 Questions × 2 Marks = 14 Marks',
              chapterBrief:
                'Tests planetary astronomy, global physical features, and Nepal’s ecological belts, hydrography, climate, and natural resources.',
              topics: [
                {
                  id: 'NS-P1-B01-CH01-T01',
                  topicNumber: 1,
                  code: '1.1',
                  topic: 'General Knowledge on the Universe (1 Question = 2 Marks)',
                  nepaliTopic: 'ब्रह्माण्ड सम्बन्धी जानकारी (१ प्रश्न)',
                  brief:
                    'Covers astronomical fundamentals of the cosmos, solar system bodies, and planetary motions of the Earth.',
                  subtopics: [
                    {
                      id: 'NS-P1-B01-CH01-T01-S01',
                      subtopicNumber: 1,
                      code: '1.1.1',
                      subtopic:
                        'Solar System: Sun, planets, satellites, comets, meteors and asteroids',
                      nepaliSubtopic: 'सौर्यमण्डल: सूर्य, ग्रह, उपग्रह, शिशुग्रह र उल्का',
                      brief:
                        'Covers the 8 planets (inner terrestrial vs outer Jovian), orbital order, axial tilt, natural moons, Halley’s comet, asteroid belt, and eclipse geometry.',
                    },
                    {
                      id: 'NS-P1-B01-CH01-T01-S02',
                      subtopicNumber: 2,
                      code: '1.1.2',
                      subtopic: 'Earth: origin, structure, rotation and revolution',
                      nepaliSubtopic: 'पृथ्वीको उत्पत्ति र गति',
                      brief:
                        'Covers crust-mantle-core layers, daily rotation causing day/night and Coriolis deflection, and annual revolution causing seasons, solstices, and equinoxes.',
                    },
                  ],
                },
                {
                  id: 'NS-P1-B01-CH01-T02',
                  topicNumber: 2,
                  code: '1.2',
                  topic: 'Geography of the World (2 Questions = 4 Marks)',
                  nepaliTopic: 'विश्वको भूगोल (२ प्रश्न)',
                  brief:
                    'Covers continents, oceans, poles, latitude and longitude, time-zone calculation, International Date Line, mountain ranges, deserts, earthquakes, volcanoes, rivers, glaciers, lakes, and global wind/climate patterns.',
                },
                {
                  id: 'NS-P1-B01-CH01-T03',
                  topicNumber: 3,
                  code: '1.3',
                  topic: 'Geography of Nepal (4 Questions = 8 Marks)',
                  nepaliTopic: 'नेपालको भूगोल (४ प्रश्न)',
                  brief:
                    'High-weightage focus on Nepal’s physical divisions, natural resources, climate, and federal administrative boundaries.',
                  subtopics: [
                    {
                      id: 'NS-P1-B01-CH01-T03-S01',
                      subtopicNumber: 1,
                      code: '1.3.1',
                      subtopic: 'Topographical structure and ecological divisions',
                      nepaliSubtopic: 'धरातलीय स्वरूपको किसिम र विशेषता',
                      brief:
                        'Covers Himal (15%), Pahad (68%), and Terai (17%), Inner Terai valleys, Chure/Mahabharat ranges, and 8,000m+ peaks.',
                    },
                    {
                      id: 'NS-P1-B01-CH01-T03-S02',
                      subtopicNumber: 2,
                      code: '1.3.2',
                      subtopic: 'Natural resources: types, status and achievements',
                      nepaliSubtopic: 'प्राकृतिक स्रोतको किसिम र उपलब्धि',
                      brief:
                        'Covers Koshi, Gandaki, and Karnali river systems, lakes, glacial lakes, forest cover, soil types, and mineral deposits.',
                    },
                    {
                      id: 'NS-P1-B01-CH01-T03-S03',
                      subtopicNumber: 3,
                      code: '1.3.3',
                      subtopic:
                        'Geographical diversity, climatic zones and livelihood impact',
                      nepaliSubtopic: 'भौगोलिक विविधता र जनजीवन (हावापानीको किसिम र विशेषता)',
                      brief:
                        'Examines Nepal’s five altitudinal climatic zones (sub-tropical monsoon to tundra/alpine) and their influence on settlement, agriculture, and lifestyle.',
                    },
                    {
                      id: 'NS-P1-B01-CH01-T03-S04',
                      subtopicNumber: 4,
                      code: '1.3.4',
                      subtopic:
                        'Political and administrative divisions (7 Provinces, 77 Districts & 753 Local Levels)',
                      nepaliSubtopic: 'राजनीतिक र प्रशासनिक विभाजन',
                      brief:
                        'Covers provincial capitals, largest/smallest districts and municipalities/rural municipalities, and border districts touching India and China.',
                    },
                  ],
                },
              ],
            },
            {
              id: 'NS-P1-B01-CH02',
              chapterNumber: 2,
              code: 'Units 1.4–1.6',
              chapterName:
                'World History, History of Nepal and Socio-Cultural Heritage',
              nepaliChapterName:
                '१.४ विश्वको इतिहास, १.५ नेपालको इतिहास र १.६ सामाजिक एवं सांस्कृतिक अवस्था',
              marksAllocation: '7 Questions × 2 Marks = 14 Marks',
              chapterBrief:
                'Covers global revolutions/world wars, Nepal’s political-historical eras, and pluralistic Nepalese cultural traditions.',
              topics: [
                {
                  id: 'NS-P1-B01-CH02-T01',
                  topicNumber: 1,
                  code: '1.4',
                  topic: 'History of the World (1 Question = 2 Marks)',
                  nepaliTopic: 'विश्वको इतिहास (१ प्रश्न)',
                  brief:
                    'Covers Magna Carta (1215), Industrial Revolution, French Revolution (1789), American War of Independence (1776), Russian October Revolution (1917), World Wars I & II, and the Indian Independence Movement.',
                },
                {
                  id: 'NS-P1-B01-CH02-T02',
                  topicNumber: 2,
                  code: '1.5',
                  topic: 'History of Nepal (2 Questions = 4 Marks)',
                  nepaliTopic: 'नेपालको इतिहास (२ प्रश्न)',
                  brief:
                    'Covers ancient, medieval, and modern statecraft and democratic struggles of Nepal.',
                  subtopics: [
                    {
                      id: 'NS-P1-B01-CH02-T02-S01',
                      subtopicNumber: 1,
                      code: '1.5.1',
                      subtopic:
                        'Kirat, Licchavi and Medieval Malla social, economic & political conditions',
                      nepaliSubtopic:
                        'किराँत, लिच्छविकाल र मध्यकालको सामाजिक, आर्थिक एवं राजनीतिक अवस्था',
                      brief:
                        'Examines Kirat origins, Licchavi administrative offices and inscriptions, Malla architectural/legal reforms (Jayasthiti Malla), and Karnali/Gandaki principalities.',
                    },
                    {
                      id: 'NS-P1-B01-CH02-T02-S02',
                      subtopicNumber: 2,
                      code: '1.5.2',
                      subtopic: 'Modern History: major political events, causes and impacts',
                      nepaliSubtopic: 'आधुनिक इतिहास: राजनीतिक घटनाक्रम, कारण र परिणाम',
                      brief:
                        'Covers unification campaign, Sugauli Treaty, Kot/Bhandarkhal/Alau massacres, Rana rule, 2007 Revolution, 2036 Referendum, 2046 & 2062/63 People’s Movements, and 2072 Constitution.',
                    },
                  ],
                },
                {
                  id: 'NS-P1-B01-CH02-T03',
                  topicNumber: 3,
                  code: '1.6',
                  topic:
                    'Social and Cultural Aspects of Nepal (4 Questions = 8 Marks)',
                  nepaliTopic: 'नेपालको सामाजिक एवं सांस्कृतिक अवस्था (४ प्रश्न)',
                  brief:
                    'Tests Census 2078 socio-cultural demographics, heritage monuments, and creative traditions.',
                  subtopics: [
                    {
                      id: 'NS-P1-B01-CH02-T03-S01',
                      subtopicNumber: 1,
                      code: '1.6.1',
                      subtopic:
                        'Traditions, social values, religions, castes/ethnicities, languages, culture, art and literature',
                      nepaliSubtopic:
                        'प्रथा, परम्परा, मूल्य र मान्यता, धर्म, जातजाति, भाषाभाषी, संस्कृति, कला र साहित्य',
                      brief:
                        'Covers 142 castes/ethnicities, 124 mother tongues, 10 religions, indigenous festivals, folk instruments/dances, pagoda/stupa/shikhara architecture, and Nepali literary milestones.',
                    },
                    {
                      id: 'NS-P1-B01-CH02-T03-S02',
                      subtopicNumber: 2,
                      code: '1.6.2',
                      subtopic: 'Cultural heritage: types, features, importance and conservation',
                      nepaliSubtopic: 'सांस्कृतिक सम्पदाको किसिम, विशेषता, महत्व र संरक्षण',
                      brief:
                        'Covers Nepal’s 10 UNESCO World Heritage Sites (8 cultural + 2 natural), intangible cultural heritage, Guthi traditions, and Ancient Monument Preservation provisions.',
                    },
                  ],
                },
              ],
            },
          ],
          keyReferences:
            'Official Nayab Subba Phase I PDF · Nepal Parichaya Vol. I–III · Census 2078',
          materialPath: '/materials/nepal-parichaya-geography.pdf',
          materialTitle: 'Nepal Parichaya: Geography',
          quizHref: '/quiz/nepal-parichaya',
          quizLabel: 'Nepal Parichaya Quiz',
          simulatePresetId: 'nasu-phase1-omr',
        },
        {
          id: 'ns-p1-u2',
          branchNumber: 2,
          unitCode: 'Part 1 · 1.7–1.11',
          title:
            'Economy & Planning, Health & Science, Ecosystem, International Affairs & Current Events (16 Qs = 32M)',
          nepaliTitle:
            '१.७ आर्थिक अवस्था (३), १.८ स्वास्थ्य/विज्ञान (३), १.९ पारिस्थितिक पद्धति (३), १.१० अन्तर्राष्ट्रिय सम्बन्ध (२) र १.११ समसामयिक (५) — १६ प्रश्न (३२ अङ्क)',
          marksWeight: 32,
          branchSummary:
            'Covers Units 1.7 through 1.11 of Nayab Subba Paper I totaling 16 MCQs × 2 Marks = 32 Marks.',
          subtopics: [
            '1.7 Economic Status & Periodic Plans of Nepal — agriculture, industry, trade, tourism, transport, communication & 16th Plan (3Q = 6M)',
            '1.8 Health, Science & Technology (3Q = 6M) and 1.9 Ecosystem, Biodiversity, Climate Change & Environment Management (3Q = 6M)',
            '1.10 International Affairs — UN, SAARC, BIMSTEC, ASEAN & EU (2Q = 4M) and 1.11 Current Affairs, Polity & Prominent Personalities (5Q = 10M)',
          ],
          chapters: [
            {
              id: 'NS-P1-B02-CH03',
              chapterNumber: 3,
              code: 'Units 1.7–1.9',
              chapterName:
                'Nepalese Economy, Science & Public Health, and Ecosystem & Environment',
              nepaliChapterName:
                '१.७ आर्थिक अवस्था, १.८ स्वास्थ्य र विज्ञान प्रविधि तथा १.९ पारिस्थितिक पद्धति र वातावरण',
              marksAllocation: '9 Questions × 2 Marks = 18 Marks',
              chapterBrief:
                'Covers productive sectors, periodic plans, human health/ICT inventions, and biodiversity/environmental conservation.',
              topics: [
                {
                  id: 'NS-P1-B02-CH03-T01',
                  topicNumber: 1,
                  code: '1.7',
                  topic:
                    'Economic Status and Development Plans of Nepal (3 Questions = 6 Marks)',
                  nepaliTopic: 'नेपालको आर्थिक अवस्था र विकास योजना (३ प्रश्न)',
                  brief:
                    'Covers development infrastructure (agriculture, industry, trade, tourism, transport, communication, education, health, electricity) and periodic development plans from the First Plan (2013 BS) through the Sixteenth Plan (2081/82–2085/86).',
                },
                {
                  id: 'NS-P1-B02-CH03-T02',
                  topicNumber: 2,
                  code: '1.8',
                  topic: 'Health, Science and Technology (3 Questions = 6 Marks)',
                  nepaliTopic: 'स्वास्थ्य, विज्ञान र प्रविधि (३ प्रश्न)',
                  brief:
                    'Covers everyday scientific principles, public health/immunization, major scientists, ICT, and evolutionary biology.',
                  subtopics: [
                    {
                      id: 'NS-P1-B02-CH03-T02-S01',
                      subtopicNumber: 1,
                      code: '1.8.1–1.8.2',
                      subtopic:
                        'Direct impact of science & technology on human life, biological evolution and heredity',
                      nepaliSubtopic: 'मानव जीवनमा विज्ञान प्रविधिको प्रभाव र क्रमविकास/वंशाणु',
                      brief:
                        'Covers Darwin/Lamarck/Mendel basics, everyday physics/chemistry applications, and transformative inventions.',
                    },
                    {
                      id: 'NS-P1-B02-CH03-T02-S02',
                      subtopicNumber: 2,
                      code: '1.8.3–1.8.4',
                      subtopic:
                        'Health, diseases, vaccines, nutrition and Information & Communication Technology (ICT)',
                      nepaliSubtopic: 'स्वास्थ्य, रोग, खोप, पोषण तथा सूचना प्रविधि',
                      brief:
                        'Covers communicable/non-communicable diseases, vitamins/deficiencies, pioneer vaccine discoverers, and modern computing/internet/AI fundamentals.',
                    },
                  ],
                },
                {
                  id: 'NS-P1-B02-CH03-T03',
                  topicNumber: 3,
                  code: '1.9',
                  topic:
                    'Ecosystem and Environment Management (3 Questions = 6 Marks)',
                  nepaliTopic: 'पारिस्थितिक पद्धति र वातावरण (३ प्रश्न)',
                  brief:
                    'Examines ecological balance, global environmental challenges, and Nepal’s conservation network.',
                  subtopics: [
                    {
                      id: 'NS-P1-B02-CH03-T03-S01',
                      subtopicNumber: 1,
                      code: '1.9.1',
                      subtopic:
                        'Ecosystem concept, food chain, sustainable development and biodiversity',
                      nepaliSubtopic: 'पारिस्थितिक पद्धति, दिगो विकास र जैविक विविधता',
                      brief:
                        'Covers producers/consumers/decomposers, Brundtland sustainable development, 17 SDGs, protected wildlife/plant species, and National Parks/Ramsar sites.',
                    },
                    {
                      id: 'NS-P1-B02-CH03-T03-S02',
                      subtopicNumber: 2,
                      code: '1.9.2',
                      subtopic:
                        'Climate change, ozone depletion, pollution, population growth, urbanization & waste management',
                      nepaliSubtopic:
                        'जलवायु परिवर्तन, ओजोन विनाश, प्रदूषण, शहरीकरण र फोहोरमैला व्यवस्थापन',
                      brief:
                        'Covers greenhouse effect, Montreal/Kyoto/Paris accords, acid rain, smog, Census 2078 urban trends, and municipal waste mitigation.',
                    },
                  ],
                },
              ],
            },
            {
              id: 'NS-P1-B02-CH04',
              chapterNumber: 4,
              code: 'Units 1.10–1.11',
              chapterName:
                'International Affairs & Institutions and Current Affairs',
              nepaliChapterName:
                '१.१० अन्तर्राष्ट्रिय सम्बन्ध तथा संघसंस्था र १.११ राष्ट्रिय तथा अन्तर्राष्ट्रिय महत्वका समसामयिक गतिविधि',
              marksAllocation: '7 Questions × 2 Marks = 14 Marks',
              chapterBrief:
                'Covers Nepal’s diplomatic milestones, UN/regional blocs, and high-yield national/global current events and personalities.',
              topics: [
                {
                  id: 'NS-P1-B02-CH04-T01',
                  topicNumber: 1,
                  code: '1.10',
                  topic:
                    'International Affairs and Organizations (2 Questions = 4 Marks)',
                  nepaliTopic: 'अन्तर्राष्ट्रिय सम्बन्ध तथा संघसंस्था (२ प्रश्न)',
                  brief:
                    'Covers Nepal’s bilateral diplomacy (1.10.1), UN organs & specialized agencies (1.10.2), and regional organizations SAARC, BIMSTEC, ASEAN, and European Union (1.10.3).',
                },
                {
                  id: 'NS-P1-B02-CH04-T02',
                  topicNumber: 2,
                  code: '1.11',
                  topic:
                    'National and International Current Events and Personalities (5 Questions = 10 Marks)',
                  nepaliTopic:
                    'राष्ट्रिय र अन्तर्राष्ट्रिय महत्वका समसामयिक गतिविधि र व्यक्तित्वहरू (५ प्रश्न)',
                  brief:
                    'Covers major contemporary political, social, economic, cultural, scientific, sports, book/literary, prize/award (Nobel, Madan Puraskar, Ramon Magsaysay), summit, and prominent thinker/personality developments.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Nayab Subba Phase I PDF · 16th Periodic Plan Summary',
          materialPath:
            '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
          materialTitle: 'Official Nayab Subba Phase I PDF',
          quizHref: '/quiz/comprehensive-mock',
          quizLabel: '30-Q Integrated Mock',
          simulatePresetId: 'nasu-phase1-omr',
        },
        {
          id: 'ns-p1-u3',
          branchNumber: 3,
          unitCode: 'Part 2 · 2.1–2.3',
          title:
            'General Mental Ability Test (GMAT): Verbal (6Q), Quantitative (8Q) & Non-Verbal (6Q)',
          nepaliTitle:
            '२. सामान्य बौद्धिक परीक्षण — २.१ शाब्दिक (६), २.२ संख्यात्मक (८) र २.३ अशाब्दिक/चित्रात्मक (६) — २० प्रश्न (४० अङ्क)',
          marksWeight: 40,
          branchSummary:
            'Evaluates logical speed and precision across 20 GMAT items × 2 Marks = 40 Marks within the tight 45-minute total exam window.',
          subtopics: [
            '2.1 Verbal Reasoning (6 Qs × 2M = 12M): series, analogy, classification, coding-decoding, alphabetical/word order, ranking/direction & logical assertion',
            '2.2 Quantitative Reasoning (8 Qs × 2M = 16M): number series/matrix, arithmetic operations, percentage, fraction/decimal, ratio, average, profit-loss, time & work, and data interpretation',
            '2.3 Non-Verbal Reasoning (6 Qs × 2M = 12M): figure series, analogy, odd-one-out, Venn diagrams, figure matrix, analytical figure counting, cubes/dice & water/mirror images',
          ],
          chapters: [
            {
              id: 'NS-P1-B03-CH05',
              chapterNumber: 5,
              code: 'Part 2 · GMAT',
              chapterName: 'General Mental Ability Test (GMAT)',
              nepaliChapterName: '२. सामान्य बौद्धिक परीक्षण (२० प्रश्न × २ = ४० अङ्क)',
              marksAllocation: '20 Questions × 2 Marks = 40 Marks',
              chapterBrief:
                'Tests verbal, quantitative, and visual-spatial reasoning without calculators.',
              topics: [
                {
                  id: 'NS-P1-B03-CH05-T01',
                  topicNumber: 1,
                  code: '2.1',
                  topic: 'Verbal Reasoning Test (6 Questions = 12 Marks)',
                  nepaliTopic: 'शाब्दिक तार्किक परीक्षण (६ प्रश्न = १२ अङ्क)',
                  brief:
                    'Includes comprehension, vocabulary/jumble words, alphabetical/alphanumeric series, verbal analogy, odd-one-out classification, coding-decoding, direction/distance sense, order/ranking, assertion & reason, and logical deduction.',
                },
                {
                  id: 'NS-P1-B03-CH05-T02',
                  topicNumber: 2,
                  code: '2.2',
                  topic: 'Quantitative / Numerical Reasoning Test (8 Questions = 16 Marks)',
                  nepaliTopic: 'संख्यात्मक तार्किक परीक्षण (८ प्रश्न = १६ अङ्क)',
                  brief:
                    'Includes missing number series & matrices, common property, arithmetic operations, fraction & decimal conversions, percentage, ratio & proportion, average, profit & loss, date/calendar & clock, time & work, and tabular/chart data interpretation.',
                },
                {
                  id: 'NS-P1-B03-CH05-T03',
                  topicNumber: 3,
                  code: '2.3',
                  topic: 'Non-Verbal / Abstract Figural Reasoning Test (6 Questions = 12 Marks)',
                  nepaliTopic: 'अशाब्दिक (चित्रात्मक) तार्किक परीक्षण (६ प्रश्न = १२ अङ्क)',
                  brief:
                    'Includes visual figure series, figure analogy, figure classification, Venn diagrams, 3×3 figure matrices, pattern completion, embedded figures, triangle/square counting, paper folding/cutting, cubes & dice, and mirror/water reflections.',
                },
              ],
            },
          ],
          keyReferences:
            'Official Nayab Subba Phase I PDF (Pages 6–7) · GK & Aptitude Master Matrix',
          materialPath: '/materials/psc-gk-aptitude-outline.pdf',
          materialTitle: 'GK & Aptitude Master Matrix',
          quizHref: '/quiz/custom?subject=General%20Mental%20Ability%20(IQ)',
          quizLabel: 'IQ Practice Set',
          simulatePresetId: 'nasu-phase1-omr',
        },
      ],
    },
  ],
};

export const NAYAB_SUBBA_PAPER_2: PscSyllabusPaper = {
  id: 'ns-paper-2',
  code: 'Paper II',
  title: 'Contemporary Studies & Public Service Management',
  nepaliTitle:
    'समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन (सबै सेवाका लागि अनिवार्य र समान)',
  examFormat: 'Subjective Analytical & Case',
  fullMarks: 100,
  passMarks: 40,
  durationLabel: '2 Hours 30 Minutes',
  questionBreakdown:
    '14 Short Questions × 5 Marks (70M) + 3 Long Questions × 10 Marks (30M) = 100 Marks across Sections A (35M), B (35M) & C (30M)',
  scoringRule:
    'Minimum 40 marks required · Separate answer booklets per section · Counted directly in 240-mark Final Merit',
  countsTowardFinalMerit: true,
  units: [
    {
      id: 'ns-p2-u1',
      branchNumber: 1,
      unitCode: 'Section A · 35M',
      title:
        'Geographical, Social & Economic Status of Nepal (5×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (क) नेपालको भौगोलिक, सामाजिक र आर्थिक अवस्था (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers all 12 official topics of Chapter 1—spanning physical geography, natural resources, cultural diversity, economic sectors, three-pillar economy, periodic plans, demography, urbanization, environment, biodiversity, sustainable development, and social security/food sovereignty.',
      subtopics: [
        '1.1 Geographical status & resources, 1.2 Cultural/ethnic diversity, 1.3 Economic growth & key sectors, 1.4 Public/private/cooperative roles, and 1.5 Periodic planning (16th Plan)',
        '1.6 Demography, 1.7 Urbanization & migration, 1.8 Pollution, climate change & disaster management, 1.9 Biodiversity conservation, 1.10 Sustainable development, 1.11 Poverty/unemployment/health/education, and 1.12 Social security & food sovereignty',
      ],
      chapters: [
        {
          id: 'NS-P2-B01-CH01',
          chapterNumber: 1,
          code: 'Chapter 1',
          chapterName: 'Geographical, Social and Economic Status of Nepal',
          nepaliChapterName: '१. नेपालको भौगोलिक, सामाजिक र आर्थिक अवस्था',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Provides an integrated socio-economic and ecological diagnostic of contemporary Nepal.',
          topics: [
            {
              id: 'NS-P2-B01-CH01-T01',
              topicNumber: 1,
              code: '1.1',
              topic:
                'Geographical condition of Nepal, natural resources and heritage (types, features and conservation)',
              nepaliTopic:
                'नेपालको भौगोलिक अवस्था, प्राकृतिक स्रोत तथा सम्पदा (किसिम, विशेषता र संरक्षण)',
              brief:
                'Analyzes ecological belts, river basins, forests, minerals, and conservation challenges across Chure, Middle Hills, and Himalayas.',
            },
            {
              id: 'NS-P2-B01-CH01-T02',
              topicNumber: 2,
              code: '1.2',
              topic:
                'Social and cultural diversity, harmony and national unity (religion, ethnicity, language and customs)',
              nepaliTopic:
                'धर्म, जातजाति, भाषाभाषी, संस्कृति र सामाजिक सद्भाव एवं राष्ट्रिय एकता',
              brief:
                'Examines Nepal’s pluralistic fabric under Article 3 and strategies for preserving social harmony while eliminating discriminatory practices.',
            },
            {
              id: 'NS-P2-B01-CH01-T03',
              topicNumber: 3,
              code: '1.3',
              topic:
                'Economic development and major economic sectors (agriculture, industry, trade, tourism, foreign employment and infrastructure)',
              nepaliTopic:
                'आर्थिक विकासका प्रमुख पक्षहरू (कृषि, उद्योग, व्यापार, पर्यटन, वैदेशिक रोजगारी र पूर्वाधार)',
              brief:
                'Evaluates GDP contributions, structural bottlenecks, trade imbalances, remittance dependence, and productive sector transformation.',
            },
            {
              id: 'NS-P2-B01-CH01-T04',
              topicNumber: 4,
              code: '1.4',
              topic:
                'Role of government (public), private and cooperative sectors in economic development',
              nepaliTopic: 'आर्थिक विकासमा सरकारी, निजी र सहकारी क्षेत्रको भूमिका',
              brief:
                'Analyzes Nepal’s constitutional three-pillar economic policy (Article 51(d)), public-private synergy, and cooperative sector regulation.',
            },
            {
              id: 'NS-P2-B01-CH01-T05',
              topicNumber: 5,
              code: '1.5',
              topic:
                'Planned development in Nepal and the current periodic plan (Sixteenth Plan)',
              nepaliTopic: 'योजनाबद्ध विकास र चालु आवधिक योजना (सोह्रौं योजना)',
              brief:
                'Reviews achievements/gaps of periodic planning since 2013 BS and covers vision, objectives, quantitative targets, and strategies of the 16th Plan (2081/82–2085/86).',
            },
            {
              id: 'NS-P2-B01-CH01-T06',
              topicNumber: 6,
              code: '1.6',
              topic: 'Population management and demographic status of Nepal',
              nepaliTopic: 'जनसङ्ख्या व्यवस्थापन र जनसांख्यिक अवस्था',
              brief:
                'Covers Census 2078 indicators, demographic dividend window, aging trends, and National Population Policy priorities.',
            },
            {
              id: 'NS-P2-B01-CH01-T07',
              topicNumber: 7,
              code: '1.7',
              topic: 'Urbanization and migration: causes, trends and management',
              nepaliTopic: 'शहरीकरण र बसाइँसराइ',
              brief:
                'Examines push-pull drivers of internal hill-to-Terai/urban migration and external labor migration, unplanned urban sprawl, and rural revitalization.',
            },
            {
              id: 'NS-P2-B01-CH01-T08',
              topicNumber: 8,
              code: '1.8',
              topic:
                'Environmental pollution, climate change and crisis/disaster management',
              nepaliTopic:
                'वातावरण प्रदूषण, जलवायु परिवर्तन र विपद् व्यवस्थापन',
              brief:
                'Covers air/water/solid-waste pollution, Himalayan climate vulnerability, adaptation/mitigation, and three-tier disaster governance under the DRRM Act, 2074.',
            },
            {
              id: 'NS-P2-B01-CH01-T09',
              topicNumber: 9,
              code: '1.9',
              topic: 'Biodiversity, rare wildlife/plants and conservation efforts',
              nepaliTopic: 'जैविक विविधता र संरक्षण',
              brief:
                'Covers ecosystem/species/genetic diversity, protected areas, buffer-zone community participation, and anti-poaching conservation.',
            },
            {
              id: 'NS-P2-B01-CH01-T10',
              topicNumber: 10,
              code: '1.10',
              topic: 'Sustainable development and Sustainable Development Goals (SDGs)',
              nepaliTopic: 'दिगो विकास र दिगो विकासका लक्ष्यहरू',
              brief:
                'Examines balancing economic, social, and environmental pillars and localizing the 17 SDGs (2016–2030) across provincial and local budgets.',
            },
            {
              id: 'NS-P2-B01-CH01-T11',
              topicNumber: 11,
              code: '1.11',
              topic: 'Poverty, unemployment, public health and education in Nepal',
              nepaliTopic: 'गरिबी, बेरोजगारी, जनस्वास्थ्य र शिक्षा',
              brief:
                'Analyzes multidimensional poverty reduction, youth employment programs, universal basic healthcare, and quality/technical education reforms.',
            },
            {
              id: 'NS-P2-B01-CH01-T12',
              topicNumber: 12,
              code: '1.12',
              topic:
                'Social security, social protection, food security and food sovereignty',
              nepaliTopic: 'सामाजिक सुरक्षा र खाद्य सम्प्रभुता',
              brief:
                'Covers contributory and non-contributory social protection schemes and constitutional guarantees of food security and farmers’ food sovereignty (Article 36).',
            },
          ],
        },
      ],
      keyReferences:
        'Official Nayab Subba Phase II PDF · 16th Periodic Plan Summary · Census 2078',
      materialPath: '/materials/sixteenth-plan-summary.pdf',
      materialTitle: 'Sixteenth Plan Summary',
      writtenHref: '/written/PSC-WR-301',
      writtenLabel: '16th Plan Model Answer',
      simulatePresetId: 'written-paper-3',
    },
    {
      id: 'ns-p2-u2',
      branchNumber: 2,
      unitCode: 'Section B · 35M',
      title: 'Constitutional System & Government (5×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ख) संवैधानिक व्यवस्था र सरकार (५×५ + १×१० = ३५ अङ्क)',
      marksWeight: 35,
      branchSummary:
        'Covers the Constitution of Nepal (2072), federalism, civic duties/education, meaning/sources of law, rule of law, inclusion, democracy/human rights, RTI, e-governance, and good governance/anti-corruption.',
      subtopics: [
        '2.1 Constitution of Nepal (2.1.1–2.1.4) & Federalism in Nepal, 2.2 Citizen duties, civil society & civic education, 2.3–2.5 Law, sources of law & Rule of Law',
        '2.6 Inclusion & proportional representation, 2.7 Democracy & human rights, 2.8 RTI & transparency, 2.9 E-governance, and 2.10 Good governance, morality & anti-corruption',
      ],
      chapters: [
        {
          id: 'NS-P2-B02-CH02',
          chapterNumber: 2,
          code: 'Chapter 2',
          chapterName: 'Constitutional System and Government',
          nepaliChapterName: '२. संवैधानिक व्यवस्था र सरकार',
          marksAllocation: '5 Short Qs × 5M + 1 Long Q × 10M = 35 Marks',
          chapterBrief:
            'Tests constitutional literacy, federal interrelations, legal foundations, inclusion, transparency, and public integrity.',
          topics: [
            {
              id: 'NS-P2-B02-CH02-T01',
              topicNumber: 1,
              code: '2.1',
              topic: 'Constitution of Nepal and Federal Governance Structure',
              nepaliTopic: 'नेपालको संविधान र संघीय शासन प्रणाली',
              brief:
                'Comprehensive study of the 2072 Constitution and three-tier cooperative federalism.',
              subtopics: [
                {
                  id: 'NS-P2-B02-CH02-T01-S01',
                  subtopicNumber: 1,
                  code: '2.1.1',
                  subtopic: 'Salient features of the Constitution of Nepal',
                  nepaliSubtopic: 'नेपालको संविधानका प्रमुख विशेषताहरू',
                  brief:
                    'Covers republicanism, federalism, secularism, inclusion, 31 fundamental rights, mixed electoral system, and constitutional supremacy.',
                },
                {
                  id: 'NS-P2-B02-CH02-T01-S02',
                  subtopicNumber: 2,
                  code: '2.1.2',
                  subtopic:
                    'Fundamental Rights and Duties, Directive Principles, Policies and State Obligations',
                  nepaliSubtopic:
                    'मौलिक हक र कर्तव्य तथा राज्यका निर्देशक सिद्धान्त, नीति र दायित्व',
                  brief:
                    'Examines Parts 3 and 4 (Articles 16–55), distinguishing enforceable rights from guiding state policies.',
                },
                {
                  id: 'NS-P2-B02-CH02-T01-S03',
                  subtopicNumber: 3,
                  code: '2.1.3',
                  subtopic:
                    'Structure of State, distribution of state power (Schedules 5–9) and interrelations among Federation, Province and Local Level',
                  nepaliSubtopic:
                    'राज्यको संरचना, राज्यशक्तिको बाँडफाँट र संघ, प्रदेश र स्थानीय तहबीचको अन्तरसम्बन्ध',
                  brief:
                    'Covers Part 5 and Part 20 (Articles 56–60, 231–237)—cooperative, coexistent, and coordinative federalism across legislative, executive, and fiscal spheres.',
                },
                {
                  id: 'NS-P2-B02-CH02-T01-S04',
                  subtopicNumber: 4,
                  code: '2.1.4',
                  subtopic: 'Constitutional Bodies: introduction and major functions',
                  nepaliSubtopic: 'संवैधानिक निकायहरूको परिचय र प्रमुख कार्यहरू',
                  brief:
                    'Covers CIAA, OAG, PSC, Election Commission, NHRC, NNRFC, and the seven inclusive commissions.',
                },
              ],
            },
            {
              id: 'NS-P2-B02-CH02-T02',
              topicNumber: 2,
              code: '2.2',
              topic: 'Responsibilities of citizens, civil society and civic education',
              nepaliTopic: 'नागरिकका दायित्व, नागरिक समाज र नागरिक शिक्षा',
              brief:
                'Covers Article 48 citizen duties, autonomous watchdog/advocacy roles of civil society, and civic education for informed democratic participation.',
            },
            {
              id: 'NS-P2-B02-CH02-T03',
              topicNumber: 3,
              code: '2.3–2.4',
              topic: 'Meaning and importance of law; sources of law and judicial precedent',
              nepaliTopic: 'कानूनको अर्थ र महत्व तथा कानूनका स्रोत र नजिर',
              brief:
                'Explains statutory legislation, delegated rules/bylaws, custom, international conventions, and Supreme Court precedents (Najir, Article 128(4)).',
            },
            {
              id: 'NS-P2-B02-CH02-T04',
              topicNumber: 4,
              code: '2.5',
              topic: 'Rule of law (Kanuni Rajya)',
              nepaliTopic: 'कानूनको शासन (विधिको शासन)',
              brief:
                'Covers supremacy of law, equality before law, independent judiciary, absence of arbitrary power, and procedural fairness in administration.',
            },
            {
              id: 'NS-P2-B02-CH02-T05',
              topicNumber: 5,
              code: '2.6–2.7',
              topic:
                'Inclusion, proportional representation, democratic values and human rights',
              nepaliTopic:
                'समावेशीकरण, समानुपातिक प्रतिनिधित्व, लोकतान्त्रिक मूल्य मान्यता र मानव अधिकार',
              brief:
                'Analyzes positive discrimination, inclusive representation in state organs and civil service, pluralistic democracy, and human rights protection.',
            },
            {
              id: 'NS-P2-B02-CH02-T06',
              topicNumber: 6,
              code: '2.8–2.9',
              topic: 'Right to Information, transparency and E-governance',
              nepaliTopic: 'सूचनाको हक, पारदर्शिता र विद्युतीय शासन (ई–गभर्नेन्स)',
              brief:
                'Covers proactive disclosure and Information Officer duties under RTI Act 2064 alongside digital public service portals and GIOMS/Nagarik App.',
            },
            {
              id: 'NS-P2-B02-CH02-T07',
              topicNumber: 7,
              code: '2.10',
              topic:
                'Good governance, integrity, morality and anti-corruption provisions',
              nepaliTopic: 'सुशासन, सदाचार, नैतिकता र भ्रष्टाचार नियन्त्रण',
              brief:
                'Examines Good Governance Act 2064, Prevention of Corruption Act 2059, zero-tolerance corruption control, and ethical conduct in public office.',
            },
          ],
        },
      ],
      keyReferences:
        'Constitution of Nepal (2072) · RTI Act, 2064 · Good Governance Act, 2064 · Corruption Prevention Act, 2059',
      materialPath: '/materials/constitution-of-nepal-2072.pdf',
      materialTitle: 'Constitution of Nepal (2072)',
      writtenHref: '/written/PSC-WR-202',
      writtenLabel: 'Federalism 10M Q&A',
      simulatePresetId: 'written-office-nasu',
    },
    {
      id: 'ns-p2-u3',
      branchNumber: 3,
      unitCode: 'Section C · 30M',
      title: 'Public Service Operation & Management (4×5M + 1×10M)',
      nepaliTitle:
        'खण्ड (ग) सार्वजनिक सेवा सञ्चालन एवं व्यवस्थापन (४×५ + १×१० = ३० अङ्क)',
      marksWeight: 30,
      branchSummary:
        'Covers Office Management (3.1), Public Accounting & Revenue Administration (3.2), Civil Service across three tiers (3.3), and Public Service Delivery & Citizen Charter (3.4).',
      subtopics: [
        '3.1 Office Management: office functions, auxiliary staff, correspondence/Tippani/filing/records & MIS (3.1.1–3.1.4)',
        '3.2 Accounting & Revenue Admin: budget, govt accounting, auditing, tax/customs/excise & Store/Jinsi (3.2.1–3.2.5)',
        '3.3 Civil Service (federal, provincial & local services) & 3.4 Public Service Delivery, Citizen Charter & accountability (3.4.1–3.4.3)',
      ],
      chapters: [
        {
          id: 'NS-P2-B03-CH03',
          chapterNumber: 3,
          code: 'Chapter 3',
          chapterName: 'Public Service Operation and Management',
          nepaliChapterName: '३. सार्वजनिक सेवा सञ्चालन एवं व्यवस्थापन',
          marksAllocation: '4 Short Qs × 5M + 1 Long Q × 10M = 30 Marks',
          chapterBrief:
            'Equips Non-Gazetted First Class supervisors with core office, financial, personnel, and frontline service delivery competencies.',
          topics: [
            {
              id: 'NS-P2-B03-CH03-T01',
              topicNumber: 1,
              code: '3.1',
              topic: 'Office Management (कार्यालय व्यवस्थापन)',
              nepaliTopic: 'कार्यालय व्यवस्थापन',
              brief:
                'Covers frontline office organization, documentation workflows, and Management Information Systems.',
              subtopics: [
                {
                  id: 'NS-P2-B03-CH03-T01-S01',
                  subtopicNumber: 1,
                  code: '3.1.1–3.1.2',
                  subtopic:
                    'Office concept, importance & functions; roles and qualities of auxiliary (Sahayak) personnel',
                  nepaliSubtopic: 'कार्यालयको परिचय र सहायक स्तरका कर्मचारीको भूमिका',
                  brief:
                    'Defines the office as the nerve center of administration and details supervisory, drafting, record-keeping, and citizen-helpdesk duties of Nayab Subba staff.',
                },
                {
                  id: 'NS-P2-B03-CH03-T01-S02',
                  subtopicNumber: 2,
                  code: '3.1.3–3.1.4',
                  subtopic:
                    'Office procedures (Darta, Chalani, correspondence, circular, Tippani, filing, indexing, record management) and Management Information System (MIS)',
                  nepaliSubtopic:
                    'कार्यालय कार्यविधि (दर्ता, चलानी, पत्राचार, टिप्पणी, फाइलिङ, अभिलेख) र व्यवस्थापन सूचना प्रणाली (MIS)',
                  brief:
                    'Covers statutory rules for drafting Tippani (facts, relevant law, clear recommendation), filing/indexing retrieval, digital record archiving, and MIS decision support.',
                },
              ],
            },
            {
              id: 'NS-P2-B03-CH03-T02',
              topicNumber: 2,
              code: '3.2',
              topic:
                'Accounting and Revenue Administration (लेखा तथा राजस्व प्रशासन)',
              nepaliTopic: 'लेखा तथा राजस्व प्रशासन',
              brief:
                'Covers foundational public financial management, taxation, inventory, and auditing.',
              subtopics: [
                {
                  id: 'NS-P2-B03-CH03-T02-S01',
                  subtopicNumber: 1,
                  code: '3.2.1–3.2.3',
                  subtopic:
                    'Government accounting system, budget concept & types, and internal vs final auditing (Beruju)',
                  nepaliSubtopic: 'सरकारी लेखा प्रणाली, बजेट र लेखापरीक्षण',
                  brief:
                    'Covers double-entry cash accounting, TSA/CGAS basics, Goshwara Voucher & Bank Cash Book, recurrent/capital budget, DTCO internal audit, and OAG final audit.',
                },
                {
                  id: 'NS-P2-B03-CH03-T02-S02',
                  subtopicNumber: 2,
                  code: '3.2.4–3.2.5',
                  subtopic:
                    'Public revenue (Income Tax, VAT, Customs, Excise, non-tax revenue) and Store/Inventory (Jinsi) management',
                  nepaliSubtopic: 'राजस्व (कर र गैरकर) तथा जिन्सी व्यवस्थापन',
                  brief:
                    'Introduces direct/indirect taxes and store management of expendable/non-expendable public goods via PAMS.',
                },
              ],
            },
            {
              id: 'NS-P2-B03-CH03-T03',
              topicNumber: 3,
              code: '3.3',
              topic: 'Civil Service (निजामती सेवा)',
              nepaliTopic: 'निजामती सेवा तथा प्रदेश र स्थानीय सरकारी सेवा',
              brief:
                'Covers constitution, recruitment, career conditions, duties, code of conduct, and ethical accountability of civil employees (3.3.1–3.3.2), plus basic provisions for Provincial and Local government services (3.3.3).',
            },
            {
              id: 'NS-P2-B03-CH03-T04',
              topicNumber: 4,
              code: '3.4',
              topic: 'Public Service Delivery (सार्वजनिक सेवा प्रवाह)',
              nepaliTopic: 'सार्वजनिक सेवा प्रवाह, नागरिक वडापत्र र उत्तरदायित्व',
              brief:
                'Examines meaning, principles, agencies, and traditional vs digital service delivery methods (3.4.1), Citizen Charter & grievance redressal (3.4.2), and accountability/responsiveness toward service seekers (3.4.3).',
            },
          ],
        },
      ],
      keyReferences:
        'Official Nayab Subba Phase II PDF · Good Governance Act, 2064 · Civil Service Act, 2049',
      materialPath:
        '/materials/official-psc/psc-official-nayab-subba-phase2.pdf',
      materialTitle: 'Official Nayab Subba Phase II PDF',
      quizHref: '/quiz/language-and-writing',
      quizLabel: 'Official Writing MCQs',
      writtenHref: '/written/PSC-WR-402',
      writtenLabel: 'Darta-Chalani & Records Q&A',
      simulatePresetId: 'written-office-nasu',
    },
  ],
};

export const NAYAB_SUBBA_PHASE_3: PscExamPhase = {
  id: 'ns-phase-3',
  phaseNumber: 3,
  title: 'Final Stage · Computer Skill Test & Interview (अन्तिम चरण)',
  nepaliTitle:
    'अन्तिम चरण · कम्प्युटर सीप परीक्षण (१०) र अन्तर्वार्ता (३०) — ४० अङ्क',
  summary:
    '15-minute practical computer skill test (10 Marks) and oral board interview (30 Marks) open exclusively to candidates passing Stage II written papers. Combined with Stage II (200M) for the 240-mark Final Merit Ranking.',
  officialPdfPath:
    '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
  officialPscUrl:
    'https://psc.gov.np/site_uploads/course/2024072511021066a230b2d30f6.pdf',
  papers: [
    {
      id: 'ns-paper-4',
      code: 'Final Stage',
      title: 'Computer Skill Test & Oral Interview',
      nepaliTitle: 'कम्प्युटर सीप परीक्षण र मौखिक अन्तर्वार्ता',
      examFormat: 'Practical & Oral Viva',
      fullMarks: 40,
      passMarks: null,
      durationLabel: '15 Min Practical + Viva',
      questionBreakdown:
        'Computer Skill Test (10 Marks · 15 Min: Devanagari 2.5M, English 2.5M, Windows & Word 5M) · Oral Interview (30 Marks)',
      scoringRule:
        'Combined with Stage II Written Marks (200M) for 240-Mark Final Merit Ranking',
      countsTowardFinalMerit: true,
      units: [
        {
          id: 'ns-p4-u1',
          branchNumber: 1,
          unitCode: 'Final Stage · 40M',
          title:
            'Devanagari/English Typing, Windows & Word Processing (10M) and Interview (30M)',
          nepaliTitle:
            'नेपाली/अंग्रेजी टाइपिङ र वर्ड प्रोसेसिङ (१० अङ्क) तथा अन्तर्वार्ता (३० अङ्क)',
          marksWeight: 40,
          branchSummary:
            'Evaluates hands-on bilingual typing speed, Windows/MS-Word document preparation, and oral service suitability.',
          subtopics: [
            'Computer Skill Test (10 Marks, 15 Minutes): Devanagari Unicode typing (150 words text, 2.5M, 5 min), English typing (200 words text, 2.5M, 5 min), and Windows Basic & Word Processing formatting (5M, 5 min)',
            'Oral Interview Board (30 Marks): Office problem-solving, statutory awareness, communication clarity, and public service attitude',
          ],
          chapters: [
            {
              id: 'NS-P3F-B01-CH01',
              chapterNumber: 1,
              code: 'Practical (10M)',
              chapterName: 'Practical Computer Skill Test (15 Minutes)',
              nepaliChapterName: '१. प्रयोगात्मक कम्प्युटर सीप परीक्षण (१० अङ्क · १५ मिनेट)',
              marksAllocation: '2.5M + 2.5M + 5M = 10 Marks',
              chapterBrief:
                'Tests live Unicode Nepali typing, English typing, Windows file operations, and MS Word formatting.',
              topics: [
                {
                  id: 'NS-P3F-B01-CH01-T01',
                  topicNumber: 1,
                  code: '1.1',
                  topic: 'Devanagari Typing (2.5 Marks · 5 Minutes · ~150 words)',
                  nepaliTopic: 'देवनगरी टाइपिङ (२.५ अङ्क · ५ मिनेट)',
                  brief:
                    'Scored on net correct words per minute (Effective WPM = [Correct Words / 5]), requiring clean Unicode conjuncts without minimum-speed disqualification below 5 correct words.',
                },
                {
                  id: 'NS-P3F-B01-CH01-T02',
                  topicNumber: 2,
                  code: '1.2',
                  topic: 'English Typing (2.5 Marks · 5 Minutes · ~200 words)',
                  nepaliTopic: 'अंग्रेजी टाइपिङ (२.५ अङ्क · ५ मिनेट)',
                  brief:
                    'Evaluates accurate capitalization, punctuation, and net English WPM within 5 minutes.',
                },
                {
                  id: 'NS-P3F-B01-CH01-T03',
                  topicNumber: 3,
                  code: '1.3',
                  topic:
                    'Windows Basic and Word Processing / MS Word (5 Marks · 5 Minutes)',
                  nepaliTopic: 'विन्डोज बेसिक र वर्ड प्रोसेसिङ (५ अङ्क · ५ मिनेट)',
                  brief:
                    'Creating/renaming folders and files in Windows Explorer and formatting an official document in MS Word (page margins, paragraph alignment, line spacing, tables, headers/footers, bullet lists, and saving).',
                },
              ],
            },
            {
              id: 'NS-P3F-B01-CH02',
              chapterNumber: 2,
              code: 'Viva (30M)',
              chapterName: 'Oral Board Interview',
              nepaliChapterName: '२. मौखिक अन्तर्वार्ता (३० अङ्क)',
              marksAllocation: '30 Marks',
              chapterBrief:
                'Assesses personality, ethical composure, frontline citizen communication, and practical knowledge of service laws.',
              topics: [
                {
                  id: 'NS-P3F-B01-CH02-T01',
                  topicNumber: 1,
                  code: '2.1',
                  topic:
                    'Individual Oral Interview Board (30 Marks)',
                  nepaliTopic: 'व्यक्तिगत मौखिक अन्तर्वार्ता बोर्ड',
                  brief:
                    'Tests practical problem-solving at public service counters, constitutional/legal awareness, contemporary developments, impartiality, and courteous public demeanor.',
                },
              ],
            },
          ],
          keyReferences: 'Official Nayab Subba Phase I PDF (Pages 9–11)',
          materialPath:
            '/materials/official-psc/psc-official-nayab-subba-phase1.pdf',
          materialTitle: 'Official Nayab Subba Scheme PDF',
        },
      ],
    },
  ],
};
