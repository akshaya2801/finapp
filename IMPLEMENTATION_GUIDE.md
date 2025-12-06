# FinApp - Finance Firm Customer Ticketing System

A complete, production-ready customer support ticketing application for finance firms. This project includes a React Native Android mobile app, Node.js/Express backend, and a React admin web dashboard.

## Project Structure

```
FinApp/
├── backend/                 # Node.js + Express API server
│   ├── src/
│   │   ├── index.ts        # Main Express app
│   │   ├── db.ts           # Database connection
│   │   ├── middleware/     # Authentication & authorization
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # JWT, validation utilities
│   │   └── scripts/        # Database initialization
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── mobile/                  # React Native Android App
│   ├── src/
│   │   ├── App.tsx         # Navigation & routing
│   │   ├── screens/        # Screen components
│   │   ├── components/     # Reusable components
│   │   ├── store/          # Redux state management
│   │   ├── api/            # API service calls
│   │   ├── utils/          # Token, upload, utilities
│   │   └── services/       # Notifications, offline queue
│   ├── android/            # Android native configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── app.json
│
├── admin/                   # React Web Admin Dashboard
│   ├── src/
│   │   ├── api/            # Admin API calls
│   │   ├── pages/          # Page components
│   │   ├── components/     # UI components
│   │   ├── store/          # State management
│   │   └── App.tsx         # Main app
│   ├── package.json
│   └── tsconfig.json
│
└── readme.txt             # Original requirements
```

## Features

### ✅ Authentication
- User registration with email, phone, name, password
- JWT-based login/logout
- Refresh token flow for token renewal
- Secure token storage (encrypted on mobile)
- Auto-login on app start

### ✅ Ticket Management
- Create support tickets with:
  - Title, Description, Category, Priority
  - File attachments (images, PDFs, documents)
  - Category selection (10 finance-related options)
  - Priority levels: Low, Normal, High, Urgent
- View all tickets with filtering by status
- Real-time ticket status updates
- Ticket drafts for offline mode

### ✅ Messaging
- Chat-style conversation thread per ticket
- Send text messages + attachments
- View complete message history
- Message timestamps and sender information

### ✅ Notifications
- Local notifications on ticket status changes
- Firebase Cloud Messaging (FCM) for push notifications
- Device registration for notifications

### ✅ Offline Support
- Draft tickets saved locally
- Auto-sync when connection restored
- Offline message queue

### ✅ Admin Dashboard
- Admin login
- View all customer tickets
- Reply to customer messages
- Update ticket status
- Customer communication log

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (free tier compatible)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: multer
- **CORS**: Express CORS

### Mobile App
- **Framework**: React Native (TypeScript)
- **Navigation**: React Navigation (Stack & Tab)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Storage**: AsyncStorage + Encrypted Storage
- **File Picking**: react-native-image-picker, react-native-document-picker
- **Icons**: react-native-vector-icons
- **Notifications**: Firebase Cloud Messaging

### Admin Dashboard
- **Framework**: React
- **Styling**: CSS/Tailwind (to be added)
- **Routing**: React Router
- **State Management**: Zustand
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js v16+ and npm/yarn
- PostgreSQL database (local or cloud)
- Android Studio (for mobile development)
- React Native CLI

### 1. Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Initialize database
npm run db:init

# Start development server
npm run dev
```

Environment variables to set in `.env`:
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/finapp_db
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

### 2. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Link native modules
npx react-native link

# Update API base URL in src/utils/axios.ts
# Change API_BASE_URL to your backend URL

# Build and run APK
npm run build:android

# Or run on connected device
npm run android
```

### 3. Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Update API base URL in src/api/admin.ts
# Start development server
npm start

# Build for production
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login customer
- `POST /api/auth/refresh` - Refresh access token

### Tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - Get user's tickets (with optional status filter)
- `GET /api/tickets/:ticketId` - Get ticket details
- `PUT /api/tickets/:ticketId/status` - Update ticket status

### Messages
- `GET /api/messages/ticket/:ticketId` - Get conversation messages
- `POST /api/messages/:ticketId` - Send new message

### Attachments
- `POST /api/attachments/upload` - Upload file
- `DELETE /api/attachments/:attachmentId` - Delete attachment

### Devices
- `POST /api/devices/register` - Register device for notifications

## Database Schema

### users
```sql
id (UUID) - Primary key
name (VARCHAR)
email (VARCHAR) - Unique
phone (VARCHAR)
password_hash (VARCHAR)
role (VARCHAR) - 'customer' or 'admin'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### tickets
```sql
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
category (VARCHAR)
title (VARCHAR)
description (TEXT)
priority (VARCHAR) - 'low', 'normal', 'high', 'urgent'
status (VARCHAR) - 'open', 'in_progress', 'resolved', 'closed'
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### messages
```sql
id (UUID) - Primary key
ticket_id (UUID) - Foreign key to tickets
sender_id (UUID) - Foreign key to users
text (TEXT)
created_at (TIMESTAMP)
```

