import { env } from 'cloudflare:workers'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError } from 'better-auth/api'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { count } from 'drizzle-orm'
import { getDb } from '#/db'
import * as schema from '#/db/schema'
import { hashPassword, verifyPassword } from './password'

// The blog has one author. The first account created becomes the admin, and sign-up
// closes for good after that. Everyone signed in can manage the blog.

export async function adminExists() {
  const [row] = await getDb().select({ n: count() }).from(schema.user)
  return (row?.n ?? 0) > 0
}

let instance: ReturnType<typeof createAuth> | undefined

function createAuth() {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(), { provider: 'sqlite', schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      password: { hash: hashPassword, verify: verifyPassword },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    databaseHooks: {
      user: {
        create: {
          before: async () => {
            if (await adminExists()) {
              throw new APIError('FORBIDDEN', { message: 'This blog already has an author.' })
            }
          },
        },
      },
    },
    plugins: [tanstackStartCookies()],
  })
}

export function getAuth() {
  instance ??= createAuth()
  return instance
}
