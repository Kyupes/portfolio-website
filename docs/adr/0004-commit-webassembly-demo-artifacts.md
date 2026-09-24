# ADR 0004 — Generate WebAssembly Demo Artifacts Outside the Portfolio Build

## Status

Accepted

## Context

ADR 0003 selects WebAssembly for compatible C project demos but defers how deployable artifacts are produced. The portfolio is a static Astro site, while original project source may live in a separate, private repository. Requiring the portfolio build or CI to compile that source would add an Emscripten toolchain and access to external repositories to a workflow that currently needs neither.

## Options Considered

1. **Explicit local generation and committed artifacts.** An authorized developer compiles a pinned source revision with a pinned toolchain, then commits the generated files to the portfolio as static assets.
2. **Build- or CI-time generation.** The portfolio pipeline obtains the original source and runs Emscripten before building the site.

The second option could automate regeneration, but would couple ordinary portfolio validation and deployment to Emscripten, external source availability, and potentially credentials for private repositories. V1 does not yet have enough demos to justify that dependency.

## Decision

For V1, generate WebAssembly demo artifacts **explicitly outside the portfolio build**, from the original project source. Commit the deployable output to the portfolio repository's static assets (`public/` in Astro). The portfolio build copies these files; the project-specific browser demo consumes them as static assets. Neither Astro nor GitHub Actions compiles C to WebAssembly or fetches the original project repository.

Each demo that uses WebAssembly must have a version-controlled generation recipe before its first artifact is committed. The recipe must identify:

- the original source repository and exact full commit SHA used for the artifact;
- the exact pinned Emscripten SDK/toolchain version, not a floating `latest` version;
- the commands, relevant flags, input files, and expected output filenames;
- any generated companion files required at runtime, such as JavaScript glue or data files;
- how an authorized maintainer can regenerate the same artifact set locally.

Record the source revision and toolchain version in portfolio-versioned provenance alongside the recipe and artifacts. A private source repository may remain private: do not commit credentials or the original source merely to make portfolio CI build. The provenance is for maintainers and must not imply that visitors can access private source.

When source used by a demo changes, regenerate and recommit the corresponding artifact set from the new revision, and update its provenance in the same change. Do not label an old binary as representing newer source. Generated companion files must stay in sync with the `.wasm` file.

## Consequences

- Portfolio CI and deployment remain independent of Emscripten and access to external or private project repositories. They can validate the portfolio and the presence of committed assets, but do not prove that a binary was reproducibly compiled from its recorded source.
- Updating a demo requires a deliberate local compilation and artifact review. Generated files increase repository size and can become stale if the regeneration rule is not followed.
- The normal project page remains usable without the demo, as required by ADR 0003. This decision does not implement a demo, choose its adapter interface, or select an Emscripten version for a specific project.

## Reconsideration

If maintaining multiple demos makes explicit local generation impractical, reconsider build- or CI-time compilation in a new decision. That review should account for reproducibility, build duration, cache and repository size, toolchain maintenance, and secure access to any private source. Until then, compilation remains outside the portfolio pipeline.
