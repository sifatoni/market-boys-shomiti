# Community Savings Management System — Development Plan

# 1. Project Overview

## Project Type
Private community savings & accounting platform (Samity Management System)

## Primary Goal
Build a secure web application where:
- Admin manages all financial operations
- Members can monitor personal and community balances
- Deposits & withdrawals are tracked
- PDF invoices are generated automatically
- Email notifications are sent automatically

---

# 2. Recommended Tech Stack

# Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 | Frontend Framework |
| React | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| React Hook Form | Forms |
| Zod | Validation |
| TanStack Query | API State |
| Recharts | Charts & Analytics |

---

# Backend

| Technology | Purpose |
|---|---|
| NestJS | Backend Framework |
| TypeScript | Language |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Nodemailer / Resend | Email Service |
| PDFKit / Puppeteer | PDF Generation |

---

# DevOps & Hosting

| Service | Purpose |
|---|---|
| Vercel | Frontend Hosting |
| Railway | Backend Hosting |
| Railway PostgreSQL | Database |
| Cloudflare | DNS & Security |
| GitHub | Version Control |

---

# 3. Recommended Architecture

```text
Frontend (Next.js)
        ↓
REST API (NestJS)
        ↓
Prisma ORM
        ↓
PostgreSQL Database
        ↓
Email + PDF Services
```

---

# 4. Application Modules

# 4.1 Authentication Module

## Features

- Login
- Logout
- Forgot password
- Reset password
- JWT authentication
- Role-based authorization
- Session management

---

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | /auth/login |
| POST | /auth/logout |
| POST | /auth/forgot-password |
| POST | /auth/reset-password |
| GET | /auth/me |

---

# 4.2 User & Member Module

## Features

- Create members
- Edit members
- Disable members
- Search members
- Member profile management

---

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | /members |
| GET | /members |
| GET | /members/:id |
| PATCH | /members/:id |
| DELETE | /members/:id |

---

# 4.3 Deposit Module

## Features

- Add deposits
- Partial payment support
- Multiple month support
- Deposit history
- Payment method tracking
- Invoice generation

---

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | /deposits |
| GET | /deposits |
| GET | /deposits/:id |
| PATCH | /deposits/:id |
| DELETE | /deposits/:id |

---

# 4.4 Withdrawal Module

## Features

- Member withdrawals
- Expense withdrawals
- Adjustment entries
- Withdrawal history

---

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | /withdrawals |
| GET | /withdrawals |
| GET | /withdrawals/:id |

---

# 4.5 Invoice Module

## Features

- Generate PDF invoice
- Download invoice
- Email invoice
- Resend invoice

---

## API Endpoints

| Method | Endpoint |
|---|---|
| GET | /invoices/:id |
| POST | /invoices/send/:id |

---

# 4.6 Dashboard Module

# Admin Dashboard Features

- Total balance
- Total deposits
- Total withdrawals
- Pending dues
- Overdue members
- Monthly statistics

---

# Member Dashboard Features

- Personal balance
- Personal history
- Due amount
- Invoice downloads

---

# 4.7 Reports Module

## Features

- Member reports
- Financial summaries
- Closing reports
- PDF export
- Excel export

---

# 5. Database Design

# Users Table

| Field | Type |
|---|---|
| id | UUID |
| name | String |
| email | String |
| password | String |
| role | Enum |
| status | Boolean |
| createdAt | DateTime |

---

# Members Table

| Field | Type |
|---|---|
| id | UUID |
| userId | UUID |
| phone | String |
| address | String |
| joinDate | Date |

---

# Deposits Table

| Field | Type |
|---|---|
| id | UUID |
| memberId | UUID |
| amount | Decimal |
| paymentMethod | String |
| depositMonth | String |
| paymentDate | Date |
| notes | Text |
| invoiceNo | String |

---

# Withdrawals Table

| Field | Type |
|---|---|
| id | UUID |
| memberId | UUID |
| amount | Decimal |
| category | String |
| reason | String |
| withdrawalDate | Date |

---

# DueRecords Table

| Field | Type |
|---|---|
| id | UUID |
| memberId | UUID |
| expectedAmount | Decimal |
| paidAmount | Decimal |
| status | Enum |

---

# 6. Authentication & Security

# Security Features

- Password hashing with bcrypt
- JWT authentication
- Refresh token support
- API guards
- Rate limiting
- Helmet.js security headers
- HTTPS enforcement
- CSRF protection
- Input validation
- SQL injection prevention

---

# Role Permissions

## Admin
Can:
- Create/edit/delete transactions
- Create members
- Access all reports

## Member
Can:
- View own data
- Download invoices
- View dashboard

---

# 7. Frontend Structure

# Recommended Folder Structure

```text
src/
├── app/
├── components/
├── modules/
├── services/
├── hooks/
├── utils/
├── lib/
├── types/
├── store/
└── styles/
```

---

# Key Pages

## Public Pages

- Login
- Forgot Password
- Reset Password

---

## Admin Pages

- Dashboard
- Members
- Add Deposit
- Withdrawals
- Reports
- Settings

---

## Member Pages

- Dashboard
- Transactions
- Invoices
- Profile

---

# 8. Backend Structure

# Recommended Folder Structure

