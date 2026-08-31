---
name: ta-adventure-unity-technical-artists-complete
version: 3.1.0
description: Complete source-locked production skill for TA Adventure based on Unity Technologies’ Unity for Technical Artists: Key Toolsets and Workflows, 2021 LTS Edition.
---

# TA Adventure — Unity for Technical Artists Complete Skill v3.1

## 0. Purpose

Turn **Unity for Technical Artists: Key Toolsets and Workflows (2021 LTS Edition)** into the TA Adventure learning product while preserving source truth, reviewability, retrieval, and the interaction model established in this project.

Core rule:

> **SOURCE FIRST → EXPLANATION SECOND → REORGANIZATION LAST.**

The source determines what exists. AI may explain, compare, reorganize, ask questions, generate practice, and create retrieval structures only after the relevant source material has been captured.

This skill is suitable for software manuals, engine/tool books, production handbooks, API guides, technical art books, DCC manuals, engineering playbooks, and other structured reference books.

---

# 1. Provenance model

Every reader-facing item must belong to one layer:

- `SOURCE` — directly supported by the supplied book/manual.
- `DERIVED` — AI explanation, analogy, mental model, Socratic prompt, quiz, or practice derived from SOURCE.
- `EXTERNAL` — current vendor docs, later versions, conferences, case studies, or other outside material.
- `USER_NOTE` — reader experience, notes, disagreement, project examples.

Never blend these layers into one unlabeled paragraph.

For time-sensitive books, preserve historical claims exactly as source claims. If a later version differs, keep the book statement in `SOURCE` and add a separate `EXTERNAL_UPDATE`.

---

# 2. Evidence before content

A source-backed claim cannot enter the product until it has evidence.

Minimum claim record:

```js
{
  documentId: "stable-source-id",
  page: 42,
  section: "Exact source heading",
  claim: "Concise supported statement",
  evidence: "Short exact excerpt or precise source span",
  evidenceType: "text" // text | figure | table | caption
}
```

Forbidden:

```text
AI writes lesson → searches for vaguely similar text → attaches citation
```

Required:

```text
source page → evidence → source unit → derived teaching → review → public retrieval views
```

If the source does not support a claim, discard it or place it in a clearly separated external/inference layer.

---

# 3. Source inspection and canonical hierarchy

Before generating lessons:

1. identify title, edition/version, publisher, publication year, page count;
2. inspect the complete table of contents;
3. record the exact top-level chapter hierarchy and subheadings;
4. identify special sections such as appendices, resources, glossary, version notes, and end matter;
5. inspect whether figures/tables carry information not recoverable from parsed text;
6. inventory explicit recommended-reading links and learning resources.

The normal reading view follows the author’s order. Do not transform the book into an invented beginner/intermediate/master curriculum unless the user explicitly requests a second, derived curriculum.

If a product Source Unit spans two source headings for practical reasons, record that as an explicit mapping exception; never pretend the source hierarchy itself changed.

---

# 4. Minimum Verifiable Structure before full-book scaling

Start with a contiguous sample, usually 1–3 source sections:

```text
SOURCE PASSAGE
→ SOURCE UNIT
→ DERIVED EXPLANATION
→ ANALOGY / MENTAL MODEL
→ SOCRATIC QUESTION + HINT + REFERENCE ANSWER
→ SOURCE-BOUND QUIZ
→ PRACTICE
→ HUMAN REVIEW
```

Do not expand the entire book until the reviewer confirms that source extraction, explanation, quiz quality, terminology policy, and review workflow are acceptable.

Once the MVS passes, restore the full product experience rather than leaving the site as a bare verification tool.

---

# 5. Source Unit schema

A Source Unit should represent one coherent source-supported idea or workflow, not an arbitrary equal page chunk.

Recommended structure:

```js
{
  id: "stable_unit_id",
  chapterId: "source_chapter_id",
  title: "reader-facing title",
  pages: "P12–13",
  xp: 60,

  sourceSummary: "Chinese-first or reader-language summary",
  claims: [
    { claim: "...", evidence: "...", page: 12 }
  ],

  scenario: "source-grounded working situation",
  analogy: "plain-language analogy",
  mental: ["step 1", "step 2", "step 3"],
  socratic: "question",
  hint: "hint + explicit reference answer",

  tags: ["Canonical Tool", "Canonical Concept"],
  quiz: { q: "...", opts: ["..."], correct: 2, why: "..." },
  quest: ["observable task 1", "observable task 2"],

  figures: [],
  deeperReading: []
}
```

Stable IDs should survive revisions so progress and review JSON remain compatible.

---

# 6. Reader-language policy

For a Chinese reader build:

- explanation and source summaries are Chinese-first;
- preserve official/professional names where English is normal in actual work;
- when translation helps, prefer `中文（Canonical English）`;
- original evidence quotations remain in the source language for verification;
- do not translate a professional term merely to make the interface look bilingual.

