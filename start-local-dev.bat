@echo off
echo ==================================
echo EcoTracker Local Development Setup
echo ==================================
echo.
echo This script will help you set up EcoTracker for local development.
echo.

:menu
echo Choose an action:
echo 1. Set up Python backend
echo 2. Set up React frontend
echo 3. Run both backend and frontend
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto setup_backend
if "%choice%"=="2" goto setup_frontend
if "%choice%"=="3" goto run_both
if "%choice%"=="4" goto end

echo Invalid choice. Please try again.
goto menu

:setup_backend
echo.
echo Setting up Python backend...
echo.

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in your PATH.
    echo Please install Python from https://www.python.org/downloads/
    pause
    goto menu
)

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Backend setup complete!
echo To run the backend, use: python server.py
echo.
pause
goto menu

:setup_frontend
echo.
echo Setting up React frontend...
echo.

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js/npm is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    goto menu
)

echo Installing frontend dependencies...
cd ecotracker
npm install
cd ..

echo.
echo Frontend setup complete!
echo To run the frontend, use: cd ecotracker && npm run dev
echo.
pause
goto menu

:run_both
echo.
echo Running both backend and frontend...
echo.

echo Starting backend in a new window...
start cmd /k "call venv\Scripts\activate.bat && python server.py"

echo Starting frontend in a new window...
start cmd /k "cd ecotracker && npm run dev"

echo.
echo Started both applications!
echo.
echo - The backend is running at http://localhost:8080
echo - The frontend is running at http://localhost:5173
echo.
echo Press any key to return to the menu...
pause >nul
goto menu

:end
echo.
echo Thank you for using EcoTracker!
echo.
pause
