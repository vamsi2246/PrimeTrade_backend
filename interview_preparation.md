# SecureTask Pro - Comprehensive Interview Preparation Guide

This guide is structured to help you prepare for technical assessments and interviews based on the SecureTask Pro codebase.

---

## 1. Architecture Explanation
SecureTask Pro is engineered using a **decoupled layered architecture** utilizing the **Repository-Service Pattern**:
- **Routing & Interceptors**: Express routers parse route parameters and hand them to controllers.
- **Controllers**: Act as thin HTTP adapters. They read request payloads, invoke business services, and output structured JSON responses using the `successResponse` helper.
- **Services**: Contain all business calculations, transactional logic, and user access validation.
- **Repositories**: Abstract database querying operations. Services only interface with repositories, completely hiding Mongoose query logic. This separation allows changing database drivers without modifying service or controller layers.

---

## 2. Folder Structure Explanation
- `/config`: Central configuration setups (MongoDB connection pool, Winston logging levels, Redis statuses).
- `/constants`: Global domain constraints (Roles, Task status, priority) to prevent string typos.
- `/models`: Mongoose database schemas defining document structures.
- `/repositories`: Concrete database operation implementations.
- `/services`: Core business transactional algorithms.
- `/controllers`: HTTP mapping layer interfacing with Express.
- `/middlewares`: Pipeline request interceptors (guards, validations, rate limiting).
- `/validators`: validation schemas using express-validator.
- `/utils`: Common helper utilities (error objects, standard JSON wrappers).
- `/docs`: OpenAPI Swagger documentation specs.

---

## 3. JWT Authentication Flow
We implement a **State-Free Access Token & Cookie-Based Rotation Refresh Token** pattern:
- **Authentication**: On registering or logging in, the server generates a short-lived Access Token (15m) returned in the JSON payload, and a long-lived Refresh Token (7d) saved in a secure HTTP-Only SameSite cookie.
- **API Access**: The client adds the Access Token in the request headers: `Authorization: Bearer <token>`.
- **Automatic Session Refresh**: If a call fails with `401 Unauthorized`, the Axios interceptor queues subsequent requests and calls `/auth/refresh`. The server reads the secure cookie, verifies its signature, generates a new access token, rotates the refresh token cookie, and the client retries the queued requests.
- **Logout**: Clears the cookie on the client side and logs the logout event.

---

## 4. Request Lifecycle
Here is the step-by-step path of a request:

```
Client Request (e.g., PUT /api/v1/tasks/:id)
  │
  ├──► Helmet (HTTP header protection)
  ├──► CORS (Origin checking)
  ├──► Morgan (Logs HTTP request parameters)
  ├──► Rate Limiter (IP frequency check)
  │
  ├──► Auth Middleware (Decodes JWT, confirms user exists)
  ├──► Role Middleware (RBAC validation)
  ├──► Validator Middleware (Express-Validator checks fields)
  │
  ├──► Controller (Parses params, triggers Service)
  ├──► Service (Checks permissions, executes business rules)
  ├──► Repository (Issues query to Mongoose)
  ├──► Database (Executes transaction)
  │
  └──► Response (Formulated via successResponse/errorResponse)
```

---

## 5. Middleware Flow
Our middleware pipeline is structured to execute sequentially:
1. **Security Guards**: Helmet, CORS, and Rate Limiter reject malicious queries early.
2. **Logging Interceptors**: Morgan formats and pipes request traffic logs into Winston.
3. **Session Authenticator**: Auth middleware decodes the JWT and populates `req.user`.
4. **Access Checkers**: Role middleware restricts route access by role.
5. **Input Validator**: Combines express-validator rules, returning a `ValidationError` early if fields are malformed.
6. **Exception Handlers**: The global error handler converts thrown exceptions into standardized JSON outputs.

---

## 6. Database Design Explanation
The database schema consists of three collections:
- **User**: Stores profile credentials. Implements a unique index on `email` and automatic password hashing via pre-save hooks.
- **Task**: Includes fields for status, priority, and timestamps. Implements compound indexes on `{ createdBy: 1, isDeleted: 1, createdAt: -1 }` to optimize task listings, and soft-deletes tasks using `isDeleted: true`.
- **AuditLog**: Stores chronological logs of system operations.

