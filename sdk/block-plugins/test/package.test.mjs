import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readPackage, encodePackage, validatePackage, validateInputValue } from '../package.mjs'
import { parseStrictJson } from '../strict-json.mjs'
import { run } from '../mhblock.mjs'
const bytes = text => new TextEncoder().encode(text)
const example = async name => readPackage(await readFile(new URL(`../examples/${name}.mhblock`, import.meta.url)))
const minimal = () => ({ format: 'macrohandler.block', schemaVersion: 1, id: 'test.block', version: '1.0.0', name: 'Demo', code: 'print("hello")' })

test('all examples validate and repeated SDK packing is byte-identical', async () => {
  for (const name of ['repeated-log', 'bounded-wait', 'form-workflow', 'configurable-workflow', 'designed-counter']) {
    const first = encodePackage(await example(name)), second = encodePackage(readPackage(first))
    assert.deepEqual(first, second)
    assert.equal(first[0], 123); assert.equal(first.at(-1), 125)
  }
})

test('schema4 native design round trip retains icon tabs and typed atomic presets', async () => {
  const source = await example('designed-counter')
  assert.equal(source.schemaVersion, 4)
  assert.equal(source.form.layout, 'tabs')
  assert.equal(source.form.actions[0].values.count, '2')
  assert.equal(source.form.actions.at(-1).kind, 'reset')
  assert.ok(source.presentation.iconPng.length > 20)
  assert.deepEqual(readPackage(encodePackage(source)), readPackage(encodePackage(readPackage(encodePackage(source)))))
  for (const version of [1, 2, 3]) assert.throws(() => validatePackage({ ...source, schemaVersion: version }))
  for (const action of [{id:'x',label:'X',values:{missing:'1'}}, {id:'x',label:'X',values:{count:'11'}}, {id:'x',label:'X',values:{enabled:'yes'}}, {id:'x',label:'X',kind:'run',values:{}}, {id:'x',label:'X',kind:'reset',values:{count:'2'}}]) {
    assert.throws(() => validatePackage({ ...source, form: { ...source.form, actions: [action] } }))
  }
  for (const iconPng of ['https://example.test/a.png', 'data:image/png;base64,'+source.presentation.iconPng, source.presentation.iconPng+'\n', source.presentation.iconPng.slice(0,-4)]) {
    assert.throws(() => validatePackage({ ...source, presentation: { ...source.presentation, iconPng } }))
  }
  assert.throws(() => validatePackage({ ...source, form: { ...source.form, actions: Array(9).fill(source.form.actions[0]) } }))
})
test('strict UTF8 rejects malformed bytes; one UTF8 BOM remains compatible', () => {
  assert.throws(() => readPackage(Uint8Array.of(0xc3, 0x28)))
  const source = bytes(JSON.stringify(minimal()))
  assert.equal(readPackage(Uint8Array.from([0xef, 0xbb, 0xbf, ...source])).id, 'test.block')
  assert.throws(() => readPackage(Uint8Array.from([0xef, 0xbb, 0xbf, 0xef, 0xbb, 0xbf, ...source])))
})
test('escaped duplicate keys, trailing data, comments and nesting are rejected', () => {
  for (const text of ['{"a":1,"\\u0061":2}', '{"x":{"a":1,"a":2}}', '{}{}', '{"a":1,}', '{/*no*/}', '[01]', '[NaN]', '"unterminated']) assert.throws(() => parseStrictJson(text))
  assert.throws(() => parseStrictJson('['.repeat(9) + '0' + ']'.repeat(9)))
  assert.throws(() => parseStrictJson('[' + Array(4096).fill('0').join(',') + ']'))
  assert.equal(parseStrictJson('[' + Array(4095).fill('0').join(',') + ']').length, 4095)
  assert.equal(Object.getPrototypeOf(parseStrictJson('{"__proto__":{"safe":true}}')), null)
})
test('unknown properties and native engine forgery cannot pass', () => {
  assert.throws(() => validatePackage({ ...minimal(), $schema: 'anything' }))
  for (const native of [{ entry: 'arbitrary', apiVersion: 1, source: 'x' }, { entry: 'navigation', apiVersion: 2, source: 'x' }]) assert.throws(() => validatePackage({ ...minimal(), schemaVersion: 2, code: '', native }))
  assert.throws(() => validatePackage({ ...minimal(), native: { entry: 'navigation' } }))
  assert.throws(() => validatePackage({ ...minimal(), description: null }))
})
test('limited Lua policy refuses known native process calls/scope escapes but not literal documentation', () => {
  for (const code of ['os.execute("bad")', 'io.open("file")', 'end print("escape")', 'if true then return end', 'break']) {
    assert.throws(() => validatePackage({ ...minimal(), code }))
  }
  for (const code of ['print("os.execute() is forbidden")', '-- io.open("not code")\nprint("ok")', 'local function run() if true then return end end\nrun()']) {
    assert.doesNotThrow(() => validatePackage({ ...minimal(), code }))
  }
  // Structural/limited-policy success must not pretend to be actual Lua compilation.
  assert.doesNotThrow(() => validatePackage({ ...minimal(), code: 'local = invalid syntax' }))
})
test('capitalized identifiers cannot impersonate Lua function scope', () => {
  assert.throws(() => validatePackage({ ...minimal(), code: 'local Function = 1\nreturn 42' }))
})
test('shared case-sensitive policy bytes retain their exact admission outcomes', async () => {
  for (const [file, valid] of [['scope-function-escape', false], ['scope-end-name', true], ['scope-return-name', true]]) {
    const input = await readFile(new URL(`./fixtures/${file}.mhblock`, import.meta.url))
    if (valid) assert.doesNotThrow(() => readPackage(input))
    else assert.throws(() => readPackage(input))
  }
})
test('advanced workflow documents all editor types without granting action or native loading authority', async () => {
  const model = await example('configurable-workflow')
  assert.deepEqual(model.inputs.map(input => input.type).sort(), ['boolean', 'choice', 'color', 'number', 'point', 'region', 'text', 'variable'])
  assert.equal(model.inputs.find(input => input.key === 'askConfirmation').defaultValue, 'true')
  assert.equal(model.inputs.find(input => input.key === 'iterations').max, 10)
  assert.equal(model.form.layout, 'sections')
  assert.equal(model.presentation.icon, 'flow')
  assert.equal(model.native, undefined)
  for (const method of ['Form.validate(', 'Form.show(', 'Module.has(', 'Module.define(', 'Module.use(', 'Workflow.times(', 'Workflow.retry(']) assert.ok(model.code.includes(method))
  assert.ok(model.code.includes('values == nil or values._sdk_confirm ~= true'))
  assert.ok(model.code.includes('attempt.values[2]'))
  assert.ok(model.code.includes('maxAttempts = 2'))
  assert.ok(model.code.includes('timeoutMs = 10000'))
  assert.doesNotMatch(model.code, /\b(?:click|swipe|require|load)\s*\(|\b(?:File|Request|Capture|Region)\./)
})
test('capitalized End is an ordinary Lua identifier', () => {
  assert.doesNotThrow(() => validatePackage({ ...minimal(), code: 'local End = 7\nprint(End)' }))
})
test('capitalized Return is an ordinary Lua identifier', () => {
  assert.doesNotThrow(() => validatePackage({ ...minimal(), code: 'local Return = 9\nprint(Return)' }))
})
test('schema 1 Unicode code compatibility is distinct from schema 3 UTF8 bound', () => {
  const source = { ...minimal(), code: '--' + 'é'.repeat(66000) }
  assert.doesNotThrow(() => readPackage(bytes(JSON.stringify(source))))
  assert.throws(() => readPackage(bytes(JSON.stringify({ ...source, schemaVersion: 3 }))))
  assert.throws(() => readPackage(new Uint8Array(262145)))
})
test('exact 256 KiB encoded file is admitted and one additional byte is rejected', () => {
  const p = { ...minimal(), description: '', author: '', inputs: Array.from({ length: 16 }, (_, i) => ({ key: `x${i}`, label: 'X', type: 'text', defaultValue: 'a'.repeat(8192), choices: [] })), code: '--' }
  const remaining = 262144 - new TextEncoder().encode(JSON.stringify(p)).length
  p.code += 'x'.repeat(remaining)
  assert.equal(encodePackage(p).length, 262144)
  assert.throws(() => encodePackage({ ...p, code: p.code + 'x' }))
})
test('input defaults are validated without executing interpolated Lua', () => {
  const p = { ...minimal(), inputs: [{ key: 'text', label: 'Text', defaultValue: '"); error("data only") --' }] }
  assert.equal(readPackage(encodePackage(p)).inputs[0].defaultValue, p.inputs[0].defaultValue)
  assert.throws(() => validatePackage({ ...p, inputs: [p.inputs[0], p.inputs[0]] }))
  assert.throws(() => validatePackage({ ...p, inputs: [{ key: 'x', label: 'X', type: 'boolean', defaultValue: 'TRUE' }] }))
  assert.throws(() => validatePackage({ ...p, inputs: [{ key: 'x', label: 'X', type: 'choice', choices: ['a'], defaultValue: 'b' }] }))
})
test('schema 3 form references, controls, type metadata and decimal steps are enforced', async () => {
  const p = await example('bounded-wait')
  assert.throws(() => validatePackage({ ...p, schemaVersion: 1 }))
  assert.throws(() => validatePackage({ ...p, form: { layout: 'stack', groups: p.form.groups } }))
  assert.throws(() => validatePackage({ ...p, inputs: [{ ...p.inputs[0], group: 'missing' }] }))
  assert.throws(() => validatePackage({ ...p, inputs: [{ ...p.inputs[0], multiline: false }] }))
  assert.throws(() => validatePackage({ ...p, inputs: [{ ...p.inputs[0], help: '\0' }] }))
  assert.doesNotThrow(() => validateInputValue({ type: 'number', min: 0.1, max: 1, step: 0.1 }, '0.3'))
  assert.throws(() => validateInputValue({ type: 'number', min: 0.1, max: 1, step: 0.1 }, '0.31'))
  for (const value of ['Infinity', 'NaN', '1e309', '']) assert.throws(() => validateInputValue({ type: 'number' }, value))
})
test('coordinate ambiguity/overflow and reserved globals are rejected', () => {
  for (const value of ['1,2', '-2,3', '2147483648,0']) assert.throws(() => validateInputValue({ type: 'point' }, value))
  for (const value of ['0,0,0,2', '2147483647,0,2,2', '0,0,1,1']) assert.throws(() => validateInputValue({ type: 'region' }, value))
  assert.doesNotThrow(() => validateInputValue({ type: 'region' }, '0,0,0,0'))
  assert.doesNotThrow(() => validateInputValue({ type: 'point' }, '0,2'))
  for (const value of ['Form', 'Workflow', 'print', 'inputs', 'outputs', 'while', '_G']) assert.throws(() => validateInputValue({ type: 'variable' }, value))
  assert.doesNotThrow(() => validateInputValue({ type: 'variable' }, 'ExampleResult'))
})
test('CLI makes only exclusive owned output; successful structure never claims Android compilation', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mhblock-sdk-'))
  try {
    const input = new URL('../examples/repeated-log.mhblock', import.meta.url), output = join(dir, 'new.mhblock')
    const result = await run(['pack', input, '--out', output])
    assert.equal(result.androidCompilerValidation, 'required')
    assert.match(result.sha256, /^[a-f0-9]{64}$/)
    const before = await readFile(output)
    await assert.rejects(run(['pack', input, '--out', output]))
    assert.deepEqual(await readFile(output), before)
    assert.equal((await run(['validate', output])).sha256, result.sha256)
  } finally { await rm(dir, { recursive: true }) }
})
