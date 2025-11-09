# Machine Monitoring Dashboard

A full-stack application for monitoring machines with real-time data visualization.

## Project Structure

```
Dashboard/
├── frontend/          # Next.js frontend application
└── backend/           # NestJS backend API
```

## Features

### Frontend (Next.js)
- ✅ Login page with authentication
- ✅ Dashboard with machine data table
- ✅ Machine details page with temperature chart
- ✅ Auto-refresh every 10 seconds
- ✅ Logout functionality

### Backend (NestJS)
- ✅ JWT-based authentication
- ✅ Protected API endpoints
- ✅ Machine CRUD operations with MongoDB
- ✅ User authentication with MongoDB
- ✅ Database persistence for all data

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB database (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB connection:
   - Create a `.env` file in the `backend` directory (or update the existing one)
   - Add your MongoDB connection string:
   ```env
   MONGODB_URI=your-mongodb-connection-string-here
   JWT_SECRET=your-secret-key-change-in-production
   ```
   - Example for local MongoDB: `mongodb://localhost:27017/machine-monitoring`
   - Example for MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/machine-monitoring`

4. Seed the database:
```bash
# Seed default admin user
npm run seed

# Seed initial machine data
npm run seed:machines

# Or seed both at once
npm run seed:all
```
This will create:
- Default admin user:
  - Email: `admin@example.com`
  - Password: `password123`
- Initial machine data (3 machines):
  - Lathe Machine
  - CNC Milling Machine
  - Injection Molding Machine

5. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Login Credentials

- **Email:** `admin@example.com`
- **Password:** `password123`

## API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token
- `POST /auth/signup` - Sign up new user (stores in MongoDB)

### Machines (Protected - requires JWT token)
- `GET /machines` - Get all machines (from MongoDB)
- `GET /machines/:id` - Get machine by ID (MongoDB _id)
- `POST /machines/:id/update` - Update machine data (persisted to MongoDB)

## Technologies Used

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Axios

### Backend
- NestJS
- TypeScript
- JWT Authentication
- Passport.js
- MongoDB with Mongoose
- bcrypt for password hashing

