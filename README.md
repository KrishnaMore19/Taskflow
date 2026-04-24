# TaskFlow — Full-Stack Task Manager

A production-ready multi-user task management app built with **React + Tailwind CSS** (frontend) and **Node.js + Express + PostgreSQL/Sequelize** (backend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

---

### 1. Database Setup

```sql
CREATE DATABASE taskflow_db;
```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev   # starts on http://localhost:5000
```

Tables are auto-created by Sequelize on first run.

---

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy env file
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev   # starts on http://localhost:5173
```

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize + PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js    # signup, login, getMe
│   │   └── taskController.js    # CRUD + status update
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # express-validator check
│   ├── models/
│   │   ├── User.js              # User model with bcrypt hooks
│   │   └── Task.js              # Task model with user FK
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/*
│   │   └── taskRoutes.js        # /api/tasks/*
│   ├── server.js                # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js         # Axios instance + interceptors
    │   │   ├── auth.js          # Auth API calls
    │   │   └── tasks.js         # Task API calls
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Landing.jsx      # Public landing page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx    # Main task management UI
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Tasks (all require JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (current user only) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Update status only |
| DELETE | `/api/tasks/:id` | Delete task |

**Query params for GET /api/tasks:**
- `status` — `pending` / `in_progress` / `completed`
- `priority` — `low` / `medium` / `high`
- `search` — title search (case-insensitive)
- `sortBy` — `createdAt` / `dueDate` / `priority`
- `order` — `ASC` / `DESC`

---

## 🔐 Security Features
- Passwords hashed with **bcryptjs** (12 rounds)
- **JWT** tokens with configurable expiry
- All task routes are **user-scoped** — users can only access their own tasks
- Input validation on all endpoints via **express-validator**
- Generic error messages to prevent user enumeration

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Tailwind CSS, Axios |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL + Sequelize ORM |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
