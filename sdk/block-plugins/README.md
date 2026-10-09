# Macro Handler block authoring SDK

Author a `.mhblock` UTF-8 JSON package for the existing No-Code and Logic block library. This source SDK targets readers with schema 4 design support in the prepared 1.0.51 code line. Version text alone is not proof that an older installed 1.0.51 build supports schema 4. Schemas 1–3 remain supported. Schema 1 Lua and schema 2 official native descriptors remain supported separately.

Requires Node.js 20+; no dependency installation, network, account or API key. From this extracted directory:

```sh
node mhblock.mjs validate examples/repeated-log.mhblock
node mhblock.mjs pack examples/repeated-log.mhblock --out my-block.mhblock
node mhblock.mjs pack examples/repeated-log.mhblock --code my-block.lua --out custom.mhblock
node --test test/package.test.mjs
```

`pack` reads one package template, optionally replaces its `code` with a separate UTF-8 file, validates structure, and writes deterministic JSON with explicit defaults. Output creation is exclusive: existing files are never replaced. Hashes identify the **SDK file bytes**, not Android's canonical package fingerprint. Java/JavaScript floating-point serialization can differ. Android parses the same values and computes its own canonical identity; do not substitute an SDK file hash for that identity.

The adjacent `package.d.mts` provides JavaScript/TypeScript editor completion for all eight field types, groups, presentation icons and schema-specific packages. Imports from `./package.mjs` use these definitions automatically in supporting editors. Discriminated types reject unsupported type/metadata combinations; runtime validation still checks sizes, values, group references and Lua policy. `test/definitions.mts` is a compile-only fixture for an installed TypeScript compiler, not an executable macro or a dependency of the offline CLI.

Successful output says `structuralValidation: passed` and `androidCompilerValidation: required`. A limited lexical preflight rejects known native file/process calls and containing-scope escapes while masking strings/comments. This SDK is not a Lua interpreter or complete sandbox auditor. Even syntactically invalid or sandbox-prohibited code may be structurally valid. Android's `BlockPluginCodec.validate`, scoped compiler, `CustomCodeSandboxPolicy`, permission checks and stop controls are authoritative. Import only through the app, review the code, and test in a separate trial macro. No generated artifact is executed by this SDK or the website.

## Create and share in the app

1. In a visual or logic workspace, open **Add block → Plugins → Create block** (create a block plugin).
2. Enter the package ID, version and name; write the Lua code. Use **Add property** to define editable keys, types and default values. The code reads typed values from `inputs.key`.
3. Choose **Preview properties** to try the generated fields on a detached draft. Preview does not execute Lua or modify the open macro.
4. After review, explicitly choose **Add to block library** to install the validated package. Installation does not start a macro. Add it to a separate trial macro and use the normal permission, approval and stop controls when testing it.
5. Use **Export .mhblock** in the author or installed-package details to save/share the definition. Export is separate from installation and does not run code.

An installed ID + version has immutable content: use **Edit a new version** and bump the version for changes. A library update/removal does not alter the frozen copies already embedded in macros. These author controls require a build containing the schema 3 authoring UI; do not assume an older installed reader has them.

## Format

Required root properties: `format: "macrohandler.block"`, `schemaVersion`, `id`, `version`, `name`, `code`. Optional: `description`, `author`, `inputs`, `native`, `form`, `presentation`. Unknown properties, duplicate JSON keys (including escaped duplicates), invalid UTF-8, trailing data and JSON comments are rejected. One leading UTF-8 BOM is accepted for reader compatibility; the packer emits none. Do not put `$schema` inside a package. VS Code association is in the included `.vscode/settings.json`.

