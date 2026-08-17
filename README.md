# MERN Stack SaaS Application

A production-ready, full-stack SaaS application built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript and modern best practices.

## 🚀 Features

### Frontend
- ⚛️ **React 19** with TypeScript
- ⚡ **Vite** for lightning-fast builds
- 🎨 **Tailwind CSS v4** with Shadcn/UI components
- 🔐 **Complete Authentication System** (Login, Register, Password Reset, Email Verification)
- 🌓 **Dark/Light Mode** with system theme detection
- 📱 **Fully Responsive** dashboard and layouts
- 🔄 **Redux Toolkit + RTK Query** for state management
- 📝 **React Hook Form + Zod** for form validation
- 🎭 **Framer Motion** for smooth animations
- 🔍 **Advanced Data Tables** with sorting, filtering, pagination

### Backend
- 🟢 **Node.js + Express.js** with TypeScript
- 🍃 **MongoDB + Mongoose** ODM
- 🔒 **JWT Authentication** with refresh tokens
- 🛡️ **Advanced Security** (Helmet, CORS, Rate Limiting, XSS Protection)
- 📊 **Swagger API Documentation**
- ✅ **Express Validator** for request validation
- 📝 **Morgan Logger** for request logging
- 🔑 **Role-Based Access Control** (RBAC)

### DevOps & Tools
- 🐳 **Docker Support** with Docker Compose
- 🧪 **Testing Setup** (Vitest, React Testing Library, Jest, Supertest)
- 🔧 **ESLint + Prettier** for code quality
- 🐕 **Husky** for Git hooks
- 📚 **Comprehensive Documentation**

## 📦 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router v7
- Redux Toolkit + RTK Query
- Tailwind CSS v4
- Shadcn/UI
- React Hook Form
- Zod Validation
- Axios
- Framer Motion
- React Query (TanStack Query)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Express Validator
- Helmet
- CORS
- Morgan
- Rate Limiting

## 🏗️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── validators/      # Request validators
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── docs/            # API documentation
│   ├── tests/               # Backend tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # App configuration
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── layouts/         # Layout components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── routes/          # Route definitions
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── constants/       # Constants
│   │   ├── assets/          # Static assets
│   │   └── themes/          # Theme configuration
│   ├── tests/               # Frontend tests
│   └── package.json
│
├── docker-compose.yml       # Docker compose configuration
└── README.md               # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Docker (optional, recommended)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Fullstack-app
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

Make sure MongoDB is running locally:
```bash
# On Windows with MongoDB installed
net start MongoDB

# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

Or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

### Running the Application

#### Quick Start with Docker (Recommended)

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

#### Development Mode (Manual)

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

#### Production Mode

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

## 🧪 Testing

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

## 📚 API Documentation

Once the backend is running, access the API documentation at:
```
http://localhost:5000/api-docs
```

## 🔐 Authentication Flow

1. **Register**: Create a new user account
2. **Email Verification**: Verify email via token
3. **Login**: Authenticate and receive JWT tokens
4. **Access Protected Routes**: Use access token in Authorization header
5. **Refresh Token**: Automatically refresh expired access tokens
6. **Logout**: Invalidate refresh token

## 🎨 Theme System

The application supports three theme modes:
- **Light Mode**: Optimized light theme
- **Dark Mode**: Eye-friendly dark theme
- **System**: Automatically matches system preferences

Theme preference is persisted in localStorage.

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- CORS configuration
- Rate limiting
- XSS protection
- CSRF protection
- Input sanitization
- Secure HTTP-only cookies

## 📊 Dashboard Features

- Analytics cards with real-time data
- User management (Admin only)
- Profile management
- Settings page
- Notification center
- Activity logs
- Search & filters
- Data tables with pagination
- CSV export functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

Your Name - [Your Email]

## 🙏 Acknowledgments

- React team for React 19
- Vercel team for Next.js inspiration
- Shadcn for the amazing UI components
- All open-source contributors

## 📧 Support

For support, email support@example.com or open an issue in the repository.

---

Made with ❤️ using MERN Stack
