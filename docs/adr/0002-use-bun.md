# ADR 0002 — Use Bun as the Development and Build Toolchain

## Status

Accepted

## Context

The portfolio requires a JavaScript/TypeScript toolchain for:

- installing dependencies;
- running Astro;
- executing development scripts;
- running tests and validation;
- producing production builds.

The application itself will be statically generated and deployed to static hosting.

Therefore, the selected runtime/package-management tool is primarily a **development and build concern**, not a production-runtime requirement.

The project could use the traditional Node.js and npm ecosystem, but Bun is also compatible with the intended TypeScript and Astro workflow and provides several development tools through a single runtime.

---

## Options Considered

### Bun

Bun provides:

- a JavaScript/TypeScript runtime;
- package management;
- script execution;
- compatibility with much of the Node.js package ecosystem;
- direct support for common development workflows through a single tool.

This allows commands such as:

```text
bun install
bun run dev
bun run build
```

to use the same toolchain.

### Node.js with npm

Node.js with npm is the more established JavaScript development environment.

Advantages include:

- broad ecosystem compatibility;
- extensive documentation;
- widespread professional usage;
- mature tooling support.

It would satisfy all current portfolio requirements.

However, it would require using Node.js as the runtime together with npm as the package manager, whereas Bun can cover both responsibilities through one tool.

Other Node-compatible package managers such as pnpm or Yarn could also be used, but they do not provide a significant architectural advantage for this project.

---

## Decision

Use **Bun** as the primary development and build toolchain.

Bun will be used for:

- dependency installation;
- running Astro development commands;
- running project scripts;
- executing tests and checks;
- triggering production builds.

The project should use Bun consistently rather than mixing package managers unless a specific compatibility requirement makes this necessary.

---

## Reasons

Bun is appropriate for this project because:

1. It provides the runtime and package-management functionality required by the development workflow.
2. It supports the intended TypeScript and Astro stack.
3. It provides a simple and consistent command-line workflow.
4. It reduces the need to manage separate runtime and package-manager tooling.
5. Using Bun provides practical experience with a modern JavaScript runtime without requiring it to become part of the production architecture.
6. The current project does not depend on Node-specific production-server behavior.

The choice is partly a development preference rather than a requirement imposed by the portfolio architecture.

Because both Bun and Node.js with npm satisfy the project's functional requirements, Bun is selected for its development experience and because it is a technology worth gaining practical familiarity with.

---

## Consequences

### Positive

- Development commands use a consistent toolchain.
- Dependency installation and script execution are handled by the same tool.
- The project provides practical experience with Bun.
- TypeScript development remains straightforward.
- Bun does not need to be installed on the production hosting environment if the final site is deployed as static output.

### Negative / Trade-offs

- Bun is newer and less established than Node.js.
- Some JavaScript packages or tooling may assume Node.js-specific behavior.
- Compatibility issues may occasionally require investigation or workarounds.
- Contributors unfamiliar with Bun may need to install and learn an additional development tool.
- Documentation and troubleshooting resources may be less extensive than those available for Node.js and npm.

### Architectural Constraint

Bun is considered a **development and build dependency**, not an application production-runtime dependency.

The intended production architecture remains:

```text
Bun / Astro Build
        ↓
Static Output
        ↓
Static Hosting / CDN
```

rather than:

```text
Visitor
   ↓
Production Bun Server
```

If a future requirement introduces server-side runtime behavior, the appropriate production runtime should be evaluated separately rather than assumed to be Bun because Bun is used during development.