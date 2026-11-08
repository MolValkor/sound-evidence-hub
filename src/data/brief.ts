// One-line bottom lines for the shareable Evidence Brief (/brief/ and
// public/evidence-brief.pdf). Each line must stay consistent with the topic summary
// in ./topics.ts and the verified `finding` text in ./citations.ts. Only put numbers
// here that appear in those findings. `refs` must be ids from ./citations.ts.

export interface BriefLine {
  slug: string; // topic slug in ./topics.ts
  line: string;
  refs: string[];
}

export const briefLines: BriefLine[] = [
  {
    slug: 'surgery-anxiety-pain',
    line: 'Recorded music around surgery lowered anxiety and pain in reviews of 26, 73 and 92 randomized trials; one also found less pain-medication use. Hospital stays were not shorter.',
    refs: ['bradt2013preop', 'hole2015', 'kuhlmann2018'],
  },
  {
    slug: 'stress-anxiety',
    line: 'Across 104 randomized trials, music reduced how stressed people felt and short-term body measures such as heart rate. Effects were small to medium and mostly in the moment.',
    refs: ['dewitte2020', 'dewitte2022'],
  },
  {
    slug: 'sleep',
    line: 'Daily music listening improved self-rated sleep quality in adults with insomnia symptoms (moderate certainty). Insomnia severity and objectively measured sleep did not clearly improve.',
    refs: ['jespersen2022'],
  },
  {
    slug: 'chronic-pain',
    line: 'As an add-on, music lowered reported pain by about 1 point on a 0–10 scale across 97 trials. Self-chosen music did better; studies vary a lot.',
    refs: ['lee2016', 'garza2017', 'chen2025'],
  },
  {
    slug: 'mood-depression',
    line: 'Music therapy added to usual care reduced depressive symptoms in the short term (moderate-quality evidence). A complement to treatment, not a replacement.',
    refs: ['aalbers2017', 'tang2020'],
  },
  {
    slug: 'music-therapy-clinical',
    line: 'Credentialed music therapy shows real but often modest benefits for specific outcomes in cancer care, dementia and autism. These results do not transfer to sound baths.',
    refs: ['bradt2021', 'vandersteen2025', 'geretsegger2022'],
  },
  {
    slug: 'blood-pressure-hrv',
    line: 'Music can briefly lower heart rate and blood pressure. Reviews could not show it treats high blood pressure, and HRV studies carry a high risk of bias.',
    refs: ['bradt2013chd', 'kuhlmann2016', 'mojtabavi2020'],
  },
  {
    slug: 'singing-bowls',
    line: 'Small studies suggest people feel calmer after a session, but two systematic reviews found the evidence too thin or too biased to recommend bowls as therapy.',
    refs: ['stanhope2020', 'cai2025'],
  },
  {
    slug: 'gongs-sound-baths',
    line: 'We found no controlled gong trials. Two uncontrolled reports from one research group found people felt less tense and in a better mood after sound-meditation sessions.',
    refs: ['goldsby2017', 'goldsby2022'],
  },
  {
    slug: 'binaural-beats',
    line: 'A medium effect in lab studies of memory, attention, anxiety and pain, but more EEG studies contradicted “brainwave entrainment” than supported it.',
    refs: ['garcia2019', 'ingendoh2023'],
  },
  {
    slug: 'vibroacoustic',
    line: 'A scoping review calls the research “too sparse” to say what helps pain. A 2019 fibromyalgia trial was retracted in 2020 for lacking a sham control.',
    refs: ['kantor2022'],
  },
  {
    slug: 'gamma-40hz',
    line: 'Promising in mice; safe and well tolerated in small human pilot studies. Not shown to prevent or treat dementia in people.',
    refs: ['martorell2019', 'chan2022'],
  },
  {
    slug: '432-hz-solfeggio',
    line: 'Only tiny pilots (9–33 people) with small, short-term differences. Nothing supports DNA repair or “healing frequency” claims.',
    refs: ['calamassi2019', 'akimoto2018'],
  },
  {
    slug: 'chakras-energy',
    line: 'Relies on an energy field that has never been demonstrated; in a blinded test, practitioners did no better than chance.',
    refs: ['nccihReiki', 'rosa1998'],
  },
];
