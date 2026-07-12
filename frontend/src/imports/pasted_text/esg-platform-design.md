Design a modern enterprise SaaS web application called "EcoSphere – ESG Management Platform".

Style:
- Enterprise dashboard similar to Linear, Vercel, Atlassian, Odoo and Stripe Dashboard.
- Minimal, clean, premium.
- Dark mode only.
- Rounded cards (12px radius).
- Consistent spacing using an 8px grid.
- Responsive desktop-first design (1440px width).
- Soft shadows.
- Modern data visualization.
- Accessible color contrast.
- Professional typography (Inter).
- Smooth hover and active states.
- Glassmorphism should NOT be used.
- Focus on usability over visual complexity.

Primary Colors:
Environmental: Green
Social: Blue
Governance: Purple
Gamification: Orange
Reports: Gray
Settings: Slate

Create reusable design components for:
- Sidebar
- Top Navigation
- Cards
- KPI Cards
- Data Tables
- Charts
- Buttons
- Forms
- Inputs
- Dropdowns
- Modals
- Tabs
- Status Badges
- Progress Bars
- Toast Notifications
- Empty States
- Loading Skeletons
- Confirmation Dialogs

Application Layout:

Persistent Left Sidebar:
- Dashboard
- Environmental
- Social
- Governance
- Gamification
- Reports
- Settings

Persistent Top Navigation:
- Search Bar
- Notifications
- Theme Toggle
- User Profile
- Organization Selector

Create the following screens.

====================
1. Login
====================

Professional login page with:
- Company branding
- Email
- Password
- Remember Me
- Forgot Password
- Login button

====================
2. Dashboard
====================

Executive ESG Overview.

Top KPI Cards:
- Environmental Score
- Social Score
- Governance Score
- Overall ESG Score

Below KPIs:
- Carbon Emission Trend Line Chart
- Department ESG Ranking Bar Chart
- Recent Activity Feed
- Quick Action Panel

Quick Actions:
- Log Carbon Data
- Create Goal
- Start Challenge
- Generate Report

Department ESG Ranking Table

Recent Notifications

Upcoming Deadlines

====================
3. Environmental Module
====================

Tabs:
- Emission Factors
- Product ESG Profiles
- Carbon Transactions
- Environmental Goals

Environmental Goals screen:

Toolbar:
- New Goal
- Edit
- Delete
- Export
- Search

Goals Table:

Columns:
- Goal Name
- Department
- Target CO₂
- Current CO₂
- Progress
- Deadline
- Status
- Actions

Progress bars should animate.

Goal Details Drawer.

Carbon Transactions page:

Filters
Search
Date Picker

Transaction Table:
- Source
- Category
- Department
- Emission Factor
- Carbon Produced
- Timestamp

New Carbon Transaction modal.

====================
4. Social Module
====================

Tabs:
- CSR Activities
- Employee Participation
- Diversity Dashboard

CSR Activities page:

Activity Cards displaying:
- Image/Icon
- Title
- Description
- Participants
- Points
- Join Button

Participation Queue Table:
- Employee
- Activity
- Evidence
- Approval Status
- Approve
- Reject

Employee Profile Drawer.

====================
5. Governance Module
====================

Tabs:
- Policies
- Policy Acknowledgements
- Audits
- Compliance Issues

Audits Table:
- Audit
- Department
- Auditor
- Date
- Findings
- Status

Compliance Issues Table:
- Issue
- Severity
- Owner
- Due Date
- Status

Issue Details Drawer.

====================
6. Gamification Module
====================

Tabs:
- Challenges
- Challenge Participation
- Badges
- Rewards
- Leaderboard

Challenges Page:

Toolbar:
- New Challenge

Kanban Board:

Columns:
- Draft
- Active
- Under Review
- Completed
- Archived

Challenge Cards:
- XP
- Difficulty
- Deadline
- Join Button

Badge Gallery:
Modern badge cards.

Rewards Store:
Reward cards with redeem button.

Leaderboard:
Top Departments
Top Employees

====================
7. Reports Module
====================

Tabs:
- Environmental
- Social
- Governance
- ESG Summary
- Custom Builder

Report Cards:
- Environmental Report
- Social Report
- Governance Report
- ESG Summary

Each card has:
Generate button.

Custom Report Builder:

Filters:
- Date Range
- Department
- Module
- Employee
- Challenge
- ESG Category

Buttons:
Run Report
Export PDF
Export Excel
Export CSV

Preview Table below.

====================
8. Settings
====================

Tabs:
- Departments
- Categories
- ESG Configuration
- Notification Settings

Departments Table:
- Name
- Code
- Head
- Parent Department
- Employee Count
- Status

Configuration Toggles:
- Auto Emission Calculation
- Require Evidence
- Auto Award Badges
- Email Compliance Alerts

Notification Preferences page.

====================
Global Components
====================

Create reusable:
- Button Variants
- Inputs
- Selects
- Tables
- Charts
- Cards
- Empty States
- Error States
- Loading Skeletons
- Toasts
- Pagination
- Breadcrumbs
- Modals
- Drawers

====================
Interactions
====================

Prototype interactions:
- Sidebar navigation
- Tab switching
- Hover states
- Button press
- Table row selection
- Modal open/close
- Drawer slide
- Search interaction
- Filter dropdowns
- Notifications panel
- Responsive behavior

====================
Design Goal
====================

The UI should look like a real enterprise ESG management product suitable for Fortune 500 companies. Prioritize clarity, scalability, consistency, and professional aesthetics over decorative effects. Every screen should be developer-friendly for React implementation, using reusable components and Auto Layout throughout.