# EcoTracker Deployment Tools Guide

This document provides an overview of all the deployment tools available in this project and how to use them effectively.

## Available Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `DEPLOY_TO_FLY_IO.md` | Detailed guide for deploying to Fly.io | When you want step-by-step instructions for Fly.io deployment |
| `deploy-helper.bat` | Interactive script for guided deployment | When you want a guided deployment experience |
| `DEPLOYMENT_CHECKLIST.md` | Checklist for successful deployment | Before and during deployment to ensure all steps are completed |
| `deployment_health_check.py` | Script to verify backend deployment | After deploying to check if your backend is working correctly |
| `start-local-dev.bat` | Interactive script for local development setup | When setting up local development environment |
| `README_UPDATED.md` | Updated README with deployment information | For a comprehensive overview of the project and deployment options |

## Usage Guide

### For First-Time Deployment

If this is your first time deploying EcoTracker, follow these steps:

1. **Prepare**: Review the `DEPLOYMENT_CHECKLIST.md` to ensure you have all prerequisites.
2. **Guided Deployment**: Run `deploy-helper.bat` and follow the interactive prompts.
3. **Verify**: After deployment, run `python deployment_health_check.py https://your-backend-url.fly.dev` to check if your backend is working correctly.

### For Local Development

If you want to set up the project for local development:

1. Run `start-local-dev.bat`
2. Choose the appropriate option to set up backend, frontend, or both.

### For Manual Deployment

If you prefer to deploy manually:

1. Follow the instructions in `DEPLOY_TO_FLY_IO.md` for backend deployment.
2. Deploy the frontend to Vercel as described in the README.

### For Troubleshooting

If you encounter issues during deployment:

1. Check the backend logs with `fly logs` (for Fly.io).
2. Review the frontend build logs in the Vercel dashboard.
3. Run `python deployment_health_check.py https://your-backend-url.fly.dev` to diagnose backend issues.
4. Ensure your API URL is correctly configured in `ecotracker/src/config.ts`.

## Updating Your Deployment

After making changes to your application:

### Backend Updates

```bash
# Commit your changes
git add .
git commit -m "Update backend"
git push

# Deploy the changes
fly deploy
```

### Frontend Updates

```bash
# Commit your changes
git add .
git commit -m "Update frontend"
git push
```

Vercel will automatically redeploy your frontend when changes are pushed to GitHub.

## Frequently Asked Questions

### Q: How do I update the API URL after deployment?
A: Edit `ecotracker/src/config.ts` to set the `API_URL` to your deployed backend URL.

### Q: How do I scale my application on Fly.io?
A: Use the commands `fly scale memory 512` and `fly scale cpu 1` to adjust resources.

### Q: Can I deploy to other platforms?
A: Yes, EcoTracker can be deployed to any platform that supports Python and Node.js applications.

### Q: How do I monitor my deployment?
A: Use `fly status` and `fly logs` for backend monitoring, and the Vercel dashboard for frontend monitoring.
