# Interview walkthrough

Use this as a map for explaining the implementation. Read the corresponding Java or Angular class and be ready to trace a request through it.

## One-minute overview

This is a role-based task management system built with Angular 13, Spring Boot 3, and MySQL 8. Angular handles navigation and user feedback. Spring Security verifies a stateless JWT on each protected request. Controllers validate the request and delegate to services; services enforce ownership and team rules before repositories access MySQL. DTOs form the API contract so persistence entities are not serialized directly.

## Request flow

1. `POST /api/auth/login` finds an active account by email and compares the supplied password with its BCrypt hash.
2. On success, `JwtService` signs a token containing the email subject, role, and user ID. The API returns the token and basic profile data.
3. `AuthInterceptor` attaches `Authorization: Bearer ...` to API requests. It logs the user out after a 401 or when the token expiration time has passed.
4. `JwtAuthenticationFilter` validates the signature and expiry, reloads the active user, and places that user and `ROLE_*` authority in Spring's security context.
5. `@PreAuthorize` checks role rules. The service then checks record ownership and team membership. The repository query also scopes list and dashboard results.

## Authorization examples

- Admin may manage accounts and see all tasks. Admin deletes are soft deletes for users so existing task foreign keys remain valid.
- A manager may create a task only for an active employee whose `manager_id` is the manager's own ID. The task list/report also requires both `assigned_by` and the employee team relationship to match that manager.
- An employee's task query is forced to their own user ID, ignoring any attempt to request another assignee. The task status endpoint repeats the owner check before writing.
- `@PreAuthorize` is a first boundary; the service-level scope check is necessary because authentication alone does not grant access to every record.

## Database model

`users.manager_id` is a self-reference for an employee's manager. Each task has two user references: `assigned_to` is the employee responsible for it, and `assigned_by` records the assigning account. The latter supports manager-specific views and reports. Foreign keys use `RESTRICT`, so related users are deactivated instead of physically removed.

## Status rule

Statuses move forward in the enum order `PENDING -> IN_PROGRESS -> DONE`. The service rejects backward moves and does not reopen a completed task. This rule is checked on the server, so changing the browser cannot bypass it.

## Layer map

- `controller/`: HTTP routes, role annotations, current-user binding.
- `dto/ApiDtos.java`: validated request and response shapes.
- `service/`: business rules, task scoping, dashboard counts, report data.
- `repository/`: Spring Data access and scoped JPQL queries.
- `domain/`: JPA entities and enums.
- `security/`: BCrypt configuration, JWT parsing/signing, stateless filter chain.
- `exception/`: consistent API validation and application error responses.
- `frontend/src/app/`: auth state, interceptor, route guard, dashboard, task and user screens.

## Demo sequence

1. Sign in as `admin@demo.com`; show workspace counts and user management.
2. Open tasks, filter by status/priority/assignee, create a task for an employee, and download the PDF report.
3. Sign out and sign in as `manager@demo.com`; show the team-only list and report, then try assigning to an employee outside the team if a second team has been created.
4. Sign out and sign in as `emp1@demo.com`; show only their tasks and advance one from pending to in progress to done.
5. In Postman, demonstrate that an employee's attempt to call an admin endpoint returns 403 and a request for another employee's task is denied.

## Useful implementation decisions to explain

- Why BCrypt: it stores a salted one-way password hash rather than recoverable plaintext.
- Why JWT: it supports stateless API authentication. Expiry limits how long a stolen token remains useful.
- Why DTOs: API changes can be made without exposing entity fields, passwords, or ORM relationships.
- Why soft-deactivate users: tasks preserve valid user references and historical attribution.
- Why scope in backend queries: frontend guards improve navigation but are not security controls.

## Before the live interview

- Set a unique production `JWT_SECRET`, point Angular at the live API, and turn off demo seeding after the sample accounts are created.
- Walk through one request from controller to service to repository, and explain exactly where the role and ownership checks run.
- Demonstrate the same access rule with a direct Postman request, not only by hiding a menu item.
