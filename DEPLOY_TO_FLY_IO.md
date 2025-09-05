# Deploying EcoTracker to Fly.io and Vercel

This guide will walk you through deploying your EcoTracker application with Vercel (frontend) and Fly.io (backend).

## Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) installed
- [GitHub](https://github.com/) account
- [Vercel](https://vercel.com/) account (free)
- [Fly.io](https://fly.io/) account (free)

## Step 1: Prepare Your GitHub Repository

1. Create a new repository on GitHub
2. Initialize Git in your project folder and push the code:

```bash
# Navigate to your project folder
cd "C:\Users\pkaiy\Desktop\MISC\ESG Hackathon"

# Initialize Git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ecotracker.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy Backend to Fly.io

1. Install the Fly.io CLI:

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

2. Log in to Fly.io:
```bash
fly auth login
```

3. Launch the application:
```bash
# Navigate to your project root (with fly.toml)
cd "C:\Users\pkaiy\Desktop\MISC\ESG Hackathon"

# Create and deploy the app
fly launch --name ecotracker-api
```
   - When prompted, select "No" for PostgreSQL and Redis
   - Select "No" for deploying now
   - This will create the app on Fly.io

4. Deploy your application:
```bash
fly deploy
```

5. Get your application URL:
```bash
fly apps open
```
   - This will open your application in the browser
   - Note the URL, it should be something like `https://ecotracker-api.fly.dev`

## Step 3: Update Frontend Configuration

1. Open `ecotracker/src/config.ts`
2. Replace `https://ecotracker-api.fly.dev` with your actual Fly.io application URL
3. Commit and push the changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/) and log in
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: ecotracker
   - Build Command: npm run build
   - Output Directory: dist
5. Click "Deploy"
6. Once deployed, Vercel will provide a URL for your application

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://ecotracker-xyz.vercel.app`)
2. Test the application functionality
3. Check that it's connecting to your Fly.io backend

## Troubleshooting

### If the backend isn't connecting:
1. Check CORS settings in `server.py`
2. Make sure your API URL in `config.ts` is correct
3. Check Fly.io logs: `fly logs`

### If the frontend has build errors:
1. Check the build logs on Vercel
2. Make sure all dependencies are in package.json
3. Test the build locally: `cd ecotracker && npm run build`

## Updating Your Application

### Backend Updates:
```bash
# After making changes
git add .
git commit -m "Update backend"
git push
fly deploy
```

### Frontend Updates:
Just push to GitHub and Vercel will automatically redeploy:
```bash
git add .
git commit -m "Update frontend"
git push
```
