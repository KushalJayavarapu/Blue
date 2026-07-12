# Schema Design & Architecture Plan

Based on the provided technology stack requirements, here is the reliability-first architectural plan for our schema and application layers:

## 1. Frontend
*   **Choice:** React (Vite) + Tailwind CSS
*   **Why (Reliability-First):** Clean, responsive, componentized UI; parallel work across screens without CSS conflicts.

## 2. Backend Language
*   **Choice:** TypeScript
*   **Why (Reliability-First):** Compile-time type checking catches mismatches before runtime — fewer live bugs during demo/judging, directly supports "debugging skills" and "logic" criteria.

## 3. Backend Framework
*   **Choice:** Express
*   **Why (Reliability-First):** Lightweight REST API; fast to scaffold without sacrificing structure.

## 4. ORM (Object-Relational Mapping)
*   **Choice:** Prisma
*   **Why (Reliability-First):** Auto-parameterized queries (prevents SQL injection by construction); versioned migrations = reviewable, disciplined database design.

## 5. Validation
*   **Choice:** Zod (shared schema, frontend + backend)
*   **Why (Reliability-First):** One source of truth per entity — structurally prevents frontend/backend validation drift; directly satisfies "validate input robustly".

---

## Proposed Database Schema (SQLite / Prisma)

Based on the provided EcoSphere UI mockups (Settings, Reports, Gamification, Governance, Environmental, Social), here is the proposed entity relationship and Prisma schema layout.

### Entities Identified:
1. **Department:** Tracks organization structure (Name, Code, Head, Parent, Status).
2. **User (Employee):** Tracks employees, their departments, accumulated XP, and roles.
3. **Environmental Goal:** Tracks emission goals per department (Target, Current, Deadline, Status).
4. **Social / CSR Activity:** Tracks activities like Tree Plantation, Blood Donation, and if evidence is required.
5. **Challenge:** Gamification challenges with difficulty, XP rewards, and deadlines.
6. **Participation (Approval Queue):** Tracks when a user joins a CSR activity or Challenge, stores proof (file/image), and approval status.
7. **Audit:** Governance audits tracking findings and status.
8. **Compliance Issue:** Issues raised from audits with severity and status.
9. **Badge:** Gamification badges awarded to users.

### Prisma Schema (`schema.prisma` draft):

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Department {
  id               String   @id @default(uuid())
  name             String
  code             String   @unique
  headName         String   // Or could be a relation to User
  status           String   @default("Active") // Active, Inactive
  
  // Self-relation for parent/child departments
  parentId         String?
  parent           Department?  @relation("DepartmentToDepartment", fields: [parentId], references: [id])
  children         Department[] @relation("DepartmentToDepartment")

  users            User[]
  goals            EnvironmentalGoal[]
  audits           Audit[]
  complianceIssues ComplianceIssue[]
}

model User {
  id           String   @id @default(uuid())
  name         String
  xp           Int      @default(0)
  
  departmentId String?
  department   Department? @relation(fields: [departmentId], references: [id])

  participations Participation[]
  auditsConducted Audit[]        @relation("Auditor")
  badges          UserBadge[]
}

model EnvironmentalGoal {
  id           String   @id @default(uuid())
  name         String
  targetCo2    Float
  currentCo2   Float    @default(0)
  deadline     DateTime
  status       String   // Active, On Track, Completed

  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
}

model CsrActivity {
  id               String   @id @default(uuid())
  name             String
  evidenceRequired Boolean  @default(true)
  status           String   @default("Open") // Open, Closed

  participations   Participation[]
}

model Challenge {
  id           String   @id @default(uuid())
  name         String
  xpReward     Int
  difficulty   String   // Easy, Medium, Hard
  deadline     DateTime
  status       String   // Draft, Active, Under Review, Completed, Archived

  participations Participation[]
}

model Participation {
  id           String   @id @default(uuid())
  proofUrl     String?  // photo.jpg, cert.pdf
  points       Int      @default(0)
  status       String   @default("Pending") // Pending, Approved, Rejected
  
  userId       String
  user         User     @relation(fields: [userId], references: [id])

  // Can be either an activity or a challenge
  activityId   String?
  activity     CsrActivity? @relation(fields: [activityId], references: [id])
  
  challengeId  String?
  challenge    Challenge?   @relation(fields: [challengeId], references: [id])
}

model Audit {
  id           String   @id @default(uuid())
  title        String
  date         DateTime
  findings     String
  status       String   // Completed, Under Review

  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])

  auditorId    String
  auditor      User       @relation("Auditor", fields: [auditorId], references: [id])
}

model ComplianceIssue {
  id           String   @id @default(uuid())
  issue        String
  severity     String   // High, Medium, Low
  status       String   // Open, Resolved

  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
}

model Badge {
  id          String   @id @default(uuid())
  name        String
  icon        String?

  users       UserBadge[]
}

model UserBadge {
  userId      String
  badgeId     String
  user        User   @relation(fields: [userId], references: [id])
  badge       Badge  @relation(fields: [badgeId], references: [id])

  @@id([userId, badgeId])
}

model SystemSetting {
  id                                String   @id @default(uuid())
  enableAutoEmissionCalculation     Boolean  @default(false)
  requireEvidenceForCsr             Boolean  @default(true)
  autoAwardBadges                   Boolean  @default(true)
  emailAlertsForCompliance          Boolean  @default(true)
}
```

### Next Action:
If this schema looks good, the next step would be to initialize a backend folder (e.g., inside `Blue`), initialize Prisma, and generate the initial SQLite database migration based on this structure!
