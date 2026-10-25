---
name: new-lesson
description: Create the next lesson (or a section's interview questions) in this Arabic-first interview prep repo, following the repo's structure, RTL formatting and exercise conventions. Use when the user asks for the next lesson, a new section, or section interview questions.
---

# Writing a lesson for this repo

The user is preparing for **mid-level** full-stack web interviews. Lessons are in
Arabic (Levantine, simple and clear) under `ar/`; an English copy will later live
under `en/` with the exact same structure.

## Golden rules

1. **One lesson per request.** Never generate a whole section at once. The user
   studies a lesson, solves its exercise, then asks for the next one.
2. Technical terms stay in **English** (closure, event loop, handshake...), the
   explanation is in Arabic.
3. Depth: **mid-level**. Include the "why", trade-offs, and at least one
   "🔥 mid-level" insight per lesson that interviewers like to probe.
4. Accuracy over confidence: prefer current facts (e.g. TLS 1.3 uses (EC)DHE,
   not RSA key exchange; HTTP/2 server push is removed). Point to MDN /
   Cloudflare Learning Center for verification.

## Teaching style (the user found dense lessons hard to follow)

- **Real-life analogy FIRST, then the technical term.** Every numbered section
  starts with `### 📦 مثال من الحياة` (a short everyday story), then
  `### 🌐 بالـ <topic>` mapping the story to the real thing.
- **One idea per section.** If a section needs 3+ new terms, split it.
- **Define every term the moment it appears**, in one plain sentence. Never use
  a term before it has been explained (no forward references like "we'll
  explain Anycast later" in the core part).
- **Core vs advanced:** the main sections cover what a mid-level candidate must
  explain. Everything deeper (protocol internals, history, edge cases, trivia)
  goes into a `## 🔍 للتعمق` section at the end, after the verification
  questions. Put the user's own discoveries/questions from the lesson there too.
- Short sentences, lists over paragraphs, concrete examples from the user's own
  machine/results when available.
- In chat: a small clarification question gets a short answer (a few lines),
  not a lecture.
- Reference example: `ar/00-web-fundamentals/02-dns.md`.

## Folder layout

```
ar/NN-section-name/
├── README.md                     ← section index + lessons status list
├── NN-lesson-slug.md             ← the lesson
├── exercises/
│   ├── NN-exercise-slug.js       ← stubs the user fills in
│   └── NN-exercise-slug.test.js  ← node:test tests
├── solutions/
│   └── NN-exercise-slug.js
└── interview-questions.md        ← only when the section is finished
```

Sections roadmap (root `README.md`): 00 web fundamentals, 01 CS fundamentals,
02 Git, 03 HTML, 04 CSS (+Tailwind), 05 JS, 06 DOM & Browser APIs, 07 DSA
(+LeetCode), 08 TS, 09 React (+state management), 10 Next.js, 11 Node & Express,
12 Databases & SQL, 13 APIs & Auth, 14 Web Security, 15 Performance &
Accessibility, 16 Testing, 17 System Design, 18 Behavioral, final mock interview.

## RTL / bidi formatting (very important)

Arabic + English + numbers mixed together get scrambled by the bidi algorithm.

- Wrap Arabic prose in `<div dir="rtl">` ... `</div>` with a blank line after the
  opening tag and before the closing tag (so markdown renders inside).
- **Close the div before every code block** and reopen it after. Code blocks
  must sit outside the RTL div, otherwise punctuation flips (`;foo()`).
- Diagrams/ASCII art go in code blocks and use **English labels only**.
- **Never write digit ranges like `172.16-31`**: they render reversed. Use CIDR
  (`172.16.0.0/12`) or "من `X` لـ `Y`" with separate code spans.
- Avoid tables whose cells mix Arabic with English/numbers heavily. Prefer
  headings + bullet lists that **start with an Arabic word**, or put
  English/number-heavy data in an LTR code block with English labels.
- Tables are OK when each cell is mostly one language.
- **Every line / list item / numbered item must START with an Arabic word.**
  Bold labels must be Arabic (`**بالأول:**`), never `**ICANN:** ...`.
  If the subject is English, lead with an Arabic noun: "منظمة **ICANN** بتوافق".
- **Never write leading-dot tokens inline** like `.gram`, `.com`, `.me`: the dot
  jumps to the end ("gram."). Write the name without the dot ("دومين com") or
  put it inside an LTR code block.
- Keep English to single words inside Arabic sentences; move English-heavy
  sequences (flows, lists of names) into an LTR code block.

## Code files (exercises, tests, solutions): ENGLISH ONLY

All comments, JSDoc, hints and messages inside `.js` files are in **English**
(Arabic in code comments renders backwards in editors). Arabic explanations
belong in the `.md` lesson.

## Lesson `.md` template

1. `# NN: <Arabic title>`
2. `## 🎯 أهداف الدرس`: bullet list of outcomes
3. Numbered sections `## 1. ...` with explanation, analogies (📦), callouts
   (`> 💡`, `> ⚠️`, `> 🔥 mid-level`), and code/diagrams
4. `## 📌 الملخص`: one-line-per-concept recap
5. `## 🏋️ التمرين`
   - Part 1 (when relevant): hands-on commands for **Windows PowerShell**
     (use `curl.exe`, not `curl`) + "أسئلة للتفكير"
   - Part 2: code exercise, link to the exercise file, the exact test command,
     tip to run the tests first and watch them fail
   - Mention the LeetCode problem number/link if the exercise is a real one
6. `## ❓ أسئلة تحقق`: 5–8 questions (then `## 🔍 للتعمق` comes right after), each answer hidden:
   ```html
   <details>
   <summary><b>1. Question?</b></summary>

   <br>

   Answer...

   </details>
   ```
7. `## 🎤 مقابلة تجريبية`: link to the lesson's mock interview file (see below)
8. `## 📚 مصادر إضافية (اختياري)`: only well-known, stable links
9. Footer nav: `[🏠 الفهرس](./README.md) · **الدرس التالي:** <next> ➡️`

## Exercises

- ESM (`"type": "module"` in root `package.json`), `export function ...`.
- Stub body: `// Write your solution here` (return nothing, tests fail at first).
- Each stub has a JSDoc block: what it returns, rules, examples (`→`), and a
  💡 hint that nudges toward the edge case without giving the answer.
- Tests: `import { describe, it } from 'node:test'` and
  `import assert from 'node:assert/strict'`. Group with `describe`, name `it`
  cases by behaviour, cover tricky edge cases.
- Solutions: clean, interview-quality code with short English comments explaining
  traps, an optional alternative approach, and a `🧠 Takeaways` block at the end.
- For HTML/CSS sections where unit tests don't fit, use an exercise folder with
  a starter file + a checklist in the lesson instead.

## Mock interview prompt (every lesson)

File: `ar/NN-section/mock-interviews/NN-lesson-slug.md`. The user pastes it into
ChatGPT/Claude/Gemini for a spoken-style mock interview.

- Short Arabic intro in an RTL div: how to use it + tips (answer from memory,
  use voice mode, think out loud when unsure).
- The prompt itself in a ```text code block, **written in English** (so it
  copies cleanly and stays LTR), instructing the AI to:
  - act as a senior engineer interviewing for a MID-LEVEL role
  - speak Levantine (Syrian) Arabic, keep technical terms in English
  - only ask about an explicit bullet list of the lesson's concepts (include
    anything extra discussed with the user during the lesson)
  - ask ONE question at a time and wait; 10 questions, easy → medium → hard,
    with "why" questions, a trade-off question and a practical scenario
  - after each answer: score 1–5, honest feedback, short model answer,
    occasional follow-up question; give a hint first when I say I don't know
  - end with total /50, strong/weak topics, what to review, readiness verdict
- Use `ar/00-web-fundamentals/mock-interviews/01-how-the-internet-works.md` as
  the reference example.

## Before finishing

1. **Verify the solution passes the tests** by copying the solution + test file
   (plus a `{"type":"module"}` package.json) into the scratchpad and running
   `node --test` there. Never overwrite the user's exercise file.
2. **Run the RTL checker** on every Arabic `.md` file you created or changed:
   `node .claude/skills/new-lesson/rtl-lint.mjs <file.md> ...`
   Fix every `L` (line starts with English), `D` (leading-dot token),
   `C` (Arabic inside a code block) and `R` (digit range). `L` hits on table
   rows are OK only if each cell is in one language.
3. Update the section `README.md` lesson table and the root `README.md` roadmap
   status (⬜ → 🟡 → ✅).
4. Don't commit or push unless the user asks.

## Section interview questions (`interview-questions.md`)

Only after the last lesson of a section. Split into 🟢 سهل / 🟡 متوسط / 🔴 صعب,
answers hidden in `<details>`, include "how to answer" tips and common follow-up
questions an interviewer might ask.
