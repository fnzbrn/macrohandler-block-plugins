// SDK-only deterministic editor schema. Runtime cross-field/byte checks are in package.mjs.
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const text = maxLength => ({ type: 'string', maxLength })
const label = max => ({ ...text(max), minLength: 1 })
const nullable = schema => ({ anyOf: [schema, { type: 'null' }] })
const object = (properties, required = []) => ({ type: 'object', additionalProperties: false, properties, required })
const list = (items, maxItems) => ({ type: 'array', items, maxItems })
const extras = {
  help: nullable(text(1024)), unit: nullable(text(24)), group: nullable(text(48)),
  ...Object.fromEntries(['advanced', 'multiline', 'required'].map(k => [k, nullable({ type: 'boolean' })])),
  min: nullable({ type: 'number' }), max: nullable({ type: 'number' }), step: nullable({ type: 'number', exclusiveMinimum: 0 }),
}
const input = object({
  key: { type: 'string', pattern: '^[a-zA-Z_][a-zA-Z0-9_]{0,47}$' }, label: label(80),
  type: { enum: ['text', 'number', 'boolean', 'choice', 'color', 'variable', 'point', 'region'], default: 'text' },
  defaultValue: { ...text(8192), default: '' }, choices: { ...list(text(256), 64), uniqueItems: true, default: [] }, ...extras,
}, ['key', 'label'])
input.allOf = [{ if: { properties: { type: { const: 'choice' } }, required: ['type'] },
  then: { required: ['choices'], properties: { choices: { minItems: 1 } } }, else: { properties: { choices: { maxItems: 0 } } } }]
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#', title: 'Macro Handler block package (editor assistance)',
  description: 'Run the SDK CLI and Android importer too. Byte limits, duplicate keys, UTF16 lengths, cross-field/default semantics and Lua compilation need those checks. Do not add $schema to the package.',
  ...object({
    format: { const: 'macrohandler.block' }, schemaVersion: { enum: [1, 2, 3] },
    id: { ...text(96), pattern: '^[a-z][a-z0-9_]*(\\.[a-z][a-z0-9_]*)+$' },
    version: { type: 'string', pattern: '^[0-9]{1,5}\\.[0-9]{1,5}\\.[0-9]{1,5}(?:-[a-zA-Z0-9.-]{1,32})?$' },
    name: label(80), description: text(2048), author: text(120), inputs: list({ $ref: '#/definitions/input' }, 24), code: text(131072),
    native: nullable(object({ entry: { enum: ['navigation', 'navigation_stop', 'agent_detect', 'agent_routine'] }, apiVersion: { const: 1 }, source: label(512) }, ['entry', 'apiVersion', 'source'])),
    form: nullable(object({ layout: { enum: ['stack', 'sections'], default: 'stack' }, groups: list(object({ id: { type: 'string', pattern: '^[A-Za-z][A-Za-z0-9_]{0,47}$' }, label: label(80), help: nullable(text(1024)) }, ['id', 'label']), 8) })),
    presentation: nullable(object({ category: nullable(label(80)), icon: nullable({ enum: ['block', 'code', 'search', 'touch', 'flow', 'data'] }) })),
  }, ['format', 'schemaVersion', 'id', 'version', 'name', 'code']), definitions: { input },
  allOf: [
    { if: { properties: { schemaVersion: { const: 2 } } }, then: { required: ['native'], properties: { native: { type: 'object' }, code: { const: '' }, inputs: { maxItems: 0 } } }, else: { properties: { native: { type: 'null' }, code: { minLength: 1 } } } },
    { if: { properties: { schemaVersion: { enum: [1, 2] } } }, then: { properties: { form: { type: 'null' }, presentation: { type: 'null' }, inputs: { items: { properties: { type: { enum: ['text', 'number', 'boolean', 'choice'] }, ...Object.fromEntries(Object.keys(extras).map(k => [k, { type: 'null' }])) } } } } } },
  ],
}
const root = new URL('./', import.meta.url)
writeFileSync(new URL('block-plugin.schema.json', root), JSON.stringify(schema, null, 2) + '\n')
mkdirSync(fileURLToPath(new URL('.vscode/', root)), { recursive: true })
writeFileSync(new URL('.vscode/settings.json', root), JSON.stringify({ 'files.associations': { '*.mhblock': 'json' }, 'json.schemas': [{ fileMatch: ['**/*.mhblock'], url: './block-plugin.schema.json' }] }, null, 2) + '\n')
