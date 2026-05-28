# Payload Developer Portfolio

A Payload CMS and Next.js starter for building a developer portfolio with editable projects, skills, work experience, media, and global site copy.

## Stack

- Payload CMS 3.85 with the Next.js adapter
- Next.js 16 and React 19
- SQLite for local development
- TypeScript, ESLint, Vitest, and Playwright

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` for the portfolio and `http://localhost:3000/admin` for the CMS. Payload will guide you through creating the first admin user.

### Mock Data

Add starter portfolio content with:

```bash
pnpm seed
```

The seed is safe to rerun. It refreshes the included mock projects, skills, experience entries, and site settings.

## CMS Model

- `Projects`: case studies, stack, links, highlights, cover images, and featured ordering
- `Skills`: categorized technical skills with proficiency values
- `Experience`: roles, companies, dates, highlights, and technology notes
- `Site Settings`: homepage copy, social links, availability, contact details, and hero image
- `Media`: local image uploads with thumbnail and card sizes

## Useful Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm seed
pnpm generate:types
pnpm test:int
pnpm test:e2e
```

Install the Playwright browser once before running e2e tests:

```bash
pnpm exec playwright install chromium
```

The default database is `payload-portfolio.db`, configured through `DATABASE_URL=file:./payload-portfolio.db`.
