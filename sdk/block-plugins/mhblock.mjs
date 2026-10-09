#!/usr/bin/env node
import { writeFile, open } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { parsePackageJson, MAX_PACKAGE_BYTES } from './strict-json.mjs'
import { validatePackage, encodePackage } from './package.mjs'

async function boundedRead(path, max) {
  const file = await open(path, 'r')
  try {
    if (!(await file.stat()).isFile()) throw new Error('Input must be a regular file')
    const bytes = Buffer.alloc(max + 1)
    let size = 0
    while (size < bytes.length) {
      const result = await file.read(bytes, size, bytes.length - size, null)
      if (!result.bytesRead) break
      size += result.bytesRead
    }
    if (size > max) throw new Error('Input exceeds byte limit')
    return bytes.subarray(0, size)
  } finally { await file.close() }
}

export async function run(args) {
  const [command, input, ...options] = args
  if (!['validate', 'pack'].includes(command) || !input) throw new Error('Usage: node mhblock.mjs validate input.mhblock | pack input.mhblock --out output.mhblock [--code source.lua]')
  const flags = new Map()
  for (let i = 0; i < options.length; i += 2) {
    if (!['--code', '--out'].includes(options[i]) || !options[i + 1] || flags.has(options[i])) throw new Error('Invalid or duplicate option')
    flags.set(options[i], options[i + 1])
  }
  if (command === 'validate' && flags.size) throw new Error('validate takes no options')
  const model = parsePackageJson(await boundedRead(input, MAX_PACKAGE_BYTES))
  if (flags.has('--code')) model.code = new TextDecoder('utf-8', { fatal: true }).decode(await boundedRead(flags.get('--code'), MAX_PACKAGE_BYTES))
  validatePackage(model)
  const encoded = encodePackage(model)
  if (command === 'pack') {
    if (!flags.has('--out')) throw new Error('pack requires --out')
    // Exclusive creation: a typo cannot replace an existing package/source.
    await writeFile(flags.get('--out'), encoded, { flag: 'wx' })
  }
  return { structuralValidation: 'passed', androidCompilerValidation: 'required', bytes: encoded.byteLength,
    sha256: createHash('sha256').update(encoded).digest('hex'), schemaVersion: model.schemaVersion }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2)).then(result => process.stdout.write(`${JSON.stringify(result)}\n`)).catch(() => {
    // Do not echo source paths, package text or potentially secret user input.
    process.stderr.write('Package rejected. Check the SDK format, limits and command usage; no existing output was replaced.\n')
    process.exitCode = 1
  })
}
