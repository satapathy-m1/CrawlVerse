# CrawlVerse

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg) ![Node](https://img.shields.io/badge/node-v18%2B-green) ![React](https://img.shields.io/badge/react-19.x-61DAFB) ![License](https://img.shields.io/badge/license-ISC-lightgrey) ![Status](https://img.shields.io/badge/status-active%20development-orange)

An AI-powered SEO analysis and keyword rank tracking platform for monitoring website performance in real-time.

---

## Table of Contents

- [Overview](#overview)
- [Current Status](#current-status)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Roadmap](#roadmap)

---

## Overview

CrawlVerse is a full-stack web platform that combines browser automation, AI analysis, and rank tracking to give SEO practitioners a single interface for auditing sites and monitoring keyword positions. It uses Playwright for deep page analysis, Google Gemini for AI-driven recommendations, and Browserbase for cloud browser infrastructure.

The project is under active development. The core analysis pipeline, authentication system, and keyword tracking module are functional. Features beyond v0.1.0 are planned and tracked in the [Roadmap](#roadmap) section.

---

## Current Status

**v0.1.0 — Core Platform**

### Authentication
- User registration with email validation and bcrypt password hashing
- JWT-based login with protected routes
- Role-based access control

### SEO Analysis
- On-demand website analysis via Playwright + Browserbase
- Multi-category scoring: SEO, Performance, Accessibility, Best Practices
- Issue detection with structured reporting
- AI-powered recommendations via Google Gemini API
- Visual reports with score gauges and charts

### Keyword Rank Tracking
- Add and manage keywords per domain
- Historical ranking data storage in MongoDB
- Rank detail views with trend data

### Frontend
- Dashboard with quick-launch analysis form and recent activity
- Analysis history page
- Dark/Light theme support
- Responsive layout (mobile, tablet, desktop)
- Toast notifications

---

## Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 19.2.5 | UI framework |
| Vite | 8.0.10 | Build tool |
| TypeScript | 6.0.3 | Type safety |
| React Router | 7.15.0 | Client-side routing |
| Tailwind CSS | 4.2.4 | Styling |
| Axios | 1.16.1 | HTTP client |
| Lucide React | 1.14.0 | Icons |
| React Hot Toast | 2.6.0 | Notifications |

### Backend

| Technology | Version | Role |
|---|---|---|
| Node.js + Express | 5.2.1 | Server framework |
| MongoDB + Mongoose | 9.6.2 | Database |
| jsonwebtoken | 9.0.3 | Authentication |
| bcrypt | 6.0.0 | Password hashing |
| Playwright Core | 1.60.0 | Web scraping |
| Browserbase SDK | 2.12.0 | Browser automation |

### External Services

- **Google Gemini API** — AI analysis and content recommendations
- **Browserbase** — Cloud browser infrastructure for scraping

---

## Project Structure

```
CrawlVerse/
├── client/                         # React frontend
│   └── src/
│       ├── components/             # Shared UI components
│       │   ├── AnalysesCard.tsx
│       │   ├── IssueCard.tsx
│       │   ├── Loading.tsx
│       │   ├── Navbar.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── ScoreGauge.tsx
│       │   └── home/
│       │       ├── Features.tsx
│       │       ├── Footer.tsx
│       │       ├── Hero.tsx
│       │       ├── HowItWorks.tsx
│       │       └── Pricing.tsx
│       ├── pages/
│       │   ├── Analyze.tsx
│       │   ├── Dashboard.tsx
│       │   ├── History.tsx
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   ├── RankDetail.tsx
│       │   ├── RankTracker.tsx
│       │   └── Report.tsx
│       ├── context/
│       │   ├── AppContext.tsx
│       │   └── ThemeContext.tsx
│       └── assets/
│
└── server/                         # Node.js backend
    ├── controllers/
    │   ├── authController.js
    │   └── rankController.js
    ├── models/
    │   ├── User.js
    │   └── keywordTracking.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── rankRoutes.js
    ├── services/
    │   ├── keywordTrackingService.js
    │   └── rankTrackerService.js
    ├── middlewares/
    │   └── auth.js
    ├── config/
    │   └── db.js
    └── server.js
```

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB v6+ (local or Atlas)
- Google Gemini API key
- Browserbase API key (optional for local development)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/satapathy-m1/CrawlVerse.git
cd CrawlVerse

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

---

## Configuration

### `server/.env`

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/crawlverse

JWT_SECRET=<min_32_char_secret>
JWT_EXPIRE=7d

GEMINI_API_KEY=<your_gemini_api_key>
BROWSERBASE_API_KEY=<your_browserbase_key>

CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=<your_gemini_api_key>
```

---

## Running the Application

### Development

```bash
# Terminal 1 — backend (runs on http://localhost:5000)
cd server && npm run server

# Terminal 2 — frontend (runs on http://localhost:5173)
cd client && npm run dev
```

### Production

```bash
# Build frontend
cd client && npm run build

# Start backend
cd server && npm start
```

### Lint

```bash
cd client && npm run lint
```

---

## API Reference

### Authentication

```
POST /api/auth/register
Body: { name, email, password }

POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

### Rank Tracking

All rank endpoints require `Authorization: Bearer <token>`.

```
POST   /api/rank/add              — Add a keyword to track
                                    Body: { keyword, url }

GET    /api/rank/keywords         — List tracked keywords for the user

GET    /api/rank/rankings/:id     — Get ranking history for a keyword

POST   /api/rank/analyze          — Run an SEO analysis
                                    Body: { url }
```

---

## Architecture

### Request Flow

```
Client → API Route → Auth Middleware → Controller → Service → MongoDB
                                                         ↓
                                               Playwright / Gemini API
```

### Design Decisions

- **MVC on the backend** — controllers, services, and models are strictly separated to keep crawling logic decoupled from route handling.
- **Context API on the frontend** — `AppContext` manages auth state; `ThemeContext` manages theme. No external state library at this stage.
- **Services layer** — `keywordTrackingService` and `rankTrackerService` encapsulate all scraping and analysis logic, keeping controllers thin.

---

## Roadmap

The items below represent planned work. Nothing in this section is implemented yet.


- Automated scheduled rank checks (daily/weekly cron)
- Rank change alerts via email
- Batch keyword import (CSV)
- Competitor keyword monitoring

---

## License

ISC License. See [LICENSE](./client/LICENSE.md) for details.
