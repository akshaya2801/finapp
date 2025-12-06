# PostgreSQL Setup Instructions for FinApp

## What Has Been Done

I've created automated setup scripts and documentation to get PostgreSQL running with your FinApp database:

### Files Created:

1. **`POSTGRESQL_SETUP.md`** - Detailed setup guide with manual and automated options
2. **`setup_postgresql.ps1`** - PowerShell automation script (easiest for Windows)
3. **`setup_postgresql.bat`** - Batch file automation script
4. **`backend/src/scripts/init_database.sql`** - SQL schema with sample data

---

## Quick Start (Recommended)

### Step 1: Run PowerShell Setup Script

```powershell
cd E:\Akshaya\FinApp
powershell -ExecutionPolicy Bypass -File setup_postgresql.ps1
```

**This script will:**
- ✓ Check if PostgreSQL is installed
- ✓ Optionally install PostgreSQL (winget or chocolatey)
- ✓ Create the `finapp` database
- ✓ Initialize all tables and indexes
- ✓ Load sample user data
- ✓ Update `.env` file with database credentials

### Step 2: Restart Backend

```powershell
cd E:\Akshaya\FinApp\backend
npm run dev
```

You should see: `✅ Server running on port 3001`

### Step 3: Test API Endpoints

The backend will now have real database connections and sample data ready.

---

## If Script Fails - Manual Installation

### Option A: Install PostgreSQL Manually

1. Download: https://www.postgresql.org/download/windows/
2. Run installer (default settings recommended)
3. Note the password you set for `postgres` user
4. Open PowerShell and add PostgreSQL to PATH:
   ```powershell
   $env:Path += ";C:\Program Files\PostgreSQL\15\bin"
   ```

### Option B: Create Database Manually

```powershell
# Set password environment variable
$env:PGPASSWORD = "your_postgres_password"

# Create database
psql -U postgres -h localhost -c "CREATE DATABASE finapp;"

# Initialize schema
psql -U postgres -h localhost -d finapp -f "E:\Akshaya\FinApp\backend\src\scripts\init_database.sql"

# Verify
psql -U postgres -h localhost -d finapp -c "SELECT * FROM users;"
```

### Option C: Update .env Manually

Edit `backend/.env`:
```properties
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/finapp
```

---

## Sample Test Data

After setup, these users are available:

| Email | Password | Role | Phone | Status |
|-------|----------|------|-------|--------|
| rajesh@example.com | Test@123 | customer | 9876543210 | ✓ With tickets |
| priya@example.com | Test@123 | customer | 9876543211 | ✓ With tickets |
| admin@example.com | Test@123 | admin | 9876543212 | ✓ Admin access |

Sample tickets:
- "Invoice not received" (Rajesh - Open)
- "App crashes on startup" (Priya - In Progress, Urgent)
- "Cannot reset password" (Rajesh - Open, High Priority)

---

## Testing API Endpoints

### 1. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh@example.com","password":"Test@123"}'
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "userId": "..."
}
```

### 2. Get All Tickets (with auth token)
```bash
curl -X GET http://localhost:3001/api/tickets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create New Ticket
```bash
curl -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "category":"Support",
    "title":"Help needed",
    "description":"I need assistance",
    "priority":"normal"
  }'
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `psql: command not found` | Add PostgreSQL to PATH: `$env:Path += ";C:\Program Files\PostgreSQL\15\bin"` |
| `FATAL: role 'postgres' does not exist` | Reinstall PostgreSQL with default settings |
| `could not connect to server` | PostgreSQL service not running - start from Windows Services |
| `Database 'finapp' already exists` | Database already created, proceed to initialize schema |
| `Permission denied` | Check PostgreSQL user password in .env matches installation |

---

## What to Do Next

1. **Run the setup script:** `powershell -ExecutionPolicy Bypass -File setup_postgresql.ps1`
2. **Restart backend:** `npm run dev` in backend folder
3. **Test endpoints:** Use curl commands above or try login from admin/mobile
4. **Verify mobile/admin:** Both should now connect to real backend with working API

---

## For Admin Dashboard Testing

1. Open http://localhost:3000 in browser
2. You should be able to see ticket management UI
3. API calls should now work with real data

## For Mobile App Testing

1. Metro bundler already running at http://localhost:8081
2. App will connect to backend at http://localhost:3001/api
3. Can now test register/login with real database

---

**Ready to proceed? Run the setup script!**

