# MacroHandler Block Plugins

Official optional block packages for **Macro Handler**, the Android automation and macro development app.

- [Macro Handler website](https://macrohandler.com)
- [Macro Handler on Google Play](https://play.google.com/store/apps/details?id=com.macrohandler.app)
- [LuaLS definitions for VS Code](https://github.com/fnzbrn/macrohandler-lua-definitions)

These small `.mhblock` files add optional entries to the app's **Plugins** library. They open the complete existing native block editors in the Visual and Logic workspaces. The engines remain inside the installed Android app; importing a file does not download executable native code or start a macro.

## Packages

| Download block | Editor | Setup guide |
| --- | --- | --- |
| [navigation.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation.mhblock) | Navigation | [Navigation](https://macrohandler.com/docs/visual-guide/navigation) |
| [navigation_stop.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/navigation_stop.mhblock) | Navigation Stop (Navigasyon Kır) | [Navigation Stop](https://macrohandler.com/docs/visual-guide/navigation_stop) |
| [agent_detect.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/agent_detect.mhblock) | Agent Detect | [Agent Detect](https://macrohandler.com/docs/visual-guide/agent_detect) |
| [agent_routine.mhblock](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/agent_routine.mhblock) | Agent, including Teach and Routine sections | [Agent](https://macrohandler.com/docs/visual-guide/agent) |

[Download all four packages as a ZIP](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/v1.1.0/macrohandler-block-plugins-1.1.0.zip), then extract it to import the individual `.mhblock` files. Downloads are hosted by GitHub; setup guides are on the Macro Handler website.

**Navigation** lets you configure the existing route and joystick controls. Create your own macro-local profile, map, route and feedback, and test a short route first. It does not include a universal route for arbitrary games.

**Navigation Stop** adds the existing `NAVIGATION_STOP` block independently. It stops only the active navigation owned by the current macro and checks that the joystick was released. If release cannot be confirmed, execution reports `NAVIGATION_RELEASE_UNCONFIRMED`. It is not the application's global Stop control.

**Agent Detect** uses the existing region and taught-target detection controls. Teach and review your own targets, narrow the search region and verify detection on your screen. No pretrained target, recognition guarantee or permission is bundled.

**Agent Routine** opens the existing full Agent editor. Teach, review and approve the routine before running. This is a workflow within the Agent block, not a separate `AGENT_ROUTINE` engine. Ownership, approved-plan and run-consent checks remain enforced by the app.

## Requirements

- A Macro Handler build with **native block packages schema 2 / API 1** support and the four-entry catalog introduced for package release **1.1.0**. The release target is 1.0.51, but **earlier 1.0.51 builds do not support every descriptor**. Version text alone is not a compatibility check.
- Android permissions and any membership or consent requirements for the actions you configure.
- Your own route, references and reviewed Agent routine where required. These files do not provide those user assets.

The default add-block palette omits these optional entries. Existing macros with the native blocks remain editable and executable under their existing permissions even if you have not imported the corresponding library file.

## Import and use

1. Download the desired individual `.mhblock` file to the Android device. If you download the bundle ZIP, extract it first; the app imports individual `.mhblock` files.
2. Open your macro in the Visual or Logic workspace.
3. In the **Add Block** palette, choose **Import block (.mhblock)**.
4. Review the package name, ID and version, then confirm the import.
5. Open **Plugins**, select the imported entry and add it to your macro. Import Navigation Stop separately if your macro needs it.
6. Configure the real block card and test in a controlled setup before running a full macro.

Imported entries can be searched and favorited. Removing a library version does not delete blocks already added to a macro. The macro stores the descriptor and native settings; a compatible receiving app does not need a separate library import to open the block. Engine behavior follows the installed app version.

## Package format and integrity

Package version: **1.1.0**. Format: UTF-8 JSON, `format: "macrohandler.block"`, `schemaVersion: 2`, empty `code`, empty `inputs`, and a native descriptor with `apiVersion: 1`.

Only the following entry/ID pairs are supported:

| Entry | Package ID |
| --- | --- |
| `navigation` | `com.macrohandler.navigation` |
| `navigation_stop` | `com.macrohandler.navigation_stop` |
| `agent_detect` | `com.macrohandler.agent_detect` |
| `agent_routine` | `com.macrohandler.agent_routine` |

There is no APK, DEX, JAR, shared library, model download, arbitrary native class or executable payload in these four packages. The `author` and `source` fields are descriptive metadata, **not a cryptographic publisher signature**. Download from the publisher's verified release and compare the file digest with `SHA256SUMS` if needed. The checksum is public integrity information, not a secret or access credential.

## Updates and older versions

Each release has its own GitHub tag, immutable download URLs, manifest and SHA-256 checksums. [Browse all releases](https://github.com/fnzbrn/macrohandler-block-plugins/releases) to download a specific version. Updating the library never silently rewrites blocks already stored in a macro; add or replace a block explicitly when you want a new package descriptor.

Version **1.0.0** remains available. Its Navigation package includes the original Stop helper, and the updated app preserves that exact legacy behavior. In **1.1.0**, Navigation and Navigation Stop are separate imports. Versions can coexist in the library; the same package ID and version cannot be overwritten with different content. Package versions describe library entries; the installed app supplies the actual engine and its compatibility and permission checks.

## Community and support

The corresponding plugin detail page on [macrohandler.com/plugins](https://macrohandler.com/plugins) provides setup information and an inline comments and reactions section. Likes, dislikes and comments stay on the plugin page; there is no need to open a separate forum page. Participation requires sign-in, an active Community Badge and acceptance of the current community rules. Reporting, blocking and moderation remain available.

Website community features require the reviewed website/backend rollout and official plugin bindings; publishing these files alone does not enable them. The package download links above are independent of that rollout. Do not include account tokens, credentials or private screenshots in issue reports.

## License

The package descriptors and documentation in this distribution are MIT licensed; see `LICENSE`. This license does **not** grant rights to Macro Handler's Android application, native engines, user data, game assets or third-party content. It does not change the application's terms or membership requirements.

## Create and distribute your own blocks

The public **Block Authoring SDK** supports Lua packages with typed editable properties, native form groups, help/units and semantic icons for both No-Code and Logic workspaces. Read the English guides before downloading the versioned assets:

- [SDK ZIP, capabilities, installation and development](docs/block-authoring-sdk.md)
- [JSON schema, VS Code setup and validation limits](docs/block-json-schema.md)
- [AI authoring brief and verified generation workflow](docs/block-ai-authoring.md)

SDK releases use separate `sdk-v...` tags. The four official native packages keep their existing `v...` release line. Schema-3 Lua authoring requires a reader build supporting it; arbitrary HTML/DEX/native widget loading is not a plugin capability. The SDK is MIT licensed under its included scope and does not distribute the application runtime.

## Individual plugin guides

Each guide explains the purpose, requirements and import steps, and includes the versioned file download.

- [Navigation](docs/navigation.md)
- [Navigation Stop](docs/navigation-stop.md)
- [Agent Detect](docs/agent-detect.md)
- [Agent Routine](docs/agent-routine.md)
