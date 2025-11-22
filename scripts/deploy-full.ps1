# Fixing PowerShell script encoding and syntax
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"
$Host.UI.RawUI.ForegroundColor = "White"

function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  دیجیتال پرینت - استقرار خودکار  " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "  =============================  " -ForegroundColor DarkBlue
    Write-Host ""
}

function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

function Install-NodeJS {
    Write-Host "`n📥 در حال نصب Node.js..." -ForegroundColor Cyan
    try {
        winget install OpenJS.NodeJS.LTS
        if ($LASTEXITCODE -ne 0) { throw "Node.js installation failed" }
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        return $true
    } catch {
        Write-Host "❌ خطا در نصب Node.js: $_" -ForegroundColor Red
        return $false
    }
}

function Install-Git {
    Write-Host "`n📥 در حال نصب Git..." -ForegroundColor Cyan
    try {
        winget install --id Git.Git -e --source winget
        if ($LASTEXITCODE -ne 0) { throw "Git installation failed" }
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        return $true
    } catch {
        Write-Host "❌ خطا در نصب Git: $_" -ForegroundColor Red
        return $false
    }
}

function Install-VercelCLI {
    Write-Host "`n📥 در حال نصب Vercel CLI..." -ForegroundColor Cyan
    try {
        npm install -g vercel@latest
        if ($LASTEXITCODE -ne 0) { throw "Vercel CLI installation failed" }
        return $true
    } catch {
        Write-Host "❌ خطا در نصب Vercel CLI: $_" -ForegroundColor Red
        return $false
    }
}

function Initialize-Git {
    if (-not (Test-Path ".git")) {
        Write-Host "`n🔧 در حال راه‌اندازی Git..." -ForegroundColor Cyan
        try {
            git init
            $git_email = Read-Host "`n📧 لطفا ایمیل Git خود را وارد کنید"
            $git_name = Read-Host "👤 لطفا نام کاربری Git خود را وارد کنید"
            
            git config --local user.email $git_email
            git config --local user.name $git_name
            
            Write-Host "✅ Git با موفقیت پیکربندی شد" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "⚠️  خطا در پیکربندی Git: $_" -ForegroundColor Yellow
            return $false
        }
    }
    return $true
}

function Install-Dependencies {
    Write-Host "`n📦 در حال نصب وابستگی‌ها..." -ForegroundColor Cyan
    try {
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Dependency installation failed" }
        return $true
    } catch {
        Write-Host "❌ خطا در نصب وابستگی‌ها: $_" -ForegroundColor Red
        return $false
    }
}

function Build-Project {
    Write-Host "`n🔨 در حال ساخت پروژه..." -ForegroundColor Cyan
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Build failed" }
        return $true
    } catch {
        Write-Host "❌ خطا در ساخت پروژه: $_" -ForegroundColor Red
        return $false
    }
}

function Add-ToGit {
    Write-Host "`n💾 در حال ذخیره تغییرات در Git..." -ForegroundColor Cyan
    try {
        git add .
        
        $commit_message = Read-Host "`n📝 پیام کامیت را وارد کنید (پیش‌فرض: 'اولین کامیت')"
        if ([string]::IsNullOrWhiteSpace($commit_message)) {
            $commit_message = "اولین کامیت"
        }
        
        git commit -m $commit_message
        
        $add_remote = Read-Host "`n🌐 آیا می‌خواهید یک مخزن ریموت اضافه کنید؟ (y/n)"
        if ($add_remote -eq 'y') {
            $repo_url = Read-Host "آدرس مخزن Git را وارد کنید (مانند: https://github.com/username/repo.git)"
            if (-not [string]::IsNullOrWhiteSpace($repo_url)) {
                git remote add origin $repo_url
                Write-Host "✅ مخزن ریموت اضافه شد" -ForegroundColor Green
                
                Write-Host "`n🔄 در حال ارسال تغییرات به مخزن ریموت..." -ForegroundColor Cyan
                git push -u origin main 2>$null
                if ($LASTEXITCODE -ne 0) {
                    git push -u origin master 2>$null
                }
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "⚠️  خطا در ارسال به مخزن ریموت. مطمئن شوید آدرس مخزن صحیح است." -ForegroundColor Yellow
                }
            }
        }
        return $true
    } catch {
        Write-Host "⚠️  خطا در کار با Git: $_" -ForegroundColor Yellow
        return $false
    }
}

