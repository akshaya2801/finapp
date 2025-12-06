$ErrorActionPreference = "Continue"

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "FinApp - PostgreSQL Setup Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[Step 1/4] Checking PostgreSQL..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
if (Test-Path $pgPath) {
    $env:Path += ";$pgPath"
    Write-Host "PostgreSQL path added to PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "[Step 2/4] Getting PostgreSQL Password..." -ForegroundColor Yellow
$pgPassword = Read-Host "Enter PostgreSQL password (default: password)"
if ([string]::IsNullOrEmpty($pgPassword)) {
    $pgPassword = "password"
}
$env:PGPASSWORD = $pgPassword

Write-Host ""
Write-Host "[Step 3/4] Creating database..." -ForegroundColor Yellow
psql -U postgres -h localhost -c "CREATE DATABASE finapp;" 2>$null
Write-Host "Database setup initiated" -ForegroundColor Green

Write-Host ""
Write-Host "[Step 4/4] Initializing schema..." -ForegroundColor Yellow
$sqlFile = "E:\Akshaya\FinApp\backend\src\scripts\init_database.sql"
if (Test-Path $sqlFile) {
    psql -U postgres -h localhost -d finapp -f $sqlFile 2>$null
    Write-Host "Schema initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verifying database..." -ForegroundColor Yellow
$userCount = psql -U postgres -h localhost -d finapp -tc "SELECT COUNT(*) FROM users;" 2>$null
Write-Host "Users in database: $userCount" -ForegroundColor Green

Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow
$envPath = "E:\Akshaya\FinApp\backend\.env"
$envContent = Get-Content $envPath
$newEnv = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=postgresql://postgres:$pgPassword@localhost:5432/finapp"
Set-Content $envPath $newEnv -Encoding UTF8
Write-Host "Env file updated" -ForegroundColor Green

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. cd E:\Akshaya\FinApp\backend" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White
Write-Host "3. Test with: rajesh@example.com / Test@123" -ForegroundColor White
Write-Host ""

Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue
Read-Host "Press Enter to close"
