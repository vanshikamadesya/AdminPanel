# Orbit Admin Panel

A production-ready admin panel built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript and modern best practices.

## Features

### Frontend
- **React 19** with TypeScript
- **Vite 8** for lightning-fast builds
- **Tailwind CSS v4** with custom design system
- **Complete Authentication System** (Login, Register, Forgot Password, Reset Password, Email Verification)
- **Dark/Light Mode** with system theme detection
- **Fully Responsive** dashboard and layouts
- **Redux Toolkit** for state management
- **React Hook Form + Zod** for form validation
- **Framer Motion** for smooth animations
- **Reusable UI Components** (DataTable, Modal, Drawer, Pagination, Badge, Avatar, ConfirmationDialog)
- **Lazy Loading** for optimized bundle splitting
- **Error Boundary** for graceful error handling

### Backend
- **Node.js + Express.js** with TypeScript
- **MongoDB + Mongoose** ODM
- **JWT Authentication** with access & refresh tokens
- **Role-Based Access Control (RBAC)** with Admin, Moderator, and User roles
- **Advanced Security** (Helmet, CORS, Rate Limiting)
- **Swagger API Documentation**
- **Express Validator** for request validation
- **Morgan Logger** for request logging

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 8
- React Router v7
- Redux Toolkit
- Tailwind CSS v4
- React Hook Form + Zod
- Axios
- Framer Motion
- class-variance-authority
- Lucide React icons

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Express Validator
- Helmet + CORS
- Morgan + Winston
- Swagger (swagger-jsdoc + swagger-ui-express)

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Email, logger configuration
│   │   ├── controllers/     # Route controllers (auth, user, role, permission, product, attribute, variant)
│   │   ├── middleware/      # Auth, error handler, validators
│   │   ├── models/          # Mongoose models (User, Role, Permission, Product, Attribute, Variant)
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types & interfaces
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # PrivateRoute, auth guards
│   │   │   ├── layout/      # DashboardLayout, Sidebar, Navbar
│   │   │   └── ui/          # Reusable components (Button, Card, DataTable, Modal, Drawer, etc.)
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register, ForgotPassword, VerifyEmail, ResetPassword
│   │   │   └── (page files) # Dashboard, Users, Products, Roles, Attributes, Variants, etc.
│   │   ├── services/        # API service modules
│   │   ├── store/           # Redux store + slices
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utility functions
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd admin-panel
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# On Windows
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Login | `/login` | Public | User authentication |
| Register | `/register` | Public | New account creation |
| Forgot Password | `/forgot-password` | Public | Request password reset email |
| Reset Password | `/reset-password?token=xxx` | Public | Set new password via email link |
| Verify Email | `/verify-email?token=xxx` | Public | Email verification via token |
| Dashboard | `/dashboard` | All roles | Overview with stats and recent activity |
| Users | `/users` | Admin | User management with CRUD |
| Roles & Permissions | `/roles` | Admin | Role and permission management |
| Products | `/products` | Admin, Moderator | Product management with CRUD |
| Attributes | `/attributes` | Admin, Moderator | Product attribute management |
| Variants | `/variants` | Admin, Moderator | Product variant management |
| Analytics | `/analytics` | Admin, Moderator | Analytics dashboard |
| Reports | `/reports` | Admin, Moderator | Reports dashboard |
| Profile | `/profile` | All roles | User profile management |
| Change Password | `/change-password` | All roles | Update account password |
| Settings | `/settings` | All roles | Account preferences |

## Authentication Flow

1. **Register** - Create a new account (verification email sent)
2. **Verify Email** - Click link in email to activate account
3. **Login** - Authenticate with email/password, receive JWT tokens
4. **Access Protected Routes** - Access token sent via Authorization header
5. **Refresh Token** - Automatically refresh expired access tokens
6. **Logout** - Invalidate refresh token and clear session

## Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Admin** | Full access - manage users, roles, permissions, products, attributes, variants |
| **Moderator** | Manage products, attributes, variants; view analytics and reports |
| **User** | Dashboard, profile, and change password only |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email

### Users (Admin only)
- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update own profile
- `PUT /api/users/change-password` - Change password
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user
- `DELETE /api/users/account` - Delete own account
- `GET /api/users/stats/dashboard` - Dashboard statistics

### Roles (Admin only)
- `GET /api/roles` - List roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Permissions (Admin only)
- `GET /api/permissions` - List permissions
- `POST /api/permissions` - Create permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

### Products (Admin, Moderator)
- `GET /api/products` - List products
- `POST /api/products` - Create product (Admin, Moderator)
- `PUT /api/products/:id` - Update product (Admin, Moderator)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Attributes (Admin, Moderator)
- `GET /api/attributes` - List attributes
- `POST /api/attributes` - Create attribute (Admin, Moderator)
- `PUT /api/attributes/:id` - Update attribute (Admin, Moderator)
- `DELETE /api/attributes/:id` - Delete attribute (Admin only)

### Variants (Admin, Moderator)
- `GET /api/variants` - List variants
- `POST /api/variants` - Create variant (Admin, Moderator)
- `PUT /api/variants/:id` - Update variant (Admin, Moderator)
- `DELETE /api/variants/:id` - Delete variant (Admin only)

## Security Features

- JWT-based authentication with access & refresh tokens
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- CORS configuration
- Rate limiting on auth endpoints
- Input validation with Express Validator
- Role-Based Access Control (RBAC) on all protected routes
- Account status checks (active/inactive/suspended)

## Reusable UI Components

| Component | Description |
|-----------|-------------|
| `Button` | CVA-based button with variants (default, destructive, outline, secondary, ghost, link) and sizes |
| `Card` | Card, CardHeader, CardTitle, CardDescription, CardContent |
| `DataTable` | Generic typed table with columns, pagination, edit/delete actions |
| `Modal` | Centered modal with backdrop, configurable sizes |
| `Drawer` | Slide-in panel from right with backdrop blur |
| `Pagination` | Page size selector (10/25/50/100/All) with prev/next navigation |
| `Input` | Labeled input with error state and password show/hide toggle |
| `Badge` | Status badges with variants (success, warning, danger, info, etc.) |
| `Avatar` | User avatar with initials fallback |
| `ConfirmationDialog` | Styled confirmation modal for destructive actions |
| `ErrorBoundary` | Catches runtime errors with graceful fallback UI |
| `ThemeToggle` | Light/dark/system theme cycling |

## Theme System

The application supports three theme modes:
- **Light Mode** - Optimized light theme
- **Dark Mode** - Eye-friendly dark theme
- **System** - Automatically matches system preferences

Theme preference is persisted in localStorage and applied via CSS variables.

## Environment Variables

### Backend (.env)
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

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## License

This project is licensed under the MIT License.