The reviewer-facing label for AI summaries should make clear that they are derived, e.g. `原书内容总结（AI整理）`, not the original quotation.

---

# 7. Learning transformation

## 7.1 Scenario
Use a plausible situation that helps the source concept become concrete. Do not add factual requirements that the source did not establish.

## 7.2 Analogy
Explain the mechanism, not merely decorate it. A good analogy makes it easier to predict behavior. If the analogy introduces a false one-to-one mapping, rewrite it.

## 7.3 FROM ZERO mental model
Prefer 2–4 causal steps:

```text
What problem exists?
→ What data/object/process changes?
→ What tool/system mediates it?
→ What decision does the reader make?
```

## 7.4 Socratic question, hint, and answer
The hint should support active recall but must eventually resolve the question.

Required UX:

```text
Question
→ hidden hint: points to source clues
→ explicit reference answer: directly answers the question
```

Do not make the learner click “hint” only to receive another vague question.

## 7.5 Quiz
Quiz answers must be source-bound.

Anti-pattern checks across the full book:

- correct answer must not systematically be the longest option;
- correct position must not cluster in one index;
- distractors should be plausible misunderstandings of the same concept, not absurd throwaways;
- keep option lengths reasonably balanced without making them unnaturally identical;
- explanation after answer should state why the correct option follows from the source.

## 7.6 Practice / Quest
A task should produce something observable:

- a comparison;
- a configuration and observed result;
- a diagram;
- a decision with criteria;
- a small artifact;
- an inspection of a real tool/project.

Avoid empty prompts such as “write what you think might go wrong” unless that written artifact is itself useful to future work.

---

# 8. Terminology and Tag architecture

Tags are for retrieval and graph structure, not broad motivational taxonomy.

Use 1–4 terms per Source Unit in most cases. Prefer official product names, APIs, file formats, systems, and canonical technical concepts.

Separate identity from display:

```js
TERMS = {
  "Canonical Term": {
    alias: "optional localized name",
    mode: "canonical", // canonical | bilingual | localized
    search: ["approved synonym", "common abbreviation"]
  }
}
```

The canonical key must not change merely because a translation changes.

Private Review Build must provide a backend-only terminology interface with:

- canonical term;
- editable localized alias;
- display mode;
- search aliases;
- status;
- reviewer note.

Search matches canonical term, reviewed alias, and approved synonyms.

---

# 9. Figures and visual evidence

Figures are part of the source when they carry information.

Selection levels:

1. `core` — diagram/screenshot needed to understand the unit;
2. `supporting` — useful UI/context image;
3. `original page` — source page remains the final context reference.

Prefer extracting the original embedded image stream from PDFs. Do not resize/re-encode source JPEGs merely to shrink a single-file HTML. If the source image is intrinsically low-resolution, display it at a sensible maximum size instead of AI-upscaling or inventing detail.

Every selected figure stores page, source caption, and role. The caption must describe the actual extracted image, not merely the page topic.

Public and Review Builds use the same source figure assets.

---

# 10. Recommended reading and external enrichment

Treat explicit source-recommended resources as source metadata, not decoration.

Recommended `GO DEEPER` tiers:

1. `BOOK / 原书推荐` — every link the source explicitly recommends;
2. `CURRENT / 当前官方文档` — separately verified current vendor documentation;
3. `PRACTICE / 权威实战` — authoritative production talks/case studies, e.g. GDC, SIGGRAPH, vendor engineering talks, studio postmortems.

Before publication:

- audit every `More resources` block;
- preserve e-book cards, recommended learning paths, and explicit “read / watch / learn more / check out” resources;
- store the source page of each BOOK resource;
- de-duplicate only identical URLs within the same unit;
- never replace an old BOOK link silently with a current link;
- require zero missing explicit source recommendations in QA.

External enrichment never serves as evidence for SOURCE claims.

---

# 11. Private review build

Review is authoring workflow, not reader UX.

Per unit states:

```text
PENDING
APPROVED
REQUEST_REVISION
```

A unit may have multiple independent revision issues:

```js
{
  unitId: "unit_17",
  status: "REQUEST_REVISION",
  issues: [
    { area: "Analogy", feedback: "Mechanism is unclear." },
    { area: "Quest", feedback: "Task has no observable outcome." }
  ]
}
```

Reviewer-facing issue labels should be localized. Stable internal keys may remain English for compatibility.

Suggested areas:

```text
Source accuracy
AI/source summary
Scenario
Analogy
Mental model
Socratic / Hint
Quiz
Quest
Tags / terminology
Figure / recommended reading
```

The reviewer identifies problems; they do not need to rewrite the content.

Revision contract:

```text
export feedback
→ AI reopens exact source pages
→ revise only flagged fields/units
→ preserve approved content verbatim unless a global rule genuinely affects it
→ import/continue review
```