| Constraint | Reader boundary |
| --- | --- |
| Entire file | 256 KiB UTF-8, including JSON overhead |
| Schema 1 code | 131,072 UTF-16 code units, historical contract |
| Schema 3–4 code | 131,072 UTF-8 bytes, also bounded by the file |
| JSON | Maximum depth 8 (root 0), 4,096 value nodes; names do not count as value nodes |
| ID | Dotted lowercase identifier, max 96 UTF-16 units; e.g. `example.my_block` |
| Version | Three numeric components of 1–5 digits; optional 1–32 ASCII alphanumeric/dot/hyphen prerelease |
| Name / description / author | 80 / 2,048 / 120 UTF-16 units; name nonblank, no ISO controls |
| Inputs | 24, unique keys; 48 ASCII identifier characters; label nonblank, max 80 |
| Choices / values | 64 unique choices, max 256 each; default/input value max 8,192 UTF-16 units |

JSON Schema draft 7 provides editor assistance, not complete validation: its Unicode length semantics differ from UTF-16 reader lengths, and it cannot validate total UTF-8 bytes, duplicate keys, referenced groups, numeric step/default constraints or Lua behavior. Run the CLI and then the app. The SDK deliberately accepts portable decimal numbers rather than Java-only hexadecimal/f/d number notation. Rare decimal representations may differ from Java `Double.toString`; app validation remains required.

### Schema 1: legacy Lua

Inputs are `text`, `number`, `boolean`, `choice`. Each has `key`, `label`, optional `type` (default text), `defaultValue` (a **string**, default empty), and `choices` (default empty). Boolean defaults are strings `"true"` or `"false"`. Choice defaults must exactly match one choice. Code reads `inputs.key`; values are compiled as Lua literals, never interpolated source. Advanced metadata requires schema 3.

### Schema 2: official native descriptors

Only these mappings exist: `com.macrohandler.navigation` → `navigation`, `com.macrohandler.navigation_stop` → `navigation_stop`, `com.macrohandler.agent_detect` → `agent_detect`, `com.macrohandler.agent_routine` → `agent_routine`. `native` contains the matching `entry`, `apiVersion: 1`, and nonblank `source`; `code` is empty and `inputs` is empty. Existing native settings and runtime execute the block. This does not load new APK, DEX, JAR, Java classes or native libraries. `author` and `native.source` are descriptive fields, not a publisher signature. Do not impersonate an official publisher.

### Schema 3: advanced Lua block editor

Lua only; no `native`. Includes legacy input types plus:

| Type | Default value string / behavior |
| --- | --- |
| `color` | `#RRGGBB` or `#AARRGGBB`; delivered as a string |
| `variable` | Nonreserved ASCII Lua-global name beginning with a letter; delivered as a string. `_G[inputs.resultName]` is an **explicit global**, not an alias to a generated No-Code local or a new output port. There is no `Variables` API namespace. |
| `point` | `"x,y"`, nonnegative reference-plane integer components, 0 or ≥2 |
| `region` | `"x,y,w,h"`, same integer contract; dimensions ≥2, or `"0,0,0,0"` for the full-area sentinel |

Point/region components equal to 1 are rejected because existing coordinate APIs interpret them as normalized coordinates. Values compile to `Point(...)` / `Region(...)`; full-area region compiles to `Region(0, 0, 1, 1)`. Edges cannot exceed signed 32-bit integer bounds. Ask for the user's actual macro reference plane; never invent screen targets.

Optional input metadata: `help` (1,024, newline/tab allowed), `unit` (24, no controls), `group`, `advanced` Boolean. `multiline` and `required` are text-only Booleans; required text cannot be blank. `min`, `max`, `step` are number-only finite JSON numbers, with min≤max and step>0. Values lie on a decimal step grid starting at min or zero. Metadata does not grant permissions or change runtime admission.

`form: {"layout":"sections","groups":[{"id":"timing","label":"Timing","help":"..."}]}` supports up to 8 unique groups. Input group IDs must exist. `stack` has no groups. `presentation` optionally contains `category` (nonblank 80) and `icon` from `block`, `code`, `search`, `touch`, `flow`, `data`. These are declarative editor hints, not HTML, custom widgets or executable UI callbacks.

### Schema 4: custom native presentation

