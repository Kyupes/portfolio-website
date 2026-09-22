# ADR 0001 — Use Astro as the Website Framework

## Status

Accepted

## Context

The portfolio website is primarily a static, content-driven application.

Most pages are intended to present:

- project information;
- technical explanations;
- CV information;
- contact information;
- other portfolio content.

Most of this content does not require client-side JavaScript.

Some parts of the application do require browser-side interaction, particularly:

- project filtering;
- interactive project demonstrations;
- WebAssembly-based demonstrations for compatible projects.

The project also requires:

- reusable project pages;
- content-driven project generation;
- static deployment;
- isolated interactive functionality;
- no backend or application server for V1.

The selected framework should therefore support static content efficiently while allowing client-side interaction only where it is actually required.

---

## Options Considered

### Astro

Astro is designed around static and content-oriented websites.

Relevant characteristics include:

- static site generation;
- reusable components;
- content-oriented development;
- minimal client-side JavaScript by default;
- selective hydration for interactive components;
- compatibility with static hosting;
- no requirement to introduce React or another frontend framework unless needed.

### React Single-Page Application

A React SPA could provide reusable components and rich client-side interaction.

However, it would make client-side JavaScript a central part of the application even though most portfolio pages are static content.

This would introduce more runtime JavaScript and client-side application behavior than the current requirements justify.

### Plain HTML, CSS, and TypeScript

The website could be implemented without a framework.

This would minimize framework dependencies, but would require implementing or organizing concerns such as:

- reusable page composition;
- routing;
- static page generation;
- project content processing;
- component reuse;

without the framework support that Astro provides.

As the number of projects and project pages grows, this would increase manual implementation and maintenance effort.

---

## Decision

Use **Astro** as the website framework.

The V1 website will primarily use Astro for static site generation.

Most portfolio content should be rendered at build time.

Client-side JavaScript should be introduced only for functionality that requires browser interaction, such as:

- project filtering;
- interactive project demonstrations.

Other frontend frameworks such as React should not be introduced unless a specific feature provides a clear reason to use them.

---

## Reasons

Astro fits the architecture of the project because:

1. The portfolio is primarily static and content-driven.
2. Most pages do not require client-side JavaScript.
3. Project pages need to be generated from reusable content rather than implemented individually.
4. Interactive features can remain isolated from the static application.
5. Static output fits the intended CDN/static-hosting deployment model.
6. The architecture can support WebAssembly-based demos without making them responsible for the rest of the application.
7. Astro allows additional frontend frameworks to be introduced later without requiring one for the entire website.

The decision follows the project's static-first principle rather than choosing a framework based only on familiarity or popularity.

---

## Consequences

### Positive

- Most of the website can be delivered as pre-generated HTML.
- Client-side JavaScript can remain limited.
- Static deployment remains simple.
- Reusable project pages fit naturally into the framework.
- Interactive demos can be isolated from normal project content.
- The application can remain usable even when interactive functionality fails.
- A separate frontend framework is not required for V1.

### Negative / Trade-offs

- Astro-specific concepts must be learned and maintained.
- Interactive features require an explicit distinction between build-time and browser-runtime behavior.
- Some functionality may require client-side islands or equivalent Astro mechanisms.
- The project content implementation will rely on Astro's build-time content-processing model.

### Architectural Constraint

Astro should remain responsible for the website and presentation layer.

Project-specific logic, WebAssembly integration, and original project implementations should remain separated from Astro-specific concerns wherever practical.

Choosing Astro should not cause unrelated parts of the system to become unnecessarily coupled to the framework.