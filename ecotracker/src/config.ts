// This file needs to be updated with your deployed backend URL after deployment
const API_CONFIG = {
  // Change this to your deployed backend URL after deployment
  // For local development: 'http://localhost:8080'
  // For Fly.io deployment: 'https://ecotracker-api.fly.dev'
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://ecotracker-api.fly.dev' 
    : 'http://localhost:8080'
};

export default API_CONFIG;