Requires a reader build with schema 4 support (prepared 1.0.51); older builds reject it. Existing schema 1–3 readers/bytes are unchanged. Name, description, category, input labels/help/units, bounds and basic/advanced fields remain configurable. Choose **Choose icon image** in the app author: a local PNG/JPEG up to 8 MiB is reduced to at most 256 pixels per edge and normalized to a metadata-free PNG within 32 KiB. The image is embedded in `presentation.iconPng` as canonical base64. No image URL is fetched. It appears in the plugin palette, No-Code card and Logic live/overview cards. `presentation.icon` is a bundled fallback.

The wire icon must contain only IHDR/IDAT/IEND, 8-bit RGB or RGBA, no interlace, correct checksums, and no trailing content. The SDK checks chunks/dimensions/checksums; Android additionally decompresses a bounded pixel stream and checks scanline filters. This difference is intentional: the portable synchronous browser validator is a preflight. The Android importer remains authoritative. Use the app converter rather than manually encoding arbitrary images.

`form.layout` accepts `stack`, `sections` and **`tabs`**. Groups are ordered tabs (up to eight); ungrouped fields get a General tab. Advanced fields remain under the shared Advanced control. Tab selection stays intact after a preset. Native fields retain keyboard, accessibility names, 48dp minimum targets and the host theme. Plugin authors control content and arrangement; they do not inject Android views or a separate HTML/CSS renderer.

`form.actions` accepts up to eight buttons, each with a unique identifier, a label (80 characters), optional plain-text help (1024) and bundled `icon`. Two kinds:

```json
{"id":"quick","label":"Quick profile","kind":"preset","values":{"count":"2","enabled":"true"},"icon":"flow"}
{"id":"restore","label":"Restore defaults","kind":"reset"}
```

A preset needs at least one existing input key and string value. All values must satisfy the input types, required text, choices and bounds. The entire candidate compiles before one settings/persistence commit; invalid/stale actions leave the block unchanged. Reset has no values and restores every declared default. Neither kind executes Lua, touches the screen, starts a macro or calls a provider. Presets do not discard invalid drafts in unrelated fields; correct the highlighted field or explicitly reset. Workspace reference migration also updates point/region presets.

Open **Design layout and buttons** in the in-app author to edit the strict form JSON. This is the form object (layout/groups/actions), not a whole package. Use **Preview properties** to try the result without saving or running the open macro. Install/export requires a valid whole package and an explicit action. For complex behavior, read the selected values in the normal Lua block body and use the actual APIs. Runtime forms (`Form.show`) remain independent of these editor buttons.

Start with `examples/designed-counter.mhblock`: embedded icon, Work/Output tabs, Quick/Detailed profiles, reset, a bounded arithmetic loop and an explicit result global. It is offline and performs no user-screen actions. Default count 3 yields total 6; Quick count 2 yields total 3 **when the macro is explicitly run**. This source description is not proof of arbitrary third-party automation.

## Examples and real APIs

- `examples/repeated-log.mhblock`: legacy bounded loop with `print` and `wait`; no user-screen actions.
- `examples/bounded-wait.mhblock`: advanced editor grouping, finite step constraints and an explicit Lua-global result.
- `examples/form-workflow.mhblock`: **runtime** `Form.show` separate from editor metadata; handles nil/cancel, validates numeric form values, and uses `Workflow.times` / `Workflow.retry` result `.ok`, `.reason`, `.values`. Its top-level body is inside a local function so early return does not escape the plugin's containing scope.
- `examples/configurable-workflow.mhblock`: all eight editor field types across four sections, a `flow` icon, a separate two-tab runtime confirmation form, a reusable macro-local `Module`, and bounded arithmetic with `Workflow.times/retry`. It prints read-only reference diagnostics; it never clicks, scans, loads a file or contacts a server. The default three square calculations produce `1, 4, 9` after confirmation. This describes the source's intended result, not a device execution receipt.

