# SecureTask Pro — Production Deployment & DevOps Architecture

SecureTask Pro is a secure, full-stack, enterprise-grade task management platform built on Node.js/Express, MongoDB, and React (Vite). The application is engineered with a strict **Layered Clean Architecture** pattern, role-based access control (RBAC), cookie-based token rotation, and system audit logs.

---

## 1. System Architecture & Request Lifecycle

Below is the request-response lifecycle illustrating the path of incoming API requests through security, validation, business services, and repositories to MongoDB:

```mermaid
graph TD
    A[React Client - Vercel] -->|HTTP Request| B[Express Server - Render]
    
    subgraph Security & Middleware Pipeline
        B --> C[Helmet - Security Headers]
        C --> D[CORS - Origin Check]
        D --> E[Custom NoSQL Sanitizer]
        E --> F[Winston/Morgan Logger]
        F --> G[Rate Limiter]
        G --> H[Auth Guard - protect]
        H --> I[Role Guard - authorize]
        I --> J[Validator - express-validator]
    end
    
    subgraph Application Layers
        J --> K[Controller Adapter]
        K --> L[Business Service]
        L --> M[Repository Layer]
    end
    
    subgraph Storage & Caching
        M --> N[(MongoDB Atlas)]
        L -->|Optional Caching| O[(Redis Cache)]
    end
```

---

## 2. Technical Decisions & Rationale

*   **Node.js & Express**: Provides a highly performant, asynchronous event loop, ideal for I/O-bound web applications. Employs a robust middleware pipeline to enforce security measures prior to routing requests to application logic.
*   **Repository-Service Pattern**: Decouples business logic from direct Mongoose model manipulation. The service layer handles transactions, business rules, and audits, while the repository layer abstracts raw queries. This allows writing fast, mock-driven integration tests without requiring active database connections.
*   **JWT & Cookie-Based Token Rotation**: Mitigates security vulnerabilities by storing access tokens (15m expiry) in client state memory/headers and refresh tokens (7d expiry) in an `HTTP-Only, SameSite, Secure` cookie. On expiry, requests trigger token rotation to prevent theft.
*   **Google OAuth2 SSO**: Implements secure client authentication via Google Identity Services. The backend decrypts and verifies the Google ID Token cryptographically using the official `google-auth-library` before establishing a local session.

---

## 3. Monorepo Structure

```
SecureTask_Pro/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurations: DB, Logger, Redis, Env Validator
│   │   ├── constants/       # Global constants (Roles, Priorities, Statuses)
│   │   ├── controllers/     # HTTP controllers adapting requests to services
│   │   ├── docs/            # Swagger OpenAPI configuration
│   │   ├── middlewares/     # Auth, Roles, Rate Limits, Sanitize, Errors
│   │   ├── models/          # Mongoose Database Schemas
│   │   ├── repositories/    # Query and Data-Access Abstractions
│   │   ├── services/        # Central Business Logic and Audit Logs
│   │   ├── utils/           # Shared utilities (Custom Errors, Formatters)
│   │   └── validators/      # Route parameter validators
│   ├── tests/               # Integration tests (Health, Auth, Task CRUD)
│   ├── Dockerfile           # Optimized production multi-stage build
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client with automated interceptors
│   │   ├── components/      # UI components (Buttons, Modals, Loaders)
│   │   ├── context/         # Auth and Task state managers
│   │   ├── pages/           # Pages (Dashboard, AdminPanel, Landing)
│   │   └── main.jsx         # Client entrypoint
│   ├── vercel.json          # Vercel deployment and routing rewrites
│   └── package.json
├── docker-compose.yml       # Monorepo containerization launcher
└── README.md
```

---

## 4. Environment Variables

### Backend Settings (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/securetaskpro?retryWrites=true&w=majority
REDIS_URL=rediss://default:your_redis_password@your_redis_host:6379
JWT_SECRET=your_32_byte_jwt_secret_key
JWT_REFRESH_SECRET=your_32_byte_jwt_refresh_secret_key
JWT_EXPIRE=15m
CLIENT_URL=https://your-frontend.vercel.app
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### Frontend Settings (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

## 5. Deployment Playbook

### Phase A: Database Setup (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (the shared free tier is suitable for testing/development).
3. In **Database Access**, create a database user (select password authentication, generate a secure password, and note it down).
4. In **Network Access**, whitelist connection IPs:
    *   For testing, you can temporarily add `0.0.0.0/0` (allow access from anywhere).
    *   For production, restrict this to your backend hosting (Render) outbound static IPs if you use a premium Render instance, or keep it open if utilizing Render's dynamic IP pooling.
5. Click **Connect** on the Cluster, choose "Drivers", and copy the connection string. Replace `<username>`, `<password>`, and database name to build your final `MONGO_URI`.

