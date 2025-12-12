Write-Host "عالی! package.json پیدا شد" -ForegroundColor Green

if (Test-Path "vite.config.js") {
  (Get-Content vite.config.js -Raw) -replace '(defineConfig\()\s*{', '$1 {
  base: ''/'',' | Set-Content vite.config.js
  Write-Host "base = '/' اضافه شد" -ForegroundColor Green
}

npm install
npm run build
Write-Host "Build تمام شد!" -ForegroundColor Green

Start-Process "cmd" "/c npm run preview" -WindowStyle Hidden
Start-Sleep -Seconds 8
Start-Process "http://localhost:4173"
Write-Host "مرورگر باز شد!" -ForegroundColor Cyan
Write-Host "F12 بزن → Console رو نگاه کن → اگر هیچ خطای قرمز نبود، کار تمومه!" -ForegroundColor Green
Write-Host "حالا فقط برو Render.com و دکمه Deploy رو بزن" -ForegroundColor Cyan
pause
