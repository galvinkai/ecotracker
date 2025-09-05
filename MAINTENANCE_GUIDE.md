# EcoTracker Maintenance Guide

This guide provides information on how to maintain, update, and troubleshoot your deployed EcoTracker application.

## Deployment Information

### Backend (Flask API)
- **Deployment Platform**: Fly.io
- **URL**: https://ecotracker-api.fly.dev
- **Repository**: https://github.com/galvinkai/ecotracker

### Frontend (React)
- **Deployment Platform**: Vercel
- **URL**: https://ecotracker-nx6xzr1lz-galvinkais-projects.vercel.app
- **Repository**: https://github.com/galvinkai/ecotracker (same repository, in the `/ecotracker` directory)

## Making Updates

### Backend Updates

1. Make changes to the server.py file or other backend components
2. Test changes locally
3. Commit changes to git
4. Push to GitHub
5. Deploy to Fly.io:
   ```
   flyctl deploy
   ```

### Frontend Updates

1. Make changes to the files in the `/ecotracker` directory
2. Test changes locally with `npm run dev`
3. Commit changes to git
4. Push to GitHub
5. Vercel will automatically deploy from GitHub, or you can manually deploy:
   ```
   cd ecotracker
   vercel --prod
   ```

## Database Considerations

The current implementation uses in-memory storage for transactions. For a production application, consider:

1. Adding a proper database like PostgreSQL or MongoDB
2. Updating the data access layer in server.py
3. Configuring database connection settings in your Fly.io deployment

## Monitoring and Logs

### Backend Logs
```
flyctl logs
```

### Frontend Logs
Access logs through the Vercel dashboard.

## Scaling Considerations

### Backend Scaling on Fly.io
```
fly scale memory 512   # Increase memory allocation
fly scale cpu 2        # Increase CPU allocation
fly scale count 2      # Run multiple instances
```

### Custom Domain Setup

#### For Vercel (Frontend):
1. Go to the Vercel dashboard
2. Select your project
3. Go to "Settings" > "Domains"
4. Add your domain and follow the DNS configuration instructions

#### For Fly.io (Backend):
```
fly certs create your-domain.com
```

## Common Issues and Solutions

### CORS Issues
If you experience CORS issues, check the CORS configuration in server.py:
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

For production, restrict origins to your specific frontend domain.

### API Connection Issues
If the frontend can't connect to the backend:
1. Check that the API_URL in config.ts is correct
2. Verify the backend is running with `fly status`
3. Test API endpoints directly with curl or a tool like Postman

### Deployment Failures
- For Fly.io issues, check `fly logs` for error details
- For Vercel issues, check the build logs in the Vercel dashboard

## Backup Procedures

Currently, there is no persistent data to back up. If you add a database:
1. Set up regular database backups
2. Document backup and restore procedures

## Security Considerations

1. Update the Flask secret key in server.py with a strong, unique value
2. Consider adding authentication for API endpoints
3. Implement rate limiting for public-facing endpoints
4. Regular security updates for dependencies:
   - Backend: `pip list --outdated`
   - Frontend: `npm outdated`

## Performance Optimization

1. Consider adding caching for frequently accessed data
2. Optimize API responses for size and speed
3. Implement lazy loading for frontend components
4. Use compression for API responses

## Testing Procedures

1. Run the test_deployment.py script to verify API functionality
2. Use the FRONTEND_TESTING_CHECKLIST.md for manual frontend testing

## Contact Information

For deployment platform support:
- Fly.io Documentation: https://fly.io/docs/
- Vercel Documentation: https://vercel.com/docs

Remember to update this guide as you make significant changes to your application architecture.
