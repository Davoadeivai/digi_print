# Simple Deployment Script for Digital Print Project
# This script will set up and deploy your project

# Set execution policy for the current process
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    return (Get-Command $command -ErrorAction SilentlyContinue) -ne $null
}

# Function to install Node.js
function Install-NodeJS {
    Write-Host "Installing Node.js..." -ForegroundColor Cyan
    winget install OpenJS.NodeJS.LTS
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Node.js" -ForegroundColor Red
        return $false
    }
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    return $true
}

# Function to install Git
function Install-Git {
    Write-Host "Installing Git..." -ForegroundColor Cyan
    winget install --id Git.Git -e --source winget
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Git" -ForegroundColor Red
        return $false
    }
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    return $true
}

# Function to install Vercel CLI
function Install-VercelCLI {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel@latest
    return $LASTEXITCODE -eq 0
}

# Function to initialize Git repository
function Initialize-Git {
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing Git repository..." -ForegroundColor Cyan
        git init
        
        $git_email = Read-Host "Enter your Git email"
        $git_name = Read-Host "Enter your Git username"
        
        git config --local user.email $git_email
        git config --local user.name $git_name
        
        return $true
    }
    return $true
}

# Main deployment process
try {
    # Check and install Node.js
    if (-not (Test-CommandExists "node")) {
        Write-Host "Node.js not found. Installing..." -ForegroundColor Yellow
        if (-not (Install-NodeJS)) {
            throw "Failed to install Node.js"
        }
    }
    
    # Check and install Git
    if (-not (Test-CommandExists "git")) {
        Write-Host "Git not found. Installing..." -ForegroundColor Yellow
        if (-not (Install-Git)) {
            throw "Failed to install Git"
        }
    }
    
    # Check and install Vercel CLI
    if (-not (Test-CommandExists "vercel")) {
        Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
        if (-not (Install-VercelCLI)) {
            throw "Failed to install Vercel CLI"
        }
    }
    
    # Show installed versions
    Write-Host "`nInstalled Versions:" -ForegroundColor Green
    Write-Host "Node.js: $(node -v)"
    Write-Host "npm: $(npm -v)"
    Write-Host "Git: $(git --version)"
    Write-Host "Vercel CLI: $(vercel --version)"
    
    # Initialize Git repository
    if (-not (Initialize-Git)) {
        throw "Failed to initialize Git repository"
    }
    
    # Install dependencies
    Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install dependencies"
    }
    
    # Build the project
    Write-Host "`nBuilding the project..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    
    # Add files to Git
    Write-Host "`nAdding files to Git..." -ForegroundColor Cyan
    git add .
    
    $commit_message = Read-Host "Enter commit message (default: 'Initial commit')"
    if ([string]::IsNullOrWhiteSpace($commit_message)) {
        $commit_message = "Initial commit"
    }
    
    git commit -m $commit_message
    
    $add_remote = Read-Host "Do you want to add a remote Git repository? (y/n)"
    if ($add_remote -eq 'y') {
        $repo_url = Read-Host "Enter Git repository URL (e.g., https://github.com/username/repo.git)"
        if (-not [string]::IsNullOrWhiteSpace($repo_url)) {
            git remote add origin $repo_url
            Write-Host "Remote repository added" -ForegroundColor Green
            
            Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
            git push -u origin main 2>$null
            if ($LASTEXITCODE -ne 0) {
                git push -u origin master 2>$null
            }
        }
    }
    
    # Deploy to Vercel
    Write-Host "`nDeploying to Vercel..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "`nError: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
