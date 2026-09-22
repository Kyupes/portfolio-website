# Portfolio website requirements

## Purpose and audience

Create a professional, personal portfolio for a second-year Software Engineering student focused on backend and web development. Its main purpose is to give technical hiring managers and software engineers involved in hiring, followed by recruiters and HR, concrete evidence of the student's qualifications through real completed and in-progress projects. The site should help visitors understand who the student is, what they can do, and how to contact them, even without professional software development experience.

The tone should be professional with a modest amount of personality. Project information should be quick to scan while allowing interested visitors to read more technical detail.

## Version 1 scope

- A public portfolio with an introduction, qualifications, project listings, individual project pages, CVs, and contact links.
- Portuguese as the primary site language in version 1. Content and site structure should allow a complete English version and a language selector to be added later.
- Completed projects and clearly labeled work-in-progress projects.
- Interactive demos for selected compatible projects. Demos are a defining feature of the portfolio, but availability is decided per project; work-in-progress projects generally do not need one.
- Client-side project filtering by technical category and origin, without backend requests.
- No backend for the portfolio in version 1.

## Functional requirements

| ID | Requirement |
| --- | --- |
| FR-01 | Visitors can read a concise introduction describing the student, their backend/web focus, and relevant qualifications. |
| FR-02 | Visitors can browse a list of real projects, including completed and in-progress work, and open a dedicated page for each project. |
| FR-03 | Each project page presents a clear title, short non-technical summary, project status, origin, relevant technologies or technical categories, the student's contribution, and what the work demonstrates. Information that does not apply to a project may be omitted. |
| FR-04 | Each project page can provide deeper technical information that is initially minimized or disclosed on demand. Where relevant, this may explain the problem, approach, engineering decisions, challenges, testing, lessons learned, and algorithm complexity. |
| FR-05 | A project with an interactive demo gives the demo a prominent, discoverable place on its page and enough instructions for a visitor to try it. Pages for projects without demos remain complete and useful. |
| FR-06 | Project status and demo availability are communicated clearly; a work-in-progress project is not presented as complete. |
| FR-07 | A public source link may be shown when available, including a repository hosted outside GitHub such as Gitea. A project remains publishable when its repository is private, inaccessible to visitors, or has no public URL. |
| FR-08 | Visitors can filter the project list by technical category and project origin. Filtering happens in the browser without a backend request, and visitors can return to the full list. |
| FR-09 | Visitors can view the Portuguese and English CVs in the browser and directly download either one. The two CVs do not imply that the rest of the site is translated in version 1. |
| FR-10 | Visitors can reach the student through visible email, LinkedIn, and GitHub links. No contact form is required. |
| FR-11 | Project entries can be added or updated consistently without redesigning the listing and project-page presentation each time. |

## Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-01 | The site works on common desktop and mobile screen sizes. |
| NFR-02 | Core portfolio content remains readable and navigable when a project demo is unavailable or fails. |
| NFR-03 | Navigation, controls, CV links, filters, and demos are understandable and usable with keyboard input and assistive technology where applicable. |
| NFR-04 | Pages and project summaries load promptly under ordinary network conditions; optional demos do not prevent visitors from reading project information. |
| NFR-05 | Project facts, status, links, and CV files are maintainable and accurate. The site makes no unsupported claims about experience, results, or access to private source code. |
| NFR-06 | The content structure can support full Portuguese and English versions later, including equivalent project information and a language selector, without duplicating the entire site design. |

## Non-goals for version 1

- A backend service, database, authentication, user accounts, or content management system.
- Ecommerce, paid services, or a product for other users to build portfolios.
- A general-purpose platform for uploading and executing arbitrary projects or source code.
- Interactive demos for every project. In particular, no demo for the assembly project or Employee Management API in version 1.
- A complete English site or language selector in version 1.
- A contact form or additional contact channels beyond email, LinkedIn, and GitHub.

## Assumptions and constraints

- The initial portfolio content and presentation are in Portuguese; English CV availability is independent of site translation.
- Project demonstrations depend on each project's suitability for a browser experience and can be added or changed separately from the core project page.
- Some course repositories may be on Gitea or may not be publicly accessible. The portfolio must explain the work without relying on a public repository link.
- Project descriptions should be understandable to recruiters while giving technical reviewers a path to more detail.
- Contact details, CV files, and project descriptions must be supplied and reviewed by the portfolio owner before publication.

## Success criteria for version 1

1. A visitor can quickly identify the student's focus, qualifications, and the purpose of the portfolio from the introduction and project list.
2. A recruiter can understand each showcased project's value from its short summary without opening technical details.
3. A technical reviewer can open a project and find substantive technical information when it is available.
4. A visitor can try at least one suitable completed project directly from its page, while projects without demos remain understandable and complete.
5. A visitor can filter projects by technical category and origin and restore the full list without a page reload or backend request.
6. Both Portuguese and English CVs can be viewed in the browser and downloaded directly.
7. Email, LinkedIn, and GitHub contact routes work, and projects with inaccessible or absent public repositories do not display broken source links.
8. The site is usable on desktop and mobile, and failure of a demo does not block access to the rest of the portfolio.

## Review note

This document defines the product requirements and version 1 boundary. Specific frameworks, content formats, demo technologies, hosting, and visual design belong in later architecture and design decisions.