Review state must be exportable/importable. Do not rely only on localStorage.

---

# 12. Public build separation

Generate physically separate artifacts:

```text
PRIVATE REVIEW BUILD
- evidence + derived learning content
- review states
- multi-issue feedback
- terminology review
- import/export

PUBLIC READER BUILD
- source-backed learning content
- figures and source page labels
- map / graph / search
- quiz / practice / progress
- NO review panel
- NO review state
- NO reviewer feedback
- NO terminology-review status/data
- NO dormant review export functions
```

Do not merely hide private UI with CSS.

Reader-facing copy describes only the current product. Never mention prototype history or explain what the page “is not.”

---

# 13. Full-book hierarchy

When the book grows, add hierarchy instead of shrinking everything.

```text
READ  → BOOK → CHAPTER → SOURCE UNIT
MAP   → BOOK MAP → CHAPTER MAP
GRAPH → CORE TERM NETWORK → FOCUS/HIGHLIGHT → SEARCH ALL TERMS
```

Mental model:

- `READ = learn`
- `MAP = locate / progress`
- `GRAPH = connect / rediscover`

## READ
Only the current chapter is expanded by default. Other chapters collapse to compact progress rows. A full-book drawer can provide distant navigation.

## MAP
Level 1 shows source chapters/regions. Level 2 shows the ordered Source Units inside one chapter. Map links encode author reading order, not semantic similarity. Progress animation belongs here.

## GRAPH
Graph nodes are canonical professional terms, not lesson/unit nodes. Edges arise from explainable co-occurrence or explicit source relationships.

The full core network remains visible when a term is selected. Selection is a focus state:

- keep the core network;
- dim unrelated nodes/edges;
- highlight direct relationships;
- preserve bidirectional animated links if the product uses them;
- clicking empty graph space clears focus;
- provide a visible clear-focus control;
- search may temporarily surface a non-core term without deleting the core network.

Do not render a duplicate full card/index grid below the graph. Selected-term context may show first occurrence, source pages, direct terms, and links back to Source Units.

---

# 14. Search and navigation contract

All jumps to a Source Unit use one canonical navigation function. It must:

1. validate unit ID;
2. update current unit;
3. expand the correct chapter;
4. switch to Reading;
5. re-render required views/HUD;
6. close transient overlays;
7. scroll to the correct reading start with sticky-header offset.

Global search, map nodes, graph term results, related units, previous/next, completion actions, and private review list should resolve through the same unit navigation path.

---

# 15. Mobile and responsive behavior

Do not merely shrink desktop.

On narrow screens:

- collapse chapter navigation;
- keep long-form reading one column;
- source figures full-width with caption below;
- stack mental model, reading links, quiz and quest cleanly;
- use touch-friendly buttons;
- if canvases cannot fit, prefer **one-axis horizontal panning** while the page owns vertical scrolling;
- avoid nested two-axis scroll regions;
- single tap selects graph nodes; entering content has an explicit button/link;
- long Chinese/English titles and term chips must wrap safely.

Desktop chapter maps with a small number of units should fit without scrollbars whenever possible.

---

# 16. Product personality, visual system, and motion language

A source-first architecture does not require a sterile interface. The learning product should feel like a compact game/tool hybrid: playful enough to invite exploration, but disciplined enough that the book remains the authority.

Unless a future project explicitly requests a different art direction, use the following **TA Adventure visual shell as the default reference implementation**. For another book, the brand colors may be adapted, but preserve the semantic roles, hierarchy, and motion grammar unless the reviewer asks otherwise.

## 16.1 Visual thesis

The default shell combines:

- dark technical workspace;
- pixel/RPG framing;
- high-saturation semantic accent colors;
- hard black borders and offset shadows;
- subtle CRT / scanline texture;
- restrained pixel-grid background;
- information-dense desktop layout with generous card separation;
- game-like feedback for progress and navigation;
- a softer, cinematic visual break for the final Epilogue.

The interface should feel handmade and game-like, **not** like a generic SaaS dashboard and **not** like a literal imitation of the source PDF.

## 16.2 Canonical palette

Default CSS tokens:

```css
:root {
  --bg:      #0A0A0A;
  --panel:   #1A1A2E;
  --panel2:  #16213E;
  --gold:    #FFD700;
  --gold2:   #FFEA3A;
  --red:     #FF2079;
  --green:   #00FF41;
  --cyan:    #00B4FF;
  --purple:  #9D00FF;
  --orange:  #FF8C00;
  --magenta: #FF00FF;
  --cream:   #F5E6D3;
  --muted:   #AAB0BC;
  --shadow:  4px 4px 0 #000;
  --shadow-lg: 6px 6px 0 #000;
}
```

Semantic use:

