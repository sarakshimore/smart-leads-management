# Smart Leads Management

Full-stack lead management application built with a React frontend, an Express + TypeScript backend, and MongoDB.

## Overview

Smart Leads Management provides:

- authentication with JWT
- admin/sales role model
- lead pipeline with search/filter/sort/pagination
- lead assignment from admin to sales users
- CSV export

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI / shadcn-style components
- Axios
- React Router
- next-themes

### Backend

- Node.js
- Express 5
- TypeScript
- Mongoose
- MongoDB
- jsonwebtoken
- bcryptjs
- json2csv

## Key Behavior (Current)

### Auth and Roles

- Public registration creates `admin` users.
- Login returns JWT + user payload.
- Inactive users are blocked from login and protected routes.

### User Management

- Admin can create/list/update/deactivate sales users.
- Sales users are scoped per admin via `createdByAdmin`.
- Admin can manage only their own sales users.

### Leads Access

- Admin can see only:
  - leads created by that admin
  - leads created by sales users created by that admin
- Sales can view only leads assigned to them.
- Sales are read/export only on leads dashboard.

### Lead Assignment

- Admin can assign a lead to one of their active sales users.
- Assignment is done via dedicated assign action (not inside edit modal).

## Project Structure

```text
SM-Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── DockerFile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── types/
│   ├── package.json
│   └── DockerFile
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB (local or Atlas)

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_jwt_secret_here
```

Frontend API base defaults to:

```text
http://localhost:5000/api
```

Create `frontend/.env` (or set Vercel env var):

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Render backend + Vercel frontend), set:

```env
VITE_API_URL=https://<your-render-backend-domain>/api
```

## Local Development

### Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Start backend

```bash
cd backend
npm run dev
```

Backend: `http://localhost:5000`

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`

## Docker

```bash
docker-compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

Stop:

```bash
docker-compose down
```

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/register` - register admin
- `POST /auth/login` - login

### Users (admin only)

- `POST /users` - create sales user
- `GET /users` - list sales users (pagination + search)
- `PUT /users/:id` - update sales user
- `DELETE /users/:id` - deactivate sales user (`isActive=false`)

### Leads

- `GET /leads` - list leads (pagination + search/filter/sort, scoped by role/team)
- `POST /leads` - create lead (admin only)
- `GET /leads/:id` - fetch single lead (scoped)
- `PUT /leads/:id` - update lead (admin only)
- `DELETE /leads/:id` - delete lead (admin only)
- `PATCH /leads/:id/assign` - assign lead to sales user (admin only)
- `GET /leads/export/csv` - export scoped leads CSV

### Lead Query Params

`GET /leads` supports:

- `page`
- `search`
- `status`
- `source`
- `sort` (`latest` or `oldest`)

Example:

```text
/api/leads?page=1&search=john&status=Qualified&source=Website&sort=latest
```

## Data Models

### User

- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`admin | sales`)
- `isActive`
- `createdByAdmin?` (set for sales users)
- `timestamps`

### Lead

- `name`
- `email`
- `status` (`New | Contacted | Qualified | Lost`)
- `source` (`Website | Instagram | Referral`)
- `createdBy`
- `assignedTo?`
- `timestamps`

## Dashboard Notes

- Navbar title routes to `/`.
- Admin sees: create lead form, assign/edit/delete actions, export CSV.
- Sales sees: lead list + filters + pagination + export CSV only.
