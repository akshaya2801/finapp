# README — Finance Firm Customer Ticketing Mobile App (APK Distribution Only)

## 1. Project Overview
This project is a mobile-only Android application for a small finance firm. It enables customers to raise support tickets related to:
- Life Insurance
- General Insurance
- Health Insurance
- Vehicle Insurance
- Home Insurance
- Loans
- Mutual Funds
- SIPs
- Alternate Investments
- Other financial services

The app will NOT be published on Google Play Store. It will be distributed as an APK file directly to customers (side-loading).

The system must be simple, secure, lightweight, and fully FREE to deploy (no paid services).

---------------------------------------------------------------------

## 2. Core Features (MVP)

### Authentication
- Register with Name, Phone, Email, Password
- Login with Email + Password
- Secure token storage (access + refresh tokens)
- Auto-login using stored token
- Logout

### Ticket Management
- Create a support ticket
- Fields: Title, Description, Category, Priority, Attachments
- Categories include: Life Insurance, General Insurance, Health Insurance, Vehicle Insurance, Home Insurance, Loans, Mutual Funds, SIPs, Alternate Investments, Other
- Upload images, PDFs, and documents

### Ticket Tracking
- View list of tickets
- Filter by status: Open, In Progress, Resolved, Closed
- View ticket details
- Full conversation thread with support agent
- Send message replies + attachments

### Notifications
- Local notifications when ticket status updates
- Optional: Free push notifications using Firebase Cloud Messaging (FCM)

### Offline Support
- Save ticket as draft if offline
- Auto-sync when back online

### Admin Panel
- Web-based admin dashboard
- Admin login
- View all tickets
- Reply to customers
- Update ticket status

---------------------------------------------------------------------

## 3. Technology Stack (All Free)

### Mobile App (APK Only)
- React Native CLI (TypeScript)
- React Navigation
- Axios for API communication
- AsyncStorage + Encrypted Storage for tokens
- react-native-image-picker for camera/gallery
- react-native-document-picker for PDF/doc files
- Firebase Cloud Messaging (free) for notifications
- Android Studio for building APK

### Backend (Free Deployment Options)
- Node.js + Express.js
- JWT-based authentication
- PostgreSQL Database (Free)
- Multer for file uploads (local storage)
- Free Hosting Options:
  - Railway Free Tier
  - Render Free Tier
  - Supabase Free Tier (database + storage)
  - Neon Free Tier (database)
  - Local Machine Server (optional)

### Database (Free PostgreSQL)
Tables required:
- users
- tickets
- messages
- attachments
- devices (for notifications)

### File Storage (Free)
Choose one:
- Local file system storage (recommended for small firm)
- Supabase Storage Free Tier
- Cloudinary Free Tier

---------------------------------------------------------------------

## 4. API Requirements (Backend Contract)

### Authentication
POST /auth/register  
POST /auth/login  
POST /auth/refresh  

### Tickets
POST /tickets  
GET  /tickets  
GET  /tickets/:ticketId  
PUT  /tickets/:ticketId/status  

### Messages
GET  /tickets/:ticketId/messages  
POST /tickets/:ticketId/messages  

### Attachments
POST /attachments/upload-init  
POST /attachments/complete  

### Devices (Optional)
POST /devices/register  

All API responses must be JSON.

---------------------------------------------------------------------

## 5. Mobile App Folder Structure

src/
  api/
    auth.ts
    tickets.ts
    messages.ts
    attachments.ts
  screens/
    LoginScreen.tsx
    RegisterScreen.tsx
    HomeScreen.tsx
    TicketListScreen.tsx
    TicketDetailScreen.tsx
    NewTicketScreen.tsx
    ProfileScreen.tsx
  components/
    Button.tsx
    Input.tsx
    TicketCard.tsx
  store/
    store.ts
    authSlice.ts
    ticketSlice.ts
    messageSlice.ts
  services/
    notifications.ts
    offlineQueue.ts
  utils/
    upload.ts
    token.ts
  assets/

android/
ios/
package.json
README.md

---------------------------------------------------------------------

## 6. Implementation Steps

### Step 1 — Setup Project
- Setup React Native CLI project with TypeScript
- Setup navigation, axios, and token interceptor
- Setup AsyncStorage + EncryptedStorage

### Step 2 — Authentication
- Implement Register and Login screens
- Use JWT token storage
- Implement refresh token flow

### Step 3 — Tickets
- Create ticket form
- Category selection
- Attachment upload
- Save drafts offline
- Submit ticket via API

### Step 4 — Ticket List and Details
- Fetch list of tickets
- Filter by status
- Ticket detail with conversation thread

### Step 5 — Messages
- Chat-style messaging UI
- Send text + attachments
- Load previous messages

### Step 6 — Notifications
- Implement local notifications
- Optional: FCM push notifications
- Register device token using API

### Step 7 — APK Build
- Generate Android keystore
- Configure gradle signing
- Build APK using:
  ./gradlew assembleRelease
- Output must be stored in /release directory

### Step 8 — Admin Panel (Web)
- Admin login screen
- Ticket list view
- Ticket detail + reply
- Change ticket status

### Step 9 — Deployment (Free Only)
- Host backend on Railway / Render free plan
- Database on Supabase / Neon / Railway free tier
- File storage locally or on Supabase Storage
- Admin panel on Netlify (free)

---------------------------------------------------------------------

## 7. Database Models

### users
id (uuid)  
name  
email  
phone  
passwordHash  
role (customer/admin)  
createdAt  

### tickets
id  
userId  
category  
title  
description  
priority  
status  
createdAt  
updatedAt  

### messages
id  
ticketId  
senderId  
text  
attachments[]  
createdAt  

### attachments
id  
ticketId  
messageId  
fileUrl  
fileName  
fileType  
uploadedAt  

### devices
id  
userId  
deviceId  
fcmToken  
createdAt  

---------------------------------------------------------------------

## 8. APK Installation Guide (For Customers)
1. Download the APK file.
2. Go to Settings → Security → Install unknown apps.
3. Allow installation from your browser or file manager.
4. Open the APK to install.
5. Launch the app.

---------------------------------------------------------------------

## 9. Security Requirements
- All API communication must use HTTPS
- Store passwords hashed (bcrypt)
- Use JWT for authentication
- Enforce role-based access
- Limit attachment size
- Validate all user inputs
- No secrets inside the mobile app code

---------------------------------------------------------------------

## 10. Free Deployment Flow

### Backend Deployment (Free)
- Deploy Node.js backend to Railway / Render free plan
- Connect to PostgreSQL (Supabase/Neon/Railway free tier)
- Store uploads in “/uploads” folder or Supabase Storage

### Mobile App
- Build APK locally
- Distribute via email, WhatsApp, website link

### Admin Panel
- Deploy admin dashboard to Netlify (free)

---------------------------------------------------------------------

## 11. Final Deliverables

### Mobile App (React Native)
- Complete source code
- Signed release APK

### Backend (Node.js + Express)
- API endpoints
- DB configuration
- Attachment upload logic
- Admin panel

### Documentation
- Installation guide
- API documentation
- Admin usage guide

---------------------------------------------------------------------

# END OF README
