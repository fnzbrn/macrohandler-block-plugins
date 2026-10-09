import { parsePackageJson, MAX_PACKAGE_BYTES } from './strict-json.mjs'
import { RESERVED_VARIABLES } from './reserved-variables.mjs'
import { checkLuaPolicy } from './lua-policy.mjs'
import { validateIconPng } from './png-icon.mjs'

const rootKeys = ['format', 'schemaVersion', 'id', 'version', 'name', 'description', 'author', 'inputs', 'code', 'native', 'form', 'presentation']
const inputKeys = ['key', 'label', 'type', 'defaultValue', 'choices', 'help', 'unit', 'group', 'advanced', 'multiline', 'min', 'max', 'step', 'required']
const metadataKeys = inputKeys.slice(5)
const id = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/
const identifier = /^[A-Za-z][A-Za-z0-9_]{0,47}$/
const types = ['text', 'number', 'boolean', 'choice', 'color', 'variable', 'point', 'region']
const keywords = 'and break do else elseif end false for function goto if in local nil not or repeat return then true until while'.split(' ')
const reserved = new Set([...RESERVED_VARIABLES, ...keywords, 'inputs', 'outputs'])
export const NATIVE_ENTRIES = ['navigation', 'navigation_stop', 'agent_detect', 'agent_routine']
export const INPUT_TYPES = types
export const ICONS = ['block', 'code', 'search', 'touch', 'flow', 'data']
const check = (ok, message) => { if (!ok) throw new Error(message) }
const present = value => value !== undefined && value !== null
const blank = value => /^[\s\u0085\u2000-\u200a\u2028\u2029]*$/u.test(value)
function object(value, keys) {
  check(value !== null && typeof value === 'object' && !Array.isArray(value), 'Expected object')
  check(Object.keys(value).every(key => keys.includes(key)), 'Unknown property')
}
function string(value, max, required = false, controls = false, multiline = false) {
  check(typeof value === 'string' && value.length <= max && (!required || !blank(value)), 'Invalid string')
  if (controls) check(![...value].some(c => /[\x00-\x1f\x7f-\x9f]/.test(c) && (!multiline || !'\n\r\t'.includes(c))), 'Control character is not allowed')
}
const optionalString = (v, max, controls = false, multiline = false) => { if (present(v)) string(v, max, false, controls, multiline) }

function decimal(value) {
  const [raw, e = '0'] = String(value).toLowerCase().split('e'), pieces = raw.split('.')
  return { n: BigInt(pieces.join('')), scale: (pieces[1]?.length ?? 0) - Number(e) }
}
function onStep(value, origin, step) {
  const a = [value, origin, step].map(decimal), scale = Math.max(...a.map(v => v.scale))
  const [v, o, s] = a.map(v => v.n * 10n ** BigInt(scale - v.scale))
  return (v - o) % s === 0n
}
export function validateInputValue(input, value) {
  string(value, 8192)
  switch (input.type ?? 'text') {
    case 'text': check(input.required !== true || !blank(value), 'A value is required'); break
    case 'number': {
      const text = value.trim().replaceAll(',', '.')
      // Deliberately portable decimal subset; Java-only hexadecimal/f/d literals require app validation.
      check(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text), 'Expected a decimal number')
      const n = Number(text)
      check(Number.isFinite(n) && (!present(input.min) || n >= input.min) && (!present(input.max) || n <= input.max), 'Number is outside its bounds')
      if (present(input.step)) check(onStep(n, input.min ?? 0, input.step), 'Number is outside its step grid')
      break
    }
    case 'boolean': check(value === 'true' || value === 'false', 'Expected true or false'); break
    case 'choice': check(input.choices.includes(value), 'Unknown choice'); break
    case 'color': check(/^#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?$/.test(value), 'Expected a hex color'); break
    case 'variable': check(identifier.test(value) && !reserved.has(value), 'Reserved or invalid Lua global name'); break
    case 'point': case 'region': {
      const parts = value.split(',').map(v => v.trim())
      check(parts.length === (input.type === 'point' ? 2 : 4) && parts.every(v => /^[0-9]+$/.test(v)), 'Expected reference-plane coordinates')
      const coordinates = parts.map(Number)
      check(coordinates.every(v => Number.isInteger(v) && v <= 2147483647 && v !== 1), 'Invalid or ambiguous reference coordinate')
      if (input.type === 'region') {
        const [x, y, w, h] = coordinates
        check((coordinates.every(v => v === 0) || (w > 0 && h > 0)) && x + w <= 2147483647 && y + h <= 2147483647, 'Invalid region bounds')
      }
      break
    }
    default: throw new Error('Unsupported input type')
  }
}

