// Evidence topics: one entry per claim people commonly make about sound and music.
// Ratings follow the scale explained on /how-to-read/. Every citation id must exist
// in ./citations.ts. Keep summaries consistent with the verified `finding` text there.

export type Rating = 'strong' | 'moderate' | 'preliminary' | 'not-supported';
export type Category = 'Outcomes' | 'Practices & tools' | 'Frequency & energy claims';

export interface Topic {
  slug: string;
  title: string;
  claim: string; // the claim as people commonly phrase it
  category: Category;
  rating: Rating;
  ratingScope: string; // what exactly the rating applies to
  summary: string; // plain-language bottom line
  whatWeKnow: string[];
  whatItDoesNotShow: string[];
  sayThis: string; // accurate phrasing
  notThis: string; // phrasing to avoid
  citations: string[];
  keywords: string[];
}

export const ratingLabel: Record<Rating, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  preliminary: 'Preliminary',
  'not-supported': 'Not supported',
};

export const ratingBlurb: Record<Rating, string> = {
  strong:
    'Consistent benefit across several systematic reviews or meta-analyses of many randomized trials. The effect is real, though not necessarily large, and the trials still have limitations.',
  moderate:
    'Benefit shown in at least one good systematic review (often Cochrane) with moderate-certainty findings for a specific outcome, but evidence is narrower, smaller, shorter-term or less consistent.',
  preliminary:
    'Early signals from small, uncontrolled, single-session, animal or high-risk-of-bias studies. Worth studying; not enough to promise results.',
  'not-supported':
    'The specific claim lacks credible evidence, or careful tests have contradicted the mechanism it depends on.',
};

export const ratingOrder: Rating[] = ['strong', 'moderate', 'preliminary', 'not-supported'];

