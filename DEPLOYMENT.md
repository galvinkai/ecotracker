# Deployment Options for EcoTracker

This document outlines different ways to deploy the EcoTracker application so you can access it from any device.

## Table of Contents
- [Option 1: Vercel & Railway/Render (Full Stack)](#option-1-vercel--railwayrender-full-stack)
- [Option 2: GitHub Pages (Frontend Only)](#option-2-github-pages-frontend-only)
- [Option 3: Netlify or Firebase (Frontend Only)](#option-3-netlify-or-firebase-frontend-only)
- [Option 4: Self-hosting](#option-4-self-hosting)

## Option 1: Vercel & Railway/Render (Full Stack)

This option deploys both the frontend and backend to cloud services.

### Frontend: Vercel
1. Create a GitHub repository and push your code
2. Sign up at [Vercel](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: ecotracker
   - Build Command: npm run build
   - Output Directory: dist
5. Deploy

### Backend: Railway or Render
#### Railway
1. Sign up at [Railway](https://railway.app)
2. Create a new project and select your GitHub repository
3. Configure:
   - ROOT_DIRECTORY: .
   - PORT: 5050
   - RAILWAY_DOCKERFILE_PATH: Dockerfile

#### Render
1. Sign up at [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - Start Command: python server.py
   - Environment Variable: PORT=5050

### Connect Frontend to Backend
1. Get your backend URL from Railway or Render
2. Edit `ecotracker/src/config.ts` to update the API_URL
3. Commit and push changes

## Option 2: GitHub Pages (Frontend Only)

This option is simpler but will only deploy the frontend in offline mode with mock data.

1. Run the setup script: `node setup-github-pages.js`
2. Commit and push the changes
3. Go to your GitHub repository settings
4. Navigate to Settings > Pages
5. Set Source to "GitHub Actions"
6. Your app will be deployed to: https://[your-username].github.io/ecotracker/

## Option 3: Netlify or Firebase (Frontend Only)

### Netlify
1. Sign up at [Netlify](https://netlify.com)
2. Create a new site from Git
3. Connect to your GitHub repository
4. Configure:
   - Base directory: ecotracker
   - Build command: npm run build
   - Publish directory: dist
5. Deploy

### Firebase
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Select Hosting
5. Build the app: `cd ecotracker && npm run build`
6. Deploy: `firebase deploy`

## Option 4: Self-hosting

If you have a VPS or server, you can self-host both components.

### Prerequisites
- A server with a domain name
- Nginx or Apache installed
- Node.js and Python installed

### Steps
1. Clone your repository to the server
2. Set up the backend:
   ```bash
   cd /path/to/ESG\ Hackathon
   pip install -r requirements.txt
   # Use systemd or PM2 to keep the server running
   python server.py
   ```

3. Set up the frontend:
   ```bash
   cd /path/to/ESG\ Hackathon/ecotracker
   npm install
   npm run build
   ```

4. Configure Nginx:
   ```nginx
   # Frontend
   server {
       listen 80;
       server_name ecotracker.yourdomain.com;
       
       location / {
           root /path/to/ESG\ Hackathon/ecotracker/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   
   # Backend
   server {
       listen 80;
       server_name api.ecotracker.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5050;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. Set up SSL with Let's Encrypt

## Important Notes

- The backend requires the `trained_model.pkl` file to function correctly
- For public deployments, consider securing the API with authentication
- Update CORS settings in the server.py file to match your frontend domain
