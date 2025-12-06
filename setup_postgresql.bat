@echo off
REM PostgreSQL Automated Setup Script for FinApp
REM This script attempts to install PostgreSQL and set up the database

echo =============================================
echo FinApp - PostgreSQL Automated Setup
echo =============================================
echo.

REM Check if PostgreSQL is already installed
echo [1/5] Checking for existing PostgreSQL installation...
psql --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ PostgreSQL is already installed
    goto DATABASE_SETUP
) else (
    echo ✗ PostgreSQL not found
    goto INSTALL_POSTGRESQL
)

:INSTALL_POSTGRESQL
echo.
echo [2/5] Attempting PostgreSQL installation...
echo.
echo Option 1: Using Windows Package Manager (winget)
echo Checking if winget is available...

winget --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Installing PostgreSQL via winget...
    winget install PostgreSQL.PostgreSQL
    if %ERRORLEVEL% EQU 0 (
        echo ✓ PostgreSQL installed successfully
        goto DATABASE_SETUP
    )
)

echo.
echo Option 2: Using Chocolatey
echo Checking if chocolatey is available...

choco --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Installing PostgreSQL via chocolatey...
    choco install postgresql -y
    if %ERRORLEVEL% EQU 0 (
        echo ✓ PostgreSQL installed successfully
        goto DATABASE_SETUP
    )
)

echo.
echo ✗ Could not automatically install PostgreSQL
echo Please install manually from: https://www.postgresql.org/download/windows/
echo Then run this script again, or proceed to DATABASE_SETUP
echo.
pause
goto END

:DATABASE_SETUP
echo.
echo [3/5] Setting up PostgreSQL database...

REM Check if psql is available
psql --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ psql command not found. Adding PostgreSQL to PATH...
    set PATH=%PATH%;C:\Program Files\PostgreSQL\15\bin
)

REM Create database
echo Creating finapp database...
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'finapp'" | grep -q 1
if %ERRORLEVEL% EQU 0 (
    echo Database finapp already exists
) else (
    psql -U postgres -c "CREATE DATABASE finapp;"
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Database created successfully
    ) else (
        echo ✗ Failed to create database
    )
)

echo.
echo [4/5] Initializing database schema...
cd /d E:\Akshaya\FinApp\backend
psql -U postgres -d finapp -f src\scripts\init_database.sql
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database schema initialized
) else (
    echo ✗ Failed to initialize schema
)

echo.
echo [5/5] Verification...
psql -U postgres -d finapp -c "SELECT COUNT(*) as user_count FROM users;"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Database setup complete!
) else (
    echo ✗ Database verification failed
)

:END
echo.
echo =============================================
echo Setup Complete!
echo =============================================
echo.
echo Next steps:
echo 1. Update backend\.env with your PostgreSQL password
echo 2. Restart backend: cd backend && npm run dev
echo 3. Test login with sample credentials
echo.
echo Sample Users:
echo   Email: rajesh@example.com | Password: Test@123
echo   Email: priya@example.com  | Password: Test@123
echo   Email: admin@example.com  | Password: Test@123
echo.
pause