export const topics: Topic[] = [
  {
    slug: 'surgery-anxiety-pain',
    title: 'Anxiety & pain around surgery',
    claim: 'Music calms patients and eases pain before, during and after medical procedures.',
    category: 'Outcomes',
    rating: 'strong',
    ratingScope: 'Recorded music as an add-on to usual surgical care, for self-reported anxiety and pain.',
    summary:
      'This is the best-supported claim on the site. Three large reviews covering 26, 73 and 92 randomized trials all found that listening to music around surgery lowers anxiety and pain, and one found people needed somewhat less pain medication. The trials mostly used ordinary recorded music on headphones, not sound baths or special frequencies.',
    whatWeKnow: [
      'Cochrane (26 trials, 2,051 people): music before surgery lowered anxiety by about 5.7 points on a standard 20–80 anxiety scale.',
      'Lancet meta-analysis (73 RCTs): less postoperative pain and anxiety, less pain medication, higher satisfaction; it worked even under general anaesthesia.',
      'BJS meta-analysis (92 RCTs, 7,385 patients): roughly a 21 mm drop in anxiety and 10 mm drop in pain on a 100 mm scale.',
      'The type of music and its timing made little difference.',
    ],
    whatItDoesNotShow: [
      'It did not shorten hospital stays.',
      'Most trials could not blind patients, so expectation may account for part of the effect.',
      'It says nothing about tuning (432/528 Hz), bowls, gongs or vibration.',
    ],
    sayThis: 'Listening to music you like can help many people feel calmer and notice less pain around medical procedures, alongside normal care.',
    notThis: 'Sound replaces anaesthesia or pain medication.',
    citations: ['bradt2013preop', 'hole2015', 'kuhlmann2018'],
    keywords: ['surgery', 'hospital', 'procedure', 'anxiety', 'pain', 'perioperative', 'analgesia'],
  },
  {
    slug: 'stress-anxiety',
    title: 'Everyday stress & anxiety',
    claim: 'Music and sound reduce stress.',
    category: 'Outcomes',
    rating: 'moderate',
    ratingScope: 'Music listening and music therapy, for short-term stress measures (self-report, heart rate, blood pressure, hormones).',
    summary:
      'Across more than 100 randomized trials, music reduced both how stressed people felt and physical stress markers like heart rate. The effects are small-to-medium for body measures and medium for feelings. Sessions with a trained music therapist showed bigger effects, though weaker study designs inflated some of them.',
    whatWeKnow: [
      '104 RCTs (9,617 people): music lowered physiological stress (d ≈ 0.38) and psychological stress (d ≈ 0.55).',
      'Heart rate responded more than blood pressure or stress hormones.',
      'Music therapy delivered by a qualified therapist (47 studies): medium-to-large effect (d ≈ 0.72).',
      'NIH’s NCCIH summarizes this research as promising but still largely preliminary.',
    ],
    whatItDoesNotShow: [
      'These are mostly short-term, in-the-moment effects, not proof of lasting change.',
      'It does not show that any specific instrument, frequency or "vibration" is what helps.',
      'It is not evidence for treating anxiety disorders as a stand-alone therapy.',
    ],
    sayThis: 'Music is a well-studied, low-risk way to help people relax and feel less stressed in the moment.',
    notThis: 'Sound healing cures anxiety.',
    citations: ['dewitte2020', 'dewitte2022', 'nccih2022'],
    keywords: ['stress', 'anxiety', 'relaxation', 'cortisol', 'calm', 'nervous system'],
  },
  {
    slug: 'sleep',
    title: 'Sleep',
    claim: 'Music helps you sleep better.',
    category: 'Outcomes',
    rating: 'moderate',
    ratingScope: 'Listening to recorded music daily, for self-rated sleep quality in adults with insomnia symptoms.',
    summary:
      'A 2022 Cochrane review found moderate-certainty evidence that people with insomnia symptoms who listened to music daily rated their sleep quality better. But insomnia severity didn’t clearly change, and the few studies that measured sleep objectively found no improvement.',
    whatWeKnow: [
      '13 RCTs (1,007 adults), music 25–60 minutes a day for 3 days to 3 months.',
      'Self-rated sleep quality improved by about 2.8 points on the 0–21 PSQI scale (moderate certainty).',
      'Low-certainty hints of faster sleep onset and longer sleep time on questionnaires.',
      'No adverse events were reported.',
    ],
    whatItDoesNotShow: [
      'No clear effect on insomnia severity (very low certainty).',
      'Objective sleep measures (3 studies, 136 people) did not improve.',
      'Nothing here tests 432 Hz, binaural beats or bowls specifically.',
    ],
    sayThis: 'A calming music routine may help people feel they slept better.',
    notThis: 'Music cures insomnia.',
    citations: ['jespersen2022', 'nccih2022'],
    keywords: ['sleep', 'insomnia', 'bedtime', 'rest'],
  },
  {
    slug: 'chronic-pain',
    title: 'Chronic & everyday pain',
    claim: 'Music relieves pain.',
    category: 'Outcomes',
    rating: 'moderate',
    ratingScope: 'Music listening or music therapy as an add-on, for self-reported pain intensity.',
    summary:
      'Several meta-analyses agree that music modestly lowers how much pain people report, especially for procedures and in medical settings, and it may also lift mood in people with chronic pain. Studies are small and varied, and self-chosen music seems to work better than music chosen by researchers.',
    whatWeKnow: [
      '97 RCTs: about 1 point lower pain on a 0–10 scale and less pain-medication use.',
      'Chronic pain (14 RCTs): lower pain and depressive symptoms; bigger effect with self-chosen music.',
      '2025 meta-analysis (9 RCTs, 787 patients): chronic pain SMD −0.51; no clear effect on anxiety or quality of life.',
    ],
    whatItDoesNotShow: [
      'Effects are modest; heterogeneity between studies is high.',
      'It does not show music fixes the underlying cause of pain.',
      'Vibroacoustic devices and bowls are separate questions (see those topics).',
    ],
    sayThis: 'Music can be a helpful add-on for coping with pain, and choosing your own music seems to matter.',
    notThis: 'Sound frequencies heal the source of pain or replace pain treatment.',
    citations: ['lee2016', 'garza2017', 'chen2025', 'nccih2022'],
    keywords: ['pain', 'chronic pain', 'fibromyalgia', 'analgesia', 'opioid'],
  },
  {
    slug: 'blood-pressure-hrv',
    title: 'Blood pressure & heart rate variability',
    claim: 'Sound lowers blood pressure and boosts HRV / "tones the vagus nerve."',
    category: 'Outcomes',
    rating: 'preliminary',
    ratingScope: 'Music interventions for resting blood pressure in hypertension and for heart rate variability (HRV).',
    summary:
      'Music can lower heart rate and blood pressure briefly, especially in stressful medical settings. But reviews of people with high blood pressure could not show that music causes a lasting drop, and HRV studies are mostly before-and-after designs at high risk of bias. The "vagus nerve" story is a plausible idea, not an established clinical finding.',
    whatWeKnow: [
      'Heart disease patients (Cochrane, 26 trials): lower heart rate (−3.4 bpm) and systolic pressure (−5.5 mmHg), but "no strong evidence" for HRV.',
      'Hypertension (10 RCTs): blood pressure trended down, but a cause-effect link could not be established.',
      'A 3-study meta-analysis found ~6.6 mmHg lower systolic pressure; diastolic didn’t differ.',
      'HRV review (29 studies, mostly pre–post): most reported higher HRV, with high risk of bias.',
    ],
    whatItDoesNotShow: [
      'No good evidence that music or sound treats hypertension long-term.',
      'No study we found shows bowls, gongs or tuning frequencies treat disease through the vagus nerve.',
    ],
    sayThis: 'Relaxing with music can temporarily lower heart rate and blood pressure for some people.',
    notThis: 'Sound healing treats high blood pressure or "resets the vagus nerve."',
    citations: ['bradt2013chd', 'kuhlmann2016', 'doamaral2016', 'mojtabavi2020'],
    keywords: ['blood pressure', 'hypertension', 'heart', 'HRV', 'vagus', 'vagal', 'nervous system', 'cardiac'],
  },
  {
    slug: 'mood-depression',
    title: 'Mood & depression',
    claim: 'Music lifts mood and helps with depression.',
    category: 'Outcomes',
    rating: 'moderate',
    ratingScope: 'Music therapy added to usual treatment, for short-term depressive symptoms.',
    summary:
      'Cochrane found moderate-quality evidence that music therapy added to usual care reduces depressive symptoms in the short term. A larger 55-trial meta-analysis agrees on direction. The evidence supports music as a complement to treatment, not a replacement.',
    whatWeKnow: [
      'Cochrane (9 studies, 421 people): large short-term improvements versus usual care alone, plus less anxiety and better functioning.',
      '55 RCTs: music therapy SMD −0.66; music listening also helped.',
      'Shorter and medium-length programs did better than long ones.',
    ],
    whatItDoesNotShow: [
      'Unclear whether music therapy beats psychological therapies.',
      'Mostly short-term follow-up.',
      'Doesn’t show that a single sound bath treats depression.',
    ],
    sayThis: 'Music therapy can be a useful addition to depression care, and music can lift mood in the moment.',
    notThis: 'Sound healing is a treatment for depression on its own.',
    citations: ['aalbers2017', 'tang2020'],
    keywords: ['mood', 'depression', 'emotional', 'wellbeing', 'happiness'],
  },
  {
    slug: 'music-therapy-clinical',
    title: 'Music therapy in clinical settings',
    claim: 'Music therapy helps patients in hospitals, care homes and clinics.',
    category: 'Practices & tools',
    rating: 'moderate',
    ratingScope: 'Music therapy by trained therapists, for specific outcomes in cancer, dementia and autism. Varies by condition.',
    summary:
      'Music therapy is a credentialed health profession, and it has one of the deepest research bases of anything on this site. Cochrane reviews find real but often modest benefits for specific outcomes: anxiety and depression in cancer care, slight mood benefits in dementia, and global improvement in autism. Benefits tend to fade after therapy stops, and many trials have bias risks.',
    whatWeKnow: [
      'Cancer (81 trials): may reduce anxiety, depression, pain and fatigue; results were more consistent when a trained music therapist delivered it.',
      'Dementia (30 RCTs): probably a slight improvement in depressive symptoms; no clear effect on cognition or agitation; no lasting effect 4+ weeks after.',
      'Autism (26 studies): moderate-certainty evidence for global improvement and quality of life right after therapy.',
    ],
    whatItDoesNotShow: [
      'Sound baths, bowls and wellness sessions are not music therapy, and these results don’t transfer to them.',
      'NCCIH notes the largest single autism trial (364 children) found no difference in social-communication symptom severity.',
      'Certainty is often low or very low for cancer outcomes.',
    ],
    sayThis: 'Board-certified music therapists have good evidence for specific goals in specific patient groups.',
    notThis: 'Our sound sessions are music therapy (unless delivered by a credentialed music therapist).',
    citations: ['bradt2021', 'vandersteen2025', 'geretsegger2022', 'nccih2022'],
    keywords: ['music therapy', 'cancer', 'dementia', 'autism', 'hospital', 'clinical', 'MT-BC'],
  },
  {
    slug: 'singing-bowls',
    title: 'Singing bowls',
    claim: 'Tibetan / Himalayan / crystal singing bowls reduce stress and heal.',
    category: 'Practices & tools',
    rating: 'preliminary',
    ratingScope: 'Singing bowl sessions for relaxation, mood, anxiety and related short-term measures.',
    summary:
      'Small studies suggest people often feel calmer and less tense after a singing-bowl session, and a few controlled trials show short-term relaxation effects. But two systematic reviews say the evidence is too thin or too biased to recommend bowls as therapy. Every RCT in the 2025 review had a high risk of bias.',
    whatWeKnow: [
      '2020 review: only 4 studies; authors "cannot recommend singing bowl therapies at this stage."',
      '2025 review: 19 studies (9 RCTs); all RCTs high risk of bias; "may have potential" for anxiety, depression, sleep.',
      'Single-session RCT (50 anxious adults): less self-reported anxiety than waiting list, increased HRV.',
      'Crossover (51 people): slightly larger drop in blood pressure and heart rate than silence before guided relaxation.',
    ],
    whatItDoesNotShow: [
      'No evidence bowls treat any disease (cancer, Parkinson’s, autism, etc.).',
      'Uncontrolled pre–post studies can’t separate bowls from rest, setting and expectation.',
      'In one crossover, people felt less sleepy after a struck bowl, but an objective test showed no difference.',
    ],
    sayThis: 'Many people find singing-bowl sessions relaxing, and early studies are encouraging, but the research is still young.',
    notThis: 'Singing bowls heal the body or treat illness.',
    citations: ['stanhope2020', 'cai2025', 'rioalamos2023', 'landry2014', 'goldsby2017', 'bergmann2020'],
    keywords: ['singing bowl', 'tibetan', 'himalayan', 'crystal bowl', 'sound bath', 'sound meditation'],
  },
  {
    slug: 'gongs-sound-baths',
    title: 'Gongs & sound baths',
    claim: 'Gong baths and group sound baths reset the nervous system.',
    category: 'Practices & tools',
    rating: 'preliminary',
    ratingScope: 'Group sound-bath sessions using gongs and mixed instruments, for mood and well-being.',
    summary:
      'This is the thinnest file on the site. We found no controlled trial testing gongs specifically. The available evidence is two uncontrolled observational reports from one research group on sound-meditation sessions (singing bowls, gongs and other instruments), where people reported less tension and better mood afterwards. That supports "people often feel better after a session," and nothing more specific.',
    whatWeKnow: [
      '62 adults reported less tension, anger, fatigue and depressed mood after one session (no control group).',
      'Improvements in spiritual well-being correlated with drops in tension and depression scores.',
    ],
    whatItDoesNotShow: [
      'No gong-specific randomized trials found.',
      'No evidence for claims about "resetting" the nervous system, detox or cellular effects.',
    ],
    sayThis: 'Sound baths are a relaxing, meditative experience that many people enjoy; research is very limited.',
    notThis: 'A gong bath resets your nervous system or releases stored trauma.',
    citations: ['goldsby2017', 'goldsby2022'],
    keywords: ['gong', 'sound bath', 'gong bath', 'group session', 'sound healing'],
  },
  {
    slug: 'binaural-beats',
    title: 'Binaural beats',
    claim: 'Binaural beats entrain your brainwaves to reduce anxiety and boost focus.',
    category: 'Practices & tools',
    rating: 'preliminary',
    ratingScope: 'Binaural-beat audio for anxiety, pain perception and cognition, and the "brainwave entrainment" mechanism.',
    summary:
      'A 2019 meta-analysis found a medium overall effect in experimental studies on memory, attention, anxiety and pain perception. But a 2023 review that directly checked whether binaural beats actually entrain brainwaves found mostly contradictory results. So there may be some effect on how people feel or perform, but the popular mechanism is not established.',
    whatWeKnow: [
      '22 studies: overall medium effect (g = 0.45), depending on frequency, listening time and timing.',
      'EEG review (14 studies): 5 supported entrainment, 8 contradicted it, 1 mixed.',
    ],
    whatItDoesNotShow: [
      'Not evidence that binaural tracks treat anxiety disorders, ADHD or insomnia.',
      '"Brainwave entrainment" is not a reliable, demonstrated mechanism.',
    ],
    sayThis: 'Some lab studies find binaural beats help people feel calmer or focus a bit; the science is mixed.',
    notThis: 'This track reprograms your brainwaves.',
    citations: ['garcia2019', 'ingendoh2023'],
    keywords: ['binaural', 'brainwave', 'entrainment', 'theta', 'alpha', 'focus', 'headphones'],
  },
  {
    slug: 'vibroacoustic',
    title: 'Vibroacoustic therapy',
    claim: 'Low-frequency vibration (beds, chairs, mats) relieves pain.',
    category: 'Practices & tools',
    rating: 'preliminary',
    ratingScope: 'Device-delivered low-frequency vibration (often 40 Hz), for pain and related symptoms.',
    summary:
      'Vibroacoustic therapy delivers sound vibration through the body with special beds or chairs. A 2022 scoping review concluded research is "too sparse" to say what helps for pain. A fibromyalgia trial found improvements in both groups but had no sham or no-treatment control.',
    whatWeKnow: [
      'Scoping review: 20 studies; 40 Hz most common; sessions 20–45 minutes; RCTs needed.',
      'Fibromyalgia trial (50 people): symptoms improved in both 40 Hz and complex-wave groups, with no difference between them.',
    ],
    whatItDoesNotShow: [
      'No well-controlled evidence that it reduces pain beyond placebo or usual care.',
      'Vibroacoustic research is about devices; it doesn’t transfer to singing bowls or sound baths.',
    ],
    sayThis: 'Vibroacoustic therapy is an interesting area of research with early, uncontrolled results.',
    notThis: 'Vibration therapy is proven to relieve chronic pain.',
    citations: ['kantor2022', 'braunjanzen2019'],
    keywords: ['vibroacoustic', 'VAT', 'vibration', '40 Hz', 'sound bed', 'fibromyalgia'],
  },
  {
    slug: 'gamma-40hz',
    title: '40 Hz sound & light (gamma stimulation)',
    claim: '40 Hz sound clears Alzheimer’s plaques / boosts brain health.',
    category: 'Frequency & energy claims',
    rating: 'preliminary',
    ratingScope: '40 Hz sensory stimulation for Alzheimer’s-related brain changes.',
    summary:
      'This is real, serious neuroscience, but it is early. In mice, 40 Hz light and sound reduced Alzheimer’s-related amyloid and improved memory tasks. A small human pilot (15 people) found the stimulation safe and showed some encouraging signals. Larger trials are needed before anyone can claim benefits for people.',
    whatWeKnow: [
      'Mice (Nature 2016): 40 Hz light flicker reduced amyloid-β in visual cortex.',
      'Mice (Cell 2019): 40 Hz tones reduced amyloid and improved memory; sound + light had wider effects.',
      'Human pilot (n = 15, 3 months): safe and well tolerated; less brain atrophy and better on one memory test than controls.',
    ],
    whatItDoesNotShow: [
      'Mouse results often don’t translate to people.',
      'The protocols use precise, device-generated 40 Hz stimulation, not bowls, gongs or music "tuned" to a frequency.',
      'No proof yet that it prevents or treats dementia in humans.',
    ],
    sayThis: 'Researchers are studying 40 Hz light and sound for Alzheimer’s; early results are interesting but unproven in people.',
    notThis: 'Our 40 Hz session protects your brain from dementia.',
    citations: ['iaccarino2016', 'martorell2019', 'chan2022'],
    keywords: ['40 Hz', 'gamma', 'alzheimer', 'dementia', 'amyloid', 'GENUS', 'brain'],
  },
  {
    slug: '432-hz-solfeggio',
    title: '432 Hz & solfeggio frequencies',
    claim: '432 Hz is "the natural frequency," and 528 Hz / solfeggio tones heal DNA and the body.',
    category: 'Frequency & energy claims',
    rating: 'not-supported',
    ratingScope: 'Health or healing claims for 432 Hz tuning and solfeggio frequencies (e.g., 528 Hz).',
    summary:
      'Standard tuning (A = 440 Hz) is a musicians’ convention, not a health decision. The only studies comparing 432 Hz or 528 Hz with 440 Hz are tiny pilots (9 to 33 people) with small, short-term differences such as a few beats per minute in heart rate. The authors of the 528 Hz study themselves write that solfeggio claims have no scientific basis. Nothing supports claims about DNA repair, "healing frequencies" or being "in tune with the universe."',
    whatWeKnow: [
      'ISO 16 sets A = 440 Hz as the standard tuning pitch; it makes no health claim.',
      '432 vs 440 Hz (33 healthy people): heart rate ~4.8 bpm lower with 432 Hz (p = 0.05); blood pressure not significantly different.',
      '432 vs 440 Hz sleep pilot: 12 patients; sleep scores improved with 432 Hz only.',
      '528 Hz (9 people, 5 minutes): cortisol fell and oxytocin rose versus 440 Hz.',
    ],
    whatItDoesNotShow: [
      'No large or independent trials; no disease outcomes.',
      'No evidence for DNA repair, cellular healing or "miracle tone" claims.',
      '432 Hz is only about a third of a semitone below 440 Hz; pilots this small can’t rule out chance or expectation.',
    ],
    sayThis: 'Some people prefer the sound of 432 Hz tuning; a few tiny pilot studies exist, but no health benefit has been established.',
    notThis: '528 Hz repairs DNA. 432 Hz heals the body.',
    citations: ['iso16', 'calamassi2019', 'calamassi2020', 'akimoto2018'],
    keywords: ['432', '528', '440', 'solfeggio', 'frequency', 'tuning', 'DNA', 'miracle tone', 'hz'],
  },
  {
    slug: 'chakras-energy',
    title: 'Chakras, energy fields & "frequency healing"',
    claim: 'Specific tones balance chakras, clear energy blockages or heal the biofield.',
    category: 'Frequency & energy claims',
    rating: 'not-supported',
    ratingScope: 'Claims that sound acts on chakras, an energy field or a biofield to heal.',
    summary:
      'These claims depend on a human energy field that has never been demonstrated. NIH’s complementary-health center says there is no scientific evidence that such a field exists, and a classic blinded test found experienced practitioners couldn’t detect it better than chance. Chakras can be meaningful as a spiritual or contemplative framework, but they are not a measurable health mechanism.',
    whatWeKnow: [
      'NCCIH: no scientific evidence supports the existence of the energy field Reiki relies on; Reiki hasn’t been clearly shown effective for any health purpose.',
      'JAMA 1998: 21 practitioners located the "energy field" in 44% of 280 trials, about what chance would give.',
    ],
    whatItDoesNotShow: [
      'There’s no study showing a tone "balances" a chakra in any measurable way.',
      'Feeling relaxed or moved during a session is real, but it doesn’t confirm the energy explanation.',
    ],
    sayThis: 'Many people use chakra imagery as a meditative or spiritual framework during sound practice.',
    notThis: 'This frequency clears blocked chakras and heals your energy body.',
    citations: ['nccihReiki', 'rosa1998'],
    keywords: ['chakra', 'energy', 'biofield', 'reiki', 'aura', 'frequency healing', 'vibration', 'spiritual'],
  },
];
