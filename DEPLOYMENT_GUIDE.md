# FinApp Deployment Guide

Complete guide for deploying FinApp to Render with Neon PostgreSQL database.

## 📋 Prerequisites

- [ ] GitHub account with FinApp repository
- [ ] Neon account (https://neon.tech)
- [ ] Render account (https://render.com)

## Phase 1: Local Preparation ✅

### Landing Page
- ✅ Created `.env.example` and `.env.production` files
- ✅ Updated `LandingPage.tsx` to use environment variables
- ✅ Configured for dynamic portal URLs

### Environment Files Created
- ✅ `landing/.env.example` - Portal URLs configuration
- ✅ `backend/.env.example` - Database and API configuration  
- ✅ `admin/.env.example` - Backend API URL
- ✅ `user-web/.env.example` - Backend API URL

## Phase 2: Neon Database Setup

### Step 1: Create Neon Project

1. Go to https://neon.tech and sign in
2. Click "Create Project"
3. Choose a name: `finapp-db`
4. Select region (choose closest to your users)
5. Click "Create Project"

### Step 2: Get Connection String

1. In your Neon dashboard, click on your project
2. Go to "Connection Details"
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. **Save this securely** - you'll need it for Render

### Step 3: Initialize Database

The database tables should already exist from your local development. If not, run migrations on Render after deploying the backend.

## Phase 3: Deploy to Render

### Step 1: Deploy Backend

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `finapp-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   DATABASE_URL=<paste-your-neon-connection-string>
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=<generate-a-secure-random-string>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Copy the backend URL** (e.g., `https://finapp-backend.onrender.com`)

### Step 2: Deploy Admin Portal

1. Click "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name**: `finapp-admin`
   - **Root Directory**: `admin`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s build -l $PORT`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   REACT_APP_API_BASE_URL=<paste-backend-url-from-step-1>
   ```

5. Click "Create Web Service"
6. **Copy the admin URL** (e.g., `https://finapp-admin.onrender.com`)

### Step 3: Deploy User Portal

1. Click "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name**: `finapp-user`
   - **Root Directory**: `user-web`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   VITE_API_BASE_URL=<paste-backend-url-from-step-1>
   ```

5. Click "Create Web Service"
6. **Copy the user URL** (e.g., `https://finapp-user.onrender.com`)

### Step 4: Deploy Landing Page

1. Click "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name**: `finapp-landing`
   - **Root Directory**: `landing`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   VITE_ADMIN_URL=<paste-admin-url-from-step-2>
   VITE_USER_URL=<paste-user-url-from-step-3>
   ```

5. Click "Create Web Service"
6. **This is your main entry URL!** (e.g., `https://finapp-landing.onrender.com`)

### Step 5: Update Backend CORS

1. Go back to your backend service on Render
2. Update the `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://finapp-landing.onrender.com,https://finapp-admin.onrender.com,https://finapp-user.onrender.com
   ```
3. Save and redeploy

## Phase 4: Verification

### Test Checklist

1. **Landing Page**
   - [ ] Visit your landing page URL
   - [ ] Verify page loads with animations
   - [ ] Check both portal cards display correctly

2. **Navigation**
   - [ ] Click "Access Admin Portal" → Should navigate to admin
   - [ ] Click "Access User Portal" → Should navigate to user portal

3. **Admin Portal**
   - [ ] Login with admin credentials
   - [ ] View tickets dashboard
   - [ ] Check analytics page
   - [ ] Test ticket detail view

4. **User Portal**
   - [ ] Register a new user
   - [ ] Login with user credentials
   - [ ] Create a new ticket
   - [ ] View ticket list
   - [ ] Check ticket details

5. **End-to-End Flow**
   - [ ] User creates a ticket
   - [ ] Ticket appears in admin dashboard
   - [ ] Admin responds to ticket
   - [ ] User sees admin response

## 🚨 Common Issues & Solutions

### Issue: "This site can't be reached"
- **Solution**: Wait 5-10 minutes for Render to finish deployment
- Check Render dashboard for deployment status

### Issue: CORS errors in browser console
- **Solution**: Update backend `CORS_ORIGIN` environment variable with all frontend URLs

### Issue: Database connection errors
- **Solution**: Verify Neon connection string is correct in backend environment variables
- Check that Neon database is active (not paused)

### Issue: Environment variables not working
- **Solution**: After adding/updating env vars on Render, manually trigger a redeploy

### Issue: Build fails on Render
- **Solution**: Check build logs for specific errors
- Ensure `package.json` has correct build scripts
- Verify all dependencies are in `dependencies` (not `devDependencies`)

## 📝 Important Notes

- **Free Tier Limitations**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **Database**: Neon free tier has 0.5GB storage limit
- **Custom Domain**: You can add a custom domain in Render dashboard (Settings → Custom Domain)

## 🎯 Next Steps After Deployment

1. Test all functionality thoroughly
2. Set up monitoring (Render provides basic metrics)
3. Consider upgrading to paid tiers for production use
4. Set up automated backups for Neon database
5. Configure custom domain if needed

---

**Main Entry Point**: Your landing page URL is the main entry point for users!

Share this URL with your users: `https://finapp-landing.onrender.com`
