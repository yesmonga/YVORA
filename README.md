# YVORA

Premium AIO Bot Dashboard for Amazon & Carrefour automation. Built with Next.js 14 and a sleek purple theme.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom cyber theme
- **UI Components**: Shadcn UI (Radix primitives)
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/botcontroller"
```

3. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/bot/          # API routes for bot interaction
│   ├── dashboard/        # Dashboard pages
│   │   ├── accounts/     # Account management
│   │   ├── generator/    # Account generator
│   │   ├── profiles/     # Billing profiles
│   │   ├── proxies/      # Proxy management
│   │   ├── settings/     # App settings
│   │   └── tasks/        # Task management
│   ├── globals.css       # Global styles & theme
│   └── layout.tsx        # Root layout
├── components/
│   ├── layout/           # Sidebar, Header, DashboardLayout
│   └── ui/               # Shadcn UI components
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── store/
│   ├── tasks.ts          # Task state management
│   └── ui.ts             # UI state management
└── prisma/
    └── schema.prisma     # Database schema
```

## Features

- **Dashboard**: Overview stats and recent activity
- **Tasks**: Create, manage, and monitor automation tasks
- **Profiles**: Manage billing/shipping profiles with auto-jig
- **Accounts**: Store and verify site accounts
- **Proxies**: Manage proxy groups and test connectivity
- **Generator**: Automated account creation tool
- **Settings**: Configure notifications, webhooks, and automation

## Deployment

### Railway

1. Connect your repository to Railway
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t bot-controller .
docker run -p 3000:3000 -e DATABASE_URL="..." bot-controller
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bot/tasks` | List all tasks |
| POST | `/api/bot/tasks` | Create new task |
| GET | `/api/bot/tasks/:id` | Get task details |
| PATCH | `/api/bot/tasks/:id` | Update task status |
| DELETE | `/api/bot/tasks/:id` | Delete task |
| GET | `/api/bot/accounts` | List accounts |
| POST | `/api/bot/accounts` | Add account |
| GET | `/api/bot/profiles` | List profiles |
| POST | `/api/bot/profiles` | Create profile |
| GET | `/api/bot/proxies` | List proxies |
| POST | `/api/bot/proxies` | Add proxies |

## Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#161620` | Body background |
| Card | `#1c1c24` | Cards, sidebar |
| Border | `#2d2d3b` | Borders |
| Primary | `#2bea8e` | Accent, success |
| Text | `#ffffff` | Primary text |
| Muted | `#6c6c87` | Secondary text |

## License

MIT
