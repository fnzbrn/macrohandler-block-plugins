// Portable browser/Node PNG preflight. Android additionally verifies the bounded zlib pixel stream.
export function validateIconPng(encoded) {
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  check(typeof encoded === 'string' && encoded.length <= 43692 && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded), 'Expected bounded canonical base64 PNG')
  const raw = atob(encoded)
  check(btoa(raw) === encoded && raw.length <= 32768 && raw.length >= 57, 'Invalid PNG byte size')
  const bytes = Uint8Array.from(raw, c => c.charCodeAt(0)), view = new DataView(bytes.buffer)
  check([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v), 'Expected PNG signature')
  let offset = 8, header = false, data = false, ended = false, chunks = 0
  while (offset < bytes.length) {
    check(++chunks <= 64 && bytes.length - offset >= 12 && !ended, 'Invalid PNG chunks')
    const size = view.getUint32(offset)
    check(size <= bytes.length - offset - 12, 'Truncated PNG chunk')
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8))
    check(['IHDR', 'IDAT', 'IEND'].includes(type), 'Use static RGB/RGBA PNG without metadata')
    let crc = 0xffffffff
    for (const byte of bytes.subarray(offset + 4, offset + 8 + size)) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
    }
    check(((crc ^ 0xffffffff) >>> 0) === view.getUint32(offset + 8 + size), 'PNG checksum mismatch')
    if (type === 'IHDR') {
      check(!header && offset === 8 && size === 13, 'Invalid PNG header')
      check(view.getUint32(offset + 8) >= 1 && view.getUint32(offset + 8) <= 256 && view.getUint32(offset + 12) >= 1 && view.getUint32(offset + 12) <= 256, 'PNG dimensions exceed 256 pixels')
      check(bytes[offset + 16] === 8 && [2, 6].includes(bytes[offset + 17]) && [18, 19, 20].every(i => bytes[offset + i] === 0), 'Use 8-bit non-interlaced RGB/RGBA PNG')
      header = true
    } else if (type === 'IDAT') { check(header && size > 0, 'Invalid PNG data'); data = true }
    else { check(header && data && size === 0, 'Invalid PNG end'); ended = true }
    offset += 12 + size
  }
  check(ended, 'Missing PNG end')
}
