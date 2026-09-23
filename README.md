# Portfolio website

A personal software engineering portfolio showcasing backend and web projects, with interactive demos where practical.

## Requirements

- [Bun](https://bun.com/)

## Development

Install dependencies and start the local Astro development server:

```sh
bun install
bun run dev
```

The site is available from the Portuguese route at `/pt/`. The root route redirects to it.

## Project content

Shared project facts belong in `src/content/projects/{slug}.json`. Portuguese narrative content belongs in `src/content/project-content/pt/{slug}.md`, with future English entries under `en/`. See [the architecture document](docs/architecture.md#54-astro-content-representation) for the field split and validation rules.

## Validation

```sh
bun run check
bun run build
```

The check command runs the content-system tests and Astro diagnostics. The production build is generated as static files in `dist/`.