- **Gold / yellow** — XP, completion, primary progress, current route, primary call-to-action, scrollbar thumb.
- **Cyan** — navigation/current learning context, Scenario, From Zero, Tags, map accents.
- **Orange** — Source / evidence / review provenance.
- **Magenta** — analogy and expressive comparison.
- **Purple** — Think / Socratic / deeper conceptual connection.
- **Green** — Quest / completion / success state.
- **White** — source figures and neutral evidence presentation.
- **Red / pink** — warning, error, incorrect answer, destructive or exceptional state.

Do not use accent colors decoratively at random. A repeated color should carry a repeated meaning.

## 16.3 Typography

Default hierarchy:

- Chinese long-form text: `Microsoft YaHei`, `PingFang SC`, or equivalent readable sans-serif.
- Pixel display text: `Press Start 2P`, with Chinese sans-serif fallback.
- Secondary retro metadata may use `VT323` / `Silkscreen` when available.
- Epilogue may intentionally switch to a serif family such as `Noto Serif SC`, `Songti SC`, or equivalent.

Rules:

- body text prioritizes readability over pixel purity;
- pixel fonts are for HUD, labels, badges, tabs, counters, and short headings;
- long Chinese titles should switch to a readable bold sans-serif instead of forcing tiny pixel type;
- mixed Chinese/English strings must wrap safely with `overflow-wrap:anywhere` / equivalent.

## 16.4 Global surface treatment

Default page background:

- near-black base;
- extremely subtle 2px pixel/grid texture;
- fixed low-opacity horizontal scanlines;
- never reduce text contrast for the sake of the CRT effect.

Cards and panels:

```text
3px hard border
+ 4–6px offset black or semantic-color shadow
+ square / minimally rounded corners
+ label tab crossing the top border
```

Avoid soft glassmorphism in the main reading product. The exception is the Epilogue, where a visual break is intentional.

Scrollbar treatment:

- dark track;
- gold/yellow thumb;
- hover uses brighter yellow;
- hide unnecessary scrollbars rather than displaying nested scrolling regions.

## 16.5 Desktop layout

Reference desktop width: approximately **1220px max content width**.

READ view:

```text
sticky HUD
→ view tabs
→ two-column reading layout
   ├─ chapter / unit navigation ≈ 400px
   └─ current Source Unit content fills remaining width
```

The chapter navigation may be sticky, but should never visually dominate the lesson.

Lesson rhythm:

```text
Hero / title
→ Scenario
→ Source / evidence
→ Source Figure when useful
→ Analogy
→ FROM ZERO mental model
→ Think / Socratic
→ Go Deeper / recommended reading
→ Tags / Related
→ Quiz
→ Quest
→ lesson navigation
```

Use generous vertical spacing between semantic cards. Do not solve density problems by shrinking text until everything technically fits.

## 16.6 Section color language

Default teaching-card mapping:

```text
Scenario            → cyan border/shadow
Source / Evidence   → orange, with dashed source border allowed
Source Figure       → white / neutral
Daily-life Analogy  → magenta
FROM ZERO           → cyan
Think / Socratic    → purple
Go Deeper           → purple
Tags / Related      → cyan
Quiz                → gold/yellow
Quest               → green
Private Review      → orange
```

Section labels sit partially across the top border like game UI tabs. Keep labels short; reader-facing actions should be in the reader’s language.

## 16.7 HUD, tabs, search, and progress

HUD characteristics:

- blocky dark panel;
- black hard border and offset shadow;
- square gold logo tile;
- gold product title;
- XP bar with segmented / repeating gold fill;
- compact counters for reading progress;
- global search using cyan outline and cyan result treatment.

XP animation should use discrete/stepped motion rather than liquid easing when possible. At full completion the bar must visibly reach 100%.

Top-level tabs use a game-menu treatment:

- dark inactive state;
- gold active state;
- orange reserved for private Review when present;
- horizontal overflow is acceptable on mobile, not as the normal desktop layout.

## 16.8 World Map visual language

MAP communicates **where the reader is in the book**.

Desktop:

- top-level chapter map should fit inside the viewport without internal scrolling whenever reasonably possible;
- chapter detail map lays out the chapter’s units as a readable route;
- with small chapter counts, prefer a single clear route rather than a dense graph;
- completed/current/unread status remains visible.

Motion:

- a gold/yellow travel marker moves along the completed/current route;
- current node may blink/pulse subtly;
- completed nodes may show a compact `[OK]`-style state;
- background stars/pixels may twinkle at low intensity;
- motion should reinforce traversal, not become a screensaver.

MAP must not reuse Graph semantics. It represents authorial reading geography and progress.

## 16.9 Knowledge Graph visual language

GRAPH communicates **relationships among canonical professional terms**.

Core behavior:

- keep the full core network visible;
- selecting a term highlights that node and its direct relationships;
- unrelated nodes dim but do not disappear;
- clicking empty canvas or an explicit “clear highlight” control resets focus;
- search may temporarily reveal a non-core long-tail term without replacing the core network.

Relationship animation:

- use **two parallel relationship paths** when emphasizing a selected relationship;
- run small gold/yellow pixels in opposing directions along the pair;
- this bidirectional flow is a signature interaction and should be preserved when the graph implementation changes;
- selected node = strongest highlight;
- direct neighbors = high visibility;
- unrelated nodes = reduced opacity;
- keep labels readable; do not allow text collisions to become part of the visual style.

The graph should feel alive even while idle, but idle motion must be subtle. The strongest motion belongs to an explicit user selection.

## 16.10 Motion grammar

Main-product motion should feel **pixel-discrete, short, and functional**.

Preferred patterns:

- `steps()` transitions for XP, start-screen grid, blinking, and pixel UI changes;
- 50–300ms feedback for button press / wrong answer / navigation flash;
- 0.8–1.5s loops for subtle blink/pulse;
- slow continuous movement only for map travel, graph flow, and background ambience;
- avoid bouncy spring motion, excessive parallax, and large auto-playing camera moves.

Signature micro-animations:

- save/completion flash in green;
- incorrect quiz answer: tiny horizontal shake + red/pink feedback;
- correct quiz answer: green pulse;
- current navigation target: brief gold flash;
- Think label: restrained stepped blink;
- map route: gold travel block;
- graph relationship: counter-flowing gold pixels on double links.

Always support `prefers-reduced-motion`. Reduced-motion mode should remove loops and transitions without hiding information.

## 16.11 Welcome / game-start screen

The first-load screen is a deliberate part of the product, not a generic splash page.

Default treatment:

- near-black background;
- large-spaced gold grid moving in discrete steps;
- subtle scanlines;
- centered dark card with 4px hard border and oversized gold offset shadow;
- corner pixel blocks;
- gold pixel title;
- simple floating/pulsing game icon or character;
- `开始学习` for new readers and `继续学习` when progress exists;
- existing progress may show completed-unit count and next unit.

The start screen should disappear quickly once the reader acts. It must not replay on every internal navigation.

## 16.12 Completion and Epilogue

The normal reading product uses the pixel/RPG shell. **The final Epilogue is intentionally allowed to break that shell.**

Current reference direction:

- fullscreen night-sky / dusk gradient;
- soft warm horizon glow;
- constellation / particle points assembling into a symbolic path or bridge;
- subtle luminous traveler moving along the completed form;
- translucent centered content shell;
- serif Chinese typography;
- warm cream/gold accent rather than neon game colors;
- slow, smooth cinematic motion rather than stepped pixel motion;
- optional persistent randomized endings for public readers.

The visual break should communicate: **the learning interface is over; this is a reward / farewell.**

Do not reuse the same “Unit Cleared” treatment for the whole-book ending.

## 16.13 Mobile visual and motion adaptation

Do not merely shrink desktop.

- long-form reading becomes one column;
- chapter navigation collapses into an explicit drawer/control;
- semantic cards remain full-width and readable;
- labels wrap instead of overlapping;
- touch targets remain comfortably large;
- map and graph may use **horizontal-only panning** while the page owns vertical scrolling;
- do not allow nested horizontal + vertical canvas scrolling;
- graph selection is single-tap; entering content uses a separate explicit action;
- mobile start screen compresses vertically without shrinking text below readability;
- mobile Epilogue becomes a full-height reading composition with stacked actions.

## 16.14 Visual QA gate

Before release, inspect at minimum:

- desktop widths around 1280 / 1440 / 1920;
- mobile around 360–430px width;
- long Chinese titles;
- long English canonical terms;
- selected / completed / unread Unit states;
- map top-level and chapter-level layouts;
- graph idle, selected, searched, and reset states;
- source-figure captions;
- Quiz wrong/correct feedback;
- 0%, partial, and 100% XP states;
- first-load screen and returning-reader screen;
- Epilogue and replay;
- `prefers-reduced-motion`.

Any text overlap, clipped node label, two-axis nested scroll, invisible action, or semantic-color inconsistency is a release blocker.

---

# 17. Progress and completion

Progress measures reading completion, not professional mastery.

Requirements:

- XP is derived from completed Source Units;
- at 100% completion the XP bar visibly reaches 100%;
- the final unit triggers a dedicated completion/epilogue state instead of a normal “unit clear” popup;
- the epilogue is replayable;
- it may depart visually from the main product if that makes the ending memorable;
- do not claim the reader is now a master/expert solely because the book is complete.

## Optional public multi-ending reward

For a public website, endings may vary between readers.

Recommended implementation:

- prepare a reviewed pool of epilogues;
- randomly assign one on first full completion;
- persist the selected ending locally so replay shows the same ending;
- optionally include rare endings;
- do **not** infer personality, skill, health, identity, or other sensitive traits from behavior;
- do not pretend a random ending was individually generated from private data;
- if no account/backend exists, different devices/browsers may receive different endings.

This creates a personal-feeling reward without profiling the reader.

