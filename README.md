=# Mergewise

> AI-powered code reviewer for GitHub — automated pull request reviews that catch bugs, security issues, and improve code quality.

<!-- ![Mergewise Banner](./docs/assets/banner.png) -->

## Overview

Mergewise is a GitHub Code Reviewer that automatically reviews pull requests using AI. It analyzes code changes in real-time and provides intelligent feedback to help teams ship better code faster.

## Features

- **Automated PR Reviews**: Get instant AI feedback on every pull request
- **Bug Detection**: Catch potential bugs before they reach production
- **Security Analysis**: Identify security vulnerabilities and best practice violations
- **Performance Insights**: Get suggestions for code optimization
- **Code Quality**: Maintain consistent coding standards across your team
- **GitHub Native**: Seamlessly integrates with your GitHub workflow via comments

## How It Works

1. Install the Mergewise GitHub App on your repository or organization
2. Open a pull request as usual
3. Mergewise automatically analyzes the changes and posts a review comment
4. Review the feedback and make improvements
5. Merge with confidence

<!-- ![Workflow Diagram](./docs/assets/workflow.png) -->

## Architecture

Mergewise is built as a modern monorepo with two main components:

```
mergewise/
├── web/                  # Next.js frontend application
│   ├── app/             # Next.js App Router pages
│   ├── modules/         # Feature modules
│   ├── db/              # Database schema & migrations
│   ├── lib/             # Shared utilities
│   │   └── rebbitmq.ts  # RabbitMQ client singleton
│   └── trpc/            # tRPC API routers
│
└── code-review-worker/  # Background worker service
    ├── src/
    │   ├── index.ts     # Main worker entry point
    │   └── utils/       # AI prompts & helpers
    └── package.json     # Worker dependencies
```

### System Architecture

<!-- ![Architecture Diagram](./docs/assets/architecture.png) -->

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   GitHub        │────▶│  Next.js API    │────▶│   PostgreSQL    │
│   (Webhooks)    │     │  (Web App)      │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │    RabbitMQ     │────▶│ RabbitMQ Worker │
                        │     Queue       │     │  (AI Reviewer)  │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │   OpenRouter    │
                                                │   (AI Models)   │
                                                │                 │
                                                └─────────────────┘
```

### Components

#### Web Frontend ([`web/`](./web/))
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **API Layer**: tRPC for type-safe client-server communication
- **Auth**: Better Auth integration
- **Database**: PostgreSQL via Drizzle ORM

#### Code Review Worker ([`code-review-worker/`](./code-review-worker/))
- **Runtime**: Node.js with TypeScript
- **Queue**: RabbitMQ (AMQP) with amqplib for async job processing
- **Concurrency**: Prefetch(5) for parallel processing
- **AI**: OpenRouter AI SDK for LLM integration
- **GitHub Client**: Octokit for API interactions

### Data Flow

1. **Webhook Trigger**: GitHub sends a `pull_request` webhook event
2. **Event Handler**: Next.js API route validates and stores the review request in PostgreSQL
3. **Job Publishing**: Review job is published to RabbitMQ via direct exchange `code-review` with routing key `review`
4. **Queue Binding**: Message binds to the `review-jobs` queue (durable, persistent)
5. **Background Processing**: Worker consumes from queue (prefetch: 5), fetches PR diff, and sends to AI
6. **Status Updates**: Review status updates in database: pending → running → completed/failed
7. **AI Analysis**: OpenRouter routes to the best available model for code review
8. **Comment Posting**: Review is posted back to GitHub as a PR comment via Octokit

<!-- ![Data Flow Diagram](./docs/assets/data-flow.png) -->

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [React Query](https://tanstack.com/query) - Data fetching
- [Better Auth](https://www.better-auth.com/) - Authentication

### Backend
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker with AMQP protocol
- [amqplib](https://www.amqp.node/) - RabbitMQ client for Node.js
- [OpenRouter](https://openrouter.ai/) - AI model routing
- [Octokit](https://github.com/octokit/octokit.js) - GitHub API
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- RabbitMQ instance
- GitHub App credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mergewise.git
cd mergewise

# Install dependencies
npm install
cd web && npm install
cd ../code-review-worker && npm install
```

### Configuration

Create a `.env` file in the `web/` directory:

```env
# Database
DATABASE_URL="postgresql://..."

# RabbitMQ (AMQP connection)
REBBITMQ_URL="amqp://localhost"

# GitHub App
GITHUB_APP_ID="your_app_id"
GITHUB_APP_PRIVATE_KEY="your_private_key"
GITHUB_APP_WEBHOOK_SECRET="your_webhook_secret"

# OpenRouter
OPENROUTER_API_KEY="your_openrouter_key"

# Auth
BETTER_AUTH_SECRET="your_secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### Running Locally

```bash
# Start the web frontend
cd web
npm run dev

# Start the worker (in a separate terminal)
cd code-review-worker
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

<!-- ![Dashboard Screenshot](./docs/assets/dashboard.png) -->

## Database Schema

```sql
-- Users
users (id, name, email, created_at)

-- GitHub Installations
installations (id, github_id, account_login, account_type)

-- Repositories
repositories (id, installation_id, github_id, name, owner, full_name)

-- Code Reviews
reviews (id, repository_id, pr_number, pr_title, status, result, created_at)
```

## Web Dashboard

