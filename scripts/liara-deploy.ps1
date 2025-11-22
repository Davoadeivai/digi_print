# Liara Deployment Script
Write-Host "Starting Liara deployment..." -ForegroundColor Cyan

# Check if Liara CLI is installed
if (-not (Get-Command liara -ErrorAction SilentlyContinue)) {
    Write-Host "Liara CLI is not installed. Installing..." -ForegroundColor Yellow
    npm install -g @liara/cli
    if (-not $?) {
        Write-Host "Failed to install Liara CLI" -ForegroundColor Red
        exit 1
    }
}

# Login to Liara (if not already logged in)
try {
    liara whoami 2>&1 | Out-Null
    Write-Host "Already logged in to Liara" -ForegroundColor Green
} catch {
    Write-Host "Please login to your Liara account..." -ForegroundColor Yellow
    liara login
    if (-not $?) {
        Write-Host "Liara login failed" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install
if (-not $?) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "Building the project..." -ForegroundColor Cyan
npm run build
if (-not $?) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to Liara
Write-Host "Deploying to Liara..." -ForegroundColor Cyan
liara deploy --platform node
if (-not $?) {
    Write-Host "Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your application should be live at: https://daidi-print.liara.run" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: It may take a few minutes for the deployment to complete." -ForegroundColor Yellow
Write-Host ""

# Open the deployed application in browser
$openBrowser = Read-Host "Do you want to open the deployed application in your browser? (y/n)"
if ($openBrowser -eq 'y') {
    Start-Process "https://daidi-print.liara.run"
}