---

# 18. Deployment

During review, a single-file HTML is convenient. At full-book scale, a static site is usually better:

```text
/index.html
/app.js
/data/*.json
/assets/figures/*
```

GitHub Pages is suitable for a static public build. `https` browser deployment avoids many limitations of opening a JS-heavy HTML directly from a mobile file-preview app.

localStorage progress is device/browser-local unless a separate sync backend is added.

---

# 19. QA gate

Before release, verify:

## Source
- every factual SOURCE claim has page/evidence;
- no citation backfill;
- source chapter order matches the real TOC;
- historical version claims remain historical;
- selected figure/caption pairs match;
- all explicit source-recommended links are accounted for.

## Learning
- derived summaries preserve meaning;
- hints contain reference answers;
- analogies explain rather than distort;
- quiz keys are not guessable from length/position patterns;
- practice tasks have observable value.

## Terminology
- canonical identities are stable;
- localized aliases are reviewed;
- search aliases do not alter graph identity;
- long-tail terms do not overload the default graph.

## Product
- READ / MAP / GRAPH have distinct jobs;
- core graph persists through focus;
- no duplicate index/card wall under graph;
- all jump paths work;
- mobile has no accidental two-axis nested scroll.

## Review/Public separation
- public contains no review DOM/state/feedback/export logic;
- private review supports multiple issues per unit and terminology review;
- review JSON round-trips correctly.

## Completion
- full completion fills progress;
- ending can be replayed;
- public multi-ending assignment, if enabled, is stable per browser and does not use sensitive profiling.

---

# 20. Final philosophy

The product should make the reader more willing to return to the source, not less.

> Read linearly. Meet knowledge again nonlinearly. Keep evidence close enough that confidence can always be checked.

The website is a learning interface over the book. The book remains the evidence layer.


---

# Book-Locked Profile — TA Adventure / Unity for Technical Artists

This section hard-locks the generic method to the current TA Adventure source and release. When it conflicts with a generic example, this profile wins.

## Source identity

```yaml
source_id: unity-ta-2021-lts
publisher: Unity Technologies
title: "Unity for Technical Artists: Key Toolsets and Workflows"
edition: "2021 LTS Edition"
published: 2022
pdf_pages: 92
learning_pages: P7-P91
current_source_units: 54
current_canonical_terms: 143
selected_source_figures: 19
current_total_xp: 3660
book_recommended_links_in_release: 118
current_official_links_in_release: 5
authoritative_practice_links_in_release: 20
```

## Canonical top-level TOC

The source TOC contains these top-level headings. Preserve them as the source truth:

1. Introduction — P6/P7 content
2. Prefabs — P8–10
3. Working with assets — P11–17
4. Render pipelines — P18–25
5. Shaders — P26–28
6. Lighting in Unity — P29–33
7. Worldbuilding — P34–42
8. Animation — P43–47
9. Cutscenes and cinematics — P48–53
10. Visual effects — P54–60
11. Scripting in Unity — P61–64
12. Profiling and debugging — P65–70
13. 2D game development — P71–75
14. Appendix 1: Digital humans in Unity — P76–85
15. Appendix 2: Additional art and design tools — P86–90
16. Unity for artists — P91

`Unity for artists` is a separate bold top-level TOC entry, not a child heading of Appendix 2. The current 54-unit release keeps `art_04` as a stable cross-heading closing unit covering P89–91 for compatibility; a future navigation-only cleanup may visually separate P91 without silently rewriting its Source Unit content.

## Current stable unit grouping

- **Introduction** — intro_01
- **Prefabs** — prefab_01, prefab_02
- **Working with assets** — asset_01, asset_02, asset_03, asset_04, asset_05, asset_06, asset_07
- **Render pipelines** — render_01, render_02, render_03, render_04, render_05
- **Shaders** — shader_01, shader_02
- **Lighting in Unity** — light_01, light_02, light_03
- **Worldbuilding** — world_01, world_02, world_03, world_04, world_05
- **Animation** — anim_01, anim_02, anim_03
- **Cutscenes and cinematics** — cine_01, cine_02, cine_03, cine_04
- **Visual effects** — vfx_01, vfx_02, vfx_03
- **Scripting in Unity** — script_01, script_02
- **Profiling and debugging** — prof_01, prof_02, prof_03
- **2D game development** — twoD_01, twoD_02, twoD_03, twoD_04
- **Appendix 1: Digital humans in Unity** — human_01, human_02, human_03, human_04, human_05, human_06
- **Appendix 2: More art and upcoming tools** — art_01, art_02, art_03, art_04

Do not rename these IDs casually; review state, progress, links, and exported feedback rely on them.

## Current Source Unit registry

