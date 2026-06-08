# SecureTask Pro - Refactored Interview Preparation Guide

This guide breaks down the technical details, architecture decisions, and interview concepts for SecureTask Pro.

---

## 1. Architectural Structure
SecureTask Pro uses a decoupled **monolithic architecture** structured around a classic 3-layer pattern:
1. **Routes & Middleware**: Intercepts HTTP calls, secures headers, validates parameters, and parses access tokens.
2. **Controllers**: Act as HTTP adapters. They extract payloads, forward data to services, and format standardized JSON outputs.
3. **Services**: Manage core business rules, transactional updates, permissions, and audit logs.
4. **Models (Mongoose)**: Directly handle database queries. Removing repository layers cuts down boilerplate code, making the codebase highly readable.

---

## 2. Database Design
The schema is modeled in MongoDB using three collections:
- **User**: Stores profile credentials. Implements a unique index on `email` and automatic password hashing via pre-save hooks.
- **Task**: Includes a soft-deletion flag `isDeleted: true` to preserve historic records. Has compound indexes on `{ createdBy: 1, isDeleted: 1, createdAt: -1 }` for optimized user query sorting.
- **AuditLog**: Retains system operation audit trails.

---

## 3. JWT Flow & Token Rotation
- **Access Token (Short-Lived, 15m)**: Generated on login and sent in HTTP headers (`Authorization: Bearer <token>`).
- **Refresh Token (Long-Lived, 7d)**: Encrypted and stored in an **HTTP-Only, SameSite, Secure Cookie**.
- **Rotation**: On expiry of the access token, the client posts to `/auth/refresh`. The server decodes the cookie, validates the payload, and responds with a fresh access token and cookie-rotated refresh token.

---

## 4. Google OAuth2 Integration Flow
SecureTask Pro integrates **Google Identity Services (GSI)** for single sign-on:
1. **Frontend Consent**: The client loads the Google JS SDK. When a user logs in via Google, the SDK prompts the user and returns a signed **Google ID Token** (JWT) to our callback.
2. **Token Post**: The React app forwards this token to the backend endpoint: `POST /api/v1/auth/google`.
3. **Verification**: The Express backend uses `google-auth-library` to parse and verify Google's signature using public keys.
4. **User Sync**: The backend extracts `email` and `name` from Google's payload. If the user exists, we log them in. If they don't, we register them with a random password.
5. **App Session**: The server issues a local App Access Token and configures the Refresh cookie.

---

## 5. Middleware Pipeline
Requests flow through the following stack:
1. **Helmet**: Secures response HTTP headers.
2. **CORS**: Sets allowed origins.
3. **Morgan**: Stream logs requests through Winston.
4. **Rate Limiter**: Blocks IP brute force attempts.
5. **Auth Guard**: decodes access token and populates `req.user`.
6. **Role Guard**: Restricts admin routes.
7. **Validator**: Validates inputs using express-validator, passing validation errors to the error handler.
8. **Global Error Handler**: Formats exceptions into JSON responses.

---

## 6. Custom Error Classes
We created a clear hierarchy of HTTP errors:
- **`ApiError`**: Base error class carrying HTTP status codes.
- **`ValidationError`**: Triggered by express-validator failures (status `400`).
- **`AuthenticationError`**: Triggered by invalid credentials or expired sessions (status `401`).
- **`NotFoundError`**: Triggered when resources do not exist (status `404`).

---

## 7. Real-World Scaling Tactics
- **Redis Cache**: Speed up reads of frequently accessed tasks.
- **Microservices**: Decompose the monolith into separate services (e.g., Auth Service, Task Service, Audit Service) communicating over event brokers (RabbitMQ/Kafka) or gRPC.
- **Load Balancers (NGINX)**: Distribute incoming API traffic across clusters.
- **Kubernetes (K8s)**: Automatically scale backend containers under high load.

---

## 8. Common Technical Interview Q&As

### Q: "How do you verify Google OAuth tokens securely on your Node.js backend?"
**A**: We never trust tokens sent from the client blindly. We use Google's official `google-auth-library` and call `verifyIdToken()` passing the client token and the server's `GOOGLE_CLIENT_ID` as the audience. This validates the signature using Google's public certificates, checks token expiry, and ensures the token was indeed minted for our app.

### Q: "Why did you choose not to use the Repository Pattern?"
**A**: While the Repository Pattern is useful for abstracting database drivers, introducing it in small-to-medium Node.js Express monoliths adds redundant code. Mongoose already functions as a data mapper and abstraction layer. Direct model queries in the Service layer keep the code clean, fast to write, and simple to debug.

### Q: "How do you prevent XSS attacks on JWT tokens?"
**A**: By storing the refresh token in an HTTP-Only cookie. JavaScript running in the browser cannot read HTTP-Only cookies, protecting the token from script injection attacks.
