# Database Setup Guide

## PostgreSQL Installation

### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer, remember the password
3. Add PostgreSQL to PATH

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Local Development Setup

### 1. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE finapp_db;

# Create user (optional)
CREATE USER finapp_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE finapp_db TO finapp_user;

# Exit
\q
```

### 2. Configure Backend .env
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/finapp_db
# OR if using separate user:
DATABASE_URL=postgresql://finapp_user:secure_password@localhost:5432/finapp_db
```

### 3. Initialize Database Schema
```bash
cd backend
npm install
npm run db:init
```

This will create all required tables with proper indexes.

## Cloud Database Setup

### Option 1: Supabase (Recommended for Free Tier)

1. Sign up at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Set in .env:
```
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/postgres?sslmode=require
```

### Option 2: Railway

1. Sign up at https://railway.app
2. Create new PostgreSQL database
3. Copy DATABASE_URL
4. Set in backend .env

### Option 3: Neon

1. Sign up at https://neon.tech
2. Create project
3. Copy connection string
4. Set in backend .env

## Database Backup

### Backup PostgreSQL
```bash
pg_dump finapp_db > backup.sql
```

### Restore from Backup
```bash
psql finapp_db < backup.sql
```

## Database Monitoring

### Check Database Size
```bash
psql -U postgres -d finapp_db -c "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) FROM pg_database;"
```

### View Active Connections
```bash
psql -U postgres -d finapp_db -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check DATABASE_URL format
- Verify credentials

### Permission Denied
- Grant user privileges to database
- Check user authentication

### Disk Space Full
- Vacuum database: `VACUUM ANALYZE;`
- Delete old data or increase storage
