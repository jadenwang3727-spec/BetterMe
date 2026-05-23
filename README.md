# HabitQuest ⚔️

> Level Up Your Life — A social accountability habit-building platform combining behavioral psychology, gamification, and retro pixel-art aesthetics.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-2.49-green?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square)

---

## Features

- **Habit Tracking** — Daily check-offs with XP rewards, streak counters, and grace days
- **Gamification** — XP/leveling system, 20+ achievements, daily quests, level-up celebrations
- **World Map** — Canvas-rendered RPG world that unlocks new biomes as you gain XP
- **Accountability Parties** — Realtime group chat, shared streaks, reaction system
- **Analytics** — 90-day heatmap, consistency charts, mood correlation, category breakdown
- **Pixel-Art UI** — Retro aesthetic with CSS-only animations, neon accents, dark mode

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Database + Auth | Supabase (PostgreSQL + Row Level Security) |
| Realtime | Supabase Realtime (postgres_changes) |
| Animations | Framer Motion (LazyMotion) + CSS keyframes |
| Charts | Recharts |
| Forms | react-hook-form + zod |

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd BetterMe
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → create a new project
2. Copy your **Project URL**, **anon key**, and **service_role key**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=any-random-secret-string
```

### 4. Run the database schema

1. Open your Supabase project → **SQL Editor**
2. Copy the contents of `src/lib/supabase/schema.sql`
3. Paste and run it — this creates all tables, triggers, RLS policies, and seed data

### 5. Configure Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. In Supabase → **Authentication → Providers → Google**: paste the Client ID and Client Secret
5. In Supabase → **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

The full schema lives in `src/lib/supabase/schema.sql`. Key tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, XP, level, streaks |
| `habits` | Habit definitions per user |
| `habit_logs` | Daily completion records |
| `streaks` | Current/longest/total streak per habit |
| `parties` | Accountability groups |
| `party_members` | Party membership |
| `messages` | Party chat messages |
| `user_achievements` | Earned achievements |
| `user_quests` | Daily quest progress |

**Critical triggers:**
- `handle_new_user()` — auto-creates a `profiles` row on signup
- `recalculate_streak()` — fires after each `habit_log` insert; updates streak, awards XP, checks level-up, creates notifications

---

## XP & Level System

```
Level N requires: 100 × N² total XP
Level 1: 0 XP  |  Level 5: 2,500 XP  |  Level 10: 10,000 XP  |  Level 25: 62,500 XP

XP per habit completion:
  Easy: 25 XP  |  Medium: 50 XP  |  Hard: 100 XP  |  Legendary: 200 XP

Streak bonus: +10% per 7-day tier, capped at +100%
```

## Biome Unlock Thresholds

| Biome | XP Required |
|-------|------------|
| 🌲 Starter Forest | 0 |
| 🏜️ Ancient Desert | 1,000 |
| 🌆 Cyber City | 3,000 |
| ⛰️ Snowy Mountains | 7,500 |
| 🌋 Lava Dungeon | 15,000 |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Update Supabase → Authentication → URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Add Redirect URL: `https://your-app.vercel.app/auth/callback`
5. Update Google OAuth authorized redirect URI to include the Vercel domain
6. Deploy — the daily quest cron (`vercel.json`) runs automatically at midnight UTC

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login, signup, callback
│   ├── dashboard/        # Main dashboard
│   ├── habits/           # Habit list + detail
│   ├── map/              # World map
│   ├── parties/          # Party rooms + chat
│   ├── analytics/        # Stats and charts
│   ├── profile/          # Public user profiles
│   ├── settings/         # User settings
│   └── api/              # Route handlers
├── components/
│   ├── ui/               # Design system atoms
│   ├── layout/           # AppShell, Sidebar, TopBar
│   ├── landing/          # Landing page sections
│   ├── gamification/     # XP float, level-up modal, particles
│   ├── habits/           # HabitCard, HabitForm
│   ├── map/              # Canvas world map
│   ├── parties/          # Chat, member list
│   ├── analytics/        # Charts
│   └── providers/        # React context providers
├── lib/
│   ├── supabase/         # Client factory, types, schema
│   ├── auth/             # Server actions
│   ├── habits/           # Queries + actions
│   ├── gamification/     # XP, achievements, quests
│   ├── parties/          # Queries + actions
│   ├── map/              # Biome definitions
│   └── constants/        # Levels, achievements, cosmetics
└── hooks/                # Custom React hooks
```

---

## License

MIT
