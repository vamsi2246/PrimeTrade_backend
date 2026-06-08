# SecureTask Pro

SecureTask Pro is a full-stack, secure task management platform. It is engineered with a layered clean architecture pattern (Routes ➔ Controllers ➔ Services ➔ Repositories ➔ Models) built on Node.js/Express and React/Vite. The platform serves as a production-grade template demonstrating role-based access control (RBAC), database indexing, cookie-based token rotation, Google OAuth2 Single Sign-On, and system audit trails.

---

## Technical Choices & Rationale

This project was built to address standard workflow challenges in enterprise task tracking, where secure data isolation, RBAC security compliance, and activity auditing are core requirements.

### Technology Choices
- **Node.js & Express**: Provides a lightweight and highly performant runtime engine. Express middlewares allow secure pipeline configurations (Helmet, CORS, rate limiting).
- **MongoDB & Mongoose**: A document database provides natural flexibility for task configurations (e.g. description fields, due dates, checklists) which frequently change during incremental product updates, without requiring database schema lock migrations.
- **Repository-Service Pattern**: Deactions business rules from direct Mongoose model manipulation. By abstracting queries into a dedicated Repository layer, business services remain pure and easier to cover with unit tests.
- **JWT & HTTP-Only Refresh Tokens**: Short-lived access tokens (15m) are sent via API headers. Long-lived refresh tokens (7d) are set via secure, SameSite HTTP-Only cookies to protect users against XSS and CSRF threats.
- **Google Single Sign-On (SSO)**: Google Identity Services (GSI) script integration allows users to log in securely using Google Auth. Google ID Tokens (JWT) are verified cryptographically on the Express backend via `google-auth-library` to issue local app sessions.

---

## Monorepo Layout

```
SecureTask_Pro/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, Winston logger setups
│   │   ├── constants/       # Global constants (Roles, Task status, priority)
│   │   ├── controllers/     # HTTP routers interface mapping
│   │   ├── docs/            # Swagger configuration definitions
│   │   ├── middlewares/     # Auth, RBAC, Validation, Error handlers
│   │   ├── models/          # User, Task, AuditLog schemas
│   │   ├── repositories/    # Database query abstractions
│   │   ├── services/        # Business logic modules
│   │   ├── utils/           # Custom error objects and response formats
│   │   ├── validators/      # express-validator schemas
│   │   ├── app.js           # Express app configuring
│   │   └── server.js        # Node.js server bootstrapper
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client with interceptors
│   │   ├── components/      # Reusable UI components (Input, Button, Modal, Loader)
│   │   ├── context/         # AuthContext & TaskContext state providers
│   │   ├── layouts/         # Layout shells
│   │   ├── pages/           # Dashboard, TaskList, AdminPanel, Profile, Landing
│   │   ├── App.css
│   │   ├── index.css        # Tailwind imports
│   │   ├── App.jsx          # Route mappings
│   │   └── main.jsx         # App bootstrapping
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── SecureTask_Pro.postman_collection.json
└── README.md
```

---

## Environment Variables

### Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/securetaskpro
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRE=15m
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Frontend Configuration (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## Installation & Local Execution

### 1. Booting with Docker
```bash
docker-compose up --build
```
This boots the backend API, local MongoDB instance, and local Redis cache in containers.

### 2. Manual Boot

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

---

## API Endpoints

- `POST /api/v1/auth/register` - Register new user account
- `POST /api/v1/auth/login` - Authenticate login and set cookie
- `POST /api/v1/auth/google` - Verify Google ID Token and authenticate
- `POST /api/v1/auth/refresh` - Rotate tokens via cookie
- `POST /api/v1/auth/logout` - Clear cookies
- `GET /api/v1/tasks` - List tasks (supports search, sort, filter, pagination)
- `POST /api/v1/tasks` - Create a task
- `PUT /api/v1/tasks/:id` - Edit a task
- `DELETE /api/v1/tasks/:id` - Soft delete a task
- `GET /api/v1/users` - Admin: List users
- `PATCH /api/v1/users/:id/role` - Admin: Toggle user roles
- `GET /api/v1/audit` - Admin: Inspect Audit Logs
- `GET /api/v1/health` - Monitor connection check

---

## Future Improvements

1. **Email Notifications**: Dispatch warning alerts when task due dates are near using NodeMailer.
2. **WebSocket Real-time Synchronization**: Live dashboard update integrations using socket.io.
3. **Advanced Filtering**: Custom groupings and list filters (tag tags support).
