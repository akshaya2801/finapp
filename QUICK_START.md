# Quick Start Guide

## 5-Minute Setup

### Step 1: Backend (2 minutes)

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run dev
```

✅ Backend running on `http://localhost:3000`

### Step 2: Database (Local PostgreSQL)

If using local PostgreSQL:
```bash
# Create database
createdb finapp_db

# Update .env with connection string
DATABASE_URL=postgresql://username:password@localhost:5432/finapp_db
```

### Step 3: Mobile App (2 minutes)

```bash
cd mobile
npm install
# Update API_BASE_URL in src/utils/axios.ts
# Change 192.168.1.100 to your backend IP
npm run android
```

### Step 4: Admin Dashboard (1 minute)

```bash
cd admin
npm install
npm start
```

✅ Admin panel running on `http://localhost:3000`

## Test Credentials (After Registration)

### Create Test Account
```bash
# POST http://localhost:3000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

### Create Admin Account
```sql
-- After initialization, update user role in PostgreSQL
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## API Endpoints Reference

### Health Check
```bash
GET http://localhost:3000/health
```

### Register
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "secure123"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend not running, check `npm run dev` |
| `Cannot find module 'pg'` | Run `npm install` in backend directory |
| `Database does not exist` | Run `npm run db:init` in backend |
| `API endpoint 404` | Check backend routes in `src/routes/` |
| `Mobile can't connect` | Update API_BASE_URL to your machine's IP |
| `Port 3000 already in use` | Kill existing process or change PORT in .env |

## Production Deployment

### Deploy Backend to Railway
1. Push code to GitHub
2. Connect GitHub to Railway.app
3. Create PostgreSQL database
4. Set environment variables
5. Deploy automatically

### Build APK for Release
```bash
cd mobile
npm run prebuild:android
npm run build:android
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### Deploy Admin to Netlify
```bash
cd admin
npm run build
# Deploy build/ folder to Netlify
```

## Next Steps

1. ✅ Install dependencies: `npm install` in each folder
2. ✅ Configure database connection
3. ✅ Initialize database schema
4. ✅ Update API endpoints for your deployment
5. ✅ Test registration and login flows
6. ✅ Create test tickets
7. ✅ Test admin dashboard
8. ✅ Build and sign APK
9. ✅ Deploy to production

## Performance Tips

- Use `.env` with production credentials
- Enable HTTPS in production
- Set up database backups
- Monitor API response times
- Use CDN for static files

## Documentation Files

- `IMPLEMENTATION_GUIDE.md` - Full technical documentation
- `API_ENDPOINTS.md` - Detailed API reference (see below)
- `DEPLOYMENT.md` - Production deployment guide
- Backend `/health` endpoint for status checks

---

**Need Help?** Check the main `IMPLEMENTATION_GUIDE.md` file!
