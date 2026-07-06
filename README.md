# STUDENT LMS - Full Stack Learning Management System

A premium, internship-level Learning Management System built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🚀 Features
- ✅ **Role-Based Authentication** — JWT-secured login for Students & Instructors
- ✅ **Course Catalog** — 6 courses with AI-generated thumbnails served locally
- ✅ **Course Enrollment** — Students can enroll instantly from the course card
- ✅ **Instructor Dashboard** — Create & manage courses with a modal form
- ✅ **Student Dashboard** — View enrolled courses with real-time data
- ✅ **Premium Dark Mode UI** — Glassmorphism, blue accents, smooth animations
- ✅ **Merged Full-Stack** — React SPA served by Express in production mode
- ✅ **In-Memory DB** — Auto-seeds data on every start (no local MongoDB needed)

---

## 🗂️ Project Structure

```
Learning Management System/
├── server.js              # Express app entry point
├── .env                   # Environment variables
├── package.json           # Root scripts (dev, start)
├── backend/
│   ├── config/db.js       # MongoDB connection + seed data
│   ├── controllers/       # authController, courseController
│   ├── middleware/        # authMiddleware (JWT protect + authorize)
│   ├── models/            # User.js, Course.js
│   └── routes/            # authRoutes.js, courseRoutes.js
└── client/                # React + Vite frontend
    ├── public/images/     # AI-generated course thumbnails (local)
    ├── src/
    │   ├── App.jsx        # Router + Navbar
    │   ├── index.css      # Global dark theme CSS
    │   └── pages/
    │       ├── Home.jsx       # Course catalog + hero
    │       ├── Login.jsx      # Login form
    │       ├── Register.jsx   # Register form
    │       └── Dashboard.jsx  # Role-based dashboard
    └── dist/              # Built production files (served by Express)
```

---

## ⚙️ Setup & Run

### 1. Install Dependencies
```powershell
# In project root
npm install

# In client folder
cd client
npm install
cd ..
```

### 2. Run the Project (Production Mode - Merged)
```powershell
node server.js
```
Then open → **http://localhost:8080**

### 3. Run in Development Mode (Hot-Reload)
```powershell
npm run dev
```
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

---

## 🔐 Test Credentials

| Role       | Email                  | Password     |
|------------|------------------------|--------------|
| Student    | student@lms.com        | password123  |
| Instructor | instructor@lms.com     | password123  |

> ⚠️ Since the DB is in-memory, credentials reset on every server restart.

---

## 🛠 Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React, Vite, React Router, Lucide Icons  |
| Styling    | Vanilla CSS (Dark Mode, Glassmorphism)   |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB (via `mongodb-memory-server`)    |
| Auth       | JSON Web Tokens (JWT), bcryptjs          |

---

## 📡 API Endpoints

| Method | Endpoint                        | Access       |
|--------|---------------------------------|--------------|
| POST   | /api/auth/register              | Public       |
| POST   | /api/auth/login                 | Public       |
| GET    | /api/auth/me                    | Private      |
| GET    | /api/courses                    | Public       |
| POST   | /api/courses                    | Instructor   |
| GET    | /api/courses/:id                | Public       |
| POST   | /api/courses/:id/enroll         | Student      |
| GET    | /api/courses/my-enrollments     | Student      |
| GET    | /api/courses/my-created-courses | Instructor   |
