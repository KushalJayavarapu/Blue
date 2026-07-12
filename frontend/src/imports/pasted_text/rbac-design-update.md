Update the existing "EcoSphere – ESG Management Platform" design to support Role-Based Access Control (RBAC) within the SAME application.

Do NOT create separate applications or separate design files.

The application should dynamically adapt its interface based on the logged-in user's role.

There are only two primary roles:

1. Employee
2. Manager/Admin

The overall layout, branding, navigation, and design language should remain identical. Only navigation visibility, actions, permissions, and data displayed should change.

========================================
ROLE SWITCHING
========================================

Design a prototype flow where login credentials determine the user's role.

Example:

Employee Login
→ Employee Dashboard

Manager/Admin Login
→ Admin Dashboard

Include a prototype variable or role toggle to demonstrate switching between both experiences.

========================================
COMMON LAYOUT
========================================

Maintain the same:

• Sidebar
• Top Navigation
• Search
• Notifications
• User Profile
• Theme
• Organization Selector

Do not duplicate layouts.

Instead dynamically:

• Hide modules
• Disable actions
• Replace editable components with read-only views
• Show role-specific CTAs

========================================
EMPLOYEE EXPERIENCE
========================================

Dashboard

Display:

• Personal ESG Score
• XP
• Points
• Earned Badges
• Joined Challenges
• Joined CSR Activities
• Recent Personal Activity
• Reward Balance

Do NOT display:

• Organization KPIs
• Department Rankings
• Compliance Analytics
• Company Reports

----------------------------------------

CSR Activities

Employee can:

• View Activities
• Join Activity
• Upload Evidence
• Track Approval Status

Employee CANNOT:

• Create Activity
• Edit Activity
• Delete Activity
• Approve Participation

Hide all admin action buttons.

----------------------------------------

Challenges

Employee can:

• Browse Challenges
• Join Challenge
• Upload Completion Proof
• View Progress

Employee cannot:

• Create Challenge
• Archive Challenge
• Manage Challenge Status

----------------------------------------

Participation

Display:

"My Participation"

Columns:

• Activity
• Status
• Submitted On
• Proof
• Points Earned

No approval buttons.

----------------------------------------

Environmental Goals

Read-only.

Hide:

New Goal

Edit

Delete

Only allow viewing goal progress.

----------------------------------------

Reports

Only show:

"My ESG Summary"

Hide:

Export

Custom Report Builder

Advanced Filters

----------------------------------------

Rewards

Employee can:

Redeem Rewards

View Reward History

View Available Points

Cannot:

Manage Catalog

Manage Stock

========================================
MANAGER / ADMIN EXPERIENCE
========================================

Dashboard

Display:

• Organization ESG Score
• Environmental Score
• Social Score
• Governance Score
• Department Rankings
• Carbon Trends
• Recent Company Activity
• Compliance Alerts
• Pending Approvals

Quick Actions:

Log Carbon Data

Create Goal

Create Challenge

Generate Reports

----------------------------------------

Environmental

Full CRUD

Show:

New Goal

Edit

Delete

Export

Carbon Transactions

Emission Factors

----------------------------------------

CSR Activities

Show:

New Activity

Edit

Delete

Participation Queue

Approve

Reject

Bulk Approval

----------------------------------------

Challenges

Full Management

Manager can:

Create

Edit

Delete

Archive

Activate

Review Participation

Award XP

----------------------------------------

Governance

Full CRUD

Policies

Audits

Compliance Issues

Assign Owners

Set Due Dates

----------------------------------------

Reports

Show:

Environmental Report

Social Report

Governance Report

ESG Summary

Custom Report Builder

Export:

PDF

Excel

CSV

----------------------------------------

Settings

Visible only to Manager/Admin.

Include:

Departments

Categories

ESG Configuration

Notification Settings

Feature Toggles

========================================
ROLE INDICATORS
========================================

Display the logged-in role inside the profile dropdown.

Examples:

👤 Employee

🛡 ESG Manager

👑 Administrator

========================================
ROLE-BASED UI PATTERNS
========================================

Instead of removing entire pages when appropriate:

• Replace edit buttons with disabled states
• Display "View Only" badges
• Hide destructive actions
• Replace forms with information cards
• Replace approval queues with personal history

Use subtle permission indicators.

========================================
DESIGN REQUIREMENTS
========================================

The application should feel like a single enterprise SaaS platform where permissions dynamically change based on authentication.

Maintain:

• Component consistency
• Auto Layout
• Design System
• Reusable Components
• Responsive Desktop Layout

Avoid creating duplicate screens unless necessary.

Instead, create reusable components with role-based variants.

========================================
PROTOTYPE
========================================

Create interactive prototype flows showing:

Employee Login
→ Employee Dashboard

Manager Login
→ Manager Dashboard

Demonstrate how navigation, buttons, tables, forms, dashboards, and actions adapt automatically based on the authenticated user's role while preserving the same overall application experience.

The final result should demonstrate a professional enterprise RBAC implementation similar to Jira, GitHub Enterprise, Salesforce, Microsoft Dynamics, or Odoo, where one application serves multiple user roles through permission-based UI rendering.