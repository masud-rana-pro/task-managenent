# System diagrams

These Mermaid diagrams are the source format for the required UML Use Case, UML Class, and ER diagrams. GitHub renders them in this file.

## Use Case Diagram

```mermaid
flowchart LR
  Admin([Admin]) --> U[Manage users]
  Admin --> A[View all tasks]
  Admin --> R[Download all task report]
  Admin --> C[Create and manage tasks]
  Manager([Manager]) --> MT[Assign tasks to own team]
  Manager --> MV[View own assigned team tasks]
  Manager --> MR[Download own team report]
  Employee([Employee]) --> ET[View own tasks]
  Employee --> ST[Advance own task status]
  Auth[All roles] --> Login[Login with email and password]
  Auth --> Dash[View role-specific dashboard]
```

## Class Diagram

```mermaid
classDiagram
 class User {
  +Long id
  +String fullName
  +String email
  +String passwordHash
  +Role role
  +Boolean active
  +Long managerId
 }
 class TaskItem {
  +Long id
  +String title
  +String description
  +TaskStatus status
  +Priority priority
  +LocalDate deadline
  +Long assignedToId
  +Long assignedById
 }
 class AuthController
 class UserController
 class TaskController
 class DashboardController
 class ReportController
 class UserService
 class TaskService
 class DashboardService
 class UserRepository
 class TaskRepository
 User "1" --> "0..*" User : manages
 User "1" --> "0..*" TaskItem : assigned to
 User "1" --> "0..*" TaskItem : assigned by
 AuthController --> UserService
 UserController --> UserService
 TaskController --> TaskService
 DashboardController --> DashboardService
 ReportController --> TaskService
 UserService --> UserRepository
 TaskService --> TaskRepository
```

## ER Diagram

```mermaid
erDiagram
 USERS ||--o{ USERS : manages
 USERS ||--o{ TASKS : assigned_to
 USERS ||--o{ TASKS : assigned_by
 USERS {
  BIGINT id PK
  VARCHAR full_name
  VARCHAR email UK
  VARCHAR password
  ENUM role
  BIGINT manager_id FK
  DATETIME created_at
  BOOLEAN active
 }
 TASKS {
  BIGINT id PK
  VARCHAR title
  TEXT description
  ENUM status
  ENUM priority
  DATE deadline
  BIGINT assigned_to FK
  BIGINT assigned_by FK
  DATETIME created_at
  DATETIME updated_at
 }
```
