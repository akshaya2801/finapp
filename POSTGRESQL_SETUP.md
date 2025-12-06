# PostgreSQL Setup Guide for FinApp

## Quick Setup (Windows)

### Option 1: Using PostgreSQL Installer (Recommended for Windows)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or later

2. **Install PostgreSQL**
   - Run the installer
   - Default port: 5432
   - Set a password for postgres user (e.g., `password`)
   - Remember this password for the .env file

3. **Create Database**
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   
   # In psql, run:
   CREATE DATABASE finapp;
   \q
   ```

4. **Initialize Database Schema**
   ```bash
   cd e:\Akshaya\FinApp\backend
   psql -U postgres -d finapp -f src/scripts/init_database.sql
   ```

5. **Verify Database**
   ```bash
   psql -U postgres -d finapp
   # Run: \dt (shows all tables)
   # Run: SELECT * FROM users; (shows sample users)
   ```

### Option 2: Using npm Script (If PostgreSQL is Installed)

```bash
cd e:\Akshaya\FinApp\backend
npm run init-db
```

---

## Configure .env File

Update `backend/.env`:

```properties
DATABASE_URL=postgresql://postgres:password@localhost:5432/finapp
JWT_SECRET=your_super_secret_key_here_change_in_production_12345
JWT_REFRESH_SECRET=your_refresh_secret_key_here_change_in_production_67890
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
UPLOAD_DIR=./uploads
NODE_ENV=development
```

Replace `password` with your PostgreSQL password from installation.

---

## Test Database Connection

```bash
cd e:\Akshaya\FinApp\backend

# Test if DB connects
npm run dev
# Check console for: ✅ Server running on port 3001
```

---

## Sample Users for Testing

After running `init_database.sql`, these users are available:

| Email | Password | Role | Phone |
|-------|----------|------|-------|
| rajesh@example.com | Test@123 | customer | 9876543210 |
| priya@example.com | Test@123 | customer | 9876543211 |
| admin@example.com | Test@123 | admin | 9876543212 |

---

## Test API Endpoints

### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh@example.com","password":"Test@123"}'
```

### 2. Get Tickets
```bash
curl -X GET http://localhost:3001/api/tickets \
  -H "Authorization: Bearer <access_token_from_login>"
```

### 3. Create New Ticket
```bash
curl -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "category":"Support",
    "title":"Need help with app",
    "description":"I need help with the mobile app",
    "priority":"normal"
  }'
```

---

## Troubleshooting

### Error: "psql: command not found"
- PostgreSQL not in PATH. Add `C:\Program Files\PostgreSQL\15\bin` to Windows PATH

### Error: "FATAL: role 'postgres' does not exist"
- PostgreSQL not properly installed. Reinstall with default settings

### Error: "could not connect to server"
- PostgreSQL service not running. Start it from Windows Services

### Connection refused on port 5432
- PostgreSQL service not running or listening on different port

---

## Next Steps

Once database is set up:
1. Restart backend: `npm run dev`
2. Test login with sample user credentials
3. Create tickets from mobile/admin apps
4. Verify all API endpoints working

