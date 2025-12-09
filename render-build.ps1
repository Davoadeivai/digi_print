# مسیر پوشه فرانت‌اند
$frontendDir = "frontend"

# بررسی اینکه پوشه وجود دارد یا نه
if (-Not (Test-Path $frontendDir)) {
    Write-Host "Folder '$frontendDir' does not exist. Please check the frontend folder name."
    exit 1
}

# رفتن به پوشه فرانت‌اند
Set-Location $frontendDir

# نصب پکیج‌ها
Write-Host "Installing npm packages..."
npm install

# Build پروژه
Write-Host "Building the frontend..."
npm run build

Write-Host "Build finished. Output files are in 'dist' folder."
