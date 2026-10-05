// Password hashing with the platform's built-in PBKDF2. Better Auth's default (scrypt in JavaScript)
// can run past a Cloudflare Worker's CPU limit; Web Crypto is native and fast.

const ITERATIONS = 100_000
const enc = new TextEncoder()
const toHex = (b: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('')
const fromHex = (h: string) => new Uint8Array(h.match(/../g)?.map((x) => Number.parseInt(x, 16)) ?? [])

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${toHex(await derive(password, salt, ITERATIONS))}`
}

export async function verifyPassword({ hash, password }: { hash: string; password: string }) {
  const [scheme, iterations, salt, expected] = hash.split('$')
  if (scheme !== 'pbkdf2' || !salt || !expected) return false
  const actual = toHex(await derive(password, fromHex(salt), Number(iterations)))
  let diff = actual.length ^ expected.length
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
