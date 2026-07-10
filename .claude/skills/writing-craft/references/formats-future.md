# Future formats: EPUB, PDF, audiobooks

Craft rules distilled from live-fetched sources and adversarially source-verified on 2026-07-11. Every attribution below survived a fact-check pass (refuted or corrected claims were fixed before inclusion). Apply as guidance, not dogma: when a rule fights the story, the story wins.

## One markdown file per chapter, YAML metadata block, pandoc builds the EPUB

Pandoc converts markdown to EPUB with 'pandoc -o book.epub title.txt chapter1.md chapter2.md ...' where argument order sets reading order and each chapter lives in its own file. Book metadata (title, author, rights, language) goes in a YAML block or a dedicated metadata file. Styling is applied with '--css'; the default CSS is deliberately minimal, so ship your own stylesheet. Local image links in standard markdown syntax are bundled automatically. For sagas this means the exact chapter files the Astro site renders can feed the EPUB build with zero format conversion.

Source: John MacFarlane, Pandoc User's Guide, 'EPUBs with pandoc' (pandoc.org) -- <https://pandoc.org/epub.html>

## Run EPUBCheck on every generated EPUB before distributing it

EPUBCheck is the industry-standard command-line validator for EPUB 2 and EPUB 3 conformance, maintained by the DAISY Consortium as a W3C project under an MIT license. Wire it into CI after the pandoc step so a malformed EPUB never reaches readers; validation failures are the main reason stores and reading apps reject files. It is a one-line addition to a GitHub Actions workflow.

Source: W3C / DAISY Consortium, EPUBCheck project page -- <https://www.w3.org/publishing/epubcheck/>

## Reuse the site's HTML/CSS for print PDF via CSS Paged Media tools (Paged.js or WeasyPrint)

Paged.js is an open-source, standards-compliant JS library that paginates HTML/CSS into print-ready PDF by polyfilling the CSS Paged Media specs, so the same content and stylesheet that render the web reader can produce a book interior. WeasyPrint is the server-side equivalent (Python, HTML/CSS to PDF) with support for page sizes, margins, running headers/footers, and table-of-contents generation, and is used in production at scale (25M downloads/month, users include IETF and Unicode). For a static Astro site the practical pipeline is markdown -> Astro HTML -> WeasyPrint/Paged.js in a build step, not a separate LaTeX toolchain.

Source: Paged.js project (Coko Foundation community) and WeasyPrint (CourtBouillon) -- <https://weasyprint.org>

## Master audiobook audio to ACX spec; it is the strictest and clears other stores too

ACX (Audible/Amazon) requires each file at -23dB to -18dB RMS, peaks below -3dB, noise floor below -60dB RMS, delivered as 192 kbps or higher CBR MP3 at 44.1kHz, all files mono or all stereo. Each file holds exactly one chapter or section, max 120 minutes, with 1-5 seconds of room tone at head and tail (never more than 5). A comparison of ACX, Voices by INaudio (ex-Findaway), and Google Play confirms the same loudness targets apply across platforms and that a file mastered to ACX spec clears all three, because ACX is the tightest standard on format.

Source: ACX Audio Submission Requirements (Audible/Amazon help center); cross-platform comparison by ChapterPass -- <https://help.acx.com/s/article/what-are-the-acx-audio-submission-requirements>

## Credits and retail sample are part of the audiobook spec, not garnish

ACX requires opening credits stating title, author(s), and narrator(s) as a separate file, and closing credits that begin 'You have been listening to...' and end with 'The End.' The retail sample must be under 5 minutes, ideally from the book's opening, and free of explicit content. Bake these into the audiobook build template (front-matter and sample chapters generated from book metadata) rather than treating them as manual post-production.

Source: ACX Audio Submission Requirements (Audible/Amazon help center) -- <https://help.acx.com/s/article/what-are-the-acx-audio-submission-requirements>

## Maintain a narration script as a derived artifact: strip visual furniture, mark breaks explicitly, write out numbers

Before narration (human or TTS), delete footnotes/endnotes and fold essential content into body text, drop page references and decorative separators, and describe tables in prose. Replace visual scene-break glyphs with explicit notation like '[SCENE BREAK - PAUSE 2 SECONDS]', write out awkward numbers ('$3.5M' becomes 'three point five million dollars'), spell out abbreviations, and ship a pronunciation guide table for character names, place names, and invented words using plain phonetic spellings rather than IPA. Exclude the table of contents and long acknowledgments; keep prologues, epigraphs (marked with begin/end tags plus attribution), and brief author notes. For sagas this can be a build transform over the same markdown source.

Source: ScribeCount, 'How to Format Your Manuscript for Audiobook Production' (author-resource guide) -- <https://scribecount.com/author-resource/audiobook-creation-guide/audiobook-formatting-guide>

## For 2025-2026 fiction TTS, direct the performance in the text: audio tags, punctuation, and voice choice do the acting

ElevenLabs' Eleven v3 generates expressive narration ('voices that sigh, whisper, laugh, and react') across 70+ languages, controlled by inline lowercase bracket tags like [whispers], [sighs], [excited], plus punctuation (ellipses create weighted pauses, CAPS add emphasis). ElevenLabs states the most important parameter is voice selection: the voice must already be close to the desired delivery, and tags only work within its range. Stability presets trade expressiveness for consistency (Creative is expressive but can hallucinate; Robust is stable but ignores direction), and a Text to Dialogue API handles multi-speaker scenes with automatic speaker transitions. v3 is recommended for pre-produced content like audiobooks; lower-latency v2.5 Turbo/Flash models remain the pick for real-time use.