The Mergewise web dashboard provides a comprehensive interface for managing your GitHub repositories and reviewing AI-generated code reviews.

### Pages

#### Landing Page (`/`)
- Hero section with product overview
- Features showcase
- How it works section
- Pricing information (Free, Pro, Enterprise tiers)
- Call-to-action to install the GitHub App

<!-- ![Landing Page](./docs/assets/landing.png) -->

#### Authentication (`/(auth)/signin`)
- Secure sign-in page
- GitHub OAuth integration
- Session management

#### Dashboard Home (`/dashboard`)
The main dashboard provides an at-a-glance view of your Mergewise activity:

**Statistics Cards**
- Total Repositories - Number of connected GitHub repositories
- Total Reviews - All-time pull request reviews
- Completed - Successfully reviewed PRs
- Pending - Reviews in progress or queued

**Recent Reviews Widget**
- Last 5 PR reviews with status badges
- PR title and repository name
- Direct links to GitHub PRs
- Color-coded status indicators (Pending, Running, Completed, Failed)

**Quick Actions**
- Add Repository button
- Install GitHub App button
- Error notifications for failed reviews

**Empty State**
- Welcome message for new users
- Quick start guide to get started

<!-- ![Dashboard Home](./docs/assets/dashboard-home.png) -->

#### Repositories Management (`/dashboard/repositories`)
Manage all your connected GitHub repositories:

**Repository Table**
- Repository name with visibility badge (Public/Private)
- Search functionality to filter repositories
- Actions dropdown for each repository:
  - **Remove Repository** - Disconnect from Mergewise
  - **View All Reviews** - Navigate to repository's review history

**Add New Repository**
- Install GitHub App button to connect new repositories
- Automatic sync when repositories are added to GitHub App installation

<!-- ![Repositories Page](./docs/assets/repositories.png) -->

#### Repository Details (`/dashboard/repositories/[repoId]`)
View all reviews for a specific repository:

**Reviews Table**
- PR Title (with hover preview for long titles)
- PR Number (linked to GitHub)
- PR Status (Open/Closed badge)
- Review Status (Pending/Running/Completed/Failed)
- Timestamp of review creation
- Actions button to view full review

**Search & Filter**
- Search reviews by PR title or number
- Real-time filtering

**Review Modal**
- Full AI-generated review content
- Markdown rendering with GitHub Flavored Markdown
- Scrollable for long reviews
- Direct link to GitHub PR

<!-- ![Repository Reviews](./docs/assets/repo-reviews.png) -->

#### Pricing (`/dashboard/pricing`)
- Three-tier pricing structure
- Feature comparison
- FAQ section
- Contact enterprise sales option

<!-- ![Pricing Page](./docs/assets/pricing.png) -->

### Dashboard Features

**Navigation**
- Collapsible sidebar with menu items
- Dashboard, Repositories, Pricing links
- Mobile-responsive design

**Real-time Updates**
- Statistics update when new reviews are processed
- Recent reviews widget refreshes automatically
- Status changes reflect immediately

**Loading States**
- Skeleton loaders for data fetching
- Corner loader component
- Empty states for no data scenarios

**Search Functionality**
- Search repositories by name
- Search reviews by PR title or number
- Instant filtering as you type

**Review Status Tracking**
- **Pending** - Review queued, waiting to be processed
- **Running** - AI is analyzing the PR
- **Completed** - Review successfully generated and posted to GitHub
- **Failed** - Review processing failed (shown with error notification)

**Repository Management**
- Add repositories via GitHub App installation
- Remove repositories from Mergewise
- Automatic repository sync when added to GitHub App
- Support for both public and private repositories
- Organization-level installations supported

### API & Actions

Mergewise uses tRPC for type-safe API communication between the frontend and backend.

**Dashboard Router**
- `getRepositories()` - Fetch all connected repositories
- `getStats()` - Get dashboard statistics (total repos, reviews, pending, running, completed, failed)
- `getRecentReviews()` - Get the 5 most recent reviews

**Repository Router**
- `get(id)` - Get repository details by ID
- `getReviews(id)` - Get all reviews for a specific repository

**GitHub Webhook Handlers**
- `installation.created` - Handle new GitHub App installations
- `installation_repositories.added` - Auto-add repositories when added to GitHub App
- `installation_repositories.removed` - Remove repositories when removed from GitHub App
- `pull_request.opened` - Queue AI review when a new PR is opened

### Data Model

**Users**
- `id` - Unique user identifier
- `name` - User's display name
- `email` - User's email address
- `created_at` - Account creation timestamp

**Accounts**
- GitHub OAuth account linking
- GitHub account ID and login

**Installations**
- `id` - Installation identifier
- `github_id` - GitHub installation ID
- `account_login` - Organization or user login
- `account_type` - Organization or User

**Repositories**
- `id` - Repository identifier
- `installation_id` - Link to GitHub App installation
- `github_id` - GitHub repository ID
- `name` - Repository name
- `owner` - Repository owner
- `full_name` - Full repository name (owner/repo)
- `visibility` - Public or Private

**Reviews**
- `id` - Review identifier
- `repository_id` - Link to repository
- `pr_number` - Pull request number
- `pr_title` - Pull request title
- `pr_url` - Direct link to GitHub PR
- `status` - pending, running, completed, or failed
- `result` - AI-generated review content (markdown)
- `created_at` - Review creation timestamp

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © 2025 Mergewise

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [OpenRouter](https://openrouter.ai)
