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
pnpm install
cp .dev.vars.example .dev.vars     # then set ADMIN_PASSWORD and SESSION_SECRET in it
pnpm db:migrate:local
pnpm db:seed:local              # optional: six sample essays to look at
pnpm dev                        # http://localhost:3000, admin at /admin
```

## Deploying to ramya.reyan.me

The blog lives at **https://ramya.reyan.me**, set in `routes` in `wrangler.jsonc`. The `reyan.me` domain needs to be
on Cloudflare already (it shows as Active in the Cloudflare dashboard), and `ramya.reyan.me` must not already have
a DNS record, so delete any old one first.

Run these once from the project folder:

```bash
pnpm wrangler login

# 1. Create the database, then paste the database_id it prints into wrangler.jsonc
pnpm db:create

# 2. Create the bucket for photos
pnpm wrangler r2 bucket create nestled-reverie-images

# 3. Create the tables
pnpm db:migrate

# 4. Set the admin password and a random session secret
pnpm wrangler secret put ADMIN_PASSWORD
openssl rand -base64 32 | pnpm wrangler secret put SESSION_SECRET

# 5. Deploy
pnpm run deploy
```

The first deploy also creates the `ramya.reyan.me` DNS record and its HTTPS certificate, which can take a few
minutes to start working. To check or change the address later, see Workers & Pages → nestled-reverie → Settings →
Domains & Routes in the Cloudflare dashboard.

After the first time, shipping code changes is just `pnpm run deploy`. If the database schema changes,
run `pnpm db:generate` and then `pnpm db:migrate` before deploying.

## Code map

- `src/routes/` pages: home, journal, essay, admin, plus `/api/images` (upload) and `/images/*` (serving photos)
- `src/site/` the Gilded Script look: `site.css`, the header and footer, and the soft placeholder images
- `src/admin/` the writing desk: the Tiptap editor, topic input and styles
- `src/server/` server functions for posts and tags, and the admin session
- `src/db/schema.ts` the tables; migrations live in `drizzle/`