function Deploy-ToVercel {
    Write-Host "`n🚀 در حال دیپلوی روی Vercel..." -ForegroundColor Cyan
    try {
        vercel --prod
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n🎉 پروژه با موفقیت دیپلوی شد!" -ForegroundColor Green
        } else {
            throw "Vercel deployment failed"
        }
        return $true
    } catch {
        Write-Host "`n⚠️  خطا در دیپلوی خودکار" -ForegroundColor Yellow
        Write-Host "برای دیپلوی دستی، دستور زیر را اجرا کنید:" -ForegroundColor Yellow
        Write-Host "vercel --prod" -ForegroundColor Cyan
        return $false
    }
}

# تابع اصلی
function Main {
    # شروع اجرای اسکریپت
    Show-Header
    
    # بررسی و نصب پیش‌نیازها
    $success = $true
    
    if (-not (Check-Command "node")) {
        Write-Host "⚠️  Node.js یافت نشد" -ForegroundColor Yellow
        $success = $success -and (Install-NodeJS)
    }
    
    if (-not (Check-Command "git")) {
        Write-Host "⚠️  Git یافت نشد" -ForegroundColor Yellow
        $success = $success -and (Install-Git)
    }
    
    if (-not (Check-Command "vercel")) {
        Write-Host "⚠️  Vercel CLI یافت نشد" -ForegroundColor Yellow
        $success = $success -and (Install-VercelCLI)
    }
    
    if (-not $success) {
        Write-Host "❌ نصب پیش‌نیازها با خطا مواجه شد. لطفا خطاهای بالا را بررسی کنید." -ForegroundColor Red
        Pause-For-Key
        exit 1
    }
    
    # نمایش نسخه‌های نصب شده
    Write-Host "`n🔍 نسخه‌های نصب شده:" -ForegroundColor Cyan
    try { node -v } catch { Write-Host "Node.js: یافت نشد" -ForegroundColor Red }
    try { npm -v } catch { Write-Host "npm: یافت نشد" -ForegroundColor Red }
    try { git --version } catch { Write-Host "Git: یافت نشد" -ForegroundColor Red }
    try { vercel --version } catch { Write-Host "Vercel CLI: یافت نشد" -ForegroundColor Red }
    
    # اجرای مراحل دیپلوی
    $success = $success -and (Initialize-Git)
    $success = $success -and (Install-Dependencies)
    $success = $success -and (Build-Project)
    $success = $success -and (Add-ToGit)
    $success = $success -and (Deploy-ToVercel)
    
    # نمایش پیام نهایی
    if ($success) {
        Write-Host "`n🎉 عملیات با موفقیت به پایان رسید!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  برخی مراحل با خطا مواجه شدند. لطفا پیام‌های بالا را بررسی کنید." -ForegroundColor Yellow
    }
    
    Write-Host "`n📌 نکات مهم:" -ForegroundColor Yellow
    Write-Host "- فایل‌های حساس مانند .env را به .gitignore اضافه کنید"
    Write-Host "- برای به‌روزرسانی پروژه، تغییرات را به Git اضافه و Push کنید"
    Write-Host "- برای مدیریت دامنه و تنظیمات بیشتر به پنل Vercel مراجعه کنید"
    
    # انتظار برای زدن کلید
    Pause-For-Key
}

# تابع کمکی برای مکث
function Pause-For-Key {
    Write-Host "`nبرای خروج از برنامه کلیدی را فشار دهید..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
}

# تابع بررسی وجود دستور
function Check-Command($cmdname) {
    try {
        $null = Get-Command -Name $cmdname -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# شروع اجرای اسکریپت
try {
    Main
} catch {
    Write-Host "`n❌ خطای غیرمنتظره: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    Pause-For-Key
    exit 1
}
