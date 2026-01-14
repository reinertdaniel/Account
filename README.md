# 🌪️ KATREPAIR Financial Tracker

A premium, localized financial management system designed for scale and aesthetic excellence, built with **Next.js 15**, **Prisma**, and **Better-Auth**.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/)
- **Auth**: [Better-Auth](https://www.better-auth.com/) (Google SSO & Email/Password)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Radix UI primitives & custom design system

## 📂 Project Architecture

```text
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── actions/          # Server Actions (Stats, Wallpapers, etc.)
│   ├── finances/         # Financial transaction tracking
│   ├── login/            # Premium login page with dynamic wallpapers
│   ├── orders/           # Order management & inventory integration
│   └── settings/         # Category & system configuration
├── components/           # React component library
│   ├── common/           # Shared UI (Toggles, Delays, etc.)
│   ├── orders/           # Feature-specific components
│   └── ui/               # Base design system (Radix + Tailwind)
├── lib/                  # Core library & singletons
│   ├── auth.ts           # Server-side Auth configuration
│   ├── auth-client.ts    # Client-side Auth client
│   └── prisma.ts         # Prisma Client singleton
├── prisma/               # Database schema & migration history
├── public/               # Static assets
│   └── wallpapers/       # Dynamic login background repository
└── scripts/              # Dev utilities & migration tools
```

## 🛠️ Development & Utilities

### Authentication Flow
The project implements a hybrid auth system via `better-auth`:
- **Social**: Google SSO with one-tap entry.
- **Classic**: Email & Password with modern, animated registration flows.
- **UX**: Automatic session restoration and hard-purging state on logout.

### Financial Engine
- **Localized Statistics**: Triple-layered status (Lifetime, 60-Day, 30-Day) in pounds (`£`).
- **Dynamic Coloring**: Transactions are automatically color-coded (Red for Expenses, Green for Income).
- **Suppression Logic**: Integrated toggle system to hide/show suppressed financial data across the dashboard.

### Media & Aesthetics
- **Dynamic Wallpapers**: Drop any image into `public/wallpapers/` to rotate them on the login page.
- **Glassmorphism**: Extensive use of backdrop blurs and semi-transparent cards.
- **Minimalist Loading**: Centered, pulsing "SYNCHRONIZING" state for a premium feel.

## 🤖 Antigravity Pair Programming

This project is actively developed in partnership with **Antigravity**. It leverages:
- **Proactive Execution**: Directly implementing features and fixing build drifts.
- **Implementation Planning**: Continuous review of architectural decisions.
- **Automated Verification**: Build checks and schema validation.

---

### Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and configure your `DATABASE_URL` (Neon) and Auth secrets.

3. **Database Migration**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Launch**:
   ```bash
   npm run dev
   ```