/** Structural checks only: NOT a replacement for Android Lua compilation/sandbox policy. */
export function validatePackage(raw) {
  object(raw, rootKeys)
  for (const key of ['format', 'schemaVersion', 'id', 'version', 'name', 'code']) check(Object.hasOwn(raw, key), 'Missing required property')
  check(raw.format === 'macrohandler.block' && [1, 2, 3, 4].includes(raw.schemaVersion), 'Unsupported format or schema')
  string(raw.id, 96); check(id.test(raw.id), 'Invalid package ID')
  string(raw.version, 51); check(/^[0-9]{1,5}\.[0-9]{1,5}\.[0-9]{1,5}(?:-[a-zA-Z0-9.-]{1,32})?$/.test(raw.version), 'Invalid version')
  string(raw.name, 80, true, true); string(raw.description ?? '', 2048); string(raw.author ?? '', 120)
  for (const k of ['description', 'author', 'inputs']) check(raw[k] !== null, 'Null is not supported here')
  const inputs = raw.inputs ?? []
  check(Array.isArray(inputs) && inputs.length <= 24, 'Too many inputs')
  check(new Set(inputs.map(i => i?.key)).size === inputs.length, 'Duplicate input key')
  const advanced = [3, 4].includes(raw.schemaVersion), rich = raw.schemaVersion === 4
  if (!advanced) check(!present(raw.form) && !present(raw.presentation), 'Advanced form requires schema 3')
  let groups = []
  if (present(raw.form)) {
    object(raw.form, ['layout', 'groups', 'actions'])
    check(raw.form.layout !== null && raw.form.groups !== null, 'Null form field')
    const layout = raw.form.layout ?? 'stack'; groups = raw.form.groups ?? []
    check((rich ? ['stack', 'sections', 'tabs'] : ['stack', 'sections']).includes(layout) && Array.isArray(groups) && groups.length <= 8, 'Invalid form')
    check(layout !== 'stack' || groups.length === 0, 'Groups require sections')
    check(new Set(groups.map(g => g?.id)).size === groups.length, 'Duplicate group')
    for (const g of groups) { object(g, ['id', 'label', 'help']); check(typeof g.id === 'string' && identifier.test(g.id), 'Invalid group ID'); string(g.label, 80, true, true); optionalString(g.help, 1024, true, true) }
  }
  if (present(raw.presentation)) {
    object(raw.presentation, ['category', 'icon', 'iconPng'])
    if (present(raw.presentation.category)) string(raw.presentation.category, 80, true, true)
    if (present(raw.presentation.icon)) check(ICONS.includes(raw.presentation.icon), 'Unknown icon')
    if (present(raw.presentation.iconPng)) { check(rich, 'Custom icons require schema 4'); validateIconPng(raw.presentation.iconPng) }
  }
  if (present(raw.form)) {
    const actions = raw.form.actions ?? []
    check(raw.form.actions !== null && Array.isArray(actions) && actions.length <= 8 && (rich || actions.length === 0), 'Actions require schema 4; maximum eight')
    check(new Set(actions.map(a => a?.id)).size === actions.length, 'Duplicate action')
    for (const action of actions) {
      object(action, ['id', 'label', 'kind', 'values', 'help', 'icon'])
      check(typeof action.id === 'string' && identifier.test(action.id), 'Invalid action ID'); string(action.label, 80, true, true)
      const kind = action.kind ?? 'preset', values = action.values ?? {}
      check(action.kind !== null && action.values !== null && ['preset', 'reset'].includes(kind), 'Invalid action kind')
      object(values, inputs.map(i => i.key))
      check(kind === 'reset' ? Object.keys(values).length === 0 : Object.keys(values).length > 0, 'Preset needs values; reset uses defaults')
      optionalString(action.help, 1024, true, true)
      if (present(action.icon)) check(ICONS.includes(action.icon), 'Unknown action icon')
      for (const [key, value] of Object.entries(values)) {
        const input = inputs.find(i => i.key === key)
        validateInputValue({ ...input, type: input.type ?? 'text', choices: input.choices ?? [] }, value)
      }
    }
  }
  for (const input of inputs) {
    object(input, inputKeys)
    check(typeof input.key === 'string' && /^[A-Za-z_][A-Za-z0-9_]{0,47}$/.test(input.key), 'Invalid input key')
    string(input.label, 80, true)
    for (const k of ['type', 'defaultValue', 'choices']) check(input[k] !== null, 'Null input field')
    const type = input.type ?? 'text', choices = input.choices ?? []
    check((advanced ? types : types.slice(0, 4)).includes(type), 'Unsupported input type')
    check(Array.isArray(choices) && choices.length <= 64 && new Set(choices).size === choices.length, 'Invalid choices')
    choices.forEach(v => string(v, 256))
    check(type === 'choice' ? choices.length > 0 : choices.length === 0, 'Choices require a choice input')
    if (!advanced) check(metadataKeys.every(k => !present(input[k])), 'Advanced fields require schema 3')
    optionalString(input.help, 1024, true, true); optionalString(input.unit, 24, true)
    if (present(input.group)) check(groups.some(g => g.id === input.group), 'Unknown input group')
    for (const k of ['advanced', 'multiline', 'required']) if (present(input[k])) check(typeof input[k] === 'boolean', 'Expected boolean metadata')
    check(type === 'text' || (!present(input.required) && !present(input.multiline)), 'Text metadata on another type')
    for (const k of ['min', 'max', 'step']) if (present(input[k])) check(type === 'number' && typeof input[k] === 'number' && Number.isFinite(input[k]), 'Invalid numeric metadata')
    check(!present(input.min) || !present(input.max) || input.min <= input.max, 'Reversed numeric bounds')
    check(!present(input.step) || input.step > 0, 'Step must be positive')
    validateInputValue({ ...input, type, choices }, input.defaultValue ?? '')
  }
  if (raw.schemaVersion === 2) {
    object(raw.native, ['entry', 'apiVersion', 'source'])
    check(NATIVE_ENTRIES.includes(raw.native.entry) && raw.id === `com.macrohandler.${raw.native.entry}` && raw.native.apiVersion === 1, 'Invalid native descriptor')
    string(raw.native.source, 512, true, true)
    check(raw.code === '' && inputs.length === 0, 'Native descriptor cannot contain Lua or inputs')
  } else {
    check(!present(raw.native), 'Lua packages cannot select native engines')
    string(raw.code, 128 * 1024, true)
    if (advanced) check(new TextEncoder().encode(raw.code).length <= 128 * 1024, 'Schema 3 code exceeds 128 KiB UTF8')
    checkLuaPolicy(raw.code)
  }
  return raw
}

