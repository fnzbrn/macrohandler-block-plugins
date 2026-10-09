// Compile with TypeScript's strict NodeNext mode. Nothing in this file runs.
import {
  readPackage, validatePackage, validateInputValue, encodePackage,
  INPUT_TYPES, ICONS, NATIVE_ENTRIES,
  type AdvancedLuaBlockPlugin, type LegacyLuaBlockPlugin, type NativeBlockPlugin,
  type BlockPluginPackage, type BlockPluginInputType, type BlockPluginIcon, type NativeBlockPluginEntry,
} from '../package.mjs'

const advanced: AdvancedLuaBlockPlugin = {
  format: 'macrohandler.block', schemaVersion: 3, id: 'example.typed', version: '1.0.0', name: 'Typed', code: 'print(inputs.label)',
  inputs: [
    {key: 'label', label: 'Label', required: true, multiline: true, defaultValue: 'Ready'},
    {key: 'delay', label: 'Delay', type: 'number', defaultValue: '100', min: 0, max: 1000, step: 10, unit: 'ms'},
    {key: 'enabled', label: 'Enabled', type: 'boolean', defaultValue: 'true', advanced: true},
    {key: 'mode', label: 'Mode', type: 'choice', choices: ['one', 'two'], defaultValue: 'one'},
    {key: 'color', label: 'Color', type: 'color', defaultValue: '#AABBCC'},
    {key: 'output', label: 'Lua global', type: 'variable', defaultValue: 'myResult'},
    {key: 'point', label: 'Point', type: 'point', defaultValue: '20,30', group: 'screen'},
    {key: 'region', label: 'Region', type: 'region', defaultValue: '0,0,0,0', help: 'Full-area sentinel'},
  ],
  form: {layout: 'sections', groups: [{id: 'screen', label: 'Screen', help: null}]},
  presentation: {icon: 'code', category: 'Examples'},
}
const legacy: LegacyLuaBlockPlugin = {
  format: 'macrohandler.block', schemaVersion: 1, id: 'example.legacy', version: '1.0.0', name: 'Legacy', code: 'print(inputs.x)',
  inputs: [{key: 'x', label: 'X', defaultValue: 'x', help: null}],
}
const native: NativeBlockPlugin = {
  format: 'macrohandler.block', schemaVersion: 2, id: 'com.macrohandler.navigation_stop', version: '1.0.0', name: 'Stop', code: '',
  native: {entry: 'navigation_stop', apiVersion: 1, source: 'Existing allowlisted engine'},
}
for (const result of [readPackage(encodePackage(advanced)), validatePackage(legacy), validatePackage(native)]) {
  if (result.schemaVersion === 3) {
    const field = result.inputs?.[0]
    if (field?.type === 'number') {
      const lower: number | null | undefined = field.min
      const initial: string = field.defaultValue
      void [lower, initial]
    }
    const icon: BlockPluginIcon | null | undefined = result.presentation?.icon
    void icon
  } else if (result.schemaVersion === 2) {
    const version: 1 = result.native.apiVersion
    const lua: '' = result.code
    void [version, lua]
  }
}
validateInputValue({type: 'number', min: 0.1, step: 0.1}, '0.3')
validateInputValue({type: 'choice', choices: ['a', 'b']}, 'a')
const inputTypes: BlockPluginInputType[] = INPUT_TYPES
const icons: BlockPluginIcon[] = ICONS
const entries: NativeBlockPluginEntry[] = NATIVE_ENTRIES
void [inputTypes, icons, entries]

const badType: AdvancedLuaBlockPlugin = {...advanced, inputs: [
  // @ts-expect-error invented input types are not supported
  {key: 'x', label: 'X', type: 'invented'},
]}
const badNumber: AdvancedLuaBlockPlugin = {...advanced, inputs: [
  // @ts-expect-error defaults are strings, not JSON numbers
  {key: 'x', label: 'X', type: 'number', defaultValue: 1},
]}
const badTextMetadata: AdvancedLuaBlockPlugin = {...advanced, inputs: [
  // @ts-expect-error required is a text-only setting
  {key: 'x', label: 'X', type: 'boolean', defaultValue: 'true', required: true},
]}
const badBounds: AdvancedLuaBlockPlugin = {...advanced, inputs: [
  // @ts-expect-error numeric bounds are not color metadata
  {key: 'x', label: 'X', type: 'color', defaultValue: '#AABBCC', min: 0},
]}
const badLegacy: LegacyLuaBlockPlugin = {...legacy, inputs: [
  // @ts-expect-error advanced metadata requires schema 3
  {key: 'x', label: 'X', defaultValue: 'x', required: true},
]}
// @ts-expect-error sections are required for groups
const badForm: AdvancedLuaBlockPlugin = {...advanced, form: {layout: 'stack', groups: [{id: 'x', label: 'X'}]}}
// @ts-expect-error native ID and engine must match
const badNative: NativeBlockPlugin = {...native, id: 'com.macrohandler.agent_detect'}
// @ts-expect-error unknown native engines are not extensibility APIs
const badEngine: NativeBlockPluginEntry = 'arbitrary'
// @ts-expect-error unknown icons are not executable UI widgets
const badIcon: BlockPluginIcon = 'browser'
// @ts-expect-error a Lua package cannot include a native descriptor
const badMixed: AdvancedLuaBlockPlugin = {...advanced, native: native.native}
// @ts-expect-error unknown root metadata is not accepted
const badRoot: BlockPluginPackage = {...advanced, invented: true}
// @ts-expect-error a choice input cannot have an empty choice list
validateInputValue({type: 'choice', choices: []}, 'x')
void [badType, badNumber, badTextMetadata, badBounds, badLegacy, badForm, badNative, badEngine, badIcon, badMixed, badRoot]
