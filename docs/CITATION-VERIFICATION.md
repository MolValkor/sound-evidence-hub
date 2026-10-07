# Citation verification log

Checked on **2026-10-07** for the evidence-hub topics (`src/data/citations.ts`).

## Method

1. **Existence & metadata:** every PMID was fetched from NCBI E-utilities (`efetch`) and its title, author order, journal, year and DOI were compared with our entry. DOIs were cross-checked against Crossref (or the DOI handle API where Crossref doesn't index the DOI).
2. **Content:** every finding and number on the site was taken from the PubMed abstract, or from open full text where marked `full-text` (Cai 2025 and Chen 2025 via Europe PMC; Akimoto 2018 via the SCIRP PDF). Agency pages (NCCIH, ISO, FTC, AMTA) were read directly.
3. **Links:** all 108 external links in the built site were checked. Every DOI resolves through the DOI handle API. PubMed and nih.gov return bot-challenge pages (HTTP 203 or 403) to scripted requests, so PubMed records were confirmed through E-utilities instead. A further 20 links were opened in headless Chromium and the landing page title was checked.

Corrections made during verification: the 528 Hz study's DOI is `10.4236/health.2018.109088` (`.109087` is a different paper); the Jespersen 2022 Cochrane title is "Listening to music for insomnia in adults"; the Chen 2025 title and Rio-Alamos 2023 author list were corrected.

## Sources

| # | Source | PMID | DOI | Read |
|---|---|---|---|---|
| 1 | International Organization for Standardization (1975). ISO 16:1975 Acoustics — Standard tuning frequency (Standard musical pitch). *International Standard (confirmed, still current)* | — | [page](https://www.iso.org/standard/3601.html) | page |
| 2 | Rosa L et al. (1998). A close look at therapeutic touch. *JAMA 279(13):1005–1010* | [9533499](https://pubmed.ncbi.nlm.nih.gov/9533499/) | [10.1001/jama.279.13.1005](https://doi.org/10.1001/jama.279.13.1005) | abstract |
| 3 | Bradt J et al. (2013). Music for stress and anxiety reduction in coronary heart disease patients. *Cochrane Database of Systematic Reviews 2013(12):CD006577* | [24374731](https://pubmed.ncbi.nlm.nih.gov/24374731/) | [10.1002/14651858.CD006577.pub3](https://doi.org/10.1002/14651858.CD006577.pub3) | abstract |
| 4 | Bradt J et al. (2013). Music interventions for preoperative anxiety. *Cochrane Database of Systematic Reviews 2013(6):CD006908* | [23740695](https://pubmed.ncbi.nlm.nih.gov/23740695/) | [10.1002/14651858.CD006908.pub2](https://doi.org/10.1002/14651858.CD006908.pub2) | abstract |
| 5 | Landry JM (2014). Physiological and psychological effects of a Himalayan singing bowl in meditation practice: a quantitative analysis. *American Journal of Health Promotion 28(5):306–309* | [23941101](https://pubmed.ncbi.nlm.nih.gov/23941101/) | [10.4278/ajhp.121031-ARB-528](https://doi.org/10.4278/ajhp.121031-ARB-528) | abstract |
| 6 | Hole J et al. (2015). Music as an aid for postoperative recovery in adults: a systematic review and meta-analysis. *The Lancet 386(10004):1659–1671* | [26277246](https://pubmed.ncbi.nlm.nih.gov/26277246/) | [10.1016/S0140-6736(15)60169-6](https://doi.org/10.1016/S0140-6736(15)60169-6) | abstract |
| 7 | Iaccarino HF et al. (2016). Gamma frequency entrainment attenuates amyloid load and modifies microglia. *Nature 540(7632):230–235* | [27929004](https://pubmed.ncbi.nlm.nih.gov/27929004/) | [10.1038/nature20587](https://doi.org/10.1038/nature20587) | abstract |
| 8 | Kühlmann AY et al. (2016). Systematic review and meta-analysis of music interventions in hypertension treatment: a quest for answers. *BMC Cardiovascular Disorders 16:69* | [27095510](https://pubmed.ncbi.nlm.nih.gov/27095510/) | [10.1186/s12872-016-0244-0](https://doi.org/10.1186/s12872-016-0244-0) | abstract |
| 9 | Lee JH (2016). The Effects of Music on Pain: A Meta-Analysis. *Journal of Music Therapy 53(4):430–477* | [27760797](https://pubmed.ncbi.nlm.nih.gov/27760797/) | [10.1093/jmt/thw012](https://doi.org/10.1093/jmt/thw012) | abstract |
| 10 | do Amaral MA et al. (2016). Effect of music therapy on blood pressure of individuals with hypertension: A systematic review and Meta-analysis. *International Journal of Cardiology 214:461–464* | [27096963](https://pubmed.ncbi.nlm.nih.gov/27096963/) | [10.1016/j.ijcard.2016.03.197](https://doi.org/10.1016/j.ijcard.2016.03.197) | abstract |
| 11 | Aalbers S et al. (2017). Music therapy for depression. *Cochrane Database of Systematic Reviews 2017(11):CD004517* | [29144545](https://pubmed.ncbi.nlm.nih.gov/29144545/) | [10.1002/14651858.CD004517.pub3](https://doi.org/10.1002/14651858.CD004517.pub3) | abstract |
| 12 | Garza-Villarreal EA et al. (2017). Music-Induced Analgesia in Chronic Pain Conditions: A Systematic Review and Meta-Analysis. *Pain Physician 20(7):597–610* | [29149141](https://pubmed.ncbi.nlm.nih.gov/29149141/) | — | abstract |
| 13 | Goldsby TL et al. (2017). Effects of Singing Bowl Sound Meditation on Mood, Tension, and Well-being: An Observational Study. *Journal of Evidence-Based Complementary & Alternative Medicine 22(3):401–406* | [27694559](https://pubmed.ncbi.nlm.nih.gov/27694559/) | [10.1177/2156587216668109](https://doi.org/10.1177/2156587216668109) | abstract |
| 14 | Akimoto K et al. (2018). Effect of 528 Hz Music on the Endocrine System and Autonomic Nervous System. *Health 10(9):1159–1170* | — | [10.4236/health.2018.109088](https://doi.org/10.4236/health.2018.109088) | full-text |
| 15 | Kühlmann AYR et al. (2018). Meta-analysis evaluating music interventions for anxiety and pain in surgery. *British Journal of Surgery 105(7):773–783* | [29665028](https://pubmed.ncbi.nlm.nih.gov/29665028/) | [10.1002/bjs.10853](https://doi.org/10.1002/bjs.10853) | abstract |
| 16 | National Center for Complementary and Integrative Health (NIH) (2018). Reiki. *NCCIH fact sheet (last updated December 2018)* | — | [page](https://www.nccih.nih.gov/health/reiki) | page |
| 17 | Braun Janzen T et al. (2019). A parallel randomized controlled trial examining the effects of rhythmic sensory stimulation on fibromyalgia symptoms. *PLOS ONE 14(3):e0212021* | [30822311](https://pubmed.ncbi.nlm.nih.gov/30822311/) | [10.1371/journal.pone.0212021](https://doi.org/10.1371/journal.pone.0212021) | abstract |
| 18 | Calamassi D et al. (2019). Music Tuned to 440 Hz Versus 432 Hz and the Health Effects: A Double-blind Cross-over Pilot Study. *EXPLORE 15(4):283–290* | [31031095](https://pubmed.ncbi.nlm.nih.gov/31031095/) | [10.1016/j.explore.2019.04.001](https://doi.org/10.1016/j.explore.2019.04.001) | abstract |
| 19 | Garcia-Argibay M et al. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. *Psychological Research 83(2):357–372* | [30073406](https://pubmed.ncbi.nlm.nih.gov/30073406/) | [10.1007/s00426-018-1066-8](https://doi.org/10.1007/s00426-018-1066-8) | abstract |
| 20 | Martorell AJ et al. (2019). Multi-sensory Gamma Stimulation Ameliorates Alzheimer’s-Associated Pathology and Improves Cognition. *Cell 177(2):256–271.e22* | [30879788](https://pubmed.ncbi.nlm.nih.gov/30879788/) | [10.1016/j.cell.2019.02.014](https://doi.org/10.1016/j.cell.2019.02.014) | abstract |
| 21 | Bergmann M et al. (2020). Effects of singing bowl exposure on Karolinska sleepiness scale and pupillographic sleepiness test: A randomised crossover study. *PLOS ONE 15(6):e0233982* | [32479559](https://pubmed.ncbi.nlm.nih.gov/32479559/) | [10.1371/journal.pone.0233982](https://doi.org/10.1371/journal.pone.0233982) | abstract |
| 22 | Calamassi D et al. (2020). Music tuned to 432 Hz versus music tuned to 440 Hz for improving sleep in patients with spinal cord injuries: a double-blind cross-over pilot study. *Acta Biomedica 91(12-S):e2020008* | [33263352](https://pubmed.ncbi.nlm.nih.gov/33263352/) | [10.23750/abm.v91i12-S.10755](https://doi.org/10.23750/abm.v91i12-S.10755) | abstract |
| 23 | Mojtabavi H et al. (2020). Can music influence cardiac autonomic system? A systematic review and narrative synthesis to evaluate its impact on heart rate variability. *Complementary Therapies in Clinical Practice 39:101162* | [32379689](https://pubmed.ncbi.nlm.nih.gov/32379689/) | [10.1016/j.ctcp.2020.101162](https://doi.org/10.1016/j.ctcp.2020.101162) | abstract |
| 24 | Stanhope J et al. (2020). The human health effects of singing bowls: A systematic review. *Complementary Therapies in Medicine 51:102412* | [32507429](https://pubmed.ncbi.nlm.nih.gov/32507429/) | [10.1016/j.ctim.2020.102412](https://doi.org/10.1016/j.ctim.2020.102412) | abstract |
| 25 | Tang Q et al. (2020). Effects of music therapy on depression: A meta-analysis of randomized controlled trials. *PLOS ONE 15(11):e0240862* | [33206656](https://pubmed.ncbi.nlm.nih.gov/33206656/) | [10.1371/journal.pone.0240862](https://doi.org/10.1371/journal.pone.0240862) | abstract |
| 26 | de Witte M et al. (2020). Effects of music interventions on stress-related outcomes: a systematic review and two meta-analyses. *Health Psychology Review 14(2):294–324* | [31167611](https://pubmed.ncbi.nlm.nih.gov/31167611/) | [10.1080/17437199.2019.1627897](https://doi.org/10.1080/17437199.2019.1627897) | abstract |
| 27 | Bradt J et al. (2021). Music interventions for improving psychological and physical outcomes in people with cancer. *Cochrane Database of Systematic Reviews 2021(10):CD006911* | [34637527](https://pubmed.ncbi.nlm.nih.gov/34637527/) | [10.1002/14651858.CD006911.pub4](https://doi.org/10.1002/14651858.CD006911.pub4) | abstract |
| 28 | Chan D et al. (2022). Gamma frequency sensory stimulation in mild probable Alzheimer’s dementia patients: Results of feasibility and pilot studies. *PLOS ONE 17(12):e0278412* | [36454969](https://pubmed.ncbi.nlm.nih.gov/36454969/) | [10.1371/journal.pone.0278412](https://doi.org/10.1371/journal.pone.0278412) | abstract |
| 29 | Geretsegger M et al. (2022). Music therapy for autistic people. *Cochrane Database of Systematic Reviews 2022(5):CD004381* | [35532041](https://pubmed.ncbi.nlm.nih.gov/35532041/) | [10.1002/14651858.CD004381.pub4](https://doi.org/10.1002/14651858.CD004381.pub4) | abstract |
| 30 | Goldsby TL et al. (2022). Sound Healing: Mood, Emotional, and Spiritual Well-Being Interrelationships. *Religions 13(2):123* | — | [10.3390/rel13020123](https://doi.org/10.3390/rel13020123) | abstract |
| 31 | Jespersen KV et al. (2022). Listening to music for insomnia in adults. *Cochrane Database of Systematic Reviews 2022(8):CD010459* | [36000763](https://pubmed.ncbi.nlm.nih.gov/36000763/) | [10.1002/14651858.CD010459.pub3](https://doi.org/10.1002/14651858.CD010459.pub3) | abstract |
| 32 | Kantor J et al. (2022). Exploring vibroacoustic therapy in adults experiencing pain: a scoping review. *BMJ Open 12(4):e046591* | [35383053](https://pubmed.ncbi.nlm.nih.gov/35383053/) | [10.1136/bmjopen-2020-046591](https://doi.org/10.1136/bmjopen-2020-046591) | abstract |
| 33 | National Center for Complementary and Integrative Health (NIH) (2022). Music and Health: What You Need To Know. *NCCIH fact sheet (last updated September 2022)* | — | [page](https://www.nccih.nih.gov/health/music-and-health-what-you-need-to-know) | page |
| 34 | de Witte M et al. (2022). Music therapy for stress reduction: a systematic review and meta-analysis. *Health Psychology Review 16(1):134–159* | [33176590](https://pubmed.ncbi.nlm.nih.gov/33176590/) | [10.1080/17437199.2020.1846580](https://doi.org/10.1080/17437199.2020.1846580) | abstract |
| 35 | Ingendoh RM et al. (2023). Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity, and the implications for psychological research and intervention. *PLOS ONE 18(5):e0286023* | [37205669](https://pubmed.ncbi.nlm.nih.gov/37205669/) | [10.1371/journal.pone.0286023](https://doi.org/10.1371/journal.pone.0286023) | abstract |
| 36 | Rio-Alamos C et al. (2023). Acute Relaxation Response Induced by Tibetan Singing Bowl Sounds: A Randomized Controlled Trial. *European Journal of Investigation in Health, Psychology and Education 13(2):317–330* | [36826208](https://pubmed.ncbi.nlm.nih.gov/36826208/) | [10.3390/ejihpe13020024](https://doi.org/10.3390/ejihpe13020024) | abstract |
| 37 | Cai Y et al. (2025). Therapeutic effects of singing bowls: A systematic review of clinical studies. *Integrative Medicine Research 14(2):101144* | [40352083](https://pubmed.ncbi.nlm.nih.gov/40352083/) | [10.1016/j.imr.2025.101144](https://doi.org/10.1016/j.imr.2025.101144) | full-text |
| 38 | Chen S et al. (2025). The effect of music therapy for patients with chronic pain: systematic review and meta-analysis. *BMC Psychology 13(1):455* | [40307940](https://pubmed.ncbi.nlm.nih.gov/40307940/) | [10.1186/s40359-025-02643-x](https://doi.org/10.1186/s40359-025-02643-x) | full-text |
| 39 | van der Steen JT et al. (2025). Music-based therapeutic interventions for people with dementia. *Cochrane Database of Systematic Reviews 2025(3):CD003477* | [40049590](https://pubmed.ncbi.nlm.nih.gov/40049590/) | [10.1002/14651858.CD003477.pub5](https://doi.org/10.1002/14651858.CD003477.pub5) | abstract |

## Headless-browser spot checks

| URL | Result |
|---|---|
| https://pubmed.ncbi.nlm.nih.gov/36000763/ | 203 · Checking your browser - reCAPTCHA |
| https://pubmed.ncbi.nlm.nih.gov/26277246/ | 200 · Music as an aid for postoperative recovery in adults: a systematic review and meta-analysis - PubMed |
| https://pubmed.ncbi.nlm.nih.gov/9533499/ | 200 · A close look at therapeutic touch - PubMed |
| https://pubmed.ncbi.nlm.nih.gov/29149141/ | 200 · Music-Induced Analgesia in Chronic Pain Conditions: A Systematic Review and Meta-Analysis - PubMed |
| https://pubmed.ncbi.nlm.nih.gov/31031095/ | 200 · Music Tuned to 440 Hz Versus 432 Hz and the Health Effects: A Double-blind Cross-over Pilot Study - PubMed |
| https://pubmed.ncbi.nlm.nih.gov/32507429/ | 200 · The human health effects of singing bowls: A systematic review - PubMed |
| https://doi.org/10.1002/14651858.CD006911.pub4 | 403 · Just a moment... |
| https://doi.org/10.1136/bmjopen-2020-046591 | 200 · Exploring vibroacoustic therapy in adults experiencing pain: a scoping review / BMJ Open |
| https://doi.org/10.1371/journal.pone.0240862 | 200 · Effects of music therapy on depression: A meta-analysis of randomized controlled trials / PLOS One |
| https://doi.org/10.4236/health.2018.109088 | 200 · Effect of 528 Hz Music on the Endocrine System and Autonomic Nervous System |
| https://doi.org/10.3390/rel13020123 | 403 · Access Denied |
| https://doi.org/10.1371/journal.pone.0278412 | 200 · Gamma frequency sensory stimulation in mild probable Alzheimer’s dementia patients: Results of feasibility and |
| https://doi.org/10.1038/nature20587 | 200 · Gamma frequency entrainment attenuates amyloid load and modifies microglia / Nature |
| https://doi.org/10.23750/abm.v91i12-S.10755 | 200 · Music tuned to 432 Hz versus music tuned to 440 Hz for improving sleep in patients with spinal cord injuries:  |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC12063014/ | 203 · Therapeutic effects of singing bowls: A systematic review of clinical studies - PMC |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC12042639/ | 200 · The effect of music therapy for patients with chronic pain: systematic review and meta-analysis - PMC |
| https://pmc.ncbi.nlm.nih.gov/articles/PMC11884930/ | 200 · Music‐based therapeutic interventions for people with dementia - PMC |
| https://www.nih.gov/sound-health | 403 · Access denied / National Institutes of Health (NIH) |
| https://www.cc.nih.gov/news/2025/sep-oct/2025-nso-performance | 200 · NSO Melodies Fill the Clinical Center Atrium / Clinical Center |
| https://www.iso.org/standard/3601.html | 200 · ISO 16:1975 - Acoustics — Standard tuning frequency (Standard musical pitch) |

Bot-blocked in the headless browser (existence confirmed by DOI handle API / E-utilities instead): Wiley/Cochrane DOI pages (Cloudflare), MDPI (Akamai), one PubMed page (reCAPTCHA) and nih.gov.

## Not verified / limits

- Most numbers come from **abstracts**. Full texts behind paywalls (e.g., Hole 2015, Lee 2016, Garcia-Argibay 2019, Landry 2014) were not read.
- No gong-specific controlled trial was found. The gongs topic rests on two uncontrolled observational reports.
- Ratings are editorial judgments by this site, using the scale on `/how-to-read/`. They are not GRADE ratings.
