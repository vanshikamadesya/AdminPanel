# Orbit Admin Panel

A production-ready admin panel built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript.

## Features

### Frontend
- **React 19** with TypeScript
- **Vite 8** for lightning-fast builds
- **Tailwind CSS v4** with custom design tokens
- **Dark/Light Mode** with system theme detection
- **Fully Responsive** layouts
- **Redux Toolkit** for state management
- **React Hook Form + Zod** for form validation
- **Framer Motion** for animations
- **Lazy Loading** for optimized bundle splitting
- **Error Boundary** for graceful error handling

### Backend
- **Node.js + Express.js** with TypeScript
- **MongoDB + Mongoose** ODM
- **JWT Authentication** with access & refresh tokens
- **Role-Based Access Control (RBAC)** — Admin, Moderator, User
- **Helmet, CORS, Rate Limiting**
- **Swagger API Documentation**
- **Express Validator** for request validation

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite 8, React Router v7, Redux Toolkit, Tailwind CSS v4, React Hook Form, Zod, Axios, Framer Motion, Lucide React |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, Bcrypt, Express Validator, Helmet, CORS, Morgan, Winston, Swagger |
| Dev | ESLint, Prettier, Nodemon, ts-node |

## Project Structure

```
admin-panel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── email.ts
│   │   │   └── logger.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── roleController.ts
│   │   │   ├── permissionController.ts
│   │   │   ├── productController.ts
│   │   │   ├── attributeController.ts
│   │   │   └── variantController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validator.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Role.ts
│   │   │   ├── Permission.ts
│   │   │   ├── Product.ts
│   │   │   ├── Attribute.ts
│   │   │   └── Variant.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── roleRoutes.ts
│   │   │   ├── permissionRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── attributeRoutes.ts
│   │   │   └── variantRoutes.ts
│   │   ├── seeders/
│   │   │   └── seed.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── ConfirmationDialog.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── Drawer.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Pagination.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   ├── ResetPassword.tsx
│   │   │   │   └── VerifyEmail.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   ├── RolesPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── AttributesPage.tsx
│   │   │   ├── VariantsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ChangePasswordPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── roleService.ts
│   │   │   ├── productService.ts
│   │   │   ├── attributeService.ts
│   │   │   └── variantService.ts
│   │   ├── store/
│   │   │   ├── hooks.ts
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── themeSlice.ts
│   │   │       ├── userSlice.ts
│   │   │       ├── productSlice.ts
│   │   │       ├── roleSlice.ts
│   │   │       ├── attributeSlice.ts
│   │   │       └── variantSlice.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+) or MongoDB Atlas
- npm

### Installation

```bash
# Clone the repo
git clone <repository-url>
cd admin-panel

# Backend
cd backend
npm install
cp .env.example .env    # edit with your config

# Frontend
cd ../frontend
npm install
cp .env.example .env    # edit with your config
```

### Start MongoDB

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Run Development

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Forgot Password | `/forgot-password` | Public |
| Reset Password | `/reset-password?token=xxx` | Public |
| Verify Email | `/verify-email?token=xxx` | Public |
| Dashboard | `/dashboard` | All roles |
| Users | `/users` | Admin |
| Roles & Permissions | `/roles` | Admin |
| Products | `/products` | Admin, Moderator |
| Attributes | `/attributes` | Admin, Moderator |
| Variants | `/variants` | Admin, Moderator |
| Analytics | `/analytics` | Admin, Moderator |
| Reports | `/reports` | Admin, Moderator |
| Profile | `/profile` | All roles |
| Change Password | `/change-password` | All roles |
| Settings | `/settings` | All roles |

## Role-Based Access Control

| Role | Permissions |
|------|------------|
| Admin | Full access — users, roles, products, attributes, variants |
| Moderator | Products, attributes, variants, analytics, reports |
| User | Dashboard, profile, change password, settings |

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Authenticated |
| POST | `/api/auth/refresh-token` | Public |
| GET | `/api/auth/me` | Authenticated |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |
| POST | `/api/auth/verify-email` | Public |
| POST | `/api/auth/resend-verification` | Public |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/stats/dashboard` | Admin |
| GET | `/api/users/:id` | Admin |
| PUT | `/api/users/profile` | Authenticated |
| PUT | `/api/users/change-password` | Authenticated |
| PUT | `/api/users/:id/role` | Admin |
| PUT | `/api/users/:id/status` | Admin |
| DELETE | `/api/users/:id` | Admin |
| DELETE | `/api/users/account` | Authenticated |

### Roles
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/roles` | Authenticated |
| POST | `/api/roles` | Admin |
| PUT | `/api/roles/:id` | Admin |
| DELETE | `/api/roles/:id` | Admin |

### Permissions
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/permissions` | Authenticated |
| POST | `/api/permissions` | Admin |
| PUT | `/api/permissions/:id` | Admin |
| DELETE | `/api/permissions/:id` | Admin |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Authenticated |
| POST | `/api/products` | Admin, Moderator |
| PUT | `/api/products/:id` | Admin, Moderator |
| DELETE | `/api/products/:id` | Admin |

### Attributes
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/attributes` | Authenticated |
| POST | `/api/attributes` | Admin, Moderator |
| PUT | `/api/attributes/:id` | Admin, Moderator |
| DELETE | `/api/attributes/:id` | Admin |

### Variants
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/variants` | Authenticated |
| POST | `/api/variants` | Admin, Moderator |
| PUT | `/api/variants/:id` | Admin, Moderator |
| DELETE | `/api/variants/:id` | Admin |

## UI Components

| Component | File | Description |
|-----------|------|-------------|
| Button | `components/ui/Button.tsx` | Variants: default, destructive, outline, secondary, ghost, link |
| Card | `components/ui/Card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent |
| DataTable | `components/ui/DataTable.tsx` | Generic table with columns, pagination, edit/delete actions |
| Modal | `components/ui/Modal.tsx` | Centered modal with backdrop |
| Drawer | `components/ui/Drawer.tsx` | Slide-in panel from right |
| Pagination | `components/ui/Pagination.tsx` | Page size selector (10/25/50/100/All) |
| Input | `components/ui/Input.tsx` | Labeled input with error state and password toggle |
| Badge | `components/ui/Badge.tsx` | Status badges: default, success, warning, danger, info |
| Avatar | `components/ui/Avatar.tsx` | User avatar with initials fallback |
| ConfirmationDialog | `components/ui/ConfirmationDialog.tsx` | Styled confirmation modal for destructive actions |
| ErrorBoundary | `components/ui/ErrorBoundary.tsx` | Catches runtime errors with fallback UI |
| Loader | `components/ui/Loader.tsx` | Spinner and full-page loader |

## Theme System

- **Light Mode** — default light theme
- **Dark Mode** — eye-friendly dark theme
- **System** — matches OS preference

Persisted in localStorage, applied via CSS variables.

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin-panel
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
EMAIL_FROM=noreply@example.com
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build    # outputs to dist/
```
Deploy the `dist/` folder or connect the repo to Vercel with root directory set to `frontend/`.

### Backend (Railway / Render)
```bash
cd backend
npm install && npm run build    # compiles TypeScript
npm start                       # runs dist/server.js
```
Set root directory to `backend/` on your hosting platform.

### Docker
```bash
docker-compose up -d
```

## License

MIT
