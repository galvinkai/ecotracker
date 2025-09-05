# EcoTracker - Your Personal Carbon Footprint Companion

EcoTracker helps you track and analyze your carbon footprint from financial transactions. The application consists of a React frontend and a Python Flask backend.

## Deployment Options

You have multiple options for deploying EcoTracker:

1. **Fly.io + Vercel (Recommended)**: Deploy the backend to Fly.io and the frontend to Vercel. This is the most flexible option and provides good performance.
   - Follow our [detailed Fly.io deployment guide](./DEPLOY_TO_FLY_IO.md)
   - Use the [deployment helper script](./deploy-helper.bat) for step-by-step assistance
   - Check the [deployment checklist](./DEPLOYMENT_CHECKLIST.md) to ensure everything is set up correctly

2. **Railway.app + Vercel**: Deploy the backend to Railway.app and the frontend to Vercel.

3. **Render.com + Vercel**: Deploy the backend to Render.com and the frontend to Vercel.

## Deployment Tools

We've created several tools to help with deployment:

- `deploy-helper.bat`: Interactive script to guide you through the deployment process
- `DEPLOY_TO_FLY_IO.md`: Comprehensive guide for deploying to Fly.io
- `DEPLOYMENT_CHECKLIST.md`: Checklist to ensure successful deployment
- `deployment_health_check.py`: Script to verify your backend deployment is working correctly

## Quick Start: Deploying to Fly.io and Vercel

### Prerequisites
- GitHub account
- Vercel account (for frontend deployment)
- Fly.io account (for backend deployment)
- Fly CLI installed
- Vercel CLI installed

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

### Step 2: Deploy the Backend to Fly.io
1. Run the deployment helper script:
```bash
deploy-helper.bat
```
2. Follow the prompts to deploy your backend to Fly.io
3. Alternatively, follow the instructions in `DEPLOY_TO_FLY_IO.md`

### Step 3: Deploy the Frontend to Vercel
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

### Step 4: Test Your Deployment
1. Run the health check script to verify your backend:
```bash
python deployment_health_check.py https://your-backend-url.fly.dev
```
2. Visit your Vercel frontend URL to test the complete application

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