export function readPackage(bytes) { return validatePackage(parsePackageJson(bytes)) }

/** Stable SDK encoding. Hash these FILE bytes; Android's canonical fingerprint is a separate value. */
export function encodePackage(raw) {
  validatePackage(raw)
  const ordered = { format: raw.format, schemaVersion: raw.schemaVersion, id: raw.id, version: raw.version, name: raw.name,
    description: raw.description ?? '', author: raw.author ?? '', inputs: (raw.inputs ?? []).map(i => {
      const item = { key: i.key, label: i.label, type: i.type ?? 'text', defaultValue: i.defaultValue ?? '', choices: i.choices ?? [] }
      for (const k of metadataKeys) if (present(i[k])) item[k] = i[k]
      return item
    }), code: raw.code }
  if (present(raw.native)) ordered.native = { entry: raw.native.entry, apiVersion: raw.native.apiVersion, source: raw.native.source }
  if (present(raw.form)) {
    ordered.form = { layout: raw.form.layout ?? 'stack', groups: (raw.form.groups ?? []).map(g => ({ id: g.id, label: g.label, ...(present(g.help) ? { help: g.help } : {}) })) }
    if (raw.form.actions?.length) ordered.form.actions = raw.form.actions.map(a => ({ id: a.id, label: a.label, kind: a.kind ?? 'preset', values: a.values ?? {}, ...Object.fromEntries(['help', 'icon'].filter(k => present(a[k])).map(k => [k, a[k]])) }))
  }
  if (present(raw.presentation)) ordered.presentation = Object.fromEntries(['category', 'icon', 'iconPng'].filter(k => present(raw.presentation[k])).map(k => [k, raw.presentation[k]]))
  const bytes = new TextEncoder().encode(JSON.stringify(ordered))
  check(bytes.length <= MAX_PACKAGE_BYTES, 'Encoded package exceeds 256 KiB')
  readPackage(bytes)
  return bytes
}
