# EcoTracker Deployment Checklist

Use this checklist to deploy your EcoTracker application to Fly.io and Vercel.

## Prerequisites

- [ ] Git installed and configured
- [ ] Node.js and npm installed
- [ ] Fly.io CLI installed
- [ ] Vercel CLI installed
- [ ] GitHub account set up
- [ ] Fly.io account created
- [ ] Vercel account created

## Backend Deployment (Fly.io)

- [ ] Run `fly auth login` to authenticate with Fly.io
- [ ] Navigate to the project root directory
- [ ] Make sure `requirements.txt` includes all necessary packages
- [ ] Verify that `Dockerfile` is correctly configured
- [ ] Run `fly launch --dockerfile Dockerfile --name ecotracker-api`
- [ ] Select a region close to your users
- [ ] Run `fly deploy` to deploy the backend
- [ ] Test the backend API at `https://ecotracker-api.fly.dev/transactions`

## Frontend Configuration

- [ ] Update the API URL in `ecotracker/src/config.ts`
- [ ] Replace `https://ecotracker-api.fly.dev` with your actual Fly.io app URL
- [ ] Commit and push changes to GitHub

## Frontend Deployment (Vercel)

- [ ] Make sure `package.json` includes all necessary dependencies
- [ ] Run `cd ecotracker && vercel` to deploy to Vercel
- [ ] Follow the prompts to configure your project
- [ ] Test your deployed frontend
- [ ] Verify that the frontend connects to the backend successfully

## Post-Deployment

- [ ] Test all functionality in the production environment
- [ ] Check that transactions load correctly
- [ ] Verify that the carbon footprint calculations work
- [ ] Test adding new transactions
- [ ] Check that the insights panel displays correctly

## Troubleshooting

- [ ] If you encounter CORS issues, update the CORS settings in `server.py`
- [ ] If you have connection issues, check the API URL in `config.ts`
- [ ] To view backend logs, run `fly logs`
- [ ] To view frontend build logs, check the Vercel dashboard

## Updating Your Application

- [ ] For backend updates, commit changes and run `fly deploy`
- [ ] For frontend updates, commit changes and Vercel will auto-deploy
