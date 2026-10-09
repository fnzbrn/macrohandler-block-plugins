# Build your own Macro Handler block

Create a reusable `.mhblock` package with Lua behavior and typed, editable properties. Import it into Macro Handler and add instances to the **No-Code** or **Logic** workspace. Share the same package with other users, or give the SDK and authoring brief to MH AI or another assistant.

**SDK release:** `sdk-v1.1.0` · **Reader target:** the prepared Macro Handler 1.0.51 (65) schema-4 design code line. An older installation with the same version text may lack this reader; the current Google Play baseline must not be assumed to support it.

## Review, then download

- [Download the reviewed SDK ZIP](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/sdk-v1.1.0/block-plugin-sdk.zip)
- [Release notes, individual assets and SHA-256 checksums](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/sdk-v1.1.0)
- [Browse the complete SDK source and contract](../sdk/block-plugins/README.md)
- [JSON schema guide](block-json-schema.md)
- [AI authoring guide](block-ai-authoring.md)

The ZIP includes the CLI, structural validator, JSON schema, editor types, examples, tests, AI brief and scoped license. It contains no application binary, Android engine, account credentials or third-party native library. Download files are hosted by GitHub.

## What can you build?

Use the application's actual registered Lua APIs for a reusable scenario: bounded loops, conditional decisions, screen/image/color/text operations, touch actions, local helper modules, runtime forms and workflows. Each action still requires the normal app permissions, membership and runtime checks. A package is code plus data; importing it does not execute it.

| Area | Supported contract |
| --- | --- |
| Behavior | Lua executed by the existing application compiler/runtime; local functions and real APIs |
| Editable properties | Text, number, boolean, choice, color, Lua-global name, point and region |
| Native editor UI | Sections/groups or tabs, help, units, basic/advanced fields, multiline/required text, bounded numbers and atomic preset/reset buttons |
| Presentation | Custom package name, description, category and a local embedded PNG image (32 KiB / 256 pixels) or one of six semantic icons: `block`, `code`, `search`, `touch`, `flow`, `data` |
| Runtime interaction | The real `Form` API; this is separate from the block property editor |
| Reuse and flow | The real `Module` and bounded `Workflow` APIs; no external package manager |
| Distribution | Export/import one UTF-8 `.mhblock` file; immutable package ID + version |

The **application renders the UI using its own accessible native controls**. Arbitrary HTML/CSS, downloaded Java/DEX/native widgets, new permissions and automatic No-Code output ports are not supported. Complexity comes from composing supported Lua operations and typed controls, within the runtime's budgets; this SDK does not claim unlimited computation or certify arbitrary generated code.

## Offline development

Install Node.js 20 or later. Extract the ZIP and open that directory in VS Code. No npm installation, network request, account or API key is needed by the CLI.

```sh
node mhblock.mjs validate examples/repeated-log.mhblock
node mhblock.mjs validate examples/form-workflow.mhblock
node mhblock.mjs pack examples/repeated-log.mhblock --code my-block.lua --out my-block.mhblock
node --test test/package.test.mjs
```

`pack` never overwrites an existing output file. Change the template's ID, version and metadata before distributing it. `structuralValidation: passed` is **not** a full Lua compilation or a runtime guarantee: Android validation remains required.

In VS Code, the included `.vscode/settings.json` associates `.mhblock` files with the schema without adding an unsupported `$schema` property to the package. For Lua completion, also use the [official Macro Handler LuaLS definitions](https://github.com/fnzbrn/macrohandler-lua-definitions). Read the [actual API reference](https://macrohandler.com/api) for parameter and return contracts.

## Create directly in the app

1. Open **Add block → Plugins → Create block** in either workspace.
2. Set the package ID, version, name, description, category and fallback semantic icon. Choose icon image normalizes a local image. Design layout and buttons edits ordered native groups/tabs and atomic preset/reset actions.
3. Write Lua behavior and define properties. Read their typed values using `inputs.key`; values are compiled as Lua literals, not concatenated executable source.
4. Use **Preview properties** to inspect a detached draft. Preview does not execute code or change the open macro.
5. Explicitly choose **Add to block library** after review. Add it to a separate trial macro and test the normal start/stop and permission paths.
6. Choose **Export .mhblock** to distribute the definition. Installation and export are separate operations and never start a macro.

For external files, use **Add block → Import → Plugins**, inspect the package and confirm installation. Then add it from the Plugins palette. Configured instances keep their embedded definition and settings; library updates do not silently rewrite existing macros.

## Designing a complex scenario

Separate the task into local helpers and bounded stages. Use groups for related settings, basic fields for common controls, advanced fields for tuning, and descriptive help/units. Validate cancellation and error results from runtime dialogs and workflows. Obtain the user's real reference plane, regions and image assets; examples must not guess touch targets.

Use the SDK's form/workflow example to study runtime cancellation, numeric validation and retry results. Consult the full SDK README for field defaults, coordinate normalization, explicit Lua-global outputs and source-proven API usage. An external assistant must return one complete JSON package, never invented namespaces or executable UI.

## Versioning, limits and safety

- File: **256 KiB UTF-8** including JSON overhead. Up to **24 properties**, **8 groups**, **64 choices per choice property**.
- Schema 3 Lua: **131,072 UTF-8 bytes**, also subject to the package limit. Other exact bounds are documented in the SDK README.
- Schema 1 is legacy Lua. Schema 2 is restricted to the four existing official native descriptors; it cannot register a new native engine. Schema 3 provides the advanced declarative Lua editor; schema 4 adds embedded icons, tabs and settings actions.
- Same ID + version cannot be replaced with different content. Increase the version when editing. Installed macro copies remain frozen until the user explicitly replaces/edits them.
- Unknown properties, malformed/duplicate JSON keys and invalid input metadata are rejected. Android performs authoritative package, compiler, scope, permission and stop checks.
- Checksums identify bytes; they do not authenticate a publisher. Review source before running untrusted packages.

Test on the intended reader/device before publishing your own release. A successful SDK or emulator test does not guarantee another application's UI, physical-device behavior or Google Play approval. [Android's dynamic code guidance](https://developer.android.com/privacy-and-security/risks/dynamic-code-loading) explains the risks of loading external executable code; this contract reuses existing interpreters and native controls instead of adding a native loader.

## Product and license

- [Macro Handler website](https://macrohandler.com)
- [Macro Handler on Google Play](https://play.google.com/store/apps/details?id=com.macrohandler.app)
- [Optional official block guides](../README.md)

The SDK tooling, examples, schema and documentation are MIT licensed under the included SDK license. The license does not grant rights to the Android application, native engines, private assets or third-party content.

## Schema 4 design support

Use `examples/designed-counter.mhblock` for an embedded offline PNG, Work/Output tabs, two settings profiles and reset. At most eight preset/reset buttons can update existing typed fields; buttons never execute Lua. Images are bounded, static 8-bit RGB/RGBA PNGs without metadata. Use the app image picker to normalize a local source image rather than inventing base64. Arbitrary HTML/CSS, editor callbacks and downloaded native widgets are not supported. The app applies the native theme, focus and accessibility controls.

This release requires the updated schema-4 reader. Older schema-3 readers reject schema 4 even when the app version text is 1.0.51. Existing schemas 1–3 remain valid. Saved macro copies retain their design and settings; bump the package version after edits. [Full exact limits and examples](../sdk/block-plugins/README.md).