| ID | Pages | Title |
|---|---|---|
| `intro_01` | P7 | TA 的角色，以及这本书真正要解决什么 |
| `prefab_01` | P9 | Prefab：把 GameObject 变成可复用模板 |
| `prefab_02` | P10 | Nested Prefab 与 Prefab Variant：组合和派生 |
| `asset_01` | P12 | Asset Pipeline：让资产遵守项目技术要求 |
| `asset_02` | P13 | Prefab Variant：给持续变化的 FBX 留出安全迭代层 |
| `asset_03` | P13 | AssetPostProcessor：把重复 Import Settings 变成规则 |
| `asset_04` | P14–15 | Importing assets 与 Asset Database：源文件和游戏数据不是一回事 |
| `asset_05` | P15 | Look Dev：在不同光照环境里验证 3D 资产 |
| `asset_06` | P16 | FBX Exporter：Unity 与 DCC 之间的 Roundtrip |
| `asset_07` | P17 | 其他 DCC：为什么原书仍然偏向 FBX |
| `render_01` | P19–20 | Render Pipeline 与 Rendering Path：先分清“管线”和“路径” |
| `render_02` | P20–21 | URP：用可扩展性覆盖更广的平台 |
| `render_03` | P21–22 | HDRP：高保真、PBR 与高端平台 |
| `render_04` | P23 | Custom SRP 与 Custom Render Pass：把“特殊效果”放进渲染流程 |
| `render_05` | P24–25 | Dynamic Resolution 与 Upscaling：先少算像素，再恢复输出 |
| `shader_01` | P27 | Shader、ShaderLab 与 Shader Graph：从代码到节点网络 |
| `shader_02` | P28 | Compute Shader 与 Surface Shader：离开普通像素着色之后 |
| `light_01` | P30–32 | Baked GI、Light Probes 与 Progressive Lightmapper |
| `light_02` | P32 | Real-time GI 与 Enlighten：适合缓慢变化的光 |
| `light_03` | P32–33 | Ray-traced GI：更快迭代，但硬件成本更高 |
| `world_01` | P35–37 | ProBuilder + Polybrush + FBX：从灰盒走向精修 |
| `world_02` | P37–38 | Terrain Editor 与 Terrain Tools：地形不是一块普通 Mesh |
| `world_03` | P39–40 | Trees、SpeedTree 与 Wind Zone：把植被作为系统来做 |
| `world_04` | P40 | URP Atmosphere：Skybox 与 Fog 的基础环境层 |
| `world_05` | P41–42 | HDRP Volumes、Sky、Fog 与 Clouds：用空间区域组织环境 |
| `anim_01` | P44–45 | Animation Clip、Animator Controller 与 State Machine |
| `anim_02` | P45–46 | Animation Window：在 Unity 里直接改属性与事件 |
| `anim_03` | P46–47 | Animation Rigging：运行时约束与程序化修正 |
| `cine_01` | P49–50 | Timeline 与 Sequences：把镜头、动画和事件编成可修改结构 |
| `cine_02` | P51 | Unity Recorder 与 Alembic：输出结果与传递复杂动画 |
| `cine_03` | P52 | Cinemachine：用“镜头意图”而不是每帧手调 Camera |
| `cine_04` | P53 | Live Capture：让真实设备进入虚拟制作流程 |
| `vfx_01` | P55 | Built-in Particle System：模块化、可脚本化的粒子系统 |
| `vfx_02` | P56–58 | VFX Graph：GPU 粒子与 Context → Block → Node → Property |
| `vfx_03` | P59 | Post-processing：把“镜头属性”和“风格处理”放到最后一层 |
| `script_01` | P62–63 | C#、GameObject、Component 与 Variable：先理解 Unity 的对象模型 |
| `script_02` | P63–64 | Visual Scripting：Node、Graph、Machine 与 Variable |
| `prof_01` | P66–68 | Profiler：先测量，再决定优化哪里 |
| `prof_02` | P68–69 | Frame Debugger：把一帧拆成 Draw Call 顺序 |
| `prof_03` | P69 | Rendering Debugger：把 Lighting、Material 与 Rendering 状态可视化 |
| `twoD_01` | P72–73 | Unity 2D Toolset：Sprite、骨骼动画与 PSD Importer |
| `twoD_02` | P73 | 2D Lighting：让 Sprite 也进入实时光照工作流 |
| `twoD_03` | P74 | Tilemap、Sprite Shape 与 Sprite Editor：三种不同的 2D 世界构建粒度 |
| `twoD_04` | P74–75 | Mixing 2D/3D 与 Pixel Perfect Camera |
| `human_01` | P77–78 | Digital Human：从 Performance Capture 到 4D Data |
| `human_02` | P79 | 4D Data Cleaning、Blend Shapes 与实时 Rig 约束 |
| `human_03` | P80 | Eyes：Cornea、Iris 与 Tearline 的分层处理 |
| `human_04` | P81 | Hair：Groom、Physics 与 Skin Attachment |
| `human_05` | P82 | Skin：Subsurface Scattering、Wrinkle Maps 与 Skin Tension |
| `human_06` | P83–85 | Body Animation 与 Clothing：跨 MotionBuilder、Maya、Marvelous Designer 的实时整合 |
| `art_01` | P87 | SpeedTree：独立植被工具如何接入 Terrain / SRP 工作流 |
| `art_02` | P87–88 | SyncSketch：让 Review 本身也成为生产工具 |
| `art_03` | P88–89 | Ziva 与 Weta：原书里的“Upcoming”必须带时间语境 |
| `art_04` | P89–91 | Source Control 与持续查最新资料 |

