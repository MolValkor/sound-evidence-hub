// Citation registry for the evidence hub.
// Every entry below was checked against PubMed (E-utilities), Crossref, or the
// publisher/agency page on 2026-10-07. `access` records what we actually read:
//   'abstract'  = PubMed / publisher abstract
//   'full-text' = open-access full text (PMC / publisher PDF)
//   'page'      = official agency / standards page
// Numbers quoted on the site come only from what we read. Re-verify before editing.

export type Access = 'abstract' | 'full-text' | 'page';

export interface Citation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  type: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
  url?: string; // used when there is no DOI/PMID (agency pages, standards)
  access: Access;
  finding: string; // what the source reported, paraphrased
}

export const citations: Record<string, Citation> = {
  // ---------- Institutional overviews ----------
  nccih2022: {
    id: 'nccih2022',
    authors: 'National Center for Complementary and Integrative Health (NIH)',
    year: 2022,
    title: 'Music and Health: What You Need To Know',
    journal: 'NCCIH fact sheet (last updated September 2022)',
    type: 'Government evidence overview',
    url: 'https://www.nccih.nih.gov/health/music-and-health-what-you-need-to-know',
    access: 'page',
    finding:
      'Says much of the research on music-based interventions is preliminary and few definite conclusions have been reached, while evidence suggests they may help anxiety, depressive symptoms and pain in a range of conditions. Notes that music therapy is defined by the training and credentials of the therapist, not by a type of activity.',
  },
  nccihReiki: {
    id: 'nccihReiki',
    authors: 'National Center for Complementary and Integrative Health (NIH)',
    year: 2018,
    title: 'Reiki',
    journal: 'NCCIH fact sheet (last updated December 2018)',
    type: 'Government evidence overview',
    url: 'https://www.nccih.nih.gov/health/reiki',
    access: 'page',
    finding:
      'Bottom line: Reiki "hasn’t been clearly shown to be effective for any health-related purpose," most research has not been high quality, and "there’s no scientific evidence supporting the existence of the energy field thought to play a role in Reiki."',
  },
  iso16: {
    id: 'iso16',
    authors: 'International Organization for Standardization',
    year: 1975,
    title: 'ISO 16:1975 Acoustics — Standard tuning frequency (Standard musical pitch)',
    journal: 'International Standard (confirmed, still current)',
    type: 'Technical standard',
    url: 'https://www.iso.org/standard/3601.html',
    access: 'page',
    finding:
      'Specifies that the note A in the treble stave shall be 440 Hz. It is a tuning convention for musicians — it makes no health claim either way.',
  },

  // ---------- Stress & anxiety ----------
  dewitte2020: {
    id: 'dewitte2020',
    authors: 'de Witte M, Spruit A, van Hooren S, Moonen X, Stams GJ',
    year: 2020,
    title: 'Effects of music interventions on stress-related outcomes: a systematic review and two meta-analyses',
    journal: 'Health Psychology Review 14(2):294–324',
    type: 'Systematic review & meta-analysis (104 RCTs)',
    doi: '10.1080/17437199.2019.1627897',
    pmid: '31167611',
    access: 'abstract',
    finding:
      '104 RCTs, 9,617 participants. Music interventions reduced stress on physiological measures (d = 0.38) and psychological measures (d = 0.55). Effects were larger on heart rate (d = 0.46) than on blood pressure (d = 0.34) or hormone levels (d = 0.35).',
  },
  dewitte2022: {
    id: 'dewitte2022',
    authors: 'de Witte M, Pinho ADS, Stams GJ, Moonen X, Bos AER, van Hooren S',
    year: 2022,
    title: 'Music therapy for stress reduction: a systematic review and meta-analysis',
    journal: 'Health Psychology Review 16(1):134–159',
    type: 'Systematic review & meta-analysis (47 studies)',
    doi: '10.1080/17437199.2020.1846580',
    pmid: '33176590',
    access: 'abstract',
    finding:
      '47 studies, 2,747 participants, music therapy delivered by a qualified music therapist only. Overall medium-to-large effect on stress-related outcomes (d = 0.72). Effects were larger in non-randomized trials and against waiting-list controls, which is a reminder that weaker designs inflate effects.',
  },

  // ---------- Surgery / procedures ----------
  bradt2013preop: {
    id: 'bradt2013preop',
    authors: 'Bradt J, Dileo C, Shim M',
    year: 2013,
    title: 'Music interventions for preoperative anxiety',
    journal: 'Cochrane Database of Systematic Reviews 2013(6):CD006908',
    type: 'Cochrane systematic review (26 trials)',
    doi: '10.1002/14651858.CD006908.pub2',
    pmid: '23740695',
    pmcid: 'PMC9758540',
    access: 'abstract',
    finding:
      '26 trials, 2,051 participants, all using recorded music. Music listening reduced pre-surgery anxiety by about 5.7 points on the STAI-State scale versus standard care, with small effects on heart rate and diastolic blood pressure. Most trials were at high risk of bias because participants could not be blinded.',
  },
  hole2015: {
    id: 'hole2015',
    authors: 'Hole J, Hirsch M, Ball E, Meads C',
    year: 2015,
    title: 'Music as an aid for postoperative recovery in adults: a systematic review and meta-analysis',
    journal: 'The Lancet 386(10004):1659–1671',
    type: 'Systematic review & meta-analysis (73 RCTs)',
    doi: '10.1016/S0140-6736(15)60169-6',
    pmid: '26277246',
    access: 'abstract',
    finding:
      '73 RCTs. Music before, during or after surgery reduced postoperative pain (SMD −0.77), anxiety (SMD −0.68) and pain-medication use (SMD −0.37), and increased satisfaction. Length of hospital stay did not change. Choice of music and timing made little difference.',
  },
  kuhlmann2018: {
    id: 'kuhlmann2018',
    authors: 'Kühlmann AYR, de Rooij A, Kroese LF, van Dijk M, Hunink MGM, Jeekel J',
    year: 2018,
    title: 'Meta-analysis evaluating music interventions for anxiety and pain in surgery',
    journal: 'British Journal of Surgery 105(7):773–783',
    type: 'Systematic review & meta-analysis (92 RCTs)',
    doi: '10.1002/bjs.10853',
    pmid: '29665028',
    pmcid: 'PMC6175460',
    access: 'abstract',
    finding:
      '92 RCTs, 7,385 patients. Music reduced anxiety (SMD −0.69) and pain (SMD −0.50) versus controls — roughly 21 mm and 10 mm on a 100 mm scale. Risk of bias in the studies was moderate to high.',
  },

  // ---------- Sleep ----------
  jespersen2022: {
    id: 'jespersen2022',
    authors: 'Jespersen KV, Pando-Naude V, Koenig J, Jennum P, Vuust P',
    year: 2022,
    title: 'Listening to music for insomnia in adults',
    journal: 'Cochrane Database of Systematic Reviews 2022(8):CD010459',
    type: 'Cochrane systematic review (13 RCTs)',
    doi: '10.1002/14651858.CD010459.pub3',
    pmid: '36000763',
    pmcid: 'PMC9400393',
    access: 'abstract',
    finding:
      '13 RCTs, 1,007 adults listening to recorded music 25–60 minutes a day. Moderate-certainty evidence of better self-rated sleep quality (PSQI −2.79 points). No clear effect on insomnia severity (very low certainty). Three small studies with objective sleep measures found no improvement. No adverse events reported.',
  },

  // ---------- Pain ----------
  lee2016: {
    id: 'lee2016',
    authors: 'Lee JH',
    year: 2016,
    title: 'The Effects of Music on Pain: A Meta-Analysis',
    journal: 'Journal of Music Therapy 53(4):430–477',
    type: 'Meta-analysis (97 RCTs)',
    doi: '10.1093/jmt/thw012',
    pmid: '27760797',
    access: 'abstract',
    finding:
      '97 RCTs. Music reduced pain by about 1.1 points on 0–10 scales, reduced emotional distress from pain, and lowered anesthetic, opioid and non-opioid use. Author concludes music may be an effective complementary approach for acute, procedural and cancer/chronic pain in medical settings.',
  },
  garza2017: {
    id: 'garza2017',
    authors: 'Garza-Villarreal EA, Pando V, Vuust P, Parsons C',
    year: 2017,
    title: 'Music-Induced Analgesia in Chronic Pain Conditions: A Systematic Review and Meta-Analysis',
    journal: 'Pain Physician 20(7):597–610',
    type: 'Systematic review & meta-analysis (14 RCTs)',
    pmid: '29149141',
    access: 'abstract',
    finding:
      '14 RCTs (25–200 patients each). Music reduced self-reported chronic pain and depressive symptoms, with a bigger effect when patients chose the music. Trials were small and heterogeneity was high.',
  },
  chen2025: {
    id: 'chen2025',
    authors: 'Chen S, Yuan Q, Wang C, Ye J, et al.',
    year: 2025,
    title: 'The effect of music therapy for patients with chronic pain: systematic review and meta-analysis',
    journal: 'BMC Psychology 13(1):455',
    type: 'Systematic review & meta-analysis (9 RCTs)',
    doi: '10.1186/s40359-025-02643-x',
    pmid: '40307940',
    pmcid: 'PMC12042639',
    access: 'full-text',
    finding:
      '9 RCTs, 787 patients. Music therapy reduced chronic pain (SMD −0.51, I² = 62%) and depression (4 RCTs, SMD −0.83, I² = 83%), but showed no significant effect on anxiety or quality of life (2 RCTs each).',
  },

  // ---------- Blood pressure / HRV ----------
  kuhlmann2016: {
    id: 'kuhlmann2016',
    authors: 'Kühlmann AY, Etnel JR, Roos-Hesselink JW, Jeekel J, Bogers AJ, Takkenberg JJ',
    year: 2016,
    title: 'Systematic review and meta-analysis of music interventions in hypertension treatment: a quest for answers',
    journal: 'BMC Cardiovascular Disorders 16:69',
    type: 'Systematic review & meta-analysis (10 RCTs)',
    doi: '10.1186/s12872-016-0244-0',
    pmid: '27095510',
    pmcid: 'PMC4837643',
    access: 'abstract',
    finding:
      '10 RCTs in people with hypertension (≥28 days follow-up). Blood pressure trended down in music groups, but the authors "failed to establish a cause-effect relationship" because control-group comparisons were not possible, and called for well-designed, adequately powered trials.',
  },
  doamaral2016: {
    id: 'doamaral2016',
    authors: 'do Amaral MA, Neto MG, de Queiroz JG, Martins-Filho PR, Saquetto MB, Oliveira Carvalho V',
    year: 2016,
    title: 'Effect of music therapy on blood pressure of individuals with hypertension: A systematic review and Meta-analysis',
    journal: 'International Journal of Cardiology 214:461–464',
    type: 'Systematic review & meta-analysis (3 studies)',
    doi: '10.1016/j.ijcard.2016.03.197',
    pmid: '27096963',
    access: 'abstract',
    finding:
      'Only three studies qualified. Systolic pressure was about 6.6 mmHg lower with music versus control; diastolic pressure did not differ significantly.',
  },
  mojtabavi2020: {
    id: 'mojtabavi2020',
    authors: 'Mojtabavi H, Saghazadeh A, Valenti VE, Rezaei N',
    year: 2020,
    title: 'Can music influence cardiac autonomic system? A systematic review and narrative synthesis to evaluate its impact on heart rate variability',
    journal: 'Complementary Therapies in Clinical Practice 39:101162',
    type: 'Systematic review (29 studies, mostly pre–post)',
    doi: '10.1016/j.ctcp.2020.101162',
    pmid: '32379689',
    access: 'abstract',
    finding:
      '29 studies (24 pre–post, 5 RCTs; 1,368 people). Most reported higher heart rate variability with music, but the authors note the effects are associated with a high risk of bias.',
  },
  bradt2013chd: {
    id: 'bradt2013chd',
    authors: 'Bradt J, Dileo C, Potvin N',
    year: 2013,
    title: 'Music for stress and anxiety reduction in coronary heart disease patients',
    journal: 'Cochrane Database of Systematic Reviews 2013(12):CD006577',
    type: 'Cochrane systematic review (26 trials)',
    doi: '10.1002/14651858.CD006577.pub3',
    pmid: '24374731',
    pmcid: 'PMC8454043',
    access: 'abstract',
    finding:
      '26 trials, 1,369 people with coronary heart disease. Music listening was linked to lower anxiety, heart rate (−3.4 bpm) and systolic blood pressure (−5.5 mmHg), but "no strong evidence for heart rate variability," the clinical significance is unclear, and many studies were at high risk of bias.',
  },

  // ---------- Mood / depression ----------
  aalbers2017: {
    id: 'aalbers2017',
    authors: 'Aalbers S, Fusar-Poli L, Freeman RE, Spreen M, Ket JC, Vink AC, et al.',
    year: 2017,
    title: 'Music therapy for depression',
    journal: 'Cochrane Database of Systematic Reviews 2017(11):CD004517',
    type: 'Cochrane systematic review (9 studies)',
    doi: '10.1002/14651858.CD004517.pub3',
    pmid: '29144545',
    pmcid: 'PMC6486188',
    access: 'abstract',
    finding:
      '9 studies, 421 people. Moderate-quality evidence that music therapy added to usual care improved depressive symptoms in the short term versus usual care alone (clinician-rated SMD −0.98; self-reported SMD −0.85), plus anxiety and functioning. Uncertain versus psychological therapies.',
  },
  tang2020: {
    id: 'tang2020',
    authors: 'Tang Q, Huang Z, Zhou H, Ye P',
    year: 2020,
    title: 'Effects of music therapy on depression: A meta-analysis of randomized controlled trials',
    journal: 'PLOS ONE 15(11):e0240862',
    type: 'Meta-analysis (55 RCTs)',
    doi: '10.1371/journal.pone.0240862',
    pmid: '33206656',
    pmcid: 'PMC7673528',
    access: 'abstract',
    finding:
      '55 RCTs. Music therapy reduced depressive symptoms (SMD −0.66) and music listening ("music medicine") also did (SMD −1.33). Short and medium-length programs did better than long ones; effects differed by method.',
  },

  // ---------- Music therapy in clinical settings ----------
  bradt2021: {
    id: 'bradt2021',
    authors: 'Bradt J, Dileo C, Myers-Coffman K, Biondo J',
    year: 2021,
    title: 'Music interventions for improving psychological and physical outcomes in people with cancer',
    journal: 'Cochrane Database of Systematic Reviews 2021(10):CD006911',
    type: 'Cochrane systematic review (81 trials)',
    doi: '10.1002/14651858.CD006911.pub4',
    pmid: '34637527',
    pmcid: 'PMC8510511',
    access: 'abstract',
    finding:
      '81 trials, 5,576 participants. Music may reduce anxiety, depression, pain and fatigue in adults with cancer, but certainty is low to very low because most trials were at high risk of bias. Results were more consistent when a trained music therapist delivered the intervention than for recorded-music ("music medicine") studies.',
  },
  vandersteen2025: {
    id: 'vandersteen2025',
    authors: 'van der Steen JT, van der Wouden JC, Methley AM, Smaling HJA, Vink AC, Bruinsma MS',
    year: 2025,
    title: 'Music-based therapeutic interventions for people with dementia',
    journal: 'Cochrane Database of Systematic Reviews 2025(3):CD003477',
    type: 'Cochrane systematic review (30 RCTs)',
    doi: '10.1002/14651858.CD003477.pub5',
    pmid: '40049590',
    pmcid: 'PMC11884930',
    access: 'abstract',
    finding:
      '30 RCTs, 1,720 people. Versus usual care, music-based interventions probably improve depressive symptoms slightly (SMD −0.23, moderate certainty) and may improve overall behavioural problems; they likely do not improve agitation, and show no clear effect on cognition, anxiety or well-being. No evidence of effects lasting four weeks after treatment ends.',
  },
  geretsegger2022: {
    id: 'geretsegger2022',
    authors: 'Geretsegger M, Fusar-Poli L, Elefant C, Mössler KA, Vitale G, Gold C',
    year: 2022,
    title: 'Music therapy for autistic people',
    journal: 'Cochrane Database of Systematic Reviews 2022(5):CD004381',
    type: 'Cochrane systematic review (26 studies)',
    doi: '10.1002/14651858.CD004381.pub4',
    pmid: '35532041',
    pmcid: 'PMC9082683',
    access: 'abstract',
    finding:
      '26 studies, 1,165 participants (mostly children). Moderate-certainty evidence that music therapy increases the chance of global improvement and improves overall autism severity and quality of life right after treatment; no clear difference for social interaction or verbal and non-verbal communication.',
  },

  // ---------- Singing bowls ----------
  stanhope2020: {
    id: 'stanhope2020',
    authors: 'Stanhope J, Weinstein P',
    year: 2020,
    title: 'The human health effects of singing bowls: A systematic review',
    journal: 'Complementary Therapies in Medicine 51:102412',
    type: 'Systematic review (4 studies)',
    doi: '10.1016/j.ctim.2020.102412',
    pmid: '32507429',
    access: 'abstract',
    finding:
      'Found only four peer-reviewed studies, two with low-level designs. Given so few studies and the risk of bias, the authors "cannot recommend singing bowl therapies at this stage" and call for more rigorous research.',
  },
  cai2025: {
    id: 'cai2025',
    authors: 'Cai Y, Yang G, Liu Y, Zou X, et al.',
    year: 2025,
    title: 'Therapeutic effects of singing bowls: A systematic review of clinical studies',
    journal: 'Integrative Medicine Research 14(2):101144',
    type: 'Systematic review (19 studies)',
    doi: '10.1016/j.imr.2025.101144',
    pmid: '40352083',
    pmcid: 'PMC12063014',
    access: 'full-text',
    finding:
      '19 clinical studies (2008–2024): 9 RCTs, 2 crossover studies, 1 non-randomized trial, 7 case series. Every RCT assessed had a high overall risk of bias, mainly in outcome measurement because blinding is hard. Heterogeneity prevented pooling for depression. Authors say bowls "may have potential" for anxiety, depression, sleep and cognition.',
  },
  goldsby2017: {
    id: 'goldsby2017',
    authors: 'Goldsby TL, Goldsby ME, McWalters M, Mills PJ',
    year: 2017,
    title: 'Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being: An Observational Study',
    journal: 'Journal of Evidence-Based Complementary & Alternative Medicine 22(3):401–406',
    type: 'Observational pre–post study (no control group)',
    doi: '10.1177/2156587216668109',
    pmid: '27694559',
    pmcid: 'PMC5871151',
    access: 'abstract',
    finding:
      '62 adults rated their mood before and after one sound-meditation session. Tension, anger, fatigue and depressed mood fell, and spiritual well-being rose. With no control group, the study can’t separate the bowls from rest, setting or expectation.',
  },
  landry2014: {
    id: 'landry2014',
    authors: 'Landry JM',
    year: 2014,
    title: 'Physiological and psychological effects of a Himalayan singing bowl in meditation practice: a quantitative analysis',
    journal: 'American Journal of Health Promotion 28(5):306–309',
    type: 'Randomized crossover (n = 51)',
    doi: '10.4278/ajhp.121031-ARB-528',
    pmid: '23941101',
    access: 'abstract',
    finding:
      '51 people did 12 minutes of singing bowl or 12 minutes of silence before a 20-minute guided relaxation. Systolic blood pressure (p = .044) and heart rate (p = .003) fell more after the bowl; mood scores improved in both conditions.',
  },
  rioalamos2023: {
    id: 'rioalamos2023',
    authors: 'Rio-Alamos C, Montefusco-Siegmund R, Cañete T, Sotomayor J, Fernandez-Teruel A',
    year: 2023,
    title: 'Acute Relaxation Response Induced by Tibetan Singing Bowl Sounds: A Randomized Controlled Trial',
    journal: 'European Journal of Investigation in Health, Psychology and Education 13(2):317–330',
    type: 'Randomized controlled trial (n = 50, single session)',
    doi: '10.3390/ejihpe13020024',
    pmid: '36826208',
    pmcid: 'PMC9955072',
    access: 'abstract',
    finding:
      '50 adults with high state anxiety: one singing-bowl session vs progressive muscle relaxation vs waiting list. Both active options lowered self-reported anxiety versus waiting list (more clearly for bowls), and the bowl group showed increased HRV. Single session, small sample.',
  },
  bergmann2020: {
    id: 'bergmann2020',
    authors: 'Bergmann M, Riedinger S, Stefani A, Mitterling T, Holzknecht E, Grassmayr P, Högl B',
    year: 2020,
    title: 'Effects of singing bowl exposure on Karolinska sleepiness scale and pupillographic sleepiness test: A randomised crossover study',
    journal: 'PLOS ONE 15(6):e0233982',
    type: 'Randomized crossover (n = 48)',
    doi: '10.1371/journal.pone.0233982',
    pmid: '32479559',
    pmcid: 'PMC7263600',
    access: 'abstract',
    finding:
      '20 minutes lying in a hammock above a struck vs silent singing bowl. People felt less sleepy afterwards with the struck bowl (p = 0.041), but an objective sleepiness measure (pupillography) showed no difference.',
  },

  // ---------- Gongs / sound baths ----------
  goldsby2022: {
    id: 'goldsby2022',
    authors: 'Goldsby TL, Goldsby ME, McWalters M, Mills PJ',
    year: 2022,
    title: 'Sound Healing: Mood, Emotional, and Spiritual Well-Being Interrelationships',
    journal: 'Religions 13(2):123',
    type: 'Observational study (secondary analysis, no control group)',
    doi: '10.3390/rel13020123',
    access: 'abstract',
    finding:
      '62 participants in a sound-healing session using singing bowls, gongs and other instruments. Improvements in spiritual well-being correlated with reductions in tension and depression scores after the session. Correlational, uncontrolled.',
  },

  // ---------- Binaural beats ----------
  garcia2019: {
    id: 'garcia2019',
    authors: 'Garcia-Argibay M, Santed MA, Reales JM',
    year: 2019,
    title: 'Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis',
    journal: 'Psychological Research 83(2):357–372',
    type: 'Meta-analysis (22 studies)',
    doi: '10.1007/s00426-018-1066-8',
    pmid: '30073406',
    access: 'abstract',
    finding:
      '22 studies, 35 effect sizes. Overall medium effect (g = 0.45) across memory, attention, anxiety and pain perception. Results depended on the beat frequency, how long people listened, and when exposure happened.',
  },
  ingendoh2023: {
    id: 'ingendoh2023',
    authors: 'Ingendoh RM, Posny ES, Heine A',
    year: 2023,
    title: 'Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity, and the implications for psychological research and intervention',
    journal: 'PLOS ONE 18(5):e0286023',
    type: 'Systematic review (14 EEG studies)',
    doi: '10.1371/journal.pone.0286023',
    pmid: '37205669',
    pmcid: 'PMC10198548',
    access: 'abstract',
    finding:
      'Tested the "brainwave entrainment" idea directly. Of 14 EEG studies, 5 supported entrainment, 8 contradicted it and 1 was mixed. Methods varied so much that results are hard to compare.',
  },

  // ---------- Vibroacoustic ----------
  kantor2022: {
    id: 'kantor2022',
    authors: 'Kantor J, Campbell EA, Kantorová L, Marečková J, Regec V, Karasová K, et al.',
    year: 2022,
    title: 'Exploring vibroacoustic therapy in adults experiencing pain: a scoping review',
    journal: 'BMJ Open 12(4):e046591',
    type: 'Scoping review (20 studies)',
    doi: '10.1136/bmjopen-2020-046591',
    pmid: '35383053',
    pmcid: 'PMC8984038',
    access: 'abstract',
    finding:
      '20 studies from 430 records; 40 Hz was most common, sessions 20–45 minutes. Conclusion: "Research in this area is too sparse to identify properties of VAT that are beneficial for pain management." RCTs are needed.',
  },
  braunjanzen2019: {
    id: 'braunjanzen2019',
    authors: 'Braun Janzen T, Paneduro D, Picard L, Gordon A, Bartel LR',
    year: 2019,
    title: 'A parallel randomized controlled trial examining the effects of rhythmic sensory stimulation on fibromyalgia symptoms',
    journal: 'PLOS ONE 14(3):e0212021',
    type: 'Randomized trial, two active arms (n = 50)',
    doi: '10.1371/journal.pone.0212021',
    pmid: '30822311',
    pmcid: 'PMC6396935',
    access: 'abstract',
    finding:
      '50 people with fibromyalgia got 40 Hz or complex gamma-range vibration 5 days a week for 5 weeks. Symptoms, pain interference, depression and sleep improved from baseline in both groups, with no difference between groups — and there was no untreated or sham control.',
  },

  // ---------- 40 Hz gamma ----------
  iaccarino2016: {
    id: 'iaccarino2016',
    authors: 'Iaccarino HF, Singer AC, Martorell AJ, Rudenko A, et al.',
    year: 2016,
    title: 'Gamma frequency entrainment attenuates amyloid load and modifies microglia',
    journal: 'Nature 540(7632):230–235',
    type: 'Animal study (mice)',
    doi: '10.1038/nature20587',
    pmid: '27929004',
    pmcid: 'PMC5656389',
    access: 'abstract',
    finding:
      'In Alzheimer’s-model mice, driving brain activity at 40 Hz (optogenetically, then with flickering light) reduced amyloid-β in the visual cortex. A mouse study using light, not sound.',
  },
  martorell2019: {
    id: 'martorell2019',
    authors: 'Martorell AJ, Paulson AL, Suk HJ, Abdurrob F, et al.',
    year: 2019,
    title: 'Multi-sensory Gamma Stimulation Ameliorates Alzheimer’s-Associated Pathology and Improves Cognition',
    journal: 'Cell 177(2):256–271.e22',
    type: 'Animal study (mice)',
    doi: '10.1016/j.cell.2019.02.014',
    pmid: '30879788',
    pmcid: 'PMC6774262',
    access: 'abstract',
    finding:
      'In mice, seven days of 40 Hz auditory tones reduced amyloid in auditory cortex and hippocampus and improved memory tasks; combined sound + light had broader effects. Still an animal study.',
  },
  chan2022: {
    id: 'chan2022',
    authors: 'Chan D, Suk HJ, Jackson BL, Milman NP, et al.',
    year: 2022,
    title: 'Gamma frequency sensory stimulation in mild probable Alzheimer’s dementia patients: Results of feasibility and pilot studies',
    journal: 'PLOS ONE 17(12):e0278412',
    type: 'Phase 1 feasibility + Phase 2A pilot RCT (n = 15)',
    doi: '10.1371/journal.pone.0278412',
    pmid: '36454969',
    pmcid: 'PMC9714926',
    access: 'abstract',
    finding:
      'Daily 40 Hz light-and-sound stimulation was safe and well tolerated. In a 15-person pilot over 3 months, the active group showed less brain atrophy and better scores on one memory test than controls. Authors call for a larger pivotal trial.',
  },

  // ---------- 432 Hz / solfeggio ----------
  calamassi2019: {
    id: 'calamassi2019',
    authors: 'Calamassi D, Pomponi GP',
    year: 2019,
    title: 'Music Tuned to 440 Hz Versus 432 Hz and the Health Effects: A Double-blind Cross-over Pilot Study',
    journal: 'EXPLORE 15(4):283–290',
    type: 'Crossover pilot (n = 33)',
    doi: '10.1016/j.explore.2019.04.001',
    pmid: '31031095',
    access: 'abstract',
    finding:
      '33 healthy volunteers heard the same film music at 440 Hz or 432 Hz tuning. Heart rate was about 4.8 bpm lower with 432 Hz (p = 0.05); blood pressure differences were not significant. The paper itself notes there were "no scientific studies" supporting 432 Hz claims before it.',
  },
  calamassi2020: {
    id: 'calamassi2020',
    authors: 'Calamassi D, Lucicesare A, Pomponi GP, Bambi S',
    year: 2020,
    title: 'Music tuned to 432 Hz versus music tuned to 440 Hz for improving sleep in patients with spinal cord injuries: a double-blind cross-over pilot study',
    journal: 'Acta Biomedica 91(12-S):e2020008',
    type: 'Crossover pilot (n = 12)',
    doi: '10.23750/abm.v91i12-S.10755',
    pmid: '33263352',
    pmcid: 'PMC8023109',
    access: 'abstract',
    finding:
      '12 patients with spinal cord injury. Sleep scores improved after 432 Hz music but not 440 Hz; stress did not change significantly at either tuning. Listening times and wash-out periods varied. Authors call for larger studies.',
  },
  akimoto2018: {
    id: 'akimoto2018',
    authors: 'Akimoto K, Hu A, Yamaguchi T, Kobayashi H',
    year: 2018,
    title: 'Effect of 528 Hz Music on the Endocrine System and Autonomic Nervous System',
    journal: 'Health 10(9):1159–1170',
    type: 'Crossover pilot (n = 9)',
    doi: '10.4236/health.2018.109088',
    url: 'https://www.scirp.org/pdf/Health_2018090514214117.pdf',
    access: 'full-text',
    finding:
      'Nine healthy adults listened to 5 minutes of piano music tuned to include 528 Hz or to standard 440 Hz. Salivary cortisol fell and oxytocin rose after the 528 Hz version. The authors themselves write that effects ascribed to solfeggio frequencies have no scientific basis.',
  },

  // ---------- Energy fields ----------
  rosa1998: {
    id: 'rosa1998',
    authors: 'Rosa L, Rosa E, Sarner L, Barrett S',
    year: 1998,
    title: 'A close look at therapeutic touch',
    journal: 'JAMA 279(13):1005–1010',
    type: 'Blinded test of a core claim (21 practitioners)',
    doi: '10.1001/jama.279.13.1005',
    pmid: '9533499',
    access: 'abstract',
    finding:
      '21 experienced Therapeutic Touch practitioners tried to sense which of their hands was near the investigator’s hand, a test of the "human energy field." They were right in 44% of 280 trials, close to the 50% expected by chance.',
  },
};

export function citationLinks(c: Citation) {
  const links: { label: string; href: string }[] = [];
  if (c.doi) links.push({ label: 'DOI', href: `https://doi.org/${c.doi}` });
  if (c.pmid) links.push({ label: 'PubMed', href: `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` });
  if (c.pmcid) links.push({ label: 'Free full text', href: `https://pmc.ncbi.nlm.nih.gov/articles/${c.pmcid}/` });
  if (c.url) links.push({ label: c.doi ? 'PDF' : 'Source', href: c.url });
  return links;
}

export function primaryHref(c: Citation) {
  if (c.doi) return `https://doi.org/${c.doi}`;
  if (c.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`;
  return c.url ?? '#';
}
