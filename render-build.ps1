# render-build.ps1
Write-Host "شروع بیلد frontend..."

# نصب و build در مسیر frontend
npm install --prefix frontend
npm run build --prefix frontend

Write-Host "بیلد با موفقیت انجام شد!"
