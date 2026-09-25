# my_bsq browser artifact

This record accompanies the committed WebAssembly artifact for the `my-bsq` demo and follows [ADR 0004](../adr/0004-commit-webassembly-demo-artifacts.md). The portfolio build and CI consume the committed files; they do not fetch the source repositories or compile C.

## Source and toolchain

- Preserved collaborative academic source: `Kyupes/my_bsq` at `d1395c3f65cf55a7a6ba9133706858a2d0f30ed8`. This repository was not changed for the demo.
- Browser adaptation and build recipe: `Kyupes/my_bsq-web` at `70b9dcdb96216c26f7c510ab315d33dac34c9a7d`.
- Recipe files: `scripts/build-wasm.mjs` and `scripts/verify-wasm.mjs`. The build compiles `my_bsq.c` and `my_bsq_web.c` from that adaptation revision.
- Emscripten SDK: exactly `3.1.72`, run here through `emscripten/emsdk:3.1.72`.

The build uses `-O2 -std=c11 -Wall -Wextra -Werror -DMY_BSQ_NO_MAIN` and the module options `MODULARIZE=1`, `EXPORT_ES6=1`, `ENVIRONMENT=web,node`, `ALLOW_MEMORY_GROWTH=1`, and `ABORTING_MALLOC=0`. It exports `bsq_solve`, `bsq_result`, `bsq_size`, and `bsq_reset`, plus the Emscripten runtime methods `ccall` and `UTF8ToString`. The exact command is in the pinned build script.

## Regenerate

Check out exactly `70b9dcdb96216c26f7c510ab315d33dac34c9a7d` in a separate copy of `Kyupes/my_bsq-web`, then run from its root:

```sh
docker run --rm --mount "type=bind,source=$PWD,target=/src" --workdir /src emscripten/emsdk:3.1.72 node scripts/build-wasm.mjs
docker run --rm --mount "type=bind,source=$PWD,target=/src" --workdir /src emscripten/emsdk:3.1.72 node scripts/verify-wasm.mjs
```

Copy the resulting `dist/wasm/my_bsq.mjs` and `dist/wasm/my_bsq.wasm` together to `public/demos/my-bsq/`. Both files were generated and the verification script passed for this change. The browser loads them from `/demos/my-bsq/` only when the visitor runs the solver. Regenerate and update both hashes together if the adaptation source changes.

## Browser input and output

The project-specific TypeScript generator creates an LF-terminated `N` header followed by exactly `N` rows of `N` `.`/`o` cells. It protects a randomized empty candidate square and randomizes obstacles elsewhere; it does not find the largest square. The visitor sees this input before explicitly selecting **Encontrar maior quadrado**. The adapter sends the exact map to the C/WebAssembly interface. Status `0` returns the C-painted map (with `x` in the chosen square) and `bsq_size`; status `1` denotes invalid input and `2` denotes allocation or result-preparation failure. A size of `0` is valid for an all-obstacle input. The adapter resets the module after each attempt.

## Committed outputs

| File | SHA-256 |
|---|---|
| `public/demos/my-bsq/my_bsq.mjs` | `878fbbfb1e0fa1b9f97347a5e34af41b0e6c61eb3880ee75a4ed57f88c0b97e8` |
| `public/demos/my-bsq/my_bsq.wasm` | `f0d1c90de4f979f5fdf172b4bceb8d8652a0cd3b5130e65d302d6b230a979b3b` |

These hashes identify the exact committed pair. Portfolio CI validates the site but does not reproduce the WebAssembly build.
