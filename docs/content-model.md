# Portfolio project content model

## Purpose

This document defines the information each portfolio project can communicate. It is a conceptual content model, independent of a framework, programming language, storage format, or page implementation. It should be read alongside [the portfolio requirements](requirements.md).

Project content should work at two depths: a visitor can quickly understand what was built and what the student contributed, while an interested technical reviewer can read the relevant engineering details. Optional sections are omitted when they do not add meaningful evidence. In-progress work must be identified accurately.

## Project at a glance

```text
Project
├── Identity
│   ├── title
│   ├── slug
│   ├── summary
│   └── description
├── Classification
│   ├── status
│   ├── categories[]
│   ├── origin
│   ├── topics[]
│   └── technologies[]
├── Technical content
│   ├── technicalOverview?
│   ├── architecture?
│   ├── algorithm?
│   │   └── complexity? (time, space, explanation)
│   ├── technicalDecisions[]
│   ├── challenges[]
│   ├── testing?
│   └── lessonsLearned[]
├── sourceCode
│   ├── availability
│   ├── provider?
│   └── url?
├── demo
│   ├── availability
│   └── explanation?
└── completionDate?
```

`?` means optional. `[]` means a repeatable list; the table below says whether that list must contain at least one item. These groups describe meaning, not a required hierarchy in a future content file.

## Fields and rules

| Field | Presence | Meaning and constraints |
| --- | --- | --- |
| `title` | Required, one | Human-readable project name. |
| `slug` | Required, one | Unique, stable, URL-safe project identifier. |
| `summary` | Required, one | Short, plain-language answer to “What is this?” Suitable for a project card. |
| `description` | Required, one | Fuller account of what the project does, why it exists, and the student's contribution. Keep it understandable without the technical sections. |
| `status` | Required, one | `completed` or `in-progress`. Describe work in progress without implying finished results. |
| `categories` | Required, one or more | Broad kinds of software work. Initial candidates: `backend`, `algorithms`, `systems`, `web`. A project may belong to several. |
| `origin` | Required, one | Project context: `academic`, `personal`, or `professional`. |
| `topics` | Required, one or more | Specific concepts demonstrated, such as hash tables, pathfinding, authentication, or caching. Use consistent names from a vocabulary that grows with real projects. |
| `technologies` | Required, one or more | Languages, tools, frameworks, and platforms actually used. Use consistent names across projects. |
| `technicalOverview` | Optional, one | General explanation of how the solution works. |
| `architecture` | Optional, one | Meaningful structure, components, boundaries, or data flow. A relevant diagram may accompany this section. |
| `algorithm` | Optional, one | Explanation of an algorithm central to the project. May contain complexity analysis and a relevant diagram. |
| `technicalDecisions` | Optional, zero or more | Concise bullet points describing important choices and their reasons. |
| `challenges` | Optional, zero or more | Concise bullet points describing meaningful engineering difficulties. More detail can appear in the project narrative when useful. |
| `testing` | Optional, one | Testing approach and evidence, where this adds useful detail. |
| `lessonsLearned` | Optional, zero or more | Concise points about substantive lessons, where applicable. |
| `sourceCode` | Required, one | Explicit source availability, with conditional provider and URL. |
| `demo` | Required, one | Explicit interactive demo availability, with an optional visitor-facing explanation. |
| `completionDate` | Optional, one | A meaningful date or month for a completed project. Do not require an exact day or a start date. |

### Classification boundaries

These three lists answer different questions:

| Field | Question | Examples |
| --- | --- | --- |
| `categories` | What kind of engineering project is it? | Algorithms, Systems, Backend |
| `topics` | What concepts does it demonstrate? | Hash Tables, Breadth-First Search, Caching |
| `technologies` | What was it built with? | C, PostgreSQL, Redis |

For example, two projects may both have the `algorithms` category while only one has the `hash-tables` topic. Categories support the broad project filter. Origin supports its separate filter. Topics retain the detail needed to identify projects by concept without turning broad categories into an unstructured tag list. The choice of search or topic-filter controls belongs to the later interface design, not this model.

### Algorithm and complexity

`algorithm` is present only when describing an algorithm adds value. Its explanatory content can describe the approach, relevant inputs, and important trade-offs. If a complexity claim is meaningful and supportable, put it **inside `algorithm`** as `complexity` with:

| Complexity field | Meaning |
| --- | --- |
| `time` | Time complexity, with the relevant input variables made clear. |
| `space` | Space complexity, with the relevant input variables made clear. |
| `explanation` | Brief reasoning and assumptions behind the stated bounds. |

The `complexity` group is optional. Include `time`, `space`, and `explanation` when they are relevant and can be explained honestly; do not require an analysis for every project or create a separate project-level complexity field.

### Source code

`sourceCode.availability` is one of:

| Value | Meaning | Provider and URL |
| --- | --- | --- |
| `public` | Visitors can access the source. | A working `url` is required; `provider` identifies GitHub, Gitea, or another host. |
| `private` | Source exists but is not publicly accessible. | `provider` may identify its host if useful. No public source link is shown. |
| `unavailable` | No source can be offered or identified for visitors. | No public source link is shown. |

The source state may change as access changes; the project description should still stand on its own. Public mirrors of course work depend on permission to redistribute that work, which is an editorial check rather than another content-model field.

### Interactive demo

`demo.availability` is one of:

| Value | Meaning |
| --- | --- |
| `interactive` | The visitor can try a working interactive experience from the project page. |
| `planned` | An interactive experience is intended but is not yet available. |
| `unavailable` | No suitable interactive experience is offered for this project. |

`demo.explanation` can clarify a limitation or tell visitors why interaction is unavailable. When a demo is interactive, the project page should also give any instructions needed to use it. The model deliberately leaves the mechanism for launching or embedding the demo to later design. A project page remains informative when a demo is unavailable or fails.

## Editorial guidance

- Lead with `summary` and `description`; disclose technical depth through the sections that actually apply.
- Make the student's role clear in `description`, especially for team or academic work. Do not imply sole ownership or results that cannot be substantiated.
- Keep `technicalDecisions`, `challenges`, and `lessonsLearned` as short points, not nested reports.
- Use diagrams within `architecture` or `algorithm` when they clarify those explanations. A generic screenshot or media list is outside the core model.
- Keep the project facts and labels ready for a future complete English version. Version 1 content is primarily Portuguese; the separate English CV does not make project pages bilingual.

## Scope of this model

The initial model uses named technical sections for consistency. It has no generic custom-section mechanism, separate skills or highlights list, project-level screenshot collection, or project-level complexity field. A real project that does not fit should prompt a review of the model rather than speculative fields in advance.
