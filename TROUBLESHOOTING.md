# Troubleshooting Signup Issues

## Common Issues and Solutions

### 1. "Signup failed" or "Unable to connect to server"

**Problem:** The backend server is not running.

**Solution:**
```bash
cd backend
npm run start:dev
```

### 2. MongoDB Connection Error

**Problem:** MongoDB password is not set or incorrect.

**Solution:**
1. Open `backend/.env` file
2. Replace `<db_password>` with your actual MongoDB password:
   ```env
   MONGODB_URI=mongodb+srv://machine-monitoring-dashboard:YOUR_ACTUAL_PASSWORD@dashboard.9xseihe.mongodb.net/machine-monitoring?appName=dashboard
   ```
3. Restart the backend server

### 3. "User with this email already exists"

**Problem:** You're trying to sign up with an email that's already registered.

**Solution:** Use a different email address or try logging in instead.

### 4. Check Backend Logs

If signup is still failing, check the backend terminal for error messages. Common errors:
- MongoDB connection timeout
- Invalid MongoDB credentials
- Network issues

### Quick Check Commands

```bash
# Check if backend is running
lsof -ti:3001

# Check MongoDB connection string
cd backend && cat .env | grep MONGODB_URI
```