### Phase B: Backend Deployment (Render)
1. Sign in to [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the monorepo.
4. Specify the service details:
    *   **Name**: `securetask-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
5. Under **Advanced**, add your environment variables matching your `backend/.env` configuration. Ensure `NODE_ENV` is set to `production`.
6. Enable the dynamic PORT fallback (Render will automatically inject `PORT` into the environment, and Express will bind to it).

### Phase C: Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and import your repository.
3. In the configuration page, set:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add `VITE_API_URL` pointing to your deployed Render URL (e.g., `https://securetask-backend.onrender.com/api/v1`) and your `VITE_GOOGLE_CLIENT_ID`.
5. Click **Deploy**. Vercel will automatically parse the `vercel.json` file inside the frontend root to prevent route refresh errors.

### Phase D: DNS Setup & Custom Domains
1. **Frontend (Vercel)**:
    *   In the Vercel project, go to **Settings > Domains**.
    *   Add your domain (e.g., `taskpro.yourdomain.com`).
    *   Vercel will ask you to create a `CNAME` record pointing to `cname.vercel-dns.com` in your DNS registrar (GoDaddy, Namecheap, Cloudflare).
2. **Backend (Render)**:
    *   In the Render service dashboard, go to **Settings**.
    *   Find the **Custom Domains** section and add your API subdomain (e.g., `api.taskpro.yourdomain.com`).
    *   Create a `CNAME` record in your DNS registrar pointing to your Render app hostname (e.g., `securetask-backend.onrender.com`).
    *   Ensure SSL/TLS certificates are fully provisioned by the hosts (Render and Vercel do this automatically once DNS records propagate).

---

## 6. Security Controls Reference

*   **Helmet.js**: Injects a suite of HTTP security headers (e.g. Content-Security-Policy, X-Frame-Options, X-Content-Type-Options) to protect clients from clickjacking and mime sniffing.
*   **CORS (Cross-Origin Resource Sharing)**: Locked down strictly to the verified frontend origin `CLIENT_URL`. Supports secure cross-domain cookie forwarding via `credentials: true`.
*   **NoSQL Injection Sanitizer Middleware**: Strips keys beginning with a dollar sign (`$`) from request inputs (`req.body`, `req.query`, `req.params`) preventing malicious users from injecting raw query commands.
*   **Startup Env Validator**: Prevents application initialization if required parameters (`MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`) are missing or blank, preventing silent insecure boots.
*   **Trust Proxy**: Configured to `1` on Express to enable accurate client IP resolution behind Render's reverse proxy for correct rate-limiting enforcement.
*   **HTTP-Only Cookies**: Refresh tokens are issued with the `HttpOnly`, `Secure` (production only), and `SameSite: None` (or `Lax` when sharing subdomains) flags, shielding tokens from access by client-side Javascript.

---

## 7. Automated Verification

We maintain a high-coverage integration test suite covering system routes, endpoints, auth flows, and CRUD operations.

### Local Quality Commands

Inside the `backend/` directory:
```bash
# Run lint checks
npm run lint

# Format code
npm run format

# Run Jest tests
npm run test
```

Inside the `frontend/` directory:
```bash
# Run lint checks
npm run lint

# Build production assets
npm run build
```

---

## 8. Troubleshooting Guide & Production Checklist

1.  **CORS Errors**:
    *   *Symptom*: Frontend console logs `Access-Control-Allow-Origin` missing/mismatched.
    *   *Fix*: Ensure the backend `CLIENT_URL` matches exactly (no trailing slash) the Vercel URL, and verify the frontend `VITE_API_URL` correctly matches the backend URL.
2.  **Cookies Not Setting on Client**:
    *   *Symptom*: Login succeeds but refresh token cookie is missing on subsequent calls.
    *   *Fix*: In production, credentials require `SameSite=None` and `Secure=true`. Verify `credentials: true` is configured on both the Axios client instance and the backend CORS options.
3.  **Vite App Route 404 on Refresh**:
    *   *Symptom*: Refreshing page `/dashboard` returns a blank page or Vercel 404.
    *   *Fix*: Verify `frontend/vercel.json` exists with rewrite rules routing wildcard paths back to `/index.html`.

---

## 9. Scalability Roadmap

### Caching Strategy
*   Deploy **Redis** cache clusters to cache task queries (e.g., `GET /api/v1/tasks`) with a 60-second TTL to decrease database loads on read spikes.
*   Integrate cache-invalidation strategies on write actions (`POST`, `PUT`, `DELETE`).

### Message Queues
*   Introduce **BullMQ** or **RabbitMQ** to run CPU-intensive tasks asynchronously, such as sending emails, compiling weekly analytics, and purging aged audit logs.

### Monolith to Microservices Transition
*   Decompose the codebase into isolated, single-responsibility services:
    1.  **Auth Service**: Handles token issuance, OAuth, and user profiles.
    2.  **Task Service**: Manages creation, retrieval, and status updates of tasks.
    3.  **Audit Service**: Asynchronously consumes audit logging events emitted over a RabbitMQ/Kafka broker.
*   Run the independent services in docker containers managed by **Kubernetes (K8s)** to scale pods horizontally under heavy loads, routing traffic through an API Gateway.