```text
src/
├── auth/
├── users/
├── members/
├── deposits/
├── withdrawals/
├── invoices/
├── reports/
├── common/
├── prisma/
└── config/
```

---

# 9. Invoice Generation Plan

# PDF Invoice Features

Invoice should include:
- Samity name
- Member info
- Payment details
- Invoice number
- QR/reference code
- Authorized footer

---

# PDF Generation Flow

```text
Deposit Added
      ↓
Generate Invoice Number
      ↓
Create PDF
      ↓
Store PDF
      ↓
Email PDF
```

---

# 10. Email System Plan

# Email Templates

## Templates Required

- Deposit confirmation
- Withdrawal notice
- Password reset
- Reminder email
- Account closing notice

---

# Email Provider Recommendation

## Recommended
- Resend

## Alternative
- Brevo

---

# 11. Due Tracking Logic

# Due Calculation Rules

## Status Types

| Status | Logic |
|---|---|
| Paid | Fully paid |
| Partial | Partial amount paid |
| Due | No payment |
| Overdue | Payment deadline passed |

---

# Suggested Monthly Flow

```text
Month Starts
      ↓
System Creates Due Records
      ↓
Admin Adds Payments
      ↓
System Updates Due Status
      ↓
Reminder Sent if Unpaid
```

---

# 12. Reporting System

# Reports Required

## Admin Reports

- Full financial summary
- Member statement
- Due report
- Closing report

---

# Export Formats

- PDF
- CSV
- Excel

---

# 13. UI/UX Development Plan

# Design Principles

- Minimal UI
- Fast accounting workflow
- Mobile-first responsive design
- Easy navigation
- Financial clarity

---

# Important UX Features

## Quick Deposit Entry
Admin should complete deposit entry within 5–10 seconds.

---

## Smart Tables

Features:
- Search
- Filter
- Pagination
- Sort
- Export

---

# Dashboard Widgets

- Total Balance Card
- Due Summary
- Deposit Trend Chart
- Recent Transactions

---

# 14. Development Phases

# Phase 1 — Project Setup

## Tasks

- Setup repositories
- Setup frontend
- Setup backend
- Configure database
- Configure Prisma
- Configure auth

---

# Phase 2 — Core Backend Development

## Tasks

- Authentication APIs
- Member APIs
- Deposit APIs
- Withdrawal APIs
- Invoice APIs

---

# Phase 3 — Frontend Development

## Tasks

- Admin dashboard
- Member dashboard
- Tables
- Forms
- Authentication pages

---

# Phase 4 — Invoice & Email System

## Tasks

- PDF generation
- Email templates
- Invoice storage
- Email sending

---

# Phase 5 — Reporting & Analytics

## Tasks

- Reports
- Charts
- Export systems

---

# Phase 6 — Testing & Security

## Tasks

- API testing
- Validation testing
- Permission testing
- Security testing
- Mobile responsiveness

---

# Phase 7 — Deployment

## Tasks

- Deploy frontend
- Deploy backend
- Configure SSL
- Configure domain
- Setup backups

---

# 15. Estimated Development Timeline

| Phase | Estimated Time |
|---|---|
| Setup | 1–2 Days |
| Backend APIs | 4–6 Days |
| Frontend UI | 5–7 Days |
| Invoice & Email | 2–3 Days |
| Reports & Analytics | 2–3 Days |
| Testing & Bug Fix | 3–4 Days |
| Deployment | 1 Day |

---

# Total Estimated Time

## MVP
Approximately:
### 18–25 Days

---

# 16. Recommended Development Order

## Priority Order

1. Authentication
2. Database
3. Member module
4. Deposit module
5. Dashboard
6. Invoice system
7. Reports
8. Email system
9. Testing
10. Deployment

---

# 17. Recommended Future Features

# Phase 2 Features

- Mobile app
- Push notifications
- WhatsApp integration
- Multi-admin support
- Multi-samity support
- Payment gateway integration
- AI financial insights

---

# 18. Final Technical Recommendations

# Recommended Backend Pattern

Use:
- Modular architecture
- Service-based logic
- Repository pattern
- DTO validation
- Centralized error handling

---

# Recommended Frontend Pattern

Use:
- Feature-based architecture
- Reusable components
- Centralized API layer
- Typed forms
- Shared UI library

---

# 19. Scalability Recommendations

Even though current members are only 7–10:
- Build scalable architecture from day one
- Keep database normalized
- Use proper indexing
- Separate services cleanly

This will allow:
- Future mobile apps
- Larger member counts
- Multi-samity support

---

# 20. Final Recommendation

## Best Development Strategy

Build:
- Web-first application
- Responsive design
- API-first backend
- Modular architecture

This will provide:
- Fast development
- Easy maintenance
- Future scalability
- Lower operational cost

---

# 21. Suggested Git Branch Strategy

```text
main
develop
feature/auth
feature/members
feature/deposits
feature/invoices
feature/reports
```

---

# 22. Recommended Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_API_URL=
```

---

# 23. Final Deployment Architecture

```text
User Browser
      ↓
Vercel Frontend
      ↓
NestJS Backend API
      ↓
PostgreSQL Database
      ↓
Email & PDF Services
```
