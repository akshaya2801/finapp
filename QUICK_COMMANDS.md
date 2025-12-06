# ⚡ Quick Command Reference

## 🟢 After Node.js Installation (Copy & Paste These Commands)

### Step 1: Verify Node.js
```powershell
node --version
npm --version
```

### Step 2: Install Backend Dependencies
```powershell
cd e:\Akshaya\FinApp\backend
npm install
```

### Step 3: Test Backend Compilation
```powershell
cd e:\Akshaya\FinApp\backend
npx tsc --noEmit
```

### Step 4: Install Admin Dependencies
```powershell
cd e:\Akshaya\FinApp\admin
npm install
```

### Step 5: Test Admin Compilation
```powershell
cd e:\Akshaya\FinApp\admin
npx tsc --noEmit
```

### Step 6: Install Mobile Dependencies
```powershell
cd e:\Akshaya\FinApp\mobile
npm install
```

### Step 7: Start Backend Server
```powershell
cd e:\Akshaya\FinApp\backend
npm run dev
```

Expected output:
```
✅ Server running on port 3000
🚀 Environment: development
```

### Step 8: Test API (In new PowerShell window)
```powershell
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"OK","timestamp":"2025-12-01T10:00:00.000Z"}
```

### Step 9: Start Admin Dashboard (In new PowerShell window)
```powershell
cd e:\Akshaya\FinApp\admin
npm run dev
```

Expected:
```
VITE ... ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 10: Build Mobile APK
```powershell
cd e:\Akshaya\FinApp\mobile
npm run build:android
```

---

## 📁 Project Structure

```
e:\Akshaya\FinApp\
├── backend/              ← Node.js + Express API
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── admin/                ← React Admin Panel
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/               ← React Native Mobile App
│   ├── src/
│   ├── android/
│   ├── package.json
│   └── tsconfig.json
│
├── NODE_SETUP_GUIDE.md
├── BUG_FIXES_REPORT.md
└── BUG_ANALYSIS_SUMMARY.md
```

---

## 🔗 Important URLs After Startup

| Service | URL | Default |
|---------|-----|---------|
| Backend API | http://localhost:3000 | Development |
| Admin Dashboard | http://localhost:5173 | Development |
| Mobile App | Android Emulator | 127.0.0.1:8081 |

---

## 🧪 Test Commands

### Health Check
```bash
curl http://localhost:3000/health
```

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "password": "Test@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## 📝 Environment Variables

### Backend .env file
Create `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/finapp
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=3000
UPLOAD_DIR=./uploads
```

### Mobile .env file
Create `mobile/.env`:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_FCM_PROJECT_ID=your_project_id
```

---

## 🚨 Common Errors & Solutions

### Error: "npm: The term 'npm' is not recognized"
**Solution**: 
```powershell
# Restart PowerShell
# Or reinstall Node.js with PATH checked

# Verify:
node --version
npm --version
```

### Error: "Port 3000 already in use"
**Solution**: Use different port
```powershell
set PORT=3001
npm run dev
```

### Error: "Cannot find module 'express'"
**Solution**: Run npm install
```powershell
cd backend
npm install
```

### Error: "EACCES: permission denied"
**Solution**: This shouldn't happen on Windows, but if it does:
```powershell
npm install -g npm
npm install --no-optional
```

---

## 📚 Documentation Files

- **NODE_SETUP_GUIDE.md** - Step-by-step Node.js setup
- **BUG_FIXES_REPORT.md** - Detailed bug analysis
- **BUG_ANALYSIS_SUMMARY.md** - Quick summary
- **IMPLEMENTATION_GUIDE.md** - Technical documentation
- **API_ENDPOINTS.md** - API reference
- **QUICK_START.md** - Getting started

---

## ✅ Success Checklist

After running all commands:

- [ ] Node.js installed and verified
- [ ] All npm installs completed without errors
- [ ] Backend compiles without errors (`npx tsc --noEmit`)
- [ ] Admin compiles without errors (`npx tsc --noEmit`)
- [ ] Backend server starts successfully
- [ ] Health check returns OK
- [ ] Admin dashboard loads
- [ ] Mobile builds without errors

---

## 🎯 Done Checklist (Your Next Steps)

1. [ ] **Install Node.js** - https://nodejs.org/
2. [ ] **Restart PowerShell**
3. [ ] **Run**: `node --version`
4. [ ] **Tell me the version number**
5. [ ] **I'll run all remaining commands**

---

## 💬 Support

If anything fails:
1. Copy the error message
2. Tell me which command failed
3. I'll fix it immediately

Example:
```
"I ran: npm install in backend
Got error: EACCES: permission denied, mkdir '/uploads'
Running on: Windows 10"
```

---

## 📊 Installation Time Estimate

| Task | Time |
|------|------|
| Node.js Install | 10 min |
| Backend npm install | 2 min |
| Admin npm install | 1 min |
| Mobile npm install | 3 min |
| Testing | 5 min |
| **Total** | **~21 minutes** |

---

**Ready to proceed? Install Node.js and let me know!** 🚀
