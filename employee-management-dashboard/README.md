# Employee Management Dashboard (MERN)

A production-style, full-stack Employee Management Dashboard built with the
**MERN** stack. It features JWT authentication, a paginated employee table with
full CRUD, debounced search + department/status filters, and an analytics
section powered by **Recharts** (cards + bar / pie / line charts).

---

## Tech Stack

| Layer     | Technology                                                     |
| --------- | -------------------------------------------------------------- |
| Frontend  | React (Vite), React Router DOM, Axios, Tailwind CSS, Recharts  |
| State     | Context API (auth) + `useState` / `useEffect` hooks            |
| Backend   | Node.js, Express                                               |
| Database  | MongoDB with Mongoose                                          |
| Auth      | JWT (JSON Web Tokens) + bcrypt password hashing                |

---

## Features

- **Authentication** — email/password login with client + server validation,
  JWT stored in `localStorage`, protected routes, logout, and an Axios
  interceptor that attaches the token and handles `401`s globally.
- **Employee table** — Name, Email, Department, Designation, Status, Joining
  Date, with 10-per-page pagination.
- **CRUD** — create/edit via a single modal (edit form pre-filled), delete with
  a confirmation popup.
- **Search & filter** — debounced search by name/email, plus department and
  status dropdown filters.
- **Analytics** — Total / Active / Inactive / Departments cards, a
  department bar chart, a status pie chart, and a monthly-joins line chart,
  all computed server-side via MongoDB aggregation.
- **UX** — loading skeletons/spinners, friendly error messages, empty states,
  and a responsive layout (mobile + desktop).

---

## Project Structure

```
employee-management-dashboard/
├── server/                     # Express REST API
│   ├── .env.example
│   └── src/
│       ├── server.js           # app entry (middleware + routes)
│       ├── config/db.js        # Mongoose connection
│       ├── models/             # User.js, Employee.js
│       ├── middleware/         # auth.js (JWT guard), errorHandler.js
│       ├── controllers/        # authController.js, employeeController.js
│       ├── routes/             # authRoutes.js, employeeRoutes.js
│       ├── utils/asyncHandler.js
│       └── seed/seed.js        # seeds 1 admin + 25 employees
│
└── client/                     # React (Vite) SPA
    ├── .env.example
    └── src/
        ├── main.jsx            # mounts App inside AuthProvider
        ├── App.jsx             # routes (public + protected)
        ├── api/axios.js        # Axios instance + interceptors
        ├── context/AuthContext.jsx
        ├── hooks/              # useEmployees, useStats, useDebounce
        ├── components/         # table, modals, charts, filter bar, etc.
        └── pages/              # Login.jsx, Dashboard.jsx
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas
  connection string

---

## Setup & Run

The app is two independent apps — run each in its own terminal.

### 1. Backend (`/server`)

```bash
cd server
npm install

# create your env file from the template, then edit if needed
cp .env.example .env          # Windows PowerShell: copy .env.example .env

# seed the database with 1 admin user + 25 sample employees
npm run seed

# start the API (http://localhost:5000)
npm run dev                   # or: npm start
```

`server/.env` values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ems
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1d
SEED_ADMIN_EMAIL=admin@ems.com
SEED_ADMIN_PASSWORD=admin123
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Frontend (`/client`)

```bash
cd client
npm install

cp .env.example .env          # Windows PowerShell: copy .env.example .env

# start Vite dev server (http://localhost:5173)
npm run dev
```

The Vite dev server proxies `/api` → `http://localhost:5000`, so no CORS setup
is needed in development.

### 3. Log in

Open **http://localhost:5173** and sign in with the seeded admin account:

```
Email:    admin@ems.com
Password: admin123
```

> These come from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `server/.env`.
> Re-running `npm run seed` wipes and recreates the data.

---

## API Reference

All `/api/employees` routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint                          | Description                                   |
| ------ | --------------------------------- | --------------------------------------------- |
| POST   | `/api/auth/login`                 | Log in, returns `{ token, user }`             |
| GET    | `/api/auth/me`                    | Current user (restores session on refresh)    |
| GET    | `/api/employees`                  | List (query: `page,limit,search,department,status`) |
| POST   | `/api/employees`                  | Create employee                               |
| GET    | `/api/employees/:id`              | Get one employee                              |
| PUT    | `/api/employees/:id`              | Update employee                               |
| DELETE | `/api/employees/:id`              | Delete employee                               |
| GET    | `/api/employees/stats/summary`    | Aggregated analytics for cards + charts       |

---

## NPM Scripts

**server**

| Script         | Action                              |
| -------------- | ----------------------------------- |
| `npm run dev`  | Start API with nodemon (hot reload) |
| `npm start`    | Start API                           |
| `npm run seed` | Wipe + seed admin and 25 employees  |

**client**

| Script            | Action                       |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start Vite dev server        |
| `npm run build`   | Production build to `dist/`  |
| `npm run preview` | Preview the production build |

---

## Production Build

```bash
cd client && npm run build     # outputs to client/dist
```

Serve `client/dist` from any static host and point `VITE_API_URL` at your
deployed API URL (rebuild after changing it).

---

## Notes / Design Decisions

- **Analytics are computed server-side** with MongoDB aggregation, so the
  cards/charts reflect the entire dataset — not just the visible table page.
- **One Axios instance** centralizes auth: a request interceptor attaches the
  JWT; a response interceptor clears the session and redirects on `401`.
- **A single modal** handles both create and edit — it seeds its form from the
  selected employee when editing, or blanks it when creating.
- **Search is debounced (400 ms)** so typing fires one request after a pause
  instead of one per keystroke.
```
