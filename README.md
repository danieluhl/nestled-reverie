# Nestled Reverie

A personal journal on career, motherhood and life between two worlds, in the Gilded Script design.
Built with TanStack Start and running on Cloudflare Workers, with posts in Cloudflare D1 and photos in Cloudflare R2.

- `/` is the home page, `/journal` lists every essay (filter by topic, sort by date or title), `/journal/<slug>` is one essay.
- `/admin` is the private writing desk. Nothing on the site links to it, and it asks for a password.

## Writing

Sign in at `/admin`, then **Write something new**.

- Add a cover photo by clicking the arch. Type a title and a short line to invite the reader in.
- Add topics by typing and pressing Enter. Existing topics are suggested as you type. Readers can filter the journal by them.
- The toolbar has headings, bold, italic, underline, links, bullet and numbered lists, quotes, a divider and photos.
  Photos can also be pasted or dragged straight into the text.
- Drafts save themselves as you type. **Publish** puts the essay on the site.
  After that, edits wait for **Update** so half-finished changes never go live. ⌘S / Ctrl+S saves too.

## Running it locally

```bash
npm install
cp .dev.vars.example .dev.vars     # then set ADMIN_PASSWORD and SESSION_SECRET in it
npm run db:migrate:local
npm run db:seed:local              # optional: six sample essays to look at
npm run dev                        # http://localhost:3000, admin at /admin
```

## Deploying to a Cloudflare subdomain

The domain's DNS needs to be on Cloudflare already (it shows as Active in the Cloudflare dashboard).
Run these once from the project folder:

```bash
npx wrangler login

# 1. Create the database, then paste the database_id it prints into wrangler.jsonc
npm run db:create

# 2. Create the bucket for photos
npx wrangler r2 bucket create nestled-reverie-images

# 3. Create the tables
npm run db:migrate

# 4. Set the admin password and a random session secret
npx wrangler secret put ADMIN_PASSWORD
openssl rand -base64 32 | npx wrangler secret put SESSION_SECRET

# 5. Deploy
npm run deploy
```

Then point the subdomain at it. In `wrangler.jsonc`, add your subdomain and deploy again:

```jsonc
"routes": [{ "pattern": "blog.yourdomain.com", "custom_domain": true }]
```

Cloudflare creates the DNS record and the HTTPS certificate for you. The subdomain must not already have a DNS
record, so delete any old one first. The same thing can be done in the dashboard: Workers & Pages →
nestled-reverie → Settings → Domains & Routes → Add → Custom domain.

After the first time, shipping code changes is just `npm run deploy`. If the database schema changes,
run `npm run db:generate` and then `npm run db:migrate` before deploying.

## Code map

- `src/routes/` pages: home, journal, essay, admin, plus `/api/images` (upload) and `/images/*` (serving photos)
- `src/site/` the Gilded Script look: `site.css`, the header and footer, and the soft placeholder images
- `src/admin/` the writing desk: the Tiptap editor, topic input and styles
- `src/server/` server functions for posts and tags, and the admin session
- `src/db/schema.ts` the tables; migrations live in `drizzle/`
