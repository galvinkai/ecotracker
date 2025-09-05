@echo off
echo ==================================
echo EcoTracker Deployment Helper
echo ==================================
echo.
echo This script will help you deploy EcoTracker to Fly.io and Vercel.
echo Please make sure you have the following installed:
echo - Git
echo - Node.js
echo - Fly.io CLI
echo.
echo 1. Install Fly.io CLI
echo 2. Deploy backend to Fly.io
echo 3. Deploy frontend to Vercel
echo 4. Update API URL in config.ts
echo 5. Exit
echo.

:menu
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto install_flyio
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_frontend
if "%choice%"=="4" goto update_config
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
goto menu

:install_flyio
echo.
echo Installing Fly.io CLI...
echo.
echo Run the following command in PowerShell:
echo iwr https://fly.io/install.ps1 -useb ^| iex
echo.
echo After installation, run: fly auth login
echo.
pause
goto menu

:deploy_backend
echo.
echo Deploying backend to Fly.io...
echo.
echo 1. Navigate to the project root:
echo    cd "%~dp0"
echo.
echo 2. Create the app on Fly.io:
echo    fly launch --name ecotracker-api
echo.
echo 3. Deploy the app:
echo    fly deploy
echo.
echo 4. Get your app URL:
echo    fly apps open
echo.
echo Note the URL (https://ecotracker-api.fly.dev) for the next step.
echo.
pause
goto menu

:deploy_frontend
echo.
echo Deploying frontend to Vercel...
echo.
echo 1. Push your code to GitHub if you haven't already
echo.
echo 2. Go to https://vercel.com/new
echo.
echo 3. Import your GitHub repository
echo.
echo 4. Configure the project:
echo    - Framework Preset: Vite
echo    - Root Directory: ecotracker
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo.
echo 5. Click "Deploy"
echo.
pause
goto menu

:update_config
echo.
echo Updating API URL in config.ts...
echo.
set /p api_url="Enter your Fly.io backend URL (e.g., https://ecotracker-api.fly.dev): "
echo.
echo Updating config.ts with URL: %api_url%
echo.
echo After updating, commit and push your changes:
echo git add .
echo git commit -m "Update API URL for production"
echo git push
echo.
pause
goto menu

:end
echo.
echo Thank you for using EcoTracker Deployment Helper!
echo.
pause
