# ADR 0003 — Use WebAssembly for Compatible Interactive Project Demos

## Status

Accepted

## Context

A defining feature of the portfolio is the ability to let visitors interact with selected projects rather than only reading descriptions or viewing screenshots.

Several portfolio projects are implemented in C and are suitable for interactive execution, including projects such as:

- `my_mouse`;
- `my_bsq`;
- potentially other algorithmic or systems-oriented projects.

The portfolio should preserve and demonstrate the original project logic wherever practical.

The website itself is statically hosted and does not include a backend execution service.

Therefore, interactive execution must either happen directly in the browser or require additional server-side infrastructure.

The architecture should avoid introducing a general-purpose remote code execution system because that would add significant complexity, infrastructure, security concerns, and operational cost that are outside the scope of the portfolio.

---

## Options Considered

### WebAssembly

Compatible C projects can be compiled to WebAssembly, likely using Emscripten.

The resulting architecture is approximately:

```text id="a8uuh0"
Browser UI
    ↓
TypeScript Adapter
    ↓
WebAssembly
    ↓
Original C Logic
```

This allows the original implementation to execute directly in the visitor's browser.

### Rewrite the Project Logic in TypeScript

The behavior of projects such as `my_mouse` could be rewritten in TypeScript specifically for the portfolio.

This would simplify browser integration because no WebAssembly boundary would be required.

However, the demo would no longer execute the original project implementation.

The portfolio would demonstrate a recreation of the project rather than the C implementation that the project page is intended to showcase.

Maintaining both implementations could also cause them to diverge over time.

### Remote Server-Side Execution

The portfolio could send input to a backend service that executes the original program inside an isolated server environment.

Conceptually:

```text id="fpw2d2"
Browser
   ↓
API
   ↓
Execution Service
   ↓
Container / Sandbox
   ↓
Original Program
```

This approach could support more kinds of projects and languages.

However, it would require substantial additional infrastructure, including:

- backend services;
- execution isolation;
- resource limits;
- security controls;
- deployment infrastructure;
- monitoring;
- potentially queues and concurrency management.

This complexity is not justified by the current portfolio requirements.

---

## Decision

Use **WebAssembly** for interactive demonstrations of compatible projects where executing the original project logic in the browser provides meaningful value.

C projects should be compiled to WebAssembly when practical and integrated with the portfolio through a project-specific demo.

WebAssembly is not required for every project.

Projects that cannot be meaningfully or safely demonstrated through browser execution should instead provide static technical content and an explicit unavailable demo state.

---

## Reasons

WebAssembly fits the project because:

1. It allows compatible original C implementations to execute directly in the browser.
2. It preserves the authenticity of the showcased project better than rewriting the project logic in TypeScript.
3. It does not require a backend execution service.
4. It fits the static-hosting architecture of the portfolio.
5. It allows demos to remain isolated from the rest of the website.
6. It provides a practical way to demonstrate algorithmic projects interactively.
7. Browser execution avoids introducing remote-code-execution security and infrastructure concerns.
8. It supports the portfolio's goal of making selected projects directly interactive.

The decision applies only where WebAssembly provides a useful and reasonable execution model.

---

## Consequences

### Positive

- Visitors can execute selected projects directly in the browser.
- Original C project logic can remain part of the demonstration.
- No backend execution infrastructure is required.
- Interactive demos remain compatible with static hosting.
- Projects such as maze solvers and algorithmic tools can provide richer demonstrations than screenshots alone.
- The portfolio can demonstrate integration between browser interfaces and lower-level compiled code.

### Negative / Trade-offs

- C projects require an additional compilation step.
- Emscripten or equivalent tooling must be understood and maintained.
- The browser-facing interface must be designed carefully because C and JavaScript use different data representations and execution environments.
- Some original programs may require adaptation before they can run meaningfully in a browser.
- Debugging failures across the TypeScript/WebAssembly boundary may be more complex than debugging a pure TypeScript implementation.
- Generated WebAssembly artifacts introduce additional build or repository-management considerations.
- Not every project is suitable for this execution model.

---

## Demo Boundary

WebAssembly belongs inside a project-specific demo rather than being treated as a global portfolio subsystem.

Conceptually:

```text id="w5ol7t"
Project Page
    ↓
Demo Section
    ↓
Demo Registry
    ↓
Project-Specific Demo
    ↓
TypeScript Adapter
    ↓
Optional WebAssembly
    ↓
Original Project Logic
```

The generic project page should not understand the internal details of WebAssembly execution.

A project-specific demo is responsible for handling the integration.

---

## Adapter Responsibility

The browser UI should not interact directly with the original compiled project wherever a clearer boundary is possible.

A TypeScript adapter should mediate between the browser and WebAssembly.

Typical responsibilities include:

- converting browser input into a representation expected by the compiled program;
- invoking exported WebAssembly functions;
- converting program output into browser-friendly data;
- exposing integration errors to the demo UI;
- keeping browser-specific concerns outside the original project implementation.

The intended separation is:

```text id="5asupj"
Demo UI
    ↓
TypeScript Adapter
    ↓
WebAssembly Interface
    ↓
Original C Logic
```

---

## Failure Isolation

WebAssembly execution is an optional enhancement.

A failure to:

- download a Wasm artifact;
- initialize the Wasm module;
- parse demo input;
- execute the project;
- process the project output;

must not make the project page unusable.

The project page should still provide:

- project description;
- technologies;
- algorithm or architecture information;
- technical decisions;
- challenges;
- source-code information;
- other available technical content.

The failure should remain isolated to the interactive demo.

---

## Scope

This decision does **not** require every project to have an interactive execution environment.

Examples of projects that may not use WebAssembly include:

- backend APIs;
- assembly implementations that do not provide a meaningful browser interaction;
- projects where execution would require infrastructure inappropriate for the portfolio;
- projects whose value is better demonstrated through architecture or technical explanation.

The content model explicitly supports projects with unavailable or planned demos.

---

## Deferred Decision: WebAssembly Artifact Generation

This ADR selects WebAssembly as the execution technology but does not decide how generated `.wasm` artifacts are produced for deployment.

Two potential strategies remain:

### Commit Generated Artifacts

```text id="bzudb6"
C source
   ↓
Developer compiles locally
   ↓
Generated Wasm committed
   ↓
Astro build uses artifact
```

### Generate During Build or CI

```text id="tdi60u"
C source
   ↓
CI / build environment
   ↓
Emscripten compilation
   ↓
Generated Wasm
   ↓
Astro build
```

The choice will be evaluated when implementing the first real WebAssembly demo.

The decision should consider:

- reproducibility;
- CI complexity;
- Emscripten version management;
- build duration;
- repository size;
- ease of local development.

---

## Architectural Constraint

Interactive execution must not lead to the introduction of a general-purpose remote code execution platform for V1.

If a future project cannot reasonably run using browser technologies such as WebAssembly, it should normally be represented through static technical content rather than expanding the infrastructure of the portfolio solely to execute it.

A remote execution system would require a separate architectural decision based on an actual future requirement.