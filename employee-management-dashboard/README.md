# Employee Management Dashboard (MERN)

A production-ready **Employee Management Dashboard** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.

The application provides secure JWT authentication, complete employee CRUD operations, search & filtering, pagination, and an analytics dashboard powered by Recharts.

---

# 🚀 Live Demo

### 🌐 Frontend (Vercel)

https://employee-management-dashboard-4va9674dw-lakshmanan-ms-projects.vercel.app/

### ⚙️ Backend API (Render)

https://employee-management-dashboard-ehxu.onrender.com/

---

# 👨‍💻 Demo Credentials

Email

```text
admin@ems.com
```

Password

```text
admin123
```

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes
- Persistent Login using localStorage
- Axios Request & Response Interceptors
- Automatic Logout on Invalid Token

---

## 👨‍💼 Employee Management

- Add Employee
- Update Employee
- Delete Employee
- Employee Details
- Paginated Employee Table

---

## 🔍 Search & Filters

- Search by Employee Name
- Search by Email
- Filter by Department
- Filter by Status
- Debounced Search (400ms)

---

## 📊 Dashboard Analytics

- Total Employees
- Active Employees
- Inactive Employees
- Total Departments
- Department Bar Chart
- Employee Status Pie Chart
- Monthly Joining Line Chart

Analytics are calculated using MongoDB Aggregation Pipeline.

---

## 🎨 User Experience

- Responsive Design
- Loading Spinner
- Skeleton Loading
- Empty State
- Error Handling
- Mobile Friendly Layout

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js (Vite) |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Charts | Recharts |
| API | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + bcrypt |
| Deployment | Vercel + Render |

---

# 📁 Project Structure

```
employee-management-dashboard/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/lakshmanandev/employee-management-dashboard.git

cd employee-management-dashboard
```

---

# ⚙️ Backend Setup

```bash
cd server

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d

SEED_ADMIN_EMAIL=admin@ems.com

SEED_ADMIN_PASSWORD=admin123

CLIENT_ORIGIN=http://localhost:5173
```

Seed Database

```bash
npm run seed
```

Run Server

```bash
npm run dev
```

---

# 💻 Frontend Setup

```bash
cd client

npm install
```

Create `.env`

Development

```env
VITE_API_URL=/api
```

Production

```env
VITE_API_URL=https://employee-management-dashboard-ehxu.onrender.com/api
```

Run

```bash
npm run dev
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## Employees

| Method | Endpoint |
|---------|----------|
| GET | /api/employees |
| POST | /api/employees |
| GET | /api/employees/:id |
| PUT | /api/employees/:id |
| DELETE | /api/employees/:id |

---

## Analytics

| Method | Endpoint |
|---------|----------|
| GET | /api/employees/stats/summary |

---

# 📦 NPM Scripts

## Backend

```bash
npm run dev
```

Start Development Server

```bash
npm start
```

Start Production Server

```bash
npm run seed
```

Seed Admin User & Sample Employees

---

## Frontend

```bash
npm run dev
```

Start Development Server

```bash
npm run build
```

Build Production Files

```bash
npm run preview
```

Preview Production Build

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# 🔮 Future Improvements

- Employee Profile Image Upload
- Role Based Access Control
- Export Employees to Excel/PDF
- Email Notifications
- Dark Mode
- Unit Testing
- Docker Support

---

# 📸 Screenshots

- Login Page
- Dashboard
- Employee Management
- Analytics Dashboard

(Add screenshots here after deployment)

---

# 👨‍💻 Author

**Lakshmanan M**

GitHub

https://github.com/lakshmanandev/employee-management-dashboard/tree/main/employee-management-dashboard

LinkedIn

https://www.linkedin.com/in/lakshmanan-m-fullstackdeveloper/

---

# 📄 License

This project was developed for learning, portfolio, and technical assessment purposes.