### attachments
```sql
id (UUID) - Primary key
ticket_id (UUID) - Foreign key to tickets
message_id (UUID) - Foreign key to messages
file_url (VARCHAR)
file_name (VARCHAR)
file_type (VARCHAR)
file_size (INTEGER)
uploaded_at (TIMESTAMP)
```

## Security Features

✅ **Authentication**
- JWT-based authentication with access and refresh tokens
- Secure token storage on mobile (encrypted)
- Automatic token refresh flow

✅ **Authorization**
- Role-based access control (customer/admin)
- Users can only see their own tickets
- Admin-only endpoints protected

✅ **Data Protection**
- Password hashing with bcrypt
- HTTPS enforced in production
- Input validation on all endpoints
- SQL injection prevention with parameterized queries

✅ **File Security**
- File type validation
- File size limits (10MB default)
- Secure file storage

## Deployment

### Backend Deployment Options

#### Option 1: Railway (Recommended)
1. Sign up at railway.app
2. Connect GitHub repository
3. Configure environment variables
4. Deploy

#### Option 2: Render
1. Sign up at render.com
2. Create new Web Service
3. Connect GitHub
4. Deploy

#### Option 3: Local Machine
```bash
cd backend
npm run build
npm start
```

### Database Deployment

#### Option 1: Supabase (Recommended)
- Free PostgreSQL database
- Built-in storage for files
- Dashboard management

#### Option 2: Railway
- Free PostgreSQL tier
- Integrated with backend

#### Option 3: Neon
- Serverless PostgreSQL
- Free tier available

### Admin Dashboard Deployment

#### Netlify
```bash
# Build project
npm run build

# Deploy via Netlify CLI
netlify deploy --prod --dir=build
```

#### Vercel
```bash
npm run build
# Deploy via Vercel CLI or push to GitHub
```

## APK Build & Distribution

### Generate Signing Key
```bash
keytool -genkey -v -keystore finapp.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias finapp
```

### Configure Gradle Signing
Edit `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        keyAlias 'finapp'
        keyPassword 'your_password'
        storeFile file('../../finapp.keystore')
        storePassword 'your_password'
    }
}
```

### Build Release APK
```bash
cd mobile
npm run prebuild:android  # Clean build
npm run build:android     # Build release APK
```

APK will be generated at:
```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

### Distribution
1. Share via email or WhatsApp
2. Host on company website
3. Use deployment services (Firebase Hosting, etc.)

## Testing

### Mobile App Testing
```bash
# Run on Android emulator
npm run android

# Run on connected device
adb devices
npm run android
```

### Backend Testing
```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

## Troubleshooting

### Mobile App Issues

**"Cannot find module" errors**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

**Android build fails**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
cd ..
```

### Backend Issues

**Database connection error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb finapp_db`

**Port already in use**
```bash
# Change PORT in .env or kill existing process
lsof -i :3000
kill -9 <PID>
```

### API Connection Issues

**Mobile can't reach backend**
- Update API_BASE_URL to your backend IP
- Ensure firewall allows connections
- Check if backend is running

## Performance Optimization

### Mobile App
- Lazy loading of ticket lists
- Image compression before upload
- Offline draft support to reduce network calls
- Redux for efficient state management

### Backend
- Database indexing on frequently queried fields
- Connection pooling with pg
- Pagination for ticket lists (to be implemented)
- Gzip compression for responses

## Future Enhancements

- [ ] Pagination for ticket lists
- [ ] Search functionality
- [ ] Advanced filtering
- [ ] File preview before upload
- [ ] Image gallery for attachments
- [ ] Two-factor authentication (2FA)
- [ ] Multi-language support
- [ ] Dark mode for mobile app
- [ ] Real-time websocket updates
- [ ] Analytics dashboard
- [ ] Customer satisfaction ratings
- [ ] Knowledge base/FAQ

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## License

MIT License - feel free to use for your finance firm

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check backend logs: `npm run dev`
- Mobile logs: `react-native log-android`

## Security Checklist for Production

- [ ] Change all default secrets (JWT_SECRET, etc.)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure CORS for allowed domains
- [ ] Enable rate limiting on API
- [ ] Set up monitoring and logging
- [ ] Configure database encryption
- [ ] Review and adjust file size limits
- [ ] Set up automated security updates
- [ ] Configure CI/CD pipeline
- [ ] Test security vulnerabilities
- [ ] Set up DDoS protection

## License & Contact

Created for finance firm customer support system.
Built with ❤️ using modern open-source technologies.

---

**Last Updated**: December 2025
**Version**: 1.0.0
