// Portable, dependency-free JSON admission. No eval, file access or network.
export const MAX_PACKAGE_BYTES = 256 * 1024

/** Count values, not property names, matching Android PackageJsonGuard. */
export function parsePackageJson(bytes) {
  if (!(ArrayBuffer.isView(bytes) && Object.prototype.toString.call(bytes) === '[object Uint8Array]') || bytes.byteLength > MAX_PACKAGE_BYTES) throw new Error('Package exceeds 256 KiB')
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  return parseStrictJson(text, 8, 4096)
}

export function parseStrictJson(text, maxDepth = 8, maxNodes = 4096) {
  let at = 0, nodes = 0
  const bad = () => { throw new Error('Invalid, duplicate-key or oversized JSON structure') }
  const space = () => { while (/[\x20\t\r\n]/.test(text[at] ?? '') && at < text.length) at++ }
  function string() {
    const start = at++
    while (at < text.length) {
      const c = text[at++]
      if (c === '"') return JSON.parse(text.slice(start, at))
      if (c === '\\') at++
      else if (c.charCodeAt(0) < 32) bad()
    }
    return bad()
  }
  function value(depth) {
    if (depth > maxDepth || ++nodes > maxNodes) bad()
    space()
    if (text[at] === '"') return string()
    if (text[at] === '{' || text[at] === '[') {
      const object = text[at++] === '{', end = object ? '}' : ']'
      const result = object ? Object.create(null) : [], keys = new Set()
      space()
      if (text[at] === end) { at++; return result }
      while (at < text.length) {
        let key
        if (object) {
          if (text[at] !== '"') bad()
          key = string()
          if (keys.has(key)) bad()
          keys.add(key); space()
          if (text[at++] !== ':') bad()
        }
        const entry = value(depth + 1)
        if (object) result[key] = entry
        else result.push(entry)
        space()
        if (text[at] === end) { at++; return result }
        if (text[at++] !== ',') bad()
        space()
      }
      return bad()
    }
    const token = text.slice(at).match(/^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/)?.[0]
    if (!token) bad()
    at += token.length
    return JSON.parse(token)
  }
  const result = value(0)
  space()
  if (at !== text.length) bad()
  return result
}