## Book-specific terminology policy

Canonical IDs are the professional terms used by Unity / DCC / graphics practice. Chinese is display/search metadata.

Important reviewed decisions include:

- `Look Dev` — English only.
- `Compute Shader` — English only.
- `Volume` — English only.
- `Camera Stacking` — English only; Chinese search alias `相机堆栈`.
- `Skin Attachment` — English only.
- `Marvelous Designer` — English only; include search alias `MD`.
- `Animator Controller` — `动画控制器` bilingual.
- `Animation Rigging` — `动画绑定` bilingual.
- `2D Renderer` — `2D渲染器` bilingual.
- `Component` — `组件` bilingual.

Terminology updates occur only through Private Review terminology data; canonical keys remain stable.

## Book-specific source-summary language

The Chinese learning layer should be Chinese-first. Preserve English inside parentheses when it is needed to connect to real Unity terminology. Original PDF evidence remains English.

Example:

```text
渲染管线（Render Pipeline）负责把场景内容变成屏幕结果；
渲染路径（Rendering Path）描述光照与着色的执行方式。
```

Do not turn `Look Dev`, `HDRP`, `URP`, package names, APIs, or common DCC names into unnatural Chinese merely for symmetry.

## Book-specific resource audit

The current release contains 118 `BOOK / 原书推荐` entries. The release audit must include every chapter-ending `More resources` link, plus prominent e-book cards, explicit learning paths, and clear source “read/watch/learn more/check out” links.

The source link set and later/current Unity docs remain separate. Current docs must not overwrite 2021 LTS historical source claims.

## Book-specific figures

Use PDF embedded images at original stream quality where possible. Do not re-JPEG UI screenshots. Caption/page mapping must be inspected visually, especially for pages with multiple figures such as Animation, Timeline/Sequences, 2D Animation, Terrain, Profiler, and Digital Human pages.

## TA Adventure product identity

Reader-facing product name: **TA Adventure**.

Keep:

- welcome/game-start screen;
- pixel/RPG HUD and reading progression;
- yellow/gold progress accents;
- world-map travel animation;
- persistent core terminology graph;
- bidirectional gold relationship animation;
- Chinese action buttons;
- source-first lesson sequence;
- full-book Epilogue after 54/54 completion.

Do not expose migration history, prototype mistakes, review workflow explanations, or statements about what the product “is not.”

### Book-specific visual & motion lock

For this Unity book, the visual system in Section 16 is **the current product specification, not an optional mood board**. Preserve these concrete characteristics unless the user explicitly changes them:

- `#0A0A0A` near-black base with subtle gold pixel grid and CRT scanlines;
- `#FFD700` as the dominant progress/navigation accent;
- cyan / orange / magenta / purple / green semantic lesson-card system;
- 3px hard borders, 4–6px offset shadows, square pixel framing;
- desktop READ layout around 1220px max width with ~400px chapter navigation + content column;
- yellow segmented XP bar and yellow scrollbar thumb;
- world map with gold travel marker and chapter/unit hierarchy;
- persistent full core terminology graph;
- selected-term focus by dimming unrelated nodes rather than replacing the graph;
- bidirectional double-link animation with gold pixels moving in opposite directions;
- Chinese-first action buttons;
- game-start screen with stepped gold grid, hard-shadow card, and Start/Continue state;
- final Epilogue intentionally switches from pixel-neon to cinematic night/dusk, serif typography, warm constellation/bridge motion, and may use persistent randomized endings.

When refactoring layout or Canvas code, preserve the **visual behavior**, not necessarily the original implementation details. In particular, the bidirectional double-link graph motion and gold map travel marker are signature interactions.


## Review build contract

Private Review supports:

- `PENDING / APPROVED / REQUEST_REVISION`;
- multiple `issues[]` per unit;
- Chinese reviewer-facing issue labels;
- terminology/Tag review;
- JSON import/export;
- revision-only export;
- stable unit IDs.

When feedback arrives, reopen the exact PDF pages and revise only flagged fields unless the reviewer explicitly requests a global rule change.

## Current completion contract

- all 54 Source Units complete → XP bar 100%;
- total XP = 3660;
- ending is replayable;
- public builds may use a pool of persistent randomized endings;
- randomized endings are rewards only and must not claim to diagnose the learner or infer professional mastery.
