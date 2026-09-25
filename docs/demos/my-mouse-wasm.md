# my_mouse browser artifact

This record accompanies the committed, deployable WebAssembly artifact for the `my-mouse` demo. It follows [ADR 0004](../adr/0004-commit-webassembly-demo-artifacts.md). The original and adaptation repositories may be private; the portfolio build and CI do not fetch either source repository or compile C.

## Source and toolchain

- Original project: `Kyupes/my_mouse` at `53c63883668fff3d5e395b422c7691bd6f475615` (recorded by the adaptation project; this original repository was not changed).
- Browser adaptation and generation recipe: `Kyupes/my_mouse-web` at `f33027c2c0c70153950e3153664d26831e162701`.
- Recipe files at that commit: `scripts/build-wasm.mjs`, `scripts/verify-wasm.mjs`, and the `mouse_web.c` / `mouse_web.h` interface.
- Emscripten SDK: `3.1.72`, via `emscripten/emsdk:3.1.72` (image digest `sha256:cb4535c7f341ff2c58936e40b4088c929240bdb787e64eb855590e1dcea44923`).

The build script compiles `my_mouse.c`, `maze_solver.c`, `error_handling.c`, and `mouse_web.c` with `-O2 -std=c11 -Wall -Wextra -Werror -DMY_MOUSE_NO_MAIN`. Emscripten options are `-sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=web,node -sALLOW_MEMORY_GROWTH=1 -sABORTING_MALLOC=0`. The exported C functions are `mouse_solve`, `mouse_result`, `mouse_steps`, and `mouse_reset`; runtime exports are `ccall` and `UTF8ToString`. The exact command construction lives in the pinned adaptation revision.

## Regenerate

An authorized maintainer with access to `Kyupes/my_mouse-web` can check out **exactly** `f33027c2c0c70153950e3153664d26831e162701` in a separate working directory and run, from its root:

```sh
docker run --rm --mount "type=bind,source=$PWD,target=/src" --workdir /src emscripten/emsdk:3.1.72 node scripts/build-wasm.mjs
docker run --rm --mount "type=bind,source=$PWD,target=/src" --workdir /src emscripten/emsdk:3.1.72 node scripts/verify-wasm.mjs
```

The build emits `dist/wasm/my_mouse.mjs` and `dist/wasm/my_mouse.wasm`. Copy both files together into this repository's `public/demos/my-mouse/` directory. The browser loads them from `/demos/my-mouse/my_mouse.mjs` and `/demos/my-mouse/my_mouse.wasm` only when the visitor activates the demo. The verification script checks a valid maze, the solved output and step count, and interface failure cases. Update this record and both artifacts in the same change whenever their source revision changes.

## Committed outputs

| File | SHA-256 |
|---|---|
| `public/demos/my-mouse/my_mouse.mjs` | `a43587c1940ee618ecb48605a8dbb025f7c6833f67a1ab8ebf29735e550250ad` |
| `public/demos/my-mouse/my_mouse.wasm` | `916662bd1b2ee9d46c7564aca1e6f7fe2f8e7d73b98caaad86c5c66611c93086` |

These hashes identify the generated files checked in with this change. Portfolio CI checks the website, but does not independently prove that the artifact was compiled from the recorded private source.