For the configurable example, keep **Show runtime confirmation** enabled for the first trial. Edit the block's properties, add it to a separate test macro, run it with the normal app controls, select **Run local calculation**, and confirm. Cancellation records a cancelled result and performs no calculations. The chosen result name is an explicit Lua global containing `ok`, `reason` and (after work) `results`; it is not a No-Code output port. Host stop/budget aborts can leave the result pending, so a previous value is never proof of current success. The origin/full-area coordinate defaults are diagnostic sentinels, not targets in another app.

Module names are shared within a macro run. The example uses a versioned name and `Module.has` before `Module.define`, so repeated block invocations do not redefine it. Keep a unique module name for a different implementation; do not reuse a name with conflicting code. `Workflow.retry` accepts a truthy first callback result; additional results remain in `.values` (the sample's calculation is `.values[2]`). `Workflow.times` treats a literal `false` first return as a normal early break, while an ordinary nil return continues. A host stop escapes the existing runtime guard; user cleanup callbacks are not guaranteed after it.

The six `presentation.icon` values are bundled choices. Schema 4 additionally supports an embedded custom PNG as documented below. Downloaded fonts, arbitrary HTML/CSS and executable editor callbacks are not package capabilities. Complex runtime forms can use only the fields/styles implemented by `Form`, independently of schema-3 editor metadata. Lua is case-sensitive: `Function`, `End` and `Return` are identifiers, not scope keywords; they cannot grant a top-level return permission.

`Form`, `Workflow`, `Module` and `Api` are actual registered namespaces in this source line. `Module.define/use` is local to the macro, not an external package manager. Use the app's API reference for exact argument/return contracts. Generic Lua examples from another assistant may use unsupported APIs. Loops/actions should be bounded; never fabricate assets, coordinates or execution evidence. Library removal does not revoke definitions already frozen into existing macro blocks. ID + version content is immutable in the library: bump the package version after edits.

Public editor definitions and installation instructions are at [Macro Handler LuaLS definitions](https://github.com/fnzbrn/macrohandler-lua-definitions). They are a documentation/completion aid, not downloaded executable app code. This SDK does not bundle private application assets or third-party binaries.

## Authoring with AI

Give `AI_AUTHORING_BRIEF.md`, the schema and one example to MH AI or another assistant. Request a complete fenced `mhblock` or `json` object. MH AI can download structurally checked drafts after secret redaction and revalidation; there is no automatic installation/execution. Test the artifact on the actual target reader/device before sharing. SDK examples are local demonstrations, not evidence that an arbitrary generated automation works on a user's app.

## Platform and policy boundaries

Google Play restricts executable downloads outside its update mechanism; its policy distinguishes interpreted code, explicitly including Lua, while requiring that runtime scripts cannot enable policy violations. An interpreted format is not blanket approval, and does not authorize native-code delivery or permission bypass. [Google Play Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/16559646?hl=en).

Android advises avoiding dynamic code loading where possible and protecting trusted sources/storage and integrity. This SDK uses data plus existing app interpreters/engines; it adds no Android class/native library loader. A checksum detects changed bytes but does not authenticate an author. [Android dynamic code loading guidance](https://developer.android.com/privacy-and-security/risks/dynamic-code-loading).

VS Code supports draft 7 schemas and workspace file associations. Use the external mapping because the strict package reader rejects an extra `$schema` field. [VS Code JSON schemas and settings](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings).

Source authority: `BlockPlugin.kt`, `BlockPluginCodec.kt`, `BlockPluginFormPolicy.kt`, `NativeBlockPluginPolicy.kt`, `FormLuaApi.kt`, `WorkflowLuaApi.kt` and `ScriptApiCatalog.kt` in the Macro Handler Android source. Shared input bytes are exercised by SDK tests and the paired Android codec tests; source-only validation is not device or Play acceptance. Research checked 2026-10-08. No external publication or store approval is implied by this SDK bundle.

## License

New SDK tooling, schema, documentation and examples are MIT licensed; see `LICENSE`. This grant excludes the Android application/runtime, native engines, private assets and third-party dependencies. Existing official descriptor/documentation terms are preserved in `PUBLIC_PACKAGE_LICENSE.txt`. No external binaries are bundled.
