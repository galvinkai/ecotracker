# EcoTracker Deployment Helper
# PowerShell version

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "       EcoTracker Deployment Helper" -ForegroundColor Cyan
Write-Host "==============================================`n" -ForegroundColor Cyan
Write-Host "This script will help you deploy EcoTracker to Fly.io and Vercel."

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

$prerequisites = @{
    "git" = "Git is required. Install from https://git-scm.com/downloads"
    "node" = "Node.js is required. Install from https://nodejs.org/"
    "flyctl" = "Fly CLI is required. Install with: iwr https://fly.io/install.ps1 -useb | iex"
    "vercel" = "Vercel CLI is required. Install with: npm install -g vercel"
}

$allPrerequisitesMet = $true

foreach ($cmd in $prerequisites.Keys) {
    if (Test-CommandExists $cmd) {
        Write-Host "✓ $cmd is installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $cmd is not installed" -ForegroundColor Red
        Write-Host "  $($prerequisites[$cmd])" -ForegroundColor Yellow
        $allPrerequisitesMet = $false
    }
}

if (-not $allPrerequisitesMet) {
    Write-Host "`nPlease install the missing prerequisites and run this script again.`n" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "`nAll prerequisites are met!" -ForegroundColor Green

# Main menu
function Show-Menu {
    Write-Host "`nEcoTracker Deployment Options:" -ForegroundColor Cyan
    Write-Host "1. Push code to GitHub repository"
    Write-Host "2. Deploy backend to Fly.io"
    Write-Host "3. Deploy frontend to Vercel"
    Write-Host "4. Update API URL in config.ts"
    Write-Host "5. Run deployment health check"
    Write-Host "6. Exit"
    Write-Host "`nEnter your choice (1-6): " -ForegroundColor Yellow -NoNewline
    
    $choice = Read-Host
    return $choice
}

# Push to GitHub
function Push-ToGitHub {
    Write-Host "`nPushing code to GitHub..." -ForegroundColor Cyan
    
    Write-Host "Please enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " -ForegroundColor Yellow -NoNewline
    $repoUrl = Read-Host
    
    if (-not $repoUrl) {
        Write-Host "Repository URL is required. Aborting." -ForegroundColor Red
        return
    }
    
    Write-Host "`nInitializing Git repository and pushing code..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for deployment"
    
    # Check if remote exists
    $remoteExists = git remote -v | Select-String -Pattern "origin" -Quiet
    if ($remoteExists) {
        git remote set-url origin $repoUrl
    } else {
        git remote add origin $repoUrl
    }
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Successfully pushed code to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Failed to push to GitHub. Please check your repository URL and try again." -ForegroundColor Red
    }
}

# Deploy to Fly.io
function Deploy-ToFlyIo {
    Write-Host "`nDeploying backend to Fly.io..." -ForegroundColor Cyan
    
    Write-Host "Logging in to Fly.io..." -ForegroundColor Yellow
    fly auth login
    
    Write-Host "`nCreating and deploying app on Fly.io..." -ForegroundColor Yellow
    fly launch --dockerfile Dockerfile --name ecotracker-api
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n✗ Failed to create app on Fly.io. Please check the errors above." -ForegroundColor Red
        return
    }
    
    Write-Host "`nDeploying the application..." -ForegroundColor Yellow
    fly deploy
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n✗ Failed to deploy to Fly.io. Please check the errors above." -ForegroundColor Red
        return
    }
    
    Write-Host "`n✓ Successfully deployed backend to Fly.io!" -ForegroundColor Green
    Write-Host "Your backend should be available at: https://ecotracker-api.fly.dev" -ForegroundColor Green
}

# Deploy to Vercel
function Deploy-ToVercel {
    Write-Host "`nDeploying frontend to Vercel..." -ForegroundColor Cyan
    
    Set-Location -Path "ecotracker"
    vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n✗ Failed to deploy to Vercel. Please check the errors above." -ForegroundColor Red
    } else {
        Write-Host "`n✓ Successfully deployed frontend to Vercel!" -ForegroundColor Green
    }
    
    Set-Location -Path ".."
}

# Update API URL
function Update-ApiUrl {
    Write-Host "`nUpdating API URL in config.ts..." -ForegroundColor Cyan
    
    Write-Host "Enter your backend URL (e.g., https://ecotracker-api.fly.dev): " -ForegroundColor Yellow -NoNewline
    $backendUrl = Read-Host
    
    if (-not $backendUrl) {
        Write-Host "Backend URL is required. Aborting." -ForegroundColor Red
        return
    }
    
    $configContent = @"
// This file needs to be updated with your deployed backend URL after deployment
const API_CONFIG = {
  // For local development: 'http://localhost:8080'
  // For Fly.io deployment: '${backendUrl}'
  API_URL: process.env.NODE_ENV === 'production' 
    ? '${backendUrl}' 
    : 'http://localhost:8080'
};

export default API_CONFIG;
"@
    
    Set-Content -Path "ecotracker\src\config.ts" -Value $configContent
    
    Write-Host "`n✓ Successfully updated API URL in config.ts!" -ForegroundColor Green
    
    # Ask if user wants to commit and push changes
    Write-Host "Do you want to commit and push these changes to GitHub? (y/n): " -ForegroundColor Yellow -NoNewline
    $commitChanges = Read-Host
    
    if ($commitChanges -eq "y") {
        git add ecotracker/src/config.ts
        git commit -m "Update API URL for production"
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✓ Successfully pushed changes to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "`n✗ Failed to push changes to GitHub." -ForegroundColor Red
        }
    }
}

# Run health check
function Run-HealthCheck {
    Write-Host "`nRunning deployment health check..." -ForegroundColor Cyan
    
    Write-Host "Enter your backend URL (e.g., https://ecotracker-api.fly.dev): " -ForegroundColor Yellow -NoNewline
    $backendUrl = Read-Host
    
    if (-not $backendUrl) {
        Write-Host "Backend URL is required. Aborting." -ForegroundColor Red
        return
    }
    
    python deployment_health_check.py $backendUrl
}

# Main program loop
do {
    $choice = Show-Menu
    
    switch ($choice) {
        "1" { Push-ToGitHub }
        "2" { Deploy-ToFlyIo }
        "3" { Deploy-ToVercel }
        "4" { Update-ApiUrl }
        "5" { Run-HealthCheck }
        "6" { break }
        default { Write-Host "`nInvalid choice. Please try again." -ForegroundColor Red }
    }
} while ($choice -ne "6")

Write-Host "`nThank you for using EcoTracker Deployment Helper!" -ForegroundColor Cyan
Write-Host "For more information, see DEPLOYMENT_TOOLS_GUIDE.md`n" -ForegroundColor Cyan
