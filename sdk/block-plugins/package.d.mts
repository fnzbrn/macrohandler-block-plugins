/** Validated but unnormalised data: omitted/null optional values remain unchanged. */
export type BlockPluginInputType = 'text' | 'number' | 'boolean' | 'choice' | 'color' | 'variable' | 'point' | 'region'
export type BlockPluginIcon = 'block' | 'code' | 'search' | 'touch' | 'flow' | 'data'
export type NativeBlockPluginEntry = 'navigation' | 'navigation_stop' | 'agent_detect' | 'agent_routine'
interface InputIdentity {
  /** ASCII identifier, up to 48 characters; Lua code reads inputs.key. */
  key: string
  label: string
}
interface AdvancedInputMetadata {
  help?: string | null
  unit?: string | null
  /** Must name an existing group in a sections form. */
  group?: string | null
  advanced?: boolean | null
}
interface NonTextMetadata { required?: null; multiline?: null }
interface NonNumberMetadata { min?: null; max?: null; step?: null }
interface NoChoices { choices?: [] }
export interface BlockPluginTextInput extends InputIdentity, AdvancedInputMetadata, NonNumberMetadata, NoChoices {
  /** Omitted type means text; omitted default means an empty string. */
  type?: 'text'
  defaultValue?: string
  required?: boolean | null
  multiline?: boolean | null
}
export interface BlockPluginNumberInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NoChoices {
  type: 'number'
  /** Finite portable decimal as a string, not a JSON number. */
  defaultValue: string
  min?: number | null
  max?: number | null
  /** Positive decimal grid step, originating at min or zero. */
  step?: number | null
}
export interface BlockPluginBooleanInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NonNumberMetadata, NoChoices {
  type: 'boolean'
  defaultValue: 'true' | 'false'
}
export interface BlockPluginChoiceInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NonNumberMetadata {
  type: 'choice'
  /** Up to 64 unique exact strings; the default must belong to this list. */
  choices: [string, ...string[]]
  defaultValue?: string
}
export interface BlockPluginSpatialInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NonNumberMetadata, NoChoices {
  type: 'point' | 'region'
  /** Reference-plane integer CSV: x,y or x,y,w,h. Component 1 is rejected. */
  defaultValue: string
}
export interface BlockPluginColorInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NonNumberMetadata, NoChoices {
  type: 'color'
  /** #RRGGBB or #AARRGGBB, delivered as a string. */
  defaultValue: string
}
export interface BlockPluginVariableInput extends InputIdentity, AdvancedInputMetadata, NonTextMetadata, NonNumberMetadata, NoChoices {
  type: 'variable'
  /** Nonreserved Lua-global name; not an automatic No-Code output port. */
  defaultValue: string
}
export type BlockPluginInput = BlockPluginTextInput | BlockPluginNumberInput | BlockPluginBooleanInput
  | BlockPluginChoiceInput | BlockPluginSpatialInput | BlockPluginColorInput | BlockPluginVariableInput
type LegacyInput = BlockPluginTextInput | BlockPluginNumberInput | BlockPluginBooleanInput | BlockPluginChoiceInput
type AdvancedMetadataKey = keyof AdvancedInputMetadata | 'required' | 'multiline' | 'min' | 'max' | 'step'
type WithoutAdvanced<T> = T extends LegacyInput ? Omit<T, AdvancedMetadataKey> & { [K in AdvancedMetadataKey]?: null } : never
export type LegacyBlockPluginInput = WithoutAdvanced<LegacyInput>
export interface BlockPluginGroup { id: string; label: string; help?: string | null }
export type BlockPluginForm = { layout?: 'stack'; groups?: [] } | { layout: 'sections'; groups?: BlockPluginGroup[] }
export interface BlockPluginPresentation { category?: string | null; icon?: BlockPluginIcon | null }
export type BlockPluginAction = { id: string; label: string; help?: string | null; icon?: BlockPluginIcon | null } & (
  { kind?: 'preset'; values: Record<string, string> } | { kind: 'reset'; values?: Record<string, never> }
)
export type RichBlockPluginForm = ({ layout?: 'stack'; groups?: [] } | { layout: 'sections' | 'tabs'; groups?: BlockPluginGroup[] }) & { actions?: BlockPluginAction[] }
export interface RichBlockPluginPresentation extends BlockPluginPresentation { iconPng?: string | null }
interface PackageIdentity {
  format: 'macrohandler.block'
  /** Lowercase dotted identifier, up to 96 characters. */
  id: string
  /** Three numeric components, optionally followed by an ASCII prerelease. */
  version: string
  name: string
  description?: string
  author?: string
}
export interface LegacyLuaBlockPlugin extends PackageIdentity {
  schemaVersion: 1
  code: string
  inputs?: LegacyBlockPluginInput[]
  native?: null
  form?: null
  presentation?: null
}
export interface AdvancedLuaBlockPlugin extends PackageIdentity {
  schemaVersion: 3
  /** UTF-8 Lua source; Android compilation/sandbox validation remain required. */
  code: string
  inputs?: BlockPluginInput[]
  native?: null
  form?: BlockPluginForm | null
  presentation?: BlockPluginPresentation | null
}
export type NativeBlockPlugin = {
  [K in NativeBlockPluginEntry]: Omit<PackageIdentity, 'id'> & {
    id: `com.macrohandler.${K}`
    schemaVersion: 2
    code: ''
    inputs?: []
    native: { entry: K; apiVersion: 1; source: string }
    form?: null
    presentation?: null
  }
}[NativeBlockPluginEntry]
export interface RichLuaBlockPlugin extends Omit<AdvancedLuaBlockPlugin, 'schemaVersion' | 'form' | 'presentation'> {
  schemaVersion: 4
  form?: RichBlockPluginForm | null
  presentation?: RichBlockPluginPresentation | null
}
export type BlockPluginPackage = LegacyLuaBlockPlugin | AdvancedLuaBlockPlugin | RichLuaBlockPlugin | NativeBlockPlugin
/** Identity fields are not needed by the standalone value validator. */
export type BlockPluginInputValueSpec = BlockPluginInput extends infer T
  ? T extends BlockPluginInput ? Omit<T, keyof InputIdentity | 'defaultValue'> : never : never
export const NATIVE_ENTRIES: NativeBlockPluginEntry[]
export const INPUT_TYPES: BlockPluginInputType[]
export const ICONS: BlockPluginIcon[]
/** Throws on an invalid structure; does not normalise fields or execute Lua. */
export function validatePackage(raw: unknown): BlockPluginPackage
export function validateInputValue(input: BlockPluginInputValueSpec, value: string): void
/** Strict UTF-8/JSON and structural checks only; no Lua compilation. */
export function readPackage(bytes: Uint8Array): BlockPluginPackage
/** Deterministic SDK bytes; Android canonical fingerprints are separate. */
export function encodePackage(raw: unknown): Uint8Array