---

## 7. Why the Service Layer Was Used
The Service Layer decouples business rules from the transport layer (HTTP/Express) and the persistence layer (Database). If we want to support a CLI or WebSockets in the future, we can invoke the exact same Service methods, ensuring reuse and preventing duplicate logic.

---

## 8. Why MongoDB Was Chosen
MongoDB is a document store that allows dynamic, flexible JSON documents. This is perfect for task models, which often expand to include properties like subtask checklists, dynamic comments, or file attachments, avoiding blocking table migrations.

---

## 9. Why JWT Was Chosen
JSON Web Tokens enable stateless authentication. Since the server decodes the signature key locally, it does not need to query a session database on every request, reducing server-side lookups.

---

## 10. Security Practices
- **Password Hashing**: Bcrypt with 10 salt rounds.
- **NoSQL Injection Guard**: Mongoose schema casting rejects invalid inputs early.
- **XSS Protection**: Secure, HTTP-Only cookies prevent Javascript scripts from accessing refresh tokens.
- **CSRF Protection**: Cookie `sameSite` configuration restricts cookie delivery to verified origins.
- **Rate Limiting**: Limits IP request frequency to prevent brute force attacks.

---

## 11. Scalability Improvements
For heavy application traffic:
1. **Database Read Replicas**: Direct query reads to replica sets and writes to primary nodes.
2. **Redis Caching**: Cache common task read queries in Redis.
3. **Microservices Migration**: Decouple Auth, Task, and AuditLog into separate services communicating over a message broker (e.g. RabbitMQ).

---

## 12. Common HR and Technical Questions

### Q: "Tell me about a challenging bug you fixed in this project."
**A**: When implementing the token refresh flow, parallel API requests from a page load would trigger multiple concurrent refresh requests, causing token invalidation. I resolved this by adding a request queue (`failedQueue`) in the Axios interceptor. When a refresh begins, subsequent requests are queued and resolved once the new token is acquired.

### Q: "What is your approach to handling database query optimizations?"
**A**: I identify high-frequency queries and create targeted indexes. For example, since tasks are queried by user and sorted by date, I created a compound index on `{ createdBy: 1, isDeleted: 1, createdAt: -1 }` to enable index-only scans.

---

## 13. Backend Interview Questions Based on this Project

### Q: "How does the global error handler map Mongoose errors?"
**A**: The [error.middleware.js](file:///Users/apple/Desktop/PrimeTrade_backend/backend/src/middlewares/error.middleware.js) checks error names. If it catches a `ValidationError`, it parses validation messages into a flat array. For duplicate email attempts, it parses Mongo error code `11000` into a `409 Conflict` response.

### Q: "Why do we throw a ForbiddenError instead of just returning a NotFoundError?"
**A**: Standard users should get a `ForbiddenError` (403) if they attempt to modify tasks owned by other users. This distinguishes authorization boundaries from cases where a task truly does not exist.

---

## 14. Explanation of Important Files
- [app.js](file:///Users/apple/Desktop/PrimeTrade_backend/backend/src/app.js): Configures Express middleware, security headers, request parsers, and mounts API routes.
- [server.js](file:///Users/apple/Desktop/PrimeTrade_backend/backend/src/server.js): Server entry point. Establishes DB/Redis connections and handles graceful shutdowns.
- [auth.middleware.js](file:///Users/apple/Desktop/PrimeTrade_backend/backend/src/middlewares/auth.middleware.js): Verifies JWT signatures and populates user info.
- [errors.js](file:///Users/apple/Desktop/PrimeTrade_backend/backend/src/utils/errors.js): Defines custom error objects extending `Error` (e.g. `ValidationError`, `ForbiddenError`).

---

## 15. Explanation of API Endpoints
- `POST /auth/login`: Verifies user credentials, sets refresh cookie, and returns the access token.
- `GET /tasks`: Retrieves task lists matching query parameters (`search`, `status`, `priority`, `page`, `limit`).
- `PUT /tasks/:id`: Edits a task, confirming the requesting user owns the task.
- `GET /audit`: Returns system activity log records (Admin only).
