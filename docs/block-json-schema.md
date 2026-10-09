# Macro Handler block JSON schema

The JSON schema assists editors in authoring `.mhblock` packages. It describes the actual schema-1 legacy Lua, schema-2 official native descriptor and schema-3 advanced Lua form contracts. It is **not** a compiler, a sandbox, an installation command or a certification of arbitrary code.

## Review, then download

- [Download block-plugin.schema.json — sdk-v1.0.0](https://github.com/fnzbrn/macrohandler-block-plugins/releases/download/sdk-v1.0.0/block-plugin.schema.json)
- [Inspect the schema before downloading](../sdk/block-plugins/block-plugin.schema.json)
- [Full SDK installation and development guide](block-authoring-sdk.md)
- [Versioned release and checksums](https://github.com/fnzbrn/macrohandler-block-plugins/releases/tag/sdk-v1.0.0)

This schema targets the prepared Macro Handler 1.0.51 (65) reader contract. Version text alone does not establish that an older installed build includes schema 3.

## VS Code configuration

Extract the SDK into your project or keep the schema in your workspace. The SDK supplies `.vscode/settings.json`; merge its mapping into your existing settings instead of overwriting other preferences. For a schema stored at your workspace root:

```json
{
  "files.associations": { "*.mhblock": "json" },
  "json.schemas": [
    { "fileMatch": ["*.mhblock"], "url": "./block-plugin.schema.json" }
  ]
}
```

Use a local file for offline validation and reproducible authoring. Do **not** insert `$schema` into the package: the application's strict reader rejects unknown root properties. The editor supports completion and validation through the external association. [Official VS Code JSON documentation](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings).

## What the editor describes

- Required format identity, schema version, ID, semantic version, name and Lua code.
- Schema-specific optional fields, typed property definitions and defaults.
- Choice arrays, numeric bounds and step metadata, help/units, basic/advanced controls.
- Native form groups and presentation category/semantic icon.
- The four supported native entries for schema 2; exact entry/ID pairing is checked by the CLI and Android importer.

Every default is encoded as a **string** in the package. The app compiles the typed runtime value safely. A `variable` value is an explicit Lua-global name string; it is not an automatic output port. Point/region values refer to the macro's reference plane, not guessed device coordinates. Read the SDK README for coordinate sentinels and component constraints.

## What JSON Schema cannot prove

The draft-7 schema cannot enforce the entire UTF-8 file budget, duplicate decoded keys, referenced groups, all numeric step/default constraints or Lua syntax/behavior. Unicode length semantics also differ from the reader's UTF-16 limits. Run the SDK validator, then import through the app's authoritative parser/compiler and test deliberately:

```sh
node mhblock.mjs validate my-block.mhblock
```

Never use editor completion as permission to load APK/DEX/native code, invent an API or skip a user's consent. [Full format contract and examples](../sdk/block-plugins/README.md).
