# Author Macro Handler blocks with AI

Use MH AI, your preferred assistant or a coding tool to prepare a reusable Macro Handler Lua block. The same `.mhblock` contract applies regardless of the model or platform. Review its source and validate it before installation or execution.

## Review, then download

- [Download the English AI authoring brief — sdk-v1.1.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/sdk-v1.1.0/block-plugin-ai-brief.txt)
- [Read the complete brief here](../sdk/block-plugins/AI_AUTHORING_BRIEF.md)
- [SDK and authoring workflow](block-authoring-sdk.md)
- [JSON schema and editor setup](block-json-schema.md)
- [Versioned release and SHA-256 checksums](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/sdk-v1.1.0)

## Give the assistant a verified contract

Provide the brief, JSON schema, a relevant SDK example, and the [real Lua API reference](https://macrohandler.com/api) or [LuaLS definitions](https://github.com/fnzbrn/macrohandler-lua-definitions). State the exact target reader/build. The prepared schema-4 design contract targets Macro Handler 1.0.51 (65); older builds with that version text may not contain it.

Describe:

1. The intended task, success/failure conditions and cancellation behavior.
2. User-editable settings, types, defaults, limits, units, help and basic/advanced groups.
3. Actual screen reference plane, target images/regions and required permissions. If unknown, ask the assistant to request them instead of inventing values.
4. Bounded loop/retry/delay behavior, runtime form interactions and explicit result storage.
5. The chosen semantic icon and category. Native declarative fields are supported; arbitrary HTML/native widgets are not. Schema 4 additionally supports an embedded offline PNG, tabs and validated settings buttons.

## Example request

> Create one complete schema-4 `.mhblock` JSON package for the verified Macro Handler reader. Use a local function for the block body, editable bounded timing settings, Work/Output tabs, grouped help text, a `flow` fallback icon and atomic settings presets. Add an embedded PNG only from a real locally normalized image, never fabricated base64. Follow the attached SDK and real APIs. Handle dialog cancellation and retry failure. Do not invent APIs, coordinates, permissions or automatic output ports. Return one fenced JSON object and explain the settings and device test steps separately. Do not run or install anything.

Use a new dotted lowercase ID and a bumped version when changing an existing package. A runtime `Form` is distinct from the generated block editor. `Module` is a local helper registry, not a download manager. Follow documented `Workflow` result fields rather than guessing them.

## Review and test

1. Read the generated code. Confirm every API, parameter and return assumption against the actual reference.
2. Save the complete UTF-8 JSON as `.mhblock`; do not paste partial fragments into a package. Never embed API keys, account credentials or private user data.
3. Validate with `node mhblock.mjs validate my-block.mhblock`. A structural pass still requires Android's compiler/sandbox checks.
4. Import through **Add block → Import → Plugins**. Review and explicitly confirm installation.
5. Configure and test in a separate trial macro on the actual target screen/device, including cancellation, denied permissions, failure paths and Stop. Share only after that review.

MH AI can present validated draft cards or downloads; provider output never automatically installs or executes a plugin. Model context limits are separate from the package's 256-KiB import limit: a large importable package may not fit a chat request. Supply a complete file for repair rather than relying on an already truncated message.

AI generation is assistance, not runtime evidence or a guarantee of a flawless automation. The SDK requires no AI account or server execution. If you choose an external provider, its credentials, costs, quotas and privacy rules belong to that provider/account. [Macro Handler MH AI](https://macrohandler.com/mh-ai).

## Schema 4 design support

Use `examples/designed-counter.mhblock` for an embedded offline PNG, Work/Output tabs, two settings profiles and reset. At most eight preset/reset buttons can update existing typed fields; buttons never execute Lua. Images are bounded, static 8-bit RGB/RGBA PNGs without metadata. Use the app image picker to normalize a local source image rather than inventing base64. Arbitrary HTML/CSS, editor callbacks and downloaded native widgets are not supported. The app applies the native theme, focus and accessibility controls.

This release requires the updated schema-4 reader. Older schema-3 readers reject schema 4 even when the app version text is 1.0.51. Existing schemas 1–3 remain valid. Saved macro copies retain their design and settings; bump the package version after edits. [Full exact limits and examples](../sdk/block-plugins/README.md).