Source: ElevenLabs, 'Eleven v3' launch post and official v3 prompting best-practices documentation -- <https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices>

## Set body-text measure to roughly 45-90 characters, targeting 50-75, via max-width in ch units

Baymard Institute recommends 50-75 characters per line, citing Emil Ruder's classic finding of 50-60 as optimal and WCAG 1.4.8's 80-character maximum; too-long lines make eyes lose their place at line returns, too-short lines break reading rhythm. Butterick's Practical Typography gives the compatible range of 45-90 characters ('2-3 alphabets') and notes character count, not physical width, is the right unit because font size changes how many characters fit. In CSS this is one rule on the reading column, e.g. max-width around 65ch, which also keeps phone-width lines comfortable.

Source: Baymard Institute, 'Readability: The Optimal Line Length'; Matthew Butterick, Practical Typography, 'Line length' -- <https://baymard.com/blog/line-length-readability>

## Choose serif or sans-serif for brand, not legibility; the 'sans for screens' rule is dead on modern displays

Nielsen Norman Group concludes there is no strong usability guideline favoring serif or sans-serif on today's high-resolution screens (220+ PPI); the old anti-serif advice existed because low-res screens rendered serifs blurrily. Legibility research is inconclusive between the two styles and reading-speed differences are minimal, so a literary serif for long-form fiction on the web is a legitimate choice. NN/g specifically suggests retiring Verdana-era screen fonts; standard restraint (few families, nothing overly decorative) still applies.

Source: Nielsen Norman Group, 'Serif vs. Sans-Serif Fonts for HD Screens' -- <https://www.nngroup.com/articles/serif-vs-sans-serif-fonts-hd-screens/>

## Build dyslexia-friendly reading defaults from BDA numbers: 16-19px body, 1.5 line spacing, generous letter/word spacing, left-aligned ragged-right

The British Dyslexia Association style guide specifies: body text 12-14pt (16-19px web equivalent), inter-letter spacing around 35% of average letter width (excess spacing hurts), inter-word spacing at least 3.5x the inter-letter spacing, and line spacing of 1.5/150%. Left-align without justification, keep lines to 60-70 characters, avoid italics/underline/all-caps for emphasis (use bold), and prefer dark text on a light non-white background such as cream, since pure white can dazzle; avoid red/green combinations for color-blind readers. On a static site this maps cleanly to a 'comfort reading' toggle that bumps line-height, letter-spacing, and word-spacing and switches to an off-white theme.

Source: British Dyslexia Association, 'Dyslexia Style Guide 2018: Creating Dyslexia Friendly Content' -- <https://iped-editors.org/wp-content/uploads/2021/05/British-Dyslexia-Association-Style-Guide-2018.pdf>

## Skip special 'dyslexia fonts' as a default; spacing and size controls are what the evidence supports

The peer-reviewed Wery & Diliberto study (Annals of Dyslexia, 2017) tested OpenDyslexic against Arial and Times New Roman with dyslexic elementary students in an alternating-treatments design and found no improvement in reading rate or accuracy for any individual or the group; no participant preferred the font. The actionable takeaway for a reader UI: invest in user-adjustable font size, line spacing, and letter spacing (the BDA levers) rather than shipping OpenDyslexic as the accessibility answer. Offering it as an optional font is harmless, but do not market it as evidence-based.

Source: Jessica K. Wery and Jennifer A. Diliberto, 'The effect of a specialized dyslexia font, OpenDyslexic, on reading rate and accuracy', Annals of Dyslexia (2017) -- <https://pubmed.ncbi.nlm.nih.gov/26993270/>

## Caveats

The 'dyslexia font' rule is genuinely contested: the BDA recommends sans-serif fonts and generous spacing, but the only controlled study of OpenDyslexic (Wery & Diliberto 2017) found no benefit, so spacing/size controls are evidence-backed while special letterforms are not. The BDA guide was fetched from a third-party mirror (iped-editors.org PDF of the official 2018 guide) because bdadyslexia.org.uk returned 404s; a 2023 revision exists but was unreachable this session. The 'one audio master clears ACX/Findaway/Google Play' claim comes from a secondary comparison site (ChapterPass); Google Play publishes no loudness spec, so that platform's tolerance is inferred, and note Findaway Voices is now 'Voices by INaudio' after the Spotify acquisition. Reedsy and Writer's Digest audiobook-craft articles were unreachable (DNS failures/404s), so narration-prep rules rest on ACX (primary) plus ScribeCount (secondary aggregator). ElevenLabs v3 was labeled alpha in its launch post; latency, pricing, and tag behavior may have shifted, and its docs pages restructure frequently (two doc URLs 404'd before the live best-practices page was found). NN/g's serif/sans finding ('no difference on HD screens') deliberately contradicts the older, still widely repeated 'sans-serif for screens' rule; treat that legacy rule as obsolete rather than wrong-in-all-contexts (it still applies to very low-DPI displays).
