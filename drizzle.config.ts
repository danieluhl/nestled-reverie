import { defineConfig } from 'drizzle-kit'

// Generates SQL migrations into ./drizzle. Wrangler applies them to D1:
//   pnpm db:migrate:local   (your machine)
//   pnpm db:migrate         (Cloudflare)
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
})
