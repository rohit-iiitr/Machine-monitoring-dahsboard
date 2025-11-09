# MongoDB Setup Instructions

## Step 1: Update MongoDB Password

Open the `.env` file in the `backend` directory and replace `<db_password>` with your actual MongoDB password.

Example:
```env
MONGODB_URI=mongodb+srv://machine-monitoring-dashboard:YOUR_ACTUAL_PASSWORD@dashboard.9xseihe.mongodb.net/machine-monitoring?appName=dashboard
```

## Step 2: Seed the Database

After updating the password, run the seed script to create the default admin user:

```bash
npm run seed
```

This will create:
- Email: `admin@example.com`
- Password: `password123`

## Step 3: Start the Backend

```bash
npm run start:dev
```

The backend will connect to MongoDB and be ready to use!

