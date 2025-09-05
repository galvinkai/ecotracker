# EcoTracker - Your Personal Carbon Footprint Companion

EcoTracker helps you track and analyze your carbon footprint from financial transactions. The application consists of a React frontend and a Python Flask backend.

## Deployment Guide

### Prerequisites
- GitHub account
- Vercel account (for frontend deployment)
- Railway.app or Render.com account (for backend deployment)

### Step 1: Prepare Your Repository
1. Create a new GitHub repository
2. Push your code to the repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/YOURREPO.git
git push -u origin main
```

### Step 2: Deploy the Frontend on Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in (you can use your GitHub account)
3. Click "Add New..." > "Project"
4. Import your GitHub repository
5. Configure your project:
   - Framework Preset: Vite
   - Root Directory: ecotracker
   - Build Command: npm run build
   - Output Directory: dist
6. Click "Deploy"

### Step 3: Deploy the Backend

#### Option A: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app/)
2. Sign up or log in
3. Create a new project
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. In settings, set these variables:
   - ROOT_DIRECTORY: .
   - PORT: 5050
   - RAILWAY_DOCKERFILE_PATH: Dockerfile

#### Option B: Deploy on Render.com
1. Go to [Render.com](https://render.com/)
2. Sign up or log in
3. Create a new Web Service
4. Connect your GitHub repository
5. Set the start command: `python server.py`
6. Set environment variable: PORT=5050

### Step 4: Update the API Base URL
1. Once your backend is deployed, you need to update the API base URL in the frontend
2. Edit `ecotracker/src/config.ts` and change the API_URL to your backend URL
3. Commit and push your changes:
```bash
git add .
git commit -m "Update API URL"
git push
```
4. Vercel will automatically redeploy your app with the updated API URL

### Step 5: Test Your Deployed Application
Your app will be available at your Vercel URL (usually https://your-project-name.vercel.app)

## Local Development

### Run the Backend
```bash
# Navigate to the project root
cd /path/to/ESG Hackathon

# Install dependencies
pip install -r requirements.txt

# Start the server
python server.py
```

### Run the Frontend
```bash
# Navigate to the frontend directory
cd /path/to/ESG Hackathon/ecotracker

# Install dependencies
npm install

# Start the development server
npm run dev
```
