# Alfa Elevator

Production-ready corporate website and admin portal for Alfa Elevator — India's trusted elevator solutions company.

## Stack

- **Frontend:** React 18 + JavaScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime + RLS)
- **Deployment:** Vercel (frontend) + Supabase Cloud ap-south-1 Mumbai

## Getting Started

```bash
pnpm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
pnpm dev
```

## Database Setup

```bash
supabase db push
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run Vitest tests |
| `pnpm db:migrate` | Push Supabase migrations |

## Project Structure

- `src/pages/public/` — Public website pages
- `src/pages/admin/` — Admin portal pages
- `src/components/ui/` — shadcn/ui components (JSX)
- `src/hooks/` — TanStack Query data hooks
- `supabase/migrations/` — Database schema, RLS, seed data

## Admin Roles

- `super_admin` — Full access including user management and site settings
- `admin` — Content management
- `hr` — Jobs and applications
- `sales` — Quote and contact inquiries
- `editor` — Blog management

## Environment Variables

See `.env.example` for required variables.
