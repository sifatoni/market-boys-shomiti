# Community Savings Management System (Final Product Plan)

## 1. Project Summary

This project is a private web-based savings and accounting platform for a small community/group (“Samity”) where members contribute money monthly with flexible amounts.

The system will allow:

- Centralized accounting management
- Deposit & withdrawal tracking
- Automated invoice generation
- Email receipts
- Member self-service dashboard
- Transparent balance visibility
- Yearly or early account closing reports

The platform is designed for:
- Small groups (7–10 members initially)
- Low operational complexity
- High transparency
- Future mobile app scalability

---

# 2. Confirmed Business Rules

Based on your answers, the following business rules are finalized.

| Rule | Decision |
|---|---|
| Initial Members | 7–10 |
| Fixed Monthly Amount | No |
| Late Payments Allowed | Yes |
| Partial Payments Allowed | Yes |
| Profit Sharing | No |
| Bengali Language Support | Not Required |
| Mobile App Future Plan | Yes |
| Payment Gateway | Not Needed |
| Manual Payment Verification | Yes |
| PDF Invoice | Required |
| Members Can View Total Samity Balance | Yes |
| Members Can View Personal Balance | Yes |
| Account Closing Before Year-End | Allowed |

---

# 3. System Objectives

The platform should:

- Replace manual bookkeeping
- Maintain financial transparency
- Simplify monthly accounting
- Reduce human error
- Provide member trust through visibility
- Maintain secure admin-only financial control

---

# 4. User Roles

# 4.1 Master Admin (Primary Accountant)

Only one Master Admin initially.

## Admin Permissions

### User Management
- Create member accounts
- Edit member accounts
- Disable/activate accounts
- Reset passwords

### Financial Management
- Add deposits
- Add withdrawals
- Add adjustments
- Close accounts
- Generate reports

### System Management
- View all transactions
- View financial summary
- Generate/export PDFs
- Send invoices manually
- Resend invoices
- Manage system settings

---

# 4.2 Member

Members have restricted access.

## Member Permissions

- Login securely
- View personal balance
- View total samity balance
- View transaction history
- Download invoices
- View due status
- Receive email notifications

---

# 5. Financial Logic

# 5.1 Deposit System

Members may pay:
- Full amount
- Partial amount
- Late amount
- Multiple months together

---

## Example Scenarios

| Scenario | Allowed |
|---|---|
| Pay BDT 2,000 | Yes |
| Pay BDT 1,000 partial | Yes |
| Pay previous month later | Yes |
| Pay 3 months together | Yes |

---

# 5.2 Withdrawal Logic

Withdrawals can be:
- Member-specific
- General samity expense
- Emergency adjustments

---

## Withdrawal Categories

| Type | Description |
|---|---|
| Personal Withdrawal | Specific member |
| Operational Expense | Samity expense |
| Adjustment | Accounting correction |

---

# 5.3 Account Closing Logic

The system must support:

## Year-End Closing
OR
## Early Closing

---

## Closing Process

When accounts are closed:

### System Will:
- Freeze transactions
- Generate final statement
- Calculate final balances
- Archive transaction history
- Generate downloadable reports

---

# 6. Core Modules

# 6.1 Authentication Module

## Features

- Email/password login
- Password reset
- Session management
- JWT authentication
- Role-based access

---

# 6.2 Member Management Module

## Admin Can Create Members With:

| Field | Required |
|---|---|
| Full Name | Yes |
| Email | Yes |
| Phone Number | Yes |
| Address | Optional |
| Join Date | Yes |
| Initial Contribution Plan | Optional |
| Status | Yes |

---

# 6.3 Deposit Entry Module

This is the most important module.

---

## Deposit Workflow

```text
Admin Selects Member
        ↓
Enters Payment Details
        ↓
Chooses Payment Method
        ↓
Adds Deposit
        ↓
System Generates Invoice
        ↓
Email Sent Automatically
        ↓
Balance Updated
```

---

# 6.4 Due Tracking System

The system should intelligently track dues.

---

## Due Status Types

| Status | Meaning |
|---|---|
| Paid | Fully paid |
| Partial | Partial payment made |
| Due | No payment |
| Overdue | Late unpaid |

---

# 6.5 Invoice System

Every deposit generates:
- PDF invoice
- Email receipt
- Downloadable transaction copy

---

# 6.6 Email Notification System

## Automatic Emails

| Event | Trigger |
|---|---|
| Deposit Received | After deposit entry |
| Withdrawal Recorded | After withdrawal |
| Reminder Email | Monthly unpaid |
| Password Reset | User request |
| Account Closed | Closing process |

---

# 6.7 Dashboard Module

# Admin Dashboard

## Summary Cards

- Total Members
- Total Deposits
- Total Withdrawals
- Current Samity Balance
- Pending Dues
- Overdue Members

---

# Member Dashboard

## Member Can See

- Personal total deposit
- Personal withdrawals
- Current balance
- Due amount
- Total samity balance
- Recent transactions
- Download invoices

---

# 7. Suggested Technology Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui

## Backend
- NestJS
- Prisma ORM

## Database
- PostgreSQL

## Email Service
- Resend / Brevo

## Hosting
- Vercel + Railway

---

# 8. Security Requirements

- Password hashing
- Secure JWT auth
- Protected APIs
- Admin-only financial actions
- Activity logs
- Backup system
- HTTPS

---

# 9. UI/UX Direction

The UI should be:
- Extremely simple
- Fast to use
- Accountant-friendly
- Mobile responsive
- Clean & modern

---

# 10. Mobile App Future Plan

Recommended future stack:
- React Native

---

# 11. Development Phases

## Phase 1 — MVP

- Authentication
- Member management
- Deposit entry
- Withdrawal entry
- Invoice generation
- Email sending
- Member dashboard
- Due tracking
- Reports

---

## Phase 2 — Improvements

- SMS notifications
- WhatsApp notifications
- Mobile app
- Multi-admin support
- Advanced analytics

---

# 12. Final Recommendation

Recommended product type:
- Private web application
- Mobile responsive
- Admin-controlled accounting platform

---

# 13. Final Architecture Recommendation

```text
Frontend (Next.js)
        ↓
Secure Backend API (NestJS)
        ↓
PostgreSQL Database
        ↓
PDF & Email Services
```
