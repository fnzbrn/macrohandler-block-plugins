/** Limited lexical preflight, never a compiler. Android still checks the complete generated chunk. */
export function checkLuaPolicy(source) {
  let masked = '', at = 0
  while (at < source.length) {
    const comment = source.startsWith('--', at), start = at + (comment ? 2 : 0)
    const long = source.slice(start).match(/^\[(=*)\[/)
    if (long) {
      const close = `]${long[1]}]`, end = source.indexOf(close, start + long[0].length)
      if (end < 0) throw new Error('Unterminated Lua long string or comment')
      const next = end + close.length
      masked += source.slice(at, next).replace(/[^\n]/g, ' '); at = next; continue
    }
    if (comment) {
      const end = source.slice(at).search(/[\r\n]/), next = end < 0 ? source.length : at + end
      masked += ' '.repeat(next - at); at = next; continue
    }
    if (source[at] === '"' || source[at] === "'") {
      const quote = source[at], start = at++
      let closed = false
      while (at < source.length) {
        if (source[at] === '\\') { at += 2; continue }
        if (source[at++] === quote) { closed = true; break }
      }
      if (!closed) throw new Error('Unterminated Lua quoted string')
      masked += source.slice(start, at).replace(/[^\n]/g, ' '); continue
    }
    masked += source[at++]
  }
  if (/\b(?:os\s*\.\s*(?:execute|exit|remove|rename)|io\s*\.\s*(?:open|popen)|package\s*\.\s*loadlib)\b/.test(masked)) throw new Error('Use supported Macro Handler APIs')
  // Mirrors the containing-scope protection, not the broader ScriptPolicyGuard or Lua syntax checker.
  const stack = []; let pendingLoop = false, skipThen = false
  for (const m of masked.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    // Lua keywords are case-sensitive; Function/End/Return are ordinary identifiers.
    switch (m[0]) {
      case 'function': stack.push('function'); break
      case 'for': case 'while': pendingLoop = true; break
      case 'then': if (!skipThen) stack.push('then'); skipThen = false; break
      case 'do': stack.push(pendingLoop ? 'loop' : 'do'); pendingLoop = false; break
      case 'repeat': stack.push('repeat'); break
      case 'end': if (!stack.length) throw new Error('Lua escapes its containing scope'); stack.pop(); break
      case 'until': { const index = stack.lastIndexOf('repeat'); if (index < 0) throw new Error('Lua escapes its containing scope'); stack.splice(index, 1); break }
      case 'elseif': if (!stack.length) throw new Error('Lua escapes its containing scope'); skipThen = true; break
      case 'else': if (!stack.length) throw new Error('Lua escapes its containing scope'); break
      case 'return': if (!stack.includes('function')) throw new Error('Put early returns inside a local function'); break
      case 'break': if (!stack.includes('loop') && !stack.includes('repeat')) throw new Error('Lua escapes its containing loop'); break
    }
  }
}
