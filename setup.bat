@echo off
echo.
echo ========================================
echo  Ananda Marga BD - Project Setup
echo ========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js installed nei!
    echo nodejs.org theke LTS version download koro
    pause
    exit
)
echo [OK] Node.js found

:: Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git installed nei!
    echo git-scm.com theke download koro
    pause
    exit
)
echo [OK] Git found

echo.
echo [1/4] Frontend packages install hocche...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install fail!
    pause
    exit
)
echo [OK] Frontend packages ready
cd ..

echo.
echo [2/4] Backend packages install hocche...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend install fail!
    pause
    exit
)
echo [OK] Backend packages ready
cd ..

echo.
echo [3/4] .env files check...
if not exist "frontend\.env" (
    echo [WARNING] frontend\.env file nai!
    echo Nicher template diye frontend\.env banao:
    echo.
    echo VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
    echo VITE_SUPABASE_ANON_KEY=your_anon_key
    echo VITE_API_URL=http://localhost:5000/api
    echo.
)
if not exist "backend\.env" (
    echo [WARNING] backend\.env file nai!
    echo Nicher template diye backend\.env banao:
    echo.
    echo NODE_ENV=development
    echo PORT=5000
    echo CLIENT_URL=http://localhost:5173
    echo SUPABASE_URL=https://YOUR_PROJECT.supabase.co
    echo SUPABASE_ANON_KEY=your_anon_key
    echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    echo.
)

echo.
echo [4/4] Git initialize...
git init
git add .
git commit -m "Initial commit - Ananda Marga BD"
echo [OK] Git ready

echo.
echo ========================================
echo  Setup complete!
echo ========================================
echo.
echo Ekhon 2ta terminal kholo:
echo.
echo  Terminal 1 (Frontend):
echo    cd frontend
echo    npm run dev
echo    Browser: http://localhost:5173
echo.
echo  Terminal 2 (Backend):
echo    cd backend
echo    npm run dev
echo    API: http://localhost:5000
echo.
pause